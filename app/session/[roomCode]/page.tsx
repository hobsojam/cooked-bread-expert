import { normalizeRoomCode } from "../../lib/room-code";
import { DemoRibbon } from "../../components/DemoRibbon";
import { FeedbackModel } from "../../components/FeedbackModel";
import { LiveSessionPanel } from "../../components/LiveSessionPanel";
import { PrivacyNotice } from "../../components/PrivacyNotice";
import { buildLiveSessionSnapshotView } from "../../lib/live-session-view";
import { getSessionRepository } from "../../lib/session-repository";
import { feedbackCategories, feedbackOptions } from "../../lib/session-model";
import { submitSessionFeedback } from "./actions";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type SessionPageProps = Readonly<{
  params: Promise<{
    roomCode: string;
  }>;
}>;

export default async function SessionPage({ params }: SessionPageProps) {
  const { roomCode } = await params;
  const decodedRoomCode = normalizeRoomCode(decodeURIComponent(roomCode));
  const snapshot =
    await getSessionRepository().getSessionSnapshot(decodedRoomCode);
  const session = snapshot?.session ?? null;
  const liveSnapshot = snapshot ? buildLiveSessionSnapshotView(snapshot) : null;

  return (
    <main className="page-shell compact-shell">
      <DemoRibbon />

      <section className="room-layout">
        <div className="room-main">
          <p className="eyebrow">Live demo room</p>
          <h1>{decodedRoomCode}</h1>
          <p className="lede">
            {session
              ? `Demo room for ${session.speakerAlias}. Shared observations are not persisted beyond server memory.`
              : "This demo room was not found or has expired. You can still inspect the page shape with the room code."}
          </p>
          <PrivacyNotice />
          {session ? (
            <form
              action={submitSessionFeedback}
              className="form-panel feedback-form"
              aria-label="Submit structured feedback"
            >
              <input name="roomCode" type="hidden" value={decodedRoomCode} />
              <h2>Structured feedback</h2>
              <label>
                <span>Your alias</span>
                <input name="evaluatorAlias" placeholder="Demo evaluator" />
              </label>
              {feedbackCategories.map((category, index) => (
                <div className="feedback-item" key={category}>
                  <label>
                    <span>{category}</span>
                    <select name={`option-${index}`} defaultValue="Not observed">
                      {feedbackOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>Optional note</span>
                    <textarea
                      name={`comment-${index}`}
                      placeholder="Focus on observable communication behavior."
                    />
                  </label>
                </div>
              ))}
              <button type="submit">Submit demo feedback</button>
            </form>
          ) : (
            <FeedbackModel />
          )}
        </div>

        <LiveSessionPanel
          initialSnapshot={liveSnapshot}
          roomCode={decodedRoomCode}
        />
      </section>
    </main>
  );
}
