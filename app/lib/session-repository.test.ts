import { describe, expect, it } from "vitest";
import {
  calculateElapsedSeconds,
  MemorySessionRepository,
} from "./session-repository";

describe("MemorySessionRepository", () => {
  it("creates short-lived demo sessions", async () => {
    const repository = new MemorySessionRepository();
    const createdAt = new Date("2026-06-12T08:00:00.000Z");

    const session = await repository.createSession({
      speakerAlias: "Sample Speaker",
      now: createdAt,
      roomCodeGenerator: () => "BRIGHT-MAPLE-42",
    });

    expect(session).toMatchObject({
      roomCode: "BRIGHT-MAPLE-42",
      status: "waiting",
      speakerAlias: "Sample Speaker",
    });
    expect(session.expiresAt.toISOString()).toBe("2026-06-12T14:00:00.000Z");
  });

  it("does not return expired sessions", async () => {
    const repository = new MemorySessionRepository();
    const session = await repository.createSession({
      speakerAlias: "Sample Speaker",
      now: new Date("2026-06-12T08:00:00.000Z"),
      roomCodeGenerator: () => "BRIGHT-MAPLE-42",
    });

    const found = await repository.getSessionByRoomCode(
      session.roomCode,
      new Date("2026-06-12T14:00:00.000Z"),
    );

    expect(found).toBeNull();
  });

  it("retries room-code collisions", async () => {
    const repository = new MemorySessionRepository();
    const roomCodes = ["BRIGHT-MAPLE-42", "BRIGHT-MAPLE-42", "CLEAR-RIVER-09"];

    const first = await repository.createSession({
      speakerAlias: "First Speaker",
      roomCodeGenerator: () => roomCodes.shift() ?? "FRESH-HARBOR-10",
    });
    const second = await repository.createSession({
      speakerAlias: "Second Speaker",
      roomCodeGenerator: () => roomCodes.shift() ?? "FRESH-HARBOR-10",
    });

    expect(first.roomCode).toBe("BRIGHT-MAPLE-42");
    expect(second.roomCode).toBe("CLEAR-RIVER-09");
  });

  it("allows explicit deletion", async () => {
    const repository = new MemorySessionRepository();
    const session = await repository.createSession({
      speakerAlias: "Sample Speaker",
      roomCodeGenerator: () => "BRIGHT-MAPLE-42",
    });

    await repository.deleteSession(session.roomCode);

    await expect(repository.getSessionByRoomCode(session.roomCode)).resolves.toBeNull();
  });

  it("calculates elapsed timer time across pause and resume events", () => {
    const timerEvents = [
      {
        type: "start",
        occurredAt: new Date("2026-06-12T08:00:00.000Z"),
        createdByAlias: "Sample Evaluator",
      },
      {
        type: "pause",
        occurredAt: new Date("2026-06-12T08:01:00.000Z"),
        createdByAlias: "Sample Evaluator",
      },
      {
        type: "resume",
        occurredAt: new Date("2026-06-12T08:02:00.000Z"),
        createdByAlias: "Sample Evaluator",
      },
    ] as const;

    expect(
      calculateElapsedSeconds(
        timerEvents,
        new Date("2026-06-12T08:03:30.000Z"),
      ),
    ).toBe(150);
  });

  it("stores timer and filler events in the session snapshot", async () => {
    const repository = new MemorySessionRepository();
    const session = await repository.createSession({
      speakerAlias: "Sample Speaker",
      now: new Date("2026-06-12T08:00:00.000Z"),
      roomCodeGenerator: () => "BRIGHT-MAPLE-42",
    });

    await repository.addTimerEvent({
      roomCode: session.roomCode,
      type: "start",
      createdByAlias: "Sample Evaluator",
      occurredAt: new Date("2026-06-12T08:00:00.000Z"),
    });
    await repository.addFillerEvent({
      roomCode: session.roomCode,
      fillerType: "um",
      createdByAlias: "Sample Evaluator",
      occurredAt: new Date("2026-06-12T08:00:10.000Z"),
    });
    await repository.addFillerEvent({
      roomCode: session.roomCode,
      fillerType: "um",
      createdByAlias: "Sample Evaluator",
      occurredAt: new Date("2026-06-12T08:00:12.000Z"),
    });

    const snapshot = await repository.getSessionSnapshot(
      session.roomCode,
      new Date("2026-06-12T08:01:05.000Z"),
    );

    expect(snapshot?.elapsedSeconds).toBe(65);
    expect(snapshot?.isTimerRunning).toBe(true);
    expect(snapshot?.fillerCounts.um).toBe(2);
    expect(snapshot?.fillerCounts.ah).toBe(0);
  });

  it("does not mutate expired sessions", async () => {
    const repository = new MemorySessionRepository();
    const session = await repository.createSession({
      speakerAlias: "Sample Speaker",
      now: new Date("2026-06-12T08:00:00.000Z"),
      roomCodeGenerator: () => "BRIGHT-MAPLE-42",
    });

    await repository.addFillerEvent({
      roomCode: session.roomCode,
      fillerType: "so",
      createdByAlias: "Sample Evaluator",
      occurredAt: new Date("2026-06-12T14:00:00.000Z"),
    });

    await expect(
      repository.getSessionSnapshot(
        session.roomCode,
        new Date("2026-06-12T14:00:00.000Z"),
      ),
    ).resolves.toBeNull();
  });
});
