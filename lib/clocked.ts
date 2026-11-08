import { Clocked, type CompareResponse, type GroundingResponse, type InjectionResponse, type PiiResponse, type ScriptResponse } from 'clocked-sdk'
import mammoth from 'mammoth'
import pdfParse from 'pdf-parse/lib/pdf-parse.js'
import type { AnalysisInput, AnalysisResult, ComparisonSection, DocuMatchReport, EvidenceItem, ImportantChange, PrivacyFinding, ScamPattern, ScamReport, TrustClaim, TrustReport } from './types'

export const CLOCKED_BASE_URL = process.env.CLOCKED_API_URL || 'https://clocked.rezolve.ai/clocked'
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

export interface UploadedAsset {
  name: string
  type: string
  size: number
  bytes: Uint8Array
}

export function isClockedConfigured() {
  return Boolean(process.env.CLOCKED_API_KEY)
}

function getClockedClient() {
  if (!isClockedConfigured()) throw new Error('CLOCKED_NOT_CONFIGURED')
  return new Clocked({
    apiKey: process.env.CLOCKED_API_KEY,
    baseUrl: CLOCKED_BASE_URL,
    maxAttempts: 2,
  })
}

function clockedError(error: unknown): never {
  const message = error instanceof Error ? error.message : 'Unknown Clocked error'
  console.error('Clocked request failed:', message)
  throw new Error('CLOCKED_REQUEST_FAILED')
}

function extension(name: string) {
  return name.toLowerCase().split('.').pop() || ''
}

function isPdf(asset: UploadedAsset) {
  return asset.type === 'application/pdf' || extension(asset.name) === 'pdf'
}

function isDocx(asset: UploadedAsset) {
  return asset.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || extension(asset.name) === 'docx'
}

function isImage(asset: UploadedAsset) {
  return asset.type.startsWith('image/') && ['image/png', 'image/jpeg', 'image/webp'].includes(asset.type)
}

export async function extractUploadText(asset: UploadedAsset) {
  if (asset.size > MAX_UPLOAD_BYTES) throw new Error('FILE_TOO_LARGE')
  if (isPdf(asset)) {
    const parsed = await pdfParse(Buffer.from(asset.bytes))
    return parsed.text.trim()
  }
  if (isDocx(asset)) {
    const parsed = await mammoth.extractRawText({ buffer: Buffer.from(asset.bytes) })
    return parsed.value.trim()
  }
  const ext = extension(asset.name)
  if (['txt', 'md', 'csv', 'json', 'html', 'xml'].includes(ext) || asset.type.startsWith('text/')) {
    return Buffer.from(asset.bytes).toString('utf8').trim()
  }
  throw new Error('UNSUPPORTED_FILE')
}

async function textFromAssets(assets: UploadedAsset[]) {
  const entries: { asset: UploadedAsset; text: string }[] = []
  for (const asset of assets) {
    if (isImage(asset)) continue
    const text = await extractUploadText(asset)
    if (text) entries.push({ asset, text })
  }
  return entries
}

function relationForClaim(claim: GroundingResponse['claims'][number]): EvidenceItem['relation'] {
  const verdict = (claim.verdict || '').toLowerCase()
  if (verdict.includes('contrad') || claim.contradicted >= Math.max(claim.supported, claim.not_stated)) return 'conflicts'
  if (verdict.includes('support') || claim.supported >= Math.max(claim.contradicted, claim.not_stated)) return 'supports'
  return 'context'
}

function trustClaim(claim: GroundingResponse['claims'][number], index: number): TrustClaim {
  const relation = relationForClaim(claim)
  const status = relation === 'supports' ? 'supported' : relation === 'conflicts' ? 'conflicting' : 'needs-evidence'
  const confidence = Math.max(claim.supported, claim.contradicted, claim.not_stated)
  const evidence: EvidenceItem[] = claim.evidence
    ? [{
        source: claim.evidence.document || 'Clocked source',
        excerpt: claim.evidence.quote,
        relation,
      }]
    : []
  const summary = status === 'supported'
    ? `Clocked found supporting evidence with ${(claim.supported * 100).toFixed(0)}% support probability.`
    : status === 'conflicting'
      ? `Clocked found conflicting evidence with ${(claim.contradicted * 100).toFixed(0)}% contradiction probability.`
      : `Clocked did not establish this claim; the strongest returned probability was ${(confidence * 100).toFixed(0)}%.`
  return {
    id: `claim-${index + 1}`,
    claim: claim.claim,
    status,
    summary,
    evidence,
    note: confidence < 0.65 ? 'Clocked returned an uncertain result. Treat this claim as unresolved until you can review more evidence.' : undefined,
  }
}

