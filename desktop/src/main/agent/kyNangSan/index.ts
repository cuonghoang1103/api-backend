/**
 * ============================================================
 * KỸ NĂNG CÀI SẴN — đi theo app, dùng được ở MỌI dự án (26/09/2026)
 * ============================================================
 *
 * Người dùng: *"cài sẵn một kỹ năng deploy vào AI Code để nó deploy setup mọi
 * ngôn ngữ web, app… và mọi thứ tốt nhất AI Code còn thiếu để làm được mọi việc
 * giỏi"*.
 *
 * Kỹ năng thường sống ở `.claude/skills/` của TỪNG dự án (`kyNang.ts`) — tức
 * dự án của bạn người dùng (một web C# vừa làm xong) sẽ không có kỹ năng nào.
 * Bộ này đóng gói trong bản cài nên luôn có mặt.
 *
 * ─── LUẬT TRỘN ───
 * Dự án khai kỹ năng TRÙNG TÊN ⇒ bản của dự án THẮNG: người ta viết quy ước
 * riêng cho dự án mình thì quy ước đó phải đè lên hướng dẫn chung.
 *
 * Nội dung là Markdown thường (`?raw`), không chép vào chuỗi TypeScript: khối
 * mã trong kỹ năng đầy dấu huyền và `${}`, nhét vào template literal là phải
 * thoát từng ký tự — và một ký tự thoát sai làm hỏng âm thầm.
 */
import deploy from './deploy.md?raw';
import mayChuSsh from './may-chu-ssh.md?raw';
import phatHanhApp from './phat-hanh-app.md?raw';
import lamViecChuan from './lam-viec-chuan.md?raw';

/** Nội dung thô (có phần đầu YAML) của từng kỹ năng cài sẵn. */
export const KY_NANG_SAN_THO: readonly string[] = [deploy, mayChuSsh, phatHanhApp, lamViecChuan];
