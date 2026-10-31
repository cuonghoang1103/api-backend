/**
 * Git & GitHub — Chương 18: Tai nạn Git thật của nhóm.
 * 31/10/2026. 18.0 slide (deck git-18) · 18.1–18.7 bài · 18.8 quiz. File này SINH RA từ lab18/_dung/ (xem _BRIEF-CHUONG-18.md) — sửa ở đó.
 * Mọi output terminal in trong bài là output THẬT chạy từ lab18/tao-nhom.sh (git 2.51.1); đường dẫn kho giả lập đã
 * đổi thành /tmp/lab18. Tên người (An, Bình, Chi) và mật khẩu trong dự án mẫu là GIẢ.
 * LUẬT: backtick → &#96;; ${ trong mã mẫu → \${; < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 */
import { gallery, slide } from './_slides.mjs';

export default {
  title: 'Chapter 18 — Real team accidents: build folders, conflicts, bad merges and the rescue|||Chương 18 — Tai nạn Git thật của nhóm: thư mục build, xung đột, merge hỏng và cách cứu',
  description: 'Những tai nạn Git một nhóm sinh viên làm Java web (NetBeans, Servlet/JSP) gặp thật: lỡ commit build/ và nbproject/private/, xung đột web.xml, PR để lâu, kéo main nhầm chỗ, push bị từ chối, sửa nhầm trên main, tự merge không review, hoàn tác merge. Mỗi lỗi tự tái hiện trong một lab ba người rồi tự sửa, output chạy thật.',
  lessons: [
