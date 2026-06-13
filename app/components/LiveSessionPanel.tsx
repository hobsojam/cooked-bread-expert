"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type {
  FillerType,
  LiveSessionSnapshotView,
} from "../lib/live-session-view";
import {
  recordFillerEvent,
  recordTimerEvent,
} from "../session/[roomCode]/actions";

const fillerTypes = ["um", "ah", "like", "so", "other"] as const;

type LiveSessionPanelProps = Readonly<{
  initialSnapshot: LiveSessionSnapshotView | null;
  roomCode: string;
}>;

export function LiveSessionPanel({
  initialSnapshot,
  roomCode,
}: LiveSessionPanelProps) {
  const snapshot = useLiveSnapshot("/api/session", roomCode, initialSnapshot);
  const hasSession = Boolean(snapshot);
  const hasTimerEvents = Boolean(snapshot?.hasTimerEvents);

  return (
    <aside className="room-side">
      <div className="session-panel" aria-label="Demo session controls">
        <div className="panel-header">
          <div>
            <span className="label">Room</span>
            <strong>{roomCode}</strong>
          </div>
          <span className="status">
            {snapshot?.isTimerRunning ? "Live" : "Demo"}
          </span>
        </div>

        <div className="timer">
          <span>Shared timer</span>
          <strong>{snapshot?.elapsedLabel ?? "00:00"}</strong>
          <p className="live-refresh-note" aria-live="polite">
            {hasSession
              ? "Live state refreshes automatically for everyone in the room."
              : "This demo room was not found or has expired."}
          </p>
          <div className="timer-actions">
            <EventButton
              disabled={!hasSession || snapshot?.isTimerRunning}
              label={hasTimerEvents ? "Resume" : "Start"}
              roomCode={roomCode}
              type={hasTimerEvents ? "resume" : "start"}
            />
            <EventButton
              disabled={!hasSession || !snapshot?.isTimerRunning}
              label="Pause"
              roomCode={roomCode}
              type="pause"
            />
            <EventButton
              disabled={!hasSession}
              label="Stop"
              roomCode={roomCode}
              type="stop"
            />
          </div>
        </div>

        <div className="filler-row" aria-label="Filler word controls">
          {fillerTypes.map((word) => (
            <form action={recordFillerEvent} key={word}>
              <input name="roomCode" type="hidden" value={roomCode} />
              <input name="fillerType" type="hidden" value={word} />
              <button disabled={!hasSession} type="submit">
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
        <Link className="button-link" href={`/summary/${roomCode}`}>
          Preview released summary
        </Link>
      </div>
    </aside>
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

function useLiveSnapshot(
  apiBasePath: string,
  roomCode: string,
  initialSnapshot: LiveSessionSnapshotView | null,
) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function refresh() {
      try {
        const response = await fetch(
          `${apiBasePath}/${encodeURIComponent(roomCode)}`,
          {
            cache: "no-store",
            signal: controller.signal,
          },
        );

        if (!isMounted) {
          return;
        }

        if (response.status === 404) {
          setSnapshot(null);
          return;
        }

        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as {
          snapshot: LiveSessionSnapshotView | null;
        };
        setSnapshot(payload.snapshot);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          return;
        }
      }
    }

    const interval = window.setInterval(refresh, 2_000);
    void refresh();

    return () => {
      isMounted = false;
      controller.abort();
      window.clearInterval(interval);
    };
  }, [apiBasePath, roomCode]);

  return snapshot;
}
