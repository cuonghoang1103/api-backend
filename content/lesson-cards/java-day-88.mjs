/**
 * Thẻ bài học "100 Ngày Java" — Ngày 88: Lượt xem & chống spam (Blog API).
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-88.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ LUẬT 1 + 6: token bucket dựng bằng JDK thuần, đồng hồ là LOGIC (truyền
 * giây vào, không dùng now()) → tất định. Cú pháp bucket4j/filter dạy ở thân bài.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 88,
  total: 100,
  titleLead: 'Java Day 88:',
  titleAccent: 'Lượt xem & Chống spam',
  subtitle: 'Rate limit bằng "gàu rò" — chặn spam, cho lưu lượng đều 🪣',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. GÀU RÒ (TOKEN BUCKET) 🪣',
      code: `gau suc chua 5, nap 1 token/giay
moi request tru 1 token`,
      notes: [
        { mark: 'ok', text: 'Mỗi client một gàu; hết token thì bị chặn, gàu tự nạp lại theo thời gian' },
        { mark: 'dot', text: 'Cho phép bùng ngắn (5 phát liền), nhưng ghìm tốc độ trung bình' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. HẾT TOKEN → 429 🚫',
      code: `5 request lien tiep (giay 0) -> qua 5/5
request thu 6 (giay 0) -> 429 het token`,
      notes: [
        { mark: 'no', text: 'Quá nhanh → `429 Too Many Requests` — chặn dò mật khẩu, spam bình luận' },
      ],
    },
    {
      tone: 'pink',
      title: '3. NẠP LẠI THEO THỜI GIAN ⏳',
      code: `sau 3 giay -> nap 3 token
-> 3 request lai qua`,
      notes: [
        { mark: 'ok', text: 'Chờ một chút là lại dùng được — không khoá cứng người dùng thật' },
        { mark: 'dot', text: 'Đồng hồ tính theo thời gian trôi qua, không cần vòng lặp đếm' },
      ],
    },
    {
      tone: 'green',
      title: '4. ĐẾM VIEW CHỐNG GIAN LẬN 👁️',
      code: `4 luot xem (an xem b1 3 lan)
-> dem 2 view (moi user-bai tinh 1)`,
      notes: [
        { mark: 'ok', text: 'Cùng người xem lại một bài trong cửa sổ → chỉ tính một view' },
        { mark: 'dot', text: 'Và đừng ghi DB mỗi view — gom lại (buffer) rồi cập nhật theo lô' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Rate limit ở tầng gác (filter/gateway); thật thì dùng bucket4j + Redis' },
        { mark: 'next', text: '**Ngày 89**: caching — nhớ kết quả nặng để khỏi tính lại' },
      ],
    },
  ],

  /* Output THẬT của `java MoPhongRateLimit` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) gau ro suc chua 5, nap 1 token/giay',
      '2) 5 request lien tiep (giay 0) -> qua 5/5 (dung het token)',
      '3) request thu 6 (giay 0) -> 429 het token',
      '4) sau 3 giay -> nap 3 token -> 3 request qua',
      '5) 4 luot xem (an xem b1 3 lan) -> dem 2 view (moi user-bai tinh 1)',
      '6) token bucket: chan burst + nap dan -> chong spam ma van cho luu luong deu',
    ],
  },

  verify: {
    className: 'MoPhongRateLimit',
    source: `import java.util.*;

/* Blog API — chong spam & dem view. Dung lai NGUYEN LY 'gau ro' (token bucket)
   bang JDK thuan: moi client mot gau, moi request tru 1 token, gau nap dan
   theo thoi gian; het token -> 429. Dong ho la LOGIC (truyen 'giay' vao, khong
   dung now()) nen TAT DINH. Cong them dem view co CHONG TRUNG. */
public class MoPhongRateLimit {

    /* Gau ro: suc chua toi da + toc do nap; xin token tai mot thoi diem logic. */
    static class GauRo {
        final int sucChua;
        final double napMoiGiay;
        double token;
        long thoiDiemCu;

        GauRo(int sucChua, double napMoiGiay) {
            this.sucChua = sucChua; this.napMoiGiay = napMoiGiay;
            this.token = sucChua; this.thoiDiemCu = 0;
        }

        boolean xin(long giay) {
            token = Math.min(sucChua, token + (giay - thoiDiemCu) * napMoiGiay);   // nap theo thoi gian troi
            thoiDiemCu = giay;
            if (token >= 1) { token -= 1; return true; }                           // con -> qua
            return false;                                                          // het -> 429
        }
    }

    public static void main(String[] args) {
        GauRo gr = new GauRo(5, 1.0);   // suc chua 5, nap 1 token/giay
        System.out.println("1) gau ro suc chua 5, nap 1 token/giay");

        // (2) 5 request lien tiep tai giay 0
        int qua = 0;
        for (int i = 0; i < 5; i++) if (gr.xin(0)) qua++;
        System.out.println("2) 5 request lien tiep (giay 0) -> qua " + qua + "/5 (dung het token)");

        // (3) request thu 6 khi chua nap
        System.out.println("3) request thu 6 (giay 0) -> " + (gr.xin(0) ? "qua" : "429 het token"));

        // (4) sau 3 giay -> nap 3 token
        int qua2 = 0;
        for (int i = 0; i < 3; i++) if (gr.xin(3)) qua2++;
        System.out.println("4) sau 3 giay -> nap 3 token -> " + qua2 + " request qua");

        // (5) dem view CHONG TRUNG: moi (user, bai) chi tinh 1 view trong cua so
        Set<String> daXem = new HashSet<>();
        int view = 0;
        String[] luot = {"an|b1", "an|b1", "binh|b1", "an|b1"};   // an xem b1 3 lan, binh 1 lan
        for (String l : luot) if (daXem.add(l)) view++;
        System.out.println("5) 4 luot xem (an xem b1 3 lan) -> dem " + view + " view (moi user-bai tinh 1)");

        // (6) ket luan
        System.out.println("6) token bucket: chan burst + nap dan -> chong spam ma van cho luu luong deu");
    }
}`,
  },
};
