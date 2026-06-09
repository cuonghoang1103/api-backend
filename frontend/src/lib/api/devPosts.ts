import type { DevPostCard, DevPostDetail, DevPostComment } from '@/types/devPost';

const BASE = '/api/v1/dev-posts';

export const devPostsApi = {
  async getAll(category?: string): Promise<DevPostCard[]> {
    const url = category ? `${BASE}?category=${encodeURIComponent(category)}` : BASE;
    const res = await fetch(url, { credentials: 'include' });
    const data = await res.json();
    return data.success ? data.data : [];
  },

  async getCategories(): Promise<string[]> {
    const res = await fetch(`${BASE}/categories`, { credentials: 'include' });
    const data = await res.json();
    return data.success ? data.data : [];
  },

  async getById(id: number): Promise<DevPostDetail | null> {
    const res = await fetch(`${BASE}/${id}`, { credentials: 'include' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.success ? data.data : null;
  },

  async recordDownload(id: number): Promise<string> {
    const res = await fetch(`${BASE}/${id}/download`, {
      method: 'POST',
      credentials: 'include',
    });
    const data = await res.json();
    return data.success ? (data.data?.url ?? '') : '';
  },

  async addComment(
    id: number,
    payload: { userName: string; userAvatar?: string; commentText: string }
  ): Promise<DevPostComment | null> {
    const res = await fetch(`${BASE}/${id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data.success ? data.data : null;
  },
};
