import { Dataset, ChatMessage } from '../types';
import { SAMPLE_DATASETS } from '../data/sampleDatasets';

/**
 * Centralized Dataset Store for DABI AI.
 * 
 * Provides an enterprise-grade repository for managing uploaded datasets,
 * active dataset switching, dataset-specific chat histories, and deletion protection.
 * 
 * Architecture Note:
 * This interface is architected to seamlessly map to a remote Python FastAPI/Django
 * analytical backend (e.g. GET /api/datasets, POST /api/datasets/upload, DELETE /api/datasets/:id)
 * while providing robust client-side caching and offline local state persistence.
 */

type Listener = () => void;

class DatasetStoreService {
  private datasets: Dataset[] = [];
  private activeDatasetId: string = '';
  private chatHistories: Map<string, ChatMessage[]> = new Map();
  private listeners: Set<Listener> = new Set();
  private isInitialized: boolean = false;

  constructor() {
    this.init();
  }

  private init() {
    if (this.isInitialized) return;

    try {
      // 1. Load datasets from localStorage if available
      const storedDatasetsJson = typeof window !== 'undefined' ? localStorage.getItem('dabi_datasets') : null;
      if (storedDatasetsJson) {
        try {
          const parsed = JSON.parse(storedDatasetsJson) as Dataset[];
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.datasets = parsed;
          } else {
            this.datasets = [...SAMPLE_DATASETS];
          }
        } catch {
          this.datasets = [...SAMPLE_DATASETS];
        }
      } else {
        this.datasets = [...SAMPLE_DATASETS];
      }

      // 2. Load active dataset ID
      const storedActiveId = typeof window !== 'undefined' ? localStorage.getItem('dabi_active_dataset_id') : null;
      if (storedActiveId && this.datasets.some((d) => d.id === storedActiveId)) {
        this.activeDatasetId = storedActiveId;
      } else {
        this.activeDatasetId = this.datasets[0]?.id || 'ds_sales_2026';
      }

      // 3. Pre-load chat histories for known datasets from localStorage
      if (typeof window !== 'undefined') {
        for (const ds of this.datasets) {
          const histKey = `dabi_chat_history_${ds.id}`;
          const histJson = localStorage.getItem(histKey);
          if (histJson) {
            try {
              const msgs = JSON.parse(histJson);
              if (Array.isArray(msgs) && msgs.length > 0) {
                this.chatHistories.set(ds.id, msgs);
              }
            } catch {
              // Ignore malformed history
            }
          }
        }
      }

      this.isInitialized = true;
    } catch (e) {
      console.warn('Failed to initialize dataset store from storage, using defaults', e);
      this.datasets = [...SAMPLE_DATASETS];
      this.activeDatasetId = this.datasets[0]?.id || 'ds_sales_2026';
      this.isInitialized = true;
    }
  }

  private persistDatasets() {
    if (typeof window === 'undefined') return;
    try {
      // Persist datasets list (strip heavy rows if exceeding quota, keep sample rows + metadata)
      localStorage.setItem('dabi_datasets', JSON.stringify(this.datasets));
    } catch (e) {
      console.warn('Storage quota limit reached when persisting datasets; operating in memory', e);
    }
  }

  private persistActiveId() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('dabi_active_dataset_id', this.activeDatasetId);
    } catch {
      // Ignore
    }
  }

  private persistChatHistory(datasetId: string, messages: ChatMessage[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(`dabi_chat_history_${datasetId}`, JSON.stringify(messages));
    } catch {
      // Ignore quota limit
    }
  }

  private notify() {
    for (const listener of this.listeners) {
      listener();
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public getDatasets(): Dataset[] {
    return [...this.datasets];
  }

  public getActiveDataset(): Dataset {
    const found = this.datasets.find((d) => d.id === this.activeDatasetId);
    if (found) return found;
    // Fallback to first available or default
    if (this.datasets.length > 0) {
      this.activeDatasetId = this.datasets[0].id;
      return this.datasets[0];
    }
    return SAMPLE_DATASETS[0];
  }

  public getDatasetById(id: string): Dataset | undefined {
    return this.datasets.find((d) => d.id === id);
  }

  /**
   * Switch active dataset safely.
   */
  public setActiveDataset(id: string): Dataset {
    const target = this.datasets.find((d) => d.id === id);
    if (!target) {
      throw new Error(`Dataset with ID "${id}" was not found.`);
    }
    this.activeDatasetId = target.id;
    this.persistActiveId();
    this.notify();
    return target;
  }

  /**
   * Add a newly parsed dataset and optionally make it active.
   */
  public addDataset(dataset: Dataset, makeActive: boolean = true): Dataset {
    // Check if ID already exists, generate a safe unique one if so
    let safeId = dataset.id;
    if (this.datasets.some((d) => d.id === safeId)) {
      safeId = `ds_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    }
    const safeDataset: Dataset = {
      ...dataset,
      id: safeId
    };

    // Prepend new dataset so it appears first in lists
    this.datasets = [safeDataset, ...this.datasets];
    this.persistDatasets();

    if (makeActive) {
      this.activeDatasetId = safeDataset.id;
      this.persistActiveId();
    }

    this.notify();
    return safeDataset;
  }

  /**
   * Delete a dataset with active dataset safety protection.
   */
  public deleteDataset(id: string): {
    success: boolean;
    error?: string;
    isActive?: boolean;
    nextActiveDataset?: Dataset;
  } {
    const targetIndex = this.datasets.findIndex((d) => d.id === id);
    if (targetIndex === -1) {
      return { success: false, error: 'Dataset not found.' };
    }

    // Protection rule: Cannot delete if it's the only available dataset
    if (this.datasets.length <= 1) {
      return {
        success: false,
        error: 'You cannot delete the only available dataset.'
      };
    }

    const isCurrentActive = this.activeDatasetId === id;
    let nextActive: Dataset | undefined = undefined;

    if (isCurrentActive) {
      // Find the next available dataset to switch to
      const remaining = this.datasets.filter((d) => d.id !== id);
      nextActive = remaining[0];
      this.activeDatasetId = nextActive.id;
      this.persistActiveId();
    }

    // Remove dataset
    this.datasets = this.datasets.filter((d) => d.id !== id);
    this.persistDatasets();

    // Remove associated chat history
    this.chatHistories.delete(id);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`dabi_chat_history_${id}`);
    }

    this.notify();
    return {
      success: true,
      isActive: isCurrentActive,
      nextActiveDataset: nextActive
    };
  }

  /**
   * Get dataset-specific chat history.
   * If none exists yet, creates a tailored welcome message.
   */
  public getChatHistory(datasetId: string): ChatMessage[] {
    const existing = this.chatHistories.get(datasetId);
    if (existing && existing.length > 0) {
      return existing;
    }

    const ds = this.getDatasetById(datasetId) || this.getActiveDataset();
    const defaultWelcome: ChatMessage = {
      id: `welcome-${ds.id}`,
      role: 'assistant',
      timestamp: 'Just now',
      content: `Hello! I am **DABI AI**, your autonomous data analyst.\n\nI have loaded **${ds.name}** with **${ds.rowCount.toLocaleString()} rows** and **${ds.colCount} attributes**. What business insights, KPI trends, or predictive patterns would you like to explore today?`,
      suggestions: [
        'What is the total revenue?',
        'Which product has the highest sales?',
        'Show monthly revenue.',
        'Which region performed best?',
        'Find missing values.',
        'Give me the most important insights.'
      ]
    };

    const initial = [defaultWelcome];
    this.chatHistories.set(datasetId, initial);
    this.persistChatHistory(datasetId, initial);
    return initial;
  }

  /**
   * Save dataset-specific chat messages.
   */
  public saveChatHistory(datasetId: string, messages: ChatMessage[]) {
    this.chatHistories.set(datasetId, messages);
    this.persistChatHistory(datasetId, messages);
  }

  /**
   * Clear chat history specifically for one dataset.
   */
  public clearChatHistory(datasetId: string): ChatMessage[] {
    const ds = this.getDatasetById(datasetId) || this.getActiveDataset();
    const resetMessage: ChatMessage = {
      id: `reset-${ds.id}-${Date.now()}`,
      role: 'assistant',
      timestamp: 'Just now',
      content: `Chat history cleared for **${ds.name}**. I am ready for new queries on this dataset.`,
      suggestions: [
        'What is the total revenue?',
        'Which product has the highest sales?',
        'Show monthly revenue.',
        'Find unusual values.'
      ]
    };
    const cleared = [resetMessage];
    this.chatHistories.set(datasetId, cleared);
    this.persistChatHistory(datasetId, cleared);
    return cleared;
  }
}

export const DatasetStore = new DatasetStoreService();
