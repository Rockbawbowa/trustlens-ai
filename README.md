# TrustLens AI

> **Understand information before you trust or act on it.**

TrustLens AI is a unified information-intelligence workspace for understanding information before acting on it. It combines claim verification, suspicious-content assessment, and document comparison in one responsive application with structured reports, evidence, risk signals, and meaningful change summaries.

## Core tools

- **TrustLens** helps users examine important claims and the evidence available to support, question, or contradict them.
- **ScamShield** helps users assess potentially suspicious messages, instructions, screenshots, and documents while surfacing privacy and safety concerns in neutral, evidence-based language.
- **DocuMatch** helps users compare two documents and understand meaningful similarities, new information, conflicts, and changes requiring attention.

The app also includes a dashboard, representative sample analyses, report views, searchable analysis history, and a settings/profile placeholder. Sample reports remain available as optional onboarding without external credentials; real user submissions use the secure server-side Clocked integration.

## Technology

- Next.js 15 App Router
- React 19 and TypeScript
- Tailwind-compatible styling with a custom responsive visual system
- Lucide React icons
- Official `clocked-sdk@0.7.0`
- Optional Supabase-ready client, schema, storage, and row-level security definitions
- Server-side PDF, DOCX, and text extraction for supported uploads
- pnpm for dependency management

## Clocked integration

The application keeps the Clocked API key and provider calls on the server. The route `POST /api/analyze` accepts JSON or multipart form submissions and dispatches through a reusable Analysis Engine:

- **TrustLens** uses Clocked `grounding` to extract and assess claims against available evidence.
- **ScamShield** uses Clocked `pii` for sensitive-information awareness, `injection` for suspicious instruction patterns, and `script` when script-like or executable content is relevant. Image uploads use Clocked’s native image-capable request forms when applicable.
- **DocuMatch** uses Clocked `compare` to identify matching, new, conflicting, and attention-worthy content.

PDF, DOCX, TXT, CSV, and JSON uploads are processed server-side when supported. PNG, JPEG, and WEBP image inputs can be passed to the image-capable Clocked endpoints. Uploads are limited to 10 MB. Clocked failures are surfaced as clear errors; real submissions do not silently become fabricated sample results.

## Setup

### Requirements

- Node.js 20 or newer
- pnpm
- A Clocked API key for live analyses (optional if you only want sample reports)

### Install

```bash
pnpm install
```

### Configure environment variables

Copy the safe placeholder file:

```bash
cp .env.example .env.local
```

Then edit `.env.local` locally:

```dotenv
CLOCKED_API_KEY=your_clocked_api_key_here
CLOCKED_API_URL=https://clocked.rezolve.ai/clocked
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

`CLOCKED_API_KEY` is read only by server-side code. Never commit `.env.local`, real API keys, access tokens, passwords, or private environment files. The included `.gitignore` excludes common secret environment-file variants. If Clocked is not configured, use the dashboard’s optional sample-report actions to explore the product.

### Run locally

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful checks:

```bash
pnpm run lint
pnpm run build
```

## Project structure

- `app/` — Next.js routes, layout, global styles, and server API endpoints
- `components/trustlens-app.tsx` — connected client experience and workspace/report UI
- `lib/analysis-engine.ts` — server-side workflow dispatcher
- `lib/clocked.ts` — secure Clocked SDK adapter and upload extraction
- `lib/demo-data.ts` — representative sample reports for all three tools
- `lib/types.ts` — shared report and data models
- `supabase/schema.sql` — Supabase-ready data model and ownership policies
- `docs/clocked-sdk-notes.md` — SDK references and integration notes

## Clocked Build Challenge notes

TrustLens AI was built as a project for the **Clocked Build Challenge**. The project’s central idea is to bring three careful-review workflows into one unified workspace: information verification, safety analysis, and document comparison. The product is designed to help people inspect signal, evidence, privacy concerns, and meaningful changes without presenting an AI assessment as a guarantee of truth or safety.

## Security note

API keys and other credentials must remain private and must be configured server-side. Do not expose `CLOCKED_API_KEY` in browser code, client-side environment variables, screenshots, issues, or commits. This repository intentionally contains placeholders only.
