import { Env } from '../index';
import { corsHeaders } from '../utils/cors';
import { generateId } from '../utils/id';
import { AnalyticsService } from './service';
import { 
  AnalyticsRequest, 
  Dashboard, 
  DashboardWidget, 
  Report,
  MetricType, // Import Enum MetricType
  DimensionType, // Import Enum DimensionType
  AnalyticsFilter // Import AnalyticsFilter untuk type checking
} from './types';

// Interface untuk request yang memiliki params (dari itty-router)
interface RequestWithParams extends Request {
  params?: { [key: string]: string };
  user?: any; // Menambahkan user dari middleware autentikasi
}

// Mengeksekusi permintaan analitik
export async function executeAnalytics(request: RequestWithParams, env: Env): Promise<Response> {
  try {
    const analyticsRequest: AnalyticsRequest = await request.json();
    const analyticsService = new AnalyticsService(env);
    
    // Validasi input
    if (!analyticsRequest.metrics || analyticsRequest.metrics.length === 0) {
      return new Response(JSON.stringify({ error: 'At least one metric is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    
    // Eksekusi permintaan analitik
    const result = await analyticsService.executeAnalyticsRequest(analyticsRequest);
    
    return new Response(JSON.stringify(result), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error: any) { // Menggunakan tipe any untuk error
    return new Response(JSON.stringify({ error: error.message || 'Failed to execute analytics' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

// Mendapatkan metrik ringkasan
export async function getSummaryMetrics(request: RequestWithParams, env: Env): Promise<Response> {
  try {
    const user = request.user;
    const url = new URL(request.url);
    const organizationId = url.searchParams.get('organization_id');
    const timePeriod = url.searchParams.get('time_period') || 'month';
    
    const analyticsService = new AnalyticsService(env);
    
    // Metrik total kontrak
    const totalContractsRequest: AnalyticsRequest = {
      metrics: [{ type: MetricType.COUNT, field: 'contracts.id' }], // Menggunakan Enum
      filters: organizationId ? [
        { field: 'contracts.organization_id', operator: 'eq', value: organizationId } as AnalyticsFilter // Type assertion
      ] : [],
      timePeriod: timePeriod as any
    };
    
    // Metrik kontrak berdasarkan status
    const contractsByStatusRequest: AnalyticsRequest = {
      metrics: [{ type: MetricType.COUNT, field: 'contracts.id' }], // Menggunakan Enum
      dimensions: [{ type: DimensionType.CONTRACT_STATUS, field: 'contracts.status' }], // Menggunakan Enum
      filters: organizationId ? [
        { field: 'contracts.organization_id', operator: 'eq', value: organizationId } as AnalyticsFilter // Type assertion
      ] : [],
      timePeriod: timePeriod as any
    };
    
    // Metrik workflow aktif
    const activeWorkflowsRequest: AnalyticsRequest = {
      metrics: [{ type: MetricType.COUNT, field: 'workflows.id' }], // Menggunakan Enum
      filters: [
        { field: 'workflows.status', operator: 'eq', value: 'active' } as AnalyticsFilter, // Type assertion
        ...(organizationId ? [{ field: 'contracts.organization_id', operator: 'eq', value: organizationId } as AnalyticsFilter] : []) // Type assertion
      ],
      timePeriod: timePeriod as any
    };
    
    // Metrik tugas yang menunggu
    const pendingTasksRequest: AnalyticsRequest = {
      metrics: [{ type: MetricType.COUNT, field: 'workflow_steps.id' }], // Menggunakan Enum
      filters: [
        { field: 'workflow_steps.status', operator: 'eq', value: 'pending' } as AnalyticsFilter, // Type assertion
        ...(organizationId ? [{ field: 'contracts.organization_id', operator: 'eq', value: organizationId } as AnalyticsFilter] : []) // Type assertion
      ],
      timePeriod: timePeriod as any
    };
    
    // Eksekusi semua permintaan analitik secara paralel
    const [totalContracts, contractsByStatus, activeWorkflows, pendingTasks] = await Promise.all([
      analyticsService.executeAnalyticsRequest(totalContractsRequest),
      analyticsService.executeAnalyticsRequest(contractsByStatusRequest),
      analyticsService.executeAnalyticsRequest(activeWorkflowsRequest),
      analyticsService.executeAnalyticsRequest(pendingTasksRequest)
    ]);
    
    // Gabungkan hasil
    const summaryMetrics = {
      totalContracts: totalContracts.data[0]?.count_contracts_id || 0,
      contractsByStatus: contractsByStatus.data,
      activeWorkflows: activeWorkflows.data[0]?.count_workflows_id || 0,
      pendingTasks: pendingTasks.data[0]?.count_workflow_steps_id || 0,
      timePeriod
    };
    
    return new Response(JSON.stringify(summaryMetrics), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error: any) { // Menggunakan tipe any untuk error
    return new Response(JSON.stringify({ error: error.message || 'Failed to get summary metrics' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

// Mendapatkan dashboard
export async function getDashboard(request: RequestWithParams, env: Env): Promise<Response> {
  try {
    const { params } = request; // Sekarang params dikenali
    const id = params?.id;

    if (!id) {
      return new Response(JSON.stringify({ error: 'Dashboard ID is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    
    // Dapatkan dashboard dari database
    const { results } = await env.DB.prepare(
      `SELECT * FROM dashboards WHERE id = ?`
    )
    .bind(id)
    .all();
    
    if (results.length === 0) {
      return new Response(JSON.stringify({ error: 'Dashboard not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    
    const dashboard = results[0];
    
    // Dapatkan widget untuk dashboard
    const { results: widgetResults } = await env.DB.prepare(
      `SELECT * FROM dashboard_widgets WHERE dashboard_id = ? ORDER BY position_y, position_x`
    )
    .bind(id)
    .all();
    
    // Parse config dan position dari widget
    const widgets = widgetResults.map(widget => ({
      ...widget,
      config: JSON.parse(widget.config as string), // Type assertion untuk widget.config
      position: {
        x: widget.position_x,
        y: widget.position_y,
        width: widget.width,
        height: widget.height
      }
    }));
    
    // Gabungkan dashboard dengan widget
    const dashboardWithWidgets = {
      ...dashboard,
      widgets
    };
    
    return new Response(JSON.stringify(dashboardWithWidgets), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error: any) { // Menggunakan tipe any untuk error
    return new Response(JSON.stringify({ error: error.message || 'Failed to get dashboard' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

// Membuat dashboard baru
export async function createDashboard(request: RequestWithParams, env: Env): Promise<Response> {
  try {
    const user = request.user; // Memastikan user diambil dari request
    if (!user || !user.id) {
      return new Response(JSON.stringify({ error: 'User not authenticated' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    const { name, description, widgets: widgetData } = await request.json() as Dashboard; // Menggunakan tipe Dashboard
    
    // Validasi input
    if (!name) {
      return new Response(JSON.stringify({ error: 'Dashboard name is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    
    const id = generateId();
    const now = Date.now();
    
    // Simpan dashboard ke database
    await env.DB.prepare(
      `INSERT INTO dashboards (id, name, description, created_at, updated_at, created_by)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .bind(id, name, description || '', now, now, user.id) // Menggunakan user.id
    .run();

    // Simpan widget
    if (widgetData && widgetData.length > 0) {
      const widgetInserts = widgetData.map(widget => (
        env.DB.prepare(
          `INSERT INTO dashboard_widgets (id, dashboard_id, type, title, config, position_x, position_y, width, height, created_at, updated_at, created_by)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          generateId(), 
          id, 
          widget.type, 
          widget.title, 
          JSON.stringify(widget.config), 
          widget.position.x, 
          widget.position.y, 
          widget.position.width, 
          widget.position.height, 
          now, 
          now, 
          user.id // Menggunakan user.id
        )
      ));
      await Promise.all(widgetInserts.map(insert => insert.run()));
    }

    return new Response(JSON.stringify({ 
      id, 
      name, 
      description, 
      widgets: widgetData, 
      created_at: now, 
      updated_at: now, 
      created_by: user.id // Menggunakan user.id
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error: any) { // Menggunakan tipe any untuk error
    return new Response(JSON.stringify({ error: error.message || 'Failed to create dashboard' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

// Mendapatkan log audit
export async function getRiskAndComplianceAuditLogs(request: Request, env: Env): Promise<Response> {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const contractId = url.searchParams.get('contract_id');
    const userId = url.searchParams.get('user_id');

    let query = `SELECT * FROM audit_logs`;
    const bindings: any[] = [];
    const conditions: string[] = [];

    if (contractId) {
      conditions.push(`resource_type = 'contract' AND resource_id = ?`);
      bindings.push(contractId);
    }
    if (userId) {
      conditions.push(`user_id = ?`);
      bindings.push(userId);
    }
    }

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(' AND ');
    }

    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    bindings.push(limit, offset);

    const { results } = await env.DB.prepare(query).bind(...bindings).all();
    return new Response(JSON.stringify({ audit_logs: results, message: "Risk and compliance audit logs fetched" }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error: any) {
    console.error('Error fetching risk and compliance audit logs:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to fetch risk and compliance audit logs' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

// Analisis Risiko dan Kepatuhan - Mendapatkan Ringkasan Risiko
export async function getRiskSummary(request: Request, env: Env): Promise<Response> {
  try {
    // TODO: Implement actual risk analysis logic
    // This is a placeholder returning dummy data
    const riskSummary = {
      totalHighRiskContracts: 5,
      totalMediumRiskContracts: 15,
      totalLowRiskContracts: 80,
      complianceIssuesLastMonth: 10,
      averageRiskScore: 65
    };

    return new Response(JSON.stringify(riskSummary), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error: any) {
    console.error('Error fetching risk summary:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to fetch risk summary' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

// Analisis Risiko dan Kepatuhan - Mendapatkan Laporan Kepatuhan
export async function getComplianceReport(request: Request, env: Env): Promise<Response> {
  try {
    const url = new URL(request.url);
    const timePeriod = url.searchParams.get('time_period') || 'month';
    const complianceArea = url.searchParams.get('compliance_area'); // e.g., 'GDPR', 'HIPAA'

    // TODO: Implement actual compliance reporting logic
    // This is a placeholder returning dummy data
    const complianceData = [
      { area: 'GDPR', status: 'Compliant', issuesFound: 2, resolutionRate: '90%' },
      { area: 'HIPAA', status: 'Minor Issues', issuesFound: 5, resolutionRate: '75%' },
      { area: 'Internal Policies', status: 'Compliant', issuesFound: 1, resolutionRate: '100%' }
    ];

    if (complianceArea) {
      const filteredData = complianceData.filter(item => item.area === complianceArea);
      return new Response(JSON.stringify(filteredData), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    return new Response(JSON.stringify(complianceData), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error: any) {
    console.error('Error fetching compliance report:', error);
    return new Response(JSON.stringify({ error: error.message || 'Failed to fetch compliance report' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
