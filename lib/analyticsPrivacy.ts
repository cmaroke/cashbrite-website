export function isSensitivePath(path: string) {
  return ["/quiz", "/results", "/report", "/downloads", "/checkout", "/money-ready-plan", "/premium-plan-preview", "/brand-preview", "/api"].some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}
export function sanitiseAnalyticsUrl(value: string) {
  try {
    const url = new URL(value);
    return isSensitivePath(url.pathname) ? null : `${url.origin}${url.pathname}`;
  } catch { return null; }
}
