/**
 * ============================================================
 * ĐÍNH KÈM — ảnh và tài liệu cho chế độ Trò chuyện
 * ============================================================
 *
 * Ba đường vào, vì người ta quen ba kiểu khác nhau: DÁN (chụp màn hình rồi
 * ⌘V), KÉO THẢ (từ Finder), và BẤM NÚT. Thiếu đường nào thì một nhóm người
 * dùng tưởng app không làm được.
 *
 * ─── TRẦN PHẢI KHỚP MÁY CHỦ, VÀ PHẢI BÁO NGAY ───
 * Máy chủ nhận tối đa 4 ảnh (≤4MB mỗi cái) và 3 tài liệu (≤6MB). Chặn ở đây
 * KHÔNG phải để thay máy chủ kiểm — máy chủ vẫn kiểm — mà để người dùng biết
 * NGAY tại chỗ. Gửi đi rồi mới nhận 400 nghĩa là họ đã chờ, và thông báo lỗi
 * đến từ một tầng không biết họ vừa thả file nào.
 *
 * File bị từ chối luôn NÓI RA TÊN VÀ LÝ DO. Im lặng bỏ qua là kiểu hỏng tệ
 * nhất: người dùng thấy 3 file kéo vào, 2 file hiện lên, và không ai nói gì.
 */
import { useCallback, useRef, useState } from 'react';
import { FileText, ImageIcon, Paperclip, X } from 'lucide-react';

export interface TepDinhKem {
  /** `image` đi vào trường `images`, `tailieu` đi vào `documents`. */
  loai: 'image' | 'tailieu';
  ten: string;
  mime: string;
  /** data URL đầy đủ — máy chủ tự tách phần base64. */
  url: string;
  /** Byte đã giải mã, để hiện cho người dùng. */
  bytes: number;
}

/** Khớp `ALLOWED_IMAGE_TYPES` / `MAX_CHAT_IMAGES` ở `src/routes/ai.routes.ts`. */
const ANH_MIME = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif']);
const MAX_ANH = 4;
const MAX_ANH_BYTES = 4 * 1024 * 1024;

/** Khớp `ALLOWED_DOC_TYPES` / `MAX_CHAT_DOCS`. */
const TAILIEU_MIME = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/markdown',
  'text/csv',
]);
const MAX_TAILIEU = 3;
const MAX_TAILIEU_BYTES = 6 * 1024 * 1024;

/**
 * Đoán MIME khi hệ điều hành không nói.
 *
 * ⚠️ `File.type` RỖNG là chuyện thường, không phải ngoại lệ hiếm: đã gặp thật
 * với ảnh `.HEIC` trên Chrome, và `.md` gần như luôn rỗng vì không hệ nào đăng
 * ký `text/markdown`. Tin vào `file.type` thôi là từ chối nhầm những file hoàn
 * toàn hợp lệ, và người dùng không hiểu vì sao.
 */
function doanMime(f: File): string {
  if (f.type) return f.type;
  const duoi = f.name.toLowerCase().split('.').pop() ?? '';
  const bang: Record<string, string> = {
    png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif',
    pdf: 'application/pdf',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    txt: 'text/plain', md: 'text/markdown', markdown: 'text/markdown', csv: 'text/csv',
  };
  return bang[duoi] ?? '';
}

