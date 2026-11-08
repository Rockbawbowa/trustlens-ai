# TrustLens AI delivery checklist

## 1. Unified product shell and navigation
- [ ] The application presents TrustLens AI as one premium product with the tagline “Intelligence you can verify.” and a connected VERIFY → PROTECT → COMPARE story.
- [ ] Landing page, dashboard, TrustLens, ScamShield, DocuMatch, Analysis History, and Settings/Profile placeholder are reachable through coherent responsive navigation.
- [ ] Desktop navigation includes Dashboard, TrustLens, ScamShield, DocuMatch, Reports/History, Settings, and a user profile area; the shell remains usable on tablet and mobile.

## 2. Premium responsive visual system
- [ ] The interface uses a near-black or midnight navy base, electric blue primary actions, violet secondary AI highlights, and restrained green/amber/red statuses.
- [ ] The product uses generous spacing, readable hierarchy, subtle borders/glass surfaces, meaningful loading/error/empty states, and restrained motion.
- [ ] Reusable UI patterns exist for brand mark, sidebar, top navigation, status badges, cards, upload zones, progress steps, summary cards, evidence cards, risk indicators, comparison panels, and feedback states.

## 3. TrustLens workflow and report
- [ ] Users can paste text, choose an upload, add supporting sources, and start “Analyze Information →”.
- [ ] Analysis shows staged progress for reading, extracting claims, finding evidence, verifying support, and preparing the report.
- [ ] The Trust Report supports SUPPORTED, NEEDS MORE EVIDENCE, and CONFLICTING INFORMATION with assessment language that does not imply guaranteed truth.
- [ ] Demo results include supported, insufficiently supported, and conflicting claims, with evidence and attention notes.

## 4. ScamShield workflow and report
- [ ] Users can paste a message, upload a screenshot/document, and start “Analyze Content →” from a forgiving drag-and-drop surface.
- [ ] Analysis stages include sensitive-information checking, content-pattern review, suspicious-instruction review, relevant inspection, and risk-assessment preparation.
- [ ] The Risk Assessment supports LOW CONCERN, CAUTION RECOMMENDED, and HIGHER RISK; results use neutral, evidence-based language and include the required safety note.
- [ ] Demo results demonstrate privacy awareness without exposing real personal information, suspicious patterns, and a caution assessment.

## 5. DocuMatch workflow and report
- [ ] Users can add/remove/replace Document A and Document B through equal upload areas, stacked vertically on mobile.
- [ ] Comparison shows staged progress and a “Comparison Complete” report with matching, new, conflicting, and attention summary cards.
- [ ] Desktop comparison presents corresponding content in split panels with subtle difference highlights and an Important Changes section.
- [ ] Demo documents include matching sections, new information, changed details, and one potential conflict.

## 6. Analysis history and demo layer
- [ ] Dashboard recent analyses and Try a Demo shortcuts open realistic completed reports.
- [ ] History supports search, tool/status filtering, date sorting, and restoring a report view.
- [ ] Local/demo data keeps the app functional without Supabase or Clocked credentials.

## 7. Server-side intelligence architecture
- [x] A reusable server-side Analysis Engine dispatches the TrustLens, ScamShield, and DocuMatch workflows.
- [x] Clocked integration requests remain server-side behind `CLOCKED_API_KEY`; the optional `CLOCKED_API_URL` overrides the SDK default `https://clocked.rezolve.ai/clocked`; no secret is exposed in frontend code.
- [x] `/api/analyze` accepts JSON and multipart uploads, returns typed structured JSON, keeps demo reports available, and returns explicit errors for missing credentials, Clocked failures, unsupported files, empty input, and files over 10 MB instead of silently substituting a demo result.
- [x] The adapter uses the official `clocked-sdk@0.7.0` for `grounding`, `pii`, `injection`, `script`, and `compare`, with server-side PDF, DOCX, and text extraction as needed.
- [x] `.env.example` includes `CLOCKED_API_KEY`, `CLOCKED_API_URL`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- [x] Live synthetic checks completed for TrustLens claim verification, ScamShield suspicious-content/privacy analysis, and DocuMatch comparison; multipart TXT upload checks completed for all three.

## 8. Supabase-ready data architecture and delivery quality
- [ ] Shared interfaces cover profiles, analyses, analysis_files, and analysis_results with the requested fields and tool/status values.
- [ ] The code is modular, typed, and easy to extend with Supabase authentication, database, and storage.
- [ ] Route manifest, diagnostics, build checks, responsive layout checks, and a managed checkpoint are completed before handoff.
