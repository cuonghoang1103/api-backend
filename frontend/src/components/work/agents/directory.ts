'use client';

/**
 * Sổ tra AI agent theo users.id (CTW-28 A13) — để UserAvatar ở MỌI chỗ (board, bình luận, lịch sử…) hiện tooltip
 * "AI agent · <model> · owner: <name>" mà không phải truyền dữ liệu qua từng component. Được nạp bởi
 * useWorkspaceAgents (trang dự án, trang agent). Thiếu dữ liệu ⇒ tooltip ngắn "AI agent · <tên>" — không bao giờ lỗi.
 * Tệp này KHÔNG import ui.tsx (ui.tsx import nó — tránh vòng).
 */

import { useEffect } from 'react';
import { create } from 'zustand';
import { useQuery } from '@tanstack/react-query';
import { userName } from '@/lib/work-api';
import { agentKeys, agentsApi, type AgentStatus, type WorkAgent } from '@/lib/work-agents-api';

export interface AgentInfo { agentId: number; model: string; status: AgentStatus; owner: string; ownerId: number; runtime?: 'EXTERNAL' | 'BUILTIN' }

interface DirState {
  byUser: Record<number, AgentInfo>;
  put: (agents: WorkAgent[]) => void;
}

export const useAgentDirectory = create<DirState>((set) => ({
  byUser: {},
  put: (agents) => set((s) => {
    const next = { ...s.byUser };
    for (const a of agents) next[a.userId] = { agentId: a.id, model: a.model, status: a.status, owner: userName(a.owner), ownerId: a.ownerId, runtime: a.runtime };
    return { byUser: next };
  }),
}));

/** Danh sách agent của không gian (cả RETIRED để lịch sử còn tooltip), nạp vào sổ tra. Khách ⇒ 403 ⇒ im lặng. */
export function useWorkspaceAgents(wsId: number | undefined, enabled = true) {
  const q = useQuery({
    queryKey: [...agentKeys.list(wsId ?? 0), 'all'],
    queryFn: () => agentsApi.list(wsId!, true),
    enabled: !!wsId && enabled,
    staleTime: 60_000,
    retry: false,
  });
  const put = useAgentDirectory((s) => s.put);
  useEffect(() => { if (q.data) put(q.data); }, [q.data, put]);
  return q;
}

export function agentTooltip(name: string, info: AgentInfo | undefined): string {
  if (!info) return `AI agent · ${name}`;
  const st = info.status === 'PAUSED' ? ' · paused' : info.status === 'RETIRED' ? ' · retired' : '';
  return `${name} — AI agent · ${info.model} · owner: ${info.owner}${st}`;
}
