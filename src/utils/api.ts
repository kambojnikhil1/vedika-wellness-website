import type { Lang, Theme } from '../types';

function getOrCreateVisitorId(): string {
  try {
    const key = 'vedika_vid';
    let vid = window.sessionStorage.getItem(key);
    if (!vid) {
      vid = `v_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
      window.sessionStorage.setItem(key, vid);
    }
    return vid;
  } catch {
    return `v_${Date.now().toString(36)}`;
  }
}

function isStaticGitHubPages(): boolean {
  return typeof window !== 'undefined' && window.location.hostname.endsWith('github.io');
}

export async function trackPageView(page: string, title: string, lang: Lang, theme: Theme): Promise<void> {
  if (isStaticGitHubPages()) return;
  try {
    await fetch('/api/analytics/pageview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId: getOrCreateVisitorId(),
        page,
        title,
        lang,
        theme,
        referrer: document.referrer || '',
      }),
    });
  } catch {
    // Non-blocking analytics
  }
}

export interface LeadSubmissionPayload {
  name?: string;
  phone?: string;
  email?: string;
  goal?: string;
  source: string;
  mode?: string;
  message?: string;
  metricsSummary?: string;
}

export interface LeadSubmissionResult {
  accepted: boolean;
  notified?: boolean;
  id?: string;
  error?: string;
  notificationLog?: string[];
}

function hasValidContact(phone?: string, email?: string): boolean {
  const digits = (phone || '').replace(/\D/g, '');
  const phoneOk = digits.length >= 7 && digits.length <= 15;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((email || '').trim());
  return phoneOk || emailOk;
}

export async function submitLead(payload: LeadSubmissionPayload): Promise<LeadSubmissionResult> {
  if (!hasValidContact(payload.phone, payload.email)) {
    return {
      accepted: false,
      error: 'Please enter a valid phone number or email address so our coach can reach you.',
    };
  }

  if (isStaticGitHubPages()) {
    return {
      accepted: true,
      notified: false,
      id: `static-${Date.now()}`,
      notificationLog: ['Static preview mode — use the WhatsApp button below to message coach immediately.'],
    };
  }

  try {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return {
        accepted: true,
        notified: false,
        id: `static-${Date.now()}`,
      };
    }
    const data = (await res.json()) as LeadSubmissionResult;
    if (!res.ok) {
      return {
        accepted: false,
        error: data.error || 'Could not submit your details. Please check your phone number or email.',
      };
    }
    return data;
  } catch {
    return {
      accepted: false,
      error: 'Could not reach the server. Please message us directly on WhatsApp (+91 81939 89452).',
    };
  }
}
