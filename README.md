# Cashbrite MVP Website

Cashbrite is a UK financial education platform for school leavers, students and young adults. This MVP is a responsive Next.js website with a front-end Money Readiness Questionnaire, student and school pages, and enquiry/contact forms.

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Neon Postgres for assessment result storage
- Resend for email delivery
- No payment processing

## File Structure

```text
app/
  api/assessments/route.ts Server-side assessment save/email endpoint
  api/contact/route.ts  Server-side contact form email endpoint
  contact/page.tsx       Contact page
  globals.css            Tailwind and global styles
  layout.tsx             Shared navigation and footer
  page.tsx               Home page
  premium-plan-preview/  Locked premium workbook preview
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

The Money Readiness Assessment starts with a registration step. Users must provide first name, last name, age, email address, user type, and required consent to receive their personalised Cashbrite Money Action Plan by email. Optional marketing consent is stored separately.

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

## Deploying To Vercel

1. Push the project to GitHub, GitLab or Bitbucket.
2. Create a new project in Vercel.
3. Import the repository.
4. Create a Neon Postgres database and add `DATABASE_URL` in Vercel Project Settings.
5. Add the Resend environment variables in Vercel Project Settings.
6. Add `PREMIUM_PLAN_PREVIEW_KEY` if the private workbook preview is required on that deployment.
7. Use the default Next.js settings.
8. Deploy.

Vercel will install dependencies and run the production build automatically.
