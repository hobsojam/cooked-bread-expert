import { generateRoomCode } from "./room-code";
import {
  createDemoExpiry,
  type EvaluatorFeedback,
  type FillerEvent,
  type FeedbackCategory,
  type FeedbackOption,
  feedbackCategories,
  feedbackOptions,
  type FeedbackSession,
  isExpired,
  isQualityFeedbackOption,
  type TimerEvent,
  type TimerEventType,
} from "./session-model";

export type CreateSessionInput = Readonly<{
  speakerAlias: string;
  presentationTitle?: string;
  now?: Date;
  roomCodeGenerator?: () => string;
}>;

export type SessionRepository = Readonly<{
  createSession(input: CreateSessionInput): Promise<FeedbackSession>;
  getSessionByRoomCode(roomCode: string, now?: Date): Promise<FeedbackSession | null>;
  getSessionSnapshot(roomCode: string, now?: Date): Promise<SessionSnapshot | null>;
  addTimerEvent(input: AddTimerEventInput): Promise<void>;
  addFillerEvent(input: AddFillerEventInput): Promise<void>;
  submitFeedback(input: SubmitFeedbackInput): Promise<boolean>;
  expireSession(roomCode: string, now?: Date): Promise<void>;
  deleteSession(roomCode: string): Promise<void>;
}>;

const MAX_ROOM_CODE_ATTEMPTS = 8;
const fillerTypes = ["um", "ah", "like", "so", "other"] as const;

type FillerType = (typeof fillerTypes)[number];

export type AddTimerEventInput = Readonly<{
  roomCode: string;
  type: TimerEventType;
  createdByAlias: string;
  occurredAt?: Date;
  adjustmentSeconds?: number;
}>;

export type AddFillerEventInput = Readonly<{
  roomCode: string;
  fillerType: FillerType;
  createdByAlias: string;
  occurredAt?: Date;
}>;

export type SessionSnapshot = Readonly<{
  session: FeedbackSession;
  timerEvents: readonly TimerEvent[];
  fillerEvents: readonly FillerEvent[];
  feedback: readonly EvaluatorFeedback[];
  feedbackSummary: FeedbackSummary;
  elapsedSeconds: number;
  isTimerRunning: boolean;
  fillerCounts: Readonly<Record<FillerType, number>>;
}>;

export type SubmitFeedbackInput = Readonly<{
  roomCode: string;
  evaluatorAlias: string;
  responses: readonly SubmitFeedbackResponseInput[];
  submittedAt?: Date;
}>;

export type SubmitFeedbackResponseInput = Readonly<{
  category: FeedbackCategory;
  option: FeedbackOption;
  comment?: string;
}>;

export type FeedbackSummary = Readonly<{
  evaluatorCount: number;
  responseCount: number;
  qualityResponseCount: number;
  notObservedCount: number;
  byCategory: Readonly<Record<FeedbackCategory, CategoryFeedbackSummary>>;
}>;

export type CategoryFeedbackSummary = Readonly<{
  responseCount: number;
  qualityResponseCount: number;
  notObservedCount: number;
  options: Readonly<Record<FeedbackOption, number>>;
}>;

type SessionRecord = {
  session: FeedbackSession;
  timerEvents: TimerEvent[];
  fillerEvents: FillerEvent[];
  feedback: EvaluatorFeedback[];
};

type MutableCategoryFeedbackSummary = {
  responseCount: number;
  qualityResponseCount: number;
  notObservedCount: number;
  options: Record<FeedbackOption, number>;
};

export class MemorySessionRepository implements SessionRepository {
  readonly #sessions = new Map<string, SessionRecord>();

