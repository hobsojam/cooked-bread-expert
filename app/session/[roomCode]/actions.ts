"use server";

import { redirect } from "next/navigation";
import { normalizeRoomCode } from "../../lib/room-code";
import { getSessionRepository } from "../../lib/session-repository";
import type { TimerEventType } from "../../lib/session-model";

const timerEventTypes = new Set<TimerEventType>([
  "start",
  "pause",
  "resume",
  "stop",
]);
const fillerTypes = new Set(["um", "ah", "like", "so", "other"]);

export async function recordTimerEvent(formData: FormData) {
  const roomCode = normalizeRoomCode(readTextField(formData, "roomCode"));
  const type = readTextField(formData, "type") as TimerEventType;

  if (roomCode && timerEventTypes.has(type)) {
    await getSessionRepository().addTimerEvent({
      roomCode,
      type,
      createdByAlias: "Demo evaluator",
    });
  }

  redirect(`/session/${roomCode}`);
}

export async function recordFillerEvent(formData: FormData) {
  const roomCode = normalizeRoomCode(readTextField(formData, "roomCode"));
  const fillerType = readTextField(formData, "fillerType");

  if (roomCode && fillerTypes.has(fillerType)) {
    await getSessionRepository().addFillerEvent({
      roomCode,
      fillerType: fillerType as "um" | "ah" | "like" | "so" | "other",
      createdByAlias: "Demo evaluator",
    });
  }

  redirect(`/session/${roomCode}`);
}

function readTextField(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}
