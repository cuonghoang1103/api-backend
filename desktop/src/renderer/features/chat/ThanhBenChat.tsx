/**
 * ============================================================
 * THANH BÊN CỦA CHẾ ĐỘ TRÒ CHUYỆN — kiểu Claude (09/11/2026)
 * ============================================================
 *
 * [Cuộc trò chuyện mới] · ô tìm · thư mục (lọc) · danh sách nhóm theo NGÀY
 * (Đã ghim / Hôm nay / 7 ngày qua / 30 ngày qua / Cũ hơn) · kho lưu trữ.
 * Mỗi dòng có menu ⋯ khi rê: Đổi tên (sửa tại chỗ) · Ghim · Chuyển thư mục ·
 * Tách nhánh · Lưu trữ · Xoá (có hỏi lại).
 *
 * Thu gọn (`chatThanhBenGap`) ⇒ còn một dải hẹp hai nút. Cửa sổ hẹp
 * (`@container ctc` ≤760px, xem `chatClaude.css`) ⇒ thanh bên ẩn, mở bằng nút
 * ở đầu khung chat thành NGĂN KÉO phủ lên, chọn xong tự đóng.
 *
 * ─── VÌ SAO LÀ COMPONENT "CÂM" ───
 * Nó KHÔNG tự gọi máy chủ. Danh sách cuộc, thư mục và phiên đang mở đều sống
 * trong `ChatMode` — chỗ gửi tin, nên là chỗ biết cuộc nào vừa được tạo.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Archive, ArchiveRestore, ChevronLeft, Folder, FolderInput, FolderPlus, GitBranch, MoreHorizontal,
  PanelLeftClose, PanelLeftOpen, Pencil, Pin, PinOff, Plus, Search, Trash2, X,
} from 'lucide-react';

import { useAppState } from '../../app-state';
import { CtcMenu, CtcXacNhan, useCtcMo, type MucCtc } from './CtcMenu';
import { CtcDau } from './CtcDau';
import { NHAN_NHOM, nhomTheoNgay } from './CtcNhomNgay';
import { useCtcChu } from './CtcChu';

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

/** `null` = tất cả · `'none'` = chưa phân loại · `<id>` = một thư mục. */
export type LocThuMuc = null | 'none' | string;

const RONG_MIN = 220;
const RONG_MAX = 420;
const RONG_MAC_DINH = 272;

interface HanhDongPhien {
  onMo: (id: string) => void;
  onXoa: (id: string) => void;
  onGhim: (p: PhienChat) => void;
  onLuuTru: (p: PhienChat) => void;
  onDoiTen: (id: string, ten: string) => void;
  onTachNhanh: (id: string) => void;
  onXepVaoThuMuc: (sid: string, folderId: string | null) => void;
}

