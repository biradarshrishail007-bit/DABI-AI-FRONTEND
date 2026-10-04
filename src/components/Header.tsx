import React from 'react';
import {
  Database,
  Sparkles,
  MessageSquareCode,
  UploadCloud,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { Dataset } from '../types';
import { NavTab } from './Sidebar';

interface HeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  datasets: Dataset[];
  activeDataset: Dataset;
  onSelectDataset: (ds: Dataset) => void;
  isDark: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  datasets,
  activeDataset,
  onSelectDataset,
  isDark
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const getPageTitle = (tab: NavTab) => {
    switch (tab) {
      case 'home':
        return { title: 'Welcome to DABI AI', subtitle: 'Your AI-powered data analyst' };
      case 'data':
        return { title: 'Data Management & Ingestion', subtitle: 'Upload and inspect CSV, XLSX, and XLS datasets' };
      case 'chat':
        return { title: 'AI Data Chat', subtitle: 'Conversational data exploration with natural language' };
      case 'dashboards':
        return { title: 'Interactive Dashboard', subtitle: 'Real-time KPI metrics, dynamic charts, and multidimensional filters' };
      case 'builder':
        return { title: 'AI Dashboard Builder', subtitle: 'Prompt-driven automatic dashboard synthesis' };
      case 'reports':
        return { title: 'Reports & Exports', subtitle: 'Download PDF briefs, multi-sheet Excel files, and executive summaries' };
      case 'settings':
        return { title: 'System & Architecture Settings', subtitle: 'Python backend connection, Gemini engine, and configuration' };
    }
  };

  const pageInfo = getPageTitle(currentTab);

  return (
    <header
      id="dabi-header"
      className="sticky top-0 z-20 flex items-center justify-between px-6 py-3.5 border-b border-theme-border bg-theme-card/95 backdrop-blur-md transition-colors"
    >
      {/* Title & Breadcrumb */}
      <div>
        <h1 className="text-lg font-bold tracking-tight text-theme-heading flex items-center gap-2">
          {pageInfo.title}
        </h1>
        <p className="text-xs text-theme-muted font-medium">
          {pageInfo.subtitle}
        </p>
      </div>

      {/* Right Controls: Dataset Switcher + Quick Actions */}
      <div className="flex items-center gap-3">
        {/* Dataset Switcher Dropdown */}
        <div className="relative">
          <button
            id="dataset-dropdown-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border border-theme-border hover:border-theme-primary bg-theme-card text-theme-heading hover:bg-theme-hover shadow-xs transition-all"
          >
            <Database className="w-3.5 h-3.5 text-theme-primary" />
            <span className="max-w-[130px] truncate">{activeDataset.name}</span>
            <span className="px-1.5 py-0.5 text-[10px] rounded bg-theme-accent text-theme-primary font-mono font-semibold">
              {activeDataset.rowCount.toLocaleString()}r
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-theme-muted" />
          </button>

          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-64 rounded-xl shadow-xl border border-theme-border bg-theme-card text-theme-heading p-1 z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="px-3 py-2 text-[11px] font-semibold text-theme-muted uppercase tracking-wider border-b border-theme-border">
                Select Active Dataset
              </div>
              <div className="max-h-48 overflow-y-auto py-1 space-y-0.5">
                {datasets.map((ds) => (
                  <button
                    key={ds.id}
                    onClick={() => {
                      onSelectDataset(ds);
                      setDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                      activeDataset.id === ds.id
                        ? 'bg-theme-active-nav text-theme-active-nav font-semibold'
                        : 'text-theme-foreground hover:bg-theme-hover hover:text-theme-heading'
                    }`}
                  >
                    <div className="truncate text-left pr-2">
                      <p className="truncate font-medium">{ds.name}</p>
                      <p className={`text-[10px] ${activeDataset.id === ds.id ? 'text-theme-active-nav' : 'text-theme-muted'}`}>
                        {ds.rowCount.toLocaleString()} rows • {ds.colCount} cols
                      </p>
                    </div>
                    {activeDataset.id === ds.id && <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-theme-active-nav" />}
                  </button>
                ))}
              </div>
              <div className="p-1 border-t border-theme-border">
                <button
                  onClick={() => {
                    onSelectTab('data');
                    setDropdownOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-theme-primary hover:bg-theme-accent rounded-lg transition-colors"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  Upload New Dataset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Action Buttons */}
        {currentTab !== 'chat' && (
          <button
            id="header-ask-dabi-btn"
            onClick={() => onSelectTab('chat')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-theme-heading bg-theme-card hover:bg-theme-hover border border-theme-border hover:border-theme-primary transition-colors"
          >
            <MessageSquareCode className="w-3.5 h-3.5 text-theme-primary" />
            <span className="hidden sm:inline">Ask DABI</span>
          </button>
        )}

        {currentTab !== 'builder' && (
          <button
            id="header-build-dash-btn"
            onClick={() => onSelectTab('builder')}
            className="btn-primary-gradient flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Build Dashboard</span>
          </button>
        )}
      </div>
    </header>
  );
};
