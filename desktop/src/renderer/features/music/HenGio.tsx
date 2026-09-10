/**
 * ============================================================
 * HẸN GIỜ TẮT NHẠC
 * ============================================================
 *
 * Nghe nhạc rồi ngủ quên là chuyện thường, và app này còn có cả một cảnh đêm ở
 * đầu trang — thiếu hẹn giờ là thiếu đúng thứ người ta cần lúc đó.
 *
 * ─── Ba quyết định ───
 *
 *  1. **Tính theo MỐC KẾT THÚC, không đếm ngược bằng biến.** Một biến `conLai--`
 *     mỗi giây sẽ trôi: máy ngủ, tab bị treo, `setInterval` bị hoãn — tỉnh dậy
 *     thì đồng hồ còn nguyên 20 phút trong khi 40 phút đã trôi qua. Lưu mốc
 *     `Date.now() + phút` rồi mỗi nhịp tính lại hiệu số thì nó luôn đúng.
 *
 *  2. **"Hết bài này" là một lựa chọn riêng**, không quy ra phút. Người ta muốn
 *     nghe nốt bài đang dở chứ không muốn bị cắt giữa câu hát.
 *
 *  3. **Nhỏ dần rồi mới dừng.** Cắt phụt ở giây cuối làm người đang thiu thiu
 *     giật mình — đúng cái nó sinh ra để tránh. Giảm âm trong 8 giây cuối, dừng
 *     hẳn, rồi TRẢ LẠI âm lượng cũ để lần phát sau không bị câm một cách khó hiểu.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Moon, X } from 'lucide-react';
import { useDich } from '../../i18n';

const MUC = [15, 30, 45, 60, 90];
/** Bao lâu để nhỏ dần trước khi dừng. */
const GIAY_NHO_DAN = 8;

export function HenGio({ playing, onDung, volume, setVolume }: {
  playing: boolean;
  onDung: () => void;
  volume: number;
  setVolume: (v: number) => void;
}) {
  const { dich } = useDich();
  const [mo, datMo] = useState(false);
  /** Mốc kết thúc (ms). `null` = không hẹn. `'het-bai'` = dừng khi hết bài. */
  const [moc, datMoc] = useState<number | 'het-bai' | null>(null);
  const [conLai, datConLai] = useState(0);
  /** Âm lượng trước khi nhỏ dần — để trả lại sau khi dừng. */
  const amCu = useRef<number | null>(null);
  const boc = useRef<HTMLDivElement>(null);

  const huy = useCallback(() => {
    datMoc(null);
    datConLai(0);
    if (amCu.current !== null) { setVolume(amCu.current); amCu.current = null; }
  }, [setVolume]);

  // Đếm lại mỗi giây TỪ MỐC, không trừ dần — xem quyết định 1 ở đầu tệp.
  useEffect(() => {
    if (typeof moc !== 'number') return;
    const nhip = setInterval(() => {
      const con = Math.max(0, Math.round((moc - Date.now()) / 1000));
      datConLai(con);

      if (con <= GIAY_NHO_DAN && con > 0) {
        if (amCu.current === null) amCu.current = volume;
        setVolume(Math.max(0, amCu.current * (con / GIAY_NHO_DAN)));
      }
      if (con <= 0) {
        onDung();
        huy();
      }
    }, 1000);
    return () => clearInterval(nhip);
  }, [moc, onDung, huy, setVolume, volume]);

  /* "Hết bài này": chờ tới lúc nhạc DỪNG rồi mới thôi. Không tự dừng — bài chạy
     hết thì trình phát tự chuyển trạng thái, và ta chỉ cần gỡ hẹn giờ. */
  useEffect(() => {
    if (moc !== 'het-bai') return;
    if (!playing) { onDung(); huy(); }
  }, [moc, playing, onDung, huy]);

  // Bấm ra ngoài thì đóng bảng.
  useEffect(() => {
    if (!mo) return;
    const ngoai = (e: PointerEvent): void => {
      if (boc.current && !boc.current.contains(e.target as Node)) datMo(false);
    };
    document.addEventListener('pointerdown', ngoai);
    return () => document.removeEventListener('pointerdown', ngoai);
  }, [mo]);

  const dangHen = moc !== null;
  const chu = moc === 'het-bai'
    ? 'hết bài'
    : conLai > 0
      ? `${Math.floor(conLai / 60)}:${String(conLai % 60).padStart(2, '0')}`
      : '';

  return (
    <div className="ct-hengio" ref={boc}>
      <button
        type="button"
        className="ct-btn ct-btn-ghost"
        data-dang={dangHen}
        onClick={() => datMo((v) => !v)}
        title={dangHen ? `Sẽ tắt sau ${chu}` : 'Hẹn giờ tắt nhạc'}
      >
        <Moon size={14} aria-hidden />
        {dangHen ? chu : 'Hẹn giờ'}
      </button>

      {mo && (
        <div className="ct-hengio-bang">
          <p className="ct-hengio-dau">{dich('Tắt nhạc sau')}</p>
          <div className="ct-hengio-muc">
            {MUC.map((p) => (
              <button
                key={p}
                type="button"
                data-chon={typeof moc === 'number' && Math.abs(conLai - p * 60) < 90}
                onClick={() => { amCu.current = null; datMoc(Date.now() + p * 60_000); datMo(false); }}
              >
                {p} phút
              </button>
            ))}
            <button
              type="button"
              data-chon={moc === 'het-bai'}
              onClick={() => { datMoc('het-bai'); datMo(false); }}
            >
              {dich('Hết bài này')}
            </button>
          </div>
          {dangHen && (
            <button type="button" className="ct-hengio-huy" onClick={() => { huy(); datMo(false); }}>
              <X size={12} aria-hidden /> Huỷ hẹn giờ
            </button>
          )}
          <p className="ct-hengio-chan">Nhạc nhỏ dần {GIAY_NHO_DAN} giây cuối rồi mới dừng.</p>
        </div>
      )}
    </div>
  );
}
