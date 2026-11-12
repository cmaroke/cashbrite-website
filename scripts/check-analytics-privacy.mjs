import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { serverLoader } from './server-runtime.mjs';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE ?? '/Users/cmaroke/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const origin = process.env.CASHBRITE_QA_URL ?? 'http://127.0.0.1:3022';
assert(['localhost', '127.0.0.1'].includes(new URL(origin).hostname));
const { parseAnalyticsChoice } = serverLoader(new Map(), {})('lib/analyticsConsent.ts');
assert.equal(parseAnalyticsChoice(null), null);
assert.equal(parseAnalyticsChoice('{'), null);
assert.equal(parseAnalyticsChoice(JSON.stringify({version:1,choice:'granted',at:Date.now()-181*86400000})), null);
assert.equal(parseAnalyticsChoice(JSON.stringify({version:2,choice:'granted',at:Date.now()})), null);
assert.equal(parseAnalyticsChoice(JSON.stringify({version:1,choice:'denied',at:Date.now()})), 'denied');
const browser = await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const checks = [];
const optional = url => /googletagmanager\.com|google-analytics\.com|\/_vercel\/insights\//.test(url);
async function context() {
  const context = await browser.newContext({viewport:{width:390,height:844}});
  const requests = [];
  context.on('request', request => { if(optional(request.url())) requests.push(request.url()); });
  await context.route('**/*', route => {
    const url=route.request().url();
    if(optional(url)) return route.fulfill({status:200,contentType:'application/javascript',body:'/* synthetic analytics provider; no network */'});
    return url.startsWith(origin+'/')?route.continue():route.abort();
  });
  return {context,requests};
}
try {
  const {context: c,requests}=await context();
  const page=await c.newPage();
  await page.goto(origin,{waitUntil:'networkidle'});
  assert.equal(requests.length,0);
  assert.equal(await page.locator('script[src*="googletagmanager"],script[src*="insights/script"]').count(),0);
  await page.getByRole('button',{name:'Reject analytics',exact:true}).click();
  await page.reload({waitUntil:'networkidle'}); assert.equal(requests.length,0);
  assert.equal(await page.locator('aside[aria-label="Analytics preferences"]').count(),0);
  await page.getByRole('button',{name:'Analytics preferences',exact:true}).click();
  await page.getByRole('button',{name:'Allow analytics',exact:true}).click();
  await page.waitForFunction(()=>!!window.gtag&&!!window.vaq);
  await page.waitForFunction(()=>document.querySelector('script[src*="googletagmanager"]')&&document.querySelector('script[src*="insights/script"]'));
  assert(requests.some(url=>url.includes('googletagmanager'))); assert(requests.some(url=>url.includes('/_vercel/insights/')));
  const clean=await page.evaluate(()=>{
    const beforeSend=[...(window.vaq??[])].reverse().find(entry=>entry[0]==='beforeSend')?.[1];
    return beforeSend?.({type:'pageview',url:location.origin+'/?email=synthetic#private'})?.url;
  });
  assert.equal(clean,origin+'/');
  checks.push('Unknown/reject/reload: no provider scripts or requests; explicit acceptance loads both; outgoing URL query/hash removed');
  await page.locator('.a-hero a[href="/quiz"]').click();
  await page.waitForURL('**/quiz');
  await page.waitForSelector('script[src*="insights/script"]',{state:'attached'});
  assert.equal(await page.locator('script[src*="googletagmanager"]').count(),0);
  assert.equal(await page.getByRole('heading',{name:'Discover your Money Confidence Score'}).count(),1);
  const cleanedFunnel=await page.evaluate(()=>{
    const beforeSend=[...(window.vaq??[])].reverse().find(entry=>entry[0]==='beforeSend')?.[1];
    return {event:beforeSend?.({type:'event',url:location.href+'?token=synthetic#private'}),pageview:beforeSend?.({type:'pageview',url:location.href})};
  });
  assert.deepEqual(cleanedFunnel.event,{type:'event',url:origin+'/quiz'});
  assert.equal(cleanedFunnel.pageview,null);
  checks.push('Accepted quiz: Vercel funnel only, no GA or pageviews; event URLs have no query/fragment');
  for(const route of ['/money-ready-plan/success?session_id=synthetic','/report/access']) {
    const before=requests.length;
    await page.goto(origin+route,{waitUntil:'networkidle'});
    assert.equal(requests.length,before,'Access exchange and historical paid routes do not load analytics');
  }
  await page.goto(origin,{waitUntil:'networkidle'});
  await page.waitForFunction(()=>!!window.gtag);
  await page.evaluate(()=>{document.cookie='_ga=synthetic; Path=/';});
  await page.getByRole('button',{name:'Analytics preferences',exact:true}).click();
  const beforeWithdraw=requests.length;
  await Promise.all([page.waitForEvent('framenavigated'),page.getByRole('button',{name:'Reject analytics',exact:true}).click()]);
  await page.waitForLoadState('networkidle');
  assert.equal(requests.length,beforeWithdraw);
  assert.equal(await page.locator('script[src*="googletagmanager"],script[src*="insights/script"]').count(),0);
  assert(!(await page.evaluate(()=>document.cookie)).includes('_ga='));
  checks.push('Withdrawal disables future loading, clears accessible Google cookies and reloads without provider scripts');
  await page.getByRole('button',{name:'Analytics preferences',exact:true}).click();
  await page.getByRole('button',{name:'Allow analytics',exact:true}).click();
  await page.waitForFunction(()=>!!window.gtag);
  const other=await c.newPage(); await other.goto(origin,{waitUntil:'networkidle'});
  await other.getByRole('button',{name:'Analytics preferences',exact:true}).click();
  await Promise.all([page.waitForEvent('framenavigated'),other.waitForEvent('framenavigated'),other.getByRole('button',{name:'Reject analytics',exact:true}).click()]);
  await Promise.all([page.waitForLoadState('networkidle'),other.waitForLoadState('networkidle')]);
  assert.equal(await page.locator('script[src*="googletagmanager"]').count(),0);
  checks.push('Cross-tab withdrawal stops loaded trackers in both tabs');
  await c.close();
  const {context: denied,requests: blocked}=await context();
  await denied.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new Error('synthetic blocked storage');}});});
  const unavailable=await denied.newPage(); await unavailable.goto(origin,{waitUntil:'networkidle'});
  assert.equal(blocked.length,0); await unavailable.getByRole('button',{name:'Reject analytics',exact:true}).click();
  assert.equal(blocked.length,0); await denied.close();
  checks.push('Unavailable storage defaults to no analytics');
  console.log(JSON.stringify({passed:checks,externalProviderCalls:0}));
} finally {await browser.close();}
