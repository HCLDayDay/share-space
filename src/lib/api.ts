import type { PolaroidMemory, MenuItem, MessageFeedItem, AppSettings, PartnerRole, MessageType } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE ?? '';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export interface SettingsPayload {
  settings: AppSettings;
  partnerAName: string;
  partnerJName: string;
}

export const api = {
  getSettings: () => request<SettingsPayload>('/api/settings'),
  updateSettings: (payload: SettingsPayload) =>
    request<SettingsPayload>('/api/settings', { method: 'PUT', body: JSON.stringify(payload) }),

  getMemories: () => request<PolaroidMemory[]>('/api/memories'),
  createMemory: (memory: Omit<PolaroidMemory, 'id' | 'dateAdded'> & { id?: string }) =>
    request<PolaroidMemory>('/api/memories', { method: 'POST', body: JSON.stringify(memory) }),
  deleteMemory: (id: string) => request<void>(`/api/memories/${id}`, { method: 'DELETE' }),

  getMenu: () => request<MenuItem[]>('/api/menu'),
  createMenuItem: (item: Omit<MenuItem, 'id'> & { id?: string }) =>
    request<MenuItem>('/api/menu', { method: 'POST', body: JSON.stringify(item) }),
  updateMenuItem: (id: string, item: Partial<MenuItem>) =>
    request<MenuItem>(`/api/menu/${id}`, { method: 'PUT', body: JSON.stringify(item) }),
  deleteMenuItem: (id: string) => request<void>(`/api/menu/${id}`, { method: 'DELETE' }),

  getMessages: () => request<MessageFeedItem[]>('/api/messages'),
  createMessage: (payload: {
    sender: PartnerRole;
    type: MessageType;
    title: string;
    detailText?: string;
    imageUrl?: string;
  }) => request<MessageFeedItem>('/api/messages', { method: 'POST', body: JSON.stringify(payload) }),

  uploadImage: async (file: File): Promise<string> => {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`${API_BASE}/api/uploads`, { method: 'POST', body: form });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || 'Upload failed');
    }
    const data = await res.json();
    return data.url;
  },

  uploadDataUrl: async (dataUrl: string): Promise<string> => {
    const data = await request<{ url: string }>('/api/uploads', {
      method: 'POST',
      body: JSON.stringify({ dataUrl }),
    });
    return data.url;
  },

  resetAppData: () => request<{ ok: boolean }>('/api/reset', { method: 'POST' }),
};

export async function resolveImageUrl(
  url: string,
  isCustom: boolean
): Promise<string> {
  if (!isCustom || !url.startsWith('data:')) return url;
  return api.uploadDataUrl(url);
}
