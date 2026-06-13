import Link from "next/link";
import { normalizeRoomCode } from "../../lib/room-code";
import { DemoRibbon } from "../../components/DemoRibbon";
import { FeedbackModel } from "../../components/FeedbackModel";
import { PrivacyNotice } from "../../components/PrivacyNotice";
import { getSessionRepository } from "../../lib/session-repository";
import { feedbackCategories, feedbackOptions } from "../../lib/session-model";
import {
  recordFillerEvent,
  recordTimerEvent,
  submitSessionFeedback,
} from "./actions";

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
  const hasTimerEvents = Boolean(snapshot?.timerEvents.length);

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

        <aside className="room-side">
          <div className="session-panel" aria-label="Demo session controls">
            <div className="panel-header">
              <div>
                <span className="label">Room</span>
                <strong>{decodedRoomCode}</strong>
              </div>
              <span className="status">Demo</span>
            </div>

            <div className="timer">
              <span>Shared timer</span>
              <strong>{formatElapsed(snapshot?.elapsedSeconds ?? 0)}</strong>
              <div className="timer-actions">
                <EventButton
                  disabled={!session || snapshot?.isTimerRunning}
                  label={hasTimerEvents ? "Resume" : "Start"}
                  roomCode={decodedRoomCode}
                  type={hasTimerEvents ? "resume" : "start"}
                />
                <EventButton
                  disabled={!session || !snapshot?.isTimerRunning}
                  label="Pause"
                  roomCode={decodedRoomCode}
                  type="pause"
                />
                <EventButton
                  disabled={!session}
                  label="Stop"
                  roomCode={decodedRoomCode}
                  type="stop"
                />
              </div>
            </div>

            <div className="filler-row" aria-label="Filler word controls">
              {(["um", "ah", "like", "so", "other"] as const).map((word) => (
                <form action={recordFillerEvent} key={word}>
                  <input name="roomCode" type="hidden" value={decodedRoomCode} />
                  <input name="fillerType" type="hidden" value={word} />
                  <button disabled={!session} type="submit">
                    + {word} ({snapshot?.fillerCounts[word] ?? 0})
                  </button>
                </form>
              ))}
            </div>
          </div>
          <div className="form-panel">
            <h2>Summary release</h2>
            <p>
              The host releases the written summary after verbal feedback so the
              page supports the conversation instead of replacing it.
            </p>
            <div className="distribution-list">
              <span>
                Feedback givers: {snapshot?.feedbackSummary.evaluatorCount ?? 0}
              </span>
              <span>
                Quality observations:{" "}
                {snapshot?.feedbackSummary.qualityResponseCount ?? 0}
              </span>
              <span>
                Not observed: {snapshot?.feedbackSummary.notObservedCount ?? 0}
              </span>
            </div>
            <Link className="button-link" href={`/summary/${decodedRoomCode}`}>
              Preview released summary
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}

type EventButtonProps = Readonly<{
  disabled?: boolean;
  label: string;
  roomCode: string;
  type: "start" | "pause" | "resume" | "stop";
}>;

function EventButton({ disabled, label, roomCode, type }: EventButtonProps) {
  return (
    <form action={recordTimerEvent}>
      <input name="roomCode" type="hidden" value={roomCode} />
      <input name="type" type="hidden" value={type} />
      <button disabled={disabled} type="submit">
        {label}
      </button>
    </form>
  );
}

function formatElapsed(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
}
