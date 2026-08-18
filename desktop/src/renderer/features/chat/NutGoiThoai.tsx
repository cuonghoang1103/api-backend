/**
 * Nút GỌI THOẠI trong khung soạn tin — nói với trợ lý và nghe nó nói lại.
 *
 * Giữ nút để nói, thả ra là gửi. Cố ý KHÔNG làm kiểu "bấm bật / bấm tắt": micro
 * đang mở mà người dùng tưởng đã tắt là chuyện phải tránh bằng thiết kế, không
 * phải bằng lời nhắc.
 *
 * Một vòng đầy đủ: giữ → ghi âm → `/ai/stt` ra chữ → gửi câu đó vào đúng khung
 * chat (nên nó nằm lại trong lịch sử, xem lại được) → câu trả lời đọc thành
 * tiếng bằng giọng đã chọn ở Cài đặt → Trợ lý Odin.
 */
import { useCallback, useRef, useState } from 'react';
import { Loader2, Mic, Square } from 'lucide-react';
import { useAppState } from '../../app-state';
import { useSession } from '../../auth/session';
import { docThanhTieng, ngungNoi, phatTieng } from '../odin/giongNoi';

interface Props {
  /** Gửi câu vừa nói vào khung chat và trả về câu trả lời đã gom đủ. */
  onNoi: (cau: string) => Promise<string>;
  khoa: boolean;
}

export function NutGoiThoai({ onNoi, khoa }: Props) {
  const { api } = useSession();
  const { settings } = useAppState();
  const [dangNghe, setDangNghe] = useState(false);
  const [dangXuLy, setDangXuLy] = useState(false);
  const [loi, setLoi] = useState<string | null>(null);
  const may = useRef<MediaRecorder | null>(null);
  const mau = useRef<Blob[]>([]);

  const batDau = useCallback(async () => {
    if (!api || dangNghe || dangXuLy || khoa) return;
    setLoi(null);
    ngungNoi();   // đang nghe câu trước thì cắt, không để chồng tiếng
    let luong: MediaStream;
    try {
      luong = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setLoi('Không dùng được micro. Kiểm tra quyền truy cập micro giúp mình nhé.');
      return;
    }
    mau.current = [];
    const rec = new MediaRecorder(luong);
    may.current = rec;
    rec.ondataavailable = (e) => { if (e.data.size > 0) mau.current.push(e.data); };
    rec.onstop = async () => {
      // Tắt từng track: chỉ `recorder.stop()` thì đèn micro của hệ điều hành
      // vẫn sáng, và người dùng có lý do để nghĩ app còn đang nghe lén.
      for (const t of luong.getTracks()) t.stop();
      setDangNghe(false);
      setDangXuLy(true);
      try {
        const blob = new Blob(mau.current, { type: 'audio/webm' });
        const form = new FormData();
        form.append('audio', blob, 'goi.webm');
        const res = await fetch(`${api.baseUrlForForms()}/api/v1/ai/stt`, {
          method: 'POST', headers: api.authHeaders(), body: form, credentials: 'omit',
        });
        const than = await res.json() as { message?: string; data?: { text?: string } };
        if (!res.ok) throw new Error(than.message ?? `Nhận dạng giọng nói hỏng (${res.status})`);
        const cau = than.data?.text?.trim() ?? '';
        if (!cau) { setLoi('Mình chưa nghe rõ gì cả. Bạn nói lại giúp nhé.'); return; }

        const traLoi = await onNoi(cau);
        if (settings.odinNoiThanhTieng === false || !traLoi) return;
        const enGiong = settings.odinNgonNgu === 'en' ? settings.odinGiongEn : settings.odinGiongVi;
        const tieng = await docThanhTieng(api, traLoi, typeof enGiong === 'string' && enGiong ? enGiong : undefined);
        await phatTieng(tieng);
      } catch (e) {
        setLoi(e instanceof Error ? e.message : String(e));
      } finally {
        setDangXuLy(false);
      }
    };
    rec.start();
    setDangNghe(true);
  }, [api, dangNghe, dangXuLy, khoa, onNoi, settings]);

  const dungLai = useCallback(() => {
    if (may.current?.state === 'recording') may.current.stop();
  }, []);

  return (
    <>
      <button
        type="button"
        className={`ct-btn ct-btn-ghost ct-goi${dangNghe ? ' dang-nghe' : ''}`}
        // Giữ để nói — cả chuột lẫn cảm ứng. `onPointerLeave` để kéo tay ra
        // ngoài nút cũng dừng, không thì micro kẹt mở khi thả tay chỗ khác.
        onPointerDown={() => void batDau()}
        onPointerUp={dungLai}
        onPointerLeave={() => { if (dangNghe) dungLai(); }}
        disabled={khoa || dangXuLy}
        title={dangNghe ? 'Thả ra để gửi' : 'Giữ để nói với trợ lý'}
        aria-label="Giữ để nói với trợ lý"
      >
        {dangXuLy ? <Loader2 size={14} className="ct-spin" aria-hidden />
          : dangNghe ? <Square size={14} aria-hidden /> : <Mic size={14} aria-hidden />}
        {dangXuLy ? 'Đang xử lý…' : dangNghe ? 'Thả để gửi' : 'Gọi'}
      </button>
      {loi && (
        <div className="ct-notice" data-tone="err" role="alert" style={{ width: '100%' }}>
          <span>{loi}</span>
          <button type="button" className="ct-linklike" onClick={() => setLoi(null)}>Đóng</button>
        </div>
      )}
    </>
  );
}
