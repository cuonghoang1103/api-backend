/**
 * Gọi backend TỪ PHÍA MÁY CHỦ (route handler, callback của NextAuth).
 *
 * ⛔ VÌ SAO CÓ FILE NÀY — sự cố thật 19/08/2026.
 *
 * Người dùng đăng nhập bằng Google xong thì: không tìm thấy tài khoản trong hệ
 * thống, trang cá nhân quay mãi, nhập mã Pro báo sai. Ba triệu chứng, một gốc:
 *
 *     [nextauth] backend unreachable: TypeError: fetch failed
 *
 * Callback `jwt` của NextAuth gọi `${BACKEND_URL}/api/v1/auth/oauth/register`
 * để tạo tài khoản ở backend. Lời gọi đó HỎNG, nhưng callback chỉ ghi log rồi
 * `return token` — nên NextAuth vẫn cấp phiên. Người dùng thấy mình đã đăng
 * nhập, mà backend thì chưa hề có tài khoản nào. Mọi thứ sau đó đều sai theo.
 *
 * Hai nguyên nhân cộng lại, sửa cả hai:
 *
 *  1. ĐI VÒNG RA INTERNET. `BACKEND_URL=https://api.cuongthai.com`, nên một lời
 *     gọi giữa hai container CẠNH NHAU phải ra DNS công cộng, qua Cloudflare,
 *     rồi vòng lại chính máy đó. Đo được: đường công khai 251ms cho lần gọi
 *     đầu, đường nội bộ 5ms — nhanh hơn 50 lần và không phụ thuộc thứ gì ngoài
 *     mạng Docker. Đường vòng đó đứt trong lúc tráo container (log lỗi rơi
 *     đúng 15:19–15:23, backend vừa khởi động lại lúc 15:18:15).
 *  2. KHÔNG THỬ LẠI. Một lần trượt là hỏng hẳn cả lần đăng nhập, dù backend
 *     chỉ bận vài giây.
 */

/** Nội bộ trước — cùng mạng Docker, không qua DNS công cộng. */
const NOI_BO = process.env.BACKEND_INTERNAL_URL || 'http://backend:3001';
/** Công khai — dự phòng cho khi chạy ngoài Docker (dev trên máy cá nhân). */
const CONG_KHAI = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || '';

const SO_LAN_THU = 3;
const CHO_MS = [0, 400, 1200];

/**
 * Gọi backend, thử nội bộ trước rồi mới tới công khai, mỗi đường thử lại.
 *
 * Ném lỗi khi hết đường — người gọi PHẢI xử lý, đừng nuốt. Nuốt lỗi ở đây
 * chính là thứ đã tạo ra "đăng nhập thành công nhưng không có tài khoản".
 */
export async function goiBackend(duong: string, init?: RequestInit): Promise<Response> {
  const cacGoc = [NOI_BO, CONG_KHAI].filter(Boolean);
  let loiCuoi: unknown = null;

  for (const goc of cacGoc) {
    for (let lan = 0; lan < SO_LAN_THU; lan++) {
      if (CHO_MS[lan]) await new Promise((x) => setTimeout(x, CHO_MS[lan]));
      try {
        const res = await fetch(`${goc}${duong}`, {
          ...init,
          cache: 'no-store',
          // Trần thời gian: không có nó thì một backend treo sẽ giữ lời gọi
          // đăng nhập tới khi Next tự huỷ, và người dùng nhìn màn hình trắng.
          signal: AbortSignal.timeout(Number(process.env.BACKEND_TIMEOUT_MS) || 10_000),
        });
        // Lỗi 5xx đáng thử lại; 4xx là backend đã trả lời rõ ràng, thử lại vô ích.
        if (res.status >= 500 && lan < SO_LAN_THU - 1) continue;
        return res;
      } catch (e) {
        loiCuoi = e;
      }
    }
  }
  throw new Error(
    `Không gọi được backend (${duong}) qua ${cacGoc.join(' và ')}: ${
      loiCuoi instanceof Error ? loiCuoi.message : String(loiCuoi)
    }`,
  );
}

/**
 * Mã định danh của nhà cung cấp OAuth, có ĐƯỜNG LÙI.
 *
 * Backend bắt buộc `providerId` không rỗng (`body('providerId').notEmpty()`),
 * nên thiếu nó là **422** và tài khoản không bao giờ được tạo — đã thấy 6 lần
 * 422 trong log nginx ngày 19/08.
 *
 * `oauthRegister` khớp người dùng theo EMAIL rồi mới ghi `providerId`, nên một
 * giá trị lùi suy ra từ provider + email là an toàn: nó không đổi việc ai khớp
 * với ai, chỉ đảm bảo trường bắt buộc luôn có giá trị.
 */
export function maNhaCungCap(idThat: unknown, provider: string, email: string): string {
  const id = String(idThat ?? '').trim();
  if (id) return id;
  return `${provider}:${email.toLowerCase()}`;
}
