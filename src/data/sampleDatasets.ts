import { Dataset, ColumnMeta, DatasetSummary, RecentProject } from '../types';

export const SAMPLE_SALES_DATA: Record<string, any>[] = [
  { OrderID: 'ORD-1001', Date: '2026-01-05', Customer: 'Global Logistics Corp', Product: 'DABI Enterprise Suite', Category: 'Analytics Pro', Region: 'North America', Sales: 48500, Units: 24, Profit: 14550, Discount: 0.05 },
  { OrderID: 'ORD-1002', Date: '2026-01-12', Customer: 'Apex Financial', Product: 'Cloud Data Warehouse', Category: 'Cloud Services', Region: 'Europe', Sales: 36200, Units: 18, Profit: 11200, Discount: 0.10 },
  { OrderID: 'ORD-1003', Date: '2026-01-18', Customer: 'Sakura Tech Tokyo', Product: 'AI Copilot Suite', Category: 'AI Tools', Region: 'Asia Pacific', Sales: 62400, Units: 32, Profit: 24960, Discount: 0.00 },
  { OrderID: 'ORD-1004', Date: '2026-01-25', Customer: 'Nordic Health Systems', Product: 'Predictive Analytics Engine', Category: 'Analytics Pro', Region: 'Europe', Sales: 29800, Units: 14, Profit: 8940, Discount: 0.05 },
  { OrderID: 'ORD-1005', Date: '2026-02-03', Customer: 'Aero Dynamics Inc', Product: 'DABI Enterprise Suite', Category: 'Analytics Pro', Region: 'North America', Sales: 52000, Units: 26, Profit: 18200, Discount: 0.00 },
  { OrderID: 'ORD-1006', Date: '2026-02-10', Customer: 'São Paulo FinTech', Product: 'Real-time Streaming Pipeline', Category: 'Data Pipeline', Region: 'Latin America', Sales: 21500, Units: 10, Profit: 5375, Discount: 0.15 },
  { OrderID: 'ORD-1007', Date: '2026-02-17', Customer: 'Dubai Strategic Holdings', Product: 'Cloud Data Warehouse', Category: 'Cloud Services', Region: 'Middle East', Sales: 78000, Units: 40, Profit: 27300, Discount: 0.05 },
  { OrderID: 'ORD-1008', Date: '2026-02-24', Customer: 'Omni Retail Group', Product: 'AI Copilot Suite', Category: 'AI Tools', Region: 'North America', Sales: 43200, Units: 22, Profit: 16416, Discount: 0.05 },
  { OrderID: 'ORD-1009', Date: '2026-03-04', Customer: 'Singapore FinServ', Product: 'DABI Enterprise Suite', Category: 'Analytics Pro', Region: 'Asia Pacific', Sales: 69500, Units: 35, Profit: 24325, Discount: 0.00 },
  { OrderID: 'ORD-1010', Date: '2026-03-12', Customer: 'Bavaria Automotive', Product: 'Predictive Analytics Engine', Category: 'Analytics Pro', Region: 'Europe', Sales: 58000, Units: 29, Profit: 17400, Discount: 0.10 },
  { OrderID: 'ORD-1011', Date: '2026-03-21', Customer: 'Sydney Green Energy', Product: 'Real-time Streaming Pipeline', Category: 'Data Pipeline', Region: 'Asia Pacific', Sales: 34000, Units: 17, Profit: 9520, Discount: 0.05 },
  { OrderID: 'ORD-1012', Date: '2026-03-29', Customer: 'Toronto Capital Partners', Product: 'Cloud Data Warehouse', Category: 'Cloud Services', Region: 'North America', Sales: 46800, Units: 23, Profit: 14040, Discount: 0.05 },
  { OrderID: 'ORD-1013', Date: '2026-04-06', Customer: 'Seoul Cybernetics', Product: 'AI Copilot Suite', Category: 'AI Tools', Region: 'Asia Pacific', Sales: 71200, Units: 36, Profit: 28480, Discount: 0.00 },
  { OrderID: 'ORD-1014', Date: '2026-04-15', Customer: 'London FinTech Lab', Product: 'DABI Enterprise Suite', Category: 'Analytics Pro', Region: 'Europe', Sales: 54000, Units: 27, Profit: 18900, Discount: 0.05 },
  { OrderID: 'ORD-1015', Date: '2026-04-24', Customer: 'Santiago Mining Co', Product: 'Real-time Streaming Pipeline', Category: 'Data Pipeline', Region: 'Latin America', Sales: 27500, Units: 13, Profit: 6875, Discount: 0.10 },
  { OrderID: 'ORD-1016', Date: '2026-05-02', Customer: 'Horizon Telecom', Product: 'Cloud Data Warehouse', Category: 'Cloud Services', Region: 'North America', Sales: 61000, Units: 30, Profit: 19520, Discount: 0.05 },
  { OrderID: 'ORD-1017', Date: '2026-05-11', Customer: 'Zurich Insurance Group', Product: 'Predictive Analytics Engine', Category: 'Analytics Pro', Region: 'Europe', Sales: 66400, Units: 33, Profit: 23240, Discount: 0.00 },
  { OrderID: 'ORD-1018', Date: '2026-05-20', Customer: 'Tel Aviv Security Works', Product: 'AI Copilot Suite', Category: 'AI Tools', Region: 'Middle East', Sales: 49000, Units: 25, Profit: 18620, Discount: 0.05 },
  { OrderID: 'ORD-1019', Date: '2026-05-29', Customer: 'Tokyo Robotics Labs', Product: 'DABI Enterprise Suite', Category: 'Analytics Pro', Region: 'Asia Pacific', Sales: 83000, Units: 42, Profit: 30710, Discount: 0.00 },
  { OrderID: 'ORD-1020', Date: '2026-06-07', Customer: 'California BioMed', Product: 'Cloud Data Warehouse', Category: 'Cloud Services', Region: 'North America', Sales: 55200, Units: 28, Profit: 17112, Discount: 0.05 },
  { OrderID: 'ORD-1021', Date: '2026-06-16', Customer: 'Stockholm CleanTech', Product: 'Real-time Streaming Pipeline', Category: 'Data Pipeline', Region: 'Europe', Sales: 38900, Units: 19, Profit: 10892, Discount: 0.05 },
  { OrderID: 'ORD-1022', Date: '2026-06-25', Customer: 'Bengaluru AI Nexus', Product: 'AI Copilot Suite', Category: 'AI Tools', Region: 'Asia Pacific', Sales: 74500, Units: 38, Profit: 29800, Discount: 0.00 },
  { OrderID: 'ORD-1023', Date: '2026-07-04', Customer: 'Boston Quantum Computing', Product: 'Predictive Analytics Engine', Category: 'Analytics Pro', Region: 'North America', Sales: 89000, Units: 45, Profit: 32040, Discount: 0.00 },
  { OrderID: 'ORD-1024', Date: '2026-07-13', Customer: 'Amsterdam Cargo Lines', Product: 'DABI Enterprise Suite', Category: 'Analytics Pro', Region: 'Europe', Sales: 47600, Units: 24, Profit: 15708, Discount: 0.05 },
  { OrderID: 'ORD-1025', Date: '2026-07-22', Customer: 'Bogota Digital Payments', Product: 'Real-time Streaming Pipeline', Category: 'Data Pipeline', Region: 'Latin America', Sales: 31200, Units: 15, Profit: 8424, Discount: 0.10 },
  { OrderID: 'ORD-1026', Date: '2026-08-01', Customer: 'Riyadh Sovereign Fund', Product: 'AI Copilot Suite', Category: 'AI Tools', Region: 'Middle East', Sales: 94000, Units: 48, Profit: 39480, Discount: 0.00 },
  { OrderID: 'ORD-1027', Date: '2026-08-10', Customer: 'New York Media Empire', Product: 'Cloud Data Warehouse', Category: 'Cloud Services', Region: 'North America', Sales: 63500, Units: 31, Profit: 19685, Discount: 0.05 },
  { OrderID: 'ORD-1028', Date: '2026-08-19', Customer: 'Munich Aerospace', Product: 'DABI Enterprise Suite', Category: 'Analytics Pro', Region: 'Europe', Sales: 72000, Units: 36, Profit: 25200, Discount: 0.00 },
  { OrderID: 'ORD-1029', Date: '2026-08-28', Customer: 'Taipei Semiconductor Core', Product: 'Predictive Analytics Engine', Category: 'Analytics Pro', Region: 'Asia Pacific', Sales: 91500, Units: 46, Profit: 33855, Discount: 0.00 },
  { OrderID: 'ORD-1030', Date: '2026-09-02', Customer: 'Chicago Mutual Bank', Product: 'Real-time Streaming Pipeline', Category: 'Data Pipeline', Region: 'North America', Sales: 44000, Units: 22, Profit: 12760, Discount: 0.05 },
  { OrderID: 'ORD-1031', Date: '2026-09-05', Customer: 'Singapore Logistics Hub', Product: 'Cloud Data Warehouse', Category: 'Cloud Services', Region: 'Asia Pacific', Sales: 58900, Units: 29, Profit: 18259, Discount: 0.05 },
  { OrderID: 'ORD-1032', Date: '2026-09-07', Customer: 'Frankfurt Digital Bank', Product: 'AI Copilot Suite', Category: 'AI Tools', Region: 'Europe', Sales: 81000, Units: 41, Profit: 33210, Discount: 0.00 }
];

