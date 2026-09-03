/**
 * ============================================================
 * BẢNG CHẠY LỆNH — terminal rút gọn trong AI Code
 * ============================================================
 *
 * Người dùng: "có terminal ở trong này luôn giống claude app được không?"
 *
 * ─── ⚠️ NÓ KHÔNG PHẢI TERMINAL THẬT ───
 * Không có PTY, nên KHÔNG chạy được `vim`, không có chương trình hỏi-đáp
 * tương tác, không màu ANSI, không điều khiển con trỏ. Xem `main/ipc/terminal.ts`
 * để biết cái giá của terminal thật (`node-pty` là module native, phải biên
 * dịch lại cho cả ba nền tảng).
 *
 * Nó chạy một lệnh, chảy đầu ra, dừng được — đủ cho `npm test`, `npm run build`,
 * `git status`. Chỗ này nói thẳng giới hạn ra trên màn hình chứ không để người
 * dùng gõ `vim` rồi ngồi đợi một thứ không bao giờ tới.
 *
 * ─── Vì sao ĐỌC THEO NHỊP thay vì đẩy sự kiện ───
 * `docDauRaNen` trả phần MỚI kể từ lần đọc trước. Một đường đẩy sự kiện sẽ
 * phải tự gom, tự chống mất gói, tự dọn khi đóng tab — trong khi việc ở đây
 * chỉ là "vài trăm mili giây hỏi một lần". Nhịp 350ms đủ mượt cho mắt và
 * KHÔNG đủ dày để thành gánh nặng.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { CircleStop, Play, Terminal, Trash2, X } from 'lucide-react';

/** Một lệnh đã chạy, kèm đầu ra tích được. */
interface MucLenh {
  id: string;
  lenh: string;
  ra: string;
  dangChay: boolean;
  ma: number | null;
  giay: number;
}

const NHIP_MS = 350;

export function BangLenh({ cuocId, coThuMuc, onDong }: {
  cuocId: string;
  coThuMuc: boolean;
  onDong: () => void;
}) {
  const [nhap, datNhap] = useState('');
  const [ds, datDs] = useState<MucLenh[]>([]);
  const [loi, datLoi] = useState<string | null>(null);
  const cuonRef = useRef<HTMLDivElement | null>(null);

  /* Mã của lệnh đang chạy. Trong `ref` chứ không phải state: vòng đọc theo
     nhịp đọc nó ở mỗi tick, mà state trong closure của `setInterval` thì đóng
     băng ở giá trị lúc gắn. */
  const dangChayId = useRef<string | null>(null);

  // Cuộn xuống đáy khi có chữ mới — không thì đầu ra chảy ngoài tầm nhìn.
  useEffect(() => {
    const el = cuonRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [ds]);

  const doc = useCallback(async () => {
    const id = dangChayId.current;
    if (!id) return;
    const r = await window.cuongthai?.terminal.doc(id);
    if (!r?.ok) return;
    datDs((truoc) => truoc.map((m) => (m.id === id
      ? {
          ...m,
          ra: r.moi ? m.ra + r.moi : m.ra,
          dangChay: r.dangChay ?? false,
          ma: r.ma ?? null,
          giay: r.giay ?? m.giay,
        }
      : m)));
    if (r.dangChay === false) dangChayId.current = null;
  }, []);

  useEffect(() => {
    const t = setInterval(() => { void doc(); }, NHIP_MS);
    return () => clearInterval(t);
  }, [doc]);

  const chay = async (): Promise<void> => {
    const lenh = nhap.trim();
    if (!lenh || dangChayId.current) return;
    datLoi(null);
    const r = await window.cuongthai?.terminal.chay(cuocId, lenh);
    if (!r?.ok || !r.id) { datLoi(r?.loi ?? 'Không chạy được lệnh.'); return; }
    dangChayId.current = r.id;
    datDs((truoc) => [...truoc, { id: r.id!, lenh, ra: '', dangChay: true, ma: null, giay: 0 }]);
    datNhap('');
  };

  const dung = (): void => {
    const id = dangChayId.current;
    if (id) void window.cuongthai?.terminal.dung(id);
  };

  const dangChay = dangChayId.current !== null;

  return (
    <div className="ct-bang-lenh">
      <div className="ct-bang-lenh-dau">
        <Terminal size={13} aria-hidden />
        <strong>Bảng chạy lệnh</strong>
        <span className="ct-bang-lenh-ghi">
          không phải terminal đầy đủ — không chạy được `vim` hay chương trình hỏi-đáp
        </span>
        {ds.length > 0 && (
          <button type="button" title="Xoá lịch sử hiển thị" onClick={() => datDs([])}>
            <Trash2 size={12} aria-hidden />
          </button>
        )}
        <button type="button" title="Đóng bảng" onClick={onDong}>
          <X size={13} aria-hidden />
        </button>
      </div>

      <div className="ct-bang-lenh-cuon" ref={cuonRef}>
        {ds.length === 0 && (
          <p className="ct-bang-lenh-trong">
            Lệnh chạy trong thư mục dự án đang mở. Thử `git status` hoặc `npm test`.
          </p>
        )}
        {ds.map((m) => (
          <div key={m.id} className="ct-bang-lenh-muc">
            <div className="ct-bang-lenh-dong">
              <span className="ct-bang-lenh-dau-nhac">❯</span>
              <code>{m.lenh}</code>
              {m.dangChay
                ? <span className="ct-bang-lenh-trangthai" data-chay="1">đang chạy… {m.giay}s</span>
                : (
                  /* Mã thoát 0 hay khác 0 là thứ ĐẦU TIÊN người ta tìm sau khi
                     chạy test. Hiện thành nhãn màu chứ không chôn trong log. */
                  <span className="ct-bang-lenh-trangthai" data-ma={m.ma === 0 ? 'ok' : 'loi'}>
                    {m.ma === 0 ? `xong · ${m.giay}s` : `mã thoát ${m.ma} · ${m.giay}s`}
                  </span>
                )}
            </div>
            {m.ra && <pre className="ct-bang-lenh-ra">{m.ra}</pre>}
          </div>
        ))}
      </div>

      {loi && <div className="ct-notice" data-tone="err" style={{ margin: '0 8px 6px' }}><span>{loi}</span></div>}

      <div className="ct-bang-lenh-soan">
        <span className="ct-bang-lenh-dau-nhac">❯</span>
        <input
          className="ct-bang-lenh-o"
          value={nhap}
          placeholder={coThuMuc ? 'gõ lệnh rồi Enter…' : 'chọn thư mục dự án trước'}
          disabled={!coThuMuc}
          onChange={(e) => datNhap(e.target.value)}
          onKeyDown={(e) => {
            // Bộ gõ tiếng Việt dùng Enter để chốt chữ — xem feedback_ime_composing_guard.
            if (e.nativeEvent.isComposing) return;
            if (e.key === 'Enter') { e.preventDefault(); void chay(); }
          }}
        />
        {dangChay ? (
          <button type="button" className="ct-btn ct-agent-dung" onClick={dung}>
            <CircleStop size={13} aria-hidden />
            Dừng
          </button>
        ) : (
          <button type="button" className="ct-btn" onClick={() => void chay()} disabled={!nhap.trim() || !coThuMuc}>
            <Play size={13} aria-hidden />
            Chạy
          </button>
        )}
      </div>
    </div>
  );
}
