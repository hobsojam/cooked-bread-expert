import { buildLiveSummarySnapshotView } from "../../../lib/live-session-view";
import { createSnapshotResponse } from "../../../lib/snapshot-response";

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

  return createSnapshotResponse(roomCode, buildLiveSummarySnapshotView);
}
