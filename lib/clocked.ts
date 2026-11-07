import type { AnalysisInput, AnalysisResult } from './types'

export interface ClockedRequest {
  workflow: 'trustlens' | 'scamshield' | 'documatch'
  input: AnalysisInput
}

export function isClockedConfigured() {
  return Boolean(process.env.CLOCKED_API_KEY && process.env.CLOCKED_API_URL)
}

/**
 * Clocked is intentionally isolated here. The configured URL is treated as the
 * integration endpoint, and the request is kept server-side. The response is
 * expected to be a structured AnalysisResult; the UI never receives the key.
 */
export async function requestClockedAnalysis(input: AnalysisInput): Promise<AnalysisResult> {
  if (!isClockedConfigured()) {
    throw new Error('CLOCKED_NOT_CONFIGURED')
  }

  const payload: ClockedRequest = { workflow: input.toolType, input }
  const response = await fetch(process.env.CLOCKED_API_URL as string, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.CLOCKED_API_KEY}`,
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`CLOCKED_HTTP_${response.status}`)
  }

  const data = await response.json() as { result?: AnalysisResult; kind?: string }
  if (data.result) return data.result
  if (data.kind === 'trustlens' || data.kind === 'scamshield' || data.kind === 'documatch') return data as AnalysisResult
  throw new Error('CLOCKED_INVALID_RESULT')
}
