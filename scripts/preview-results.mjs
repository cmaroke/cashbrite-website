import fs from "node:fs";
import path from "node:path";
import http from "node:http";

// Local-only visual harness. Never loads a database, application APIs, analytics or checkout JS.
// First run: node scripts/check-results-experience.mjs --write-fixtures && npm run build
const port = Number(process.env.RESULTS_PREVIEW_PORT ?? 3018);
const shell = fs.readFileSync(".next/server/app/index.html", "utf8").replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "");
const fixtures = fs.readdirSync("tmp/results-phase3c3").filter((name) => name.endsWith(".html"));
const types = { ".css": "text/css", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon" };
http.createServer((request, response) => {
  const url = new URL(request.url, `http://127.0.0.1:${port}`);
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("X-Robots-Tag", "noindex, nofollow");
  if (url.pathname === "/") {
    const selected = `${url.searchParams.get("case") ?? "demo"}.html`;
    if (!fixtures.includes(selected)) { response.writeHead(404).end(); return; }
    const fixture = fs.readFileSync(path.join("tmp/results-phase3c3", selected), "utf8");
    const start = shell.indexOf("<main>");
    const end = shell.indexOf("</main>", start);
    if (start < 0 || end < 0) { response.writeHead(500).end("Preview shell unavailable"); return; }
    response.setHeader("Content-Type", "text/html; charset=utf-8");
    response.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'none'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'none'; form-action 'none'; base-uri 'none'");
    response.end(shell.slice(0, start) + `<main><aside class="bg-mist px-5 py-2 text-center text-xs text-ink">Local design preview. Synthetic results; checkout is disabled.</aside>${fixture}</main>` + shell.slice(end + 7));
    return;
  }
  let file;
  if (url.pathname.startsWith("/_next/static/")) file = path.resolve(".next/static", url.pathname.slice(14));
  else if (url.pathname.startsWith("/brand/")) file = path.resolve("public/brand", url.pathname.slice(7));
  const roots = [path.resolve(".next/static") + path.sep, path.resolve("public/brand") + path.sep];
  if (!file || !roots.some((root) => file.startsWith(root)) || !types[path.extname(file)] || !fs.existsSync(file)) { response.writeHead(404).end(); return; }
  response.setHeader("Content-Type", types[path.extname(file)]);
  fs.createReadStream(file).pipe(response);
}).listen(port, "127.0.0.1", () => console.log(`Synthetic results preview: http://localhost:${port}/?case=demo (no application APIs)`));
