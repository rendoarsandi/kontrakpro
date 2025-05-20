import { Env } from '../index';
import { 
  AnalyticsRequest, 
  AnalyticsResult, 
  MetricType, 
  DimensionType, 
  TimePeriod 
} from './types';

export class AnalyticsService {
  private env: Env;
  
  constructor(env: Env) {
    this.env = env;
  }
  
  // Menghasilkan query SQL berdasarkan permintaan analitik
  private generateSqlQuery(request: AnalyticsRequest): { query: string, params: any[] } {
    const { metrics, dimensions, filters, timePeriod, startDate, endDate, limit, offset } = request;
    
    // Validasi input
    if (!metrics || metrics.length === 0) {
      throw new Error('At least one metric is required');
    }
    
    // Tentukan tabel utama berdasarkan metrik pertama
    const mainTable = this.getTableForMetric(metrics[0].field);
    
    // Buat bagian SELECT
    let selectClauses: string[] = [];
    
    // Tambahkan dimensi ke SELECT
    if (dimensions && dimensions.length > 0) {
      for (const dimension of dimensions) {
        const dimensionSql = this.getDimensionSql(dimension.type, dimension.field);
        const alias = dimension.alias || dimension.field.replace('.', '_');
        selectClauses.push(`${dimensionSql} AS ${alias}`);
      }
    }
    
    // Tambahkan metrik ke SELECT
    for (const metric of metrics) {
      const metricSql = this.getMetricSql(metric.type, metric.field);
      const alias = metric.alias || `${metric.type}_${metric.field.replace('.', '_')}`;
      selectClauses.push(`${metricSql} AS ${alias}`);
    }
    
    // Buat query dasar
    let query = `SELECT ${selectClauses.join(', ')} FROM ${mainTable}`;
    
    // Tambahkan JOIN jika diperlukan
    const joins = this.getJoinsForTables([mainTable]);
    if (joins.length > 0) {
      query += ` ${joins.join(' ')}`;
    }
    
    // Tambahkan WHERE clause
    const whereConditions: string[] = [];
    const params: any[] = [];
    
    // Filter berdasarkan periode waktu
    if (timePeriod || (startDate && endDate)) {
      const timeFilter = this.getTimeFilter(mainTable, timePeriod, startDate, endDate);
      if (timeFilter.condition) {
        whereConditions.push(timeFilter.condition);
        params.push(...timeFilter.params);
      }
    }
    
    // Tambahkan filter kustom
    if (filters && filters.length > 0) {
      for (const filter of filters) {
        const filterSql = this.getFilterSql(filter);
        whereConditions.push(filterSql.condition);
        params.push(...filterSql.params);
      }
    }
    
    // Tambahkan WHERE clause jika ada kondisi
    if (whereConditions.length > 0) {
      query += ` WHERE ${whereConditions.join(' AND ')}`;
    }
    
    // Tambahkan GROUP BY jika ada dimensi
    if (dimensions && dimensions.length > 0) {
      const groupByClauses = dimensions.map(dimension => {
        const alias = dimension.alias || dimension.field.replace('.', '_');
        return alias;
      });
      
      query += ` GROUP BY ${groupByClauses.join(', ')}`;
    }
    
    // Tambahkan ORDER BY
    if (dimensions && dimensions.length > 0) {
      const orderByClauses = dimensions.map(dimension => {
        const alias = dimension.alias || dimension.field.replace('.', '_');
        return `${alias} ASC`;
      });
      
      query += ` ORDER BY ${orderByClauses.join(', ')}`;
    }
    
    // Tambahkan LIMIT dan OFFSET
    if (limit) {
      query += ` LIMIT ?`;
      params.push(limit);
      
      if (offset) {
        query += ` OFFSET ?`;
        params.push(offset);
      }
    }
    
    return { query, params };
  }
  
  // Mendapatkan tabel untuk metrik
  private getTableForMetric(field: string): string {
    if (field.startsWith('contracts.')) {
      return 'contracts';
    } else if (field.startsWith('workflows.')) {
      return 'workflows';
    } else if (field.startsWith('workflow_steps.')) {
      return 'workflow_steps';
    } else if (field.startsWith('documents.')) {
      return 'documents';
    } else if (field.startsWith('users.')) {
      return 'users';
    } else if (field.startsWith('organizations.')) {
      return 'organizations';
    } else if (field.startsWith('audit_logs.')) {
      return 'audit_logs';
    } else {
      return field.split('.')[0];
    }
  }
  
  // Mendapatkan JOIN yang diperlukan berdasarkan tabel yang digunakan
  private getJoinsForTables(tables: string[]): string[] {
    const joins: string[] = [];
    
    if (tables.includes('contracts')) {
      if (tables.includes('users') || tables.includes('organizations')) {
        joins.push(`LEFT JOIN users ON contracts.owner_id = users.id`);
        joins.push(`LEFT JOIN organizations ON contracts.organization_id = organizations.id`);
      }
    }
    
    if (tables.includes('workflows')) {
      if (!tables.includes('contracts')) {
        joins.push(`LEFT JOIN contracts ON workflows.contract_id = contracts.id`);
      }
    }
    
    if (tables.includes('workflow_steps')) {
      if (!tables.includes('workflows')) {
        joins.push(`LEFT JOIN workflows ON workflow_steps.workflow_id = workflows.id`);
      }
      if (!tables.includes('users')) {
        joins.push(`LEFT JOIN users ON workflow_steps.assignee_id = users.id`);
      }
    }
    
    if (tables.includes('documents')) {
      if (!tables.includes('contracts')) {
        joins.push(`LEFT JOIN contracts ON documents.contract_id = contracts.id`);
      }
      if (!tables.includes('users')) {
        joins.push(`LEFT JOIN users ON documents.uploaded_by = users.id`);
      }
    }
    
    return joins;
  }
  
