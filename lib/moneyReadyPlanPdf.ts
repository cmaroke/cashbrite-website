import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  PDFDocument,
  StandardFonts,
  rgb,
  type PDFFont,
  type PDFImage,
  type PDFPage,
} from "pdf-lib";
import { generatePremiumActionPlan, type PremiumPriorityArea } from "@/lib/premiumActionPlan";
import type { PremiumPlanAssessment } from "@/lib/premiumPlanDemo";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 48;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const NAVY = rgb(7 / 255, 29 / 255, 43 / 255);
const MINT = rgb(185 / 255, 234 / 255, 216 / 255);
const CREAM = rgb(251 / 255, 247 / 255, 236 / 255);
const SEA = rgb(47 / 255, 143 / 255, 123 / 255);
const WHITE = rgb(1, 1, 1);
const MUTED = rgb(79 / 255, 96 / 255, 105 / 255);
const BORDER = rgb(222 / 255, 229 / 255, 225 / 255);

export async function generateMoneyReadyPlanPdf(assessment: PremiumPlanAssessment) {
  const document = await PDFDocument.create();
  document.setTitle(`Cashbrite Money Ready Plan - ${assessment.registration.firstName}`);
  document.setAuthor("Cashbrite");
  document.setSubject("Personalised financial education and money confidence workbook");
  document.setCreator("Cashbrite");

  const [regular, bold, logoBytes] = await Promise.all([
    document.embedFont(StandardFonts.Helvetica),
    document.embedFont(StandardFonts.HelveticaBold),
    readFile(path.join(process.cwd(), "public", "brand", "cashbrite-logo.png")),
  ]);
  const logo = await document.embedPng(logoBytes);
  const composer = new PdfComposer(document, regular, bold, logo);
  const plan = generatePremiumActionPlan(assessment.registration, assessment.scores);
  const completedDate = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(assessment.completedAt));

  composer.cover({
    firstName: assessment.registration.firstName,
    age: assessment.registration.age,
    completedDate,
    score: assessment.scores.readinessScore,
    band: assessment.scores.band,
  });

  composer.chapter("01", "Welcome", `A letter for ${assessment.registration.firstName}`);
  composer.lead("Welcome to your Cashbrite Money Ready Plan.");
  composer.paragraph(
    "Money confidence is not something you are born with. It is a skill you can learn through small actions, honest questions and experience. Your assessment is a starting point, not a judgement.",
  );
  composer.paragraph(
    "This workbook has been shaped around your results. Use it at your own pace, discuss it with someone you trust and tick off each action as it becomes part of everyday life.",
  );
  composer.quote("Money confidence grows through action, not perfection.");

  composer.chapter("02", "Money Confidence Profile", plan.moneyPersonality.title);
  composer.lead(plan.moneyPersonality.description);
  composer.infoBox("Your personalised reading", plan.personalMoneyProfile, "mint");
  composer.sectionTitle("Your money strengths");
  plan.strengths.forEach((strength) => {
    composer.scoreCard(strength.title, strength.score, strength.explanation);
  });
  composer.sectionTitle("Your biggest opportunities");
  plan.opportunities.forEach((opportunity, index) => {
    composer.numberedCard(index + 1, opportunity.title, `${opportunity.score}% confidence score`);
  });
  composer.sectionTitle("Your complete category picture");
  plan.categoryScores.forEach((category) => composer.progress(category.title, category.score));

  plan.priorityAreas.forEach((area, index) => drawPriorityArea(composer, area, index));

  composer.chapter("06", "30-Day Money Challenge", "Four weeks from insight to action");
  plan.roadmap.forEach((week, index) => {
    composer.weekCard(index + 1, week.week, week.focus, week.actions);
  });

  composer.chapter("07", "Parent Conversation Guide", "Make money conversations feel easier");
  composer.paragraph(
    "These prompts are designed to start a conversation, not test knowledge. Listen first, share experiences honestly and explore anything uncertain together.",
  );
  plan.parentConversationGuide.forEach((prompt, index) => composer.prompt(index + 1, prompt));

  composer.chapter("08", "Money Ready Checklist", "What ready looks like in real life");
  plan.checklist.forEach((item) => composer.checklist(item.topic, item.prompt));

  composer.chapter("09", "Money Confidence Tracker", "Your next 90 days");
  composer.scoreComparison(plan.confidenceTracker.currentScore, plan.confidenceTracker.goalScore);
  composer.sectionTitle("Three areas to improve");
  plan.confidenceTracker.improvementAreas.forEach((area, index) => {
    composer.numberedCard(index + 1, area, "Review this area during your 90-day check-in.");
  });
  composer.blankTracker("My first review date");
  composer.blankTracker("A habit I will keep");
  composer.blankTracker("Someone who can support me");

  composer.chapter("10", "Next Steps", "Keep building, one decision at a time");
  plan.recommendedNextSteps.forEach((step, index) => composer.numberedCard(index + 1, step));
  composer.quote("Financial confidence grows every time you pause, ask a useful question and make an informed choice.");
  composer.sectionTitle("A message from the founder");
  composer.paragraph(
    "I created Cashbrite because I believe every young person deserves to enter adult life feeling confident about money.",
  );
  composer.paragraph(
    "As a banking professional, I have seen first-hand how financial knowledge can transform confidence and decision-making.",
  );
  composer.paragraph("I hope this plan helps you take your first steps towards financial independence.");
  composer.lead("Chandni\nFounder of Cashbrite");
  composer.infoBox(
    "Important",
    "Cashbrite provides financial education and confidence-building guidance. This plan is not regulated financial, legal, tax or investment advice.",
    "cream",
  );

  composer.finish();
  return Buffer.from(await document.save());
}

