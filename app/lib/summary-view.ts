import type {
  FeedbackCategory,
  FeedbackResponse,
} from "./session-model";
import type { SessionSnapshot } from "./session-repository";

export type CategorySummaryView = Readonly<{
  category: FeedbackCategory;
  distribution: string;
  comments: readonly CommentSummaryView[];
  notObservedCount: number;
}>;

export type CommentSummaryView = Readonly<{
  evaluatorAlias: string;
  comment: string;
  option: string;
}>;

export type SummaryInput = Pick<SessionSnapshot, "feedback" | "feedbackSummary">;

export function buildCategorySummaryViews(snapshot: SummaryInput) {
  // C9: group comments in a single pass instead of O(categories × feedback)
  const groupedComments = new Map<FeedbackCategory, CommentSummaryView[]>();
  for (const ef of snapshot.feedback) {
    for (const response of ef.responses) {
      if (hasComment(response)) {
        const list = groupedComments.get(response.category) ?? [];
        list.push({
          evaluatorAlias: ef.evaluatorAlias,
          comment: response.comment,
          option: response.option,
        });
        groupedComments.set(response.category, list);
      }
    }
  }

  return Object.entries(snapshot.feedbackSummary.byCategory)
    .map(([category, summary]) => {
      // C8: compute parts array first so we can filter on data, not a display string
      const distributionParts = Object.entries(summary.options)
        .filter(([, count]) => count > 0)
        .map(([option, count]) => `${option}: ${count}`);
      const comments = groupedComments.get(category as FeedbackCategory) ?? [];

      if (distributionParts.length === 0 && comments.length === 0) return null;

      return {
        category: category as FeedbackCategory,
        distribution: distributionParts.join(", "),
        comments,
        notObservedCount: summary.notObservedCount,
      };
    })
    .filter((s): s is NonNullable<typeof s> => s !== null);
}

function hasComment(
  response: FeedbackResponse,
): response is FeedbackResponse & Readonly<{ comment: string }> {
  return Boolean(response.comment?.trim());
}

export function formatElapsed(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return `${minutes}:${seconds}`;
}
