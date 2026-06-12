import Link from "next/link";
import { DemoRibbon } from "../components/DemoRibbon";
import { PrivacyNotice } from "../components/PrivacyNotice";
import { sampleRoomCode } from "../lib/demo-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default function CreatePage() {
  return (
    <main className="page-shell compact-shell">
      <DemoRibbon />

      <section className="flow-grid">
        <div>
          <p className="eyebrow">Create a demo session</p>
          <h1>Prepare the room</h1>
          <p className="lede">
            This mock flow shows the fields a host will set before sharing a
            room code. Nothing is saved yet.
          </p>
          <PrivacyNotice />
        </div>

        <form className="form-panel" aria-label="Create demo session form">
          <label>
            Speaker alias
            <input placeholder="Sample Speaker" />
          </label>
          <label>
            Presentation title
            <input placeholder="A practice talk" />
          </label>
          <label>
            Target time
            <select defaultValue="5-7">
              <option value="none">No target</option>
              <option value="3-5">3 to 5 minutes</option>
              <option value="5-7">5 to 7 minutes</option>
              <option value="custom">Custom later</option>
            </select>
          </label>
          <label className="checkbox-row">
            <input type="checkbox" defaultChecked />
            Include Language Confidence & Clarity
          </label>

          <div className="mock-result">
            <span className="label">Sample room</span>
            <strong>{sampleRoomCode}</strong>
            <p>
              In the real flow this button will create a short-lived room and
              show a private host link.
            </p>
          </div>

          <Link className="button-link" href={`/session/${sampleRoomCode}`}>
            Continue to demo room
          </Link>
        </form>
      </section>
    </main>
  );
}
