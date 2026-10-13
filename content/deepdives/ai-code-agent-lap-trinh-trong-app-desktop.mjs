/**
 * Deep Dive — AI Code, agent lập trình trong app desktop CuongThai.
 *
 * Prose ở tệp `.md` cùng tên (cùng lý do như các bài khác: khối code khắp
 * nơi, để trong template literal thì phải thoát mọi dấu backtick).
 *
 * Bài viết theo yêu cầu của chủ web: thẻ Deep Dives "AI Code on the Desktop"
 * phải mở ra một BÀI ĐỌC (app tâm huyết, cách dựng, tính năng, lỗi đã gặp,
 * nâng cấp theo thời gian, mẹo dùng) và kết bằng lời mời tải ở /download.
 * Bài này KHÔNG tự đổi thẻ trong deepDivesData.ts — việc đó làm SAU khi seed.
 *
 * ─── RIÊNG TƯ (giữ nguyên khi sửa bài) ───
 * Không nêu tên miền/tên nhà cung cấp của hai cổng LLM bên thứ ba — trong bài
 * gọi là "cổng LLM chính" và "cổng riêng cho agent". Không IP, không đường
 * dẫn máy cá nhân, không mật khẩu cổng dự phòng, không giá trị env của prod.
 * Đoạn mã trích ra đã cắt những chú thích có tên cổng.
 *
 * ─── LỆNH ĐÃ CHẠY ĐỂ LẤY SỐ (13/10/2026, từ gốc repo) ───
 *   Sáu thư mục của AI Code:
 *     D="desktop/src/main/agent desktop/src/main/aiCucBo desktop/src/main/terminal
 *        desktop/src/renderer/features/chat src/services/agent src/routes/agent.routes.ts"
 *   · git log --oneline -- $D | wc -l                        → 174 commit
 *   · git log --format=%ad --date=short -- $D | sort | uniq -c
 *       17–22/08: 78 · 23/08–03/09: 0 · 04–16/09: 66 · 17–30/09: 22 · 01/10–: 8
 *       (ngày nhiều nhất: 19/08 = 28, 17/08 = 26; commit đầu 254c2dc8 17/08 02:01)
 *   · git log --oneline -E --grep='^(fix|perf)' -- $D        → 70; '^feat' → 98
 *   · git log --format=%s -- $D | grep -iE 'agent|ai code|ai-code' | wc -l → 120
 *   · Tool: phân tích `name:`/`ring:`/`capability:` trong src/services/agent/tools.ts
 *       → 46 tool = 41 ring 'client' + 5 ring 'server'; 14 nhóm khả năng
 *   · Model: src/services/agent/models.ts → 3 (MODEL_AGENT) / 8 (MODEL_AGENT_RIENG);
 *       congDuPhong.ts → 2 (gpt-6-sol, gpt-6-astra)
 *   · Kỹ năng: ls src/services/agent/kyNangSan | wc -l → 17
 *   · Lệnh gạch chéo: grep -o "ten: '/" desktop/src/renderer/features/chat/lenhGach.ts → 24
 *   · Dòng mã (không test): find <thư mục> -name '*.ts*' ! -name '*.test.*' | xargs cat | wc -l
 *       agent 13.682 · aiCucBo 3.040 · terminal 471 · chat 13.148 · services/agent 7.386
 *       · agent.routes.ts 530  ⇒ ≈ 38.000
 *   · Test: (cd desktop && npx vitest run src/main/agent src/main/aiCucBo
 *       src/main/terminal src/renderer/features/chat) → 76 tệp, 855 xanh, 8 bỏ qua
 *     NODE_ENV=test npx tsx --test src/services/agent/*.test.ts → 147/147 xanh
 *     (fetch đã giả lập trong test — không gọi cổng LLM nào)
 *   · Phát hành (CHỈ ĐỌC): gh release list --repo cuonghoang1103/cuongthai-desktop
 *       --limit 300 | wc -l → 196 (v0.1.0 16/08 → v0.5.189 13/10); 193 bản từ 17/08;
 *       nhiều nhất 16 bản/ngày (18/08, 20/08); dãy 0.5.x thiếu 21, 31, 32, 39
 *   · Phân loại lệnh: chạy thật phanLoaiLenh() (desktop/src/main/agent/lenh.ts)
 *       bằng `npx tsx` trên 10 lệnh — output dán nguyên trong bài (cắt lý do ở …)
 *   · PATH: launchctl getenv PATH → rỗng; PATH mặc định 4 mục vs `zsh -ilc` 25 mục;
 *       `which` git/node/npm/docker/psql/brew dưới từng PATH;
 *       /usr/bin/time -p zsh -ilc 'printf %s "$PATH"' ×3 → 1,27 · 1,27 · 1,30 s
 *   · Số giá/độ trễ (18/08, 19/08, 22/08, 27/09) lấy lại từ CLAUDE.md + chú thích
 *       trong models.ts / congDuPhong.ts + memory — KHÔNG đo lại (đo lại = gọi cổng
 *       trả phí). Ngày đo ghi ngay cạnh mỗi bảng trong bài.
 *
 * ─── VIỆC ĐO ĐÃ BÁC BỎ ───
 *   1. CLAUDE.md ghi "cổng riêng: 6 model" — models.ts có 8 (opus-5, fable-5
 *      thêm 26/09). Bài theo mã.
 *   2. grep `it(`/`test(` ra 902; chạy thật ra 863 (app) + 147 (máy chủ) — grep
 *      không thấy phép sinh từ it.each (12 chỗ) / vòng lặp.
 *   3. `grep -c "ring: 'client'"` ra 42; phân tích từng tool ra 41 (một khớp
 *      nằm trong chú thích).
 *   4. `git log --since=2026-08-23 --until=2026-09-04` ra 4 commit, theo ngày
 *      TÁC GIẢ ra 0 — --since lọc ngày COMMIT. Biểu đồ dùng ngày tác giả.
 *   5. Ảnh bìa định gắn nhãn "cần kiểm" cho `npm test -- auth`; phanLoaiLenh
 *      thật trả 'thuong'. Đã sửa nhãn.
 *   6. Tưởng `zsh -ilc` chỉ vài chục ms — đo ra ~1,3 s, gần nửa hạn 3 s.
 *   7. `forbidChildProcesses` (security.ts) KHÔNG cấm gì: từ 17/08 nó chỉ ghi
 *      log; chú thích đổi, tên giữ (git log -p -- desktop/src/main/security.ts).
 *
 * ─── CHỖ CHƯA CHẮC (ghi để phiên sau kiểm) ───
 *   · 174 commit gồm cả commit của AI Chat/giọng nói dùng chung thư mục
 *     features/chat; bài nói rõ "120 có chữ agent/AI Code trong tiêu đề".
 *   · Đánh giá "GPT làm giao diện 5/10" là MỘT lần thử (27/09), từ memory.
 *   · Độ trễ opus-5 / fable-5 chưa có số đo cùng điều kiện — bài nói thẳng vậy.
 *
 * Sơ đồ: frontend/public/deepdives/ai-code/{cover,kien-truc,vong-lap-tool,
 * che-do-quyen,dong-thoi-gian}.svg — viewBox rộng 700. dong-thoi-gian.svg sinh
 * bằng script từ đúng số liệu ở trên (script nằm ngoài repo, trong scratchpad
 * phiên viết bài); sửa số thì sửa cả hình.
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./ai-code-agent-lap-trinh-trong-app-desktop.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'ai-code-agent-lap-trinh-trong-app-desktop',
  title: 'AI Code: agent lập trình trong app desktop — cách dựng, lỗi đã gặp, và cách dùng cho đáng tiền',
  summary:
    'Agent lập trình trong app desktop CuongThai: kiến trúc và mã thật, 174 commit trong 48 ngày, 9 lỗi đã gặp và cách sửa, vì sao giá một lượt không nói lên giá trong vòng lặp gọi tool, mẹo chọn model — và khi nào KHÔNG nên dùng.',
  category: 'DeepDive',
  tags: ['ai-agent', 'electron', 'llm', 'desktop-app', 'mcp', 'chi-phi-llm'],
  coverEmoji: '🤖',
  coverImageUrl: '/deepdives/ai-code/cover.svg',
  readTimeMin: 35,
  isFeatured: true,
  trendingScore: 78,
  status: 'PUBLISHED',
  bodyMdx,
};
