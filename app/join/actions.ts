"use server";

import { redirect } from "next/navigation";
import { normalizeRoomCode } from "../lib/room-code";

export async function joinDemoSession(formData: FormData) {
  const roomCode = normalizeRoomCode(readTextField(formData, "roomCode"));

  redirect(`/session/${roomCode}`);
}

function readTextField(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}
