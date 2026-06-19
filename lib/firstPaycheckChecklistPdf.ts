import { readFile } from "node:fs/promises";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFImage, type PDFPage } from "pdf-lib";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 42;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const NAVY = rgb(7 / 255, 29 / 255, 43 / 255);
const MINT = rgb(185 / 255, 234 / 255, 216 / 255);
const CREAM = rgb(251 / 255, 247 / 255, 236 / 255);
const SEA = rgb(47 / 255, 143 / 255, 123 / 255);
const WHITE = rgb(1, 1, 1);
const MUTED = rgb(79 / 255, 96 / 255, 105 / 255);
const BORDER = rgb(222 / 255, 229 / 255, 225 / 255);

export async function generateFirstPaycheckChecklistPdf() {
  const document = await PDFDocument.create();
  document.setTitle("Your First Paycheck Checklist");
  document.setAuthor("Cashbrite");
  document.setSubject("A free guide to building confident money habits from your first paycheck");
  document.setCreator("Cashbrite");

  const [regular, bold, logoBytes] = await Promise.all([
    document.embedFont(StandardFonts.Helvetica),
    document.embedFont(StandardFonts.HelveticaBold),
    readFile(path.join(process.cwd(), "public", "brand", "cashbrite-logo.png")),
  ]);
  const logo = await document.embedPng(logoBytes);
  const guide = new FirstPaycheckGuide(document, regular, bold, logo);

  guide.drawPageOne();
  guide.drawPageTwo();

  return Buffer.from(await document.save({ useObjectStreams: true }));
}

class FirstPaycheckGuide {
  constructor(
    private readonly document: PDFDocument,
    private readonly regular: PDFFont,
    private readonly bold: PDFFont,
    private readonly logo: PDFImage,
  ) {}

  drawPageOne() {
    const page = this.addPage();
    this.drawLogo(page, 42, 786, 132);
    this.drawSparkle(page, 520, 801, 0.9, SEA);

    page.drawRectangle({ x: MARGIN, y: 606, width: CONTENT_WIDTH, height: 156, color: NAVY });
    this.label(page, "FREE MONEY GUIDE", 64, 730, MINT);
    this.wrapped(page, "YOUR FIRST PAYCHECK CHECKLIST", 64, 695, 420, 27, 31, this.bold, WHITE);
    this.wrapped(
      page,
      "The money guide every young person should read before their first salary arrives.",
      64,
      628,
      430,
      12.5,
      18,
      this.regular,
      WHITE,
    );
    this.drawSparkle(page, 498, 640, 1.45, MINT);

    this.quote(
      page,
      "Your first paycheck isn't about how much you earn - it's about the money habits you build from day one.",
      42,
      534,
      CONTENT_WIDTH,
      54,
    );

    this.sectionCard(page, {
      number: "01",
      title: "Set up your bank account",
      y: 393,
      height: 124,
      items: [
        "Make sure your account is in your own name",
        "Download your banking app",
        "Turn on payment notifications",
      ],
      noteLabel: "MONEY SMART TIP",
      note: "The most financially confident people know where their money is going.",
    });

    this.sectionCard(page, {
      number: "02",
      title: "Understand your payslip",
      y: 239,
      height: 140,
      items: ["Gross pay", "Net pay", "Tax deductions (if applicable)", "National Insurance", "Pension contributions"],
      noteLabel: "CASHBRITE RULE",
      note: "Never ignore your payslip. Always check you have been paid correctly.",
    });

    this.spendingPlan(page);
    this.footer(page, 1);
  }

  drawPageTwo() {
    const page = this.addPage();
    this.drawLogo(page, 42, 786, 116);
    this.drawSparkle(page, 520, 801, 0.9, SEA);
    this.label(page, "YOUR FIRST PAYCHECK CHECKLIST", 42, 755, SEA);
    this.wrapped(page, "When your paycheck arrives", 42, 724, CONTENT_WIDTH, 25, 30, this.bold, NAVY);

    this.savingsCard(page);

    this.sectionCard(page, {
      number: "05",
      title: "Build an emergency fund",
      y: 441,
      height: 126,
      items: ["A broken phone", "Travel costs", "Unexpected expenses"],
      noteLabel: "WHY IT HELPS",
      note: "Savings give you choices and reduce the need to borrow.",
    });

    this.sectionCard(page, {
      number: "06",
      title: "Your first credit card",
      y: 263,
      height: 164,
      items: [
        "A credit card is borrowed money",
        "You receive a monthly statement",
        "Pay the full balance where possible",
        "Avoid only paying the minimum amount",
      ],
      noteLabel: "CASHBRITE RULE",
      note: "Only spend on a credit card what you can afford to repay when the bill arrives.",
    });

    this.callToAction(page);
    this.footer(page, 2);
  }