function drawPriorityArea(composer: PdfComposer, area: PremiumPriorityArea, index: number) {
  composer.chapter(`0${index + 3}`, `Priority Area ${index + 1}`, area.title);
  composer.progress("Your current confidence", area.score);
  composer.infoBox("Why this matters", area.whyItMatters, "cream");
  composer.infoBox("Common mistakes", area.commonMistakes, "cream");

  if (area.creditLearningGuide) {
    const guide = area.creditLearningGuide;
    composer.sectionTitle("What is a credit card?");
    composer.paragraph(guide.basics.explanation);
    composer.sectionTitle("The monthly bill");
    composer.paragraph(guide.monthlyStatement.explanation);
    composer.bullets(guide.monthlyStatement.shows);
    composer.sectionTitle("The best habit");
    composer.paragraph(guide.bestHabit.explanation);
    composer.bullets(guide.bestHabit.benefits);
    composer.infoBox("Minimum payment warning", guide.minimumPayment.explanation, "cream");
    composer.bullets(guide.minimumPayment.consequences);
    composer.sectionTitle(guide.example.title);
    composer.paragraph(guide.example.scenario);
    composer.infoBox(
      guide.example.monthTitle,
      guide.example.statement.map((item) => `${item.label}: ${item.value}`).join("\n"),
      "mint",
    );
    guide.example.options.forEach((option) => {
      composer.infoBox(option.title, `${option.payment}\n${option.outcomes.join("\n")}`, "cream");
    });
    composer.rule(guide.rule);
  } else {
    composer.infoBox("What you need to understand", area.whatToLearn, "mint");
    composer.example(
      area.realLifeExample.title,
      area.realLifeExample.summary,
      area.realLifeExample.details,
      area.realLifeExample.takeaway,
    );
    composer.rule(area.moneySmartTip, "Money Smart Tip");
  }

  composer.sectionTitle("Your five practical actions");
  area.actions.forEach((action, actionIndex) => composer.numberedCard(actionIndex + 1, action));
}

class PdfComposer {
  private page!: PDFPage;
  private y = PAGE_HEIGHT - MARGIN;
  private section = "Money Ready Plan";

  constructor(
    private readonly document: PDFDocument,
    private readonly regular: PDFFont,
    private readonly bold: PDFFont,
    private readonly logo: PDFImage,
  ) {}

