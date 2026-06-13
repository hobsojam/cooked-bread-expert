import { describe, expect, it } from "vitest";
import {
  buildLiveSessionSnapshotView,
  buildLiveSummarySnapshotView,
} from "./live-session-view";
import type { SessionSnapshot } from "./session-repository";

describe("live session view", () => {
  it("builds a JSON-safe snapshot for polling clients", () => {
    const snapshot = createSnapshotFixture({
      elapsedSeconds: 125,
      isTimerRunning: true,
      timerEvents: [
        {
          type: "start",
          occurredAt: new Date("2026-06-12T08:00:00.000Z"),
          createdByAlias: "Sample Evaluator",
        },
      ],
      fillerCounts: {
        um: 2,
        ah: 0,
        like: 0,
        so: 1,
        other: 0,
      },
    });

    const view = buildLiveSessionSnapshotView(snapshot);

    expect(view).toEqual({
      roomCode: "BRIGHT-MAPLE-42",
      status: "speaking",
      speakerAlias: "Sample Speaker",
      presentationTitle: undefined,
      expiresAt: "2026-06-12T14:00:00.000Z",
      elapsedSeconds: 125,
      elapsedLabel: "02:05",
      hasTimerEvents: true,
      isTimerRunning: true,
      fillerCounts: {
        ah: 0,
        like: 0,
        other: 0,
        so: 1,
        um: 2,
      },
      fillerSummary: "um: 2, so: 1",
      feedbackSummary: {
        evaluatorCount: 1,
        qualityResponseCount: 1,
        notObservedCount: 0,
      },
    });
  });

  it("keeps written comments out of the room polling snapshot", () => {
    const snapshot = createSnapshotFixture({
      session: {
        roomCode: "BRIGHT-MAPLE-42",
        status: "feedback-discussion",
        speakerAlias: "Sample Speaker",
        createdAt: new Date("2026-06-12T08:00:00.000Z"),
        expiresAt: new Date("2026-06-12T14:00:00.000Z"),
      },
    });

    expect(buildLiveSessionSnapshotView(snapshot)).not.toHaveProperty(
      "categorySummaries",
    );
    expect(buildLiveSummarySnapshotView(snapshot).categorySummaries).toEqual([
      {
        category: "Structure",
        comments: [
          {
            comment: "Clear sections.",
            evaluatorAlias: "Evaluator One",
            option: "Effective",
          },
        ],
        distribution: "Effective: 1",
        notObservedCount: 0,
      },
    ]);
  });
});

function createSnapshotFixture(
  overrides: Partial<SessionSnapshot> = {},
): SessionSnapshot {
  const snapshot = {
    session: {
      roomCode: "BRIGHT-MAPLE-42",
      status: "speaking",
      speakerAlias: "Sample Speaker",
      createdAt: new Date("2026-06-12T08:00:00.000Z"),
      expiresAt: new Date("2026-06-12T14:00:00.000Z"),
    },
    timerEvents: [],
    fillerEvents: [],
    feedback: [
      {
        evaluatorAlias: "Evaluator One",
        submittedAt: new Date("2026-06-12T08:10:00.000Z"),
        responses: [
          {
            category: "Structure",
            option: "Effective",
            comment: "Clear sections.",
          },
        ],
      },
    ],
    feedbackSummary: {
      evaluatorCount: 1,
      responseCount: 1,
      qualityResponseCount: 1,
      notObservedCount: 0,
      byCategory: {
        Structure: {
          responseCount: 1,
          qualityResponseCount: 1,
          notObservedCount: 0,
          options: {
            "Not observed": 0,
            "Needs attention": 0,
            Developing: 0,
            Effective: 1,
            Strong: 0,
            Exceptional: 0,
          },
        },
      },
    },
    elapsedSeconds: 0,
    isTimerRunning: false,
    fillerCounts: {
      um: 0,
      ah: 0,
      like: 0,
      so: 0,
      other: 0,
    },
  } as SessionSnapshot;

  return {
    ...snapshot,
    ...overrides,
  };
}
