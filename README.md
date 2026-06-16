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
  ContactForm.tsx        Front-end-only enquiry form
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

The contact and school enquiry forms are front-end only for this first version. Before launching publicly, connect them to a form service, email workflow, CRM or API route.

## Deploying To Vercel

1. Push the project to GitHub, GitLab or Bitbucket.
2. Create a new project in Vercel.
3. Import the repository.
4. Use the default Next.js settings.
5. Deploy.

Vercel will install dependencies and run the production build automatically.
