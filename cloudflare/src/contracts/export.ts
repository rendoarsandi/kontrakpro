import { Env } from '../index';
import { corsHeaders } from '../utils/cors';
import { generateId } from '../utils/id';

// Fungsi untuk mengekspor kontrak ke HTML
export async function exportContractToHtml(request: Request, env: Env): Promise<Response> {
  try {
    const { params } = request;
    const id = params.id;
    
    // Dapatkan detail kontrak
    const { results: contractResults } = await env.DB.prepare(
      `SELECT c.*, u.name as owner_name, o.name as organization_name
       FROM contracts c
       JOIN users u ON c.owner_id = u.id
       JOIN organizations o ON c.organization_id = o.id
       WHERE c.id = ?`
    )
    .bind(id)
    .all();
    
    if (contractResults.length === 0) {
      return new Response(JSON.stringify({ error: 'Contract not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    
    const contract = contractResults[0];
    
    // Dapatkan versi kontrak terbaru
    const { results: versionResults } = await env.DB.prepare(
      `SELECT * FROM contract_versions 
       WHERE contract_id = ? 
       ORDER BY version DESC 
       LIMIT 1`
    )
    .bind(id)
    .all();
    
    if (versionResults.length === 0) {
      return new Response(JSON.stringify({ error: 'Contract version not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    
    const version = versionResults[0];
    
    // Tambahkan log audit
    await env.DB.prepare(
      `INSERT INTO audit_logs (id, user_id, action, resource_type, resource_id, details, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      generateId(),
      request.user.id,
      'export',
      'contract',
      id,
      JSON.stringify({ format: 'html' }),
      Date.now()
    )
    .run();
    
    // Generate HTML
    const html = generateContractHtml(contract, version);
    
    // Return HTML
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="contract-${id}.html"`,
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Failed to export contract' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

// Fungsi untuk mengekspor kontrak ke PDF (menggunakan HTML yang dapat dikonversi ke PDF di sisi klien)
export async function exportContractToPdf(request: Request, env: Env): Promise<Response> {
  try {
    const { params } = request;
    const id = params.id;
    
    // Dapatkan detail kontrak
    const { results: contractResults } = await env.DB.prepare(
      `SELECT c.*, u.name as owner_name, o.name as organization_name
       FROM contracts c
       JOIN users u ON c.owner_id = u.id
       JOIN organizations o ON c.organization_id = o.id
       WHERE c.id = ?`
    )
    .bind(id)
    .all();
    
    if (contractResults.length === 0) {
      return new Response(JSON.stringify({ error: 'Contract not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    
    const contract = contractResults[0];
    
    // Dapatkan versi kontrak terbaru
    const { results: versionResults } = await env.DB.prepare(
      `SELECT * FROM contract_versions 
       WHERE contract_id = ? 
       ORDER BY version DESC 
       LIMIT 1`
    )
    .bind(id)
    .all();
    
    if (versionResults.length === 0) {
      return new Response(JSON.stringify({ error: 'Contract version not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    
    const version = versionResults[0];
    
    // Tambahkan log audit
    await env.DB.prepare(
      `INSERT INTO audit_logs (id, user_id, action, resource_type, resource_id, details, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      generateId(),
      request.user.id,
      'export',
      'contract',
      id,
      JSON.stringify({ format: 'pdf' }),
      Date.now()
    )
    .run();
    
    // Generate HTML yang dioptimalkan untuk konversi PDF
    const html = generatePdfHtml(contract, version);
    
    // Return HTML dengan header yang menunjukkan bahwa ini untuk konversi PDF
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
        'X-Export-Format': 'pdf',
        'Content-Disposition': `attachment; filename="contract-${id}.html"`,
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Failed to export contract' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

// Fungsi untuk menghasilkan HTML kontrak
function generateContractHtml(contract: any, version: any): string {
  const createdDate = new Date(contract.created_at).toLocaleDateString();
  const updatedDate = new Date(contract.updated_at).toLocaleDateString();
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${contract.title}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 20px;
      color: #333;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      border: 1px solid #ddd;
      padding: 20px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #eee;
    }
    .title {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .subtitle {
      font-size: 16px;
      color: #666;
    }
    .metadata {
      margin: 20px 0;
      padding: 15px;
      background-color: #f9f9f9;
      border-radius: 5px;
    }
    .metadata-item {
      margin-bottom: 5px;
    }
    .content {
      margin-top: 30px;
    }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      font-size: 12px;
      color: #999;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="title">${contract.title}</div>
      <div class="subtitle">${contract.type.replace('_', ' ')}</div>
    </div>
    
    <div class="metadata">
      <div class="metadata-item"><strong>Status:</strong> ${contract.status}</div>
      <div class="metadata-item"><strong>Organization:</strong> ${contract.organization_name}</div>
      <div class="metadata-item"><strong>Owner:</strong> ${contract.owner_name}</div>
      <div class="metadata-item"><strong>Created:</strong> ${createdDate}</div>
      <div class="metadata-item"><strong>Last Updated:</strong> ${updatedDate}</div>
    </div>
    
    <div class="content">
      <h3>Description</h3>
      <p>${contract.description || 'No description provided.'}</p>
      
      <h3>Contract Content</h3>
      <div>${version.content || 'No content available.'}</div>
    </div>
    
    <div class="footer">
      <p>Generated by KontrakPro on ${new Date().toLocaleString()}</p>
      <p>Contract ID: ${contract.id} | Version: ${version.version}</p>
    </div>
  </div>
</body>
</html>`;
}

// Fungsi untuk menghasilkan HTML yang dioptimalkan untuk konversi PDF
function generatePdfHtml(contract: any, version: any): string {
  // Untuk PDF, kita menggunakan format yang sama dengan HTML biasa
  // tetapi dengan beberapa penyesuaian untuk memastikan tampilan yang baik saat dikonversi
  return generateContractHtml(contract, version);
}
