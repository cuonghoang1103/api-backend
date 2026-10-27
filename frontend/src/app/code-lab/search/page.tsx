'use client';

/**
 * Code Lab — tìm & lọc đề (14/10/2026 · bộ lọc đầy đủ đợt Academy 28/10/2026).
 *
 * Mọi tham số nằm trên URL (chia sẻ/quay lại được):
 *   q          từ khoá (bỏ trống = duyệt theo bộ lọc)
 *   difficulty EASY | MEDIUM | HARD        — lọc PHÍA MÁY CHỦ (đếm `total` đúng)
 *   group      slug nhóm chủ đề (Frontend, Database…) — lọc phía máy chủ (`groupId`)
 *   trangThai  chua | dang | xong          — lọc trên trang theo tiến độ của bạn (cần đăng nhập)
 *   cham=1     chỉ đề có máy chấm tự động
 */
import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Search, Loader2, CheckCircle2, Circle, FlaskConical, X } from 'lucide-react';
import { codeLabApi } from '@/lib/code-lab-api';
import type { CodeDifficulty, CodeExercise, CodeGroup, MyProgressItem } from '@/types/code-lab';
import { DIFF_ORDER, DIFF_UI } from '@/lib/codelabUi';
import { DifficultyChip } from '@/components/code-lab/ProblemCard';
import { useAuthStore } from '@/store/authStore';

const TRANG_THAI: Array<[string, string]> = [['', 'Tất cả'], ['chua', 'Chưa làm'], ['dang', 'Đang làm'], ['xong', 'Đã giải']];

