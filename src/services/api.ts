const API_BASE_URL = 'http://127.0.0.1:60649';

export interface BackendDataset {
  id: string;
  filename: string;
  stored_filename: string;
  rows: number;
  columns: number;
  column_names: string[];
  active: boolean;
}


// --------------------------------------------------
// UPLOAD DATASET
// --------------------------------------------------

export async function uploadDataset(
  file: File
): Promise<BackendDataset> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(
    `${API_BASE_URL}/datasets/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));

    throw new Error(
      error.detail || 'Failed to upload dataset'
    );
  }

  const result = await response.json();

  // Supports your current backend response
  // { id, filename, stored_filename, rows, columns, active }

  // Also supports the newer backend format
  // { dataset: { dataset_id, original_name, stored_name, ... } }

  if (result.dataset) {
    const dataset = result.dataset;

    return {
      id: dataset.dataset_id,
      filename: dataset.original_name,
      stored_filename: dataset.stored_name,
      rows: dataset.rows,
      columns: dataset.columns,
      column_names: dataset.column_names || [],
      active: result.active === true,
    };
  }

  return {
    id: result.id,
    filename: result.filename,
    stored_filename: result.stored_filename,
    rows: result.rows,
    columns: result.columns,
    column_names: result.column_names || [],
    active: result.active === true,
  };
}


// --------------------------------------------------
// GET ALL DATASETS
// --------------------------------------------------

export async function getDatasets(): Promise<BackendDataset[]> {
  const response = await fetch(
    `${API_BASE_URL}/datasets`
  );

  if (!response.ok) {
    throw new Error('Failed to load datasets');
  }

  const result = await response.json();

  // New backend format:
  // {
  //   active_dataset_id: "...",
  //   datasets: [...]
  // }

  if (Array.isArray(result.datasets)) {
    const activeId = result.active_dataset_id;

    return result.datasets.map((dataset: any) => ({
      id: dataset.dataset_id,
      filename: dataset.original_name,
      stored_filename: dataset.stored_name,
      rows: dataset.rows,
      columns: dataset.columns,
      column_names: dataset.column_names || [],
      active: dataset.dataset_id === activeId,
    }));
  }

  // Fallback if backend returns an array directly
  if (Array.isArray(result)) {
    return result;
  }

  return [];
}


// --------------------------------------------------
// GET ACTIVE DATASET
// --------------------------------------------------

export async function getActiveDataset(): Promise<BackendDataset | null> {
  const response = await fetch(
    `${API_BASE_URL}/datasets/active`
  );

  if (!response.ok) {
    throw new Error('Failed to load active dataset');
  }

  const result = await response.json();

  if (!result.dataset) {
    return null;
  }

  const dataset = result.dataset;

  return {
    id: dataset.dataset_id,
    filename: dataset.original_name,
    stored_filename: dataset.stored_name,
    rows: dataset.rows,
    columns: dataset.columns,
    column_names: dataset.column_names || [],
    active: true,
  };
}


// --------------------------------------------------
// ACTIVATE DATASET
// --------------------------------------------------

export async function activateDataset(
  datasetId: string
) {
  const response = await fetch(
    `${API_BASE_URL}/datasets/${datasetId}/activate`,
    {
      method: 'PUT',
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));

    throw new Error(
      error.detail || 'Failed to activate dataset'
    );
  }

  return response.json();
}


// --------------------------------------------------
// DELETE DATASET
// --------------------------------------------------

export async function deleteDataset(
  datasetId: string
) {
  const response = await fetch(
    `${API_BASE_URL}/datasets/${datasetId}`,
    {
      method: 'DELETE',
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));

    throw new Error(
      error.detail || 'Failed to delete dataset'
    );
  }

  return response.json();
}


// --------------------------------------------------
// GET ACTIVE DATASET DATA
// --------------------------------------------------

export async function getActiveDatasetData() {
  const response = await fetch(
    `${API_BASE_URL}/datasets/active/data`
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));

    throw new Error(
      error.detail ||
      'Failed to load active dataset data'
    );
  }

  return response.json();
}