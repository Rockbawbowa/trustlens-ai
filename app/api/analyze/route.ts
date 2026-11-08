import { NextResponse } from 'next/server'
import { runAnalysis } from '../../../lib/analysis-engine'
import { isClockedConfigured, MAX_UPLOAD_BYTES, type UploadedAsset } from '../../../lib/clocked'
import type { AnalysisInput, ToolType } from '../../../lib/types'

const validTools: ToolType[] = ['trustlens', 'scamshield', 'documatch']

async function parseRequest(request: Request): Promise<{ input: AnalysisInput; assets: UploadedAsset[] }> {
  const contentType = request.headers.get('content-type') || ''
  if (!contentType.includes('multipart/form-data')) {
    const body = await request.json() as Partial<AnalysisInput>
    return {
      input: {
        toolType: body.toolType as ToolType,
        title: body.title,
        text: body.text,
        sourceText: body.sourceText,
        documentA: body.documentA,
        documentB: body.documentB,
        demo: body.demo,
      },
      assets: [],
    }
  }

  const form = await request.formData()
  const assets: UploadedAsset[] = []
  for (const [field, value] of form.entries()) {
    if (typeof value === 'string' || !('arrayBuffer' in value)) continue
    const file = value as File
    if (!file.name || file.size === 0) continue
    if (file.size > MAX_UPLOAD_BYTES) throw new Error('FILE_TOO_LARGE')
    assets.push({ name: file.name, type: file.type || 'application/octet-stream', size: file.size, bytes: new Uint8Array(await file.arrayBuffer()) })
  }

  const text = String(form.get('text') || '')
  const sourceText = String(form.get('sourceText') || '')
  const documentA = String(form.get('documentA') || '')
  const documentB = String(form.get('documentB') || '')
  const demo = form.get('demo') === 'true'
  return {
    input: {
      toolType: String(form.get('toolType') || '') as ToolType,
      title: String(form.get('title') || '') || undefined,
      text: text || undefined,
      sourceText: sourceText || undefined,
      documentA: documentA || undefined,
      documentB: documentB || undefined,
      demo,
    },
    assets,
  }
}

export async function POST(request: Request) {
  try {
    const { input, assets } = await parseRequest(request)
    if (!input.toolType || !validTools.includes(input.toolType)) {
      return NextResponse.json({ error: 'Choose a supported analysis tool.' }, { status: 400 })
    }

    const result = await runAnalysis(input, assets)
    return NextResponse.json({ analysis: result, mode: isClockedConfigured() && !input.demo ? 'clocked' : 'demo' })
  } catch (error) {
    const code = error instanceof Error ? error.message : 'UNKNOWN_ERROR'
    const responses: Record<string, { message: string; status: number }> = {
      CLOCKED_NOT_CONFIGURED: { message: 'Real Clocked analysis is not configured yet. Add CLOCKED_API_KEY on the server, or open a demo report.', status: 503 },
      CLOCKED_REQUEST_FAILED: { message: 'Clocked could not complete this analysis. Please try again shortly.', status: 502 },
      FILE_TOO_LARGE: { message: 'This file is larger than the 10 MB upload limit.', status: 413 },
      UNSUPPORTED_FILE: { message: 'This file format cannot be processed. Use PDF, DOCX, TXT, CSV, JSON, PNG, JPG, or WEBP.', status: 415 },
      EMPTY_INPUT: { message: 'Add text or upload content before starting the analysis.', status: 400 },
    }
    const response = responses[code] || { message: 'We could not complete this analysis. Please review your input and try again.', status: 500 }
    return NextResponse.json({ error: response.message }, { status: response.status })
  }
}
