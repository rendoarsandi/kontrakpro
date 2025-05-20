import { Router } from 'itty-router';
import { createContract, getContract, listContracts, updateContract, deleteContract } from './contracts/handlers';
import { exportContractToHtml, exportContractToPdf } from './contracts/export';
import { login, signup, refreshToken, logout } from './auth/handlers';
import { uploadDocument, downloadDocument, listDocuments, deleteDocument } from './documents/handlers';
import { createWorkflow, getWorkflow, updateWorkflowStep, getUserTasks } from './workflows/handlers';
import { getUserNotifications, markNotificationAsRead, createReminder, getUserReminders } from './notifications/handlers';
import { authenticate } from './auth/middleware';
import { corsHeaders } from './utils/cors';

// Definisi tipe Env untuk Cloudflare Worker
export interface Env {
  DB: D1Database;
  SESSIONS: KVNamespace;
  SETTINGS: KVNamespace;
  DOCUMENTS: R2Bucket;
}

// Tambahkan properti user ke Request
declare global {
  interface Request {
    user?: any;
  }
}

// Buat router
const router = Router();

// Middleware CORS untuk preflight requests
router.options('*', (request: Request) => {
  return new Response(null, {
    headers: corsHeaders
  });
});

// Endpoint autentikasi (tidak memerlukan autentikasi)
router.post('/api/auth/login', login);
router.post('/api/auth/signup', signup);
router.post('/api/auth/refresh', refreshToken);
router.post('/api/auth/logout', logout);

// Middleware autentikasi untuk endpoint yang dilindungi
router.all('/api/*', authenticate);

// Endpoint kontrak
router.get('/api/contracts', listContracts);
router.post('/api/contracts', createContract);
router.get('/api/contracts/:id', getContract);
router.put('/api/contracts/:id', updateContract);
router.delete('/api/contracts/:id', deleteContract);
router.get('/api/contracts/:id/export/html', exportContractToHtml);
router.get('/api/contracts/:id/export/pdf', exportContractToPdf);

// Endpoint dokumen
router.post('/api/documents/upload', uploadDocument);
router.get('/api/documents', listDocuments);
router.get('/api/documents/:id', downloadDocument);
router.delete('/api/documents/:id', deleteDocument);

// Endpoint workflow
router.post('/api/workflows', createWorkflow);
router.get('/api/workflows/:id', getWorkflow);
router.put('/api/workflow-steps/:id', updateWorkflowStep);
router.get('/api/user/tasks', getUserTasks);

// Handler untuk permintaan yang tidak cocok
router.all('*', () => new Response('Not Found', { status: 404 }));

// Fungsi fetch untuk Cloudflare Worker
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      // Handle request dengan router
      const response = await router.handle(request, env, ctx);

      // Tambahkan CORS headers ke semua response
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          ...Object.fromEntries(response.headers.entries()),
          ...corsHeaders
        }
      });
    } catch (error) {
      // Handle error
      return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  }
};
