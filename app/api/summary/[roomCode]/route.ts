import { NextResponse } from "next/server";
import { normalizeRoomCode } from "../../../lib/room-code";
import { buildLiveSummarySnapshotView } from "../../../lib/live-session-view";
import { getSessionRepository } from "../../../lib/session-repository";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type SummaryApiRouteContext = Readonly<{
  params: Promise<{
    roomCode: string;
  }>;
}>;

export async function GET(_request: Request, { params }: SummaryApiRouteContext) {
  const { roomCode } = await params;
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
    { snapshot: buildLiveSummarySnapshotView(snapshot) },
    { headers: { "Cache-Control": "no-store" } },
  );
}
