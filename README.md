# Cashbrite MVP Website

Cashbrite is a UK financial education platform for school leavers, students and young adults. This MVP is a responsive Next.js website with a front-end Money Readiness Questionnaire, student and school pages, and enquiry/contact forms.

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Neon Postgres for assessment result storage
- Resend for email delivery
- Stripe Checkout for one-off Money Ready Plan purchases

## File Structure

```text
app/
  api/assessments/route.ts Server-side assessment save/email endpoint
  api/contact/route.ts  Server-side contact form email endpoint
  api/money-ready-plan/pdf/ Payment-verified premium PDF download
  api/stripe/checkout/  Server-side Stripe Checkout session endpoint
  api/stripe/webhook/   Signed Stripe payment webhook endpoint
  contact/page.tsx       Contact page
  globals.css            Tailwind and global styles
  layout.tsx             Shared navigation and footer
  page.tsx               Home page
  premium-plan-preview/  Synthetic demo only; paid access is separately verified
  money-ready-plan/success/ Verified premium plan access page
  checkout/money-ready-plan/ Assessment email checkout recovery page
  quiz/page.tsx          Money Readiness Questionnaire
  results/page.tsx       Quiz results page
  schools/page.tsx       Schools page
  students/page.tsx      Students page
components/
  ButtonLink.tsx         Reusable link button
  ContactForm.tsx        Contact and school enquiry form
  InfoCard.tsx           Reusable content card
  SectionHeader.tsx      Reusable section heading
data/
  quizQuestions.ts       Editable quiz questions and answer points
db/
  schema.sql             Neon/Postgres assessment table schema
lib/
  actionPlan.ts          Money Action Plan generation
  premiumActionPlan.ts   Premium Money Ready Plan generation
  moneyReadyPlanPdf.ts   Branded premium PDF generation
  premiumPurchaseDb.ts   Premium purchase database helpers
  stripe.ts              Server-only Stripe configuration
  assessmentDb.ts        Neon database helpers
  assessmentEmail.ts     Assessment email helpers
  assessmentTypes.ts     Shared assessment types
  assessmentValidation.ts Server-side assessment validation
  quizScoring.ts         Quiz scoring and result band logic
public/images/
  cashbrite-hero.png     Hero visual asset
```

## Setup

Install dependencies with npm:

```bash
npm install
```

Or with pnpm:

```bash
pnpm install
```

Run the development server with npm:

```bash
npm run dev
```

Or with pnpm:

```bash
pnpm dev
```

Open:

```text
http://localhost:3000
```

## Editing The Questionnaire

Quiz content lives in `data/quizQuestions.ts`.

The assessment contains 30 questions: three questions in each of the 10 money categories. It is positioned as a 5-minute Money Readiness Assessment.

Each answer has a `points` value. The scoring helper in `lib/quizScoring.ts` calculates:

- overall Money Readiness Score out of 100
- category scores
- result band
- strengths
- risk areas
- personalised next steps

Each question uses a consistent `3 / 2 / 1 / 0` progression from the strongest answer to the weakest. The raw maximum is 90 points. A light calibration curve keeps weaker answer patterns from producing inflated scores while preserving a score of 100 for all-best answers. Result bands are:

- `Money Ready`: 85-100
- `Building Money Confidence`: 65-84
- `Developing Money Skills`: 40-64
- `Starting Your Money Journey`: below 40

## Assessment Registration And Data Storage

The Money Readiness Assessment starts with a registration step. Users must provide first name, last name, age, email address, their current education stage, and required consent to receive their personalised Cashbrite Money Action Plan by email. Optional marketing consent is stored separately.

Assessment submissions are handled by `app/api/assessments/route.ts`. The route validates the registration and answers, uses the existing quiz scoring logic, generates the Money Action Plan, stores the result and emails the user when Resend is configured.

### Database Choice

This project uses Neon Postgres via `@neondatabase/serverless`. It is a simple fit for a startup deployed on Vercel because it is serverless, low-cost to start, works through a normal `DATABASE_URL`, and has official Next.js/Vercel-friendly setup guidance.

Create a Neon project, copy the pooled connection string and add it as:

```text
DATABASE_URL=postgresql://...
```

The app creates the `assessment_results` table automatically on first assessment save. You can also run `db/schema.sql` manually in Neon.

## Forms

The contact and school enquiry forms submit to `app/api/contact/route.ts`, which sends email from the server using Resend. The destination email and API key are stored in environment variables and are not exposed in client-side code.

Required environment variables:

