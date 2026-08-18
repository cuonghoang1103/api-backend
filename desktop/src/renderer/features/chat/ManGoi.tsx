/**
 * ============================================================
 * MÀN NÓI CHUYỆN — rảnh tay, vòng lặp nghe → nghĩ → nói
 * ============================================================
 *
 * ⚠️ ĐÂY KHÔNG PHẢI ÂM THANH HAI CHIỀU NHƯ GEMINI LIVE, và chỗ khác nhau
 * đáng nói ra: Gemini vừa nghe vừa nói nên bạn CHEN LỜI bằng giọng được.
 * Cổng của web này không có API realtime speech-to-speech — chỉ có ba mảnh
 * rời (Whisper nghe theo file · LLM chảy chữ · máy đọc theo việc). Ghép lại
 * được vòng LƯỢT SAU LƯỢT.
 *
 * Nên cắt lời ở đây là CHẠM, không phải nói chen. Phần còn lại — rảnh tay,
 * tự nghe tiếp, hiệu ứng chạy theo giọng — thì giống.
 *
 * ─── HIỆU ỨNG PHẢI CHẠY THEO GIỌNG THẬT ───
 * Vòng sáng nở ra theo biên độ micro đo bằng `AnalyserNode`, không theo đồng
 * hồ. Hoạt hình chạy theo đồng hồ trông y hệt nhau dù người dùng nói hay im,
 * và người ta nhận ra ngay — lúc đó nó thành đồ trang trí chứ không phải
 * phản hồi. Khi MÁY nói thì vòng đập theo nhịp riêng, để hai bên phân biệt
 * được bằng mắt.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

import { ngheMotCau, useBienDo, type BoNghe } from './useGiongSong';

type Pha = 'nghe' | 'nghi' | 'noi' | 'dung';

const CHU: Record<Pha, string> = {
  nghe: 'Đang nghe…',
  nghi: 'Chờ tớ suy nghĩ xíu nhé…',
  noi: 'Đang trả lời',
  dung: 'Chạm để nói',
};

export function ManGoi({
  onDong,
  hoi,
}: {
  onDong: () => void;
  /** Gửi câu đã nghe được, nhận về câu trả lời + tiếng đọc. */
  hoi: (cau: string) => Promise<{ traLoi: string; phat: () => Promise<void>; ngung: () => void }>;
}) {
  const [pha, datPha] = useState<Pha>('dung');
  const [cauCuoi, datCauCuoi] = useState('');
  const [traLoi, datTraLoi] = useState('');
  const [loi, datLoi] = useState<string | null>(null);
  const [bienDo, datBienDo] = useBienDo();
  const ngheRef = useRef<BoNghe | null>(null);
  const ngungPhatRef = useRef<(() => void) | null>(null);
  const conSongRef = useRef(true);

  useEffect(() => () => {
    conSongRef.current = false;
    ngheRef.current?.huy();
    ngungPhatRef.current?.();
  }, []);

  const batDauNghe = useCallback(async () => {
    if (!conSongRef.current) return;
    datPha('nghe');
    datLoi(null);
    const bo = await ngheMotCau(async (tiengBase64) => {
      ngheRef.current = null;
      if (!conSongRef.current) return;
      // Không nghe ra gì ⇒ về chờ, KHÔNG hỏi máy chủ. Đưa chuỗi rỗng cho
      // model thì nó bịa ra câu trả lời cho một câu hỏi không tồn tại.
      if (!tiengBase64) { datPha('dung'); return; }
      datPha('nghi');
      try {
        const kq = await hoi(tiengBase64);
        if (!conSongRef.current) return;
        datCauCuoi(kq.traLoi ? '' : '');
        datTraLoi(kq.traLoi);
        ngungPhatRef.current = kq.ngung;
        datPha('noi');
        await kq.phat();
        if (!conSongRef.current) return;
        // Nói xong thì TỰ nghe tiếp — đó là toàn bộ điểm của chế độ này.
        void batDauNghe();
      } catch (e) {
        if (!conSongRef.current) return;
        datLoi((e as Error).message);
        datPha('dung');
      }
    }, datBienDo);

    if (!bo) {
      datLoi('Không mở được micro. Kiểm tra quyền micro giúp mình nhé.');
      datPha('dung');
      return;
    }
    ngheRef.current = bo;
  }, [hoi, datBienDo]);

  // Mở màn là nghe luôn — người dùng bấm vào đây là để nói, không phải để
  // bấm thêm một lần nữa.
  useEffect(() => { void batDauNghe(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  /** Chạm vào vòng: đang nói thì CẮT rồi nghe; đang nghe thì thôi; chờ thì nghe. */
  const cham = useCallback(() => {
    if (pha === 'noi') { ngungPhatRef.current?.(); void batDauNghe(); return; }
    if (pha === 'nghe') { ngheRef.current?.huy(); ngheRef.current = null; datPha('dung'); return; }
    if (pha === 'dung') void batDauNghe();
  }, [pha, batDauNghe]);

  // Vòng sáng: khi NGHE thì nở theo giọng thật; khi NÓI thì đập theo nhịp
  // riêng để mắt phân biệt được ai đang nói.
  const no = pha === 'nghe' ? Math.min(1, bienDo * 9) : 0;

  return (
    <div className="ct-goi-man" role="dialog" aria-label="Nói chuyện với trợ lý">
      <button type="button" className="ct-goi-dong" onClick={onDong} aria-label="Đóng">
        <X size={18} aria-hidden />
      </button>

      <button
        type="button"
        className="ct-goi-vong"
        data-pha={pha}
        onClick={cham}
        style={{ '--no': String(no) } as React.CSSProperties}
        aria-label={pha === 'noi' ? 'Chạm để cắt lời' : 'Chạm để nói'}
      >
        <span className="ct-goi-quang" />
        <span className="ct-goi-loi">
          {[0, 1, 2, 3, 4].map((i) => <i key={i} style={{ animationDelay: `${i * 110}ms` }} />)}
        </span>
      </button>

      <p className="ct-goi-pha">{CHU[pha]}</p>
      {loi && <p className="ct-goi-loi-chu">{loi}</p>}
      {traLoi && pha !== 'nghe' && <p className="ct-goi-tra">{traLoi}</p>}
      {cauCuoi && <p className="ct-goi-cau">“{cauCuoi}”</p>}

      <p className="ct-goi-nhac">
        {pha === 'noi'
          ? 'Chạm vào vòng để cắt lời và nói tiếp'
          : 'Nói xong cứ im — tớ tự biết là hết câu'}
      </p>
    </div>
  );
}
