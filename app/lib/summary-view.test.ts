import { describe, expect, it } from "vitest";
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
    const snapshot = {
      feedback: [
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
      ],
      feedbackSummary: {
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
          "Vocal Delivery": {
            responseCount: 1,
            qualityResponseCount: 0,
            notObservedCount: 1,
            options: {
              "Not observed": 1,
              "Needs attention": 0,
              Developing: 0,
              Effective: 0,
              Strong: 0,
              Exceptional: 0,
            },
          },
        },
      },
    } satisfies SummaryInput;

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
