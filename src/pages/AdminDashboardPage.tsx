import { useCallback, useEffect, useState } from 'react';
import {
  Download,
  Lock,
  LogOut,
  Mail,
  MessageCircle,
  Phone,
  RefreshCw,
  Search,
  Trash2,
} from 'lucide-react';
import type { Lang } from '../types';

interface AdminDashboardPageProps {
  lang: Lang;
}

interface DashboardLead {
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

interface DashboardPayload {
  summary: {
    uniqueVisitors: number;
    totalPageViews: number;
    viewsLast24h: number;
    totalLeads: number;
    newLeads: number;
    conversionRate: number;
  };
  topPages: { page: string; views: number }[];
  langBreakdown: { en: number; hi: number };
  recentViews: {
    id: string;
    visitorId: string;
    page: string;
    title: string;
    lang: string;
    theme: string;
    timestamp: string;
  }[];
  leads: DashboardLead[];
  integrations: {
    targetEmail: string;
    targetPhone: string;
    emailConfigured: boolean;
    telegramConfigured: boolean;
    webhookConfigured: boolean;
  };
}

export function AdminDashboardPage({ lang }: AdminDashboardPageProps) {
  // Keep admin session token strictly in React memory (never localStorage/sessionStorage)
  const [token, setToken] = useState<string>('');
  const [authMode, setAuthMode] = useState<'loading' | 'setup' | 'login'>('loading');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmInput, setConfirmInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [authBusy, setAuthBusy] = useState(false);

  const [data, setData] = useState<DashboardPayload | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [leadFilter, setLeadFilter] = useState<'All' | DashboardLead['status']>('All');
  const [leadSearch, setLeadSearch] = useState('');

  const isStaticHost =
    typeof window !== 'undefined' && window.location.hostname.endsWith('github.io');

  useEffect(() => {
    if (isStaticHost) {
      setAuthMode('login');
      return;
    }
    let active = true;
    fetch('/api/admin/auth-status')
      .then((r) => r.json())
      .then((res: { setupRequired?: boolean }) => {
        if (!active) return;
        setAuthMode(res.setupRequired ? 'setup' : 'login');
      })
      .catch(() => {
        if (active) setAuthMode('login');
      });
    return () => {
      active = false;
    };
  }, [isStaticHost]);

  const loadDashboard = useCallback(async (authToken: string) => {
    setLoadingData(true);
    try {
      const res = await fetch('/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.status === 401) {
        setToken('');
        setData(null);
        setAuthError('Session expired. Please sign in again.');
        return;
      }
      if (res.ok) {
        const json = (await res.json()) as DashboardPayload;
        setData(json);
      }
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      void loadDashboard(token);
    }
  }, [token, loadDashboard]);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (passwordInput.length < 6) {
      setAuthError('Please choose a password with at least 6 characters.');
      return;
    }
    if (passwordInput !== confirmInput) {
      setAuthError('Passwords do not match.');
      return;
    }
    setAuthBusy(true);
    try {
      const res = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });
      const json = (await res.json()) as { token?: string; error?: string };
      if (!res.ok || !json.token) {
        setAuthError(json.error || 'Setup failed.');
        return;
      }
      setPasswordInput('');
      setConfirmInput('');
      setAuthMode('login');
      setToken(json.token);
    } finally {
      setAuthBusy(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthBusy(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });
      const json = (await res.json()) as { token?: string; error?: string };
      if (!res.ok || !json.token) {
        setAuthError(json.error || 'Invalid password.');
        return;
      }
      setPasswordInput('');
      setToken(json.token);
    } finally {
      setAuthBusy(false);
    }
  };

  const handleStatusChange = async (leadId: string, status: DashboardLead['status']) => {
    if (!token) return;
    const res = await fetch(`/api/admin/leads/${encodeURIComponent(leadId)}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setData((prev) =>
        prev
          ? {
              ...prev,
              leads: prev.leads.map((l) => (l.id === leadId ? { ...l, status } : l)),
            }
          : prev
      );
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!token) return;
    const res = await fetch(`/api/admin/leads/${encodeURIComponent(leadId)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setData((prev) =>
        prev ? { ...prev, leads: prev.leads.filter((l) => l.id !== leadId) } : prev
      );
    }
  };

  const handleExportCsv = async () => {
    if (!token) return;
    const res = await fetch('/api/admin/export-csv', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vedika-wellness-leads.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!token) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161D1A] p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <Lock className="w-4 h-4" aria-hidden="true" />
              <span>{lang === 'en' ? 'Coach & Owner Access Only' : 'केवल कोच एवं एडमिन के लिए'}</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-stone-900 dark:text-stone-50">
              {authMode === 'setup'
                ? lang === 'en'
                  ? 'Set Your Admin Password'
                  : 'अपना एडमिन पासवर्ड सेट करें'
                : lang === 'en'
                  ? 'Vedika Analytics & Lead Dashboard'
                  : 'वेदिका विज़िटर एवं लीड डैशबोर्ड'}
            </h1>
            <p className="text-sm text-stone-600 dark:text-stone-400">
              {authMode === 'setup'
                ? 'First-time setup: create a private admin password to protect visitor analytics and phone/email leads.'
                : 'Sign in to view website visitors, most viewed pages, and phone/email consultation leads.'}
            </p>
          </div>

          {isStaticHost ? (
            <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/40 p-4 space-y-2 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
              <p className="font-semibold text-stone-900 dark:text-stone-100">
                Backend Server Required for Live Analytics
              </p>
              <p>
                GitHub Pages hosts static frontend files only and cannot run the Node.js backend
                server (<span className="font-mono">server.ts</span>). Deploy the repository to a
                Node.js host (such as Cloud Run, Render, or Railway) to enable live visitor
                tracking, lead storage, and automatic email/Telegram alerts.
              </p>
            </div>
          ) : authMode === 'loading' ? (
            <p className="text-sm text-stone-500">Checking dashboard status...</p>
          ) : authMode === 'setup' ? (
            <form onSubmit={handleSetup} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Create Admin Password (min 6 chars)
                </label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-[#FAFAF9] dark:bg-[#0F1412] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmInput}
                  onChange={(e) => setConfirmInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-[#FAFAF9] dark:bg-[#0F1412] text-sm"
                />
              </div>
              {authError && <p className="text-xs font-medium text-red-600 dark:text-red-400">{authError}</p>}
              <button
                type="submit"
                disabled={authBusy}
                className="cta-calm-shift w-full py-3 rounded-lg text-white text-sm font-semibold cursor-pointer disabled:opacity-60"
              >
                {authBusy ? 'Saving...' : 'Claim Admin Dashboard'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Admin Passcode
                </label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-[#FAFAF9] dark:bg-[#0F1412] text-sm"
                />
              </div>
              {authError && <p className="text-xs font-medium text-red-600 dark:text-red-400">{authError}</p>}
              <button
                type="submit"
                disabled={authBusy}
                className="cta-calm-shift w-full py-3 rounded-lg text-white text-sm font-semibold cursor-pointer disabled:opacity-60"
              >
                {authBusy ? 'Signing In...' : 'Open Dashboard'}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  const filteredLeads = (data?.leads || []).filter((lead) => {
    const statusOk = leadFilter === 'All' || lead.status === leadFilter;
    const q = leadSearch.trim().toLowerCase();
    const qOk =
      !q ||
      lead.name.toLowerCase().includes(q) ||
      lead.phone.toLowerCase().includes(q) ||
      lead.email.toLowerCase().includes(q) ||
      lead.goal.toLowerCase().includes(q);
    return statusOk && qOk;
  });

  const maxPageViews = Math.max(1, ...(data?.topPages.map((p) => p.views) || [1]));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
        <div>
          <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
            Vedika Wellness / Coach Analytics & Lead CRM
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-50">
            Visitor Tracking & Contact Leads
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void loadDashboard(token)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#161D1A] text-xs font-semibold text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export Leads CSV
          </button>
          <button
            type="button"
            onClick={() => {
              setToken('');
              setData(null);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-stone-300 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161D1A] p-4">
          <p className="text-xs text-stone-500 dark:text-stone-400">Unique Visitors</p>
          <p className="font-mono text-2xl font-bold text-stone-900 dark:text-stone-50 tabular-nums mt-1">
            {data?.summary.uniqueVisitors ?? 0}
          </p>
        </div>
        <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161D1A] p-4">
          <p className="text-xs text-stone-500 dark:text-stone-400">Total Page Views</p>
          <p className="font-mono text-2xl font-bold text-stone-900 dark:text-stone-50 tabular-nums mt-1">
            {data?.summary.totalPageViews ?? 0}
          </p>
        </div>
        <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161D1A] p-4">
          <p className="text-xs text-stone-500 dark:text-stone-400">Views (Last 24h)</p>
          <p className="font-mono text-2xl font-bold text-stone-900 dark:text-stone-50 tabular-nums mt-1">
            {data?.summary.viewsLast24h ?? 0}
          </p>
        </div>
        <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161D1A] p-4">
          <p className="text-xs text-stone-500 dark:text-stone-400">Leads (Phone/Email)</p>
          <p className="font-mono text-2xl font-bold text-emerald-700 dark:text-emerald-400 tabular-nums mt-1">
            {data?.summary.totalLeads ?? 0}
          </p>
        </div>
        <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161D1A] p-4 col-span-2 lg:col-span-1">
          <p className="text-xs text-stone-500 dark:text-stone-400">Conversion Rate</p>
          <p className="font-mono text-2xl font-bold text-stone-900 dark:text-stone-50 tabular-nums mt-1">
            {data?.summary.conversionRate ?? 0}%
          </p>
        </div>
      </div>

      {/* Notification Alert Status */}
      {data && (
        <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-[#F4F4F1] dark:bg-[#141C18] p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <p className="font-semibold text-stone-900 dark:text-stone-100">
              Auto-Forward Rules (Only triggers when Phone or Email is submitted)
            </p>
            <p className="text-stone-600 dark:text-stone-400">
              Target Email: <span className="font-mono">{data.integrations.targetEmail}</span> ({data.integrations.emailConfigured ? 'Live via Resend API' : 'Set RESEND_API_KEY in Secrets to auto-email'}) · Target Coach Telegram/WhatsApp:{' '}
              <span className="font-mono">{data.integrations.targetPhone}</span> ({data.integrations.telegramConfigured ? 'Live via Telegram Bot' : 'Set TELEGRAM_BOT_TOKEN & TELEGRAM_CHAT_ID in Secrets for instant push'})
            </p>
          </div>
          <div className="font-mono text-stone-600 dark:text-stone-300 shrink-0 tabular-nums">
            EN views: {data.langBreakdown.en} · HI views: {data.langBreakdown.hi}
          </div>
        </div>
      )}

      {/* Leads CRM Table */}
      <section className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161D1A] overflow-hidden">
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="font-display text-lg font-bold text-stone-900 dark:text-stone-50">
            Captured Leads (Phone & Email Only)
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={leadSearch}
                onChange={(e) => setLeadSearch(e.target.value)}
                placeholder="Search phone, email, name..."
                className="pl-8 pr-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-[#FAFAF9] dark:bg-[#0F1412] text-xs"
              />
            </div>
            <select
              value={leadFilter}
              onChange={(e) => setLeadFilter(e.target.value as 'All' | DashboardLead['status'])}
              className="px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-[#FAFAF9] dark:bg-[#0F1412] text-xs font-medium"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Demo Scheduled">Demo Scheduled</option>
              <option value="Enrolled">Enrolled</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#F4F4F1] dark:bg-[#1C2521] border-b border-stone-200 dark:border-stone-800 text-xs font-semibold text-stone-600 dark:text-stone-300">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Goal & Source</th>
                <th className="py-3 px-4">Notes / Metrics</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 px-4 text-center text-sm text-stone-500">
                    No captured leads yet. Whenever a visitor enters a phone number or email on any form, it appears here immediately.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                    <td className="py-3 px-4 font-mono text-xs text-stone-500 whitespace-nowrap tabular-nums">
                      {new Date(lead.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 space-y-0.5">
                      <p className="font-semibold text-stone-900 dark:text-stone-100">
                        {lead.name || 'Website Visitor'}
                      </p>
                      {lead.phone && (
                        <p className="font-mono text-xs text-emerald-700 dark:text-emerald-400 tabular-nums">
                          {lead.phone}
                        </p>
                      )}
                      {lead.email && (
                        <p className="text-xs text-stone-600 dark:text-stone-400">{lead.email}</p>
                      )}
                    </td>
                    <td className="py-3 px-4 space-y-0.5">
                      <p className="font-medium text-stone-800 dark:text-stone-200">{lead.goal}</p>
                      <p className="text-xs text-stone-500">
                        {lead.source} · {lead.mode}
                      </p>
                    </td>
                    <td className="py-3 px-4 max-w-xs text-xs text-stone-600 dark:text-stone-300 space-y-1">
                      {lead.metricsSummary && <p className="font-mono">{lead.metricsSummary}</p>}
                      {lead.message && <p>{lead.message}</p>}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          void handleStatusChange(lead.id, e.target.value as DashboardLead['status'])
                        }
                        className="px-2 py-1 rounded border border-stone-300 dark:border-stone-700 bg-[#FAFAF9] dark:bg-[#0F1412] text-xs font-medium"
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Demo Scheduled">Demo Scheduled</option>
                        <option value="Enrolled">Enrolled</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1.5">
                        {lead.phone && (
                          <>
                            <a
                              href={`tel:${lead.phone.replace(/\s+/g, '')}`}
                              aria-label="Call lead"
                              className="p-1.5 rounded border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                            <a
                              href={`https://wa.me/${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                                `Namaste ${lead.name || ''}, thank you for contacting Vedika Health and Wellness regarding ${lead.goal}. How can we help you start?`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="WhatsApp lead"
                              className="p-1.5 rounded bg-emerald-700 text-white hover:bg-emerald-800"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          </>
                        )}
                        {lead.email && (
                          <a
                            href={`mailto:${lead.email}?subject=${encodeURIComponent('Vedika Health and Wellness Consultation')}`}
                            aria-label="Email lead"
                            className="p-1.5 rounded border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => void handleDeleteLead(lead.id)}
                          aria-label="Delete lead"
                          className="p-1.5 rounded text-stone-400 hover:text-red-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Visitor Analytics: Most Viewed Pages & Recent Page Views */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161D1A] p-5 space-y-4">
          <h2 className="font-display text-lg font-bold text-stone-900 dark:text-stone-50">
            What Visitors Are Viewing
          </h2>
          {data && data.topPages.length > 0 ? (
            <div className="space-y-3">
              {data.topPages.map((row) => (
                <div key={row.page} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-medium text-stone-800 dark:text-stone-200">
                      {row.page}
                    </span>
                    <span className="font-mono text-stone-500 tabular-nums">{row.views} views</span>
                  </div>
                  <div className="h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full"
                      style={{ width: `${Math.max(6, Math.round((row.views / maxPageViews) * 100))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-stone-500">Page views will appear as visitors browse the site.</p>
          )}
        </section>

        <section className="lg:col-span-7 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#161D1A] overflow-hidden">
          <div className="p-5 border-b border-stone-200 dark:border-stone-800">
            <h2 className="font-display text-lg font-bold text-stone-900 dark:text-stone-50">
              Recent Visitor Activity
            </h2>
          </div>
          <div className="max-h-80 overflow-y-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F4F4F1] dark:bg-[#1C2521] border-b border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300">
                  <th className="py-2.5 px-4">Time</th>
                  <th className="py-2.5 px-4">Page Viewed</th>
                  <th className="py-2.5 px-4">Language</th>
                  <th className="py-2.5 px-4">Visitor ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {(data?.recentViews || []).map((v) => (
                  <tr key={v.id}>
                    <td className="py-2.5 px-4 font-mono text-stone-500 tabular-nums whitespace-nowrap">
                      {new Date(v.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-2.5 px-4 font-medium text-stone-800 dark:text-stone-200">
                      {v.page} <span className="text-stone-400">({v.title})</span>
                    </td>
                    <td className="py-2.5 px-4 uppercase font-mono text-stone-600 dark:text-stone-400">
                      {v.lang}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-stone-500">{v.visitorId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
