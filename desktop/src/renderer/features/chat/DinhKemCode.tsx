/**
 * ============================================================
 * ĐÍNH KÈM CHO AI CODE — hai đường, tuỳ file
 * ============================================================
 *
 * Khác hẳn `DinhKem.tsx` của chế độ Trò chuyện, và khác vì đường gửi khác:
 *
 *   • **Ảnh nhỏ** (≤4MB, tối đa 3) → gửi THẲNG trong lượt, model nhìn thấy
 *     ngay. Bắt agent gọi thêm một lượt tool chỉ để mở cái ảnh vừa dán thì
 *     vừa chậm vừa tốn thêm một vòng gọi cổng.
 *   • **Mọi thứ còn lại** (PDF, log, zip, ảnh thứ tư, ảnh 30MB) → đặt vào
 *     `.cuongthai/dinh-kem/` trong dự án, rồi chèn ĐƯỜNG DẪN vào câu hỏi.
 *     Agent tự `read_file` phần nó cần — không dính trần của cổng, và không
 *     nhồi cả file vào mỗi lượt gọi (hội thoại được gửi lại trọn vẹn mỗi
 *     bước, nên một file 20MB nằm trong đó là trả tiền cho nó hàng chục lần).
 *
 * Người dùng không cần biết luật này; mỗi thẻ file tự nói nó đi đường nào.
 */
import { useCallback, useRef, useState } from 'react';
import { FileText, ImageIcon, Loader2, Paperclip, X } from 'lucide-react';
import { useT } from '../../i18n';

/** Trần của cổng cho ảnh gửi thẳng. Trên mức này thì rơi xuống đường đĩa. */
const TRAN_ANH_BYTE = 4 * 1024 * 1024;
/**
 * Trần số ảnh gửi thẳng trong một lượt.
 *
 * 3 → 8 (09/09/2026, người dùng yêu cầu). Được, vì từ bản trước mọi ảnh đều
 * ĐƯỢC CHUẨN HOÁ về cạnh dài 1568px trước khi gửi, nên 8 ảnh ≈ 6MB chứ không
 * phải 8 × 5,6MB = 45MB như nếu để nguyên bản gốc.
 *
 * ⚠️ CÁI GIÁ LÀ TIỀN, và nó nhân lên: một ảnh 1568px ≈ 1.600 token, 8 ảnh ≈
 * 13k token — mà vòng lặp agent GỬI LẠI TOÀN BỘ hội thoại ở MỖI bước. Một
 * việc 10 bước với 8 ảnh là ~130k token ảnh. Nhãn dưới ô đính kèm nói thẳng
 * điều này; đừng nâng tiếp mà không đo lại.
 */
const MAX_ANH_THANG = 8;
const LOAI_ANH = /^image\/(png|jpeg|webp|gif)$/;

export interface TepCode {
  id: string;
  ten: string;
  byte: number;
  /** `true` = gửi thẳng trong lượt · `false` = nằm trên đĩa, agent tự đọc. */
  guiThang: boolean;
  /** Chỉ có khi `guiThang`. */
  dataUrl?: string;
  /** Chỉ có khi đã đặt lên đĩa xong. */
  tuongDoi?: string;
  /** Kéo cả một THƯ MỤC vào — agent dùng `list_dir`/`grep` chứ không `read_file`. */
  laThuMuc?: boolean;
  dangTai?: boolean;
  loi?: string;
}

let dem = 0;

export function coChu(byte: number): string {
  if (byte < 1024) return `${byte} B`;
  if (byte < 1024 * 1024) return `${Math.round(byte / 1024)} KB`;
  return `${(byte / 1048576).toFixed(1)} MB`;
}

function docFile(f: File, kieu: 'dataUrl' | 'base64'): Promise<string> {
  return new Promise((giai, tuChoi) => {
    const d = new FileReader();
    d.onerror = () => tuChoi(new Error('Không đọc được file.'));
    d.onload = () => {
      const s = String(d.result ?? '');
      // `readAsDataURL` trả `data:<mime>;base64,<phần thân>`. Đường đĩa chỉ
      // cần phần thân — cắt ở dấu phẩy ĐẦU TIÊN, vì base64 không chứa dấu phẩy.
      giai(kieu === 'dataUrl' ? s : s.slice(s.indexOf(',') + 1));
    };
    d.readAsDataURL(f);
  });
}

