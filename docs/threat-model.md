# Threat Model

This is a practical threat model for the MVP.

## Assets

- Feedback choices
- Free-text comments
- Speaker alias or display name
- Evaluator alias or display name
- Room codes
- Host tokens
- Summary tokens
- Timer events
- Filler-word events
- Generated summaries and exports

## Main Risks

### Real Personal Data In Demo

Users may enter real names or real feedback into a public demo.

Controls:

- Persistent demo banner.
- Warning near free-text fields.
- Demo watermark on summaries and exports.
- 6-hour demo retention.
- Host delete control.
- No indexing.

### Sensitive Data In Free Text

Feedback givers may write sensitive personal information.

Controls:

- UI guidance to focus on observable communication behavior.
- Avoid prompts that invite health, identity, or protected-characteristic comments.
- No logging of comments.
- Short retention.

### Guessable Room Codes

Room codes are easier to share but easier to guess than long tokens.

Controls:

- Room code grants only join access.
- Host and summary actions require separate long tokens.
- Rate-limit join attempts when implemented.
- No public room listing.
- Short retention.

### Leaked Host Or Summary Links

Private links may be forwarded accidentally.

Controls:

- Long unguessable tokens.
- Host delete control.
- Session expiry.
- Avoid tokens in logs.
- Avoid full URLs in analytics.

### Search Indexing

Search engines might index public routes.

Controls:

- `robots.txt`.
- `noindex` metadata.
- `X-Robots-Tag`.
- Generic page titles.
- No sitemap for session routes.

### Logs And Observability

Application logs can accidentally store private content.

Controls:

- Never log request bodies.
- Never log comments.
- Never log full URLs.
- Never log secret tokens.
- Scrub errors before reporting.

### Exports

Downloaded summaries can travel outside the app.

Controls:

- Watermark demo exports.
- Avoid exports in public demo unless clearly marked.
- Make export content generic and privacy-aware.
- Remind self-hosters they control exported files after download.

### Backups

Database backups can outlive retention settings.

Controls:

- Document backup retention.
- Encourage encrypted backups.
- Encourage matching backup retention to data retention.
- Make operators responsible for deletion from backups where required.

## Non-Goals For MVP

- No audio or video processing.
- No long-term user accounts.
- No public directory of sessions.
- No formal assessment workflow.
- No comparative placement or competition scoring.
