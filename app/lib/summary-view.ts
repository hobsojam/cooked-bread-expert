import type {
  EvaluatorFeedback,
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

export function buildCategorySummaryViews(snapshot: SessionSnapshot) {
  return Object.entries(snapshot.feedbackSummary.byCategory)
    .map(([category, summary]) => {
      const distribution = Object.entries(summary.options)
        .filter(([, count]) => count > 0)
        .map(([option, count]) => `${option}: ${count}`)
        .join(", ");

      return {
        category: category as FeedbackCategory,
        distribution: distribution || "No feedback yet",
        comments: commentsForCategory(
          snapshot.feedback,
          category as FeedbackCategory,
        ),
        notObservedCount: summary.notObservedCount,
      };
    })
    .filter(
      (summary) =>
        summary.distribution !== "No feedback yet" || summary.comments.length > 0,
    );
}

export function commentsForCategory(
  feedback: readonly EvaluatorFeedback[],
  category: FeedbackCategory,
) {
  const comments: CommentSummaryView[] = [];

  for (const evaluatorFeedback of feedback) {
    for (const response of evaluatorFeedback.responses) {
      if (response.category === category && hasComment(response)) {
        comments.push({
          evaluatorAlias: evaluatorFeedback.evaluatorAlias,
          comment: response.comment,
          option: response.option,
        });
      }
    }
  }

  return comments;
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
