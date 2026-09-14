/**
 * ============================================================
 * CHỤP MÀN HÌNH + CẮT VÙNG — ngay trong khung chat
 * ============================================================
 *
 * Hai màn, một luồng:
 *   1. CHỌN NGUỒN — màn hình nào / cửa sổ nào. Bảng ảnh nhỏ.
 *   2. CẮT — tấm vừa chụp hiện lên, kéo một khung để lấy đúng phần cần.
 *      Không kéo gì thì "Dùng cả ảnh".
 *
 * Trả về một `File` PNG, đi thẳng vào `useDinhKemCode.them()` — cùng đường
 * với ảnh dán và ảnh kéo thả, nên mọi luật ở đó (chuẩn hoá 1568px, trần 8 ảnh
 * gửi thẳng) tự áp dụng mà không phải chép lại.
 *
 * ⚠️ Vùng cắt phải quy đổi từ TOẠ ĐỘ HIỂN THỊ sang TOẠ ĐỘ ẢNH THẬT. Ảnh 4K vẽ
 * trong khung rộng 800px là tỉ lệ 1:2,4 — cắt theo số đo trên màn hình thì
 * được đúng một góc trên-trái nhỏ xíu của thứ người dùng khoanh.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Camera, Check, Crop, Loader2, Monitor, RotateCcw, X } from 'lucide-react';
import { useDich } from '../../i18n';

interface Nguon {
  id: string;
  ten: string;
  loai: 'man' | 'cuaSo';
  anhNho: string;
}

interface Khung { x: number; y: number; w: number; h: number }

/** Khoanh nhỏ hơn mức này coi như bấm nhầm, không phải ý muốn cắt. */
const KHUNG_TOI_THIEU = 8;

function dataUrlSangFile(url: string, ten: string): File {
  const than = url.slice(url.indexOf(',') + 1);
  const nhiPhan = atob(than);
  const mang = new Uint8Array(nhiPhan.length);
  for (let i = 0; i < nhiPhan.length; i += 1) mang[i] = nhiPhan.charCodeAt(i);
  return new File([mang], ten, { type: 'image/png' });
}

/** Cắt theo khung, trả về PNG mới. Khung tính theo toạ độ ẢNH THẬT. */
async function catAnh(url: string, k: Khung): Promise<string> {
  const anh = new Image();
  await new Promise<void>((giai, tuChoi) => {
    anh.onload = () => giai();
    anh.onerror = () => tuChoi(new Error('Không đọc được ảnh vừa chụp.'));
    anh.src = url;
  });
  const cv = document.createElement('canvas');
  cv.width = Math.max(1, Math.round(k.w));
  cv.height = Math.max(1, Math.round(k.h));
  const ctx = cv.getContext('2d');
  if (!ctx) throw new Error('Không dựng được canvas để cắt ảnh.');
  ctx.drawImage(anh, Math.round(k.x), Math.round(k.y), cv.width, cv.height, 0, 0, cv.width, cv.height);
  return cv.toDataURL('image/png');
}

