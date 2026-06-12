# Privacy Model

Cooked Bread Expert is designed to minimize personal data collection.

This document is not legal advice. It describes the intended privacy posture of the software and the responsibilities of anyone operating it.

## Public Demo

The hosted public demo is for evaluating the software flow only.

Do not enter real names, personal feedback, confidential information, or sensitive personal data into the public demo.

Public demo defaults:

- Demo sessions expire after 6 hours.
- No user accounts.
- No audio or video storage.
- No long-term speaker or evaluator profiles.
- Session data is stored in volatile server memory for the demo and may disappear before expiry.
- No public listing of sessions.
- No search indexing.
- Demo warnings and watermarks.
- Host-controlled deletion should be provided when implemented.

## Self-Hosted Use

Self-hosted operators are responsible for their own data protection obligations.

Before using the software for real feedback sessions, operators should decide:

- What personal data is collected.
- Whether real names are necessary.
- What lawful basis or consent model applies.
- What privacy notice is provided.
- Who can access session data.
- How long data is retained.
- How deletion and export requests are handled.
- Where the database, backups, and logs are stored.
- Whether any vendors process personal data.

## Data To Minimize

The application should collect only what is needed for a session:

- Room code
- Session status
- Speaker alias or display name
- Evaluator alias or display name
- Feedback choices
- Optional comments
- Timer events
- Filler-word events
- Summary release state

## Data To Avoid

The application should not collect or store:

- Audio recordings
- Video recordings
- User accounts for the MVP
- Passwords
- Long-term profiles
- IP-derived location data
- Analytics tied to feedback content
- Free-text content in application logs
- Secret tokens in application logs

## Sensitive Data Risk

Free-text feedback can accidentally include sensitive personal data. The UI and docs should discourage comments about health, disability, ethnicity, religion, politics, sexual orientation, immigration status, or other sensitive topics unless an operator has an explicit and lawful reason to process that data.

## Retention

Public demo sessions expire after 6 hours.

Self-hosted deployments should configure a retention period appropriate to their use. The default self-hosted example is 7 days, but operators should choose deliberately.

Expired sessions should become inaccessible immediately and should be deleted by cleanup logic.

## Logs

Application logs must not contain:

- Feedback text
- Free-text comments
- Host tokens
- Summary tokens
- Full private URLs
- Request bodies

## Indexing

Session, join, host, summary, and export pages should not be indexed. This is not security. Access control must rely on unguessable tokens, retention, and authorization checks.