/**
 * Thu nhỏ ảnh QUÁ TO để nó vẫn đi được đường gửi thẳng.
 *
 * ⚠️ Vì sao cần: ảnh vượt `TRAN_ANH_BYTE` rơi xuống đường ĐĨA, mà ở đó
 * `read_file` có trần RIÊNG 1,4MB và trả về "ảnh quá lớn, thu nhỏ bằng
 * run_command" — trong khi chế độ mặc định (`keHoach`) KHÔNG có `run_command`.
 * Ngõ cụt. Và nó cắn Windows nặng nhất: PrintScreen chụp NGUYÊN màn hình ở độ
 * phân giải thật, nên ảnh 4K thường 4-8MB, còn Cmd+Shift+4 của macOS chỉ cắt
 * một vùng.
 *
 * 1568px là cạnh dài Anthropic co ảnh về trước khi đọc — gửi to hơn chỉ tốn
 * token chứ không nét thêm.
 */
const CANH_DAI = 1568;

/** Số byte THẬT của ảnh trong một data URL (base64 phình 4/3). */
function byteCuaDataUrl(url: string): number {
  const than = url.slice(url.indexOf(',') + 1);
  const dem = (than.endsWith('==') ? 2 : than.endsWith('=') ? 1 : 0);
  return Math.max(0, Math.floor((than.length * 3) / 4) - dem);
}

/** Cạnh dài có vượt mức model co về không. Đọc kích thước, không giải mã cả ảnh. */
async function quaTo(f: File): Promise<boolean> {
  try {
    const bm = await createImageBitmap(f);
    const to = Math.max(bm.width, bm.height) > CANH_DAI;
    bm.close();
    return to;
  } catch {
    return false;   // không đọc được kích thước ⇒ cứ gửi nguyên, đừng chặn
  }
}

async function thuNhoAnh(f: File): Promise<string> {
  const bm = await createImageBitmap(f);
  try {
    for (let canh = CANH_DAI, lan = 0; lan < 4; lan += 1, canh = Math.round(canh * 0.7)) {
      const ti = Math.min(1, canh / Math.max(bm.width, bm.height));
      const cv = new OffscreenCanvas(Math.max(1, Math.round(bm.width * ti)), Math.max(1, Math.round(bm.height * ti)));
      const ctx = cv.getContext('2d');
      if (!ctx) throw new Error('Không dựng được canvas để thu nhỏ ảnh.');
      // Nền TRẮNG trước: JPEG không có kênh trong suốt, thiếu bước này thì
      // mọi vùng trong suốt của PNG thành ĐEN và ảnh đọc ra khác hẳn bản gốc.
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.drawImage(bm, 0, 0, cv.width, cv.height);
      const blob = await cv.convertToBlob({ type: 'image/jpeg', quality: 0.85 });
      // So trên KÍCH THƯỚC CHUỖI base64 (phình ~4/3), vì trần ở máy chủ đo
      // chính chuỗi đó chứ không đo byte gốc.
      const url = await docFile(new File([blob], 'anh.jpg', { type: 'image/jpeg' }), 'dataUrl');
      if (url.length <= TRAN_ANH_BYTE) return url;
    }
    throw new Error('Ảnh quá lớn, thu nhỏ không đủ.');
  } finally {
    bm.close();
  }
}

