import { X509Certificate, verify as verifyChuKy } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// ════════════════════════════════════════════════════════════════
// XÁC MINH CHỮ KÝ CỦA APPLE (JWS) — cổng tiền của App Store
//
// StoreKit 2 và App Store Server API không trả JSON thường; chúng trả **JWS**:
// `header.payload.signature`, ký ES256, và `header.x5c` mang sẵn chuỗi chứng
// thư [lá, trung gian, gốc] dạng DER base64.
//
// ⛔⛔ CÁI BẪY CHẾT NGƯỜI, và nó trông rất giống mã đúng:
//
//     const { x5c } = JSON.parse(header);
//     const la = new X509Certificate(Buffer.from(x5c[0], 'base64'));
//     verify(..., la.publicKey, chuKy)     // ← "đã xác minh chữ ký" 
//
// Đoạn trên xác minh rằng payload được ký bởi **chính cái chứng thư nằm trong
// payload đó**. Kẻ tấn công tự tạo một cặp khoá, tự ký một chứng thư, tự ký
// giao dịch "đã mua gói 12 tháng", nhét chứng thư của mình vào `x5c` — và
// đoạn mã trên nói ĐÚNG. Ai cũng lấy được Pro miễn phí, log không có gì lạ.
//
// Chữ ký chỉ có nghĩa khi truy được về một GỐC ĐÃ BIẾT TRƯỚC. Vì thế ở đây:
//   1. chuỗi phải nối liền: lá ← trung gian ← gốc (kiểm bằng `verify()` mật mã)
//   2. chứng thư gốc phải khớp ĐÚNG vân tay SHA-256 của Apple Root CA - G3
//      (ghim cứng bên dưới, KHÔNG lấy từ x5c)
//   3. mọi chứng thư còn hạn tại thời điểm kiểm
//   4. rồi mới tới chữ ký trên `header.payload`
//
// Vân tay ghim dưới đây đã đối chiếu hai nguồn ĐỘC LẬP ngày 14/09/2026:
// tải từ apple.com/certificateauthority, và bản có sẵn trong
// `/System/Library/Keychains/SystemRootCertificates.keychain` của macOS.
// Hai bên trùng khít.
// ════════════════════════════════════════════════════════════════

/// Vân tay SHA-256 của **Apple Root CA - G3**. Ghim cứng có chủ đích: file
/// `.cer` cạnh đây chỉ là bản tiện dụng, còn thứ quyết định là con số này.
/// Đổi nó = đổi ai được phép in ra tiền cho hệ thống.
export const VAN_TAY_GOC_APPLE =
  '63:34:3A:BF:B8:9A:6A:03:EB:B5:7E:9B:3F:5F:A7:BE:7C:4F:5C:75:6F:30:17:B3:A8:C4:88:C3:65:3E:91:79';

const thuMuc = dirname(fileURLToPath(import.meta.url));

let _gocApple: X509Certificate | null = null;
/// Chứng thư gốc của Apple, đọc một lần. Đọc xong vẫn KIỂM LẠI vân tay — file
/// trên đĩa có thể bị thay, hằng số trong mã thì đi theo commit.
export function gocApple(): X509Certificate {
  if (_gocApple) return _gocApple;
  const c = new X509Certificate(readFileSync(join(thuMuc, 'AppleRootCA-G3.cer')));
  if (c.fingerprint256 !== VAN_TAY_GOC_APPLE) {
    throw new Error('AppleRootCA-G3.cer trên đĩa KHÔNG khớp vân tay đã ghim — dừng lại');
  }
  _gocApple = c;
  return c;
}

export class LoiChuKyApple extends Error {
  constructor(public readonly ly: string) {
    super(`Chữ ký Apple không hợp lệ: ${ly}`);
    this.name = 'LoiChuKyApple';
  }
}

/// Giải mã một khúc base64url của JWS.
function giaiMa(khuc: string): Buffer {
  return Buffer.from(khuc, 'base64url');
}

export interface TuyChonXacMinh {
  /// Gốc tin cậy. Mặc định là Apple. Phép kiểm truyền gốc riêng vào để dựng
  /// được chuỗi giả mà không phải có khoá riêng của Apple.
  goc?: X509Certificate;
  /// Mốc thời gian coi là "bây giờ" — để kiểm được nhánh hết hạn.
  bayGio?: Date;
}