export function coChu(bytes: number): string {
  return bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/**
 * Nhận `File[]` → `TepDinhKem[]`, kèm danh sách lý do từ chối.
 *
 * Nhận vào MẢNG đã vật chất hoá, không nhận `FileList`.
 * ⚠️ `input.files` và `clipboardData.items` là danh sách SỐNG: trình duyệt dọn
 * chúng ngay sau khi handler chạy xong, mà React 18 lại HOÃN hàm cập nhật —
 * đọc chúng bên trong `setState(cu => …)` cho ra danh sách RỖNG. Đã dính đúng
 * lỗi này ở chỗ khác trong dự án. Phải `[...files]` ngay tại handler.
 */
export function locTep(
  ds: File[],
  daCo: TepDinhKem[],
): Promise<{ nhan: TepDinhKem[]; boQua: string[] }> {
  const boQua: string[] = [];
  let soAnh = daCo.filter((t) => t.loai === 'image').length;
  let soTai = daCo.filter((t) => t.loai === 'tailieu').length;

  const viec = ds.map(async (f): Promise<TepDinhKem | null> => {
    const mime = doanMime(f);
    const laAnh = ANH_MIME.has(mime);
    const laTai = TAILIEU_MIME.has(mime);

    if (!laAnh && !laTai) {
      boQua.push(`${f.name}: định dạng không nhận (chỉ ảnh PNG/JPG/WebP/GIF, và PDF/Word/txt/md/csv)`);
      return null;
    }
    if (laAnh && soAnh >= MAX_ANH) { boQua.push(`${f.name}: quá ${MAX_ANH} ảnh`); return null; }
    if (laTai && soTai >= MAX_TAILIEU) { boQua.push(`${f.name}: quá ${MAX_TAILIEU} tài liệu`); return null; }

    const tran = laAnh ? MAX_ANH_BYTES : MAX_TAILIEU_BYTES;
    if (f.size > tran) {
      boQua.push(`${f.name}: nặng ${coChu(f.size)}, trần là ${coChu(tran)}`);
      return null;
    }

    if (laAnh) soAnh++; else soTai++;
    const url = await new Promise<string>((xong, hong) => {
      const doc = new FileReader();
      doc.onload = () => xong(String(doc.result ?? ''));
      doc.onerror = () => hong(new Error('đọc file hỏng'));
      doc.readAsDataURL(f);
    }).catch(() => '');

    if (!url.startsWith('data:')) { boQua.push(`${f.name}: không đọc được`); return null; }
    return { loai: laAnh ? 'image' : 'tailieu', ten: f.name, mime, url, bytes: f.size };
  });

  return Promise.all(viec).then((r) => ({ nhan: r.filter((x): x is TepDinhKem => x !== null), boQua }));
}

/** Hook gom trạng thái đính kèm + ba đường vào. */
export function useDinhKem() {
  const [tep, datTep] = useState<TepDinhKem[]>([]);
  const [loi, datLoi] = useState<string | null>(null);
  const [dangKeo, datDangKeo] = useState(false);
  const oFileRef = useRef<HTMLInputElement>(null);

  const them = useCallback(async (ds: File[]) => {
    if (!ds.length) return;
    // Đọc `tep` qua hàm cập nhật thì không lấy được giá trị ra ngoài, nên dùng
    // một biến trung gian: `locTep` cần biết đã có bao nhiêu để tính trần.
    let hienCo: TepDinhKem[] = [];
    datTep((cu) => { hienCo = cu; return cu; });
    const { nhan, boQua } = await locTep(ds, hienCo);
    if (nhan.length) datTep((cu) => [...cu, ...nhan]);
    datLoi(boQua.length ? boQua.join(' · ') : null);
  }, []);

  const bo = useCallback((i: number) => {
    datTep((cu) => cu.filter((_, k) => k !== i));
  }, []);

  const xoaHet = useCallback(() => { datTep([]); datLoi(null); }, []);

  /** Dán. Chỉ chặn sự kiện khi thật sự có file — dán chữ phải chạy như thường. */
  const danVao = useCallback((e: React.ClipboardEvent) => {
    const ds = [...(e.clipboardData?.items ?? [])]
      .filter((i) => i.kind === 'file')
      .map((i) => i.getAsFile())
      .filter((f): f is File => !!f);
    if (!ds.length) return;
    e.preventDefault();
    void them(ds);
  }, [them]);

  const thaVao = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    datDangKeo(false);
    void them([...(e.dataTransfer?.files ?? [])]);
  }, [them]);

  const keoVao = useCallback((e: React.DragEvent) => {
    // Chỉ bật khi con trỏ đang mang FILE. Kéo một đoạn chữ trong trang cũng
    // bắn `dragover`, và làm cả khung sáng lên vì thế thì trông như hỏng.
    if (!e.dataTransfer?.types?.includes('Files')) return;
    e.preventDefault();
    datDangKeo(true);
  }, []);

  const keoRa = useCallback(() => datDangKeo(false), []);

  const moChonTep = useCallback(() => oFileRef.current?.click(), []);

  const nhanTuO = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // `[...]` NGAY tại đây — xem ghi chú ở `locTep`.
    const ds = [...(e.target.files ?? [])];
    e.target.value = ''; // chọn lại đúng file đó lần nữa vẫn phải bắn sự kiện
    void them(ds);
  }, [them]);

  return { tep, loi, datLoi, dangKeo, oFileRef, them, bo, xoaHet, danVao, thaVao, keoVao, keoRa, moChonTep, nhanTuO };
}

