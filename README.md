# TrustLens AI

TrustLens AI is a unified information-intelligence workspace for verifying claims, assessing suspicious content, and comparing documents. The three workflows use the official server-side Clocked SDK for real user input, while the existing sample reports remain available in demo mode.

## Run locally

```bash
pnpm install
pnpm run dev
```

Open `http://localhost:3000`.

## Configuration

Copy `.env.example` to `.env.local` when connecting services. `CLOCKED_API_KEY` is required for real analysis and is read only by the server-side adapter. `CLOCKED_API_URL` is optional and defaults to `https://clocked.rezolve.ai/clocked`. `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are browser-safe values used by the optional Supabase client helper. Demo reports remain available without Clocked credentials, but real user submissions return a clear configuration error rather than silently using fake results.

## Architecture

The client experience lives in `components/trustlens-app.tsx`, with reusable typed report models in `lib/types.ts` and realistic fixtures in `lib/demo-data.ts`. `/api/analyze` accepts JSON or multipart uploads and calls `lib/analysis-engine.ts`; that engine uses `lib/clocked.ts` for `grounding`, `pii`, `injection`, `script`, and `compare`. PDF, DOCX, and text uploads are extracted server-side, while supported image uploads use Clocked native image inputs. Uploads are capped at 10 MB. No provider secret or SDK call is imported by client code.

The Supabase-ready table definitions and row-level security policies are in `supabase/schema.sql`. The UI currently uses local demo records so preview remains fully explorable without a database connection.
