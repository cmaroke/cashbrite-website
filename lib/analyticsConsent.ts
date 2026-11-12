export const analyticsChoiceKey = "cashbrite:analytics-choice:v1";
export const analyticsChoiceEvent = "cashbrite:analytics-choice-changed";
export const analyticsSettingsEvent = "cashbrite:analytics-settings";
export const gaMeasurementId = "G-XSGSX4EXY6";
const lifetime = 180 * 24 * 60 * 60 * 1000;
let memoryChoice: string | null = null;

export function parseAnalyticsChoice(raw: string | null, now = Date.now()): "granted" | "denied" | null {
  try {
    const value = JSON.parse(raw ?? "null");
    return value?.version === 1 && ["granted", "denied"].includes(value.choice) && Number.isFinite(value.at) && value.at <= now && now - value.at < lifetime ? value.choice : null;
  } catch { return null; }
}

export function getAnalyticsChoice() {
  if (typeof window === "undefined") return null;
  try { return parseAnalyticsChoice(localStorage.getItem(analyticsChoiceKey)); }
  catch { return parseAnalyticsChoice(memoryChoice); }
}

export function disableOptionalAnalytics() {
  (window as unknown as Record<string, unknown>)[`ga-disable-${gaMeasurementId}`] = true;
  const tracker = window as unknown as { va?: (...args: unknown[]) => void };
  tracker.va?.("beforeSend", () => null);
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (!/^_ga(?:_|$)/.test(name)) continue;
    document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
    const parts = location.hostname.split(".");
    while (parts.length >= 2) {
      document.cookie = `${name}=; Max-Age=0; Path=/; Domain=.${parts.join(".")}; SameSite=Lax`;
      parts.shift();
    }
  }
}

export function saveAnalyticsChoice(choice: "granted" | "denied") {
  if (choice === "denied") disableOptionalAnalytics();
  memoryChoice = JSON.stringify({ version: 1, choice, at: Date.now() });
  try { localStorage.setItem(analyticsChoiceKey, memoryChoice); } catch { /* Denial remains the safe default after reload. */ }
  window.dispatchEvent(new Event(analyticsChoiceEvent));
}

export function subscribeAnalyticsChoice(notify: () => void) {
  const update = () => { if (getAnalyticsChoice() !== "granted") disableOptionalAnalytics(); notify(); };
  window.addEventListener("storage", update);
  window.addEventListener("focus", update);
  window.addEventListener(analyticsChoiceEvent, update);
  return () => {
    window.removeEventListener("storage", update);
    window.removeEventListener("focus", update);
    window.removeEventListener(analyticsChoiceEvent, update);
  };
}
