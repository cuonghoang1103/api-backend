/**
 * ============================================================
 * ĐỌC PDF cho `read_file` của agent
 * ============================================================
 *
 * ─── Vì sao có file này ───
 * Người dùng kéo `LabFlow_20_Tuan_Master_Plan.pdf` từ Finder vào khung chat
 * (20/08/2026). Kéo-thả chạy đúng, file nằm sẵn trên đĩa, nhưng `read_file`
 * đọc nó bằng `utf8`, thấy toàn ký tự thay thế, rồi trả về "file nhị phân".
 * Model đọc câu đó và làm đúng thứ nó có thể: bảo người dùng tự đổi PDF thành
 * ảnh bằng `pdftoppm`. Tức là app đẩy việc của mình sang cho người dùng.
 *
 * ─── Vì sao `unpdf` ───
 * Backend của chính dự án này đã dùng `unpdf` cho CV Builder, chạy thật trên
 * production trong container Linux. Dùng lại thư viện đã được kiểm bằng dữ
 * liệu thật thì hơn hẳn chọn một cái mới vì nó có nhiều sao hơn. Nó thuần
 * JavaScript — không cần biên dịch native, nên bản cài macOS/Windows/Linux
 * không phát sinh thêm thứ gì phải ký hay phải build riêng.
 *
 * ─── Dựng lại DÒNG, không nối chuỗi ───
 * `getTextContent()` trả về các mẩu chữ kèm TOẠ ĐỘ, không theo thứ tự đọc.
 * Nối thẳng chúng lại thì một bảng hai cột ra thành chữ xen kẽ vô nghĩa, và
 * mọi dòng dính liền nhau. Nên gom theo toạ độ Y thành hàng, sắp trái→phải
 * trong hàng, trên→dưới giữa các hàng. Cùng cách backend làm.
 *
 * ─── Bản scan thì NÓI RA ───
 * PDF chụp từ máy scan không có chữ chọn được — trích ra chuỗi rỗng. Trả về
 * chuỗi rỗng cho model là để nó tự đoán; nói thẳng "đây là bản scan" thì nó
 * biết đề nghị OCR thay vì kết luận file trống.
 */
import { getDocumentProxy } from 'unpdf';

/** Mẩu chữ của pdfjs. Khai lỏng — kiểu thật đến từ pdfjs gói trong unpdf. */
interface MauChu {
  str: string;
  /** [a, b, c, d, x, y] — hai số cuối là toạ độ. */
  transform: number[];
  height: number;
}

export interface KetQuaPdf {
  text: string;
  soTrang: number;
  /**
   * Gần như không rút được chữ nào ⇒ nhiều khả năng là bản scan.
   * ⚠️ Đây là GỢI Ý, không phải lệnh vứt bỏ: `text` vẫn có thể chứa thứ dùng
   * được, và chỗ gọi phải kèm nó vào thay vì thay thế bằng lời khuyên OCR.
   */
  banScan: boolean;
  /** Đã cắt bớt vì quá dài. */
  catBot: boolean;
}

/**
 * Trần chữ trả về model.
 *
 * Một PDF 200 trang là khoảng 400k ký tự ≈ 100k token — nhiều hơn cả cửa sổ
 * ngữ cảnh, và hội thoại được gửi LẠI trọn vẹn ở mỗi bước nên cái giá đó nhân
 * theo số vòng. Cắt ở đây, và nói rõ là đã cắt để model biết còn phần nữa.
 */
const TRAN_KY_TU = 120_000;

export async function docPdf(byte: Buffer): Promise<KetQuaPdf> {
  const pdf = await getDocumentProxy(new Uint8Array(byte));
  const soTrang = pdf.numPages as number;

  const dong: string[] = [];
  let soKyTuThay = 0;

  for (let t = 1; t <= soTrang; t += 1) {
    const trang = await pdf.getPage(t);
    const noi = await trang.getTextContent();
    const mau = (noi.items as MauChu[]).filter((m) => 'str' in m);

    /* Gom theo Y. Dung sai theo CHIỀU CAO CHỮ chứ không phải một số cố định:
       tiêu đề 24pt và chú thích 8pt nằm trên cùng một trang, và một dung sai
       cứng sẽ hoặc xé đôi dòng tiêu đề, hoặc gộp hai dòng chú thích làm một. */
    const hang: Array<{ y: number; mau: MauChu[] }> = [];
    for (const m of mau) {
      if (m.str.trim()) soKyTuThay += m.str.trim().length;
      const y = m.transform[5] ?? 0;
      const cao = Math.abs(m.height || m.transform[3] || 0);
      const co = hang.find((h) => Math.abs(h.y - y) <= Math.max(2, cao * 0.5));
      if (co) co.mau.push(m);
      else hang.push({ y, mau: [m] });
    }

    // PDF lấy gốc toạ độ ở ĐÁY trang, nên Y lớn = nằm TRÊN.
    hang.sort((a, b) => b.y - a.y);
    for (const h of hang) {
      h.mau.sort((a, b) => (a.transform[4] ?? 0) - (b.transform[4] ?? 0));
      const chu = h.mau.map((m) => m.str).join('').replace(/\s+/g, ' ').trim();
      if (chu) dong.push(chu);
    }

    if (t < soTrang) dong.push('');   // ngắt trang
  }

  let text = dong.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  const catBot = text.length > TRAN_KY_TU;
  if (catBot) text = text.slice(0, TRAN_KY_TU);

  /*
   * ⚠️ NGƯỠNG PHẢI THẤP, và bài học đến từ việc CHẠY THẬT chứ không đọc mã.
   *
   * Bản đầu đặt `soKyTuThay < max(30, soTrang * 20)`. Chạy chunk đã dựng với
   * một PDF một trang chứa đúng "BAN DUNG CHAY DUOC" (18 ký tự): rút chữ ĐÚNG,
   * nhưng cờ `banScan` vẫn bật ⇒ `read_file` sẽ vứt bỏ đoạn chữ vừa rút được
   * và bảo người dùng đi OCR một file vốn đọc được. Sáu bài kiểm đơn vị không
   * bắt được vì bài nào cũng dùng chữ dài.
   *
   * Luật đúng: chỉ nghi là bản scan khi GẦN NHƯ KHÔNG có chữ nào. Một hoá đơn
   * hay tấm bìa thật sự chỉ có mươi chữ vẫn là chữ đọc được.
   * Và dù cờ này bật, `text` VẪN được trả về — chỗ gọi không được phép vứt nó.
   */
  const banScan = soKyTuThay < Math.max(8, soTrang * 4);

  return { text, soTrang, banScan, catBot };
}
