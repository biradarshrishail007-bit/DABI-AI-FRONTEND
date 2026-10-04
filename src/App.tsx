import React, { useState, useEffect } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { DataUploadView } from './components/DataUploadView';
import { ChatView } from './components/ChatView';
import { DashboardView } from './components/DashboardView';
import { DashboardBuilderView } from './components/DashboardBuilderView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { Dataset, DashboardConfig, RecentProject } from './types';
import { SAMPLE_DATASETS, SAMPLE_PROJECTS } from './data/sampleDatasets';
import { AnalyticsEngine } from './services/analyticsEngine';
import { getDatasets, activateDataset, deleteDataset } from './services/api';

interface BackendDataset {
  id: string;
  filename: string;
  stored_filename: string;
  rows: number;
  columns: number;
  column_names: string[];
  active: boolean;
}

const convertBackendDataset = (ds: BackendDataset): Dataset => {
  return {
    id: ds.id,
    name: ds.filename,
    size: 0,
    rowCount: ds.rows,
    colCount: ds.columns,
    uploadedAt: new Date().toLocaleString(),

    columns: ds.column_names.map((name) => ({
      key: name,
      name: name,
      type: 'string',
      missingCount: 0,
      uniqueCount: 0,
    })),

    data: [],

    summary: {
      rowCount: ds.rows,
      colCount: ds.columns,
      numericCols: [],
      categoricalCols: ds.column_names,
      dateCols: [],
      missingCells: 0,
      duplicateRows: 0,
      completeness: 100,
    },
  };
};
export default function App() {
  const convertBackendDataset = (ds: BackendDataset): Dataset => {
  return {
    id: ds.id,
    name: ds.filename,
    size: 0,
    rowCount: ds.rows,
    colCount: ds.columns,
    uploadedAt: new Date().toLocaleString(),
    columns: [],
    data: [],
    summary: {
      rowCount: ds.rows,
      colCount: ds.columns,
      numericCols: [],
      categoricalCols: [],
      dateCols: [],
      missingCells: 0,
      duplicateRows: 0,
      completeness: 100,
    },
  };
};
useEffect(() => {
  const loadBackendDatasets = async () => {
    try {
      const backendDatasets = await getDatasets();

      if (backendDatasets.length === 0) {
        return;
      }

      const convertedDatasets =
        backendDatasets.map(convertBackendDataset);

      setDatasets(convertedDatasets);

      const active = backendDatasets.find(
        (ds) => ds.active
      );

      if (active) {
        const activeConverted =
          convertBackendDataset(active);

        setActiveDataset(activeConverted);

        setDashboard(
          AnalyticsEngine.generateDefaultDashboard(
            activeConverted
          )
        );
      }
    } catch (error) {
      console.error(
        'Failed to load backend datasets:',
        error
      );
    }
  };

  loadBackendDatasets();
}, []);
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [datasets, setDatasets] = useState<Dataset[]>(SAMPLE_DATASETS);
  const [activeDataset, setActiveDataset] = useState<Dataset>(SAMPLE_DATASETS[0]);
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>(SAMPLE_PROJECTS);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Default dashboard configuration built from active dataset
  const [dashboard, setDashboard] = useState<DashboardConfig>(() =>
    AnalyticsEngine.generateDefaultDashboard(SAMPLE_DATASETS[0])
  );

  // Dark/Light Theme state - Default to false for the Clean White + Sky Blue theme
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dabi-theme');
      if (saved) return saved === 'dark';
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('dabi-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('dabi-theme', 'light');
    }
  }, [isDark]);

  const handleToggleTheme = () => {
    setIsDark((prev) => !prev);
  };

 const handleSelectDataset = async (ds: Dataset) => {
  try {
    await activateDataset(ds.id);

    setActiveDataset(ds);

    const newDash = AnalyticsEngine.generateDefaultDashboard(ds);
    setDashboard(newDash);
  } catch (error: any) {
    console.error('Failed to activate dataset:', error);
    alert(error.message || 'Failed to activate dataset');
  }
};

