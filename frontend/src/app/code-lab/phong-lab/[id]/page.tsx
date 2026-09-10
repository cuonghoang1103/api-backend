'use client';

/**
 * Một Phòng Lab.
 *
 * Trái: danh sách bài đã chọn, kèm LOC và trạng thái. Phải: bốn tấm cho ĐÚNG
 * bài đang mở — giảng đề, trợ giảng, nộp bài, và (sau khi đạt) cách review với
 * thầy.
 *
 * Hai con số ở đầu trang cố ý KHÔNG giống nhau:
 *   • "đã chọn"  tổng LOC của mọi bài trong phòng — cái người học tự vạch ra
 *   • "đã đạt"   chỉ LOC của bài ĐÃ QUA VÒNG CHẤM — cái đo được tiến bộ thật
 * Gộp hai cái vào một thanh là biến mục tiêu thành thứ đạt được bằng cách tick
 * thêm bài, chứ không phải bằng cách làm xong bài.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, BookOpen, Bot, CheckCircle2, ClipboardCheck, Circle, Loader2,
  Pencil, Presentation, Target, Trash2, PlayCircle,
} from 'lucide-react';
import { codeLabApi } from '@/lib/code-lab-api';
import type { LabRoom, LabRoomItem } from '@/types/code-lab';
import { DifficultyBadge, ProgressRing } from '@/components/code-lab/shared';
import { GioiThieuBai, TroGiang, NopBai, HuongDanReview } from '@/components/code-lab/LabRoomPanels';

type Tab = 'gioi-thieu' | 'tro-giang' | 'nop-bai' | 'review';

const TABS: Array<{ id: Tab; nhan: string; icon: React.ReactNode }> = [
  { id: 'gioi-thieu', nhan: 'Giảng đề', icon: <BookOpen size={14} /> },
  { id: 'tro-giang', nhan: 'Trợ giảng', icon: <Bot size={14} /> },
  { id: 'nop-bai', nhan: 'Nộp bài', icon: <ClipboardCheck size={14} /> },
  { id: 'review', nhan: 'Review với thầy', icon: <Presentation size={14} /> },
];

export default function PhongLabPage() {
  const params = useParams<{ id: string }>();
  const roomId = Number(params.id);

  const [room, setRoom] = useState<LabRoom | null>(null);
  const [loi, setLoi] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('gioi-thieu');
  const [suaTen, setSuaTen] = useState(false);
  const [tenMoi, setTenMoi] = useState('');
  const [goalMoi, setGoalMoi] = useState<number>(750);

  const tai = useCallback(async () => {
    try {
      const r = await codeLabApi.getLabRoom(roomId);
      setRoom(r.data.data);
      setTenMoi(r.data.data.name);
      setGoalMoi(r.data.data.locGoal);
    } catch {
      setLoi('Không mở được phòng này.');
    }
  }, [roomId]);

  useEffect(() => { void tai(); }, [tai]);

  const active: LabRoomItem | null = useMemo(
    () => room?.items.find((i) => i.id === room.activeItemId) || null,
    [room],
  );

  // Mở bài đầu tiên chưa đạt khi vào phòng lần đầu — không ai vào phòng để
  // ngắm danh sách, họ vào để làm bài tiếp theo.
  //
  // `daTuMo` là cái chốt: nếu lời gọi hỏng thì `activeItemId` vẫn null, và
  // không có cờ này thì effect thử lại ở MỌI lần render — một vòng lặp gọi API
  // im lặng mà người dùng chỉ thấy trang đứng im.
  const daTuMo = useRef(false);
  useEffect(() => {
    if (!room || room.activeItemId || !room.items.length || daTuMo.current) return;
    daTuMo.current = true;
    const tiep = room.items.find((i) => i.status !== 'PASSED') || room.items[0]!;
    void chonBai(tiep.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room?.id, room?.activeItemId, room?.items.length]);

  async function chonBai(itemId: number) {
    const r = await codeLabApi.selectLabRoomItem(roomId, itemId);
    setRoom(r.data.data);
    setTab('gioi-thieu');
  }

  async function boBai(itemId: number) {
    if (!window.confirm('Bỏ bài này khỏi phòng? Hội thoại và kết quả chấm của nó sẽ mất.')) return;
    const r = await codeLabApi.removeLabRoomItem(roomId, itemId);
    setRoom(r.data.data);
  }

  async function luuSua() {
    const r = await codeLabApi.updateLabRoom(roomId, { name: tenMoi, locGoal: goalMoi });
    setRoom(r.data.data);
    setSuaTen(false);
  }

  if (loi) return <div className="mx-auto max-w-3xl px-4 py-24 text-center text-sm" style={{ color: 'var(--text-muted)' }}>{loi} <Link href="/code-lab/phong-lab" className="underline">Về danh sách phòng</Link></div>;
  if (!room) return <div className="flex justify-center py-24"><Loader2 className="animate-spin" style={{ color: 'var(--text-muted)' }} /></div>;

  const accent = room.track.color || 'var(--accent-color)';
  const pct = room.locGoal > 0 ? Math.min(1, room.locDaDat / room.locGoal) : 0;
  const dsTab = TABS.filter((t) => t.id !== 'review' || active?.status === 'PASSED');
  // Tab "Review với thầy" chỉ tồn tại khi bài đã ĐẠT. Nếu vì đường nào đó tab
  // đang chọn không còn trong danh sách thì phần chính rỗng trơn — không lỗi,
  // không thông báo, chỉ là một khoảng trắng. Rơi về tab đầu thay vì thế.
  const tabHienHanh: Tab = dsTab.some((t) => t.id === tab) ? tab : 'gioi-thieu';

  return (
    <div className="cl-root mx-auto max-w-6xl px-4 pb-14 pt-20"
      style={{ color: 'var(--text-primary)', ['--cl-accent' as string]: accent } as React.CSSProperties}>
      <Link href="/code-lab/phong-lab" className="mb-4 inline-flex items-center gap-1.5 text-sm transition-colors hover:opacity-80" style={{ color: 'var(--text-muted)' }}>
        <ArrowLeft size={15} /> Phòng Lab của tôi
      </Link>

      {/* Đầu phòng */}
      <div className="cl-hero mb-5 p-5">
        <div className="flex flex-wrap items-start gap-4">
          <div className="min-w-0 flex-1">
            {suaTen ? (
              <div className="flex flex-wrap items-center gap-2">
                <input value={tenMoi} onChange={(e) => setTenMoi(e.target.value)} maxLength={200}
                  className="min-w-0 flex-1 rounded-lg border px-3 py-1.5 text-sm"
                  style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }} />
                <label className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <Target size={13} /> mục tiêu
                  <input type="number" min={50} max={20000} step={50} value={goalMoi}
                    onChange={(e) => setGoalMoi(Math.max(50, Math.min(20000, Number(e.target.value) || 750)))}
                    className="w-20 rounded-lg border px-2 py-1 text-xs tabular-nums"
                    style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }} />
                  LOC
                </label>
                <button onClick={() => void luuSua()} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white" style={{ background: accent }}>Lưu</button>
                <button onClick={() => setSuaTen(false)} className="text-xs underline" style={{ color: 'var(--text-muted)' }}>Huỷ</button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="cl-display text-xl">{room.name}</h1>
                <button onClick={() => setSuaTen(true)} className="rounded p-1 transition-colors hover:opacity-70" style={{ color: 'var(--text-muted)' }} aria-label="Sửa tên và mục tiêu">
                  <Pencil size={14} />
                </button>
              </div>
            )}
            <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              {room.track.name} · <b>{room.soBaiDat}/{room.soBai}</b> bài đạt
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full border px-2.5 py-1 tabular-nums" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                đã chọn <b>{room.locDaChon}</b> LOC
              </span>
              <span className="rounded-full px-2.5 py-1 font-semibold tabular-nums text-white" style={{ background: room.locDaDat >= room.locGoal ? '#22c55e' : accent }}>
                đã đạt {room.locDaDat}/{room.locGoal} LOC
              </span>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-center">
            <div className="relative">
              <ProgressRing value={pct} size={64} />
              <span className="cl-stat-num absolute inset-0 flex items-center justify-center text-sm">{Math.round(pct * 100)}%</span>
            </div>
            <span className="mt-1 text-[11px]" style={{ color: 'var(--text-muted)' }}>mục tiêu LOC</span>
          </div>
        </div>
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full" style={{ background: 'var(--bg-surface)' }}>
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct * 100}%`, background: room.locDaDat >= room.locGoal ? '#22c55e' : `linear-gradient(90deg, ${accent}, color-mix(in srgb, ${accent} 55%, #22c55e))` }} />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
        {/* Danh sách bài trong phòng */}
        <aside className="rounded-2xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <header className="border-b px-4 py-3 text-sm font-bold" style={{ borderColor: 'var(--border-color)' }}>
            Bài trong phòng ({room.items.length})
          </header>
          <ul className="max-h-[70vh] overflow-y-auto">
            {room.items.map((it) => {
              const dangMo = it.id === room.activeItemId;
              return (
                <li key={it.id} className="group border-t first:border-t-0" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="flex items-center gap-2 px-3 py-2.5"
                    style={dangMo ? { background: `color-mix(in srgb, ${accent} 10%, transparent)` } : undefined}>
                    <button onClick={() => void chonBai(it.id)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
                      {it.status === 'PASSED'
                        ? <CheckCircle2 size={17} className="shrink-0" style={{ color: '#22c55e' }} />
                        : it.status === 'IN_PROGRESS'
                          ? <PlayCircle size={17} className="shrink-0" style={{ color: '#d97706' }} />
                          : <Circle size={17} className="shrink-0" style={{ color: 'var(--border-color)' }} />}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-medium" style={{ color: dangMo ? accent : 'var(--text-primary)' }}>{it.title}</span>
                        <span className="mt-0.5 flex items-center gap-1.5">
                          <DifficultyBadge difficulty={it.difficulty} small />
                          {it.loc > 0 && <span className="text-[10px] tabular-nums" style={{ color: 'var(--text-muted)' }}>{it.loc} LOC</span>}
                        </span>
                      </span>
                    </button>
                    <button onClick={() => void boBai(it.id)} className="shrink-0 rounded p-1 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
                      style={{ color: 'var(--text-muted)' }} aria-label="Bỏ bài khỏi phòng">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </li>
              );
            })}
            {room.items.length === 0 && (
              <li className="px-4 py-6 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                Phòng trống. <Link href={`/code-lab/${room.track.slug}`} className="underline">Chọn thêm bài</Link>
              </li>
            )}
          </ul>
          <footer className="border-t px-4 py-3" style={{ borderColor: 'var(--border-color)' }}>
            <Link href={`/code-lab/${room.track.slug}`} className="text-xs underline" style={{ color: 'var(--text-muted)' }}>
              + Chọn thêm bài từ track
            </Link>
          </footer>
        </aside>

        {/* Bài đang mở */}
        <main className="min-w-0">
          {!active && (
            <div className="rounded-2xl border py-16 text-center text-sm" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
              Chọn một bài bên trái để bắt đầu.
            </div>
          )}
          {active && (
            <>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <h2 className="min-w-0 flex-1 truncate text-lg font-bold">{active.title}</h2>
                <Link href={`/code-lab/${room.track.slug}/${active.slug}`} target="_blank" rel="noreferrer"
                  className="rounded-full border px-2.5 py-1 text-xs transition-colors hover:bg-[var(--bg-surface-hover)]"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                  Mở đề gốc ↗
                </Link>
              </div>

              <div className="mb-4 flex flex-wrap gap-1.5">
                {dsTab.map((t) => (
                  <button key={t.id} onClick={() => setTab(t.id)}
                    className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors"
                    style={tabHienHanh === t.id
                      ? { background: accent, borderColor: accent, color: '#fff' }
                      : { borderColor: 'var(--border-color)', color: 'var(--text-secondary)', background: 'var(--bg-card)' }}>
                    {t.icon} {t.nhan}
                  </button>
                ))}
              </div>

              {tabHienHanh === 'gioi-thieu' && <GioiThieuBai key={`i-${active.id}`} roomId={roomId} item={active} />}
              {tabHienHanh === 'tro-giang' && <TroGiang key={`c-${active.id}`} roomId={roomId} item={active} />}
              {tabHienHanh === 'nop-bai' && <NopBai key={`s-${active.id}`} roomId={roomId} item={active} onXong={setRoom} />}
              {tabHienHanh === 'review' && active.status === 'PASSED' && <HuongDanReview key={`g-${active.id}`} roomId={roomId} item={active} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
