'use client';

/**
 * Thanh chọn bài để lập Phòng Lab.
 *
 * Dính đáy màn hình trong lúc người học đang tick từng bài trên trang track, và
 * nó hiện đúng hai con số họ cần để quyết định: đã chọn mấy bài, và tổng LOC là
 * bao nhiêu so với mục tiêu. Phần LOC TỰ ẨN khi không bài nào trong track có
 * LOC trong tiêu đề (chỉ LAB211 có) — bày một con số 0 ra thì tệ hơn là không
 * bày gì.
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FlaskConical, Loader2, Target, X } from 'lucide-react';
import { codeLabApi } from '@/lib/code-lab-api';

const LOC_MAC_DINH = 750;

export function LabRoomBar({
  trackSlug, trackName, picked, totalLoc, coLoc, onClear, onRemove,
}: {
  trackSlug: string;
  trackName: string;
  picked: Array<{ id: number; title: string; loc: number }>;
  totalLoc: number;
  coLoc: boolean;
  onClear: () => void;
  onRemove: (id: number) => void;
}) {
  const router = useRouter();
  const [goal, setGoal] = useState<number>(LOC_MAC_DINH);
  const [name, setName] = useState('');
  const [dangTao, setDangTao] = useState(false);
  const [loi, setLoi] = useState<string | null>(null);
  const [moChiTiet, setMoChiTiet] = useState(false);

  if (!picked.length) return null;

  const pct = coLoc && goal > 0 ? Math.min(100, Math.round((totalLoc / goal) * 100)) : 0;

  async function taoPhong() {
    setDangTao(true);
    setLoi(null);
    try {
      const res = await codeLabApi.createLabRoom({
        trackSlug,
        exerciseIds: picked.map((p) => p.id),
        name: name.trim() || undefined,
        locGoal: coLoc ? goal : undefined,
      });
      router.push(`/code-lab/phong-lab/${res.data.data.id}`);
    } catch (e) {
      const err = e as { response?: { data?: { message?: string } } };
      setLoi(err.response?.data?.message || 'Không tạo được phòng. Thử lại giúp mình.');
      setDangTao(false);
    }
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur"
      style={{ borderColor: 'var(--border-color)', background: 'color-mix(in srgb, var(--bg-card) 92%, transparent)' }}>
      {moChiTiet && (
        <div className="mx-auto max-w-4xl px-4 pt-3">
          <ul className="max-h-40 space-y-1 overflow-y-auto pr-1">
            {picked.map((p) => (
              <li key={p.id} className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <button onClick={() => onRemove(p.id)} className="shrink-0 rounded p-0.5 transition-colors hover:text-red-500" aria-label="Bỏ bài này">
                  <X size={13} />
                </button>
                <span className="min-w-0 flex-1 truncate">{p.title}</span>
                {p.loc > 0 && <span className="shrink-0 tabular-nums" style={{ color: 'var(--text-muted)' }}>{p.loc} LOC</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-3 px-4 py-3">
        <button onClick={() => setMoChiTiet((v) => !v)}
          className="rounded-full border px-3 py-1.5 text-xs font-semibold tabular-nums transition-colors hover:bg-[var(--bg-surface-hover)]"
          style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
          {picked.length} bài{coLoc ? ` · ${totalLoc} LOC` : ''}
        </button>

        {coLoc && (
          <label className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
            <Target size={13} /> Mục tiêu
            <input
              type="number" min={50} max={20000} step={50} value={goal}
              onChange={(e) => setGoal(Math.max(50, Math.min(20000, Number(e.target.value) || LOC_MAC_DINH)))}
              className="w-20 rounded-lg border px-2 py-1 text-xs tabular-nums"
              style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
            />
            LOC
          </label>
        )}

        <input
          value={name} onChange={(e) => setName(e.target.value)} maxLength={200}
          placeholder={`Tên phòng (mặc định: Phòng ${trackName})`}
          className="min-w-0 flex-1 rounded-lg border px-3 py-1.5 text-xs"
          style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
        />

        <button onClick={onClear} className="text-xs underline" style={{ color: 'var(--text-muted)' }}>Bỏ chọn hết</button>

        <button
          onClick={taoPhong} disabled={dangTao}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          style={{ background: 'var(--cl-accent, var(--accent-color))' }}>
          {dangTao ? <Loader2 size={15} className="animate-spin" /> : <FlaskConical size={15} />}
          Tạo phòng Lab
        </button>
      </div>

      {coLoc && (
        <div className="mx-auto max-w-4xl px-4 pb-2">
          <div className="h-1 w-full overflow-hidden rounded-full" style={{ background: 'var(--bg-surface)' }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, background: totalLoc >= goal ? '#22c55e' : 'var(--cl-accent, var(--accent-color))' }} />
          </div>
          <p className="mt-1 text-[11px]" style={{ color: 'var(--text-muted)' }}>
            {totalLoc >= goal
              ? `Đủ mục tiêu — ${totalLoc}/${goal} LOC. Tạo phòng được rồi.`
              : `Còn thiếu ${goal - totalLoc} LOC để chạm mục tiêu ${goal}.`}
          </p>
        </div>
      )}

      {loi && <p className="mx-auto max-w-4xl px-4 pb-2 text-xs text-red-500">{loi}</p>}
    </div>
  );
}
