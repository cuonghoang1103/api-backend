'use client';

/**
 * Danh sách Phòng Lab của tôi.
 *
 * Mỗi phòng là một lộ trình người học tự vạch: một nhóm bài, một mục tiêu LOC,
 * và tiến độ LOC ĐÃ ĐẠT (chỉ bài đã qua vòng chấm mới được cộng — đó là điều
 * làm con số này có nghĩa, khác hẳn "LOC đã chọn").
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, FlaskConical, Loader2, Target, Trash2 } from 'lucide-react';
import { codeLabApi } from '@/lib/code-lab-api';
import type { LabRoomSummary } from '@/types/code-lab';
import { useAuthStore } from '@/store/authStore';

export default function DsPhongLabPage() {
  const isAuthed = useAuthStore((s) => s.isAuthenticated);
  const [rooms, setRooms] = useState<LabRoomSummary[] | null>(null);
  const [loi, setLoi] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthed) { setRooms([]); return; }
    codeLabApi.labRooms()
      .then((r) => setRooms(r.data.data || []))
      .catch(() => setLoi('Không tải được danh sách phòng.'));
  }, [isAuthed]);

  async function xoa(id: number) {
    if (!window.confirm('Xoá phòng này? Toàn bộ hội thoại và kết quả chấm trong phòng sẽ mất.')) return;
    await codeLabApi.deleteLabRoom(id);
    setRooms((cu) => (cu || []).filter((r) => r.id !== id));
  }

  return (
    <div className="cl-root mx-auto max-w-3xl px-4 pb-14 pt-20" style={{ color: 'var(--text-primary)' }}>
      <Link href="/code-lab" className="mb-4 inline-flex items-center gap-1.5 text-sm transition-colors hover:opacity-80" style={{ color: 'var(--text-muted)' }}>
        <ArrowLeft size={15} /> Code Lab
      </Link>

      <div className="mb-6">
        <h1 className="cl-display flex items-center gap-2 text-2xl"><FlaskConical size={22} /> Phòng Lab của tôi</h1>
        <p className="mt-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Mỗi phòng là một nhóm bài bạn tự chọn kèm một mục tiêu LOC. Trong phòng có trợ giảng AI kèm
          từng bài, và một vòng nộp <code>.zip</code> để AI chấm thay thầy trước khi bạn mang đi review thật.
        </p>
      </div>

      {!isAuthed && (
        <div className="rounded-xl border py-12 text-center text-sm" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
          Đăng nhập để xem phòng Lab của bạn.
        </div>
      )}
      {loi && <p className="text-sm text-red-500">{loi}</p>}
      {isAuthed && rooms === null && <div className="flex justify-center py-20"><Loader2 className="animate-spin" style={{ color: 'var(--text-muted)' }} /></div>}

      {isAuthed && rooms?.length === 0 && (
        <div className="rounded-xl border py-12 text-center text-sm" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
          Chưa có phòng nào. Mở một track — ví dụ{' '}
          <Link href="/code-lab/lab211" className="underline">LAB211</Link>{' '}
          — bấm <b>Chọn bài lập phòng Lab</b>, tick các bài rồi tạo phòng.
        </div>
      )}

      <div className="space-y-3">
        {(rooms || []).map((r) => {
          const pct = r.locGoal > 0 ? Math.min(100, Math.round((r.locDaDat / r.locGoal) * 100)) : 0;
          const accent = r.track.color || 'var(--accent-color)';
          return (
            <div key={r.id} className="rounded-2xl border p-4 transition-colors hover:bg-[var(--bg-surface-hover)]"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <div className="flex items-start gap-3">
                <Link href={`/code-lab/phong-lab/${r.id}`} className="min-w-0 flex-1">
                  <h2 className="truncate font-semibold" style={{ color: 'var(--text-primary)' }}>{r.name}</h2>
                  <p className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                    {r.track.name} · {r.soBaiDat}/{r.soBai} bài đạt · đã chọn {r.locDaChon} LOC
                  </p>
                </Link>
                <span className="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums"
                  style={{ background: 'var(--bg-surface)', color: r.locDaDat >= r.locGoal ? '#22c55e' : 'var(--text-secondary)' }}>
                  <Target size={11} className="mr-1 inline" />{r.locDaDat}/{r.locGoal} LOC
                </span>
                <button onClick={() => void xoa(r.id)} className="shrink-0 rounded p-1 transition-colors hover:text-red-500" style={{ color: 'var(--text-muted)' }} aria-label="Xoá phòng">
                  <Trash2 size={15} />
                </button>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full" style={{ background: 'var(--bg-surface)' }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: r.locDaDat >= r.locGoal ? '#22c55e' : accent }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
