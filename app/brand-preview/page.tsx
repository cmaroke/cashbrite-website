import type { Metadata } from "next";
import Image from "next/image";
import { DM_Serif_Display, Inter, Manrope } from "next/font/google";
import styles from "./preview.module.css";

const headline = Manrope({ subsets: ["latin"], variable: "--brand-heading" });
const body = Inter({ subsets: ["latin"], variable: "--brand-body" });
const editorial = DM_Serif_Display({ subsets: ["latin"], weight: "400", variable: "--brand-editorial" });
export const metadata: Metadata = {
  title: "Cashbrite 2.0 Brand Preview",
  robots: { index: false, follow: false },
};
const palette = { Ink: "#0F2A3A", Sage: "#54806B", Lime: "#C7F36B", Cream: "#F7F4EC", Mist: "#E8EAE6", White: "#FFFFFF" };

export default function BrandPreview() {
  return <div className={`${styles.brand} ${headline.variable} ${body.variable} ${editorial.variable}`}>
    <header><span>Cashbrite 2.0</span><span>Identity study / Phase 1</span></header>
    <section className={styles.cover}>
      <p className={styles.label}>A new chapter</p>
      <Image src="/brand/v2/wordmark.svg" alt="cashbrite" width={480} height={110} priority />
      <h1>Confidence, with a clearer perspective.</h1>
      <p>An editorial identity for the next generation of money decisions.</p>
    </section>
    <section><p className={styles.label}>01 / Identity</p><h2>A distinctive signature.</h2>
      <div className={styles.logos}>
        <div><Image src="/brand/v2/wordmark.svg" alt="Primary cashbrite wordmark" width={400} height={100} /></div>
        <div className={styles.dark}><Image src="/brand/v2/wordmark-white.svg" alt="Reversed cashbrite wordmark" width={400} height={100} /></div>
      </div>
      <div className={styles.applications}>
        <figure><figcaption>Navigation / small size</figcaption><Image src="/brand/v2/wordmark-compact.svg" alt="cashbrite compact wordmark" width={180} height={44} /></figure>
        <figure className={styles.stacked}><Image src="/brand/v2/wordmark.svg" alt="cashbrite" width={320} height={80} /><figcaption>MONEY CONFIDENCE FOR LIFE</figcaption></figure>
      </div>
      <div className={styles.marks}>{["mark", "favicon-light", "favicon-dark"].map((name) => <figure key={name}><Image src={`/brand/v2/${name}.svg`} alt={name.replaceAll("-", " ")} width={72} height={72} /><figcaption>{name.replaceAll("-", " ")}</figcaption></figure>)}</div>
      <div className={styles.colourApplications}>{["sage", "lime", "mist"].map((colour) => <div key={colour} style={{background: `var(--${colour})`}}><Image src={`/brand/v2/wordmark${colour === "sage" ? "-white" : ""}.svg`} alt={`cashbrite on ${colour}`} width={300} height={74} /></div>)}</div>
    </section>
    <section><p className={styles.label}>02 / Palette</p><h2>Grounded. Fresh. Clear.</h2><div className={styles.palette}>{Object.entries(palette).map(([name, hex]) => <div key={name}><div style={{background: hex}} /><strong>{name}</strong><span>{hex}</span></div>)}</div></section>
    <section><p className={styles.label}>03 / Typography</p><h2>Clarity in every word.</h2><p>Approved: DM Serif Display / Editorial headings · Manrope / Product headings, navigation & scores · Inter / Body & interface</p><div className={styles.type}><h1>Money confidence starts here.</h1><h2>Make room for what matters.</h2><h3>Your next step, made clearer.</h3><p>Understand your money habits and build confidence for university, work and independent life.</p><span className={styles.label}>YOUR MONEY / YOUR FUTURE</span></div></section>
    <section id="typography-comparison"><p className={styles.label}>Typography comparison / Option B approved</p><h2>Two directions. The same experience.</h2><p>Compare Manrope with DM Serif Display for prominent editorial headings. Body, interface, questions and scores stay consistent.</p>
      <div className={styles.comparison}>
        {[false, true].map((serif) => <article key={String(serif)} className={`${styles.specimen} ${serif ? styles.editorial : ""}`}>
          <h3>{serif ? "B / Approved editorial serif" : "A / Previous Manrope system"}</h3>
          <div className={styles.sample}><span className={styles.label}>Homepage hero</span><p className={styles.sampleHero}>Practical money confidence for life after school.</p><p>Understand your money habits, discover your knowledge gaps and build confidence for university, work and independent life.</p><div className={styles.actions}><a className={styles.primary} href="#controls">Take the Quiz</a><a className={styles.secondary} href="#controls">Explore Tools</a></div></div>
          <div className={styles.sample}><span className={styles.label}>Standard page H1</span><p className={styles.sampleTitle}>Money Calculators</p><p>Simple tools to help UK students, apprentices and school leavers plan their money with more confidence.</p></div>
          <div className={styles.sample}><span className={styles.label}>Editorial section H2</span><p className={styles.sampleSection}>Make everyday money feel more manageable.</p><p>Clear guidance for the money decisions that come next.</p></div>
          <div className={styles.sample}><span className={styles.label}>Quiz question / Manrope in both directions</span><p className={styles.sampleQuestion}>You want to save £500 for something important. What would you most likely do?</p><p>Put money regularly into a separate savings pot</p></div>
          <div className={styles.sampleScore}><span>Money Confidence Score · Illustrative</span><p className={styles.sampleNumber}>72<span>/100</span></p><p>Building Money Confidence</p></div>
        </article>)}
      </div>
    </section>
    <section><p className={styles.label}>04 / Product language</p><h2>Purposeful by design.</h2><div className={styles.product}>
      <div><h3>Start with a little perspective.</h3><p>Small steps can make everyday money decisions feel more manageable.</p><div className={styles.actions}><a className={styles.primary} href="#controls">Explore the identity</a><a className={styles.secondary} href="#score">View example score</a></div><a href="#controls">See interface examples →</a>
      <div id="controls" className={styles.controls}><label>First name<input placeholder="Your first name" /></label><label>Current stage<select defaultValue="School"><option>School</option><option>College</option><option>University</option><option>Other</option></select></label><label><input type="checkbox" /> Keep me updated</label><button disabled>Unavailable</button></div></div>
      <article id="score" className={styles.score}><p className={styles.label}>Money Confidence Score / Example</p><div>72<span>/100</span></div><h3>Building money confidence</h3><p>A solid foundation, with room to grow.</p><hr /><p>Focus next</p><strong>Budgeting · Credit · Student finance</strong></article>
    </div></section>
    <footer>Cashbrite / Phase 1 identity preview · Demonstration content</footer>
  </div>;
}
