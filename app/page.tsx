import Link from "next/link";
import { DemoRibbon } from "./components/DemoRibbon";
import { FeedbackModel } from "./components/FeedbackModel";
import { PrivacyNotice } from "./components/PrivacyNotice";
import { SessionPreview } from "./components/SessionPreview";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default function Home() {
  return (
    <main className="page-shell">
      <DemoRibbon />

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Structured live feedback</p>
          <h1>Cooked Bread Expert</h1>
          <p className="lede">
            A demo-first tool for focused presentation feedback, shared timing,
            filler-word observations, and a summary released after discussion.
          </p>
          <div className="actions" aria-label="Demo actions">
            <Link className="button-link" href="/create">
              Create demo session
            </Link>
            <Link className="button-link secondary" href="/join">
              Join with room code
            </Link>
          </div>
          <PrivacyNotice />
        </div>

        <SessionPreview />
      </section>

      <FeedbackModel />
    </main>
  );
}
