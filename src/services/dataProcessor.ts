import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Dataset, ColumnMeta, DataType, DatasetSummary } from '../types';

export function inferType(values: any[]): DataType {
  const nonNulls = values.filter(v => v !== null && v !== undefined && v !== '');
  if (nonNulls.length === 0) return 'string';

  let numCount = 0;
  let dateCount = 0;
  let boolCount = 0;

  for (const val of nonNulls.slice(0, 50)) {
    if (typeof val === 'boolean' || val === 'true' || val === 'false') {
      boolCount++;
    } else if (!isNaN(Number(val)) && typeof val !== 'boolean') {
      numCount++;
    } else if (typeof val === 'string' && !isNaN(Date.parse(val)) && val.includes('-') || val.includes('/')) {
      dateCount++;
    }
  }

  const sampleSize = Math.min(nonNulls.length, 50);
  if (numCount / sampleSize > 0.7) return 'number';
  if (dateCount / sampleSize > 0.7) return 'date';
  if (boolCount / sampleSize > 0.7) return 'boolean';
  return 'string';
}

export function analyzeDataset(name: string, size: number, rows: Record<string, any>[]): Dataset {
  if (!rows || rows.length === 0) {
    throw new Error('Dataset contains no data rows.');
  }

  const keys = Object.keys(rows[0]);
  const columns: ColumnMeta[] = [];
  let totalMissingCells = 0;

  // Duplicate rows detection
  const rowSignatures = new Set<string>();
  let duplicateCount = 0;
  for (const r of rows) {
    const sig = JSON.stringify(r);
    if (rowSignatures.has(sig)) {
      duplicateCount++;
    } else {
      rowSignatures.add(sig);
    }
  }

  const numericCols: string[] = [];
  const categoricalCols: string[] = [];
  const dateCols: string[] = [];

  for (const key of keys) {
    const values = rows.map(r => r[key]);
    const type = inferType(values);
    let missingCount = 0;
    const uniqueSet = new Set<any>();

    const validNums: number[] = [];
    let sum = 0;
    let min: number | undefined = undefined;
    let max: number | undefined = undefined;

    for (const val of values) {
      if (val === null || val === undefined || val === '') {
        missingCount++;
        totalMissingCells++;
      } else {
        uniqueSet.add(val);
        if (type === 'number') {
          const num = Number(val);
          if (!isNaN(num)) {
            validNums.push(num);
            sum += num;
            if (min === undefined || num < min) min = num;
            if (max === undefined || num > max) max = num;
          }
        }
      }
    }

    let avg: number | undefined = undefined;
    let median: number | undefined = undefined;
    let stdDev: number | undefined = undefined;

    if (validNums.length > 0) {
      avg = Math.round((sum / validNums.length) * 100) / 100;
      // Calculate median
      const sorted = [...validNums].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      median = sorted.length % 2 !== 0 ? sorted[mid] : Math.round(((sorted[mid - 1] + sorted[mid]) / 2) * 100) / 100;
      // Calculate standard deviation
      const variance = sorted.reduce((acc, v) => acc + Math.pow(v - avg!, 2), 0) / sorted.length;
      stdDev = Math.round(Math.sqrt(variance) * 100) / 100;
    }

    if (type === 'number') {
      numericCols.push(key);
    } else if (type === 'date') {
      dateCols.push(key);
    } else {
      categoricalCols.push(key);
    }

    columns.push({
      key,
      name: key.replace(/_/g, ' '),
      type,
      missingCount,
      uniqueCount: uniqueSet.size,
      sampleValues: Array.from(uniqueSet).slice(0, 4),
      min,
      max,
      sum: validNums.length > 0 ? sum : undefined,
      avg,
      median,
      stdDev
    });
  }

  const totalCells = rows.length * keys.length;
  const completeness = totalCells > 0 ? Math.round(((totalCells - totalMissingCells) / totalCells) * 1000) / 10 : 100;

  const summary: DatasetSummary = {
    rowCount: rows.length,
    colCount: keys.length,
    numericCols,
    categoricalCols,
    dateCols,
    missingCells: totalMissingCells,
    duplicateRows: duplicateCount,
    completeness
  };

  return {
    id: 'ds_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
    name,
    size,
    rowCount: rows.length,
    colCount: keys.length,
    uploadedAt: new Date().toLocaleString(),
    columns,
    data: rows,
    summary
  };
}