export function useDinhKemCode(cuocId: string) {
  const [tep, datTep] = useState<TepCode[]>([]);
  const [dangKeo, datDangKeo] = useState(false);
  const oFileRef = useRef<HTMLInputElement>(null);
  /* Đếm lần vào/ra: kéo qua một phần tử con cũng bắn `dragleave`, nên nếu chỉ
     bật/tắt theo sự kiện thì lớp phủ nhấp nháy suốt lúc rê chuột. */
  const demKeo = useRef(0);

  /*
   * Đếm ảnh-gửi-thẳng bằng REF, không đọc từ state trong updater.
   *
   * Bản đầu tính `guiThang` ngay trong `datTep(cu => …)`. Hai chỗ sai: updater
   * phải THUẦN (React StrictMode gọi nó hai lần, nên bộ đếm nhảy gấp đôi), và
   * thả 5 ảnh cùng lúc thì cả 5 chạy song song, không cái nào thấy quyết định
   * của cái kia. Ref thì đọc-ghi đồng bộ, ngay tại chỗ.
   */
  const soAnhThang = useRef(0);

  const them = useCallback(async (ds: File[]) => {
    await Promise.all(ds.map(async (f) => {
      const id = `t${++dem}`;

      /*
       * ĐƯỜNG DẪN THẬT TRƯỚC, ĐỌC BYTE SAU.
       *
       * File kéo từ Finder/Explorer có đường dẫn thật; lấy được nó thì main
       * đọc thẳng từ đĩa, và ba thứ tự nhiên đúng theo:
       *   • THƯ MỤC kéo vào được. `FileReader` luôn ném lỗi với thư mục, nên
       *     bản cũ thất bại CÂM — đúng thứ người dùng báo 20/08/2026.
       *   • File VỐN Ở TRONG dự án thì không bị chép thành bản sao trong
       *     `.cuongthai/dinh-kem/`. Bản cũ chép, rồi agent sửa BẢN SAO và
       *     người dùng không thấy dự án đổi gì.
       *   • File lớn không phải đi qua vòng đọc → base64 (+33%) → IPC, một
       *     chuyến làm đứng hình luồng giao diện.
       *
       * `null` = File không đến từ đĩa (ảnh kéo từ trang web, ảnh dán) ⇒ rơi
       * về đường cũ, vẫn chạy.
       */
      const duong = window.cuongthai?.duongCuaFile(f) ?? null;

      /* Ảnh nhỏ vẫn GỬI THẲNG kể cả khi có đường dẫn: bắt agent gọi thêm một
         lượt tool chỉ để nhìn cái ảnh vừa kéo vào là chậm hơn và đắt hơn.
         Thư mục thì `f.type` rỗng và `f.size` là 0 nên không lọt vào đây. */
      /* KHÔNG còn loại ảnh to ra khỏi đường gửi thẳng — `thuNhoAnh` lo phần
         đó. Trước đây ảnh >4MB rơi xuống đĩa và tắc hẳn ở trần 1,4MB của
         `read_file`. Thư mục thì `f.type` rỗng và `f.size` là 0 nên không lọt. */
      const guiThang = LOAI_ANH.test(f.type)
        && f.size > 0
        && soAnhThang.current < MAX_ANH_THANG;
      if (guiThang) soAnhThang.current += 1;

      /* `dangTai` bật cho CẢ ảnh gửi thẳng. Trước đây ảnh vào thẳng với
         `dangTai: false` vì "đọc file là tức thì" — nhưng `dataUrl` chỉ có ở
         nhịp sau, và ảnh to giờ còn phải thu nhỏ. Bấm Gửi trong khe đó thì
         `anhGuiThang` rỗng và ảnh biến mất KHÔNG một lời báo. Nút Gửi khoá
         theo đúng cờ này. */
      datTep((cu) => [...cu, { id, ten: f.name, byte: f.size, guiThang, dangTai: true }]);

      try {
        if (guiThang) {
          /*
           * LUÔN chuẩn hoá về 1568px, không chỉ khi vượt trần byte.
           *
           * Trước đây chỉ ảnh >4MB mới bị thu nhỏ, nên một ảnh 3,9MB đi
           * nguyên cỡ: tốn token theo DIỆN TÍCH mà model vẫn co nó về 1568px
           * ở đầu kia — trả tiền cho phần bị vứt đi. Với trần 8 ảnh thì đó là
           * tám lần trả thừa trong mỗi bước của vòng lặp.
           *
           * Ảnh vốn đã nhỏ hơn 1568px thì `thuNhoAnh` trả về ngay ở vòng đầu
           * (tỉ lệ bị kẹp ở 1) nên không phóng to, chỉ mã hoá lại.
           */
          const thang = await docFile(f, 'dataUrl');
          const canThu = thang.length > TRAN_ANH_BYTE || await quaTo(f);
          const url = canThu ? await thuNhoAnh(f) : thang;
          datTep((cu) => cu.map((t) => (t.id === id
            // Ảnh đã thu nhỏ thì hiện KÍCH THƯỚC MỚI, không phải cỡ gốc: thẻ
            // ghi "8.4 MB" cạnh một tấm đã co còn 300KB là nói sai với người
            // dùng về thứ thật sự được gửi đi.
            ? { ...t, dataUrl: url, byte: url === thang ? f.size : byteCuaDataUrl(url), dangTai: false }
            : t)));
          return;
        }

        if (duong) {
          const r = await window.cuongthai?.agent.themDuong(cuocId, duong);
          datTep((cu) => cu.map((t) => {
            if (t.id !== id) return t;
            if (!r || !r.ok) return { ...t, dangTai: false, loi: r?.loi ?? 'Không thêm được.' };
            return { ...t, dangTai: false, tuongDoi: r.tuongDoi, byte: r.byte, laThuMuc: r.laThuMuc };
          }));
          return;
        }

        const than = await docFile(f, 'base64');
        const r = await window.cuongthai?.agent.themDinhKem(cuocId, f.name, than);
        datTep((cu) => cu.map((t) => {
          if (t.id !== id) return t;
          if (!r || !r.ok) return { ...t, dangTai: false, loi: r?.loi ?? 'Không lưu được file.' };
          return { ...t, dangTai: false, tuongDoi: r.tuongDoi, byte: r.byte };
        }));
      } catch (e) {
        datTep((cu) => cu.map((t) => (t.id === id ? { ...t, dangTai: false, loi: (e as Error).message } : t)));
      }
    }));
  }, [cuocId]);

  const bo = useCallback((id: string) => {
    // Trả lại chỗ trong hạn 3 ảnh — bỏ rồi thêm lại vài lần mà không trả thì
    // hết suất gửi thẳng dù trên màn hình chẳng còn ảnh nào.
    //
    // Đọc `tep` TỪ CLOSURE, không đọc trong updater: updater phải thuần (xem
    // ghi chú ở `soAnhThang`), và `bo` luôn được gọi từ một event handler nên
    // `tep` ở đây là bản mới nhất đã vẽ.
    if (tep.find((t) => t.id === id)?.guiThang) {
      soAnhThang.current = Math.max(0, soAnhThang.current - 1);
    }
    // KHÔNG xoá file khỏi đĩa. Người dùng bỏ nó khỏi câu hỏi này, nhưng file
    // vẫn nằm trong dự án của họ — xoá đi là tự ý dọn thư mục của người khác.
    datTep((cu) => cu.filter((t) => t.id !== id));
  }, [tep]);

  const xoaHet = useCallback(() => { soAnhThang.current = 0; datTep([]); }, []);

  const moChonTep = useCallback(() => oFileRef.current?.click(), []);
  const nhanTuO = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    /* ⚠️ `e.target.files` là danh sách SỐNG — chụp thành mảng NGAY. React 18
       hoãn updater, và tới lúc nó chạy thì trình duyệt đã dọn danh sách, cho ra
       mảng rỗng. Đã dính đúng lỗi này ở `DinhKem.tsx`. */
    const ds = [...(e.target.files ?? [])];
    e.target.value = '';           // chọn lại đúng file đó lần nữa phải được
    if (ds.length) void them(ds);
  }, [them]);

  const keoVao = useCallback((e: React.DragEvent) => {
    if (![...(e.dataTransfer?.types ?? [])].includes('Files')) return;
    e.preventDefault();
    demKeo.current += 1;
    datDangKeo(true);
  }, []);
  const keoRa = useCallback(() => {
    demKeo.current = Math.max(0, demKeo.current - 1);
    if (demKeo.current === 0) datDangKeo(false);
  }, []);
  const keoTren = useCallback((e: React.DragEvent) => {
    if ([...(e.dataTransfer?.types ?? [])].includes('Files')) e.preventDefault();
  }, []);
  const thaVao = useCallback((e: React.DragEvent) => {
    const ds = [...(e.dataTransfer?.files ?? [])];
    if (!ds.length) return;
    e.preventDefault();
    demKeo.current = 0;
    datDangKeo(false);
    void them(ds);
  }, [them]);

  /**
   * Dán. Nhận MỌI loại file, không chỉ ảnh.
   *
   * `preventDefault` CHỈ khi thật sự có file — dán chữ phải hoạt động như
   * bình thường. `clipboardData.items` có cả file lẫn phiên bản chữ của cùng
   * một lần chép (chép từ Figma chẳng hạn), nên phải lọc theo `kind`.
   */
  const danVao = useCallback((e: React.ClipboardEvent) => {
    const ds = [...(e.clipboardData?.items ?? [])]
      .filter((i) => i.kind === 'file')
      .map((i) => i.getAsFile())
      .filter((f): f is File => !!f);
    if (!ds.length) return;
    e.preventDefault();
    void them(ds);
  }, [them]);

  /** Ảnh gửi thẳng trong lượt này. */
  const anhGuiThang = tep.filter((t) => t.guiThang && t.dataUrl).map((t) => t.dataUrl!);
  /** Đường dẫn các file đã nằm trên đĩa — chèn vào câu hỏi cho agent. */
  const duongDanTrenDia = tep.filter((t) => t.tuongDoi).map((t) => t.tuongDoi!);
  const dangTai = tep.some((t) => t.dangTai);

  return {
    tep, bo, xoaHet, dangKeo, oFileRef, moChonTep, nhanTuO,
    keoVao, keoRa, keoTren, thaVao, danVao,
    anhGuiThang, duongDanTrenDia, dangTai,
  };
}