  cover(details: { firstName: string; age: number; completedDate: string; score: number; band: string }) {
    this.page = this.document.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    this.page.drawRectangle({ x: 0, y: 0, width: PAGE_WIDTH, height: PAGE_HEIGHT, color: NAVY });
    this.page.drawRectangle({ x: MARGIN, y: PAGE_HEIGHT - 104, width: 154, height: 46, color: CREAM });
    this.page.drawImage(this.logo, { x: MARGIN + 15, y: PAGE_HEIGHT - 92, width: 124, height: 29.5 });
    this.page.drawSvgPath("M 12 0 L 15 9 L 24 12 L 15 15 L 12 24 L 9 15 L 0 12 L 9 9 Z", {
      x: PAGE_WIDTH - 110,
      y: PAGE_HEIGHT - 82,
      scale: 2.2,
      color: MINT,
    });
    this.drawWrapped("YOUR CASHBRITE", MARGIN, 612, CONTENT_WIDTH, 11, 15, this.bold, MINT);
    this.drawWrapped("Money Ready Plan", MARGIN, 548, CONTENT_WIDTH, 40, 45, this.bold, WHITE);
    this.drawWrapped("Your personalised roadmap to financial confidence", MARGIN, 486, 365, 18, 25, this.regular, WHITE);

    this.page.drawRectangle({ x: MARGIN, y: 285, width: CONTENT_WIDTH, height: 154, color: rgb(1, 1, 1), opacity: 0.08 });
    this.drawText("PREPARED FOR", MARGIN + 24, 404, 9, this.bold, MINT);
    this.drawText(details.firstName, MARGIN + 24, 374, 24, this.bold, WHITE);
    this.drawText(`Age ${details.age}  |  Completed ${details.completedDate}`, MARGIN + 24, 342, 11, this.regular, WHITE);
    this.drawText("RESULT BAND", MARGIN + 24, 315, 9, this.bold, MINT);
    this.drawWrapped(details.band, MARGIN + 24, 294, 300, 16, 21, this.bold, WHITE);

    this.page.drawCircle({ x: PAGE_WIDTH - 116, y: 362, size: 57, color: MINT });
    this.drawCentred(String(details.score), PAGE_WIDTH - 116, 368, 30, this.bold, NAVY);
    this.drawCentred("OUT OF 100", PAGE_WIDTH - 116, 342, 8, this.bold, NAVY);
    this.drawWrapped(
      "Practical financial education for life after school.",
      MARGIN,
      120,
      CONTENT_WIDTH,
      13,
      19,
      this.bold,
      MINT,
    );
  }

  chapter(number: string, eyebrow: string, title: string) {
    this.section = title;
    this.page = this.document.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    this.page.drawRectangle({ x: 0, y: 0, width: PAGE_WIDTH, height: PAGE_HEIGHT, color: CREAM });
    this.drawPageHeader();
    this.page.drawCircle({ x: MARGIN + 18, y: PAGE_HEIGHT - 125, size: 18, color: MINT });
    this.drawCentred(number, MARGIN + 18, PAGE_HEIGHT - 129, 9, this.bold, NAVY);
    this.drawText(eyebrow.toUpperCase(), MARGIN + 48, PAGE_HEIGHT - 115, 9, this.bold, SEA);
    const lines = this.wrap(title, this.bold, 25, CONTENT_WIDTH - 48);
    this.drawLines(lines, MARGIN + 48, PAGE_HEIGHT - 142, 25, 30, this.bold, NAVY);
    this.y = PAGE_HEIGHT - 160 - lines.length * 30;
  }

  lead(copy: string) {
    this.paragraph(copy, { font: this.bold, size: 15, lineHeight: 22, color: NAVY, gap: 16 });
  }

  paragraph(
    copy: string,
    options: { font?: PDFFont; size?: number; lineHeight?: number; color?: ReturnType<typeof rgb>; gap?: number } = {},
  ) {
    const font = options.font ?? this.regular;
    const size = options.size ?? 11;
    const lineHeight = options.lineHeight ?? 17;
    const color = options.color ?? MUTED;
    const gap = options.gap ?? 12;
    const paragraphs = sanitise(copy).split("\n");
    paragraphs.forEach((paragraph) => {
      const lines = this.wrap(paragraph, font, size, CONTENT_WIDTH);
      lines.forEach((line) => {
        this.ensure(lineHeight + 2);
        this.drawText(line, MARGIN, this.y, size, font, color);
        this.y -= lineHeight;
      });
      this.y -= 5;
    });
    this.y -= gap - 5;
  }

  sectionTitle(title: string) {
    this.ensure(34);
    this.y -= 5;
    this.drawText(sanitise(title), MARGIN, this.y, 15, this.bold, NAVY);
    this.page.drawRectangle({ x: MARGIN, y: this.y - 9, width: 42, height: 3, color: MINT });
    this.y -= 30;
  }

