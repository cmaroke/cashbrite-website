# Cashbrite MVP Website

Cashbrite is a UK financial education platform for school leavers, students and young adults. This MVP is a responsive Next.js website with a front-end Money Readiness Questionnaire, student and school pages, and enquiry/contact forms.

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- No database
- No payment processing

## File Structure

```text
app/
  api/contact/route.ts  Server-side contact form email endpoint
  contact/page.tsx       Contact page
  globals.css            Tailwind and global styles
  layout.tsx             Shared navigation and footer
  page.tsx               Home page
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
lib/
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

## Forms

The contact and school enquiry forms submit to `app/api/contact/route.ts`, which sends email from the server using Resend. The destination email and API key are stored in environment variables and are not exposed in client-side code.

Required environment variables:

```text
RESEND_API_KEY=your_resend_api_key
CONTACT_TO_EMAIL=your_receiving_email_address
CONTACT_FROM_EMAIL=Cashbrite <onboarding@resend.dev>
```

For production, verify a sending domain in Resend and update `CONTACT_FROM_EMAIL` to an address on that domain, such as `Cashbrite <hello@yourdomain.co.uk>`. `CONTACT_TO_EMAIL` should be the inbox that receives Cashbrite enquiries.

## Deploying To Vercel

1. Push the project to GitHub, GitLab or Bitbucket.
2. Create a new project in Vercel.
3. Import the repository.
4. Add the Resend environment variables in Vercel Project Settings.
5. Use the default Next.js settings.
6. Deploy.

Vercel will install dependencies and run the production build automatically.
