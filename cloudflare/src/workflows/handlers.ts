import { Env } from '../index';
import { generateId } from '../utils/id';
import { corsHeaders } from '../utils/cors';

// Fungsi untuk membuat workflow baru
export async function createWorkflow(request: Request, env: Env): Promise<Response> {
  try {
    const { contract_id, steps } = await request.json();
    
    // Validasi input
    if (!contract_id || !steps || !Array.isArray(steps) || steps.length === 0) {
      return new Response(JSON.stringify({ error: 'Contract ID and steps are required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    
    // Dapatkan user ID dari session
    const user = request.user;
    
    // Verifikasi bahwa kontrak ada
    const { results: contractResults } = await env.DB.prepare(
      `SELECT * FROM contracts WHERE id = ?`
    )
    .bind(contract_id)
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
    
    // Verifikasi bahwa kontrak belum memiliki workflow
    const { results: workflowResults } = await env.DB.prepare(
      `SELECT * FROM workflows WHERE contract_id = ?`
    )
    .bind(contract_id)
    .all();
    
    if (workflowResults.length > 0) {
      return new Response(JSON.stringify({ error: 'Contract already has a workflow' }), {
        status: 409,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    
    const workflowId = generateId();
    const now = Date.now();
    
    // Buat workflow baru
    await env.DB.prepare(
      `INSERT INTO workflows (id, contract_id, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?)`
    )
    .bind(workflowId, contract_id, 'pending', now, now)
    .run();
    
    // Buat langkah-langkah workflow
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const stepId = generateId();
      
      await env.DB.prepare(
        `INSERT INTO workflow_steps (id, workflow_id, step_number, type, status, assignee_id, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        stepId,
        workflowId,
        i + 1,
        step.type,
        'pending',
        step.assignee_id || null,
        now
      )
      .run();
    }
    
    // Update status kontrak
    await env.DB.prepare(
      `UPDATE contracts SET status = ?, updated_at = ? WHERE id = ?`
    )
    .bind('pending_approval', now, contract_id)
    .run();
    
    // Tambahkan log audit
    await env.DB.prepare(
      `INSERT INTO audit_logs (id, user_id, action, resource_type, resource_id, details, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      generateId(),
      user.id,
      'create',
      'workflow',
      workflowId,
      JSON.stringify({ contract_id, steps_count: steps.length }),
      now
    )
    .run();
    
    // Dapatkan workflow yang baru dibuat dengan langkah-langkahnya
    const { results: newWorkflow } = await env.DB.prepare(
      `SELECT * FROM workflows WHERE id = ?`
    )
    .bind(workflowId)
    .all();
    
    const { results: newSteps } = await env.DB.prepare(
      `SELECT ws.*, u.name as assignee_name
       FROM workflow_steps ws
       LEFT JOIN users u ON ws.assignee_id = u.id
       WHERE ws.workflow_id = ?
       ORDER BY ws.step_number ASC`
    )
    .bind(workflowId)
    .all();
    
    return new Response(JSON.stringify({
      workflow: newWorkflow[0],
      steps: newSteps
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Failed to create workflow' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

// Fungsi untuk mendapatkan detail workflow
export async function getWorkflow(request: Request, env: Env): Promise<Response> {
  try {
    const { params } = request;
    const id = params.id;
    
    // Dapatkan detail workflow
    const { results: workflowResults } = await env.DB.prepare(
      `SELECT * FROM workflows WHERE id = ?`
    )
    .bind(id)
    .all();
    
    if (workflowResults.length === 0) {
      return new Response(JSON.stringify({ error: 'Workflow not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    
    const workflow = workflowResults[0];
    
    // Dapatkan langkah-langkah workflow
    const { results: steps } = await env.DB.prepare(
      `SELECT ws.*, u.name as assignee_name
       FROM workflow_steps ws
       LEFT JOIN users u ON ws.assignee_id = u.id
       WHERE ws.workflow_id = ?
       ORDER BY ws.step_number ASC`
    )
    .bind(id)
    .all();
    
    return new Response(JSON.stringify({
      workflow,
      steps
    }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Failed to get workflow' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

// Fungsi untuk memperbarui status langkah workflow
export async function updateWorkflowStep(request: Request, env: Env): Promise<Response> {
  try {
    const { params } = request;
    const stepId = params.id;
    const { status, comment } = await request.json();
    
    // Validasi input
    if (!status) {
      return new Response(JSON.stringify({ error: 'Status is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    
    // Dapatkan user ID dari session
    const user = request.user;
    
    // Verifikasi bahwa langkah workflow ada
    const { results: stepResults } = await env.DB.prepare(
      `SELECT ws.*, w.contract_id, w.status as workflow_status
       FROM workflow_steps ws
       JOIN workflows w ON ws.workflow_id = w.id
       WHERE ws.id = ?`
    )
    .bind(stepId)
    .all();
    
    if (stepResults.length === 0) {
      return new Response(JSON.stringify({ error: 'Workflow step not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    
    const step = stepResults[0];
    const now = Date.now();
    
    // Verifikasi bahwa pengguna adalah assignee dari langkah ini
    if (step.assignee_id && step.assignee_id !== user.id) {
      return new Response(JSON.stringify({ error: 'You are not authorized to update this step' }), {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    
    // Update status langkah workflow
    await env.DB.prepare(
      `UPDATE workflow_steps 
       SET status = ?, completed_at = ? 
       WHERE id = ?`
    )
    .bind(status, status === 'completed' ? now : null, stepId)
    .run();
    
    // Jika ada komentar, tambahkan ke tabel comments
    if (comment) {
      await env.DB.prepare(
        `INSERT INTO comments (id, contract_id, user_id, content, created_at)
         VALUES (?, ?, ?, ?, ?)`
      )
      .bind(generateId(), step.contract_id, user.id, comment, now)
      .run();
    }
    
    // Periksa apakah semua langkah sudah selesai
    const { results: allSteps } = await env.DB.prepare(
      `SELECT * FROM workflow_steps WHERE workflow_id = ?`
    )
    .bind(step.workflow_id)
    .all();
    
    const allCompleted = allSteps.every(s => s.status === 'completed' || s.id === stepId && status === 'completed');
    
    // Jika semua langkah sudah selesai, update status workflow dan kontrak
    if (allCompleted) {
      await env.DB.prepare(
        `UPDATE workflows SET status = ?, updated_at = ? WHERE id = ?`
      )
      .bind('completed', now, step.workflow_id)
      .run();
      
      await env.DB.prepare(
        `UPDATE contracts SET status = ?, updated_at = ? WHERE id = ?`
      )
      .bind('approved', now, step.contract_id)
      .run();
    }
    
    // Tambahkan log audit
    await env.DB.prepare(
      `INSERT INTO audit_logs (id, user_id, action, resource_type, resource_id, details, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      generateId(),
      user.id,
      'update',
      'workflow_step',
      stepId,
      JSON.stringify({ status, has_comment: !!comment }),
      now
    )
    .run();
    
    // Dapatkan langkah yang diperbarui
    const { results: updatedStep } = await env.DB.prepare(
      `SELECT ws.*, u.name as assignee_name
       FROM workflow_steps ws
       LEFT JOIN users u ON ws.assignee_id = u.id
       WHERE ws.id = ?`
    )
    .bind(stepId)
    .all();
    
    return new Response(JSON.stringify(updatedStep[0]), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Failed to update workflow step' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

// Fungsi untuk mendapatkan daftar tugas workflow untuk pengguna
export async function getUserTasks(request: Request, env: Env): Promise<Response> {
  try {
    // Dapatkan user ID dari session
    const user = request.user;
    
    // Dapatkan daftar tugas yang ditugaskan ke pengguna
    const { results } = await env.DB.prepare(
      `SELECT ws.*, w.contract_id, c.title as contract_title, c.status as contract_status
       FROM workflow_steps ws
       JOIN workflows w ON ws.workflow_id = w.id
       JOIN contracts c ON w.contract_id = c.id
       WHERE ws.assignee_id = ? AND ws.status = 'pending'
       ORDER BY ws.created_at DESC`
    )
    .bind(user.id)
    .all();
    
    return new Response(JSON.stringify({ tasks: results }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Failed to get user tasks' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}