function Results() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isAuthed = useAuthStore((s) => s.isAuthenticated);
  const q = sp.get('q') || '';
  const rawDiff = (sp.get('difficulty') || '').toUpperCase();
  const difficulty = (DIFF_ORDER as string[]).includes(rawDiff) ? (rawDiff as CodeDifficulty) : undefined;
  const groupSlug = sp.get('group') || '';
  const trangThai = sp.get('trangThai') || '';
  const chiCham = sp.get('cham') === '1';

  const [groups, setGroups] = useState<CodeGroup[]>([]);
  const [items, setItems] = useState<CodeExercise[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<Record<number, MyProgressItem>>({});
  const [o, setO] = useState(q);

  const dat = (k: string, v: string | null) => {
    const next = new URLSearchParams(sp.toString());
    if (v) next.set(k, v); else next.delete(k);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  useEffect(() => { codeLabApi.getGroups().then((r) => setGroups(r.data.data || [])).catch(() => {}); }, []);
  useEffect(() => {
    if (!isAuthed) { setProgress({}); return; }
    codeLabApi.myProgress().then((r) => {
      const m: Record<number, MyProgressItem> = {};
      (r.data.data || []).forEach((it) => { m[it.exerciseId] = it; });
      setProgress(m);
    }).catch(() => {});
  }, [isAuthed]);

  const groupId = useMemo(() => groups.find((g) => g.slug === groupSlug)?.id, [groups, groupSlug]);

  useEffect(() => {
    if (groupSlug && !groupId) return; // chờ danh sách nhóm
    setLoading(true);
    codeLabApi.search({ q, limit: 60, difficulty, groupId })
      .then((res) => { setItems(res.data.data.exercises || []); setTotal(res.data.data.total || 0); })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [q, difficulty, groupId, groupSlug]);

  const hien = useMemo(() => items.filter((ex) => {
    if (chiCham && !(ex.gradeKind && ex.gradeKind !== 'manual')) return false;
    const st = progress[ex.id]?.status;
    if (trangThai === 'xong') return st === 'SOLVED';
    if (trangThai === 'dang') return st === 'IN_PROGRESS';
    if (trangThai === 'chua') return !st;
    return true;
  }), [items, progress, trangThai, chiCham]);

  const locPhia = !!trangThai || chiCham;

  return (
    <div className="cl-root mx-auto max-w-4xl px-4 pb-10 pt-20" style={{ color: 'var(--text-primary)' }}>
      <Link href="/code-lab" className="mb-4 inline-flex items-center gap-1.5 text-sm transition-colors hover:opacity-80" style={{ color: 'var(--text-muted)' }}>
        <ArrowLeft size={15} /> Code Lab
      </Link>
      <div className="cl-hero cl-in mb-5 p-5 sm:p-6">
        <div className="cl-eyebrow mb-2">Tìm &amp; lọc đề</div>
        <form className="cl-search" onSubmit={(e) => { e.preventDefault(); dat('q', o.trim() || null); }}>
          <Search size={19} style={{ color: 'var(--text-muted)' }} />
          <input value={o} onChange={(e) => setO(e.target.value)} placeholder="Từ khoá: flexbox, useState, equivalence partition…" className="flex-1 bg-transparent text-[15px] outline-none" style={{ color: 'var(--text-primary)' }} aria-label="Từ khoá" />
          {o && <button type="button" onClick={() => { setO(''); dat('q', null); }} aria-label="Xoá"><X size={16} style={{ color: 'var(--text-muted)' }} /></button>}
        </form>
        <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          {loading ? 'Đang tìm…' : locPhia ? `${hien.length} đề khớp (trong ${items.length} đề đầu tiên của ${total})` : `${total.toLocaleString('vi-VN')} đề`}
        </p>
      </div>

      <div className="cl-filters mb-5">
        <div className="cl-filterbar" role="group" aria-label="Độ khó">
          <span className="cl-filter-lbl">Độ khó</span>
          <button type="button" className="cl-fpill" data-on={!difficulty ? 'true' : undefined} onClick={() => dat('difficulty', null)}>Tất cả</button>
          {DIFF_ORDER.filter((d) => d !== 'EXPERT').map((d) => (
            <button key={d} type="button" className="cl-fpill" data-on={difficulty === d ? 'true' : undefined} onClick={() => dat('difficulty', d)}
              style={difficulty === d ? { background: DIFF_UI[d].bg, color: DIFF_UI[d].color, borderColor: DIFF_UI[d].border } : undefined}>
              {DIFF_UI[d].label}
            </button>
          ))}
        </div>
        <div className="cl-filterbar" role="group" aria-label="Chủ đề">
          <span className="cl-filter-lbl">Chủ đề</span>
          <button type="button" className="cl-fpill" data-on={!groupSlug ? 'true' : undefined} onClick={() => dat('group', null)}>Tất cả</button>
          {groups.filter((g) => (g.tracks?.length ?? 0) > 0).map((g) => (
            <button key={g.id} type="button" className="cl-fpill" data-on={groupSlug === g.slug ? 'true' : undefined} onClick={() => dat('group', g.slug)}>{g.name}</button>
          ))}
        </div>
        <div className="cl-filterbar" role="group" aria-label="Trạng thái">
          <span className="cl-filter-lbl">Trạng thái</span>
          {TRANG_THAI.map(([v, ten]) => (
            <button key={v || 'all'} type="button" className="cl-fpill" data-on={trangThai === v ? 'true' : undefined} disabled={!!v && !isAuthed} title={v && !isAuthed ? 'Đăng nhập để lọc theo tiến độ' : undefined} onClick={() => dat('trangThai', v || null)}>{ten}</button>
          ))}
          <button type="button" className="cl-fpill" data-on={chiCham ? 'true' : undefined} onClick={() => dat('cham', chiCham ? null : '1')}><FlaskConical size={12} /> Có máy chấm</button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="cl-skel" style={{ height: 62 }} />)}</div>
      ) : hien.length === 0 ? (
        <div className="rounded-2xl border py-16 text-center text-sm" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>Không có đề nào khớp bộ lọc.</div>
      ) : (
        <ul className="space-y-2.5">
          {hien.map((ex, i) => {
            const st = progress[ex.id]?.status;
            return (
              <li key={ex.id} className="cl-in" style={{ animationDelay: `${Math.min(i, 10) * 0.03}s` }}>
                <Link href={`/code-lab/${ex.track?.slug || ''}/${ex.slug}`} className="group flex items-center gap-3 rounded-xl border p-3.5 transition-all hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--cl-accent)_45%,var(--border-color))]" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
                  {st === 'SOLVED' ? <CheckCircle2 size={18} className="shrink-0" style={{ color: '#22c55e' }} /> : <Circle size={18} className="shrink-0" style={{ color: st === 'IN_PROGRESS' ? '#d97706' : 'var(--border-color)' }} />}
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold transition-colors group-hover:text-[var(--cl-accent)]" style={{ color: 'var(--text-primary)' }}>{ex.title}</div>
                    <div className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>{ex.track?.name} · {ex.module?.name ?? ex.language}</div>
                  </div>
                  {ex.gradeKind && ex.gradeKind !== 'manual' && <span className="cl-toc-cham hidden sm:inline-flex"><FlaskConical size={11} /> Tự chấm</span>}
                  <DifficultyChip difficulty={ex.difficulty} small />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function CodeLabSearchPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-24"><Loader2 className="animate-spin" style={{ color: 'var(--text-muted)' }} /></div>}>
      <Results />
    </Suspense>
  );
}
