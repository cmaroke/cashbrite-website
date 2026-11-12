import assert from 'node:assert/strict';
import { serverLoader } from './server-runtime.mjs';
import { NextResponse } from 'next/server.js';

const saves = [], messages = [];
const env = { DATABASE_URL: 'synthetic-adapter-only', RESEND_API_KEY: 'synthetic-no-network', CONTACT_TO_EMAIL: 'operator@cashbrite.example', CONTACT_FROM_EMAIL: 'Cashbrite <test@cashbrite.example>' };
const overrides = new Map([
  ['next/server', { NextResponse, after: callback => { background.push(callback); } }],
  ['@/lib/assessmentDb', { saveAssessment: async record => { saves.push(record); return true; } }],
  ['@/lib/assessmentEmail', { sendActionPlanEmail: async message => { messages.push(message); return 'accepted'; }, sendInternalAssessmentNotification: async message => { messages.push(message); return 'accepted'; } }],
  ['resend', { Resend: class { emails = { send: async message => { messages.push(message); return { data: { id: 'synthetic-accepted' }, error: null }; } }; } }],
]);
const load = serverLoader(overrides, env);
const background = [];
const { quizQuestions } = load('data/quizQuestions.ts');
const assessment = load('app/api/assessments/route.ts').POST;
const contact = load('app/api/contact/route.ts').POST;
const registration = { firstName: 'Alex', lastName: 'Synthetic', age: 18, email: 'alex@cashbrite.example', educationStage: 'School', referralSource: '', reportConsent: true, marketingConsent: false };
const selectedAnswers = Object.fromEntries(quizQuestions.map(question => [question.id, question.answers.find(answer => answer.points === 3).id]));
const request = (endpoint, body) => new Request(`https://cashbrite.example/api/${endpoint}`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': '10000000-0000-4000-8000-000000000001' }, body: JSON.stringify(body) });
assert.equal((await assessment(request('assessments', {}))).status, 400);
assert.equal((await assessment(request('assessments', { registration: { ...registration, reportConsent: false }, selectedAnswers }))).status, 400);
assert.equal(saves.length, 0); assert.equal(messages.length, 0);
const response = await assessment(request('assessments', { registration, selectedAnswers }));
assert.equal(messages.length, 0, 'Emails must wait until after the response');
await Promise.all(background.map(callback => callback()));
assert.equal(response.status, 200); assert.equal(saves.length, 1); assert.equal(messages.length, 2);
assert.equal(saves[0].scores.readinessScore, 100);
assert.equal(saves[0].scores.maxScore, 90);
assert.equal((await response.json()).id, saves[0].id);
const enquiry = { name: 'Synthetic Visitor', email: 'visitor@cashbrite.example', organisation: 'Synthetic School', message: 'A synthetic workshop enquiry for local QA.', formStartedAt: String(Date.now() - 10000), website: '' };
assert.equal((await contact(request('contact', { ...enquiry, website: 'bot.example' }))).status, 400);
assert.equal((await contact(request('contact', { ...enquiry, formStartedAt: String(Date.now()) }))).status, 400);
assert.equal((await contact(request('contact', enquiry))).status, 200);
assert.equal(messages.length, 3);
assert.equal(messages[2].to, env.CONTACT_TO_EMAIL);
console.log(JSON.stringify({ assessmentValidation: 'passed', consentRequired: true, canonicalAnswers: 30, maximumRaw: 90, bestScore: 100, databaseWrites: 'one mocked save', emailCalls: 'three mocked calls', schoolAndContactEnquiry: 'shared endpoint; validation and mocked delivery pass', externalCalls: 0 }));
