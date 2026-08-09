/**
 * Thẻ bài học "100 Ngày Java" — Ngày 84: Phân trang & sắp xếp (Blog API).
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-84.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ LUẬT 6: dựng nguyên lý Pageable/Sort bằng JDK thuần — đếm SỐ DÒNG BỎ QUA
 * (cố định) chứ không đo thời gian. Cú pháp Pageable/PageRequest dạy ở thân bài.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 84,
  total: 100,
  titleLead: 'Java Day 84:',
  titleAccent: 'Phân trang & Sắp xếp',
  subtitle: '20 bài/trang, mới nhất trước — và bẫy OFFSET lớn 📄',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. CẮT TRANG + TỔNG SỐ TRANG 📄',
      code: `23 bai, co trang 10 -> 3 trang, 23 ban ghi
trang 1 -> [1..10]   trang 3 -> [21,22,23]`,
      notes: [
        { mark: 'ok', text: 'Đừng trả cả nghìn bài một lần — cắt trang, kèm tổng số trang' },
        { mark: 'dot', text: '`tongTrang = ceil(tongBanGhi / co)`' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. SẮP "MỚI NHẤT TRƯỚC" ⬇️',
      code: `sort theo ngay/id GIAM dan
-> bai dau la id 23 (moi nhat)`,
      notes: [
        { mark: 'ok', text: 'Người đọc muốn thấy bài mới nhất ở đầu — sắp ở CSDL, không ở Java' },
        { mark: 'dot', text: '`Sort.by("ngayDang").descending()`' },
      ],
    },
    {
      tone: 'pink',
      title: '3. BẪY: OFFSET LỚN CHẬM 🐌',
      code: `lay trang 100 (co 10)
-> DB phai BO QUA 990 dong truoc

// cang trang sau, cang nhieu dong bi quet bo`,
      notes: [
        { mark: 'no', text: 'OFFSET N bắt CSDL quét rồi bỏ N dòng — trang càng sâu càng chậm' },
      ],
    },
    {
      tone: 'green',
      title: '4. CHỮA: PHÂN TRANG THEO CON TRỎ 🎯',
      code: `WHERE id < 14 LIMIT 10
-> lay 10 bai cu hon, BO QUA 0 dong`,
      notes: [
        { mark: 'ok', text: 'Cursor: "sau bản ghi X" thay vì "bỏ N dòng" — nhanh đều mọi trang' },
        { mark: 'dot', text: 'Cần chỉ mục trên cột sắp (Ngày 66) để nhảy thẳng' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: '`Pageable` cho trang thường; cursor cho danh sách sâu/vô tận' },
        { mark: 'next', text: '**Ngày 85**: tìm kiếm bài viết — LIKE, chỉ mục, và full-text' },
      ],
    },
  ],

  /* Output THẬT của `java MoPhongPhanTrang` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) 23 bai, co trang 10 -> tong 3 trang, 23 ban ghi',
      '2) trang 1 -> 10 bai: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]',
      '3) trang 3 (cuoi) -> 3 bai: [21, 22, 23]',
      "4) sap 'moi nhat truoc' -> bai dau la id 23",
      '5) OFFSET lay trang 100 -> bo qua 990 dong (cang sau cang cham)',
      "6) con tro 'id < 14 LIMIT 10' -> lay 10 bai (dau id 13), bo qua 0 dong",
    ],
  },

  verify: {
    className: 'MoPhongPhanTrang',
    source: `import java.util.*;

/* Blog API — phan trang & sap xep. Dung lai nguyen ly Pageable/Sort bang JDK
   thuan: cat trang theo offset+co, tinh tong trang, sap 'moi nhat truoc', va
   phoi bay OFFSET LON (phai bo qua nhieu dong -> cang sau cang cham) so voi
   phan trang theo CON TRO (cursor) khong bo qua dong nao. Dem tat dinh. */
public class MoPhongPhanTrang {

    record Trang(List<Integer> noiDung, int trangHienTai, int tongTrang, long tongBanGhi) {}

    static long soDongBoQua = 0;   // dem tong so dong DB phai BO QUA (chi phi OFFSET)

    /* Phan trang kieu OFFSET: trang N phai bo qua (N-1)*co dong dau. */
    static Trang layTrangOffset(List<Integer> tatCa, int trang, int co) {
        int offset = (trang - 1) * co;
        soDongBoQua += Math.min(offset, tatCa.size());       // DB quet & bo qua offset dong
        List<Integer> noiDung = new ArrayList<>();
        for (int i = offset; i < Math.min(offset + co, tatCa.size()); i++) noiDung.add(tatCa.get(i));
        int tongTrang = (int) Math.ceil(tatCa.size() / (double) co);
        return new Trang(noiDung, trang, tongTrang, tatCa.size());
    }

    /* Phan trang theo CON TRO: "id < moc" LIMIT co — nhay thang, khong bo qua. */
    static List<Integer> layTheoConTro(List<Integer> giamDan, int mocId, int co) {
        List<Integer> ket = new ArrayList<>();
        for (int id : giamDan) {                             // da sap giam dan
            if (id < mocId && ket.size() < co) ket.add(id);
        }
        return ket;
    }

    public static void main(String[] args) {
        // 23 bai, id 1..23 (id lon = moi hon)
        List<Integer> tangDan = new ArrayList<>();
        for (int i = 1; i <= 23; i++) tangDan.add(i);

        // (1) tong so trang
        Trang t1 = layTrangOffset(tangDan, 1, 10);
        System.out.println("1) 23 bai, co trang 10 -> tong " + t1.tongTrang() + " trang, "
                + t1.tongBanGhi() + " ban ghi");

        // (2) trang 1
        System.out.println("2) trang 1 -> " + t1.noiDung().size() + " bai: " + t1.noiDung());

        // (3) trang cuoi (3) chi con 3 bai
        Trang t3 = layTrangOffset(tangDan, 3, 10);
        System.out.println("3) trang 3 (cuoi) -> " + t3.noiDung().size() + " bai: " + t3.noiDung());

        // (4) sap 'moi nhat truoc' = id giam dan
        List<Integer> giamDan = new ArrayList<>(tangDan);
        giamDan.sort(Comparator.reverseOrder());
        System.out.println("4) sap 'moi nhat truoc' -> bai dau la id " + giamDan.get(0));

        // (5) OFFSET lon: lay trang 100 (co 10) tren tap gia 100000 -> bo qua rat nhieu
        soDongBoQua = 0;
        List<Integer> tapLon = new ArrayList<>();
        for (int i = 1; i <= 100_000; i++) tapLon.add(i);
        layTrangOffset(tapLon, 100, 10);                     // trang 100 -> bo qua 990 dong
        System.out.println("5) OFFSET lay trang 100 -> bo qua " + soDongBoQua
                + " dong (cang sau cang cham)");

        // (6) con tro: lay 10 bai "cu hon id 14" -> khong bo qua dong nao
        List<Integer> theoConTro = layTheoConTro(giamDan, 14, 10);
        System.out.println("6) con tro 'id < 14 LIMIT 10' -> lay " + theoConTro.size()
                + " bai (dau id " + theoConTro.get(0) + "), bo qua 0 dong");
    }
}`,
  },
};
