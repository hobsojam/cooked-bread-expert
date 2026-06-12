import Link from "next/link";
import { DemoRibbon } from "../../components/DemoRibbon";
import { PrivacyNotice } from "../../components/PrivacyNotice";
import { sampleRoomCode, summaryHighlights } from "../../lib/demo-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type SummaryPageProps = Readonly<{
  params: Promise<{
    roomCode: string;
  }>;
}>;

export default async function SummaryPage({ params }: SummaryPageProps) {
  const { roomCode } = await params;
  const decodedRoomCode = decodeURIComponent(roomCode || sampleRoomCode);

  return (
    <main className="page-shell compact-shell summary-watermark">
      <DemoRibbon />

      <section className="summary-header">
        <div>
          <p className="eyebrow">Released demo summary</p>
          <h1>{decodedRoomCode}</h1>
          <p className="lede">
            Demo report. Not for real feedback sessions or personal data.
          </p>
          <PrivacyNotice />
        </div>
        <Link className="button-link secondary" href={`/session/${decodedRoomCode}`}>
          Back to room
        </Link>
      </section>

      <section className="summary-grid">
        <div className="form-panel">
          <h2>Overall themes</h2>
          <ul className="summary-list">
            {summaryHighlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </div>

        <div className="form-panel">
          <h2>Most useful next step</h2>
          <p>
            Choose one improvement area and practice it in the next session
            rather than treating every comment as equally urgent.
          </p>
        </div>

        <div className="form-panel">
          <h2>Observed patterns</h2>
          <div className="distribution-list">
            <span>Vocal Delivery: Strong, Effective, Effective</span>
            <span>Structure: Effective, Effective, Developing</span>
            <span>Language Confidence & Clarity: Not observed, Effective</span>
          </div>
        </div>

        <div className="form-panel demo-export">
          <h2>Download</h2>
          <p>
            Export is a placeholder. Demo exports will be watermarked before
            real download support is added.
          </p>
          <button type="button" disabled>
            Download demo report
          </button>
        </div>
      </section>
    </main>
  );
}
