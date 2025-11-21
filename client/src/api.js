// client/src/api.js

const API_BASE = ''; // same origin; Vite dev proxies /api, /healthz

export async function fetchLinks() {
  const res = await fetch(`${API_BASE}/api/links`);
  if (!res.ok) throw new Error('Failed to fetch links');
  return res.json();
}

export async function createLink({ url, code }) {
  const res = await fetch(`${API_BASE}/api/links`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, code: code || undefined })
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = data.error || 'Failed to create link';
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }

  return data;
}

export async function deleteLink(code) {
  const res = await fetch(`${API_BASE}/api/links/${code}`, {
    method: 'DELETE'
  });

  if (!res.ok && res.status !== 404) {
    throw new Error('Failed to delete link');
  }
}

export async function fetchLinkStats(code) {
  const res = await fetch(`${API_BASE}/api/links/${code}`);
  if (res.status === 404) {
    const err = new Error('Not found');
    err.status = 404;
    throw err;
  }
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}