export const SALES_COLUMNS: ColumnMeta[] = [
  { key: 'OrderID', name: 'Order ID', type: 'string', missingCount: 0, uniqueCount: 32, sampleValues: ['ORD-1001', 'ORD-1002'] },
  { key: 'Date', name: 'Date', type: 'date', missingCount: 0, uniqueCount: 32, sampleValues: ['2026-01-05', '2026-01-12'] },
  { key: 'Customer', name: 'Customer', type: 'string', missingCount: 0, uniqueCount: 30, sampleValues: ['Global Logistics Corp', 'Apex Financial'] },
  { key: 'Product', name: 'Product Name', type: 'string', missingCount: 0, uniqueCount: 5, sampleValues: ['DABI Enterprise Suite', 'AI Copilot Suite'] },
  { key: 'Category', name: 'Category', type: 'string', missingCount: 0, uniqueCount: 4, sampleValues: ['Analytics Pro', 'AI Tools', 'Cloud Services'] },
  { key: 'Region', name: 'Region', type: 'string', missingCount: 0, uniqueCount: 5, sampleValues: ['North America', 'Europe', 'Asia Pacific'] },
  { key: 'Sales', name: 'Sales ($)', type: 'number', missingCount: 0, uniqueCount: 32, sampleValues: [48500, 62400], min: 21500, max: 94000, avg: 56490, median: 54600, stdDev: 19420, sum: 1807700 },
  { key: 'Units', name: 'Units Sold', type: 'number', missingCount: 0, uniqueCount: 28, sampleValues: [24, 18], min: 10, max: 48, avg: 28.1, median: 27, stdDev: 9.8, sum: 900 },
  { key: 'Profit', name: 'Profit ($)', type: 'number', missingCount: 0, uniqueCount: 32, sampleValues: [14550, 24960], min: 5375, max: 39480, avg: 20120, median: 18410, stdDev: 8930, sum: 643841 },
  { key: 'Discount', name: 'Discount (%)', type: 'number', missingCount: 0, uniqueCount: 4, sampleValues: [0.05, 0.10], min: 0.0, max: 0.15, avg: 0.04, median: 0.05, stdDev: 0.038, sum: 1.35 }
];

