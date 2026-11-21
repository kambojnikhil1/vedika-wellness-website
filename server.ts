import 'dotenv/config';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';

const PORT = Number(process.env.PORT || 3000);
const IS_PROD = process.env.NODE_ENV === 'production';
const ROOT_DIR = process.cwd();
const DATA_DIR = path.resolve(ROOT_DIR, 'data');
const STORE_PATH = path.resolve(DATA_DIR, 'vedika-store.json');

const TARGET_EMAIL = 'vedikawellness01@gmail.com';
const TARGET_COACH_PHONE = '+91 81939 89452';

interface PageViewRecord {
  id: string;
  visitorId: string;
  page: string;
  title: string;
  lang: string;
  theme: string;
  referrer: string;
  timestamp: string;
}

interface LeadRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  goal: string;
  source: string;
  mode: string;
  message: string;
  metricsSummary: string;
  status: 'New' | 'Contacted' | 'Demo Scheduled' | 'Enrolled' | 'Archived';
  notes: string;
  notificationLog: string[];
  createdAt: string;
}

interface AdminCredential {
  salt: string;
  hash: string;
  claimedAt: string;
}

interface StoreData {
  admin: AdminCredential | null;
  pageViews: PageViewRecord[];
  leads: LeadRecord[];
}

const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readStore(): StoreData {
  ensureDataDir();
  if (!STORE_PATH.startsWith(DATA_DIR + path.sep)) {
    throw new Error('Invalid store path');
  }
  if (!fs.existsSync(STORE_PATH)) {
    const empty: StoreData = { admin: null, pageViews: [], leads: [] };
    writeStore(empty);
    return empty;
  }
  try {
    const raw = fs.readFileSync(STORE_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<StoreData>;
    return {
      admin: parsed.admin ?? null,
      pageViews: Array.isArray(parsed.pageViews) ? parsed.pageViews : [],
      leads: Array.isArray(parsed.leads) ? parsed.leads : [],
    };
  } catch {
    return { admin: null, pageViews: [], leads: [] };
  }
}

function writeStore(data: StoreData): void {
  ensureDataDir();
  const tempPath = path.resolve(DATA_DIR, `vedika-store.${crypto.randomBytes(6).toString('hex')}.tmp`);
  if (!tempPath.startsWith(DATA_DIR + path.sep)) {
    throw new Error('Invalid temp store path');
  }
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tempPath, STORE_PATH);
}

function hashPassword(password: string, salt?: string): { salt: string; hash: string } {
  const actualSalt = salt || crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, actualSalt, 64).toString('hex');
  return { salt: actualSalt, hash: derived };
}

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf-8');
  const bufB = Buffer.from(b, 'utf-8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function signSessionToken(): string {
  const payload = JSON.stringify({
    role: 'admin',
    iat: Date.now(),
    exp: Date.now() + 12 * 60 * 60 * 1000,
    nonce: crypto.randomBytes(8).toString('hex'),
  });
  const encoded = Buffer.from(payload, 'utf-8').toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(encoded).digest('base64url');
  return `${encoded}.${sig}`;
}

function verifySessionToken(token: string): boolean {
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [encoded, sig] = parts;
  const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(encoded).digest('base64url');
  if (!safeCompare(sig, expectedSig)) return false;
  try {
    const parsed = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf-8')) as {
      role?: string;
      exp?: number;
    };
    return parsed.role === 'admin' && typeof parsed.exp === 'number' && parsed.exp > Date.now();
  } catch {
    return false;
  }
}

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  const token = auth.slice(7).trim();
  if (!verifySessionToken(token)) {
    res.status(401).json({ error: 'Session expired or invalid' });
    return;
  }
  next();
}

function sanitizeText(val: unknown, maxLen = 300): string {
  if (typeof val !== 'string') return '';
  return val.replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, maxLen);
}

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function isSafeWebhookUrl(rawUrl: string): boolean {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== 'https:') return false;
    const host = parsed.hostname.toLowerCase();
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '0.0.0.0' ||
      host === '::1' ||
      host === '169.254.169.254' ||
      host.startsWith('10.') ||
      host.startsWith('192.168.') ||
      /^172\.(1[6-9]|2\d|3[0-1])\./.test(host) ||
      host.endsWith('.local')
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

