/**
 * ============================================================
 * CỬA SỔ ROBOT NỔI
 * ============================================================
 *
 * Cây React RIÊNG, không phải một góc của app chính. Nó phải nhẹ: cửa sổ này
 * sống suốt phiên làm việc và nằm trên mọi thứ, nên nạp cả Notes/Academy vào
 * đây là trả một cái giá thường trực cho thứ chỉ dùng vài giây một lần.
 *
 * ─── BA THAO TÁC, PHÂN BIỆT BẰNG THỜI GIAN ───
 *  • một lần bấm  → mở/đóng khung chat mini
 *  • hai lần bấm  → nhảy vào trang AI Chat trong app chính
 *  • kéo          → dời robot đi chỗ khác
 *
 * "Một lần" phải ĐỢI xem có lần thứ hai không, nếu không mỗi cú bấm đúp sẽ mở
 * rồi đóng khung chat trước khi kịp nhảy trang — người dùng thấy một cái nháy
 * vô nghĩa. 260ms là ngưỡng nhấp đúp quen thuộc của cả hai hệ điều hành.
 */
import { Suspense, lazy, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { OdinRobot } from './features/odin/OdinRobot';
import { taoBoDem } from './features/odin/demCuBam';
/* ⚠️ Cửa sổ robot là một ENTRY RIÊNG (`robot.html`), không đi qua
   `AppStateProvider` — nơi cửa sổ chính gọi `datNgonNgu`. Không tự gọi ở đây
   thì đổi ngôn ngữ trong Cài đặt xong, mọi cửa sổ đổi trừ con robot. */
import { datNgonNgu, dich, dichP } from './i18n';
import type { OdinMood } from './features/odin/useOdin';
import { batDauThu, ngungPhat, phatBase64, type BoThu } from './features/odin/nghePhat';
import './features/odin/odin.css';
import './robot.css';

/** Ô đo và bong bóng thật phải dùng CHUNG chuỗi này — lệch là đo sai. */
const CHU_CHO = 'Chờ tớ suy nghĩ xíu nhé…';

const TRE_NHAP_DUP_MS = 260;

/**
 * Bong bóng thông báo sống bao lâu.
 *
 * Người dùng 16/09/2026: "nó cứ hiện mãi trông rất phiền, chỉ hiện 3s thôi".
 * Trước bản này là 8 giây và KHÔNG có cách nào tắt sớm.
 *
 * ⚠️ Đồng hồ DỪNG khi con trỏ đang ở trên bong bóng (`ghim`). 3 giây là đủ để
 * liếc, nhưng không đủ để đọc một câu trả lời dài — và một bong bóng biến mất
 * giữa lúc người ta đang đọc nó thì tệ hơn hẳn một bong bóng ở lâu.
 */
const GIAY_HIEN_TIN_MS = 3000;

/**
 * Cửa sổ thời gian gộp các cú bấm liên tiếp khi TỰ ĐẾM. Xem chú thích dài ở
 * `demBam` bên dưới — vì sao `e.detail` một mình không đủ.
 *
 * 600ms rộng hơn ngưỡng nhấp đúp mặc định của cả macOS (~450ms) lẫn Windows
 * (500ms). Rộng như thế an toàn vì mỗi cử chỉ CHỐT LẠI sau `TRE_NHAP_DUP_MS`:
 * hẹn giờ nổ xong là bộ đếm về 0, nên nó không thể gộp nhầm hai cử chỉ rời.
 */
const CUA_SO_DEM_MS = 600;

/** Bấm xê dịch quá ngần này thì coi là một chuỗi MỚI (đơn vị: điểm ảnh màn hình). */
const LECH_CHO_PHEP_PX = 12;

interface ThongBao {
  loai: 'tin-nhan' | 'thong-bao' | 'nhac' | 'agent';
  chu: string;
}

type TrangThaiNoi = 'im' | 'nghe' | 'nghi' | 'doc';

function Robot() {
  const [rong, datRong] = useState(false);
  const [nhay, datNhay] = useState(false);
  const [tin, datTin] = useState<ThongBao | null>(null);
  /**
   * AI Code đang làm gì — trạng thái SỐNG, không tự mờ sau 8 giây như `tin`.
   *
   * Đây là điểm khác biệt của nó: người dùng giao một việc rồi chuyển sang app
   * khác, và trước bản này họ chỉ biết lúc XONG. Khoảng giữa — thường vài phút
   * — không phân biệt được với "app đã chết".
   */
  const [viec, datViec] = useState<string | null>(null);
  const [hover, datHover] = useState(false);
  /* Con trỏ đang ở trên bong bóng ⇒ GIỮ nó lại, đừng đếm 3 giây. */
  const [ghim, datGhim] = useState(false);
  const henRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [tt, datTt] = useState<TrangThaiNoi>('im');
  const thuRef = useRef<BoThu | null>(null);
  /* Vòng đọc chạy async qua nhiều câu. Không có cờ này thì đóng cửa sổ hay
     bấm nói câu mới giữa chừng, vòng cũ vẫn phát tiếp — hai giọng chồng nhau. */
  const conSongRef = useRef(true);

  // Nháy mắt. Giữ đúng nhịp của con robot trong app để nó vẫn là "cùng một
  // nhân vật" chứ không phải hai con giống nhau.
  useEffect(() => {
    const id = setInterval(() => {
      datNhay(true);
      setTimeout(() => datNhay(false), 160);
    }, 4200 + Math.random() * 2600);
    return () => clearInterval(id);
  }, []);

  /*
   * Cửa sổ ôm VỪA ĐÚNG bong bóng chữ.
   *
   * ⚠️ Cửa sổ Electron CẮT mọi thứ tràn ra ngoài biên, và trước 20/08/2026
   * chỗ này chỉ đổi sang một cỡ HẰNG (300×250). Nó không chữa được gì: lỗi
   * thật nằm ở CSS — bong bóng `position: absolute` trong khối chứa co vừa
   * con robot chỉ còn bề rộng khả dụng ÂM. Đo thật: **71px ở cả ba cỡ cửa
   * sổ**. Người dùng gửi ảnh chữ gãy bốn ký tự một dòng, hai lần.
   *
   * Nay bong bóng nằm trong dòng chảy, và ta ĐO nó rồi báo cỡ sang main.
   * Cửa sổ này trong suốt nhưng vẫn NUỐT chuột ở phần rỗng, nên mỗi pixel
   * thừa là một pixel bấm vào app bên dưới không ăn — ôm vừa chữ, không hơn.
   *
   * `useLayoutEffect` chứ không phải `useEffect`: đo sau khi trình duyệt đã
   * dựng xong bố cục nhưng TRƯỚC khi nó vẽ, nên người dùng không thấy một
   * khung hình bong bóng bị xén rồi mới giãn ra.
   */
  const doRef = useRef<HTMLButtonElement | null>(null);
  /*
   * ⚠️ `viec` PHẢI đi qua đúng đường bong bóng này, không được vẽ một dải
   * riêng dưới chân robot. Cửa sổ chỉ 150×190 và Electron **xén** mọi thứ
   * tràn ra ngoài biên cửa sổ — một dải thêm ở dưới sẽ mất hẳn, không lỗi,
   * không dấu vết. `doiCo('noi', …)` bên dưới mới là thứ phóng cửa sổ cho vừa,
   * và nó chỉ chạy cho `chuBong`.
   *
   * Thứ tự: thông báo thật (tin nhắn, bản mới) > đang nghĩ câu trả lời cho
   * người dùng > việc agent chạy nền. Việc nền là thứ ít cấp nhất — nó chạy
   * hàng phút, còn hai cái kia là chuyện vừa xảy ra.
   */
  const chuBong = tin ? tin.chu : tt === 'nghi' ? CHU_CHO : viec;

  useLayoutEffect(() => {
    if (rong) return;                       // đang mở khung chat, cỡ đã to sẵn
    if (!chuBong) { void window.cuongthai?.robot.doiCo('gon'); return; }
    const o = doRef.current?.getBoundingClientRect();
    void window.cuongthai?.robot.doiCo(
      'noi',
      o && o.width > 0 ? { rong: o.width, cao: o.height } : undefined,
    );
  }, [chuBong, rong]);

  useEffect(() => {
    const cau = window.cuongthai;
    if (!cau) return;
    return cau.on('robot:tin', (p) => { datTin(p as ThongBao); });
  }, []);

  /**
   * Bong bóng tự biến mất sau `GIAY_HIEN_TIN_MS`.
   *
   * ⚠️ Phải là MỘT HIỆU ỨNG theo `tin`, không phải một `setTimeout` cắm trong
   * chỗ nhận tin. Bản cũ làm thế và nó hỏng hai kiểu: hẹn giờ không huỷ được
   * (nên nút × mới sẽ vô nghĩa — bấm tắt xong 5 giây sau nó vẫn "tắt" thêm một
   * lần nữa, xoá mất tin MỚI vừa tới), và không có chỗ nào để dừng đồng hồ khi
   * người dùng đang rê chuột lên đọc.
   *
   * `ghim` bật ⇒ không đặt hẹn giờ; chuột rời ra ⇒ hiệu ứng chạy lại và đếm
   * lại từ đầu. Đó đúng là điều người đọc mong đợi.
   */
  useEffect(() => {
    if (!tin || ghim) return;
    const h = setTimeout(() => datTin(null), GIAY_HIEN_TIN_MS);
    return () => clearTimeout(h);
  }, [tin, ghim]);

  useEffect(() => window.cuongthai?.on('robot:viec', (p) => {
    const c = (p as { chu?: string | null }).chu;
    datViec(typeof c === 'string' && c ? c : null);
  }), []);

  const doiRong = useCallback((v: boolean) => {
    datRong(v);
    void window.cuongthai?.robot.doiKichThuoc(v);
  }, []);

  /**
   * Giữ để nói.
   *
   * ⚠️ TẮT MICRO Ở MỌI LỐI RA. Bốn lối: thả chuột, chuột rời khỏi nút, cửa sổ
   * mất tiêu điểm, và component bị tháo. Bỏ sót một lối là đèn micro của máy
   * sáng mãi sau khi người dùng đã đi làm việc khác — và không có cách nào tắt
   * ngoài việc thoát app.
   */
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

  /*
   * ẤN BA LẦN ĐỂ MỞ KHOÁ KÉO CỬA SỔ.
   *
   * Người dùng: "kéo được con robot trong app rồi, nhưng con nổi ngoài app
   * vẫn không kéo được." Đúng — `.rb-than` đặt `-webkit-app-region: no-drag`
   * vì nó nhận bấm-một-lần và bấm-hai-lần, nên vùng kéo còn lại chỉ là mấy
   * pixel trong suốt quanh robot. Gần như không thể trúng.
   *
   * Không thể vừa `drag` vừa nhận bấm: `-webkit-app-region: drag` NUỐT mọi
   * sự kiện chuột của phần tử. Nên phải có một công tắc, và ba lần bấm là
   * cách duy nhất không giẫm lên hai cử chỉ đã có.
   */
  const [keoDuoc, datKeoDuoc] = useState(false);
  /* Nấc cỡ 0–3, 0 = to nhất. Đọc từ thiết đặt khi mở, và bơm xuống main để
     CỬA SỔ co theo — thu nhỏ mỗi hình mà giữ cửa sổ là để lại một mảng trong
     suốt nuốt cú bấm của người dùng vào thứ nằm dưới. */
  const [nacCo, datNacCo] = useState(0);
  useEffect(() => {
    void window.cuongthai?.settings.getAll().then((t) => {
      datNgonNgu(t.ngonNgu === 'en' ? 'en' : 'vi');
      const n = typeof t.odinCo === 'number' ? t.odinCo : 0;
      datNacCo(n);
      void window.cuongthai?.robot.datCo(n);
    });
  }, []);
  /* Menu chuột phải đổi cỡ ở MAIN, nên renderer phải nghe lại — không thì
     nhãn "%" trên thanh nút vẫn hiện số cũ trong khi cửa sổ đã co. */
  /* Đổi ngôn ngữ ở Cài đặt ⇒ áp ngay, không đợi dựng lại cửa sổ. `datNgonNgu`
     bắn cho mọi `useDich` đang nghe, còn `datNn` ép chính cửa sổ này vẽ lại —
     mấy chỗ dùng `dich()` thẳng (không qua hook) không tự biết. */
  const [, datNn] = useState(0);
  useEffect(() => window.cuongthai?.on('app:doiNgonNgu', (p) => {
    datNgonNgu((p as { ngonNgu?: string }).ngonNgu === 'en' ? 'en' : 'vi');
    datNn((v) => v + 1);
  }), []);

  useEffect(() => window.cuongthai?.on('robot:coDoi', (p) => {
    const n = (p as { nac?: number }).nac;
    if (typeof n === 'number') datNacCo(n);
  }), []);

  const doiNac = useCallback((d: number) => {
    datNacCo((cu) => {
      const moi = Math.max(0, Math.min(3, cu + d));
      void window.cuongthai?.settings.set('odinCo', moi);
      void window.cuongthai?.robot.datCo(moi).then(() => window.cuongthai?.robot.hutMep());
      return moi;
    });
  }, []);
  /**
   * Kéo cửa sổ robot.
   *
   * ⚠️ KHÔNG dùng `-webkit-app-region: drag`. Nó kéo được, nhưng nuốt sạch sự
   * kiện chuột của phần tử — nên sau khi mở khoá thì `onClick` không bắn nữa
   * và ba cú bấm để KHOÁ LẠI không bao giờ tới nơi. Người dùng mở khoá xong
   * là kẹt luôn. Kéo bằng `setBounds` ở main giữ được cả hai.
   */
  const keo = useRef<{ x: number; y: number } | null>(null);
  const [dangKeo, datDangKeo] = useState(false);
  useEffect(() => {
    if (!dangKeo) return;
    const di = (e: PointerEvent): void => {
      const b = keo.current;
      if (!b) return;
      // Gốc chốt ở MAIN; đây chỉ gửi độ lệch so với chỗ bấm xuống. Gửi vị trí
      // tuyệt đối thì mỗi lần cửa sổ dời lại sinh một `pointermove` mới và nó
      // tự đẩy chính nó trượt đi.
      void window.cuongthai?.robot.keoToi(e.screenX - b.x, e.screenY - b.y);
    };
    const tha = (): void => {
      datDangKeo(false);
      keo.current = null;
      void window.cuongthai?.robot.keoXong();
    };
    window.addEventListener('pointermove', di);
    window.addEventListener('pointerup', tha, { once: true });
    return () => {
      window.removeEventListener('pointermove', di);
      window.removeEventListener('pointerup', tha);
    };
  }, [dangKeo]);

  const huyHen = useCallback(() => {
    if (henRef.current) { clearTimeout(henRef.current); henRef.current = null; }
  }, []);

  /** Mở trang AI Chat. Dùng cho cả cử chỉ hai-cú-bấm lẫn cú bấm vào bong bóng. */
  const bamDup = useCallback(() => {
    huyHen();
    datTin(null);
    void window.cuongthai?.robot.moChinh('/chat');
  }, [huyHen]);

  /**
   * ============================================================
   * ĐẾM CÚ BẤM — BỐN CỬ CHỈ TRÊN CÙNG MỘT CON ROBOT
   * ============================================================
   *
   *   1 lần → mở/đóng khung chat mini
   *   2 lần → nhảy sang trang AI Chat ở cửa sổ chính
   *   3 lần → bật/tắt chế độ KÉO + đổi cỡ
   *   4 lần → ẨN hẳn con robot
   *
   * ⚠️⚠️ `e.detail` MỘT MÌNH KHÔNG ĐỦ — và chỗ nó hụt đúng là chỗ người dùng
   * báo lỗi (16/09/2026, Windows): *"ấn 3 cái để mở chỉnh sửa thì được, ấn 3
   * cái nữa để tắt thì không tắt được"*.
   *
   * Vì sao: một khi đã mở khoá, `onPointerDown` gọi `setPointerCapture` và cửa
   * sổ bắt đầu chạy theo chuột bằng `setBounds` ở main. Con trỏ đứng yên trên
   * MÀN HÌNH, nhưng CỬA SỔ trượt dưới nó — nên toạ độ trong-cửa-sổ của cú bấm
   * kế khác cú trước. Chromium đếm nhấp liên tiếp theo cả KHOẢNG CÁCH lẫn thời
   * gian, nên lệch quá ngưỡng là `e.detail` tụt về 1 và không bao giờ lên nổi
   * 3 nữa. Ở chiều BẬT thì chưa kéo được nên không dịch gì — đúng như báo cáo:
   * bật thì chạy, tắt thì không.
   *
   * Nên đếm thêm một lần nữa bằng tay theo TOẠ ĐỘ MÀN HÌNH (`screenX/Y`) —
   * thứ duy nhất không đổi khi cửa sổ trượt — rồi lấy số LỚN HƠN. Cả hai cách
   * đều cần: `e.detail` đúng theo ngưỡng nhấp đúp THẬT của hệ điều hành (máy
   * người dùng có thể chỉnh chậm hơn `CUA_SO_DEM_MS`), còn đếm tay sống sót
   * qua chuyện cửa sổ dịch.
   */
  const demRef = useRef(taoBoDem(CUA_SO_DEM_MS, LECH_CHO_PHEP_PX));

  /**
   * ⚠️ MỌI cử chỉ đều HOÃN `TRE_NHAP_DUP_MS`, kể cả cú thứ ba — trừ cú thứ tư
   * (không còn cử chỉ nào dài hơn để đợi).
   *
   * Hoãn cả cú thứ ba nghe thừa, nhưng không hoãn thì bốn cú bấm sẽ nổ cử chỉ
   * ba TRƯỚC: người dùng định ẩn robot, và thứ họ nhận được là robot ẩn đi
   * TRONG KHI đã âm thầm bật chế độ kéo — bật lại thì nó hiện ra ở trạng thái
   * lạ mà họ không hề chọn. Đợi thêm một nhịp rẻ hơn nhiều so với chuyện đó.
   */
  const bam = useCallback((e: { detail: number; screenX: number; screenY: number }) => {
    const n = demRef.current.dem(e);
    huyHen();

    if (n >= 4) {
      demRef.current.khepLai();
      datTin(null);
      /* Chiều BẬT LẠI không thể đi qua đây — ẩn rồi thì không còn gì để bấm.
         Lối về là phím tắt toàn cục (xem `main/phimRobot.ts`), và trang Cài
         đặt in phím đó ngay cạnh công tắc. */
      /* `.catch` chứ không `void`: main ĐÓNG chính cửa sổ này để thực hiện lời
         gọi, nên kênh IPC đứt trước khi lời hứa kịp giải — `void` sẽ để lại
         một rejection không ai bắt trong những mili giây cuối cùng của renderer. */
      window.cuongthai?.robot.batTat(false).catch(() => {});
      return;
    }

    henRef.current = setTimeout(() => {
      henRef.current = null;
      demRef.current.khepLai();   // cú bấm sau mở đầu chuỗi MỚI
      if (n === 3) { datKeoDuoc((v) => !v); return; }
      if (n === 2) { bamDup(); return; }
      doiRong(!rong);
      datTin(null);
    }, TRE_NHAP_DUP_MS);
  }, [rong, doiRong, huyHen, bamDup]);

  /**
   * Tâm trạng hiện tại — tính MỘT chỗ, dùng cho cả vỏ (`data-mood`, để CSS bật
   * hoạt ảnh) lẫn `OdinRobot` (đôi mắt). Hai chỗ tự tính riêng là một ngày nào
   * đó mắt cười trong khi thân đang lo.
   */
  const moodHienTai: OdinMood =
    tt === 'nghe' ? 'nghe'
      : tt === 'nghi' ? 'nghi'
        /* Agent đang chạy ⇒ robot ra dáng ĐANG NGHĨ. Để 'thuong' thì nó đứng
           cười tươi trong lúc máy đang cày — nói sai chuyện đang xảy ra. */
        : viec ? 'nghi'
          : tin ? 'vay' : 'thuong';

  return (
    <div
      className="rb odin-canh"
      data-rong={rong}
      data-keo={keoDuoc}
      data-dang-keo={dangKeo}
      /* ⚠️ `odin-canh` + `data-mood` là thứ bật MỌI biểu cảm (xem chú thích dài
         trong `odin.css`). Trước bản này vỏ chỉ có `.rb`, mà mọi luật biểu cảm
         lại viết `.odin-dock[data-mood=…]` — nên con robot nổi chưa từng nhảy,
         vẫy hay lo lần nào; chỉ đôi mắt đổi. */
      data-mood={moodHienTai}
      data-hover={hover}
    >
      {rong && <KhungChat onDong={() => doiRong(false)} />}

      {/*
        Bản sao vô hình chỉ để ĐO.

        ⚠️ PHẢI MANG ĐÚNG `data-loai`. Không có nó thì ô đo thiếu
        `border-left: 3px` (và với 'cho' là thiếu cả chữ NGHIÊNG) mà bong bóng
        thật có. Đo thật 20/08/2026: ô đo ra 273×35 — MỘT dòng — trong khi bong
        bóng thật ra 274×55 — HAI dòng. Cửa sổ tính theo số đo hụt, và dòng cuối
        bị xén. Người dùng gửi ảnh "♪ Justin Bieber - Ghost — JustinBieberVEVO"
        cụt đáy, ngay sau bản vá tưởng đã xong.

        Bài học: bản sao dùng để đo phải giống bản thật ở MỌI thứ ảnh hưởng bố
        cục — lớp CSS thôi chưa đủ, thuộc tính chọn kiểu cũng tính.
      */}
      {chuBong && !rong && (
        <button
          type="button"
          ref={doRef}
          className="rb-bong rb-do"
          data-loai={tin ? tin.loai : 'cho'}
          /* ⚠️ Ô đo phải giống bong bóng THẬT ở MỌI thứ ảnh hưởng bố cục —
             `data-co-x` chừa chỗ cho nút ×. Thiếu nó thì ô đo hẹp hơn bong
             bóng thật đúng bằng bề rộng cái nút, cửa sổ tính theo số đo hụt,
             và dòng cuối bị xén. Đây là LẦN THỨ HAI cùng một lỗi ở cùng chỗ
             này (lần trước là `data-loai`, 20/08/2026). */
          data-co-x={tin ? 'true' : undefined}
          tabIndex={-1}
          aria-hidden
        >
          {chuBong}
        </button>
      )}

      {/*
        Bong bóng nằm NGOÀI `.rb-than` và TRÊN robot.

        Đặt trong `.rb-than` thì khối chứa co vừa con robot, và một bong bóng
        `position: absolute; right: calc(100% + 6px)` trong khối chứa ấy chỉ
        còn bề rộng khả dụng âm — trình duyệt lùi về từ dài nhất. Đo thật:
        71px ở CẢ BA cỡ cửa sổ. Xem chú thích dài trong `robot.css`.

        Ở đây nó là anh em của robot trong cột flex `.rb`, nên bề rộng do cửa
        sổ định và flex tự co nó khi cửa sổ hụt.
      */}
      {/* Đang nghĩ mà KHÔNG nói gì thì người dùng không biết nó có nghe
          thấy mình không. Trong app đã có câu này (`DangNghi`), ngoài app
          thì trước đây chỉ có con quay trên nút micro — quá nhỏ và quá xa
          tầm mắt. */}
      {!tin && !rong && tt === 'nghi' && (
        <div className="rb-bong" data-loai="cho">{dich('Chờ tớ suy nghĩ xíu nhé…')}</div>
      )}
      {/* Việc AI Code đang chạy. `data-loai="viec"` để nó nhạt hơn thông báo
          thật — nó là nền cảnh, không phải thứ đòi bạn phản ứng. */}
      {!tin && !rong && tt !== 'nghi' && viec && (
        <div className="rb-bong" data-loai="viec">
          <i className="rb-viec-cham" aria-hidden />
          {viec}
        </div>
      )}
      {tin && !rong && (
        /*
         * Bấm vào KHUNG CHỮ ⇒ mở thẳng trang AI Chat ở đúng cuộc trò
         * chuyện. Bong bóng chỉ hiện MỘT câu đang đọc (cửa sổ nhỏ, cả bài
         * thì bị biên cửa sổ cắt), nên nó phải là đường dẫn tới bản đầy đủ.
         *
         * `stopPropagation`: thân robot đã nhận bấm-một-lần (mở khung mini)
         * và bấm-hai-lần. Không chặn thì một cú bấm vào chữ vừa mở khung
         * mini vừa nhảy trang.
         */
        <div
          className="rb-bong-boc"
          /* Rê chuột lên ⇒ DỪNG đồng hồ 3 giây. Không có cái này thì một câu
             trả lời dài biến mất giữa lúc người ta đang đọc nó. */
          onMouseEnter={() => datGhim(true)}
          onMouseLeave={() => datGhim(false)}
        >
          <button
            type="button"
            className="rb-bong"
            data-loai={tin.loai}
            data-co-x="true"
            title={dich('Bấm để đọc đầy đủ trong AI Chat')}
            onClick={(e) => { e.stopPropagation(); bamDup(); }}
            onDoubleClick={(e) => e.stopPropagation()}
          >
            {tin.chu}
          </button>
          {/*
            Nút ẨN.

            ⚠️ `<button>` LỒNG trong `<button>` là HTML không hợp lệ, và
            trình duyệt tự gỡ rối bằng cách ĐÓNG nút ngoài trước nút trong —
            bong bóng vỡ làm đôi. Nên nó là ANH EM của bong bóng, đặt tuyệt
            đối vào khoảng `padding-right` mà `data-co-x` vừa chừa ra.

            `stopPropagation`: thân robot đang đếm cú bấm ở ngay dưới; không
            chặn thì bấm × cũng tính là một cú bấm vào robot.
          */}
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
      )}
      <div
        className="rb-than"
        onPointerDown={(e) => {
          if (!keoDuoc || e.button !== 0) return;
          /* GIỮ CON TRỎ. Cửa sổ chạy theo chuột, nhưng nó chạy sau một nhịp
             IPC — kéo nhanh là con trỏ vượt ra khỏi cửa sổ 150px này, và khi
             ấy `pointermove` ngừng tới, robot khựng lại rồi giật một cái khi
             chuột quay vào. Tệ hơn: thả chuột ở ngoài thì `pointerup` không
             bao giờ tới, cờ `dangKeo` kẹt bật và robot bám dính con trỏ.
             `setPointerCapture` bắt mọi sự kiện về đúng phần tử này. */
          e.currentTarget.setPointerCapture(e.pointerId);
          keo.current = { x: e.screenX, y: e.screenY };
          datDangKeo(true);
          void window.cuongthai?.robot.keoBatDau();
        }}
        /* ⚠️ KHÔNG còn `onDoubleClick`. Cú thứ hai bắn CẢ `click` lẫn
           `dblclick`, nên hai chỗ cùng xử lý một cử chỉ là hai bộ hẹn giờ
           giẫm nhau — đúng thứ đã làm ba-cú-bấm không sang nổi cú thứ ba.
           Nay mọi cử chỉ đếm ở MỘT chỗ. */
        onClick={bam}
        /* Menu chuột phải — cửa duy nhất người dùng ĐOÁN RA được. Cử chỉ
           ba-cú-bấm vẫn còn cho người quen tay, nhưng không ai tự nghĩ ra nó. */
        onContextMenu={(e) => { e.preventDefault(); void window.cuongthai?.robot.menu(false); }}
        onMouseEnter={() => datHover(true)}
        onMouseLeave={() => datHover(false)}
        title={dich('Bấm 1 lần: mở khung chat nhanh')
          + '\n' + dich('Bấm 2 lần: mở trang AI Chat')
          + '\n' + dich('Bấm 3 lần: bật/tắt chế độ kéo và đổi cỡ')
          + '\n' + dich('Bấm 4 lần: ẩn robot')
          + '\n' + dich('Chuột phải: menu đầy đủ')}
      >
        {/* Có tin thì robot 'vui' — cùng bộ tâm trạng với con robot trong app,
            nên nó vẫn là MỘT nhân vật chứ không phải hai con giống nhau. */}
        {/* Bong bóng SUY NGHĨ trên đầu robot khi nó đang nói — ba chấm nở
            dần, giống bong bóng trong truyện tranh. Nó nói "câu này là robot
            đang nói", tách hẳn khỏi bong bóng thông báo (tin nhắn, nhạc) vốn
            cũng dùng chung khung chữ. */}
        {tt === 'doc' && !rong && (
          <span className="rb-nghi-icon" aria-hidden>
            <i /><i /><i />
          </span>
        )}
        <OdinRobot
          mood={moodHienTai}
          blinking={nhay}
          hovering={hover}
          size={Math.round(104 * [1, 0.82, 0.66, 0.52][nacCo]!)}
        />
        {tin && !rong && <span className="rb-cham" />}
      </div>

      {/*
        Nút nói nằm NGOÀI `.rb-than` — thân robot đã nhận bấm-một-lần,
        bấm-hai-lần và kéo. Nhét thêm giữ-để-nói vào đó là bốn cử chỉ tranh nhau
        một vùng, và cái nào cũng sai lúc.
      */}
      {/* Nút cỡ CHỈ hiện khi đã mở khoá — bày thường trực thì hai cái nút
          nhỏ đè lên con robot suốt ngày, và người dùng bấm nhầm khi định mở
          khung chat. `no-drag` để chúng không bị vùng kéo nuốt mất cú bấm. */}
      {keoDuoc && (
        <div className="rb-co">
          <button type="button" onClick={() => doiNac(1)} disabled={nacCo >= 3} title={dich('Nhỏ hơn')}>−</button>
          <span>{['100%', '82%', '66%', '52%'][nacCo]}</span>
          <button type="button" onClick={() => doiNac(-1)} disabled={nacCo <= 0} title={dich('To hơn')}>+</button>
        </div>
      )}

      <div className="rb-noi">
        {tt === 'doc' ? (
          /* Đang đọc ⇒ hiện SÓNG ÂM, bấm vào là im ngay. Người dùng nghe hai
             câu đầu đã đủ ý thì phải có đường tắt — không thì họ ngồi chờ hết
             câu hoặc phải tắt cả app. */
          <button
            type="button"
            className="odin-mic rb-dung"
            onClick={() => { ngungPhat(); datTt('im'); }}
            title={dich('Đang đọc — bấm để dừng')}
            aria-label={dich('Dừng đọc')}
          >
            <span className="odin-wave" aria-hidden><i /><i /><i /><i /></span>
          </button>
        ) : (
          <button
            type="button"
            className="odin-mic"
            data-tt={tt}
            disabled={tt === 'nghi'}
            onPointerDown={() => void batDauNoi()}
            onPointerUp={thaTayNoi}
            onPointerLeave={thaTayNoi}
            title={tt === 'nghi' ? dich('Đang nghĩ…') : dich('Giữ để nói')}
            aria-label={dich('Giữ để nói')}
          >
            {tt === 'nghi'
              ? <span className="rb-xoay" />
              : (
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="9" y="3" width="6" height="11" rx="3" />
                  <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
                </svg>
              )}
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * ============================================================
 * KHUNG CHAT MINI
 * ============================================================
 *
 * Bản trước CỐ Ý mỏng: gửi một câu, hiện một câu, hết — và nó nói thẳng với
 * người dùng "cần đính kèm hay lịch sử thì mở đầy đủ". Nhưng "mở đầy đủ" nghĩa
 * là rời việc đang làm để sang một cửa sổ khác, đúng cái việc mà khung nổi
 * sinh ra để KHỎI phải làm. Người dùng báo đúng chuyện đó.
 *
 * Giờ nó đủ: chọn bậc model, mở lịch sử và chat tiếp phiên cũ, dán ảnh vào hỏi.
 *
 * ⚠️ Mọi lời gọi máy chủ vẫn đi qua MAIN. Cửa sổ này chạy ở origin `app://`,
 * không giữ phiên đăng nhập và vướng CORS — xem `robot:hoi` bên `ipc/robot.ts`.
 */

/**
 * Bộ dựng markdown của app chính — DÙNG LẠI, không viết bản thứ hai.
 *
 * ⚠️ 14/09/2026 người dùng gửi ảnh: câu trả lời hiện nguyên `***` và gạch đầu
 * dòng thô. Khung này in chữ THUẦN, mà model thì luôn trả markdown — nên mọi
 * câu dài đều khó đọc. `ChuAgent` lo markdown, bảng, công thức toán (KaTeX) và
 * sơ đồ mermaid, đúng như trang AI Chat đầy đủ.
 *
 * `lazy` chứ không import thẳng: nó kéo theo highlight.js + KaTeX (~600KB), mà
 * cửa sổ robot LUÔN mở và phần lớn thời gian chỉ là con robot nhỏ ở góc. Nạp
 * lúc mở khung chat lần đầu là đủ sớm.
 */
const ChuAgent = lazy(() => import('./features/chat/markdown').then((m) => ({ default: m.ChuAgent })));

/** Ba bậc, khớp `CHAT_MODELS` bên máy chủ. */
const BAC = [
  { id: 'cuongmini-max', ten: 'CuongMini Max' },
  { id: 'cuongmini-pro', ten: 'CuongMini Pro' },
  { id: 'cuongmini-3.11', ten: 'CuongMini 3.11' },
] as const;

/* Mặc định là MAX theo yêu cầu người dùng. An toàn cả khi chưa Pro: máy chủ
   tự rơi về bậc mặc định kèm `reason: 'pro_required'`, và khung này NÓI RA
   điều đó thay vì im lặng — im lặng thì người ta tưởng Max chẳng khác gì. */
const BAC_MAC_DINH = 'cuongmini-max';
const KHOA_BAC = 'ct-robot-bac';

/** Trần ảnh: khớp lược đồ IPC (4 ảnh, 8MB mỗi ảnh). */
const TOI_DA_ANH = 4;

interface Luot { toi: boolean; chu: string; anh?: string[] }

/** Bài cửa sổ chính đang mở — main chuyển sang qua `robot:baiHoc`. */
interface BaiHoc {
  lessonId: number;
  courseCode?: string;
  courseTitle?: string;
  lessonTitle?: string;
  slides?: { so: number; tong: number; bo: string; ten: string }[];
}

/** Gợi ý mở màn của gia sư — CÙNG `key` với web để dùng chung cache câu trả lời. */
const GOI_Y_BAI: { key: string; q: string }[] = [
  { key: 'start', q: 'Bài này học gì? Tôi nên bắt đầu từ đâu?' },
  { key: 'exercises', q: 'Cho tôi 3 bài tập luyện + đáp án để tự kiểm tra.' },
  { key: 'prereq', q: 'Kiến thức nền nào cần có trước khi học bài này?' },
  { key: 'hard', q: 'Giảng lại phần khó nhất của bài một cách dễ hiểu.' },
];

function KhungChat({ onDong }: { onDong: () => void }) {
  const [nhap, datNhap] = useState('');
  const [luot, datLuot] = useState<Luot[]>([]);
  const [dangCho, datDangCho] = useState(false);
  const [bac, datBac] = useState<string>(() => {
    try { return localStorage.getItem(KHOA_BAC) ?? BAC_MAC_DINH; } catch { return BAC_MAC_DINH; }
  });
  const [anh, datAnh] = useState<string[]>([]);
  const [phienId, datPhienId] = useState<string | null>(null);
  const [moSu, datMoSu] = useState(false);
  const [su, datSu] = useState<Array<{ id: string; ten: string; luc: string; so: number }>>([]);
  const [bao, datBao] = useState<string | null>(null);
  const cuonRef = useRef<HTMLDivElement>(null);
  const oNhapRef = useRef<HTMLTextAreaElement>(null);

  /* Ô nhập TỰ GIÃN theo số dòng, tới trần rồi mới cuộn trong chính nó.
     Trước 25/09/2026 đây là một `<input>` một dòng: Shift+Enter không xuống
     dòng được, và câu dài chạy mãi sang phải che mất phần đầu (ảnh người dùng
     gửi). Đặt `height: auto` TRƯỚC khi đo, không thì xoá bớt chữ mà ô không
     co lại — `scrollHeight` không bao giờ nhỏ hơn chiều cao đang có. */
  useLayoutEffect(() => {
    const el = oNhapRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 132)}px`;
  }, [nhap]);

  /*
   * ── GIA SƯ CỦA BÀI ĐANG HỌC ──
   *
   * Cửa sổ chính báo sang qua main (`robot:baiHoc`). Có bài ⇒ mặc định mở
   * thẳng chế độ gia sư: đó là lý do người ta bấm vào robot lúc đang học.
   * Rời trang bài học ⇒ main gửi `null` và khung tự về trợ lý thường, nên
   * không cần dọn cờ nào.
   */
  const [bai, datBai] = useState<BaiHoc | null>(null);
  const [muonChung, datMuonChung] = useState(false);
  const cheDoGiaSu = !!bai && !muonChung;

  /**
   * Lượt hỏi-đáp vừa xảy ra ở KHUNG DƯỚI BÀI ⇒ ghép vào mạch của robot.
   *
   * ⚠️ Lọc theo `lessonId`. Người dùng đổi bài trong lúc khung robot đang mở
   * thì một lượt của bài CŨ vẫn có thể tới sau — ghép vào là trộn hai bài.
   */
  useEffect(() => window.cuongthai?.on('academy:giaSuLuot', (p) => {
    const l = p as { lessonId: number; hoi: string; dap: string };
    if (!bai || l.lessonId !== bai.lessonId || !l.dap) return;
    datLuot((c) => [...c, { toi: true, chu: l.hoi }, { toi: false, chu: l.dap }]);
  }), [bai]);

  useEffect(() => {
    const bo = window.cuongthai?.on('robot:baiHoc', (b) => {
      const moi = (b ?? null) as BaiHoc | null;
      datBai(moi);
      /* Đổi sang bài KHÁC ⇒ vứt hội thoại cũ: hỏi tiếp trên ngữ cảnh bài cũ
         thì gia sư trả lời về một bài người dùng đã rời. */
      datLuot((c) => (moi && moi.lessonId !== bai?.lessonId ? [] : c));
    });
    return () => { bo?.(); };
  }, [bai?.lessonId]);

  useEffect(() => {
    const el = cuonRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [luot, dangCho]);

  const doiBac = (id: string) => {
    datBac(id);
    try { localStorage.setItem(KHOA_BAC, id); } catch { /* chế độ riêng tư */ }
  };

  const themAnh = (ds: File[]): void => {
    const con = TOI_DA_ANH - anh.length;
    if (con <= 0) { datBao(dichP('Tối đa {n} ảnh một lượt.', { n: TOI_DA_ANH })); return; }
    for (const f of ds.slice(0, con)) {
      const doc = new FileReader();
      doc.onload = () => {
        const u = typeof doc.result === 'string' ? doc.result : '';
        if (u.startsWith('data:image/')) datAnh((c) => [...c, u].slice(0, TOI_DA_ANH));
      };
      doc.readAsDataURL(f);
    }
  };

  /* Dán ảnh bằng Ctrl/Cmd+V ngay trong ô nhập. Đây là cách người dùng nêu tên
     thẳng ("copy paste"), và nó cũng là cách nhanh nhất: chụp màn hình xong
     dán luôn, không qua bước lưu file. */
  const nhanDan = (e: React.ClipboardEvent<HTMLTextAreaElement>): void => {
    const tep = [...e.clipboardData.items]
      .filter((x) => x.kind === 'file' && x.type.startsWith('image/'))
      .map((x) => x.getAsFile())
      .filter((x): x is File => x !== null);
    if (tep.length === 0) return;
    e.preventDefault();
    themAnh(tep);
  };

  const moLichSu = async (): Promise<void> => {
    datMoSu((v) => !v);
    if (su.length === 0) {
      const r = await window.cuongthai?.robot.phienDs();
      datSu(r?.ds ?? []);
    }
  };

  const chonPhien = async (id: string): Promise<void> => {
    datMoSu(false);
    datDangCho(true);
    try {
      const r = await window.cuongthai?.robot.phienDoc(id);
      datLuot(r?.luot ?? []);
      datPhienId(id);
      datBao(null);
    } finally {
      datDangCho(false);
    }
  };

  const cuocMoi = (): void => {
    datLuot([]);
    datPhienId(null);
    datAnh([]);
    datBao(null);
    datMoSu(false);
    /* Xoá cả ở MAIN, không chỉ trên màn hình. Main giữ `phienNoi` và vòng nhớ
       ngữ cảnh; bỏ bước này thì cuộc "mới" ghi tiếp vào phiên cũ và model vẫn
       mang theo ngữ cảnh cũ — khung trống mà nó trả lời như đang giữa cuộc
       trước, và không có gì để người dùng thấy điều đó. */
    void window.cuongthai?.robot.cuocMoi();
  };

  /**
   * Hỏi gia sư một câu CÓ SẴN (chip gợi ý hoặc một slide).
   *
   * `cacheKey` là chỗ tiết kiệm lớn: mọi người học bấm cùng chip trên cùng bài
   * đều nhận CÙNG một câu trả lời lấy từ cache, tức thì và không tốn thêm lượt
   * gọi model. Cùng khoá với web nên hai bên dùng chung một kho cache.
   */
  /**
   * Chuyển lượt vừa xong sang KHUNG GIA SƯ DƯỚI BÀI ở cửa sổ chính.
   *
   * Trên web hai chỗ này dùng chung một kho, nên hỏi ở đâu cũng là một mạch.
   * Trong app chúng là hai cửa sổ Electron riêng — thiếu cầu này thì người
   * dùng hỏi ở robot, cuộn xuống khung dưới bài và thấy một cuộc TRỐNG, phải
   * kể lại từ đầu. Đúng cái phiền mà con robot sinh ra để bỏ.
   *
   * Lỗi ở đây KHÔNG được làm hỏng câu trả lời vừa nhận — nó chỉ là đồng bộ.
   */
  const chuyenLuot = (lessonId: number, hoi: string, dap: string): void => {
    if (!dap) return;
    window.cuongthai?.academy.giaSuLuot({ lessonId, hoi, dap }).catch(() => {});
  };

  const hoiNhanh = async (cau: string, cacheKey?: string): Promise<void> => {
    if (!bai || dangCho) return;
    datLuot((c) => [...c, { toi: true, chu: cau }]);
    datDangCho(true);
    try {
      const g = await window.cuongthai?.robotGiaSu.hoi({
        lessonId: bai.lessonId, chu: cau, ...(cacheKey ? { cacheKey } : {}),
      });
      const dap = g?.chu || (g?.loi ?? dich('Không nhận được trả lời.'));
      datLuot((c) => [...c, { toi: false, chu: dap }]);
      /* Chỉ chuyển khi CÓ câu trả lời thật. Chuyển cả câu lỗi sang khung dưới
         bài là bày một thông báo lỗi ở chỗ người dùng không hề bấm gì. */
      if (g?.chu) chuyenLuot(bai.lessonId, cau, g.chu);
    } finally {
      datDangCho(false);
    }
  };

  const hoiSlide = (sl: { so: number; tong: number; bo: string; ten: string }): Promise<void> => hoiNhanh(
    `Giảng kỹ slide ${sl.so}${sl.tong ? `/${sl.tong}` : ''} của bộ ${sl.bo}`
      + `${sl.ten ? ` (“${sl.ten}”)` : ''} trong bài này: ý chính là gì, vì sao nó quan trọng, và một ví dụ dễ hiểu.`,
    `slide:${sl.bo}:${sl.so}`.slice(0, 40),
  );

  const gui = async (): Promise<void> => {
    const t = nhap.trim();
    if ((!t && anh.length === 0) || dangCho) return;
    const keo = anh;
    datNhap('');
    datAnh([]);
    datBao(null);
    datLuot((c) => [...c, { toi: true, chu: t || dich('(ảnh)'), anh: keo }]);
    datDangCho(true);
    try {
      if (cheDoGiaSu && bai) {
        /* Gia sư đi ĐƯỜNG KHÁC: endpoint của bài, có sẵn trọn nội dung bài
           trong ngữ cảnh. Gửi kèm lịch sử để hỏi tiếp có mạch. */
        const g = await window.cuongthai?.robotGiaSu.hoi({
          lessonId: bai.lessonId,
          /* Chỉ dán ảnh mà không gõ gì là chuyện RẤT hay xảy ra — tấm ảnh đã
             nói hết ý. Gửi chuỗi rỗng thì máy chủ trả "Hãy nhập câu hỏi", và
             người dùng thấy một lỗi vô lý ngay sau khi vừa dán xong ảnh. */
          chu: t || 'Giải thích giúp mình chỗ trong ảnh này (liên hệ với nội dung bài đang học).',
          lichSu: luot.slice(-8).map((x) => ({
            role: x.toi ? ('user' as const) : ('assistant' as const),
            content: x.chu,
          })),
          /* ⚠️ PHẢI gửi ảnh. Bỏ sót dòng này là khung vẫn hiện tấm ảnh trong
             bong bóng người dùng, nhưng nó không rời khỏi máy — và model trả
             lời về một tấm ảnh nó chưa từng thấy. Người dùng không có cách nào
             biết, vì họ ĐANG NHÌN THẤY ảnh mình vừa dán. */
          ...(keo.length ? { anh: keo } : {}),
        });
        const dapAnh = g?.chu || (g?.loi ?? dich('Không nhận được trả lời.'));
        datLuot((c) => [...c, { toi: false, chu: dapAnh }]);
        if (g?.chu) chuyenLuot(bai.lessonId, t || '(ảnh)', g.chu);
        return;
      }
      const r = await window.cuongthai?.robot.hoi(t || dich('Xem ảnh này giúp mình.'), {
        model: bac,
        phienId,
        ...(keo.length ? { anh: keo } : {}),
      });
      datLuot((c) => [...c, { toi: false, chu: r?.chu ?? dich('Không nhận được trả lời.') }]);
      if (r?.phienId) datPhienId(r.phienId);
      if (r?.roiBac) {
        /* Máy chủ hạ bậc trong im lặng khi chưa Pro. Nói ra, và nói LÝ DO —
           "đã dùng bậc thấp hơn" mà không nói vì sao thì người dùng đi bấm lại
           đúng bậc ấy lần nữa. */
        const t2 = BAC.find((b) => b.id === r.roiBac!.thanh)?.ten ?? r.roiBac.thanh;
        datBao(r.roiBac.lyDo === 'pro_required'
          ? dichP('Bậc này cần gói Pro — đã trả lời bằng {t}.', { t: t2 })
          : dichP('Đã trả lời bằng {t}.', { t: t2 }));
      }
    } catch (err) {
      datLuot((c) => [...c, { toi: false, chu: `Lỗi: ${(err as Error).message}` }]);
    } finally {
      datDangCho(false);
    }
  };

  return (
    <div className="rb-chat">
      <div className="rb-chat-dau">
        <span className="rb-chat-logo" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
          </svg>
        </span>
        <strong>{cheDoGiaSu ? dich('Gia sư bài học') : dich('Trợ lý')}</strong>
        {/* Bậc model CHỈ có nghĩa với trợ lý chung. Gia sư bài học chạy model
            riêng do máy chủ phân theo việc (`course_tutor`), nên để cái chọn
            bậc ở đó là một cái nút không đổi được gì. */}
        {!cheDoGiaSu && (
          <select
            className="rb-bac"
            value={bac}
            onChange={(e) => doiBac(e.target.value)}
            title={dich('Bậc model')}
          >
            {BAC.map((b) => <option key={b.id} value={b.id}>{b.ten}</option>)}
          </select>
        )}
        <div className="rb-chat-nut">
          {/* Chuyển chế độ — chỉ hiện khi ĐANG mở một bài. Không có bài thì nút
              này là lời hứa suông, bấm vào chẳng đổi gì. */}
          {bai && (
            <button
              type="button"
              onClick={() => { datMuonChung((v) => !v); datLuot([]); }}
              title={cheDoGiaSu ? dich('Chuyển sang trợ lý chung') : dich('Quay lại gia sư của bài đang học')}
            >
              {cheDoGiaSu ? dich('Trợ lý') : dich('Gia sư')}
            </button>
          )}
          {!cheDoGiaSu && (
            <button type="button" onClick={() => void moLichSu()} title={dich('Lịch sử trò chuyện')}>{dich('Lịch sử')}</button>
          )}
          <button type="button" onClick={cuocMoi} title={dich('Bắt đầu cuộc mới')}>{dich('Mới')}</button>
          <button
            type="button"
            onClick={() => void window.cuongthai?.robot.moChinh('/chat')}
            title={dich('Mở trang AI Chat')}
          >
            {dich('Đầy đủ')}
          </button>
          <button type="button" onClick={onDong} title={dich('Thu gọn')}>✕</button>
        </div>
      </div>

      {moSu && (
        <div className="rb-su">
          {su.length === 0
            ? <p className="rb-chat-trong">{dich('Chưa có cuộc nào.')}</p>
            : su.map((x) => (
              <button key={x.id} type="button" onClick={() => void chonPhien(x.id)} data-dang={x.id === phienId}>
                <span>{x.ten}</span>
                <em>{x.so}</em>
              </button>
            ))}
        </div>
      )}

      {/* Thanh ngữ cảnh — người học phải thấy NGAY robot đang nói về bài nào.
          Thiếu nó thì hỏi "chỗ này khó quá" mà không biết "chỗ này" là bài gì,
          và một câu trả lời đúng cũng trông như trả lời nhầm. */}
      {cheDoGiaSu && bai && (
        <div className="rb-bai">
          <span className="rb-bai-ten" title={bai.lessonTitle ?? ''}>{bai.lessonTitle ?? dich('Bài đang học')}</span>
          {bai.courseCode && <span className="rb-bai-ma">{bai.courseCode}</span>}
        </div>
      )}

      <div className="rb-chat-than" ref={cuonRef}>
        {luot.length === 0 && !moSu && cheDoGiaSu && (
          <div className="rb-goiy">
            <p className="rb-chat-trong">
              {dich('Hỏi bất cứ điều gì về bài này — chỗ chưa hiểu, kiến thức nền, hay xin bài tập luyện.')}
            </p>
            {/* Hỏi theo SLIDE: bấm một cái thay vì tả lại slide bằng chữ. Phần
                giảng của mỗi slide đã nằm sẵn trong nội dung bài mà gia sư
                được đưa trọn, nên chỉ cần nêu số là đủ. */}
            {!!bai?.slides?.length && (
              <details className="rb-slide">
                <summary>{dichP('Hỏi theo slide ({n})', { n: bai.slides.length })}</summary>
                <div className="rb-slide-ds">
                  {bai.slides.map((sl) => (
                    <button
                      key={`${sl.bo}#${sl.so}`}
                      type="button"
                      disabled={dangCho}
                      onClick={() => void hoiSlide(sl)}
                    >
                      <em>{sl.bo} {sl.so}{sl.tong ? `/${sl.tong}` : ''}</em> {sl.ten || '—'}
                    </button>
                  ))}
                </div>
              </details>
            )}
            <div className="rb-goiy-ds">
              {GOI_Y_BAI.map((g) => (
                <button key={g.key} type="button" disabled={dangCho} onClick={() => void hoiNhanh(g.q, g.key)}>
                  {g.q}
                </button>
              ))}
            </div>
          </div>
        )}
        {luot.length === 0 && !moSu && !cheDoGiaSu && (
          <div className="rb-chao">
            <div className="rb-chao-icon" aria-hidden="true">👋</div>
            <p className="rb-chao-tieu">{dich('Chào bạn! Tớ giúp gì được nào?')}</p>
            <p className="rb-chat-trong">
              {dich('Hỏi nhanh một câu, dán ảnh vào cũng được. Bấm Lịch sử để mở lại cuộc cũ.')}
            </p>
          </div>
        )}
        {luot.map((l, i) => (
          <div key={i} className={l.toi ? 'rb-toi' : 'rb-may'}>
            {l.anh?.map((u, k) => <img key={k} src={u} alt="" className="rb-anh" />)}
            {/* Câu của MÌNH giữ chữ thuần: người dùng gõ gì thì thấy đúng thế,
                dựng markdown lên câu họ vừa gõ là sửa chữ của họ. Chỉ câu của
                trợ lý mới đi qua bộ dựng. */}
            {l.toi
              ? l.chu
              : <Suspense fallback={l.chu}><ChuAgent text={l.chu} /></Suspense>}
          </div>
        ))}
        {dangCho && (
          <div className="rb-may rb-cho" aria-label={dich('Chờ tớ suy nghĩ xíu nhé…')}>
            <span className="rb-go"><i /><i /><i /></span>
            {dich('Chờ tớ suy nghĩ xíu nhé…')}
          </div>
        )}
      </div>

      {bao && <p className="rb-bao">{bao}</p>}

      {anh.length > 0 && (
        <div className="rb-anh-cho">
          {anh.map((u, i) => (
            <span key={i}>
              <img src={u} alt="" />
              <button type="button" onClick={() => datAnh((c) => c.filter((_, k) => k !== i))} aria-label={dich('Bỏ ảnh')}>✕</button>
            </span>
          ))}
        </div>
      )}

      <div className="rb-chat-soan">
        <textarea
          ref={oNhapRef}
          rows={1}
          autoFocus
          value={nhap}
          placeholder={dich('Nhắn nhanh, dán ảnh được…')}
          onChange={(e) => datNhap(e.target.value)}
          onPaste={nhanDan}
          onKeyDown={(e) => {
            // Bộ gõ tiếng Việt dùng Enter để chốt chữ đang gõ.
            if (e.nativeEvent.isComposing) return;
            /* Enter gửi, Shift+Enter xuống dòng — quy ước của mọi ô chat.
               Không chặn Shift+Enter thì textarea tự chèn "\n" như mong muốn. */
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void gui(); }
          }}
        />
        <button
          type="button"
          className="rb-gui"
          onClick={() => void gui()}
          disabled={(!nhap.trim() && anh.length === 0) || dangCho}
          title={dich('Gửi')}
          aria-label={dich('Gửi')}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

createRoot(document.getElementById('robot')!).render(<Robot />);
