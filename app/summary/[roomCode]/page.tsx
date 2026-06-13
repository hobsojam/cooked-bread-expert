import Link from "next/link";
import { normalizeRoomCode } from "../../lib/room-code";
import { DemoRibbon } from "../../components/DemoRibbon";
import { LiveSummaryReport } from "../../components/LiveSummaryReport";
import { PrivacyNotice } from "../../components/PrivacyNotice";
import { buildLiveSummarySnapshotView } from "../../lib/live-session-view";
import { getSessionRepository } from "../../lib/session-repository";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type SummaryPageProps = Readonly<{
  params: Promise<{
    roomCode: string;
  }>;
}>;

export default async function SummaryPage({ params }: SummaryPageProps) {
  const { roomCode } = await params;
  const decodedRoomCode = normalizeRoomCode(decodeURIComponent(roomCode));
  const snapshot =
    await getSessionRepository().getSessionSnapshot(decodedRoomCode);
  const liveSnapshot = snapshot ? buildLiveSummarySnapshotView(snapshot) : null;

  return (
    <main className="page-shell compact-shell summary-watermark">
      <DemoRibbon />

      <section className="summary-header">
        <div>
          <p className="eyebrow">Released demo summary</p>
          <h1>{decodedRoomCode}</h1>
          <p className="lede">
            {snapshot
              ? `Demo report for ${snapshot.session.speakerAlias}. Not for real feedback sessions or personal data.`
              : "This demo session was not found or has expired."}
          </p>
          <PrivacyNotice />
        </div>
        <Link className="button-link secondary" href={`/session/${decodedRoomCode}`}>
          Back to room
        </Link>
      </section>

      <LiveSummaryReport
        initialSnapshot={liveSnapshot}
        roomCode={decodedRoomCode}
      />
    </main>
  );
}
