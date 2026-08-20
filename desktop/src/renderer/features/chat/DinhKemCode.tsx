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

/** Trần của cổng cho ảnh gửi thẳng. Trên mức này thì rơi xuống đường đĩa. */
const TRAN_ANH_BYTE = 4 * 1024 * 1024;
const MAX_ANH_THANG = 3;
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
      const guiThang = LOAI_ANH.test(f.type)
        && f.size > 0
        && f.size <= TRAN_ANH_BYTE
        && soAnhThang.current < MAX_ANH_THANG;
      if (guiThang) soAnhThang.current += 1;

      datTep((cu) => [...cu, { id, ten: f.name, byte: f.size, guiThang, dangTai: !guiThang }]);

      try {
        if (guiThang) {
          const url = await docFile(f, 'dataUrl');
          datTep((cu) => cu.map((t) => (t.id === id ? { ...t, dataUrl: url } : t)));
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
  return (
    <button
      type="button"
      className="ct-agent-icon"
      onClick={onBam}
      disabled={khoa}
      title="Đính kèm file — ảnh, PDF, log, gì cũng được"
      aria-label="Đính kèm file"
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
