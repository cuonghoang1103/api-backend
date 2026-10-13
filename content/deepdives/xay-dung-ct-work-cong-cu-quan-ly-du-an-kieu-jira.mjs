/**
 * Deep Dive — xây dựng CT Work, công cụ quản lý dự án kiểu Jira (bài tiếng Việt, 13/10/2026).
 *
 * Prose nằm ở `.md` cùng tên (bài đầy khối code có backtick — nhét vào template literal thì phải escape hết).
 * Thẻ trang chủ: "Building a Jira-style Project Tool (CT Work)" trong deepDivesData.ts — CHƯA đổi sang
 * `article:` (việc của phiên chính, chỉ đổi SAU khi bài đã seed, không thì link chết).
 *
 * MỌI CON SỐ ĐO BẰNG LỆNH tại HEAD = 1c5fb6c3 (13/10/2026). Sửa bài thì ĐO LẠI, đừng chỉnh số cho tròn:
 *
 *   · commit chạm 4 thư mục lõi = 77
 *       git log --format=%h -- frontend/src/app/work frontend/src/components/work src/services/work \
 *         'src/routes/work*' | wc -l
 *   · commit liên quan = 113: hợp của dòng trên với `git log --since=2026-09-20 --format='%H %s'` lọc tiêu đề
 *       khớp /ct-?work|\(work|ctw|CT Work/i (gồm schema, app desktop, tài liệu). Chia giai đoạn bằng ngày commit.
 *   · dòng +/− theo giai đoạn: git log --since/--until --no-merges --numstat --format= -- <4 thư mục> src/mcp
 *       (23–24/09 +48.037 · 25/09–02/10 +3.232 · 03–05/10 +37.140 · 06–08/10 +7.699 · 09/10 +55.741 ·
 *        10/10 +95.753 · 11–13/10 +3.643; tổng +251.245/−14.008, có tính mã test)
 *   · 68 trang:      find frontend/src/app/work -name page.tsx | wc -l   (và 68/68 có tuyến trong
 *                    desktop/src/renderer/features/web/tuyenCtWork.ts — so bằng comm)
 *   · 243 model:     grep -c '^model Work' prisma/schema.prisma   (cả site: grep -c '^model ' = 580)
 *   · 53 migration:  git ls-tree -d --name-only HEAD prisma/migrations/ | grep -ciE 'work|ctw'
 *   · 37 router / 1.098 tuyến: ls src/routes/work*.routes.ts; cat … | grep -oE '\brouter\.(get|post|put|patch|delete)\(\s*['"`]'
 *   · ≈206.000 dòng không test: git grep -c '' HEAD -- 'src/services/work/*.ts' ':!*.test.ts' (82.512)
 *       + 'src/routes/work*.ts' (7.621) + 'src/mcp/*.ts' (1.480) + 'frontend/src/app/work/*' (8.773)
 *       + 'frontend/src/components/work/*' ':!*.test.*' (105.757). LƯU Ý: pathspec git `**\/` đòi ≥1 thư mục con
 *       — lần đo đầu ra 4.373 dòng/21 tệp cho services/work là SAI vì thế; `*` của git đã khớp qua `/`.
 *   · test: 112 tệp (git ls-files work/mcp *.test.ts + packages/ctwork-mcp/test), 1.514 ca `it(`/`test(`,
 *       658 ca trong 56 tệp src/routes/work*.db.test.ts; 30.559 dòng test. (git grep -E với \s cho kết quả sai
 *       — đếm 11 — nên đếm bằng /usr/bin/grep trên tệp đã track.)
 *   · 123 tool MCP: import toolRegistry/index.ts → mcpCommands().length = 123, askCommands() = 106,
 *       builtinCommands() = 103 (chạy bằng npx tsx với STORAGE_SANDBOX=1).
 *   · 72 mẫu AGENT_DENIED_ROUTES: đếm "['" trong khối khai báo (permissions.ts dòng 698–760).
 *   · 22 bản desktop: git log --format=%s | grep -cE '^chore\(desktop\): 0\.5\.[0-9]+ — .*CT Work'
 *   · 29 lệnh ghi thẳng work_issues ở 12 tệp ngoài issueChange.ts: lệnh grep in nguyên trong bài.
 *
 * Mọi output trong bài là output THẬT của đúng đoạn code in trong bài (rank, Date/toISOString, emoji
 * surrogate, cutText, parseJql, untrusted(), can()/agentRouteAllowed()/agentTopRouteAllowed(), git cat-file
 * từng commit, zsh vs bash glob). Script đã chạy nằm ở scratchpad của phiên (không commit).
 *
 * NHỮNG GÌ VIỆC ĐO ĐÃ BÁC BỎ (giữ nguyên sự thẳng thắn này nếu sửa bài):
 *   1. Commit 80e48447 ghi "quyền 6 vai trò" — mã chỉ có 5 vai dự án + 4 vai không gian.
 *   2. "applyIssueChange là cửa DUY NHẤT ghi thẻ" — grep ra 29 lệnh ghi thẳng ở 12 tệp khác (xoá mềm, chia sẻ
 *      khách, cờ, giờ, đóng sprint, xoá cột, chuyển dự án, nhập). SVG cua-ghi-chung.svg cũng ghi ngoại lệ này.
 *   3. Commit 618df381 chẩn đoán "git add nuốt [ws][key] vì glob" — `git cat-file` từng commit cho thấy tệp CÓ
 *      trong commit tính năng; thứ làm rơi là commit bump 4002319c (`commit -am` trên index chung). Git nhận
 *      đường dẫn có ngoặc khi đặt trong nháy; zsh không nháy mới báo "no matches found".
 *   4. Bản thiết kế agent ghi dùng @modelcontextprotocol/sdk + GET/DELETE — mã thật tự viết JSON-RPC
 *      (src/mcp/protocol.ts), GET/DELETE trả 405.
 *   5. Lỗi CỦA CHÍNH TÔI lúc đo, giữ trong bài: viết "$c:src/…" trong zsh ⇒ `:s` là bộ biến đổi ⇒ NO ở mọi
 *      commit. Phải viết "${c}:…".
 *
 * CHƯA CHẮC (ghi rõ trong bài là "đọc mã, chưa thử"):
 *   · agent xin đóng Bug ở quy trình Bug riêng (Open→…→Retest→Closed) nhiều khả năng nhận 400
 *     WORK_AGENT_NO_REVIEW_STATUS vì không trạng thái nào khớp /review|qa|verify|kiểm|duyệt/.
 *   · 98→37 MB mã app desktop là số trong commit 1c5fb6c3; thư mục dựng trên máy: dist-ctwork 135M, dist 370M.
 *
 * RIÊNG TƯ: không tên người thật, không email, không IP/host VPS, không mã dự án thật của người dùng
 * (ví dụ dùng PRJ-xx). Dự án "CTW" là backlog của chính sản phẩm (mã thẻ đã có trong commit message công khai).
 *
 * ⚠️ 13/10 lúc viết: /download/ct-work còn 404 trên prod và kho phát hành app CT Work chưa có release nào —
 * bài trỏ tới đó, nên chỉ publish CÙNG/SAU lượt deploy + phát hành app.
 *
 * Ảnh: frontend/public/deepdives/ct-work/{cover,dong-thoi-gian,kien-truc,cua-ghi-chung,luong-agent-mcp}.svg
 * (viewBox rộng 700, đã qua scratchpad/svg-fit.mjs + chụp bằng Playwright để nhìn).
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./xay-dung-ct-work-cong-cu-quan-ly-du-an-kieu-jira.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'xay-dung-ct-work-cong-cu-quan-ly-du-an-kieu-jira',
  title: 'Tôi tự xây một công cụ kiểu Jira: CT Work sau 21 ngày, 113 commit và mười lỗi đã trả giá',
  summary:
    'Nhật ký kỹ thuật của CT Work, công cụ quản lý dự án và đồ án sinh viên FPT dùng thật: kiến trúc và mã thật, AI agent qua MCP, số đo bằng lệnh (243 model, 68 trang, 1.514 ca test), mười lỗi đã sửa, mẹo dùng — và khi nào không nên dùng.',
  category: 'DeepDive',
  tags: ['ct-work', 'quan-ly-du-an', 'jira', 'kien-truc', 'ai-agent', 'mcp', 'nodejs', 'postgresql'],
  coverEmoji: '✅',
  coverImageUrl: '/deepdives/ct-work/cover.svg',
  readTimeMin: 32, // 7.090 từ (đếm của deepdive-seed) ÷ 220
  isFeatured: true,
  trendingScore: 80,
  status: 'PUBLISHED',
  bodyMdx,
};
