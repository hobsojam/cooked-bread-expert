import { describe, expect, it } from "vitest";
import {
  DEMO_SESSION_RETENTION_HOURS,
  createDemoExpiry,
  feedbackOptions,
  isExpired,
  isQualityFeedbackOption,
  qualityFeedbackOptions,
} from "./session-model";

describe("session model", () => {
  it("keeps demo retention at six hours", () => {
    expect(DEMO_SESSION_RETENTION_HOURS).toBe(6);
  });

  it("calculates demo expiry from creation time", () => {
    const createdAt = new Date("2026-06-12T08:00:00.000Z");

    expect(createDemoExpiry(createdAt).toISOString()).toBe(
      "2026-06-12T14:00:00.000Z",
    );
  });

  it("treats expiry as inclusive at the expiry instant", () => {
    const expiresAt = new Date("2026-06-12T14:00:00.000Z");

    expect(isExpired(new Date("2026-06-12T13:59:59.999Z"), expiresAt)).toBe(
      false,
    );
    expect(isExpired(new Date("2026-06-12T14:00:00.000Z"), expiresAt)).toBe(
      true,
    );
  });

  it("keeps not observed separate from quality feedback options", () => {
    expect(feedbackOptions).toContain("Not observed");
    expect(qualityFeedbackOptions).not.toContain("Not observed");
    expect(isQualityFeedbackOption("Not observed")).toBe(false);
    expect(isQualityFeedbackOption("Effective")).toBe(true);
  });
});
