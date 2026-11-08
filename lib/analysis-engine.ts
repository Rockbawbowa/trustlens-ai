import { createDemoAnalysis, getDemoResult } from './demo-data'
import { isClockedConfigured, requestClockedAnalysis, type UploadedAsset } from './clocked'
import type { AnalysisInput, AnalysisRecord, ToolType } from './types'

const fallbackTitles: Record<ToolType, string> = {
  trustlens: 'Untitled information review',
  scamshield: 'Untitled safety review',
  documatch: 'Untitled document comparison',
}

export async function runAnalysis(input: AnalysisInput, assets: UploadedAsset[] = []): Promise<AnalysisRecord> {
  const title = input.title || fallbackTitles[input.toolType]

  if (input.demo) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return createDemoAnalysis(input.toolType, input.demo ? undefined : title)
  }

  if (!isClockedConfigured()) throw new Error('CLOCKED_NOT_CONFIGURED')

  try {
    const result = await requestClockedAnalysis(input, assets)
    const overallAssessment = result.kind === 'documatch' ? 'COMPARISON COMPLETE' : result.assessment
    return {
      id: `analysis-${input.toolType}-${Date.now()}`,
      toolType: input.toolType,
      title: result.title || title,
      status: 'completed',
      overallAssessment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      mode: 'clocked',
      result,
    }
  } catch (error) {
    console.error('Analysis Engine error', error)
    throw new Error('ANALYSIS_UNAVAILABLE')
  }
}

export function getDemoAnalysis(toolType: ToolType): AnalysisRecord {
  const result = getDemoResult(toolType)
  return createDemoAnalysis(toolType, result.title)
}
