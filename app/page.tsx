const feedbackOptions = [
  "Not observed",
  "Needs attention",
  "Developing",
  "Effective",
  "Strong",
  "Exceptional",
];

const categories = [
  "Message & Purpose",
  "Structure",
  "Audience Connection",
  "Evidence & Examples",
  "Physical Delivery",
  "Vocal Delivery",
  "Presence",
  "Language & Clarity",
  "Overall Impact",
  "Language Confidence & Clarity",
];

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default function Home() {
  return (
    <main className="page-shell">
      <div className="demo-ribbon">Demo system - do not enter real personal data</div>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Structured live feedback</p>
          <h1>Cooked Bread Expert</h1>
          <p className="lede">
            A demo-first tool for focused presentation feedback, shared timing,
            filler-word observations, and a summary released after discussion.
          </p>
          <div className="actions" aria-label="Demo actions">
            <button type="button">Create demo session</button>
            <button className="secondary" type="button">
              Join with room code
            </button>
          </div>
          <p className="privacy-note">
            Demo sessions expire after 6 hours. Use aliases and sample content
            only. Real sessions should be run on a self-hosted deployment with
            suitable data protection controls.
          </p>
        </div>

        <div className="session-panel" aria-label="Demo session preview">
          <div className="panel-header">
            <div>
              <span className="label">Room</span>
              <strong>BRIGHT-MAPLE-42</strong>
            </div>
            <span className="status">Demo</span>
          </div>

          <div className="timer">
            <span>Shared timer</span>
            <strong>00:00</strong>
            <div className="timer-actions">
              <button type="button">Start</button>
              <button type="button" disabled>
                Pause
              </button>
              <button type="button" disabled>
                Stop
              </button>
            </div>
          </div>

          <div className="filler-row" aria-label="Filler word controls">
            {["um", "ah", "like", "so", "other"].map((word) => (
              <button key={word} type="button">
                + {word}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="feedback-layout" aria-label="Feedback model preview">
        <div>
          <h2>Feedback choices</h2>
          <p>
            Feedback givers use text labels instead of visible scores. "Not
            observed" is treated as missing evidence, not as poor performance.
          </p>
          <div className="choice-grid">
            {feedbackOptions.map((option) => (
              <span key={option}>{option}</span>
            ))}
          </div>
        </div>

        <div>
          <h2>Categories</h2>
          <p>
            The optional language category focuses on communication
            effectiveness, not accent or native-like perfection.
          </p>
          <ul className="category-list">
            {categories.map((category) => (
              <li key={category}>{category}</li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
