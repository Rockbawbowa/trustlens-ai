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


## 9. Focused product-experience upgrade
- [x] The landing page immediately explains what TrustLens AI does, who it is for, the problem it solves, and how TrustLens, ScamShield, and DocuMatch help users make better-informed decisions.
- [x] Shared report presentation follows the understandable flow INPUT → ANALYSIS → FINDINGS → WHY IT MATTERS → NEXT STEPS, while preserving clear loading states and distinguishing actual Clocked results from demo examples.
- [x] DocuMatch reports present an overall comparison summary, meaningful difference counts when available from the comparison output, side-by-side original/updated references, structured changes, truthful importance cues, plain-language context, and a Recommended Next Step section without inventing analysis.
- [x] TrustLens reports organize actual returned output into verification status, key claims, supporting/conflicting evidence, uncertainty requiring further verification, and a concise review-next section without presenting truth as guaranteed.
- [x] ScamShield reports organize actual returned output into risk level, suspicious patterns, privacy concerns, why the content deserves attention, and practical general next steps without declaring a definite scam unsupported by the integration.
- [x] Existing uploads, Clocked endpoint usage, environment variables, demo behavior, and core workflows remain intact; no fake results or fake API calls are added.
- [x] All three workflows pass typecheck/build and live smoke tests, the GitHub documentation remains accurate, and the improved version is ready for checkpoint and publication.


## 10. DocuMatch professional comparison report
- [x] The completed DocuMatch report presents a result-dependent heading such as documents containing important differences, documents being largely consistent, or changes detected and requiring review.
- [x] The report explains in plain language what the actual comparison found instead of presenting only a one-word relation or generic status.
- [x] A structured Key Changes section uses actual returned changes and, where available, shows the change title, Document A / Original passage, Document B / Updated passage, and why the change may matter.
- [x] Changes are grouped or labeled by supported type, including dates/deadlines, financial or price changes, requirements, permissions/terms, or other important changes only when the returned text supports that label.
- [x] The report includes a Why This Matters section and a neutral Recommended Next Step based on the actual result.
- [x] Original and Updated document labels remain clear in the side-by-side comparison and each key-change card.
- [x] The Clocked compare request, adapter, uploads, API contract, demo behavior, and all other application functionality remain unchanged.


## 11. Product professionalism and consistent report experience
- [x] User-facing product copy presents TrustLens AI as a functioning information-intelligence application rather than a demo, while retaining clearly labeled sample onboarding where useful.
- [x] TrustLens reports explain what was analyzed, the overall result, claims/findings, supporting or conflicting evidence, uncertainty, and what to review or verify next using actual returned fields.
- [x] ScamShield reports explain actual risk signals, suspicious patterns, privacy/safety concerns, why they may matter, and neutral practical next steps without claiming certainty or a definite scam.
- [x] DocuMatch reports explain the actual relationship, meaningful changes, their possible significance, original/updated wording, and a neutral recommended next step.
- [x] All three tools follow the user-facing result structure What was analyzed → Overall result → Key findings → Why it matters → Recommended next steps, adapted to available returned data.
- [x] Loading, empty, error, workspace, dashboard, history, and settings copy is professional and useful for real user input; sample actions are framed as optional examples rather than the product’s primary purpose.
- [x] Existing Clocked endpoints, server-side key handling, uploads, security boundaries, environment variables, API contracts, and core workflows remain unchanged; no fabricated analysis is added.
- [x] Typecheck, production build, real sample-input smoke tests for all three tools, secret-safety checks, GitHub source/README review, checkpoint, and publication are completed.
