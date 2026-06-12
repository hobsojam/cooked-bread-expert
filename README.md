# Cooked Bread Expert

Cooked Bread Expert is a structured feedback tool for speeches, presentations, talks, and practice sessions.

The project is designed for live sessions with one speaker and multiple feedback givers. It emphasizes useful written observations, shared timing, filler-word tracking, and a summary that can be released after verbal feedback.

## Demo Status

This project starts as a demo system.

Do not enter real names, personal feedback, confidential information, or sensitive personal data into a public demo deployment.

Default demo behavior:

- No login
- Pseudo-random room codes
- Short-lived sessions
- Demo sessions expire after 6 hours
- Demo warnings and watermarks
- No search indexing
- No long-term profiles

For real feedback sessions, deploy and operate your own instance under your own data protection policies.

## Product Principles

- Structured feedback, not competition scoring
- Text labels instead of visible numeric scores
- "Not observed" is allowed and treated separately from quality feedback
- The summary is released after verbal feedback so it does not distract from discussion
- Demo deployments should discourage real personal data
- Self-hosted deployments should make retention, deletion, and privacy obligations explicit

## Feedback Scale

The visible feedback choices are:

- Not observed
- Needs attention
- Developing
- Effective
- Strong
- Exceptional

"Not observed" means there was not enough evidence to comment fairly. It is not treated as the lowest rating.

## Planned Core Features

- Host-created session with one speaker
- Multiple feedback givers using a shared room code
- Shared timer with optional assigned controller later
- Filler-word tracking
- Structured feedback categories
- Optional "Language Confidence & Clarity" category
- Host-controlled summary release
- Speaker summary screen
- Print or export-ready report
- Demo-mode watermarking and retention

## Privacy-First Defaults

The application should avoid collecting more data than needed:

- No user accounts in the MVP
- No audio or video storage
- No analytics tied to session content
- No logging of feedback text, room tokens, or full private URLs
- Configurable retention for self-hosted use
- Clear deletion behavior for demo deployments

## Hosting Options

The docs cover two deployment directions:

- Vercel for a public demo using free or low-cost services
- Render for a more privacy-conscious self-hosted deployment path, especially when choosing an EU region

The public demo path is for evaluating the software only. Real use requires the operator to consider data protection, lawful basis, privacy notices, retention, access, and deletion.

## Local Development

Install dependencies:

```sh
npm install
```

Run the local development server:

```sh
npm run dev
```

Run verification:

```sh
npm run check
npm test
npm run build
```

The first application slice is a demo-only app shell. It does not create sessions, persist feedback, or generate summaries yet.

## License

MIT. See [LICENSE](LICENSE).
