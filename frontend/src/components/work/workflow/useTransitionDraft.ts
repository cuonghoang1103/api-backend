'use client';

/**
 * Bản nháp luồng chuyển của MỘT quy trình, dùng chung cho sơ đồ và ma trận:
 * sửa gom lại cục bộ, lưu bằng một lượt setTransitions.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { workApi, workError, type WorkWorkflow } from '@/lib/work-api';
import { pairKey, parsePair } from './graph';

export type TransitionMode = 'free' | 'restricted';

export interface TransitionDraft {
  mode: TransitionMode;
  pairs: Set<string>;
  initialMode: TransitionMode;
  initialPairs: Set<string>;
  dirty: boolean;
  /** Giới hạn mà không còn mũi tên nào ⇒ máy chủ từ chối, nút Lưu phải tắt. */
  invalid: boolean;
  setMode: (m: TransitionMode) => void;
  setPairs: (next: Set<string> | ((prev: Set<string>) => Set<string>)) => void;
  add: (from: number | null, to: number) => void;
  remove: (key: string) => void;
  toggle: (from: number | null, to: number) => void;
  discard: () => void;
  save: () => void;
  saving: boolean;
}

export function useTransitionDraft(wf: WorkWorkflow, pid: number, onSaved: () => void): TransitionDraft {
  const initialMode: TransitionMode = wf.transitions.length ? 'restricted' : 'free';
  // Khoá theo chữ ký nội dung, không theo tham chiếu mảng — tải lại cấu hình không xoá bản nháp.
  const sig = wf.transitions.map((t) => pairKey(t.fromStatusId, t.toStatusId)).sort().join(',');
  const initialPairs = useMemo(() => new Set(sig ? sig.split(',') : []), [sig]);
  const statusSig = wf.statuses.map((s) => s.id).sort((a, b) => a - b).join(',');

  const [mode, setMode] = useState<TransitionMode>(initialMode);
  const [pairs, setPairsState] = useState<Set<string>>(initialPairs);
  const prev = useRef({ mode: initialMode, pairs: initialPairs });

  const same = (a: Set<string>, b: Set<string>) => a.size === b.size && [...a].every((k) => b.has(k));
  const dirty = mode !== initialMode || (mode === 'restricted' && !same(pairs, initialPairs));

  // Máy chủ đổi (vừa lưu / phiên khác / xoá trạng thái): chưa sửa gì thì nạp lại;
  // đang sửa dở thì giữ bản nháp, chỉ bỏ cặp trỏ vào trạng thái đã mất.
  useEffect(() => {
    const p = prev.current;
    const untouched = mode === p.mode && (mode === 'free' || same(pairs, p.pairs));
    const ids = new Set(statusSig ? statusSig.split(',').map(Number) : []);
    if (untouched) {
      setMode(initialMode);
      setPairsState(new Set(initialPairs));
    } else {
      setPairsState((cur) => new Set([...cur].filter((k) => { const e = parsePair(k); return ids.has(e.to) && (e.from === null || ids.has(e.from)); })));
    }
    prev.current = { mode: initialMode, pairs: initialPairs };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMode, initialPairs, statusSig]);

  const setPairs = useCallback((next: Set<string> | ((p: Set<string>) => Set<string>)) => setPairsState(next), []);
  const add = useCallback((from: number | null, to: number) => {
    if (from === to) return;
    setPairsState((p) => new Set(p).add(pairKey(from, to)));
  }, []);
  const remove = useCallback((key: string) => setPairsState((p) => { const n = new Set(p); n.delete(key); return n; }), []);
  const toggle = useCallback((from: number | null, to: number) => {
    const k = pairKey(from, to);
    setPairsState((p) => { const n = new Set(p); if (n.has(k)) n.delete(k); else n.add(k); return n; });
  }, []);
  const discard = useCallback(() => { setMode(initialMode); setPairsState(new Set(initialPairs)); }, [initialMode, initialPairs]);

  const mutation = useMutation({
    mutationFn: () => {
      if (mode === 'free') return workApi.setTransitions(pid, wf.id, { mode: 'free' });
      return workApi.setTransitions(pid, wf.id, { mode: 'restricted', transitions: [...pairs].map(parsePair) });
    },
    onSuccess: () => { toast.success(mode === 'free' ? 'Workflow is free again — any status can move to any status' : 'Transitions saved'); onSaved(); },
    onError: (err) => toast.error(workError(err, 'Could not save the transitions')),
  });

  return {
    mode, pairs, initialMode, initialPairs, dirty,
    invalid: mode === 'restricted' && !pairs.size,
    setMode, setPairs, add, remove, toggle, discard,
    save: () => mutation.mutate(),
    saving: mutation.isPending,
  };
}
