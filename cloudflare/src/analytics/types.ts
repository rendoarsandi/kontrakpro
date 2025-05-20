// Tipe metrik yang didukung
export enum MetricType {
  COUNT = 'count',
  SUM = 'sum',
  AVERAGE = 'average',
  MIN = 'min',
  MAX = 'max'
}

// Tipe dimensi yang didukung
export enum DimensionType {
  DATE = 'date',
  MONTH = 'month',
  YEAR = 'year',
  USER = 'user',
  ORGANIZATION = 'organization',
  CONTRACT_TYPE = 'contract_type',
  CONTRACT_STATUS = 'contract_status',
  WORKFLOW_STATUS = 'workflow_status'
}

// Tipe periode waktu yang didukung
export enum TimePeriod {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year',
  CUSTOM = 'custom'
}

// Interface untuk metrik
export interface Metric {
  type: MetricType;
  field: string;
  alias?: string;
}

// Interface untuk dimensi
export interface Dimension {
  type: DimensionType;
  field: string;
  alias?: string;
}

// Interface untuk filter
export interface AnalyticsFilter {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'contains' | 'not_contains';
  value: string | number | boolean | Array<string | number | boolean>;
}

// Interface untuk permintaan analitik
export interface AnalyticsRequest {
  metrics: Metric[];
  dimensions?: Dimension[];
  filters?: AnalyticsFilter[];
  timePeriod?: TimePeriod;
  startDate?: number;
  endDate?: number;
  limit?: number;
  offset?: number;
}

// Interface untuk hasil analitik
export interface AnalyticsResult {
  data: Record<string, any>[];
  totals?: Record<string, any>;
  metadata: {
    request: AnalyticsRequest;
    count: number;
    hasMore: boolean;
  };
}

// Interface untuk dashboard
export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  widgets: DashboardWidget[];
  created_at: number;
  updated_at: number;
  created_by: string;
}

// Interface untuk widget dashboard
export interface DashboardWidget {
  id: string;
  type: 'chart' | 'table' | 'metric' | 'list';
  title: string;
  config: {
    chartType?: 'line' | 'bar' | 'pie' | 'area';
    request: AnalyticsRequest;
    displayOptions?: Record<string, any>;
  };
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// Interface untuk laporan
export interface Report {
  id: string;
  name: string;
  description?: string;
  request: AnalyticsRequest;
  format: 'json' | 'csv' | 'pdf' | 'html';
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    dayOfWeek?: number; // 0-6, 0 is Sunday
    dayOfMonth?: number; // 1-31
    hour?: number; // 0-23
    minute?: number; // 0-59
    recipients: string[]; // email addresses
  };
  created_at: number;
  updated_at: number;
  created_by: string;
}