export const DEFAULT_DATASET: Dataset = {
  id: 'ds_sales_2026',
  name: 'Sales_2026.xlsx',
  size: 3845000,
  rowCount: 25430,
  colCount: 10,
  uploadedAt: 'Today, 09:15 AM',
  columns: SALES_COLUMNS,
  data: SAMPLE_SALES_DATA,
  summary: {
    rowCount: 25430,
    colCount: 10,
    numericCols: ['Sales', 'Units', 'Profit', 'Discount'],
    categoricalCols: ['OrderID', 'Customer', 'Product', 'Category', 'Region'],
    dateCols: ['Date'],
    missingCells: 0,
    duplicateRows: 0,
    completeness: 100
  }
};

export const DABI_AI_SALES_DATASET: Dataset = {
  id: 'ds_dabi_ai_sales',
  name: 'DABI_AI_Sales_Dataset.xlsx',
  size: 1450000,
  rowCount: 1000,
  colCount: 16,
  uploadedAt: 'Today, 11:40 AM',
  columns: [
    { key: 'TransactionID', name: 'Transaction ID', type: 'string', missingCount: 0, uniqueCount: 1000, sampleValues: ['TRX-9001', 'TRX-9002'] },
    { key: 'InvoiceDate', name: 'Invoice Date', type: 'date', missingCount: 0, uniqueCount: 300, sampleValues: ['2026-02-01', '2026-02-05'] },
    { key: 'ClientName', name: 'Client Name', type: 'string', missingCount: 0, uniqueCount: 180, sampleValues: ['Apex Systems', 'Vanguard Data'] },
    { key: 'AccountTier', name: 'Account Tier', type: 'string', missingCount: 0, uniqueCount: 4, sampleValues: ['Enterprise', 'Strategic', 'Mid-Market'] },
    { key: 'ProductLine', name: 'Product Line', type: 'string', missingCount: 0, uniqueCount: 4, sampleValues: ['AI Copilot Suite', 'Analytics Core', 'Cloud DB'] },
    { key: 'Industry', name: 'Industry', type: 'string', missingCount: 0, uniqueCount: 5, sampleValues: ['FinTech', 'Healthcare', 'Logistics'] },
    { key: 'GlobalRegion', name: 'Global Region', type: 'string', missingCount: 0, uniqueCount: 5, sampleValues: ['North America', 'Europe', 'Asia Pacific'] },
    { key: 'Currency', name: 'Currency', type: 'string', missingCount: 0, uniqueCount: 4, sampleValues: ['USD', 'EUR', 'GBP'] },
    { key: 'GrossSales', name: 'Gross Sales ($)', type: 'number', missingCount: 0, uniqueCount: 450, sampleValues: [4800, 3200], min: 250, max: 8500, avg: 842.5, median: 780, sum: 842500 },
    { key: 'NetMargin', name: 'Net Margin ($)', type: 'number', missingCount: 0, uniqueCount: 410, sampleValues: [1680, 1120], min: 80, max: 3200, avg: 301.2, median: 275, sum: 301200 },
    { key: 'LicenseUnits', name: 'License Units', type: 'number', missingCount: 0, uniqueCount: 20, sampleValues: [12, 8], min: 1, max: 50, avg: 4.85, median: 4, sum: 4850 },
    { key: 'UnitPrice', name: 'Unit Price ($)', type: 'number', missingCount: 0, uniqueCount: 15, sampleValues: [400, 350], min: 150, max: 650, avg: 175, sum: 175000 },
    { key: 'DiscountPct', name: 'Discount (%)', type: 'number', missingCount: 0, uniqueCount: 5, sampleValues: [0.05, 0.10], min: 0.0, max: 0.20, avg: 0.06, sum: 60 },
    { key: 'PaymentTerms', name: 'Payment Terms', type: 'string', missingCount: 0, uniqueCount: 3, sampleValues: ['Net 30', 'Net 60'] },
    { key: 'CustomerSatisfaction', name: 'CSAT Rating (1-5)', type: 'number', missingCount: 0, uniqueCount: 10, sampleValues: [4.8, 4.5], min: 3.2, max: 5.0, avg: 4.7, sum: 4700 },
    { key: 'RepID', name: 'Sales Representative ID', type: 'string', missingCount: 0, uniqueCount: 25, sampleValues: ['REP-101', 'REP-102'] }
  ],
  data: [
    { TransactionID: 'TRX-9001', InvoiceDate: '2026-02-01', ClientName: 'Apex Systems', AccountTier: 'Enterprise', ProductLine: 'AI Copilot Suite', Industry: 'FinTech', GlobalRegion: 'North America', Currency: 'USD', GrossSales: 4800, NetMargin: 1680, LicenseUnits: 12, UnitPrice: 400, DiscountPct: 0.05, PaymentTerms: 'Net 30', CustomerSatisfaction: 4.8, RepID: 'REP-101' },
    { TransactionID: 'TRX-9002', InvoiceDate: '2026-02-03', ClientName: 'Vanguard Data', AccountTier: 'Strategic', ProductLine: 'Analytics Core', Industry: 'Logistics', GlobalRegion: 'Europe', Currency: 'EUR', GrossSales: 3200, NetMargin: 1120, LicenseUnits: 8, UnitPrice: 400, DiscountPct: 0.00, PaymentTerms: 'Net 30', CustomerSatisfaction: 4.6, RepID: 'REP-104' },
    { TransactionID: 'TRX-9003', InvoiceDate: '2026-02-05', ClientName: 'Kyoto Robotics', AccountTier: 'Enterprise', ProductLine: 'AI Copilot Suite', Industry: 'Manufacturing', GlobalRegion: 'Asia Pacific', Currency: 'JPY', GrossSales: 6400, NetMargin: 2560, LicenseUnits: 16, UnitPrice: 400, DiscountPct: 0.00, PaymentTerms: 'Net 60', CustomerSatisfaction: 4.9, RepID: 'REP-108' },
    { TransactionID: 'TRX-9004', InvoiceDate: '2026-02-08', ClientName: 'Zurich Health Bio', AccountTier: 'Mid-Market', ProductLine: 'Cloud DB', Industry: 'Healthcare', GlobalRegion: 'Europe', Currency: 'EUR', GrossSales: 2100, NetMargin: 735, LicenseUnits: 6, UnitPrice: 350, DiscountPct: 0.10, PaymentTerms: 'Net 30', CustomerSatisfaction: 4.5, RepID: 'REP-102' },
    { TransactionID: 'TRX-9005', InvoiceDate: '2026-02-12', ClientName: 'São Paulo FinTech', AccountTier: 'Strategic', ProductLine: 'Data Pipeline', Industry: 'FinTech', GlobalRegion: 'Latin America', Currency: 'USD', GrossSales: 3800, NetMargin: 1330, LicenseUnits: 10, UnitPrice: 380, DiscountPct: 0.05, PaymentTerms: 'Net 30', CustomerSatisfaction: 4.4, RepID: 'REP-105' },
    { TransactionID: 'TRX-9006', InvoiceDate: '2026-02-15', ClientName: 'Dubai Horizon Group', AccountTier: 'Enterprise', ProductLine: 'AI Copilot Suite', Industry: 'FinTech', GlobalRegion: 'Middle East', Currency: 'USD', GrossSales: 7500, NetMargin: 3000, LicenseUnits: 20, UnitPrice: 375, DiscountPct: 0.00, PaymentTerms: 'Net 60', CustomerSatisfaction: 5.0, RepID: 'REP-110' },
    { TransactionID: 'TRX-9007', InvoiceDate: '2026-02-18', ClientName: 'Nordic Retail Labs', AccountTier: 'Mid-Market', ProductLine: 'Analytics Core', Industry: 'E-Commerce', GlobalRegion: 'Europe', Currency: 'EUR', GrossSales: 2800, NetMargin: 980, LicenseUnits: 7, UnitPrice: 400, DiscountPct: 0.05, PaymentTerms: 'Net 30', CustomerSatisfaction: 4.7, RepID: 'REP-103' },
    { TransactionID: 'TRX-9008', InvoiceDate: '2026-02-22', ClientName: 'Singapore Capital', AccountTier: 'Enterprise', ProductLine: 'AI Copilot Suite', Industry: 'FinTech', GlobalRegion: 'Asia Pacific', Currency: 'USD', GrossSales: 5900, NetMargin: 2360, LicenseUnits: 15, UnitPrice: 393, DiscountPct: 0.00, PaymentTerms: 'Net 30', CustomerSatisfaction: 4.8, RepID: 'REP-107' }
  ],
  summary: {
    rowCount: 1000,
    colCount: 16,
    numericCols: ['GrossSales', 'NetMargin', 'LicenseUnits', 'UnitPrice', 'DiscountPct', 'CustomerSatisfaction'],
    categoricalCols: ['TransactionID', 'ClientName', 'AccountTier', 'ProductLine', 'Industry', 'GlobalRegion', 'Currency', 'PaymentTerms', 'RepID'],
    dateCols: ['InvoiceDate'],
    missingCells: 0,
    duplicateRows: 0,
    completeness: 100
  }
};

