/**
 * Thẻ bài học "100 Ngày Java" — Ngày 87: Upload ảnh bìa (Blog API).
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-87.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ LUẬT 6: bảo mật upload dựng bằng JDK thuần — nhận diện loại THẬT bằng
 * magic bytes, chặn kích thước, làm sạch tên chống path traversal. Tất định.
 * Cú pháp MultipartFile/@PostMapping dạy ở thân bài.
 * ⚠ Escaping: regex `[/\\]` trong verify.source cần `[/\\\\\\\\]` (mỗi \ = 4 chéo).
 */
export default {
  series: '100 NGÀY JAVA',
  day: 87,
  total: 100,
  titleLead: 'Java Day 87:',
  titleAccent: 'Upload ảnh bìa',
  subtitle: 'Nhận file — và đừng tin một chữ nào client khai 📤',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. NHẬN FILE: MultipartFile 📤',
      code: `@PostMapping("/bai-viet/{slug}/anh")
String upload(@RequestParam MultipartFile file) {
    // file.getOriginalFilename(), .getSize(), .getBytes()
}`,
      notes: [
        { mark: 'ok', text: 'File tới dạng `multipart/form-data`, Spring gói vào `MultipartFile`' },
        { mark: 'dot', text: 'Nhưng MỌI thứ file khai (tên, loại) đều do client gửi — đáng nghi' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. KIỂM LOẠI THẬT BẰNG MAGIC BYTES 🔬',
      code: `EXE doi ten '.jpg' -> magic 4D5A -> TU CHOI
khai 'image/jpeg' nhung magic 8950 -> la PNG`,
      notes: [
        { mark: 'no', text: 'Đừng tin đuôi tên / content-type — kẻ xấu đổi được cả hai' },
        { mark: 'ok', text: 'Vài byte đầu file (magic) mới là loại THẬT: JPG=FFD8FF, PNG=8950' },
      ],
    },
    {
      tone: 'pink',
      title: '3. CHẶN KÍCH THƯỚC & WHITELIST 🚧',
      code: `file 12MB > 5MB -> TU CHOI
PDF (magic %PDF) khong phai anh -> TU CHOI`,
      notes: [
        { mark: 'ok', text: 'Giới hạn cỡ (chống làm nghẽn đĩa/RAM); chỉ nhận loại trong danh sách trắng' },
      ],
    },
    {
      tone: 'green',
      title: '4. LÀM SẠCH TÊN: PATH TRAVERSAL 🛡️',
      code: `ten '../../etc/passwd.jpg'
-> lam sach -> 'passwd.jpg' (bo duong dan)`,
      notes: [
        { mark: 'no', text: '`../` trong tên có thể ghi đè file hệ thống — bỏ mọi phần đường dẫn' },
        { mark: 'dot', text: 'Thật thì đặt tên NGẪU NHIÊN (UUID) để tránh trùng & lộ tên' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Lưu ảnh ra dịch vụ (S3/R2), DB chỉ giữ ĐƯỜNG DẪN, không giữ bytes' },
        { mark: 'next', text: '**Ngày 88**: lượt xem & chống spam — đếm view, rate limit' },
      ],
    },
  ],

  /* Output THẬT của `java MoPhongUpload` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      "1) 'anh.jpg' magic JPG, 200KB -> /uploads/anh.jpg",
      "2) file that la EXE doi ten '.jpg' -> TU CHOI: loai that 'EXE' khong phai anh",
      '3) khai \'image/jpeg\' nhung magic PNG -> nhan dien theo magic = PNG',
      '4) file 12MB JPG > 5MB -> TU CHOI: 12MB > 5MB',
      "5) ten '../../etc/passwd.jpg' -> lam sach -> 'passwd.jpg'",
      "6) file PDF (magic %PDF) -> TU CHOI: loai that 'PDF' khong phai anh",
    ],
  },

  verify: {
    className: 'MoPhongUpload',
    source: `import java.util.*;

/* Blog API — upload anh bia. Trong tam la BAO MAT upload (dung tin client,
   Ngay 69): nhan dien loai THAT bang MAGIC BYTES chu khong tin duoi ten hay
   content-type client khai; chan qua kich thuoc; lam sach ten chong PATH
   TRAVERSAL. Chay JDK thuan, tat dinh. */
public class MoPhongUpload {

    static final Set<String> CHO_PHEP = Set.of("JPG", "PNG");    // chi cho anh
    static final long GIOI_HAN = 5L * 1024 * 1024;               // 5MB

    record TepTin(String tenGoc, String contentTypeKhai, long kichThuoc, int[] magic) {}

    /* Nhan dien loai THAT theo magic bytes (vai byte dau file). */
    static String loaiThat(int[] m) {
        if (batDau(m, 0xFF, 0xD8, 0xFF)) return "JPG";
        if (batDau(m, 0x89, 0x50, 0x4E, 0x47)) return "PNG";
        if (batDau(m, 0x25, 0x50, 0x44, 0x46)) return "PDF";
        if (batDau(m, 0x4D, 0x5A)) return "EXE";                 // 'MZ'
        return "?";
    }

    static boolean batDau(int[] m, int... sig) {
        if (m.length < sig.length) return false;
        for (int i = 0; i < sig.length; i++) if (m[i] != sig[i]) return false;
        return true;
    }

    /* Lam sach ten: chi lay ten cuoi, bo moi thanh phan duong dan -> chong '../'. */
    static String tenAnToan(String ten) {
        String base = ten.replaceAll(".*[/\\\\\\\\]", "");           // bo tat ca truoc / hoac \\
        return base.isEmpty() ? "tep" : base;
    }

    static String kiemTra(TepTin f) {
        String loai = loaiThat(f.magic());
        if (!CHO_PHEP.contains(loai)) return "TU CHOI: loai that '" + loai + "' khong phai anh";
        if (f.kichThuoc() > GIOI_HAN) return "TU CHOI: " + (f.kichThuoc() / 1024 / 1024) + "MB > 5MB";
        return "/uploads/" + tenAnToan(f.tenGoc());
    }

    public static void main(String[] args) {
        // (1) anh JPG hop le
        TepTin f1 = new TepTin("anh.jpg", "image/jpeg", 200 * 1024, new int[]{0xFF, 0xD8, 0xFF, 0xE0});
        System.out.println("1) 'anh.jpg' magic JPG, 200KB -> " + kiemTra(f1));

        // (2) file EXE doi duoi thanh .jpg -> magic to cao
        TepTin f2 = new TepTin("anh.jpg", "image/jpeg", 50 * 1024, new int[]{0x4D, 0x5A, 0x90, 0x00});
        System.out.println("2) file that la EXE doi ten '.jpg' -> " + kiemTra(f2));

        // (3) content-type khai 'image/jpeg' nhung magic la PNG -> tin MAGIC
        int[] magicPng = {0x89, 0x50, 0x4E, 0x47};
        System.out.println("3) khai 'image/jpeg' nhung magic PNG -> nhan dien theo magic = " + loaiThat(magicPng));

        // (4) file qua lon
        TepTin f4 = new TepTin("to.jpg", "image/jpeg", 12L * 1024 * 1024, new int[]{0xFF, 0xD8, 0xFF, 0xE0});
        System.out.println("4) file 12MB JPG > 5MB -> " + kiemTra(f4));

        // (5) ten co '../' -> path traversal -> lam sach
        System.out.println("5) ten '../../etc/passwd.jpg' -> lam sach -> '" + tenAnToan("../../etc/passwd.jpg") + "'");

        // (6) PDF (khong nam whitelist anh) -> tu choi
        TepTin f6 = new TepTin("tailieu.pdf", "application/pdf", 100 * 1024, new int[]{0x25, 0x50, 0x44, 0x46});
        System.out.println("6) file PDF (magic %PDF) -> " + kiemTra(f6));
    }
}`,
  },
};
