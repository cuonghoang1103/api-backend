'use client';

/**
 * Thanh chọn bài để lập — hoặc bổ sung — một Phòng Lab.
 *
 * Dính đáy màn hình trong lúc người học đang tick từng bài trên trang track, và
 * nó hiện đúng hai con số họ cần để quyết định: đã chọn mấy bài, và tổng LOC là
 * bao nhiêu so với mục tiêu. Phần LOC TỰ ẨN khi không bài nào trong track có
 * LOC trong tiêu đề (chỉ LAB211 có) — bày một con số 0 ra thì tệ hơn là không
 * bày gì.
 *
 * ─── VÌ SAO CÓ Ô CHỌN PHÒNG ĐÍCH ───
 * Không phải lần chọn nào cũng là lần đầu. Người đã có phòng và muốn thêm ba
 * bài nữa mà chỉ có nút "Tạo phòng Lab" thì họ sẽ tạo phòng thứ hai — rồi tiến
 * độ LOC của họ nằm rải ở hai chỗ và không chỗ nào nói đúng sự thật. Ô chọn ở
 * đây mặc định "Tạo phòng mới", nhưng khi trang track được mở kèm `?chon=<id>`
 * (đường đi từ trong chính phòng đó ra) thì nó ghim sẵn đúng phòng ấy.
 */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FlaskConical, Loader2, Plus, Target, X } from 'lucide-react';
import { codeLabApi } from '@/lib/code-lab-api';
import type { LabRoomSummary } from '@/types/code-lab';

const LOC_MAC_DINH = 750;
const PHONG_MOI = 'moi';

