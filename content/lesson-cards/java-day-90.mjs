/**
 * Thẻ bài học "100 Ngày Java" — Ngày 90: Xử lý nền & tác vụ định kỳ (Blog API).
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-90.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ LUẬT 6: dựng nguyên lý @Async/@Scheduled bằng JDK thuần; chi phí là đơn
 * vị LOGIC cố định (không đo thời gian) → tất định. Cú pháp @Async/@Scheduled
 * dạy ở thân bài.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 90,
  total: 100,
  titleLead: 'Java Day 90:',
  titleAccent: 'Xử lý nền',
  subtitle: 'Đừng bắt người dùng chờ việc của người khác ⚙️',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. ĐỒNG BỘ: NGƯỜI DÙNG CHỜ HẾT 🐢',
      code: `taoBL(1) + guiEmail(5) + thongKe(2)
-> request ton 8 don vi`,
      notes: [
        { mark: 'no', text: 'Gửi email báo "có bình luận" mất 5 — người bình luận phải đứng chờ cả 5' },
        { mark: 'dot', text: 'Việc chậm nhét trong request kéo dài thời gian chờ vô lý' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. @Async: ĐẨY VIỆC CHẬM RA NỀN ⚙️',
      code: `request chi ton 1 don vi
(day email+thongKe ra hang doi)`,
      notes: [
        { mark: 'ok', text: 'Trả lời người dùng NGAY sau phần nhanh; việc chậm chạy nền' },
        { mark: 'ok', text: '8 → 1 đơn vị: người bình luận không chờ cái email của tác giả' },
      ],
    },
    {
      tone: 'pink',
      title: '3. HÀNG ĐỢI + WORKER 📮',
      code: `hang doi co 2 tac vu
worker chay -> [guiEmail, capNhatThongKe]`,
      notes: [
        { mark: 'ok', text: 'Việc nền vào hàng đợi, worker riêng xử lý (Ngày 42 ExecutorService)' },
        { mark: 'dot', text: 'Thật thì dùng hàng đợi bền (DB/RabbitMQ) để không mất việc khi sập' },
      ],
    },
    {
      tone: 'green',
      title: '4. @Scheduled: TỰ CHẠY THEO LỊCH ⏰',
      code: `@Scheduled moi 60 don vi, trong 200
-> chay 3 lan tai [60, 120, 180]`,
      notes: [
        { mark: 'ok', text: 'Việc chẳng ai bấm: dọn file rác đêm, tổng hợp thống kê mỗi giờ' },
        { mark: 'dot', text: 'Khai bằng cron/cố định; nhiều máy chủ thì đừng chạy trùng' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Việc chậm/không cần ngay → đẩy nền; request chỉ làm phần bắt buộc' },
        { mark: 'next', text: '**Ngày 91**: realtime — WebSocket đẩy thông báo tức thì' },
      ],
    },
  ],

  /* Output THẬT của `java MoPhongXuLyNen` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) DONG BO: taoBL(1)+email(5)+thongKe(2) -> request ton 8 don vi',
      '2) @Async: request chi ton 1 don vi (day email+thongKe ra nen)',
      '3) hang doi co 2 tac vu cho worker chay nen',
      '4) worker chay het hang doi -> xong [guiEmail, capNhatThongKe]',
      '5) @Scheduled moi 60 don vi, trong 200 -> chay 3 lan tai [60, 120, 180]',
      '6) viec cham/cua nguoi khac -> day ra nen: request 8 -> 1 don vi',
    ],
  },

  verify: {
    className: 'MoPhongXuLyNen',
    source: `import java.util.*;

/* Blog API — xu ly nen & tac vu dinh ky. Dung lai NGUYEN LY bang JDK thuan:
   DONG BO thi nguoi dung cho HET moi viec; BAT DONG BO (@Async) chi cho phan
   nhanh, day viec cham (gui email...) ra HANG DOI cho worker (Ngay 42) chay
   nen; @Scheduled chay theo lich. Chi phi la don vi LOGIC co dinh -> TAT DINH. */
public class MoPhongXuLyNen {

    record TacVu(String ten, int chiPhi) {}

    /* DONG BO: cong don chi phi — request cho het. */
    static int dongBo(List<TacVu> viec) {
        int tong = 0;
        for (TacVu t : viec) tong += t.chiPhi();
        return tong;
    }

    static final Deque<TacVu> HANG_DOI = new ArrayDeque<>();

    /* BAT DONG BO: request chi ton phan NHANH; viec cham day ra nen. */
    static int batDongBo(TacVu nhanh, List<TacVu> chamRaNen) {
        HANG_DOI.addAll(chamRaNen);
        return nhanh.chiPhi();
    }

    static List<String> workerChay() {
        List<String> daXong = new ArrayList<>();
        while (!HANG_DOI.isEmpty()) daXong.add(HANG_DOI.poll().ten());
        return daXong;
    }

    /* @Scheduled: chay tai cac moc chia het cho chu ky. */
    static List<Integer> lichChay(int tong, int chuKy) {
        List<Integer> lan = new ArrayList<>();
        for (int t = chuKy; t <= tong; t += chuKy) lan.add(t);
        return lan;
    }

    public static void main(String[] args) {
        TacVu taoBL = new TacVu("taoBinhLuan", 1);
        TacVu email = new TacVu("guiEmail", 5);
        TacVu thongKe = new TacVu("capNhatThongKe", 2);

        // (1) DONG BO: nguoi dung cho het 1+5+2
        int dbo = dongBo(List.of(taoBL, email, thongKe));
        System.out.println("1) DONG BO: taoBL(1)+email(5)+thongKe(2) -> request ton " + dbo + " don vi");

        // (2)(3) BAT DONG BO: chi cho phan nhanh, day cham ra nen
        int async = batDongBo(taoBL, List.of(email, thongKe));
        System.out.println("2) @Async: request chi ton " + async + " don vi (day email+thongKe ra nen)");
        System.out.println("3) hang doi co " + HANG_DOI.size() + " tac vu cho worker chay nen");

        // (4) worker chay het hang doi
        System.out.println("4) worker chay het hang doi -> xong " + workerChay());

        // (5) @Scheduled dinh ky
        List<Integer> lan = lichChay(200, 60);
        System.out.println("5) @Scheduled moi 60 don vi, trong 200 -> chay " + lan.size() + " lan tai " + lan);

        // (6) ket luan
        System.out.println("6) viec cham/cua nguoi khac -> day ra nen: request " + dbo + " -> " + async + " don vi");
    }
}`,
  },
};
