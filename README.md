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
  api/stripe/checkout/  Server-side Stripe Checkout session endpoint
  api/stripe/webhook/   Signed Stripe payment webhook endpoint
  contact/page.tsx       Contact page
  globals.css            Tailwind and global styles
  layout.tsx             Shared navigation and footer
  page.tsx               Home page
  premium-plan-preview/  Locked premium workbook preview
  money-ready-plan/success/ Verified premium plan access page
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

Each answer has a `points` value. The scoring helper in `lib/quizScoring.ts` calculates:

- overall Money Readiness Score out of 100
- category scores
- result band
- strengths
- risk areas
- personalised next steps

Result bands are:

- `0-25`: Money Foundations Needed
- `26-50`: Getting Started
- `51-70`: Building Confidence
- `71-85`: Nearly Money Ready
- `86-100`: Money Ready

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

The full paid workbook is available through a private, no-index test route. It is not linked from the free results page.

To review the design safely with synthetic data and no database lookup, open:

```text
/premium-plan-preview?demo=true
```

The demo is visibly labelled and uses only a fictional profile. No environment variable is required for demo mode.

1. Add a long random `PREMIUM_PLAN_PREVIEW_KEY` to `.env.local` and to Vercel when a deployed preview is needed.
2. Copy an assessment ID from the `id` value in a completed results-page URL.
3. Open:

```text
/premium-plan-preview?id=ASSESSMENT_ID&key=PREMIUM_PLAN_PREVIEW_KEY
```

Example preview-only environment variable:

```text
PREMIUM_PLAN_PREVIEW_KEY=use-a-long-random-preview-key
```

The preview includes a print button, which can use the browser's Save as PDF option. The separate Download PDF button is intentionally a placeholder for future automated PDF generation.

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
checkout.session.expired
payment_intent.payment_failed
```

Reveal the endpoint signing secret beginning with `whsec_` and save it as `STRIPE_WEBHOOK_SECRET`. The webhook route verifies Stripe's signature against the untouched request body before processing an event.

### Test locally

1. Put test-mode keys and the test Price ID in `.env.local`.
2. Set `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.
3. Run `pnpm dev`.
4. Use the Stripe CLI to forward events:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

5. Use the `whsec_` value printed by the CLI as the local `STRIPE_WEBHOOK_SECRET`.
6. Complete an assessment and click **Unlock My £19 Money Ready Plan**.
7. In Stripe Checkout, use test card `4242 4242 4242 4242`, any future expiry date, and any CVC/postcode.
8. Confirm that Checkout returns to `/money-ready-plan/success`, the workbook is visible, `premium_purchases.payment_status` is `paid`, and the confirmation email arrives.

Use Stripe's documented declined or authentication test cards to check failed-payment behaviour. Do not use real card details in test mode.

### Purchase data and access

The app creates the `premium_purchases` table automatically when Checkout is first used. `db/schema.sql` also contains the schema for manual setup. The table records the assessment reference, Stripe session and PaymentIntent IDs, amount, currency and payment state.

The email access link contains a Stripe Checkout Session ID. Each visit is verified server-side with Stripe and must belong to the Cashbrite product with a completed, paid status. Invalid, incomplete or unrelated sessions do not unlock a workbook.

## Deploying To Vercel

1. Push the project to GitHub, GitLab or Bitbucket.
2. Create a new project in Vercel.
3. Import the repository.
4. Create a Neon Postgres database and add `DATABASE_URL` in Vercel Project Settings.
5. Add the Resend environment variables in Vercel Project Settings.
6. Create the Stripe product and £19 one-off price, then add all five Stripe environment variables.
7. Set `NEXT_PUBLIC_SITE_URL` to the production origin, for example `https://cashbrite.co.uk`, with no trailing path.
8. Deploy once so the webhook route is live.
9. Add the production webhook destination in Stripe and save its signing secret as `STRIPE_WEBHOOK_SECRET` in Vercel.
10. Redeploy after changing environment variables.
11. Add `PREMIUM_PLAN_PREVIEW_KEY` if the private workbook preview is required on that deployment.

Use Stripe test keys and a test Price ID for Vercel Preview environments. For Production, replace all Stripe values with live-mode keys, a live £19 Price ID and the signing secret from the live webhook destination. Never put `STRIPE_SECRET_KEY` or `STRIPE_WEBHOOK_SECRET` in a `NEXT_PUBLIC_` variable.

Vercel will install dependencies and run the production build automatically.
