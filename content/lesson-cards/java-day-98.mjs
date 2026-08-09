/**
 * Thẻ bài học "100 Ngày Java" — Ngày 98: Tối ưu hiệu năng cuối (Blog API).
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-98.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ LUẬT 5 + 6: đếm SỐ TRUY VẤN / SỐ PHÉP SO SÁNH (cố định), không đo thời
 * gian; tất định. Công cụ đo (JFR/EXPLAIN) dạy ở thân bài.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 98,
  total: 100,
  titleLead: 'Java Day 98:',
  titleAccent: 'Tối ưu hiệu năng',
  subtitle: 'Đo → tìm điểm nóng → sửa → đo lại 📈',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. ĐO ĐỂ TÌM ĐIỂM NÓNG (ĐỪNG ĐOÁN) 📏',
      code: `trang chu 4 truy van, trang bai 21 truy van
-> diem nong = trang bai`,
      notes: [
        { mark: 'ok', text: 'Đo trước để biết chỗ chậm THẬT, không sửa theo cảm giác (Ngày 59)' },
        { mark: 'dot', text: 'Điểm nóng gần như không bao giờ ở chỗ bạn đoán' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. SOÁT N+1 🕳️',
      code: `21 = 1 + 20 -> JOIN FETCH -> con 1 truy van`,
      notes: [
        { mark: 'ok', text: 'Bật show-sql, đếm truy vấn mỗi trang; 1+N là N+1 (Ngày 71)' },
      ],
    },
    {
      tone: 'pink',
      title: '3. CHỈ MỤC THIẾU 🚀',
      code: `tim 1 trieu dong 1000000 -> them index
-> 20 phep so sanh`,
      notes: [
        { mark: 'ok', text: '`EXPLAIN` thấy Seq Scan → thêm index → Index Scan (Ngày 66)' },
      ],
    },
    {
      tone: 'green',
      title: '4. CACHE ĐÚNG CHỖ ⚡',
      code: `cache trang chu: 100 luot -> 1 lan tinh that

DO LAI: trang bai 21 -> 1 truy van`,
      notes: [
        { mark: 'ok', text: 'Cache thứ đọc-nhiều-đổi-ít (Ngày 89); rồi ĐO LẠI xác nhận' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Đủ nhanh thì DỪNG — đừng tối ưu sớm, đừng làm code xấu vì vài ms' },
        { mark: 'next', text: '**Ngày 99**: tổng kết Blog API — nhìn lại kiến trúc hoàn chỉnh' },
      ],
    },
  ],

  /* Output THẬT của `java MoPhongToiUu` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) DO: trang chu 4 truy van, trang bai 21 -> diem nong = trang bai',
      '2) N+1: 21 = 1+20 -> JOIN FETCH -> con 1 truy van',
      '3) chi muc: tim 1 trieu dong 1000000 -> them index -> 20 phep so sanh',
      '4) cache trang chu: 100 luot -> 1 lan tinh that (doc nhieu doi it)',
      '5) DO LAI sau sua: trang bai 1 truy van (21 -> 1)',
      '6) DO -> tim diem nong -> SUA -> DO lai; du nhanh thi DUNG (dung toi uu som)',
    ],
  },

  verify: {
    className: 'MoPhongToiUu',
    source: `import java.util.*;

/* Blog API — toi uu hieu nang cuoi. Gom moi bai hoc hieu nang RAI RAC thanh MOT
   vong ra soat co phuong phap: DO tim diem nong (59), soat N+1 (71), chi muc
   thieu (66), cache dung cho (89), roi DO LAI. Dem tat dinh (so truy van / so
   phep so sanh, khong do thoi gian — LUAT 5). */
public class MoPhongToiUu {

    /* Trang danh sach: N+1 (moi bai +1 truy van) hay gom bang JOIN FETCH. */
    static int truyVanTrang(int soBai, boolean joinFetch) {
        return joinFetch ? 1 : 1 + soBai;
    }

    /* Tim theo cot: quet ca bang (khong index) hay do cay (co index). */
    static long soSanhTim(int soDong, boolean coIndex) {
        return coIndex ? (long) Math.ceil(Math.log(soDong) / Math.log(2)) : soDong;
    }

    public static void main(String[] args) {
        // (1) DO: tim diem nong (dung doan)
        int home = truyVanTrang(3, false);
        int list = truyVanTrang(20, false);
        System.out.println("1) DO: trang chu " + home + " truy van, trang bai " + list
                + " -> diem nong = trang bai");

        // (2) soat N+1 (Ngay 71)
        System.out.println("2) N+1: " + list + " = 1+20 -> JOIN FETCH -> con "
                + truyVanTrang(20, true) + " truy van");

        // (3) chi muc thieu (Ngay 66)
        long khong = soSanhTim(1_000_000, false), co = soSanhTim(1_000_000, true);
        System.out.println("3) chi muc: tim 1 trieu dong " + khong + " -> them index -> " + co + " phep so sanh");

        // (4) cache dung cho (Ngay 89)
        System.out.println("4) cache trang chu: 100 luot -> 1 lan tinh that (doc nhieu doi it)");

        // (5) DO LAI sau khi sua
        System.out.println("5) DO LAI sau sua: trang bai " + truyVanTrang(20, true) + " truy van (21 -> 1)");

        // (6) ket luan
        System.out.println("6) DO -> tim diem nong -> SUA -> DO lai; du nhanh thi DUNG (dung toi uu som)");
    }
}`,
  },
};