function toTrustReport(input: AnalysisInput, data: GroundingResponse): TrustReport {
  const claims = data.claims.filter((claim) => claim.counted !== false).map(trustClaim)
  const evidence = claims.flatMap((claim) => claim.evidence)
  const conflicting = claims.filter((claim) => claim.status === 'conflicting').length
  const supported = claims.filter((claim) => claim.status === 'supported').length
  const assessment = conflicting > 0
    ? 'CONFLICTING INFORMATION'
    : supported === claims.length && claims.length > 0 && data.grounded >= 0.75
      ? 'SUPPORTED'
      : 'NEEDS MORE EVIDENCE'
  const score = Math.round(Math.max(0, Math.min(1, data.grounded)) * 100)
  const attention = claims.filter((claim) => claim.status !== 'supported').map((claim) => claim.claim)
  return {
    kind: 'trustlens',
    title: input.title || 'Clocked verification report',
    assessment,
    assessmentCopy: `Clocked marked ${(data.grounded * 100).toFixed(0)}% of the answer as grounded. Its verdict was “${data.verdict}”; review the claim-level evidence before relying on it.`,
    score,
    claims,
    evidence,
    attention: attention.length ? attention : ['Clocked found no unresolved claims in the supplied material.'],
  }
}

function severityFor(value: number) {
  return value >= 0.75 ? 'high' : value >= 0.4 ? 'medium' : 'low'
}

function privacyFindings(data: PiiResponse): PrivacyFinding[] {
  if (!data.entities.length) return [{ label: 'No personal data identified', detail: 'Clocked did not identify a supported sensitive-information entity in the submitted content.', status: 'clear' }]
  return data.entities.map((entity) => ({
    label: entity.type,
    detail: `Clocked identified sensitive content with ${(entity.confidence * 100).toFixed(0)}% confidence. The value is not repeated here.`,
    status: entity.confidence >= 0.75 ? 'review' : 'protected',
  }))
}

function scamPatterns(injection: InjectionResponse | null, script: ScriptResponse | null): ScamPattern[] {
  const patterns: ScamPattern[] = []
  if (injection) {
    const probability = injection.injection
    patterns.push({
      label: injection.verdict || 'Instruction-control signal',
      detail: `Clocked returned ${(probability * 100).toFixed(0)}% probability of an instruction-control pattern in the submitted content.${injection.category ? ` Category: ${injection.category}.` : ''}`,
      severity: severityFor(probability),
    })
    for (const evidence of injection.evidence || []) {
      patterns.push({ label: 'Clocked evidence', detail: `Observed passage: “${evidence.quote}”`, severity: severityFor(evidence.confidence) })
    }
  }
  if (script) {
    const probability = script.malicious
    patterns.push({
      label: script.verdict || 'Script behavior assessment',
      detail: `Clocked returned ${(probability * 100).toFixed(0)}% probability that the script behavior is malicious.${script.category ? ` Category: ${script.category}.` : ''}`,
      severity: severityFor(probability),
    })
    for (const evidence of script.evidence || []) {
      patterns.push({ label: 'Clocked script evidence', detail: `Relevant line: “${evidence.line}”`, severity: severityFor(evidence.confidence) })
    }
  }
  return patterns.length ? patterns : [{ label: 'No suspicious pattern established', detail: 'Clocked did not return a supported high-confidence instruction or script signal.', severity: 'low' }]
}