function HangPhien({
  p, dangMo, xemLuuTru, dsThuMuc, hd, onChonXong,
}: {
  p: PhienChat;
  dangMo: boolean;
  xemLuuTru: boolean;
  dsThuMuc: ThuMuc[];
  hd: HanhDongPhien;
  onChonXong: () => void;
}) {
  const { c } = useCtcChu();
  const menu = useCtcMo();
  const [suaTen, datSuaTen] = useState<string | null>(null);
  const [hoiXoa, datHoiXoa] = useState(false);
  const ten = p.title?.trim() || c('Cuộc chưa đặt tên');

  const luuTen = (): void => {
    const t = suaTen?.trim();
    datSuaTen(null);
    if (t && t !== ten) hd.onDoiTen(p.id, t);
  };

  const muc: MucCtc[] = [
    { nhan: c('Đổi tên'), icon: <Pencil size={14} aria-hidden />, onChon: () => datSuaTen(ten) },
    {
      nhan: p.pinned === true ? c('Bỏ ghim') : c('Ghim'),
      icon: p.pinned === true ? <PinOff size={14} aria-hidden /> : <Pin size={14} aria-hidden />,
      onChon: () => hd.onGhim(p),
    },
    { nhan: c('Tách nhánh'), icon: <GitBranch size={14} aria-hidden />, onChon: () => hd.onTachNhanh(p.id) },
    {
      nhan: xemLuuTru ? c('Bỏ lưu trữ') : c('Lưu trữ'),
      icon: xemLuuTru ? <ArchiveRestore size={14} aria-hidden /> : <Archive size={14} aria-hidden />,
      onChon: () => hd.onLuuTru(p),
    },
    ...(dsThuMuc.length > 0
      ? [
        { loai: 'tieuDe', nhan: c('Chuyển vào thư mục') } as MucCtc,
        ...dsThuMuc.map((f): MucCtc => ({
          nhan: f.ten,
          icon: <Folder size={14} aria-hidden />,
          chon: p.folderId === f.id,
          onChon: () => hd.onXepVaoThuMuc(p.id, f.id),
        })),
        ...(p.folderId
          ? [{
            nhan: c('Bỏ khỏi thư mục'),
            icon: <FolderInput size={14} aria-hidden />,
            onChon: () => hd.onXepVaoThuMuc(p.id, null),
          } as MucCtc]
          : []),
      ]
      : []),
    { loai: 'vach' },
    { nhan: c('Xoá'), icon: <Trash2 size={14} aria-hidden />, nguyHiem: true, onChon: () => datHoiXoa(true) },
  ];

  return (
    <div className="ctc-hang" data-dangmo={dangMo} data-menu={menu.mo}>
      {suaTen !== null ? (
        <input
          className="ctc-hang-sua"
          autoFocus
          value={suaTen}
          maxLength={200}
          onFocus={(e) => e.currentTarget.select()}
          onChange={(e) => datSuaTen(e.target.value)}
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
            className="ctc-hang-mo"
            onClick={() => { hd.onMo(p.id); onChonXong(); }}
            onDoubleClick={() => datSuaTen(ten)}
            title={ten}
          >
            <span className="ctc-hang-ten">{ten}</span>
          </button>
          <button
            ref={menu.neo}
            type="button"
            className="ctc-hang-menu"
            onClick={(e) => { e.stopPropagation(); menu.bat(); }}
            aria-label={c('Thao tác')}
            title={c('Thao tác')}
            aria-haspopup="menu"
            aria-expanded={menu.mo}
          >
            <MoreHorizontal size={16} aria-hidden />
          </button>
          <CtcMenu mo={menu.mo} onDong={menu.dong} neo={menu.neo} muc={muc} rong={210} nhan={c('Thao tác')} />
        </>
      )}
      {hoiXoa && (
        <CtcXacNhan
          tieuDe={c('Xoá cuộc trò chuyện này?')}
          noiDung={<><strong>{ten}</strong><br />{c('Không thể hoàn tác.')}</>}
          nhanDongY={c('Xoá')}
          nhanHuy={c('Huỷ')}
          onDongY={() => { datHoiXoa(false); hd.onXoa(p.id); }}
          onHuy={() => datHoiXoa(false)}
        />
      )}
    </div>
  );
}