  private addPage() {
    const page = this.document.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    page.drawRectangle({ x: 0, y: 0, width: PAGE_WIDTH, height: PAGE_HEIGHT, color: CREAM });
    return page;
  }

  private sectionCard(
    page: PDFPage,
    details: {
      number: string;
      title: string;
      y: number;
      height: number;
      items: string[];
      noteLabel: string;
      note: string;
    },
  ) {
    const { number, title, y, height, items, noteLabel, note } = details;
    page.drawRectangle({ x: MARGIN, y, width: CONTENT_WIDTH, height, color: WHITE, borderColor: BORDER, borderWidth: 1 });
    page.drawCircle({ x: MARGIN + 25, y: y + height - 27, size: 16, color: MINT });
    this.centred(page, number, MARGIN + 25, y + height - 30.5, 8, this.bold, NAVY);
    this.text(page, title, MARGIN + 50, y + height - 32, 16, this.bold, NAVY);

    const listX = MARGIN + 18;
    const listTop = y + height - 60;
    const itemWidth = 260;
    const rowHeight = 16;
    items.forEach((item, index) => {
      const x = listX;
      const itemY = listTop - index * rowHeight;
      page.drawRectangle({ x, y: itemY - 6, width: 10, height: 10, color: WHITE, borderColor: SEA, borderWidth: 1.2 });
      this.wrapped(page, item, x + 18, itemY - 4, itemWidth, 9.2, 12.5, this.regular, MUTED);
    });

    const noteWidth = 185;
    const noteX = PAGE_WIDTH - MARGIN - noteWidth - 18;
    const noteHeight = height - 66;
    const noteY = y + 14;
    page.drawRectangle({ x: noteX, y: noteY, width: noteWidth, height: noteHeight, color: MINT });
    this.label(page, noteLabel, noteX + 12, noteY + noteHeight - 15, SEA, 7.2);
    this.wrapped(page, note, noteX + 12, noteY + noteHeight - 31, noteWidth - 24, 8.5, 11.5, this.bold, NAVY);
  }

  private spendingPlan(page: PDFPage) {
    const y = 58;
    const height = 167;
    page.drawRectangle({ x: MARGIN, y, width: CONTENT_WIDTH, height, color: WHITE, borderColor: BORDER, borderWidth: 1 });
    page.drawCircle({ x: MARGIN + 25, y: y + height - 27, size: 16, color: MINT });
    this.centred(page, "03", MARGIN + 25, y + height - 30.5, 8, this.bold, NAVY);
    this.text(page, "Create your spending plan", MARGIN + 50, y + height - 32, 16, this.bold, NAVY);

    const groups = [
      ["NEEDS", "Transport  |  Phone  |  Food  |  Bills"],
      ["WANTS", "Clothes  |  Eating out  |  Entertainment"],
      ["SAVINGS", "Money for future goals"],
    ] as const;
    groups.forEach(([label, copy], index) => {
      const cardX = MARGIN + 18 + index * 158;
      page.drawRectangle({ x: cardX, y: 111, width: 145, height: 54, color: index === 2 ? MINT : CREAM });
      this.label(page, label, cardX + 11, 149, SEA, 7.2);
      this.wrapped(page, copy, cardX + 11, 133, 123, 8.5, 11, this.regular, NAVY);
    });

    page.drawRectangle({ x: MARGIN + 18, y: 72, width: CONTENT_WIDTH - 36, height: 29, color: NAVY });
    this.label(page, "MONEY SMART TIP", MARGIN + 31, 90, MINT, 7);
    this.text(
      page,
      "Budgeting isn't about restricting your life. It's about telling your money where to go.",
      MARGIN + 132,
      82,
      8.5,
      this.bold,
      WHITE,
    );
  }

  private savingsCard(page: PDFPage) {
    const y = 582;
    const height = 116;
    page.drawRectangle({ x: MARGIN, y, width: CONTENT_WIDTH, height, color: NAVY });
    page.drawCircle({ x: MARGIN + 25, y: y + height - 27, size: 16, color: MINT });
    this.centred(page, "04", MARGIN + 25, y + height - 30.5, 8, this.bold, NAVY);
    this.text(page, "Pay yourself first", MARGIN + 50, y + height - 32, 16, this.bold, WHITE);

    const examples = [
      ["£10 per week", "£520 saved in a year"],
      ["£20 per week", "£1,040 saved in a year"],
    ] as const;
    examples.forEach(([weekly, yearly], index) => {
      const x = MARGIN + 18 + index * 205;
      page.drawRectangle({ x, y: y + 24, width: 190, height: 42, color: WHITE, opacity: 0.1 });
      this.text(page, weekly, x + 12, y + 48, 10, this.bold, MINT);
      this.text(page, yearly, x + 12, y + 32, 9, this.regular, WHITE);
    });
    this.wrapped(page, "Small habits create financial confidence.", 458, y + 51, 70, 8.2, 11, this.bold, MINT);
  }

