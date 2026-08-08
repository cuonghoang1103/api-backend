/**
 * Thẻ bài học "100 Ngày Java" — Ngày 59: Hiệu năng & đo đạc.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-59.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ LUẬT 5 (bài hiệu năng): thời gian đo được ĐỔI THEO LẦN CHẠY mà thẻ so
 * khớp output từng dòng. Nên chương trình ĐẾM PHÉP TÍNH (số phép so sánh, số
 * ký tự phải chép, số lời gọi) — những con số này cố định — và với phép đo
 * thời gian thật thì chỉ in NGƯỠNG (`nhanh hơn ít nhất 20 lần? true`), không
 * bao giờ in mili-giây. Cùng cách đã dùng cho Ngày 36, 41, 44, 48.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 59,
  total: 100,
  titleLead: 'Java Day 59:',
  titleAccent: 'Hiệu năng',
  subtitle: 'Đoán mò là cách tối ưu tệ nhất — phải ĐO ⏱️',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. ĐỔI CẤU TRÚC ĂN ĐỨT MẸO VẶT 🗂️',
      code: `10000 lan tim trong 20000 phan tu:

List.contains    -> 50 005 000 phep so sanh
HashSet.contains ->     10 000 phep so sanh`,
      notes: [
        { mark: 'ok', text: 'Giảm 5000 lần chỉ bằng cách đổi MỘT dòng khai báo (Ngày 25)' },
        { mark: 'dot', text: 'Không mẹo vặt nào bù nổi việc chọn sai cấu trúc dữ liệu' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. NỐI CHUỖI TRONG VÒNG LẶP 🧵',
      code: `10000 doan, moi doan 5 ky tu:

s = s + doan     -> chep 250 025 000 ky tu
sb.append(doan)  -> chep      73 665 ky tu`,
      notes: [
        { mark: 'ok', text: 'Mỗi dấu `+` là một chuỗi MỚI — chép lại toàn bộ phần đã có' },
        { mark: 'dot', text: 'Nối vài chuỗi thì `+` vẫn tốt; vấn đề chỉ nằm trong vòng lặp' },
      ],
    },
    {
      tone: 'pink',
      title: '3. ĐO CHO RA SỐ ĐÁNG TIN ⏱️',
      code: `// SAI: chay dung 1 lan roi ket luan
long t = System.nanoTime(); lamViec();

// DUNG: lam nong JIT -> do nhieu lan -> lay TRUNG VI
-> nhanh hon it nhat 20 lan? true`,
      notes: [
        { mark: 'ok', text: 'JVM chạy nguội rất chậm; JIT cần vài nghìn vòng mới tối ưu (Ngày 51)' },
        { mark: 'no', text: 'Một phép đo đơn lẻ không phải bằng chứng, chỉ là một con số' },
      ],
    },
    {
      tone: 'green',
      title: '4. ĐIỂM NÓNG KHÔNG Ở CHỖ BẠN ĐOÁN 🔥',
      code: `doiTien       1 000 loi goi   // trong "nang"
chuanHoaTen 1 000 000 loi goi   // trong "nhe"

// -> 99.9% loi goi nam o ham trong VO HAI`,
      notes: [
        { mark: 'ok', text: 'Tối ưu hàm chạy 1000 lần thì tiết kiệm được gần như không gì' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Thứ tự đúng: **đo → tìm điểm nóng → sửa → đo lại**. Bỏ bước nào cũng hỏng' },
        { mark: 'next', text: '**Ngày 60**: bài tổng hợp — ghép cả JVM, test, Maven, CI, log lại một chỗ' },
      ],
    },
  ],

  /* Output THẬT của `java DoHieuNang` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) 10000 lan tim trong List 20000 phan tu -> 50005000 phep so sanh',
      '2) doi sang HashSet -> 10000 phep so sanh (giam 5000 lan)',
      "3) noi 10000 doan: dau '+' chep 250025000 ky tu, StringBuilder chep 73665",
      '4) do 5 lan, lay TRUNG VI -> StringBuilder nhanh hon it nhat 20 lan? true',
      '5) dem loi goi -> doiTien 1000 | chuanHoaTen 1000000',
      '6) diem nong = chuanHoaTen, chiem 99.9% loi goi',
    ],
  },

  verify: {
    className: 'DoHieuNang',
    source: `import java.util.*;

/* Do dac thay vi doan mo. Moi con so o day la DEM PHEP TINH (khong doi theo
   lan chay); rieng phep so sanh thoi gian in ra NGUONG chu khong in mili-giay. */
public class DoHieuNang {

    static long soSanh = 0;   // dem so phep so sanh thuc su xay ra

    /* Tim tuyen tinh: phai duyet tung phan tu — dung cach List lam viec. */
    static boolean timTrongDanhSach(List<Integer> ds, int can) {
        for (int x : ds) {
            soSanh++;
            if (x == can) return true;
        }
        return false;
    }