/** Ô ẩn để bấm nút mở hộp thoại chọn file của hệ điều hành. */
export function ODinhKem({
  oFileRef, nhanTuO,
}: {
  oFileRef: React.RefObject<HTMLInputElement>;
  nhanTuO: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <input
      ref={oFileRef}
      type="file"
      multiple
      hidden
      accept=".png,.jpg,.jpeg,.webp,.gif,.pdf,.docx,.txt,.md,.csv,image/*,application/pdf"
      onChange={nhanTuO}
    />
  );
}

export function NutDinhKem({
  onBam, khoa, khongPro,
}: { onBam: () => void; khoa: boolean; khongPro?: boolean }) {
  return (
    <button
      type="button"
      className="ct-agent-icon"
      data-nut="dinhKem"
      onClick={onBam}
      disabled={khoa}
      title={khongPro
        ? 'Đính kèm ảnh và tài liệu cần tài khoản Pro — máy chủ chỉ đọc file ở bậc Pro/Max'
        : 'Đính kèm ảnh hoặc tài liệu (kéo thả và dán cũng được)'}
    >
      <Paperclip size={15} aria-hidden />
    </button>
  );
}

/** Dải xem trước phía trên ô soạn. */
export function DaiDinhKem({ tep, bo }: { tep: TepDinhKem[]; bo: (i: number) => void }) {
  if (!tep.length) return null;
  return (
    <div className="ct-dk-dai">
      {tep.map((t, i) => (
        <div key={i} className="ct-dk-o" data-loai={t.loai}>
          {t.loai === 'image' ? (
            <img src={t.url} alt={t.ten} className="ct-dk-anh" />
          ) : (
            <div className="ct-dk-tai">
              <FileText size={15} aria-hidden />
              <div className="ct-dk-tai-chu">
                <span className="ct-dk-ten">{t.ten}</span>
                <span className="ct-dk-co">{coChu(t.bytes)}</span>
              </div>
            </div>
          )}
          <button type="button" className="ct-dk-bo" onClick={() => bo(i)} aria-label={`Bỏ ${t.ten}`}>
            <X size={11} aria-hidden />
          </button>
        </div>
      ))}
    </div>
  );
}

/** Đính kèm hiện lại TRONG bong bóng của người dùng, sau khi đã gửi. */
export function DinhKemDaGui({ tep }: { tep: TepDinhKem[] }) {
  if (!tep.length) return null;
  return (
    <div className="ct-dk-dagui">
      {tep.map((t, i) => (t.loai === 'image' ? (
        <img key={i} src={t.url} alt={t.ten} className="ct-dk-dagui-anh" />
      ) : (
        <span key={i} className="ct-dk-dagui-tai">
          <FileText size={12} aria-hidden />
          {t.ten}
        </span>
      )))}
    </div>
  );
}

export { ImageIcon };
