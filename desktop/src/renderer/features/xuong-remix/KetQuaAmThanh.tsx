/**
 * Khâu cuối của Xưởng Remix: NGHE THỬ và ĐẨY LÊN BÀN DJ.
 *
 * Trước khối này, mọi thứ xưởng làm ra đều kết thúc bằng một đường dẫn tệp —
 * người dùng phải mở thư mục, tìm tệp, mở bằng phần mềm khác để biết nó nghe
 * ra sao. Mà "nghe ra sao" mới là câu hỏi duy nhất đáng hỏi sau khi trộn.
 *
 * ─── Vì sao ĐẨY LÊN MÁY CHỦ chứ không nạp thẳng vào bàn DJ ───
 * `RemixDeck` nạp nhạc bằng `fetch` tới `/music/stream/:id` rồi
 * `decodeAudioData`. Nó không có đường nào nhận một tệp nằm trên đĩa máy
 * người dùng, và mở một đường như thế nghĩa là dựng thêm một dạng "bài hát"
 * thứ hai (không có id, không có trong danh sách, không lưu lại sau khi tắt
 * app) chạy song song với dạng đã có. Đẩy lên kho Remix thì bài xuất hiện
 * đúng chỗ mọi bài khác xuất hiện: danh sách của bàn DJ, trang Nhạc, và nó
 * còn đó ở lần mở app sau.
 *
 * ─── Vì sao dùng XMLHttpRequest chứ không `fetch` ───
 * Cùng lý do `TaiNhacLen.tsx` đã ghi: chỉ XHR có `upload.onprogress`. Một bản
 * trộn 5 phút là ~53 MB, và không có thanh tiến độ thì người dùng nhìn màn
 * hình đứng im rồi bấm lại lần nữa.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Download, Headphones, Loader2, Upload } from 'lucide-react';
import { useSession } from '../../auth/session';
import { useAppState } from '../../app-state';
import { useDich } from '../../i18n';
import { tachTen } from '../music/TaiNhacLen';
import { ChonChatLuong } from './ChonChatLuong';
import { CHON_XUAT_MAC_DINH, timChonXuat } from '../../../shared/dinhDangXuat';
import type { KetQuaXuatTep } from '../../../shared/ipc';

interface Props {
  /** Đường dẫn tệp kết quả trên đĩa. Main kiểm lại nó nằm trong thư mục phiên. */
  duong: string;
  /** Nhịp và tông đã đo — ghép vào tên bài, đúng cách người chơi nhạc đặt tên. */
  bpm?: number | undefined;
  camelot?: string | undefined;
}

/**
 * Tên gợi ý cho bản đẩy lên.
 *
 * Nhịp và tông nằm NGAY TRONG TÊN vì đó là cách người chơi nhạc đặt tên thật:
 * lúc đứng trước bàn DJ, thứ cần biết để chọn bài tiếp theo là hai con số ấy,
 * và danh sách thả xuống của bàn DJ chỉ hiện mỗi tên bài.
 */
export function tenGoiY(tenTep: string, bpm?: number, camelot?: string): string {
  const goc = tenTep.replace(/\.[^.]+$/, '').trim();
  const them: string[] = [];
  if (bpm && bpm > 0) them.push(`${Math.round(bpm)} BPM`);
  if (camelot) them.push(camelot);
  return them.length ? `${goc} · ${them.join(' · ')}` : goc;
}

