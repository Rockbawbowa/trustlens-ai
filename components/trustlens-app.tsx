'use client'

import { useMemo, useState } from 'react'
import type { ChangeEvent, ComponentType, ReactNode } from 'react'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  BookOpenCheck,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  Clock3,
  DatabaseZap,
  FileDiff,
  FileText,
  Filter,
  History,
  Home,
  Info,
  Layers3,
  LockKeyhole,
  Menu,
  MoreHorizontal,
  Network,
  Plus,
  Search,
  Send,
  Settings,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UploadCloud,
  X,
  Zap,
} from 'lucide-react'
import { demoAnalyses } from '../lib/demo-data'
import type {
  AnalysisRecord,
  DocuMatchReport,
  ScamReport,
  ToolType,
  TrustClaim,
  TrustReport,
} from '../lib/types'

type View = 'landing' | 'dashboard' | ToolType | 'report' | 'history' | 'settings'
type LucideIcon = ComponentType<{ size?: number; strokeWidth?: number; className?: string }>

const toolMeta: Record<ToolType, { name: string; eyebrow: string; description: string; icon: LucideIcon; color: string }> = {
  trustlens: {
    name: 'TrustLens',
    eyebrow: 'VERIFY',
    description: 'Verify claims and explore the evidence behind them.',
    icon: Search,
    color: 'blue',
  },
  scamshield: {
    name: 'ScamShield',
    eyebrow: 'PROTECT',
    description: 'Assess potentially suspicious content and privacy risks.',
    icon: ShieldCheck,
    color: 'violet',
  },
  documatch: {
    name: 'DocuMatch',
    eyebrow: 'COMPARE',
    description: 'Compare two documents and find what changed.',
    icon: FileDiff,
    color: 'teal',
  },
}

const progressSteps: Record<ToolType, string[]> = {
trustlens: ['Reading information', 'Extracting key claims', 'Finding relevant evidence', 'Verifying support', 'Preparing your report'],
scamshield: ['Checking sensitive information', 'Reviewing content patterns', 'Checking for suspicious instructions', 'Inspecting relevant content', 'Preparing risk assessment'],
documatch: ['Reading document A', 'Reading document B', 'Comparing content', 'Prioritizing meaningful changes', 'Preparing comparison'],
}

function getProgressSteps(tool: ToolType, content = '') {
  if (tool === 'scamshield' && !/(script|javascript|code|command|terminal)/i.test(content)) {
    return progressSteps[tool].filter((step) => step !== 'Inspecting relevant content')
  }
  return progressSteps[tool]
}

