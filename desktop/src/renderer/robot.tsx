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
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { OdinRobot } from './features/odin/OdinRobot';
import { batDauThu, ngungPhat, phatBase64, type BoThu } from './features/odin/nghePhat';
import './features/odin/odin.css';
import './robot.css';

/** Ô đo và bong bóng thật phải dùng CHUNG chuỗi này — lệch là đo sai. */
const CHU_CHO = 'Chờ tớ suy nghĩ xíu nhé…';

const TRE_NHAP_DUP_MS = 260;

interface ThongBao {
  loai: 'tin-nhan' | 'thong-bao' | 'nhac' | 'agent';
  chu: string;
}

type TrangThaiNoi = 'im' | 'nghe' | 'nghi' | 'doc';

function Robot() {
  const [rong, datRong] = useState(false);
  const [nhay, datNhay] = useState(false);
  const [tin, datTin] = useState<ThongBao | null>(null);
  const [hover, datHover] = useState(false);
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
  const doRef = useRef<HTMLDivElement | null>(null);
  const chuBong = tin ? tin.chu : tt === 'nghi' ? CHU_CHO : null;

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
    return cau.on('robot:tin', (p) => {
      const t = p as ThongBao;
      datTin(t);
      // Tin tự mờ đi sau 8 giây. Để nguyên thì cái bong bóng che màn hình người
      // dùng mãi mãi, và họ phải đi tìm cách tắt nó.
      setTimeout(() => datTin((cu) => (cu === t ? null : cu)), 8000);
    });
  }, []);

  const doiRong = useCallback((v: boolean) => {
    datRong(v);
    void window.cuongthai?.robot.doiKichThuoc(v);
  }, []);

  const bam = useCallback((e: { detail: number }) => {
    if (e.detail >= 3) {
      huyHen();                 // huỷ cả mở-khung-chat lẫn mở-cửa-sổ-chính
      datKeoDuoc((v) => !v);
      return;
    }
    if (henRef.current) return; // đang chờ xem có phải nhấp đúp không
    henRef.current = setTimeout(() => {
      henRef.current = null;
      doiRong(!rong);
      datTin(null);
    }, TRE_NHAP_DUP_MS);
  }, [rong, doiRong]);

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
      const n = typeof t.odinCo === 'number' ? t.odinCo : 0;
      datNacCo(n);
      void window.cuongthai?.robot.datCo(n);
    });
  }, []);
  const doiNac = useCallback((d: number) => {
    datNacCo((cu) => {
      const moi = Math.max(0, Math.min(3, cu + d));
      void window.cuongthai?.settings.set('odinCo', moi);
      void window.cuongthai?.robot.datCo(moi);
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

  /**
   * Ba cú bấm lật khoá.
   *
   * Dùng `e.detail` của trình duyệt chứ không tự đếm bằng `setTimeout`: nó
   * đếm theo ĐÚNG khoảng nhấp-đúp của hệ điều hành, nên khớp với cảm giác tay
   * người dùng thay vì một con số 600ms tôi bịa ra.
   *
   * ⚠️ CÚ THỨ HAI CŨNG BẮN `onDoubleClick`, và ở cửa sổ nổi thì `bamDup` MỞ
   * CỬA SỔ CHÍNH — nó cướp tiêu điểm, và cú thứ ba rơi vào cửa sổ vừa hiện
   * lên chứ không vào robot. Đây chính là lý do ba-cú-bấm chạy trong app mà
   * không chạy ở con robot nổi ngoài. Nên `bamDup` phải HOÃN, và cú thứ ba
   * huỷ cái hoãn đó.
   */
  const henDup = useRef<ReturnType<typeof setTimeout> | null>(null);
  const huyHen = useCallback(() => {
    if (henRef.current) { clearTimeout(henRef.current); henRef.current = null; }
    if (henDup.current) { clearTimeout(henDup.current); henDup.current = null; }
  }, []);

  const bamDup = useCallback(() => {
    if (henRef.current) { clearTimeout(henRef.current); henRef.current = null; }
    // HOÃN, không làm ngay: cú thứ ba (nếu có) sẽ huỷ cái hẹn này. Mở cửa sổ
    // chính ngay tại cú thứ hai là cướp tiêu điểm và giết luôn cử chỉ ba bấm.
    if (henDup.current) clearTimeout(henDup.current);
    henDup.current = setTimeout(() => {
      henDup.current = null;
      datTin(null);
      void window.cuongthai?.robot.moChinh('/chat');
    }, 260);
  }, []);

  return (
    <div className="rb" data-rong={rong} data-keo={keoDuoc} data-dang-keo={dangKeo}>
      {rong && <KhungChat onDong={() => doiRong(false)} />}

      {/* Bản sao vô hình chỉ để ĐO. Cùng lớp `.rb-bong` nên cùng font, cùng
          đệm, cùng viền — số đo mới khớp với bong bóng thật. */}
      {chuBong && !rong && (
        <div ref={doRef} className="rb-bong rb-do" aria-hidden>{chuBong}</div>
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
        <div className="rb-bong" data-loai="cho">Chờ tớ suy nghĩ xíu nhé…</div>
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
        <button
          type="button"
          className="rb-bong"
          data-loai={tin.loai}
          title="Bấm để đọc đầy đủ trong AI Chat"
          onClick={(e) => { e.stopPropagation(); bamDup(); }}
          onDoubleClick={(e) => e.stopPropagation()}
        >
          {tin.chu}
        </button>
      )}
      <div
        className="rb-than"
        onPointerDown={(e) => {
          if (!keoDuoc || e.button !== 0) return;
          keo.current = { x: e.screenX, y: e.screenY };
          datDangKeo(true);
          void window.cuongthai?.robot.keoBatDau();
        }}
        onClick={bam}
        onDoubleClick={bamDup}
        onMouseEnter={() => datHover(true)}
        onMouseLeave={() => datHover(false)}
        title={'Bấm một lần: mở khung chat nhanh\nBấm hai lần: mở trang AI Chat\nKéo để dời'}
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
          mood={tt === 'nghe' ? 'vui' : tt === 'nghi' ? 'nghi' : tin ? 'vui' : 'thuong'}
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
          <button type="button" onClick={() => doiNac(1)} disabled={nacCo >= 3} title="Nhỏ hơn">−</button>
          <span>{['100%', '82%', '66%', '52%'][nacCo]}</span>
          <button type="button" onClick={() => doiNac(-1)} disabled={nacCo <= 0} title="To hơn">+</button>
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
            title="Đang đọc — bấm để dừng"
            aria-label="Dừng đọc"
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
            title={tt === 'nghi' ? 'Đang nghĩ…' : 'Giữ để nói'}
            aria-label="Giữ để nói"
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
 * Khung chat mini.
 *
 * CỐ Ý mỏng: nó gửi câu hỏi và hiện câu trả lời, hết. Mọi thứ nặng hơn (đính
 * kèm, thư mục, lịch sử, hộp cát) nằm ở app chính, và nút "Mở đầy đủ" đưa
 * người dùng sang đó. Nhồi cả app vào một cửa sổ 380px là làm hỏng cả hai.
 */
function KhungChat({ onDong }: { onDong: () => void }) {
  const [nhap, datNhap] = useState('');
  const [luot, datLuot] = useState<Array<{ toi: boolean; chu: string }>>([]);
  const [dangCho, datDangCho] = useState(false);
  const cuonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cuonRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [luot, dangCho]);

  const gui = async (): Promise<void> => {
    const t = nhap.trim();
    if (!t || dangCho) return;
    datNhap('');
    datLuot((c) => [...c, { toi: true, chu: t }]);
    datDangCho(true);
    try {
      const r = await window.cuongthai?.robot.hoi(t);
      datLuot((c) => [...c, { toi: false, chu: r?.chu ?? 'Không nhận được trả lời.' }]);
    } catch (err) {
      datLuot((c) => [...c, { toi: false, chu: `Lỗi: ${(err as Error).message}` }]);
    } finally {
      datDangCho(false);
    }
  };

  return (
    <div className="rb-chat">
      <div className="rb-chat-dau">
        <strong>Trợ lý</strong>
        <div className="rb-chat-nut">
          <button
            type="button"
            onClick={() => void window.cuongthai?.robot.moChinh('/chat')}
            title="Mở trang AI Chat đầy đủ"
          >
            Mở đầy đủ
          </button>
          <button type="button" onClick={onDong} title="Thu gọn">✕</button>
        </div>
      </div>

      <div className="rb-chat-than" ref={cuonRef}>
        {luot.length === 0 && (
          <p className="rb-chat-trong">Hỏi nhanh một câu. Cần đính kèm hay lịch sử thì mở đầy đủ.</p>
        )}
        {luot.map((l, i) => (
          <div key={i} className={l.toi ? 'rb-toi' : 'rb-may'}>{l.chu}</div>
        ))}
        {dangCho && <div className="rb-may rb-cho">Chờ tớ suy nghĩ xíu nhé…</div>}
      </div>

      <div className="rb-chat-soan">
        <input
          value={nhap}
          placeholder="Nhắn nhanh…"
          onChange={(e) => datNhap(e.target.value)}
          onKeyDown={(e) => {
            // Bộ gõ tiếng Việt dùng Enter để chốt chữ đang gõ.
            if (e.nativeEvent.isComposing) return;
            if (e.key === 'Enter') { e.preventDefault(); void gui(); }
          }}
        />
        <button type="button" onClick={() => void gui()} disabled={!nhap.trim() || dangCho}>Gửi</button>
      </div>
    </div>
  );
}

createRoot(document.getElementById('robot')!).render(<Robot />);
