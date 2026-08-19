/**
 * ============================================================
 * THANH BÊN CỦA CHẾ ĐỘ TRÒ CHUYỆN — cuộc đã lưu, nhóm theo thư mục
 * ============================================================
 *
 * Chế độ Lập trình đã có thanh bên từ 19/08; chế độ Trò chuyện thì lịch sử vẫn
 * nằm sau một nút, mở ra là một tấm phủ che mất hội thoại. Người dùng yêu cầu
 * đúng một điều: cho cả hai bên giống nhau.
 *
 * ─── VÌ SAO LÀ COMPONENT "CÂM" ───
 * Nó KHÔNG tự gọi máy chủ. Toàn bộ danh sách cuộc, thư mục và phiên đang mở
 * đều đã sống trong `ChatMode` — nó là chỗ gửi tin, nên nó là chỗ biết cuộc
 * nào vừa được tạo. Cho thanh bên tự nạp một bản sao nữa là dựng lên hai kho
 * cho cùng một sự thật, và kho nào cập nhật trước thì màn hình nhấp nháy theo
 * kho đó. Ở đây chỉ có vẽ và bấm.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Archive, ArchiveRestore, ChevronLeft, FolderOpen, GitBranch, MessageSquarePlus,
  Pencil, Pin, PinOff, Search, Trash2,
} from 'lucide-react';

import { useAppState } from '../../app-state';
import { MenuChamDoc, type MucMenu } from './MenuChamDoc';

export interface ThuMuc {
  id: string;
  ten: string;
  mau: string | null;
  _count?: { sessions: number };
}

export interface PhienChat {
  id: string;
  title: string | null;
  updatedAt: string;
  folderId: string | null;
  /** Ghim lên đầu. Máy chủ sắp sẵn, nhưng thanh bên vẫn tự gom nhóm. */
  pinned?: boolean;
  /** Mốc cất đi. `null` = đang hiện trong danh sách thường. */
  archivedAt?: string | null;
  _count?: { messages: number };
  folder?: { id: string; ten: string; mau: string | null } | null;
}

const RONG_MIN = 190;
const RONG_MAX = 460;
const RONG_MAC_DINH = 250;

/** "3 phút trước" — mốc tuyệt đối không giúp nhận ra cuộc nào là cuộc nào. */
function baoLau(iso: string): string {
  const luc = new Date(iso).getTime();
  if (!Number.isFinite(luc)) return '';
  const giay = Math.max(0, (Date.now() - luc) / 1000);
  if (giay < 60) return 'vừa xong';
  if (giay < 3600) return `${Math.floor(giay / 60)} phút trước`;
  if (giay < 86400) return `${Math.floor(giay / 3600)} giờ trước`;
  if (giay < 172800) return 'hôm qua';
  return new Date(luc).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
}