  infoBox(title: string, copy: string, tone: "mint" | "cream") {
    const titleLines = this.wrap(title, this.bold, 11, CONTENT_WIDTH - 32);
    const bodyLines = sanitise(copy)
      .split("\n")
      .flatMap((line) => this.wrap(line, this.regular, 10, CONTENT_WIDTH - 32));
    const height = 24 + titleLines.length * 15 + bodyLines.length * 15 + 16;
    this.ensure(Math.min(height, 250));
    const startY = this.y;
    this.page.drawRectangle({
      x: MARGIN,
      y: startY - height,
      width: CONTENT_WIDTH,
      height,
      color: tone === "mint" ? MINT : WHITE,
      borderColor: tone === "mint" ? MINT : BORDER,
      borderWidth: 1,
    });
    this.drawLines(titleLines, MARGIN + 16, startY - 22, 11, 15, this.bold, NAVY);
    let bodyY = startY - 22 - titleLines.length * 15 - 7;
    bodyLines.forEach((line) => {
      this.drawText(line, MARGIN + 16, bodyY, 10, this.regular, MUTED);
      bodyY -= 15;
    });
    this.y -= height + 12;
  }

  quote(copy: string) {
    const lines = this.wrap(copy, this.bold, 17, CONTENT_WIDTH - 48);
    const height = lines.length * 24 + 44;
    this.ensure(height);
    this.page.drawRectangle({ x: MARGIN, y: this.y - height, width: CONTENT_WIDTH, height, color: NAVY });
    this.page.drawRectangle({ x: MARGIN, y: this.y - height, width: 6, height, color: MINT });
    this.drawLines(lines, MARGIN + 25, this.y - 31, 17, 24, this.bold, WHITE);
    this.y -= height + 15;
  }

  rule(copy: string, label = "Cashbrite Rule") {
    const lines = this.wrap(copy, this.bold, 13, CONTENT_WIDTH - 44);
    const height = lines.length * 19 + 54;
    this.ensure(height);
    this.page.drawRectangle({
      x: MARGIN,
      y: this.y - height,
      width: CONTENT_WIDTH,
      height,
      color: MINT,
      borderColor: SEA,
      borderWidth: 1.5,
    });
    this.drawText(label.toUpperCase(), MARGIN + 22, this.y - 22, 8, this.bold, SEA);
    this.drawLines(lines, MARGIN + 22, this.y - 47, 13, 19, this.bold, NAVY);
    this.y -= height + 14;
  }

  bullets(items: string[]) {
    items.forEach((item) => {
      const lines = this.wrap(item, this.regular, 10.5, CONTENT_WIDTH - 28);
      const height = Math.max(20, lines.length * 16 + 4);
      this.ensure(height);
      this.page.drawCircle({ x: MARGIN + 5, y: this.y - 4, size: 3, color: SEA });
      this.drawLines(lines, MARGIN + 18, this.y, 10.5, 16, this.regular, MUTED);
      this.y -= height;
    });
    this.y -= 8;
  }

  example(title: string, summary: string, details: string[], takeaway: string) {
    this.sectionTitle("Money Smart Example");
    this.lead(title);
    this.paragraph(summary);
    this.bullets(details);
    this.infoBox("What this shows", takeaway, "mint");
  }

  scoreCard(title: string, score: number, copy: string) {
    const titleLines = this.wrap(title, this.bold, 11, CONTENT_WIDTH - 95);
    const bodyLines = this.wrap(copy, this.regular, 9.5, CONTENT_WIDTH - 32);
    const height = Math.max(70, 22 + titleLines.length * 15 + bodyLines.length * 14);
    this.ensure(height);
    this.page.drawRectangle({ x: MARGIN, y: this.y - height, width: CONTENT_WIDTH, height, color: WHITE, borderColor: BORDER, borderWidth: 1 });
    this.drawLines(titleLines, MARGIN + 16, this.y - 21, 11, 15, this.bold, NAVY);
    this.page.drawRectangle({ x: PAGE_WIDTH - MARGIN - 58, y: this.y - 34, width: 42, height: 22, color: MINT });
    this.drawCentred(`${score}%`, PAGE_WIDTH - MARGIN - 37, this.y - 27, 10, this.bold, NAVY);
    this.drawLines(bodyLines, MARGIN + 16, this.y - 21 - titleLines.length * 15 - 7, 9.5, 14, this.regular, MUTED);
    this.y -= height + 9;
  }