```text
DATABASE_URL=your_neon_database_url
RESEND_API_KEY=your_resend_api_key
CONTACT_TO_EMAIL=cmaroke@me.com
CONTACT_FROM_EMAIL=Cashbrite <onboarding@resend.dev>
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For production, verify a sending domain in Resend and update `CONTACT_FROM_EMAIL` to an address on that domain, such as `Cashbrite <hello@yourdomain.co.uk>`. `CONTACT_TO_EMAIL` should remain `cmaroke@me.com` for internal contact/enquiry notifications.

## Premium Money Ready Plan Preview

The no-index preview route displays synthetic data only. Real customer reports require verified paid access; preview secrets in query strings are no longer supported.

To review the design safely with synthetic data and no database lookup, open:

```text
/premium-plan-preview?demo=true
```

The demo is visibly labelled and uses only a fictional profile. No environment variable is required for demo mode.

`PREMIUM_PLAN_PREVIEW_KEY` is not required or used for customer access. Never put a Stripe secret or operator credential into a URL.

The preview includes a print button, and paid plans also provide a server-generated branded PDF download.

## Premium PDF Delivery

After Stripe confirms a paid Checkout Session, Cashbrite generates a branded A4 Money Ready Plan from the same assessment data used by the premium web workbook. The PDF is attached to the Resend purchase confirmation email and remains available from the unlocked web plan through a payment-verified download URL.

The download endpoint is:

```text
/api/money-ready-plan/pdf?session_id=STRIPE_CHECKOUT_SESSION_ID
```

The endpoint retrieves the Checkout Session directly from Stripe and only returns a PDF when the session is complete, paid, linked to the Cashbrite Money Ready Plan product and connected to a valid assessment. No additional environment variables are required beyond the existing Stripe, Neon and Resend configuration.

## Assessment Email And Checkout Recovery

Assessment emails use a responsive branded HTML layout with a plain-text fallback. The upgrade button links to:

```text
/checkout/money-ready-plan?assessmentId=ASSESSMENT_ID&source=email
```

The recovery page validates the assessment, shows its score, result band and three priority areas, and reuses the normal server-side Stripe Checkout flow. Opening the page records `checkout_recovery_view`; links carrying `source=email` also record `email_checkout_click`. These events use the existing `premium_plan_interest` table and require no database migration.

## Stripe Checkout Setup

Cashbrite uses Stripe-hosted Checkout in one-off payment mode. The app never exposes the Stripe secret key to the browser. A signed webhook marks a purchase as paid, and the plan access page retrieves the Checkout Session from Stripe before showing any premium customer content.

### Create the £19 product and price

1. Open Stripe Dashboard and switch on **Test mode** while setting up.
2. Go to the Product catalogue and create a product named `Cashbrite Money Ready Plan`.
3. Add a one-off price of `£19.00 GBP`.
4. Copy the Price ID beginning with `price_` into `STRIPE_PRICE_ID`.
5. Copy the test publishable and secret API keys into `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY`.

Use Stripe Price IDs rather than changing the amount in code. This keeps the charged price controlled by Stripe and lets test and production deployments use different prices safely.

### Configure the webhook

In Stripe Workbench, create a webhook destination for:

```text
https://YOUR_DOMAIN/api/stripe/webhook
```

Subscribe it to:

```text
checkout.session.completed
checkout.session.async_payment_succeeded
checkout.session.async_payment_failed
checkout.session.expired
payment_intent.payment_failed
```

Reveal the endpoint signing secret beginning with `whsec_` and save it as `STRIPE_WEBHOOK_SECRET`. The webhook route verifies Stripe's signature against the untouched request body before processing an event.

### Test locally

Run the offline suite first; it uses a disposable local database and mocked Stripe/Resend, without customer records or live service calls:

```sh
npm install --prefix /tmp/cashbrite-pg-test --no-save --ignore-scripts --package-lock=false @electric-sql/pglite@0.5.15
node scripts/check-purchase-reliability.mjs
node scripts/check-product-messaging.mjs
node scripts/check-quiz-scoring.mjs
```

Real provider test-mode/UI and deliverability checks require a separately authorised staging environment. They were not run as part of Phase 3C.2. Do not use production records, send real email or initiate payment during offline testing.

### Purchase data and access

Purchase schema setup is explicit, not automatic. For an existing database, review `db/migrations/003_premium_delivery.sql`; it adds durable delivery state and leaves historical paid delivery outcomes as `needs_review`. Do not automatically resend those rows. For a new database, use `db/schema.sql` instead.

See [Phase 3C.2 implementation, migration, rollback and trusted recovery CLI](docs/cashbrite-phase-3c2-implementation.md) before any release. No production migration/deployment is authorised by these instructions alone.

The email access link contains a Stripe Checkout Session ID. Each visit is verified server-side with Stripe and must belong to the Cashbrite product with a completed, paid status. Invalid, incomplete or unrelated sessions do not unlock a workbook.

## Deploying To Vercel

1. Push the project to GitHub, GitLab or Bitbucket.
2. Create a new project in Vercel.
3. Import the repository.
4. Create a Neon Postgres database and add `DATABASE_URL` in Vercel Project Settings.
5. Add the Resend environment variables in Vercel Project Settings.
6. Create the Stripe product and £19 one-off price, then add all five Stripe environment variables.
7. Set `NEXT_PUBLIC_SITE_URL` to the production origin, for example `https://cashbrite.co.uk`, with no trailing path.
8. Follow the approved maintenance/migration cutover in the Phase 3C.2 report before deploying the matching app. Do not mix old fulfilment code with the new delivery state during cutover.
9. Add the production webhook destination in Stripe and save its signing secret as `STRIPE_WEBHOOK_SECRET` in Vercel.
10. Redeploy after changing environment variables.
11. Verify sensitive-route analytics exclusions, disable conflicting GA4 automatic history/form/outbound measurement, and confirm private/no-referrer response headers in authorised staging.

Use Stripe test keys and a test Price ID for Vercel Preview environments. For Production, replace all Stripe values with live-mode keys, a live £19 Price ID and the signing secret from the live webhook destination. Never put `STRIPE_SECRET_KEY` or `STRIPE_WEBHOOK_SECRET` in a `NEXT_PUBLIC_` variable.

Vercel will install dependencies and run the production build automatically.
