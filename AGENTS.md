# AGENTS.md

## Project

Cooked Bread Expert is an independent structured feedback tool for speeches, presentations, talks, and practice sessions.

The MVP (minimum viable product) is demo-first and self-hostable. Treat privacy and personal data handling as core product requirements, not later polish.

## Current Scope

Start small. The initial scope is foundation documentation only unless the user explicitly asks for app implementation.

## Setup

No application stack has been implemented yet.

When app code is added, document the exact setup commands in `README.md` before relying on them here. Do not invent package-manager, database, or framework commands that do not exist in the repository.

Expected future setup direction:

- Copy `.env.example` to `.env`.
- Configure local-only secrets in `.env`.
- Install dependencies with the package manager selected by the repo.
- Run database migrations once a database layer exists.

## Build

No build command exists yet.

When app code is added, document the exact build and verification commands in `README.md`. Until then, docs-only changes should be verified by reading the changed files and checking terminology, retention, and privacy constraints.

## Terminology Constraint

This project is not affiliated with any external speaking, education, coaching, or presentation organization.

Do not use external organization names, branded program names, copied rubric wording, or trademarked terminology in product UI, public documentation, examples, tests, seed data, marketing copy, metadata, or generated exports.

Do not describe the product as a clone, replacement, derivative, or unofficial version of another organization's tool.

Use generic terms instead:

- feedback giver / evaluator
- speaker / presenter
- session
- feedback form
- structured feedback
- filler word tracker
- timer controller

## Privacy And PII Rules

Be paranoid about personally identifiable information and sensitive personal data.

- Do not commit secrets, tokens, credentials, private URLs, database dumps, logs, exports, or real user data.
- Do not add real people, real organizations, real speeches, or real feedback to tests, fixtures, examples, or screenshots.
- Use obviously fake demo data only.
- Do not log feedback text, host tokens, summary tokens, full URLs, request bodies, or free-text comments.
- Do not add third-party analytics to session, summary, or export pages without an explicit product decision.
- Do not weaken demo warnings, watermarks, noindex behavior, retention checks, or deletion behavior without explicit approval.
- Treat free-text feedback as high risk because users may accidentally enter sensitive personal data.

## Demo Defaults

Public demo deployments are for evaluating the software only.

- Demo sessions expire after 6 hours.
- Demo mode must show clear warnings.
- Demo mode must watermark summaries and printable/exported reports.
- Demo pages must discourage real names and personal feedback.
- Demo pages must not be indexed.

## Self-Hosting

Self-hosting is a core use case.

Docs should make clear that real operators are responsible for their own privacy notice, lawful basis, access controls, retention policy, deletion process, backups, and vendor/data-processing arrangements.

## Git And Secrets

- Check `git status` before committing.
- Never commit `.env`, `.env.local`, logs, exports, local databases, screenshots containing real data, or generated reports.
- Keep `.env.example` fake and non-sensitive.
- If a secret is accidentally exposed, stop and ask for rotation guidance.

## Verification

For docs-only changes, verify:

- No restricted branded or organization terminology is introduced.
- Demo retention remains 6 hours.
- Public demo warnings are clear.
- Self-hosting data protection responsibilities are documented.
