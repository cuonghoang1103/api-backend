/**
 * Thẻ bài học "100 Ngày Java" — Ngày 95: CI/CD (Blog API).
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-95.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ LUẬT 6: dựng nguyên lý pipeline (dừng ở bước đầu tiên fail, gate deploy)
 * bằng JDK thuần; tất định. Cú pháp GitHub Actions dạy ở thân bài.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 95,
  total: 100,
  titleLead: 'Java Day 95:',
  titleAccent: 'CI/CD',
  subtitle: 'Từ git push tới production, không ai bấm tay 🚀',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. DÂY CHUYỀN CÁC BƯỚC 🔗',
      code: `[checkout → build → test → docker → deploy]
tat ca xanh -> chay 5 buoc -> deploy`,
      notes: [
        { mark: 'ok', text: 'Mỗi lần đẩy code, máy tự chạy cả dây chuyền từ đầu' },
        { mark: 'dot', text: 'CI (build+test) của Ngày 57, nối thêm CD (đóng gói + triển khai)' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. FAIL LÀ DỪNG NGAY 🛑',
      code: `test DO -> dung sau 3 buoc:
[checkout:XANH, build:XANH, test:DO]`,
      notes: [
        { mark: 'no', text: 'Bước nào đỏ thì dừng cả dây chuyền, không chạy tiếp' },
        { mark: 'ok', text: 'Code hỏng không bao giờ đi tới bước đóng gói/triển khai' },
      ],
    },
    {
      tone: 'pink',
      title: '3. GATE: DEPLOY CHỈ KHI TẤT CẢ XANH 🚦',
      code: `deploy khi test do? false
(docker+deploy KHONG chay)`,
      notes: [
        { mark: 'ok', text: 'Chỉ triển khai khi mọi bước trước đều xanh — không có ngoại lệ' },
        { mark: 'dot', text: 'Máy gác, không phụ thuộc ai đó nhớ chạy test' },
      ],
    },
    {
      tone: 'green',
      title: '4. TỰ ĐỘNG TỪ ĐẦU TỚI CUỐI ⚙️',
      code: `git push
 -> test -> build image -> deploy
 (khong ai bam tay)`,
      notes: [
        { mark: 'ok', text: 'Quy trình tay hay quên bước/deploy nhầm; máy làm thì đều tăm tắp' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'CI = build+test mỗi push; CD = tự triển khai khi xanh' },
        { mark: 'next', text: '**Ngày 96**: kiểm thử tích hợp — chạy cả app + CSDL thật để thử end-to-end' },
      ],
    },
  ],

  /* Output THẬT của `java MoPhongPipeline` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) pipeline: [checkout, build, test, docker, deploy]',
      '2) tat ca xanh -> chay 5 buoc -> deploy? true',
      '3) test DO -> dung sau 3 buoc: [checkout:XANH, build:XANH, test:DO]',
      '4) deploy khi test do? false (docker+deploy KHONG chay)',
      '5) gate: chi deploy khi MOI buoc truoc XANH',
      '6) git push -> test -> build image -> deploy, khong ai bam tay',
    ],
  },

  verify: {
    className: 'MoPhongPipeline',
    source: `import java.util.*;

/* Blog API — CI/CD. Dung lai NGUYEN LY day chuyen tu dong bang JDK thuan: cac
   BUOC chay theo thu tu, buoc nao DO thi DUNG ngay (khong chay tiep); chi
   DEPLOY khi MOI buoc truoc XANH. Mo rong CI cua Ngay 57 thanh CD. Dem tat dinh. */
public class MoPhongPipeline {

    record Buoc(String ten, boolean dat) {}

    /* Chay pipeline: dung o buoc dau tien that bai. */
    static List<String> chay(List<Buoc> pipeline) {
        List<String> ket = new ArrayList<>();
        for (Buoc b : pipeline) {
            if (!b.dat()) { ket.add(b.ten() + ":DO"); break; }   // that bai -> dung day chuyen
            ket.add(b.ten() + ":XANH");
        }
        return ket;
    }

    static boolean daDeploy(List<String> ketQua) {
        return ketQua.contains("deploy:XANH");
    }

    public static void main(String[] args) {
        List<String> ten = List.of("checkout", "build", "test", "docker", "deploy");

        // (1)(2) tat ca xanh -> chay het -> deploy
        List<Buoc> ok = ten.stream().map(t -> new Buoc(t, true)).toList();
        List<String> r1 = chay(ok);
        System.out.println("1) pipeline: " + ten);
        System.out.println("2) tat ca xanh -> chay " + r1.size() + " buoc -> deploy? " + daDeploy(r1));

        // (3)(4) test DO -> dung truoc docker+deploy
        List<Buoc> testDo = List.of(
                new Buoc("checkout", true), new Buoc("build", true), new Buoc("test", false),
                new Buoc("docker", true), new Buoc("deploy", true));
        List<String> r2 = chay(testDo);
        System.out.println("3) test DO -> dung sau " + r2.size() + " buoc: " + r2);
        System.out.println("4) deploy khi test do? " + daDeploy(r2) + " (docker+deploy KHONG chay)");

        // (5) gate
        System.out.println("5) gate: chi deploy khi MOI buoc truoc XANH");

        // (6) ket luan
        System.out.println("6) git push -> test -> build image -> deploy, khong ai bam tay");
    }
}`,
  },
};
