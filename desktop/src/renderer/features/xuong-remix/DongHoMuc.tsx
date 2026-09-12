/**
 * ĐỒNG HỒ MỨC — dải LED nhảy theo tiếng đang phát.
 *
 * ─── Vì sao nó KHÔNG đi qua state của React ───
 * Đồng hồ phải cập nhật 60 lần một giây. Đẩy con số đó vào `useState` là bắt
 * React dựng lại cây component 60 lần một giây, cho một thứ chỉ đổi chiều cao
 * của một cái `div`. Ở đây vòng `requestAnimationFrame` ghi THẲNG vào
 * `style.transform` — trình duyệt làm việc đó trên GPU và không đụng tới React
 * lần nào.
 *
 * ─── Vì sao có RƠI CHẬM và GIỮ ĐỈNH ───
 * Đọc thô ra sao vẽ vậy thì dải nhấp nháy loạn và mắt không đọc được gì. Đồng
 * hồ thật (và mọi máy đo VU/PPM) đều: lên tức thì, xuống từ từ. Vạch giữ đỉnh
 * thì đứng yên vài trăm mili giây, nên cú đỉnh chớp nhoáng — đúng cái làm méo
 * tiếng — vẫn kịp lọt vào mắt.
 *
 * ─── Thang dB, không phải thang tuyến tính ───
 * Tuyến tính thì cả bài nhạc đã master nằm chen chúc ở 20% trên cùng và 80%
 * dải dưới không bao giờ dùng tới. Tai nghe theo lô-ga, đồng hồ cũng phải thế.
 */
import { useEffect, useRef } from 'react';

/** Đáy thang, dBFS. Dưới mức này coi như im. */
const DAY_DB = -48;

/** Rơi bao nhiêu dB mỗi giây. 20 dB/s là nhịp của máy đo PPM. */
const ROI_DB_GIAY = 20;

/** Giữ vạch đỉnh bao lâu trước khi cho nó rơi, ms. */
const GIU_MS = 900;

interface Props {
  /** Trả đỉnh 0…1, hoặc `null` khi chưa có gì để đo. */
  doc: () => number | null;
  dung?: boolean | undefined;
  /** `doc` = dải đứng (bàn trộn), `ngang` = dải nằm (dải track). */
  huong?: 'doc' | 'ngang';
}

/** Biên độ 0…1 → vị trí 0…1 trên thang dB. */
export function viTriDb(dinh: number): number {
  if (dinh <= 0) return 0;
  const db = 20 * Math.log10(dinh);
  if (db <= DAY_DB) return 0;
  return Math.min(1, db / -DAY_DB + 1);
}

/** Những nấc dB đáng ghi số cạnh đồng hồ. */
export const NAC_DB = [0, -6, -12, -24, -48] as const;

/**
 * Vị trí của một mốc dB trên đồng hồ, tính từ ĐÁY, theo phần trăm.
 *
 * Dùng chính `viTriDb` để đặt nhãn, không phải `space-between`. Bản đầu xếp
 * bốn nhãn cách đều nhau — nghĩa là 0/33/67/100% — trong khi thang thật đặt
 * chúng ở 100/75/50/0%. Nhãn nói dối một cách rất thuyết phục: nó trông như
 * một cái thước.
 */
export function viTriNac(db: number): number {
  return viTriDb(10 ** (db / 20)) * 100;
}

export function DongHoMuc({ doc, dung, huong = 'doc' }: Props) {
  const thanhRef = useRef<HTMLDivElement | null>(null);
  const dinhRef = useRef<HTMLDivElement | null>(null);
  /* `doc` đổi mỗi lần cha vẽ lại. Giữ trong ref để vòng rAF không phải dựng
     lại theo — dựng lại mỗi lần vẽ là mỗi lần mất hết trạng thái rơi. */
  const docRef = useRef(doc);
  docRef.current = doc;

  useEffect(() => {
    if (dung) return undefined;
    let khung = 0;
    let truoc = performance.now();
    let muc = 0;
    let dinh = 0;
    let dinhLuc = 0;

    const chay = (nay: number) => {
      const dt = Math.min(0.1, (nay - truoc) / 1000);
      truoc = nay;
      const doc1 = docRef.current();
      const moi = doc1 === null ? 0 : viTriDb(doc1);

      /* Lên TỨC THÌ, xuống TỪ TỪ. Làm mượt cả hai chiều thì đồng hồ báo thấp
         hơn sự thật đúng lúc cần nhất — lúc có một cú đỉnh ngắn. */
      const roi = (ROI_DB_GIAY / -DAY_DB) * dt;
      muc = moi > muc ? moi : Math.max(0, muc - roi);

      if (muc >= dinh) { dinh = muc; dinhLuc = nay; }
      else if (nay - dinhLuc > GIU_MS) dinh = Math.max(muc, dinh - roi);

      const th = thanhRef.current;
      const dh = dinhRef.current;
      if (th) {
        th.style.transform = huong === 'doc' ? `scaleY(${muc})` : `scaleX(${muc})`;
      }
      if (dh) {
        dh.style.transform = huong === 'doc'
          ? `translateY(${-dinh * 100}%)` : `translateX(${dinh * 100}%)`;
        dh.style.opacity = dinh > 0.01 ? '1' : '0';
      }
      khung = requestAnimationFrame(chay);
    };
    khung = requestAnimationFrame(chay);
    return () => cancelAnimationFrame(khung);
  }, [dung, huong]);

  return (
    <div className="ct-xr-dh" data-huong={huong} aria-hidden>
      {/* Nền chia nấc: gradient lặp làm ra vạch LED, và cùng một gradient tô
          xanh → hổ phách → đỏ theo chiều cao. Đỏ nằm ở 6 dB cuối, tức đúng
          vùng nên tránh. */}
      <div className="ct-xr-dh-thanh" ref={thanhRef} />
      <div className="ct-xr-dh-dinh" ref={dinhRef} />
    </div>
  );
}