  private callToAction(page: PDFPage) {
    const y = 55;
    const height = 194;
    page.drawRectangle({ x: MARGIN, y, width: CONTENT_WIDTH, height, color: NAVY });
    this.label(page, "YOUR NEXT STEP", MARGIN + 22, y + height - 25, MINT);
    this.text(page, "How Money Ready Are You?", MARGIN + 22, y + height - 54, 21, this.bold, WHITE);
    this.text(page, "This checklist is just the beginning.", MARGIN + 22, y + height - 76, 10.5, this.regular, WHITE);

    const benefits = [
      "Your Money Readiness Score",
      "Your biggest money knowledge gaps",
      "Your personalised route to improving your confidence",
    ];
    benefits.forEach((benefit, index) => {
      const itemY = y + height - 101 - index * 19;
      page.drawCircle({ x: MARGIN + 27, y: itemY + 2, size: 4, color: MINT });
      this.text(page, benefit, MARGIN + 39, itemY - 1, 9.5, this.bold, WHITE);
    });

    page.drawRectangle({ x: MARGIN + 22, y: y + 8, width: 210, height: 36, color: MINT });
    this.centred(page, "Take the Free Assessment", MARGIN + 127, y + 21, 11, this.bold, NAVY);
    this.text(page, "cashbrite.co.uk", PAGE_WIDTH - MARGIN - 114, y + 21, 11, this.bold, MINT);
    this.drawSparkle(page, PAGE_WIDTH - MARGIN - 24, y + 24, 0.7, MINT);
  }

  private quote(page: PDFPage, copy: string, x: number, y: number, width: number, height: number) {
    page.drawRectangle({ x, y, width, height, color: MINT });
    page.drawRectangle({ x, y, width: 6, height, color: SEA });
    this.wrapped(page, `"${copy}"`, x + 22, y + 34, width - 44, 12, 17, this.bold, NAVY);
  }

  private footer(page: PDFPage, pageNumber: number) {
    page.drawLine({ start: { x: MARGIN, y: 38 }, end: { x: PAGE_WIDTH - MARGIN, y: 38 }, thickness: 0.7, color: BORDER });
    this.text(page, "Cashbrite | Practical money confidence for life after school", MARGIN, 22, 7.5, this.bold, MUTED);
    this.text(page, `${pageNumber} / 2`, PAGE_WIDTH - MARGIN - 20, 22, 7.5, this.regular, MUTED);
  }

  private drawLogo(page: PDFPage, x: number, y: number, width: number) {
    page.drawImage(this.logo, { x, y, width, height: width * (620 / 2600) });
  }

  private drawSparkle(page: PDFPage, x: number, y: number, scale: number, color: ReturnType<typeof rgb>) {
    page.drawSvgPath("M 10 0 L 12.5 7.5 L 20 10 L 12.5 12.5 L 10 20 L 7.5 12.5 L 0 10 L 7.5 7.5 Z", {
      x,
      y,
      scale,
      color,
    });
  }

  private label(page: PDFPage, copy: string, x: number, y: number, color: ReturnType<typeof rgb>, size = 8) {
    this.text(page, copy, x, y, size, this.bold, color);
  }

  private wrapped(
    page: PDFPage,
    copy: string,
    x: number,
    y: number,
    width: number,
    size: number,
    lineHeight: number,
    font: PDFFont,
    color: ReturnType<typeof rgb>,
  ) {
    this.lines(page, this.wrap(copy, font, size, width), x, y, size, lineHeight, font, color);
  }

  private wrap(copy: string, font: PDFFont, size: number, maxWidth: number) {
    const words = sanitise(copy).split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let line = "";
    words.forEach((word) => {
      const candidate = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, size) <= maxWidth) line = candidate;
      else {
        if (line) lines.push(line);
        line = word;
      }
    });
    if (line) lines.push(line);
    return lines;
  }

  private lines(
    page: PDFPage,
    lines: string[],
    x: number,
    y: number,
    size: number,
    lineHeight: number,
    font: PDFFont,
    color: ReturnType<typeof rgb>,
  ) {
    lines.forEach((line, index) => this.text(page, line, x, y - index * lineHeight, size, font, color));
  }

  private text(
    page: PDFPage,
    copy: string,
    x: number,
    y: number,
    size: number,
    font: PDFFont,
    color: ReturnType<typeof rgb>,
  ) {
    page.drawText(sanitise(copy), { x, y, size, font, color });
  }

  private centred(page: PDFPage, copy: string, centreX: number, y: number, size: number, font: PDFFont, color: ReturnType<typeof rgb>) {
    const text = sanitise(copy);
    page.drawText(text, { x: centreX - font.widthOfTextAtSize(text, size) / 2, y, size, font, color });
  }
}

function sanitise(value: string) {
  return value.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, "-").replace(/…/g, "...");
}
