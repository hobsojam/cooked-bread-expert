"use client";

import type { LiveSummarySnapshotView } from "../lib/live-session-view";
import { usePollingSnapshot } from "./usePollingSnapshot";

type LiveSummaryReportProps = Readonly<{
  initialSnapshot: LiveSummarySnapshotView | null;
  roomCode: string;
}>;

export function LiveSummaryReport({
  initialSnapshot,
  roomCode,
}: LiveSummaryReportProps) {
  const snapshot = usePollingSnapshot<LiveSummarySnapshotView>(
    `/api/summary/${encodeURIComponent(roomCode)}`,
    initialSnapshot,
  );
  const categorySummaries = snapshot?.categorySummaries ?? [];

  return (
    <section className="summary-grid">
      <div className="form-panel">
        <h2>Session observations</h2>
        <div className="distribution-list">
          <span>Elapsed time: {snapshot?.elapsedLabel ?? "00:00"}</span>
          <span>
            Filler words:{" "}
            {snapshot ? snapshot.fillerSummary : "No session data"}
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
          {snapshot?.feedbackSummary.qualityResponseCount ?? 0}. Not observed:{" "}
          {snapshot?.feedbackSummary.notObservedCount ?? 0}.
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
              summary.comments.map((comment, i) => (
                <figure key={`${summary.category}-${i}`}>
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
          Export is a placeholder. Demo exports will be watermarked before real
          download support is added.
        </p>
        <button type="button" disabled>
          Download demo report
        </button>
      </div>
    </section>
  );
}
