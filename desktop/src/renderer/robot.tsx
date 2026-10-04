/**
 * ============================================================
 * CỬA SỔ ROBOT NỔI — CuongMini
 * ============================================================
 *
 * Cây React RIÊNG, không phải một góc của app chính. Nó phải nhẹ: cửa sổ này
 * sống suốt phiên làm việc và nằm trên mọi thứ.
 *
 * ─── BỐN CỬ CHỈ ───
 *  • 1 lần bấm  → mở/đóng khung chat "Trợ lý"
 *  • 2 lần bấm  → nhảy vào trang AI Chat trong app chính
 *  • 3 lần bấm  → bảng CHỈNH: kéo robot đi đâu cũng được + cỡ 20–100%
 *  • 4 lần bấm  → ẩn robot (bật lại bằng phím tắt toàn cục)
 *
 * ─── VỊ TRÍ (bản 03/10/2026) ───
 * Main giữ điểm NEO của con robot; cửa sổ phình quanh neo cho bong bóng / bảng
 * chỉnh / khung chat, và cửa sổ này đặt robot đúng vào neo (`useBoCuc`). Robot
 * KHÔNG BAO GIỜ dời chỗ vì một bong bóng. Xem `main/robotViTri.ts`.
 */
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
/* ⚠️ Cửa sổ robot là một ENTRY RIÊNG — không qua `AppStateProvider`, nên tự
   gọi `datNgonNgu`, tự nghe đổi ngôn ngữ / chủ đề. */
import { datNgonNgu, dich } from './i18n';
import type { OdinMood } from './features/odin/useOdin';
import { batDauThu, ngungPhat, phatBase64, type BoThu } from './features/odin/nghePhat';
import { KhungChat } from './robot/KhungChat';
import { BangChinh, CO_BANG, type NenTangRobot } from './robot/BangChinh';
import { useBoCuc, type NoiDungMuon } from './robot/useBoCuc';
import { ThanRobot, NutNoi } from './robot/ThanRobot';
import { useHoiThoat, TheHoiThoat, CO_HOI_THOAT } from './robot/HoiThoat';
import { useCuChi, usePhimChinh, NGUONG_KEO_PX, NGU_SAU_MS } from './robot/useRobotChung';
import { phanTramTuThietDat } from '../shared/coRobot';
import './features/odin/odin.css';
import './robot/robotChung.css';
import './robot.css';

/** Ô đo và bong bóng thật phải dùng CHUNG chuỗi này — lệch là đo sai. */
const CHU_CHO = 'Chờ tớ suy nghĩ xíu nhé…';

/**
 * Bong bóng thông báo sống bao lâu. Người dùng 16/09/2026: "chỉ hiện 3s thôi".
 * Đồng hồ DỪNG khi con trỏ đang ở trên bong bóng (`ghim`).
 */
const GIAY_HIEN_TIN_MS = 3000;
/** Bong bóng "trả lời xong" sống lâu hơn — nó là thứ người dùng ĐANG chờ. */
const GIAY_HIEN_TRA_LOI_MS = 9000;

/** Khung chat ở 100%: khớp `KHUNG_CHAT` bên main. */
const CO_CHAT = { rong: 400, cao: 520 };

interface ThongBao {
  loai: 'tin-nhan' | 'thong-bao' | 'nhac' | 'agent' | 'tra-loi' | 'mang';
  chu: string;
}

type TrangThaiNoi = 'im' | 'nghe' | 'nghi' | 'doc';

