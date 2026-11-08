import type { AnalysisRecord, AnalysisResult, DocuMatchReport, ScamReport, ToolType, TrustReport } from './types'

const trustReport: TrustReport = {
  kind: 'trustlens',
  title: 'Renewable Energy Report',
  assessment: 'NEEDS MORE EVIDENCE',
  assessmentCopy: 'The report is directionally supported, but two important claims need stronger or more current evidence before you rely on them.',
  score: 72,
  claims: [
    {
      id: 'claim-1',
      claim: 'Solar and wind capacity grew faster than any other new generation source in the region last year.',
      status: 'supported',
      summary: 'Supported by the supplied regional capacity table and a matching market summary.',
      evidence: [
        { source: 'Regional Energy Outlook · p. 4', excerpt: 'Variable renewables accounted for 68% of new installed capacity in the reporting period.', relation: 'supports' },
        { source: 'Capacity table · supplied source', excerpt: 'Solar + wind additions: 14.2 GW; other additions: 6.7 GW.', relation: 'supports' },
      ],
    },
    {
      id: 'claim-2',
      claim: 'Battery storage costs will fall by 40% within the next 18 months.',
      status: 'needs-evidence',
      summary: 'A forward-looking estimate is presented without a source, methodology, or comparable forecast.',
      evidence: [
        { source: 'Report body · paragraph 8', excerpt: 'Costs are expected to fall materially in the near term.', relation: 'context' },
      ],
      note: 'Ask for the underlying model, forecast date, and assumptions before treating this as a planning input.',
    },
    {
      id: 'claim-3',
      claim: 'The region is already on track to meet its 2030 clean-energy target.',
      status: 'conflicting',
      summary: 'The conclusion conflicts with the supplied trajectory chart, which shows a gap under the current policy path.',
      evidence: [
        { source: 'Trajectory chart · p. 11', excerpt: 'Current-policy pathway reaches 61% clean generation by 2030 against a 70% target.', relation: 'conflicts' },
        { source: 'Executive summary · p. 1', excerpt: 'The region is on track to meet its 2030 goal.', relation: 'conflicts' },
      ],
      note: 'Clarify whether an unlisted policy change is included in the executive summary.',
    },
  ],
  evidence: [
    { source: 'Regional Energy Outlook · p. 4', excerpt: 'New capacity mix is consistent with the report’s first claim.', relation: 'supports' },
    { source: 'Trajectory chart · p. 11', excerpt: 'The current-policy line remains below the stated 2030 target.', relation: 'conflicts' },
    { source: 'Report body · paragraph 8', excerpt: 'The storage-cost forecast is descriptive but not independently substantiated.', relation: 'context' },
  ],
  attention: [
    'Request the source model and forecast date for the storage-cost estimate.',
    'Reconcile the executive summary with the trajectory chart before sharing the report externally.',
  ],
}

const scamReport: ScamReport = {
  kind: 'scamshield',
  title: 'Suspicious Account Message',
  assessment: 'CAUTION RECOMMENDED',
  assessmentCopy: 'The message uses urgency and a request for sensitive information. That combination deserves an independent check before you respond or click anything.',
  score: 78,
  privacy: [
    { label: 'Sensitive information request', detail: 'The message asks for an account identifier and a one-time passcode. Those details were not repeated in this report.', status: 'review' },
    { label: 'Personal data exposure', detail: 'No personal data was detected in the analyzed content.', status: 'clear' },
    { label: 'Safe handling', detail: 'Potentially sensitive fields were masked in the analysis view.', status: 'protected' },
  ],
  patterns: [
    { label: 'Urgency language', detail: 'The sender says access will be suspended within 30 minutes unless the recipient acts.', severity: 'high' },
    { label: 'Unverified link', detail: 'The message points to a shortened sign-in link instead of a known service domain.', severity: 'high' },
    { label: 'Credential request', detail: 'It asks for a one-time passcode, which legitimate support channels should not request.', severity: 'medium' },
  ],
  nextSteps: [
    'Do not use the embedded link. Open the service through a known bookmark or official app.',
    'Contact the organization using a phone number or address from an independent source.',
    'If you already shared a code, change the password and review active sessions immediately.',
  ],
}

