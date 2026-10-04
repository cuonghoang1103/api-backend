/**
 * Odin TRONG APP — cùng MỘT con robot với cửa sổ nổi (`robot.tsx`).
 *
 * ─── MỘT CON ROBOT, HAI CHỖ ĐỨNG (04/10/2026) ───
 * Người dùng: *"robot icon trong app CuongThai và robot icon khi ẩn app ra
 * ngoài là MỘT con robot (đừng tách), phải chạy mượt như nhau"*. Trước bản
 * này đây là một bản dựng RIÊNG — luật bấm riêng, nút cỡ riêng, bong bóng
 * riêng — và nó lệch con nổi ở đúng những chỗ người dùng chạm vào:
 *
 *   • Ấn 3 lần KHÔNG vào được chế độ chỉnh: cú bấm đầu đã hẹn nhảy sang
 *     /chat sau 260ms, và khi chế độ chỉnh có bật thì `setPointerCapture`
 *     trên CẢ dock nuốt mọi `click` — nút −/+ và ba cú để thoát đều chết.
 *   • `transform: scale()` lên cả dock ⇒ khung chat/bong bóng co theo robot.
 *
 * Nay hai con dùng chung: `useCuChi` (1/2/3/4 cú bấm), `usePhimChinh`
 * (↑/↓ ±5%, Esc), `ThanRobot` (thân + zzz + biểu cảm, CHỈ thân co giãn),
 * `NutNoi`, `BangChinh` (bảng chỉnh), `KhungChat` (khung "Trợ lý") và
 * `robot/robotChung.css`. Chỗ khác nhau là chỗ ĐỨNG: con nổi là cửa sổ riêng
 * do main đặt; con này là một lớp `position: fixed` trong cửa sổ app, dời
 * bằng `odinPhai`/`odinDuoi`, mở khung NGAY TRONG app.
 *
 * Việc riêng của con trong app vẫn giữ: huy hiệu số chưa đọc, giữ phím ` để
 * nói, báo bản cập nhật, nhắc lịch, khung GIA SƯ khi đang học bài.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useAppState } from '../../app-state';
import { useUpdateStatus } from '../../components/UpdateBanner';
import { docThanhTieng, ngungNoi, phatTieng, datTocDoDoc } from './giongNoi';
import { hoiOdin, phienNoiHienTai } from './hoiOdin';
import { useSession } from '../../auth/session';
import { kepDock, ngoaiKhung, type KhungKep } from './viTriDock';
import { useOdin, type OdinMood } from './useOdin';
import { SU_KIEN_NHAC } from '../dashboard/nhacLichRobot';
/*
 * KHUNG GIA SƯ — DÙNG LẠI nguyên của web, không chép giao diện.
 *
 * `GiaSuTrongRobot` là đúng cái khung mà con robot trên web mở ra khi người
 * dùng đang học: có gợi ý mở màn, chọn slide, câu hỏi thường gặp, bản tiếng
 * Anh, dán ảnh. Chép lại vỏ này sang app là hẹn ngày hai bên trôi lệch, và
 * thứ rụng trước sẽ đúng là mấy chi tiết tinh vi đó.
 *
 * Nó chỉ dính Next đúng `next/link` — đã có shim từ lâu.
 */
import GiaSuTrongRobot from '@/components/chat/GiaSuTrongRobot';
import { useGiaSuBaiStore } from '@/store/giaSuBaiStore';
import { ThanRobot, NutNoi, coHopPx } from '../../robot/ThanRobot';
import { useCuChi, usePhimChinh, NGUONG_KEO_PX } from '../../robot/useRobotChung';
import { BangChinh } from '../../robot/BangChinh';
import { KhungChat } from '../../robot/KhungChat';
import { boCucNoiDungApp, CAO_CAN } from '../../robot/boCucTrongApp';
import { useHoiThoat, TheHoiThoat } from '../../robot/HoiThoat';
import './odin.css';
import '../../robot/robotChung.css';
import { useDich } from '../../i18n';
import { chuanPhanTram, phanTramTuThietDat } from '../../../shared/coRobot';

