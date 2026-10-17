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
import { Box, Static, useApp, useInput, useStdout } from 'ink';
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type MutableRefObject } from 'react';
import { chuanHoa, dsCauHoi, locPhien, type MucGhi, type PhienCu } from 'ct-lenh';
import { docAnhDataUrl, guiThangDuoc, tachAnh } from '../anh';
import { danAnhTuClipboard } from '../anhDan';
import { timTrinhDuyet } from '../../../cuongmini-core/src/timTrinhDuyet';
import { CAC_MUC, docCaiDat, ghiCaiDat, luaChon, moTaGiaTri, nenBatTrinhDuyet, tenMuc, type CaiDat, type MucLuaChon } from '../caiDat';
import { datNgonNgu, doNgonNgu, L, ngonNgu, nhacNgonNguTraLoi } from '../i18n';
import { chiTietAgent, chiTietShell, dongBangPhu, dongTomTat, veDongBang } from '../bangPhu';
import { cauTrangThai } from '../trangThai';
import { CHE_DO, cheDoKe, moTaCheDo } from '../cheDo';
import { lenhCaiChoMay } from '../capNhat';
import { fileQuyUoc, luuGhiNho, tachGhiNho } from '../ghiNho';
import type { KetNoiLoi } from '../ketNoi';
import type { CongNangCap, KhoChat, MucBang } from '../kho';
import { nhanKieu, quetDuAn, type KyHieu } from '../kyHieu';
import { canAscii, datAscii } from '../kyTu';
import { LENH_GOI_Y, MODEL_DU_PHONG, MUC_DU_PHONG, NHOM_CONG, chayLenh, tenMuc as tenMucNoLuc, tenModel, nhomCong, tenNhomCong, moPhien, tachLenhCli, type BoiCanhLenh, type ModelMuc, type MucNoLuc } from '../lenh';
import { veLogo } from '../logo';
import { datTheme, doTheme, mau, mo } from '../mau';
import { damBaoThuMuc, duongLichSu, thuMucGoc, xoaPhien, type NguoiDung } from '../phien';
import { chayShell, dungNguCanhShell, type LanChayShell } from '../shell';
import { guiThongBaoHeThong, rungChuong } from '../thongBao';
import { chiMucDuAn, diemMo, phuLucNhac, timMo, tokenNhac } from '../timFile';
import { dungBanGhi, veManMoDau, veMuc, type ThongTinMoDau } from '../veBang';
import { Text } from './chu';
import { ManDangNhap } from './ManDangNhap';
import * as ST from './soanThao';
import {
  BangKeHoach, ChanTrang, DongTrangThai, GoiYView, HangCho, MenuView, ONhapNho, ONhapView, ShellDangChay, TheDuyet, VungSong, XemBanGhi,
  coGiDeHien, luaChonDuyet, type MucGoiY, type MucMenu,
} from './thanhPhan';
import { kieuVien } from '../kyTu';

type Hop =
  | { loai: 'menu'; tieuDe: string; moTa?: string; ds: MucMenu[]; chon: number; loc: string; coLoc: boolean; mauVien?: string; khiChon: (m: MucMenu) => void; khiHuy?: () => void; boLoc?: (q: string) => MucMenu[] }
  | { loai: 'matKhau'; tieuDe: string; moTa: string; giaTri: string; khiXong: (mk: string) => void }
  | { loai: 'dangNhap'; nhacNho?: string }
  | { loai: 'banGhi'; cheDo: 'cuon' | 'tool'; dau: number; chonKhoi: number; moRong: Set<number>; ganCuoi: boolean }
  /** Màn chi tiết một agent phụ / lệnh nền (Enter trong bảng agent phụ). */
  | { loai: 'chiTiet'; id: string; dau: number; ganCuoi: boolean; tatCa: boolean };

/** Bảng agent phụ đang được chọn bằng phím (↓ từ ô nhập trống, hoặc /tasks). */
interface BangPhuChon { chon: number; tatCa: boolean }

