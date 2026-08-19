/**
 * Odin nổi ở góc phải dưới.
 *
 * Ba việc nó làm, đúng theo yêu cầu:
 *   1. Bấm vào → mở AI Chat.
 *   2. Đeo huy hiệu số thông báo chưa đọc (số THẬT từ máy chủ).
 *   3. Nhấn giữ nút micro → nói → thả → chữ được đưa sang AI Chat.
 *
 * Nó KHÔNG che nội dung: nằm ở góc, kích thước nhỏ, và có thể tắt hẳn trong
 * Cài đặt. Một trợ lý mà không tắt được thì là một thứ chắn đường.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Mic, X } from 'lucide-react';
import { useAppState } from '../../app-state';
import { useUpdateStatus } from '../../components/UpdateBanner';
import { docThanhTieng, ngungNoi, phatTieng, datTocDoDoc } from './giongNoi';
import { hoiOdin, phienNoiHienTai } from './hoiOdin';
import { useSession } from '../../auth/session';
import { OdinRobot } from './OdinRobot';
import { useOdin } from './useOdin';
import './odin.css';

export function OdinDock() {
  const { navigate, settings, setSetting, online } = useAppState();
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

  const odin = useOdin({
    api,
    online,
    enabled,
    onTranscript: (text) => { void traLoiBangTieng(text); },
  });

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

  /*
   * ẤN BA LẦN ĐỂ MỞ KHOÁ, ẤN BA LẦN NỮA ĐỂ CỐ ĐỊNH.
   *
   * Người dùng muốn tự đặt chỗ cho robot. Ba lần bấm chứ không phải kéo
   * thẳng: bấm MỘT lần đã có nghĩa (mở AI Chat), nên nếu kéo được mọi lúc thì
   * mỗi cú bấm hơi lệch tay sẽ thành một cú kéo, và robot trôi lung tung.
   *
   * Toạ độ lưu theo khoảng cách tới mép PHẢI/DƯỚI — đổi cỡ cửa sổ thì nó giữ
   * nguyên góc. Lưu x/y tuyệt đối là mở app ở màn hình nhỏ hơn thì robot nằm
   * ngoài vùng nhìn thấy và không có cách nào lôi lại.
   */
  const keoDuoc = settings.odinKeoDuoc === true;
  const phai = typeof settings.odinPhai === 'number' ? settings.odinPhai : 22;
  const duoi = typeof settings.odinDuoi === 'number' ? settings.odinDuoi : 16;

  const demBam = useRef(0);
  const henBam = useRef<ReturnType<typeof setTimeout> | null>(null);
  const keo = useRef<{ x: number; y: number; phai: number; duoi: number } | null>(null);
  const [dangKeo, datDangKeo] = useState(false);

  /** Đếm cú bấm; đủ ba trong 600ms thì lật khoá. Trả `true` nếu vừa lật. */
  const demVaLat = (): boolean => {
    demBam.current += 1;
    if (henBam.current) clearTimeout(henBam.current);
    if (demBam.current >= 3) {
      demBam.current = 0;
      setSetting('odinKeoDuoc', !keoDuoc);
      return true;
    }
    henBam.current = setTimeout(() => { demBam.current = 0; }, 600);
    return false;
  };

  useEffect(() => {
    if (!dangKeo) return;
    const di = (e: PointerEvent): void => {
      const b = keo.current;
      if (!b) return;
      // Kẹp trong cửa sổ: kéo ra ngoài rồi thả là mất robot.
      setSetting('odinPhai', Math.max(4, Math.min(b.phai - (e.clientX - b.x), window.innerWidth - 80)));
      setSetting('odinDuoi', Math.max(4, Math.min(b.duoi - (e.clientY - b.y), window.innerHeight - 80)));
    };
    const tha = (): void => { datDangKeo(false); keo.current = null; };
    window.addEventListener('pointermove', di);
    window.addEventListener('pointerup', tha, { once: true });
    return () => {
      window.removeEventListener('pointermove', di);
      window.removeEventListener('pointerup', tha);
    };
  }, [dangKeo, setSetting]);

  if (!enabled) return null;

  return (
    <div
      className="odin-dock"
      style={{ right: phai, bottom: `calc(var(--ct-statusbar-h) + ${duoi}px)` }}
      data-keo={keoDuoc}
      data-dang-keo={dangKeo}
      onPointerDown={(e) => {
        if (!keoDuoc) return;
        keo.current = { x: e.clientX, y: e.clientY, phai, duoi };
        datDangKeo(true);
      }}
      data-mood={odin.mood}
      data-listening={odin.listening}
      data-hover={hovering}
    >
      {odin.say && (
        /*
         * BẤM VÀO BONG BÓNG ⇒ MỞ ĐÚNG CUỘC TRÒ CHUYỆN ĐÓ TRONG /chat.
         *
         * Bong bóng cắt ở 220 ký tự vì nó nổi trên mọi cửa sổ — nhưng "đọc
         * tiếp ở đâu" thì trước 19/08/2026 không có câu trả lời: khung chữ
         * là một `div` trơ, và lượt hỏi bằng giọng còn chưa được lưu. Người
         * dùng bấm vào rồi báo lại. Nay nó là nút, và đích đến là cuộc trò
         * chuyện thật.
         *
         * Chỉ bấm được khi CÓ phiên: những câu như "Mình không dùng được
         * micro" không thuộc cuộc nào, và mở một trang trống còn tệ hơn là
         * không cho bấm.
         */
        <div
          className="odin-bubble"
          role="status"
          data-mo-duoc={phienNoiHienTai() ? 'true' : 'false'}
        >
          {phienNoiHienTai() ? (
            <button
              type="button"
              className="odin-bubble-mo"
              title="Bấm để đọc đầy đủ trong AI Chat"
              onClick={() => {
                const id = phienNoiHienTai();
                odin.dismissSay();
                navigate('/chat', id ? `phien=${encodeURIComponent(id)}` : undefined);
              }}
            >
              <span>{odin.say}</span>
              <span className="odin-bubble-goi-y">Bấm để đọc đầy đủ →</span>
            </button>
          ) : (
            <span>{odin.say}</span>
          )}
          {/* `stopPropagation` để bấm × không kéo theo cả việc mở trang. */}
          <button
            type="button"
            className="odin-bubble-dong"
            onClick={(e) => { e.stopPropagation(); odin.dismissSay(); }}
            aria-label="Đóng"
          >
            <X size={12} aria-hidden />
          </button>
        </div>
      )}

      <button
        type="button"
        className="odin-figure"
        aria-label={
          odin.unread > 0
            ? `Odin — mở AI Chat, có ${odin.unread} thông báo chưa đọc`
            : 'Odin — mở AI Chat'
        }
        onPointerEnter={() => setHovering(true)}
        onPointerLeave={() => setHovering(false)}
        onFocus={() => setHovering(true)}
        onBlur={() => setHovering(false)}
        onClick={() => {
          // Cú bấm thứ ba lật khoá — KHÔNG chuyển trang, nếu không mỗi lần
          // mở/khoá lại nhảy sang AI Chat.
          if (demVaLat()) return;
          if (keoDuoc) return;   // đang mở khoá ⇒ bấm là để kéo, không điều hướng
          odin.poke();
          // Đợi hết cú nhảy rồi mới chuyển trang — chuyển ngay thì người dùng
          // không kịp thấy phản hồi, và cảm giác là "bấm nhầm cái gì đó".
          setTimeout(() => navigate('/chat'), 260);
        }}
      >
        <OdinRobot mood={odin.mood} blinking={odin.blinking} hovering={hovering} />
        {odin.unread > 0 && (
          <span className="odin-badge" aria-hidden>
            {odin.unread > 99 ? '99+' : odin.unread}
          </span>
        )}
      </button>

      <button
        type="button"
        className="odin-mic"
        data-active={odin.listening}
        aria-label="Giữ để nói với Odin"
        title="Giữ để nói (hoặc giữ phím ` )"
        onPointerDown={() => void odin.startListening()}
        onPointerUp={odin.stopListening}
        onPointerLeave={odin.stopListening}
      >
        {odin.listening ? (
          <span className="odin-wave" aria-hidden>
            <i /><i /><i /><i />
          </span>
        ) : (
          <Mic size={14} aria-hidden />
        )}
      </button>
    </div>
  );
}
