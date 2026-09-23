'use client';

/**
 * CT Work — hook dữ liệu + thời gian thực.
 *
 * Nguồn sự thật là TanStack Query. Socket KHÔNG vá dữ liệu tại chỗ — nó chỉ
 * báo "dự án này vừa đổi" rồi ta invalidate đúng các khoá liên quan và để
 * Query tải lại. Chậm hơn vá tại chỗ vài trăm ms, nhưng không bao giờ lệch
 * với server (vá tay thì phải tự tái hiện mọi luật của backend: cột Done
 * đặt resolvedAt, việc con đi theo sprint của cha…).
 */

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { connectSocket } from '@/lib/socket';
import { workApi, type ProjectConfig, type WorkEvent, type WorkStatus } from '@/lib/work-api';

export const wk = {
  workspaces: ['work', 'workspaces'] as const,
  workspace: (slug: string) => ['work', 'workspace', slug] as const,
  resolve: (slug: string, key: string) => ['work', 'resolve', slug, key.toUpperCase()] as const,
  project: (pid: number) => ['work', 'project', pid] as const,
  board: (pid: number) => ['work', 'board', pid] as const,
  issues: (pid: number) => ['work', 'issues', pid] as const,
  issue: (pid: number, num?: number) => (num === undefined ? (['work', 'issue', pid] as const) : (['work', 'issue', pid, num] as const)),
  comments: (pid: number, num: number) => ['work', 'comments', pid, num] as const,
  /** Mẫu mô tả theo loại thẻ nằm dưới wk.project ⇒ project.updated (admin sửa mẫu) làm tươi. */
  issueTemplates: (pid: number) => ['work', 'project', pid, 'issue-templates'] as const,
  history: (pid: number, num: number) => ['work', 'history', pid, num] as const,
  backlog: (pid: number) => ['work', 'backlog', pid] as const,
  sprints: (pid: number) => ['work', 'sprints', pid] as const,
  reports: (pid: number) => ['work', 'reports', pid] as const,
  /** Mọi dữ liệu kiểm thử (test, plan, cycle, lần chạy, truy vết) nằm dưới khoá này. */
  tests: (pid: number) => ['work', 'tests', pid] as const,
  /** Kết quả JQL nằm dưới wk.issues ⇒ sự kiện thẻ làm tươi luôn. */
  search: (pid: number, jql: string) => ['work', 'issues', pid, 'jql', jql] as const,
  filters: (pid: number) => ['work', 'filters', pid] as const,
  dashboards: (pid: number) => ['work', 'dashboards', pid] as const,
  /** Số liệu widget nằm dưới wk.reports ⇒ sự kiện thẻ làm tươi luôn. */
  widget: (pid: number) => ['work', 'reports', pid, 'widget'] as const,
  /** Giá trị trường tuỳ chỉnh nằm dưới wk.issue(pid) ⇒ issue.updated làm tươi. */
  customValues: (pid: number, num: number) => ['work', 'issue', pid, num, 'custom'] as const,
  /** Timeline nằm dưới wk.issues ⇒ mọi sự kiện thẻ (đổi ngày, link BLOCKS) làm tươi. */
  timeline: (pid: number) => ['work', 'issues', pid, 'timeline'] as const,
  /** Version nằm dưới wk.project ⇒ project.updated (tạo/sửa/phát hành version) làm tươi. */
  versions: (pid: number) => ['work', 'project', pid, 'versions'] as const,
  version: (pid: number, id: number) => ['work', 'project', pid, 'versions', id] as const,
  /** Worklog nằm dưới wk.issue(pid) ⇒ issue.updated (ghi/xoá giờ) làm tươi. */
  worklogs: (pid: number, num: number) => ['work', 'issue', pid, num, 'worklogs'] as const,
  /** Luật tự động + nhật ký chạy. */
  automation: (pid: number) => ['work', 'automation', pid] as const,
  automationLogs: (pid: number) => ['work', 'automation', pid, 'logs'] as const,
  /** Capacity + báo cáo giờ nằm dưới wk.reports ⇒ sự kiện thẻ làm tươi. */
  capacity: (pid: number) => ['work', 'reports', pid, 'capacity'] as const,
  timeReport: (pid: number) => ['work', 'reports', pid, 'time'] as const,
  /** Ngày nghỉ theo KHÔNG GIAN (không theo dự án). */
  timeOff: (wsId: number) => ['work', 'time-off', wsId] as const,
  notifySettings: ['work', 'notify-settings'] as const,
  /** Commit/nhánh/PR của thẻ nằm dưới wk.issue(pid) ⇒ webhook GitHub (issue.updated) làm tươi. */
  devActivity: (pid: number, num: number) => ['work', 'issue', pid, num, 'dev'] as const,
  /** Kết nối GitHub nằm dưới wk.project ⇒ project.updated làm tươi. */
  github: (pid: number) => ['work', 'project', pid, 'github'] as const,
  /** Nhật ký quản trị theo KHÔNG GIAN. */
  audit: (wsId: number) => ['work', 'audit', wsId] as const,
  /** Đề xuất kế hoạch sprint — NGOÀI wk.backlog để sự kiện realtime không xoá lựa chọn đang dở. */
  aiPlan: (pid: number, sprintId: number) => ['work', 'ai-plan', pid, sprintId] as const,
};

/** /work/<slug>/<KEY> ⇒ cấu hình dự án. */
export function useProject(slug: string, key: string) {
  const resolved = useQuery({
    queryKey: wk.resolve(slug, key),
    queryFn: () => workApi.resolve(slug, key),
    staleTime: Infinity,
    retry: false,
  });
  const pid = resolved.data?.projectId;
  const config = useQuery({
    queryKey: wk.project(pid ?? 0),
    queryFn: () => workApi.project(pid!),
    enabled: !!pid,
    staleTime: 60_000,
  });
  return { pid, config: config.data, isLoading: resolved.isLoading || (!!pid && config.isLoading), error: resolved.error ?? config.error };
}