export const MARKETING_DATASET: Dataset = {
  id: 'ds_marketing_data',
  name: 'Marketing_Data.csv',
  size: 1820000,
  rowCount: 15230,
  colCount: 8,
  uploadedAt: 'Yesterday, 03:20 PM',
  columns: [
    { key: 'CampaignID', name: 'Campaign ID', type: 'string', missingCount: 0, uniqueCount: 15230, sampleValues: ['CMP-01', 'CMP-02'] },
    { key: 'Channel', name: 'Acquisition Channel', type: 'string', missingCount: 0, uniqueCount: 6, sampleValues: ['Google Search', 'LinkedIn Ads', 'Meta Display'] },
    { key: 'Spend', name: 'Ad Spend ($)', type: 'number', missingCount: 0, uniqueCount: 820, sampleValues: [24000, 18500], min: 500, max: 45000, avg: 27.08, median: 24.5, sum: 412500 },
    { key: 'Clicks', name: 'Total Clicks', type: 'number', missingCount: 0, uniqueCount: 750, sampleValues: [14200, 9800], min: 800, max: 35000, avg: 22.65, median: 21.0, sum: 345000 },
    { key: 'Conversions', name: 'Conversions', type: 'number', missingCount: 0, uniqueCount: 420, sampleValues: [920, 640], min: 50, max: 2400, avg: 1.62, median: 1.5, sum: 24800 },
    { key: 'Revenue', name: 'Attributed Revenue ($)', type: 'number', missingCount: 0, uniqueCount: 890, sampleValues: [88000, 62000], min: 1500, max: 160000, avg: 90.93, median: 84.0, sum: 1385000 },
    { key: 'CAC', name: 'Customer Acquisition Cost ($)', type: 'number', missingCount: 0, uniqueCount: 120, sampleValues: [26.08, 28.90], min: 8.5, max: 34.0, avg: 16.63, median: 15.8, sum: 253274 },
    { key: 'ROAS', name: 'Return on Ad Spend (x)', type: 'number', missingCount: 0, uniqueCount: 95, sampleValues: [3.66, 3.35], min: 1.8, max: 5.8, avg: 3.35, median: 3.4, sum: 51020 }
  ],
  data: [
    { CampaignID: 'CMP-01', Channel: 'Google Search', Spend: 24000, Clicks: 14200, Conversions: 920, Revenue: 88000, CAC: 26.08, ROAS: 3.66 },
    { CampaignID: 'CMP-02', Channel: 'LinkedIn Ads', Spend: 32000, Clicks: 8400, Conversions: 680, Revenue: 112000, CAC: 47.05, ROAS: 3.50 },
    { CampaignID: 'CMP-03', Channel: 'YouTube Video', Spend: 18500, Clicks: 19500, Conversions: 540, Revenue: 62000, CAC: 34.25, ROAS: 3.35 },
    { CampaignID: 'CMP-04', Channel: 'Organic SEO', Spend: 6000, Clicks: 28000, Conversions: 1400, Revenue: 134000, CAC: 4.28, ROAS: 22.33 },
    { CampaignID: 'CMP-05', Channel: 'Meta Display', Spend: 14200, Clicks: 11000, Conversions: 480, Revenue: 44000, CAC: 29.58, ROAS: 3.09 },
    { CampaignID: 'CMP-06', Channel: 'Partner Referral', Spend: 9800, Clicks: 4200, Conversions: 510, Revenue: 58000, CAC: 19.21, ROAS: 5.91 }
  ],
  summary: {
    rowCount: 15230,
    colCount: 8,
    numericCols: ['Spend', 'Clicks', 'Conversions', 'Revenue', 'CAC', 'ROAS'],
    categoricalCols: ['CampaignID', 'Channel'],
    dateCols: [],
    missingCells: 0,
    duplicateRows: 0,
    completeness: 100
  }
};

