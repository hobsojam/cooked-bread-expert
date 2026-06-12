import { categories, feedbackOptions } from "../lib/demo-data";

export function FeedbackModel() {
  return (
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
          The optional language category focuses on communication effectiveness,
          not accent or native-like perfection.
        </p>
        <ul className="category-list">
          {categories.map((category) => (
            <li key={category}>{category}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
