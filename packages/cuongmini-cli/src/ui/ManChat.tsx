/**
 * MÀN CHAT — điều phối: phím, gửi câu hỏi, hàng chờ, lệnh `/`, `!` shell,
 * `#` ghi nhớ, dán ảnh, gợi ý `/`/`@`, thẻ duyệt, menu, xem lại bảng ghi,
 * thông báo, cổng dự phòng, đăng nhập lại; vẽ vùng cuộn (`<Static>`) + vùng sống.
 *
 * Mọi phím đi qua MỘT `useInput` ở đây và được chia theo thứ tự ưu tiên:
 * màn xem lại → hộp đang mở (menu/mật khẩu/đăng nhập) → thẻ duyệt → phím toàn
 * cục → gợi ý → ô nhập. Nhiều `useInput` rải rác sẽ cùng nhận một phím và giẫm nhau.
 */
import { appendFileSync, readFileSync } from 'node:fs';
import { Box, Static, measureElement, useApp, useInput, useStdout, type DOMElement } from 'ink';
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type MutableRefObject } from 'react';
import { chuanHoa, dsCauHoi, locPhien, type MucGhi, type PhienCu } from 'ct-lenh';
import { hoiCtworkMotLan, laLoiXacThucCtw, veDongCtw, type DongCtw, type GiaoDienCtw } from '../../../../desktop/src/renderer/features/chat/ctworkLenh';
import { docAnhDataUrl, guiThangDuoc, tachAnh } from '../anh';
import { danAnhTuClipboard } from '../anhDan';
import { timTrinhDuyet } from '../../../cuongmini-core/src/timTrinhDuyet';
import { CAC_MUC, docCaiDat, ghiCaiDat, luaChon, moTaGiaTri, nenBatTrinhDuyet, tenMuc, type CaiDat, type MucLuaChon } from '../caiDat';
import { datNgonNgu, doNgonNgu, L, ngonNgu, nhacNgonNguTraLoi } from '../i18n';
import { chiTietAgent, chiTietShell, dongBangPhu, dongTomTat, veDongBang } from '../bangPhu';
import { cauTrangThai } from '../trangThai';
import { bangPhimTat, moLenh, thamSoLenh } from '../lenhMoTa';
import { CHE_DO, cheDoKe, moTaCheDo, quyetDoiCheDo } from '../cheDo';
import { lenhCaiChoMay } from '../capNhat';
import { fileQuyUoc, luuGhiNho, tachGhiNho } from '../ghiNho';
import type { KetNoiLoi } from '../ketNoi';
import type { CongNangCap, KhoChat, MucBang } from '../kho';
import { nhanKieu, quetDuAn, type KyHieu } from '../kyHieu';
import { canAscii, datAscii } from '../kyTu';
import { LENH_GOI_Y, MODEL_DU_PHONG, MUC_DU_PHONG, chayLenh, giaoDienCtw, moModel, tenMuc as tenMucNoLuc, tenModel, tenNhomCong, moPhien, tachLenhCli, type BoiCanhLenh, type ModelMuc, type MucNoLuc } from '../lenh';
import { veLogo } from '../logo';
import { XOA_KHUNG, capNhatTong, nenBatChuot, catKhung, chuoiDoiCheDo, chuoiDoiChuot, cuon as cuonViTri, datTomTatPhien, docChuot, xoaSach, type ViTriCuon } from '../toanManHinh';
import { giay } from '../trangThai';
import { THUONG_HIEU, dam, datTheme, doTheme, mau, mo } from '../mau';
import { damBaoThuMuc, duongLichSu, thuMucGoc, xoaPhien, type NguoiDung } from '../phien';
import { chayShell, dungNguCanhShell, type LanChayShell } from '../shell';
import { guiThongBaoHeThong, rungChuong } from '../thongBao';
import { chiMucDuAn, diemMo, phuLucNhac, timMo, tokenNhac } from '../timFile';
import { dungBanGhi, veManMoDau, veMuc, type ThongTinMoDau } from '../veBang';
import { veMarkdown } from '../markdown';
import { Text } from './chu';
import { doTerminalPhim, goiYXuongDong, laXuongDong, tachPhimDon } from '../banPhim';
import { ManDangNhap } from './ManDangNhap';
import * as ST from './soanThao';
import {
  ChanTrang, DongHenCho, DongTrangThai, GoiYView, TheHoi, HangCho, MenuView, ONhapNho, ONhapView, ShellDangChay, TheDuyet, VungSong, XemBanGhi, soCuaMuc,
  dongKeHoachGon, luaChonDuyet, type MucGoiY, type MucMenu,
} from './thanhPhan';
import { kieuVien } from '../kyTu';

type Hop =
  | { loai: 'menu'; tieuDe: string; moTa?: string; than?: string; ds: MucMenu[]; chon: number; loc: string; coLoc: boolean; mauVien?: string; khiChon: (m: MucMenu) => void; khiHuy?: () => void; boLoc?: (q: string) => MucMenu[] }
  | { loai: 'matKhau'; tieuDe: string; moTa: string; giaTri: string; khiXong: (mk: string) => void }
  | { loai: 'dangNhap'; nhacNho?: string }
  | { loai: 'banGhi'; cheDo: 'cuon' | 'tool'; dau: number; chonKhoi: number; moRong: Set<number>; ganCuoi: boolean }
  /** Màn chi tiết một agent phụ / lệnh nền (Enter trong bảng agent phụ). */
  | { loai: 'chiTiet'; id: string; dau: number; ganCuoi: boolean; tatCa: boolean };

/** Bảng agent phụ đang được chọn bằng phím (↓ từ ô nhập trống, hoặc /tasks). */
interface BangPhuChon { chon: number; tatCa: boolean }

interface GoiY { kieu: '/' | '@'; ds: MucGoiY[]; chon: number; dau: number; /** Người dùng đã chọn bằng ↑/↓ ⇒ Enter nhận gợi ý. */ daChon?: boolean }

const RONG_BANG = 40;
const COT_HIEN_BANG = 110;
/** Lượt dài hơn ngần này ⇒ rung chuông / báo hệ điều hành khi xong. */
const LUOT_DAI_MS = 30_000;
/** Lệnh `/` gửi câu hỏi cho agent (hoặc đổi hội thoại) — lúc đang chạy thì xếp hàng thay vì chạy ngay. */
const LENH_CAN_RANH = ['/plan', '/review', '/init', '/diff', '/clear', '/resume', '/rewind', '/compact', '/undo'];

/**
 * State đọc được NGAY qua ref: phím đến dồn dập (gõ nhanh, giữ phím) có thể tới
 * trước khi React vẽ lại — đọc state qua closure lúc đó là đọc bản cũ và mất ký tự.
 */
function useStateRef<T>(dau: T): [MutableRefObject<T>, (v: T | ((c: T) => T)) => void] {
  const ref = useRef(dau);
  const [, ve] = useState(0);
  const dat = useCallback((v: T | ((c: T) => T)) => {
    ref.current = typeof v === 'function' ? (v as (c: T) => T)(ref.current) : v;
    ve((n) => n + 1);
  }, []);
  return [ref, dat];
}

function useKichThuoc(): [number, number] {
  const { stdout } = useStdout();
  const [k, setK] = useState<[number, number]>([stdout.columns || 100, stdout.rows || 30]);
  useEffect(() => {
    const f = () => setK([stdout.columns || 100, stdout.rows || 30]);
    stdout.on('resize', f);
    return () => { stdout.off('resize', f); };
  }, [stdout]);
  return k;
}

function docLichSu(): string[] {
  try {
    return readFileSync(duongLichSu(), 'utf8').split('\n').filter(Boolean).slice(-500).map(ST.giaiMaDong);
  } catch {
    return [];
  }
}

export interface PropsManChat {
  kn: KetNoiLoi;
  kho: KhoChat;
  thuMuc: string;
  phienBan: string;
  cauHoiDau: string;
  banMoi: string | null;
  ngoaiTuyen: boolean;
  /** `--resume`: mở bảng chọn việc cũ ngay khi vào. */
  chonViecCu?: boolean;
  /** Khi thoát: in lời chào cuối rồi mới tắt tiến trình. */
  onThoat: (loiNhan?: string) => void;
  /** Mở ở toàn màn hình (main.tsx đã vào alternate screen). */
  toanManHinh?: boolean;
}