interface GoiY { kieu: '/' | '@'; ds: MucGoiY[]; chon: number; dau: number }

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
}

export function ManChat({ kn, kho, thuMuc, phienBan, cauHoiDau, banMoi, ngoaiTuyen, chonViecCu, onThoat }: PropsManChat) {
  useSyncExternalStore(useCallback((f) => kho.nghe(f), [kho]), () => kho.phienBan);
  const S = kho.S;
  const { exit } = useApp();
  const { stdout } = useStdout();
  const [cot, hang] = useKichThuoc();
  const [oRef, setO] = useStateRef<ST.ONhap>(ST.rong());
  const [goiYRef, setGoiY] = useStateRef<GoiY | null>(null);
  const [hopRef, setHop] = useStateRef<Hop | null>(null);
  const [chonDuyetRef, setChonDuyet] = useStateRef(0);
  const [hangChoRef, setHangCho] = useStateRef<string[]>([]);
  const [bangPhuRef, setBangPhu] = useStateRef<BangPhuChon | null>(null);
  const [shellRef, setShell] = useStateRef<{ lenh: string; ra: string; batDau: number; huy: () => void } | null>(null);
  const [hienKeHoach, setHienKeHoach] = useState(true);
  const [nhac, setNhac] = useState('');
  const [nhip, setNhip] = useState(0);
  const caiDat = useRef<CaiDat>(docCaiDat());
  const lichSu = useRef(new ST.LichSu(docLichSu()));
  const chiMuc = useRef<string[] | null>(null);
  const kyHieu = useRef<KyHieu[] | null>(null);
  const dangNapChiMuc = useRef(false);
  const lanCtrlC = useRef(0);
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

  const baoChuY = useCallback((tieuDe: string, noiDung: string) => {
    const c = caiDat.current.thongBao;
    if (c === 'tat') return;
    rungChuong();
    if (c === 'heThong' && !dangNhin.current) guiThongBaoHeThong(tieuDe, noiDung);
  }, []);

  // ─── Model / mức / chế độ ──────────────────────────────────────

  const dsModel = useCallback((): ModelMuc[] => (S.info?.models?.length ? S.info.models : MODEL_DU_PHONG).map((m) => ({ ...m, ten: tenModel(m) })), [S]);
  const dsMuc = useCallback((): MucNoLuc[] => (S.info?.mucNoLuc?.length
    ? S.info.mucNoLuc.map((m) => ({ id: m.id, ten: tenMucNoLuc(m.id, m.ten), mo: L(`${m.buoc} bước${m.viecPhu ? ` · ${m.viecPhu} agent phụ` : ''}`, `${m.buoc} steps${m.viecPhu ? ` · ${m.viecPhu} subagents` : ''}`) }))
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
  const doiCheDo = async (id: string) => {
    const ws = await kn.goi<typeof S.ws>('agent:datCheDoQuyen', { cheDo: id });
    if (ws) S.ws = ws;
    kho.bao(true);
  };

  const xoayCheDo = () => {
    const ke = cheDoKe(S.ws?.cheDoQuyen);
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

  const xoaManHinh = () => { stdout.write('\x1b[2J\x1b[3J\x1b[H'); };

  /** Đổi theme/ký tự: xoá màn hình rồi in lại TOÀN BỘ bảng ghi với màu mới. */
  const veLaiHet = () => { xoaManHinh(); kho.veLai(); };

  /** Đổi ngôn ngữ: lưu, đặt, rồi XOÁ MÀN HÌNH VÀ IN LẠI toàn bộ bảng ghi — khung hình đổi chữ ngay. */
  const doiNgonNgu = (n: 'vi' | 'en') => {
    caiDat.current = { ...caiDat.current, ngonNgu: n };
    ghiCaiDat(caiDat.current);
    datNgonNgu(n);
    veLaiHet();
    kho.thongBao(L('Đã chuyển giao diện sang Tiếng Việt. Gõ /language để đổi lại.', 'Interface switched to English. Type /language to switch back.'), 'ok');
  };

  const doiTheme = (t: 'tuDong' | 'toi' | 'sang') => {
    caiDat.current = { ...caiDat.current, theme: t };
    ghiCaiDat(caiDat.current);
    datTheme(t === 'tuDong' ? doTheme(process.env) : t);
    veLaiHet();
    kho.thongBao(`${tenMuc('theme')}: ${moTaGiaTri('theme', caiDat.current)}`, 'ok');
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

  const moBanGhi = (cheDo: 'cuon' | 'tool') => {
    const { khoi } = dungBanGhi(S.bang, Math.max(30, cot - 3), new Set());
    if (cheDo === 'tool' && !khoi.length) { baoNhanh(L('Chưa có đầu ra lệnh/tool nào để mở.', 'No command/tool output to open yet.')); return; }
    setHop({ loai: 'banGhi', cheDo, dau: 0, chonKhoi: Math.max(0, khoi.length - 1), moRong: new Set(), ganCuoi: true });
  };

  // ─── Cổng Claude chính hãng / modelapi (docs/cong-anthropic-chinh-hang.md mục 9) ───

  const hoiMatKhauCong = (cong: 'anthropic' | 'modelapi', lyDo: string, sauKhi: () => Promise<unknown> | void) => {
    const laCH = cong === 'anthropic';
    setHop({
      loai: 'matKhau', giaTri: '',
      tieuDe: laCH ? L('🔒 Cổng Claude chính hãng', '🔒 Official Claude gateway') : L('🔒 Cổng modelapi', '🔒 modelapi gateway'),
      moTa: `${lyDo}\n${L('Nhập mật khẩu quản trị cấp cho cổng này (Enter mở khoá · Esc bỏ qua).', 'Enter the admin-issued password for this gateway (Enter to unlock · Esc to skip).')}`,
      khiXong: (mk) => {
        kho.thongBao(L('Đang mở khoá…', 'Unlocking…'));
        // Mỗi cổng một mật khẩu + một vé riêng; lõi lưu vé và gửi kèm mọi lượt.
        const mo = laCH ? kn.moCongAnthropic(mk).then((r) => r.ten) : kn.moDuPhong(mk);
        mo.then(async (ten) => {
          kho.thongBao(L(`Đã mở khoá ${ten || (laCH ? 'cổng Claude chính hãng' : 'modelapi')}.`, `Unlocked ${ten || (laCH ? 'the official Claude gateway' : 'modelapi')}.`), 'ok');
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
  const moKhoaModel = (id: string) => {
    const mm = dsModel().find((x) => x.id === id);
    if (!mm) return;
    xacNhanDat(mm, () => hoiMatKhauCong('anthropic', L(`${mm.ten} cần mật khẩu cổng Claude chính hãng.`, `${mm.ten} needs the official Claude gateway password.`),
      () => doiModel(id).then(() => kho.thongBao(`Model: ${mm.ten}`, 'ok'))));
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
      const nhom = c.cong === 'anthropic' ? tenNhomCong('anthropic') : c.ten || 'modelapi';
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

  const moMenu = (loai: 'model' | 'muc' | 'resume' | 'cheDo' | 'config' | 'rewind' | 'banGhi' | 'tasks' | 'ngonNgu' | 'cong') => {
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
      // Nhóm theo cổng (Cổng chính · Claude chính hãng · modelapi); 🔒 = cần mật khẩu cổng chính hãng.
      const tatCa = dsModel();
      const ds: MucMenu[] = [
        ...NHOM_CONG.flatMap((n) => tatCa.filter((m) => nhomCong(m) === n).map((m) => ({
          nhom: tenNhomCong(n), nhan: `${m.canMoKhoa ? '🔒 ' : ''}${m.ten}${m.mienPhi ? L(' · miễn phí', ' · free') : ''}`,
          mo: !m.dungDuoc ? L('chưa mở trên máy chủ', 'not enabled on the server') : m.canMoKhoa ? L(`cần mật khẩu — ${m.mo}`, `password required — ${m.mo}`) : m.mo,
          tat: !m.dungDuoc, dangChon: m.id === modelNay?.id, giaTri: `m:${m.id}`,
        }))),
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
        .map((p) => ({ nhan: `${p.ghim ? '📌 ' : ''}${p.tieuDe || L('Việc chưa đặt tên', 'Untitled task')}`, mo: `${p.duAn ? `${p.duAn} · ` : ''}${tuongDoi(p.luucLuc)} · ${p.soTinNhan} tin`, giaTri: p.id }));
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
    kho, kn, thuMuc, phienBan, guiThat, doiModel, doiMuc, doiCheDo, dsModel, dsMuc, moMenu, moKhoaModel, doiTheme, doiNgonNgu,
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
    // Đang chạy ⇒ XẾP HÀNG (như Claude Code): tự gửi khi lượt xong, esc để huỷ.
    if (S.dangChay) { setHangCho((h) => [...h, text]); return; }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      if (l.daBat === false) { kho.thongBao(L('Quản trị chưa bật cổng Claude chính hãng — chọn model khác bằng /model.', 'The admin has not enabled the official Claude gateway — pick another model with /model.'), 'canh'); return; }
      hoiMatKhauCong('anthropic', L('Model này cần mật khẩu cổng Claude chính hãng.', 'This model needs the official Claude gateway password.'), () => {
        if (S.cauHoiCuoi) { kho.thongBao(L('Đang gửi lại câu hỏi…', 'Resending…')); guiThat(S.cauHoiCuoi, {}); }
      });
    } else if (l.ma === 'CONG_ANTHROPIC_HET_HAN_MUC' || l.ma === 'CONG_ANTHROPIC_HET_KEY') {
      // Có vé modelapi thì máy chủ tự lùi sang đó cho các lượt sau.
      hoiMatKhauCong('modelapi', L('Dùng modelapi (GPT, tính phí) thay thế? Có vé modelapi thì máy chủ tự chuyển sang đó.', 'Use modelapi (GPT, paid) instead? With a modelapi ticket the server switches there automatically.'), () => {
        if (S.cauHoiCuoi) { kho.thongBao(L('Đang gửi lại câu hỏi…', 'Resending…')); guiThat(S.cauHoiCuoi, {}); }
      });
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
          d: !q ? 1 : [l.ten, ...(l.khac ?? [])].some((k) => chuanHoa(k).startsWith(q)) ? 0
            : [l.ten, ...(l.khac ?? [])].some((k) => chuanHoa(k).includes(q)) ? 1 : chuanHoa(l.mo).includes(q) ? 2 : 9,
        }))
          .filter((x) => x.d < 9).sort((a, b) => a.d - b.d)
          .map(({ l }) => ({ nhan: l.ten + (l.thamSo ? ` ${l.thamSo}` : ''), mo: l.mo, chen: `${l.ten} `, chayLuon: !l.thamSo || !l.thamSo.startsWith('<') })),
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

  useInput((input, key) => {
    // 0) Báo focus của terminal (ESC[I / ESC[O) — không phải phím người dùng.
    if (input === '[I') { dangNhin.current = true; return; }
    if (input === '[O') { dangNhin.current = false; return; }
    const o = oRef.current;
    const hop = hopRef.current;
    const goiY = goiYRef.current;
    const chonDuyet = chonDuyetRef.current;

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
      const chonSo = !hop.coLoc && /^[1-9]$/.test(input) ? Number(input) - 1 : -1;
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

    // 3) Thẻ duyệt.
    const d = S.choDuyet[0];
    if (d) {
      const lc = luaChonDuyet(d);
      const traLoi = (q: string) => { void kn.goi('agent:traLoiXinPhep', { id: d.id, quyetDinh: q }).catch((e: Error) => kho.thongBao(e.message, 'loi')); };
      if (key.upArrow) { setChonDuyet((c) => (c - 1 + lc.length) % lc.length); return; }
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
    if (key.ctrl && input === 'o') { moBanGhi('tool'); return; }
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
      if (key.upArrow) { setGoiY({ ...goiY, chon: (goiY.chon - 1 + goiY.ds.length) % goiY.ds.length }); return; }
      if (key.downArrow) { setGoiY({ ...goiY, chon: (goiY.chon + 1) % goiY.ds.length }); return; }
      if (key.tab) { nhanGoiY(goiY, false); return; }
      if (key.return && !key.meta && !key.shift) { nhanGoiY(goiY, true); return; }
    }

    // 6) Ô nhập. ctrl+j (LF) xuống dòng — Alt+Enter của Windows Terminal là phím toàn màn hình.
    if (input === '\n' && !key.return) { doiO(ST.chen(o, '\n')); return; }
    if (key.return) {
      if (key.meta || key.shift) { doiO(ST.chen(o, '\n')); return; }
      const r = ST.enter(o);
      if (!r.guiDi) { doiO(r.o); return; }
      guiCauHoi(o.text);
      return;
    }
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

  const o = oRef.current;
  const hop = hopRef.current;
  const goiY = goiYRef.current;
  const chonDuyet = chonDuyetRef.current;
  const hangCho = hangChoRef.current;
  const shell = shellRef.current;
  const rongMuc = Math.max(30, cot - 1);

  const staticBang = (
    <Static key={S.khoaBang} items={S.bang}>
      {(m: MucBang) => (
        <Box key={m.id} flexDirection="column">
          <Text>{m.loai === 'chao' ? veManMoDau(thongTin, veLogo(Math.min(rongMuc, 96) - 6), rongMuc).join('\n') : veMuc(m, rongMuc).join('\n')}</Text>
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
    return (
      <>
        {staticBang}
        <XemBanGhi
          dong={dong} dau={dau} cao={caoBanGhi} rong={cot - 1} khoiChon={null}
          tieuDe={`◆ ${laShell ? L('Lệnh nền', 'Background shell') : L('Agent phụ', 'Subagent')} ${i >= 0 ? `${i + 1}/${ds.length}` : ''}`}
          goiY={`${L('↑↓ cuộn · ←/→ agent khác · g/G đầu/cuối', '↑↓ scroll · ←/→ other agents · g/G top/bottom')}${laShell ? L(' · x dừng lệnh nền', ' · x stop shells') : ''} · ${L('Esc quay lại', 'Esc back')}`}
        />
      </>
    );
  }

  // Màn xem lại chiếm gần trọn chiều cao — vẽ riêng, không kèm bảng kế hoạch/ô nhập.
  if (hop?.loai === 'banGhi') {
    const { dong, khoi } = dungBanGhi(S.bang, rongBanGhi, hop.moRong);
    const toiDa = Math.max(0, dong.length - caoBanGhi);
    const dau = hop.ganCuoi ? toiDa : Math.min(hop.dau, toiDa);
    const k = hop.cheDo === 'tool' ? khoi[hop.chonKhoi] ?? null : null;
    return (
      <>
        {staticBang}
        <XemBanGhi
          dong={dong} dau={dau} cao={caoBanGhi} rong={cot - 1} khoiChon={k}
          tieuDe={hop.cheDo === 'tool' ? L(`◆ Đầu ra lệnh/tool (${khoi.length}) — ${k ? k.nhan : ''}`, `◆ Command/tool outputs (${khoi.length}) — ${k ? k.nhan : ''}`) : L('◆ Bảng ghi', '◆ Transcript')}
          goiY={hop.cheDo === 'tool'
            ? L('↑↓ chọn khối · Enter mở/thu · p in trọn ra màn hình · Tab cuộn tự do · Esc đóng', '↑↓ pick block · Enter expand/collapse · p print in full · Tab free scroll · Esc close')
            : L('↑↓/j k cuộn · Space/b trang · g/G đầu/cuối · Tab chọn đầu ra (mở/thu) · Esc đóng', '↑↓/j k scroll · Space/b page · g/G top/bottom · Tab pick outputs (expand/collapse) · Esc close')}
        />
      </>
    );
  }

  // Rộng: bảng nằm cột phải bất cứ khi nào có gì để xem. Hẹp: bảng chiếm chỗ của ô nhập ⇒ chỉ hiện lúc đang làm.
  const rongDu = cot >= COT_HIEN_BANG;
  const dangHoi = Boolean(hop) || S.choDuyet.length > 0;
  // Hẹp + đang có thẻ duyệt/menu ⇒ cất bảng: thẻ cần chỗ hơn, và vùng động cao quá màn hình thì Ink vẽ đè lên phần đã in.
  const coBang = hienKeHoach && coGiDeHien(S) && (rongDu || (S.dangChay && !dangHoi));
  const benCanh = coBang && rongDu;
  const rongTrai = benCanh ? cot - RONG_BANG - 2 : cot - 1;
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
  const caoBang = coBang && !benCanh
    ? 5 + Math.min(S.keHoach.length || 1, 14) + (S.dangChay ? 5 : 0) + (Object.keys(S.fileDaSua).length ? 2 + Math.min(Object.keys(S.fileDaSua).length, 8) : 0)
    : 0;
  const caoTool = S.toolChay.length * 7 + (shell ? 8 : 0) + (hangCho.length ? Math.min(hangCho.length, 3) + 3 : 0);
  const caoNhap = hop || d ? 0 : 5 + (goiY ? Math.min(goiY.ds.length, 8) + 1 : 0) + o.text.split('\n').length - 1;
  const caoCoDinh = 2 + 1 + caoBang + caoTool + caoNhap + 2 + (bangPhuHien ? Math.min(dsBangPhu.length, 10) + 1 : 0);
  const toiDaSong = Math.max(3, hang - caoCoDinh - (d ? 14 : 0) - (hop ? 14 : 0));
  const toiDaDiff = Math.max(4, hang - caoCoDinh - 14);

  const vungTrai = (
    <Box flexDirection="column" width={rongTrai}>
      <VungSong S={S} rong={rongTrai} toiDaDong={toiDaSong} nhip={nhip} />
      {shell ? <ShellDangChay lenh={shell.lenh} ra={shell.ra} batDau={shell.batDau} rong={rongTrai} nhip={nhip} /> : null}
      {coBang && !benCanh ? <Box marginTop={1}><BangKeHoach S={S} rong={rongTrai} nhip={nhip} toiDaViec={Math.min(14, Math.floor(hang / 4))} /></Box> : null}
      <DongTrangThai S={S} nhip={nhip} />
      <HangCho ds={hangCho} rong={rongTrai} />
      {hop?.loai === 'menu' ? (
        <MenuView tieuDe={hop.tieuDe} moTa={hop.moTa} ds={hop.ds} chon={hop.chon} loc={hop.loc} coLoc={hop.coLoc} rong={Math.min(rongTrai, 100)} mauVien={hop.mauVien} />
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
      ) : d ? (
        <TheDuyet d={d} chon={chonDuyet} rong={rongTrai} toiDaDong={toiDaDiff} conLai={S.choDuyet.length} />
      ) : (
        <Box marginTop={1} flexDirection="column">
          <ONhapView o={o} rong={rongTrai} cheDo={S.ws?.cheDoQuyen ?? 'keHoach'} dangChay={S.dangChay} goiYMo={Boolean(goiY)} soHangCho={hangCho.length} />
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
        <ChanTrang S={S} rong={rongTrai} model={(modelNay?.ten ?? '—').replace(/^Cuong(Mini)? /, '')} muc={mucNay?.ten ?? L('Vừa', 'Medium')} nhac={nhac} />
      )}
    </Box>
  );

  return (
    <>
      {staticBang}
      {benCanh ? (
        <Box flexDirection="row" alignItems="flex-start">
          {vungTrai}
          <Box marginLeft={1} marginTop={1}><BangKeHoach S={S} rong={RONG_BANG} nhip={nhip} toiDaViec={hang - 22} /></Box>
        </Box>
      ) : vungTrai}
    </>
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
