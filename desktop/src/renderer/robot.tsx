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
import { batDauThu, ngungPhat, phatBase64, type BoThu } from './features/odin/nghePhat';
import './features/odin/odin.css';
import './robot.css';

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
        // Hiện CÂU TRẢ LỜI trong bong bóng. Câu hỏi thì không — người vừa nói
        // ra nó xong, nhắc lại là thừa chỗ trên một bong bóng nổi trên mọi thứ.
        datTin({ loai: 'agent', chu: kq.traLoi });
        if (kq.tiengBase64) {
          datTt('doc');
          await phatBase64(kq.tiengBase64);
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
      thuRef.current?.dung();
      ngungPhat();
    };
  }, [thaTayNoi]);

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
        <OdinRobot
          mood={tt === 'nghe' ? 'vui' : tt === 'nghi' ? 'nghi' : tin ? 'vui' : 'thuong'}
          blinking={nhay}
          hovering={hover}
          size={104}
        />
        {tin && !rong && <span className="rb-cham" />}
      </div>

      {/*
        Nút nói nằm NGOÀI `.rb-than` — thân robot đã nhận bấm-một-lần,
        bấm-hai-lần và kéo. Nhét thêm giữ-để-nói vào đó là bốn cử chỉ tranh nhau
        một vùng, và cái nào cũng sai lúc.
      */}
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