function toScamReport(input: AnalysisInput, pii: PiiResponse, injection: InjectionResponse | null, script: ScriptResponse | null): ScamReport {
  const patterns = scamPatterns(injection, script)
  const risk = Math.max(injection?.injection || 0, script?.malicious || 0, script?.suspicious || 0)
  const assessment = risk >= 0.75 ? 'HIGHER RISK' : risk >= 0.4 ? 'CAUTION RECOMMENDED' : 'LOW CONCERN'
  const score = Math.round(risk * 100)
  const whyFlagged = patterns.filter((pattern) => pattern.severity !== 'low').map((pattern) => pattern.detail).join(' ')
  return {
    kind: 'scamshield',
    title: input.title || 'Clocked safety assessment',
    assessment,
    assessmentCopy: `Clocked returned a ${assessment.toLowerCase()} signal. This is an evidence-based assessment, not a guarantee that the content is safe or fraudulent.`,
    score,
    privacy: privacyFindings(pii),
    patterns,
    nextSteps: risk >= 0.4 ? ['Do not share credentials or payment details until the sender is independently verified.', 'Open links only through a trusted, manually entered destination.', 'If the message involves work or money, confirm through a known channel.'] : ['Review the sender and destination independently before acting.', 'Avoid sharing more personal information than necessary.', 'Use the returned signals as context, not as a guarantee.'],
    whyFlagged: whyFlagged || 'Clocked did not return a high-confidence reason for caution. Continue to evaluate the sender, context, and requested action independently.',
  }
}

function comparePassage(pair: CompareResponse['pairs'][number], side: 'a' | 'b') {
  const passage = pair[side]
  return typeof passage === 'string' ? passage : ''
}

function toDocuMatchReport(input: AnalysisInput, data: CompareResponse): DocuMatchReport {
  const sections: ComparisonSection[] = data.pairs.map((pair, index) => {
    const conflict = pair.relation === 'conflicting' || Boolean(pair.conflict)
    const changed = conflict || pair.relation !== 'same'
    return { label: `Comparison ${index + 1}`, documentA: comparePassage(pair, 'a'), documentB: comparePassage(pair, 'b'), changed, conflict }
  })
  const changes: ImportantChange[] = data.pairs.filter((pair) => pair.relation !== 'same' || pair.conflict).map((pair, index) => ({
    priority: pair.conflict ? 'high' : pair.relation === 'overlapping' ? 'medium' : 'low',
    title: pair.conflict ? 'Conflicting passages returned' : `${pair.relation || 'Meaningful'} change returned`,
    detail: `${comparePassage(pair, 'a')} ↔ ${comparePassage(pair, 'b')}`,
  }))
  return {
    kind: 'documatch',
    title: input.title || 'Clocked document comparison',
    summary: {
      matching: data.pairs.filter((pair) => pair.relation === 'same').length,
      newInformation: data.pairs.filter((pair) => pair.relation === 'unrelated').length,
      conflicts: data.conflicts.length,
      attention: changes.length,
    },
    sections,
    changes,
    comparisonNote: `Clocked returned “${data.verdict}” across ${data.pairs.length} related passage pair${data.pairs.length === 1 ? '' : 's'}. Treat an empty or incomplete comparison as unresolved rather than assuming the documents match.`,
  }
}

async function requestTrustLens(client: Clocked, input: AnalysisInput, assets: UploadedAsset[]) {
  const extracted = await textFromAssets(assets)
  const answer = input.text?.trim() || extracted.map((entry) => entry.text).join('\n\n')
  if (!answer) throw new Error('EMPTY_INPUT')
  const source = input.sourceText?.trim() || extracted.map((entry) => entry.text).join('\n\n') || 'No supporting source was provided.'
  try {
    const response = await client.grounding({ documents: [source], answer, evidence: 'all' })
    return toTrustReport(input, response.data as GroundingResponse)
  } catch (error) { return clockedError(error) }
}

