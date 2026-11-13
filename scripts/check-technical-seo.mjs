import assert from 'node:assert/strict';

const origin = process.env.CASHBRITE_QA_URL ?? 'http://127.0.0.1:3031';
assert(['127.0.0.1', 'localhost'].includes(new URL(origin).hostname), 'Local QA only');
const host = 'https://www.cashbrite.co.uk';
const publicPaths = ['/', '/quiz', '/calculators', '/student-budget-calculator', '/resources', '/students', '/schools', '/contact', '/privacy-policy', '/terms-and-conditions', '/financial-disclaimer'];
const legalTitles = {
  '/privacy-policy': 'Privacy Policy | Cashbrite',
  '/terms-and-conditions': 'Terms &amp; Conditions | Cashbrite',
  '/financial-disclaimer': 'Financial Education Disclaimer | Cashbrite',
};
const results = [];
for (const path of publicPaths) {
  const canonical = host + (path === "/" ? "" : path);
  const response = await fetch(origin + path);
  assert.equal(response.status, 200, path);
  assert(!/noindex|nofollow/i.test(response.headers.get('x-robots-tag') ?? ''), path);
  const html = await response.text();
  assert(html.includes(`<link rel="canonical" href="${canonical}"`), `${path}: canonical`);
  assert(html.includes(`<meta property="og:url" content="${canonical}"`), `${path}: social URL`);
  assert(!/<meta name="robots" content="[^"]*noindex/.test(html), `${path}: meta robots`);
  assert(!html.includes('https://cashbrite.co.uk'), `${path}: conflicting SEO host`);
  assert(html.includes('name="google-site-verification"'), `${path}: verification retained`);
  if (legalTitles[path]) assert(html.includes(`<title>${legalTitles[path]}</title>`), `${path}: title`);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map(match => JSON.parse(match[1]));
  assert(schemas.length >= 2, `${path}: shared schemas`);
  for (const schema of schemas) assert.equal(schema['@context'], 'https://schema.org');
  results.push({ path, status: response.status, canonical, schemas: schemas.length });
}
for (const path of ['/results', '/report', '/report/access', '/money-ready-plan/success', '/premium-plan-preview']) {
  const response = await fetch(origin + path);
  assert.match(response.headers.get('x-robots-tag') ?? '', /noindex/);
  assert.match(response.headers.get('cache-control') ?? '', /no-store/);
  const html = await response.text();
  assert.match(html, /<meta name="robots" content="[^"]*noindex/);
  if (path === '/report') assert(html.includes('Your report link is needed'));
}
for (const path of ['/api/reports/pdf', '/api/reports/excel', '/downloads/cashbrite-budget-tracker.xlsx']) {
  const response = await fetch(origin + path);
  assert.equal(response.status, 403, path);
  assert.match(response.headers.get('x-robots-tag') ?? '', /noindex/);
  assert.match(response.headers.get('cache-control') ?? '', /no-store/);
}
const quiz = await fetch(origin + '/quiz');
assert.match(quiz.headers.get('cache-control') ?? '', /no-store/);
assert.equal(quiz.headers.get('referrer-policy'), 'no-referrer');
const checkout = await fetch(origin + '/api/stripe/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
assert.equal(checkout.status, 410);
const sitemap = await fetch(origin + '/sitemap.xml');
assert.equal(sitemap.status, 200);
assert.match(sitemap.headers.get('content-type'), /xml/);
const xml = await sitemap.text();
assert.match(xml, /<urlset xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9">/);
assert.deepEqual([...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]).sort(), publicPaths.map(path => host + path).sort());
assert(!xml.includes('<lastmod>'));
const robots = await fetch(origin + '/robots.txt');
assert.equal(robots.status, 200);
const rules = await robots.text();
assert(rules.includes(`Sitemap: ${host}/sitemap.xml`));
assert(rules.includes('Allow: /') && !rules.includes('Disallow: /quiz'));
for (const path of ['/results', '/report', '/downloads/', '/api/', '/premium-plan-preview']) assert(rules.includes(`Disallow: ${path}`));
const calculators = await (await fetch(origin + '/calculators')).text();
assert(calculators.includes('href="/student-budget-calculator"'));
console.log(JSON.stringify({ publicPages: results, privateRoutes: 'noindex retained', unauthorisedDownloads: 403, newCheckout: 410, quiz: '200, no noindex, no-store and no-referrer retained', sitemap: '11 exact public www URLs; no lastmod', robots: 'public quiz allowed; private exclusions and www sitemap retained' }, null, 2));