export function KetQuaAmThanh({ duong, bpm, camelot }: Props) {
  const { dich } = useDich();
  const { api } = useSession();
  const { navigate } = useAppState();
  const cau = window.cuongthai;

  const [dangDoc, setDangDoc] = useState(false);
  const [nghe, setNghe] = useState<string | null>(null);
  const [tep, setTep] = useState<File | null>(null);
  const [ten, setTen] = useState('');
  const [giay, setGiay] = useState(0);
  const [phanTram, setPhanTram] = useState<number | null>(null);
  const [xong, setXong] = useState(false);
  const [loi, setLoi] = useState<string | null>(null);
  const [maCl, setMaCl] = useState(CHON_XUAT_MAC_DINH);
  const [dangXuat, setDangXuat] = useState(false);
  const [daXuat, setDaXuat] = useState<KetQuaXuatTep | null>(null);

  /* Blob 53 MB mỗi bản. Không thu hồi thì đổi thiết lập rồi trộn lại vài lượt
     là app giữ vài trăm MB không bao giờ trả lại — và người dùng chỉ thấy
     "app càng dùng càng nặng". */
  const nheRef = useRef<string | null>(null);
  useEffect(() => {
    nheRef.current = nghe;
  }, [nghe]);
  useEffect(() => () => { if (nheRef.current) URL.revokeObjectURL(nheRef.current); }, []);

  /* Tệp đổi (trộn lại với thiết lập khác) thì mọi thứ của tệp cũ phải đi theo:
     giữ lại bản nghe cũ là người dùng nghe bản CŨ rồi kết luận về bản MỚI. */
  useEffect(() => {
    setNghe((cu) => { if (cu) URL.revokeObjectURL(cu); return null; });
    setTep(null);
    setXong(false);
    setLoi(null);
    setDaXuat(null);
    /* `maCl` nằm trong danh sách phụ thuộc vì tệp đã đọc mang ĐỊNH DẠNG CŨ.
       Giữ lại thì người dùng đổi sang MP3 320 rồi bấm Đẩy lên, và bản lên
       máy chủ vẫn là WAV — im lặng, đúng thứ họ vừa cố đổi. */
  }, [duong, maCl]);

  const doc = useCallback(async (): Promise<File | null> => {
    if (tep) return tep;
    if (!cau) return null;
    setDangDoc(true);
    setLoi(null);
    try {
      const bg = await cau.xuongRemix.banGiao(duong, timChonXuat(maCl).cai);
      /* `slice()` để lấy đúng một ArrayBuffer riêng: mảng qua cầu IPC có thể
         là khung nhìn lên một bộ đệm lớn hơn, và đưa thẳng vào Blob thì kèm
         theo cả phần thừa. */
      const f = new File([bg.byte.slice().buffer], bg.ten, { type: bg.mime });
      setTep(f);
      setGiay(bg.giay);
      setTen(tenGoiY(bg.ten, bpm, camelot));
      return f;
    } catch (e) {
      setLoi((e as Error).message);
      return null;
    } finally {
      setDangDoc(false);
    }
  }, [cau, duong, tep, bpm, camelot, maCl]);

  const batNghe = useCallback(async () => {
    const f = await doc();
    if (!f) return;
    setNghe((cu) => { if (cu) URL.revokeObjectURL(cu); return URL.createObjectURL(f); });
  }, [doc]);

  const day = useCallback(async () => {
    const f = await doc();
    if (!f || !api) { if (!api) setLoi(dich('Cần đăng nhập để đẩy bài lên.')); return; }

    const { artist } = tachTen(f.name);
    const tieuDe = ten.trim() || f.name;
    setLoi(null);
    setPhanTram(0);
    try {
      await new Promise<void>((ok, hong) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${api.baseUrlForForms()}/api/v1/music/tracks`);
        for (const [k, v] of Object.entries(api.authHeaders())) xhr.setRequestHeader(k, v);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setPhanTram(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) { ok(); return; }
          let td = `${dich('Máy chủ trả về')} ${xhr.status}`;
          try {
            const than = JSON.parse(xhr.responseText) as { message?: string };
            if (than.message) td = than.message;
          } catch { /* thân không phải JSON — giữ thông báo theo mã lỗi */ }
          hong(new Error(td));
        };
        xhr.onerror = () => hong(new Error(dich('Mất kết nối khi đang đẩy lên.')));

        const form = new FormData();
        form.append('audio', f);
        form.append('title', tieuDe);
        form.append('artist', artist);
        /* REMIX chứ không NORMAL: đó là kho mà bàn DJ đọc. Đẩy vào thư viện
           thường thì bài lên máy chủ nhưng KHÔNG hiện trong danh sách của
           bàn DJ, và người dùng sẽ tưởng lượt đẩy hỏng. */
        form.append('category', 'REMIX');
        if (giay > 0) form.append('durationSeconds', String(Math.round(giay)));
        xhr.send(form);
      });
      setXong(true);
    } catch (e) {
      setLoi((e as Error).message);
    } finally {
      setPhanTram(null);
    }
  }, [doc, api, ten, giay, dich]);

  /**
   * Ghi ra đĩa, cạnh bản gốc.
   *
   * Không đi qua `doc()`: `doc()` kéo cả tệp qua cầu IPC về renderer để nghe
   * và để đẩy lên, mà ở đây tệp chỉ cần đi từ đĩa ra đĩa. Với FLAC 24-bit của
   * một bài 5 phút thì đó là 60 MB không có lý do gì phải chạy qua renderer.
   */
  const xuat = useCallback(async () => {
    if (!cau) return;
    setDangXuat(true);
    setLoi(null);
    try {
      setDaXuat(await cau.xuongRemix.xuatTep(duong, timChonXuat(maCl).cai));
    } catch (e) {
      setLoi((e as Error).message);
    } finally {
      setDangXuat(false);
    }
  }, [cau, duong, maCl]);

  const dangChay = dangDoc || dangXuat || phanTram !== null;

  return (
    <div className="ct-xr-giao">
      <ChonChatLuong ma={maCl} onChon={setMaCl} giay={giay || undefined} tat={dangChay} />

      <div className="ct-xr-dieu-khien">
        <button type="button" className="ct-btn ct-btn-ghost" disabled={dangChay} onClick={() => void batNghe()}>
          {dangDoc ? <Loader2 size={14} className="ct-xoay" aria-hidden /> : <Headphones size={14} aria-hidden />}
          {dich('Nghe thử')}
        </button>
        <button type="button" className="ct-btn" disabled={dangChay} onClick={() => void day()}>
          {phanTram !== null ? <Loader2 size={14} className="ct-xoay" aria-hidden /> : <Upload size={14} aria-hidden />}
          {phanTram !== null ? `${dich('Đang đẩy lên…')} ${phanTram}%` : dich('Đẩy lên bàn DJ')}
        </button>
        <button type="button" className="ct-btn ct-btn-ghost" disabled={dangChay} onClick={() => void xuat()}>
          {dangXuat ? <Loader2 size={14} className="ct-xoay" aria-hidden /> : <Download size={14} aria-hidden />}
          {dich('Xuất tệp')}
        </button>
      </div>

      {daXuat && (
        <p className="ct-xr-ngo" data-tone="ok">
          ✓ {dich('Đã ghi')} <b>{daXuat.ten}</b>{' '}
          <span className="ct-muted">
            {daXuat.moTa} · {(daXuat.byte / 1e6).toFixed(1)} MB · {daXuat.giay.toFixed(1)}s
          </span>{' '}
          <button type="button" className="ct-linklike"
            onClick={() => void cau?.xuongRemix.moThuMuc(daXuat.duong)}>
            {dich('Mở thư mục')}
          </button>
        </p>
      )}

      {nghe && (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <audio className="ct-xr-nghe" src={nghe} controls preload="metadata" />
      )}

      {tep && (
        <label className="ct-xr-o-nhap ct-xr-giao-ten">
          <span>{dich('Tên bài khi lên bàn DJ')}</span>
          <input type="text" value={ten} maxLength={200}
            onChange={(e) => { setTen(e.target.value); setXong(false); }} />
        </label>
      )}

      {xong && (
        <p className="ct-xr-ngo" data-tone="ok">
          ✓ {dich('Đã lên kho Remix. Mở trang Nhạc rồi chọn bài này ở danh sách của bàn DJ.')}{' '}
          <button type="button" className="ct-linklike" onClick={() => navigate('/music')}>
            {dich('Mở trang Nhạc')}
          </button>
        </p>
      )}

      {loi && <p className="ct-xr-ngo" data-tone="loi">{loi}</p>}
    </div>
  );
}
