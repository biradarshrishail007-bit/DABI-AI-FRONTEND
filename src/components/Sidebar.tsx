import React from 'react';
import {
  LayoutDashboard,
  Database,
  MessageSquareCode,
  SlidersHorizontal,
  FileBarChart,
  Settings,
  Sparkles,
  Sun,
  Moon,
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';
import { Dataset } from '../types';

export type NavTab = 'home' | 'data' | 'chat' | 'dashboards' | 'builder' | 'reports' | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  activeDataset?: Dataset;
  isDark: boolean;
  onToggleTheme: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  activeDataset,
  isDark,
  onToggleTheme,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const rowCount = activeDataset?.rowCount ?? 0;
  const datasetName = activeDataset?.name ?? 'No Dataset Selected';

  const navItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
    { id: 'home', label: 'Home', icon: LayoutDashboard },
    { id: 'data', label: 'Data', icon: Database, badge: `${rowCount > 0 ? (rowCount > 999 ? (rowCount / 1000).toFixed(0) + 'k' : rowCount) : ''}` },
    { id: 'chat', label: 'AI Chat', icon: MessageSquareCode, badge: 'AI' },
    { id: 'dashboards', label: 'Dashboards', icon: TrendingUp },
    { id: 'builder', label: 'Dashboard Builder', icon: Sparkles, badge: 'Auto' },
    { id: 'reports', label: 'Reports', icon: FileBarChart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      id="dabi-sidebar"
      className={`relative flex flex-col h-screen transition-all duration-300 z-30 border-r border-theme-border bg-theme-sidebar text-theme-foreground ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between p-4 border-b border-theme-border">
        <div
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#38BDF8] to-[#1EA7F2] flex items-center justify-center text-white shadow-md shadow-[#1EA7F2]/25 group-hover:scale-105 transition-transform">
            <BrainCircuit className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-theme-heading">
                  DABI <span className="text-[#1EA7F2] dark:text-[#38BDF8]">AI</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-theme-accent text-theme-primary border border-theme-border">
                  v2.6
                </span>
              </div>
              <p className="text-[11px] text-theme-muted font-medium truncate">
                Your AI Data Analyst
              </p>
            </div>
          )}
        </div>

        <button
          id="collapse-toggle-btn"
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-theme-muted hover:text-theme-heading hover:bg-theme-hover transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* Active Dataset Status Pill / Card */}
      {!isCollapsed && (
        <div className="px-4 py-3 mx-3 mt-3 rounded-xl bg-theme-card border border-theme-border shadow-xs">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-theme-muted font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#20B981]" />
              Active Dataset
            </span>
            <span className="font-mono text-[11px] text-theme-muted">
              {rowCount.toLocaleString()} rows
            </span>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-theme-heading truncate pr-2" title={datasetName}>
              {datasetName}
            </p>
            <button
              onClick={() => onSelectTab('data')}
              className="text-[10px] text-theme-primary hover:underline font-semibold flex-shrink-0"
            >
              Switch
            </button>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-theme-active-nav text-theme-active-nav font-semibold shadow-xs'
                  : 'text-theme-foreground hover:text-theme-heading hover:bg-theme-hover'
              }`}
            >
              <Icon
                className={`w-5 h-5 flex-shrink-0 transition-transform ${
                  isActive ? 'text-theme-active-nav' : 'text-theme-primary group-hover:scale-105'
                }`}
              />
              {!isCollapsed && (
                <span className="flex-1 text-left truncate">{item.label}</span>
              )}
              {!isCollapsed && item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                    isActive
                      ? 'bg-theme-primary text-white'
                      : 'bg-theme-accent text-theme-primary'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Controls: Theme Switcher & User Profile */}
      <div className="p-3 border-t border-theme-border space-y-2">
        {/* Functional Theme Switcher showing ☀ Light and 🌙 Dark */}
        {!isCollapsed ? (
          <div className="p-1 rounded-xl bg-theme-accent border border-theme-border transition-colors">
            <div className="grid grid-cols-2 gap-1 text-xs">
              <button
                type="button"
                id="theme-toggle-light-btn"
                onClick={() => isDark && onToggleTheme()}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-semibold transition-all ${
                  !isDark
                    ? 'bg-theme-card text-theme-heading shadow-xs border border-theme-border'
                    : 'text-theme-muted hover:text-theme-heading'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>☀ Light</span>
              </button>
              <button
                type="button"
                id="theme-toggle-dark-btn"
                onClick={() => !isDark && onToggleTheme()}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-semibold transition-all ${
                  isDark
                    ? 'bg-theme-card text-theme-heading shadow-xs border border-theme-border'
                    : 'text-theme-muted hover:text-theme-heading'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-theme-primary" />
                <span>🌙 Dark</span>
              </button>
            </div>
          </div>
        ) : (
          <button
            id="theme-toggle-btn"
            onClick={onToggleTheme}
            className="w-full flex items-center justify-center p-2 rounded-xl text-theme-muted hover:text-theme-heading hover:bg-theme-hover transition-colors"
            title={isDark ? 'Switch to ☀ Light' : 'Switch to 🌙 Dark'}
          >
            {isDark ? (
              <Moon className="w-4 h-4 text-theme-primary" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
          </button>
        )}

        {/* User Profile Card */}
        <div
          onClick={() => onSelectTab('settings')}
          className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-theme-hover transition-colors"
        >
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#38BDF8] to-[#1EA7F2] text-white font-semibold flex items-center justify-center text-xs shadow-xs">
              SB
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#20B981] ring-2 ring-theme-card" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-theme-heading truncate">
                Shrishail Biradar
              </p>
              <p className="text-[11px] text-theme-muted truncate">
                Lead Data Analyst
              </p>
            </div>
          )}
          {!isCollapsed && <ChevronRight className="w-4 h-4 text-theme-muted flex-shrink-0" />}
        </div>
      </div>
    </aside>
  );
};