const docReport: DocuMatchReport = {
  kind: 'documatch',
  title: 'Contract Version Comparison',
  summary: { matching: 8, newInformation: 2, conflicts: 1, attention: 3 },
  sections: [
    { label: 'Purpose', documentA: 'This policy defines the service scope and delivery standards for the pilot.', documentB: 'This policy defines the service scope and delivery standards for the pilot.', changed: false },
    { label: 'Delivery window', documentA: 'Initial delivery within 10 business days of project kickoff.', documentB: 'Initial delivery within 15 business days of project kickoff.', changed: true },
    { label: 'Support hours', documentA: 'Support is available Monday–Friday, 09:00–17:00 local time.', documentB: 'Support is available Monday–Saturday, 08:00–18:00 local time.', changed: true },
    { label: 'Data retention', documentA: 'Project data is retained for 30 days after the pilot ends.', documentB: 'Project data is retained for 90 days after the pilot ends, unless otherwise agreed.', changed: true, conflict: true },
    { label: 'Escalations', documentA: 'Critical issues are escalated to the project lead within one business day.', documentB: 'Critical issues are escalated to the project lead within one business day.', changed: false },
    { label: 'Reporting', documentA: 'A monthly progress summary is provided to the client.', documentB: 'A monthly progress summary and a final outcomes brief are provided to the client.', changed: true },
  ],
  changes: [
    { priority: 'high', title: 'Data retention changed from 30 to 90 days', detail: 'This affects deletion timing and may require review against your privacy or contractual obligations.' },
    { priority: 'medium', title: 'Initial delivery moved to 15 business days', detail: 'The revised version gives the team five additional business days before the first delivery is due.' },
    { priority: 'medium', title: 'Support window expanded', detail: 'Coverage now includes Saturdays and starts one hour earlier.' },
    { priority: 'low', title: 'Final outcomes brief added', detail: 'The revised reporting section adds a deliverable at the end of the pilot.' },
  ],
}

export const demoReports: Record<ToolType, AnalysisResult> = {
  trustlens: trustReport,
  scamshield: scamReport,
  documatch: docReport,
}

export const demoAnalyses: AnalysisRecord[] = [
  {
    id: 'demo-trustlens',
    toolType: 'trustlens',
    title: trustReport.title,
    status: 'completed',
    overallAssessment: trustReport.assessment,
    createdAt: 'Nov 6, 2026 · 10:42 AM',
    updatedAt: 'Nov 6, 2026 · 10:42 AM',
    mode: 'demo',
    result: trustReport,
  },
  {
    id: 'demo-scamshield',
    toolType: 'scamshield',
    title: scamReport.title,
    status: 'completed',
    overallAssessment: scamReport.assessment,
    createdAt: 'Nov 5, 2026 · 3:18 PM',
    updatedAt: 'Nov 5, 2026 · 3:18 PM',
    mode: 'demo',
    result: scamReport,
  },
  {
    id: 'demo-documatch',
    toolType: 'documatch',
    title: docReport.title,
    status: 'completed',
    overallAssessment: '4 CHANGES REQUIRE ATTENTION',
    createdAt: 'Nov 4, 2026 · 9:06 AM',
    updatedAt: 'Nov 4, 2026 · 9:06 AM',
    mode: 'demo',
    result: docReport,
  },
]

export function getDemoResult(toolType: ToolType): AnalysisResult {
  return demoReports[toolType]
}

export function createDemoAnalysis(toolType: ToolType, title?: string): AnalysisRecord {
  const report = getDemoResult(toolType)
  const now = 'Just now'
  const overallAssessment = report.kind === 'documatch' ? '4 CHANGES REQUIRE ATTENTION' : report.assessment
  return {
    id: `analysis-${toolType}-${Date.now()}`,
    toolType,
    title: title || report.title,
    status: 'completed',
    overallAssessment,
    createdAt: now,
    updatedAt: now,
    mode: 'demo',
    result: { ...report, title: title || report.title },
  }
}
