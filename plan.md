# TrustLens AI — implementation plan

## Product approach

Build TrustLens AI as one cohesive dark intelligence workspace rather than three separate utilities. The landing page introduces the VERIFY → PROTECT → COMPARE story, then the dashboard and sidebar become the persistent operating surface for the three tools. Each tool has an input state, a meaningful progress state, and a structured report state. Demo mode is first-class so the product remains convincing before external credentials are configured.

The first implementation uses Next.js App Router with TypeScript and Tailwind-compatible utility classes backed by a custom CSS system. A small client-side app controller provides responsive navigation and preserves the feel of distinct pages while keeping the demo instantly explorable. The production seam is a server route at `/api/analyze`, which calls a server-only Analysis Engine. The engine delegates to a Clocked adapter when credentials are present and otherwise returns typed demo fixtures. Supabase-ready record interfaces and environment placeholders are included, while the UI uses the local demo layer until a project has real credentials.

## Product structure

- `app/` — App Router entry, metadata, global styles, route manifest, and the `/api/analyze` endpoint.
- `components/` — reusable shell, brand, status, cards, upload zones, progress, report, comparison, and empty/error UI.
- `lib/types.ts` — shared analysis, report, and Supabase-ready record types.
- `lib/demo-data.ts` — realistic TrustLens, ScamShield, and DocuMatch sample records.
- `lib/clocked.ts` — server-only Clocked configuration and adapter boundary; no secret is imported into client code.
- `lib/analysis-engine.ts` — workflow dispatcher, demo fallback, and error normalization.
- `public/manus-routes.json` — route manifest required by the managed preview/deployment workflow.

## Design direction

Three lightweight directions were considered: **signal-noir** (0.06) — midnight surfaces, blue/violet signal lines, and evidence cards; **quiet command center** (0.08) — restrained navy panels and editorial spacing; **secure atelier** (0.04) — dark glass, warm caution accents, and crafted details. The chosen direction is **signal-noir**.

### Design Movement
Signal-noir: an editorial cybersecurity command center where every surface feels like a calm instrument panel for making better decisions.

### Core Principles
1. Make confidence legible without pretending to make certainty.
2. Use generous space and strong hierarchy to reduce cognitive load.
3. Pair every status with a reason, evidence, or next action.
4. Treat warnings as guidance, not alarm theatre.

### Color Philosophy
Near-black navy creates a quiet, trustworthy base. Electric blue marks active intelligence and user intent; violet indicates the analytical layer; mint, amber, and coral are reserved for outcomes and attention. Status colors should always appear with labels and supporting copy.

### Layout Paradigm
Use a persistent left rail and a wide content canvas with offset panels, rather than a rigid centered dashboard grid. Reports should feel like a document unfolding from an instrument panel: summary first, evidence and attention below.

### Signature Elements
- The TrustLens mark: a lens ring intersected by a small verification spark.
- A thin signal rail running through hero and report sections to connect VERIFY → PROTECT → COMPARE.
- Layered glass cards with a soft blue/violet edge glow only on active or actionable surfaces.

### Interaction Philosophy
Every primary action should make the next state obvious. Demo shortcuts are visible but secondary. Uploads are forgiving, analysis states are staged and readable, and high-impact results never rely on color alone.

### Animation
Use short ease-out fades and 250–450ms panel transitions. Progress stages advance with a subtle pulse on the active step; avoid looping neon or gratuitous motion. Respect reduced-motion preferences by collapsing transitions to simple opacity changes.

### Typography System
Use a modern system sans stack with tight, confident display sizing for headings and comfortable 14–16px body copy. Use uppercase micro-labels with letter spacing for product metadata, never for long text.

### Brand Essence
A calm intelligence layer for people who need to understand information before they trust or act on it. Personality: discerning, protective, grounded.

### Brand Voice
Clear, evidence-led, and quietly confident. Example lines: “Make the next decision with better context.” “A caution flag is a reason to look closer, not a verdict.”

### Wordmark & Logo
A compact lens-ring mark with a four-point verification spark, paired with the TrustLens wordmark. The mark should work as a small sidebar glyph and a larger landing-page anchor.

### Signature Brand Color
Electric signal blue `#6ea8ff`, used for primary actions, active navigation, and evidence links.

## Build workflow

1. Create the Next.js runtime, shared types, demo fixtures, integration adapters, API route, and route manifest.
2. Build the responsive shell, landing page, dashboard, tool workspaces, progress tracker, reports, history, and settings placeholder.
3. Wire demo CTAs and form actions to the API route; keep the report view typed and tool-aware.
4. Install dependencies and run TypeScript diagnostics plus production build checks.
5. Start the managed preview server, verify the route manifest and key page responses, then checkpoint the finished version.


## Approved focused product-experience upgrade — 2026-11-08

Preserve the existing TrustLens AI application architecture, live Clocked SDK adapter, endpoint usage, upload handling, demo mode, and core workflows. Improve only the product communication and report experience.

The landing and workspace story will be clarified around “Understand information before you trust or act on it.” and the three connected lenses: examine claims and evidence, assess suspicious content and privacy concerns, and compare meaningful document changes. The existing dark intelligence visual system will remain, with stronger hierarchy and a consistent report flow: Input → Analysis → Findings → Why it matters → Next steps.

TrustLens and ScamShield will use only fields already returned by the Analysis Engine to improve status, evidence, uncertainty, privacy, pattern, and next-step presentation. DocuMatch will gain clearer count/context labels, side-by-side references, structured change cards, and a review-next section based on actual comparison pairs and conflicts. Categories and importance cues will not be invented beyond the current returned relation/conflict logic.

Existing APIs, server files, Clocked calls, environment variables, uploads, and demo behavior remain intact. Validation will include TypeScript, production build, route/API smoke tests for all three workflows, and a managed checkpoint before publication.


## DocuMatch report presentation refinement — 2026-11-08

Keep document inputs, Clocked compare requests, response mapping, uploads, and all non-DocuMatch workflows unchanged. Refine only the DocuMatch result surface so it reads like a professional review assistant. Derive the headline, plain-language summary, key changes, grouping labels, practical significance, and recommendation from the existing `summary`, `sections`, `changes`, `relation`, `conflict`, `priority`, and passage text fields. Never manufacture a difference or claim a category when the returned text does not support it. Clearly label Document A as Original and Document B as Updated throughout.
