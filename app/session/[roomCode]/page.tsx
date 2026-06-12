import Link from "next/link";
import { normalizeRoomCode } from "../../lib/room-code";
import { DemoRibbon } from "../../components/DemoRibbon";
import { FeedbackModel } from "../../components/FeedbackModel";
import { PrivacyNotice } from "../../components/PrivacyNotice";
import { SessionPreview } from "../../components/SessionPreview";
import { getSessionRepository } from "../../lib/session-repository";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type SessionPageProps = Readonly<{
  params: Promise<{
    roomCode: string;
  }>;
}>;

export default async function SessionPage({ params }: SessionPageProps) {
  const { roomCode } = await params;
  const decodedRoomCode = normalizeRoomCode(decodeURIComponent(roomCode));
  const session = await getSessionRepository().getSessionByRoomCode(decodedRoomCode);

  return (
    <main className="page-shell compact-shell">
      <DemoRibbon />

      <section className="room-layout">
        <div className="room-main">
          <p className="eyebrow">Live demo room</p>
          <h1>{decodedRoomCode}</h1>
          <p className="lede">
            {session
              ? `Demo room for ${session.speakerAlias}. Shared observations are not persisted beyond server memory.`
              : "This demo room was not found or has expired. You can still inspect the page shape with the room code."}
          </p>
          <PrivacyNotice />
          <FeedbackModel />
        </div>

        <aside className="room-side">
          <SessionPreview roomCode={decodedRoomCode} />
          <div className="form-panel">
            <h2>Summary release</h2>
            <p>
              The host releases the written summary after verbal feedback so the
              page supports the conversation instead of replacing it.
            </p>
            <Link className="button-link" href={`/summary/${decodedRoomCode}`}>
              Preview released summary
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}
