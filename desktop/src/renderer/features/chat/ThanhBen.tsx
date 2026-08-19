/**
 * ============================================================
 * THANH BÊN TRÁI — LỊCH SỬ PHIÊN, NHÓM THEO DỰ ÁN
 * ============================================================
 *
 * Người dùng đối chiếu với Claude Code (ảnh 19/08/2026) và muốn đúng thứ đó:
 * danh sách việc cũ nằm bên trái, gom theo dự án, gập được, kéo rộng được.
 *
 * Trước bản này lịch sử nằm sau một nút trong thanh công cụ — mở ra là một
 * lớp phủ che mất hội thoại, nên không thể vừa đọc việc cũ vừa nhìn việc
 * đang chạy. Đó chính là điều thanh bên chữa.
 *
 * ─── VÌ SAO NHÓM THEO DỰ ÁN ───
 * Một danh sách phẳng 40 phiên trộn ba dự án thì tiêu đề nào cũng na ná nhau
 * ("General coding session"), và người dùng phải mở từng cái mới biết nó
 * thuộc repo nào. `TomTatPhien.duAn` đã có sẵn từ lâu — chỉ là chưa ai dùng
 * để gom.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, FolderGit2, Loader2, MessageSquarePlus, Search, Trash2 } from 'lucide-react';

import { useAppState } from '../../app-state';
import type { AgentPhien } from '../../../shared/ipc';

/** Kéo hẹp hơn thì tiêu đề cụt tới mức vô dụng; rộng hơn thì lấn hội thoại. */
const RONG_MIN = 190;
const RONG_MAX = 460;
const RONG_MAC_DINH = 260;

export function ThanhBen({
  cuocId, onMoPhien, onTaoTab,
}: {
  cuocId: string | null;
  onMoPhien: (id: string) => void;
  onTaoTab: () => void;
}) {
  const { settings, setSetting } = useAppState();
  const [ds, datDs] = useState<AgentPhien[] | null>(null);
  const [tim, datTim] = useState('');
  const [dangKeo, datDangKeo] = useState(false);

  const gap = settings.aiThanhBenGap === true;
  const rong = typeof settings.aiThanhBenRong === 'number'
    ? Math.min(RONG_MAX, Math.max(RONG_MIN, settings.aiThanhBenRong))
    : RONG_MAC_DINH;

  const nap = useCallback(async () => {
    const r = await window.cuongthai?.agent.dsPhien();
    datDs(Array.isArray(r) ? r : []);
  }, []);

  useEffect(() => { void nap(); }, [nap]);
  // Nạp lại khi đổi tab: phiên vừa chạy xong ở tab kia phải xuất hiện.
  useEffect(() => { void nap(); }, [cuocId, nap]);

  /**
   * Kéo để đổi bề rộng.
   *
   * ⚠️ Nghe `pointermove` trên WINDOW chứ không trên cái tay nắm. Chuột đi
   * nhanh hơn tốc độ vẽ thì con trỏ rời khỏi vạch kéo giữa chừng, và nếu chỉ
   * nghe trên tay nắm thì thanh "tuột tay" ngay giữa cú kéo.
   */
  const keoRef = useRef<{ x: number; rong: number } | null>(null);
  useEffect(() => {
    if (!dangKeo) return;
    const di = (e: PointerEvent): void => {
      const b = keoRef.current;
      if (!b) return;
      setSetting('aiThanhBenRong', Math.min(RONG_MAX, Math.max(RONG_MIN, b.rong + (e.clientX - b.x))));
    };
    const tha = (): void => { datDangKeo(false); keoRef.current = null; };
    window.addEventListener('pointermove', di);
    window.addEventListener('pointerup', tha, { once: true });
    return () => {
      window.removeEventListener('pointermove', di);
      window.removeEventListener('pointerup', tha);
    };
  }, [dangKeo, setSetting]);

  /** Gom theo dự án, giữ thứ tự mới-nhất-trước trong từng nhóm. */
  const nhom = useMemo(() => {
    const loc = tim.trim().toLowerCase();
    const co = (ds ?? []).filter((p) => !loc || p.tieuDe.toLowerCase().includes(loc));
    const m = new Map<string, AgentPhien[]>();
    for (const p of co) {
      const k = p.duAn ?? 'Không có dự án';
      const cu = m.get(k);
      if (cu) cu.push(p); else m.set(k, [p]);
    }
    return [...m.entries()];
  }, [ds, tim]);

  const xoa = async (id: string): Promise<void> => {
    await window.cuongthai?.agent.xoaPhien(id);
    datDs((c) => c?.filter((p) => p.id !== id) ?? c);
  };

  if (gap) {
    return (
      <button
        type="button"
        className="ct-tb-mo"
        onClick={() => setSetting('aiThanhBenGap', false)}
        title="Hiện lịch sử"
        aria-label="Hiện lịch sử"
      >
        <ChevronLeft size={14} aria-hidden style={{ transform: 'rotate(180deg)' }} />
      </button>
    );
  }

  return (
    <aside className="ct-tb" style={{ width: rong }} data-keo={dangKeo}>
      <div className="ct-tb-dau">
        <button type="button" className="ct-tb-nut" onClick={onTaoTab} title="Việc mới">
          <MessageSquarePlus size={14} aria-hidden />
        </button>
        <div className="ct-tb-tim">
          <Search size={12} aria-hidden />
          <input
            value={tim}
            placeholder="Tìm việc cũ…"
            onChange={(e) => datTim(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="ct-tb-nut"
          onClick={() => setSetting('aiThanhBenGap', true)}
          title="Ẩn thanh bên"
          aria-label="Ẩn thanh bên"
        >
          <ChevronLeft size={14} aria-hidden />
        </button>
      </div>

      <div className="ct-tb-ds">
        {ds === null && (
          <p className="ct-tb-trong"><Loader2 size={12} className="ct-spin" aria-hidden /> Đang tải…</p>
        )}
        {ds?.length === 0 && <p className="ct-tb-trong">Chưa có việc nào được lưu.</p>}
        {ds && ds.length > 0 && nhom.length === 0 && <p className="ct-tb-trong">Không khớp việc nào.</p>}

        {nhom.map(([duAn, ps]) => (
          <section key={duAn} className="ct-tb-nhom">
            <h3><FolderGit2 size={11} aria-hidden /> {duAn}</h3>
            {ps.map((p) => (
              <div key={p.id} className="ct-tb-muc">
                <button type="button" className="ct-tb-muc-mo" onClick={() => onMoPhien(p.id)} title={p.tieuDe}>
                  {p.tieuDe || 'Việc chưa đặt tên'}
                </button>
                <button
                  type="button"
                  className="ct-tb-muc-xoa"
                  onClick={() => void xoa(p.id)}
                  title="Xoá việc này"
                  aria-label={`Xoá ${p.tieuDe}`}
                >
                  <Trash2 size={12} aria-hidden />
                </button>
              </div>
            ))}
          </section>
        ))}
      </div>

      {/* Vạch kéo. `onPointerDown` ghi lại điểm bắt đầu; phần còn lại nghe
          trên window — xem chú thích ở effect kéo. */}
      <div
        className="ct-tb-keo"
        role="separator"
        aria-orientation="vertical"
        onPointerDown={(e) => {
          keoRef.current = { x: e.clientX, rong };
          datDangKeo(true);
        }}
        onDoubleClick={() => setSetting('aiThanhBenRong', RONG_MAC_DINH)}
        title="Kéo để đổi bề rộng · bấm đúp để về mặc định"
      />
    </aside>
  );
}
