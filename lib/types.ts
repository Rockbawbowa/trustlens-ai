export type ToolType = 'trustlens' | 'scamshield' | 'documatch'
export type AnalysisStatus = 'processing' | 'completed' | 'failed'

export type TrustClaimStatus = 'supported' | 'needs-evidence' | 'conflicting'
export type TrustAssessment = 'SUPPORTED' | 'NEEDS MORE EVIDENCE' | 'CONFLICTING INFORMATION'
export type ScamAssessment = 'LOW CONCERN' | 'CAUTION RECOMMENDED' | 'HIGHER RISK'

export interface EvidenceItem {
  source: string
  excerpt: string
  relation: 'supports' | 'context' | 'conflicts'
}

export interface TrustClaim {
  id: string
  claim: string
  status: TrustClaimStatus
  summary: string
  evidence: EvidenceItem[]
  note?: string
}

export interface TrustReport {
  kind: 'trustlens'
  title: string
  assessment: TrustAssessment
  assessmentCopy: string
  score: number
  claims: TrustClaim[]
  evidence: EvidenceItem[]
  attention: string[]
}

export interface PrivacyFinding {
  label: string
  detail: string
  status: 'protected' | 'review' | 'clear'
}

export interface ScamPattern {
  label: string
  detail: string
  severity: 'low' | 'medium' | 'high'
}

export interface ScamReport {
  kind: 'scamshield'
  title: string
  assessment: ScamAssessment
  assessmentCopy: string
  score: number
  privacy: PrivacyFinding[]
  patterns: ScamPattern[]
  nextSteps: string[]
  whyFlagged?: string
}

export interface ComparisonSection {
  label: string
  documentA: string
  documentB: string
  changed?: boolean
  conflict?: boolean
}

export interface ImportantChange {
  priority: 'high' | 'medium' | 'low'
  title: string
  detail: string
}

export interface DocuMatchReport {
  kind: 'documatch'
  title: string
  summary: {
    matching: number
    newInformation: number
    conflicts: number
    attention: number
  }
  sections: ComparisonSection[]
  changes: ImportantChange[]
  comparisonNote?: string
}

export type AnalysisResult = TrustReport | ScamReport | DocuMatchReport

export interface AnalysisRecord {
  id: string
  userId?: string
  toolType: ToolType
  title: string
  status: AnalysisStatus
  overallAssessment: string
  createdAt: string
  updatedAt: string
  mode?: 'demo' | 'clocked'
  result: AnalysisResult
}

export interface AnalysisInput {
  toolType: ToolType
  title?: string
  text?: string
  sourceText?: string
  documentA?: string
  documentB?: string
  demo?: boolean
}

export interface ProfileRow {
  id: string
  full_name: string
  email: string
  created_at: string
}

export interface AnalysisRow {
  id: string
  user_id: string | null
  tool_type: ToolType
  title: string
  status: AnalysisStatus
  overall_assessment: string
  created_at: string
  updated_at: string
}

export interface AnalysisFileRow {
  id: string
  analysis_id: string
  file_name: string
  file_type: string
  storage_path: string
  created_at: string
}

export interface AnalysisResultRow {
  id: string
  analysis_id: string
  result_type: ToolType
  result_data: AnalysisResult
  created_at: string
}