export function ChupManHinh({ onXong, onDong }: { onXong: (f: File) => void; onDong: () => void }) {
  const { dich } = useDich();
  const [dsNguon, datDsNguon] = useState<Nguon[] | null>(null);
  const [quyen, datQuyen] = useState<string>('khong-ap-dung');
  const [dangChup, datDangChup] = useState(false);
  const [anh, datAnh] = useState<{ url: string; rong: number; cao: number } | null>(null);
  const [loi, datLoi] = useState<string | null>(null);

  /* Khung đang kéo, theo toạ độ HIỂN THỊ (px trên màn hình). Quy đổi sang toạ
     độ ảnh thật chỉ làm ở lúc cắt — giữ nguyên đơn vị trong suốt lúc kéo thì
     không có chỗ nào lẫn hai hệ toạ độ. */
  const [khung, datKhung] = useState<Khung | null>(null);
  const dangKeo = useRef<{ x: number; y: number } | null>(null);
  const oAnhRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let song = true;
    void (async () => {
      try {
        const r = await window.cuongthai?.manHinh.nguon();
        if (!song || !r) return;
        datQuyen(r.quyen);
        // Màn hình lên trước cửa sổ: chụp cả màn là việc hay gặp nhất.
        datDsNguon([...r.nguon].sort((a, b) => (a.loai === b.loai ? 0 : a.loai === 'man' ? -1 : 1)));
      } catch (e) {
        if (song) datLoi((e as Error).message);
      }
    })();
    return () => { song = false; };
  }, []);

  /* Esc đóng. Gắn ở `window` chứ không ở thẻ gốc: lớp phủ không nhận tiêu điểm
     bàn phím, nên `onKeyDown` trên nó không bao giờ bắn. */
  useEffect(() => {
    const f = (e: KeyboardEvent) => { if (e.key === 'Escape') onDong(); };
    window.addEventListener('keydown', f);
    return () => window.removeEventListener('keydown', f);
  }, [onDong]);

  const chup = useCallback(async (id: string) => {
    datDangChup(true);
    datLoi(null);
    try {
      const r = await window.cuongthai?.manHinh.chup(id);
      if (!r?.ok || !r.anh) { datLoi(r?.loi ?? dich('Chụp không thành công.')); return; }
      datAnh({ url: r.anh, rong: r.rong ?? 0, cao: r.cao ?? 0 });
      datKhung(null);
    } catch (e) {
      datLoi((e as Error).message);
    } finally {
      datDangChup(false);
    }
  }, [dich]);

  const dung = useCallback(async (catTheoKhung: boolean) => {
    if (!anh) return;
    try {
      let url = anh.url;
      if (catTheoKhung && khung && oAnhRef.current) {
        // Quy đổi hiển thị → ảnh thật. `naturalWidth` là số điểm ảnh THẬT,
        // `clientWidth` là số điểm ảnh CSS sau khi khung co nó lại.
        const ti = anh.rong / (oAnhRef.current.clientWidth || 1);
        url = await catAnh(anh.url, {
          x: khung.x * ti, y: khung.y * ti, w: khung.w * ti, h: khung.h * ti,
        });
      }
      onXong(dataUrlSangFile(url, `man-hinh-${Date.now()}.png`));
      onDong();
    } catch (e) {
      datLoi((e as Error).message);
    }
  }, [anh, khung, onXong, onDong]);

  /*
   * ⚠️ ĐO THEO CHÍNH TẤM ẢNH, KHÔNG THEO KHUNG BỌC.
   *
   * Ảnh được canh giữa và `object-fit: contain`, nên một tấm 16:9 nằm trong
   * khung vuông có hai dải trống trên-dưới. Lấy toạ độ theo khung thì mọi số
   * đo lệch đi đúng bằng bề dày dải trống đó — người dùng khoanh vào đầu trang
   * mà ảnh cắt ra là phần giữa. Lỗi này KHÔNG lộ ra khi tỉ lệ ảnh tình cờ
   * trùng tỉ lệ khung, nên rất dễ tưởng là đã đúng.
   */
  const oAnh = () => oAnhRef.current?.getBoundingClientRect() ?? null;

  const keoBatDau = (e: React.MouseEvent<HTMLDivElement>) => {
    const o = oAnh();
    if (!o) return;
    dangKeo.current = {
      x: Math.max(0, Math.min(e.clientX - o.left, o.width)),
      y: Math.max(0, Math.min(e.clientY - o.top, o.height)),
    };
    datKhung(null);
  };
  const keoToi = (e: React.MouseEvent<HTMLDivElement>) => {
    const bd = dangKeo.current;
    const o = oAnh();
    if (!bd || !o) return;
    const x = Math.max(0, Math.min(e.clientX - o.left, o.width));
    const y = Math.max(0, Math.min(e.clientY - o.top, o.height));
    // `Math.abs` + `Math.min`: kéo NGƯỢC (từ dưới-phải lên trên-trái) phải ra
    // cùng một khung. Thiếu nó thì chiều rộng âm và khung biến mất.
    datKhung({ x: Math.min(bd.x, x), y: Math.min(bd.y, y), w: Math.abs(x - bd.x), h: Math.abs(y - bd.y) });
  };
  const keoXong = () => {
    dangKeo.current = null;
    datKhung((k) => (k && k.w >= KHUNG_TOI_THIEU && k.h >= KHUNG_TOI_THIEU ? k : null));
  };

  const chuaCapQuyen = quyen === 'denied' || quyen === 'not-determined' || quyen === 'restricted';

  return (
    <div className="ct-chup-phu" role="dialog" aria-modal="true" aria-label={dich('Chụp màn hình')}>
      <div className="ct-chup-hop">
        <header className="ct-chup-dau">
          <Camera size={16} aria-hidden />
          <strong>{anh ? dich('Kéo để chọn vùng cần gửi') : dich('Chọn màn hình hoặc cửa sổ để chụp')}</strong>
          <button type="button" className="ct-chup-x" onClick={onDong} aria-label={dich('Đóng')}>
            <X size={16} aria-hidden />
          </button>
        </header>

        {loi && <p className="ct-chup-loi">{loi}</p>}

        {chuaCapQuyen && !anh && (
          <div className="ct-chup-quyen">
            <p>{dich('macOS chưa cho app quyền Ghi màn hình — ảnh chụp ra sẽ trắng trơn.')}</p>
            <button
              type="button"
              className="ct-btn ct-btn-ghost"
              onClick={() => void window.cuongthai?.manHinh.moCaiDatQuyen()}
            >
              {dich('Mở cài đặt quyền')}
            </button>
            <span className="ct-chup-nho">{dich('Cấp quyền xong phải mở lại app.')}</span>
          </div>
        )}

        {!anh && (
          <div className="ct-chup-luoi">
            {dsNguon === null && <Loader2 className="ct-spin" size={20} aria-hidden />}
            {dsNguon?.length === 0 && <p className="ct-chup-nho">{dich('Không thấy màn hình nào.')}</p>}
            {dsNguon?.map((n) => (
              <button
                key={n.id}
                type="button"
                className="ct-chup-the"
                onClick={() => void chup(n.id)}
                disabled={dangChup}
                title={n.ten}
              >
                {n.anhNho
                  ? <img src={n.anhNho} alt="" />
                  : <span className="ct-chup-trong"><Monitor size={20} aria-hidden /></span>}
                <span className="ct-chup-ten">{n.ten}</span>
              </button>
            ))}
            {dangChup && (
              <div className="ct-chup-dang">
                <Loader2 className="ct-spin" size={18} aria-hidden /> {dich('Đang chụp…')}
              </div>
            )}
          </div>
        )}

        {anh && (
          <>
            {/* Khoanh vùng bằng chuột là đường TẮT, không phải đường duy nhất:
                người dùng bàn phím vẫn "Dùng cả ảnh" được, và Esc luôn đóng. */}
            <div
              className="ct-chup-khungAnh"
              onMouseDown={keoBatDau}
              onMouseMove={keoToi}
              onMouseUp={keoXong}
              onMouseLeave={keoXong}
            >
              {/* Thẻ bọc CO SÁT tấm ảnh, nên khung chọn (định vị tuyệt đối bên
                  trong nó) trùng đúng hệ toạ độ mà `keoToi` vừa đo. */}
              <span className="ct-chup-neo">
                <img ref={oAnhRef} src={anh.url} alt={dich('Ảnh vừa chụp')} draggable={false} />
                {khung && (
                  <div
                    className="ct-chup-vung"
                    style={{ left: khung.x, top: khung.y, width: khung.w, height: khung.h }}
                  />
                )}
              </span>
            </div>
            <footer className="ct-chup-chan">
              <span className="ct-chup-nho">
                {khung
                  ? `${Math.round(khung.w)}×${Math.round(khung.h)} ${dich('điểm ảnh hiển thị')}`
                  : `${anh.rong}×${anh.cao} ${dich('điểm ảnh')}`}
              </span>
              <button type="button" className="ct-btn ct-btn-ghost" onClick={() => { datAnh(null); datKhung(null); }}>
                <RotateCcw size={14} aria-hidden /> {dich('Chụp lại')}
              </button>
              {khung && (
                <button type="button" className="ct-btn ct-btn-ghost" onClick={() => datKhung(null)}>
                  {dich('Bỏ khung')}
                </button>
              )}
              <button type="button" className="ct-btn ct-btn-chinh" onClick={() => void dung(!!khung)}>
                {khung ? <Crop size={14} aria-hidden /> : <Check size={14} aria-hidden />}
                {khung ? dich('Cắt & gửi') : dich('Dùng cả ảnh')}
              </button>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}

export function NutChupManHinh({ onBam, khoa }: { onBam: () => void; khoa: boolean }) {
  const { dich } = useDich();
  return (
    <button
      type="button"
      className="ct-agent-icon"
      onClick={onBam}
      disabled={khoa}
      title={dich('Chụp màn hình rồi cắt vùng cần gửi')}
      aria-label={dich('Chụp màn hình')}
    >
      <Camera size={15} aria-hidden />
    </button>
  );
}