async function dispatchLeadNotifications(lead: LeadRecord): Promise<string[]> {
  const logs: string[] = [];
  const plainBody = [
    'New Lead — Vedika Health and Wellness',
    `Name: ${lead.name || 'Not given'}`,
    `Phone: ${lead.phone || 'Not given'}`,
    `Email: ${lead.email || 'Not given'}`,
    `Goal: ${lead.goal || 'General Wellness'}`,
    `Source: ${lead.source}`,
    lead.mode ? `Mode: ${lead.mode}` : '',
    lead.metricsSummary ? `Health Check: ${lead.metricsSummary}` : '',
    lead.message ? `Message: ${lead.message}` : '',
    `Time: ${lead.createdAt}`,
  ]
    .filter(Boolean)
    .join('\n');

  // 1. Optional Email dispatch via Resend API to vedikawellness01@gmail.com
  const resendKey = process.env.RESEND_API_KEY?.trim();
  if (resendKey) {
    try {
      const fromEmail = process.env.RESEND_FROM_EMAIL?.trim() || 'Vedika Wellness <onboarding@resend.dev>';
      const resp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [TARGET_EMAIL],
          subject: `New Wellness Lead: ${lead.name || lead.phone || lead.email}`,
          text: plainBody,
        }),
      });
      if (resp.ok) {
        logs.push(`Email sent to ${TARGET_EMAIL}`);
      } else {
        logs.push(`Email delivery failed (HTTP ${resp.status})`);
      }
    } catch {
      logs.push('Email delivery error (network)');
    }
  } else {
    logs.push(`Email queued in dashboard (configure RESEND_API_KEY to auto-email ${TARGET_EMAIL})`);
  }

  // 2. Optional Telegram Bot dispatch (coach +91 81939 89452)
  const tgToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const tgChat = process.env.TELEGRAM_CHAT_ID?.trim();
  if (tgToken && tgChat) {
    try {
      const resp = await fetch(`https://api.telegram.org/bot${encodeURIComponent(tgToken)}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: tgChat,
          text: plainBody,
        }),
      });
      if (resp.ok) {
        logs.push(`Telegram alert sent (${TARGET_COACH_PHONE})`);
      } else {
        logs.push(`Telegram delivery failed (HTTP ${resp.status})`);
      }
    } catch {
      logs.push('Telegram delivery error (network)');
    }
  } else {
    logs.push(`Telegram/WhatsApp ready in dashboard (configure TELEGRAM_BOT_TOKEN for auto-push)`);
  }

  // 3. Optional HTTPS Webhook (e.g., WhatsApp Business Cloud / Make / Zapier)
  const webhookUrl = process.env.LEAD_WEBHOOK_URL?.trim();
  if (webhookUrl && isSafeWebhookUrl(webhookUrl)) {
    try {
      const resp = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetEmail: TARGET_EMAIL,
          targetPhone: TARGET_COACH_PHONE,
          lead,
        }),
      });
      if (resp.ok) {
        logs.push('Webhook notification sent');
      } else {
        logs.push(`Webhook failed (HTTP ${resp.status})`);
      }
    } catch {
      logs.push('Webhook delivery error');
    }
  }

  return logs;
}

function escapeCsvCell(value: string): string {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

async function createServer() {
  const app = express();
  app.use(express.json({ limit: '100kb' }));

  // Simple in-memory rate limit map for lead submissions
  const leadRateMap = new Map<string, { count: number; resetAt: number }>();

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  // Track visitor page views
  app.post('/api/analytics/pageview', (req, res) => {
    const page = sanitizeText(req.body?.page, 120) || '/';
    const title = sanitizeText(req.body?.title, 160) || 'Home';
    const lang = req.body?.lang === 'hi' ? 'hi' : 'en';
    const theme = req.body?.theme === 'dark' ? 'dark' : 'light';
    const referrer = sanitizeText(req.body?.referrer, 200);
    const clientVisitorId = sanitizeText(req.body?.visitorId, 64);

    // Avoid tracking /admin internal views as customer visits
    if (page.startsWith('/admin')) {
      res.json({ recorded: false });
      return;
    }

    const visitorId =
      clientVisitorId ||
      crypto
        .createHash('sha256')
        .update(`${req.ip || 'anon'}:${req.headers['user-agent'] || ''}`)
        .digest('hex')
        .slice(0, 16);

    const store = readStore();
    store.pageViews.push({
      id: crypto.randomUUID(),
      visitorId,
      page,
      title,
      lang,
      theme,
      referrer,
      timestamp: new Date().toISOString(),
    });
    // Keep latest 5000 page views for speed & small disk footprint
    if (store.pageViews.length > 5000) {
      store.pageViews = store.pageViews.slice(-5000);
    }
    writeStore(store);
    res.json({ recorded: true });
  });

  // Submit lead — ONLY records and notifies if phone number OR email is provided
  app.post('/api/leads', async (req, res) => {
    const ipKey = req.ip || 'global';
    const now = Date.now();
    const bucket = leadRateMap.get(ipKey);
    if (bucket && bucket.resetAt > now) {
      if (bucket.count >= 25) {
        res.status(429).json({ error: 'Too many requests. Please wait a minute and try again.' });
        return;
      }
      bucket.count += 1;
    } else {
      leadRateMap.set(ipKey, { count: 1, resetAt: now + 60_000 });
    }

    const name = sanitizeText(req.body?.name, 100);
    const phone = sanitizeText(req.body?.phone, 32);
    const email = sanitizeText(req.body?.email, 120);
    const goal = sanitizeText(req.body?.goal, 120) || 'General Wellness';
    const source = sanitizeText(req.body?.source, 80) || 'Website Form';
    const mode = sanitizeText(req.body?.mode, 40) || 'Online';
    const message = sanitizeText(req.body?.message, 600);
    const metricsSummary = sanitizeText(req.body?.metricsSummary, 400);

    const hasPhone = phone.length > 0 && isValidPhone(phone);
    const hasEmail = email.length > 0 && isValidEmail(email);

    // Strict adherence to user requirement: do NOT send/save if neither phone nor email is present
    if (!hasPhone && !hasEmail) {
      res.status(400).json({
        accepted: false,
        notified: false,
        error: 'Please enter a valid phone number or email address so our coach can reach you.',
      });
      return;
    }

    const newLead: LeadRecord = {
      id: crypto.randomUUID(),
      name,
      phone: hasPhone ? phone : '',
      email: hasEmail ? email : '',
      goal,
      source,
      mode,
      message,
      metricsSummary,
      status: 'New',
      notes: '',
      notificationLog: [],
      createdAt: new Date().toISOString(),
    };

    newLead.notificationLog = await dispatchLeadNotifications(newLead);

    const store = readStore();
    store.leads.unshift(newLead);
    if (store.leads.length > 2000) {
      store.leads = store.leads.slice(0, 2000);
    }
    writeStore(store);

    res.status(201).json({
      accepted: true,
      notified: true,
      id: newLead.id,
      notificationLog: newLead.notificationLog,
    });
  });

  // Admin auth status
  app.get('/api/admin/auth-status', (_req, res) => {
    const envPasscode = process.env.ADMIN_PASSCODE?.trim();
    const store = readStore();
    if (envPasscode) {
      res.json({ mode: 'env', setupRequired: false });
      return;
    }
    if (store.admin) {
      res.json({ mode: 'claimed', setupRequired: false });
      return;
    }
    res.json({ mode: 'unclaimed', setupRequired: true });
  });

  // One-time first-run admin setup (locked once claimed or when ADMIN_PASSCODE is set)
  app.post('/api/admin/setup', (req, res) => {
    const envPasscode = process.env.ADMIN_PASSCODE?.trim();
    if (envPasscode) {
      res.status(403).json({ error: 'Admin password is managed by server environment configuration.' });
      return;
    }
    const store = readStore();
    if (store.admin) {
      res.status(403).json({ error: 'Admin password has already been claimed.' });
      return;
    }
    const password = typeof req.body?.password === 'string' ? req.body.password.trim() : '';
    if (password.length < 6 || password.length > 100) {
      res.status(400).json({ error: 'Choose an admin password with at least 6 characters.' });
      return;
    }
    const { salt, hash } = hashPassword(password);
    store.admin = { salt, hash, claimedAt: new Date().toISOString() };
    writeStore(store);
    const token = signSessionToken();
    res.json({ token, setupComplete: true });
  });

  // Admin login
  app.post('/api/admin/login', (req, res) => {
    const password = typeof req.body?.password === 'string' ? req.body.password.trim() : '';
    if (!password) {
      res.status(400).json({ error: 'Password is required.' });
      return;
    }

    const envPasscode = process.env.ADMIN_PASSCODE?.trim();
    if (envPasscode) {
      if (!safeCompare(password, envPasscode)) {
        res.status(401).json({ error: 'Incorrect passcode.' });
        return;
      }
      res.json({ token: signSessionToken() });
      return;
    }

    const store = readStore();
    if (!store.admin) {
      res.status(400).json({ error: 'Admin account not set up yet.' });
      return;
    }

    const { hash } = hashPassword(password, store.admin.salt);
    if (!safeCompare(hash, store.admin.hash)) {
      res.status(401).json({ error: 'Incorrect password.' });
      return;
    }
    res.json({ token: signSessionToken() });
  });

  // Protected Admin Dashboard Analytics + Leads
  app.get('/api/admin/dashboard', requireAdmin, (_req, res) => {
    const store = readStore();
    const uniqueVisitors = new Set(store.pageViews.map((pv) => pv.visitorId)).size;
    const totalPageViews = store.pageViews.length;

    const now = Date.now();
    const dayAgo = now - 24 * 60 * 60 * 1000;
    const viewsLast24h = store.pageViews.filter((pv) => new Date(pv.timestamp).getTime() >= dayAgo).length;

    const pageCountsMap = new Map<string, number>();
    for (const pv of store.pageViews) {
      pageCountsMap.set(pv.page, (pageCountsMap.get(pv.page) || 0) + 1);
    }
    const topPages = Array.from(pageCountsMap.entries())
      .map(([page, views]) => ({ page, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 12);

    const langBreakdown = {
      en: store.pageViews.filter((pv) => pv.lang === 'en').length,
      hi: store.pageViews.filter((pv) => pv.lang === 'hi').length,
    };

    const recentViews = store.pageViews.slice(-40).reverse();

    res.json({
      summary: {
        uniqueVisitors,
        totalPageViews,
        viewsLast24h,
        totalLeads: store.leads.length,
        newLeads: store.leads.filter((l) => l.status === 'New').length,
        conversionRate: uniqueVisitors > 0 ? Number(((store.leads.length / uniqueVisitors) * 100).toFixed(1)) : 0,
      },
      topPages,
      langBreakdown,
      recentViews,
      leads: store.leads,
      integrations: {
        targetEmail: TARGET_EMAIL,
        targetPhone: TARGET_COACH_PHONE,
        emailConfigured: Boolean(process.env.RESEND_API_KEY?.trim()),
        telegramConfigured: Boolean(process.env.TELEGRAM_BOT_TOKEN?.trim() && process.env.TELEGRAM_CHAT_ID?.trim()),
        webhookConfigured: Boolean(process.env.LEAD_WEBHOOK_URL?.trim()),
      },
    });
  });

  // Update lead status / notes
  app.patch('/api/admin/leads/:id', requireAdmin, (req, res) => {
    const allowedStatuses = new Set(['New', 'Contacted', 'Demo Scheduled', 'Enrolled', 'Archived']);
    const store = readStore();
    const lead = store.leads.find((l) => l.id === req.params.id);
    if (!lead) {
      res.status(404).json({ error: 'Lead not found' });
      return;
    }
    if (typeof req.body?.status === 'string' && allowedStatuses.has(req.body.status)) {
      lead.status = req.body.status as LeadRecord['status'];
    }
    if (typeof req.body?.notes === 'string') {
      lead.notes = sanitizeText(req.body.notes, 400);
    }
    writeStore(store);
    res.json({ lead });
  });

  // Delete lead
  app.delete('/api/admin/leads/:id', requireAdmin, (req, res) => {
    const store = readStore();
    const before = store.leads.length;
    store.leads = store.leads.filter((l) => l.id !== req.params.id);
    if (store.leads.length === before) {
      res.status(404).json({ error: 'Lead not found' });
      return;
    }
    writeStore(store);
    res.json({ deleted: true });
  });

  // Export Leads CSV
  app.get('/api/admin/export-csv', requireAdmin, (_req, res) => {
    const store = readStore();
    const header = ['Date', 'Name', 'Phone', 'Email', 'Goal', 'Source', 'Mode', 'Status', 'Metrics', 'Message', 'Notes'];
    const rows = store.leads.map((l) =>
      [
        l.createdAt,
        l.name,
        l.phone,
        l.email,
        l.goal,
        l.source,
        l.mode,
        l.status,
        l.metricsSummary,
        l.message,
        l.notes,
      ]
        .map((cell) => escapeCsvCell(cell || ''))
        .join(',')
    );
    const csv = [header.join(','), ...rows].join('\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="vedika-wellness-leads.csv"');
    res.send(csv);
  });

  if (!IS_PROD) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(ROOT_DIR, 'dist');
    app.use(express.static(distDir));
    app.get('/{*splat}', (_req, res) => {
      res.sendFile(path.resolve(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Vedika Health and Wellness server running on http://0.0.0.0:${PORT}`);
  });
}

createServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