export function LabRoomBar({
  trackSlug, trackName, picked, totalLoc, coLoc, phongGhim, onClear, onRemove,
}: {
  trackSlug: string;
  trackName: string;
  picked: Array<{ id: number; title: string; loc: number }>;
  totalLoc: number;
  coLoc: boolean;
  /** Phòng ghim sẵn khi vào từ `?chon=<id>`; null = để người dùng chọn. */
  phongGhim: number | null;
  onClear: () => void;
  onRemove: (id: number) => void;
}) {
  const router = useRouter();
  const [goal, setGoal] = useState<number>(LOC_MAC_DINH);
  const [name, setName] = useState('');
  const [dangChay, setDangChay] = useState(false);
  const [loi, setLoi] = useState<string | null>(null);
  const [moChiTiet, setMoChiTiet] = useState(false);
  const [phongCu, setPhongCu] = useState<LabRoomSummary[] | null>(null);
  const [dich, setDich] = useState<string>(phongGhim ? String(phongGhim) : PHONG_MOI);

  // Chỉ phòng CỦA TRACK NÀY: một phòng LAB211 không nhận được bài của track
  // khác (backend chặn), nên bày nó ra chỉ để người dùng chọn rồi ăn lỗi.
  useEffect(() => {
    codeLabApi.labRooms()
      .then((r) => {
        const ds = (r.data.data || []).filter((p) => p.track.slug === trackSlug);
        setPhongCu(ds);
        // Phòng ghim trong URL có thể đã bị xoá, hoặc là phòng của track khác.
        // Rơi về "tạo phòng mới" thay vì để cái nút chết cứng không lời giải
        // thích — người dùng dán lại một link cũ không đáng bị kẹt.
        setDich((cu) => (cu !== PHONG_MOI && !ds.some((p) => String(p.id) === cu) ? PHONG_MOI : cu));
      })
      .catch(() => {
        // Không đọc được danh sách phòng (mất mạng, hết phiên) thì cũng phải
        // nhả ô đích ra, nếu không cái nút "Thêm vào phòng" đứng khoá vĩnh viễn
        // vì `phongDich` không bao giờ tìm thấy.
        setPhongCu([]);
        setDich(PHONG_MOI);
      });
  }, [trackSlug]);

  if (!picked.length) return null;

  const themVaoPhong = dich !== PHONG_MOI;
  const phongDich = (phongCu || []).find((p) => String(p.id) === dich) || null;
  // Đang định thêm vào một phòng mà danh sách phòng CHƯA về thì chưa bấm được.
  // Không có chốt này, cú bấm sớm rơi vào nhánh "tạo mới" và đẻ ra đúng cái
  // phòng thứ hai mà ô chọn này sinh ra để tránh.
  const sanSang = !themVaoPhong || !!phongDich;
  // Thêm vào phòng có sẵn thì mục tiêu là mục tiêu CỦA PHÒNG ĐÓ, không phải ô
  // nhập ở đây — thanh tiến độ phải nói cùng một con số với trang phòng.
  const mucTieu = phongDich ? phongDich.locGoal : goal;
  const tongSauKhiThem = phongDich ? phongDich.locDaChon + totalLoc : totalLoc;
  const pct = coLoc && mucTieu > 0 ? Math.min(100, Math.round((tongSauKhiThem / mucTieu) * 100)) : 0;

  async function chay() {
    setDangChay(true);
    setLoi(null);
    try {
      const ids = picked.map((p) => p.id);
      if (themVaoPhong && phongDich) {
        await codeLabApi.addLabRoomItems(phongDich.id, ids);
        router.push(`/code-lab/phong-lab/${phongDich.id}`);
      } else {
        const res = await codeLabApi.createLabRoom({
          trackSlug,
          exerciseIds: ids,
          name: name.trim() || undefined,
          locGoal: coLoc ? goal : undefined,
        });
        router.push(`/code-lab/phong-lab/${res.data.data.id}`);
      }
    } catch (e) {
      const err = e as { response?: { data?: { message?: string } } };
      setLoi(err.response?.data?.message
        || (themVaoPhong ? 'Không thêm được vào phòng. Thử lại giúp mình.' : 'Không tạo được phòng. Thử lại giúp mình.'));
      setDangChay(false);
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

        {(phongCu?.length ?? 0) > 0 && (
          <select
            value={dich} onChange={(e) => setDich(e.target.value)}
            className="max-w-[220px] rounded-lg border px-2 py-1.5 text-xs"
            style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}>
            <option value={PHONG_MOI}>➕ Tạo phòng mới</option>
            {(phongCu || []).map((p) => (
              <option key={p.id} value={String(p.id)}>
                {p.name} ({p.soBai} bài · {p.locDaDat}/{p.locGoal} LOC)
              </option>
            ))}
          </select>
        )}

        {!themVaoPhong && coLoc && (
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

        {!themVaoPhong && (
          <input
            value={name} onChange={(e) => setName(e.target.value)} maxLength={200}
            placeholder={`Tên phòng (mặc định: Phòng ${trackName})`}
            className="min-w-0 flex-1 rounded-lg border px-3 py-1.5 text-xs"
            style={{ borderColor: 'var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
          />
        )}
        {themVaoPhong && <span className="min-w-0 flex-1" />}

        <button onClick={onClear} className="text-xs underline" style={{ color: 'var(--text-muted)' }}>Bỏ chọn hết</button>

        <button
          onClick={chay} disabled={dangChay || !sanSang}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          style={{ background: 'var(--cl-accent, var(--accent-color))' }}>
          {dangChay || !sanSang ? <Loader2 size={15} className="animate-spin" /> : themVaoPhong ? <Plus size={15} /> : <FlaskConical size={15} />}
          {themVaoPhong ? 'Thêm vào phòng' : 'Tạo phòng Lab'}
        </button>
      </div>

      {coLoc && (
        <div className="mx-auto max-w-4xl px-4 pb-2">
          <div className="h-1 w-full overflow-hidden rounded-full" style={{ background: 'var(--bg-surface)' }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, background: tongSauKhiThem >= mucTieu ? '#22c55e' : 'var(--cl-accent, var(--accent-color))' }} />
          </div>
          <p className="mt-1 text-[11px]" style={{ color: 'var(--text-muted)' }}>
            {themVaoPhong && phongDich
              ? `${phongDich.name} đang có ${phongDich.locDaChon} LOC; thêm ${totalLoc} nữa là ${tongSauKhiThem}/${mucTieu} LOC.`
              : tongSauKhiThem >= mucTieu
                ? `Đủ mục tiêu — ${tongSauKhiThem}/${mucTieu} LOC. Tạo phòng được rồi.`
                : `Còn thiếu ${mucTieu - tongSauKhiThem} LOC để chạm mục tiêu ${mucTieu}.`}
          </p>
        </div>
      )}

      {loi && <p className="mx-auto max-w-4xl px-4 pb-2 text-xs text-red-500">{loi}</p>}
    </div>
  );
}
