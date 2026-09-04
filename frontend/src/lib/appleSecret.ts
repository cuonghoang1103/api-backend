/**
 * ============================================================
 * BÍ MẬT KHÁCH HÀNG CỦA "ĐĂNG NHẬP BẰNG APPLE"
 * ============================================================
 *
 * Google và GitHub cho một chuỗi bí mật cố định. Apple thì KHÔNG: `client_secret`
 * của Apple là một **JWT do chính ta ký** bằng khoá `.p8` tải từ Apple Developer,
 * và nó **HẾT HẠN — tối đa 6 tháng**.
 *
 * Vì thế có hai cách, và ta làm cả hai:
 *
 *  A. **Tự ký mỗi lần khởi động** (đường chính). Chỉ cần 4 biến môi trường, và
 *     mỗi lần deploy là một bí mật mới. Không ai phải nhớ ngày gia hạn.
 *  B. `APPLE_CLIENT_SECRET` dán sẵn (đường lùi). Dùng khi không muốn để khoá
 *     `.p8` trên máy chủ. Đổi lại: **phải tự tay tạo lại trước khi hết 6 tháng**,
 *     và ngày nó chết sẽ là một ngày bình thường, không có deploy nào, không ai
 *     đụng vào gì — đúng kiểu hỏng khó truy nhất.
 *
 * ⚠️ Vì sao ký bằng `node:crypto` chứ không phải `jose` (đã có sẵn trong dự án):
 * `jose` ký **bất đồng bộ**, mà `clientSecret` phải là một CHUỖI có ngay lúc dựng
 * object cấu hình NextAuth. `crypto.sign()` chạy đồng bộ nên hợp chỗ này.
 *
 * ⚠️ Chữ ký ES256 trong JWT là **R‖S thô**, KHÔNG phải DER. Thiếu
 * `dsaEncoding: 'ieee-p1363'` thì Node trả DER, JWT vẫn trông đúng hình dạng, và
 * Apple từ chối với `invalid_client` — một thông báo không hề nhắc tới chữ ký.
 */
import { createPrivateKey, sign } from 'node:crypto';

/** Apple cho tối đa 6 tháng (15777000 giây). Lấy 150 ngày cho có biên an toàn. */
const SONG_GIAY = 150 * 24 * 60 * 60;

function base64url(b: Buffer): string {
  return b.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export interface CauHinhApple {
  clientId: string;
  teamId: string;
  keyId: string;
  privateKey: string;
}

/** Đọc cấu hình Apple từ env. `null` = chưa cấu hình (KHÔNG phải lỗi). */
export function docCauHinhApple(): CauHinhApple | null {
  const clientId = process.env.APPLE_CLIENT_ID?.trim();
  const teamId = process.env.APPLE_TEAM_ID?.trim();
  const keyId = process.env.APPLE_KEY_ID?.trim();
  /* Biến môi trường không chứa được xuống dòng thật, nên khoá `.p8` thường được
     dán dưới dạng `\n` hai ký tự. Không đổi lại thì `createPrivateKey` ném. */
  const privateKey = process.env.APPLE_PRIVATE_KEY?.replace(/\\n/g, '\n').trim();
  if (!clientId || !teamId || !keyId || !privateKey) return null;
  return { clientId, teamId, keyId, privateKey };
}

/** Ký `client_secret`. Ném nếu khoá hỏng — gọi trong try/catch. */
export function kyBiMatApple(c: CauHinhApple, bayGio = Math.floor(Date.now() / 1000)): string {
  const header = { alg: 'ES256', kid: c.keyId, typ: 'JWT' };
  const payload = {
    iss: c.teamId,
    iat: bayGio,
    exp: bayGio + SONG_GIAY,
    aud: 'https://appleid.apple.com',
    sub: c.clientId, // Services ID, KHÔNG phải Bundle ID của app iOS
  };
  const phanDau =
    `${base64url(Buffer.from(JSON.stringify(header)))}.` +
    `${base64url(Buffer.from(JSON.stringify(payload)))}`;
  const khoa = createPrivateKey(c.privateKey);
  const chuKy = sign('sha256', Buffer.from(phanDau), { key: khoa, dsaEncoding: 'ieee-p1363' });
  return `${phanDau}.${base64url(chuKy)}`;
}

/**
 * Bí mật dùng được, hoặc `null` nếu Apple chưa được bật.
 *
 * KHÔNG ném ra ngoài: thiếu cấu hình Apple thì phần còn lại của trang đăng nhập
 * (Google, GitHub, mật khẩu) vẫn phải chạy bình thường.
 */
export function biMatApple(): string | null {
  const dan = process.env.APPLE_CLIENT_SECRET?.trim();
  if (dan) return dan;

  const c = docCauHinhApple();
  if (!c) return null;

  try {
    return kyBiMatApple(c);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(
      '[apple] Không ký được client_secret — kiểm tra APPLE_PRIVATE_KEY có đúng ' +
      'nội dung file .p8 (gồm cả dòng BEGIN/END PRIVATE KEY) không:',
      e instanceof Error ? e.message : e,
    );
    return null;
  }
}

/** Apple có bật không — trang đăng nhập hỏi cái này để quyết định vẽ nút. */
export function appleDaBat(): boolean {
  return biMatApple() !== null && Boolean(process.env.APPLE_CLIENT_ID?.trim());
}
