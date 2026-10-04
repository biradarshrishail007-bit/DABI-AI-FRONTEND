import React, { useState } from 'react';
import {
  Sparkles,
  Wand2,
  TrendingUp,
  LayoutDashboard,
  BarChart3,
  DollarSign,
  Users,
  CheckCircle2,
  ArrowRight,
  Database,
  Layers,
  Flame,
  Zap
} from 'lucide-react';
import { Dataset, DashboardConfig } from '../types';
import { AnalyticsEngine } from '../services/analyticsEngine';

interface DashboardBuilderViewProps {
  activeDataset: Dataset;
  onDashboardGenerated: (dashboard: DashboardConfig) => void;
  isDark: boolean;
}

export const DashboardBuilderView: React.FC<DashboardBuilderViewProps> = ({
  activeDataset,
  onDashboardGenerated,
  isDark
}) => {
  const [prompt, setPrompt] = useState(
    'Create a sales dashboard showing revenue, profit, monthly sales, top products and regional performance.'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  const steps = [
    'Parsing dataset schema & metrics...',
    'Synthesizing KPI aggregation formulas...',
    'Plotting multi-dimensional charts (Monthly, Regional, Category)...',
    'Applying layout constraints & responsive grids...',
    'Finalizing interactive dashboard view...'
  ];

  const templates = [
    {
      id: 'template-sales',
      title: 'Sales & Revenue Dashboard',
      description: 'Monthly revenue growth, profit margin trends, top 10 products, and regional performance.',
      icon: DollarSign,
      prompt: 'Create a sales dashboard.'
    },
    {
      id: 'template-financial',
      title: 'Financial & Margin Health Dashboard',
      description: 'Net profit margins, EBITDA trajectory, operational expense ratios, and cashflow KPIs.',
      icon: TrendingUp,
      prompt: 'Build a financial dashboard.'
    },
    {
      id: 'template-customer',
      title: 'Customer Insights & Account Intelligence',
      description: 'Top enterprise account spend, customer tiers, retention rates, and territorial distribution.',
      icon: Users,
      prompt: 'Show customer insights.'
    },
    {
      id: 'template-marketing',
      title: 'Marketing Performance Dashboard',
      description: 'Customer acquisition cost, conversion velocity, deal volume, and campaign ROI.',
      icon: LayoutDashboard,
      prompt: 'Build a marketing performance dashboard.'
    },
    {
      id: 'template-product',
      title: 'Product Trends & SKU Velocity',
      description: 'Top grossing software suites, units sold, category velocity, and pricing trajectory.',
      icon: Layers,
      prompt: 'Analyze product trends.'
    }
  ];

  const handleGenerate = async (customPrompt?: string) => {
    const textToUse = customPrompt || prompt;
    if (!textToUse.trim() || isGenerating) return;

    setIsGenerating(true);
    setGenerationStep(0);

    // Simulate animated generation steps
    for (let i = 0; i < steps.length; i++) {
      setGenerationStep(i);
      await new Promise((r) => setTimeout(r, 450));
    }

    try {
      const generated = AnalyticsEngine.generateDefaultDashboard(activeDataset, textToUse.slice(0, 60));
      onDashboardGenerated(generated);
    } catch (e) {
      console.error(e);
      const fallback = AnalyticsEngine.generateDefaultDashboard(activeDataset);
      onDashboardGenerated(fallback);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Title & Description */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-theme-accent text-theme-primary text-xs font-semibold border border-theme-border">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Generative Autonomous Architecture</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-theme-heading">
          Build your Dashboard with AI
        </h1>
        <p className="text-sm text-theme-muted">
          Describe the analytical views, KPIs, or trends you need. DABI AI will inspect your active dataset (<strong className="text-theme-heading">{activeDataset.name}</strong>) and construct an interactive dashboard.
        </p>
      </div>

      {/* Main AI Generation Card */}
      <div className="p-6 md:p-8 rounded-2xl border border-theme-border bg-theme-card shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-theme-muted">
            Describe your desired dashboard:
          </label>
          <div className="flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <span className="text-theme-muted font-medium">Examples:</span>
            {[
              'Create a sales dashboard.',
              'Build a financial dashboard.',
              'Show customer insights.',
              'Build a marketing performance dashboard.',
              'Analyze product trends.'
            ].map((ex, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPrompt(ex)}
                className="whitespace-nowrap px-2 py-0.5 rounded-lg border border-theme-border bg-theme-secondary hover:border-theme-primary text-theme-foreground hover:text-theme-primary transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <textarea
            id="dashboard-prompt-input"
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating}
            placeholder="e.g. Create a sales dashboard showing revenue, profit, monthly sales, top products and regional performance."
            className="w-full p-4 rounded-xl border border-theme-border bg-theme-secondary text-sm text-theme-heading placeholder-theme-muted focus:outline-none focus:ring-2 focus:ring-theme-primary transition-all"
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
            <div className="flex items-center gap-2 text-xs text-theme-muted">
              <Database className="w-4 h-4 text-theme-primary" />
              <span>Context: <strong className="text-theme-heading">{activeDataset.name}</strong> ({activeDataset.rowCount.toLocaleString()} rows)</span>
            </div>

            <button
              id="generate-dashboard-btn"
              onClick={() => handleGenerate()}
              disabled={isGenerating || !prompt.trim()}
              className="btn-primary-gradient w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold shadow-sm transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Wand2 className="w-4 h-4" />
              {isGenerating ? 'Synthesizing Dashboard...' : 'Generate Dashboard'}
            </button>
          </div>
        </div>

        {/* Dynamic Generation Progress Bar */}
        {isGenerating && (
          <div className="mt-6 p-4 rounded-xl bg-theme-accent border border-theme-border space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-theme-heading">
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 animate-bounce text-theme-primary" />
                {steps[generationStep]}
              </span>
              <span className="font-mono text-theme-primary">{Math.round(((generationStep + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-theme-border overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#38BDF8] to-[#1EA7F2] transition-all duration-300 rounded-full"
                style={{ width: `${((generationStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Recommended Dashboard Templates */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-theme-heading flex items-center gap-2">
            <Flame className="w-4 h-4 text-theme-primary" />
            Recommended Dashboard Templates
          </h3>
          <span className="text-xs text-theme-muted">Click any template to auto-fill & generate</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((tpl) => {
            const Icon = tpl.icon;
            return (
              <div
                key={tpl.id}
                onClick={() => {
                  setPrompt(tpl.prompt);
                  handleGenerate(tpl.prompt);
                }}
                className="group p-5 rounded-xl border border-theme-border bg-theme-card shadow-xs transition-all cursor-pointer hover:shadow-md hover:border-theme-primary hover:bg-theme-hover"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-theme-accent text-theme-primary border border-theme-border flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-theme-heading group-hover:text-theme-primary transition-colors">
                        {tpl.title}
                      </h4>
                      <ArrowRight className="w-4 h-4 text-theme-muted group-hover:text-theme-primary group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-xs text-theme-muted mt-1 leading-relaxed">
                      {tpl.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