const handleDeleteDataset = async (datasetId: string) => {
  const dataset = datasets.find((ds) => ds.id === datasetId);

  if (!dataset) return;

  if (dataset.id === activeDataset.id) {
    alert('You cannot delete the active dataset. Please activate another dataset first.');
    return;
  }

  const confirmed = window.confirm(
    `Delete "${dataset.name}" permanently?`
  );

  if (!confirmed) return;

  try {
    await deleteDataset(datasetId);

    setDatasets((prev) =>
      prev.filter((ds) => ds.id !== datasetId)
    );
  } catch (error: any) {
    console.error('Failed to delete dataset:', error);
    alert(error.message || 'Failed to delete dataset');
  }
};

 const handleDatasetUploaded = async (newDs: Dataset) => {
  try {
    // Reload datasets from the backend
    const backendDatasets = await getDatasets();

    const convertedDatasets =
      backendDatasets.map(convertBackendDataset);

    setDatasets(convertedDatasets);

    // The backend automatically makes the new upload active
    const active = backendDatasets.find(
      (ds) => ds.active
    );

    if (active) {
      const activeConverted =
        convertBackendDataset(active);

      setActiveDataset(activeConverted);

      setDashboard(
        AnalyticsEngine.generateDefaultDashboard(
          activeConverted
        )
      );
    } else {
      // Fallback to the uploaded dataset
      setActiveDataset(newDs);

      setDashboard(
        AnalyticsEngine.generateDefaultDashboard(newDs)
      );
    }

    // Add to recent projects
    const newProj: RecentProject = {
      id: 'proj-' + Date.now(),
      title: `${newDs.name.replace(/\.[^/.]+$/, '')} Analysis`,
      datasetName: newDs.name,
      rows: newDs.rowCount,
      columns: newDs.colCount,
      lastActive: 'Just now',
      category: 'Uploaded Dataset',
      status: 'Ready',
      kpiHighlight: `${newDs.colCount} continuous dimensions profiled`
    };

    setRecentProjects((prev) => [
      newProj,
      ...prev
    ]);

  } catch (error) {
    console.error(
      'Failed to refresh datasets after upload:',
      error
    );

    // Still use the uploaded dataset if backend refresh fails
    setActiveDataset(newDs);

    setDashboard(
      AnalyticsEngine.generateDefaultDashboard(newDs)
    );
  }
};

  const handleDashboardGenerated = (generated: DashboardConfig) => {
    setDashboard(generated);
    setCurrentTab('dashboards');
  };

  const handleOpenProject = (projectId: string) => {
    const proj = recentProjects.find((p) => p.id === projectId);
    if (proj) {
      const matchingDataset = datasets.find((d) => d.name === proj.datasetName);
      if (matchingDataset) {
        setActiveDataset(matchingDataset);
        setDashboard(AnalyticsEngine.generateDefaultDashboard(matchingDataset, proj.title));
      }
    }
    setCurrentTab('dashboards');

  };
  return (
    <div className="min-h-screen flex bg-theme-secondary text-theme-foreground font-sans antialiased selection:bg-[#38BDF8] selection:text-white transition-colors duration-200">
      {/* Left Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        activeDataset={activeDataset}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
      />

      {/* Main App Canvas */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <Header
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          datasets={datasets}
          activeDataset={activeDataset}
          onSelectDataset={handleSelectDataset}
          isDark={isDark}
        />

        <main className="flex-1 overflow-y-auto">
          {currentTab === 'home' && (
            <HomeView
              onSelectTab={setCurrentTab}
              activeDataset={activeDataset}
              recentProjects={recentProjects}
              onOpenProject={handleOpenProject}
              onQuickAnalyze={() => setCurrentTab('dashboards')}
              isDark={isDark}
            />
          )}

          {currentTab === 'data' && (
            <DataUploadView
  activeDataset={activeDataset}
  datasets={datasets}
  onSelectDataset={handleSelectDataset}
  onDeleteDataset={handleDeleteDataset}
  onDatasetUploaded={handleDatasetUploaded}
  onDatasetUpdated={handleDatasetUploaded}
  onAnalyzeData={() => setCurrentTab('dashboards')}
  onAskDabi={() => setCurrentTab('chat')}
  onBuildDashboard={() => setCurrentTab('builder')}
  isDark={isDark}
/> )}

          {currentTab === 'chat' && (
            <ChatView
              activeDataset={activeDataset}
              isDark={isDark}
            />
          )}

          {currentTab === 'dashboards' && (
            <DashboardView
              dashboard={dashboard}
              activeDataset={activeDataset}
              onUpdateDashboard={setDashboard}
              isDark={isDark}
            />
          )}

          {currentTab === 'builder' && (
            <DashboardBuilderView
              activeDataset={activeDataset}
              onDashboardGenerated={handleDashboardGenerated}
              isDark={isDark}
            />
          )}

          {currentTab === 'reports' && (
            <ReportsView
              activeDataset={activeDataset}
              dashboard={dashboard}
              isDark={isDark}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              isDark={isDark}
              onToggleTheme={handleToggleTheme}
            />
          )}
        </main>
      </div>
    </div>
  );
  }