/** Chỗ mặc định: cách mép phải / mép trên thanh trạng thái. */
const PHAI_MAC_DINH = 22;
const DUOI_MAC_DINH = 16;

export function OdinDock() {
  const { dich, dichP } = useDich();
  const { navigate, settings, setSetting, online, route } = useAppState();
  const { api } = useSession();
  /** Ngôn ngữ Odin nói. Mặc định tiếng Việt — đây là app tiếng Việt. */
  const ngonNgu: 'vi' | 'en' = settings.odinNgonNgu === 'en' ? 'en' : 'vi';

  const enabled = settings.robotEnabled !== false;

  /**
   * Con trỏ đang ở trên robot. Giữ TÁCH RIÊNG khỏi `mood` là có chủ đích: rê
   * chuột là trạng thái tức thời do người dùng điều khiển, còn `mood` là trạng
   * thái nội tại có hẹn giờ. Nhét chung sẽ có lúc rê chuột vào giữa lúc đang
   * "nghĩ" và làm mất trạng thái nghĩ — robot trông như quên mất việc đang làm.
   */
  const [hovering, setHovering] = useState(false);

  /**
   * Bài đang mở ở CỬA SỔ NÀY.
   *
   * `CourseTutor` ghi vào `giaSuBaiStore` khi nó được gắn, và ở đây là CÙNG
   * một cửa sổ nên đọc thẳng kho là đủ — không cần đi vòng qua main như con
   * robot nổi. Cùng kho ⇒ khung gia sư trong robot và khung dưới bài là MỘT
   * mạch, không phải hai cuộc rời.
   */
  const baiDangHoc = useGiaSuBaiStore((st) => st.bai);
  const [moGiaSu, datMoGiaSu] = useState(false);
  /* Rời bài ⇒ đóng khung. Không dọn thì khung gia sư của một bài đã đóng vẫn
     lơ lửng trên trang khác. */
  useEffect(() => { if (!baiDangHoc) datMoGiaSu(false); }, [baiDangHoc]);

  const odin = useOdin({
    api,
    online,
    enabled,
    onTranscript: (text) => { void traLoiBangTieng(text); },
  });

  /**
   * Đồng hồ đếm ngược tới buổi học — do vòng ở `App.tsx` bắn xuống.
   *
   * Chỉ HIỆN BONG BÓNG, không đọc thành tiếng: nó nói 10 phút một lần cả ngày,
   * và một giọng nói xen vào mỗi 10 phút thì bị tắt ngay hôm đầu. Muốn nghe
   * thì hỏi robot.
   *
   * Robot tắt (`robotEnabled`) thì im — người đã tắt robot không muốn thấy
   * bong bóng của nó, dù bật nhắc lịch.
   */
  useEffect(() => {
    if (!enabled) return;
    const nghe = (e: Event) => {
      const chu = (e as CustomEvent<{ chu?: string }>).detail?.chu;
      if (typeof chu === 'string' && chu) odin.announceTam(chu);
    };
    window.addEventListener(SU_KIEN_NHAC, nghe);
    return () => window.removeEventListener(SU_KIEN_NHAC, nghe);
  }, [enabled, odin]);

  // Phím tắt nhấn-giữ. Dùng phím ` (backquote) vì nó gần như không bao giờ
  // xuất hiện giữa lúc gõ tiếng Việt, và nằm sát tay trái.
  useEffect(() => {
    if (!enabled) return;

    const onDown = (event: KeyboardEvent) => {
      if (event.code !== 'Backquote' || event.repeat) return;
      // Đang gõ trong ô nhập thì phím này là ký tự, không phải lệnh.
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA)$/.test(target.tagName)) return;
      if (target?.isContentEditable) return;
      event.preventDefault();
      void odin.startListening();
    };
    const onUp = (event: KeyboardEvent) => {
      if (event.code !== 'Backquote') return;
      odin.stopListening();
    };

    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, [enabled, odin]);

  /**
   * Odin lên tiếng khi bản mới đã tải xong.
   *
   * CHỈ ở trạng thái `ready` — lúc đó mới có việc cho người dùng làm (khởi động
   * lại). Nói ở `checking` hay `downloading` là làm phiền để báo một thứ họ
   * không tác động được, và một trợ lý hay làm phiền sẽ bị tắt.
   */

  /**
   * Nghe xong thì TRẢ LỜI, và nói lại thành tiếng.
   *
   * Trước đây chỗ này chỉ nhét câu vừa nói vào `sessionStorage` rồi nhảy sang
   * trang /chat — nên "nói với robot" thật ra chỉ là một cách gõ chữ bằng
   * giọng, robot chưa từng đáp lại. Nay: hỏi trợ lý → hiện bong bóng → đọc.
   *
   * Đọc là TUỲ CHỌN (`odinNoiThanhTieng`) và mặc định bật. Tắt đi thì vẫn có
   * câu trả lời bằng chữ — người đang ở chỗ đông người vẫn dùng được.
   */
  const traLoiBangTieng = useCallback(async (cauHoi: string) => {
    if (!api) return;
    // Cắt câu đang đọc dở: người dùng vừa hỏi câu mới thì câu cũ hết giá trị,
    // và hai giọng chồng nhau thì không nghe ra chữ nào.
    ngungNoi();
    odin.announce(ngonNgu === 'en' ? 'Give me a sec to think…' : 'Chờ tớ suy nghĩ xíu nhé…');
    const doc = settings.odinNoiThanhTieng !== false;
    const giong = ngonNgu === 'en' ? settings.odinGiongEn : settings.odinGiongVi;
    const tenGiong = typeof giong === 'string' && giong ? giong : undefined;

    /*
     * BA VIỆC, CHO HAI VIỆC ĐẦU CHỒNG LÊN NHAU.
     *
     * Trước: chờ trọn câu trả lời → gọi máy đọc → phát. Người dùng thấy chữ ở
     * cuối việc một và nghe tiếng ở cuối việc ba, nên tiếng luôn về sau chữ
     * đúng bằng thời gian máy đọc chạy.
     *
     * Nay: câu ĐẦU vừa đủ là gửi ngay cho máy đọc trong lúc phần còn lại vẫn
     * đang chảy về. Máy đọc chạy song song với model, nên tiếng câu đầu thường
     * sẵn sàng ngay khi chữ hiện ra.
     *
     * ⚠️ 19/08/2026 SỬA LẠI CÂN NHẮC NÀY. Ghi chú cũ ở đây nói "CHỈ tách MỘT
     * lần" vì sợ bốn lời gọi máy đọc và ba mối nối. Đúng một nửa — nhưng nửa
     * còn lại đắt hơn: phần đuôi chỉ được đặt hàng SAU khi model viết xong, và
     * đặt TRỌN MỘT CỤC, nên người dùng nghe câu 1 rồi LẶNG 5-6 giây.
     *
     * Nay `hoiOdin` gom theo kiểu mẩu-đầu-nhỏ-mẩu-sau-to (xem `GOM_SAU`): một
     * câu trả lời bốn câu ra ~2-3 mẩu chứ không phải bốn, mẩu sau được sinh
     * TRONG LÚC mẩu trước đang phát. Ít mối nối hơn lo ngại cũ, mà không còn
     * khoảng lặng.
     */
    const cacMau: string[] = [];
    const hangTieng: Promise<Blob>[] = [];

    try {
      const datHang = (c: string) => {
        cacMau.push(c);
        // KHÔNG await: để nó chạy trong lúc vòng đọc stream tiếp tục.
        const t = docThanhTieng(api, c, tenGiong);
        // Nuốt lỗi ở đây để một lời hứa hỏng không thành "unhandled rejection";
        // lỗi thật sẽ nổi lên lúc await bên dưới.
        void t.catch(() => {});
        hangTieng.push(t);
      };
      const tra = await hoiOdin(api, cauHoi, ngonNgu, undefined, (cau) => {
        if (doc) datHang(cau);
      });
      if (!tra) {
        odin.announce(ngonNgu === 'en' ? "Sorry, I didn't catch that." : 'Xin lỗi, tớ chưa nghĩ ra câu trả lời.');
        return;
      }
      odin.announce(tra);
      if (!doc) return;

      if (!hangTieng.length) {
        await phatTieng(await docThanhTieng(api, tra, tenGiong));
      } else {
        /*
         * ⚠️ ĐUÔI CHƯA ĐỦ MỘT CÂU THÌ CHƯA AI ĐẶT HÀNG — phải xả nốt, không
         * thì mất chữ cuối khi model kết thúc mà không có dấu chấm.
         *
         * Dò bằng CON TRỎ chạy theo thứ tự các mẩu, không `startsWith`:
         * khoảng trắng giữa các câu lúc gom có thể khác với bản gốc, và
         * `startsWith` sai một khoảng trắng là coi như không có mẩu nào.
         */
        let viTri = 0;
        for (const m of cacMau) {
          const k = tra.indexOf(m, viTri);
          if (k >= 0) viTri = k + m.length;
        }
        const conLai = tra.slice(viTri).trim();
        if (conLai) datHang(conLai);
        // Mọi mẩu đã được ĐẶT HÀNG từ lúc nó đủ, nên tới đây chỉ còn việc phát
        // lần lượt — máy đọc đã chạy song song với model từ trước.
        for (const t of hangTieng) await phatTieng(await t);
      }
    } catch (e) {
      // Hỏng thì nói ra lý do NGẮN, và vẫn để lại câu chữ. Im lặng ở đây là
      // kiểu hỏng tệ nhất: người dùng không biết mình có được nghe hay không.
      odin.announce(`Mình gặp trục trặc: ${e instanceof Error ? e.message : String(e)}`);
    }
  }, [api, odin, ngonNgu, settings]);

  // Áp tốc độ đã lưu NGAY khi app mở, và mỗi lần người dùng đổi. Chỉ đặt lúc
  // bấm nút thì khởi động lại app là về 1× — người dùng chỉnh xong, hôm sau mở
  // ra thấy như cũ và tưởng thiết đặt không lưu.
  useEffect(() => {
    datTocDoDoc(typeof settings.odinTocDo === 'number' ? settings.odinTocDo : 1);
  }, [settings.odinTocDo]);

  const update = useUpdateStatus();
  /* Nhớ ĐÃ BÁO BẢN NÀO, không phải "đã báo hay chưa".
   * Một cờ boolean nghĩa là suốt phiên chỉ báo được đúng một lần — bản kế tiếp
   * ra trong lúc app còn mở sẽ im lặng trôi qua. */
  const daBao = useRef<string | null>(null);
  useEffect(() => {
    if (!enabled) return;
    /* ⛔ Trước đây chỉ nghe `ready`, mà `ready` là trạng thái của WINDOWS/LINUX.
     * macOS đi đường riêng (`sanSang` khi đã tải sẵn, `manual` khi chưa), nên
     * trên máy Mac con robot CHƯA TỪNG báo bản mới lần nào — người dùng phải tự
     * vào Cài đặt bấm kiểm tra. */
    const v = update.state === 'ready' || update.state === 'sanSang' || update.state === 'manual'
      ? update.version
      : null;
    if (!v || daBao.current === v) return;
    daBao.current = v;
    odin.announce(
      update.state === 'manual'
        ? `Có bản ${v} rồi! Bấm "Cập nhật ${v}" ở góc dưới bên trái là mình lo phần còn lại.`
        : `Có bản ${v} rồi, tải xong sẵn luôn! Bấm "Khởi động lại" ở góc dưới bên trái khi bạn rảnh nhé.`,
    );
  }, [enabled, update, odin]);

  /* ══ CHỖ ĐỨNG + CỠ ══════════════════════════════════════════════════════
     Cỡ %, 20–100 bước 5 — CÙNG khoá `robotCo` với con nổi. Đổi ở đây ⇒
     `settings:set` bên main cũng đổi cỡ con nổi (`main/ipc/settings.ts`);
     đổi ở con nổi ⇒ main bắn `robot:coDoi` về đây. */
  const phanTram = phanTramTuThietDat(settings);
  const phai = typeof settings.odinPhai === 'number' ? settings.odinPhai : PHAI_MAC_DINH;
  const duoi = typeof settings.odinDuoi === 'number' ? settings.odinDuoi : DUOI_MAC_DINH;
  const co = coHopPx(phanTram);
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const pokeRef = useRef(odin.poke);
  pokeRef.current = odin.poke;

  const doiCo = useCallback((pt: number) => {
    setSetting('robotCo', chuanPhanTram(pt));
  }, [setSetting]);

  /* Menu chuột phải đổi cỡ ở MAIN. AppState chỉ nạp thiết đặt một lần lúc mở
     app, nên không nghe tin này thì con robot trong app giữ nguyên cỡ cũ và
     người dùng thấy hai con robot lệch cỡ nhau. */
  useEffect(() => window.cuongthai?.on('robot:coDoi', (p) => {
    const o = p as { nac?: number; phanTram?: number };
    if (typeof o.phanTram === 'number') {
      const moi = chuanPhanTram(o.phanTram);
      if (moi !== phanTramTuThietDat(settingsRef.current)) setSetting('robotCo', moi);
    } else if (typeof o.nac === 'number') setSetting('odinCo', o.nac);
  }), [setSetting]);

  /* ══ TRẠNG THÁI GIỐNG CON NỔI ══════════════════════════════════════════ */
  /** Khung "Trợ lý" đang mở. */
  const [rong, datRong] = useState(false);
  /** Đã mở ít nhất một lần ⇒ giữ sống (thu gọn chỉ ẩn — xem `KhungChat`). */
  const [daMoChat, datDaMoChat] = useState(false);
  const [chatCho, datChatCho] = useState(false);
  /** Chế độ CHỈNH (ấn 3 lần). Trạng thái phiên, KHÔNG ghi đĩa — giống con nổi. */
  const [keoDuoc, datKeoDuoc] = useState(false);
  const [dangKeo, datDangKeo] = useState(false);
  const [keoTam, datKeoTam] = useState<{ phai: number; duoi: number } | null>(null);
  const keoTamRef = useRef<{ phai: number; duoi: number } | null>(null);
  const keoRef = useRef<{ x: number; y: number; phai: number; duoi: number; daDi: boolean } | null>(null);
  /** Vừa kéo xong ⇒ nuốt cú `click` đi kèm cú thả tay. */
  const vuaKeoRef = useRef(false);
  const gocRef = useRef<HTMLDivElement>(null);

  const doiRong = useCallback((v: boolean) => {
    if (v) { datDaMoChat(true); datKeoDuoc(false); datMoGiaSu(false); }
    datRong(v);
  }, []);

  /** Đo khung để kẹp. Cỡ hộp là số TÍNH, không đo — hộp không còn `scale`. */
  const khung = useCallback((pt: number): KhungKep => {
    const sb = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--ct-statusbar-h'),
    ) || 0;
    const c = coHopPx(pt);
    return {
      rong: c.rong, cao: c.cao,
      cuaRong: window.innerWidth, cuaCao: window.innerHeight,
      thanhTrangThai: sb,
    };
  }, []);

  /* ── KÉO — giữ ở state cục bộ, ghi đĩa MỘT lần lúc thả tay ──
     (Ghi mỗi `pointermove` từng làm 35 component dựng lại hai lần mỗi khung
     và ghi đồng bộ cả tệp cấu hình — đo được, xem lịch sử tệp này.) */
  const batDauKeo = (e: React.PointerEvent<HTMLElement>): void => {
    if (!keoDuoc || e.button !== 0) return;
    /* Bắt con trỏ trên CHÍNH THÂN robot, không phải cả lớp: bắt trên tổ tiên
       là mọi `click` sau đó rơi vào tổ tiên — đúng lỗi "ấn 3 lần không chỉnh
       được" của bản cũ. */
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* jsdom */ }
    keoRef.current = { x: e.clientX, y: e.clientY, phai, duoi, daDi: false };
  };

  useEffect(() => {
    const di = (e: PointerEvent): void => {
      const k = keoRef.current;
      if (!k) return;
      if (!k.daDi && (Math.abs(e.clientX - k.x) > NGUONG_KEO_PX || Math.abs(e.clientY - k.y) > NGUONG_KEO_PX)) {
        k.daDi = true;
        datDangKeo(true);
      }
      if (!k.daDi) return;
      const moi = kepDock(k.phai - (e.clientX - k.x), k.duoi - (e.clientY - k.y), khung(phanTramTuThietDat(settingsRef.current)));
      keoTamRef.current = moi;
      datKeoTam(moi);
    };
    const tha = (): void => {
      const k = keoRef.current;
      keoRef.current = null;
      if (!k || !k.daDi) return;
      vuaKeoRef.current = true;
      setTimeout(() => { vuaKeoRef.current = false; }, 50);
      datDangKeo(false);
      const cuoi = keoTamRef.current;
      keoTamRef.current = null;
      datKeoTam(null);
      if (cuoi) { setSetting('odinPhai', cuoi.phai); setSetting('odinDuoi', cuoi.duoi); }
      pokeRef.current();
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
  }, [khung, setSetting]);

  /**
   * Đổi cỡ cửa sổ HOẶC cỡ robot ⇒ KẸP LẠI.
   *
   * Không có nhánh này thì thu cửa sổ nhỏ đi (hay phóng robot to lên) là robot
   * ra ngoài vùng nhìn thấy VĨNH VIỄN: cử chỉ mở khoá kéo nằm trên chính con
   * robot. Chỉ ghi khi thật sự lệch.
   */
  useEffect(() => {
    if (!enabled) return;
    const doi = (): void => {
      const k = khung(phanTram);
      if (!ngoaiKhung(phai, duoi, k)) return;
      const o = kepDock(phai, duoi, k);
      setSetting('odinPhai', o.phai);
      setSetting('odinDuoi', o.duoi);
    };
    doi();
    window.addEventListener('resize', doi);
    return () => window.removeEventListener('resize', doi);
  }, [enabled, phai, duoi, phanTram, khung, setSetting]);

  /* Cỡ khung app để đặt khung chat/bong bóng quanh robot. */
  const [cuaSo, datCuaSo] = useState(() => ({ rong: window.innerWidth, cao: window.innerHeight }));
  useEffect(() => {
    const doi = (): void => datCuaSo({ rong: window.innerWidth, cao: window.innerHeight });
    window.addEventListener('resize', doi);
    return () => window.removeEventListener('resize', doi);
  }, []);

  /* ══ BỐN CỬ CHỈ — cùng hook với con nổi ═══════════════════════════════
   *  1 lần → mở/đóng khung "Trợ lý" (đang học bài: khung GIA SƯ của bài)
   *  2 lần → trang AI Chat (đúng cuộc nói gần nhất nếu có)
   *  3 lần → chế độ chỉnh: kéo + cỡ 20–100% (↑/↓ ±5%, Esc xong)
   *  4 lần → ẩn robot (cả hai con — một công tắc)
   *
   * ⚠️ Đang học bài thì MỘT cú bấm KHÔNG được rời trang (người dùng
   * 17/09/2026): nó mở khung gia sư ngay tại chỗ.
   */
  const { bam } = useCuChi({
    mot: () => {
      odin.poke();
      if (baiDangHoc) {
        datRong(false);
        datKeoDuoc(false);
        datMoGiaSu((v) => !v);
        return;
      }
      doiRong(!rong);
    },
    hai: () => {
      datRong(false);
      datMoGiaSu(false);
      const id = phienNoiHienTai();
      navigate('/chat', id ? `phien=${encodeURIComponent(id)}` : undefined);
    },
    ba: () => {
      datRong(false);
      datMoGiaSu(false);
      datKeoDuoc((v) => !v);
    },
    bon: () => {
      datRong(false);
      const tat = window.cuongthai?.robot?.batTat;
      if (tat) void tat(false).catch(() => {});
      else setSetting('robotEnabled', false);
    },
  }, { vuaKeoRef });

  const hienSo = usePhimChinh({
    bat: keoDuoc, phanTram, doiCo, thoat: () => datKeoDuoc(false), gocRef,
  });

  /* Đổi trang ⇒ thoát chế độ chỉnh (như con nổi thu khung khi đi chỗ khác). */
  useEffect(() => { datKeoDuoc(false); }, [route]);

  /* "Bạn không cần tôi nữa ư?" — câu hỏi lúc thoát app (`main/hoiThoat.ts`). */
  const hoiThoat = useHoiThoat();
  useEffect(() => {
    if (hoiThoat.id === null) return;
    datRong(false);
    datKeoDuoc(false);
    datMoGiaSu(false);
  }, [hoiThoat.id]);

  const moodHienTai: OdinMood = hoiThoat.id !== null ? 'lo' : dangKeo ? 'vui' : chatCho ? 'nghi' : odin.mood;

  /* ══ VÙNG NỘI DUNG — cố định cỡ, đặt quanh robot ══════════════════════ */
  const loaiNd: keyof typeof CAO_CAN | null = hoiThoat.id !== null ? 'hoi'
    : rong ? 'chat'
    : keoDuoc ? 'bang'
      : baiDangHoc && moGiaSu ? 'giaSu'
        : odin.say ? 'bong'
          : null;
  const hopPhai = keoTam?.phai ?? phai;
  const hopDuoi = keoTam?.duoi ?? duoi;
  const sb = typeof document === 'undefined' ? 0 : (parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--ct-statusbar-h'),
  ) || 0);
  const bc = useMemo(() => boCucNoiDungApp(
    { phai: hopPhai, duoi: hopDuoi, rong: co.rong, cao: co.cao },
    { rong: cuaSo.rong, cao: cuaSo.cao - sb },
    CAO_CAN[loaiNd ?? 'chat'],
  ), [hopPhai, hopDuoi, co.rong, co.cao, cuaSo, sb, loaiNd]);

  if (!enabled) return null;
  /* Sổ tay có nút "✨ Hỏi ghi chú" riêng ở ĐÚNG góc dưới-phải này, và robot đè
     kín nó (đo 26/09/2026, ảnh chụp app 1440×900). Web đã ẩn robot nổi trên
     /notes vì cùng lý do — theo đúng quyết định đó. Chỉ ẩn phần VẼ; mọi effect
     ở trên vẫn chạy nên quay ra trang khác là robot có mặt ngay, đúng trạng thái. */
  if ((route === '/notes' || route.startsWith('/notes/')) && hoiThoat.id === null) return null;

  const coPhien = !!phienNoiHienTai();

  return (
    <div
      ref={gocRef}
      className="rb rb-app odin-dock odin-canh"
      data-rong={rong}
      data-keo={keoDuoc}
      data-dang-keo={dangKeo}
      data-mood={moodHienTai}
      data-listening={odin.listening}
      data-hover={hovering}
    >
      {!dangKeo && loaiNd && loaiNd !== 'chat' && (
        <div className="rb-nd" data-phia={bc.phia} data-ngang={bc.ngang} style={bc.kieu}>
          {loaiNd === 'hoi' ? (
            <TheHoiThoat onTra={hoiThoat.tra} />
          ) : loaiNd === 'bang' ? (
            <BangChinh
              phanTram={phanTram}
              onDoiCo={doiCo}
              onVeMacDinh={() => { setSetting('odinPhai', PHAI_MAC_DINH); setSetting('odinDuoi', DUOI_MAC_DINH); }}
              onXong={() => datKeoDuoc(false)}
              nenTang={null}
            />
          ) : loaiNd === 'giaSu' && baiDangHoc ? (
            /* KHUNG GIA SƯ, mở ngay tại chỗ khi đang học. */
            <div className="odin-giasu" data-mo="true">
              <button
                type="button"
                className="odin-giasu-dong"
                aria-label={dich('Đóng khung gia sư')}
                title={dich('Đóng')}
                onClick={(e) => { e.stopPropagation(); datMoGiaSu(false); }}
              >
                <X size={13} aria-hidden />
              </button>
              <GiaSuTrongRobot bai={baiDangHoc} rong={false} />
            </div>
          ) : odin.say ? (
            /*
             * BẤM VÀO BONG BÓNG ⇒ MỞ ĐÚNG CUỘC TRÒ CHUYỆN ĐÓ TRONG /chat.
             * Chỉ bấm được khi CÓ phiên: những câu như "Mình không dùng được
             * micro" không thuộc cuộc nào, và mở một trang trống còn tệ hơn.
             */
            <div className="rb-bong-boc" role="status">
              {coPhien ? (
                <button
                  type="button"
                  className="rb-bong"
                  data-loai="tra-loi"
                  data-co-x="true"
                  title={dich('Bấm để đọc đầy đủ trong AI Chat')}
                  onClick={() => {
                    const id = phienNoiHienTai();
                    odin.dismissSay();
                    navigate('/chat', id ? `phien=${encodeURIComponent(id)}` : undefined);
                  }}
                >
                  {odin.say}
                  <span className="rb-bong-goi-y">{dich('Bấm để đọc đầy đủ →')}</span>
                </button>
              ) : (
                <div className="rb-bong" data-loai="thong-bao" data-co-x="true">{odin.say}</div>
              )}
              <button
                type="button"
                className="rb-bong-x"
                aria-label={dich('Ẩn thông báo')}
                title={dich('Ẩn thông báo')}
                onClick={(e) => { e.stopPropagation(); odin.dismissSay(); }}
              >
                ×
              </button>
            </div>
          ) : null}
        </div>
      )}

      {/* Khung chat SỐNG suốt từ lần mở đầu — thu gọn chỉ ẩn nó đi. Cỡ CỐ ĐỊNH
          (400×520, co lại chỉ khi cửa sổ app nhỏ hơn) ở mọi cỡ robot. */}
      {daMoChat && (
        <div
          className="rb-nd rb-nd-chat"
          data-phia={bc.phia}
          data-ngang={bc.ngang}
          style={bc.kieu}
          hidden={!rong || dangKeo}
        >
          <KhungChat
            an={!rong}
            onDong={() => doiRong(false)}
            onKeoKhung={() => {}}
            onDangCho={datChatCho}
            onXong={({ ok, chu }) => {
              if (!ok) return;
              if (!rong) odin.announce(`${dich('Xong rồi nè!')} ${chu.slice(0, 90)}`);
            }}
          />
        </div>
      )}

      <ThanRobot
        phanTram={phanTram}
        style={{ right: hopPhai, bottom: hopDuoi }}
        mood={moodHienTai}
        nhay={odin.blinking}
        hover={hovering}
        datHover={setHovering}
        keoDuoc={keoDuoc}
        hienSo={hienSo}
        nhan={odin.unread > 0
          ? dichP('Odin — mở khung chat, {n} thông báo chưa đọc', { n: odin.unread })
          : dich('Odin — mở khung chat')}
        phuHieu={odin.unread > 0 ? (
          <span className="odin-badge rb-phu-hieu" aria-hidden>
            {odin.unread > 99 ? '99+' : odin.unread}
          </span>
        ) : null}
        onPointerDown={batDauKeo}
        onBam={bam}
        onContextMenu={(e) => { e.preventDefault(); void window.cuongthai?.robot.menu(true); }}
        nutNoi={(
          <NutNoi
            tt={odin.listening ? 'nghe' : odin.mood === 'nghi' ? 'nghi' : 'im'}
            onBatDau={() => void odin.startListening()}
            onTha={odin.stopListening}
          />
        )}
      />
    </div>
  );
}
