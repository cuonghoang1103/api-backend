/**
 * Deep Dive — mật mã ứng dụng: AES, RSA, chữ ký số.
 *
 * Prose nằm ở file `.md` cùng tên (giống các bài khác: bài đầy khối code có
 * dấu backtick, nhét vào template literal thì phải escape hết).
 *
 * BÀI NÀY BẮT ĐẦU TỪ MỘT CHUYỆN THẬT và đó là cái giữ người đọc: một file bài
 * thi `.dat` tải về từ hệ thống thi của trường, mở ra không được. Mọi con số
 * trong bài đều ĐO THẬT bằng script, không phải nhớ lại hay ước lượng — nếu
 * sửa bài, hãy đo lại chứ đừng chỉnh số cho "tròn":
 *
 *   · entropy file thi thật              7,9918 / 8,0
 *   · entropy 23.744 byte tự mã hoá      7,9928 / 8,0   (khớp ⇒ đúng là AES)
 *   · chi-square 272,9 · IC 0,00391      (ngẫu nhiên chuẩn: 255 · 0,0039)
 *   · hiệu ứng tuyết lở                  50,04% (trung bình 2000 phép thử)
 *   · AES vs RSA trên 1 MB               2,1 ms vs ~3,2 giây ⇒ ~1.520 lần
 *   · RSA-2048 mã hoá tối đa             ~190 byte/lần (300 byte đã lỗi)
 *   · 2^256 theo giới hạn Landauer       3,3e56 J, gấp 2,7 nghìn tỉ lần toàn
 *                                        bộ năng lượng cả đời Mặt Trời
 *
 * THÍ NGHIỆM ECB (mục 3) là hình thuyết phục nhất bài — ảnh ổ khoá mã hoá bằng
 * AES-ECB vẫn nhìn rõ nguyên hình, kèm số đo: bản gốc 64 khối 16-byte trùng
 * lặp, ECB cũng đúng 64, GCM thì 0. Sơ đồ được SINH RA từ dữ liệu mã hoá thật
 * bằng scratchpad/gen-ecb-svg.mjs chứ không vẽ tay. Nếu vẽ lại, phải chạy lại
 * script — vẽ tay một "hình có vẻ giống ECB" là đúng thứ bài này đang phê phán.
 *
 * BỐ CỤC 7 SƠ ĐỒ được kiểm bằng bộ dò tự động (đo getBBox từng thẻ <text>, bắt
 * chữ tràn viewBox và chữ đè nhau). Nó bắt được lỗi số 2^256 tràn khung mà đọc
 * bằng mắt đã bỏ sót hai lần. Sửa sơ đồ thì chạy lại bộ dò, đừng tin mắt.
 *
 * LIÊN HỆ VỚI MÃ NGUỒN: mục 5 mô tả `src/utils/crypto.ts` có thật trong repo
 * này (13 test ở `crypto.test.ts`). Nếu module đó đổi API, sửa cả mục 5 — một
 * bài dạy mật mã mà code trong bài không khớp code thật là mất sạch uy tín,
 * đúng kiểu lỗi mà mục 8 đang lấy làm ví dụ.
 *
 * Ảnh: 8 file SVG tự phục vụ ở frontend/public/deepdives/crypto/. CSP của site
 * đặt `img-src 'self' data:` nên ảnh ngoài bị chặn, và seeder thoát khác 0 nếu
 * thiếu file — đừng đổi tên một phía.
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./ma-hoa-aes-rsa-chu-ky-so.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'ma-hoa-aes-rsa-chu-ky-so',
  title: 'Mã hoá cho lập trình viên: AES, RSA, chữ ký số — và vì sao đừng bao giờ tự viết thuật toán',
  summary:
    'Bắt đầu từ một file bài thi .dat mở ra không được: entropy 7,99 nói lên điều gì, vì sao dò khoá AES là bất khả thi về mặt VẬT LÝ chứ không phải "rất khó", AES khác RSA ra sao (đo thật: chênh ~1.520 lần). Kèm thí nghiệm ECB làm lộ nguyên hình ổ khoá và sáu vụ sập kinh điển.',
  category: 'DeepDive',
  tags: ['bao-mat', 'ma-hoa', 'aes', 'rsa', 'chu-ky-so', 'nodejs', 'backend'],
  coverEmoji: '🔐',
  coverImageUrl: '/deepdives/crypto/cover.svg',
  readTimeMin: 22,
  isFeatured: true,
  trendingScore: 78,
  status: 'PUBLISHED',
  bodyMdx,
};
