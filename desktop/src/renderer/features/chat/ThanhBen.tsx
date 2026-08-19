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
import {
  Archive, ArchiveRestore, ChevronLeft, FolderGit2, GitBranch, Loader2, MessageSquarePlus,
  Pencil, Pin, PinOff, Search, Trash2,
} from 'lucide-react';

import { useAppState } from '../../app-state';
import type { AgentPhien } from '../../../shared/ipc';
import { MenuChamDoc, type MucMenu } from './MenuChamDoc';

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
  /** Đang đổi tên việc nào, và chữ đang gõ. `null` = không đổi tên gì. */
  const [suaTen, datSuaTen] = useState<{ id: string; ten: string } | null>(null);
  /** Đang xem kho lưu trữ thay vì danh sách thường. */
  const [xemLuuTru, datXemLuuTru] = useState(false);

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

  /** Bao nhiêu việc đang nằm trong kho lưu trữ — để nút vào kho nói ra con số. */
  const soLuuTru = useMemo(() => (ds ?? []).filter((p) => p.luuTru === true).length, [ds]);

  /**
   * Gom nhóm để hiện.
   *
   * Ba tầng lọc, theo đúng thứ tự này:
   *   1. lưu trữ — danh sách thường và kho lưu trữ là HAI màn tách hẳn
   *   2. ô tìm
   *   3. gom: việc ĐÃ GHIM lên một nhóm riêng trên cùng, còn lại theo dự án
   *
   * Ghim tách thành nhóm riêng chứ không nổi lên trong nhóm dự án của nó: cả
   * lý do người ta ghim là để không phải nhớ việc đó thuộc repo nào.
   */
  const nhom = useMemo(() => {
    const loc = tim.trim().toLowerCase();
    const co = (ds ?? [])
      .filter((p) => (p.luuTru === true) === xemLuuTru)
      .filter((p) => !loc || p.tieuDe.toLowerCase().includes(loc));

    const daGhim = co.filter((p) => p.ghim === true);
    const m = new Map<string, AgentPhien[]>();
    for (const p of co) {
      if (p.ghim === true) continue;
      const k = p.duAn ?? 'Không có dự án';
      const cu = m.get(k);
      if (cu) cu.push(p); else m.set(k, [p]);
    }
    const ra: Array<[string, AgentPhien[], boolean]> = [...m.entries()].map(([k, v]) => [k, v, false]);
    return daGhim.length > 0 ? [['Đã ghim', daGhim, true] as [string, AgentPhien[], boolean], ...ra] : ra;
  }, [ds, tim, xemLuuTru]);

  const xoa = async (id: string): Promise<void> => {
    await window.cuongthai?.agent.xoaPhien(id);
    datDs((c) => c?.filter((p) => p.id !== id) ?? c);
  };

  /* Sửa TẠI CHỖ trong danh sách rồi mới ghi đĩa: chờ một vòng IPC mới thấy
     cái ghim đổi màu thì cú bấm có cảm giác trượt. Ghi hỏng thì `nap()` ở
     dòng sau kéo lại sự thật từ đĩa. */
  const doiCo = async (id: string, sua: Partial<AgentPhien>): Promise<void> => {
    datDs((c) => c?.map((p) => (p.id === id ? { ...p, ...sua } : p)) ?? c);
  };

  const ghim = async (p: AgentPhien): Promise<void> => {
    const bat = p.ghim !== true;
    await doiCo(p.id, { ghim: bat });
    await window.cuongthai?.agent.ghimPhien(p.id, bat);
    await nap();
  };

  const luuTru = async (p: AgentPhien): Promise<void> => {
    const bat = p.luuTru !== true;
    await doiCo(p.id, { luuTru: bat });
    await window.cuongthai?.agent.luuTruPhien(p.id, bat);
    await nap();
  };

  const luuTen = async (): Promise<void> => {
    const t = suaTen;
    datSuaTen(null);
    if (!t) return;
    await window.cuongthai?.agent.doiTenPhien(t.id, t.ten);
    await nap();
  };

  /**
   * Tách nhánh TRỌN việc, rồi MỞ bản mới ra.
   *
   * Tạo mà không mở thì người dùng bấm xong thấy danh sách dài thêm một dòng
   * và không biết mình vừa làm gì — nhất là khi bản sao xếp theo thời gian nên
   * nó nằm ngay trên bản gốc, trông như hàng bị nhân đôi.
   */
  const tachNhanh = async (id: string): Promise<void> => {
    const ban = await window.cuongthai?.agent.nhanBanPhien(id);
    await nap();
    if (ban) onMoPhien(ban.id);
  };

  const mucMenu = (p: AgentPhien): MucMenu[] => [
    {
      nhan: p.ghim === true ? 'Bỏ ghim' : 'Ghim lên đầu',
      icon: p.ghim === true ? <PinOff size={13} aria-hidden /> : <Pin size={13} aria-hidden />,
      onChon: () => void ghim(p),
    },
    {
      nhan: 'Đổi tên',
      icon: <Pencil size={13} aria-hidden />,
      onChon: () => datSuaTen({ id: p.id, ten: p.tieuDe }),
    },
    {
      nhan: 'Tách nhánh',
      icon: <GitBranch size={13} aria-hidden />,
      onChon: () => void tachNhanh(p.id),
    },
    {
      nhan: p.luuTru === true ? 'Bỏ lưu trữ' : 'Lưu trữ',
      icon: p.luuTru === true
        ? <ArchiveRestore size={13} aria-hidden />
        : <Archive size={13} aria-hidden />,
      onChon: () => void luuTru(p),
    },
    {
      nhan: 'Xoá',
      icon: <Trash2 size={13} aria-hidden />,
      nguyHiem: true,
      onChon: () => void xoa(p.id),
    },
  ];

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
        {ds && ds.length > 0 && nhom.length === 0 && (
          <p className="ct-tb-trong">
            {tim.trim()
              ? 'Không khớp việc nào.'
              : xemLuuTru ? 'Kho lưu trữ đang trống.' : 'Chưa có việc nào được lưu.'}
          </p>
        )}

        {nhom.map(([ten, ps, laGhim]) => (
          <section key={ten} className="ct-tb-nhom">
            <h3>
              {laGhim ? <Pin size={11} aria-hidden /> : <FolderGit2 size={11} aria-hidden />}
              {' '}{ten}
            </h3>
            {ps.map((p) => (
              <div key={p.id} className="ct-tb-muc">
                {suaTen?.id === p.id ? (
                  /* `autoFocus` cố ý: mở ô đổi tên ra là để gõ ngay. Dự án không
                     cài plugin jsx-a11y nên đừng thêm chỉ thị tắt rule của nó —
                     eslint báo lỗi "rule not found" cho chính dòng chỉ thị đó. */
                  <input
                    className="ct-tb-doiten"
                    autoFocus
                    value={suaTen.ten}
                    maxLength={90}
                    onChange={(e) => datSuaTen({ id: p.id, ten: e.target.value })}
                    /* Rời ô = lưu. Bấm ra ngoài rồi mất chữ vừa gõ là kiểu hỏng
                       khiến người ta không dám dùng tính năng đổi tên nữa. */
                    onBlur={() => void luuTen()}
                    onKeyDown={(e) => {
                      // Nhường phím cho bộ gõ tiếng Việt — Enter lúc đang ghép
                      // dấu là Enter CHỌN CHỮ, không phải Enter xác nhận.
                      if (e.nativeEvent.isComposing) return;
                      if (e.key === 'Enter') { e.preventDefault(); void luuTen(); }
                      if (e.key === 'Escape') { e.preventDefault(); datSuaTen(null); }
                    }}
                  />
                ) : (
                  <>
                    <button
                      type="button"
                      className="ct-tb-muc-mo"
                      onClick={() => onMoPhien(p.id)}
                      onDoubleClick={() => datSuaTen({ id: p.id, ten: p.tieuDe })}
                      title={`${p.tieuDe}\n(bấm đúp để đổi tên)`}
                    >
                      {p.ghim === true && !laGhim && (
                        <span className="ct-tb-ghim"><Pin size={10} aria-hidden /></span>
                      )}
                      {p.tieuDe || 'Việc chưa đặt tên'}
                    </button>
                    <MenuChamDoc muc={mucMenu(p)} nhan={`Thao tác với ${p.tieuDe}`} />
                  </>
                )}
              </div>
            ))}
          </section>
        ))}
      </div>

      {/* Lối vào kho lưu trữ. Đặt ở CHÂN thanh bên chứ không phải trong menu:
          lưu trữ mà không có đường quay lại nhìn thấy được thì nó không khác gì
          xoá — người dùng cất một việc đi rồi không tìm ra nó ở đâu nữa. */}
      {(soLuuTru > 0 || xemLuuTru) && (
        <button
          type="button"
          className="ct-tb-kho"
          onClick={() => datXemLuuTru((v) => !v)}
          data-dang={xemLuuTru}
        >
          {xemLuuTru
            ? <><ChevronLeft size={12} aria-hidden /> Về danh sách</>
            : <><Archive size={12} aria-hidden /> Kho lưu trữ ({soLuuTru})</>}
        </button>
      )}

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
