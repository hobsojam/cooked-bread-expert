import { generateRoomCode } from "./room-code";
import {
  createDemoExpiry,
  type FeedbackSession,
  isExpired,
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
  expireSession(roomCode: string, now?: Date): Promise<void>;
  deleteSession(roomCode: string): Promise<void>;
}>;

const MAX_ROOM_CODE_ATTEMPTS = 8;

export class MemorySessionRepository implements SessionRepository {
  readonly #sessions = new Map<string, FeedbackSession>();

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

    this.#sessions.set(roomCode, session);

    return Promise.resolve(session);
  }

  getSessionByRoomCode(roomCode: string, now = new Date()) {
    const session = this.#sessions.get(roomCode);

    if (!session) {
      return Promise.resolve(null);
    }

    if (isExpired(now, session.expiresAt)) {
      this.#sessions.delete(roomCode);
      return Promise.resolve(null);
    }

    return Promise.resolve(session);
  }

  expireSession(roomCode: string, now = new Date()) {
    const session = this.#sessions.get(roomCode);

    if (!session) {
      return Promise.resolve();
    }

    this.#sessions.set(roomCode, {
      ...session,
      status: "expired",
      expiresAt: now,
    });

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
}

const globalForSessions = globalThis as typeof globalThis & {
  cookedBreadExpertSessionRepository?: MemorySessionRepository;
};

export function getSessionRepository(): SessionRepository {
  globalForSessions.cookedBreadExpertSessionRepository ??=
    new MemorySessionRepository();

  return globalForSessions.cookedBreadExpertSessionRepository;
}
