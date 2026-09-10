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
import { useDich } from '../../i18n';

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
/* Trần dưới đủ để thấy dòng lệnh + hai dòng đầu ra; trần trên chừa chỗ cho
   bảng ghi. Mặc định 220 chứ không phải 340 như trước — mở ra để chạy một
   lệnh thì không nên nuốt một phần ba màn hình. */
const CAO_MIN = 110;
const CAO_MAX = 620;
const CAO_MAC_DINH = 220;

export function BangLenh({ cuocId, coThuMuc, onDong }: {
  cuocId: string;
  coThuMuc: boolean;
  onDong: () => void;
}) {
  const { dich } = useDich();
  const [nhap, datNhap] = useState('');
  const [ds, datDs] = useState<MucLenh[]>([]);
  const [loi, datLoi] = useState<string | null>(null);
  const cuonRef = useRef<HTMLDivElement | null>(null);

  /* Mã của lệnh đang chạy. Trong `ref` chứ không phải state: vòng đọc theo
     nhịp đọc nó ở mỗi tick, mà state trong closure của `setInterval` thì đóng
     băng ở giá trị lúc gắn. */
  const dangChayId = useRef<string | null>(null);

  /*
   * CHIỀU CAO NGƯỜI DÙNG TỰ KÉO, nhớ lại giữa các lần mở.
   *
   * Bản trước cố định 340px và người dùng báo "hiện lên che mất rất phiền" —
   * đúng: bảng ghi và bảng lệnh chia nhau một cột dọc, nên 340px là 340px bị
   * lấy khỏi chỗ đọc câu trả lời. Ai chỉ chạy `git status` cần 120px; ai chạy
   * `npm test` cần 500px. Không có con số nào đúng cho cả hai — nên để họ kéo.
   *
   * `localStorage` chứ không phải cài đặt qua IPC: đây là tiện nghi của RIÊNG
   * máy này, mất đi thì chỉ là quay về mặc định.
   */
  const [cao, datCao] = useState<number>(() => {
    try {
      const n = Number(localStorage.getItem('ct-bang-lenh-cao'));
      return Number.isFinite(n) && n >= CAO_MIN && n <= CAO_MAX ? n : CAO_MAC_DINH;
    } catch {
      return CAO_MAC_DINH;   // chế độ riêng tư / chặn lưu ⇒ vẫn phải chạy
    }
  });
  const keo = useRef<{ y: number; cao: number } | null>(null);

  /* Lịch sử lệnh cho phím ↑/↓ — thứ đầu tiên tay người ta tìm ở bất cứ ô lệnh
     nào. `viTri === null` nghĩa là đang gõ mới, chưa duyệt lịch sử. */
  const [viTri, datViTri] = useState<number | null>(null);

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

  /* Kéo bằng `pointermove` trên WINDOW, không phải trên chính cái tay nắm:
     kéo nhanh thì con trỏ rời khỏi vạch 4px và mọi sự kiện sau đó rơi vào
     phần tử khác — thanh kéo "tuột tay" giữa chừng. */
  useEffect(() => {
    const di = (e: PointerEvent): void => {
      if (!keo.current) return;
      const moi = Math.min(CAO_MAX, Math.max(CAO_MIN, keo.current.cao + (keo.current.y - e.clientY)));
      datCao(moi);
    };
    const tha = (): void => {
      if (!keo.current) return;
      keo.current = null;
      document.body.style.cursor = '';
      try { localStorage.setItem('ct-bang-lenh-cao', String(caoRef.current)); } catch { /* không lưu được thì thôi */ }
    };
    window.addEventListener('pointermove', di);
    window.addEventListener('pointerup', tha);
    return () => { window.removeEventListener('pointermove', di); window.removeEventListener('pointerup', tha); };
  }, []);

  /* `cao` mới nhất cho hàm `tha` ở trên đọc — nó gắn MỘT lần nên closure của
     nó đóng băng ở giá trị đầu. */
  const caoRef = useRef(cao);
  caoRef.current = cao;

  const dangChay = dangChayId.current !== null;

  return (
    <div className="ct-bang-lenh" style={{ height: cao, maxHeight: 'none' }}>
      {/* Tay nắm kéo. `aria-label` + phím mũi tên để bàn phím cũng chỉnh được —
          một thanh kéo chỉ dùng được bằng chuột là một tính năng chỉ có với
          một nửa người dùng. */}
      <div
        className="ct-bang-lenh-keo"
        role="separator"
        aria-label={dich('Kéo để đổi chiều cao bảng lệnh')}
        aria-orientation="horizontal"
        tabIndex={0}
        onPointerDown={(e) => {
          keo.current = { y: e.clientY, cao };
          document.body.style.cursor = 'ns-resize';
        }}
        onKeyDown={(e) => {
          const b = e.key === 'ArrowUp' ? 24 : e.key === 'ArrowDown' ? -24 : 0;
          if (!b) return;
          e.preventDefault();
          const moi = Math.min(CAO_MAX, Math.max(CAO_MIN, cao + b));
          datCao(moi);
          try { localStorage.setItem('ct-bang-lenh-cao', String(moi)); } catch { /* bỏ qua */ }
        }}
      />
      <div className="ct-bang-lenh-dau">
        <Terminal size={13} aria-hidden />
        <strong>{dich('Bảng chạy lệnh')}</strong>
        <span className="ct-bang-lenh-ghi">
          không phải terminal đầy đủ — không chạy được `vim` hay chương trình hỏi-đáp
        </span>
        {ds.length > 0 && (
          <button type="button" title={dich('Xoá lịch sử hiển thị')} onClick={() => datDs([])}>
            <Trash2 size={12} aria-hidden />
          </button>
        )}
        <button type="button" title={dich('Đóng bảng')} onClick={onDong}>
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
          onChange={(e) => { datNhap(e.target.value); datViTri(null); }}
          onKeyDown={(e) => {
            // Bộ gõ tiếng Việt dùng Enter để chốt chữ — xem feedback_ime_composing_guard.
            if (e.nativeEvent.isComposing) return;
            if (e.key === 'Enter') { e.preventDefault(); void chay(); return; }

            /* ↑/↓ duyệt lịch sử lệnh — thứ đầu tiên tay người ta tìm ở bất cứ
               ô lệnh nào, và không có nó thì gõ lại `npm test` lần thứ mười. */
            if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
            const lich = ds.map((m) => m.lenh);
            if (lich.length === 0) return;
            e.preventDefault();
            const moiVt = e.key === 'ArrowUp'
              ? Math.max(0, (viTri ?? lich.length) - 1)
              : viTri === null ? null : Math.min(lich.length, viTri + 1);
            datViTri(moiVt === lich.length ? null : moiVt);
            datNhap(moiVt === null || moiVt === lich.length ? '' : lich[moiVt]!);
          }}
        />
        {dangChay ? (
          <button type="button" className="ct-btn ct-agent-dung" onClick={dung}>
            <CircleStop size={13} aria-hidden />
            {dich('Dừng')}
          </button>
        ) : (
          <button type="button" className="ct-btn" onClick={() => void chay()} disabled={!nhap.trim() || !coThuMuc}>
            <Play size={13} aria-hidden />
            {dich('Chạy')}
          </button>
        )}
      </div>
    </div>
  );
}