/// Xác minh JWS của Apple và trả về phần payload đã giải mã.
///
/// Ném `LoiChuKyApple` nếu bất cứ bước nào không đạt. KHÔNG có đường trả về
/// "hợp lệ một phần" — với tiền thì chỉ có đạt hoặc trượt.
export function xacMinhJWS<T = unknown>(jws: string, tuyChon: TuyChonXacMinh = {}): T {
  const goc = tuyChon.goc ?? gocApple();
  const bayGio = tuyChon.bayGio ?? new Date();

  const khuc = jws.split('.');
  if (khuc.length !== 3) throw new LoiChuKyApple('không phải JWS ba khúc');
  const [hB64, pB64, sB64] = khuc;

  let header: { alg?: string; x5c?: string[] };
  try {
    header = JSON.parse(giaiMa(hB64).toString('utf8'));
  } catch {
    throw new LoiChuKyApple('header không phải JSON');
  }

  // Apple ký ES256. Nhận `alg` khác là mở cửa cho đòn "alg: none" và đòn đổi
  // ES256 sang HS256 (biến khoá CÔNG KHAI thành khoá bí mật của HMAC).
  if (header.alg !== 'ES256') throw new LoiChuKyApple(`alg phải là ES256, nhận "${header.alg}"`);

  const x5c = header.x5c;
  if (!Array.isArray(x5c) || x5c.length < 2) {
    throw new LoiChuKyApple('header thiếu chuỗi chứng thư x5c');
  }

  let chuoi: X509Certificate[];
  try {
    chuoi = x5c.map((c) => new X509Certificate(Buffer.from(c, 'base64')));
  } catch {
    throw new LoiChuKyApple('x5c chứa chứng thư không đọc được');
  }

  // ── 1. Gốc mà JWS tự khai phải ĐÚNG là gốc ta tin ─────────────
  //
  // So bằng vân tay chứ không so tên: tên là chuỗi ai cũng gõ được, vân tay
  // là băm của toàn bộ chứng thư.
  const gocKhai = chuoi[chuoi.length - 1];
  if (gocKhai.fingerprint256 !== goc.fingerprint256) {
    throw new LoiChuKyApple('chuỗi chứng thư không dẫn về gốc đã ghim');
  }

  // ── 2. Chuỗi phải nối liền, và từng mắt còn hạn ───────────────
  for (let i = 0; i < chuoi.length; i++) {
    const c = chuoi[i];
    if (new Date(c.validFrom) > bayGio || new Date(c.validTo) < bayGio) {
      throw new LoiChuKyApple(`chứng thư thứ ${i} ngoài thời hạn hiệu lực`);
    }
    // Mắt cuối là gốc — nó tự ký, đã đối chiếu vân tay ở bước 1.
    if (i === chuoi.length - 1) break;
    if (!c.verify(chuoi[i + 1].publicKey)) {
      throw new LoiChuKyApple(`chứng thư thứ ${i} không do chứng thư thứ ${i + 1} ký`);
    }
  }

  // ── 3. Chữ ký trên chính nội dung ─────────────────────────────
  //
  // ⚠️ JWS dùng chữ ký ECDSA dạng THÔ `r||s` (64 byte), còn mặc định của Node
  // là DER. Không khai `ieee-p1363` thì mọi chữ ký THẬT đều bị coi là sai —
  // hỏng theo kiểu an toàn nhưng vẫn là hỏng, và rất khó đoán ra.
  // ⚠️ `X509Certificate.publicKey` ĐÃ là một KeyObject công khai. Bọc thêm
  // một lớp `createPublicKey()` quanh nó thì Node ném
  // `ERR_CRYPTO_INVALID_KEY_OBJECT_TYPE` — hàm đó chỉ nhận khoá RIÊNG để suy
  // ra khoá công khai. Bản đầu viết đúng như vậy và mọi chữ ký THẬT đều nổ,
  // trong khi các phép kiểm chữ ký-sai vẫn "đạt" vì chúng ném trước khi tới
  // đây. Phép kiểm đạt không có nghĩa là nhánh đó đã chạy.
  const hopLe = verifyChuKy(
    'sha256',
    Buffer.from(`${hB64}.${pB64}`),
    { key: chuoi[0].publicKey, dsaEncoding: 'ieee-p1363' },
    giaiMa(sB64),
  );
  if (!hopLe) throw new LoiChuKyApple('chữ ký không khớp nội dung');

  try {
    return JSON.parse(giaiMa(pB64).toString('utf8')) as T;
  } catch {
    throw new LoiChuKyApple('payload không phải JSON');
  }
}