export function ThanhBenChat({
  ds, dangMo, xemLuuTru, onXemLuuTru, onMo, onTaoMoi, onXoa, onGhim, onLuuTru, onDoiTen, onTachNhanh,
}: {
  ds: PhienChat[];
  dangMo: string | null;
  xemLuuTru: boolean;
  onXemLuuTru: (v: boolean) => void;
  onMo: (id: string) => void;
  onTaoMoi: () => void;
  onXoa: (id: string) => void;
  onGhim: (p: PhienChat) => void;
  onLuuTru: (p: PhienChat) => void;
  onDoiTen: (id: string, ten: string) => void;
  onTachNhanh: (id: string) => void;
}) {
  const { settings, setSetting } = useAppState();
  const [tim, datTim] = useState('');
  const [dangKeo, datDangKeo] = useState(false);
  const [suaTen, datSuaTen] = useState<{ id: string; ten: string } | null>(null);

  const gap = settings.chatThanhBenGap === true;
  const rong = typeof settings.chatThanhBenRong === 'number'
    ? Math.min(RONG_MAX, Math.max(RONG_MIN, settings.chatThanhBenRong))
    : RONG_MAC_DINH;

  /** Kéo đổi bề rộng — nghe trên WINDOW, xem chú thích cùng chỗ trong ThanhBen. */
  const keoRef = useRef<{ x: number; rong: number } | null>(null);
  useEffect(() => {
    if (!dangKeo) return;
    const di = (e: PointerEvent): void => {
      const b = keoRef.current;
      if (!b) return;
      setSetting('chatThanhBenRong', Math.min(RONG_MAX, Math.max(RONG_MIN, b.rong + (e.clientX - b.x))));
    };
    const tha = (): void => { datDangKeo(false); keoRef.current = null; };
    window.addEventListener('pointermove', di);
    window.addEventListener('pointerup', tha, { once: true });
    return () => {
      window.removeEventListener('pointermove', di);
      window.removeEventListener('pointerup', tha);
    };
  }, [dangKeo, setSetting]);

  const ten = (p: PhienChat): string => p.title?.trim() || 'Cuộc chưa đặt tên';

  /**
   * Gom nhóm: đã ghim lên đầu, còn lại theo THƯ MỤC.
   *
   * `ds` đã được máy chủ lọc theo lưu trữ rồi (`?archived=1`), nên ở đây chỉ
   * lọc theo ô tìm. Lọc lại lần nữa bằng `archivedAt` là mời một lỗi lệch:
   * app cũ chưa có trường đó sẽ thấy danh sách trống trơn.
   */
  const nhom = useMemo(() => {
    const loc = tim.trim().toLowerCase();
    const co = ds.filter((p) => !loc || ten(p).toLowerCase().includes(loc));
    const daGhim = co.filter((p) => p.pinned === true);
    const m = new Map<string, PhienChat[]>();
    for (const p of co) {
      if (p.pinned === true) continue;
      const k = p.folder?.ten ?? 'Chưa phân loại';
      const cu = m.get(k);
      if (cu) cu.push(p); else m.set(k, [p]);
    }
    const ra: Array<[string, PhienChat[], boolean]> = [...m.entries()].map(([k, v]) => [k, v, false]);
    return daGhim.length > 0
      ? [['Đã ghim', daGhim, true] as [string, PhienChat[], boolean], ...ra]
      : ra;
  }, [ds, tim]);

  const luuTen = (): void => {
    const t = suaTen;
    datSuaTen(null);
    if (t) onDoiTen(t.id, t.ten);
  };

  const mucMenu = (p: PhienChat): MucMenu[] => [
    {
      nhan: p.pinned === true ? 'Bỏ ghim' : 'Ghim lên đầu',
      icon: p.pinned === true ? <PinOff size={13} aria-hidden /> : <Pin size={13} aria-hidden />,
      onChon: () => onGhim(p),
    },
    { nhan: 'Đổi tên', icon: <Pencil size={13} aria-hidden />, onChon: () => datSuaTen({ id: p.id, ten: ten(p) }) },
    { nhan: 'Tách nhánh', icon: <GitBranch size={13} aria-hidden />, onChon: () => onTachNhanh(p.id) },
    {
      nhan: xemLuuTru ? 'Bỏ lưu trữ' : 'Lưu trữ',
      icon: xemLuuTru ? <ArchiveRestore size={13} aria-hidden /> : <Archive size={13} aria-hidden />,
      onChon: () => onLuuTru(p),
    },
    { nhan: 'Xoá', icon: <Trash2 size={13} aria-hidden />, nguyHiem: true, onChon: () => onXoa(p.id) },
  ];

  if (gap) {
    return (
      <button
        type="button"
        className="ct-tb-mo"
        onClick={() => setSetting('chatThanhBenGap', false)}
        title="Hiện lịch sử trò chuyện"
        aria-label="Hiện lịch sử trò chuyện"
      >
        <ChevronLeft size={14} aria-hidden style={{ transform: 'rotate(180deg)' }} />
      </button>
    );
  }

  return (
    <aside className="ct-tb" style={{ width: rong }} data-keo={dangKeo}>
      <div className="ct-tb-dau">
        <button type="button" className="ct-tb-nut" onClick={onTaoMoi} title="Cuộc mới">
          <MessageSquarePlus size={14} aria-hidden />
        </button>
        <div className="ct-tb-tim">
          <Search size={12} aria-hidden />
          <input value={tim} placeholder="Tìm cuộc cũ…" onChange={(e) => datTim(e.target.value)} />
        </div>
        <button
          type="button"
          className="ct-tb-nut"
          onClick={() => setSetting('chatThanhBenGap', true)}
          title="Ẩn thanh bên"
          aria-label="Ẩn thanh bên"
        >
          <ChevronLeft size={14} aria-hidden />
        </button>
      </div>

      <div className="ct-tb-ds">
        {nhom.length === 0 && (
          <p className="ct-tb-trong">
            {tim.trim()
              ? 'Không khớp cuộc nào.'
              : xemLuuTru ? 'Kho lưu trữ đang trống.' : 'Chưa có cuộc nào được lưu.'}
          </p>
        )}

        {nhom.map(([nhanNhom, ps, laGhim]) => (
          <section key={nhanNhom} className="ct-tb-nhom">
            <h3>
              {laGhim ? <Pin size={11} aria-hidden /> : <FolderOpen size={11} aria-hidden />}
              {' '}{nhanNhom}
            </h3>
            {ps.map((p) => (
              <div key={p.id} className="ct-tb-muc" data-dangmo={p.id === dangMo}>
                {suaTen?.id === p.id ? (
                  /* `autoFocus` cố ý: mở ô đổi tên ra là để gõ ngay. Dự án không
                     cài plugin jsx-a11y nên đừng thêm chỉ thị tắt rule của nó —
                     eslint báo lỗi "rule not found" cho chính dòng chỉ thị đó. */
                  <input
                    className="ct-tb-doiten"
                    autoFocus
                    value={suaTen.ten}
                    maxLength={200}
                    onChange={(e) => datSuaTen({ id: p.id, ten: e.target.value })}
                    onBlur={luuTen}
                    onKeyDown={(e) => {
                      if (e.nativeEvent.isComposing) return;   // nhường Enter cho bộ gõ tiếng Việt
                      if (e.key === 'Enter') { e.preventDefault(); luuTen(); }
                      if (e.key === 'Escape') { e.preventDefault(); datSuaTen(null); }
                    }}
                  />
                ) : (
                  <>
                    <button
                      type="button"
                      className="ct-tb-muc-mo"
                      onClick={() => onMo(p.id)}
                      onDoubleClick={() => datSuaTen({ id: p.id, ten: ten(p) })}
                      title={`${ten(p)}\n(bấm đúp để đổi tên)`}
                    >
                      {p.pinned === true && !laGhim && (
                        <span className="ct-tb-ghim"><Pin size={10} aria-hidden /></span>
                      )}
                      {ten(p)}
                      <span className="ct-tb-muc-phu">
                        {p._count?.messages ?? 0} tin · {baoLau(p.updatedAt)}
                      </span>
                    </button>
                    <MenuChamDoc muc={mucMenu(p)} nhan={`Thao tác với ${ten(p)}`} />
                  </>
                )}
              </div>
            ))}
          </section>
        ))}
      </div>

      <button
        type="button"
        className="ct-tb-kho"
        onClick={() => onXemLuuTru(!xemLuuTru)}
        data-dang={xemLuuTru}
      >
        {xemLuuTru
          ? <><ChevronLeft size={12} aria-hidden /> Về danh sách</>
          : <><Archive size={12} aria-hidden /> Kho lưu trữ</>}
      </button>

      <div
        className="ct-tb-keo"
        role="separator"
        aria-orientation="vertical"
        onPointerDown={(e) => { keoRef.current = { x: e.clientX, rong }; datDangKeo(true); }}
        onDoubleClick={() => setSetting('chatThanhBenRong', RONG_MAC_DINH)}
        title="Kéo để đổi bề rộng · bấm đúp để về mặc định"
      />
    </aside>
  );
}
