import { auth, isFirebaseConfigured } from './firebase';
import type { Listing, Request } from '../types';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

async function getToken(): Promise<string> {
  if (!isFirebaseConfigured || !auth) {
    throw new Error('Firebase is not configured. Add VITE_FIREBASE_* to frontend/.env');
  }
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  return user.getIdToken();
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getToken();
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const merged = new Headers(options.headers);
  merged.set('Authorization', `Bearer ${token}`);
  if (options.body != null && !merged.has('Content-Type')) {
    merged.set('Content-Type', 'application/json');
  }
  const res = await fetch(url, { ...options, headers: merged });
  if (!res.ok) {
    const raw = await res.text();
    let message = res.statusText;
    try {
      const parsed = JSON.parse(raw) as { error?: string };
      if (parsed?.error) message = parsed.error;
      else if (raw.trim()) message = raw.slice(0, 500);
    } catch {
      if (raw.trim()) message = raw.slice(0, 500);
    }
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${message}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export function fetchListings() {
  return apiFetch<Listing[]>('/api/listings');
}

export function fetchListing(id: string) {
  return apiFetch<Listing>(`/api/listings/${encodeURIComponent(id)}`);
}

export function createListing(body: {
  title: string;
  description: string;
  category: string;
  isPaid: boolean;
  price?: number;
  conditions: string;
}) {
  return apiFetch<Listing>('/api/listings', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function patchListing(id: string, body: Record<string, unknown>) {
  return apiFetch<Listing>(`/api/listings/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export function fetchRequests(role: 'incoming' | 'outgoing') {
  return apiFetch<Request[]>(`/api/requests?role=${role}`);
}

export function createRequest(listingId: string, message?: string) {
  return apiFetch<Request>(`/api/requests/listing/${encodeURIComponent(listingId)}`, {
    method: 'POST',
    body: JSON.stringify({ message: message || '' }),
  });
}

export function patchRequest(id: string, action: 'approve' | 'reject' | 'complete') {
  return apiFetch<Request>(`/api/requests/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify({ action }),
  });
}