export function ManChat({ kn, kho, thuMuc, phienBan, cauHoiDau, banMoi, ngoaiTuyen, chonViecCu, onThoat, toanManHinh = false }: PropsManChat) {
  /** Phím xuống dòng đúng với terminal đang dùng (gợi ý dưới ô nhập khi đang gõ). */
  // KHÔNG useMemo([]): đổi /language giữa phiên thì gợi ý phải đổi theo (QA 18/10: "⇧⏎ xuống dòng" trong giao diện English).
  const xuongDong = goiYXuongDong(doTerminalPhim(process.env), L);
  useSyncExternalStore(useCallback((f) => kho.nghe(f), [kho]), () => kho.phienBan);
  const S = kho.S;
  const { exit } = useApp();
  // `write` của Ink: xoá khung động → ghi → vẽ lại khung. Mọi chuỗi điều khiển màn hình đi qua đây,
  // ghi thẳng `stdout.write` thì Ink không biết và lần vẽ sau xoá lệch dòng (khung trùng).
  const { stdout, write: ghiInk } = useStdout();
  const [cot, hang] = useKichThuoc();
  const [fsRef, setFs] = useStateRef(toanManHinh);
  /** Vị trí cuộn của bảng ghi ở toàn màn hình. */
  const viTri = useRef<ViTriCuon>({ cuon: 0, tong: 0, moi: 0 });
  const khungRef = useRef<DOMElement>(null);
  const caoKhung = useRef(10);
  const [, datDoKhung] = useState(0);
  const daNhacBoiDen = useRef(false);
  const batDauPhien = useRef(Date.now());
  const boNhoDong = useRef(new Map<number, { k: string; d: string[] }>());
  const [oRef, setO] = useStateRef<ST.ONhap>(ST.rong());
  const [goiYRef, setGoiY] = useStateRef<GoiY | null>(null);
  const [hopRef, setHop] = useStateRef<Hop | null>(null);
  const [chonDuyetRef, setChonDuyet] = useStateRef(0);
  /** Đợt 3 — thẻ hỏi lựa chọn: câu đang hỏi, ô đang chọn, nhãn đã đánh dấu, câu trả lời đã gom, đang gõ "Khác". */
  const [hoiRef, setHoiUi] = useStateRef<{ id: string; buoc: number; chon: number; danh: string[]; tra: Array<{ chon: string[]; khac?: string }>; khac: boolean } | null>(null);
  const [hangChoRef, setHangCho] = useStateRef<string[]>([]);
  const [bangPhuRef, setBangPhu] = useStateRef<BangPhuChon | null>(null);
  const [shellRef, setShell] = useStateRef<{ lenh: string; ra: string; batDau: number; huy: () => void } | null>(null);
  const [hienKeHoach, setHienKeHoach] = useState(true);
  const [nhac, setNhac] = useState('');
  const [nhip, setNhip] = useState(0);
  /** Đợt 5: dòng CT Work dưới ô nhập (lõi đệm 5 phút — hỏi bao nhiêu lần cũng chỉ đọc đệm). */
  const [dongCtw, setDongCtw] = useState<DongCtw | null>(null);
  const caiDat = useRef<CaiDat>(docCaiDat());
  const lichSu = useRef(new ST.LichSu(docLichSu()));
  const chiMuc = useRef<string[] | null>(null);
  const kyHieu = useRef<KyHieu[] | null>(null);
  const dangNapChiMuc = useRef(false);
  const lanCtrlC = useRef(0);
  const theDuyetHien = useRef<{ id: string; luc: number }>({ id: '', luc: 0 });
  const lanEsc = useRef(0);
  const henNhac = useRef<NodeJS.Timeout | null>(null);
  /** Kết quả lệnh `!` chưa gửi model — đính vào câu hỏi kế tiếp. */
  const shellChoGui = useRef<LanChayShell[]>([]);
  /** Ảnh dán từ clipboard: `[Ảnh #n]` trong ô nhập ⇒ file PNG tạm. */
  const anhDan = useRef<Map<number, string>>(new Map());
  const soAnhDan = useRef(0);
  /** Terminal đang được nhìn không (báo qua chuỗi focus `ESC[I`/`ESC[O`). Chưa biết ⇒ coi như đang nhìn. */
  const dangNhin = useRef(true);

  const baoNhanh = (chu: string, ms = 2500) => {
    setNhac(chu);
    if (henNhac.current) clearTimeout(henNhac.current);
    henNhac.current = setTimeout(() => setNhac(''), ms);
  };

  // Nhịp cho biểu tượng xoay — chỉ chạy khi có việc (đứng yên thì không vẽ lại vô ích).
  const coViec = S.dangChay || Boolean(shellRef.current);
  useEffect(() => {
    if (!coViec) return undefined;
    const h = setInterval(() => setNhip((n) => n + 1), 120);
    return () => clearInterval(h);
  }, [coViec]);

  // Báo focus: terminal gửi ESC[I khi được nhìn, ESC[O khi rời đi (xterm, iTerm2, VS Code, Windows Terminal…).
  useEffect(() => {
    if (!stdout.isTTY) return undefined;
    stdout.write('\x1b[?1004h');
    const tat = () => { try { stdout.write('\x1b[?1004l'); } catch { /* đã đóng */ } };
    process.once('exit', tat);
    return () => { tat(); process.off('exit', tat); };
  }, [stdout]);

  /*
   * ĐỔI CỠ CỬA SỔ (lỗi "khung nhập trùng 3 lần" của 0.3.0). Terminal REFLOW các dòng đã vẽ:
   * hẹp lại thì một dòng rộng gãy thành hai, mà Ink chỉ xoá đúng số dòng nó nhớ ⇒ sót bản cũ.
   * Nghe SAU Ink (Ink đã vẽ một khung theo cỡ cũ): toàn màn hình ⇒ xoá khung rồi Ink vẽ lại
   * ngay; in nối tiếp ⇒ đợi người dùng kéo xong (150ms) rồi xoá sạch + in lại bảng ghi.
   */
  useEffect(() => {
    if (!stdout.isTTY) return undefined;
    let hen: NodeJS.Timeout | null = null;
    const f = () => {
      if (fsRef.current) { ghiInk(XOA_KHUNG); return; }
      if (hen) clearTimeout(hen);
      hen = setTimeout(() => { hen = null; if (!fsRef.current) { ghiInk(XOA_KHUNG); kho.veLai(); } }, 150); // đợt 4: không ESC[3J khi đổi cỡ (iTerm2 hỏi)
    };
    stdout.on('resize', f);
    return () => { stdout.off('resize', f); if (hen) clearTimeout(hen); };
  }, [stdout, ghiInk, kho, fsRef]);

  // Chiều cao thật của khung cuộn (sau khi Yoga xếp) — để PgUp/PgDn lật đúng một trang.
  useEffect(() => {
    if (!khungRef.current) return;
    const h = measureElement(khungRef.current).height;
    // Đổi chiều cao khung ⇒ vẽ lại một lần (cách xếp trên/đáy phụ thuộc nó); bằng nhau thì dừng.
    if (h > 0 && h !== caoKhung.current) { caoKhung.current = h; datDoKhung((n) => n + 1); }
  });

  // Tóm tắt phiên in ra màn hình thường khi thoát toàn màn hình (alternate screen mất hết nội dung).
  useEffect(() => {
    datTomTatPhien(() => {
      const soCau = S.muc.filter((m) => m.kieu === 'nguoi').length;
      if (!soCau) return '';
      const file = Object.keys(S.fileDaSua);
      const phan = [
        L(`${soCau} câu hỏi`, `${soCau} question${soCau > 1 ? 's' : ''}`),
        file.length ? L(`${file.length} file đã sửa`, `${file.length} file${file.length > 1 ? 's' : ''} changed`) : '',
        S.tienPhien > 0 ? `~$${S.tienPhien < 0.1 ? S.tienPhien.toFixed(3) : S.tienPhien.toFixed(2)}` : '',
        giay(Date.now() - batDauPhien.current),
      ].filter(Boolean);
      /* TOÀN BỘ bản ghi (câu hỏi + trả lời + tool gọn) in ra màn hình THƯỜNG khi thoát toàn màn hình —
         alternate screen mất sạch khi đóng, nên đây là chỗ duy nhất người dùng cuộn lại/chép được về sau. */
      const rong = Math.max(30, (process.stdout.columns || 100) - 1);
      kho.dayNhom();
      const banGhi: string[] = [];
      S.bang.forEach((m, i) => { if (m.loai !== 'chao') banGhi.push(...veMuc(m, rong, S.bang[i - 1])); });
      const ra = [...banGhi, '', `${mau(THUONG_HIEU.tim)('✻')} ${dam(S.tieuDe || L('Việc chưa đặt tên', 'Untitled task'))} ${mo(`· ${phan.join(' · ')}`)}`];
      for (const f of file.slice(0, 6)) {
        const d = S.fileDaSua[f]!;
        ra.push(`  ${mo('·')} ${f} ${mau('#4ade80')(`+${d.them}`)} ${mau('#f87171')(`−${d.bo}`)}`);
      }
      if (file.length > 6) ra.push(mo(L(`  … +${file.length - 6} file nữa`, `  … +${file.length - 6} more`)));
      return ra.join('\n');
    });
    // KHÔNG gỡ khi unmount: main đọc tóm tắt SAU khi Ink đã tháo cây (thoát = unmount).
  }, [S]);

  const baoChuY = useCallback((tieuDe: string, noiDung: string) => {
    const c = caiDat.current.thongBao;
    if (c === 'tat') return;
    rungChuong();
    if (c === 'heThong' && !dangNhin.current) guiThongBaoHeThong(tieuDe, noiDung);
  }, []);

  // ─── Model / mức / chế độ ──────────────────────────────────────

  const dsModel = useCallback((): ModelMuc[] => (S.info?.models?.length ? S.info.models : MODEL_DU_PHONG).map((m) => ({ ...m, ten: tenModel(m) })), [S]);
  const dsMuc = useCallback((): MucNoLuc[] => (S.info?.mucNoLuc?.length
    ? S.info.mucNoLuc.map((m) => ({ id: m.id, ten: tenMucNoLuc(m.id, m.ten), mo: L(`${m.buoc} bước${m.viecPhu ? ` · ${m.viecPhu} agent phụ` : ''}`, `${m.buoc} steps${m.viecPhu ? ` · ${m.viecPhu} subagent${m.viecPhu === 1 ? '' : 's'}` : ''}`) }))
    : MUC_DU_PHONG), [S]);
  const modelNay = dsModel().find((x) => x.id === (S.ws?.model ?? S.info?.model)) ?? dsModel()[0];
  const mucNay = dsMuc().find((x) => x.id === (S.ws?.mucNoLuc ?? 'vua'));

  const doiModel = async (id: string) => {
    await kn.goi('agent:datModel', { model: id });
    S.info = await kn.goi('agent:getInfo').catch(() => S.info) as typeof S.info;
    S.ws = { ...(S.ws ?? {}), model: id };
    kho.bao(true);
  };
  const doiMuc = async (id: string) => {
    await kn.goi('agent:datMucNoLuc', { muc: id });
    S.ws = { ...(S.ws ?? {}), mucNoLuc: id };
    kho.bao(true);
  };
  /* Đợt 4: đổi chế độ khi đang chạy ⇒ HOÃN tới cuối lượt (lõi từ chối đổi giữa lượt) — xem `quyetDoiCheDo`. */
  const cheDoCho = useRef<string | null>(null);
  const lucDuyet = useRef<number | null>(null);
  const doiCheDo = async (id: string) => {
    if (S.dangChay) {
      cheDoCho.current = id;
      kho.thongBao(L(`Sẽ đổi sang "${CHE_DO.find((c) => c.id === id)?.ten ?? id}" khi lượt này xong.`, `Will switch to "${CHE_DO.find((c) => c.id === id)?.ten ?? id}" when this turn ends.`));
      return;
    }
    const ws = await kn.goi<typeof S.ws>('agent:datCheDoQuyen', { cheDo: id });
    if (ws) S.ws = ws;
    kho.bao(true);
  };
  useEffect(() => {
    if (S.dangChay || !cheDoCho.current) return;
    const id = cheDoCho.current;
    cheDoCho.current = null;
    void doiCheDo(id).catch((e: Error) => kho.thongBao(e.message, 'loi'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [S.dangChay]);

  const xoayCheDo = () => {
    const q = quyetDoiCheDo({ dangChay: S.dangChay, vuaDuyetMs: lucDuyet.current, bayGio: Date.now() });
    if (q === 'boQua') return;
    const ke = cheDoKe(cheDoCho.current ?? S.ws?.cheDoQuyen);
    if (ke === 'boQuaHet') {
      setHop({
        loai: 'menu', tieuDe: L('⚠ Bật chế độ "Bỏ qua hết"?', '⚠ Turn on "Bypass permissions"?'), mauVien: '#f87171',
        moTa: L('CuongMini sẽ sửa file và chạy MỌI lệnh — kể cả lệnh nguy hiểm — mà không hỏi. Shell đọc được .env, khoá SSH, token… Chỉ bật trong thư mục bạn tin tưởng.', 'CuongMini will edit files and run EVERY command — including dangerous ones — without asking. The shell can read .env, SSH keys, tokens… Only use this in folders you trust.'),
        ds: [{ nhan: L('Không, về "Lập kế hoạch"', 'No, switch to "Plan mode"'), giaTri: 'khong' }, { nhan: L('Có, bật "Bỏ qua hết"', 'Yes, enable "Bypass permissions"'), giaTri: 'co' }],
        chon: 0, loc: '', coLoc: false,
        khiChon: (m) => { void doiCheDo(m.giaTri === 'co' ? 'boQuaHet' : 'keHoach').catch((e: Error) => kho.thongBao(e.message, 'loi')); },
      });
      return;
    }
    void doiCheDo(ke).catch((e: Error) => kho.thongBao(e.message, 'loi'));
  };

  /** /clear: toàn màn hình chỉ cần xoá khung (Ink vẽ lại); in nối tiếp thì xoá cả lịch sử cuộn. */
  const xoaManHinh = () => { ghiInk(fsRef.current ? XOA_KHUNG : xoaSach()); };

  /**
   * Vẽ lại TOÀN BỘ bảng ghi (ctrl+l, đổi cỡ cửa sổ). Toàn màn hình: chỉ cần vẽ lại khung. In nối tiếp:
   * xoá màn hình + lịch sử cuộn QUA Ink rồi in lại — `ESC[2J` một mình ở iTerm2 đẩy bản cũ vào
   * scrollback (lỗi 0.3.0: /language để lại banner + menu cũ phía trên bản mới).
   */
  const veLaiHet = () => {
    if (!fsRef.current) ghiInk(xoaSach());
    kho.veLai();
  };

  /**
   * Đổi ngôn ngữ/theme. Toàn màn hình: vẽ lại cả khung ngay. In nối tiếp: KHÔNG in lại phần đã in
   * (in lại là cách duy nhất để chữ cũ đổi theo, và cũng là chỗ sinh bản trùng) — chỉ phần in từ giờ đổi.
   */
  const apGiaoDienMoi = (chu: string) => {
    if (fsRef.current) kho.veLai();
    kho.thongBao(fsRef.current ? chu : `${chu} ${L('(áp dụng cho phần in từ giờ — /fullscreen để vẽ lại cả màn hình)', '(applies to new output — /fullscreen redraws the whole screen)')}`, 'ok');
  };

  const doiNgonNgu = (n: 'vi' | 'en') => {
    caiDat.current = { ...caiDat.current, ngonNgu: n };
    ghiCaiDat(caiDat.current);
    datNgonNgu(n);
    apGiaoDienMoi(L('Đã chuyển giao diện sang Tiếng Việt. Gõ /language để đổi lại.', 'Interface switched to English. Type /language to switch back.'));
  };

  const doiTheme = (t: 'tuDong' | 'toi' | 'sang') => {
    caiDat.current = { ...caiDat.current, theme: t };
    ghiCaiDat(caiDat.current);
    datTheme(t === 'tuDong' ? doTheme(process.env) : t);
    apGiaoDienMoi(`${tenMuc('theme')}: ${moTaGiaTri('theme', caiDat.current)}`);
  };

  /** /fullscreen on|off (không tham số = đảo). Lưu cài đặt; đổi ngay, không cần mở lại. */
  /** /mouse on|off (không tham số = đảo). Lưu cài đặt; đổi ngay nếu đang toàn màn hình. */
  const datChuot = (bat?: boolean) => {
    const moi = bat ?? caiDat.current.chuot !== 'bat';
    caiDat.current = { ...caiDat.current, chuot: moi ? 'bat' : 'tat' };
    ghiCaiDat(caiDat.current);
    const chuoi = chuoiDoiChuot(moi);
    if (chuoi) ghiInk(chuoi);
    kho.thongBao(moi
      ? L('Bắt chuột: BẬT — con lăn cuộn chính xác; bôi đen chép chữ phải giữ Option (iTerm2) · Fn (Terminal macOS) · Shift (Linux).', 'Mouse capture: ON — precise wheel scrolling; to select text hold Option (iTerm2) · Fn (macOS Terminal) · Shift (Linux).')
      : L('Bắt chuột: TẮT — kéo chuột bôi đen / chuột phải chép như terminal thường; con lăn và ↑/↓ (ô nhập trống) vẫn cuộn bản ghi.', 'Mouse capture: OFF — drag to select / right-click to copy as usual; the wheel and ↑/↓ (empty input) still scroll the transcript.'), 'ok');
  };

  const datToanManHinh = (bat?: boolean) => {
    const moi = bat ?? !fsRef.current;
    caiDat.current = { ...caiDat.current, toanManHinh: moi ? 'bat' : 'tat' };
    ghiCaiDat(caiDat.current);
    if (moi === fsRef.current) { kho.thongBao(L(`Toàn màn hình đang ${moi ? 'bật' : 'tắt'}.`, `Fullscreen is already ${moi ? 'on' : 'off'}.`)); return; }
    ghiInk(chuoiDoiCheDo(moi));
    setFs(moi);
    viTri.current = { cuon: 0, tong: 0, moi: 0 };
    // Tắt: màn hình thường vừa được xoá sạch ⇒ in lại toàn bộ bảng ghi bằng <Static> mới.
    kho.veLai();
    kho.thongBao(moi
      ? (nenBatChuot()
        ? L('Toàn màn hình: BẬT — cuộn bằng con lăn/PgUp/PgDn. Bôi đen chép chữ: giữ Option (iTerm2) · Fn (Terminal macOS) · Shift (Linux).', 'Fullscreen: ON — scroll with the wheel/PgUp/PgDn. To select text hold Option (iTerm2) · Fn (macOS Terminal) · Shift (Linux).')
        : L('Toàn màn hình: BẬT — cuộn bằng con lăn, ↑/↓ (ô nhập trống), PgUp/PgDn; kéo chuột bôi đen chép như thường. Lịch sử câu hỏi: ctrl+↑/↓.', 'Fullscreen: ON — scroll with the wheel, ↑/↓ (empty input), PgUp/PgDn; drag to select & copy as usual. Prompt history: ctrl+↑/↓.'))
      : L('Toàn màn hình: TẮT — in nối tiếp vào lịch sử terminal như cũ.', 'Fullscreen: OFF — printing inline into the terminal scrollback.'), 'ok');
  };

  // ─── Gửi ───────────────────────────────────────────────────────

  const guiThat = useCallback((text: string, op: { chiDoc?: boolean; hienThi?: string }) => {
    // Ảnh dán: `[Ảnh #n]` ⇒ file tạm; còn lại (đường kéo vào, @a.png) do `tachAnh` lo.
    const anhThem: string[] = [];
    let t0 = text.replace(/\[Ảnh #(\d+)\]/g, (m, so: string) => {
      const p = anhDan.current.get(Number(so));
      if (!p) return m;
      anhThem.push(p);
      return `[ảnh dán #${so}]`; // i18n-bo-qua: chữ gửi model
    });
    // Kết quả lệnh `!` người dùng tự chạy ⇒ đi kèm câu hỏi này (lõi không có kênh thêm ngữ cảnh riêng).
    const nguCanhShell = dungNguCanhShell(shellChoGui.current);
    shellChoGui.current = [];
    const { text: t2, anh, daNhac } = tachAnh(t0, thuMuc);
    t0 = t2;
    const tatCaAnh = [...anhThem, ...anh].slice(0, 8);
    // /language ⇒ "AI trả lời bằng ngôn ngữ này": thêm một dòng nhắc, cùng cách phụ lục `@file`.
    const nhacNN = caiDat.current.traLoiTheoNgonNgu === 'bat' ? nhacNgonNguTraLoi() : '';
    const cauGui = (nguCanhShell + phuLucNhac(t0, daNhac)).slice(0, 8000 - nhacNN.length) + nhacNN;
    kho.batDauLuot(op.hienThi ?? text, tatCaAnh.length, text);
    void (async () => {
      try {
        const dataAnh = await Promise.all(tatCaAnh.map(async (p) => {
          const d = docAnhDataUrl(p);
          return guiThangDuoc(d) ? d : kn.chuanHoaAnh(d);
        }));
        await kn.goi('agent:send', { text: cauGui, ...(dataAnh.length ? { anh: dataAnh } : {}), ...(op.chiDoc ? { chiDoc: true } : {}) });
      } catch (e) {
        kho.ketLuot('', true);
        kho.thongBao((e as Error).message, 'loi');
      }
    })();
  }, [kho, kn, thuMuc]);

  const thoat = (loiNhan?: string) => {
    shellRef.current?.huy();
    // Trình duyệt AI được đóng (có chờ) ở `main` qua `dongKetNoiDangMo()` trước khi tắt tiến trình.
    onThoat(loiNhan);
    exit();
  };

  // ─── Menu ──────────────────────────────────────────────────────

  const menu = (h: Omit<Extract<Hop, { loai: 'menu' }>, 'loai' | 'loc' | 'coLoc' | 'chon'> & { chon?: number; coLoc?: boolean }) => {
    setHop({ loai: 'menu', loc: '', coLoc: h.coLoc ?? false, chon: h.chon ?? 0, ...h });
  };

  /** Các dòng bảng agent phụ hiện tại (main + agent phụ + lệnh nền). */
  const dongPhu = (tatCa: boolean) => dongBangPhu(S, {
    viec: S.dangChay ? `${cauTrangThai(S)}…` : L('Đang chờ bạn', 'Waiting for you'), batDau: S.batDauLuot, dangChay: S.dangChay, tienUsd: S.tienPhien,
  }, { tatCa });

  const moBanGhi = (cheDo: 'cuon' | 'tool', moHet = false) => {
    const { khoi } = dungBanGhi(S.bang, Math.max(30, cot - 3), new Set());
    if (cheDo === 'tool' && !khoi.length) { baoNhanh(L('Chưa có đầu ra lệnh/tool nào để mở.', 'No command/tool output to open yet.')); return; }
    setHop({ loai: 'banGhi', cheDo, dau: 0, chonKhoi: Math.max(0, khoi.length - 1), moRong: new Set(moHet ? khoi.map((k) => k.id) : []), ganCuoi: true });
  };

  // ─── Cổng Claude chính hãng / modelapi (docs/cong-anthropic-chinh-hang.md mục 9) ───

  const hoiMatKhauCong = (cong: 'anthropic' | 'modelapi', lyDo: string, sauKhi: () => Promise<unknown> | void) => {
    const laCH = cong === 'anthropic';
    setHop({
      loai: 'matKhau', giaTri: '',
      tieuDe: laCH ? '🔒 CuongMini Code Max' : '🔒 CuongMini Core',
      moTa: `${lyDo}\n${L('Nhập mật khẩu quản trị cấp cho cổng này (Enter mở khoá · Esc bỏ qua).', 'Enter the admin-issued password for this gateway (Enter to unlock · Esc to skip).')}`,
      khiXong: (mk) => {
        kho.thongBao(L('Đang mở khoá…', 'Unlocking…'));
        // Mỗi cổng một mật khẩu + một vé riêng; lõi lưu vé và gửi kèm mọi lượt.
        const mo = laCH ? kn.moCongAnthropic(mk).then((r) => r.ten) : kn.moDuPhong(mk);
        mo.then(async (ten) => {
          kho.thongBao(L(`Đã mở khoá ${ten || (laCH ? 'CuongMini Code Max' : 'CuongMini Core')}.`, `Unlocked ${ten || (laCH ? 'CuongMini Code Max' : 'CuongMini Core')}.`), 'ok');
          await sauKhi();
        }).catch((e: Error) => kho.thongBao(L(`Không mở khoá được: ${e.message}`, `Could not unlock: ${e.message}`), 'loi'));
      },
    });
  };

  /** Xác nhận model đắt (`dat`) trước, rồi mới làm `lam`. */
  const xacNhanDat = (m: { ten: string; dat?: boolean }, lam: () => void) => {
    if (!m.dat) { lam(); return; }
    menu({
      tieuDe: L(`${m.ten} tốn nhiều hơn hẳn các model khác. Vẫn chọn?`, `${m.ten} costs much more than the others. Use it anyway?`), mauVien: '#fbbf24',
      ds: [{ nhan: L('Không', 'No'), giaTri: 'khong' }, { nhan: L('Có, dùng model này', 'Yes, use this model'), giaTri: 'co' }],
      khiChon: (x) => { if (x.giaTri === 'co') lam(); },
    });
  };

  /** Model 🔒 (cổng chính hãng, chưa có vé): mật khẩu ⇒ vé ⇒ datModel ⇒ getInfo (làm mới ổ khoá). */
  /* 18/10/2026: model cần KHOÁ (khoá chung hoặc khoá riêng Invisible — máy chủ tự nhận) ⇒ ô nhập ẩn ký
     tự ⇒ đúng thì sáng lên (getInfo) và chọn luôn. */
  const moKhoaModel = (id: string) => {
    const mm = dsModel().find((x) => x.id === id);
    if (!mm) return;
    xacNhanDat(mm, () => setHop({
      loai: 'matKhau', giaTri: '',
      tieuDe: L(`🔒 ${mm.ten}`, `🔒 ${mm.ten}`),
      moTa: L('Model này cần khoá do quản trị cấp (Enter mở khoá · Esc bỏ qua). Vé sống 48 giờ.', 'This model needs an admin-issued key (Enter to unlock · Esc to skip). The pass lasts 48 hours.'),
      khiXong: (mk) => {
        kho.thongBao(L('Đang mở khoá…', 'Unlocking…'));
        kn.moCongAnthropic(mk, id)
          .then(async () => {
            await doiModel(id);
            kho.thongBao(L(`Đã mở khoá — Model: ${mm.ten}`, `Unlocked — Model: ${mm.ten}`), 'ok');
          })
          .catch((e: Error) => kho.thongBao(L(`Không mở khoá được: ${e.message}`, `Could not unlock: ${e.message}`), 'loi'));
      },
    }));
  };

  /** Lời mời / bảng chọn cổng: từ `CONG_CHINH_HONG_FREE.cacCong`, không có thì hỏi lõi (`agent:congAnthropic`). */
  const moMenuCong = async () => {
    let cacCong: CongNangCap[] = S.moiCong?.cacCong ?? [];
    if (!cacCong.length) {
      const tt = await kn.goi<{ cacCong?: CongNangCap[] } | null>('agent:congAnthropic').catch(() => null);
      cacCong = tt?.cacCong ?? [];
    }
    if (!cacCong.length) { kho.thongBao(L('Máy chủ chưa mở cổng phụ nào cho tài khoản này (hoặc lõi bản cũ).', 'The server has no extra gateways for this account (or the core is outdated).'), 'canh'); return; }
    const dangFree = Boolean(S.moiCong);
    const ds: MucMenu[] = [];
    if (dangFree) ds.push({ nhom: 'CuongMini Free', nhan: L('Ở lại CuongMini Free', 'Stay on CuongMini Free'), mo: L('miễn phí trong hạn mức — tự về cổng chính khi nó sống lại', 'free within quota — returns to the main gateway when it recovers'), giaTri: 'o:' });
    for (const c of cacCong) {
      const nhom = c.cong === 'anthropic' ? tenNhomCong('anthropic') : c.ten || tenNhomCong('modelapi');
      if (!c.daBat) { ds.push({ nhom, nhan: L('Quản trị chưa bật cổng này', 'The admin has not enabled this gateway'), tat: true, giaTri: `x:${c.cong}` }); continue; }
      for (const m of c.models) {
        ds.push({
          nhom, nhan: `${c.canMatKhau ? '🔒 ' : ''}${m.ten}${m.dat ? ' 💸' : ''}`,
          mo: m.dungDuoc ? m.mo : L('chưa dùng được trên máy chủ', 'not available on the server'), tat: !m.dungDuoc, giaTri: `${c.cong}:${m.id}`,
        });
      }
    }
    if (!dangFree) ds.push({ nhom: tenNhomCong('chinh'), nhan: L('Về cổng chính', 'Back to the main gateway'), mo: L('dùng model đang chọn của tài khoản', 'use the account\'s selected model'), giaTri: 've:' });
    menu({
      tieuDe: dangFree ? L('Cổng chính đang gặp sự cố — chọn cổng cho các câu sau', 'The main gateway is down — pick a gateway for the next messages') : L('Chọn cổng AI', 'Pick an AI gateway'),
      moTa: L('🔒 = cần mật khẩu quản trị cấp (mỗi cổng một mật khẩu). Áp dụng từ câu hỏi kế tiếp.', '🔒 = needs an admin-issued password (one per gateway). Applies from your next message.'),
      ds, chon: Math.max(0, ds.findIndex((m) => !m.tat)),
      khiChon: (m) => {
        const k = m.giaTri.indexOf(':');
        const [cong, id] = [m.giaTri.slice(0, k), m.giaTri.slice(k + 1)];
        if (cong === 'o') { S.moiCong = null; kho.thongBao(L('Ở lại CuongMini Free.', 'Staying on CuongMini Free.')); return; }
        if (cong === 've') { void kn.datCongPhu(null).then(() => kho.thongBao(L('Đã về cổng chính.', 'Back on the main gateway.'), 'ok')).catch((e: Error) => kho.thongBao(e.message, 'loi')); return; }
        const c = cacCong.find((x) => x.cong === cong);
        const mm = c?.models.find((x) => x.id === id);
        if (!c || !mm) return;
        const xong = () => { S.moiCong = null; kho.thongBao(L(`Từ câu hỏi kế tiếp: ${mm.ten} (${c.ten}).`, `From your next message: ${mm.ten} (${c.ten}).`), 'ok'); };
        // (a) chính hãng: model cl-* + bỏ cổng phụ của cuộc. (b) modelapi: giữ model tài khoản, cuộc này đi modelapi với model gpt-* đã chọn.
        const ap = c.cong === 'anthropic'
          ? () => doiModel(mm.id).then(() => kn.datCongPhu(null)).then(xong)
          : () => kn.datCongPhu('modelapi', mm.id).then(xong);
        const lam = () => {
          if (c.canMatKhau) hoiMatKhauCong(c.cong, L(`${mm.ten} — cổng ${c.ten}.`, `${mm.ten} — ${c.ten} gateway.`), ap);
          else void ap().catch((e: Error) => kho.thongBao(e.message, 'loi'));
        };
        xacNhanDat(mm, lam);
      },
    });
  };

  const moMenu = (loai: 'model' | 'muc' | 'resume' | 'cheDo' | 'config' | 'rewind' | 'banGhi' | 'tasks' | 'ngonNgu' | 'cong' | 'ctwork') => {
    if (loai === 'banGhi') { moBanGhi('cuon'); return; }
    if (loai === 'cong') { S.daMoiCong = true; void moMenuCong(); return; }
    if (loai === 'tasks') { setBangPhu({ chon: dongPhu(true).length > 1 ? 1 : 0, tatCa: true }); return; }
    if (loai === 'ngonNgu') {
      const traLoi = caiDat.current.traLoiTheoNgonNgu === 'bat';
      menu({
        tieuDe: L('🌐 Ngôn ngữ / Language', '🌐 Language / Ngôn ngữ'), // i18n-bo-qua: tiêu đề song ngữ cố ý
        moTa: L('Đổi ngay, không cần khởi động lại.', 'Switches instantly — no restart needed.'),
        ds: [
          { nhan: 'Tiếng Việt', giaTri: 'vi', dangChon: ngonNgu() === 'vi' }, // i18n-bo-qua: tên ngôn ngữ, giữ nguyên ở mọi giao diện
          { nhan: 'English', giaTri: 'en', dangChon: ngonNgu() === 'en' },
          { nhom: L('Câu trả lời của AI', 'AI replies'), nhan: L(`AI trả lời bằng ngôn ngữ này: ${traLoi ? 'BẬT' : 'TẮT'}`, `AI replies in this language: ${traLoi ? 'ON' : 'OFF'}`), mo: L('kèm một dòng nhắc ngôn ngữ vào mỗi câu gửi', 'adds a reply-language line to each message'), giaTri: 'traLoi' },
        ],
        chon: ngonNgu() === 'vi' ? 0 : 1,
        khiChon: (m) => {
          if (m.giaTri === 'traLoi') {
            caiDat.current = { ...caiDat.current, traLoiTheoNgonNgu: traLoi ? 'tat' : 'bat' };
            ghiCaiDat(caiDat.current);
            kho.thongBao(L(`AI trả lời bằng ngôn ngữ giao diện: ${traLoi ? 'TẮT' : 'BẬT'}`, `AI replies in the interface language: ${traLoi ? 'OFF' : 'ON'}`), 'ok');
            return;
          }
          doiNgonNgu(m.giaTri as 'vi' | 'en');
        },
      });
      return;
    }
    if (loai === 'model') {
      // 18/10/2026: MỘT danh sách theo năng lực (thứ tự máy chủ), CHỈ tên CuongMini; 🔒 + tối hơn = cần khoá.
      const tatCa = dsModel();
      const ds: MucMenu[] = [
        ...tatCa.map((m) => ({
          nhom: L('Model', 'Model'), nhan: `${m.canMoKhoa ? '🔒 ' : ''}${m.ten}`,
          mo: !m.dungDuoc ? L('tạm thời chưa dùng được', 'temporarily unavailable') : m.canMoKhoa ? L(`cần khoá — ${m.mo}`, `needs a key — ${moModel(m.mo, m.moEn)}`) : moModel(m.mo, m.moEn),
          tat: !m.dungDuoc, ...(m.canMoKhoa ? { toi: true } : {}), dangChon: m.id === modelNay?.id, giaTri: `m:${m.id}`,
        })),
        ...dsMuc().map((m) => ({ nhom: L('Mức nỗ lực', 'Effort'), nhan: m.ten, mo: m.mo, dangChon: m.id === mucNay?.id, giaTri: `n:${m.id}` })),
      ];
      menu({
        tieuDe: L('Chọn model và mức nỗ lực', 'Select model and effort'), ds, chon: Math.max(0, ds.findIndex((m) => m.dangChon)),
        khiChon: (m) => {
          const [k, id] = [m.giaTri.slice(0, 1), m.giaTri.slice(2)];
          if (k === 'n') { void doiMuc(id).then(() => kho.thongBao(`${L('Mức nỗ lực', 'Effort')}: ${m.nhan}`, 'ok')).catch((e: Error) => kho.thongBao(e.message, 'loi')); return; }
          const mm = dsModel().find((x) => x.id === id);
          if (mm?.canMoKhoa) { moKhoaModel(id); return; }
          const lam = () => void doiModel(id).then(() => kho.thongBao(`Model: ${mm?.ten ?? m.nhan}`, 'ok')).catch((e: Error) => kho.thongBao(e.message, 'loi'));
          if (mm) xacNhanDat(mm, lam); else lam();
        },
      });
      return;
    }
    if (loai === 'muc') {
      const ds = dsMuc().map((m) => ({ nhan: m.ten, mo: m.mo, dangChon: m.id === mucNay?.id, giaTri: m.id }));
      menu({ tieuDe: L('Mức nỗ lực', 'Effort'), ds, chon: Math.max(0, ds.findIndex((m) => m.dangChon)), khiChon: (m) => void doiMuc(m.giaTri).then(() => kho.thongBao(`${L('Mức nỗ lực', 'Effort')}: ${m.nhan}`, 'ok')) });
      return;
    }
    if (loai === 'ctwork') {
      // CT Work một chạm: chọn quyền ⇒ lõi tạo token bằng phiên đăng nhập, cất vào kho bí mật, thêm server MCP.
      const ds = [
        { nhan: L('Chỉ đọc', 'Read only'), mo: L('Xem issue, sprint, tài liệu, WBS — không sửa gì (khuyên dùng)', 'View issues, sprints, docs, WBS — changes nothing (recommended)'), giaTri: 'doc' },
        { nhan: L('Đọc + ghi', 'Read + write'), mo: L('Thêm cả tạo/sửa issue, bình luận, log work — mỗi lần gọi vẫn hỏi duyệt', 'Also create/edit issues, comment, log work — every call still asks'), giaTri: 'ghi' },
      ];
      menu({
        tieuDe: L('Kết nối CT Work', 'Connect CT Work'),
        moTa: L('Dùng tài khoản CuongThai bạn đang đăng nhập. Token lưu trên máy này, trong file chỉ bạn đọc được — AI không bao giờ thấy.', 'Uses the CuongThai account you are signed in with. The token is kept on this machine in a file only you can read — the AI never sees it.'),
        ds, chon: 0,
        khiChon: (m) => {
          kho.thongBao(L('Đang kết nối CT Work…', 'Connecting CT Work…'));
          void kn.goi<{ ok: boolean; loi?: string; soTool?: number }>('agent:ctwork', { viec: 'noi', quyen: m.giaTri }).then((r) => {
            if (r?.ok) kho.thongBao(L(`✓ ctwork · ${r.soTool ?? 0} tool — hỏi thử: "việc của tôi trong CT Work hôm nay"`, `✓ ctwork · ${r.soTool ?? 0} tools — try: "what's on my CT Work plate today"`), 'ok');
            else kho.thongBao(`ctwork: ${r?.loi ?? '?'}`, 'loi');
          }).catch((e: Error) => kho.thongBao(e.message, 'loi'));
        },
      });
      return;
    }
    if (loai === 'cheDo') {
      const ds = CHE_DO.map((c) => ({ nhan: `${c.icon} ${c.ten}`, mo: c.mo, dangChon: c.id === (S.ws?.cheDoQuyen ?? 'keHoach'), giaTri: c.id }));
      menu({ tieuDe: L('Chế độ quyền', 'Permission mode'), ds, chon: Math.max(0, ds.findIndex((m) => m.dangChon)), khiChon: (m) => void doiCheDo(m.giaTri) });
      return;
    }
    if (loai === 'rewind') {
      const ds = dsCauHoi(S.muc as MucGhi[]);
      if (!ds.length) { kho.thongBao(L('Việc này chưa có câu hỏi nào để quay về.', 'This task has no questions to go back to yet.')); return; }
      const mucs = [...ds].reverse().map((c) => ({ nhan: c.text.replace(/\s+/g, ' ').slice(0, 80), mo: L(`câu ${c.k}`, `question ${c.k}`), giaTri: String(c.k) }));
      menu({
        tieuDe: L('↺ Quay về câu hỏi nào?', '↺ Rewind to which question?'), moTa: L('Hội thoại cắt từ câu đó; file agent sửa từ đó trở đi được lùi về như trước. Câu hỏi nằm lại trong ô nhập để sửa.', 'The conversation is cut there and files changed afterwards are reverted. The question goes back into the input box.'),
        ds: mucs, khiChon: (m) => { void chayLenh(`/rewind ${m.giaTri}`, boiCanh()); },
      });
      return;
    }
    if (loai === 'config') {
      const c = caiDat.current;
      const khoa = CAC_MUC;
      menu({
        tieuDe: L('⚙ Cài đặt', '⚙ Settings'), moTa: L(`Lưu ở ${thuMucGoc()}/cai-dat.json`, `Saved in ${thuMucGoc()}/cai-dat.json`),
        ds: khoa.map((k) => ({ nhan: tenMuc(k), mo: moTaGiaTri(k, c), giaTri: k })),
        khiChon: (m) => moMenuCaiDat(m.giaTri as keyof CaiDat),
      });
      return;
    }
    void kn.goi<PhienCu[]>('agent:dsPhien').then((tat) => {
      const ds0 = locPhien(tat, '');
      const tao = (q: string): MucMenu[] => (q ? tat.filter((p) => !p.luuTru && chuanHoa(`${p.tieuDe} ${p.duAn ?? ''}`).includes(chuanHoa(q))) : ds0)
        .slice(0, 40)
        .map((p) => ({ nhan: `${p.ghim ? '📌 ' : ''}${p.tieuDe || L('Việc chưa đặt tên', 'Untitled task')}`, mo: `${p.duAn ? `${p.duAn} · ` : ''}${tuongDoi(p.luucLuc)} · ${L(`${p.soTinNhan} tin`, `${p.soTinNhan} message${p.soTinNhan === 1 ? '' : 's'}`)}`, giaTri: p.id }));
      if (!tat.length) { kho.thongBao(L('Chưa có việc nào được lưu.', 'No saved tasks yet.')); return; }
      menu({
        tieuDe: L('Mở lại việc cũ', 'Resume a task'), ds: tao(''), coLoc: true, boLoc: tao,
        khiChon: (m) => { void moPhien(m.giaTri, m.nhan.replace(/^📌 /, ''), { kho, kn, xoaManHinh }).catch((e: Error) => kho.thongBao(e.message, 'loi')); },
      });
    }).catch((e: Error) => kho.thongBao(e.message, 'loi'));
  };

  const moMenuCaiDat = (k: keyof CaiDat) => {
    const c = caiDat.current;
    const luu = (moi: CaiDat, chu: string) => { caiDat.current = moi; ghiCaiDat(moi); kho.thongBao(chu, 'ok'); };
    if (k === 'modelMacDinh') {
      const ds = [{ nhan: L('Giữ model đang chọn của tài khoản', 'Keep the account\'s current model'), giaTri: '', dangChon: !c.modelMacDinh }, ...dsModel().filter((m) => m.dungDuoc).map((m) => ({ nhan: m.ten, mo: m.mo, giaTri: m.id, dangChon: c.modelMacDinh === m.id }))];
      menu({
        tieuDe: tenMuc(k), ds, chon: Math.max(0, ds.findIndex((m) => m.dangChon)),
        khiChon: (m) => {
          luu({ ...c, modelMacDinh: m.giaTri || null }, `${tenMuc('modelMacDinh')}: ${m.nhan}`);
          if (m.giaTri) void doiModel(m.giaTri).catch(() => undefined);
        },
      });
      return;
    }
    const ds = luaChon(k as MucLuaChon).map(([id, ten]) => ({ nhan: ten, giaTri: id, dangChon: c[k] === id }));
    menu({
      tieuDe: tenMuc(k), ds, chon: Math.max(0, ds.findIndex((m) => m.dangChon)),
      khiChon: (m) => {
        if (k === 'theme') { doiTheme(m.giaTri as CaiDat['theme']); return; }
        const moi = { ...c, [k]: m.giaTri } as CaiDat;
        if (k === 'trinhDuyet') {
          luu(moi, `${tenMuc(k)}: ${m.nhan}`);
          void kn.apTrinhDuyet(nenBatTrinhDuyet(moi, Boolean(timTrinhDuyet()))).then((ws) => { if (ws) S.ws = ws as typeof S.ws; kho.bao(true); })
            .catch((e: Error) => kho.thongBao(e.message, 'loi'));
          return;
        }
        if (k === 'ascii') {
          caiDat.current = moi;
          ghiCaiDat(moi);
          datAscii(m.giaTri === 'bat' ? true : m.giaTri === 'tat' ? false : canAscii(process.env));
          veLaiHet();
          return;
        }
        luu(moi, `${tenMuc(k)}: ${m.nhan}${k === 'cheDoMacDinh' ? L(' (áp dụng từ lần mở sau)', ' (applies next time you start)') : ''}`);
      },
    });
  };

  const dangXuat = async () => {
    xoaPhien();
    kn.dong();
    thoat(L('Đã đăng xuất. Đăng nhập lại: cuongmini login', 'Signed out. Sign in again: cuongmini login'));
  };

  const boiCanh = (): BoiCanhLenh => ({
    chon: (o) => menu({
      tieuDe: o.tieuDe, ...(o.moTa ? { moTa: o.moTa } : {}),
      // Đợt 5: khối markdown (thẻ CT Work, bảng sprint, xem trước) vẽ theo bề ngang thẻ.
      ...(o.thanMd ? { than: catThanThe(veMarkdown(o.thanMd, { rong: Math.min(cot - 1, 120) - 6 }), Math.max(6, hang - 16 - o.ds.length)) } : o.than ? { than: o.than } : {}),
      ds: o.ds.map((m) => ({ nhan: m.nhan, giaTri: m.giaTri, ...(m.mo ? { mo: m.mo } : {}), ...(m.tat ? { tat: true } : {}), ...(m.so !== undefined ? { so: m.so } : {}) })),
      khiChon: (m) => { void Promise.resolve(o.khiChon(m.giaTri)).catch((e: Error) => kho.thongBao(e.message, 'loi')); },
      ...(o.khiHuy ? { khiHuy: o.khiHuy } : {}),
    }),
    lamMoiCtwork: () => { void napDongCtw(); },
    kho, kn, thuMuc, phienBan, guiThat, doiModel, doiMuc, doiCheDo, dsModel, dsMuc, moMenu, moKhoaModel, doiTheme, doiNgonNgu, datToanManHinh, datChuot,
    datNhap: (t: string) => setO({ text: t, contro: t.length }),
    xoaManHinh, dangXuat, dangNhapLai: () => setHop({ loai: 'dangNhap' }), thoat: () => thoat(),
  });

  // ─── `!` shell và `#` ghi nhớ ──────────────────────────────────

  const chayLenhShell = (lenh: string) => {
    if (!lenh.trim()) { baoNhanh(L('Gõ lệnh sau dấu ! — vd: !git status', 'Type a command after ! — e.g. !git status')); return; }
    if (shellRef.current) { kho.thongBao(L('Lệnh trước còn đang chạy — esc để dừng.', 'The previous command is still running — esc to stop it.'), 'canh'); return; }
    const { xong, huy } = chayShell(lenh, thuMuc, (m) => {
      setShell((s) => (s ? { ...s, ra: (s.ra + m).slice(-20_000) } : s));
    });
    setShell({ lenh, ra: '', batDau: Date.now(), huy });
    void xong.then((kq) => {
      setShell(null);
      kho.them({ loai: 'shell', lenh, ra: kq.ra, ma: kq.ma, giay: kq.giay, moRong: S.chiTiet, biHuy: kq.biHuy });
      shellChoGui.current = [...shellChoGui.current, { lenh, ma: kq.ma, ra: kq.ra }].slice(-3);
      kho.bao(true);
    });
  };

  const ghiNhoNhanh = (text: string) => {
    const gn = tachGhiNho(text);
    if (!gn) { baoNhanh(L('Gõ nội dung sau dấu # — vd: # luôn dùng pnpm, không dùng npm', 'Type a rule after # — e.g. # always use pnpm, not npm')); return; }
    const f = fileQuyUoc(thuMuc);
    const ten = f.duong.slice(thuMuc.length + 1);
    menu({
      tieuDe: L('# Ghi nhớ quy ước dự án', '# Save a project rule'), mauVien: '#22d3ee',
      moTa: L(`"${gn}" — CuongMini đọc file này ở MỌI lượt.`, `"${gn}" — CuongMini reads this file on EVERY turn.`),
      ds: [
        { nhan: f.taoMoi ? L(`Tạo ${ten} và ghi vào`, `Create ${ten} and save`) : L(`Ghi vào ${ten}`, `Save to ${ten}`), mo: L('mục "Ghi nhớ nhanh"', 'section "Quick notes"'), giaTri: 'ghi' },
        { nhan: L('Huỷ', 'Cancel'), giaTri: 'huy' },
      ],
      khiChon: (m) => {
        if (m.giaTri !== 'ghi') return;
        try {
          const r = luuGhiNho(thuMuc, gn);
          kho.thongBao(L(`Đã ghi nhớ vào ${r.duong.slice(thuMuc.length + 1)}${r.taoMoi ? ' (file mới)' : ''}: ${gn}`, `Saved to ${r.duong.slice(thuMuc.length + 1)}${r.taoMoi ? ' (new file)' : ''}: ${gn}`), 'ok');
        } catch (e) { kho.thongBao(L(`Không ghi được: ${(e as Error).message}`, `Could not save: ${(e as Error).message}`), 'loi'); }
      },
    });
  };

  const danAnh = () => {
    baoNhanh(L('Đang đọc ảnh trong clipboard…', 'Reading image from the clipboard…'), 4000);
    void danAnhTuClipboard().then((r) => {
      if ('loi' in r) { baoNhanh(r.loi, 6000); return; }
      soAnhDan.current += 1;
      anhDan.current.set(soAnhDan.current, r.duong);
      const o = oRef.current;
      const truoc = o.text.slice(0, o.contro);
      doiO(ST.chen(o, `${truoc && !/\s$/.test(truoc) ? ' ' : ''}[Ảnh #${soAnhDan.current}] `)); // i18n-bo-qua: thẻ ảnh trong ô nhập (khớp lúc gửi)
      baoNhanh(L(`Đã dán ảnh #${soAnhDan.current} — gửi kèm câu hỏi.`, `Pasted image #${soAnhDan.current} — it will be sent with your message.`));
    });
  };

  // ─── Gửi câu hỏi (kể cả xếp hàng) ──────────────────────────────

  const ghiLichSu = (text: string) => {
    lichSu.current.them(text);
    try {
      damBaoThuMuc(thuMucGoc());
      appendFileSync(duongLichSu(), `${ST.maHoaDong(text)}\n`, { mode: 0o600 });
    } catch { /* không ghi được lịch sử thì thôi */ }
  };

  const guiCauHoi = (text0: string, tuHangCho = false) => {
    const text = text0.trim();
    if (!text) return;
    // Gửi câu mới ⇒ về đáy bảng ghi (như Claude Code).
    viTri.current = { ...viTri.current, cuon: 0, moi: 0 };
    if (!tuHangCho) ghiLichSu(text);
    setO(ST.rong());
    setGoiY(null);
    if (text.startsWith('!')) { chayLenhShell(text.slice(1).trim()); return; }
    if (/^#\s/.test(text)) { ghiNhoNhanh(text); return; }
    if (text.startsWith('/')) {
      const dau = text.split(/\s/)[0];
      if (tachLenhCli(text) || S.lenhDuAn.some((x) => x.ten === dau)) {
        const l = tachLenhCli(text)?.ten;
        if (S.dangChay && (!l || LENH_CAN_RANH.includes(l))) { setHangCho((h) => [...h, text]); return; }
        void chayLenh(text, boiCanh());
        return;
      }
    }
    // Đợt 4 — đang chạy ⇒ CHÈN vào lượt (như Claude Code): lõi nối tin vào kết quả tool kế tiếp.
    // Lõi cũ / lượt vừa xong ⇒ XẾP HÀNG như trước (tự gửi khi lượt xong, esc để huỷ).
    if (S.dangChay) {
      void kn.goi<{ chen?: boolean }>('agent:chenTin', { text: text.slice(0, 8000) })
        .then((r) => { if (r?.chen) kho.themChen(text); else setHangCho((h) => [...h, text]); })
        .catch(() => setHangCho((h) => [...h, text]));
      return;
    }
    guiThat(text, {});
  };

  // Lượt xong ⇒ gửi hàng chờ. Lượt hỏng (cổng bảo trì, hết phiên…) ⇒ trả chữ về ô nhập, không tự gửi vào chỗ hỏng.
  useEffect(() => {
    const h = hangChoRef.current;
    if (S.dangChay || !h.length || hopRef.current || S.choDuyet.length) return;
    if (S.luotCuoi?.loi || S.loiCanXuLy) {
      setHangCho([]);
      setO({ text: h.join('\n'), contro: h.join('\n').length });
      kho.thongBao(L('Lượt vừa rồi lỗi — tin trong hàng chờ đã về lại ô nhập, Enter để gửi.', 'The last turn failed — queued messages are back in the input, press Enter to send.'), 'canh');
      return;
    }
    const [dau, ...con] = h;
    // Lệnh (`/…`) chạy riêng; các câu thường liền nhau gộp làm MỘT tin (một lượt, không ba lượt).
    if (dau!.startsWith('/')) { setHangCho(con); guiCauHoi(dau!, true); return; }
    const k = con.findIndex((t) => t.startsWith('/'));
    const gop = k < 0 ? h : h.slice(0, k + 1);
    setHangCho(k < 0 ? [] : h.slice(k + 1));
    guiThat(gop.join('\n\n'), {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [S.dangChay, hangChoRef.current.length, hopRef.current, S.choDuyet.length]);

  // ─── Khởi đầu ──────────────────────────────────────────────────

  const daChao = useRef(false);
  useEffect(() => {
    if (daChao.current) return;
    daChao.current = true;
    if (!S.bang.some((m) => m.loai === 'chao')) { kho.them({ loai: 'chao' }); kho.bao(true); }
    void kn.goi<Array<{ ten: string; mo: string; than: string }>>('agent:lenhDuAn').then((ds) => { S.lenhDuAn = ds ?? []; }).catch(() => undefined);
    if (cauHoiDau.trim()) guiCauHoi(cauHoiDau);
    else if (chonViecCu) moMenu('resume');
    // Đợt 4: hẹn ĐÃ LỠ lúc CuongMini tắt ⇒ hỏi chạy bù hay bỏ.
    void kn.goi<{ ds: Array<{ id: string; lyDo: string; luc: number }> }>('agent:henLo').then((r) => {
      const ds = r?.ds ?? [];
      if (!ds.length || hopRef.current) return;
      setHop({
        loai: 'menu', tieuDe: L(`⏰ Đã lỡ ${ds.length} hẹn lúc CuongMini tắt`, `⏰ Missed ${ds.length} schedule(s) while CuongMini was closed`),
        moTa: ds.slice(0, 5).map((h) => `• ${new Date(h.luc).toLocaleString(L('vi-VN', 'en-US'), { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })} — ${h.lyDo.slice(0, 80)}`).join('\n'),
        ds: [{ nhan: L('Chạy bù ngay (mỗi hẹn mở lại đúng việc của nó)', 'Run them now (each reopens its own task)'), giaTri: 'chay' }, { nhan: L('Bỏ các hẹn đã lỡ', 'Drop the missed schedules'), giaTri: 'bo' }, { nhan: L('Để sau (/hen)', 'Later (/hen)'), giaTri: 'sau' }],
        chon: 0, loc: '', coLoc: false,
        khiChon: (m) => {
          if (m.giaTri === 'sau') return;
          void kn.goi<{ n: number }>('agent:xuLyHenLo', { cach: m.giaTri === 'chay' ? 'chay' : 'bo' })
            /* QA 5c: hẹn chạy bù mở lại ĐÚNG việc cũ của nó ở nền — CLI không vẽ cuộc nền ⇒ nói chỗ xem kết quả (trước đây
               "Đang chạy bù 1 hẹn." rồi không thấy gì nữa). */
            .then((x) => kho.thongBao(m.giaTri === 'chay' ? L(`Đang chạy bù ${x?.n ?? 0} hẹn — chạy nền trong việc cũ của nó; xem kết quả bằng /resume.`, `Running ${x?.n ?? 0} missed schedule(s) in the background, each in its own task — see the result with /resume.`) : L(`Đã bỏ ${x?.n ?? 0} hẹn.`, `Dropped ${x?.n ?? 0} schedule(s).`), 'ok'))
            .catch(() => undefined);
        },
      });
    }).catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Đợt 5: CT Work — dòng trạng thái + hỏi MỘT lần (kết nối / cấp lại / gắn dự án) ───

  /*
   * QA 5c: thẻ CT Work TỰ BẬT (kết nối / cấp lại token / gắn dự án) không được bật lên giữa lúc người dùng đang gõ —
   * lỗi thấy: gõ câu hỏi, thẻ "Token hết hạn — 1. Cấp lại" bật lên đúng lúc, phím Enter của câu hỏi chọn luôn "Cấp lại"
   * (câu hỏi nằm lại ô nhập, token bị thu hồi + tạo mới mà người dùng không hề thấy thẻ). Đang gõ (ô nhập có chữ, hoặc
   * vừa bấm phím < 2,5 s) ⇒ hoãn; thẻ chỉ hiện khi ô nhập trống và tay đã rời phím.
   */
  const lanGo = useRef(0);
  const dangGo = () => oRef.current.text.length > 0 || Date.now() - lanGo.current < 2500;
  const hoiLaiCtw = useRef<(() => void) | null>(null);
  const giaoDienCtwTuBat = (): GiaoDienCtw => {
    const g = giaoDienCtw(boiCanh());
    // Thẻ NỐI TIẾP sau khi người dùng vừa chọn (kết nối ⇒ "gắn dự án?") vẫn hiện — chỉ thẻ tự bật đầu tiên mới phải chờ.
    let daChon = false;
    return {
      ...g,
      chon: (o) => {
        if (!daChon && (dangGo() || hopRef.current || S.dangChay)) {
          daHoiCtw.current = false;
          setTimeout(() => hoiLaiCtw.current?.(), 3000);
          return;
        }
        g.chon({ ...o, khiChon: (v) => { daChon = true; return o.khiChon(v); } });
      },
    };
  };
  const napDongCtw = useCallback(async () => {
    const r = await kn.goi<{ ok: boolean; dong?: DongCtw | null }>('agent:ctworkHe', { viec: 'dong', ngonNgu: ngonNgu() }).catch(() => null);
    setDongCtw(r?.ok ? r.dong ?? null : null);
    // Token hết hạn / bị thu hồi giữa phiên ⇒ đề nghị cấp lại một chạm (không chen ngang thẻ đang mở, không giữa lúc gõ).
    if (laLoiXacThucCtw(r?.dong?.loi) && !hopRef.current && !S.dangChay && !dangGo()) void hoiCtworkMotLan(giaoDienCtwTuBat()).catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kn]);
  const daHoiCtw = useRef(false);
  useEffect(() => {
    // Sau màn chào + kiểm hẹn lỡ: đợi lõi nạp MCP xong (lõi tự chờ) rồi hỏi nếu cần — không chen ngang thẻ khác / lúc gõ.
    let lan = 0;
    let t2: ReturnType<typeof setTimeout> | null = null;
    const hoi = () => {
      if (daHoiCtw.current) return;
      if (hopRef.current || S.dangChay || dangGo()) { if (++lan < 60) t2 = setTimeout(hoi, 3000); return; }
      daHoiCtw.current = true;
      void hoiCtworkMotLan(giaoDienCtwTuBat()).catch(() => undefined);
    };
    hoiLaiCtw.current = () => { if (++lan < 60) hoi(); };
    const t = setTimeout(() => {
      void napDongCtw();
      hoi();
    }, Number(process.env.CUONGMINI_CTW_TRE_MS ?? 1200));
    const lap = setInterval(() => { void napDongCtw(); }, 60_000);
    return () => { clearTimeout(t); if (t2) clearTimeout(t2); clearInterval(lap); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Lượt xong ⇒ đọc lại (nhánh có thể vừa đổi; sprint đọc đệm 5 phút ở lõi).
  useEffect(() => { if (!S.dangChay) void napDongCtw(); }, [S.dangChay, napDongCtw]);
  // Tiêu đề cửa sổ terminal = tiêu đề phiên (kiểu Claude Code). Chỉ TTY thật.
  useEffect(() => {
    if (!process.stdout.isTTY || process.env.CUONGMINI_KHONG_DAT_TIEU_DE === '1') return;
    process.stdout.write(`\x1b]0;${`CuongMini${S.tieuDe ? ` · ${S.tieuDe.replace(/[\x00-\x1f\x07]/g, ' ').slice(0, 60)}` : ''}`}\x07`);
  }, [S.tieuDe]);

  // Lỗi cần xử lý thêm: cổng dự phòng, hết phiên.
  useEffect(() => {
    const l = S.loiCanXuLy;
    if (!l) return;
    S.loiCanXuLy = null;
    if (l.ma === 'RAMBO_BAO_TRI') {
      setHop({
        loai: 'matKhau', tieuDe: L('Cổng chính đang bảo trì', 'Main gateway is under maintenance'), giaTri: '',
        moTa: L('Dùng cổng dự phòng trong lúc chờ? Nhập mật khẩu quản trị cấp (Enter mở khoá · Esc bỏ qua).', 'Use the fallback gateway meanwhile? Enter the admin-issued password (Enter to unlock · Esc to skip).'),
        khiXong: (mk) => {
          kho.thongBao(L('Đang mở khoá cổng dự phòng…', 'Unlocking the fallback gateway…'));
          kn.moDuPhong(mk).then((ten) => {
            kho.thongBao(L(`Đã mở ${ten}. Đang gửi lại câu hỏi…`, `Unlocked ${ten}. Resending…`), 'ok');
            if (S.cauHoiCuoi) guiThat(S.cauHoiCuoi, {});
          }, (e: Error) => kho.thongBao(L(`Không mở được cổng dự phòng: ${e.message}`, `Could not unlock the fallback gateway: ${e.message}`), 'loi'));
        },
      });
    } else if (l.ma === 'CONG_ANTHROPIC_KHOA') {
      // Vé đã bị lõi xoá (mật khẩu đổi/tắt) ⇒ hỏi lại rồi gửi lại câu hỏi.
      if (l.daBat === false) { kho.thongBao(L('Quản trị chưa đặt khoá cho model này — chọn model khác bằng /model.', 'The admin has not set a key for this model — pick another model with /model.'), 'canh'); return; }
      hoiMatKhauCong('anthropic', L('Model này cần khoá (vé 48 giờ đã hết hoặc chưa có).', 'This model needs a key (the 48-hour pass expired or is missing).'), () => {
        if (S.cauHoiCuoi) { kho.thongBao(L('Đang gửi lại câu hỏi…', 'Resending…')); guiThat(S.cauHoiCuoi, {}); }
      });
    } else if (l.ma === 'CONG_ANTHROPIC_HET_HAN_MUC' || l.ma === 'CONG_ANTHROPIC_HET_KEY' || l.ma === 'CUONGMINI_HET_TRAN') {
      /* 18/10/2026: hết trần / cổng hỏng — máy chủ đã tự chuyển model free nếu được; còn lại mời chọn model khác. */
      kho.thongBao(L('Gõ /model để chọn model khác.', 'Type /model to pick another model.'), 'canh');
    } else if (l.ma !== 'PRO_REQUIRED') {
      void kn.lamMoiPhien().then((ok) => {
        if (ok) kho.thongBao(L('Đã làm mới phiên đăng nhập — gửi lại câu hỏi nhé.', 'Session refreshed — please resend your message.'), 'ok');
        else setHop({ loai: 'dangNhap', nhacNho: L('Phiên đăng nhập đã hết hạn — đăng nhập lại nhé.', 'Your session expired — please sign in again.') });
      });
    }
  }, [S.loiCanXuLy, S, kho, kn, guiThat, setHop]);

  // Cổng chính hỏng (lượt đã chạy tiếp ở Free) ⇒ hết lượt thì mời chọn cổng — một lần mỗi phiên; sau đó /gateway.
  useEffect(() => {
    if (S.dangChay || !S.moiCong || S.daMoiCong || hopRef.current || S.choDuyet.length) return;
    S.daMoiCong = true;
    void moMenuCong();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [S.dangChay, S.moiCong, hopRef.current, S.choDuyet.length]);

  // Cổng chính sống lại ⇒ hỏi quay về (cổng phụ đang giữ tới khi người dùng chọn).
  useEffect(() => {
    if (S.dangChay || !S.hoiQuayVe || hopRef.current || S.choDuyet.length) return;
    S.hoiQuayVe = null;
    menu({
      tieuDe: L('Cổng chính CuongMini đã hoạt động lại', 'The CuongMini main gateway is back'),
      ds: [
        { nhan: L('Quay về cổng chính', 'Back to the main gateway'), mo: L('các câu sau đi cổng chính', 'next messages use the main gateway'), giaTri: 've' },
        { nhan: L('Ở lại cổng hiện tại', 'Stay on the current gateway'), giaTri: 'o' },
      ],
      khiChon: (m) => {
        if (m.giaTri !== 've') return;
        S.moiCong = null;
        void kn.goi('agent:veCongChinh').then(() => kho.thongBao(L('Đã về cổng chính.', 'Back on the main gateway.'), 'ok')).catch((e: Error) => kho.thongBao(e.message, 'loi'));
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [S.dangChay, S.hoiQuayVe, hopRef.current, S.choDuyet.length]);

  // Lượt /plan xong ⇒ hỏi duyệt kế hoạch.
  useEffect(() => {
    if (!S.hoiDuyetKeHoach) return;
    S.hoiDuyetKeHoach = false;
    menu({
      tieuDe: L('📋 Duyệt kế hoạch?', '📋 Approve the plan?'), moTa: L('Lượt vừa rồi chỉ đọc. Đồng ý thì CuongMini làm theo đúng kế hoạch trên.', 'The last turn was read-only. Approve and CuongMini will follow the plan above.'),
      ds: [{ nhan: L('Làm theo kế hoạch', 'Yes, proceed with the plan'), giaTri: 'ok' }, { nhan: L('Chưa — để tôi xem lại / sửa yêu cầu', 'No, keep planning'), giaTri: 'ko' }],
      khiChon: (m) => { if (m.giaTri === 'ok') void chayLenh('__duyetKeHoach', boiCanh()); },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [S.hoiDuyetKeHoach]);

  // Thẻ duyệt mới ⇒ con trỏ về lựa chọn đầu + báo nếu người dùng đang ở cửa sổ khác.
  const idDuyet = S.choDuyet[0]?.id;
  useEffect(() => {
    setChonDuyet(0);
    if (idDuyet) baoChuY(L('CuongMini cần bạn duyệt', 'CuongMini needs your approval'), L(`${S.ws?.name ?? 'Dự án'}: có yêu cầu đang chờ`, `${S.ws?.name ?? 'Project'}: a request is waiting`));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idDuyet]);

  // Lượt dài xong ⇒ chuông + (nếu đang ở cửa sổ khác) thông báo hệ điều hành.
  const lucXong = S.luotCuoi?.luc;
  useEffect(() => {
    const l = S.luotCuoi;
    if (!l || l.thoiLuong < LUOT_DAI_MS) return;
    baoChuY(l.loi ? L('CuongMini gặp lỗi', 'CuongMini hit an error') : L('CuongMini đã xong', 'CuongMini is done'), `${S.ws?.name ?? L('Dự án', 'Project')} · ${Math.round(l.thoiLuong / 1000)}s${S.tieuDe ? ` · ${S.tieuDe}` : ''}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lucXong]);

  // ─── Gợi ý `/` và `@` ──────────────────────────────────────────

  const napChiMuc = () => {
    if (chiMuc.current || dangNapChiMuc.current) return;
    dangNapChiMuc.current = true;
    void chiMucDuAn(thuMuc).then((ds) => {
      chiMuc.current = ds;
      dangNapChiMuc.current = false;
      capNhatGoiY(oRef.current);
      // Quét hàm/lớp chạy nền sau khi có danh sách file — có trần 1,5s.
      void quetDuAn(thuMuc, ds, { tranMs: 1500 }).then((r) => { kyHieu.current = r.ds; capNhatGoiY(oRef.current); });
    });
  };

  const capNhatGoiY = (o2: ST.ONhap) => {
    const truoc = o2.text.slice(0, o2.contro);
    if (/^\/[^\s]*$/.test(truoc)) {
      const q = chuanHoa(truoc.slice(1));
      const ds: MucGoiY[] = [
        ...LENH_GOI_Y.map((l) => ({
          l,
          // Tên CHÍNH khớp đầu xếp trước bí danh ("/m" ⇒ /model trước /clear có bí danh /moi).
          d: !q ? 1 : chuanHoa(l.ten).startsWith(q) ? -1 : [l.ten, ...(l.khac ?? [])].some((k) => chuanHoa(k).startsWith(q)) ? 0
            : [l.ten, ...(l.khac ?? [])].some((k) => chuanHoa(k).includes(q)) ? 1 : chuanHoa(l.mo).includes(q) || chuanHoa(moLenh(l)).includes(q) ? 2 : 9,
        }))
          .filter((x) => x.d < 9).sort((a, b) => a.d - b.d)
          .map(({ l }) => { const ts = thamSoLenh(l); return { nhan: l.ten + (ts ? ` ${ts}` : ''), mo: moLenh(l), chen: `${l.ten} `, chayLuon: !l.thamSo || !l.thamSo.startsWith('<') }; }),
        ...S.lenhDuAn.filter((l) => !q || chuanHoa(l.ten).includes(q)).map((l) => ({ nhan: l.ten, mo: `${l.mo} ${L('(dự án)', '(project)')}`, chen: `${l.ten} `, chayLuon: false })),
      ];
      setGoiY((g) => ({ kieu: '/', ds, chon: g?.kieu === '/' ? Math.min(g.chon, Math.max(0, ds.length - 1)) : 0, dau: 0 }));
      return;
    }
    const t = tokenNhac(truoc);
    if (!t) { setGoiY(null); return; }
    if (!chiMuc.current) {
      napChiMuc();
      setGoiY({ kieu: '@', ds: [{ nhan: L('Đang đọc danh sách file…', 'Reading the file list…'), chen: '' }], chon: 0, dau: t.dau });
      return;
    }
    const file = timMo(t.q, chiMuc.current, 30).map((f) => ({ nhan: f, chen: `@${f}${f.endsWith('/') ? '' : ' '}`, thuMuc: f.endsWith('/'), mo: f.endsWith('/') ? L('thư mục', 'directory') : undefined }));
    // Hàm / lớp: chỉ khi đã gõ ≥ 2 ký tự (gõ 1 ký tự thì gần như mọi ký hiệu đều khớp).
    const kh: MucGoiY[] = t.q.length >= 2 && kyHieu.current
      ? kyHieu.current.map((k) => ({ k, d: diemMo(t.q, k.ten) })).filter((x) => x.d >= 0).sort((a, b) => b.d - a.d).slice(0, 8)
        .map(({ k }) => ({ nhan: `ƒ ${k.ten}`, mo: `${nhanKieu(k.kieu)} · ${k.file}:${k.dong}`, chen: `@${k.file}:${k.dong} ` }))
      : [];
    const ds = [...file.slice(0, 12), ...kh, ...file.slice(12)];
    setGoiY((g) => ({ kieu: '@', ds, chon: g?.kieu === '@' ? Math.min(g.chon, Math.max(0, ds.length - 1)) : 0, dau: t.dau }));
  };

  const doiO = (o2: ST.ONhap) => { setO(o2); capNhatGoiY(o2); };

  const nhanGoiY = (g: GoiY, enter: boolean) => {
    const o = oRef.current;
    const m = g.ds[g.chon];
    if (!m || !m.chen) return;
    if (g.kieu === '/') {
      if (enter && m.chayLuon) { guiCauHoi(m.chen.trim()); return; }
      doiO({ text: m.chen + o.text.slice(o.contro).replace(/^\S*/, ''), contro: m.chen.length });
      setGoiY(null);
      return;
    }
    const moi = ST.thayDoan(o, g.dau, m.chen);
    setO(moi);
    if (m.thuMuc) capNhatGoiY(moi); else setGoiY(null);
  };

  // ─── Phím ──────────────────────────────────────────────────────

  const rongBanGhi = Math.max(30, cot - 3);
  /** Nội dung màn chi tiết của một dòng bảng agent phụ. */
  const dongChiTiet = (id: string): string[] => {
    if (id.startsWith('shell:')) {
      const x = S.lenhNen.find((l) => `shell:${l.id}` === id);
      return x ? chiTietShell(x, rongBanGhi) : [mo(L('(lệnh nền này không còn)', '(this shell is gone)'))];
    }
    const a = S.agentPhu.find((x) => x.id === id);
    return a ? chiTietAgent(a, rongBanGhi) : [mo(L('(agent phụ này không còn)', '(this subagent is gone)'))];
  };
  const caoBanGhi = Math.max(5, hang - 3);

  /** Cuộn bảng ghi toàn màn hình `b` dòng (dương = lên). */
  const cuonBang = (b: number) => {
    viTri.current = cuonViTri(viTri.current, b, caoKhung.current);
    kho.bao(true);
  };

  /** ↑/↓ ở ô nhập: dòng trên/dưới, rồi LỊCH SỬ câu hỏi (`chiLichSu` = ctrl+↑/↓: thẳng vào lịch sử). */
  const muiTenDon = (len: boolean, chiLichSu = false) => {
    const o2 = oRef.current;
    if (chiLichSu) {
      const t = len ? lichSu.current.truoc(o2.text) : lichSu.current.sau();
      if (t !== null) doiO({ text: t, contro: t.length });
      return;
    }
    if (len) {
      const l = ST.lenDong(o2);
      if (l) { setO(l); return; }
      const t = lichSu.current.truoc(o2.text);
      if (t !== null) doiO({ text: t, contro: t.length });
      return;
    }
    const x = ST.xuongDong(o2);
    if (x) { setO(x); return; }
    const t = lichSu.current.sau();
    if (t !== null) doiO({ text: t, contro: t.length });
  };


  useInput((input, key) => {
    // 0) Báo focus của terminal (ESC[I / ESC[O) — không phải phím người dùng.
    if (input === '[I') { dangNhin.current = true; return; }
    if (input === '[O') { dangNhin.current = false; return; }
    lanGo.current = Date.now();
    /* QA 5c: PHÍM DỒN — CLI đang bận vẽ thì terminal giao "\r\r" hay "1\r" trong MỘT lần đọc; Ink trả nguyên chuỗi nên
       mọi thẻ bỏ qua (bấm mà "không ăn"). Khi đang có THẺ (duyệt / menu / hỏi) ⇒ lấy PHÍM ĐẦU, bỏ phần thừa — không để
       Enter thứ hai rơi sang thẻ kế tiếp mà duyệt luôn nó. */
    const coThe = hopRef.current?.loai === 'menu' || S.choDuyet.length > 0 || Boolean(S.hoi);
    const don = tachPhimDon(input, coThe);
    if (don) { input = don.input; key = { ...key, return: don.enter }; }
    const o = oRef.current;
    const hop = hopRef.current;
    const goiY = goiYRef.current;
    const chonDuyet = chonDuyetRef.current;

    // 0a) Chuột (chỉ có ở toàn màn hình): con lăn cuộn màn đang xem; nhấn chuột ⇒ nhắc cách bôi đen một lần.
    const chuot = docChuot(input);
    if (chuot) {
      if (chuot.kieu === 'khac') {
        if (!daNhacBoiDen.current) {
          daNhacBoiDen.current = true;
          baoNhanh(L('Bôi đen chép chữ: giữ Option (iTerm2) · Fn (Terminal macOS) · Shift (Linux) khi kéo — hoặc ctrl+r xem bản ghi, /fullscreen off', 'To select text hold Option (iTerm2) · Fn (macOS Terminal) · Shift (Linux) while dragging — or ctrl+r, /fullscreen off'), 6000);
        }
        return;
      }
      const b = chuot.kieu === 'cuonLen' ? -3 : 3;
      if (hop?.loai === 'chiTiet' || hop?.loai === 'banGhi') {
        const tong = hop.loai === 'chiTiet' ? dongChiTiet(hop.id).length : dungBanGhi(S.bang, rongBanGhi, hop.moRong).dong.length;
        const toiDa = Math.max(0, tong - caoBanGhi);
        const dauNay = hop.ganCuoi ? toiDa : Math.min(hop.dau, toiDa);
        const d = Math.max(0, Math.min(toiDa, dauNay + b));
        setHop({ ...hop, dau: d, ganCuoi: d >= toiDa });
        return;
      }
      if (fsRef.current) cuonBang(-b);
      return;
    }

    // 0a') Toàn màn hình: PgUp/PgDn cuộn bảng ghi; Home/End khi ô nhập trống (có chữ thì là đầu/cuối dòng).
    if (fsRef.current && !hop && !bangPhuRef.current) {
      const trang = Math.max(3, caoKhung.current - 2);
      if (key.pageUp) { cuonBang(trang); return; }
      if (key.pageDown) { cuonBang(-trang); return; }
      if (!o.text && !goiY && key.home) { cuonBang(viTri.current.tong); return; }
      if (!o.text && !goiY && key.end) { cuonBang(-viTri.current.tong); return; }
    }

    // 0a'') TOÀN MÀN HÌNH, KHÔNG bắt chuột (mặc định): con lăn ⇒ terminal gửi ↑/↓ (alternate scroll).
    //       ↑/↓ khi ô nhập trống, hoặc con trỏ đã ở dòng đầu/cuối ô nhập và không đang duyệt lịch sử ⇒
    //       CUỘN bản ghi (ô nhập vẫn ghim đáy). Lịch sử câu hỏi: ctrl+↑/↓ (rồi ↑/↓ để duyệt tiếp).
    // Thẻ HỎI đang mở ⇒ ↑/↓ là chọn đáp án, không phải cuộn (QA 18/10: ↓ bị nuốt, Enter chọn nhầm đáp án 1).
    if (fsRef.current && !hop && !bangPhuRef.current && !goiY && !S.choDuyet.length && !(S.hoi && S.hoi.cauHoi.length) && (key.upArrow || key.downArrow) && !key.shift && !key.meta) {
      if (key.ctrl) { muiTenDon(Boolean(key.upArrow), true); return; }
      const len = Boolean(key.upArrow);
      const dong = len ? ST.lenDong(o) : ST.xuongDong(o);
      if (dong) { setO(dong); return; }
      if (lichSu.current.dangDuyet()) { muiTenDon(len, true); return; }
      // ↓ ở ô trống, bản ghi đang ở đáy, có agent phụ ⇒ vào bảng agent phụ như cũ.
      if (!len && !o.text && viTri.current.cuon === 0 && dongPhu(false).length > 1) { setBangPhu({ chon: 1, tatCa: false }); return; }
      cuonBang(len ? 3 : -3);
      return;
    }

    // 0b) Màn chi tiết agent phụ / lệnh nền.
    if (hop?.loai === 'chiTiet') {
      const ds = dongPhu(hop.tatCa).filter((x) => x.kieu !== 'main');
      const i = ds.findIndex((x) => x.id === hop.id);
      const dong = dongChiTiet(hop.id);
      const toiDa = Math.max(0, dong.length - caoBanGhi);
      const dauNay = hop.ganCuoi ? toiDa : Math.min(hop.dau, toiDa);
      const cuon = (b: number) => setHop({ ...hop, dau: Math.max(0, Math.min(toiDa, dauNay + b)), ganCuoi: dauNay + b >= toiDa });
      if (key.escape || input === 'q' || (key.ctrl && input === 'c')) { setHop(null); setBangPhu({ chon: Math.max(0, dongPhu(hop.tatCa).findIndex((x) => x.id === hop.id)), tatCa: hop.tatCa }); return; }
      if (key.leftArrow || key.rightArrow || key.tab) {
        if (!ds.length) return;
        const k = (i + (key.leftArrow ? -1 : 1) + ds.length) % ds.length;
        setHop({ ...hop, id: ds[k]!.id, dau: 0, ganCuoi: false });
        return;
      }
      if (input === 'x' && hop.id.startsWith('shell:')) {
        // Lõi chưa mở kênh dừng TỪNG lệnh nền cho giao diện — `agent:cancel` dừng lượt + MỌI lệnh nền của cuộc.
        menu({
          tieuDe: L('Dừng lệnh nền?', 'Stop background shells?'), mauVien: '#fbbf24',
          moTa: L('Lõi hiện chỉ cho dừng TẤT CẢ lệnh nền cùng lúc (kèm dừng lượt đang chạy).', 'The core can currently only stop ALL background shells at once (and the running turn).'),
          ds: [{ nhan: L('Không', 'No'), giaTri: 'khong' }, { nhan: L('Dừng tất cả lệnh nền', 'Stop all shells'), giaTri: 'co' }],
          khiChon: (m) => { if (m.giaTri === 'co') void kn.goi('agent:cancel'); },
        });
        return;
      }
      if (key.upArrow || input === 'k') { cuon(-1); return; }
      if (key.downArrow || input === 'j') { cuon(1); return; }
      if (key.pageUp || input === 'b') { cuon(-(caoBanGhi - 2)); return; }
      if (key.pageDown || input === ' ' || input === 'f') { cuon(caoBanGhi - 2); return; }
      if (input === 'g' || key.home) { setHop({ ...hop, dau: 0, ganCuoi: false }); return; }
      if (input === 'G' || key.end) { setHop({ ...hop, ganCuoi: true }); return; }
      return;
    }

    // 0c) Bảng agent phụ đang được chọn (↓ từ ô nhập trống, /tasks).
    const bp = bangPhuRef.current;
    if (bp && !hop) {
      const ds = dongPhu(bp.tatCa);
      if (key.escape || (key.ctrl && input === 'c')) { setBangPhu(null); return; }
      if (key.upArrow) { if (bp.chon <= 0) setBangPhu(null); else setBangPhu({ ...bp, chon: bp.chon - 1 }); return; }
      if (key.downArrow) { setBangPhu({ ...bp, chon: Math.min(ds.length - 1, bp.chon + 1) }); return; }
      if (key.leftArrow) { setBangPhu({ ...bp, chon: bp.chon <= 1 ? Math.max(0, ds.length - 1) : bp.chon - 1 }); return; }
      if (key.return || key.rightArrow) {
        const m = ds[bp.chon];
        if (!m || m.kieu === 'main') { setBangPhu(null); return; }
        setBangPhu(null);
        setHop({ loai: 'chiTiet', id: m.id, dau: 0, ganCuoi: false, tatCa: bp.tatCa });
        return;
      }
      // Gõ chữ ⇒ rời bảng và gõ thẳng vào ô nhập (như Claude Code).
      if (input && !key.ctrl && !key.meta) { setBangPhu(null); doiO(ST.chen(o, input)); return; }
      return;
    }

    // 1) Màn xem lại bảng ghi.
    if (hop?.loai === 'banGhi') {
      const { dong, khoi } = dungBanGhi(S.bang, rongBanGhi, hop.moRong);
      const toiDa = Math.max(0, dong.length - caoBanGhi);
      const dauNay = hop.ganCuoi ? toiDa : Math.min(hop.dau, toiDa);
      const cuon = (d: number) => setHop({ ...hop, dau: Math.max(0, Math.min(toiDa, dauNay + d)), ganCuoi: dauNay + d >= toiDa });
      const toiKhoi = (i: number, moRong = hop.moRong) => {
        const k = Math.max(0, Math.min(khoi.length - 1, i));
        const b = dungBanGhi(S.bang, rongBanGhi, moRong).khoi[k];
        const tren = b ? Math.max(0, Math.min(Math.max(0, dong.length - caoBanGhi), b.dau - 2)) : dauNay;
        setHop({ ...hop, moRong, chonKhoi: k, dau: tren, ganCuoi: false });
      };
      if (key.escape || input === 'q' || (key.ctrl && (input === 'r' || input === 'o' || input === 'c'))) { setHop(null); return; }
      if (key.tab) {
        if (hop.cheDo === 'tool' || !khoi.length) { setHop({ ...hop, cheDo: 'cuon' }); return; }
        // Sang chế độ chọn khối: nhảy tới khối gần chỗ đang xem nhất (không để vạch chọn nằm ngoài màn hình).
        const gan = khoi.findIndex((b) => b.cuoi >= dauNay);
        const k = gan < 0 ? khoi.length - 1 : gan;
        setHop({ ...hop, cheDo: 'tool', chonKhoi: k, dau: Math.max(0, Math.min(toiDa, khoi[k]!.dau - 2)), ganCuoi: false });
        return;
      }
      if (hop.cheDo === 'tool' && khoi.length) {
        if (key.upArrow || input === 'k') { toiKhoi(hop.chonKhoi - 1); return; }
        if (key.downArrow || input === 'j') { toiKhoi(hop.chonKhoi + 1); return; }
        const b = khoi[hop.chonKhoi];
        if ((key.return || input === ' ') && b) {
          const m = new Set(hop.moRong);
          if (m.has(b.id)) m.delete(b.id); else m.add(b.id);
          toiKhoi(hop.chonKhoi, m);
          return;
        }
        if (input === 'p' && b) {
          // In trọn đầu ra khối đang chọn vào vùng cuộn — để chép bằng chuột / cuộn lại sau.
          const muc = S.bang.find((x) => x.id === b.id);
          if (muc && (muc.loai === 'tool' || muc.loai === 'shell')) kho.them({ ...muc, moRong: true } as unknown as Parameters<typeof kho.them>[0]);
          setHop(null);
          return;
        }
      }
      if (key.upArrow || input === 'k') { cuon(-1); return; }
      if (key.downArrow || input === 'j') { cuon(1); return; }
      if (key.pageUp || (key.ctrl && input === 'b') || input === 'b') { cuon(-(caoBanGhi - 2)); return; }
      if (key.pageDown || (key.ctrl && input === 'f') || input === ' ' || input === 'f') { cuon(caoBanGhi - 2); return; }
      if (input === 'g' || key.home) { setHop({ ...hop, dau: 0, ganCuoi: false }); return; }
      if (input === 'G' || key.end) { setHop({ ...hop, ganCuoi: true }); return; }
      return;
    }

    // 2) Hộp đang mở.
    if (hop?.loai === 'dangNhap') return; // ManDangNhap tự nghe phím
    if (hop?.loai === 'matKhau') {
      if (key.escape) { setHop(null); return; }
      if (key.return) { const mk = hop.giaTri; setHop(null); if (mk) hop.khiXong(mk); return; }
      if (key.backspace || key.delete) { setHop({ ...hop, giaTri: [...hop.giaTri].slice(0, -1).join('') }); return; }
      if (input && !key.ctrl && !key.meta) setHop({ ...hop, giaTri: hop.giaTri + input.replace(/[\r\n]/g, '') });
      return;
    }
    if (hop?.loai === 'menu') {
      const n = hop.ds.length;
      const nhay = (b: number) => {
        let c = hop.chon;
        for (let i = 0; i < n; i += 1) { c = (c + b + n) % n; if (!hop.ds[c]?.tat) break; }
        setHop({ ...hop, chon: c });
      };
      if (key.escape || (key.ctrl && input === 'c')) { setHop(null); hop.khiHuy?.(); return; }
      if (key.upArrow) { nhay(-1); return; }
      if (key.downArrow || (key.tab && !key.shift)) { nhay(1); return; }
      // Đợt 5: số theo nhãn của mục (mục tự khai `so`, vd "0. Thoát") — không chỉ 1–9 theo thứ tự.
      const chonSo = !hop.coLoc && /^[0-9]$/.test(input) ? hop.ds.findIndex((m, k) => soCuaMuc(m, k) === input) : -1;
      if (key.return || (chonSo >= 0 && chonSo < n)) {
        const m = hop.ds[chonSo >= 0 ? chonSo : hop.chon];
        if (!m || m.tat) return;
        setHop(null);
        hop.khiChon(m);
        return;
      }
      if (hop.coLoc) {
        let loc = hop.loc;
        if (key.backspace || key.delete) loc = [...loc].slice(0, -1).join('');
        else if (input && !key.ctrl && !key.meta) loc += input;
        else return;
        setHop({ ...hop, loc, ds: hop.boLoc?.(loc) ?? hop.ds, chon: 0 });
      }
      return;
    }

    // 2b) Thẻ HỎI của agent (đợt 3).
    const hq = S.hoi;
    if (hq && hq.cauHoi.length) {
      let h = hoiRef.current;
      if (!h || h.id !== hq.id) { h = { id: hq.id, buoc: 0, chon: 0, danh: [], tra: [], khac: false }; setHoiUi(h); }
      const cau = hq.cauHoi[h.buoc]!;
      const n = cau.luaChon.length + 1;
      const gui = (tra: Array<{ chon: string[]; khac?: string }>) => {
        if (tra.length < hq.cauHoi.length) { setHoiUi({ ...h!, buoc: tra.length, chon: 0, danh: [], tra, khac: false }); return; }
        setHoiUi(null);
        setO(ST.rong());
        void kn.goi('agent:traLoiHoi', { id: hq.id, traLoi: tra }).catch((e: Error) => kho.thongBao(e.message, 'loi'));
      };
      if (h.khac) {
        if (key.escape) { setHoiUi({ ...h, khac: false }); return; }
        if (key.return && !key.shift && !key.meta) { gui([...h.tra, { chon: h.danh, khac: o.text.trim() }]); return; }
        // còn lại: gõ vào ô nhập như thường (rơi xuống bước 6)
      } else {
        if (key.escape) { setHoiUi(null); void kn.goi('agent:traLoiHoi', { id: hq.id, traLoi: null }); return; }
        if (key.upArrow) { setHoiUi({ ...h, chon: (h.chon - 1 + n) % n }); return; }
        if (key.downArrow || key.tab) { setHoiUi({ ...h, chon: (h.chon + 1) % n }); return; }
        const chonSo = /^[1-9]$/.test(input) ? Number(input) - 1 : -1;
        const viTriChon = chonSo >= 0 && chonSo < n ? chonSo : h.chon;
        if (input === ' ' && cau.nhieu && viTriChon < cau.luaChon.length) {
          const nhan = cau.luaChon[viTriChon]!.nhan;
          setHoiUi({ ...h, danh: h.danh.includes(nhan) ? h.danh.filter((x) => x !== nhan) : [...h.danh, nhan] });
          return;
        }
        if (key.return || chonSo >= 0) {
          if (chonSo >= 0 && chonSo >= n) return;
          if (viTriChon === n - 1) { setHoiUi({ ...h, chon: viTriChon, khac: true }); setO(ST.rong()); return; }
          const nhan = cau.luaChon[viTriChon]!.nhan;
          if (cau.nhieu && !key.return) { setHoiUi({ ...h, chon: viTriChon, danh: h.danh.includes(nhan) ? h.danh.filter((x) => x !== nhan) : [...h.danh, nhan] }); return; }
          gui([...h.tra, { chon: cau.nhieu ? (h.danh.length ? h.danh : [nhan]) : [nhan] }]);
          return;
        }
        if (key.ctrl && input === 'c') { void kn.goi('agent:cancel'); return; }
        return;
      }
    }

    // 2c) Đang CHỜ điều kiện (`cho_doi`): esc = bỏ chờ (agent đi tiếp), không phải dừng cả lượt.
    if (key.escape && S.henCho.cho.length && !S.choDuyet.length && !hop) {
      const c = S.henCho.cho[0]!;
      void kn.goi('agent:huyCho', { id: c.id, cach: 'boCho' }).catch(() => undefined);
      baoNhanh(L('Đã bỏ chờ — agent đi tiếp. Esc lần nữa để dừng hẳn.', 'Stopped waiting — the agent continues. Esc again to interrupt.'));
      return;
    }

    // 3) Thẻ duyệt.
    const d = S.choDuyet[0];
    if (d) {
      /* QA 5c: bấm ĐÚP ("1" "1" cách 150 ms) — phím thứ hai duyệt luôn thẻ KẾ TIẾP vừa hiện mà người dùng chưa kịp đọc
         (thấy thật: lệnh thứ hai chạy không ai xem). Thẻ vừa hiện < 350 ms ⇒ chỉ nhận Esc / ↑↓, không nhận chọn. */
      if (theDuyetHien.current.id !== d.id) theDuyetHien.current = { id: d.id, luc: Date.now() }; // phím tới trước lần vẽ
      const moi = Date.now() - theDuyetHien.current.luc < 350;
      if (moi && !key.escape && !key.upArrow && !key.downArrow) return;
      const lc = luaChonDuyet(d);
      const traLoi = (q: string) => { lucDuyet.current = Date.now(); void kn.goi('agent:traLoiXinPhep', { id: d.id, quyetDinh: q }).catch((e: Error) => kho.thongBao(e.message, 'loi')); };
      if (key.upArrow) { setChonDuyet((c) => (c - 1 + lc.length) % lc.length); return; }
      // Đợt 4: shift+tab trên thẻ = "Có, và không hỏi lại" (như Claude Code) nếu thẻ có lựa chọn đó; không thì lùi lên.
      if (key.tab && key.shift) { const luon = lc.find((x) => x.q === 'choPhepCaFile' || x.q === 'choPhepTienTo'); if (luon) traLoi(luon.q); else setChonDuyet((c) => (c - 1 + lc.length) % lc.length); return; }
      if (key.downArrow || key.tab) { setChonDuyet((c) => (c + 1) % lc.length); return; }
      if (key.return) { traLoi(lc[chonDuyet]!.q); return; }
      if (/^[1-9]$/.test(input) && Number(input) <= lc.length) { traLoi(lc[Number(input) - 1]!.q); return; }
      if (key.escape || input === 'n') { traLoi('tuChoi'); return; }
      if (key.ctrl && input === 'c') { void kn.goi('agent:cancel'); return; }
      return;
    }

    // 4) Phím toàn cục.
    if (key.ctrl && input === 'c') {
      if (shellRef.current) { shellRef.current.huy(); return; }
      if (S.dangChay) { void kn.goi('agent:cancel'); return; }
      if (o.text) { doiO(ST.rong()); return; }
      if (Date.now() - lanCtrlC.current < 2000) { thoat(); return; }
      lanCtrlC.current = Date.now();
      baoNhanh(L('Nhấn ctrl+c lần nữa để thoát', 'Press ctrl+c again to exit'), 2000);
      return;
    }
    if (key.ctrl && input === 'd' && !o.text) { thoat(); return; }
    if (key.shift && key.tab) { xoayCheDo(); return; }
    if (key.ctrl && (input === 'p' || input === 't')) { setHienKeHoach((v) => !v); return; }
    if (key.ctrl && input === 'r') { moBanGhi('cuon'); return; }
    // ctrl+o: bản ghi đầy đủ (mọi đầu ra tool mở sẵn) trong trình xem có cuộn — kiểu Claude Code.
    if (key.ctrl && input === 'o') { moBanGhi('cuon', true); return; }
    if (key.ctrl && input === 'l') { veLaiHet(); return; }
    if ((key.ctrl || key.meta) && input === 'v') { danAnh(); return; }
    if (key.escape) {
      if (goiY) { setGoiY(null); return; }
      if (shellRef.current) { shellRef.current.huy(); baoNhanh(L('Đang dừng lệnh…', 'Stopping the command…')); return; }
      if (hangChoRef.current.length) {
        // Huỷ hàng chờ: chữ quay về ô nhập (không mất), lượt đang chạy vẫn chạy tiếp.
        const h = hangChoRef.current;
        setHangCho([]);
        const t = [...h, o.text].filter(Boolean).join('\n');
        setO({ text: t, contro: t.length });
        baoNhanh(L('Đã huỷ hàng chờ — chữ đã về ô nhập. Esc lần nữa để dừng việc đang chạy.', 'Queue cleared — text is back in the input. Esc again to interrupt.'));
        return;
      }
      if (S.dangChay) { void kn.goi('agent:cancel'); baoNhanh(L('Đang dừng…', 'Interrupting…')); return; }
      const lan2 = Date.now() - lanEsc.current < 600;
      lanEsc.current = Date.now();
      if (o.text) {
        if (lan2) { doiO(ST.rong()); return; }
        baoNhanh(L('Esc lần nữa để xoá ô nhập', 'Esc again to clear'), 800);
        return;
      }
      if (lan2) { moMenu('rewind'); return; }
      if (S.muc.some((m) => m.kieu === 'nguoi')) baoNhanh(L('Esc lần nữa để quay lui về một câu cũ', 'Esc again to rewind'), 800);
      return;
    }

    // 4b) Bảng agent phụ: ↓ (ô nhập trống) để quản lý, ← để nhảy vào agent phụ đang chạy.
    if (!o.text && !goiY) {
      const ds = dongPhu(false);
      if (key.downArrow && ds.length > 1 && !lichSu.current.dangDuyet()) { setBangPhu({ chon: 1, tatCa: false }); return; }
      if (key.leftArrow && ds.length > 1) { setHop({ loai: 'chiTiet', id: ds[1]!.id, dau: 0, ganCuoi: false, tatCa: false }); return; }
    }

    // 5) Gợi ý.
    if (goiY && goiY.ds.length) {
      if (key.upArrow) { setGoiY({ ...goiY, chon: (goiY.chon - 1 + goiY.ds.length) % goiY.ds.length, daChon: true }); return; }
      if (key.downArrow) { setGoiY({ ...goiY, chon: (goiY.chon + 1) % goiY.ds.length, daChon: true }); return; }
      if (key.tab) { nhanGoiY(goiY, false); return; }
      /* Enter: gửi NGUYÊN câu khi đã có tham số hoặc chữ gõ là đúng một lệnh (lỗi 18/10: "/mcp mo" ⇒ chỉ
         chạy "/mcp", vứt tham số). Menu chỉ nhận Enter khi đang chọn bằng ↑/↓ hoặc chữ còn là tiền tố dở. */
      const goTrim = o.text.trim();
      const duCau = goiY.kieu === '/' && !goiY.daChon && (/\s/.test(goTrim) || Boolean(tachLenhCli(goTrim)) || S.lenhDuAn.some((l) => l.ten === goTrim));
      if (key.return && !key.meta && !key.shift && !duCau) { nhanGoiY(goiY, true); return; }
    }

    // 6) Ô nhập. Xuống dòng: Shift+Enter (kitty CSI u), Alt+Enter, ctrl+j (LF cũ hoặc CSI u) — `banPhim.ts`.
    if (laXuongDong(input, key)) { doiO(ST.chen(o, '\n')); return; }
    if (key.return) {
      const r = ST.enter(o);
      if (!r.guiDi) { doiO(r.o); return; }
      guiCauHoi(o.text);
      return;
    }
    if ((key.upArrow || key.downArrow) && key.ctrl) { muiTenDon(Boolean(key.upArrow), true); return; }
    if (key.upArrow) {
      const l = ST.lenDong(o);
      if (l) { setO(l); return; }
      const t = lichSu.current.truoc(o.text);
      if (t !== null) doiO({ text: t, contro: t.length });
      return;
    }
    if (key.downArrow) {
      const x = ST.xuongDong(o);
      if (x) { setO(x); return; }
      const t = lichSu.current.sau();
      if (t !== null) doiO({ text: t, contro: t.length });
      return;
    }
    if (key.leftArrow) { setO(key.meta || key.ctrl ? ST.tuTrai(o) : ST.sangTrai(o)); return; }
    if (key.rightArrow) { setO(key.meta || key.ctrl ? ST.tuPhai(o) : ST.sangPhai(o)); return; }
    if (key.home || (key.ctrl && input === 'a')) { setO(ST.dauDong(o)); return; }
    if (key.end || (key.ctrl && input === 'e')) { setO(ST.cuoiDong(o)); return; }
    if (key.ctrl && input === 'u') { doiO(ST.xoaVeDau(o)); return; }
    if (key.ctrl && input === 'k') { doiO(ST.xoaVeCuoi(o)); return; }
    if ((key.ctrl && input === 'w') || ((key.backspace || key.delete) && key.meta)) { doiO(ST.xoaTu(o)); return; }
    if (key.meta && input === 'b') { setO(ST.tuTrai(o)); return; }
    if (key.meta && input === 'f') { setO(ST.tuPhai(o)); return; }
    if (key.backspace || key.delete) { doiO(ST.xoaLui(o)); return; }
    if (key.tab) return;
    // Đợt 5: `?` ở ô nhập TRỐNG ⇒ bảng phím tắt (như Claude Code). Có chữ rồi thì `?` là chữ thường.
    if (input === '?' && !o.text && !S.dangChay) {
      menu({ tieuDe: L('Phím tắt', 'Shortcuts'), than: bangPhimTat(), ds: [{ nhan: L('Danh sách lệnh /help', 'Command list /help'), giaTri: 'help' }, { nhan: L('Đóng', 'Close'), giaTri: 'dong', so: '0' }], khiChon: (m) => { if (m.giaTri === 'help') void chayLenh('/help', boiCanh()); } });
      return;
    }
    if (input && !key.ctrl && !key.meta) {
      lichSu.current.datLai();
      doiO(ST.chen(o, input));
    }
  });

  // ─── Vẽ ────────────────────────────────────────────────────────

  const cd = moTaCheDo(S.ws?.cheDoQuyen);
  const thongTin: ThongTinMoDau = useMemo(() => ({
    phienBan,
    ten: kn.nguoi.fullName?.trim() || kn.nguoi.username,
    thuMuc: thuMuc.replace(process.env.HOME ?? process.env.USERPROFILE ?? '\u0000', '~'),
    nhanh: S.ws?.branch ?? null,
    model: modelNay?.ten ?? '—',
    muc: mucNay?.ten ?? L('Vừa', 'Medium'),
    cheDo: { ten: cd.ten, icon: cd.icon, mau: cd.mau },
    banMoi,
    lenhCai: lenhCaiChoMay(),
    ngoaiTuyen,
    trinhDuyet: Boolean(S.ws?.choTrinhDuyet),
  // Màn mở đầu chỉ in MỘT lần — chụp thông tin lúc đó.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [S.ws?.branch, modelNay?.ten, mucNay?.ten, cd.id, S.ws?.choTrinhDuyet, ngonNgu()]);
  const fs = fsRef.current;
  // In nối tiếp: banner in MỘT lần rồi nằm im ⇒ bỏ model/chế độ (chân trang hiện bản đang đúng).
  const thongTinIn: ThongTinMoDau = fs ? thongTin : { ...thongTin, model: undefined, muc: undefined, cheDo: undefined };

  const o = oRef.current;
  const hop = hopRef.current;
  const goiY = goiYRef.current;
  const chonDuyet = chonDuyetRef.current;
  const hangCho = hangChoRef.current;
  // Mốc thẻ duyệt ĐẦU hàng vừa hiện (chặn bấm đúp duyệt mù thẻ kế tiếp — xem nhánh thẻ duyệt trong useInput).
  if (S.choDuyet[0] && theDuyetHien.current.id !== S.choDuyet[0].id) theDuyetHien.current = { id: S.choDuyet[0].id, luc: Date.now() };
  const shell = shellRef.current;
  const rongMuc = Math.max(30, cot - 1);

  /*
   * TOÀN MÀN HÌNH: không có <Static> — bảng ghi là các dòng trong một khung cuộn ghim phía trên
   * ô nhập. Dòng của từng mục được nhớ theo (id, độ rộng, lần vẽ lại, ngôn ngữ): dựng lại
   * markdown của cả bảng ghi mỗi nhịp xoay (8 lần/giây) là đốt CPU vô ích.
   */
  const dongMuc = (m: MucBang, truoc?: MucBang): string[] => {
    if (m.loai === 'chao') return veManMoDau(thongTin, veLogo(Math.min(rongMuc, 96) - 6), rongMuc);
    const k = `${rongMuc}|${S.khoaBang}|${ngonNgu()}|${truoc?.loai ?? ''}`;
    const c = boNhoDong.current.get(m.id);
    if (c && c.k === k) return c.d;
    const d = veMuc(m, rongMuc, truoc).join('\n').split('\n');
    boNhoDong.current.set(m.id, { k, d });
    return d;
  };
  const vaoKhung = (con: React.ReactNode) => (
    <Box flexDirection="column" width={cot - 1} height={Math.max(4, hang - 1)} overflow="hidden">{con}</Box>
  );

  const staticBang = fs ? null : (
    <Static key={S.khoaBang} items={S.bang}>
      {(m: MucBang, i: number) => (
        <Box key={m.id} flexDirection="column">
          <Text>{m.loai === 'chao' ? veManMoDau(thongTinIn, veLogo(Math.min(rongMuc, 96) - 6), rongMuc).join('\n') : veMuc(m, rongMuc, S.bang[i - 1]).join('\n')}</Text>
        </Box>
      )}
    </Static>
  );

  if (hop?.loai === 'chiTiet') {
    const ds = dongPhu(hop.tatCa).filter((x) => x.kieu !== 'main');
    const i = ds.findIndex((x) => x.id === hop.id);
    const dong = dongChiTiet(hop.id);
    const toiDa = Math.max(0, dong.length - caoBanGhi);
    const dau = hop.ganCuoi ? toiDa : Math.min(hop.dau, toiDa);
    const laShell = hop.id.startsWith('shell:');
    const xem = (
        <XemBanGhi
          dong={dong} dau={dau} cao={caoBanGhi} rong={cot - 1} khoiChon={null}
          tieuDe={`◆ ${laShell ? L('Lệnh nền', 'Background shell') : L('Agent phụ', 'Subagent')} ${i >= 0 ? `${i + 1}/${ds.length}` : ''}`}
          goiY={`${L('↑↓ cuộn · ←/→ agent khác · g/G đầu/cuối', '↑↓ scroll · ←/→ other agents · g/G top/bottom')}${laShell ? L(' · x dừng lệnh nền', ' · x stop shells') : ''} · ${L('Esc quay lại', 'Esc back')}`}
        />
    );
    return fs ? vaoKhung(xem) : <>{staticBang}{xem}</>;
  }

  // Màn xem lại chiếm gần trọn chiều cao — vẽ riêng, không kèm bảng kế hoạch/ô nhập.
  if (hop?.loai === 'banGhi') {
    const { dong, khoi } = dungBanGhi(S.bang, rongBanGhi, hop.moRong);
    const toiDa = Math.max(0, dong.length - caoBanGhi);
    const dau = hop.ganCuoi ? toiDa : Math.min(hop.dau, toiDa);
    const k = hop.cheDo === 'tool' ? khoi[hop.chonKhoi] ?? null : null;
    const xem = (
        <XemBanGhi
          dong={dong} dau={dau} cao={caoBanGhi} rong={cot - 1} khoiChon={k}
          tieuDe={hop.cheDo === 'tool' ? L(`◆ Đầu ra lệnh/tool (${khoi.length}) — ${k ? k.nhan : ''}`, `◆ Command/tool outputs (${khoi.length}) — ${k ? k.nhan : ''}`) : L('◆ Bảng ghi', '◆ Transcript')}
          goiY={hop.cheDo === 'tool'
            ? L('↑↓ chọn khối · Enter mở/thu · p in trọn ra màn hình · Tab cuộn tự do · Esc đóng', '↑↓ pick block · Enter expand/collapse · p print in full · Tab free scroll · Esc close')
            : L('↑↓/j k cuộn · Space/b trang · g/G đầu/cuối · Tab chọn đầu ra (mở/thu) · Esc đóng', '↑↓/j k scroll · Space/b page · g/G top/bottom · Tab pick outputs (expand/collapse) · Esc close')}
        />
    );
    return fs ? vaoKhung(xem) : <>{staticBang}{xem}</>;
  }

  /*
   * KẾ HOẠCH kiểu Claude Code (18/10/2026): danh sách ☐/☒/◐ gọn NGAY DƯỚI dòng trạng thái, mỗi việc
   * xuống dòng đủ chữ. Bỏ hộp nổi bên phải (đè nội dung, cắt "…" mọi dòng). ctrl+t thu/mở.
   * Hiện khi đang chạy, hoặc khi kế hoạch còn việc chưa xong; menu/thẻ duyệt đang mở ⇒ cất cho rộng chỗ.
   */
  const dangHoi = Boolean(hop) || S.choDuyet.length > 0;
  const keHoachConViec = S.keHoach.some((v) => v.trangThai !== 'xong');
  const coBang = hienKeHoach && S.keHoach.length > 0 && (S.dangChay || keHoachConViec) && !dangHoi;
  const rongTrai = cot - 1;
  const dongKH = coBang ? dongKeHoachGon(S, rongTrai, Math.min(10, Math.max(3, Math.floor(hang / 5)))) : [];
  const d = S.choDuyet[0];
  // Bảng agent phụ: hiện khi có agent phụ/lệnh nền đang chạy, hoặc đang được chọn (↓ / /tasks).
  const bp = bangPhuRef.current;
  const dsBangPhu = dongPhu(bp?.tatCa ?? false);
  const bangPhuHien = Boolean(bp) || dsBangPhu.length > 1;
  /*
   * NGÂN SÁCH CHIỀU CAO của vùng động: nó KHÔNG được cao hơn terminal — Ink xoá
   * khung cũ bằng cách lùi con trỏ đúng số dòng đã vẽ, mà con trỏ không lùi
   * được lên vùng đã cuộn mất ⇒ khung mới đè lên dòng cuối của phần đã in (đo
   * thật: dòng "✓ CuongMini · …" bị nuốt ở terminal 90×44).
   */
  const caoBang = dongKH.length;
  const caoTool = S.toolChay.length * 7 + (shell ? 8 : 0) + (hangCho.length ? Math.min(hangCho.length, 3) + 3 : 0);
  // +1: dòng gợi ý dưới ô nhập (phím xuống dòng / chế độ shell·ghi nhớ) khi ô có chữ.
  const caoNhap = hop || d ? 0 : 5 + (goiY ? Math.min(goiY.ds.length, 8) + 1 : 0) + o.text.split('\n').length - 1 + (o.text ? 1 : 0);
  const caoCoDinh = 2 + 1 + caoBang + caoTool + caoNhap + 2 + (bangPhuHien ? Math.min(dsBangPhu.length, 10) + 1 : 0);
  const toiDaSong = Math.max(3, hang - caoCoDinh - (d ? 14 : 0) - (hop ? 14 : 0));
  const toiDaDiff = Math.max(4, hang - caoCoDinh - 14);

  const vungTrai = (
    <Box flexDirection="column" width={rongTrai}>
      <VungSong S={S} rong={rongTrai} toiDaDong={toiDaSong} nhip={nhip} />
      {shell ? <ShellDangChay lenh={shell.lenh} ra={shell.ra} batDau={shell.batDau} rong={rongTrai} nhip={nhip} /> : null}
      <DongTrangThai S={S} nhip={nhip} />
      <DongHenCho S={S} />
      {dongKH.length ? <Box paddingLeft={2} marginTop={S.dangChay ? 0 : 1}><Text>{dongKH.join('\n')}</Text></Box> : null}
      <HangCho ds={hangCho} rong={rongTrai} />
      {hop?.loai === 'menu' ? (
        <MenuView tieuDe={hop.tieuDe} moTa={hop.moTa} than={hop.than} ds={hop.ds} chon={hop.chon} loc={hop.loc} coLoc={hop.coLoc} rong={Math.min(rongTrai, 120)} mauVien={hop.mauVien} />
      ) : hop?.loai === 'matKhau' ? (
        <Box borderStyle={kieuVien()} flexDirection="column" paddingX={1} marginTop={1} width={Math.min(rongTrai, 90)}>
          <Text>{hop.tieuDe}</Text>
          <Text>{mo(hop.moTa)}</Text>
          <Box marginTop={1}><ONhapNho nhan={L('Mật khẩu', 'Password')} giaTri={hop.giaTri} an dangNhap /></Box>
        </Box>
      ) : hop?.loai === 'dangNhap' ? (
        <ManDangNhap
          rong={rongTrai}
          nhacNho={hop.nhacNho}
          onXong={(n: NguoiDung) => { kn.datNguoi(n); setHop(null); kho.thongBao(L(`Đã đăng nhập: ${n.fullName || n.username}`, `Signed in as ${n.fullName || n.username}`), 'ok'); }}
          onHuy={() => setHop(null)}
        />
      ) : S.hoi && S.hoi.cauHoi.length && !hoiRef.current?.khac ? (
        <TheHoi
          cau={S.hoi.cauHoi[Math.min(hoiRef.current?.id === S.hoi.id ? hoiRef.current.buoc : 0, S.hoi.cauHoi.length - 1)]!}
          so={(hoiRef.current?.id === S.hoi.id ? hoiRef.current.buoc : 0) + 1} tong={S.hoi.cauHoi.length}
          chon={hoiRef.current?.id === S.hoi.id ? hoiRef.current.chon : 0} daDanh={hoiRef.current?.id === S.hoi.id ? hoiRef.current.danh : []}
          rong={rongTrai} nhapKhac={false}
        />
      ) : d ? (
        <TheDuyet d={d} chon={chonDuyet} rong={rongTrai} toiDaDong={toiDaDiff} conLai={S.choDuyet.length} />
      ) : (
        <Box marginTop={1} flexDirection="column">
          {/* "Khác — tự gõ": thẻ hỏi cất đi nhường ô nhập — vẫn phải nói đang trả lời CÂU NÀO (QA 18/10: ô nhập trơn
              "CuongMini is working… type to queue", người dùng tưởng đang xếp hàng tin mới). */}
          {S.hoi && hoiRef.current?.khac && hoiRef.current.id === S.hoi.id ? (
            <Text>{`${mau('#fbbf24')('?')} ${dam(S.hoi.cauHoi[hoiRef.current.buoc]?.cauHoi ?? '')} ${mo(L('· gõ câu trả lời · Enter gửi · Esc quay lại lựa chọn', '· type your answer · Enter to send · Esc back to the choices'))}`}</Text>
          ) : null}
          <ONhapView o={o} rong={rongTrai} cheDo={S.ws?.cheDoQuyen ?? 'keHoach'} dangChay={S.dangChay} goiYMo={Boolean(goiY)} soHangCho={hangCho.length} xuongDong={xuongDong} />
          {goiY ? <GoiYView ds={goiY.ds} chon={goiY.chon} rong={rongTrai} kieu={goiY.kieu} /> : null}
        </Box>
      )}
      {bangPhuHien ? (
        <Box flexDirection="column" paddingLeft={1}>
          <Text wrap="truncate">{nhac ? mau('#fbbf24')(nhac) : dongTomTat({
            cheDo: cd.ten, mauCheDo: cd.mau, soShell: S.lenhNen.filter((x) => x.dangChay).length,
            soPhu: S.agentPhu.filter((a) => a.trangThai === 'dang').length, dangChay: S.dangChay, dangChon: Boolean(bp),
          })}</Text>
          <Text>{veDongBang(dsBangPhu.slice(0, 9), bp ? bp.chon : -1, rongTrai - 2, nhip).join('\n')}</Text>
          {dsBangPhu.length > 9 ? <Text>{mo(L(`  … +${dsBangPhu.length - 9} nữa (/tasks)`, `  … +${dsBangPhu.length - 9} more (/tasks)`))}</Text> : null}
        </Box>
      ) : (
        <ChanTrang S={S} rong={rongTrai} model={(modelNay?.ten ?? '—').replace(/^Cuong(Mini)? /, '')} muc={mucNay?.ten ?? L('Vừa', 'Medium')} nhac={nhac}
          ctw={veDongCtw(dongCtw, ngonNgu(), rongTrai)} goiYPhim={!o.text && !S.dangChay && !hop && !d} />
      )}
    </Box>
  );

  const vungDuoi = vungTrai;

  if (!fs) return <>{staticBang}{vungDuoi}</>;

  // Toàn màn hình: khung cuộn bám ĐÁY (justifyContent flex-end; phần thừa phía trên bị cắt) + vùng dưới ghim.
  const tatCaDong = S.bang.flatMap((m, i) => dongMuc(m, S.bang[i - 1]));
  if (tatCaDong.length !== viTri.current.tong) viTri.current = capNhatTong(viTri.current, tatCaDong.length);
  const v = viTri.current;
  const hien = catKhung(tatCaDong, v, hang);
  return vaoKhung(
    <>
      {/* Ít dòng hơn khung ⇒ xếp từ trên xuống (banner ở đỉnh); nhiều hơn ⇒ bám đáy, phần đầu bị cắt. */}
      <Box ref={khungRef} flexDirection="column" flexGrow={1} flexShrink={1} overflow="hidden" justifyContent={hien.length >= caoKhung.current ? 'flex-end' : 'flex-start'}>
        <Box flexDirection="column" flexShrink={0}><Text>{hien.join('\n')}</Text></Box>
      </Box>
      {v.cuon > 0 ? (
        <Box paddingLeft={1} flexShrink={0}>
          <Text wrap="truncate">{`${mau('#fbbf24')(v.moi ? L(`↓ ${v.moi} dòng mới`, `↓ ${v.moi} new line${v.moi > 1 ? 's' : ''}`) : L(`↑ đang xem lại · còn ${v.cuon} dòng bên dưới`, `↑ scrolled up · ${v.cuon} line${v.cuon === 1 ? '' : 's'} below`))} ${mo(L('· End hoặc cuộn xuống để về cuối', '· End or scroll down to jump to the bottom'))}`}</Text>
        </Box>
      ) : null}
      <Box flexDirection="column" flexShrink={0}>{vungDuoi}</Box>
    </>,
  );
}

function tuongDoi(t: number): string {
  const d = Date.now() - t;
  if (d < 60_000) return L('vừa xong', 'just now');
  if (d < 3_600_000) return L(`${Math.floor(d / 60_000)} phút trước`, `${Math.floor(d / 60_000)}m ago`);
  if (d < 86_400_000) return L(`${Math.floor(d / 3_600_000)} giờ trước`, `${Math.floor(d / 3_600_000)}h ago`);
  if (d < 7 * 86_400_000) return L(`${Math.floor(d / 86_400_000)} ngày trước`, `${Math.floor(d / 86_400_000)}d ago`);
  return new Date(t).toLocaleDateString(L('vi-VN', 'en-US'));
}

/**
 * Đợt 5: thẻ lựa chọn KHÔNG được cao hơn terminal (Ink xoá khung cũ bằng cách lùi con trỏ — khung quá cao đè lên
 * phần đã in). Thân dài (thẻ CT Work, bảng sprint) cắt còn `toiDa` dòng + một dòng nói còn bao nhiêu.
 */
function catThanThe(than: string, toiDa: number): string {
  const d = than.split('\n');
  if (d.length <= toiDa) return than;
  return [...d.slice(0, toiDa - 1), mo(L(`… +${d.length - toiDa + 1} dòng (cửa sổ thấp — phóng to terminal để xem đủ)`, `… +${d.length - toiDa + 1} lines (short window — enlarge the terminal to see all)`))].join('\n');
}
