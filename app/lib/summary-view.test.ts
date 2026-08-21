import { describe, expect, it } from "vitest";
import { summarizeFeedback } from "./session-repository";
import {
  buildCategorySummaryViews,
  formatElapsed,
  type SummaryInput,
} from "./summary-view";

describe("summary view", () => {
  it("formats elapsed time", () => {
    expect(formatElapsed(0)).toBe("00:00");
    expect(formatElapsed(125)).toBe("02:05");
  });

  it("builds category distributions and comments", () => {
    const feedback: SummaryInput["feedback"] = [
      {
        evaluatorAlias: "Evaluator One",
        submittedAt: new Date("2026-06-12T08:00:00.000Z"),
        responses: [
          {
            category: "Structure",
            option: "Effective",
            comment: "Clear sections.",
          },
          {
            category: "Vocal Delivery",
            option: "Not observed",
          },
        ],
      },
    ];

    const snapshot: SummaryInput = {
      feedback,
      feedbackSummary: summarizeFeedback(feedback),
    };

    const views = buildCategorySummaryViews(snapshot);

    expect(views).toEqual([
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
      {
        category: "Vocal Delivery",
        comments: [],
        distribution: "Not observed: 1",
        notObservedCount: 1,
      },
    ]);
  });
});
