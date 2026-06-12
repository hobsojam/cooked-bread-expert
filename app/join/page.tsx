import { joinDemoSession } from "./actions";
import { DemoRibbon } from "../components/DemoRibbon";
import { PrivacyNotice } from "../components/PrivacyNotice";
import { sampleRoomCode } from "../lib/demo-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default function JoinPage() {
  return (
    <main className="page-shell compact-shell">
      <DemoRibbon />

      <section className="flow-grid">
        <div>
          <p className="eyebrow">Join a demo room</p>
          <h1>Use a room code</h1>
          <p className="lede">
            Feedback givers join with an alias and a short room code. Demo
            rooms live only in server memory.
          </p>
          <PrivacyNotice />
        </div>

        <form
          action={joinDemoSession}
          className="form-panel"
          aria-label="Join demo session form"
        >
          <label>
            Your alias
            <input name="participantAlias" placeholder="Sample Evaluator" />
          </label>
          <label>
            Room code
            <input name="roomCode" defaultValue={sampleRoomCode} />
          </label>
          <p className="field-help">
            Use aliases in the public demo. Do not enter real names or personal
            feedback.
          </p>

          <button type="submit">Join demo room</button>
        </form>
      </section>
    </main>
  );
}
