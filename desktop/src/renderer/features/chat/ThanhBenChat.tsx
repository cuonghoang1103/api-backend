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
  Archive, ArchiveRestore, CalendarClock, Folder, FolderInput, FolderKanban, GitBranch, LayoutGrid, MoreHorizontal,
  PanelLeftClose, PanelLeftOpen, Pencil, Pin, PinOff, Plus, Search, SlidersHorizontal, Trash2, X,
} from 'lucide-react';

import { useAppState } from '../../app-state';
import { CtcMenu, CtcXacNhan, useCtcMo, type MucCtc } from './CtcMenu';
import { CtcDau, CtcWordmark } from './CtcDau';
import type { CtdView } from './CtdTrang';
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
        { loai: 'tieuDe', nhan: c('Chuyển vào dự án') } as MucCtc,
        ...dsThuMuc.map((f): MucCtc => ({
          nhan: f.ten,
          icon: <Folder size={14} aria-hidden />,
          chon: p.folderId === f.id,
          onChon: () => hd.onXepVaoThuMuc(p.id, f.id),
        })),
        ...(p.folderId
          ? [{
            nhan: c('Bỏ khỏi dự án'),
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

const SO_GAN_DAY = 40;
const NAV: Array<{ v: CtdView; nhan: string; Icon: typeof Search }> = [
  { v: 'projects', nhan: 'Dự án', Icon: FolderKanban },
  { v: 'artifacts', nhan: 'Artifacts', Icon: LayoutGrid },
  { v: 'scheduled', nhan: 'Tác vụ đã lên lịch', Icon: CalendarClock },
  { v: 'customize', nhan: 'Tùy chỉnh', Icon: SlidersHorizontal },
];

/**
 * 10/11/2026 — bố cục như claude.ai (và /chat web): logo gấu trúc + wordmark · Tạo mới · Tìm kiếm · Dự án ·
 * Artifacts · Tác vụ đã lên lịch · Tùy chỉnh · "Đã ghim" · "Gần đây" (+ Xem tất cả). Thư mục ⇒ màn Dự án; kho lưu
 * trữ ⇒ màn Lịch sử. Thanh bên luôn hiện danh sách THƯỜNG (không lưu trữ).
 */
export function ThanhBenChat({
  ds, dangMo, view, onView, onTim, onTaoMoi, dsThuMuc, ngan, onNgan,
  ...hd
}: {
  ds: PhienChat[];
  dangMo: string | null;
  view: CtdView;
  onView: (v: CtdView) => void;
  onTim: () => void;
  onTaoMoi: () => void;
  dsThuMuc: ThuMuc[];
  /** Ngăn kéo (cửa sổ hẹp) đang mở. */
  ngan: boolean;
  onNgan: (v: boolean) => void;
} & HanhDongPhien) {
  const { c } = useCtcChu();
  const { settings, setSetting } = useAppState();
  const [dangKeo, datDangKeo] = useState(false);

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

  const { ghim, ganDay } = useMemo(() => {
    const s = [...ds].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return { ghim: s.filter((p) => p.pinned === true), ganDay: s.filter((p) => p.pinned !== true).slice(0, SO_GAN_DAY) };
  }, [ds]);

  const taoMoi = (): void => { onTaoMoi(); onNgan(false); };
  const chuyen = (v: CtdView): void => { onView(v); onNgan(false); };
  const hienBen = !gap || ngan;
  const hang = (p: PhienChat) => (
    <HangPhien key={p.id} p={p} dangMo={view === 'chat' && p.id === dangMo} xemLuuTru={false} dsThuMuc={dsThuMuc} hd={hd} onChonXong={() => onNgan(false)} />
  );

  return (
    <>
      {gap && (
        <nav className="ctc-ray" aria-label={c('Mở thanh bên')}>
          <button type="button" className="ctc-ray-nut" onClick={() => setSetting('chatThanhBenGap', false)} title={c('Mở thanh bên')} aria-label={c('Mở thanh bên')}>
            <PanelLeftOpen size={18} aria-hidden />
          </button>
          <button type="button" className="ctc-ray-nut" data-moi data-nut="chatMoi" onClick={taoMoi} title={c('Cuộc trò chuyện mới')} aria-label={c('Cuộc trò chuyện mới')}>
            <Plus size={16} aria-hidden />
          </button>
          <button type="button" className="ctc-ray-nut" onClick={onTim} title={c('Tìm kiếm')} aria-label={c('Tìm kiếm')}>
            <Search size={16} aria-hidden />
          </button>
        </nav>
      )}

      {ngan && <div className="ctc-ben-nen" onPointerDown={() => onNgan(false)} aria-hidden />}

      {hienBen && (
        <aside className="ctc-ben" style={{ width: rong }} data-keo={dangKeo} data-ngan={ngan} aria-label="CuongMini">
          <div className="ctc-ben-dau">
            <button type="button" className="ctc-ben-ten ctd-logo" onClick={taoMoi} title={c('Cuộc trò chuyện mới')}>
              <CtcDau co={28} /> <CtcWordmark co={19} />
            </button>
            <button type="button" className="ctc-ben-icon ctc-chi-rong" onClick={() => setSetting('chatThanhBenGap', true)} title={c('Thu gọn thanh bên')} aria-label={c('Thu gọn thanh bên')}>
              <PanelLeftClose size={18} aria-hidden />
            </button>
            <button type="button" className="ctc-ben-icon ctc-chi-hep" onClick={() => onNgan(false)} title={c('Thu gọn thanh bên')} aria-label={c('Thu gọn thanh bên')}>
              <X size={18} aria-hidden />
            </button>
          </div>

          <nav className="ctd-nav" aria-label="CuongMini">
            <button type="button" className="ctd-nav-muc ctd-nav-moi" data-nut="chatMoi" onClick={taoMoi}>
              <span className="ctc-ben-moi-icon"><Plus size={14} strokeWidth={2.6} aria-hidden /></span>
              <span>{c('Tạo mới')}</span>
            </button>
            <button type="button" className="ctd-nav-muc" onClick={() => { onTim(); onNgan(false); }}>
              <span className="ctd-nav-ic"><Search size={17} aria-hidden /></span><span>{c('Tìm kiếm')}</span>
            </button>
            {NAV.map(({ v, nhan, Icon }) => (
              <button key={v} type="button" className="ctd-nav-muc" data-on={view === v || (v === 'projects' && view.startsWith('project:'))} onClick={() => chuyen(v)}>
                <span className="ctd-nav-ic"><Icon size={17} aria-hidden /></span><span>{c(nhan)}</span>
              </button>
            ))}
          </nav>

          <div className="ctc-ben-ds">
            {ghim.length > 0 && (
              <section className="ctc-nhom">
                <h3><Pin size={11} aria-hidden />{c('Đã ghim')}</h3>
                {ghim.map(hang)}
              </section>
            )}
            <section className="ctc-nhom">
              <h3 className="ctd-nhom-hang">
                <span>{c('Gần đây')}</span>
                {ds.length > 0 && <button type="button" className="ctd-lien" onClick={() => chuyen('recents')}>{c('Xem tất cả')}</button>}
              </h3>
              {ganDay.map(hang)}
              {ds.length === 0 && <p className="ctc-ben-trong">{c('Chưa có cuộc trò chuyện nào.')}</p>}
            </section>
          </div>

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