async function requestScamShield(client: Clocked, input: AnalysisInput, assets: UploadedAsset[]) {
  const images = assets.filter(isImage)
  const extracted = await textFromAssets(assets)
  const text = [input.text?.trim(), ...extracted.map((entry) => entry.text)].filter(Boolean).join('\n\n')
  if (!text && !images.length) throw new Error('EMPTY_INPUT')
  try {
    let pii: PiiResponse
    let injection: InjectionResponse | null = null
    let script: ScriptResponse | null = null
    if (images.length && !text) {
      const piiResponse = await client.pii({ images: images.map((image) => image.bytes) })
      const imagePii = piiResponse.data as unknown as { result?: { entities?: { type: string; value: string; image: number }[] } }
      const imageEntities = imagePii.result?.entities || []
      pii = {
        model: 'native_vision',
        entities: imageEntities.map((entity) => ({ type: entity.type, value: entity.value, start: 0, end: 0, confidence: 0.5, source: `image ${entity.image}` })),
        counts: imageEntities.reduce<Record<string, number>>((counts, entity) => ({ ...counts, [entity.type]: (counts[entity.type] || 0) + 1 }), {}),
        threshold: 0.5,
        instructions_used: 'native_vision',
      }
      const injectionResponse = await client.injection({ images: images.map((image) => image.bytes), evidence: true })
      const imageInjection = (injectionResponse.data as unknown as { result?: { verdict: string; category: string; reason: string; evidence?: { quote: string }[] } }).result
      if (imageInjection) {
        const flagged = /malicious|injection|unsafe|suspicious|high/i.test(imageInjection.verdict)
        injection = { model: 'native_vision', injection: flagged ? 0.8 : 0.2, verdict: imageInjection.verdict, threshold: 0.5, source: 'image', instructions_used: 'native_vision', category: imageInjection.category, categories: {}, evidence: (imageInjection.evidence || []).map((e) => ({ quote: e.quote, start: 0, end: 0, confidence: flagged ? 0.8 : 0.2 })) }
      }
      const scriptResponse = await client.script({ images: images.map((image) => image.bytes), evidence: true })
      const imageScript = (scriptResponse.data as unknown as { result?: { verdict: string; category: string; reason: string; evidence?: { quote: string }[] } }).result
      if (imageScript) {
        const flagged = /malicious|unsafe|suspicious|high/i.test(imageScript.verdict)
        script = { model: 'native_vision', malicious: flagged ? 0.8 : 0.2, suspicious: flagged ? 0.8 : 0.2, verdict: imageScript.verdict, threshold: 0.5, instructions_used: 'native_vision', category: imageScript.category, categories: {}, evidence: (imageScript.evidence || []).map((e) => ({ line: e.quote, start: 0, end: 0, confidence: flagged ? 0.8 : 0.2 })) }
      }
    } else {
      const piiResponse = await client.pii({ text })
      pii = piiResponse.data as PiiResponse
      const injectionResponse = await client.injection({ text, evidence: true })
      injection = injectionResponse.data as InjectionResponse
      if (/(script|javascript|powershell|bash|shell|terminal|command|curl|wget|exec\s*\()/i.test(text)) {
        const scriptResponse = await client.script({ script: text, evidence: true })
        script = scriptResponse.data as ScriptResponse
      }
    }
    return toScamReport(input, pii, injection, script)
  } catch (error) { return clockedError(error) }
}

async function requestDocuMatch(client: Clocked, input: AnalysisInput, assets: UploadedAsset[]) {
  if (assets.length < 2 && (!input.documentA || !input.documentB)) throw new Error('EMPTY_INPUT')
  try {
    const documents: ({ id: string; pdf: Uint8Array } | { id: string; text: string } | string)[] = []
    if (assets.length >= 2) {
      for (const [index, asset] of assets.slice(0, 2).entries()) {
        documents.push(isPdf(asset) ? { id: `document-${index + 1}`, pdf: asset.bytes } : { id: `document-${index + 1}`, text: await extractUploadText(asset) })
      }
    } else {
      documents.push(input.documentA as string, input.documentB as string)
    }
    const response = await client.compare({ documents, evidence: 'all', kinds: true, ...(assets.some(isPdf) ? { return_text: true } : {}) })
    return toDocuMatchReport(input, response.data as CompareResponse)
  } catch (error) { return clockedError(error) }
}

export async function requestClockedAnalysis(input: AnalysisInput, assets: UploadedAsset[] = []): Promise<AnalysisResult> {
  const client = getClockedClient()
  if (input.toolType === 'trustlens') return requestTrustLens(client, input, assets)
  if (input.toolType === 'scamshield') return requestScamShield(client, input, assets)
  return requestDocuMatch(client, input, assets)
}
