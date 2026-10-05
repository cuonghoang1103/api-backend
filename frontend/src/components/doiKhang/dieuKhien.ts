'use client';

/**
 * Hai "bộ điều khiển" phòng chơi cùng một hình dạng — để KhungPhong không cần biết đang chơi với
 * máy hay với người:
 *
 *  - `useVanMay`   — chơi với máy, chạy HOÀN TOÀN ở máy người chơi (trạng thái giữ ở client, đi bằng
 *                    LUAT, bot chạy trong Web Worker). Không gọi máy chủ.
 *  - `useVanOnline`— phòng realtime qua socket `dk:*`; máy chủ là trọng tài, mọi thay đổi tới qua `dk:phong`.
 *
 * Quy ước React: không side effect trong updater; sự kiện socket đọc state qua ref; dọn
 * listener/timer/worker khi unmount.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LUAT, type CapDoBot, type KetQua, type MaTro } from '@/lib/doiKhang/luat';
import * as dk from '@/lib/doiKhang/client';
import type { GheDTO, PhongDTO } from '@/lib/doiKhang/client';
import { useAuthStore } from '@/store/authStore';
import { useBot } from './useBot';

export interface TinChat {
  id: number;
  ghe: number | null;
  ten: string;
  text: string;
  cuaToi: boolean;
}
export interface CamXucBay {
  id: number;
  ghe: number | null;
  emoji: string;
}
export interface DieuKhienPhong {
  kieu: 'may' | 'online';
  /** `dongHoLuc` đã quy về giờ máy này (bù lệch máy chủ). */
  phong: PhongDTO | null;
  lichSu: string[];
  chat: TinChat[];
  camXuc: CamXucBay[];
  ketNoi: boolean;
  /** Máy đang nghĩ (chế độ máy). */
  dangNghi: boolean;
  loi: string | null;
  thongBao: string | null;
  /** Phòng bị đóng / không vào được. */
  hong: string | null;
  nhanCheDo: string;
  diNuoc: (m: unknown) => void;
  dauHang: () => void;
  xinHoa: () => void;
  traLoiHoa: (dongY: boolean) => void;
  taiDau: () => void;
  guiChat: (t: string) => void;
  guiCamXuc: (e: string) => void;
  sanSang?: (san: boolean) => void;
  moiBan?: (userId: number) => Promise<dk.Ack>;
  themBot?: (cap: CapDoBot) => void;
  boBot?: (ghe: number) => void;
  xoaLoi: () => void;
}

const TEN_CAP: Record<CapDoBot, string> = { 1: 'Dễ', 2: 'Vừa', 3: 'Khó' };
const PHUT_MAY: Record<MaTro, number> = { 'co-vua': 10, 'co-tuong': 15, 'tien-len': 0, caro: 5 };
let demId = 0;
const idMoi = () => ++demId;

// ─────────────────────────────────────────────────────────────────────────────
// CHƠI VỚI MÁY
// ─────────────────────────────────────────────────────────────────────────────
interface VanMay {
  s: unknown;
  gheNguoi: number;
  /** ghế → chỉ số người tham gia (0 = người, 1.. = máy). */
  ghe: number[];
  soNuoc: number;
  lichSu: string[];
  ketQua: KetQua | null;
  dongHo: number[];
  dongHoLuc: number;
  /** số ván thắng theo NGƯỜI THAM GIA (không theo ghế — đổi bên vẫn đúng). */
  tiSo: number[];
}

function vanMoi(tro: MaTro, soNguoi: number, gheNguoi: number, tiSo: number[], nguoiDiTruoc: number | null): VanMay {
  const luat = LUAT[tro];
  const s = luat.khoiTao(soNguoi, (Math.random() * 2 ** 31) | 0) as Record<string, unknown>;
  if (tro === 'tien-len' && nguoiDiTruoc != null) s.nguoiDiTruoc = nguoiDiTruoc;
  const ghe = soNguoi === 2 ? (gheNguoi === 0 ? [0, 1] : [1, 0]) : Array.from({ length: soNguoi }, (_, i) => i);
  const phut = PHUT_MAY[tro];
  return {
    s, gheNguoi, ghe, soNuoc: 0, lichSu: [], ketQua: null,
    dongHo: phut ? [phut * 60_000, phut * 60_000] : [],
    dongHoLuc: Date.now(),
    tiSo,
  };
}

