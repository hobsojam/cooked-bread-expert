import {
  buildCategorySummaryViews,
  formatElapsed,
} from "./summary-view";
import type { SessionSnapshot } from "./session-repository";
import type { SessionStatus } from "./session-model";

export type FillerType = "um" | "ah" | "like" | "so" | "other";

export type LiveFeedbackSummaryView = Readonly<{
  evaluatorCount: number;
  qualityResponseCount: number;
  notObservedCount: number;
}>;

export type LiveSessionSnapshotView = Readonly<{
  roomCode: string;
  status: SessionStatus;
  speakerAlias: string;
  presentationTitle?: string;
  expiresAt: string;
  elapsedSeconds: number;
  elapsedLabel: string;
  isTimerRunning: boolean;
  hasTimerEvents: boolean;
  fillerCounts: Readonly<Record<FillerType, number>>;
  fillerSummary: string;
  feedbackSummary: LiveFeedbackSummaryView;
}>;

export type LiveSummarySnapshotView = LiveSessionSnapshotView &
  Readonly<{
  categorySummaries: ReturnType<typeof buildCategorySummaryViews>;
}>;

export function buildLiveSessionSnapshotView(
  snapshot: SessionSnapshot,
): LiveSessionSnapshotView {
  return {
    roomCode: snapshot.session.roomCode,
    status: snapshot.session.status,
    speakerAlias: snapshot.session.speakerAlias,
    presentationTitle: snapshot.session.presentationTitle,
    expiresAt: snapshot.session.expiresAt.toISOString(),
    elapsedSeconds: snapshot.elapsedSeconds,
    elapsedLabel: formatElapsed(snapshot.elapsedSeconds),
    isTimerRunning: snapshot.isTimerRunning,
    hasTimerEvents: snapshot.timerEvents.length > 0,
    fillerCounts: snapshot.fillerCounts,
    fillerSummary: buildFillerSummary(snapshot.fillerCounts),
    feedbackSummary: {
      evaluatorCount: snapshot.feedbackSummary.evaluatorCount,
      qualityResponseCount: snapshot.feedbackSummary.qualityResponseCount,
      notObservedCount: snapshot.feedbackSummary.notObservedCount,
    },
  };
}

export function buildLiveSummarySnapshotView(
  snapshot: SessionSnapshot,
): LiveSummarySnapshotView {
  return {
    ...buildLiveSessionSnapshotView(snapshot),
    categorySummaries: buildCategorySummaryViews(snapshot),
  };
}

function buildFillerSummary(counts: Readonly<Record<FillerType, number>>) {
  return (
    Object.entries(counts)
      .filter(([, count]) => count > 0)
      .map(([word, count]) => `${word}: ${count}`)
      .join(", ") || "None recorded"
  );
}