    /* Tim theo bang bam: nhay thang toi o, chi so 1 lan de xac nhan. */
    static boolean timTrongBangBam(Set<Integer> tap, int can) {
        soSanh++;
        return tap.contains(can);
    }

    /* Dem so KY TU phai chep khi noi chuoi bang dau '+':
       moi lan noi la tao chuoi moi = chep lai toan bo phan da co. */
    static long chepKhiDungCong(int soDoan, int doDaiDoan) {
        long chep = 0, dangCo = 0;
        for (int i = 0; i < soDoan; i++) {
            chep += dangCo + doDaiDoan;
            dangCo += doDaiDoan;
        }
        return chep;
    }

    /* StringBuilder chi chep khi mang day va phai no ra: (cu << 1) + 2. */
    static long chepKhiDungStringBuilder(int soDoan, int doDaiDoan) {
        long chep = 0;
        int sucChua = 16, dangCo = 0;
        for (int i = 0; i < soDoan; i++) {
            int can = dangCo + doDaiDoan;
            if (can > sucChua) {
                sucChua = Math.max((sucChua << 1) + 2, can);
                chep += dangCo;                 // chep phan da co sang mang moi
            }
            dangCo = can;
        }
        return chep;
    }

    static long noiBangCong(int soDoan) {
        String s = "";
        for (int i = 0; i < soDoan; i++) s = s + "abcde";
        return s.length();
    }

    static long noiBangStringBuilder(int soDoan) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < soDoan; i++) sb.append("abcde");
        return sb.length();
    }

    /* Mot chuong trinh gia de xem "diem nong" that su nam o dau. */
    static long goiDoiTien = 0, goiChuanHoaTen = 0;

    static void doiTien(long xu) { goiDoiTien++; }

    static void chuanHoaTen(String ten) { goiChuanHoaTen++; }

    static void chayNghiepVu() {
        for (int donHang = 0; donHang < 1000; donHang++) {
            doiTien(199000L);                       // trong "nang" ma goi it
            for (int mon = 0; mon < 1000; mon++) {
                chuanHoaTen("Nguyen Van A");        // trong "nhe" ma goi rat nhieu
            }
        }
    }

    public static void main(String[] args) {
        final int SO_LAN_TIM = 10_000;

        // (1) tim tuyen tinh trong List
        List<Integer> danhSach = new ArrayList<>();
        for (int i = 0; i < 20_000; i++) danhSach.add(i);
        soSanh = 0;
        for (int can = 0; can < SO_LAN_TIM; can++) timTrongDanhSach(danhSach, can);
        long soSanhList = soSanh;
        System.out.println("1) " + SO_LAN_TIM + " lan tim trong List 20000 phan tu -> "
                + soSanhList + " phep so sanh");

        // (2) PHEP THU RIENG: cung tung ay lan tim, doi sang HashSet
        Set<Integer> bangBam = new HashSet<>(danhSach);
        soSanh = 0;
        for (int can = 0; can < SO_LAN_TIM; can++) timTrongBangBam(bangBam, can);
        long soSanhSet = soSanh;
        System.out.println("2) doi sang HashSet -> " + soSanhSet + " phep so sanh (giam "
                + (soSanhList / soSanhSet) + " lan)");

        // (3) dem so ky tu phai chep khi noi 10000 doan
        final int SO_DOAN = 10_000, DAI_DOAN = 5;
        System.out.println("3) noi " + SO_DOAN + " doan: dau '+' chep "
                + chepKhiDungCong(SO_DOAN, DAI_DOAN) + " ky tu, StringBuilder chep "
                + chepKhiDungStringBuilder(SO_DOAN, DAI_DOAN));

        // (4) do THAT, nhung in NGUONG chu khong in mili-giay (so do doi moi lan chay)
        for (int i = 0; i < 3; i++) { noiBangCong(2000); noiBangStringBuilder(2000); }  // lam nong JIT
        List<Long> tiSo = new ArrayList<>();
        for (int lan = 0; lan < 5; lan++) {
            long t0 = System.nanoTime(); noiBangCong(SO_DOAN);
            long t1 = System.nanoTime(); noiBangStringBuilder(SO_DOAN);
            long t2 = System.nanoTime();
            tiSo.add((t1 - t0) / Math.max(1, t2 - t1));
        }
        Collections.sort(tiSo);
        long trungVi = tiSo.get(tiSo.size() / 2);
        System.out.println("4) do 5 lan, lay TRUNG VI -> StringBuilder nhanh hon it nhat 20 lan? "
                + (trungVi >= 20));

        // (5)(6) diem nong that su nam o dau
        chayNghiepVu();
        long tong = goiDoiTien + goiChuanHoaTen;
        System.out.println("5) dem loi goi -> doiTien " + goiDoiTien
                + " | chuanHoaTen " + goiChuanHoaTen);
        System.out.println("6) diem nong = chuanHoaTen, chiem "
                + (goiChuanHoaTen * 1000 / tong) / 10.0 + "% loi goi");
    }
}`,
  },
};
