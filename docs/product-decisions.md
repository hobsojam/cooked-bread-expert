# Product Decisions

## Product Name

The product name is Cooked Bread Expert.

## Positioning

Cooked Bread Expert is an independent structured feedback tool for speeches, presentations, talks, and practice sessions.

It is feedback-oriented, not competition-oriented.

## MVP Shape

- One speaker per session.
- Multiple feedback givers per session.
- No login.
- Pseudo-random room code for joining.
- Separate long, unguessable host and summary tokens when implemented.
- Host creates the session.
- Host releases the summary after verbal feedback.
- Summary should not be shown during the speech or immediately distract from discussion.

## Feedback Scale

Visible choices:

- Not observed
- Needs attention
- Developing
- Effective
- Strong
- Exceptional

"Not observed" is separate from the quality scale. It means there was not enough evidence to comment fairly.

## Categories

Initial category direction:

- Message & Purpose
- Structure
- Audience Connection
- Evidence & Examples
- Physical Delivery
- Vocal Delivery
- Presence
- Language & Clarity
- Overall Impact
- Optional: Language Confidence & Clarity

The optional language category prompt:

> How effectively did the speaker use the language to communicate clearly and confidently?

Evaluator note:

> Focus on communication effectiveness, not accent or native-like perfection.

## Timer And Filler Words

- Shared timer by default.
- Optional assigned timer controller can be added later.
- Filler-word tracking is shared session observation, not a separate screen.
- Timer and filler data may appear in the released summary, but should not become hidden scoring.

## Summary

- Hidden until released by the host.
- Supports verbal feedback rather than replacing it.
- Should emphasize themes, strengths, and one focused improvement.
- Category distributions may be shown descriptively, not as numeric scores.
- Demo summaries and exports must be watermarked.

## Demo Mode

The MVP is demo-first.

- Public demo sessions expire after 6 hours.
- Public demo discourages real personal data.
- Public demo uses warnings and watermarks.
- Public demo should be excluded from search indexing.

## Self-Hosting

Self-hosting is a core use case.

Real use requires operators to handle privacy notices, lawful basis, retention, deletion, backups, access controls, and vendor/data-processing arrangements.
