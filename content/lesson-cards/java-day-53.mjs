/**
 * Thẻ bài học "100 Ngày Java" — Ngày 53: JUnit & viết test.
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-53.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ JUnit là THƯ VIỆN NGOÀI mà thẻ chạy bằng JDK thuần (`javac` + `java`,
 * không classpath). Nên chương trình kiểm chứng dựng lại NGUYÊN LÝ của JUnit
 * bằng JDK thuần — assert, kiểm ngoại lệ, đếm đạt/hỏng — còn cú pháp JUnit
 * thật thì dạy trong thân bài. Thà chứng minh cơ chế còn hơn dán code không
 * chạy được lên thẻ.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 53,
  total: 100,
  titleLead: 'Java Day 53:',
  titleAccent: 'Viết test',
  subtitle: 'Để máy kiểm tra thay bạn — ranh giới code sinh viên và code đi làm ✅',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. THAY VÌ NHÌN MÀN HÌNH ✅',
      code: `// cach cu: chay main, in ra, MAT nhin
System.out.println(chia(10, 2));   // "5, chac dung roi"

// cach dung: MAY so ho
kiem("chia binh thuong", 5, chia(10, 2));
// -> 7 phep kiem DAT, 0 HONG`,
      notes: [
        { mark: 'ok', text: 'Sửa code cũ xong chạy lại toàn bộ trong một giây — không ai phải nhớ kiểm gì' },
        { mark: 'dot', text: 'JUnit chính là khung này, viết sẵn và mạnh hơn' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. CÚ PHÁP JUNIT 5 📝',
      code: `@Test
void chia_binh_thuong() {
    assertEquals(5, MayTinh.chia(10, 2));
}

@Test
void chia_cho_0_thi_nem() {
    assertThrows(IllegalArgumentException.class, () -> MayTinh.chia(1, 0));
}`,
      notes: [
        { mark: 'ok', text: 'Tên test đặt theo NGHIỆP VỤ để khi đỏ là biết ngay hỏng cái gì' },
        { mark: 'dot', text: '`@BeforeEach` dựng dữ liệu · `@ParameterizedTest` chạy nhiều bộ đầu vào' },
      ],
    },
    {
      tone: 'pink',
      title: '3. KIỂM CẢ ĐƯỜNG HỎNG 💥',
      code: `assertThrows(...)      // phai nem dung loai
assertEquals("Kha", xepLoai(7.99))    // BIEN — cho bug hay nap
assertEquals("Xuat sac", xepLoai(9.0))`,
      notes: [
        { mark: 'no', text: 'Chỉ kiểm đường đúng là bỏ sót đúng chỗ hay vỡ nhất' },
        { mark: 'ok', text: 'Ba nhóm cần có: bình thường · **biên** · lỗi' },
      ],
    },
    {
      tone: 'green',
      title: '4. KHI TEST ĐỎ, NÓ PHẢI NÓI RÕ 🔴',
      code: `"co tinh sai: mong 100 nhung nhan 5"
// -> doc mot dong la biet sai o dau, khong can mo debugger`,
      notes: [
        { mark: 'ok', text: 'Test tốt là test khi hỏng thì tự chỉ ra vấn đề' },
        { mark: 'no', text: 'Test phụ thuộc nhau hoặc phụ thuộc thứ tự chạy = test dối' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Code không test = code không ai dám sửa' },
        { mark: 'next', text: '**Ngày 54**: Mockito — kiểm code có gọi DB, gọi API' },
      ],
    },
  ],

  /* Output THẬT của `java KhungTest` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      '1) so phep kiem DAT -> 7',
      '2) so phep kiem HONG -> 0',
      '3) tat ca deu dat? true',
      '4) sau khi them 1 phep sai -> hong = 1',
      '5) thong bao loi -> co tinh sai: mong 100 nhung nhan 5',
      '6) test chay tu dong, khong can nhin man hinh: 8 phep kiem',
    ],
  },

  verify: {
    className: 'KhungTest',
    source: `import java.util.*;

public class KhungTest {

    static int chia(int a, int b) {
        if (b == 0) throw new IllegalArgumentException("Khong chia cho 0");
        return a / b;
    }
    static String xepLoai(double d) {
        if (d < 0 || d > 10) throw new IllegalArgumentException("Diem ngoai 0-10");
        if (d >= 9) return "Xuat sac";
        if (d >= 8) return "Gioi";
        return "Kha";
    }

    static int dat = 0, hong = 0;
    static final List<String> loi = new ArrayList<>();

    static void kiem(String ten, Object mongDoi, Object thucTe) {
        if (Objects.equals(mongDoi, thucTe)) dat++;
        else { hong++; loi.add(ten + ": mong " + mongDoi + " nhung nhan " + thucTe); }
    }

    static void kiemNem(String ten, Class<? extends Throwable> loaiMong, Runnable viec) {
        try { viec.run(); hong++; loi.add(ten + ": khong nem gi ca"); }
        catch (Throwable t) {
            if (loaiMong.isInstance(t)) dat++;
            else { hong++; loi.add(ten + ": nem nham " + t.getClass().getSimpleName()); }
        }
    }

    public static void main(String[] args) {
        kiem("chia binh thuong", 5, chia(10, 2));
        kiem("xep loai 9.5", "Xuat sac", xepLoai(9.5));
        kiem("xep loai 8.0", "Gioi", xepLoai(8.0));

        kiem("bien 9.0", "Xuat sac", xepLoai(9.0));
        kiem("bien 7.99", "Kha", xepLoai(7.99));

        kiemNem("chia cho 0", IllegalArgumentException.class, () -> chia(1, 0));
        kiemNem("diem 99", IllegalArgumentException.class, () -> xepLoai(99));

        System.out.println("1) so phep kiem DAT -> " + dat);
        System.out.println("2) so phep kiem HONG -> " + hong);
        System.out.println("3) tat ca deu dat? " + (hong == 0));

        kiem("co tinh sai", 100, chia(10, 2));
        System.out.println("4) sau khi them 1 phep sai -> hong = " + hong);
        System.out.println("5) thong bao loi -> " + loi.get(0));
        System.out.println("6) test chay tu dong, khong can nhin man hinh: " + (dat + hong) + " phep kiem");
    }
}`,
  },
};