export function useVanMay(tro: MaTro, cap: CapDoBot, ben: 0 | 1 | null, soBot: number): DieuKhienPhong {
  const user = useAuthStore((s) => s.user);
  const { hoi, huyHet } = useBot();
  const soNguoi = tro === 'tien-len' ? Math.min(4, Math.max(2, soBot + 1)) : 2;
  const [van, setVan] = useState<VanMay>(() =>
    vanMoi(tro, soNguoi, tro === 'tien-len' ? 0 : ben ?? (Math.random() < 0.5 ? 0 : 1), new Array(soNguoi).fill(0), null),
  );
  const vanRef = useRef(van);
  vanRef.current = van;
  const [dangNghi, setDangNghi] = useState(false);
  const [chat, setChat] = useState<TinChat[]>([]);
  const [camXuc, setCamXuc] = useState<CamXucBay[]>([]);
  const [loi, setLoi] = useState<string | null>(null);
  const [thongBao, setThongBao] = useState<string | null>(null);
  const henRef = useRef(new Set<ReturnType<typeof setTimeout>>());
  const hen = useCallback((f: () => void, ms: number) => {
    const t = setTimeout(() => { henRef.current.delete(t); f(); }, ms);
    henRef.current.add(t);
  }, []);
  useEffect(() => {
    const ds = henRef.current;
    return () => { ds.forEach(clearTimeout); ds.clear(); };
  }, []);

  /** Áp một nước của ghế `ghe` (người hoặc máy). Tính hết bên ngoài updater. */
  const ap = useCallback(
    (ghe: number, m: unknown) => {
      const v = vanRef.current;
      if (v.ketQua) return;
      const luat = LUAT[tro];
      const sai = luat.kiemTra(v.s, ghe, m);
      if (sai) {
        if (ghe === v.gheNguoi) setLoi(sai);
        return;
      }
      const now = Date.now();
      const dongHo = [...v.dongHo];
      if (dongHo.length) dongHo[ghe] = Math.max(0, dongHo[ghe] - (now - v.dongHoLuc));
      const moTa = luat.moTa(v.s, m);
      const s2 = luat.apDung(v.s, ghe, m);
      const kq = luat.ketThuc(s2);
      const tiSo = [...v.tiSo];
      if (kq && !kq.hoa) for (const g of kq.thang) tiSo[v.ghe[g]]++;
      const moi: VanMay = { ...v, s: s2, soNuoc: v.soNuoc + 1, lichSu: [...v.lichSu, moTa], ketQua: kq, dongHo, dongHoLuc: now, tiSo };
      vanRef.current = moi;
      setVan(moi);
    },
    [tro],
  );

  const ketThucVoi = useCallback((kq: KetQua) => {
    const v = vanRef.current;
    if (v.ketQua) return;
    const tiSo = [...v.tiSo];
    if (!kq.hoa) for (const g of kq.thang) tiSo[v.ghe[g]]++;
    const now = Date.now();
    const dongHo = [...v.dongHo];
    const luot = LUAT[tro].luot(v.s);
    if (dongHo.length) dongHo[luot] = Math.max(0, dongHo[luot] - (now - v.dongHoLuc));
    const moi = { ...v, ketQua: kq, tiSo, dongHo, dongHoLuc: now };
    vanRef.current = moi;
    setVan(moi);
  }, [tro]);

  // Máy đi khi tới lượt máy.
  useEffect(() => {
    if (van.ketQua) return;
    const luot = LUAT[tro].luot(van.s);
    if (luot === van.gheNguoi) return;
    let huy = false;
    setDangNghi(true);
    void hoi(tro, van.s, cap).then((m) => {
      if (huy || m == null) return;
      setDangNghi(false);
      ap(luot, m);
    });
    return () => {
      huy = true;
      setDangNghi(false);
    };
  }, [van.s, van.ketQua, van.gheNguoi, tro, cap, hoi, ap]);

  // Hết giờ (chỉ trò 2 người có đồng hồ).
  useEffect(() => {
    if (van.ketQua || !van.dongHo.length) return;
    const t = setInterval(() => {
      const v = vanRef.current;
      if (v.ketQua) return;
      const luot = LUAT[tro].luot(v.s);
      if (v.dongHo[luot] - (Date.now() - v.dongHoLuc) <= 0) {
        ketThucVoi({ thang: [1 - luot], hoa: false, lyDo: 'het-gio' });
      }
    }, 250);
    return () => clearInterval(t);
  }, [van.ketQua, van.dongHo.length, tro, ketThucVoi]);

  const phong = useMemo<PhongDTO>(() => {
    const luat = LUAT[tro];
    const ghe: GheDTO[] = van.ghe.map((ng) =>
      ng === 0
        ? { userId: user?.id ?? -1, ten: user?.displayName || user?.username || 'Bạn', avatar: user?.avatarUrl ?? null, elo: null, online: true, sanSang: true }
        : { userId: null, ten: soNguoi > 2 ? `Máy ${ng} · ${TEN_CAP[cap]}` : `Máy · ${TEN_CAP[cap]}`, avatar: null, bot: cap, elo: null, online: true, sanSang: true },
    );
    return {
      maPhong: 'MAY',
      tro,
      trangThai: van.ketQua ? 'xong' : 'dang-danh',
      ghe,
      nguoiXem: 0,
      thoiGian: { phut: PHUT_MAY[tro], congGiay: 0 },
      dongHo: van.dongHo,
      dongHoLuc: van.dongHoLuc,
      tiSo: van.ghe.map((ng) => van.tiSo[ng]),
      van: {
        nhin: luat.nhinTu(van.s, van.gheNguoi),
        soNuoc: van.soNuoc,
        nuocCuoi: null,
        luot: van.ketQua ? -1 : luat.luot(van.s),
        lichSu: van.lichSu,
      },
      ketQua: van.ketQua,
      doiElo: null,
      xinHoa: null,
      gheCuaToi: van.gheNguoi,
    };
  }, [van, tro, user, cap, soNguoi]);

  const taiDau = useCallback(() => {
    huyHet();
    const v = vanRef.current;
    const gheNguoi = soNguoi === 2 ? 1 - v.gheNguoi : 0;
    const diTruoc = v.ketQua?.thuHang?.[0] ?? v.ketQua?.thang?.[0] ?? null;
    const moi = vanMoi(tro, soNguoi, gheNguoi, v.tiSo, tro === 'tien-len' ? diTruoc : null);
    vanRef.current = moi;
    setVan(moi);
    setDangNghi(false);
  }, [huyHet, soNguoi, tro]);

  const dauHang = useCallback(() => {
    const v = vanRef.current;
    if (v.ketQua) return;
    huyHet();
    if (soNguoi === 2) return ketThucVoi({ thang: [1 - v.gheNguoi], hoa: false, lyDo: 'dau-hang' });
    const nhin = LUAT['tien-len'].nhinTu(v.s, null) as { soLa: number[]; daVe: number[] };
    const con = v.ghe.map((_, i) => i).filter((i) => i !== v.gheNguoi && !nhin.daVe.includes(i)).sort((a, b) => nhin.soLa[a] - nhin.soLa[b]);
    const thuHang = [...nhin.daVe, ...con, v.gheNguoi];
    ketThucVoi({ thang: [thuHang[0]], hoa: false, lyDo: 'dau-hang', thuHang });
  }, [huyHet, soNguoi, ketThucVoi]);

  const xinHoa = useCallback(() => {
    const v = vanRef.current;
    if (v.ketQua || soNguoi !== 2) return;
    setThongBao('Đã gửi lời xin hoà…');
    hen(() => {
      const w = vanRef.current;
      if (w.ketQua) return;
      if (w.soNuoc >= 30 && Math.random() < 0.45) {
        huyHet();
        ketThucVoi({ thang: [], hoa: true, lyDo: 'thoa-thuan' });
        setThongBao(null);
      } else setThongBao('Máy từ chối hoà — đánh tiếp nhé!');
    }, 900);
  }, [soNguoi, hen, huyHet, ketThucVoi]);

  const guiChat = useCallback((text: string) => {
    const t = text.trim().slice(0, 200);
    if (!t) return;
    const v = vanRef.current;
    setChat((c) => [...c.slice(-60), { id: idMoi(), ghe: v.gheNguoi, ten: 'Bạn', text: t, cuaToi: true }]);
  }, []);

  const guiCamXuc = useCallback((emoji: string) => {
    const v = vanRef.current;
    const id = idMoi();
    setCamXuc((c) => [...c, { id, ghe: v.gheNguoi, emoji }]);
    hen(() => setCamXuc((c) => c.filter((x) => x.id !== id)), 2300);
    // Máy thỉnh thoảng thả lại một cảm xúc cho vui.
    if (Math.random() < 0.5) {
      const tl = ['😄', '🤖', '👍', '😎', '🤔'][Math.floor(Math.random() * 5)];
      const gheMay = v.ghe.findIndex((ng) => ng !== 0);
      const id2 = idMoi();
      hen(() => {
        setCamXuc((c) => [...c, { id: id2, ghe: gheMay, emoji: tl }]);
        hen(() => setCamXuc((c) => c.filter((x) => x.id !== id2)), 2300);
      }, 700 + Math.random() * 600);
    }
  }, [hen]);

  useEffect(() => {
    if (!loi) return;
    const t = setTimeout(() => setLoi(null), 2600);
    return () => clearTimeout(t);
  }, [loi]);
  useEffect(() => {
    if (!thongBao) return;
    const t = setTimeout(() => setThongBao(null), 2600);
    return () => clearTimeout(t);
  }, [thongBao]);

  return {
    kieu: 'may',
    phong,
    lichSu: van.lichSu,
    chat,
    camXuc,
    ketNoi: true,
    dangNghi,
    loi,
    thongBao,
    hong: null,
    nhanCheDo: tro === 'tien-len' ? `Với ${soNguoi - 1} máy · ${TEN_CAP[cap]}` : `Với máy · ${TEN_CAP[cap]}`,
    diNuoc: (m) => ap(vanRef.current.gheNguoi, m),
    dauHang,
    xinHoa,
    traLoiHoa: () => undefined,
    taiDau,
    guiChat,
    guiCamXuc,
    xoaLoi: () => setLoi(null),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ONLINE
// ─────────────────────────────────────────────────────────────────────────────
/** Quy `dongHoLuc` về giờ máy này: bù lệch bằng `gioMayChu` (Date.now máy chủ lúc gửi). */
function quyDongHo(p: PhongDTO): PhongDTO {
  const lech = typeof p.gioMayChu === 'number' ? Date.now() - p.gioMayChu : 0;
  return { ...p, dongHoLuc: p.dongHoLuc + lech };
}

/** Rời phòng hoãn một nhịp: StrictMode (dev) gỡ rồi gắn lại ngay — rời thật thì phòng 'chờ' của
 *  chủ phòng bị xoá trước khi kịp vào lại. Gắn lại cùng mã trong 400 ms ⇒ huỷ lệnh rời. */
const henRoi = new Map<string, ReturnType<typeof setTimeout>>();

export function useVanOnline(maPhong: string): DieuKhienPhong {
  const ma = maPhong.toUpperCase();
  const [phong, setPhong] = useState<PhongDTO | null>(null);
  const phongRef = useRef<PhongDTO | null>(null);
  phongRef.current = phong;
  const [chat, setChat] = useState<TinChat[]>([]);
  const [camXuc, setCamXuc] = useState<CamXucBay[]>([]);
  const [ketNoi, setKetNoi] = useState(true);
  const [loi, setLoi] = useState<string | null>(null);
  const [thongBao, setThongBao] = useState<string | null>(null);
  const [hong, setHong] = useState<string | null>(null);
  const henRef = useRef(new Set<ReturnType<typeof setTimeout>>());
  const userId = useAuthStore((s) => s.user?.id ?? null);
  const userIdRef = useRef(userId);
  userIdRef.current = userId;

  const nhan = useCallback((p: PhongDTO | undefined | null) => {
    if (!p || String(p.maPhong).toUpperCase() !== ma) return;
    setPhong(quyDongHo(p));
  }, [ma]);

  useEffect(() => {
    const henDs = henRef.current;
    const hen = (f: () => void, ms: number) => {
      const t = setTimeout(() => { henDs.delete(t); f(); }, ms);
      henDs.add(t);
    };
    let song = true;
    const cu = henRoi.get(ma);
    if (cu) { clearTimeout(cu); henRoi.delete(ma); }
    const vao = () =>
      dk.vaoPhong(ma).then((a) => {
        if (!song) return;
        if (a.ok && a.phong) nhan(a.phong);
        else if (!phongRef.current) setHong(a.loi || 'Không vào được phòng');
        else setLoi(a.loi || 'Không vào lại được phòng');
      });
    void vao();
    let tungMat = false;
    const huy = [
      dk.nghe('dk:phong', (p) => nhan(p)),
      dk.nghe('dk:chat', (d) => {
        if (d.maPhong && d.maPhong !== ma) return;
        const p = phongRef.current;
        const ghe = p ? p.ghe.findIndex((g) => g.userId === d.userId) : -1;
        setChat((c) => [...c.slice(-60), { id: idMoi(), ghe: ghe >= 0 ? ghe : null, ten: d.ten || 'Người xem', text: d.text, cuaToi: d.userId === userIdRef.current }]);
      }),
      dk.nghe('dk:cam-xuc', (d) => {
        if (d.maPhong && d.maPhong !== ma) return;
        const p = phongRef.current;
        const ghe = p ? p.ghe.findIndex((g) => g.userId === d.userId) : -1;
        const id = idMoi();
        setCamXuc((c) => [...c, { id, ghe: ghe >= 0 ? ghe : null, emoji: d.emoji }]);
        hen(() => setCamXuc((c) => c.filter((x) => x.id !== id)), 2300);
      }),
      dk.nghe('dk:dong', (d) => {
        if (d.maPhong === ma) setHong('Phòng đã đóng.');
      }),
      dk.nghe('dk:tu-choi', (d) => {
        if (d.maPhong === ma) setThongBao(`${d.ten} đã từ chối lời mời`);
      }),
      dk.ngheKetNoi((k) => {
        if (!song) return;
        setKetNoi(k);
        if (!k) tungMat = true;
        else if (tungMat) {
          tungMat = false;
          void vao();
        }
      }),
    ];
    return () => {
      song = false;
      huy.forEach((f) => f());
      henDs.forEach(clearTimeout);
      henDs.clear();
      henRoi.set(ma, setTimeout(() => { henRoi.delete(ma); void dk.roiPhong(ma); }, 400));
    };
  }, [ma, nhan]);

  useEffect(() => {
    if (!loi) return;
    const t = setTimeout(() => setLoi(null), 3000);
    return () => clearTimeout(t);
  }, [loi]);
  useEffect(() => {
    if (!thongBao) return;
    const t = setTimeout(() => setThongBao(null), 3500);
    return () => clearTimeout(t);
  }, [thongBao]);

  const ketQuaLoi = useCallback((a: dk.Ack) => {
    if (!a.ok) setLoi(a.loi || 'Có lỗi');
    if (a.phong) nhan(a.phong);
  }, [nhan]);

  return {
    kieu: 'online',
    phong,
    lichSu: phong?.van?.lichSu ?? [],
    chat,
    camXuc,
    ketNoi,
    dangNghi: false,
    loi,
    thongBao,
    hong,
    nhanCheDo: `Phòng ${ma}`,
    diNuoc: (m) => {
      const p = phongRef.current;
      if (!p?.van) return;
      void dk.diNuoc(ma, m, p.van.soNuoc).then(ketQuaLoi);
    },
    dauHang: () => void dk.dauHang(ma),
    xinHoa: () => {
      void dk.xinHoa(ma);
      setThongBao('Đã gửi lời xin hoà…');
    },
    traLoiHoa: (dongY) => void dk.traLoiHoa(ma, dongY),
    taiDau: () => void dk.taiDau(ma),
    guiChat: (t) => {
      const x = t.trim();
      if (x) void dk.chat(ma, x);
    },
    guiCamXuc: (e) => void dk.camXuc(ma, e),
    sanSang: (san) => void dk.sanSang(ma, san),
    moiBan: (uid) => dk.moi(ma, uid),
    themBot: (cap) => void dk.themBot(ma, cap).then(ketQuaLoi),
    boBot: (ghe) => void dk.boBot(ma, ghe),
    xoaLoi: () => setLoi(null),
  };
}
