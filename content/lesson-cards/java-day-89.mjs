/**
 * Thẻ bài học "100 Ngày Java" — Ngày 89: Caching (Blog API).
 *
 * Đây là file DỮ LIỆU: mỗi ngày mới chỉ cần một file như thế này, không phải
 * đụng vào scripts/gen-lesson-card.mjs.
 *
 *   node scripts/gen-lesson-card.mjs --file ./content/lesson-cards/java-day-89.mjs
 *
 * ⚠ MỌI đoạn `code` bên dưới phải được BIÊN DỊCH VÀ CHẠY THẬT trước khi in lên
 * thẻ, rồi dán output thật vào `proof`.
 *
 * ⚠⚠ LUẬT 1 + 6: cache dựng bằng JDK thuần, đồng hồ LOGIC (truyền giờ, không
 * now()) → tất định; đếm SỐ LẦN TÍNH THẬT (cố định). Cú pháp @Cacheable dạy ở
 * thân bài.
 */
export default {
  series: '100 NGÀY JAVA',
  day: 89,
  total: 100,
  titleLead: 'Java Day 89:',
  titleAccent: 'Caching',
  subtitle: 'Nhớ kết quả nặng — và câu hỏi khó: khi nào xoá? ⚡',
  site: 'cuongthai.com',

  sections: [
    {
      tone: 'blue',
      title: '1. HIT vs MISS: KHỎI TÍNH LẠI ⚡',
      code: `goi 'bai-hot' 100 lan (con han)
-> tinh that 1 lan (99 lan cache HIT)`,
      notes: [
        { mark: 'ok', text: 'Lần đầu tính thật (MISS) + lưu; các lần sau lấy cache (HIT)' },
        { mark: 'dot', text: '100 lượt đọc mà chỉ 1 lần chạy việc nặng — nhanh gấp ~100' },
      ],
    },
    {
      tone: 'yellow',
      title: '2. XOÁ CACHE KHI DỮ LIỆU ĐỔI 🔄',
      code: `sua bai -> XOA cache (invalidate)
-> goi lai phai tinh lai`,
      notes: [
        { mark: 'no', text: 'Quên xoá → phục vụ dữ liệu CŨ (bài đã sửa mà vẫn hiện bản cũ)' },
        { mark: 'ok', text: 'Ghi/sửa/xoá bài thì xoá ô cache tương ứng' },
      ],
    },
    {
      tone: 'pink',
      title: '3. TTL: TỰ QUÊN SAU MỘT LÚC ⏳',
      code: `TTL=10, goi luc 0/5/20
-> tinh that 2 lan (luc 5 HIT, luc 20 het han)`,
      notes: [
        { mark: 'ok', text: 'Đặt hạn sống cho cache — hết hạn tự quên, tránh dữ liệu cũ mãi' },
        { mark: 'dot', text: 'TTL ngắn: tươi hơn nhưng ít hit; dài: nhanh hơn nhưng dễ cũ' },
      ],
    },
    {
      tone: 'green',
      title: '4. @Cacheable / @CacheEvict 🌱',
      code: `@Cacheable("bai")   int dem(String slug)
@CacheEvict("bai")  void sua(String slug)`,
      notes: [
        { mark: 'ok', text: '`@Cacheable` tự nhớ theo tham số; `@CacheEvict` xoá khi sửa' },
        { mark: 'dot', text: 'Cache chung nhiều máy chủ → Redis (nhớ Ngày 78)' },
      ],
    },
    {
      tone: 'blue',
      title: '5. GHI NHỚ 📌',
      notes: [
        { mark: 'ok', text: 'Chỉ cache thứ ĐỌC NHIỀU-ĐỔI ÍT; và luôn có kế hoạch xoá' },
        { mark: 'next', text: '**Ngày 90**: xử lý nền — @Async, tác vụ định kỳ @Scheduled' },
      ],
    },
  ],

  /* Output THẬT của `java MoPhongCache` trên JDK 21 — không phải viết tay. */
  proof: {
    label: 'Đã biên dịch & chạy thật · JDK 21',
    lines: [
      "1) goi 'bai-hot' 100 lan (con han) -> tinh that 1 lan (99 lan cache HIT)",
      '2) tiet kiem: 100 lan doc nhung chi 1 lan chay viec nang',
      '3) sua bai -> XOA cache -> goi lai tinh lai? true (tong tinh that 2)',
      '4) TTL=10, goi luc 0/5/20 -> tinh that 2 lan (luc 5 HIT, luc 20 het han)',
      '5) cache dung theo KHOA: khoa khac nhau -> o cache khac nhau',
      '6) kho nhat: XOA cache dung luc — quen xoa -> phuc vu du lieu CU',
    ],
  },

  verify: {
    className: 'MoPhongCache',
    source: `import java.util.*;

/* Blog API — caching. Dung lai NGUYEN LY cache bang JDK thuan: nho ket qua
   viec NANG de lan sau khoi tinh lai (HIT vs MISS), XOA cache khi du lieu doi
   (invalidate) va HET HAN theo TTL. Dong ho LOGIC (truyen 'gio', khong now())
   nen TAT DINH. Dem so lan TINH THAT de thay tiet kiem. */
public class MoPhongCache {

    static int soLanTinhThat = 0;
    static final Map<String, Integer> CACHE = new HashMap<>();
    static final Map<String, Long> HET_HAN = new HashMap<>();

    /* Viec NANG: gia lam mot phep tinh ton kem (dem binh luan, tong hop...). */
    static int tinhNang(String bai) {
        soLanTinhThat++;
        return bai.length() * 10;
    }

    /* Lay co cache: con han thi tra cache (HIT), nguoc lai tinh that (MISS). */
    static int lay(String bai, long gio, long ttl) {
        Long hh = HET_HAN.get(bai);
        if (CACHE.containsKey(bai) && hh != null && gio < hh) return CACHE.get(bai);   // HIT
        int kq = tinhNang(bai);                                                        // MISS
        CACHE.put(bai, kq);
        HET_HAN.put(bai, gio + ttl);
        return kq;
    }

    static void xoaCache(String bai) { CACHE.remove(bai); HET_HAN.remove(bai); }       // invalidate

    public static void main(String[] args) {
        final long TTL = 1000;

        // (1)(2) khoa NONG: goi 100 lan, chi tinh that 1 lan
        for (int i = 0; i < 100; i++) lay("bai-hot", i, TTL);
        System.out.println("1) goi 'bai-hot' 100 lan (con han) -> tinh that " + soLanTinhThat + " lan (99 lan cache HIT)");
        System.out.println("2) tiet kiem: 100 lan doc nhung chi 1 lan chay viec nang");

        // (3) INVALIDATE khi du lieu doi: sua bai -> xoa cache -> goi lai phai tinh
        int truoc = soLanTinhThat;
        xoaCache("bai-hot");
        lay("bai-hot", 101, TTL);
        System.out.println("3) sua bai -> XOA cache -> goi lai tinh lai? " + (soLanTinhThat > truoc)
                + " (tong tinh that " + soLanTinhThat + ")");

        // (4)(5) TTL het han: dung cache rieng cho ro
        soLanTinhThat = 0; CACHE.clear(); HET_HAN.clear();
        lay("x", 0, 10);    // MISS -> tinh (het han tai 10)
        lay("x", 5, 10);    // 5 < 10 -> HIT
        lay("x", 20, 10);   // 20 >= 10 -> het han -> tinh lai
        System.out.println("4) TTL=10, goi luc 0/5/20 -> tinh that " + soLanTinhThat + " lan (luc 5 HIT, luc 20 het han)");
        System.out.println("5) cache dung theo KHOA: khoa khac nhau -> o cache khac nhau");

        // (6) bai hoc kho nhat cua caching
        System.out.println("6) kho nhat: XOA cache dung luc — quen xoa -> phuc vu du lieu CU");
    }
}`,
  },
};