  // Mendapatkan SQL untuk dimensi
  private getDimensionSql(type: DimensionType, field: string): string {
    switch (type) {
      case DimensionType.DATE:
        return `DATE(${field} / 1000, 'unixepoch')`;
      case DimensionType.MONTH:
        return `strftime('%Y-%m', ${field} / 1000, 'unixepoch')`;
      case DimensionType.YEAR:
        return `strftime('%Y', ${field} / 1000, 'unixepoch')`;
      default:
        return field;
    }
  }
  
  // Mendapatkan SQL untuk metrik
  private getMetricSql(type: MetricType, field: string): string {
    switch (type) {
      case MetricType.COUNT:
        return `COUNT(${field})`;
      case MetricType.SUM:
        return `SUM(${field})`;
      case MetricType.AVERAGE:
        return `AVG(${field})`;
      case MetricType.MIN:
        return `MIN(${field})`;
      case MetricType.MAX:
        return `MAX(${field})`;
      default:
        return field;
    }
  }
  
  // Mendapatkan filter waktu
  private getTimeFilter(
    table: string, 
    timePeriod?: TimePeriod, 
    startDate?: number, 
    endDate?: number
  ): { condition: string, params: any[] } {
    const params: any[] = [];
    let condition = '';
    
    const timeField = `${table}.created_at`;
    
    if (startDate && endDate) {
      condition = `${timeField} >= ? AND ${timeField} <= ?`;
      params.push(startDate, endDate);
      return { condition, params };
    }
    
    if (timePeriod) {
      const now = Date.now();
      let start = now;
      
      switch (timePeriod) {
        case TimePeriod.DAY:
          start = now - 24 * 60 * 60 * 1000;
          break;
        case TimePeriod.WEEK:
          start = now - 7 * 24 * 60 * 60 * 1000;
          break;
        case TimePeriod.MONTH:
          start = now - 30 * 24 * 60 * 60 * 1000;
          break;
        case TimePeriod.QUARTER:
          start = now - 90 * 24 * 60 * 60 * 1000;
          break;
        case TimePeriod.YEAR:
          start = now - 365 * 24 * 60 * 60 * 1000;
          break;
      }
      
      condition = `${timeField} >= ? AND ${timeField} <= ?`;
      params.push(start, now);
    }
    
    return { condition, params };
  }
  
  // Mendapatkan SQL untuk filter
  private getFilterSql(filter: any): { condition: string, params: any[] } {
    const { field, operator, value } = filter;
    const params: any[] = [];
    let condition = '';
    
    switch (operator) {
      case 'eq':
        condition = `${field} = ?`;
        params.push(value);
        break;
      case 'neq':
        condition = `${field} != ?`;
        params.push(value);
        break;
      case 'gt':
        condition = `${field} > ?`;
        params.push(value);
        break;
      case 'gte':
        condition = `${field} >= ?`;
        params.push(value);
        break;
      case 'lt':
        condition = `${field} < ?`;
        params.push(value);
        break;
      case 'lte':
        condition = `${field} <= ?`;
        params.push(value);
        break;
      case 'in':
        condition = `${field} IN (${Array(value.length).fill('?').join(', ')})`;
        params.push(...value);
        break;
      case 'not_in':
        condition = `${field} NOT IN (${Array(value.length).fill('?').join(', ')})`;
        params.push(...value);
        break;
      case 'contains':
        condition = `${field} LIKE ?`;
        params.push(`%${value}%`);
        break;
      case 'not_contains':
        condition = `${field} NOT LIKE ?`;
        params.push(`%${value}%`);
        break;
      default:
        throw new Error(`Unsupported operator: ${operator}`);
    }
    
    return { condition, params };
  }
  
  // Mengeksekusi permintaan analitik
  async executeAnalyticsRequest(request: AnalyticsRequest): Promise<AnalyticsResult> {
    try {
      const { query, params } = this.generateSqlQuery(request);
      
      // Eksekusi query
      const { results, success } = await this.env.DB.prepare(query)
        .bind(...params)
        .all();
      
      if (!success) {
        throw new Error('Failed to execute analytics query');
      }
      
      // Hitung total jika diperlukan
      let totals: Record<string, any> | undefined;
      
      if (request.metrics.length > 0 && (!request.dimensions || request.dimensions.length === 0)) {
        totals = results[0] || {};
      } else if (request.metrics.length > 0 && results.length > 0) {
        totals = {};
        
        for (const metric of request.metrics) {
          const alias = metric.alias || `${metric.type}_${metric.field.replace('.', '_')}`;
          
          if (metric.type === MetricType.SUM || metric.type === MetricType.COUNT) {
            totals[alias] = results.reduce((sum, row) => sum + (parseFloat(row[alias]) || 0), 0);
          } else if (metric.type === MetricType.AVERAGE) {
            const sum = results.reduce((sum, row) => sum + (parseFloat(row[alias]) || 0), 0);
            totals[alias] = sum / results.length;
          } else if (metric.type === MetricType.MIN) {
            totals[alias] = Math.min(...results.map(row => parseFloat(row[alias]) || 0));
          } else if (metric.type === MetricType.MAX) {
            totals[alias] = Math.max(...results.map(row => parseFloat(row[alias]) || 0));
          }
        }
      }
      
      return {
        data: results,
        totals,
        metadata: {
          request,
          count: results.length,
          hasMore: results.length === request.limit
        }
      };
    } catch (error) {
      console.error('Analytics error:', error);
      throw error;
    }
  }
}
