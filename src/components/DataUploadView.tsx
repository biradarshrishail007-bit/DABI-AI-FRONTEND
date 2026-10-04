import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Database,
  Search,
  Filter,
  Layers,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Hash,
  Type,
  Calendar,
  ToggleLeft,
  Wand2,
  BarChart2,
  MessageSquare,
  Eraser,
  Check,
  X,
  Trash2,
  ShieldAlert,
  SlidersHorizontal,
  Table as TableIcon
} from 'lucide-react';
import { Dataset, ColumnMeta } from '../types';
import { parseFile, cleanDataset } from '../services/dataProcessor';
import { uploadDataset } from '../services/api';

interface DataUploadViewProps {
  activeDataset: Dataset;
  datasets: Dataset[];
  onSelectDataset: (dataset: Dataset) => void;
  onDeleteDataset: (datasetId: string) => void;
  onDatasetUploaded: (newDataset: Dataset) => void;
  onDatasetUpdated?: (updatedDataset: Dataset) => void;
  onAnalyzeData?: () => void;
  onAskDabi?: () => void;
  onBuildDashboard?: () => void;
  isDark: boolean;
}

export const DataUploadView: React.FC<DataUploadViewProps> = ({
  activeDataset,
  datasets,
  onSelectDataset,
  onDeleteDataset,
  onDatasetUploaded,
  onDatasetUpdated,
  onAnalyzeData,
  onAskDabi,
  onBuildDashboard,
  isDark
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Table preview state
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Schema & Statistics view mode ('cards' | 'stats')
  const [schemaTab, setSchemaTab] = useState<'cards' | 'stats'>('cards');

  // Clean Data Modal state
  const [isCleanModalOpen, setIsCleanModalOpen] = useState(false);
  const [cleanDropDuplicates, setCleanDropDuplicates] = useState(true);
  const [cleanFillNumeric, setCleanFillNumeric] = useState<'none' | 'mean' | 'median' | 'zero'>('median');
  const [cleanFillCategorical, setCleanFillCategorical] = useState<'none' | 'mode' | 'unknown'>('unknown');
  const [cleanTrimStrings, setCleanTrimStrings] = useState(true);
  const [isCleaningInProgress, setIsCleaningInProgress] = useState(false);
  const [cleaningNotice, setCleaningNotice] = useState<string | null>(null);

  const handleApplyClean = () => {
    setIsCleaningInProgress(true);
    try {
      const result = cleanDataset(activeDataset, {
        dropDuplicates: cleanDropDuplicates,
        fillMissingNumeric: cleanFillNumeric,
        fillMissingCategorical: cleanFillCategorical,
        trimStrings: cleanTrimStrings
      });

      if (onDatasetUpdated) {
        onDatasetUpdated(result.cleanedDataset);
      } else {
        onDatasetUploaded(result.cleanedDataset);
      }

      setCleaningNotice(
        `Successfully cleaned dataset: removed ${result.rowsRemoved} duplicate rows and imputed ${result.cellsImputed} missing cells.`
      );
      setIsCleanModalOpen(false);
      setTimeout(() => setCleaningNotice(null), 6000);
    } catch (err: any) {
      setUploadError('Error during dataset cleaning: ' + err.message);
    } finally {
      setIsCleaningInProgress(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

const processFile = async (file: File) => {
  setUploadError(null);
  setSuccessMessage(null);
  setLoading(true);

  try {
    const validExtensions = ['.csv', '.xlsx', '.xls'];
    const ext =
      '.' + file.name.split('.').pop()?.toLowerCase();

    if (!validExtensions.includes(ext)) {
      throw new Error(
        `File format ${ext} is not supported. Please upload CSV, XLSX, or XLS.`
      );
    }

    // 1. Upload to FastAPI backend
    const backendDataset = await uploadDataset(file);

    // 2. Parse locally for preview and statistics
    const parsedDataset = await parseFile(file);

    // 3. Create frontend dataset
    const dataset: Dataset = {
      ...parsedDataset,

      id: backendDataset.id,

      name: backendDataset.filename,

      size: file.size,

      rowCount: backendDataset.rows,

      colCount: backendDataset.columns,

      uploadedAt: new Date().toLocaleString(),

      columns: backendDataset.column_names.map(
        (name) => ({
          key: name,
          name: name,
          type: 'string',
          missingCount: 0,
          uniqueCount: 0,
        })
      ),
    };

    // 4. Send dataset to App.tsx
    onDatasetUploaded(dataset);

    setSuccessMessage(
      `Successfully uploaded "${file.name}" to DABI AI backend (${backendDataset.rows.toLocaleString()} rows, ${backendDataset.columns} columns)`
    );

    setCurrentPage(1);

  } catch (err: any) {
    console.error(err);

    setUploadError(
      err.message || 'Failed to upload the dataset.'
    );

  } finally {
    setLoading(false);
  }
};

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await processFile(files[0]);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  // Filter preview data
  const filteredRows = activeDataset.data.filter((row) => {
    if (!searchTerm) return true;
    return Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage) || 1;
  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'number':
        return <Hash className="w-3.5 h-3.5 text-theme-primary" />;
      case 'date':
        return <Calendar className="w-3.5 h-3.5 text-amber-500" />;
      case 'boolean':
        return <ToggleLeft className="w-3.5 h-3.5 text-sky-400" />;
      default:
        return <Type className="w-3.5 h-3.5 text-[#20B981]" />;
    }
  };

  return (
     <>
   {/* Dataset Manager */}
<div className="p-5 rounded-2xl border border-theme-border bg-theme-card shadow-xs mb-6">
  <div className="flex items-center justify-between mb-4">
    <div>
      <h3 className="text-base font-bold text-theme-heading flex items-center gap-2">
        <Database className="w-4 h-4 text-theme-primary" />
        My Datasets
      </h3>

      <p className="text-xs text-theme-muted mt-1">
        Switch between datasets or delete datasets you no longer need.
      </p>
    </div>

    <span className="text-xs font-semibold text-theme-muted">
      {datasets.length} dataset{datasets.length !== 1 ? 's' : ''}
    </span>
  </div>

  <div className="space-y-2">
    {datasets.map((dataset) => {
      const isActive = dataset.id === activeDataset.id;

      return (
        <div
          key={dataset.id}
          className={`flex items-center justify-between gap-3 p-3 rounded-xl border ${
            isActive
              ? 'border-theme-primary bg-theme-accent'
              : 'border-theme-border bg-theme-secondary'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-theme-card border border-theme-border flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4 text-theme-primary" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-theme-heading truncate">
                {dataset.name}
              </p>

              <p className="text-[11px] text-theme-muted">
                {dataset.rowCount.toLocaleString()} rows × {dataset.colCount} columns
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {isActive ? (
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                ACTIVE
              </span>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onSelectDataset(dataset)}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-semibold border border-theme-border bg-theme-card hover:bg-theme-hover text-theme-heading"
                >
                  Use Dataset
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteDataset(dataset.id)}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-semibold border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/50 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      );
    })}
  </div>
</div>
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Upload Zone */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-theme-heading flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-theme-primary" />
              Upload Dataset
            </h2>
            <p className="text-xs text-theme-muted">
              Drop your spreadsheet or CSV file to start autonomous data analysis
            </p>
          </div>
          <span className="text-[11px] font-semibold text-theme-muted">
            Supported formats: <strong className="text-theme-heading">CSV, XLSX, XLS</strong>
          </span>
        </div>

        <div
          id="drop-zone"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 md:p-12 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-theme-primary bg-theme-accent scale-[1.005]'
              : 'border-theme-border hover:border-theme-primary bg-theme-card hover:bg-theme-secondary'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept=".csv, .xlsx, .xls"
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-3 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-theme-accent text-theme-primary border border-theme-border flex items-center justify-center">
              {loading ? (
                <RefreshCw className="w-8 h-8 animate-spin" />
              ) : (
                <UploadCloud className="w-8 h-8" />
              )}
            </div>

            <div>
              <h3 className="text-base font-bold text-theme-heading">
                {loading ? 'Processing dataset...' : 'Drag & drop your dataset here, or browse files'}
              </h3>
              <p className="text-xs text-theme-muted mt-1">
                Upload CSV or Excel spreadsheets up to 50MB for immediate AI synthesis
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-theme-secondary border border-theme-border text-theme-heading">
                .CSV
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-theme-secondary border border-theme-border text-theme-heading">
                .XLSX
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-theme-secondary border border-theme-border text-theme-heading">
                .XLS
              </span>
            </div>
          </div>
        </div>

        {uploadError && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-[#20B981] text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}
      </div>

      {/* Dataset Metadata Summary Card */}
      <div className="p-6 rounded-2xl border border-theme-border bg-theme-card shadow-xs transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-theme-border">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-theme-accent text-theme-primary border border-theme-border">
                Active Dataset Profile
              </span>
              <span className="text-xs text-theme-muted">ID: {activeDataset.id}</span>
            </div>
            <h3 className="text-xl font-extrabold text-theme-heading flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-theme-primary" />
              {activeDataset.name}
            </h3>
            <p className="text-xs text-theme-muted">
              Uploaded on {activeDataset.uploadedAt} • File size {(activeDataset.size / (1024 * 1024)).toFixed(2)} MB ({(activeDataset.size / 1024).toFixed(0)} KB)
            </p>
          </div>

          {/* 4 Core Actions: Clean Data, Analyze Data, Ask DABI, Build Dashboard */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="clean-data-btn"
              onClick={() => setIsCleanModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-theme-border bg-theme-secondary hover:bg-theme-hover text-theme-heading transition-all"
            >
              <Eraser className="w-3.5 h-3.5 text-theme-primary" />
              Clean Data
            </button>

            <button
              id="analyze-data-btn"
              onClick={onAnalyzeData}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-theme-border bg-theme-secondary hover:bg-theme-hover text-theme-heading transition-all"
            >
              <BarChart2 className="w-3.5 h-3.5 text-theme-primary" />
              Analyze Data
            </button>

            <button
              id="ask-dabi-btn"
              onClick={onAskDabi}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-theme-border bg-theme-secondary hover:bg-theme-hover text-theme-heading transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#20B981]" />
              Ask DABI
            </button>

            <button
              id="build-dashboard-btn"
              onClick={onBuildDashboard}
              className="btn-primary-gradient flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl shadow-xs transition-all"
            >
              <Wand2 className="w-3.5 h-3.5" />
              Build Dashboard
            </button>
          </div>
        </div>

        {cleaningNotice && (
          <div className="my-4 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-[#20B981] text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-[#20B981]" />
            <span>{cleaningNotice}</span>
          </div>
        )}

        {/* 5 Stat Badges: Rows, Columns, Missing Values, Duplicate Rows, Completeness */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 py-5 border-b border-theme-border">
          <div className="p-3.5 rounded-xl bg-theme-secondary border border-theme-border">
            <p className="text-xs text-theme-muted font-medium">Number of Rows</p>
            <p className="text-xl font-extrabold text-theme-heading font-mono mt-0.5">
              {activeDataset.rowCount.toLocaleString()}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-theme-secondary border border-theme-border">
            <p className="text-xs text-theme-muted font-medium">Number of Columns</p>
            <p className="text-xl font-extrabold text-theme-heading font-mono mt-0.5">
              {activeDataset.colCount}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-theme-secondary border border-theme-border">
            <p className="text-xs text-theme-muted font-medium">Missing Values</p>
            <p className={`text-xl font-extrabold font-mono mt-0.5 ${activeDataset.summary.missingCells === 0 ? 'text-[#20B981]' : 'text-amber-500'}`}>
              {activeDataset.summary.missingCells} cells
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-theme-secondary border border-theme-border">
            <p className="text-xs text-theme-muted font-medium">Duplicate Rows</p>
            <p className={`text-xl font-extrabold font-mono mt-0.5 ${activeDataset.summary.duplicateRows === 0 ? 'text-[#20B981]' : 'text-amber-500'}`}>
              {activeDataset.summary.duplicateRows} rows
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-theme-secondary border border-theme-border">
            <p className="text-xs text-theme-muted font-medium">Data Completeness</p>
            <p className="text-xl font-extrabold text-[#20B981] font-mono mt-0.5">
              {activeDataset.summary.completeness}%
            </p>
          </div>
        </div>

        {/* Column Metadata & Statistical Profiles Header */}
        <div className="pt-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-theme-muted flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              Detected Schema & Column Statistics
            </h4>

            {/* Toggle between Schema Cards and Detailed Statistics Table */}
            <div className="p-1 rounded-xl border border-theme-border bg-theme-secondary flex items-center gap-1 text-xs">
              <button
                type="button"
                onClick={() => setSchemaTab('cards')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  schemaTab === 'cards'
                    ? 'btn-primary-gradient shadow-xs'
                    : 'text-theme-muted hover:text-theme-heading'
                }`}
              >
                Schema Cards
              </button>
              <button
                type="button"
                onClick={() => setSchemaTab('stats')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  schemaTab === 'stats'
                    ? 'btn-primary-gradient shadow-xs'
                    : 'text-theme-muted hover:text-theme-heading'
                }`}
              >
                Detailed Statistics
              </button>
            </div>
          </div>

          {schemaTab === 'cards' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeDataset.columns.map((col) => (
                <div
                  key={col.key}
                  className="p-3 rounded-xl border border-theme-border bg-theme-secondary flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-xs text-theme-heading truncate" title={col.name}>
                      {col.name}
                    </span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium uppercase bg-theme-accent border border-theme-border text-theme-heading">
                      {getTypeIcon(col.type)}
                      {col.type}
                    </span>
                  </div>
                  <div className="text-[11px] text-theme-muted space-y-0.5">
                    <div className="flex justify-between">
                      <span>Missing: {col.missingCount}</span>
                      <span>Unique: {col.uniqueCount}</span>
                    </div>
                    {col.type === 'number' && col.avg !== undefined && (
                      <div className="flex justify-between font-mono text-[10px] text-theme-primary pt-1 border-t border-theme-border">
                        <span>Min: {col.min?.toLocaleString()}</span>
                        <span>Avg: {col.avg?.toLocaleString()}</span>
                        <span>Max: {col.max?.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Comprehensive Column Statistics Table (mean, median, std, min, max, null count, unique count) */
            <div className="overflow-x-auto border border-theme-border rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-theme-secondary text-theme-heading border-b border-theme-border">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Column Name</th>
                    <th className="py-2.5 px-3 font-semibold">Type</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Null Count</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Null %</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Unique</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Mean</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Median</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Std Dev</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Min</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Max</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-theme-border font-mono text-theme-foreground">
                  {activeDataset.columns.map((col) => {
                    const nullPct = activeDataset.rowCount > 0 ? ((col.missingCount / activeDataset.rowCount) * 100).toFixed(1) : '0';
                    return (
                      <tr key={col.key} className="transition-colors hover:bg-theme-hover/50">
                        <td className="py-2 px-3 font-sans font-medium text-theme-heading">
                          {col.name}
                        </td>
                        <td className="py-2 px-3">
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] uppercase bg-theme-accent border border-theme-border text-theme-heading">
                            {getTypeIcon(col.type)}
                            {col.type}
                          </span>
                        </td>
                        <td className={`py-2 px-3 text-right ${col.missingCount > 0 ? 'text-amber-500 font-bold' : 'text-theme-muted'}`}>
                          {col.missingCount}
                        </td>
                        <td className={`py-2 px-3 text-right ${col.missingCount > 0 ? 'text-amber-500 font-bold' : 'text-theme-muted'}`}>
                          {nullPct}%
                        </td>
                        <td className="py-2 px-3 text-right text-theme-foreground">
                          {col.uniqueCount}
                        </td>
                        <td className="py-2 px-3 text-right text-theme-primary font-semibold">
                          {col.avg !== undefined ? col.avg.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '-'}
                        </td>
                        <td className="py-2 px-3 text-right text-theme-primary font-semibold">
                          {col.median !== undefined ? col.median.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '-'}
                        </td>
                        <td className="py-2 px-3 text-right text-theme-muted">
                          {col.stdDev !== undefined ? col.stdDev.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '-'}
                        </td>
                        <td className="py-2 px-3 text-right text-theme-muted">
                          {col.min !== undefined ? col.min.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '-'}
                        </td>
                        <td className="py-2 px-3 text-right text-theme-muted">
                          {col.max !== undefined ? col.max.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Data Preview Table */}
      <div className="p-6 rounded-2xl border border-theme-border bg-theme-card shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-theme-heading">
              Data Preview
            </h3>
            <p className="text-xs text-theme-muted">
              Inspecting records from {activeDataset.name} (Showing {paginatedRows.length} of {filteredRows.length})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-theme-muted absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search values..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-theme-border bg-theme-secondary text-theme-heading placeholder-theme-muted focus:outline-none focus:ring-2 focus:ring-theme-primary"
              />
            </div>
          </div>
        </div>

        {/* Scrollable Table */}
        <div className="overflow-x-auto border border-theme-border rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-theme-secondary text-theme-heading border-b border-theme-border">
              <tr>
                <th className="py-2.5 px-3 font-semibold text-theme-muted w-12 text-center">#</th>
                {activeDataset.columns.map((col) => (
                  <th key={col.key} className="py-2.5 px-3 font-semibold whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      {getTypeIcon(col.type)}
                      <span>{col.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-border text-theme-foreground">
              {paginatedRows.length > 0 ? (
                paginatedRows.map((row, idx) => {
                  const absoluteIndex = (currentPage - 1) * rowsPerPage + idx + 1;
                  return (
                    <tr
                      key={idx}
                      className="transition-colors hover:bg-theme-hover/50"
                    >
                      <td className="py-2.5 px-3 text-theme-muted font-mono text-center">
                        {absoluteIndex}
                      </td>
                      {activeDataset.columns.map((col) => {
                        const val = row[col.key];
                        return (
                          <td
                            key={col.key}
                            className={`py-2.5 px-3 whitespace-nowrap ${
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
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center justify-between pt-4 text-xs text-theme-muted">
          <div>
            Page <span className="font-semibold text-theme-heading">{currentPage}</span> of{' '}
            <span className="font-semibold text-theme-heading">{totalPages}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-theme-border bg-theme-card disabled:opacity-40 disabled:cursor-not-allowed hover:bg-theme-hover text-theme-heading transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-theme-border bg-theme-card disabled:opacity-40 disabled:cursor-not-allowed hover:bg-theme-hover text-theme-heading transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Clean Data Modal */}
      {isCleanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg p-6 rounded-2xl border border-theme-border bg-theme-card text-theme-foreground shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-theme-border mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-theme-accent text-theme-primary border border-theme-border flex items-center justify-center">
                  <Eraser className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-theme-heading">Clean & Preprocess Dataset</h3>
                  <p className="text-xs text-theme-muted">Automated hygiene for {activeDataset.name}</p>
                </div>
              </div>
              <button
                onClick={() => setIsCleanModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-theme-hover text-theme-muted hover:text-theme-heading"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Hygiene Diagnostics Summary */}
            <div className="p-3.5 rounded-xl mb-4 bg-theme-secondary border border-theme-border grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-theme-muted">Duplicates Detected:</span>
                <p className={`font-mono font-bold text-sm ${activeDataset.summary.duplicateRows > 0 ? 'text-amber-500' : 'text-[#20B981]'}`}>
                  {activeDataset.summary.duplicateRows} rows
                </p>
              </div>
              <div>
                <span className="text-theme-muted">Missing / Null Cells:</span>
                <p className={`font-mono font-bold text-sm ${activeDataset.summary.missingCells > 0 ? 'text-amber-500' : 'text-[#20B981]'}`}>
                  {activeDataset.summary.missingCells} cells
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              {/* Option: Drop Duplicates */}
              <label className="flex items-start gap-3 p-3 rounded-xl border border-theme-border bg-theme-secondary cursor-pointer hover:bg-theme-hover">
                <input
                  type="checkbox"
                  checked={cleanDropDuplicates}
                  onChange={(e) => setCleanDropDuplicates(e.target.checked)}
                  className="mt-0.5 rounded text-theme-primary focus:ring-theme-primary"
                />
                <div>
                  <span className="font-bold text-theme-heading block">Remove duplicate rows</span>
                  <span className="text-theme-muted text-[11px]">
                    Identifies and deletes identical records across all columns ({activeDataset.summary.duplicateRows} detected).
                  </span>
                </div>
              </label>

              {/* Option: Impute Missing Numerics */}
              <div className="p-3 rounded-xl border border-theme-border bg-theme-secondary space-y-1.5">
                <label className="font-bold text-theme-heading block">
                  Handle Missing Numeric Values
                </label>
                <select
                  value={cleanFillNumeric}
                  onChange={(e) => setCleanFillNumeric(e.target.value as any)}
                  className="w-full p-2 rounded-lg border border-theme-border bg-theme-card text-theme-heading text-xs focus:outline-none focus:ring-2 focus:ring-theme-primary"
                >
                  <option value="none">Keep missing (do not impute)</option>
                  <option value="median">Impute with Column Median (Recommended for skewed data)</option>
                  <option value="mean">Impute with Column Mean (Average)</option>
                  <option value="zero">Fill with 0 (Zero)</option>
                </select>
              </div>

              {/* Option: Impute Missing Categoricals */}
              <div className="p-3 rounded-xl border border-theme-border bg-theme-secondary space-y-1.5">
                <label className="font-bold text-theme-heading block">
                  Handle Missing Text / Categories
                </label>
                <select
                  value={cleanFillCategorical}
                  onChange={(e) => setCleanFillCategorical(e.target.value as any)}
                  className="w-full p-2 rounded-lg border border-theme-border bg-theme-card text-theme-heading text-xs focus:outline-none focus:ring-2 focus:ring-theme-primary"
                >
                  <option value="none">Keep missing (do not impute)</option>
                  <option value="unknown">Fill with &apos;Unknown&apos;</option>
                  <option value="mode">Impute with Mode (Most Frequent Value)</option>
                </select>
              </div>

              {/* Option: Trim Strings */}
              <label className="flex items-start gap-3 p-3 rounded-xl border border-theme-border bg-theme-secondary cursor-pointer hover:bg-theme-hover">
                <input
                  type="checkbox"
                  checked={cleanTrimStrings}
                  onChange={(e) => setCleanTrimStrings(e.target.checked)}
                  className="mt-0.5 rounded text-theme-primary focus:ring-theme-primary"
                />
                <div>
                  <span className="font-bold text-theme-heading block">Trim text whitespace</span>
                  <span className="text-theme-muted text-[11px]">
                    Removes invisible leading and trailing whitespace from string categories.
                  </span>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-5 mt-5 border-t border-theme-border">
              <button
                type="button"
                onClick={() => setIsCleanModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-theme-border bg-theme-card hover:bg-theme-hover text-theme-heading"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyClean}
                disabled={isCleaningInProgress}
                className="btn-primary-gradient flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl shadow-xs disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                {isCleaningInProgress ? 'Cleaning Data...' : 'Apply Hygiene Pipeline'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
      </>
  );
};
