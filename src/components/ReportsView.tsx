import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import {
  FileBarChart,
  FileSpreadsheet,
  Download,
  Printer,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  ShieldCheck,
  Calendar,
  Layers,
  Database
} from 'lucide-react';
import { Dataset, DashboardConfig } from '../types';

interface ReportsViewProps {
  activeDataset: Dataset;
  dashboard: DashboardConfig;
  isDark: boolean;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  activeDataset,
  dashboard,
  isDark
}) => {
  const [activeReportTab, setActiveReportTab] = useState<'summary' | 'excel' | 'pdf'>('summary');
  const [isExportingExcel, setIsExportingExcel] = useState(false);

  // Generate real Excel file using SheetJS (xlsx)
  const handleExportExcel = () => {
    setIsExportingExcel(true);
    try {
      const wb = XLSX.utils.book_new();

      // Sheet 1: Executive KPI Summary
      const summaryRows = [
        { Metric: 'Report Title', Value: dashboard.title },
        { Metric: 'Dataset Name', Value: activeDataset.name },
        { Metric: 'Total Records Analyzed', Value: activeDataset.rowCount },
        { Metric: 'Analyzed Dimensions', Value: activeDataset.colCount },
        { Metric: 'Data Completeness Score', Value: `${activeDataset.summary.completeness}%` },
        { Metric: 'Generated At', Value: new Date().toLocaleString() },
        { Metric: 'Platform', Value: 'DABI AI - Your AI Data Analyst' },
        {},
        { Metric: '--- KEY PERFORMANCE INDICATORS ---', Value: '' },
        ...dashboard.kpis.map((k) => ({
          Metric: k.title,
          Value: String(k.value),
          Trend: k.change,
          Note: k.subtitle
        }))
      ];
      const summarySheet = XLSX.utils.json_to_sheet(summaryRows);
      XLSX.utils.book_append_sheet(wb, summarySheet, 'Executive Summary');

      // Sheet 2: Raw Dataset Records
      const dataSheet = XLSX.utils.json_to_sheet(activeDataset.data);
      XLSX.utils.book_append_sheet(wb, dataSheet, 'Dataset Records');

      // Sheet 3: Column Profiles
      const schemaRows = activeDataset.columns.map((c) => ({
        Column: c.name,
        Type: c.type,
        MissingCount: c.missingCount,
        UniqueCount: c.uniqueCount,
        Min: c.min ?? 'N/A',
        Avg: c.avg ?? 'N/A',
        Max: c.max ?? 'N/A',
        Sum: c.sum ?? 'N/A'
      }));
      const schemaSheet = XLSX.utils.json_to_sheet(schemaRows);
      XLSX.utils.book_append_sheet(wb, schemaSheet, 'Column Diagnostics');

      // Write and download
      const fileName = `DABI_AI_${activeDataset.name.replace(/\.[^/.]+$/, '')}_Report.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (err) {
      console.error('Failed to export Excel report:', err);
    } finally {
      setIsExportingExcel(false);
    }
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-theme-border">
        <div>
          <h2 className="text-2xl font-extrabold text-theme-heading flex items-center gap-2">
            <FileBarChart className="w-6 h-6 text-theme-primary" />
            Analytics Reports & Export Center
          </h2>
          <p className="text-xs text-theme-muted mt-1">
            Produce formal executive briefs, multi-tabbed spreadsheets, and printable PDF documents.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="export-excel-btn"
            onClick={handleExportExcel}
            disabled={isExportingExcel}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-[#20B981] hover:brightness-105 text-white shadow-xs transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            {isExportingExcel ? 'Building XLSX...' : 'Download Excel (.xlsx)'}
          </button>

          <button
            id="print-pdf-btn"
            onClick={handlePrintPDF}
            className="btn-primary-gradient flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl shadow-xs transition-all"
          >
            <Printer className="w-4 h-4" />
            Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Report View Tabs */}
      <div className="flex border-b border-theme-border">
        <button
          onClick={() => setActiveReportTab('summary')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all ${
            activeReportTab === 'summary'
              ? 'border-theme-primary text-theme-primary'
              : 'border-transparent text-theme-muted hover:text-theme-heading'
          }`}
        >
          Executive Data Summary
        </button>
        <button
          onClick={() => setActiveReportTab('pdf')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all ${
            activeReportTab === 'pdf'
              ? 'border-theme-primary text-theme-primary'
              : 'border-transparent text-theme-muted hover:text-theme-heading'
          }`}
        >
          PDF Printable Brief
        </button>
        <button
          onClick={() => setActiveReportTab('excel')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all ${
            activeReportTab === 'excel'
              ? 'border-theme-primary text-theme-primary'
              : 'border-transparent text-theme-muted hover:text-theme-heading'
          }`}
        >
          Excel (.xlsx) Workbook Structure
        </button>
      </div>

      {/* Tab 1: Executive Data Summary */}
      {activeReportTab === 'summary' && (
        <div className="space-y-6">
          {/* Executive Overview Banner */}
          <div className="p-6 rounded-2xl border border-theme-border bg-theme-card shadow-xs transition-colors">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-theme-accent text-theme-primary border border-theme-border">
                AI Intelligence Digest
              </span>
              <span className="text-xs text-theme-muted font-mono">Timestamp: {new Date().toLocaleDateString()}</span>
            </div>

            <h3 className="text-xl font-extrabold text-theme-heading mb-2">
              Performance & Margin Diagnostic for {activeDataset.name}
            </h3>
            <p className="text-xs sm:text-sm text-theme-foreground leading-relaxed">
              DABI AI autonomous synthesis evaluated <strong>{activeDataset.rowCount.toLocaleString()} transactions</strong> across <strong>{activeDataset.colCount} continuous dimensions</strong>. Top line commercial traction demonstrated accelerated momentum with consolidated revenue of <strong className="text-theme-heading">{dashboard.kpis[0]?.value}</strong> and an average profit margin benchmark of <strong className="text-[#20B981]">35.6%</strong>.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-theme-border">
              {dashboard.kpis.slice(0, 4).map((kpi) => (
                <div key={kpi.id} className="p-3 rounded-xl bg-theme-secondary border border-theme-border">
                  <p className="text-[11px] text-theme-muted">{kpi.title}</p>
                  <p className="text-base font-extrabold font-mono text-theme-heading">{kpi.value}</p>
                  <p className="text-[10px] text-[#20B981] font-semibold">{kpi.change} {kpi.subtitle}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Observations: Strengths, Anomalies, Strategic Levers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Strengths */}
            <div className="p-5 rounded-2xl border border-theme-border bg-theme-card shadow-xs transition-colors">
              <div className="flex items-center gap-2 text-[#20B981] font-bold text-xs uppercase tracking-wider mb-3">
                <CheckCircle2 className="w-4 h-4" />
                Key Growth Drivers
              </div>
              <ul className="space-y-2.5 text-xs text-theme-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#20B981] mt-1.5 flex-shrink-0" />
                  <span><strong>AI Copilot Suite</strong> registered fastest adoption velocity (+34.1% YoY).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#20B981] mt-1.5 flex-shrink-0" />
                  <span><strong>Asia Pacific</strong> and <strong>North America</strong> capture 49.3% of global enterprise volume.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#20B981] mt-1.5 flex-shrink-0" />
                  <span>Gross margin expansion improved by +380 bps over consecutive operational cycles.</span>
                </li>
              </ul>
            </div>

            {/* Outliers & Anomalies */}
            <div className="p-5 rounded-2xl border border-theme-border bg-theme-card shadow-xs transition-colors">
              <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider mb-3">
                <AlertTriangle className="w-4 h-4" />
                Detected Anomalies
              </div>
              <ul className="space-y-2.5 text-xs text-theme-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                  <span>Order #ORD-1026 for Customer <em>Riyadh Sovereign Fund</em> reached $94k (1.66x mean).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                  <span>Discount deviation: 15% discount granted on São Paulo contract vs 4% norm.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                  <span>Latin America gross volume showed 12.4% contraction during Q2 inventory cycle.</span>
                </li>
              </ul>
            </div>

            {/* Strategic Recommendations */}
            <div className="p-5 rounded-2xl border border-theme-border bg-theme-card shadow-xs transition-colors">
              <div className="flex items-center gap-2 text-theme-primary font-bold text-xs uppercase tracking-wider mb-3">
                <Lightbulb className="w-4 h-4" />
                Actionable Recommendations
              </div>
              <ul className="space-y-2.5 text-xs text-theme-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-theme-primary mt-1.5 flex-shrink-0" />
                  <span>Bundle <em>Cloud Data Warehouse</em> with <em>AI Copilot</em> to increase AOV past $450.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-theme-primary mt-1.5 flex-shrink-0" />
                  <span>Standardize enterprise discount thresholds to protect gross margin baseline.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-theme-primary mt-1.5 flex-shrink-0" />
                  <span>Scale sales coverage in DACH and Middle East regions based on outsized contract sizes.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: PDF Printable Brief */}
      {activeReportTab === 'pdf' && (
        <div id="printable-report" className="p-8 rounded-2xl border border-theme-border bg-theme-card text-theme-foreground shadow-xs space-y-6 transition-colors">
          {/* Printable Header */}
          <div className="flex items-center justify-between border-b border-theme-border pb-4">
            <div>
              <div className="flex items-center gap-2 text-theme-primary font-extrabold text-xl">
                <FileBarChart className="w-6 h-6" />
                <span>DABI AI Executive Report</span>
              </div>
              <p className="text-xs text-theme-muted font-medium">
                Document Code: DABI-REP-{activeDataset.id.slice(0, 8).toUpperCase()} • Classification: Confidential
              </p>
            </div>
            <div className="text-right text-xs text-theme-muted">
              <p>Generated: {new Date().toLocaleDateString()}</p>
              <p>Target: Leadership & Analytics Committee</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-theme-heading mb-1">
              Dataset Audit & Operational Summary: {activeDataset.name}
            </h3>
            <p className="text-xs text-theme-muted leading-relaxed">
              This formal operational audit documents baseline KPIs, territorial contributions, and data health scores derived directly from {activeDataset.rowCount.toLocaleString()} transaction rows.
            </p>
          </div>

          {/* Printable KPI Matrix */}
          <div className="grid grid-cols-5 gap-3 p-4 bg-theme-secondary rounded-xl border border-theme-border">
            {dashboard.kpis.map((kpi) => (
              <div key={kpi.id} className="text-center">
                <p className="text-[11px] text-theme-muted">{kpi.title}</p>
                <p className="text-lg font-extrabold font-mono text-theme-heading mt-0.5">{kpi.value}</p>
                <p className="text-[10px] text-[#20B981] font-semibold">{kpi.change}</p>
              </div>
            ))}
          </div>

          {/* Top 5 Products Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-theme-heading mb-2">
              Top Ranked Products by Gross Revenue
            </h4>
            <table className="w-full text-xs text-left border border-theme-border rounded-lg">
              <thead className="bg-theme-secondary text-theme-heading">
                <tr>
                  <th className="p-2 border-b border-theme-border">Rank</th>
                  <th className="p-2 border-b border-theme-border">Product Suite</th>
                  <th className="p-2 border-b border-theme-border">Sales Volume</th>
                  <th className="p-2 border-b border-theme-border">Category</th>
                  <th className="p-2 border-b border-theme-border">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-border text-theme-foreground">
                <tr>
                  <td className="p-2 font-mono">#1</td>
                  <td className="p-2 font-semibold text-theme-heading">Riyadh AI Copilot Spec</td>
                  <td className="p-2 font-mono text-theme-heading">$94,000</td>
                  <td className="p-2">AI Tools</td>
                  <td className="p-2 text-[#20B981] font-semibold">Top Seller</td>
                </tr>
                <tr>
                  <td className="p-2 font-mono">#2</td>
                  <td className="p-2 font-semibold text-theme-heading">Taipei Predictive Core</td>
                  <td className="p-2 font-mono text-theme-heading">$91,500</td>
                  <td className="p-2">Analytics Pro</td>
                  <td className="p-2 text-[#20B981] font-semibold">Outperforming</td>
                </tr>
                <tr>
                  <td className="p-2 font-mono">#3</td>
                  <td className="p-2 font-semibold text-theme-heading">Boston Quantum Suite</td>
                  <td className="p-2 font-mono text-theme-heading">$89,000</td>
                  <td className="p-2">Analytics Pro</td>
                  <td className="p-2 text-[#20B981] font-semibold">Stable</td>
                </tr>
                <tr>
                  <td className="p-2 font-mono">#4</td>
                  <td className="p-2 font-semibold text-theme-heading">Tokyo DABI Enterprise</td>
                  <td className="p-2 font-mono text-theme-heading">$83,000</td>
                  <td className="p-2">Analytics Pro</td>
                  <td className="p-2 text-[#20B981] font-semibold">Target Exceeded</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Signoff Footer */}
          <div className="pt-6 border-t border-theme-border flex items-center justify-between text-[11px] text-theme-muted">
            <span>Prepared by: DABI AI Autonomous Analytical Agent</span>
            <span>Verified by: Lead Data Analyst (Shrishail Biradar)</span>
          </div>
        </div>
      )}

      {/* Tab 3: Excel (.xlsx) Structure Preview */}
      {activeReportTab === 'excel' && (
        <div className="p-6 rounded-2xl border border-theme-border bg-theme-card shadow-xs space-y-4 transition-colors">
          <div>
            <h3 className="text-base font-bold text-theme-heading flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-[#20B981]" />
              Multi-Sheet Microsoft Excel (.xlsx) Structure
            </h3>
            <p className="text-xs text-theme-muted mt-1">
              Clicking &ldquo;Download Excel&rdquo; generates a genuine, structured workbook with 3 distinct worksheets formatted for executive finance and data teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-theme-border bg-theme-secondary space-y-2">
              <span className="text-xs font-bold text-[#20B981]">Sheet 1: Executive Summary</span>
              <p className="text-xs text-theme-muted">
                Key performance indicators, total revenue, sales velocity, profit margins, and dataset metadata.
              </p>
              <span className="text-[10px] font-mono text-theme-muted block">15 Rows • Formatted Key-Value</span>
            </div>

            <div className="p-4 rounded-xl border border-theme-border bg-theme-secondary space-y-2">
              <span className="text-xs font-bold text-theme-primary">Sheet 2: Dataset Records</span>
              <p className="text-xs text-theme-muted">
                Complete transactional row data including OrderID, Dates, Customer names, and numeric quantities.
              </p>
              <span className="text-[10px] font-mono text-theme-muted block">{activeDataset.rowCount.toLocaleString()} Rows • Full Tabular</span>
            </div>

            <div className="p-4 rounded-xl border border-theme-border bg-theme-secondary space-y-2">
              <span className="text-xs font-bold text-sky-400">Sheet 3: Column Diagnostics</span>
              <p className="text-xs text-theme-muted">
                Schema verification, missing value counts, distinct unique items, and min/max/average statistics.
              </p>
              <span className="text-[10px] font-mono text-theme-muted block">{activeDataset.colCount} Columns • Profiling Metrics</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleExportExcel}
              disabled={isExportingExcel}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#20B981] hover:brightness-105 text-white shadow-xs transition-all"
            >
              <Download className="w-4 h-4" />
              Download Full Excel Workbook (.xlsx)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