  createSession({
    speakerAlias,
    presentationTitle,
    now = new Date(),
    roomCodeGenerator = generateRoomCode,
  }: CreateSessionInput) {
    const roomCode = this.#generateUniqueRoomCode(roomCodeGenerator);
    const session: FeedbackSession = {
      roomCode,
      status: "waiting",
      speakerAlias,
      presentationTitle: presentationTitle || undefined,
      createdAt: now,
      expiresAt: createDemoExpiry(now),
    };

    this.#sessions.set(roomCode, {
      session,
      timerEvents: [],
      fillerEvents: [],
      feedback: [],
    });

    return Promise.resolve(session);
  }

  getSessionByRoomCode(roomCode: string, now = new Date()) {
    const record = this.#sessions.get(roomCode);

    if (!record) {
      return Promise.resolve(null);
    }

    if (isExpired(now, record.session.expiresAt)) {
      this.#sessions.delete(roomCode);
      return Promise.resolve(null);
    }

    return Promise.resolve(record.session);
  }

  async getSessionSnapshot(roomCode: string, now = new Date()) {
    const session = await this.getSessionByRoomCode(roomCode, now);

    if (!session) {
      return null;
    }

    const record = this.#sessions.get(roomCode);

    if (!record) {
      return null;
    }

    return {
      session,
      timerEvents: [...record.timerEvents],
      fillerEvents: [...record.fillerEvents],
      feedback: [...record.feedback],
      feedbackSummary: summarizeFeedback(record.feedback),
      elapsedSeconds: calculateElapsedSeconds(record.timerEvents, now),
      isTimerRunning: isTimerRunning(record.timerEvents),
      fillerCounts: countFillers(record.fillerEvents),
    };
  }

  async addTimerEvent({
    roomCode,
    type,
    createdByAlias,
    occurredAt = new Date(),
    adjustmentSeconds,
  }: AddTimerEventInput) {
    const record = await this.#getMutableRecord(roomCode, occurredAt);

    if (!record) {
      return;
    }

    record.timerEvents.push({
      type,
      occurredAt,
      createdByAlias,
      adjustmentSeconds,
    });

    record.session = {
      ...record.session,
      status: type === "stop" ? "feedback-discussion" : "speaking",
    };
  }

  async addFillerEvent({
    roomCode,
    fillerType,
    createdByAlias,
    occurredAt = new Date(),
  }: AddFillerEventInput) {
    const record = await this.#getMutableRecord(roomCode, occurredAt);

    if (!record) {
      return;
    }

    record.fillerEvents.push({
      fillerType,
      occurredAt,
      createdByAlias,
    });
  }

  async submitFeedback({
    roomCode,
    evaluatorAlias,
    responses,
    submittedAt = new Date(),
  }: SubmitFeedbackInput) {
    const record = await this.#getMutableRecord(roomCode, submittedAt);

    if (!record) {
      return false;
    }

    if (record.feedback.some((f) => f.evaluatorAlias === evaluatorAlias)) {
      return false;
    }

    record.feedback.push({
      evaluatorAlias,
      submittedAt,
      responses: responses.map((response) => ({
        category: response.category,
        option: response.option,
        comment: response.comment || undefined,
      })),
    });

    return true;
  }

  expireSession(roomCode: string, now = new Date()) {
    const record = this.#sessions.get(roomCode);

    if (!record) {
      return Promise.resolve();
    }

    record.session = {
      ...record.session,
      status: "expired",
      expiresAt: now,
    };

    return Promise.resolve();
  }

  deleteSession(roomCode: string) {
    this.#sessions.delete(roomCode);

    return Promise.resolve();
  }

  #generateUniqueRoomCode(roomCodeGenerator: () => string) {
    for (let attempt = 0; attempt < MAX_ROOM_CODE_ATTEMPTS; attempt += 1) {
      const roomCode = roomCodeGenerator();

      if (!this.#sessions.has(roomCode)) {
        return roomCode;
      }
    }

    throw new Error("Could not generate a unique room code.");
  }

  async #getMutableRecord(roomCode: string, now: Date) {
    const session = await this.getSessionByRoomCode(roomCode, now);

    if (!session) {
      return null;
    }

    return this.#sessions.get(roomCode) ?? null;
  }
}

const globalForSessions = globalThis as typeof globalThis & {
  cookedBreadExpertSessionRepository?: MemorySessionRepository;
};

export function getSessionRepository(): SessionRepository {
  globalForSessions.cookedBreadExpertSessionRepository ??=
    new MemorySessionRepository();

  return globalForSessions.cookedBreadExpertSessionRepository;
}

export function calculateElapsedSeconds(
  timerEvents: readonly TimerEvent[],
  now = new Date(),
) {
  let elapsedMilliseconds = 0;
  let activeStart: Date | null = null;

  for (const event of timerEvents) {
    if (event.type === "start" || event.type === "resume") {
      activeStart = event.occurredAt;
    }

    if ((event.type === "pause" || event.type === "stop") && activeStart) {
      elapsedMilliseconds += event.occurredAt.getTime() - activeStart.getTime();
      activeStart = null;
    }

    if (event.type === "adjust") {
      elapsedMilliseconds += (event.adjustmentSeconds ?? 0) * 1000;
    }
  }

  if (activeStart) {
    elapsedMilliseconds += now.getTime() - activeStart.getTime();
  }

  return Math.max(0, Math.floor(elapsedMilliseconds / 1000));
}

export function isTimerRunning(timerEvents: readonly TimerEvent[]) {
  const lastEvent = timerEvents.at(-1);

  return lastEvent?.type === "start" || lastEvent?.type === "resume";
}

function countFillers(fillerEvents: readonly FillerEvent[]) {
  const counts = Object.fromEntries(
    fillerTypes.map((fillerType) => [fillerType, 0]),
  ) as Record<FillerType, number>;

  for (const event of fillerEvents) {
    counts[event.fillerType] += 1;
  }

  return counts;
}

export function summarizeFeedback(feedback: readonly EvaluatorFeedback[]) {
  const byCategory = Object.fromEntries(
    feedbackCategories.map((category) => [
      category,
      {
        responseCount: 0,
        qualityResponseCount: 0,
        notObservedCount: 0,
        options: Object.fromEntries(
          feedbackOptions.map((option) => [option, 0]),
        ) as Record<FeedbackOption, number>,
      },
    ]),
  ) as Record<FeedbackCategory, MutableCategoryFeedbackSummary>;

  let responseCount = 0;
  let qualityResponseCount = 0;
  let notObservedCount = 0;

  for (const evaluatorFeedback of feedback) {
    for (const response of evaluatorFeedback.responses) {
      responseCount += 1;
      byCategory[response.category].responseCount += 1;
      byCategory[response.category].options[response.option] += 1;

      if (isQualityFeedbackOption(response.option)) {
        qualityResponseCount += 1;
        byCategory[response.category].qualityResponseCount += 1;
      } else {
        notObservedCount += 1;
        byCategory[response.category].notObservedCount += 1;
      }
    }
  }

  return {
    evaluatorCount: feedback.length,
    responseCount,
    qualityResponseCount,
    notObservedCount,
    byCategory,
  };
}
