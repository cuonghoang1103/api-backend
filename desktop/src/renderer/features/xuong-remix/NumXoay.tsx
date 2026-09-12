/**
 * NÚM XOAY — thay cho thanh trượt ở bàn trộn.
 *
 * ─── Vì sao núm chứ không thanh trượt ───
 * Không phải để cho giống. Thanh trượt ngang tốn 140-200px bề ngang MỖI cái,
 * nên bốn thông số của một stem chiếm trọn một hàng và bốn stem thành một
 * bảng cao ngoẵng mà mắt không so ngang được. Núm chiếm 44px, nên bốn thông
 * số của một stem xếp vừa MỘT cột, và bốn stem đứng cạnh nhau như bốn đường
 * của một bàn trộn thật — đúng hình mà người mix nhạc đã quen đọc.
 *
 * ─── Kéo DỌC, không kéo theo vòng ───
 * Núm phần mềm nào cũng thế, kể cả FL Studio: kéo theo vòng cung nghe hợp lý
 * mà dùng thì tệ (chuột phải đi đúng quỹ đạo, và đi qua tâm là giá trị nhảy
 * loạn). Kéo dọc thì cổ tay đi thẳng và có bao xa cũng được.
 *
 * ─── `setPointerCapture` là bắt buộc ───
 * Không bắt con trỏ thì kéo ra ngoài núm là mất `pointermove`, và núm kẹt ở
 * giá trị dở dang trong khi người dùng vẫn đang giữ chuột.
 */
import { useCallback, useId, useRef, useState } from 'react';
import { chuan, cung, diem, keo, ti } from './num';

interface Props {
  nhan: string;
  gia: number;
  min: number;
  max: number;
  buoc: number;
  /** Giá trị về khi bấm đúp — điểm xuất phát của thông số này. */
  macDinh: number;
  onDoi: (gia: number) => void;
  /** Chữ hiện dưới núm. Nhận giá trị đã chuẩn hoá. */
  hien: (gia: number) => string;
  tat?: boolean | undefined;
  /** Màu cung giá trị — mỗi stem một màu, như dải track ở trên. */
  mau?: string | undefined;
}

export function NumXoay({ nhan, gia, min, max, buoc, macDinh, onDoi, hien, tat, mau }: Props) {
  const dai = { min, max, buoc };
  const id = useId();
  const [dangKeo, setDangKeo] = useState(false);
  /* Điểm xuất phát của cú kéo. Cộng dồn từng `movementY` thay vì nhớ mốc thì
     sai số làm tròn tích lại, và núm trôi dần sau vài chục cú kéo. */
  const moc = useRef({ y: 0, gia: 0 });

  const xuong = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (tat) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    moc.current = { y: e.clientY, gia };
    setDangKeo(true);
  }, [gia, tat]);

  const di = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dangKeo) return;
    onDoi(keo(moc.current.gia, e.clientY - moc.current.y, dai, e.shiftKey));
  }, [dangKeo, onDoi, dai]);

  const len = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setDangKeo(false);
  }, []);

  const phim = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (tat) return;
    const to = e.shiftKey ? (max - min) / 10 : buoc;
    const b: Record<string, number> = {
      ArrowUp: to, ArrowRight: to, ArrowDown: -to, ArrowLeft: -to,
      PageUp: (max - min) / 5, PageDown: -(max - min) / 5,
    };
    if (e.key in b) { e.preventDefault(); onDoi(chuan(gia + b[e.key]!, dai)); return; }
    if (e.key === 'Home') { e.preventDefault(); onDoi(min); return; }
    if (e.key === 'End') { e.preventDefault(); onDoi(max); }
  }, [gia, min, max, buoc, onDoi, dai, tat]);

  const t = ti(gia, dai);
  const kim = diem(t, 30);
  const trong = diem(t, 13);

  return (
    <div className="ct-xr-num" data-tat={tat ? '1' : undefined}>
      <div
        className="ct-xr-num-o"
        role="slider"
        tabIndex={tat ? -1 : 0}
        aria-labelledby={id}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={gia}
        aria-valuetext={hien(gia)}
        aria-disabled={tat || undefined}
        data-keo={dangKeo ? '1' : undefined}
        onPointerDown={xuong}
        onPointerMove={di}
        onPointerUp={len}
        onPointerCancel={len}
        onKeyDown={phim}
        onDoubleClick={() => { if (!tat) onDoi(chuan(macDinh, dai)); }}
      >
        <svg viewBox="0 0 100 100" aria-hidden focusable="false">
          {/* Gradient của mặt núm: sáng ở trên, tối ở dưới. Đó là toàn bộ thủ
              thuật làm một hình tròn phẳng trông như một cái núm bấm được —
              mắt đọc "sáng trên, tối dưới" là "vật thể lồi, đèn từ trên".
              Khai trong `<defs>` của TỪNG núm chứ không một lần cho cả trang:
              núm sống trong một component dùng lại được, và một `<defs>` dùng
              chung đặt ở đâu đó khác sẽ vỡ đúng lúc component được đem sang
              chỗ mới. Trình duyệt gộp lại, chi phí là con số không. */}
          <defs>
            <linearGradient id="ct-xr-num-cap" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4a4a5c" />
              <stop offset="55%" stopColor="#2e2e3c" />
              <stop offset="100%" stopColor="#1c1c26" />
            </linearGradient>
          </defs>
          {/* Rãnh: toàn bộ 270°, luôn hiện, để mắt biết còn bao nhiêu dư địa. */}
          <path className="ct-xr-num-ranh" d={cung(0, 1, 30)} />
          {/* Cung giá trị. Vẽ từ 0 chứ không từ giữa: mọi thông số ở đây đều
              là "từ không tới nhiều", không có cái nào lưỡng cực. */}
          {t > 0.001 && (
            <path className="ct-xr-num-cung" d={cung(0, t, 30)}
              style={mau ? { stroke: mau } : undefined} />
          )}
          <circle className="ct-xr-num-mat" cx="50" cy="50" r="21" />
          {/* Vạch chỉ: từ mặt núm ra tới cung. Đây là thứ mắt bắt được ở một
              cái liếc, nhanh hơn đọc con số bên dưới.
              KHÔNG đặt `mau` ở đây — vạch nằm trên mặt núm tối và phải trắng
              để đọc được ở mọi màu; màu của đường đã nói ở cung bên ngoài.
              Đặt `style` inline thì nó thắng cả CSS, nên chỉ cần lỡ tay là
              luật kia mất tác dụng mà không có gì báo. */}
          <line className="ct-xr-num-kim" x1={trong.x} y1={trong.y} x2={kim.x} y2={kim.y} />
        </svg>
      </div>
      <span className="ct-xr-num-nhan" id={id}>{nhan}</span>
      <code className="ct-xr-num-so">{hien(gia)}</code>
    </div>
  );
}