/** Tra cứu nhanh theo id — dùng ở mọi thẻ trên board nên phải tính một lần. */
export function useLookups(cfg: ProjectConfig | undefined) {
  return useMemo(() => {
    const statuses = new Map<number, WorkStatus & { workflowId: number }>();
    cfg?.workflows.forEach((w) => w.statuses.forEach((s) => statuses.set(s.id, { ...s, workflowId: w.id })));
    const defaultWf = cfg?.workflows.find((w) => w.isDefault) ?? cfg?.workflows[0];
    return {
      statuses,
      types: new Map(cfg?.issueTypes.map((t) => [t.id, t]) ?? []),
      labels: new Map(cfg?.labels.map((l) => [l.id, l]) ?? []),
      members: new Map(cfg?.members.map((m) => [m.id, m]) ?? []),
      components: new Map(cfg?.components.map((c) => [c.id, c]) ?? []),
      workflows: new Map(cfg?.workflows.map((w) => [w.id, w]) ?? []),
      /** Quy trình mà một loại thẻ đi theo. */
      workflowOfType: (typeId: number) => {
        const t = cfg?.issueTypes.find((x) => x.id === typeId);
        return (t?.workflowId && cfg?.workflows.find((w) => w.id === t.workflowId)) || defaultWf;
      },
      issueKey: (num: number) => `${cfg?.key ?? ''}-${num}`,
    };
  }, [cfg]);
}

export type Lookups = ReturnType<typeof useLookups>;

/**
 * Trạng thái đích hợp lệ khi thả thẻ vào một cột: trạng thái của cột thuộc
 * đúng quy trình của thẻ VÀ có luồng chuyển từ trạng thái hiện tại (quy
 * trình không khai luồng chuyển nào = chuyển tự do).
 */
export function allowedTargets(lk: Lookups, typeId: number, fromStatusId: number, columnStatusIds: number[]): number[] {
  const wf = lk.workflowOfType(typeId);
  if (!wf) return [];
  const inWf = columnStatusIds.filter((id) => wf.statuses.some((s) => s.id === id));
  if (!wf.transitions.length) return inWf;
  return inWf.filter((to) => to === fromStatusId || wf.transitions.some((t) => t.toStatusId === to && (t.fromStatusId === null || t.fromStatusId === fromStatusId)));
}

/**
 * Vào phòng socket của dự án và invalidate dữ liệu khi có thay đổi. Gộp các
 * sự kiện dồn dập (kéo 10 thẻ liền tay) thành một lượt tải lại mỗi 200ms.
 */
export function useProjectRealtime(pid: number | undefined, onEvent?: (e: WorkEvent) => void) {
  const qc = useQueryClient();
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  const pending = useRef(new Set<string>());
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flush = useCallback(() => {
    timer.current = null;
    for (const k of pending.current) qc.invalidateQueries({ queryKey: JSON.parse(k) });
    pending.current.clear();
  }, [qc]);
  const queue = useCallback((key: readonly unknown[]) => {
    pending.current.add(JSON.stringify(key));
    if (!timer.current) timer.current = setTimeout(flush, 200);
  }, [flush]);

  useEffect(() => {
    if (!pid) return;
    let alive = true;
    let socket: Awaited<ReturnType<typeof connectSocket>> | null = null;
    const join = () => socket?.emit('work:join', pid, () => {});
    // Mất kết nối rồi nối lại thì phòng đã mất — vào lại, và tải lại vì có thể đã lỡ sự kiện.
    const onReconnect = () => {
      join();
      queue(wk.board(pid));
      queue(wk.issues(pid));
    };
    const handler = (e: WorkEvent) => {
      if (e.projectId !== pid) return;
      onEventRef.current?.(e);
      if (e.type === 'project.updated') {
        // Service kiểm thử báo thay đổi bằng project.updated (không có kiểu sự kiện riêng).
        queue(wk.project(pid));
        queue(wk.tests(pid));
        return;
      }
      queue(wk.board(pid));
      queue(wk.issues(pid));
      queue(wk.issue(pid));
      queue(wk.backlog(pid));
      queue(wk.reports(pid));
      queue(wk.tests(pid)); // thẻ TEST/BUG đổi ⇒ danh sách test + truy vết đổi theo
      if (e.type === 'sprint.updated') {
        queue(wk.sprints(pid));
        queue(wk.project(pid)); // config.sprints (ô chọn sprint) cũng đổi
      }
      if (e.type === 'comment.created' || e.type === 'issue.updated') {
        queue(['work', 'comments', pid]);
        queue(['work', 'history', pid]);
      }
    };
    connectSocket()
      .then((s) => {
        if (!alive) return;
        socket = s;
        join();
        s.on('work:event', handler);
        s.on('connect', onReconnect);
      })
      .catch(() => {});
    return () => {
      alive = false;
      if (socket) {
        socket.emit('work:leave', pid);
        socket.off('work:event', handler);
        socket.off('connect', onReconnect);
      }
    };
  }, [pid, queue]);
}

/** Mở hộp thoại "Create issue" từ bất cứ đâu (phím `c`, ⌘K, nút ở header). */
export const CREATE_ISSUE_EVENT = 'work:create-issue';
export function openCreateIssue(): void {
  window.dispatchEvent(new CustomEvent(CREATE_ISSUE_EVENT));
}