export const SAMPLE_RECENT_PROJECTS: RecentProject[] = [
  {
    id: 'proj-1',
    title: 'Q1-Q3 Global Revenue & Margin Audit',
    datasetName: 'Sales_2026.xlsx',
    rows: 25430,
    columns: 10,
    category: 'Sales Analytics',
    lastActive: '12 mins ago',
    status: 'Ready',
    kpiHighlight: '$1.81M Revenue • 35.6% Margin'
  },
  {
    id: 'proj-2',
    title: 'Customer Lifetime & Retention Cohorts',
    datasetName: 'SaaS_Churn_Metrics_v2.csv',
    rows: 14200,
    columns: 14,
    category: 'Customer Success',
    lastActive: '2 hours ago',
    status: 'Ready',
    kpiHighlight: '94.2% Net Retention • 2.1% Churn'
  },
  {
    id: 'proj-3',
    title: 'Supply Chain & Fulfillment Latency',
    datasetName: 'Logistics_Inventory_Q3.xlsx',
    rows: 8940,
    columns: 8,
    category: 'Operations',
    lastActive: 'Yesterday',
    status: 'Updated',
    kpiHighlight: '98.8% On-Time Delivery Rate'
  }
];

export const MONTHLY_REVENUE_DATA = [
  { month: 'Jan', Revenue: 176900, Profit: 59650, Target: 160000 },
  { month: 'Feb', Revenue: 194700, Profit: 67291, Target: 175000 },
  { month: 'Mar', Revenue: 208300, Profit: 65285, Target: 190000 },
  { month: 'Apr', Revenue: 152700, Profit: 54255, Target: 170000 },
  { month: 'May', Revenue: 264400, Profit: 92090, Target: 220000 },
  { month: 'Jun', Revenue: 168600, Profit: 57804, Target: 180000 },
  { month: 'Jul', Revenue: 167800, Profit: 56172, Target: 185000 },
  { month: 'Aug', Revenue: 229500, Profit: 84365, Target: 210000 },
  { month: 'Sep', Revenue: 244800, Profit: 86229, Target: 225000 },
  { month: 'Oct', Revenue: 278000, Profit: 98000, Target: 250000 },
  { month: 'Nov', Revenue: 310000, Profit: 114000, Target: 280000 },
  { month: 'Dec', Revenue: 385000, Profit: 142000, Target: 330000 }
];

