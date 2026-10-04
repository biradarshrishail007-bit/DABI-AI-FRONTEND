export type DataType = 'number' | 'string' | 'date' | 'boolean';

export interface ColumnMeta {
  key: string;
  name: string;
  type: DataType;
  missingCount: number;
  uniqueCount: number;
  sampleValues?: any[];
  min?: number;
  max?: number;
  avg?: number;
  median?: number;
  stdDev?: number;
  sum?: number;
}

export interface DatasetSummary {
  rowCount: number;
  colCount: number;
  numericCols: string[];
  categoricalCols: string[];
  dateCols: string[];
  missingCells: number;
  duplicateRows: number;
  completeness: number; // percentage e.g. 98.5
}

export interface CleanOptions {
  dropDuplicates: boolean;
  fillMissingNumeric: 'none' | 'mean' | 'median' | 'zero';
  fillMissingCategorical: 'none' | 'mode' | 'unknown';
  trimStrings: boolean;
}

export interface Dataset {
  id: string;
  name: string;
  size: number;
  rowCount: number;
  colCount: number;
  uploadedAt: string;
  columns: ColumnMeta[];
  data: Record<string, any>[];
  summary: DatasetSummary;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  timestamp: string;
  content: string;
  tableData?: {
    headers: string[];
    rows: (string | number)[][];
  };
  chartData?: {
    title: string;
    type: 'bar' | 'line' | 'area' | 'pie';
    data: Array<Record<string, any>>;
    xKey: string;
    yKey: string;
  };
  stats?: Array<{
    label: string;
    value: string | number;
    change?: string;
    trend?: 'up' | 'down' | 'neutral';
  }>;
  suggestions?: string[];
}

export interface KPICard {
  id: string;
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  subtitle: string;
  iconName: 'dollar' | 'shopping-bag' | 'trending-up' | 'layers' | 'percent' | 'users' | 'activity';
}

export type ChartType = 'bar' | 'line' | 'area' | 'pie';
export type ChartWidth = 'half' | 'full';

export interface ChartWidget {
  id: string;
  title: string;
  type: ChartType;
  width: ChartWidth;
  xKey: string;
  yKey: string;
  description?: string;
  color?: string;
  data: Array<Record<string, any>>;
}

export interface DashboardConfig {
  id: string;
  title: string;
  description: string;
  datasetId: string;
  datasetName: string;
  kpis: KPICard[];
  charts: ChartWidget[];
  activeFilterRegion?: string;
  activeFilterCategory?: string;
  activeTimeRange?: string;
}

export interface RecentProject {
  id: string;
  title: string;
  datasetName: string;
  rows: number;
  columns: number;
  category: string;
  lastActive: string;
  status: 'Ready' | 'Updated' | 'Draft';
  kpiHighlight: string;
}
