/**
 * `/chat` — hai chế độ trong MỘT trang.
 *
 * ─── VÌ SAO KHÔNG TÁCH THÀNH ROUTE `/code` RIÊNG ───
 * `routes.ts` có một bất biến ghi ngay đầu file: mọi route trong bảng đều tồn
 * tại thật trên cuongthai.com. Agent thì KHÔNG thể tồn tại trên web — trình
 * duyệt không mở được thư mục dự án trên máy người dùng. Thêm `/code` là phá
 * bất biến đó và dựng lên một mục sidebar dẫn tới thứ web không có.
 *
 * Gộp vào `/chat` giải quyết luôn cả chuyện thoái lui: tài khoản chưa Pro vẫn
 * mở được trang, vẫn trò chuyện được, chỉ thấy thêm một lời mời nâng cấp ở tab
 * bên cạnh. Nếu là route riêng thì họ bấm vào và gặp một trang chết.
 */
import { useState } from 'react';
import { Bot, Loader2, Terminal } from 'lucide-react';
import { useAppState } from '../../app-state';
import { AgentMode } from './AgentMode';
import { ChatMode } from './ChatMode';
import { useAgentInfo } from './useAgent';

type CheDo = 'chat' | 'code';

export function ChatPage() {
  const { info, thuMuc, datThuMuc, dangTai, nap } = useAgentInfo();
  const [cheDo, datCheDo] = useState<CheDo>('chat');
  const { settings } = useAppState();

  /**
   * Robot Odin nổi ở `position: fixed; right: 22px` với bề ngang 104px, tức là
   * nó chiếm đúng góc phải-dưới màn hình. Mọi trang khác cuộn bình thường nên
   * nó chỉ lơ lửng trên khoảng trống; trang này thì NEO ô soạn ở đáy, và nút
   * Gửi rơi thẳng vào dưới con robot — bấm không trúng.
   *
   * Phát hiện bằng cách chạy thật (playwright báo "odin-dock intercepts pointer
   * events"), không phải bằng đọc mã: hai file CSS không hề nhắc tới nhau.
   *
   * Chừa chỗ CHỈ KHI robot đang bật, để người tắt robot không mất khoảng trống
   * vô cớ. Mặc định của `robotEnabled` là bật (`!== false`), giống OdinDock.
   */
  const coRobot = settings.robotEnabled !== false;

  return (
    <div className="ct-page ct-page-full" data-chua-robot={coRobot}>
      <div className="ct-panel ct-panel-full">
        <div className="ct-page-head">
          <div>
            <h1>Trợ lý AI</h1>
            <p className="ct-muted" style={{ margin: 0 }}>
              {cheDo === 'chat'
                ? 'Hỏi đáp thường ngày.'
                : 'Agent đọc dự án trên máy bạn và ghi chú của bạn.'}
            </p>
          </div>

          <div className="ct-segment" role="tablist" aria-label="Chế độ trợ lý">
            <button
              type="button"
              role="tab"
              aria-selected={cheDo === 'chat'}
              className="ct-segment-nut"
              data-chon={cheDo === 'chat'}
              onClick={() => datCheDo('chat')}
            >
              <Bot size={14} aria-hidden />
              Trò chuyện
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={cheDo === 'code'}
              className="ct-segment-nut"
              data-chon={cheDo === 'code'}
              onClick={() => datCheDo('code')}
            >
              <Terminal size={14} aria-hidden />
              Lập trình
              {/* Nhãn Pro hiện cả khi CHƯA biết trạng thái: thà nói trước rồi
                  gỡ đi, còn hơn để người dùng bấm vào rồi mới biết là phải trả
                  tiền. */}
              {info?.pro !== true && <span className="ct-segment-pro">Pro</span>}
            </button>
          </div>
        </div>

        {/* Cả hai chế độ được GIỮ SỐNG bằng CSS thay vì tháo khỏi cây React.
            Tháo ra là mất hội thoại đang dở chỉ vì người dùng liếc sang tab kia
            — và với chế độ Lập trình thì đó là hội thoại đã tốn tiền thật. */}
        <div className="ct-chedo" data-hien={cheDo === 'chat'}>
          <ChatMode />
        </div>
        <div className="ct-chedo" data-hien={cheDo === 'code'}>
          {dangTai && !info ? (
            <div className="ct-agent-nghi">
              <Loader2 size={13} aria-hidden className="ct-spin" />
              <span>Đang kiểm tra quyền…</span>
            </div>
          ) : info ? (
            <AgentMode info={info} thuMuc={thuMuc} datThuMuc={datThuMuc} napLai={nap} />
          ) : (
            <div className="ct-empty">
              <h1>Chưa kết nối được máy chủ</h1>
              <p>Chế độ Lập trình cần mạng để kiểm tra quyền và hạn mức.</p>
              <div className="ct-actions">
                <button type="button" className="ct-btn ct-btn-ghost" onClick={nap}>Thử lại</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