  numberedCard(number: number, title: string, detail?: string) {
    const titleLines = this.wrap(title, this.bold, 10.5, CONTENT_WIDTH - 68);
    const detailLines = detail ? this.wrap(detail, this.regular, 9, CONTENT_WIDTH - 68) : [];
    const height = Math.max(50, 18 + titleLines.length * 15 + detailLines.length * 13);
    this.ensure(height);
    this.page.drawRectangle({ x: MARGIN, y: this.y - height, width: CONTENT_WIDTH, height, color: WHITE, borderColor: BORDER, borderWidth: 1 });
    this.page.drawCircle({ x: MARGIN + 22, y: this.y - 25, size: 13, color: NAVY });
    this.drawCentred(String(number), MARGIN + 22, this.y - 28.5, 8, this.bold, WHITE);
    this.drawLines(titleLines, MARGIN + 48, this.y - 19, 10.5, 15, this.bold, NAVY);
    if (detailLines.length) {
      this.drawLines(detailLines, MARGIN + 48, this.y - 19 - titleLines.length * 15 - 3, 9, 13, this.regular, MUTED);
    }
    this.y -= height + 8;
  }

  progress(title: string, score: number) {
    this.ensure(43);
    this.drawText(sanitise(title), MARGIN, this.y, 10, this.bold, NAVY);
    this.drawText(`${score}%`, PAGE_WIDTH - MARGIN - 25, this.y, 10, this.bold, SEA);
    this.page.drawRectangle({ x: MARGIN, y: this.y - 15, width: CONTENT_WIDTH, height: 7, color: BORDER });
    this.page.drawRectangle({ x: MARGIN, y: this.y - 15, width: CONTENT_WIDTH * (score / 100), height: 7, color: SEA });
    this.y -= 38;
  }

  weekCard(number: number, week: string, focus: string, actions: string[]) {
    this.ensure(68);
    this.page.drawCircle({ x: MARGIN + 18, y: this.y - 19, size: 18, color: NAVY });
    this.drawCentred(String(number), MARGIN + 18, this.y - 23, 9, this.bold, WHITE);
    this.drawText(week.toUpperCase(), MARGIN + 48, this.y - 9, 8, this.bold, SEA);
    this.drawWrapped(focus, MARGIN + 48, this.y - 29, CONTENT_WIDTH - 48, 14, 19, this.bold, NAVY);
    this.y -= 64;
    actions.forEach((action) => this.checklist("", action));
    this.y -= 5;
  }

  prompt(number: number, copy: string) {
    this.numberedCard(number, `“${copy}”`);
  }

  checklist(topic: string, prompt: string) {
    const titleLines = topic ? this.wrap(topic, this.bold, 10.5, CONTENT_WIDTH - 58) : [];
    const promptLines = this.wrap(prompt, this.regular, 9.5, CONTENT_WIDTH - 58);
    const height = Math.max(43, 16 + titleLines.length * 14 + promptLines.length * 14);
    this.ensure(height);
    this.page.drawRectangle({ x: MARGIN, y: this.y - height, width: CONTENT_WIDTH, height, color: WHITE, borderColor: BORDER, borderWidth: 1 });
    this.page.drawRectangle({ x: MARGIN + 16, y: this.y - 29, width: 14, height: 14, color: WHITE, borderColor: SEA, borderWidth: 1.5 });
    let textY = this.y - 18;
    if (titleLines.length) {
      this.drawLines(titleLines, MARGIN + 42, textY, 10.5, 14, this.bold, NAVY);
      textY -= titleLines.length * 14 + 2;
    }
    this.drawLines(promptLines, MARGIN + 42, textY, 9.5, 14, this.regular, MUTED);
    this.y -= height + 7;
  }

