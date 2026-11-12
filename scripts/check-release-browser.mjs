// Local production-build QA only. External traffic and assessment writes are intercepted.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { serverLoader } from './server-runtime.mjs';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE ?? '/Users/cmaroke/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const origin = process.env.CASHBRITE_QA_URL ?? 'http://127.0.0.1:3022';
assert(['127.0.0.1', 'localhost'].includes(new URL(origin).hostname), 'This suite must only target loopback');
const output = 'output/release-qa';
fs.mkdirSync(output, { recursive: true });
const load = serverLoader(new Map(), {});
const { quizQuestions } = load('data/quizQuestions.ts');
const { validateAssessmentRequest } = load('lib/assessmentValidation.ts');
const { scoreQuiz } = load('lib/quizScoring.ts');
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const results = [];
async function localPage(viewport, touch = false) {
  const page = await browser.newPage({ viewport, hasTouch: touch, isMobile: touch });
  await page.addInitScript(() => {
    if (!localStorage.getItem('cashbrite:analytics-choice:v1')) localStorage.setItem('cashbrite:analytics-choice:v1', JSON.stringify({ version: 1, choice: 'denied', at: Date.now() }));
  });
  await page.route('**/*', route => route.request().url().startsWith(origin + '/') ? route.continue() : route.abort());
  await page.route('**/_vercel/insights/**', route => route.fulfill({ status: 200, contentType: 'application/javascript', body: '/* analytics disabled in local QA */' }));
  return page;
}
async function ready(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (let y = 0; y < document.body.scrollHeight; y += 650) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise(resolve => setTimeout(resolve, 30));
    }
    await Promise.all([...document.images].map(image => image.decode()));
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
}
async function register(page) {
  await page.getByLabel('First name', { exact: true }).fill('Alex');
  await page.getByLabel('Last name', { exact: true }).fill('Synthetic');
  await page.getByLabel('Age', { exact: true }).fill('18');
  await page.getByLabel('Email address', { exact: true }).fill('alex.synthetic@cashbrite.example');
  await page.getByLabel('Which best describes your current stage?').selectOption('College or Sixth Form');
  await page.getByRole('checkbox').first().check();
  await page.getByRole('button', { name: 'Start the 5-minute assessment' }).click();
  await page.getByRole('heading', { name: 'Money Readiness Assessment', exact: true }).waitFor();
}
try {
  for (const width of [1440, 768, 390]) {
    const page = await localPage({ width, height: width === 390 ? 844 : 900 }, width === 390);
    const errors = [], brokenAssets = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.url().startsWith(origin) && response.status() >= 400) brokenAssets.push(response.url()); });
    await page.goto(origin, { waitUntil: 'networkidle' }); await ready(page);
    assert.equal(await page.locator('h1').textContent(), 'How money confident are you?');
    assert.equal(await page.locator('[data-money-remaining]').textContent(), '£150');
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('.founder-values>div').count(), 4);
    assert.equal(await page.locator('.prototype-note').count(), 0);
    const shape = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth, fonts: [...document.fonts].filter(font => font.status === 'loaded').length,
      ctaBottom: document.querySelector('.a-hero .btn').getBoundingClientRect().bottom, h1Top: document.querySelector('h1').getBoundingClientRect().top }));
    assert(!shape.overflow); assert(shape.fonts >= 3); assert(shape.ctaBottom < (width === 390 ? 844 : 900));
    const links = await page.locator('main a[href]').evaluateAll(elements => elements.map(element => element.getAttribute('href')));
    assert(links.every(href => href.startsWith('/')), 'No prototype localhost URLs');
    await page.screenshot({ path: `${output}/homepage-${width}-full.png`, fullPage: true });
    await page.screenshot({ path: `${output}/homepage-${width}-viewport.png`, fullPage: false });
    for (const key of ['rent', 'food', 'life']) {
      const button = page.locator(`[data-expense=${key}]`);
      if (width === 390) await button.tap(); else await button.click();
      assert.equal(await button.getAttribute('aria-expanded'), 'true');
      await button.focus(); await page.keyboard.press('Escape');
      assert.equal(await button.getAttribute('aria-expanded'), 'false');
      await button.blur(); await button.focus();
      assert.equal(await button.getAttribute('aria-expanded'), 'true');
      assert.notEqual(await button.evaluate(element => getComputedStyle(element).outlineWidth), '0px');
      await page.keyboard.press('Escape');
    }
    const surprise = page.locator('.surprise input');
    for (let repeat = 0; repeat < 5; repeat++) {
      await surprise.check(); assert.equal(await page.locator('[data-money-remaining]').textContent(), '£90');
      await surprise.uncheck(); assert.equal(await page.locator('[data-money-remaining]').textContent(), '£150');
    }
    await surprise.focus(); await page.keyboard.press('Space');
    assert.equal(await page.locator('[data-money-remaining]').textContent(), '£90');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert.equal(await page.locator('.expense').first().evaluate(element => getComputedStyle(element).transitionDuration), '0s');
    assert.deepEqual(errors, []); assert.deepEqual(brokenAssets, []);
    results.push({ page: 'home', width, ...shape, errors, brokenAssets, interactions: 'passed' });
    for (const route of ['/quiz', '/calculators', '/student-budget-calculator', '/resources', '/students', '/schools', '/contact', '/privacy-policy', '/terms-and-conditions', '/financial-disclaimer', '/results', '/money-ready-plan/success', '/checkout/money-ready-plan']) {
      const response = await page.goto(origin + route, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      assert.equal(response.status(), 200, route);
      assert(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)), route + ' overflows');
      assert.equal(await page.locator('h1').count(), 1, route + ' H1 count');
      results.push({ page: route, width, status: response.status(), overflow: false });
    }
    if (width === 390) {
      await page.goto(origin + '/quiz');
      await page.locator('.mobile-menu summary').click();
      assert(await page.locator('.mobile-menu').evaluate(element => element.open));
      await page.locator('.mobile-menu a[href="/calculators"]').click();
      await page.waitForURL('**/calculators');
      assert(!(await page.locator('.mobile-menu').evaluate(element => element.open)));
    }
    await page.close();
  }
  const page = await localPage({ width: 390, height: 844 }, true);
  let submissions = 0, payload;
  const submissionKeys = [];
  await page.route('**/api/assessments', async route => {
    submissions++; payload = route.request().postDataJSON();
    submissionKeys.push(route.request().headers()['idempotency-key']);
    assert.match(submissionKeys.at(-1), /^[a-f0-9-]{36}$/);
    assert.equal(validateAssessmentRequest(payload), null);
    await new Promise(resolve => setTimeout(resolve, 100));
    await route.fulfill({ status: submissions === 1 ? 500 : 200, contentType: 'application/json', body: JSON.stringify(submissions === 1 ? { error: 'Synthetic save failure - no record created.' } : { id: '00000000-0000-5000-8000-000000000001' }) });
  });
  await page.goto(origin + '/quiz', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Start the 5-minute assessment' }).click();
  assert.equal(await page.locator('fieldset[data-question-id]').count(), 0);
  await register(page);
  const question = page.locator('fieldset[data-question-id]');
  assert.equal(await question.getAttribute('data-question-id'), quizQuestions[0].id);
  assert.equal(await page.getByRole('button', { name: 'Next →', exact: true }).count(), 0);
  await page.getByRole('switch', { name: 'Auto-next' }).uncheck();
  await page.getByRole('button', { name: 'Next →', exact: true }).click();
  assert.equal(await question.getAttribute('data-question-id'), quizQuestions[0].id);
  await page.getByRole('switch', { name: 'Auto-next' }).check();
  for (let index = 0; index < quizQuestions.length; index++) {
    const current = quizQuestions[index];
    await page.waitForFunction(id => document.querySelector('fieldset')?.getAttribute('data-question-id') === id, current.id);
    assert.equal(await page.locator('input[type=radio]').count(), 4);
    const best = current.answers.find(answer => answer.points === 3);
    await page.locator(`input[value="${best.id}"]`).check();
    if (index === 0) {
      await page.waitForFunction(id => document.querySelector('fieldset')?.getAttribute('data-question-id') === id, quizQuestions[1].id);
      await page.getByRole('button', { name: '← Back', exact: true }).click();
      await page.waitForFunction(id => document.querySelector('fieldset')?.getAttribute('data-question-id') === id, current.id);
      assert(await page.locator(`input[value="${best.id}"]`).isChecked());
      await page.waitForTimeout(500);
      assert.equal(await question.getAttribute('data-question-id'), current.id);
      const weakest = current.answers.find(answer => answer.points === 0);
      await page.locator(`input[value="${weakest.id}"]`).check();
    }
  }
  await page.getByRole('heading', { name: 'Review your answers', exact: true }).waitFor();
  assert.equal(submissions, 0);
  assert.equal(await page.locator('[data-review-question]').count(), 30);
  await page.getByRole('button', { name: 'Submit my assessment', exact: true }).click();
  assert.equal(submissions, 0);
  await page.getByRole('checkbox', { name: 'I have reviewed my answers and am ready to submit my assessment.' }).check();
  await page.getByRole('button', { name: 'Submit my assessment', exact: true }).click();
  await page.getByText('Synthetic save failure - no record created.', { exact: true }).waitFor();
  assert.equal(submissions, 1); assert.equal(Object.keys(payload.selectedAnswers).length, 30);
  const draft = await page.evaluate(() => JSON.parse(sessionStorage.getItem('cashbrite:assessment-draft:v1')));
  assert.equal(Object.keys(draft.answers).length, 30);
  assert(!JSON.stringify(draft).includes('alex.synthetic')); assert(!JSON.stringify(draft).includes('Synthetic'));
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByText('Your saved answers are ready in this tab.', { exact: false }).waitFor();
  assert.equal(await page.getByLabel('Email address', { exact: true }).inputValue(), '');
  await register(page);
  await page.getByRole('heading', { name: 'Review your answers', exact: true }).waitFor();
  await page.getByRole('checkbox', { name: 'I have reviewed my answers and am ready to submit my assessment.' }).check();
  await page.getByRole('button', { name: 'Submit my assessment', exact: true }).evaluate(button => { button.form.requestSubmit(); button.form.requestSubmit(); });
  await page.waitForURL('**/results?id=00000000-0000-5000-8000-000000000001');
  assert.equal(submissions, 2, 'One request per explicit attempt, including same-tick duplicate events');
  assert.equal(submissionKeys[0], submissionKeys[1], 'Retry key survives refresh');
  assert.equal(await page.evaluate(() => sessionStorage.getItem('cashbrite:assessment-draft:v1')), null);
  assert.equal(await page.evaluate(() => sessionStorage.getItem('cashbrite:assessment-submission:v1')), null);
  results.push({ page: 'quiz', canonicalQuestions: 30, categories: 10, submissionCalls: submissions, scoreFromActualSubmittedAnswers: scoreQuiz(payload.selectedAnswers).readinessScore, review: 'explicit', draft: '30 IDs recovered; no registration/consent persisted', externalWrites: 0 });
  await page.goto(origin + '/student-budget-calculator', { waitUntil: 'networkidle' });
  await page.locator('input[name="partTimeJob"]').fill('1200');
  await page.locator('input[name="rent"]').fill('650');
  await page.locator('input[name="food"]').fill('220');
  await page.locator('input[name="social"]').fill('180');
  await page.locator('input[name="monthlySavings"]').fill('120');
  assert.equal(await page.locator('aside dl>div').filter({ hasText: 'Remaining money' }).locator('dd').textContent(), '£30');
  await page.getByRole('heading', { name: 'Strong budget', exact: true }).waitFor();
  results.push({ page: 'calculator', income: 1200, essential: 870, flexible: 180, savings: 120, remaining: 30, health: 'Strong budget' });
  await page.close();
  fs.writeFileSync(path.join(output, 'browser-results.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ passed: results.length, viewports: [1440,768,390], quiz: 'all 30; no external submission', homepage: 'React interactions, keyboard and touch', calculator: 'passed' }));
} finally { await browser.close(); }
