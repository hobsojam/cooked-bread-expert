"use server";

import { redirect } from "next/navigation";
import { getSessionRepository } from "../lib/session-repository";

export async function createDemoSession(formData: FormData) {
  const speakerAlias = readTextField(formData, "speakerAlias") || "Sample Speaker";
  const presentationTitle = readTextField(formData, "presentationTitle");

  const session = await getSessionRepository().createSession({
    speakerAlias,
    presentationTitle,
  });

  redirect(`/session/${session.roomCode}`);
}

function readTextField(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}