  scoreComparison(current: number, goal: number) {
    this.ensure(120);
    this.page.drawRectangle({ x: MARGIN, y: this.y - 102, width: CONTENT_WIDTH, height: 102, color: NAVY });
    this.drawText("CURRENT SCORE", MARGIN + 25, this.y - 25, 8, this.bold, MINT);
    this.drawText(`${current}/100`, MARGIN + 25, this.y - 62, 28, this.bold, WHITE);
    this.drawText("90-DAY GOAL", MARGIN + CONTENT_WIDTH / 2 + 12, this.y - 25, 8, this.bold, MINT);
    this.drawText(`${goal}/100`, MARGIN + CONTENT_WIDTH / 2 + 12, this.y - 62, 28, this.bold, WHITE);
    this.y -= 120;
  }

  blankTracker(label: string) {
    this.ensure(72);
    this.page.drawRectangle({ x: MARGIN, y: this.y - 60, width: CONTENT_WIDTH, height: 60, color: WHITE, borderColor: BORDER, borderWidth: 1, borderDashArray: [4, 4] });
    this.drawText(label, MARGIN + 16, this.y - 21, 9.5, this.bold, MUTED);
    this.y -= 72;
  }

  finish() {
    const pages = this.document.getPages();
    pages.forEach((page, index) => {
      if (index === 0) return;
      page.drawLine({ start: { x: MARGIN, y: 35 }, end: { x: PAGE_WIDTH - MARGIN, y: 35 }, thickness: 0.7, color: BORDER });
      page.drawText("Cashbrite Money Ready Plan", { x: MARGIN, y: 20, size: 8, font: this.bold, color: MUTED });
      const pageNumber = `${index + 1} / ${pages.length}`;
      page.drawText(pageNumber, { x: PAGE_WIDTH - MARGIN - this.regular.widthOfTextAtSize(pageNumber, 8), y: 20, size: 8, font: this.regular, color: MUTED });
    });
  }

  private drawPageHeader() {
    this.page.drawImage(this.logo, { x: MARGIN, y: PAGE_HEIGHT - 66, width: 105, height: 25 });
    this.page.drawLine({ start: { x: MARGIN, y: PAGE_HEIGHT - 78 }, end: { x: PAGE_WIDTH - MARGIN, y: PAGE_HEIGHT - 78 }, thickness: 0.8, color: BORDER });
  }

  private ensure(height: number) {
    if (this.y - height >= 58) return;
    this.page = this.document.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    this.page.drawRectangle({ x: 0, y: 0, width: PAGE_WIDTH, height: PAGE_HEIGHT, color: CREAM });
    this.drawPageHeader();
    this.drawText("CONTINUED", MARGIN, PAGE_HEIGHT - 108, 8, this.bold, SEA);
    this.drawWrapped(this.section, MARGIN, PAGE_HEIGHT - 132, CONTENT_WIDTH, 19, 24, this.bold, NAVY);
    this.y = PAGE_HEIGHT - 170;
  }

  private wrap(copy: string, font: PDFFont, size: number, maxWidth: number) {
    const words = sanitise(copy).split(/\s+/).filter(Boolean);
    if (!words.length) return [""];
    const lines: string[] = [];
    let line = "";
    words.forEach((word) => {
      const candidate = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
        line = candidate;
      } else {
        if (line) lines.push(line);
        line = word;
      }
    });
    if (line) lines.push(line);
    return lines;
  }

  private drawWrapped(copy: string, x: number, y: number, width: number, size: number, lineHeight: number, font: PDFFont, color: ReturnType<typeof rgb>) {
    const lines = this.wrap(copy, font, size, width);
    this.drawLines(lines, x, y, size, lineHeight, font, color);
    return lines.length;
  }

  private drawLines(lines: string[], x: number, y: number, size: number, lineHeight: number, font: PDFFont, color: ReturnType<typeof rgb>) {
    lines.forEach((line, index) => this.drawText(line, x, y - index * lineHeight, size, font, color));
  }

  private drawText(copy: string, x: number, y: number, size: number, font: PDFFont, color: ReturnType<typeof rgb>) {
    this.page.drawText(sanitise(copy), { x, y, size, font, color });
  }

  private drawCentred(copy: string, centreX: number, y: number, size: number, font: PDFFont, color: ReturnType<typeof rgb>) {
    const text = sanitise(copy);
    this.page.drawText(text, { x: centreX - font.widthOfTextAtSize(text, size) / 2, y, size, font, color });
  }
}

function sanitise(value: string) {
  return value
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/…/g, "...")
    .replace(/✓/g, "Yes:")
    .replace(/•/g, "-");
}
