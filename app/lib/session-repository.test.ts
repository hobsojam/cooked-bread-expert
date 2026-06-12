import { describe, expect, it } from "vitest";
import { MemorySessionRepository } from "./session-repository";

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
});