/** Cắt gọn để làm câu xem trước trong bong bóng. */
function tomTat(chu: string, toiDa: number): string {
  const sach = chu.replace(/```[\s\S]*?```/g, ' [code] ').replace(/[#*_`>$]/g, '').replace(/\s+/g, ' ').trim();
  return sach.length > toiDa ? `${sach.slice(0, toiDa - 1)}…` : sach;
}

/** Chủ đề sáng/tối: theo thiết đặt của app, 'system' thì theo hệ điều hành. */
function apChuDe(theme: unknown): void {
  const toi = theme === 'dark'
    || (theme !== 'light' && typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = toi ? 'dark' : 'light';
}

function Robot() {
  const [rong, datRong] = useState(false);
  /** Khung chat đã mở ít nhất một lần ⇒ giữ nó sống (xem `KhungChat`). */
  const [daMoChat, datDaMoChat] = useState(false);
  const [nhay, datNhay] = useState(false);
  const [tin, datTin] = useState<ThongBao | null>(null);
  /** AI Code đang làm gì — trạng thái SỐNG, không tự mờ như `tin`. */
  const [viec, datViec] = useState<string | null>(null);
  const [hover, datHover] = useState(false);
  const [ghim, datGhim] = useState(false);
  const [tt, datTt] = useState<TrangThaiNoi>('im');
  const thuRef = useRef<BoThu | null>(null);
  const conSongRef = useRef(true);
  const [chatCho, datChatCho] = useState(false);
  const [phanTram, datPhanTram] = useState(100);
  const [tuDinhMep, datTuDinhMep] = useState(false);
  const [nenTang, datNenTang] = useState<NenTangRobot | null>(null);
  const [online, datOnline] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine !== false));
  const [ngu, datNgu] = useState(false);
  /** Biểu cảm thoáng qua (vui khi trả lời xong, bối rối khi lỗi…). */
  const [camXuc, datCamXuc] = useState<{ mood: OdinMood; den: number } | null>(null);
  const hoatDongRef = useRef(Date.now());

  const thoang = useCallback((mood: OdinMood, ms: number) => {
    datCamXuc({ mood, den: Date.now() + ms });
  }, []);
  useEffect(() => {
    if (!camXuc) return;
    const h = setTimeout(() => datCamXuc(null), Math.max(0, camXuc.den - Date.now()));
    return () => clearTimeout(h);
  }, [camXuc]);

  /** Có ai đụng tới ⇒ thức dậy (và vui một chút nếu vừa ngủ). */
  const thuc = useCallback(() => {
    hoatDongRef.current = Date.now();
    datNgu((dangNgu) => {
      if (dangNgu) thoang('vui', 1400);
      return false;
    });
  }, [thoang]);

  // Nháy mắt — cùng nhịp với con robot trong app để vẫn là MỘT nhân vật.
  useEffect(() => {
    const id = setInterval(() => {
      datNhay(true);
      setTimeout(() => datNhay(false), 160);
    }, 4200 + Math.random() * 2600);
    return () => clearInterval(id);
  }, []);

  /* ── Thiết đặt: ngôn ngữ, chủ đề, cỡ, tự dính mép, nền tảng ── */
  useEffect(() => {
    void window.cuongthai?.settings.getAll().then((t) => {
      datNgonNgu(t.ngonNgu === 'en' ? 'en' : 'vi');
      apChuDe(t.theme);
      datPhanTram(phanTramTuThietDat(t));
      datTuDinhMep(t.robotBamMep === true);
    });
    void window.cuongthai?.robot.nenTang?.().then((n) => { if (n) datNenTang(n); }).catch(() => {});
    const mq = typeof matchMedia === 'function' ? matchMedia('(prefers-color-scheme: dark)') : null;
    const doiHeThong = (): void => {
      void window.cuongthai?.settings.getAll().then((t) => apChuDe(t.theme));
    };
    mq?.addEventListener?.('change', doiHeThong);
    return () => mq?.removeEventListener?.('change', doiHeThong);
  }, []);

  const [, datNn] = useState(0);
  useEffect(() => window.cuongthai?.on('app:doiNgonNgu', (p) => {
    datNgonNgu((p as { ngonNgu?: string }).ngonNgu === 'en' ? 'en' : 'vi');
    datNn((v) => v + 1);
  }), []);

  useEffect(() => window.cuongthai?.on('robot:thietDat', (p) => {
    const { key, value } = p as { key?: string; value?: unknown };
    if (key === 'theme') apChuDe(value);
    if (key === 'robotBamMep') datTuDinhMep(value === true);
  }), []);

  useEffect(() => window.cuongthai?.on('robot:coDoi', (p) => {
    const o = p as { phanTram?: number; nac?: number };
    if (typeof o.phanTram === 'number') datPhanTram(o.phanTram);
  }), []);

  /* ── Mạng ── — nối với chế độ ngoại tuyến của app (`app:networkChanged`). */
  useEffect(() => {
    const doi = (on: boolean): void => {
      datOnline((cu) => {
        if (cu !== on) {
          datTin({
            loai: 'mang',
            chu: on
              ? dich('Có mạng lại rồi! Tớ dùng AI máy chủ như thường nhé.')
              : dich('Mất mạng rồi… Tớ vẫn trả lời bằng AI trên máy nếu bạn đã tải về.'),
          });
          if (on) thoang('vui', 2000);
        }
        return on;
      });
    };
    const bo = window.cuongthai?.on('app:networkChanged', (p) => doi((p as { online?: boolean }).online !== false));
    const len = (): void => doi(true);
    const xuong = (): void => doi(false);
    window.addEventListener('online', len);
    window.addEventListener('offline', xuong);
    return () => { bo?.(); window.removeEventListener('online', len); window.removeEventListener('offline', xuong); };
  }, [thoang]);

  /* ── Ngủ gật khi lâu không ai đụng ── */
  useEffect(() => {
    const id = setInterval(() => {
      if (Date.now() - hoatDongRef.current > NGU_SAU_MS) datNgu(true);
    }, 20_000);
    const dong = (): void => thuc();
    window.addEventListener('pointerdown', dong);
    window.addEventListener('pointerenter', dong);
    window.addEventListener('keydown', dong);
    return () => {
      clearInterval(id);
      window.removeEventListener('pointerdown', dong);
      window.removeEventListener('pointerenter', dong);
      window.removeEventListener('keydown', dong);
    };
  }, [thuc]);

  const chuBong = tin ? tin.chu : tt === 'nghi' ? dich(CHU_CHO) : viec;

  useEffect(() => window.cuongthai?.on('robot:tin', (p) => {
    const t = p as ThongBao;
    datTin(t.chu ? t : null);
    if (t.chu) { thuc(); }
  }), [thuc]);

  /* Bong bóng tự biến mất; rê chuột lên ⇒ giữ lại. Một HIỆU ỨNG theo `tin`
     (huỷ được), không phải `setTimeout` cắm trong chỗ nhận tin. */
  useEffect(() => {
    if (!tin || ghim) return;
    const h = setTimeout(() => datTin(null), tin.loai === 'tra-loi' ? GIAY_HIEN_TRA_LOI_MS : GIAY_HIEN_TIN_MS);
    return () => clearTimeout(h);
  }, [tin, ghim]);

  useEffect(() => window.cuongthai?.on('robot:viec', (p) => {
    const c = (p as { chu?: string | null }).chu;
    datViec(typeof c === 'string' && c ? c : null);
  }), []);

  /* ── Chế độ CHỈNH (ấn 3 lần / menu chuột phải) ── */
  const [keoDuoc, datKeoDuoc] = useState(false);
  useEffect(() => window.cuongthai?.on('robot:cheDoChinh', () => {
    datRong(false);
    datKeoDuoc(true);
  }), []);

  const doiRong = useCallback((v: boolean) => {
    if (v) { datDaMoChat(true); datKeoDuoc(false); }
    datRong(v);
  }, []);

  const doiCo = useCallback((pt: number) => {
    datPhanTram(pt);
    void window.cuongthai?.robot.datPhanTram?.(pt).then((that) => {
      if (typeof that === 'number') datPhanTram(that);
    });
  }, []);

  const doiTuDinhMep = useCallback((v: boolean) => {
    datTuDinhMep(v);
    void window.cuongthai?.settings.set('robotBamMep', v);
  }, []);

  /* ── Đo bong bóng (bản sao vô hình, cùng mọi thuộc tính ảnh hưởng bố cục) ── */
  const doRef = useRef<HTMLButtonElement | null>(null);
  const [doBong, datDoBong] = useState<{ w: number; h: number } | null>(null);
  useLayoutEffect(() => {
    if (!chuBong) { datDoBong(null); return; }
    const o = doRef.current?.getBoundingClientRect();
    datDoBong(o && o.width > 0 ? { w: Math.ceil(o.width), h: Math.ceil(o.height) } : { w: 300, h: 60 });
  }, [chuBong, tin?.loai]);

  /* ── KÉO ── */
  const keoRef = useRef<{
    kieu: 'hop' | 'caKhung'; x: number; y: number; cx: number; cy: number; daDi: boolean; daBao: boolean;
  } | null>(null);
  const rafRef = useRef(0);
  const [dangKeoHop, datDangKeoHop] = useState(false);
  const [lamLai, datLamLai] = useState(0);
  /** Vừa kéo xong ⇒ nuốt cú `click` đi kèm cú thả tay. */
  const vuaKeoRef = useRef(false);

  useEffect(() => window.cuongthai?.on('robot:boCucLai', (p) => {
    const pt = (p as { phanTram?: number }).phanTram;
    if (typeof pt === 'number') datPhanTram(pt);
    datLamLai((v) => v + 1);
  }), []);

  const waylandThuan = !!nenTang?.waylandThuan;

  const batDauKeo = useCallback((e: React.PointerEvent<HTMLElement>, kieu: 'hop' | 'caKhung') => {
    if (e.button !== 0 || waylandThuan) return;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* jsdom */ }
    keoRef.current = { kieu, x: e.screenX, y: e.screenY, cx: e.screenX, cy: e.screenY, daDi: false, daBao: false };
  }, [waylandThuan]);

  useEffect(() => {
    const gui = (): void => {
      rafRef.current = 0;
      const k = keoRef.current;
      if (!k || !k.daBao) return;
      void window.cuongthai?.robot.keoToi(k.cx - k.x, k.cy - k.y);
    };
    const di = (e: PointerEvent): void => {
      const k = keoRef.current;
      if (!k) return;
      k.cx = e.screenX;
      k.cy = e.screenY;
      if (!k.daDi && (Math.abs(k.cx - k.x) > NGUONG_KEO_PX || Math.abs(k.cy - k.y) > NGUONG_KEO_PX)) {
        k.daDi = true;
        k.daBao = true;
        if (k.kieu === 'hop') datDangKeoHop(true);
        void window.cuongthai?.robot.keoBatDau(k.kieu);
      }
      /* GỘP theo khung hình: một lời gọi IPC mỗi `requestAnimationFrame`, không
         phải mỗi `pointermove` (120/giây trên chuột 120Hz — xếp hàng ⇒ giật). */
      if (k.daBao && !rafRef.current) rafRef.current = requestAnimationFrame(gui);
    };
    const tha = (): void => {
      const k = keoRef.current;
      keoRef.current = null;
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = 0; }
      if (!k || !k.daDi) return;
      vuaKeoRef.current = true;
      setTimeout(() => { vuaKeoRef.current = false; }, 50);
      void window.cuongthai?.robot.keoToi(k.cx - k.x, k.cy - k.y)
        .finally(() => window.cuongthai?.robot.keoXong())
        .finally(() => {
          datDangKeoHop(false);
          datLamLai((v) => v + 1);
          thoang('vui', 900);
        });
    };
    window.addEventListener('pointermove', di);
    window.addEventListener('pointerup', tha);
    window.addEventListener('pointercancel', tha);
    window.addEventListener('blur', tha);
    return () => {
      window.removeEventListener('pointermove', di);
      window.removeEventListener('pointerup', tha);
      window.removeEventListener('pointercancel', tha);
      window.removeEventListener('blur', tha);
    };
  }, [thoang]);

  /* ── Bố cục cửa sổ quanh neo ── */
  const ghiChuBang = !!(nenTang?.waylandThuan || nenTang?.xWayland);
  /* "Bạn không cần tôi nữa ư?" — câu hỏi lúc thoát app (`main/hoiThoat.ts`).
     Hỏi thì thu khung chat và thoát chế độ chỉnh: câu hỏi là thứ DUY NHẤT
     đáng nhìn lúc đó. */
  const hoiThoat = useHoiThoat();
  useEffect(() => {
    if (hoiThoat.id === null) return;
    datRong(false);
    datKeoDuoc(false);
  }, [hoiThoat.id]);
  const ndMuon: NoiDungMuon | null = useMemo(() => {
    if (hoiThoat.id !== null) return { loai: 'bang', rong: CO_HOI_THOAT.rong, cao: CO_HOI_THOAT.cao };
    if (rong) return { loai: 'chat', rong: CO_CHAT.rong, cao: CO_CHAT.cao };
    if (keoDuoc) return { loai: 'bang', rong: CO_BANG.rong, cao: CO_BANG.cao + (ghiChuBang ? CO_BANG.caoThemGhiChu : 0) };
    if (chuBong && doBong) return { loai: 'bong', rong: Math.min(doBong.w, 300) + 16, cao: Math.min(doBong.h, 240) + 10 };
    return null;
  }, [rong, keoDuoc, chuBong, doBong, ghiChuBang, hoiThoat.id]);
  const bc = useBoCuc(ndMuon, lamLai, dangKeoHop);

  /* ── Nói (giữ để nói) ── */
  const batDauNoi = useCallback(async () => {
    if (tt !== 'im') return;
    ngungPhat();
    datTt('nghe');
    const bo = await batDauThu(async (tiengBase64) => {
      datTt('nghi');
      try {
        const kq = await window.cuongthai?.robot.noi(tiengBase64);
        if (!kq) { datTt('im'); return; }
        if (!kq.cau.length) { datTin({ loai: 'agent', chu: kq.traLoi }); return; }

        /*
         * ĐỌC THEO DÂY CHUYỀN, HIỆN THEO NHỊP.
         *
         * Bong bóng hiện ĐÚNG câu đang đọc, không đổ cả bài ra một lượt —
         * cửa sổ robot nhỏ, cả bài dài thì bị chính biên cửa sổ cắt mất
         * (người dùng gửi ảnh chữ cụt hai lần).
         *
         * ⚠️ ĐẶT HÀNG CÂU N+1 TRƯỚC KHI PHÁT CÂU N. Đọc xong mới đặt hàng
         * câu sau thì giữa hai câu là trọn một vòng gọi máy đọc (~2,6s) —
         * đúng cái "lag 2-3-4 giây" người dùng phàn nàn. Câu tiếng Việt
         * ~50 ký tự phát mất 4-5 giây, còn sinh mất ~2,6s, nên dây chuyền
         * luôn chạy trước được một câu.
         */
        datTt('doc');
        const docCau = (c: string): Promise<string | null> =>
          window.cuongthai?.robot.docCau(c)
            .then((r) => r?.tiengBase64 ?? null)
            .catch(() => null) ?? Promise.resolve(null);

        let keTiep = docCau(kq.cau[0]!);
        for (let i = 0; i < kq.cau.length; i += 1) {
          if (!conSongRef.current) return;
          const tiengNay = keTiep;
          // Đặt hàng câu sau NGAY, trước khi ngồi chờ câu này phát xong.
          keTiep = i + 1 < kq.cau.length ? docCau(kq.cau[i + 1]!) : Promise.resolve(null);
          void keTiep.catch(() => {});

          datTin({ loai: 'agent', chu: kq.cau[i]! });
          const t = await tiengNay;
          if (!conSongRef.current) return;
          if (t) await phatBase64(t);
          else await new Promise((x) => setTimeout(x, 1200));  // tắt tiếng: vẫn cho kịp đọc chữ
        }
      } catch (e) {
        datTin({ loai: 'thong-bao', chu: `Trục trặc: ${(e as Error).message}` });
        thoang('boiRoi', 4000);
      } finally {
        datTt('im');
      }
    });
    if (!bo) {
      datTt('im');
      datTin({ loai: 'thong-bao', chu: 'Mình không mở được micro. Kiểm tra quyền micro giúp mình nhé.' });
      return;
    }
    thuRef.current = bo;
  }, [tt]);

  const thaTayNoi = useCallback(() => {
    thuRef.current?.dung();
    thuRef.current = null;
    // KHÔNG đặt lại 'im' ở đây: `onstop` chạy sau và sẽ chuyển sang 'nghi'.
    // Đặt 'im' ngay là nút nháy về trạng thái nghỉ rồi mới bận lại.
    datTt((c) => (c === 'nghe' ? 'nghi' : c));
  }, []);

  // Cửa sổ mất tiêu điểm giữa lúc đang thu ⇒ dừng. Người dùng đã đi chỗ khác.
  useEffect(() => {
    const roi = (): void => { if (thuRef.current) thaTayNoi(); };
    window.addEventListener('blur', roi);
    return () => {
      window.removeEventListener('blur', roi);
      conSongRef.current = false;
      thuRef.current?.dung();
      ngungPhat();
    };
  }, [thaTayNoi]);

  /* ── Bốn cử chỉ — CÙNG hook với con robot trong app (`useCuChi`) ── */
  /** Mở trang AI Chat. Dùng cho cử chỉ hai-cú-bấm lẫn cú bấm vào bong bóng. */
  const huyHenRef = useRef<() => void>(() => {});
  const bamDup = useCallback(() => {
    huyHenRef.current();
    datTin(null);
    void window.cuongthai?.robot.moChinh('/chat');
  }, []);

  /**
   * ⚠️ `e.detail` MỘT MÌNH KHÔNG ĐỦ: lúc đang ở chế độ kéo, cửa sổ trượt dưới
   * con trỏ và Chromium tụt `detail` về 1 — ba cú để TẮT không bao giờ tới
   * (Windows, 16/09/2026). `useCuChi` đếm thêm bằng tay theo toạ độ MÀN HÌNH
   * rồi lấy số lớn hơn. MỌI cử chỉ hoãn `TRE_NHAP_DUP_MS` trừ cú thứ tư.
   */
  const { bam, huyHen } = useCuChi({
    mot: () => { thoang('vui', 700); doiRong(!rong); datTin(null); },
    hai: () => bamDup(),
    ba: () => { datKeoDuoc((v) => !v); datRong(false); },
    bon: () => {
      datTin(null);
      /* `.catch`: main ĐÓNG chính cửa sổ này nên kênh IPC đứt trước khi lời
         hứa kịp giải. */
      window.cuongthai?.robot.batTat(false).catch(() => {});
    },
  }, { vuaKeoRef, khiBam: thuc });
  huyHenRef.current = huyHen;

  /* ↑/↓ đổi cỡ 5%, Esc xong — chỉ trong chế độ chỉnh. */
  const gocRef = useRef<HTMLDivElement>(null);
  const hienSo = usePhimChinh({
    bat: keoDuoc, phanTram, doiCo, thoat: () => datKeoDuoc(false), gocRef,
  });

  /* Có lỗi/xong từ khung chat ⇒ biểu cảm + báo nếu khung đang thu gọn. */
  const khiXong = useCallback(({ ok, chu }: { ok: boolean; chu: string }) => {
    thoang(ok ? 'vui' : 'boiRoi', ok ? 2400 : 4000);
    if (!rongRef.current) {
      datTin({
        loai: 'tra-loi',
        chu: ok ? `${dich('Xong rồi nè!')} ${tomTat(chu, 90)}` : dich('Ơ, tớ hỏi chưa được. Bấm để xem lỗi nhé.'),
      });
    }
  }, [thoang]);
  const rongRef = useRef(rong);
  rongRef.current = rong;

  /**
   * Tâm trạng — tính MỘT chỗ, dùng cho cả vỏ (`data-mood`, CSS hoạt ảnh) lẫn
   * `OdinRobot` (đôi mắt). Thứ tự là thứ tự ưu tiên.
   */
  const moodHienTai: OdinMood =
    hoiThoat.id !== null ? 'lo'
    : dangKeoHop ? 'vui'
      : !online ? 'matMang'
        : tt === 'nghe' ? 'nghe'
          : tt === 'doc' ? 'noi'
            : tt === 'nghi' || chatCho ? 'nghi'
              : camXuc ? camXuc.mood
                : tin ? (tin.loai === 'tra-loi' ? 'vui' : 'vay')
                  : viec ? 'nghi'
                    : ngu ? 'ngu'
                      : 'thuong';

  /* Vị trí robot TRONG cửa sổ (xem `useBoCuc`): neo vào một góc, cách góc đó
     đúng bao nhiêu main đã tính. Trước khi có số (lượt đầu), góc dưới-phải. */
  const kieuHop: React.CSSProperties = dangKeoHop || !bc
    ? { right: 0, bottom: 0 }
    : {
      [bc.hop.gocX === 'phai' ? 'right' : 'left']: bc.hop.dx,
      [bc.hop.gocY === 'duoi' ? 'bottom' : 'top']: bc.hop.dy,
    };
  const hopCao = bc?.coHop.height ?? Math.round(160 * phanTram / 100);
  const phiaNd = bc?.noiDung ?? 'tren';
  const kieuNd: React.CSSProperties = phiaNd === 'tren'
    ? { top: 0, bottom: (bc && bc.hop.gocY === 'duoi' ? bc.hop.dy : 0) + hopCao + 8 }
    : { top: (bc && bc.hop.gocY === 'tren' ? bc.hop.dy : 0) + hopCao + 8, bottom: 0 };
  const ngangNd = bc?.hop.gocX ?? 'phai';
  /* Đuôi bong bóng chỉ đúng vào ĐẦU robot ở mọi cỡ: tâm hộp, trừ lề 8px của
     vùng nội dung và nửa bề rộng đuôi. */
  const hopRong = bc?.coHop.width ?? Math.round(150 * phanTram / 100);
  (kieuNd as Record<string, unknown>)['--rb-duoi'] = `${Math.max(10, (bc?.hop.dx ?? 0) + hopRong / 2 - 13)}px`;
  const hienNd = !dangKeoHop && !!ndMuon;

  return (
    <div
      ref={gocRef}
      className="rb odin-canh"
      data-rong={rong}
      data-keo={keoDuoc}
      data-dang-keo={dangKeoHop}
      data-wl={waylandThuan}
      data-mood={moodHienTai}
      data-hover={hover}
    >
      {/* Bản sao vô hình chỉ để ĐO — phải mang đúng `data-loai`/`data-co-x`. */}
      {chuBong && !rong && (
        <button
          type="button"
          ref={doRef}
          className="rb-bong rb-do"
          data-loai={tin ? tin.loai : 'cho'}
          data-co-x={tin ? 'true' : undefined}
          tabIndex={-1}
          aria-hidden
        >
          {chuBong}
        </button>
      )}

      {hienNd && !rong && (
        <div className="rb-nd" data-phia={phiaNd} data-ngang={ngangNd} style={kieuNd}>
          {hoiThoat.id !== null ? (
            <TheHoiThoat onTra={hoiThoat.tra} />
          ) : keoDuoc ? (
            <BangChinh
              phanTram={phanTram}
              onDoiCo={doiCo}
              tuDinhMep={tuDinhMep}
              onDoiTuDinhMep={doiTuDinhMep}
              onVeMacDinh={() => void window.cuongthai?.robot.veMacDinh?.()}
              onXong={() => datKeoDuoc(false)}
              nenTang={nenTang}
            />
          ) : tin ? (
            <div
              className="rb-bong-boc"
              onMouseEnter={() => datGhim(true)}
              onMouseLeave={() => datGhim(false)}
            >
              <button
                type="button"
                className="rb-bong"
                data-loai={tin.loai}
                data-co-x="true"
                title={tin.loai === 'tra-loi' ? dich('Bấm để mở khung Trợ lý') : dich('Bấm để đọc đầy đủ trong AI Chat')}
                onClick={(e) => {
                  e.stopPropagation();
                  if (tin.loai === 'tra-loi') { datTin(null); doiRong(true); } else bamDup();
                }}
                onDoubleClick={(e) => e.stopPropagation()}
              >
                {tin.chu}
              </button>
              {/* Nút ẨN — ANH EM của bong bóng (button lồng button là HTML hỏng). */}
              <button
                type="button"
                className="rb-bong-x"
                aria-label={dich('Ẩn thông báo')}
                title={dich('Ẩn thông báo')}
                onClick={(e) => { e.stopPropagation(); datTin(null); }}
                onDoubleClick={(e) => e.stopPropagation()}
              >
                ×
              </button>
            </div>
          ) : tt === 'nghi' ? (
            <div className="rb-bong-boc"><div className="rb-bong" data-loai="cho">{dich(CHU_CHO)}</div></div>
          ) : viec ? (
            <div className="rb-bong-boc">
              <div className="rb-bong" data-loai="viec">
                <i className="rb-viec-cham" aria-hidden />
                {viec}
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Khung chat SỐNG suốt từ lần mở đầu — thu gọn chỉ ẩn nó đi. */}
      {daMoChat && (
        <div className="rb-nd rb-nd-chat" data-phia={phiaNd} data-ngang={ngangNd} style={kieuNd} hidden={!rong}>
          <KhungChat
            an={!rong}
            onDong={() => doiRong(false)}
            onKeoKhung={(e) => batDauKeo(e, 'caKhung')}
            onDangCho={datChatCho}
            onXong={khiXong}
          />
        </div>
      )}

      <ThanRobot
        phanTram={phanTram}
        coHop={bc?.coHop}
        style={kieuHop}
        mood={moodHienTai}
        nhay={nhay}
        hover={hover}
        datHover={datHover}
        keoDuoc={keoDuoc}
        hienSo={hienSo}
        dangDoc={tt === 'doc' && !rong}
        cham={tin && !rong ? tin.loai : null}
        onPointerDown={(e) => { if (keoDuoc) batDauKeo(e, 'hop'); }}
        onBam={bam}
        onContextMenu={(e) => { e.preventDefault(); void window.cuongthai?.robot.menu(false); }}
        nutNoi={(
          <NutNoi
            tt={tt}
            onBatDau={() => void batDauNoi()}
            onTha={thaTayNoi}
            onDung={() => { ngungPhat(); datTt('im'); }}
          />
        )}
      />
    </div>
  );
}

createRoot(document.getElementById('robot')!).render(<Robot />);
