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
 *
 * ─── VÌ SAO MỖI NHÓM GẬP ĐƯỢC (26/09/2026) ───
 * Gom theo dự án rồi vẫn xổ HẾT mọi nhóm thì người có năm dự án vẫn thấy một
 * bức tường vài chục dòng. Nay mỗi nhóm là một khối gập/mở, mặc định gập (trừ
 * nhóm ghim và nhóm chứa việc đang xem), và lựa chọn được nhớ qua lần mở app
 * sau. Luật chọn nhóm nào mở nằm ở `nhomThanhBen.ts` — tách ra để kiểm được.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Archive, ArchiveRestore, ChevronLeft, ChevronRight, ChevronsDownUp, ChevronsUpDown, FolderGit2,
  GitBranch, Loader2, MessageSquarePlus, Pencil, Pin, PinOff, Search, SquarePlus, Trash2,
} from 'lucide-react';

import { useAppState } from '../../app-state';
import type { AgentPhien } from '../../../shared/ipc';
import { MenuChamDoc, type MucMenu } from './MenuChamDoc';
import { mauDuAn } from './mauDuAn';
import {
  KHOA_GHIM, boNho, datMo, giaiMaBangNho, maHoaBangNho, nhomDangMo, type BangNho,
} from './nhomThanhBen';
import { useDich } from '../../i18n';

/** Kéo hẹp hơn thì tiêu đề cụt tới mức vô dụng; rộng hơn thì lấn hội thoại. */
const RONG_MIN = 190;
const RONG_MAX = 460;
const RONG_MAC_DINH = 260;

/** Nhãn nhóm của việc không gắn thư mục nào. Cũng là KHOÁ nhớ gập/mở của nó. */
const KHONG_DU_AN = 'Không có dự án';

/** Một nhóm để vẽ. `khoa` là thứ được nhớ gập/mở; `ten` là thứ hiện ra. */
interface Nhom {
  khoa: string;
  ten: string;
  ps: AgentPhien[];
  laGhim: boolean;
}

