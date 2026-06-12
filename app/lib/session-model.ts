export const DEMO_SESSION_RETENTION_HOURS = 6;

export const feedbackOptions = [
  "Not observed",
  "Needs attention",
  "Developing",
  "Effective",
  "Strong",
  "Exceptional",
] as const;

export const qualityFeedbackOptions = [
  "Needs attention",
  "Developing",
  "Effective",
  "Strong",
  "Exceptional",
] as const;

export const feedbackCategories = [
  "Message & Purpose",
  "Structure",
  "Audience Connection",
  "Evidence & Examples",
  "Physical Delivery",
  "Vocal Delivery",
  "Presence",
  "Language & Clarity",
  "Overall Impact",
  "Language Confidence & Clarity",
] as const;

export type FeedbackOption = (typeof feedbackOptions)[number];
export type QualityFeedbackOption = (typeof qualityFeedbackOptions)[number];
export type FeedbackCategory = (typeof feedbackCategories)[number];

export type SessionStatus =
  | "waiting"
  | "speaking"
  | "feedback-discussion"
  | "summary-released"
  | "expired";

export type ParticipantRole = "host" | "feedback-giver" | "speaker";

export type TimerEventType = "start" | "pause" | "resume" | "stop" | "adjust";

export type TimerEvent = Readonly<{
  type: TimerEventType;
  occurredAt: Date;
  createdByAlias: string;
  adjustmentSeconds?: number;
}>;

export type FillerEvent = Readonly<{
  fillerType: "um" | "ah" | "like" | "so" | "other";
  occurredAt: Date;
  createdByAlias: string;
}>;

export type FeedbackResponse = Readonly<{
  category: FeedbackCategory;
  option: FeedbackOption;
  comment?: string;
}>;

export type FeedbackSession = Readonly<{
  roomCode: string;
  status: SessionStatus;
  speakerAlias: string;
  presentationTitle?: string;
  createdAt: Date;
  expiresAt: Date;
}>;

export function createDemoExpiry(
  createdAt: Date,
  retentionHours = DEMO_SESSION_RETENTION_HOURS,
) {
  return new Date(createdAt.getTime() + retentionHours * 60 * 60 * 1000);
}

export function isExpired(now: Date, expiresAt: Date) {
  return now.getTime() >= expiresAt.getTime();
}

export function isQualityFeedbackOption(
  option: FeedbackOption,
): option is QualityFeedbackOption {
  return option !== "Not observed";
}