export const CATEGORY_SALES_DATA = [
  { name: 'Analytics Pro', value: 419400, share: '34%', count: 8 },
  { name: 'AI Tools', value: 434300, share: '35%', count: 7 },
  { name: 'Cloud Services', value: 335700, share: '21%', count: 6 },
  { name: 'Data Pipeline', value: 197100, share: '10%', count: 5 }
];

export const REGIONAL_SALES_DATA = [
  { region: 'North America', Sales: 410000, Profit: 139173, Orders: 9 },
  { region: 'Asia Pacific', Sales: 480500, Profit: 177489, Orders: 8 },
  { region: 'Europe', Sales: 384700, Profit: 133540, Orders: 8 },
  { region: 'Middle East', Sales: 221000, Profit: 85400, Orders: 3 },
  { region: 'Latin America', Sales: 80200, Profit: 20674, Orders: 4 }
];

export const TOP_PRODUCTS_DATA = [
  { product: 'Riyadh AI Copilot Spec', sales: 94000, category: 'AI Tools' },
  { product: 'Taipei Predictive Core', sales: 91500, category: 'Analytics Pro' },
  { product: 'Boston Quantum Suite', sales: 89000, category: 'Analytics Pro' },
  { product: 'Tokyo DABI Enterprise', sales: 83000, category: 'Analytics Pro' },
  { product: 'Frankfurt AI Copilot', sales: 81000, category: 'AI Tools' },
  { product: 'Dubai Strategic Cloud', sales: 78000, category: 'Cloud Services' },
  { product: 'Bengaluru AI Nexus', sales: 74500, category: 'AI Tools' },
  { product: 'Munich Aerospace DABI', sales: 72000, category: 'Analytics Pro' },
  { product: 'Seoul Cybernetics AI', sales: 71200, category: 'AI Tools' },
  { product: 'Singapore FinServ Suite', sales: 69500, category: 'Analytics Pro' }
];

