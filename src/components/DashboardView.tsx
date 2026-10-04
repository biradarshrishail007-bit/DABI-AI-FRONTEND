import React, { useState } from 'react';
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Layers,
  Activity,
  Plus,
  Trash2,
  Maximize2,
  Minimize2,
  ArrowUp,
  ArrowDown,
  Filter,
  Download,
  Share2,
  RotateCcw,
  BarChart2,
  PieChart as PieIcon,
  LineChart as LineIcon,
  Sliders,
  Check,
  X,
  Database,
  Search,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { DashboardConfig, ChartWidget, ChartType, KPICard, Dataset } from '../types';
import { getThemeTokens } from '../theme';

interface DashboardViewProps {
  dashboard: DashboardConfig;
  activeDataset: Dataset;
  onUpdateDashboard: (updated: DashboardConfig) => void;
  isDark: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  dashboard,
  activeDataset,
  onUpdateDashboard,
  isDark
}) => {
  const theme = getThemeTokens(isDark);

  // Filters state
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [timeRange, setTimeRange] = useState<string>('Year-to-Date 2026');

  // Dashboard Table state
  const [tableSearch, setTableSearch] = useState<string>('');
  const [tablePage, setTablePage] = useState<number>(1);
  const tableRowsPerPage = 6;

  // Filtered dataset rows matching active dashboard filters
  const filteredDatasetRows = activeDataset.data.filter((row) => {
    if (selectedRegion !== 'All') {
      const rVal = String(row.Region || row.region || '');
      if (rVal && rVal !== selectedRegion) return false;
    }
    if (selectedCategory !== 'All') {
      const cVal = String(row.Category || row.category || row.name || '');
      if (cVal && cVal !== selectedCategory) return false;
    }
    if (!tableSearch) return true;
    return Object.values(row).some((val) =>
      String(val).toLowerCase().includes(tableSearch.toLowerCase())
    );
  });

  const tableTotalPages = Math.ceil(filteredDatasetRows.length / tableRowsPerPage) || 1;
  const paginatedTableRows = filteredDatasetRows.slice(
    (tablePage - 1) * tableRowsPerPage,
    tablePage * tableRowsPerPage
  );

  const handleExportTableCSV = () => {
    if (!filteredDatasetRows.length) return;
    const headers = activeDataset.columns.map((c) => c.name).join(',');
    const rows = filteredDatasetRows
      .map((row) => activeDataset.columns.map((c) => JSON.stringify(row[c.key] ?? '')).join(','))
      .join('\n');
    const blob = new Blob([headers + '\n' + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dashboard.title.replace(/\s+/g, '_')}_FilteredData.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Add Chart Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newChartTitle, setNewChartTitle] = useState('');
  const [newChartType, setNewChartType] = useState<ChartType>('bar');
  const [newChartMetric, setNewChartMetric] = useState<'Sales' | 'Profit' | 'Units'>('Sales');
  const [newChartDimension, setNewChartDimension] = useState<'Region' | 'Category' | 'Month'>('Region');

  const getKPIIcon = (iconName: string) => {
    switch (iconName) {
      case 'dollar':
        return <DollarSign className="w-5 h-5" />;
      case 'shopping-bag':
        return <ShoppingBag className="w-5 h-5" />;
      case 'trending-up':
        return <TrendingUp className="w-5 h-5" />;
      case 'layers':
        return <Layers className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  // Reorder chart
  const moveChart = (index: number, direction: 'up' | 'down') => {
    const newCharts = [...dashboard.charts];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newCharts.length) return;
    const temp = newCharts[index];
    newCharts[index] = newCharts[targetIndex];
    newCharts[targetIndex] = temp;
    onUpdateDashboard({ ...dashboard, charts: newCharts });
  };

  // Toggle chart width
  const toggleChartWidth = (id: string) => {
    const newCharts = dashboard.charts.map((c) => {
      if (c.id === id) {
        return { ...c, width: (c.width === 'full' ? 'half' : 'full') as 'half' | 'full' };
      }
      return c;
    });
    onUpdateDashboard({ ...dashboard, charts: newCharts });
  };

  // Change chart type
  const changeChartType = (id: string, newType: ChartType) => {
    const newCharts = dashboard.charts.map((c) => {
      if (c.id === id) {
        return { ...c, type: newType };
      }
      return c;
    });
    onUpdateDashboard({ ...dashboard, charts: newCharts });
  };

  // Delete chart
  const deleteChart = (id: string) => {
    const newCharts = dashboard.charts.filter((c) => c.id !== id);
    onUpdateDashboard({ ...dashboard, charts: newCharts });
  };

  // Add Chart handler
  const handleAddChart = () => {
    if (!newChartTitle.trim()) return;

    let sampleData: Array<Record<string, any>> = [];
    let xKey = 'name';
    let yKey = newChartMetric;

    if (newChartDimension === 'Region') {
      xKey = 'region';
      sampleData = [
        { region: 'North America', [newChartMetric]: 410000 },
        { region: 'Asia Pacific', [newChartMetric]: 480500 },
        { region: 'Europe', [newChartMetric]: 384700 },
        { region: 'Middle East', [newChartMetric]: 221000 },
        { region: 'Latin America', [newChartMetric]: 80200 }
      ];
    } else if (newChartDimension === 'Category') {
      xKey = 'name';
      sampleData = [
        { name: 'Analytics Pro', [newChartMetric]: 419400 },
        { name: 'AI Tools', [newChartMetric]: 434300 },
        { name: 'Cloud Services', [newChartMetric]: 335700 },
        { name: 'Data Pipeline', [newChartMetric]: 197100 }
      ];
    } else {
      xKey = 'month';
      sampleData = [
        { month: 'Q1', [newChartMetric]: 580000 },
        { month: 'Q2', [newChartMetric]: 642000 },
        { month: 'Q3', [newChartMetric]: 780000 },
        { month: 'Q4', [newChartMetric]: 920000 }
      ];
    }

    const newWidget: ChartWidget = {
      id: 'custom-' + Date.now(),
      title: newChartTitle,
      type: newChartType,
      width: 'half',
      xKey,
      yKey,
      description: `Custom ${newChartMetric} breakdown grouped by ${newChartDimension}`,
      data: sampleData
    };

    onUpdateDashboard({
      ...dashboard,
      charts: [...dashboard.charts, newWidget]
    });

    setIsAddModalOpen(false);
    setNewChartTitle('');
  };

  // Export Dashboard JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dashboard, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${dashboard.title.replace(/\s+/g, '_')}_Config.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const renderWidgetGraphic = (chart: ChartWidget) => {
    // Apply filters to data if categorical
    let data = chart.data;
    if (selectedRegion !== 'All' && chart.xKey === 'region') {
      data = data.filter((d) => d.region === selectedRegion);
    }
    if (selectedCategory !== 'All' && chart.xKey === 'name') {
      data = data.filter((d) => d.name === selectedCategory);
    }

    return (
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {chart.type === 'area' ? (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id={`grad-${chart.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.primary} stopOpacity={0.7} />
                  <stop offset="95%" stopColor={theme.primaryBright} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
              <XAxis dataKey={chart.xKey} tick={{ fontSize: 11, fill: theme.muted }} />
              <YAxis
                tick={{ fontSize: 11, fill: theme.muted }}
                tickFormatter={(v) => (typeof v === 'number' && v > 999 ? `$${(v / 1000).toFixed(0)}k` : v)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.chartTooltipBg,
                  borderColor: theme.chartTooltipBorder,
                  borderRadius: 8,
                  fontSize: 12,
                  color: theme.chartTooltipText
                }}
              />
              <Area
                type="monotone"
                dataKey={chart.yKey}
                stroke={theme.primary}
                strokeWidth={2.5}
                fillOpacity={1}
                fill={`url(#grad-${chart.id})`}
              />
            </AreaChart>
          ) : chart.type === 'line' ? (
            <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
              <XAxis dataKey={chart.xKey} tick={{ fontSize: 11, fill: theme.muted }} />
              <YAxis
                tick={{ fontSize: 11, fill: theme.muted }}
                tickFormatter={(v) => (typeof v === 'number' && v > 999 ? `$${(v / 1000).toFixed(0)}k` : v)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.chartTooltipBg,
                  borderColor: theme.chartTooltipBorder,
                  borderRadius: 8,
                  fontSize: 12,
                  color: theme.chartTooltipText
                }}
              />
              <Line type="monotone" dataKey={chart.yKey} stroke={theme.primary} strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          ) : chart.type === 'pie' ? (
            <PieChart>
              <Pie
                data={data}
                dataKey={chart.yKey}
                nameKey={chart.xKey}
                cx="50%"
                cy="50%"
                outerRadius={75}
                label={(entry) => `${entry.name || entry[chart.xKey]}`}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={theme.pieColors[index % theme.pieColors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.chartTooltipBg,
                  borderColor: theme.chartTooltipBorder,
                  borderRadius: 8,
                  fontSize: 12,
                  color: theme.chartTooltipText
                }}
              />
            </PieChart>
          ) : (
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
              <XAxis
                dataKey={chart.xKey}
                tick={{ fontSize: 10, fill: theme.muted }}
                angle={-15}
                textAnchor="end"
              />
              <YAxis
                tick={{ fontSize: 11, fill: theme.muted }}
                tickFormatter={(v) => (typeof v === 'number' && v > 999 ? `$${(v / 1000).toFixed(0)}k` : v)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.chartTooltipBg,
                  borderColor: theme.chartTooltipBorder,
                  borderRadius: 8,
                  fontSize: 12,
                  color: theme.chartTooltipText
                }}
              />
              <Bar dataKey={chart.yKey} fill={theme.primary} radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Dashboard Top Action & Filter Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl md:text-2xl font-extrabold text-theme-heading">
              {dashboard.title}
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-theme-accent text-theme-primary border border-theme-border">
              Live Interactive
            </span>
          </div>
          <p className="text-xs text-theme-muted mt-0.5">
            Synchronized with <strong className="text-theme-heading">{activeDataset.name}</strong> • Updated just now
          </p>
        </div>

        {/* Global Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="add-chart-btn"
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary-gradient flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl shadow-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Chart
          </button>

          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-theme-border bg-theme-card text-theme-foreground hover:bg-theme-hover transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-theme-primary" />
            Export Dashboard
          </button>
        </div>
      </div>

      {/* Multidimensional Filter Bar */}
      <div className="p-4 rounded-xl border border-theme-border bg-theme-card shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs transition-colors">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-theme-muted font-semibold">
            <Filter className="w-3.5 h-3.5 text-theme-primary" />
            <span>Filters:</span>
          </div>

          {/* Region Filter */}
          <div className="flex items-center gap-1">
            <span className="text-theme-muted">Region:</span>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-theme-border bg-theme-secondary text-theme-heading text-xs font-medium focus:outline-none focus:ring-1 focus:ring-theme-primary"
            >
              <option value="All">All Regions</option>
              <option value="North America">North America</option>
              <option value="Europe">Europe</option>
              <option value="Asia Pacific">Asia Pacific</option>
              <option value="Middle East">Middle East</option>
              <option value="Latin America">Latin America</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1">
            <span className="text-theme-muted">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-theme-border bg-theme-secondary text-theme-heading text-xs font-medium focus:outline-none focus:ring-1 focus:ring-theme-primary"
            >
              <option value="All">All Categories</option>
              <option value="Analytics Pro">Analytics Pro</option>
              <option value="AI Tools">AI Tools</option>
              <option value="Cloud Services">Cloud Services</option>
              <option value="Data Pipeline">Data Pipeline</option>
            </select>
          </div>

          {/* Time Range */}
          <div className="flex items-center gap-1">
            <span className="text-theme-muted">Period:</span>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-theme-border bg-theme-secondary text-theme-heading text-xs font-medium focus:outline-none focus:ring-1 focus:ring-theme-primary"
            >
              <option value="Year-to-Date 2026">Year-to-Date 2026</option>
              <option value="Q3 2026">Q3 2026</option>
              <option value="Q2 2026">Q2 2026</option>
              <option value="Q1 2026">Q1 2026</option>
              <option value="Last 30 Days">Last 30 Days</option>
            </select>
          </div>
        </div>

        {(selectedRegion !== 'All' || selectedCategory !== 'All') && (
          <button
            onClick={() => {
              setSelectedRegion('All');
              setSelectedCategory('All');
            }}
            className="flex items-center gap-1 text-[11px] font-semibold text-rose-500 hover:underline"
          >
            <X className="w-3 h-3" />
            Reset Filters
          </button>
        )}
      </div>

      {/* Dataset Summary Strip */}
      <div className="p-4 rounded-xl border border-theme-border bg-theme-secondary flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-theme-accent text-theme-primary border border-theme-border flex items-center justify-center flex-shrink-0">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-theme-heading">{activeDataset.name}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-theme-accent text-theme-primary font-semibold border border-theme-border">
                ACTIVE DATASET
              </span>
            </div>
            <p className="text-theme-muted text-[11px]">
              {activeDataset.rowCount.toLocaleString()} records • {activeDataset.colCount} attributes • {activeDataset.summary.duplicateRows} duplicate rows
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="px-2.5 py-1 rounded-lg border border-theme-border bg-theme-card">
            <span className="text-theme-muted">Health: </span>
            <span className="font-semibold font-mono text-[#20B981]">
              {activeDataset.summary.completeness}%
            </span>
          </div>
          <div className="px-2.5 py-1 rounded-lg border border-theme-border bg-theme-card">
            <span className="text-theme-muted">Missing: </span>
            <span className={`font-semibold font-mono ${activeDataset.summary.missingCells === 0 ? 'text-[#20B981]' : 'text-amber-500'}`}>
              {activeDataset.summary.missingCells} cells
            </span>
          </div>
          <div className="px-2.5 py-1 rounded-lg border border-theme-border bg-theme-card">
            <span className="text-theme-muted">Records Shown: </span>
            <span className="font-semibold text-theme-primary">
              {filteredDatasetRows.length} of {activeDataset.rowCount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 5 KPI Cards: Total Revenue, Total Sales, Total Orders, Total Profit, Average Order Value */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {dashboard.kpis.map((kpi) => (
          <div
            key={kpi.id}
            className="p-4 rounded-xl border border-theme-border bg-theme-card shadow-xs transition-all hover:shadow-md hover:border-theme-primary/40"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-theme-muted font-semibold truncate" title={kpi.title}>
                {kpi.title}
              </span>
              <div className="w-8 h-8 rounded-lg bg-theme-accent text-theme-primary border border-theme-border flex items-center justify-center flex-shrink-0">
                {getKPIIcon(kpi.iconName)}
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-theme-heading font-mono">
                {kpi.value}
              </span>
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-theme-border text-[11px]">
              <span className="text-[#20B981] font-bold font-mono">
                {kpi.change}
              </span>
              <span className="text-theme-muted truncate">{kpi.subtitle}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Dynamic Grid of Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {dashboard.charts.map((chart, idx) => (
          <div
            key={chart.id}
            className={`p-5 rounded-xl border border-theme-border bg-theme-card shadow-xs transition-all ${
              chart.width === 'full' ? 'lg:col-span-2' : 'lg:col-span-1'
            }`}
          >
            {/* Chart Header with Controls: Type Switcher, Width, Reorder, Delete */}
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-theme-border">
              <div>
                <h3 className="text-sm font-bold text-theme-heading">
                  {chart.title}
                </h3>
                {chart.description && (
                  <p className="text-[11px] text-theme-muted">
                    {chart.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1 text-theme-muted">
                {/* 1-Click Type Switcher Buttons */}
                <div className="flex items-center bg-theme-secondary border border-theme-border p-0.5 rounded-lg mr-1">
                  <button
                    onClick={() => changeChartType(chart.id, 'bar')}
                    className={`p-1 rounded ${chart.type === 'bar' ? 'bg-theme-primary text-white shadow-xs' : 'text-theme-muted hover:text-theme-heading'}`}
                    title="Bar Chart"
                  >
                    <BarChart2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => changeChartType(chart.id, 'area')}
                    className={`p-1 rounded ${chart.type === 'area' ? 'bg-theme-primary text-white shadow-xs' : 'text-theme-muted hover:text-theme-heading'}`}
                    title="Area Chart"
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => changeChartType(chart.id, 'line')}
                    className={`p-1 rounded ${chart.type === 'line' ? 'bg-theme-primary text-white shadow-xs' : 'text-theme-muted hover:text-theme-heading'}`}
                    title="Line Chart"
                  >
                    <LineIcon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => changeChartType(chart.id, 'pie')}
                    className={`p-1 rounded ${chart.type === 'pie' ? 'bg-theme-primary text-white shadow-xs' : 'text-theme-muted hover:text-theme-heading'}`}
                    title="Pie Chart"
                  >
                    <PieIcon className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Resize width */}
                <button
                  onClick={() => toggleChartWidth(chart.id)}
                  className="p-1 hover:text-theme-heading rounded hover:bg-theme-hover"
                  title={chart.width === 'full' ? 'Half Width' : 'Full Width'}
                >
                  {chart.width === 'full' ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>

                {/* Move Up */}
                <button
                  onClick={() => moveChart(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1 hover:text-theme-heading rounded hover:bg-theme-hover disabled:opacity-30"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>

                {/* Move Down */}
                <button
                  onClick={() => moveChart(idx, 'down')}
                  disabled={idx === dashboard.charts.length - 1}
                  className="p-1 hover:text-theme-heading rounded hover:bg-theme-hover disabled:opacity-30"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>

                {/* Delete */}
                <button
                  onClick={() => deleteChart(chart.id)}
                  className="p-1 hover:text-rose-500 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  title="Remove Chart"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Chart Canvas */}
            {renderWidgetGraphic(chart)}
          </div>
        ))}
      </div>

      {/* Interactive Filtered Dataset Records Table */}
      <div className="p-6 rounded-2xl border border-theme-border bg-theme-card shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-theme-border">
          <div>
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-theme-primary" />
              <h3 className="text-base font-bold text-theme-heading">
                Synchronized Dataset Records & Dimension Breakdown
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-theme-accent text-theme-primary font-semibold border border-theme-border">
                {filteredDatasetRows.length} matches
              </span>
            </div>
            <p className="text-xs text-theme-muted mt-0.5">
              Inspecting filtered row-level data reflecting active dashboard dimensions
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-theme-muted absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search filtered records..."
                value={tableSearch}
                onChange={(e) => {
                  setTableSearch(e.target.value);
                  setTablePage(1);
                }}
                className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-theme-border bg-theme-secondary text-theme-heading placeholder-theme-muted focus:outline-none focus:ring-1 focus:ring-theme-primary"
              />
            </div>

            <button
              onClick={handleExportTableCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-theme-border hover:bg-theme-hover text-theme-foreground transition-colors shadow-xs"
              title="Download filtered records as CSV"
            >
              <Download className="w-3.5 h-3.5 text-theme-primary" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Tabular data representation */}
        <div className="overflow-x-auto border border-theme-border rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-theme-secondary text-theme-heading border-b border-theme-border">
              <tr>
                <th className="py-2.5 px-3 font-semibold text-theme-muted w-12 text-center">#</th>
                {activeDataset.columns.map((col) => (
                  <th key={col.key} className="py-2.5 px-3 font-semibold whitespace-nowrap">
                    {col.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-border">
              {paginatedTableRows.length > 0 ? (
                paginatedTableRows.map((row, idx) => {
                  const absoluteIndex = (tablePage - 1) * tableRowsPerPage + idx + 1;
                  return (
                    <tr
                      key={idx}
                      className="hover:bg-theme-hover/50 transition-colors"
                    >
                      <td className="py-2.5 px-3 text-theme-muted font-mono text-center">
                        {absoluteIndex}
                      </td>
                      {activeDataset.columns.map((col) => {
                        const val = row[col.key];
                        return (
                          <td
                            key={col.key}
                            className={`py-2.5 px-3 whitespace-nowrap text-theme-foreground ${
                              col.type === 'number' ? 'font-mono text-right' : ''
                            }`}
                          >
                            {val !== null && val !== undefined
                              ? typeof val === 'number'
                                ? val.toLocaleString()
                                : String(val)
                              : <span className="text-theme-muted italic">null</span>}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={activeDataset.columns.length + 1} className="py-8 text-center text-theme-muted">
                    No matching records found for active filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center justify-between pt-3 text-xs text-theme-muted">
          <div>
            Page <span className="font-semibold text-theme-heading">{tablePage}</span> of{' '}
            <span className="font-semibold text-theme-heading">{tableTotalPages}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setTablePage((p) => Math.max(p - 1, 1))}
              disabled={tablePage === 1}
              className="p-1.5 rounded-lg border border-theme-border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-theme-hover text-theme-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTablePage((p) => Math.min(p + 1, tableTotalPages))}
              disabled={tablePage === tableTotalPages}
              className="p-1.5 rounded-lg border border-theme-border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-theme-hover text-theme-foreground transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Chart Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md p-6 rounded-2xl border border-theme-border bg-theme-card text-theme-foreground shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-theme-border mb-4">
              <h3 className="text-base font-bold text-theme-heading flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-theme-primary" />
                Add Custom Chart
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-theme-muted hover:text-theme-heading rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-theme-heading mb-1">Chart Title</label>
                <input
                  type="text"
                  value={newChartTitle}
                  onChange={(e) => setNewChartTitle(e.target.value)}
                  placeholder="e.g. Sales by Territory Variance"
                  className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-secondary text-theme-heading placeholder-theme-muted focus:outline-none focus:ring-2 focus:ring-theme-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-theme-heading mb-1">Chart Visualization Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['bar', 'area', 'line', 'pie'] as ChartType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewChartType(t)}
                      className={`py-2 px-2.5 rounded-xl border font-bold capitalize text-center transition-all ${
                        newChartType === t
                          ? 'border-theme-primary bg-theme-accent text-theme-primary'
                          : 'border-theme-border text-theme-muted hover:bg-theme-hover'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-theme-heading mb-1">Metric (Y-Axis)</label>
                  <select
                    value={newChartMetric}
                    onChange={(e) => setNewChartMetric(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-secondary text-theme-heading focus:outline-none"
                  >
                    <option value="Sales">Sales ($)</option>
                    <option value="Profit">Profit ($)</option>
                    <option value="Units">Units Sold</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-theme-heading mb-1">Dimension (X-Axis)</label>
                  <select
                    value={newChartDimension}
                    onChange={(e) => setNewChartDimension(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-secondary text-theme-heading focus:outline-none"
                  >
                    <option value="Region">Region</option>
                    <option value="Category">Category</option>
                    <option value="Month">Quarter / Period</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-5 mt-4 border-t border-theme-border">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-theme-border hover:bg-theme-hover text-theme-muted transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddChart}
                disabled={!newChartTitle.trim()}
                className="btn-primary-gradient px-5 py-2 text-xs font-bold rounded-xl shadow-sm disabled:opacity-40 transition-all"
              >
                Insert Widget
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
