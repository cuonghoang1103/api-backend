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
import { useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { OdinRobot } from './features/odin/OdinRobot';
import './features/odin/odin.css';
import './robot.css';

const TRE_NHAP_DUP_MS = 260;

interface ThongBao {
  loai: 'tin-nhan' | 'thong-bao' | 'nhac' | 'agent';
  chu: string;
}

function Robot() {
  const [rong, datRong] = useState(false);
  const [nhay, datNhay] = useState(false);
  const [tin, datTin] = useState<ThongBao | null>(null);
  const [hover, datHover] = useState(false);
  const henRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Nháy mắt. Giữ đúng nhịp của con robot trong app để nó vẫn là "cùng một
  // nhân vật" chứ không phải hai con giống nhau.
  useEffect(() => {
    const id = setInterval(() => {
      datNhay(true);
      setTimeout(() => datNhay(false), 160);
    }, 4200 + Math.random() * 2600);
    return () => clearInterval(id);
  }, []);

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

  const bam = useCallback(() => {
    if (henRef.current) return; // đang chờ xem có phải nhấp đúp không
    henRef.current = setTimeout(() => {
      henRef.current = null;
      doiRong(!rong);
      datTin(null);
    }, TRE_NHAP_DUP_MS);
  }, [rong, doiRong]);

  const bamDup = useCallback(() => {
    if (henRef.current) { clearTimeout(henRef.current); henRef.current = null; }
    datTin(null);
    void window.cuongthai?.robot.moChinh('/chat');
  }, []);

  return (
    <div className="rb" data-rong={rong}>
      {rong && <KhungChat onDong={() => doiRong(false)} />}

      <div
        className="rb-than"
        onClick={bam}
        onDoubleClick={bamDup}
        onMouseEnter={() => datHover(true)}
        onMouseLeave={() => datHover(false)}
        title={'Bấm một lần: mở khung chat nhanh\nBấm hai lần: mở trang AI Chat\nKéo để dời'}
      >
        {tin && !rong && (
          <div className="rb-bong" data-loai={tin.loai}>
            {tin.chu}
          </div>
        )}
        {/* Có tin thì robot 'vui' — cùng bộ tâm trạng với con robot trong app,
            nên nó vẫn là MỘT nhân vật chứ không phải hai con giống nhau. */}
        <OdinRobot mood={tin ? 'vui' : 'thuong'} blinking={nhay} hovering={hover} size={104} />
        {tin && !rong && <span className="rb-cham" />}
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
        {dangCho && <div className="rb-may rb-cho">Đang trả lời…</div>}
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