export function ThanhBen({
  cuocId, onMoPhien, onMoPhienTabMoi, onTaoTab,
}: {
  cuocId: string | null;
  onMoPhien: (id: string) => void;
  /**
   * Mở việc cũ vào TAB MỚI, giữ nguyên tab đang làm.
   *
   * Người dùng 15/09/2026: *"tôi mở tiếp task B để làm mục khác trong project A
   * không được, nó hiện lại đoạn chat task A"*. Đúng — bấm một việc ở thanh bên
   * CỐ Ý mở vào tab ĐANG XEM (thiết kế cho "đọc lại việc cũ"), nên nó đè lên
   * việc đang làm. Hợp lý khi muốn đọc lại, sai hẳn khi muốn làm song song.
   *
   * Nay có cả hai đường, và đường "tab mới" nằm ngay trong menu ba chấm.
   */
  onMoPhienTabMoi: (id: string) => void;
  onTaoTab: () => void;
}) {
  const { dich } = useDich();
  const { settings, setSetting } = useAppState();
  const [ds, datDs] = useState<AgentPhien[] | null>(null);
  const [tim, datTim] = useState('');
  const [dangKeo, datDangKeo] = useState(false);
  /** Đang đổi tên việc nào, và chữ đang gõ. `null` = không đổi tên gì. */
  const [suaTen, datSuaTen] = useState<{ id: string; ten: string } | null>(null);
  /** Đang xem kho lưu trữ thay vì danh sách thường. */
  const [xemLuuTru, datXemLuuTru] = useState(false);
  /**
   * Việc người dùng vừa bấm mở TỪ thanh bên, và vào tab nào.
   *
   * Cần vì `cuocId` là id của TAB, không phải của việc: mở một việc cũ vào tab
   * đang xem thì tab giữ nguyên id (xem `moPhien` ở shared/ipc), nên chỉ nhìn
   * `cuocId` là không biết tab đó đang hiện việc nào. Tab mới tinh thì hai id
   * trùng nhau — đó là đường lùi ở `idDangXem` bên dưới.
   *
   * `cuoc: null` = mở vào TAB MỚI, chưa biết id tab — gắn vào `cuocId` kế tiếp.
   */
  const [phienDaMo, datPhienDaMo] = useState<{ cuoc: string | null; id: string } | null>(null);
  /** Nhóm gập/mở tay TRONG lúc tìm. Sống tạm — xoá ô tìm là bỏ. */
  const [bangKhiTim, datBangKhiTim] = useState<BangNho>({});

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
  useEffect(() => {
    datPhienDaMo((c) => (c && c.cuoc === null && cuocId ? { ...c, cuoc: cuocId } : c));
  }, [cuocId]);

  const bangNho = useMemo(() => giaiMaBangNho(settings.aiThanhBenNhomMo), [settings.aiThanhBenNhomMo]);
  const ghiBangNho = useCallback((b: BangNho): void => {
    setSetting('aiThanhBenNhomMo', maHoaBangNho(b));
  }, [setSetting]);

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
  const nhom = useMemo((): Nhom[] => {
    const loc = tim.trim().toLowerCase();
    const co = (ds ?? [])
      .filter((p) => (p.luuTru === true) === xemLuuTru)
      .filter((p) => !loc || p.tieuDe.toLowerCase().includes(loc));

    const daGhim = co.filter((p) => p.ghim === true);
    const m = new Map<string, AgentPhien[]>();
    for (const p of co) {
      if (p.ghim === true) continue;
      const k = p.duAn ?? KHONG_DU_AN;
      const cu = m.get(k);
      if (cu) cu.push(p); else m.set(k, [p]);
    }
    const ra: Nhom[] = [...m.entries()].map(([k, v]) => ({ khoa: k, ten: k, ps: v, laGhim: false }));
    return daGhim.length > 0 ? [{ khoa: KHOA_GHIM, ten: 'Đã ghim', ps: daGhim, laGhim: true }, ...ra] : ra;
  }, [ds, tim, xemLuuTru]);

  /** Việc đang hiện ở tab đang xem — xem chú thích `phienDaMo`. */
  const idDangXem = phienDaMo && phienDaMo.cuoc === cuocId ? phienDaMo.id : cuocId;
  /** Nhóm chứa việc đó. Việc chưa lưu lần nào thì chưa có trong `ds` ⇒ `null`. */
  const khoaDangXem = useMemo(() => {
    const p = ds?.find((x) => x.id === idDangXem);
    if (!p) return null;
    return p.ghim === true ? KHOA_GHIM : (p.duAn ?? KHONG_DU_AN);
  }, [ds, idDangXem]);

  /**
   * Việc đang xem chuyển sang một nhóm người dùng đã GẬP ⇒ bỏ cái gập đó.
   *
   * Chỉ chạy khi NHÓM đổi, không chạy khi bảng nhớ đổi: người dùng cố ý gập
   * chính nhóm đang làm thì phải gập được, không thì nút gập của nhóm đó chết.
   * Đọc bảng nhớ qua ref vì cùng lý do.
   */
  const bangNhoRef = useRef(bangNho);
  bangNhoRef.current = bangNho;
  useEffect(() => {
    if (khoaDangXem && bangNhoRef.current[khoaDangXem] === false) {
      ghiBangNho(boNho(bangNhoRef.current, khoaDangXem));
    }
  }, [khoaDangXem, ghiBangNho]);

  const dangTim = tim.trim() !== '';
  const laMo = (khoa: string): boolean => nhomDangMo({ khoa, khoaDangXem, dangTim, bangNho, bangKhiTim });

  const batNhom = (khoa: string): void => {
    const moi = !laMo(khoa);
    if (dangTim) datBangKhiTim((b) => ({ ...b, [khoa]: moi }));
    else ghiBangNho(datMo(bangNho, khoa, moi));
  };

  /** Còn nhóm nào mở ⇒ nút đầu danh sách là "Thu gọn tất cả", hết thì "Mở tất cả". */
  const coNhomMo = nhom.some((n) => laMo(n.khoa));
  const batTatCa = (): void => {
    const moi = !coNhomMo;
    if (dangTim) {
      datBangKhiTim(Object.fromEntries(nhom.map((n) => [n.khoa, moi])));
      return;
    }
    ghiBangNho(nhom.reduce((b, n) => datMo(b, n.khoa, moi), bangNho));
  };

  const moPhien = (id: string): void => {
    datPhienDaMo({ cuoc: cuocId, id });
    onMoPhien(id);
  };

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
    if (ban) moPhien(ban.id);
  };

  const mucMenu = (p: AgentPhien): MucMenu[] => [
    {
      /* Đặt ĐẦU danh sách: làm song song hai việc trong cùng một dự án là nhu
         cầu thường xuyên hơn hẳn ghim hay đổi tên. */
      nhan: 'Mở vào tab mới',
      icon: <SquarePlus size={13} aria-hidden />,
      onChon: () => { datPhienDaMo({ cuoc: null, id: p.id }); onMoPhienTabMoi(p.id); },
    },
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
        title={dich('Hiện lịch sử')}
        aria-label={dich('Hiện lịch sử')}
      >
        <ChevronLeft size={14} aria-hidden style={{ transform: 'rotate(180deg)' }} />
      </button>
    );
  }

  return (
    <aside className="ct-tb" style={{ width: rong }} data-keo={dangKeo}>
      <div className="ct-tb-dau">
        <button type="button" className="ct-tb-nut" onClick={onTaoTab} title={dich('Việc mới')}>
          <MessageSquarePlus size={14} aria-hidden />
        </button>
        <div className="ct-tb-tim">
          <Search size={12} aria-hidden />
          <input
            value={tim}
            placeholder={dich('Tìm việc cũ…')}
            onChange={(e) => {
              datTim(e.target.value);
              // Xoá ô tìm ⇒ bỏ mọi gập/mở tạm, trở về đúng trạng thái đã nhớ.
              if (e.target.value.trim() === '') datBangKhiTim({});
            }}
          />
        </div>
        <button
          type="button"
          className="ct-tb-nut"
          onClick={() => setSetting('aiThanhBenGap', true)}
          title={dich('Ẩn thanh bên')}
          aria-label={dich('Ẩn thanh bên')}
        >
          <ChevronLeft size={14} aria-hidden />
        </button>
      </div>

      <div className="ct-tb-ds">
        {ds === null && (
          <p className="ct-tb-trong"><Loader2 size={12} className="ct-spin" aria-hidden /> {dich('Đang tải…')}</p>
        )}
        {ds?.length === 0 && <p className="ct-tb-trong">{dich('Chưa có việc nào được lưu.')}</p>}
        {ds && ds.length > 0 && nhom.length === 0 && (
          <p className="ct-tb-trong">
            {tim.trim()
              ? 'Không khớp việc nào.'
              : xemLuuTru ? 'Kho lưu trữ đang trống.' : 'Chưa có việc nào được lưu.'}
          </p>
        )}

        {nhom.length > 1 && (
          /* Dòng tóm tắt + nút gập/mở TẤT CẢ. Chỉ hiện khi có từ hai nhóm: một
             nhóm thì nút của chính nhóm đó đã làm đúng việc này. */
          <div className="ct-tb-tongquan">
            <span>
              {nhom.reduce((t, n) => t + n.ps.length, 0)} việc · {nhom.filter((n) => !n.laGhim).length} dự án
            </span>
            <button type="button" className="ct-tb-tatca" onClick={batTatCa}>
              {coNhomMo
                ? <><ChevronsDownUp size={11} aria-hidden /> {dich('Thu gọn tất cả')}</>
                : <><ChevronsUpDown size={11} aria-hidden /> {dich('Mở tất cả')}</>}
            </button>
          </div>
        )}

        {nhom.map(({ khoa, ten, ps, laGhim }) => {
          const mo = laMo(khoa);
          const idThan = `ct-tb-than-${encodeURIComponent(khoa)}`;
          return (
          <section key={khoa} className="ct-tb-nhom" data-mo={mo}>
            {/* `data-mau` suy từ TÊN dự án — xem `mauDuAn.ts`. Nhóm ghim giữ
                màu riêng, vì "đã ghim" là trạng thái chứ không phải dự án. */}
            <h3 data-mau={laGhim ? 'ghim' : mauDuAn(ten)}>
              {/* Nút gốc (`<button>`) nên Enter/Space, Tab, và trình đọc màn
                  hình đều có sẵn — không tự bắt phím. */}
              <button
                type="button"
                className="ct-tb-nhom-nut"
                aria-expanded={mo}
                aria-controls={idThan}
                onClick={() => batNhom(khoa)}
                title={mo ? `Thu gọn ${ten}` : `Mở ${ps.length} việc của ${ten}`}
              >
                <ChevronRight size={12} className="ct-tb-nhom-mui" aria-hidden />
                {laGhim ? <Pin size={11} aria-hidden /> : <FolderGit2 size={11} aria-hidden />}
                <span className="ct-tb-nhom-ten">{ten}</span>
                <span className="ct-tb-nhom-dem" aria-label={`${ps.length} việc`}>{ps.length}</span>
              </button>
            </h3>
            {/* Hai lớp để trượt mượt: lớp ngoài chuyển `grid-template-rows`
                0fr ↔ 1fr, lớp trong `min-height: 0` + `overflow: hidden`. Cách
                này KHÔNG cần đo chiều cao bằng JS như kiểu `max-height`.
                ⚠️ `inert` lúc gập: mục bị ẩn bằng CSS vẫn nằm trong thứ tự Tab,
                và người dùng bàn phím sẽ nhảy vào những nút không nhìn thấy. */}
            <div
              id={idThan}
              className="ct-tb-nhom-than"
              data-mo={mo}
              ref={(el) => { if (el) el.inert = !mo; }}
            >
              <div className="ct-tb-nhom-ruot">
                {ps.map((p) => (
                  <div key={p.id} className="ct-tb-muc" data-dangmo={p.id === idDangXem}>
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
                          onClick={() => moPhien(p.id)}
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
              </div>
            </div>
          </section>
          );
        })}
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
            ? <><ChevronLeft size={12} aria-hidden /> {dich('Về danh sách')}</>
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
        title={dich('Kéo để đổi bề rộng · bấm đúp để về mặc định')}
      />
    </aside>
  );
}
