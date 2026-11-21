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

export async function trackPageView(page: string, title: string, lang: Lang, theme: Theme): Promise<void> {
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

export async function submitLead(payload: LeadSubmissionPayload): Promise<LeadSubmissionResult> {
  const res = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = (await res.json()) as LeadSubmissionResult;
  if (!res.ok) {
    return {
      accepted: false,
      error: data.error || 'Could not submit your details. Please check your phone number or email.',
    };
  }
  return data;
}
