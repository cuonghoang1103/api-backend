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
import { docThanhTieng, ngungNoi, phatTieng } from './giongNoi';
import { hoiOdin } from './hoiOdin';
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
    odin.announce(ngonNgu === 'en' ? 'Let me think…' : 'Để mình nghĩ chút…');
    try {
      const tra = await hoiOdin(api, cauHoi, ngonNgu);
      if (!tra) {
        odin.announce(ngonNgu === 'en' ? 'I did not catch that.' : 'Mình chưa nghĩ ra câu trả lời.');
        return;
      }
      odin.announce(tra);
      if (settings.odinNoiThanhTieng === false) return;
      const giong = ngonNgu === 'en' ? settings.odinGiongEn : settings.odinGiongVi;
      const blob = await docThanhTieng(api, tra, typeof giong === 'string' && giong ? giong : undefined);
      await phatTieng(blob);
    } catch (e) {
      // Hỏng thì nói ra lý do NGẮN, và vẫn để lại câu chữ. Im lặng ở đây là
      // kiểu hỏng tệ nhất: người dùng không biết mình có được nghe hay không.
      odin.announce(`Mình gặp trục trặc: ${e instanceof Error ? e.message : String(e)}`);
    }
  }, [api, odin, ngonNgu, settings]);

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
        <div className="odin-bubble" role="status">
          <span>{odin.say}</span>
          <button type="button" onClick={odin.dismissSay} aria-label="Đóng">
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
