import React from 'react';
import {
  UploadCloud,
  MessageSquareCode,
  Sparkles,
  ArrowRight,
  Database,
  FileSpreadsheet,
  TrendingUp,
  BrainCircuit,
  Clock,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  BarChart3
} from 'lucide-react';
import { Dataset, RecentProject } from '../types';
import { NavTab } from './Sidebar';

interface HomeViewProps {
  onSelectTab: (tab: NavTab) => void;
  activeDataset: Dataset;
  recentProjects: RecentProject[];
  onOpenProject: (projectId: string) => void;
  onQuickAnalyze: () => void;
  isDark: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectTab,
  activeDataset,
  recentProjects,
  onOpenProject,
  onQuickAnalyze,
  isDark
}) => {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner Hero */}
      <div className="relative overflow-hidden rounded-2xl p-8 md:p-10 border border-theme-border bg-theme-card text-theme-heading shadow-xs transition-colors">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-96 h-96 rounded-full bg-[#38BDF8]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-12 w-80 h-80 rounded-full bg-[#1EA7F2]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-theme-accent border border-theme-border text-theme-primary text-xs font-semibold">
            <BrainCircuit className="w-4 h-4 text-theme-primary" />
            <span>Autonomous Intelligence Engine</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-theme-heading">
            Welcome to <span className="bg-gradient-to-r from-[#1EA7F2] to-[#38BDF8] bg-clip-text text-transparent">DABI AI</span>
          </h1>
          <p className="text-base md:text-lg text-theme-foreground font-medium leading-relaxed">
            Your AI-powered data analyst. Seamlessly ingest CSV & Excel files, converse with natural language queries, and generate interactive dashboards in seconds.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              id="home-analyze-btn"
              onClick={onQuickAnalyze}
              className="btn-primary-gradient flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-[#1EA7F2]/25 transition-all hover:scale-[1.01]"
            >
              <Sparkles className="w-4 h-4" />
              Analyze Active Dataset ({activeDataset.name})
            </button>
            <button
              id="home-upload-btn"
              onClick={() => onSelectTab('data')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-theme-card hover:bg-theme-hover text-theme-heading border border-theme-border hover:border-theme-primary transition-all"
            >
              <UploadCloud className="w-4 h-4 text-theme-primary" />
              Upload New Dataset
            </button>
          </div>
        </div>
      </div>

      {/* Three Main Action Cards */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-theme-muted">
          Core Capabilities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Upload Data */}
          <div
            id="action-card-upload"
            onClick={() => onSelectTab('data')}
            className="group relative p-6 rounded-2xl border border-theme-border bg-theme-card hover:border-theme-primary hover:bg-theme-hover/50 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
          >
            <div className="w-12 h-12 rounded-xl bg-theme-accent text-theme-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-theme-heading mb-1.5 flex items-center justify-between">
              1. Upload Data
              <ArrowRight className="w-4 h-4 text-theme-muted group-hover:text-theme-primary group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-xs text-theme-muted mb-4 leading-relaxed">
              Upload CSV or Excel files (.xlsx, .xls). Automatic schema detection, data type inference, and missing value profiling.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-theme-primary">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              CSV • XLSX • XLS Supported
            </div>
          </div>

          {/* Card 2: Ask DABI */}
          <div
            id="action-card-chat"
            onClick={() => onSelectTab('chat')}
            className="group relative p-6 rounded-2xl border border-theme-border bg-theme-card hover:border-theme-primary hover:bg-theme-hover/50 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
          >
            <div className="w-12 h-12 rounded-xl bg-theme-accent text-theme-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MessageSquareCode className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-theme-heading mb-1.5 flex items-center justify-between">
              2. Ask DABI
              <ArrowRight className="w-4 h-4 text-theme-muted group-hover:text-theme-primary group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-xs text-theme-muted mb-4 leading-relaxed">
              Chat with your data and get instant answers. Uncover revenue trends, top products, customer cohorts, and statistical anomalies.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-theme-primary">
              <BrainCircuit className="w-3.5 h-3.5" />
              Conversational Data Analytics
            </div>
          </div>

          {/* Card 3: Build Dashboard */}
          <div
            id="action-card-builder"
            onClick={() => onSelectTab('builder')}
            className="group relative p-6 rounded-2xl border border-theme-border bg-theme-card hover:border-theme-primary hover:bg-theme-hover/50 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
          >
            <div className="w-12 h-12 rounded-xl bg-theme-accent text-theme-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-theme-heading mb-1.5 flex items-center justify-between">
              3. Build Dashboard
              <ArrowRight className="w-4 h-4 text-theme-muted group-hover:text-theme-primary group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-xs text-theme-muted mb-4 leading-relaxed">
              Let AI automatically create an interactive dashboard. Describe your goals or choose from curated templates with KPI cards and charts.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-theme-primary">
              <TrendingUp className="w-3.5 h-3.5" />
              Instant Reconfigurable Visuals
            </div>
          </div>
        </div>
      </div>

      {/* Dataset Quick Stats Overview */}
      <div className="p-6 rounded-2xl border border-theme-border bg-theme-card shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-theme-accent text-theme-primary flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-theme-heading">
                Active Dataset: {activeDataset.name}
              </h3>
              <p className="text-xs text-theme-muted">
                Uploaded {activeDataset.uploadedAt} • {(activeDataset.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectTab('dashboards')}
              className="btn-primary-gradient px-3.5 py-1.5 text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              Open Dashboard
            </button>
            <button
              onClick={() => onSelectTab('reports')}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-theme-border hover:border-theme-primary text-theme-heading hover:bg-theme-hover transition-colors"
            >
              Generate Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-3 rounded-xl bg-theme-secondary border border-theme-border">
            <p className="text-[11px] text-theme-muted font-medium">Total Rows</p>
            <p className="text-lg font-extrabold text-theme-heading font-mono">
              {activeDataset.rowCount.toLocaleString()}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-theme-secondary border border-theme-border">
            <p className="text-[11px] text-theme-muted font-medium">Analyzed Dimensions</p>
            <p className="text-lg font-extrabold text-theme-heading font-mono">
              {activeDataset.colCount} columns
            </p>
          </div>
          <div className="p-3 rounded-xl bg-theme-secondary border border-theme-border">
            <p className="text-[11px] text-theme-muted font-medium">Data Completeness</p>
            <p className="text-lg font-extrabold text-[#20B981] font-mono">
              {activeDataset.summary.completeness}%
            </p>
          </div>
          <div className="p-3 rounded-xl bg-theme-secondary border border-theme-border">
            <p className="text-[11px] text-theme-muted font-medium">Numeric Metrics</p>
            <p className="text-lg font-extrabold text-theme-primary font-mono">
              {activeDataset.summary.numericCols.length} metrics
            </p>
          </div>
        </div>
      </div>

      {/* Recent Projects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-theme-heading">
              Recent Projects
            </h2>
            <p className="text-xs text-theme-muted">
              Pick up right where you left off or explore saved analytical workspaces
            </p>
          </div>
          <button
            onClick={() => onSelectTab('builder')}
            className="text-xs font-semibold text-theme-primary hover:underline flex items-center gap-1"
          >
            + Create New Project
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => onOpenProject(project.id)}
              className="p-5 rounded-xl border border-theme-border bg-theme-card transition-all cursor-pointer hover:shadow-md hover:border-theme-primary"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-theme-accent text-theme-primary border border-theme-border">
                  {project.category}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-theme-muted font-medium">
                  <Clock className="w-3 h-3 text-theme-primary" />
                  {project.lastActive}
                </span>
              </div>

              <h3 className="text-sm font-bold text-theme-heading mb-1.5 truncate" title={project.title}>
                {project.title}
              </h3>
              <p className="text-xs text-theme-muted font-medium mb-3 flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5 text-theme-primary" />
                <span className="truncate">{project.datasetName}</span>
                <span>•</span>
                <span>{project.rows.toLocaleString()} rows</span>
              </p>

              <div className="pt-3 border-t border-theme-border flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#20B981] truncate">
                  {project.kpiHighlight}
                </span>
                <div className="p-1 rounded bg-theme-accent text-theme-primary">
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
