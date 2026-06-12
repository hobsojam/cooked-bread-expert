# Self-Hosting

Cooked Bread Expert is intended to be self-hostable for real feedback sessions.

The public demo is for evaluating the software only. For real use, deploy your own instance and operate it under your organization's data protection policies.

## Operator Responsibilities

Before real use, decide:

- Who operates the system.
- Who can create sessions.
- Whether real names are allowed or aliases should be used.
- How long session data is kept.
- Who can access summaries.
- How participants can request deletion.
- Where the app, database, logs, and backups are hosted.
- Which vendors process personal data.
- Whether the use case involves children, employees, students, formal assessment, or other higher-risk contexts.

## Configuration

Expected environment variables:

```txt
APP_BASE_URL=https://example.com
DEMO_MODE=false
DEMO_SESSION_RETENTION_HOURS=6
SESSION_RETENTION_HOURS=168
ENABLE_EXPORTS=true
DEMO_WATERMARK_TEXT=DEMO - DO NOT USE WITH REAL PERSONAL DATA
DATABASE_URL=postgres://...
DELETE_EXPIRED_SESSIONS_ON_STARTUP=true
```

For real use, set `DEMO_MODE=false` and choose a deliberate `SESSION_RETENTION_HOURS` value.

## Local Demo

Local development should use fake data only.

When application code exists, local setup should include:

1. Install dependencies.
2. Copy `.env.example` to `.env`.
3. Set a local database connection.
4. Run migrations.
5. Start the development server.

## Vercel Demo Path

Vercel is suitable for a public demo if the app clearly warns users not to enter real personal data.

Use this path for evaluating the software flow:

- Vercel-hosted web app.
- Free or low-cost hosted database where possible.
- `DEMO_MODE=true`.
- `DEMO_SESSION_RETENTION_HOURS=6`.
- No real session data.
- No third-party analytics on session content pages.
- No indexing.
- Demo watermarks.

This path is not recommended as a default for real feedback sessions unless the operator has reviewed data protection requirements and vendor terms.

## Render Self-Hosting Path

Render can be used for a more controlled self-hosted deployment.

For privacy-conscious EU use, choose an EU region for services and datastores when available.

Recommended direction:

- App service in an appropriate region.
- Postgres datastore in the same region.
- HTTPS enabled.
- `DEMO_MODE=false`.
- Explicit `SESSION_RETENTION_HOURS`.
- Backups protected and retained only as long as needed.
- Application logs reviewed to ensure no feedback content or tokens are logged.

## Retention And Deletion

The application should enforce retention in two ways:

- Expired sessions become inaccessible immediately.
- Cleanup deletes expired session data.

Operators should not rely on hosting provider log or deployment retention to delete application data.

## Indexing

Even self-hosted deployments should avoid indexing private session pages.

Use:

- `robots.txt`
- `noindex` metadata
- `X-Robots-Tag`
- generic page titles
- no public session listing

These controls are not security. Access must rely on unguessable tokens and authorization checks.
