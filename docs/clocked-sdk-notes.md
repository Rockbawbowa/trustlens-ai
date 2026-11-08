# Clocked SDK integration notes

Sources reviewed on 2026-11-08:

- Official SDK package: https://www.npmjs.com/package/clocked-sdk
- Official API reference: https://clocked.rezolve.ai/apis

Pinned package: `clocked-sdk@0.7.0`.

The SDK exports `Clocked` and `AsyncClocked`, reads `CLOCKED_API_KEY`, and defaults to `https://clocked.rezolve.ai/clocked`. The relevant typed methods are `grounding({ documents, answer, evidence })`, `pii({ text })` or image mode, `injection({ text, evidence })`, `script({ script, evidence })` or image mode, and `compare({ documents, evidence, kinds, return_text })`. Calls return `{ data, status, credits, costUsd, ... }`; application code maps only structured `data` fields into the existing report types.

The server adapter keeps the key and SDK import out of client code. Uploads are capped at 10 MB, with PDF/DOCX/text extraction before text endpoints and native PNG/JPEG/WEBP bytes for image-capable endpoints.
