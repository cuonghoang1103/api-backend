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
import { LUA_CHON, TEN_MUC, docCaiDat, ghiCaiDat, moTaGiaTri, type CaiDat } from '../caiDat';
import { CHE_DO, cheDoKe, moTaCheDo } from '../cheDo';
import { lenhCaiChoMay } from '../capNhat';
import { fileQuyUoc, luuGhiNho, tachGhiNho } from '../ghiNho';
import type { KetNoiLoi } from '../ketNoi';
import type { KhoChat, MucBang } from '../kho';
import { quetDuAn, type KyHieu } from '../kyHieu';
import { canAscii, datAscii } from '../kyTu';
import { LENH_GOI_Y, MODEL_DU_PHONG, MUC_DU_PHONG, chayLenh, doiTenModel, moPhien, tachLenhCli, type BoiCanhLenh, type ModelMuc, type MucNoLuc } from '../lenh';
import { veLogo } from '../logo';
import { datTheme, doTheme, mo } from '../mau';
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
  | { loai: 'banGhi'; cheDo: 'cuon' | 'tool'; dau: number; chonKhoi: number; moRong: Set<number>; ganCuoi: boolean };

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

  const dsModel = useCallback((): ModelMuc[] => (S.info?.models?.length ? S.info.models : MODEL_DU_PHONG).map((m) => ({ ...m, ten: doiTenModel(m.ten) })), [S]);
  const dsMuc = useCallback((): MucNoLuc[] => (S.info?.mucNoLuc?.length
    ? S.info.mucNoLuc.map((m) => ({ id: m.id, ten: m.ten, mo: `${m.buoc} bước${m.viecPhu ? ` · ${m.viecPhu} agent phụ` : ''}` }))
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
        loai: 'menu', tieuDe: '⚠ Bật chế độ "Bỏ qua hết"?', mauVien: '#f87171',
        moTa: 'CuongMini sẽ sửa file và chạy MỌI lệnh — kể cả lệnh nguy hiểm — mà không hỏi. Shell đọc được .env, khoá SSH, token… Chỉ bật trong thư mục bạn tin tưởng.',
        ds: [{ nhan: 'Không, về "Lập kế hoạch"', giaTri: 'khong' }, { nhan: 'Có, bật "Bỏ qua hết"', giaTri: 'co' }],
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

  const doiTheme = (t: 'tuDong' | 'toi' | 'sang') => {
    caiDat.current = { ...caiDat.current, theme: t };
    ghiCaiDat(caiDat.current);
    datTheme(t === 'tuDong' ? doTheme(process.env) : t);
    veLaiHet();
    kho.thongBao(`Giao diện: ${moTaGiaTri('theme', caiDat.current)}`, 'ok');
  };

  // ─── Gửi ───────────────────────────────────────────────────────

  const guiThat = useCallback((text: string, op: { chiDoc?: boolean; hienThi?: string }) => {
    // Ảnh dán: `[Ảnh #n]` ⇒ file tạm; còn lại (đường kéo vào, @a.png) do `tachAnh` lo.
    const anhThem: string[] = [];
    let t0 = text.replace(/\[Ảnh #(\d+)\]/g, (m, so: string) => {
      const p = anhDan.current.get(Number(so));
      if (!p) return m;
      anhThem.push(p);
      return `[ảnh dán #${so}]`;
    });
    // Kết quả lệnh `!` người dùng tự chạy ⇒ đi kèm câu hỏi này (lõi không có kênh thêm ngữ cảnh riêng).
    const nguCanhShell = dungNguCanhShell(shellChoGui.current);
    shellChoGui.current = [];
    const { text: t2, anh, daNhac } = tachAnh(t0, thuMuc);
    t0 = t2;
    const tatCaAnh = [...anhThem, ...anh].slice(0, 8);
    const cauGui = (nguCanhShell + phuLucNhac(t0, daNhac)).slice(0, 8000);
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
    void kn.loi.dongTrinhDuyet?.().catch(() => undefined);
    onThoat(loiNhan);
    exit();
  };

  // ─── Menu ──────────────────────────────────────────────────────

  const menu = (h: Omit<Extract<Hop, { loai: 'menu' }>, 'loai' | 'loc' | 'coLoc' | 'chon'> & { chon?: number; coLoc?: boolean }) => {
    setHop({ loai: 'menu', loc: '', coLoc: h.coLoc ?? false, chon: h.chon ?? 0, ...h });
  };

  const moBanGhi = (cheDo: 'cuon' | 'tool') => {
    const { khoi } = dungBanGhi(S.bang, Math.max(30, cot - 3), new Set());
    if (cheDo === 'tool' && !khoi.length) { baoNhanh('Chưa có đầu ra lệnh/tool nào để mở.'); return; }
    setHop({ loai: 'banGhi', cheDo, dau: 0, chonKhoi: Math.max(0, khoi.length - 1), moRong: new Set(), ganCuoi: true });
  };

  const moMenu = (loai: 'model' | 'muc' | 'resume' | 'cheDo' | 'config' | 'rewind' | 'banGhi') => {
    if (loai === 'banGhi') { moBanGhi('cuon'); return; }
    if (loai === 'model') {
      const ds: MucMenu[] = [
        ...dsModel().map((m) => ({ nhom: 'Model', nhan: m.ten, mo: m.dungDuoc ? m.mo : 'chưa mở trên máy chủ', tat: !m.dungDuoc, dangChon: m.id === modelNay?.id, giaTri: `m:${m.id}` })),
        ...dsMuc().map((m) => ({ nhom: 'Mức nỗ lực', nhan: m.ten, mo: m.mo, dangChon: m.id === mucNay?.id, giaTri: `n:${m.id}` })),
      ];
      menu({
        tieuDe: 'Chọn model và mức nỗ lực', ds, chon: Math.max(0, ds.findIndex((m) => m.dangChon)),
        khiChon: (m) => {
          const [k, id] = [m.giaTri.slice(0, 1), m.giaTri.slice(2)];
          if (k === 'n') { void doiMuc(id).then(() => kho.thongBao(`Mức nỗ lực: ${m.nhan}`, 'ok')).catch((e: Error) => kho.thongBao(e.message, 'loi')); return; }
          const mm = dsModel().find((x) => x.id === id);
          const lam = () => void doiModel(id).then(() => kho.thongBao(`Model: ${m.nhan}`, 'ok')).catch((e: Error) => kho.thongBao(e.message, 'loi'));
          if (mm?.dat) {
            menu({
              tieuDe: `${mm.ten} tốn nhiều hơn hẳn các model khác. Vẫn chọn?`, mauVien: '#fbbf24',
              ds: [{ nhan: 'Không', giaTri: 'khong' }, { nhan: 'Có, dùng model này', giaTri: 'co' }],
              khiChon: (x) => { if (x.giaTri === 'co') lam(); },
            });
            return;
          }
          lam();
        },
      });
      return;
    }
    if (loai === 'muc') {
      const ds = dsMuc().map((m) => ({ nhan: m.ten, mo: m.mo, dangChon: m.id === mucNay?.id, giaTri: m.id }));
      menu({ tieuDe: 'Mức nỗ lực', ds, chon: Math.max(0, ds.findIndex((m) => m.dangChon)), khiChon: (m) => void doiMuc(m.giaTri).then(() => kho.thongBao(`Mức nỗ lực: ${m.nhan}`, 'ok')) });
      return;
    }
    if (loai === 'cheDo') {
      const ds = CHE_DO.map((c) => ({ nhan: `${c.icon} ${c.ten}`, mo: c.mo, dangChon: c.id === (S.ws?.cheDoQuyen ?? 'keHoach'), giaTri: c.id }));
      menu({ tieuDe: 'Chế độ quyền', ds, chon: Math.max(0, ds.findIndex((m) => m.dangChon)), khiChon: (m) => void doiCheDo(m.giaTri) });
      return;
    }
    if (loai === 'rewind') {
      const ds = dsCauHoi(S.muc as MucGhi[]);
      if (!ds.length) { kho.thongBao('Việc này chưa có câu hỏi nào để quay về.'); return; }
      const mucs = [...ds].reverse().map((c) => ({ nhan: c.text.replace(/\s+/g, ' ').slice(0, 80), mo: `câu ${c.k}`, giaTri: String(c.k) }));
      menu({
        tieuDe: '↺ Quay về câu hỏi nào?', moTa: 'Hội thoại cắt từ câu đó; file agent sửa từ đó trở đi được lùi về như trước. Câu hỏi nằm lại trong ô nhập để sửa.',
        ds: mucs, khiChon: (m) => { void chayLenh(`/rewind ${m.giaTri}`, boiCanh()); },
      });
      return;
    }
    if (loai === 'config') {
      const c = caiDat.current;
      const khoa = Object.keys(TEN_MUC) as Array<keyof CaiDat>;
      menu({
        tieuDe: '⚙ Cài đặt', moTa: `Lưu ở ${thuMucGoc()}/cai-dat.json`,
        ds: khoa.map((k) => ({ nhan: TEN_MUC[k], mo: moTaGiaTri(k, c), giaTri: k })),
        khiChon: (m) => moMenuCaiDat(m.giaTri as keyof CaiDat),
      });
      return;
    }
    void kn.goi<PhienCu[]>('agent:dsPhien').then((tat) => {
      const ds0 = locPhien(tat, '');
      const tao = (q: string): MucMenu[] => (q ? tat.filter((p) => !p.luuTru && chuanHoa(`${p.tieuDe} ${p.duAn ?? ''}`).includes(chuanHoa(q))) : ds0)
        .slice(0, 40)
        .map((p) => ({ nhan: `${p.ghim ? '📌 ' : ''}${p.tieuDe || 'Việc chưa đặt tên'}`, mo: `${p.duAn ? `${p.duAn} · ` : ''}${tuongDoi(p.luucLuc)} · ${p.soTinNhan} tin`, giaTri: p.id }));
      if (!tat.length) { kho.thongBao('Chưa có việc nào được lưu.'); return; }
      menu({
        tieuDe: 'Mở lại việc cũ', ds: tao(''), coLoc: true, boLoc: tao,
        khiChon: (m) => { void moPhien(m.giaTri, m.nhan.replace(/^📌 /, ''), { kho, kn, xoaManHinh }).catch((e: Error) => kho.thongBao(e.message, 'loi')); },
      });
    }).catch((e: Error) => kho.thongBao(e.message, 'loi'));
  };

  const moMenuCaiDat = (k: keyof CaiDat) => {
    const c = caiDat.current;
    const luu = (moi: CaiDat, chu: string) => { caiDat.current = moi; ghiCaiDat(moi); kho.thongBao(chu, 'ok'); };
    if (k === 'modelMacDinh') {
      const ds = [{ nhan: 'Giữ model đang chọn của tài khoản', giaTri: '', dangChon: !c.modelMacDinh }, ...dsModel().filter((m) => m.dungDuoc).map((m) => ({ nhan: m.ten, mo: m.mo, giaTri: m.id, dangChon: c.modelMacDinh === m.id }))];
      menu({
        tieuDe: TEN_MUC[k], ds, chon: Math.max(0, ds.findIndex((m) => m.dangChon)),
        khiChon: (m) => {
          luu({ ...c, modelMacDinh: m.giaTri || null }, `Model mặc định: ${m.nhan}`);
          if (m.giaTri) void doiModel(m.giaTri).catch(() => undefined);
        },
      });
      return;
    }
    const ds = (LUA_CHON[k] as ReadonlyArray<readonly [string, string]>).map(([id, ten]) => ({ nhan: ten, giaTri: id, dangChon: c[k] === id }));
    menu({
      tieuDe: TEN_MUC[k], ds, chon: Math.max(0, ds.findIndex((m) => m.dangChon)),
      khiChon: (m) => {
        if (k === 'theme') { doiTheme(m.giaTri as CaiDat['theme']); return; }
        const moi = { ...c, [k]: m.giaTri } as CaiDat;
        if (k === 'ascii') {
          caiDat.current = moi;
          ghiCaiDat(moi);
          datAscii(m.giaTri === 'bat' ? true : m.giaTri === 'tat' ? false : canAscii(process.env));
          veLaiHet();
          return;
        }
        luu(moi, `${TEN_MUC[k]}: ${m.nhan}${k === 'cheDoMacDinh' ? ' (áp dụng từ lần mở sau)' : ''}`);
      },
    });
  };

  const dangXuat = async () => {
    xoaPhien();
    kn.dong();
    thoat('Đã đăng xuất. Đăng nhập lại: cuongmini login');
  };

  const boiCanh = (): BoiCanhLenh => ({
    kho, kn, thuMuc, phienBan, guiThat, doiModel, doiMuc, doiCheDo, dsModel, dsMuc, moMenu, doiTheme,
    datNhap: (t: string) => setO({ text: t, contro: t.length }),
    xoaManHinh, dangXuat, dangNhapLai: () => setHop({ loai: 'dangNhap' }), thoat: () => thoat(),
  });

  // ─── `!` shell và `#` ghi nhớ ──────────────────────────────────

  const chayLenhShell = (lenh: string) => {
    if (!lenh.trim()) { baoNhanh('Gõ lệnh sau dấu ! — vd: !git status'); return; }
    if (shellRef.current) { kho.thongBao('Lệnh trước còn đang chạy — esc để dừng.', 'canh'); return; }
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
    if (!gn) { baoNhanh('Gõ nội dung sau dấu # — vd: # luôn dùng pnpm, không dùng npm'); return; }
    const f = fileQuyUoc(thuMuc);
    const ten = f.duong.slice(thuMuc.length + 1);
    menu({
      tieuDe: '# Ghi nhớ quy ước dự án', mauVien: '#22d3ee',
      moTa: `"${gn}" — CuongMini đọc file này ở MỌI lượt.`,
      ds: [
        { nhan: f.taoMoi ? `Tạo ${ten} và ghi vào` : `Ghi vào ${ten}`, mo: 'mục "Ghi nhớ nhanh"', giaTri: 'ghi' },
        { nhan: 'Huỷ', giaTri: 'huy' },
      ],
      khiChon: (m) => {
        if (m.giaTri !== 'ghi') return;
        try {
          const r = luuGhiNho(thuMuc, gn);
          kho.thongBao(`Đã ghi nhớ vào ${r.duong.slice(thuMuc.length + 1)}${r.taoMoi ? ' (file mới)' : ''}: ${gn}`, 'ok');
        } catch (e) { kho.thongBao(`Không ghi được: ${(e as Error).message}`, 'loi'); }
      },
    });
  };

  const danAnh = () => {
    baoNhanh('Đang đọc ảnh trong clipboard…', 4000);
    void danAnhTuClipboard().then((r) => {
      if ('loi' in r) { baoNhanh(r.loi, 6000); return; }
      soAnhDan.current += 1;
      anhDan.current.set(soAnhDan.current, r.duong);
      const o = oRef.current;
      const truoc = o.text.slice(0, o.contro);
      doiO(ST.chen(o, `${truoc && !/\s$/.test(truoc) ? ' ' : ''}[Ảnh #${soAnhDan.current}] `));
      baoNhanh(`Đã dán ảnh #${soAnhDan.current} — gửi kèm câu hỏi.`);
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
      kho.thongBao('Lượt vừa rồi lỗi — tin trong hàng chờ đã về lại ô nhập, Enter để gửi.', 'canh');
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
        loai: 'matKhau', tieuDe: 'Cổng chính đang bảo trì', giaTri: '',
        moTa: 'Dùng cổng dự phòng trong lúc chờ? Nhập mật khẩu quản trị cấp (Enter mở khoá · Esc bỏ qua).',
        khiXong: (mk) => {
          kho.thongBao('Đang mở khoá cổng dự phòng…');
          kn.moDuPhong(mk).then((ten) => {
            kho.thongBao(`Đã mở ${ten}. Đang gửi lại câu hỏi…`, 'ok');
            if (S.cauHoiCuoi) guiThat(S.cauHoiCuoi, {});
          }, (e: Error) => kho.thongBao(`Không mở được cổng dự phòng: ${e.message}`, 'loi'));
        },
      });
    } else if (l.ma !== 'PRO_REQUIRED') {
      void kn.lamMoiPhien().then((ok) => {
        if (ok) kho.thongBao('Đã làm mới phiên đăng nhập — gửi lại câu hỏi nhé.', 'ok');
        else setHop({ loai: 'dangNhap', nhacNho: 'Phiên đăng nhập đã hết hạn — đăng nhập lại nhé.' });
      });
    }
  }, [S.loiCanXuLy, S, kho, kn, guiThat, setHop]);

  // Lượt /plan xong ⇒ hỏi duyệt kế hoạch.
  useEffect(() => {
    if (!S.hoiDuyetKeHoach) return;
    S.hoiDuyetKeHoach = false;
    menu({
      tieuDe: '📋 Duyệt kế hoạch?', moTa: 'Lượt vừa rồi chỉ đọc. Đồng ý thì CuongMini làm theo đúng kế hoạch trên.',
      ds: [{ nhan: 'Làm theo kế hoạch', giaTri: 'ok' }, { nhan: 'Chưa — để tôi xem lại / sửa yêu cầu', giaTri: 'ko' }],
      khiChon: (m) => { if (m.giaTri === 'ok') void chayLenh('__duyetKeHoach', boiCanh()); },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [S.hoiDuyetKeHoach]);

  // Thẻ duyệt mới ⇒ con trỏ về lựa chọn đầu + báo nếu người dùng đang ở cửa sổ khác.
  const idDuyet = S.choDuyet[0]?.id;
  useEffect(() => {
    setChonDuyet(0);
    if (idDuyet) baoChuY('CuongMini cần bạn duyệt', `${S.ws?.name ?? 'Dự án'}: có yêu cầu đang chờ`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idDuyet]);

  // Lượt dài xong ⇒ chuông + (nếu đang ở cửa sổ khác) thông báo hệ điều hành.
  const lucXong = S.luotCuoi?.luc;
  useEffect(() => {
    const l = S.luotCuoi;
    if (!l || l.thoiLuong < LUOT_DAI_MS) return;
    baoChuY(l.loi ? 'CuongMini gặp lỗi' : 'CuongMini đã xong', `${S.ws?.name ?? 'Dự án'} · ${Math.round(l.thoiLuong / 1000)}s${S.tieuDe ? ` · ${S.tieuDe}` : ''}`);
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
        ...S.lenhDuAn.filter((l) => !q || chuanHoa(l.ten).includes(q)).map((l) => ({ nhan: l.ten, mo: `${l.mo} (dự án)`, chen: `${l.ten} `, chayLuon: false })),
      ];
      setGoiY((g) => ({ kieu: '/', ds, chon: g?.kieu === '/' ? Math.min(g.chon, Math.max(0, ds.length - 1)) : 0, dau: 0 }));
      return;
    }
    const t = tokenNhac(truoc);
    if (!t) { setGoiY(null); return; }
    if (!chiMuc.current) {
      napChiMuc();
      setGoiY({ kieu: '@', ds: [{ nhan: 'Đang đọc danh sách file…', chen: '' }], chon: 0, dau: t.dau });
      return;
    }
    const file = timMo(t.q, chiMuc.current, 30).map((f) => ({ nhan: f, chen: `@${f}${f.endsWith('/') ? '' : ' '}`, thuMuc: f.endsWith('/'), mo: f.endsWith('/') ? 'thư mục' : undefined }));
    // Hàm / lớp: chỉ khi đã gõ ≥ 2 ký tự (gõ 1 ký tự thì gần như mọi ký hiệu đều khớp).
    const kh: MucGoiY[] = t.q.length >= 2 && kyHieu.current
      ? kyHieu.current.map((k) => ({ k, d: diemMo(t.q, k.ten) })).filter((x) => x.d >= 0).sort((a, b) => b.d - a.d).slice(0, 8)
        .map(({ k }) => ({ nhan: `ƒ ${k.ten}`, mo: `${k.kieu} · ${k.file}:${k.dong}`, chen: `@${k.file}:${k.dong} ` }))
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
  const caoBanGhi = Math.max(5, hang - 3);

  useInput((input, key) => {
    // 0) Báo focus của terminal (ESC[I / ESC[O) — không phải phím người dùng.
    if (input === '[I') { dangNhin.current = true; return; }
    if (input === '[O') { dangNhin.current = false; return; }
    const o = oRef.current;
    const hop = hopRef.current;
    const goiY = goiYRef.current;
    const chonDuyet = chonDuyetRef.current;

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
      baoNhanh('Nhấn ctrl+c lần nữa để thoát', 2000);
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
      if (shellRef.current) { shellRef.current.huy(); baoNhanh('Đang dừng lệnh…'); return; }
      if (hangChoRef.current.length) {
        // Huỷ hàng chờ: chữ quay về ô nhập (không mất), lượt đang chạy vẫn chạy tiếp.
        const h = hangChoRef.current;
        setHangCho([]);
        const t = [...h, o.text].filter(Boolean).join('\n');
        setO({ text: t, contro: t.length });
        baoNhanh('Đã huỷ hàng chờ — chữ đã về ô nhập. Esc lần nữa để dừng việc đang chạy.');
        return;
      }
      if (S.dangChay) { void kn.goi('agent:cancel'); baoNhanh('Đang dừng…'); return; }
      const lan2 = Date.now() - lanEsc.current < 600;
      lanEsc.current = Date.now();
      if (o.text) {
        if (lan2) { doiO(ST.rong()); return; }
        baoNhanh('Esc lần nữa để xoá ô nhập', 800);
        return;
      }
      if (lan2) { moMenu('rewind'); return; }
      if (S.muc.some((m) => m.kieu === 'nguoi')) baoNhanh('Esc lần nữa để quay lui về một câu cũ', 800);
      return;
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
    muc: mucNay?.ten ?? 'Vừa',
    cheDo: { ten: cd.ten, icon: cd.icon, mau: cd.mau },
    banMoi,
    lenhCai: lenhCaiChoMay(),
    ngoaiTuyen,
  // Màn mở đầu chỉ in MỘT lần — chụp thông tin lúc đó.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [S.ws?.branch, modelNay?.ten, mucNay?.ten, cd.id]);

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
          tieuDe={hop.cheDo === 'tool' ? `◆ Đầu ra lệnh/tool (${khoi.length}) — ${k ? k.nhan : ''}` : '◆ Bảng ghi'}
          goiY={hop.cheDo === 'tool'
            ? '↑↓ chọn khối · Enter mở/thu · p in trọn ra màn hình · Tab cuộn tự do · Esc đóng'
            : '↑↓/j k cuộn · Space/b trang · g/G đầu/cuối · Tab chọn đầu ra (mở/thu) · Esc đóng'}
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
  const caoCoDinh = 2 + 1 + caoBang + caoTool + caoNhap + 2;
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
          <Box marginTop={1}><ONhapNho nhan="Mật khẩu" giaTri={hop.giaTri} an dangNhap /></Box>
        </Box>
      ) : hop?.loai === 'dangNhap' ? (
        <ManDangNhap
          rong={rongTrai}
          nhacNho={hop.nhacNho}
          onXong={(n: NguoiDung) => { kn.datNguoi(n); setHop(null); kho.thongBao(`Đã đăng nhập: ${n.fullName || n.username}`, 'ok'); }}
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
      <ChanTrang S={S} rong={rongTrai} model={(modelNay?.ten ?? '—').replace(/^Cuong(Mini)? /, '')} muc={mucNay?.ten ?? 'Vừa'} nhac={nhac} />
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
  if (d < 60_000) return 'vừa xong';
  if (d < 3_600_000) return `${Math.floor(d / 60_000)} phút trước`;
  if (d < 86_400_000) return `${Math.floor(d / 3_600_000)} giờ trước`;
  if (d < 7 * 86_400_000) return `${Math.floor(d / 86_400_000)} ngày trước`;
  return new Date(t).toLocaleDateString('vi-VN');
}
