import { describe, expect, it } from "vitest";
import {
  ROOM_CODE_PATTERN,
  ROOM_CODE_SPACE_SIZE,
  generateRoomCode,
  isValidRoomCode,
  normalizeRoomCode,
} from "./room-code";

describe("room codes", () => {
  it("generates readable room codes", () => {
    expect(generateRoomCode()).toMatch(ROOM_CODE_PATTERN);
  });

  it("uses deterministic random input when provided", () => {
    const values = [0, 0.49, 0.42];
    const code = generateRoomCode(() => values.shift() ?? 0);

    expect(code).toBe("AMBER-PLANET-42");
  });

  it("normalizes user-entered codes", () => {
    expect(normalizeRoomCode(" bright maple 42 ")).toBe("BRIGHT-MAPLE-42");
  });

  it("validates normalized room code format", () => {
    expect(isValidRoomCode("BRIGHT-MAPLE-42")).toBe(true);
    expect(isValidRoomCode("bright-maple-42")).toBe(false);
    expect(isValidRoomCode("BRIGHT-MAPLE-7")).toBe(false);
  });

  it("keeps enough combinations for short-lived demo rooms", () => {
    expect(ROOM_CODE_SPACE_SIZE).toBeGreaterThanOrEqual(100000);
  });
});
