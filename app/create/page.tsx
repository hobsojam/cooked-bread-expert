import { createDemoSession } from "./actions";
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
            Create a volatile demo room in server memory. It may disappear
            before the 6-hour expiry if the demo server restarts.
          </p>
          <PrivacyNotice />
        </div>

        <form
          action={createDemoSession}
          className="form-panel"
          aria-label="Create demo session form"
        >
          <label>
            <span>Speaker alias</span>
            <input name="speakerAlias" placeholder="Sample Speaker" />
          </label>
          <label>
            <span>Presentation title</span>
            <input name="presentationTitle" placeholder="A practice talk" />
          </label>
          <label>
            <span>Target time</span>
            <select name="targetTime" defaultValue="5-7">
              <option value="none">No target</option>
              <option value="3-5">3 to 5 minutes</option>
              <option value="5-7">5 to 7 minutes</option>
              <option value="custom">Custom later</option>
            </select>
          </label>
          <label className="checkbox-row">
            <input name="includeLanguageConfidence" type="checkbox" defaultChecked />
            <span>Include Language Confidence & Clarity</span>
          </label>

          <div className="mock-result">
            <span className="label">Sample room</span>
            <strong>{sampleRoomCode}</strong>
            <p>
              Room codes are generated when you create a demo room. This sample
              shows the expected format.
            </p>
          </div>

          <button type="submit">Create demo room</button>
        </form>
      </section>
    </main>
  );
}
