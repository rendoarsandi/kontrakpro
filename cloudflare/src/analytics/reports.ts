import { Env } from '../index';
import { corsHeaders } from '../utils/cors';
import { generateId } from '../utils/id';
import { AnalyticsService } from './service';
import { Report } from './types';

// Mendapatkan daftar laporan
export async function getReports(request: Request, env: Env): Promise<Response> {
  try {
    const user = request.user;
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    
    // Dapatkan laporan dari database
    const { results } = await env.DB.prepare(
      `SELECT * FROM reports 
       WHERE created_by = ? 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`
    )
    .bind(user.id, limit, offset)
    .all();
    
    // Parse request dan schedule dari laporan
    const reports = results.map(report => ({
      ...report,
      request: JSON.parse(report.request),
      schedule: report.schedule ? JSON.parse(report.schedule) : null
    }));
    
    return new Response(JSON.stringify({ reports }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Failed to get reports' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

// Mendapatkan laporan berdasarkan ID
export async function getReport(request: Request, env: Env): Promise<Response> {
  try {
    const { params } = request;
    const id = params.id;
    const user = request.user;
    
    // Dapatkan laporan dari database
    const { results } = await env.DB.prepare(
      `SELECT * FROM reports WHERE id = ? AND created_by = ?`
    )
    .bind(id, user.id)
    .all();
    
    if (results.length === 0) {
      return new Response(JSON.stringify({ error: 'Report not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    
    // Parse request dan schedule dari laporan
    const report = {
      ...results[0],
      request: JSON.parse(results[0].request),
      schedule: results[0].schedule ? JSON.parse(results[0].schedule) : null
    };
    
    return new Response(JSON.stringify(report), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Failed to get report' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

// Membuat laporan baru
export async function createReport(request: Request, env: Env): Promise<Response> {
  try {
    const user = request.user;
    const { name, description, request: analyticsRequest, format, schedule } = await request.json();
    
    // Validasi input
    if (!name || !analyticsRequest || !format) {
      return new Response(JSON.stringify({ error: 'Name, request, and format are required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    
    const id = generateId();
    const now = Date.now();
    
    // Simpan laporan ke database
    await env.DB.prepare(
      `INSERT INTO reports (id, name, description, request, format, schedule, created_at, updated_at, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      id,
      name,
      description || '',
      JSON.stringify(analyticsRequest),
      format,
      schedule ? JSON.stringify(schedule) : null,
      now,
      now,
      user.id
    )
    .run();
    
    // Buat respons
    const report: Report = {
      id,
      name,
      description,
      request: analyticsRequest,
      format,
      schedule,
      created_at: now,
      updated_at: now,
      created_by: user.id
    };
    
    return new Response(JSON.stringify(report), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Failed to create report' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

// Menghasilkan laporan
export async function generateReport(request: Request, env: Env): Promise<Response> {
  try {
    const { params } = request;
    const id = params.id;
    const user = request.user;
    const url = new URL(request.url);
    const format = url.searchParams.get('format');
    
    // Dapatkan laporan dari database
    const { results } = await env.DB.prepare(
      `SELECT * FROM reports WHERE id = ? AND created_by = ?`
    )
    .bind(id, user.id)
    .all();
    
    if (results.length === 0) {
      return new Response(JSON.stringify({ error: 'Report not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    
    const report = results[0];
    const analyticsRequest = JSON.parse(report.request);
    const outputFormat = format || report.format;
    
    // Eksekusi permintaan analitik
    const analyticsService = new AnalyticsService(env);
    const result = await analyticsService.executeAnalyticsRequest(analyticsRequest);
    
    // Format output berdasarkan format yang diminta
    if (outputFormat === 'json') {
      return new Response(JSON.stringify(result), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    } else if (outputFormat === 'csv') {
      // Buat CSV dari data
      const headers = Object.keys(result.data[0] || {}).join(',');
      const rows = result.data.map(row => Object.values(row).join(',')).join('\n');
      const csv = `${headers}\n${rows}`;
      
      return new Response(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${report.name.replace(/\s+/g, '_')}.csv"`,
          ...corsHeaders
        }
      });
    } else {
      // Format lain (HTML, PDF) akan diimplementasikan nanti
      return new Response(JSON.stringify({ error: `Format ${outputFormat} not yet supported` }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Failed to generate report' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
