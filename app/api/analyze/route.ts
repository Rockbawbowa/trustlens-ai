import { NextResponse } from 'next/server'
import { runAnalysis } from '../../../lib/analysis-engine'
import { isClockedConfigured } from '../../../lib/clocked'
import type { AnalysisInput, ToolType } from '../../../lib/types'

const validTools: ToolType[] = ['trustlens', 'scamshield', 'documatch']

export async function POST(request: Request) {
  try {
    const body = await request.json() as Partial<AnalysisInput>
    if (!body.toolType || !validTools.includes(body.toolType)) {
      return NextResponse.json({ error: 'Choose a supported analysis tool.' }, { status: 400 })
    }

    const result = await runAnalysis({
      toolType: body.toolType,
      title: body.title,
      text: body.text,
      sourceText: body.sourceText,
      documentA: body.documentA,
      documentB: body.documentB,
      demo: body.demo,
    })

    return NextResponse.json({ analysis: result, mode: isClockedConfigured() ? 'clocked' : 'demo' })
  } catch (error) {
    const message = error instanceof Error && error.message === 'ANALYSIS_UNAVAILABLE'
      ? 'The intelligence service is temporarily unavailable. You can still explore the demo reports.'
      : 'We could not start this analysis. Please review your input and try again.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
