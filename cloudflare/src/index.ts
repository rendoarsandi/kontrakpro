import { Router } from 'itty-router';
import { createContract, getContract, listContracts, updateContract, deleteContract } from './contracts/handlers';
import { exportContractToHtml, exportContractToPdf } from './contracts/export';
import { login, signup, refreshToken, logout } from './auth/handlers';
import { uploadDocument, downloadDocument, listDocuments, deleteDocument } from './documents/handlers';
import { createWorkflow, getWorkflow, updateWorkflowStep, getUserTasks } from './workflows/handlers';
import { getUserNotifications, markNotificationAsRead, createReminder, getUserReminders } from './notifications/handlers';
import { 
  executeAnalytics, 
  getSummaryMetrics, 
  getDashboard, 
  createDashboard,
  getRiskAndComplianceAuditLogs // Import handler baru
} from './analytics/handlers';
import { getReports, getReport, createReport, generateReport } from './analytics/reports';
import {
  createSignatureRequestHandler,
  getSignatureRequestHandler,
  addSignerToRequestHandler,
  updateSignerStatusHandler
} from './e-signature/handlers';
import {
  configureCrmIntegrationHandler,
  getCrmIntegrationHandler,
  syncCrmDataHandler,
  triggerWorkflowFromCrmEventHandler // Import handler baru
} from './crm/handlers';
import {
  analyzeContractRiskHandler,
  extractContractClausesHandler,
  getContractLanguageRecommendationsHandler,
  detectAnomalyHandler // Import handler baru
} from './ai/handlers';
import { addCommentHandler, getCommentsHandler } from './collaboration/handlers'; // Import handler kolaborasi
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

// Endpoint notifikasi
router.get('/api/notifications', getUserNotifications);
router.put('/api/notifications/:id/read', markNotificationAsRead);
router.post('/api/reminders', createReminder);
router.get('/api/reminders', getUserReminders);

// Endpoint analitik
router.post('/api/analytics/execute', executeAnalytics);
router.get('/api/analytics/summary', getSummaryMetrics);
router.get('/api/dashboards/:id', getDashboard);
router.post('/api/dashboards', createDashboard);
router.get('/api/reports', getReports);
router.get('/api/reports/:id', getReport);
router.post('/api/reports', createReport);
router.get('/api/reports/:id/generate', generateReport);
router.get('/api/analytics/audit-logs/risk-compliance', getRiskAndComplianceAuditLogs);

// Endpoint E-Signature
router.post('/api/e-signatures/requests', createSignatureRequestHandler);
router.get('/api/e-signatures/requests/:id', getSignatureRequestHandler);
router.post('/api/e-signatures/requests/:id/signers', addSignerToRequestHandler);
router.put('/api/e-signatures/requests/:id/signers/:signerId', updateSignerStatusHandler); // Route baru

// Endpoint CRM Integration
router.post('/api/crm/integrations', configureCrmIntegrationHandler);
router.get('/api/crm/integrations', getCrmIntegrationHandler);
router.post('/api/crm/sync', syncCrmDataHandler);
router.post('/api/crm/event-webhook', triggerWorkflowFromCrmEventHandler); // Route baru untuk webhook CRM

// Endpoint AI Analysis
router.post('/api/ai/analyze-risk', analyzeContractRiskHandler);
router.post('/api/ai/extract-clauses', extractContractClausesHandler);
router.post('/api/ai/language-recommendations', getContractLanguageRecommendationsHandler);
router.post('/api/ai/detect-anomalies', detectAnomalyHandler); // Route baru

// Endpoint Collaboration
router.post('/api/comments', addCommentHandler); // Route baru
router.get('/api/comments', getCommentsHandler);    // Route baru

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
    } catch (error: any) { // Tambahkan tipe any pada error
      console.error("Unhandled error:", error);
      // Pastikan response error juga memiliki CORS headers
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
