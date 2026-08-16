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
import { useEffect, useState } from 'react';
import { Mic, X } from 'lucide-react';
import { useAppState } from '../../app-state';
import { useSession } from '../../auth/session';
import { OdinRobot } from './OdinRobot';
import { useOdin } from './useOdin';
import './odin.css';

export function OdinDock() {
  const { navigate, settings, online } = useAppState();
  const { api } = useSession();

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
    onTranscript: (text) => {
      // Chuyển câu vừa nói sang AI Chat. Dùng sessionStorage vì đây là dữ liệu
      // của đúng phiên cửa sổ này — không đáng ghi xuống đĩa, và không nên còn
      // lại ở lần mở app sau.
      sessionStorage.setItem('odin:transcript', text);
      navigate('/chat');
    },
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
