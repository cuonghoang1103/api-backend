/**
 * Authentication — Chương 8: OAuth 2.1 và OpenID Connect (soạn lại trọn 04/11/2026 theo ./_HOP-DONG.md, chuẩn đợt mẫu Ch1–7).
 * 8.1 oauth-la-gi · 8.2 luong-code-pkce · 8.3 state-nonce-redirect · 8.4 id-token · 8.5 lam-client-that (slug giữ) ·
 * Lab 8 (MỚI auth-8-7-lab-id-token) · Quiz (slug giữ auth-8-6-quiz, 10 câu).
 * Code/output dùng chung ở ./s08/_ma.mjs — SINH TỰ ĐỘNG từ LabFlow ID v0.8 (OIDC provider) + client :4810 chạy thật trong env -i (đừng sửa tay).
 * TIÊU ĐỀ CHƯƠNG giữ nguyên (seeder neo chương bằng tiêu đề).
 */
import oauthLaGi from './s08/oauth-la-gi.mjs';
import luongCodePkce from './s08/luong-code-pkce.mjs';
import stateNonceRedirect from './s08/state-nonce-redirect.mjs';
import idToken from './s08/id-token.mjs';
import lamClientThat from './s08/lam-client-that.mjs';
import lab from './s08/lab.mjs';
import quiz from './s08/quiz.mjs';

export default {
  title: 'Chapter 8 — OAuth 2.1 and OpenID Connect|||Chương 8 — OAuth 2.1 và OpenID Connect',
  description: 'Đăng nhập một chỗ, mang danh tính đó đi khắp nơi. LabFlow ID v0.8 trở thành một OpenID Connect PROVIDER cho LabFlow API (client thật ở cổng 4810): OAuth là uỷ quyền truy cập (không phải đăng nhập — đó là OIDC + một ID token); luồng authorization code kèm PKCE từng bước (code một lần 60s, verifier chứng minh client); state/nonce/redirect_uri là ba lớp phòng (CSRF callback, phát lại ID token, trộm code qua open redirect); ID token so với access token và BẢY phép kiểm trước khi tin; và làm một client thật (nối theo sub không theo email, giữ đường vào không-qua-provider, bắt đầu phiên của mình). Chạy THẬT đầu-cuối không trình duyệt: discovery → login → id_token verified, cộng PKCE sai/nonce sai/aud sai/redirect ngoài danh sách đều bị chặn. Rồi Lab 8 chấm phép kiểm ID token bằng máy. Theo OAuth 2.1/RFC 9700, RFC 7636, OpenID Connect Core, RFC 8725.',
  lessons: [oauthLaGi, luongCodePkce, stateNonceRedirect, idToken, lamClientThat, lab, quiz],
};
