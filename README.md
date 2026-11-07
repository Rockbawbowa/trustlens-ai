# TrustLens AI

TrustLens AI is a unified information-intelligence workspace for verifying claims, assessing suspicious content, and comparing documents. The first build is intentionally demo-first: all three workflows work without external credentials, while the server-only Clocked adapter and Supabase-ready schema make the next integration step straightforward.

## Run locally

```bash
pnpm install
pnpm run dev
```

Open `http://localhost:3000`.

## Configuration

Copy `.env.example` to `.env.local` when connecting services. `CLOCKED_API_KEY` and `CLOCKED_API_URL` are read only by the server-side adapter. `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are browser-safe values used by the optional Supabase client helper. When Clocked or Supabase is not configured, the app stays in polished local demo mode.

## Architecture

The client experience lives in `components/trustlens-app.tsx`, with reusable typed report models in `lib/types.ts` and realistic fixtures in `lib/demo-data.ts`. `/api/analyze` calls `lib/analysis-engine.ts`; that engine uses `lib/clocked.ts` when both Clocked variables are available and falls back to demo fixtures otherwise. No provider secret is imported by client code.

The Supabase-ready table definitions and row-level security policies are in `supabase/schema.sql`. The UI currently uses local demo records so preview remains fully explorable without a database connection.