export function NutChonTep({ onBam, khoa }: { onBam: () => void; khoa: boolean }) {
  const { t } = useT();
  return (
    <button
      type="button"
      className="ct-agent-icon"
      onClick={onBam}
      disabled={khoa}
      title={t('Đính kèm file — ảnh, PDF, log, gì cũng được')}
      aria-label={t('Đính kèm file')}
    >
      <Paperclip size={15} aria-hidden />
    </button>
  );
}

export function ODinhKemCode({
  oFileRef, nhanTuO,
}: {
  oFileRef: React.RefObject<HTMLInputElement>;
  nhanTuO: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  // Không `accept`: cả điểm của đường đĩa là nhận được mọi loại file.
  return <input ref={oFileRef} type="file" multiple hidden onChange={nhanTuO} />;
}

/** Dải thẻ file đang đính kèm, nằm ngay trên ô soạn. */
export function DaiTepCode({ tep, bo }: { tep: TepCode[]; bo: (id: string) => void }) {
  if (tep.length === 0) return null;
  return (
    <div className="ct-dkc-dai">
      {tep.map((t) => (
        <div key={t.id} className="ct-dkc-the" data-loi={t.loi !== undefined}>
          {t.dangTai
            ? <Loader2 size={12} aria-hidden className="ct-spin" />
            : t.guiThang
              ? <ImageIcon size={12} aria-hidden />
              : <FileText size={12} aria-hidden />}
          <span className="ct-dkc-ten" title={t.tuongDoi ?? t.ten}>{t.ten}</span>
          {/* Nói rõ file này đi đường nào. Người dùng gửi một bản PDF rồi thấy
              agent "không nhìn thấy" nó sẽ tưởng hỏng — trong khi thật ra agent
              phải tự mở, và nó chỉ mở khi câu hỏi cần tới. */}
          <span className="ct-dkc-phu">
            {t.loi ? t.loi
              : t.dangTai ? 'đang lưu…'
                : t.guiThang ? `${coChu(t.byte)} · gửi kèm` : `${coChu(t.byte)} · agent tự mở`}
          </span>
          <button type="button" className="ct-dkc-bo" onClick={() => bo(t.id)} aria-label={`Bỏ ${t.ten}`}>
            <X size={11} aria-hidden />
          </button>
        </div>
      ))}
    </div>
  );
}