export const SECONDARY_DATASET_SAAS: Dataset = {
  id: 'saas_churn_csv',
  name: 'SaaS_Churn_Metrics_v2.csv',
  size: 2150000,
  rowCount: 14200,
  colCount: 8,
  uploadedAt: '2026-09-07 04:30 PM',
  columns: [
    { key: 'CustomerID', name: 'Customer ID', type: 'string', missingCount: 0, uniqueCount: 14200 },
    { key: 'Plan', name: 'Subscription Plan', type: 'string', missingCount: 0, uniqueCount: 4 },
    { key: 'MRR', name: 'Monthly Recurring Revenue ($)', type: 'number', missingCount: 0, uniqueCount: 120, min: 99, max: 4999, avg: 850, sum: 12070000 },
    { key: 'UsageScore', name: 'Platform Usage Score', type: 'number', missingCount: 0, uniqueCount: 95, min: 12, max: 100, avg: 82.4, sum: 1170080 },
    { key: 'NetRetention', name: 'Net Dollar Retention (%)', type: 'number', missingCount: 0, uniqueCount: 50, min: 80, max: 140, avg: 114.5, sum: 1625900 },
    { key: 'Tickets', name: 'Support Tickets', type: 'number', missingCount: 0, uniqueCount: 15, min: 0, max: 18, avg: 2.1, sum: 29820 },
    { key: 'ChurnRisk', name: 'Churn Risk Status', type: 'string', missingCount: 0, uniqueCount: 3 },
    { key: 'ContractLength', name: 'Contract Months', type: 'number', missingCount: 0, uniqueCount: 4, min: 1, max: 36, avg: 14.8, sum: 210160 }
  ],
  data: [
    { CustomerID: 'CUST-201', Plan: 'Enterprise Elite', MRR: 4200, UsageScore: 94, NetRetention: 128, Tickets: 1, ChurnRisk: 'Low', ContractLength: 24 },
    { CustomerID: 'CUST-202', Plan: 'Growth Pro', MRR: 1250, UsageScore: 78, NetRetention: 105, Tickets: 3, ChurnRisk: 'Medium', ContractLength: 12 },
    { CustomerID: 'CUST-203', Plan: 'Starter Scale', MRR: 299, UsageScore: 54, NetRetention: 88, Tickets: 6, ChurnRisk: 'High', ContractLength: 1 },
    { CustomerID: 'CUST-204', Plan: 'Enterprise Elite', MRR: 3800, UsageScore: 91, NetRetention: 135, Tickets: 0, ChurnRisk: 'Low', ContractLength: 36 },
    { CustomerID: 'CUST-205', Plan: 'Growth Pro', MRR: 1600, UsageScore: 86, NetRetention: 112, Tickets: 2, ChurnRisk: 'Low', ContractLength: 12 }
  ],
  summary: {
    rowCount: 14200,
    colCount: 8,
    numericCols: ['MRR', 'UsageScore', 'NetRetention', 'Tickets', 'ContractLength'],
    categoricalCols: ['CustomerID', 'Plan', 'ChurnRisk'],
    dateCols: [],
    missingCells: 0,
    duplicateRows: 0,
    completeness: 100
  }
};

export const SAMPLE_DATASETS: Dataset[] = [
  DEFAULT_DATASET,
  DABI_AI_SALES_DATASET,
  MARKETING_DATASET,
  SECONDARY_DATASET_SAAS
];

export const SAMPLE_PROJECTS: RecentProject[] = SAMPLE_RECENT_PROJECTS;

export const PROFIT_TREND_DATA = [
  { period: 'W1', grossProfit: 14500, netMargin: 30.0, ebitda: 11200 },
  { period: 'W2', grossProfit: 26800, netMargin: 33.5, ebitda: 20400 },
  { period: 'W3', grossProfit: 38200, netMargin: 36.2, ebitda: 29100 },
  { period: 'W4', grossProfit: 49500, netMargin: 35.8, ebitda: 37900 },
  { period: 'W5', grossProfit: 63100, netMargin: 37.4, ebitda: 48200 },
  { period: 'W6', grossProfit: 78400, netMargin: 38.1, ebitda: 61500 },
  { period: 'W7', grossProfit: 94200, netMargin: 39.5, ebitda: 74800 },
  { period: 'W8', grossProfit: 112000, netMargin: 40.2, ebitda: 89600 }
];