export function ThanhBenChat({
  ds, dangMo, xemLuuTru, onXemLuuTru, onTaoMoi,
  dsThuMuc, loc, onLoc, onTaoThuMuc, onXoaThuMuc,
  ngan, onNgan,
  ...hd
}: {
  ds: PhienChat[];
  dangMo: string | null;
  xemLuuTru: boolean;
  onXemLuuTru: (v: boolean) => void;
  onTaoMoi: () => void;
  dsThuMuc: ThuMuc[];
  loc: LocThuMuc;
  onLoc: (l: LocThuMuc) => void;
  onTaoThuMuc: (ten: string) => void;
  onXoaThuMuc: (id: string) => void;
  /** Ngăn kéo (cửa sổ hẹp) đang mở. */
  ngan: boolean;
  onNgan: (v: boolean) => void;
} & HanhDongPhien) {
  const { c } = useCtcChu();
  const { settings, setSetting } = useAppState();
  const [tim, datTim] = useState('');
  const [dangKeo, datDangKeo] = useState(false);
  const [tenThuMuc, datTenThuMuc] = useState<string | null>(null);

  const gap = settings.chatThanhBenGap === true;
  const rong = typeof settings.chatThanhBenRong === 'number'
    ? Math.min(RONG_MAX, Math.max(RONG_MIN, settings.chatThanhBenRong))
    : RONG_MAC_DINH;

  /** Kéo đổi bề rộng — nghe trên WINDOW để con trỏ chạy nhanh ra ngoài vẫn theo. */
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

  /* Esc đóng ngăn kéo. */
  useEffect(() => {
    if (!ngan) return;
    const phim = (e: KeyboardEvent): void => { if (e.key === 'Escape') onNgan(false); };
    document.addEventListener('keydown', phim);
    return () => document.removeEventListener('keydown', phim);
  }, [ngan, onNgan]);

  const nhom = useMemo(() => {
    const q = tim.trim().toLowerCase();
    const co = q ? ds.filter((p) => (p.title ?? '').toLowerCase().includes(q)) : ds;
    return nhomTheoNgay(co);
  }, [ds, tim]);

  const taoMoi = (): void => { onTaoMoi(); onNgan(false); };
  const luuThuMuc = (): void => {
    const t = tenThuMuc?.trim();
    datTenThuMuc(null);
    if (t) onTaoThuMuc(t);
  };

  const hienBen = !gap || ngan;

  return (
    <>
      {gap && (
        <nav className="ctc-ray" aria-label={c('Mở thanh bên')}>
          <button
            type="button" className="ctc-ray-nut"
            onClick={() => setSetting('chatThanhBenGap', false)}
            title={c('Mở thanh bên')} aria-label={c('Mở thanh bên')}
          >
            <PanelLeftOpen size={18} aria-hidden />
          </button>
          <button
            type="button" className="ctc-ray-nut" data-moi
            data-nut="chatMoi"
            onClick={taoMoi}
            title={c('Cuộc trò chuyện mới')} aria-label={c('Cuộc trò chuyện mới')}
          >
            <Plus size={16} aria-hidden />
          </button>
        </nav>
      )}

      {ngan && <div className="ctc-ben-nen" onPointerDown={() => onNgan(false)} aria-hidden />}

      {hienBen && (
        <aside
          className="ctc-ben"
          style={{ width: rong }}
          data-keo={dangKeo}
          data-ngan={ngan}
          aria-label={c('Cuộc trò chuyện mới')}
        >
          <div className="ctc-ben-dau">
            <span className="ctc-ben-ten"><CtcDau co={18} /> CuongMini</span>
            <button
              type="button" className="ctc-ben-icon ctc-chi-rong"
              onClick={() => setSetting('chatThanhBenGap', true)}
              title={c('Thu gọn thanh bên')} aria-label={c('Thu gọn thanh bên')}
            >
              <PanelLeftClose size={18} aria-hidden />
            </button>
            <button
              type="button" className="ctc-ben-icon ctc-chi-hep"
              onClick={() => onNgan(false)}
              title={c('Thu gọn thanh bên')} aria-label={c('Thu gọn thanh bên')}
            >
              <X size={18} aria-hidden />
            </button>
          </div>

          <button type="button" className="ctc-ben-moi" data-nut="chatMoi" onClick={taoMoi}>
            <span className="ctc-ben-moi-icon"><Plus size={14} strokeWidth={2.6} aria-hidden /></span>
            {c('Cuộc trò chuyện mới')}
          </button>

          <label className="ctc-ben-tim">
            <Search size={15} aria-hidden />
            <input value={tim} placeholder={c('Tìm cuộc trò chuyện…')} onChange={(e) => datTim(e.target.value)} />
            {tim && (
              <button type="button" className="ctc-ben-tim-xoa" onClick={() => datTim('')} aria-label={c('Huỷ')}>
                <X size={13} aria-hidden />
              </button>
            )}
          </label>

          {/* Thư mục: lọc danh sách (máy chủ lọc theo `folderId`). */}
          <div className="ctc-tm">
            <div className="ctc-tm-dau">
              <span>{c('Thư mục')}</span>
              <button
                type="button" className="ctc-ben-icon" data-nho
                onClick={() => datTenThuMuc('')}
                title={c('Thư mục mới…')} aria-label={c('Thư mục mới…')}
              >
                <FolderPlus size={15} aria-hidden />
              </button>
            </div>
            {tenThuMuc !== null && (
              <input
                className="ctc-hang-sua"
                autoFocus
                value={tenThuMuc}
                maxLength={80}
                placeholder={c('Thư mục mới…')}
                onChange={(e) => datTenThuMuc(e.target.value)}
                onBlur={luuThuMuc}
                onKeyDown={(e) => {
                  if (e.nativeEvent.isComposing) return;
                  if (e.key === 'Enter') { e.preventDefault(); luuThuMuc(); }
                  if (e.key === 'Escape') { e.preventDefault(); datTenThuMuc(null); }
                }}
              />
            )}
            {dsThuMuc.length > 0 && (
              <div className="ctc-tm-ds">
                <button type="button" className="ctc-tm-chip" data-chon={loc === null} onClick={() => onLoc(null)}>
                  {c('Tất cả')}
                </button>
                <button type="button" className="ctc-tm-chip" data-chon={loc === 'none'} onClick={() => onLoc('none')}>
                  {c('Chưa phân loại')}
                </button>
                {dsThuMuc.map((f) => (
                  <span key={f.id} className="ctc-tm-o" data-chon={loc === f.id}>
                    <button type="button" className="ctc-tm-chip" data-chon={loc === f.id} onClick={() => onLoc(f.id)}>
                      <Folder size={12} aria-hidden />
                      {f.ten}
                      {!!f._count?.sessions && <span className="ctc-tm-dem">{f._count.sessions}</span>}
                    </button>
                    <button
                      type="button" className="ctc-tm-xoa"
                      onClick={() => onXoaThuMuc(f.id)}
                      title={c('Xoá thư mục (các cuộc bên trong về Chưa phân loại)')}
                      aria-label={c('Xoá thư mục (các cuộc bên trong về Chưa phân loại)')}
                    >
                      <X size={11} aria-hidden />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="ctc-ben-ds">
            {nhom.length === 0 && (
              <p className="ctc-ben-trong">
                {tim.trim()
                  ? c('Không khớp cuộc nào.')
                  : xemLuuTru ? c('Kho lưu trữ đang trống.') : c('Chưa có cuộc trò chuyện nào.')}
              </p>
            )}
            {nhom.map((n) => (
              <section key={n.khoa} className="ctc-nhom">
                <h3>{n.khoa === 'ghim' && <Pin size={11} aria-hidden />}{c(NHAN_NHOM[n.khoa])}</h3>
                {n.ds.map((p) => (
                  <HangPhien
                    key={p.id}
                    p={p}
                    dangMo={p.id === dangMo}
                    xemLuuTru={xemLuuTru}
                    dsThuMuc={dsThuMuc}
                    hd={hd}
                    onChonXong={() => onNgan(false)}
                  />
                ))}
              </section>
            ))}
          </div>

          <button type="button" className="ctc-ben-kho" onClick={() => onXemLuuTru(!xemLuuTru)} data-dang={xemLuuTru}>
            {xemLuuTru
              ? <><ChevronLeft size={14} aria-hidden /> {c('Về danh sách')}</>
              : <><Archive size={14} aria-hidden /> {c('Kho lưu trữ')}</>}
          </button>

          <div
            className="ctc-ben-keo"
            role="separator"
            aria-orientation="vertical"
            onPointerDown={(e) => { keoRef.current = { x: e.clientX, rong }; datDangKeo(true); }}
            onDoubleClick={() => setSetting('chatThanhBenRong', RONG_MAC_DINH)}
          />
        </aside>
      )}
    </>
  );
}
