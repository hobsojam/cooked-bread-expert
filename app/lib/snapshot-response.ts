import { NextResponse } from "next/server";
import { normalizeRoomCode } from "./room-code";
import type { SessionSnapshot } from "./session-repository";
import { getSessionRepository } from "./session-repository";

export async function createSnapshotResponse<TSnapshotView>(
  roomCode: string,
  buildView: (snapshot: SessionSnapshot) => TSnapshotView,
) {
  const decodedRoomCode = normalizeRoomCode(decodeURIComponent(roomCode));
  const snapshot =
    await getSessionRepository().getSessionSnapshot(decodedRoomCode);

  if (!snapshot) {
    return NextResponse.json(
      { snapshot: null },
      {
        headers: { "Cache-Control": "no-store" },
        status: 404,
      },
    );
  }

  return NextResponse.json(
    { snapshot: buildView(snapshot) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
