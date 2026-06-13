import Link from "next/link";
import { normalizeRoomCode } from "../../lib/room-code";
import { DemoRibbon } from "../../components/DemoRibbon";
import { PrivacyNotice } from "../../components/PrivacyNotice";
import { getSessionRepository } from "../../lib/session-repository";
import {
  buildCategorySummaryViews,
  formatElapsed,
} from "../../lib/summary-view";

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
  const decodedRoomCode = normalizeRoomCode(decodeURIComponent(roomCode));
  const snapshot =
    await getSessionRepository().getSessionSnapshot(decodedRoomCode);
  const categorySummaries = snapshot
    ? buildCategorySummaryViews(snapshot)
    : [];

  return (
    <main className="page-shell compact-shell summary-watermark">
      <DemoRibbon />

      <section className="summary-header">
        <div>
          <p className="eyebrow">Released demo summary</p>
          <h1>{decodedRoomCode}</h1>
          <p className="lede">
            {snapshot
              ? `Demo report for ${snapshot.session.speakerAlias}. Not for real feedback sessions or personal data.`
              : "This demo session was not found or has expired."}
          </p>
          <PrivacyNotice />
        </div>
        <Link className="button-link secondary" href={`/session/${decodedRoomCode}`}>
          Back to room
        </Link>
      </section>

      <section className="summary-grid">
        <div className="form-panel">
          <h2>Session observations</h2>
          <div className="distribution-list">
            <span>Elapsed time: {formatElapsed(snapshot?.elapsedSeconds ?? 0)}</span>
            <span>
              Filler words:{" "}
              {snapshot
                ? Object.entries(snapshot.fillerCounts)
                    .map(([word, count]) => `${word}: ${count}`)
                    .join(", ")
                : "No session data"}
            </span>
            <span>
              Feedback givers: {snapshot?.feedbackSummary.evaluatorCount ?? 0}
            </span>
          </div>
        </div>

        <div className="form-panel">
          <h2>Feedback coverage</h2>
          <p>
            Quality observations:{" "}
            {snapshot?.feedbackSummary.qualityResponseCount ?? 0}. Not
            observed: {snapshot?.feedbackSummary.notObservedCount ?? 0}.
          </p>
        </div>

        <div className="form-panel">
          <h2>Category distributions</h2>
          {categorySummaries.length > 0 ? (
            <div className="distribution-list">
              {categorySummaries.map((summary) => (
                <span key={summary.category}>
                  {summary.category}: {summary.distribution}
                </span>
              ))}
            </div>
          ) : (
            <p>No structured feedback has been submitted yet.</p>
          )}
        </div>

        <div className="form-panel">
          <h2>Comments</h2>
          {categorySummaries.some((summary) => summary.comments.length > 0) ? (
            <div className="comment-list">
              {categorySummaries.flatMap((summary) =>
                summary.comments.map((comment) => (
                  <figure key={`${summary.category}-${comment.evaluatorAlias}-${comment.comment}`}>
                    <blockquote>{comment.comment}</blockquote>
                    <figcaption>
                      {summary.category} - {comment.option} -{" "}
                      {comment.evaluatorAlias}
                    </figcaption>
                  </figure>
                )),
              )}
            </div>
          ) : (
            <p>No written comments have been submitted yet.</p>
          )}
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
