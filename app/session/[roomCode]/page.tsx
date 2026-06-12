import Link from "next/link";
import { DemoRibbon } from "../../components/DemoRibbon";
import { FeedbackModel } from "../../components/FeedbackModel";
import { PrivacyNotice } from "../../components/PrivacyNotice";
import { SessionPreview } from "../../components/SessionPreview";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type SessionPageProps = {
  params: Promise<{
    roomCode: string;
  }>;
};

export default async function SessionPage({ params }: SessionPageProps) {
  const { roomCode } = await params;
  const decodedRoomCode = decodeURIComponent(roomCode);

  return (
    <main className="page-shell compact-shell">
      <DemoRibbon />

      <section className="room-layout">
        <div className="room-main">
          <p className="eyebrow">Live demo room</p>
          <h1>{decodedRoomCode}</h1>
          <p className="lede">
            This room preview shows the shared observations and feedback model.
            The controls are not connected to persistence yet.
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