function ToolIcon({ tool, size = 18 }: { tool: ToolType; size?: number }) {
  const Icon = toolMeta[tool].icon
  return <Icon size={size} strokeWidth={1.8} />
}

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand ${compact ? 'brand-compact' : ''}`}>
      <span className="brand-mark" aria-hidden="true"><span /></span>
      {!compact && <span className="brand-name">TrustLens <b>AI</b></span>}
    </div>
  )
}

function StatusBadge({ label, tone = 'neutral' }: { label: string; tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'blue' | 'violet' }) {
  return <span className={`status-badge status-${tone}`}><span className="status-dot" />{label}</span>
}

function Button({ children, variant = 'primary', onClick, className = '', type = 'button', disabled = false }: { children: ReactNode; variant?: 'primary' | 'secondary' | 'ghost' | 'dark'; onClick?: () => void; className?: string; type?: 'button' | 'submit'; disabled?: boolean }) {
  return <button type={type} className={`button button-${variant} ${className}`} onClick={onClick} disabled={disabled}>{children}</button>
}

function SectionLabel({ children, icon: Icon = Sparkles }: { children: ReactNode; icon?: LucideIcon }) {
  return <div className="section-label"><Icon size={13} />{children}</div>
}

function AppShell({ view, navigate, children }: { view: View; navigate: (view: View) => void; children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navItems: { id: View; label: string; icon: LucideIcon }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'trustlens', label: 'TrustLens', icon: Search },
    { id: 'scamshield', label: 'ScamShield', icon: ShieldCheck },
    { id: 'documatch', label: 'DocuMatch', icon: FileDiff },
    { id: 'history', label: 'Reports / History', icon: History },
  ]

  const go = (next: View) => { navigate(next); setMobileOpen(false) }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-top">
          <div className="sidebar-brand-row"><BrandMark /><button className="mobile-close" onClick={() => setMobileOpen(false)}><X size={18} /></button></div>
          <div className="workspace-chip"><span className="workspace-pulse" />Demo workspace <ChevronDown size={13} /></div>
        </div>
        <div className="nav-group">
          <span className="nav-heading">Workspace</span>
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} className={`nav-item ${view === id || (view === 'report' && id === 'history') ? 'nav-active' : ''}`} onClick={() => go(id)}>
              <Icon size={17} strokeWidth={1.8} /><span>{label}</span>{id === 'history' && <span className="nav-count">3</span>}
            </button>
          ))}
        </div>
        <div className="sidebar-note"><div className="note-icon"><Sparkles size={16} /></div><div><strong>Make the next decision</strong><span>with better context.</span></div></div>
        <div className="sidebar-bottom">
          <button className={`nav-item ${view === 'settings' ? 'nav-active' : ''}`} onClick={() => go('settings')}><Settings size={17} /><span>Settings</span></button>
          <div className="profile-card"><div className="avatar">AM</div><div className="profile-copy"><strong>Alex Morgan</strong><span>Personal workspace</span></div><MoreHorizontal size={17} className="muted-icon" /></div>
        </div>
      </aside>
      {mobileOpen && <button className="sidebar-overlay" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
      <main className="main-content">
        <header className="app-topbar"><button className="mobile-menu" onClick={() => setMobileOpen(true)}><Menu size={20} /></button><div className="topbar-context"><span className="topbar-kicker">INTELLIGENCE WORKSPACE</span><span className="topbar-divider" /> <span>Demo mode</span></div><div className="topbar-actions"><button className="icon-button" aria-label="Notifications"><Bell size={18} /></button><div className="topbar-divider vertical" /><span className="secure-label"><LockKeyhole size={13} /> Private by design</span></div></header>
        <div className="page-wrap">{children}</div>
      </main>
    </div>
  )
}

function Landing({ onLaunch, onExplore, onOpenTool }: { onLaunch: () => void; onExplore: () => void; onOpenTool: (tool: ToolType) => void }) {
  return (
    <div className="landing-page">
      <nav className="landing-nav"><BrandMark /><div className="landing-links"><a href="#product">Product</a><a href="#how-it-works">How it works</a><a href="#technology">Technology</a></div><Button variant="secondary" onClick={onLaunch}>Launch app <ArrowUpRight size={16} /></Button></nav>
      <section className="hero-section"><div className="hero-copy"><div className="eyebrow-pill"><span className="eyebrow-dot" />AI-powered information intelligence</div><h1>Understand information <em>before you trust it.</em></h1><p className="hero-lede">Verify claims, assess suspicious content, and compare documents using structured AI intelligence.</p><div className="hero-actions"><Button onClick={onLaunch}>Start analyzing <ArrowRight size={17} /></Button><Button variant="ghost" onClick={onExplore}>Explore the platform <ChevronRight size={16} /></Button></div><div className="hero-proof"><div className="proof-avatars"><span>✓</span><span>✓</span><span>✓</span></div><p><strong>Clarity over noise.</strong><br />Reports built to help you decide.</p></div></div><div className="hero-visual" aria-label="Three intelligence layers: verify, protect, compare"><div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" /><div className="signal-node node-top"><Search size={16} /><span>Verify</span></div><div className="signal-node node-left"><ShieldCheck size={16} /><span>Protect</span></div><div className="signal-node node-right"><FileDiff size={16} /><span>Compare</span></div><div className="signal-core"><span className="core-kicker">TRUSTLENS ENGINE</span><div className="core-icon"><Sparkles size={25} /></div><strong>Signal, not noise.</strong><span>Structured intelligence<br />for the next decision.</span></div><div className="visual-line line-one" /><div className="visual-line line-two" /><div className="visual-line line-three" /></div></section>
      <section id="product" className="product-section section-shell"><div className="section-intro"><SectionLabel icon={Layers3}>One platform. Three ways to look closer.</SectionLabel><h2>Confidence is a workflow.</h2><p>Each tool turns a different kind of uncertainty into a clear, evidence-led next step.</p></div><div className="tool-card-grid">{(['trustlens', 'scamshield', 'documatch'] as ToolType[]).map((tool) => <ToolLandingCard key={tool} tool={tool} onClick={() => onOpenTool(tool)} />)}</div></section>
      <section id="how-it-works" className="process-section section-shell"><div className="section-intro"><SectionLabel icon={Zap}>How it works</SectionLabel><h2>From input to insight in three moves.</h2></div><div className="process-grid"><ProcessStep num="01" title="Add your information" text="Paste a message, upload a file, or bring two documents into focus." icon={Plus} /><ProcessStep num="02" title="Let the engine look closer" text="Claims, signals, and changes are organized into a structured analysis." icon={Network} /><ProcessStep num="03" title="Review what matters" text="Get a readable report with evidence, attention points, and next steps." icon={BookOpenCheck} /></div></section>
      <section id="technology" className="technology-strip"><div className="section-shell tech-inner"><div><SectionLabel icon={DatabaseZap}>Built for responsible intelligence</SectionLabel><h2>Useful enough for action.<br /><span>Honest enough for judgment.</span></h2></div><div className="tech-points"><div><CheckCircle2 size={17} /><span>Structured results, not chat noise</span></div><div><CheckCircle2 size={17} /><span>Evidence and reasons beside every status</span></div><div><CheckCircle2 size={17} /><span>Privacy-aware by default</span></div></div></div></section>
      <footer className="landing-footer"><div className="footer-brand"><BrandMark /><span>Intelligence you can verify.</span></div><span>© 2026 TrustLens AI</span></footer>
    </div>
  )
}

function ToolLandingCard({ tool, onClick }: { tool: ToolType; onClick: () => void }) {
  const meta = toolMeta[tool]
  const Icon = meta.icon
  return <button className={`tool-landing-card card-${meta.color}`} onClick={onClick}><div className="tool-card-top"><div className="tool-icon"><Icon size={20} /></div><span className="arrow-circle"><ArrowUpRight size={17} /></span></div><span className="card-eyebrow">{meta.eyebrow}</span><h3>{meta.name}</h3><p>{meta.description}</p><span className="card-link">Explore {meta.name} <ArrowRight size={15} /></span></button>
}

function ProcessStep({ num, title, text, icon: Icon }: { num: string; title: string; text: string; icon: LucideIcon }) {
  return <div className="process-step"><span className="process-num">{num}</span><div className="process-icon"><Icon size={19} /></div><h3>{title}</h3><p>{text}</p></div>
}

function Dashboard({ onOpenTool, onOpenReport, onDemo, analyses }: { onOpenTool: (tool: ToolType) => void; onOpenReport: (analysis: AnalysisRecord) => void; onDemo: (tool: ToolType) => void; analyses: AnalysisRecord[] }) {
  return <div className="dashboard-view"><div className="page-header dashboard-header"><div><div className="eyebrow-row"><span>SATURDAY, NOVEMBER 7, 2026</span><StatusBadge label="Demo mode" tone="blue" /></div><h1>Welcome back <span className="wave">✦</span></h1><p>What would you like to understand today?</p></div><Button variant="secondary" onClick={() => onDemo('trustlens')}><Sparkles size={16} /> Try a demo</Button></div><div className="signal-banner"><div className="banner-glyph"><Sparkles size={18} /></div><div><strong>Good information deserves a second look.</strong><span>Start with a tool below, or explore a completed report to see how TrustLens thinks.</span></div><ArrowRight size={18} /></div><div className="dashboard-section"><div className="section-heading"><div><SectionLabel icon={Layers3}>Choose your lens</SectionLabel><h2>What are you looking at?</h2></div><span className="section-meta">3 intelligence layers</span></div><div className="dashboard-tool-grid">{(['trustlens', 'scamshield', 'documatch'] as ToolType[]).map((tool) => <DashboardToolCard key={tool} tool={tool} onOpen={() => onOpenTool(tool)} onDemo={() => onDemo(tool)} />)}</div></div><RecentAnalyses analyses={analyses} onOpenReport={onOpenReport} /><DemoShowcase onDemo={onDemo} /></div>
}

function DashboardToolCard({ tool, onOpen, onDemo }: { tool: ToolType; onOpen: () => void; onDemo: () => void }) {
  const meta = toolMeta[tool]
  const Icon = meta.icon
  return <div className={`dashboard-tool-card card-${meta.color}`}><div className="tool-card-header"><div className="tool-icon"><Icon size={21} /></div><span className="card-eyebrow">{meta.eyebrow}</span><span className="card-number">0{tool === 'trustlens' ? 1 : tool === 'scamshield' ? 2 : 3}</span></div><h3>{meta.name}</h3><p>{meta.description}</p><div className="tool-card-actions"><Button onClick={onOpen}>{tool === 'documatch' ? 'Compare' : 'Analyze'} <ArrowRight size={15} /></Button><button className="text-button" onClick={onDemo}>Open demo</button></div></div>
}

function RecentAnalyses({ analyses, onOpenReport }: { analyses: AnalysisRecord[]; onOpenReport: (analysis: AnalysisRecord) => void }) {
  return <section className="dashboard-section recent-section"><div className="section-heading"><div><SectionLabel icon={Clock3}>Recent analyses</SectionLabel><h2>Pick up where you left off.</h2></div><button className="text-button">View all <ArrowRight size={15} /></button></div><div className="analysis-table">{analyses.slice(0, 5).map((analysis) => <button className="analysis-row" key={analysis.id} onClick={() => onOpenReport(analysis)}><div className={`row-tool-icon ${toolMeta[analysis.toolType].color}`}><ToolIcon tool={analysis.toolType} size={17} /></div><div className="analysis-title"><strong>{analysis.title}</strong><span>{toolMeta[analysis.toolType].name}</span></div><StatusBadge label={analysis.overallAssessment} tone={analysis.toolType === 'scamshield' ? 'warning' : analysis.toolType === 'documatch' ? 'blue' : 'success'} /><span className="analysis-date">{analysis.createdAt}</span><ChevronRight size={17} className="muted-icon" /></button>)}</div></section>
}

function DemoShowcase({ onDemo }: { onDemo: (tool: ToolType) => void }) {
  return <section className="demo-showcase"><div className="demo-copy"><SectionLabel icon={Sparkles}>Explore a finished analysis</SectionLabel><h2>See the product in motion.</h2><p>Try a preconfigured demo to understand how evidence, caution, and change become a clearer report.</p></div><div className="demo-buttons">{(['trustlens', 'scamshield', 'documatch'] as ToolType[]).map((tool) => <button key={tool} onClick={() => onDemo(tool)}><span className={`mini-tool-icon ${toolMeta[tool].color}`}><ToolIcon tool={tool} size={16} /></span><span><strong>{toolMeta[tool].name}</strong><small>{tool === 'trustlens' ? 'Renewable energy report' : tool === 'scamshield' ? 'Suspicious account message' : 'Contract comparison'}</small></span><ArrowUpRight size={16} /></button>)}</div></section>
}

function WorkspaceHeader({ tool, onBack }: { tool: ToolType; onBack: () => void }) {
  const meta = toolMeta[tool]
  return <div className="page-header workspace-header"><div><button className="back-button" onClick={onBack}><ArrowLeft size={15} /> Dashboard</button><div className="workspace-title-row"><div className={`workspace-title-icon ${meta.color}`}><meta.icon size={21} /></div><div><div className="eyebrow-row"><span>{meta.eyebrow} LAYER</span><StatusBadge label="Ready to analyze" tone="success" /></div><h1>{tool === 'trustlens' ? 'Verify what you’re reading.' : tool === 'scamshield' ? 'Analyze something that doesn’t feel right.' : 'See what changed.'}</h1><p>{tool === 'trustlens' ? 'Analyze information, identify important claims, and review the evidence behind them.' : tool === 'scamshield' ? 'Review suspicious messages, content, or documents for potential privacy and safety concerns.' : 'Compare two documents and quickly understand important similarities, differences, and potential conflicts.'}</p></div></div></div></div>
}

function ProgressPanel({ tool, progressIndex, content = '' }: { tool: ToolType; progressIndex: number; content?: string }) {
  const steps = getProgressSteps(tool, content)
  return <div className="progress-panel"><div className="progress-heading"><div className="spinner-ring" /><div><span className="card-eyebrow">ANALYSIS IN PROGRESS</span><h3>Looking closer for you.</h3></div><span className="progress-percent">{Math.min(Math.round((progressIndex / steps.length) * 100), 96)}%</span></div><div className="progress-steps">{steps.map((step, index) => <div className={`progress-step ${index < progressIndex ? 'is-done' : index === progressIndex ? 'is-active' : ''}`} key={step}><span className="step-marker">{index < progressIndex ? <Check size={13} /> : index === progressIndex ? <span /> : <span className="step-empty" />}</span><span>{step}</span>{index < progressIndex && <span className="step-state">Done</span>}</div>)}</div><p className="progress-note"><Sparkles size={14} /> You can leave this page — your report will be ready here when the analysis finishes.</p></div>
}

function UploadZone({ label, fileName, onFile, onRemove, hint = 'PDF, DOCX, PNG or JPG up to 10MB' }: { label: string; fileName?: string; onFile: (file: File) => void; onRemove: () => void; hint?: string }) {
  const inputId = `upload-${label.replaceAll(' ', '-').toLowerCase()}`
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (file) onFile(file) }
  return <div className={`upload-zone ${fileName ? 'upload-zone-filled' : ''}`}><input id={inputId} type="file" onChange={handleChange} hidden accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt" />{fileName ? <div className="file-selected"><div className="file-icon"><FileText size={20} /></div><div className="file-selected-copy"><strong>{fileName}</strong><span>Ready to include in analysis</span></div><button className="icon-button small" onClick={onRemove} aria-label={`Remove ${fileName}`}><X size={15} /></button></div> : <label htmlFor={inputId} className="upload-label"><span className="upload-icon"><UploadCloud size={20} /></span><strong>{label}</strong><span>Drop a file here or <u>browse</u></span><small>{hint}</small></label>}</div>
}

function TrustLensWorkspace({ onAnalyze, busy, progressIndex, text, setText, sourceText, setSourceText, fileName, setFileName, error }: { onAnalyze: (payload: { text?: string; sourceText?: string; title?: string }) => void; busy: boolean; progressIndex: number; text: string; setText: (value: string) => void; sourceText: string; setSourceText: (value: string) => void; fileName?: string; setFileName: (value?: string) => void; error: string | null }) {
  return <div className="workspace-view"><WorkspaceHeader tool="trustlens" onBack={() => onAnalyze({})} />{busy ? <ProgressPanel tool="trustlens" progressIndex={progressIndex} /> : <div className="workspace-grid"><div className="workspace-main"><div className="workspace-card input-card"><div className="card-tabs"><span className="active-tab">Paste text</span><span>Upload document</span><span>Add supporting sources</span></div><div className="editor-wrap"><textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste the information you want to understand…" /><div className="editor-footer"><span><FileText size={14} /> {text.length > 0 ? `${text.length} characters` : 'Plain text input'}</span><span>Private workspace</span></div></div><div className="support-source"><div className="mini-heading"><div><strong>Add supporting sources</strong><span>Give the engine more context if you already have it.</span></div><SlidersHorizontal size={16} /></div><textarea value={sourceText} onChange={(e) => setSourceText(e.target.value)} placeholder="Optional source text, URLs, or notes…" /></div></div><div className="workspace-card upload-card"><div className="mini-heading"><div><strong>Or upload a document</strong><span>We’ll extract the readable text for you.</span></div><Info size={16} /></div><UploadZone label="Add a source document" fileName={fileName} onFile={(file) => setFileName(file.name)} onRemove={() => setFileName(undefined)} /></div>{error && <div className="error-state"><CircleAlert size={17} /><span>{error}</span></div>}<div className="workspace-submit"><Button onClick={() => onAnalyze({ text, sourceText, title: text ? text.slice(0, 48) : fileName || undefined })} disabled={!text && !fileName}>Analyze information <ArrowRight size={16} /></Button><span><LockKeyhole size={13} /> Your content stays private in this workspace.</span></div></div><WorkspaceAside tool="trustlens" /></div>}</div>
}

function ScamShieldWorkspace({ onAnalyze, busy, progressIndex, text, setText, fileName, setFileName, documentFileName, setDocumentFileName, error }: { onAnalyze: (payload: { text?: string; title?: string }) => void; busy: boolean; progressIndex: number; text: string; setText: (value: string) => void; fileName?: string; setFileName: (value?: string) => void; documentFileName?: string; setDocumentFileName: (value?: string) => void; error: string | null }) {
  return <div className="workspace-view"><WorkspaceHeader tool="scamshield" onBack={() => onAnalyze({})} />{busy ? <ProgressPanel tool="scamshield" progressIndex={progressIndex} content={text} /> : <div className="workspace-grid"><div className="workspace-main"><div className="workspace-card input-card shield-input-card"><div className="shield-input-heading"><div className="shield-mark"><ShieldAlert size={19} /></div><div><strong>Paste the message or content</strong><span>We’ll look for signals that deserve a closer look.</span></div></div><textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste a message, email, prompt, or suspicious instruction here…" /><div className="editor-footer"><span><ShieldCheck size={14} /> Sensitive details are masked in reports</span><span>{text.length}/10,000</span></div></div><div className="upload-split"><UploadZone label="Upload a screenshot" fileName={fileName} onFile={(file) => setFileName(file.name)} onRemove={() => setFileName(undefined)} hint="PNG or JPG up to 10MB" /><UploadZone label="Upload a document" fileName={documentFileName} onFile={(file) => setDocumentFileName(file.name)} onRemove={() => setDocumentFileName(undefined)} /></div>{error && <div className="error-state"><CircleAlert size={17} /><span>{error}</span></div>}<div className="workspace-submit"><Button onClick={() => onAnalyze({ text, title: text ? text.slice(0, 48) : fileName || documentFileName || undefined })} disabled={!text && !fileName && !documentFileName}>Analyze content <ArrowRight size={16} /></Button><span><LockKeyhole size={13} /> We never need your real credentials to assess a message.</span></div></div><WorkspaceAside tool="scamshield" /></div>}</div>
}

function DocuMatchWorkspace({ onAnalyze, busy, progressIndex, fileA, setFileA, fileB, setFileB, error }: { onAnalyze: (payload: { documentA?: string; documentB?: string; title?: string }) => void; busy: boolean; progressIndex: number; fileA?: string; setFileA: (value?: string) => void; fileB?: string; setFileB: (value?: string) => void; error: string | null }) {
  return <div className="workspace-view"><WorkspaceHeader tool="documatch" onBack={() => onAnalyze({})} />{busy ? <ProgressPanel tool="documatch" progressIndex={progressIndex} /> : <div className="workspace-grid"><div className="workspace-main"><div className="compare-upload-grid"><div><div className="upload-label-row"><span>DOCUMENT A</span><span className="optional-label">Original</span></div><UploadZone label="Add first document" fileName={fileA} onFile={(file) => setFileA(file.name)} onRemove={() => setFileA(undefined)} /></div><div className="compare-connector"><span>VS</span></div><div><div className="upload-label-row"><span>DOCUMENT B</span><span className="optional-label">Updated version</span></div><UploadZone label="Add second document" fileName={fileB} onFile={(file) => setFileB(file.name)} onRemove={() => setFileB(undefined)} /></div></div><div className="compare-tip"><Info size={16} /><span>Best results come from text-based documents with clear section headings.</span></div>{error && <div className="error-state"><CircleAlert size={17} /><span>{error}</span></div>}<div className="workspace-submit"><Button onClick={() => onAnalyze({ documentA: fileA, documentB: fileB, title: fileA && fileB ? `${fileA} vs ${fileB}` : undefined })} disabled={!fileA || !fileB}>Compare documents <ArrowRight size={16} /></Button><span><LockKeyhole size={13} /> Files are used only for this comparison.</span></div></div><WorkspaceAside tool="documatch" /></div>}</div>
}

function WorkspaceAside({ tool }: { tool: ToolType }) {
  const copy = tool === 'trustlens' ? { title: 'A better question than “is this true?”', text: 'TrustLens separates supported, uncertain, and conflicting claims so you know where human judgment matters most.', points: ['Claim extraction', 'Evidence ranking', 'Attention notes'] } : tool === 'scamshield' ? { title: 'Caution is a useful signal.', text: 'ScamShield does not make a verdict. It surfaces patterns and privacy concerns so you can choose a safer next step.', points: ['Privacy awareness', 'Pattern review', 'Safer next steps'] } : { title: 'Change is easier to act on when it is prioritized.', text: 'DocuMatch puts meaningful edits ahead of line-by-line noise, so review time goes where it matters.', points: ['Meaningful diffs', 'Conflict spotting', 'Priority changes'] }
  return <aside className="workspace-aside"><div className={`aside-glow ${toolMeta[tool].color}`}><div className="aside-orb"><ToolIcon tool={tool} size={22} /></div><span className="card-eyebrow">WHY THIS LENS</span><h3>{copy.title}</h3><p>{copy.text}</p><div className="aside-points">{copy.points.map((point) => <div key={point}><Check size={14} />{point}</div>)}</div></div><div className="aside-footnote"><LockKeyhole size={14} /><span>TrustLens AI is designed to assist your review — not replace your judgment.</span></div></aside>
}

function ReportView({ analysis, onBack, onSave }: { analysis: AnalysisRecord; onBack: () => void; onSave: () => void }) {
  return <div className="report-view"><div className="report-topline"><button className="back-button" onClick={onBack}><ArrowLeft size={15} /> Back to workspace</button><div className="report-actions"><Button variant="ghost" onClick={onSave}><CheckCircle2 size={15} /> Save report</Button><button className="icon-button"><MoreHorizontal size={18} /></button></div></div>{analysis.result.kind === 'trustlens' && <TrustReportView report={analysis.result} />}{analysis.result.kind === 'scamshield' && <ScamReportView report={analysis.result} />}{analysis.result.kind === 'documatch' && <DocuMatchReportView report={analysis.result} />}</div>
}

function ReportHeader({ eyebrow, icon: Icon, iconTone, title, assessment, copy, score, badgeTone }: { eyebrow: string; icon: LucideIcon; iconTone: string; title: string; assessment: string; copy: string; score?: number; badgeTone: 'success' | 'warning' | 'danger' | 'blue' }) {
  return <><div className="report-heading-row"><div><div className="eyebrow-row"><span>{eyebrow}</span><StatusBadge label="Demo analysis" tone="blue" /></div><h1>{title}</h1><p>Completed just now · Structured intelligence report</p></div><div className="report-heading-icon"><Icon size={22} /></div></div><div className={`assessment-card assessment-${iconTone}`}><div className="assessment-symbol"><Icon size={23} /></div><div className="assessment-copy"><span className="card-eyebrow">OVERALL ASSESSMENT</span><h2>{assessment}</h2><p>{copy}</p></div>{score !== undefined && <div className="assessment-score"><div className="score-ring" style={{ '--score': `${score * 3.6}deg` } as React.CSSProperties}><strong>{score}</strong><span>/100</span></div><small>assessment signal</small></div>}</div></>
}

function TrustReportView({ report }: { report: TrustReport }) {
  const tone = report.assessment === 'SUPPORTED' ? 'success' : report.assessment === 'CONFLICTING INFORMATION' ? 'danger' : 'warning'
  return <div><ReportHeader eyebrow="TRUSTLENS / TRUST REPORT" icon={Search} iconTone={tone} title={report.title} assessment={report.assessment} copy={report.assessmentCopy} score={report.score} badgeTone={tone} /><div className="report-grid"><section className="report-main"><div className="report-section-heading"><div><SectionLabel icon={Search}>Key claims</SectionLabel><h2>What the analysis found.</h2></div><span>{report.claims.length} claims reviewed</span></div><div className="claim-list">{report.claims.map((claim) => <ClaimCard key={claim.id} claim={claim} />)}</div><div className="report-section-heading evidence-heading"><div><SectionLabel icon={BookOpenCheck}>Evidence</SectionLabel><h2>Read the reasoning behind the signal.</h2></div></div><div className="evidence-list">{report.evidence.map((item, index) => <EvidenceRow key={`${item.source}-${index}`} item={item} />)}</div></section><aside className="report-side"><AttentionCard items={report.attention} /><div className="report-side-card"><span className="card-eyebrow">ASSESSMENT NOTE</span><p>These signals summarize the supplied content and evidence. They are not a guarantee of truth.</p><div className="side-note-line"><Info size={14} /> Use the attention points to guide a human review.</div></div></aside></div></div>
}

function ClaimCard({ claim }: { claim: TrustClaim }) {
  const label = claim.status === 'supported' ? 'Supported' : claim.status === 'conflicting' ? 'Conflicting' : 'Needs more evidence'
  const tone = claim.status === 'supported' ? 'success' : claim.status === 'conflicting' ? 'danger' : 'warning'
  return <article className="claim-card"><div className="claim-top"><StatusBadge label={label} tone={tone} /><span className="claim-index">Claim {claim.id.split('-')[1]}</span></div><h3>{claim.claim}</h3><p>{claim.summary}</p><div className="claim-evidence">{claim.evidence.map((item, index) => <EvidenceRow key={`${item.source}-${index}`} item={item} compact />)}</div>{claim.note && <div className="claim-note"><Info size={14} /><span>{claim.note}</span></div>}</article>
}

function EvidenceRow({ item, compact = false }: { item: { source: string; excerpt: string; relation: 'supports' | 'context' | 'conflicts' }; compact?: boolean }) {
  const tone = item.relation === 'supports' ? 'success' : item.relation === 'conflicts' ? 'danger' : 'warning'
  return <div className={`evidence-row ${compact ? 'evidence-compact' : ''}`}><div className={`evidence-mark ${tone}`}><BookOpenCheck size={14} /></div><div><div className="evidence-source"><strong>{item.source}</strong><span className={`evidence-relation ${tone}`}>{item.relation}</span></div><p>“{item.excerpt}”</p></div></div>
}

function AttentionCard({ items }: { items: string[] }) {
  return <div className="attention-card"><div className="attention-heading"><div className="attention-icon"><AlertTriangle size={17} /></div><div><span className="card-eyebrow">ATTENTION NEEDED</span><h3>Look closer here.</h3></div></div><div className="attention-list">{items.map((item, index) => <div key={item}><span>0{index + 1}</span><p>{item}</p></div>)}</div></div>
}

function ScamReportView({ report }: { report: ScamReport }) {
  const tone = report.assessment === 'LOW CONCERN' ? 'success' : report.assessment === 'HIGHER RISK' ? 'danger' : 'warning'
  return <div><ReportHeader eyebrow="SCAMSHIELD / RISK ASSESSMENT" icon={ShieldCheck} iconTone={tone} title={report.title} assessment={report.assessment} copy={report.assessmentCopy} score={report.score} badgeTone={tone} /><div className="disclaimer"><Info size={16} /><span>This assessment provides information to help you evaluate content. It does not guarantee whether something is safe, legitimate, or fraudulent.</span></div><div className="risk-grid"><section className="report-main"><div className="report-section-heading"><div><SectionLabel icon={LockKeyhole}>Privacy</SectionLabel><h2>What was protected.</h2></div></div><div className="privacy-grid">{report.privacy.map((finding) => <div className="privacy-card" key={finding.label}><div className={`privacy-icon ${finding.status}`}><LockKeyhole size={16} /></div><div><strong>{finding.label}</strong><p>{finding.detail}</p></div></div>)}</div><div className="report-section-heading evidence-heading"><div><SectionLabel icon={ShieldAlert}>Content safety</SectionLabel><h2>Patterns worth noticing.</h2></div></div><div className="pattern-list">{report.patterns.map((pattern) => <div className="pattern-row" key={pattern.label}><div className={`pattern-icon ${pattern.severity}`}><AlertTriangle size={15} /></div><div><div className="pattern-title"><strong>{pattern.label}</strong><StatusBadge label={pattern.severity === 'high' ? 'High signal' : pattern.severity === 'medium' ? 'Review' : 'Low signal'} tone={pattern.severity === 'high' ? 'danger' : pattern.severity === 'medium' ? 'warning' : 'neutral'} /></div><p>{pattern.detail}</p></div></div>)}</div></section><aside className="report-side"><div className="attention-card next-steps-card"><div className="attention-heading"><div className="attention-icon violet"><ArrowRight size={17} /></div><div><span className="card-eyebrow">SAFER NEXT STEPS</span><h3>Choose your next move.</h3></div></div><div className="attention-list">{report.nextSteps.map((item, index) => <div key={item}><span>0{index + 1}</span><p>{item}</p></div>)}</div></div><div className="report-side-card"><span className="card-eyebrow">WHY THIS WAS FLAGGED</span><p>Urgency, an unverified link, and a credential request appear together. None proves fraud on its own; together they justify an independent check.</p></div></aside></div></div>
}

function DocuMatchReportView({ report }: { report: DocuMatchReport }) {
  return <div><ReportHeader eyebrow="DOCUMATCH / COMPARISON COMPLETE" icon={FileDiff} iconTone="blue" title={report.title} assessment="COMPARISON COMPLETE" copy="The two documents share a common structure, with a small set of meaningful changes to review before you treat them as equivalent." badgeTone="blue" /><div className="summary-card-grid">{[['Matching information', report.summary.matching, 'success'], ['New information', report.summary.newInformation, 'blue'], ['Conflicting information', report.summary.conflicts, 'danger'], ['Changes requiring attention', report.summary.attention, 'warning']].map(([label, value, tone]) => <div className="comparison-stat" key={label as string}><span className={`stat-accent ${tone}`} /><span className="card-eyebrow">{label as string}</span><strong>{value as number}</strong><small>sections</small></div>)}</div><div className="comparison-layout"><section className="comparison-panel"><div className="comparison-panel-heading"><div><SectionLabel icon={FileDiff}>Side-by-side review</SectionLabel><h2>Document A <span>vs</span> Document B</h2></div><div className="comparison-legend"><span><i className="legend-match" />Match</span><span><i className="legend-change" />Changed</span><span><i className="legend-conflict" />Conflict</span></div></div><div className="comparison-head"><span>DOCUMENT A / ORIGINAL</span><span>DOCUMENT B / UPDATED</span></div><div className="comparison-sections">{report.sections.map((section) => <div className={`comparison-row ${section.changed ? 'row-changed' : ''} ${section.conflict ? 'row-conflict' : ''}`} key={section.label}><span className="comparison-label">{section.label}</span><div><p>{section.documentA}</p></div><div><p>{section.documentB}</p></div></div>)}</div></section><aside className="important-changes"><div className="report-section-heading"><div><SectionLabel icon={AlertTriangle}>Important changes</SectionLabel><h2>Prioritized for review.</h2></div></div><div className="change-list">{report.changes.map((change, index) => <div className="change-item" key={change.title}><div className={`change-number ${change.priority}`}>0{index + 1}</div><div><div className="change-title"><strong>{change.title}</strong><span className={`priority-dot ${change.priority}`} /></div><p>{change.detail}</p></div></div>)}</div></aside></div></div>
}

function HistoryView({ analyses, onOpenReport }: { analyses: AnalysisRecord[]; onOpenReport: (analysis: AnalysisRecord) => void }) {
  const [filter, setFilter] = useState<'all' | ToolType>('all')
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'processing' | 'failed'>('all')
  const [newestFirst, setNewestFirst] = useState(true)
  const filtered = useMemo(() => {
    const next = analyses.filter((analysis) => (filter === 'all' || analysis.toolType === filter) && (statusFilter === 'all' || analysis.status === statusFilter) && analysis.title.toLowerCase().includes(query.toLowerCase()))
    return newestFirst ? next : [...next].reverse()
  }, [analyses, filter, query, statusFilter, newestFirst])
  return <div className="history-view"><div className="page-header"><div><div className="eyebrow-row"><span>REPORTS / HISTORY</span><StatusBadge label={`${analyses.length} saved analyses`} tone="blue" /></div><h1>Analysis History</h1><p>Return to a report, filter by lens, or find the signal you need.</p></div><Button variant="secondary"><Filter size={16} /> Manage filters</Button></div><div className="history-toolbar"><div className="search-field"><Search size={16} /><input placeholder="Search analyses" value={query} onChange={(e) => setQuery(e.target.value)} /><kbd>⌘ K</kbd></div><div className="filter-tabs">{(['all', 'trustlens', 'scamshield', 'documatch'] as const).map((item) => <button className={filter === item ? 'active' : ''} key={item} onClick={() => setFilter(item)}>{item === 'all' ? 'All' : toolMeta[item].name}</button>)}</div><select className="status-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}><option value="all">All statuses</option><option value="completed">Complete</option><option value="processing">Processing</option><option value="failed">Failed</option></select><button className="sort-button" onClick={() => setNewestFirst((current) => !current)}>{newestFirst ? 'Newest first' : 'Oldest first'} <ChevronDown size={15} /></button></div><div className="history-list">{filtered.map((analysis) => <button className="history-row" key={analysis.id} onClick={() => onOpenReport(analysis)}><div className={`history-tool-icon ${toolMeta[analysis.toolType].color}`}><ToolIcon tool={analysis.toolType} size={18} /></div><div className="history-title"><strong>{analysis.title}</strong><span>{toolMeta[analysis.toolType].name} · {analysis.mode === 'clocked' ? 'Clocked' : 'Demo workspace'}</span></div><StatusBadge label={analysis.overallAssessment} tone={analysis.toolType === 'scamshield' ? 'warning' : analysis.toolType === 'documatch' ? 'blue' : 'success'} /><span className="history-date">{analysis.createdAt}</span><span className="open-report">Open report <ArrowUpRight size={15} /></span></button>)}{filtered.length === 0 && <div className="empty-state"><Search size={22} /><h3>No matching reports</h3><p>Try another search term or clear the lens filter.</p></div>}</div></div>
}

function SettingsView() {
  return <div className="settings-view"><div className="page-header"><div><div className="eyebrow-row"><span>WORKSPACE SETTINGS</span><StatusBadge label="Placeholder" tone="neutral" /></div><h1>Settings & profile</h1><p>Control how TrustLens AI fits into your review workflow.</p></div></div><div className="settings-grid"><div className="settings-card"><div className="profile-card-large"><div className="avatar large">AM</div><div><span className="card-eyebrow">PROFILE</span><h2>Alex Morgan</h2><p>alex.morgan@example.com</p></div><Button variant="ghost">Edit profile <ArrowRight size={15} /></Button></div><div className="settings-row"><div><strong>Workspace privacy</strong><span>Your demo workspace keeps content local to this experience.</span></div><StatusBadge label="Private" tone="success" /></div><div className="settings-row"><div><strong>Intelligence mode</strong><span>Clocked API can be connected later through a server-side adapter.</span></div><StatusBadge label="Demo mode" tone="blue" /></div></div><div className="settings-card settings-info-card"><div className="settings-info-icon"><LockKeyhole size={18} /></div><span className="card-eyebrow">BUILT FOR CAREFUL REVIEW</span><h2>See the signal. Keep the judgment.</h2><p>TrustLens AI is designed to make complex information easier to inspect without turning an AI assessment into a guarantee.</p><button className="text-button">Read the principles <ArrowRight size={15} /></button></div></div></div>
}

export default function TrustLensApp() {
  const [view, setView] = useState<View>('landing')
  const [activeReport, setActiveReport] = useState<AnalysisRecord | null>(null)
  const [history, setHistory] = useState<AnalysisRecord[]>(demoAnalyses)
  const [busyTool, setBusyTool] = useState<ToolType | null>(null)
  const [progressIndex, setProgressIndex] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [trustText, setTrustText] = useState('')
  const [sourceText, setSourceText] = useState('')
  const [scamText, setScamText] = useState('')
  const [fileName, setFileName] = useState<string | undefined>()
  const [scamDocumentFileName, setScamDocumentFileName] = useState<string | undefined>()
  const [fileA, setFileA] = useState<string | undefined>()
  const [fileB, setFileB] = useState<string | undefined>()

  const navigate = (next: View) => {
    setView(next)
    setNotice(null)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openTool = (tool: ToolType) => { setError(null); navigate(tool) }
  const openReport = (analysis: AnalysisRecord) => { setActiveReport(analysis); navigate('report') }

  const runAnalysis = async (tool: ToolType, payload: { text?: string; sourceText?: string; documentA?: string; documentB?: string; title?: string; demo?: boolean }) => {
    if (!payload.demo && tool === 'trustlens' && !payload.text && !fileName) return
    if (!payload.demo && tool === 'scamshield' && !payload.text && !fileName && !scamDocumentFileName) return
    if (!payload.demo && tool === 'documatch' && (!payload.documentA || !payload.documentB)) return
    setError(null)
    setBusyTool(tool)
    setProgressIndex(0)
    navigate(tool)
    const steps = getProgressSteps(tool, payload.text)
    const timer = window.setInterval(() => setProgressIndex((current) => Math.min(current + 1, steps.length)), 680)
    try {
      const response = await fetch('/api/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ toolType: tool, ...payload }) })
      const data = await response.json() as { analysis?: AnalysisRecord; error?: string }
      if (!response.ok || !data.analysis) throw new Error(data.error || 'Unable to complete analysis.')
      window.clearInterval(timer)
      setProgressIndex(steps.length)
      setBusyTool(null)
      setActiveReport(data.analysis)
      setHistory((current) => [data.analysis as AnalysisRecord, ...current])
      setNotice('Report ready — the important parts are organized below.')
      navigate('report')
    } catch (analysisError) {
      window.clearInterval(timer)
      setBusyTool(null)
      setError(analysisError instanceof Error ? analysisError.message : 'Something went wrong. Please try again.')
    }
  }

  const renderView = () => {
    if (view === 'landing') return <Landing onLaunch={() => navigate('dashboard')} onExplore={() => document.getElementById('product')?.scrollIntoView({ behavior: 'smooth' })} onOpenTool={openTool} />
    if (view === 'dashboard') return <Dashboard analyses={history} onOpenTool={openTool} onOpenReport={openReport} onDemo={(tool) => runAnalysis(tool, { demo: true })} />
    if (view === 'history') return <HistoryView analyses={history} onOpenReport={openReport} />
    if (view === 'settings') return <SettingsView />
    if (view === 'report' && activeReport) return <ReportView analysis={activeReport} onBack={() => navigate(activeReport.toolType)} onSave={() => { setHistory((current) => current.some((item) => item.id === activeReport.id) ? current : [activeReport, ...current]); setNotice('Report saved to your workspace.') }} />
    if (view === 'trustlens') return <TrustLensWorkspace onAnalyze={(payload) => Object.keys(payload).length ? runAnalysis('trustlens', payload) : navigate('dashboard')} busy={busyTool === 'trustlens'} progressIndex={progressIndex} text={trustText} setText={setTrustText} sourceText={sourceText} setSourceText={setSourceText} fileName={fileName} setFileName={setFileName} error={error} />
    if (view === 'scamshield') return <ScamShieldWorkspace onAnalyze={(payload) => Object.keys(payload).length ? runAnalysis('scamshield', payload) : navigate('dashboard')} busy={busyTool === 'scamshield'} progressIndex={progressIndex} text={scamText} setText={setScamText} fileName={fileName} setFileName={setFileName} documentFileName={scamDocumentFileName} setDocumentFileName={setScamDocumentFileName} error={error} />
    return <DocuMatchWorkspace onAnalyze={(payload) => Object.keys(payload).length ? runAnalysis('documatch', payload) : navigate('dashboard')} busy={busyTool === 'documatch'} progressIndex={progressIndex} fileA={fileA} setFileA={setFileA} fileB={fileB} setFileB={setFileB} error={error} />
  }

  if (view === 'landing') return renderView()
  return <AppShell view={view} navigate={navigate}><>{notice && <div className="toast"><CheckCircle2 size={16} /><span>{notice}</span><button onClick={() => setNotice(null)}><X size={14} /></button></div>}{renderView()}</></AppShell>
}
