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
  const { navigate, settings, online } = useAppState();
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
     * CHỈ tách MỘT lần, ở câu đầu. Tách từng câu thì một câu trả lời bốn câu
     * thành bốn lời gọi máy đọc — đắt gấp bốn, và ba lần ngắt giữa chừng nghe
     * rời rạc hơn là liền mạch.
     */
    let tiengCauDau: Promise<Blob> | null = null;
    let cauDau = '';

    try {
      const tra = await hoiOdin(api, cauHoi, ngonNgu, undefined, (cau) => {
        if (!doc) return;
        cauDau = cau;
        // KHÔNG await: để nó chạy trong lúc vòng đọc stream tiếp tục.
        tiengCauDau = docThanhTieng(api, cau, tenGiong);
        // Nuốt lỗi ở đây để một lời hứa hỏng không thành "unhandled rejection";
        // lỗi thật sẽ nổi lên lúc await bên dưới.
        void tiengCauDau.catch(() => {});
      });
      if (!tra) {
        odin.announce(ngonNgu === 'en' ? "Sorry, I didn't catch that." : 'Xin lỗi, tớ chưa nghĩ ra câu trả lời.');
        return;
      }
      odin.announce(tra);
      if (!doc) return;

      // Phần đuôi = câu trả lời trừ câu đầu đã gửi đi. Câu trả lời chỉ có đúng
      // một câu thì không có đuôi, và cũng không tốn thêm lời gọi nào.
      const duoi = cauDau && tra.startsWith(cauDau) ? tra.slice(cauDau.length).trim() : '';

      if (tiengCauDau) {
        /*
         * ⚠️ ĐẶT HÀNG PHẦN ĐUÔI **TRƯỚC** KHI PHÁT CÂU ĐẦU.
         *
         * Bản đầu của tôi gọi máy đọc cho phần đuôi SAU khi câu đầu phát
         * xong — nên giữa hai đoạn là trọn một vòng gọi máy đọc, và người
         * dùng nghe thấy một khoảng lặng 3-4 giây ngay chỗ dấu chấm. Đúng
         * như báo cáo 18/08: "đến đoạn dấu chấm nó tự nhiên dùng 3-4s mới
         * đọc tiếp".
         *
         * Tôi cắt câu ra để giọng RA SỚM, rồi lại tự tạo một chỗ ngắt ở
         * giữa — chữa được đầu câu mà làm hỏng khúc giữa.
         *
         * Đặt hàng ngay từ bây giờ thì máy đọc chạy đoạn hai TRONG LÚC đoạn
         * một đang phát; câu đầu thường dài hơn thời gian sinh đoạn hai, nên
         * nối vào là liền mạch.
         */
        const tiengDuoi = duoi ? docThanhTieng(api, duoi, tenGiong) : null;
        // Nuốt lỗi ở đây để lời hứa không thành "unhandled rejection" trong
        // lúc mình còn đang phát đoạn một; lỗi thật nổi lên ở `await` bên dưới.
        void tiengDuoi?.catch(() => {});

        await phatTieng(await tiengCauDau);
        if (tiengDuoi) await phatTieng(await tiengDuoi);
      } else {
        await phatTieng(await docThanhTieng(api, tra, tenGiong));
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

  if (!enabled) return null;

  return (
    <div
      className="odin-dock"
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
