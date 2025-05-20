import { Env } from '../index';
import { corsHeaders } from '../utils/cors';
import { generateId } from '../utils/id';
import { AnalyticsService } from './service';
import { 
  AnalyticsRequest, 
  Dashboard, 
  DashboardWidget, 
  Report 
} from './types';

// Mengeksekusi permintaan analitik
export async function executeAnalytics(request: Request, env: Env): Promise<Response> {
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
  } catch (error) {
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
export async function getSummaryMetrics(request: Request, env: Env): Promise<Response> {
  try {
    const user = request.user;
    const url = new URL(request.url);
    const organizationId = url.searchParams.get('organization_id');
    const timePeriod = url.searchParams.get('time_period') || 'month';
    
    const analyticsService = new AnalyticsService(env);
    
    // Metrik total kontrak
    const totalContractsRequest: AnalyticsRequest = {
      metrics: [{ type: 'count', field: 'contracts.id' }],
      filters: organizationId ? [
        { field: 'contracts.organization_id', operator: 'eq', value: organizationId }
      ] : [],
      timePeriod: timePeriod as any
    };
    
    // Metrik kontrak berdasarkan status
    const contractsByStatusRequest: AnalyticsRequest = {
      metrics: [{ type: 'count', field: 'contracts.id' }],
      dimensions: [{ type: 'contract_status', field: 'contracts.status' }],
      filters: organizationId ? [
        { field: 'contracts.organization_id', operator: 'eq', value: organizationId }
      ] : [],
      timePeriod: timePeriod as any
    };
    
    // Metrik workflow aktif
    const activeWorkflowsRequest: AnalyticsRequest = {
      metrics: [{ type: 'count', field: 'workflows.id' }],
      filters: [
        { field: 'workflows.status', operator: 'eq', value: 'active' },
        ...(organizationId ? [{ field: 'contracts.organization_id', operator: 'eq', value: organizationId }] : [])
      ],
      timePeriod: timePeriod as any
    };
    
    // Metrik tugas yang menunggu
    const pendingTasksRequest: AnalyticsRequest = {
      metrics: [{ type: 'count', field: 'workflow_steps.id' }],
      filters: [
        { field: 'workflow_steps.status', operator: 'eq', value: 'pending' },
        ...(organizationId ? [{ field: 'contracts.organization_id', operator: 'eq', value: organizationId }] : [])
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
  } catch (error) {
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
export async function getDashboard(request: Request, env: Env): Promise<Response> {
  try {
    const { params } = request;
    const id = params.id;
    
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
      config: JSON.parse(widget.config),
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
  } catch (error) {
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
export async function createDashboard(request: Request, env: Env): Promise<Response> {
  try {
    const user = request.user;
    const { name, description, widgets } = await request.json();
    
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
    .bind(id, name, description || '', now, now, user.id)
    .run();
    
    // Simpan widget jika ada
    if (widgets && widgets.length > 0) {
      for (const widget of widgets) {
        const widgetId = generateId();
        
        await env.DB.prepare(
          `INSERT INTO dashboard_widgets (
            id, dashboard_id, type, title, config, position_x, position_y, width, height, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          widgetId,
          id,
          widget.type,
          widget.title,
          JSON.stringify(widget.config),
          widget.position.x,
          widget.position.y,
          widget.position.width,
          widget.position.height,
          now
        )
        .run();
      }
    }
    
    // Buat respons
    const dashboard: Dashboard = {
      id,
      name,
      description,
      widgets: widgets || [],
      created_at: now,
      updated_at: now,
      created_by: user.id
    };
    
    return new Response(JSON.stringify(dashboard), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Failed to create dashboard' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