export function cleanDataset(
  dataset: Dataset,
  options: {
    dropDuplicates: boolean;
    fillMissingNumeric: 'none' | 'mean' | 'median' | 'zero';
    fillMissingCategorical: 'none' | 'mode' | 'unknown';
    trimStrings: boolean;
  }
): { cleanedDataset: Dataset; logs: string[]; rowsRemoved: number; cellsImputed: number } {
  let rows = [...dataset.data];
  const logs: string[] = [];
  let rowsRemoved = 0;
  let cellsImputed = 0;

  // 1. Drop duplicates
  if (options.dropDuplicates) {
    const seen = new Set<string>();
    const originalLength = rows.length;
    rows = rows.filter((r) => {
      const sig = JSON.stringify(r);
      if (seen.has(sig)) return false;
      seen.add(sig);
      return true;
    });
    rowsRemoved = originalLength - rows.length;
    if (rowsRemoved > 0) {
      logs.push(`Removed ${rowsRemoved.toLocaleString()} duplicate rows`);
    } else {
      logs.push('No duplicate rows detected');
    }
  }

  // 2. Pre-calculate imputation targets
  const numericImputations: Record<string, number> = {};
  if (options.fillMissingNumeric !== 'none') {
    for (const col of dataset.columns) {
      if (col.type === 'number') {
        if (options.fillMissingNumeric === 'zero') {
          numericImputations[col.key] = 0;
        } else if (options.fillMissingNumeric === 'median' && col.median !== undefined) {
          numericImputations[col.key] = col.median;
        } else if (col.avg !== undefined) {
          numericImputations[col.key] = col.avg;
        }
      }
    }
  }

  const categoricalImputations: Record<string, string> = {};
  if (options.fillMissingCategorical !== 'none') {
    for (const col of dataset.columns) {
      if (col.type !== 'number' && col.type !== 'date') {
        if (options.fillMissingCategorical === 'unknown') {
          categoricalImputations[col.key] = 'Unknown';
        } else if (options.fillMissingCategorical === 'mode') {
          // Calculate mode
          const freqMap: Record<string, number> = {};
          let maxCount = 0;
          let modeVal = 'Unknown';
          for (const r of rows) {
            const val = r[col.key];
            if (val !== null && val !== undefined && val !== '') {
              const str = String(val);
              freqMap[str] = (freqMap[str] || 0) + 1;
              if (freqMap[str] > maxCount) {
                maxCount = freqMap[str];
                modeVal = str;
              }
            }
          }
          categoricalImputations[col.key] = modeVal;
        }
      }
    }
  }

  // 3. Process rows for imputation & string trimming
  rows = rows.map((r) => {
    const updated = { ...r };
    for (const key of Object.keys(updated)) {
      let val = updated[key];

      // String trimming
      if (options.trimStrings && typeof val === 'string') {
        val = val.trim();
        updated[key] = val;
      }

      // Numeric imputation
      if ((val === null || val === undefined || val === '') && numericImputations[key] !== undefined) {
        updated[key] = numericImputations[key];
        cellsImputed++;
      }

      // Categorical imputation
      if ((val === null || val === undefined || val === '') && categoricalImputations[key] !== undefined) {
        updated[key] = categoricalImputations[key];
        cellsImputed++;
      }
    }
    return updated;
  });

  if (cellsImputed > 0) {
    logs.push(`Imputed ${cellsImputed.toLocaleString()} missing values (${options.fillMissingNumeric} for numeric, ${options.fillMissingCategorical} for text)`);
  }
  if (options.trimStrings) {
    logs.push('Trimmed trailing & leading whitespace across text fields');
  }

  const cleaned = analyzeDataset(
    dataset.name.includes('[Cleaned]') ? dataset.name : `${dataset.name} [Cleaned]`,
    dataset.size,
    rows
  );

  return {
    cleanedDataset: cleaned,
    logs,
    rowsRemoved,
    cellsImputed
  };
}

export async function parseFile(file: File): Promise<Dataset> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'csv') {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const data = results.data as Record<string, any>[];
            if (!data || data.length === 0) {
              reject(new Error('The uploaded CSV file is empty.'));
              return;
            }
            const dataset = analyzeDataset(file.name, file.size, data);
            resolve(dataset);
          } catch (err) {
            reject(err);
          }
        },
        error: (err) => reject(new Error('Failed to parse CSV: ' + err.message))
      });
    });
  } else if (extension === 'xlsx' || extension === 'xls') {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      throw new Error('No worksheets found in this Excel workbook.');
    }
    const worksheet = workbook.Sheets[firstSheetName];
    const data = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { defval: null });
    if (!data || data.length === 0) {
      throw new Error('No data found in the first sheet of this Excel file.');
    }
    return analyzeDataset(file.name, file.size, data);
  } else {
    throw new Error('Unsupported file format. Please upload .csv, .xlsx, or .xls files.');
  }
}
