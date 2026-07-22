/**
 * Seed content for the flagship roadmaps (Role- and Skill-based).
 * Hand-authored, roadmap.sh-inspired — dense paths, alternative branches, and
 * curated resources per node (official docs / MDN / roadmap.sh — reliable URLs).
 *   link      → featured "Recommended" (Code Lab track / roadmap / /algorithms).
 *   resources → Free/Premium resource list with type badge + title.
 *   kind      → 'primary' | 'alternative' (branch) | 'info' (concept).
 */
export type SeedLink = { type: 'code-lab' | 'roadmap' | 'external'; ref: string };
export type SeedResource = { type: 'article' | 'video' | 'course' | 'official' | 'feed'; title: string; url: string; premium?: boolean };
export interface SeedNode {
  title: string; subtitle?: string; kind?: 'primary' | 'alternative' | 'info';
  side?: 'center' | 'left' | 'right'; icon?: string; description?: string; link?: SeedLink; resources?: SeedResource[];
}
export interface SeedStage { label: string; nodes: SeedNode[]; }
export interface SeedRoadmap { slug: string; title: string; type: 'role' | 'skill'; icon: string; color: string; description: string; stages: SeedStage[]; }

const cl = (ref: string): SeedLink => ({ type: 'code-lab', ref });
const ext = (ref: string): SeedLink => ({ type: 'external', ref });
const rm = (ref: string): SeedLink => ({ type: 'roadmap', ref });
const algos: SeedLink = { type: 'external', ref: '/algorithms' };
// resource helpers
const off = (title: string, url: string): SeedResource => ({ type: 'official', title, url });
const art = (title: string, url: string): SeedResource => ({ type: 'article', title, url });
const crs = (title: string, url: string, premium = false): SeedResource => ({ type: 'course', title, url, premium });
const vid = (title: string, url: string): SeedResource => ({ type: 'video', title, url });

export const ROADMAP_SEED: SeedRoadmap[] = [
  // ─────────────────────────────── CLAUDE CODE ───────────────────────────────
  {
    slug: 'claude-code', title: 'Claude Code', type: 'skill', icon: 'Terminal', color: '#d97757',
    description: 'Làm chủ Claude Code — CLI lập trình agentic của Anthropic: cài đặt, phiên làm việc, CLAUDE.md, slash command, MCP, hooks, subagent, skills, plugins, quyền hạn và best practices trong thời đại AI code.',
    stages: [
      { label: 'Nền tảng', nodes: [
        { title: 'Claude Code là gì', kind: 'info', icon: 'Sparkles', description: 'CLI agentic đọc/sửa code, chạy lệnh, dùng công cụ ngay trong terminal — không chỉ là chatbot.',
          resources: [ off('Claude Code — Overview', 'https://docs.claude.com/en/docs/claude-code/overview'), off('Anthropic — Claude Code', 'https://www.anthropic.com/claude-code'), vid('The future of agentic coding with Claude Code', 'https://www.youtube.com/watch?v=iF9iV4xponk') ] },
        { title: 'Cài đặt & Quickstart', icon: 'Terminal', description: 'Cài qua npm, đăng nhập, chạy phiên đầu tiên trong repo của bạn.',
          resources: [ off('Claude Code — Quickstart', 'https://docs.claude.com/en/docs/claude-code/quickstart'), vid('Intro to Claude Code — Webinar (Anthropic)', 'https://www.youtube.com/watch?v=ARWJZVn400I') ] },
        { title: 'Vòng lặp agentic (agentic loop)', kind: 'info', description: 'Claude tự lập kế hoạch → đọc file → sửa → chạy test → lặp lại tới khi xong.',
          resources: [ art('Anthropic — Claude Code Best Practices', 'https://www.anthropic.com/engineering/claude-code-best-practices'), vid('Claude Code: Best Practices for Agentic Coding', 'https://www.youtube.com/watch?v=gv0WHhKelSE') ] },
      ]},
      { label: 'Dùng hằng ngày', nodes: [
        { title: 'CLI & cờ dòng lệnh', icon: 'Terminal', description: 'claude, claude -c (continue), claude -p (print/headless), claude -r (resume), --add-dir.',
          resources: [ off('Claude Code — CLI Reference', 'https://docs.claude.com/en/docs/claude-code/cli-reference') ] },
        { title: 'Slash command', kind: 'info', side: 'right', description: '/clear, /compact, /init, /help, /model, /review... và lệnh tuỳ biến.',
          resources: [ off('Claude Code — Slash Commands', 'https://docs.claude.com/en/docs/claude-code/slash-commands') ] },
        { title: 'Quản lý ngữ cảnh & phiên', kind: 'info', side: 'left', description: 'Cửa sổ ngữ cảnh, /compact, /clear, resume phiên, giảm token.',
          resources: [ off('Claude Code — Common Workflows', 'https://docs.claude.com/en/docs/claude-code/common-workflows'), off('Claude Code — CLI Reference', 'https://docs.claude.com/en/docs/claude-code/cli-reference') ] },
        { title: 'Model & chế độ', kind: 'info', side: 'right', description: 'Chọn model (Opus/Sonnet/Haiku), Plan mode, permission mode, output style.',
          resources: [ off('Claude Code — Settings', 'https://docs.claude.com/en/docs/claude-code/settings') ] },
      ]},
      { label: 'Cá nhân hoá dự án', nodes: [
        { title: 'CLAUDE.md — bộ nhớ dự án', icon: 'BookOpen', description: 'File hướng dẫn Claude về codebase, quy ước, lệnh build/test — nạp mỗi phiên.',
          resources: [ off('Claude Code — Memory (CLAUDE.md)', 'https://docs.claude.com/en/docs/claude-code/memory'), art('Anthropic — Best Practices', 'https://www.anthropic.com/engineering/claude-code-best-practices') ] },
        { title: 'Cấu hình & Permissions', icon: 'Lock', side: 'right', description: 'settings.json, allow/deny tool, permission mode, biến môi trường.',
          resources: [ off('Claude Code — Settings', 'https://docs.claude.com/en/docs/claude-code/settings') ] },
      ]},
      { label: 'Mở rộng năng lực', nodes: [
        { title: 'MCP — kết nối công cụ ngoài', icon: 'Plug', description: 'Model Context Protocol: cắm database, API, browser, Slack... vào Claude.',
          resources: [ off('Claude Code — MCP', 'https://docs.claude.com/en/docs/claude-code/mcp'), off('Model Context Protocol', 'https://modelcontextprotocol.io/') ] },
        { title: 'Hooks', icon: 'Webhook', side: 'right', description: 'Chạy lệnh tự động ở sự kiện (PreToolUse/PostToolUse...) — lint, format, chặn.',
          resources: [ off('Claude Code — Hooks', 'https://docs.claude.com/en/docs/claude-code/hooks') ] },
        { title: 'Subagents', icon: 'Bot', side: 'left', description: 'Agent con chuyên biệt (review, test, research) chạy song song, ngữ cảnh riêng.',
          resources: [ off('Claude Code — Subagents', 'https://docs.claude.com/en/docs/claude-code/sub-agents') ] },
        { title: 'Agent Skills', icon: 'Sparkles', side: 'right', description: 'Đóng gói hướng dẫn + script cho tác vụ lặp lại, tự kích hoạt theo ngữ cảnh.',
          resources: [ off('Claude Code — Skills', 'https://docs.claude.com/en/docs/claude-code/skills') ] },
        { title: 'Plugins', icon: 'Puzzle', kind: 'alternative', side: 'left', description: 'Gói command + agent + hook + MCP chia sẻ qua marketplace.',
          resources: [ off('Claude Code — Plugins', 'https://docs.claude.com/en/docs/claude-code/plugins') ] },
      ]},
      { label: 'Nâng cao & Production', nodes: [
        { title: 'Headless / SDK', kind: 'alternative', icon: 'Cog', description: 'claude -p trong script/CI, tự động hoá không tương tác, Agent SDK.',
          resources: [ off('Claude Code — Headless', 'https://docs.claude.com/en/docs/claude-code/headless'), vid('Claude Agents — Masterclass (Anthropic)', 'https://www.youtube.com/watch?v=OZ9NhFwVCtQ') ] },
        { title: 'IDE & editor', kind: 'info', side: 'right', description: 'Tích hợp VS Code / JetBrains, xem diff, chạy ngay trong editor.',
          resources: [ off('Claude Code — IDE Integrations', 'https://docs.claude.com/en/docs/claude-code/ide-integrations') ] },
        { title: 'Bảo mật & quyền hạn', icon: 'Shield', side: 'left', description: 'Sandbox, duyệt lệnh nguy hiểm, tránh prompt injection, bảo vệ secrets.',
          resources: [ off('Claude Code — Security', 'https://docs.claude.com/en/docs/claude-code/security') ] },
        { title: 'Best practices', kind: 'info', side: 'right', description: 'Plan trước, CLAUDE.md tốt, chia nhỏ, verify — làm việc hiệu quả với agent.',
          resources: [ art('Anthropic — Claude Code Best Practices', 'https://www.anthropic.com/engineering/claude-code-best-practices'), vid('Claude Code Best Practices', 'https://www.youtube.com/watch?v=gv0WHhKelSE') ] },
        { title: 'Tiếp: Vibe Coding & OpenClaw', kind: 'alternative', side: 'left', description: 'Dùng AI agent để dựng sản phẩm nhanh, và tự-host agent 24/7.', link: rm('vibe-coding') },
      ]},
    ],
  },

  // ─────────────────────────────── VIBE CODING ───────────────────────────────
  {
    slug: 'vibe-coding', title: 'Vibe Coding', type: 'skill', icon: 'Sparkles', color: '#c026d3',
    description: 'Vibe coding — dựng phần mềm bằng cách "ra lệnh" cho AI (thuật ngữ của Karpathy, 2/2025). Lộ trình dùng AI coding agent để đi từ ý tưởng đến sản phẩm nhanh, kèm kỷ luật review, kiểm thử & bảo mật để không tạo "rác".',
    stages: [
      { label: 'Nền tảng', nodes: [
        { title: 'Vibe coding là gì', kind: 'info', icon: 'Sparkles', description: 'Mô tả bằng ngôn ngữ tự nhiên, để LLM sinh code, tập trung vào kết quả thay vì gõ từng dòng.',
          resources: [ art('Wikipedia — Vibe coding', 'https://en.wikipedia.org/wiki/Vibe_coding'), art('CodeRabbit — Lịch sử thuật ngữ vibe coding', 'https://www.coderabbit.ai/blog/a-semantic-history-how-the-term-vibe-coding-went-from-a-tweet-to-prod'), vid('The vibe coding mind virus explained (Fireship)', 'https://www.youtube.com/watch?v=Tw18-4U7mts') ] },
        { title: 'Tư duy: mô tả → sinh → kiểm', kind: 'info', side: 'right', description: 'Vòng lặp: nói rõ mong muốn, để AI sinh, rồi chạy/kiểm và tinh chỉnh.',
          resources: [ vid('How to make vibe coding not suck (Fireship)', 'https://www.youtube.com/watch?v=PLKrSVuT-Dg') ] },
        { title: 'Vẫn cần nền tảng lập trình', kind: 'info', side: 'left', description: 'Phải đủ hiểu để đọc/kiểm code AI sinh — nếu không sẽ tạo bug & nợ kỹ thuật.',
          resources: [ off('Lộ trình Frontend', '/roadmap/frontend'), off('Lộ trình Backend', '/roadmap/backend') ] },
      ]},
      { label: 'Công cụ (chọn theo việc)', nodes: [
        { title: 'AI coding agent (terminal)', icon: 'Terminal', description: 'Claude Code / OpenAI Codex — agent tự đọc/sửa codebase, chạy lệnh.',
          resources: [ off('Anthropic — Claude Code', 'https://www.anthropic.com/claude-code'), off('OpenAI — Codex', 'https://developers.openai.com/codex/'), off('Lộ trình Claude Code', '/roadmap/claude-code') ] },
        { title: 'AI trong IDE', kind: 'info', side: 'right', description: 'Cursor, GitHub Copilot, Windsurf — gợi ý & sửa code ngay khi gõ.',
          resources: [ off('Cursor — Docs', 'https://docs.cursor.com/'), off('GitHub Copilot', 'https://github.com/features/copilot'), off('Windsurf', 'https://windsurf.com/') ] },
        { title: 'AI app builder', icon: 'Rocket', side: 'left', description: 'Lovable, Bolt, v0, Replit — mô tả là ra app/UI chạy được.',
          resources: [ off('Lovable', 'https://lovable.dev/'), off('Bolt', 'https://bolt.new/'), off('v0 by Vercel', 'https://v0.dev/'), off('Replit', 'https://replit.com/') ] },
      ]},
      { label: 'Quy trình hiệu quả', nodes: [
        { title: 'Viết prompt & spec tốt', kind: 'info', icon: 'BookOpen', description: 'Nêu rõ mục tiêu, ràng buộc, ví dụ input/output — AI sinh đúng hơn.',
          resources: [ off('Anthropic — Prompt Engineering', 'https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview') ] },
        { title: 'Chia nhỏ & lặp từng bước', kind: 'info', side: 'right', description: 'Làm từng tính năng nhỏ, chạy được rồi mới đi tiếp — dễ kiểm soát.',
          resources: [ art('Anthropic — Best Practices', 'https://www.anthropic.com/engineering/claude-code-best-practices') ] },
        { title: 'MCP & tool cho agent', icon: 'Plug', kind: 'alternative', side: 'left', description: 'Cấp cho agent quyền truy cập DB/API/browser để làm việc thật.',
          resources: [ off('Model Context Protocol', 'https://modelcontextprotocol.io/'), off('Lộ trình Claude Code', '/roadmap/claude-code') ] },
      ]},
      { label: 'Kỷ luật (đừng tạo rác)', nodes: [
        { title: 'Review & hiểu code AI sinh', icon: 'Bug', description: 'Đừng "Accept All" mù quáng — đọc diff, hiểu logic trước khi merge.',
          resources: [ art('Wikipedia — Vibe coding (rủi ro)', 'https://en.wikipedia.org/wiki/Vibe_coding') ] },
        { title: 'Kiểm thử & CI', kind: 'info', side: 'right', description: 'Bắt AI viết test, chạy tự động — chốt chặn để code AI không phá vỡ hệ thống.',
          resources: [ off('GitHub Actions — Docs', 'https://docs.github.com/en/actions') ] },
        { title: 'Bảo mật khi vibe', icon: 'Shield', side: 'left', description: 'Không lộ API key, kiểm SQL injection/XSS, đừng deploy code chưa hiểu.',
          resources: [ art('OWASP Top 10', 'https://owasp.org/www-project-top-ten/') ] },
        { title: 'Giới hạn & khi nào tự viết', kind: 'info', side: 'right', description: 'Vibe coding hợp prototype/MVP; hệ thống lớn cần kiến trúc & con người.',
          resources: [ art('CodeRabbit — Semantic history', 'https://www.coderabbit.ai/blog/a-semantic-history-how-the-term-vibe-coding-went-from-a-tweet-to-prod') ] },
      ]},
    ],
  },

  // ─────────────────────────────── OPENCLAW ───────────────────────────────
  {
    slug: 'openclaw', title: 'OpenClaw', type: 'skill', icon: 'Bot', color: '#0284c7',
    description: 'OpenClaw — nền tảng AI assistant tự-host (mã nguồn mở, MIT) chạy agent (như Claude Code) 24/7, nối WhatsApp/Telegram/Discord, có plugin & workflow. Lộ trình cài đặt, cấu hình Gateway, kênh, công cụ và bảo mật.',
    stages: [
      { label: 'Nền tảng', nodes: [
        { title: 'OpenClaw là gì', kind: 'info', icon: 'Bot', description: 'AI assistant cá nhân tự-host: chạy agent trên hạ tầng của bạn, toàn quyền kiểm soát.',
          resources: [ off('OpenClaw — Docs', 'https://docs.openclaw.ai/'), off('OpenClaw — GitHub', 'https://github.com/openclaw/openclaw') ] },
        { title: 'Kiến trúc: Gateway & Agent', kind: 'info', side: 'right', description: 'Gateway luôn chạy nhận tin nhắn → chạy lượt agent → gọi tool → trả lời.',
          resources: [ off('OpenClaw — Architecture', 'https://docs.openclaw.ai/concepts/architecture') ] },
        { title: 'Nền tảng & yêu cầu tự-host', kind: 'info', side: 'left', description: 'Chạy trên máy/VPS/container bạn kiểm soát; OS & thiết bị hỗ trợ.',
          resources: [ off('OpenClaw — Platforms', 'https://docs.openclaw.ai/platforms') ] },
      ]},
      { label: 'Cài đặt', nodes: [
        { title: 'Getting Started & cài đặt', icon: 'Terminal', description: 'Cài Gateway, cấu hình lần đầu, chạy agent đầu tiên.',
          resources: [ off('OpenClaw — Getting Started', 'https://docs.openclaw.ai/start/getting-started'), off('OpenClaw — Install', 'https://docs.openclaw.ai/install'), vid('Deploy Your Own AI Agent — OpenClaw Tutorial', 'https://www.youtube.com/watch?v=sO6NSSOWDO0') ] },
        { title: 'Cấu hình Gateway', kind: 'info', side: 'right', description: 'File cấu hình, biến môi trường, tuỳ chỉnh hành vi agent.',
          resources: [ off('OpenClaw — Gateway Configuration', 'https://docs.openclaw.ai/gateway/configuration') ] },
        { title: 'Kết nối Model provider', icon: 'Cpu', side: 'left', description: 'Cắm Anthropic/OpenAI... , cấu hình failover giữa các model.',
          resources: [ off('OpenClaw — Providers', 'https://docs.openclaw.ai/providers') ] },
      ]},
      { label: 'Kênh & tương tác', nodes: [
        { title: 'Channels (Telegram/WhatsApp/Discord)', icon: 'MessageSquare', description: 'Nối agent vào app nhắn tin — điều khiển & nhận trả lời qua chat.',
          resources: [ off('OpenClaw — Channels', 'https://docs.openclaw.ai/channels') ] },
        { title: 'Web Control UI', kind: 'info', side: 'right', description: 'Bảng điều khiển web để quản lý & trò chuyện với agent.',
          resources: [ off('OpenClaw — Control UI', 'https://docs.openclaw.ai/web/control-ui') ] },
        { title: 'Mobile nodes', icon: 'Smartphone', kind: 'alternative', side: 'left', description: 'Kết nối thiết bị iOS/Android như node của hệ thống.',
          resources: [ off('OpenClaw — Nodes', 'https://docs.openclaw.ai/nodes') ] },
      ]},
      { label: 'Năng lực agent', nodes: [
        { title: 'Tools & Skills', icon: 'Wrench', description: 'Cấp công cụ, kỹ năng, tự động hoá cho agent thực thi tác vụ.',
          resources: [ off('OpenClaw — Tools', 'https://docs.openclaw.ai/tools') ] },
        { title: 'ClawHub (marketplace plugin)', icon: 'Puzzle', side: 'right', description: 'Cài plugin dựng sẵn để mở rộng năng lực nhanh.',
          resources: [ off('OpenClaw — ClawHub', 'https://docs.openclaw.ai/clawhub') ] },
        { title: 'Multi-agent & workflow', icon: 'Workflow', kind: 'alternative', side: 'left', description: 'Nhiều agent phối hợp, workflow bằng TypeScript/YAML.',
          resources: [ off('OpenClaw — Multi-agent', 'https://docs.openclaw.ai/concepts/multi-agent') ] },
      ]},
      { label: 'Vận hành', nodes: [
        { title: 'Bảo mật', icon: 'Shield', description: 'Giới hạn quyền agent, bảo vệ secrets, kiểm soát truy cập.',
          resources: [ off('OpenClaw — Security', 'https://docs.openclaw.ai/gateway/security') ] },
        { title: 'Remote access (Tailscale)', icon: 'Network', kind: 'alternative', side: 'right', description: 'Truy cập Gateway từ xa an toàn qua mạng riêng.',
          resources: [ off('OpenClaw — Remote', 'https://docs.openclaw.ai/gateway/remote') ] },
        { title: 'Troubleshooting & CLI', kind: 'info', side: 'left', description: 'Gỡ lỗi vận hành, lệnh CLI, log & release notes.',
          resources: [ off('OpenClaw — Troubleshooting', 'https://docs.openclaw.ai/gateway/troubleshooting') ] },
      ]},
    ],
  },

  // ─────────────────────────────── LEETCODE / CODING INTERVIEW ───────────────────────────────
  {
    slug: 'leetcode', title: 'LeetCode & Phỏng vấn Coding', type: 'skill', icon: 'Trophy', color: '#ffa116',
    description: 'Lộ trình luyện phỏng vấn coding (LeetCode/NeetCode) — độ phức tạp, cấu trúc dữ liệu và ~15 pattern cốt lõi (two pointers, sliding window, BFS/DFS, DP...) để pass phỏng vấn Big Tech. Luyện trực quan tại trang Algorithms.',
    stages: [
      { label: 'Nền tảng', nodes: [
        { title: 'Độ phức tạp Big-O', kind: 'info', icon: 'Gauge', description: 'Thời gian & bộ nhớ; O(1)/O(log n)/O(n)/O(n²) — cách chấm điểm lời giải.', link: algos,
          resources: [ art('Big-O Cheat Sheet', 'https://www.bigocheatsheet.com/'), off('Lộ trình DSA', '/roadmap/dsa') ] },
        { title: 'Cấu trúc dữ liệu cốt lõi', icon: 'Binary', description: 'Mảng, hash, linked list, stack/queue, cây, heap, đồ thị.', link: algos,
          resources: [ art('VisuAlgo — trực quan hoá', 'https://visualgo.net/en'), off('Lộ trình DSA', '/roadmap/dsa') ] },
        { title: 'Chiến lược & cách bắt đầu', kind: 'info', side: 'right', description: 'Học theo pattern thay vì cày ngẫu nhiên; ôn có hệ thống.',
          resources: [ crs('NeetCode — Roadmap', 'https://neetcode.io/roadmap'), vid('How I Would Master LeetCode (NeetCode)', 'https://www.youtube.com/watch?v=jIj0rfU_hYc'), vid('How I ACTUALLY got good at Leetcode', 'https://www.youtube.com/watch?v=RJr7ofDgE24') ] },
      ]},
      { label: 'Pattern mảng & chuỗi', nodes: [
        { title: 'Two Pointers', kind: 'info', description: 'Hai con trỏ quét mảng đã sắp — tổng cặp, đảo, loại trùng.', link: algos,
          resources: [ art('GeeksforGeeks — Two Pointers', 'https://www.geeksforgeeks.org/two-pointers-technique/'), crs('NeetCode — Practice', 'https://neetcode.io/practice') ] },
        { title: 'Sliding Window', kind: 'info', side: 'right', description: 'Cửa sổ trượt cho chuỗi con/đoạn con tối ưu.',
          resources: [ crs('NeetCode — Practice', 'https://neetcode.io/practice'), art('Tech Interview Handbook — Patterns', 'https://www.techinterviewhandbook.org/coding-interview-study-plan/') ] },
        { title: 'Prefix Sum & Hashing', kind: 'info', side: 'left', description: 'Tổng tiền tố, HashMap đếm/tra O(1) — bài tổng đoạn, đếm tần suất.',
          resources: [ crs('NeetCode — Practice', 'https://neetcode.io/practice') ] },
      ]},
      { label: 'Tuyến tính & tìm kiếm', nodes: [
        { title: 'Stack & Monotonic Stack', icon: 'Layers', description: 'Ngoặc hợp lệ, next greater element, biểu thức.', link: algos,
          resources: [ crs('NeetCode — Practice', 'https://neetcode.io/practice') ] },
        { title: 'Linked List', kind: 'info', side: 'right', description: 'Đảo, phát hiện chu trình (Floyd), gộp danh sách.',
          resources: [ art('VisuAlgo — Linked List', 'https://visualgo.net/en/list'), crs('NeetCode — Practice', 'https://neetcode.io/practice') ] },
        { title: 'Binary Search', icon: 'Search', side: 'left', description: 'Tìm nhị phân trên mảng sắp & trên đáp án (binary search on answer).', link: algos,
          resources: [ art('cp-algorithms — Binary Search', 'https://cp-algorithms.com/num_methods/binary_search.html'), crs('NeetCode — Practice', 'https://neetcode.io/practice') ] },
      ]},
      { label: 'Cây & Đồ thị', nodes: [
        { title: 'Trees & Traversal', icon: 'GitFork', description: 'DFS/BFS cây, BST, độ sâu, đường đi, LCA.', link: algos,
          resources: [ art('VisuAlgo — Binary Search Tree', 'https://visualgo.net/en/bst'), crs('NeetCode — Practice', 'https://neetcode.io/practice') ] },
        { title: 'BFS / DFS đồ thị', icon: 'Share2', side: 'right', description: 'Duyệt đồ thị, số đảo, ma trận, topological sort.', link: algos,
          resources: [ art('VisuAlgo — Graph Traversal', 'https://visualgo.net/en/dfsbfs'), crs('NeetCode — Practice', 'https://neetcode.io/practice') ] },
        { title: 'Backtracking', kind: 'info', side: 'left', description: 'Sinh hoán vị/tổ hợp/tập con, N-Queens, Sudoku.', link: algos,
          resources: [ art('VisuAlgo — Recursion', 'https://visualgo.net/en/recursion'), crs('NeetCode — Practice', 'https://neetcode.io/practice') ] },
        { title: 'Graphs nâng cao & Union-Find', kind: 'alternative', side: 'right', description: 'Dijkstra, MST, disjoint set — bài đồ thị khó.', link: algos,
          resources: [ art('VisuAlgo — Union-Find', 'https://visualgo.net/en/ufds'), art('cp-algorithms — Graphs', 'https://cp-algorithms.com/graph/dijkstra.html') ] },
      ]},
      { label: 'Nâng cao', nodes: [
        { title: 'Heap / Priority Queue', icon: 'Zap', description: 'Top-K, merge k lists, median dòng chảy.', link: algos,
          resources: [ art('VisuAlgo — Binary Heap', 'https://visualgo.net/en/heap'), crs('NeetCode — Practice', 'https://neetcode.io/practice') ] },
        { title: 'Quy hoạch động (DP)', icon: 'Grid3x3', description: 'Knapsack, LCS, LIS, coin change — pattern khó nhất & hay gặp.', link: algos,
          resources: [ art('cp-algorithms — Dynamic Programming', 'https://cp-algorithms.com/dynamic_programming/intro-to-dp.html'), crs('NeetCode — Practice', 'https://neetcode.io/practice') ] },
        { title: 'Greedy & Intervals', kind: 'info', side: 'right', description: 'Tham lam, gộp/xếp lịch khoảng, activity selection.',
          resources: [ crs('NeetCode — Practice', 'https://neetcode.io/practice') ] },
        { title: 'Bit Manipulation', kind: 'alternative', side: 'left', description: 'XOR, mask, đếm bit — mẹo tối ưu.',
          resources: [ art('cp-algorithms — Bit Manipulation', 'https://cp-algorithms.com/algebra/bit-manipulation.html') ] },
      ]},
      { label: 'Luyện tập & phỏng vấn', nodes: [
        { title: 'NeetCode 150 / Blind 75', icon: 'Trophy', description: 'Bộ đề tuyển chọn phủ mọi pattern — lộ trình luyện chuẩn.',
          resources: [ crs('NeetCode — Practice (150)', 'https://neetcode.io/practice'), off('LeetCode — Top Interview 150', 'https://leetcode.com/studyplan/top-interview-150/'), vid('NeetCode 150 — All Solutions', 'https://www.youtube.com/watch?v=T0u5nwSA0w0') ] },
        { title: 'Luyện trực quan (Algorithms)', kind: 'info', icon: 'Binary', side: 'right', description: 'Xem thuật toán chạy từng bước tại trang Algorithms.', link: algos,
          resources: [ off('Lộ trình DSA', '/roadmap/dsa') ] },
        { title: 'DSA track (Code Lab)', icon: 'Code2', kind: 'alternative', side: 'left', description: 'Bài tập DSA có chấm tự động.', link: cl('data-structures-algorithms') },
        { title: 'Mock interview & giao tiếp', kind: 'info', side: 'right', description: 'Nói to suy nghĩ, làm rõ đề, phân tích độ phức tạp; luyện phỏng vấn thử.',
          resources: [ off('Tech Interview Handbook', 'https://www.techinterviewhandbook.org/'), art('Tech Interview Handbook — Behavioral', 'https://www.techinterviewhandbook.org/behavioral-interview/') ] },
      ]},
    ],
  },

  // ─────────────────────────────── FRONTEND ───────────────────────────────
  {
    slug: 'frontend', title: 'Frontend', type: 'role', icon: 'Monitor', color: '#6366f1',
    description: 'Lộ trình đầy đủ để trở thành lập trình viên Frontend — từ nền tảng web đến framework hiện đại, kiểm thử và tối ưu hiệu năng.',
    stages: [
      { label: 'Nền tảng Web', nodes: [
        { title: 'Internet & HTTP hoạt động thế nào', kind: 'info', description: 'HTTP/HTTPS, DNS, request/response, trình duyệt render trang, HTTP/2 & HTTP/3.',
          resources: [ art('MDN — Tổng quan HTTP', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview'), art('roadmap.sh — Internet hoạt động thế nào', 'https://roadmap.sh/guides/what-is-internet'), art('How HTTPS Works', 'https://howhttps.works/') ] },
        { title: 'HTML', subtitle: 'Cấu trúc trang', icon: 'FileCode', side: 'left', description: 'Thẻ ngữ nghĩa, form & input, bảng, accessibility, meta/SEO on-page.', link: cl('html-css'),
          resources: [ off('MDN — Học HTML', 'https://developer.mozilla.org/en-US/docs/Learn/HTML'), art('web.dev — Learn HTML', 'https://web.dev/learn/html'), crs('freeCodeCamp — Responsive Web Design', 'https://www.freecodecamp.org/learn/2022/responsive-web-design/') ] },
        { title: 'CSS', subtitle: 'Trình bày & layout', icon: 'Palette', side: 'right', description: 'Box model, Flexbox, Grid, responsive, biến CSS, transition & animation.', link: cl('html-css'),
          resources: [ off('MDN — Học CSS', 'https://developer.mozilla.org/en-US/docs/Learn/CSS'), art('Flexbox Froggy (game)', 'https://flexboxfroggy.com/'), art('CSS Grid Garden (game)', 'https://cssgridgarden.com/'), art('web.dev — Learn CSS', 'https://web.dev/learn/css') ] },
        { title: 'Responsive & Mobile-first', kind: 'info', side: 'left', description: 'Media query, breakpoint, đơn vị rem/vw, thiết kế từ nhỏ đến lớn.',
          resources: [ art('MDN — Responsive design', 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design') ] },
        { title: 'Sass/SCSS', kind: 'alternative', side: 'right', description: 'CSS có biến, nesting, mixin — tổ chức style lớn dễ hơn.', link: ext('https://sass-lang.com/documentation/'),
          resources: [ off('Sass Documentation', 'https://sass-lang.com/documentation/') ] },
      ]},
      { label: 'JavaScript', nodes: [
        { title: 'JavaScript cơ bản', subtitle: 'Ngôn ngữ của web', icon: 'Braces', description: 'Biến, kiểu, hàm, mảng/đối tượng, vòng lặp, ES modules.', link: cl('javascript'),
          resources: [ off('MDN — Học JavaScript', 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript'), art('javascript.info', 'https://javascript.info/'), crs('freeCodeCamp — JS Algorithms', 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/') ] },
        { title: 'DOM & sự kiện', kind: 'info', side: 'left', description: 'Truy vấn/chỉnh DOM, event listener, event delegation.',
          resources: [ art('MDN — Giới thiệu DOM', 'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction') ] },
        { title: 'Bất đồng bộ & Fetch API', kind: 'info', side: 'right', description: 'Promise, async/await, gọi API, xử lý JSON & lỗi mạng.',
          resources: [ art('MDN — Promise', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise'), art('MDN — Fetch API', 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API') ] },
        { title: 'TypeScript', subtitle: 'JS có kiểu', icon: 'Braces', kind: 'alternative', side: 'left', description: 'Kiểu tĩnh, interface, generic — bắt lỗi sớm, dự án lớn dễ bảo trì.', link: cl('typescript'),
          resources: [ off('TypeScript Handbook', 'https://www.typescriptlang.org/docs/handbook/intro.html'), off('Lộ trình TypeScript', '/roadmap') ] },
      ]},
      { label: 'Công cụ nghề', nodes: [
        { title: 'Git & GitHub', icon: 'GitBranch', description: 'Version control, branch, merge, pull request — bắt buộc.', link: cl('git'),
          resources: [ off('Pro Git (sách miễn phí)', 'https://git-scm.com/book/en/v2'), art('GitHub — Git Handbook', 'https://docs.github.com/en/get-started/using-git/about-git'), art('Learn Git Branching (tương tác)', 'https://learngitbranching.js.org/') ] },
        { title: 'npm & bundler', kind: 'info', side: 'right', description: 'Quản lý thư viện, script, Vite/webpack, tree-shaking.',
          resources: [ off('Vite — Getting Started', 'https://vitejs.dev/guide/'), off('npm docs', 'https://docs.npmjs.com/') ] },
        { title: 'Tailwind CSS', icon: 'Wind', kind: 'alternative', side: 'left', description: 'Utility-first — dựng UI nhanh, nhất quán, dễ theme.', link: cl('tailwind-css'),
          resources: [ off('Tailwind CSS Docs', 'https://tailwindcss.com/docs') ] },
      ]},
      { label: 'Framework (chọn 1)', nodes: [
        { title: 'React', subtitle: 'Phổ biến nhất', icon: 'Atom', description: 'Component, hook, state, JSX — hệ sinh thái lớn nhất.', link: cl('react'),
          resources: [ off('react.dev — Learn', 'https://react.dev/learn'), off('Lộ trình React (chi tiết)', '/roadmap/react') ] },
        { title: 'Vue', icon: 'Atom', kind: 'alternative', side: 'left', description: 'Nhẹ, dễ học, reactivity trực quan.', link: cl('vue'),
          resources: [ off('Vue.js Guide', 'https://vuejs.org/guide/introduction.html') ] },
        { title: 'Angular', icon: 'Atom', kind: 'alternative', side: 'right', description: 'Framework đầy đủ, TypeScript-first, hợp dự án lớn.', link: cl('angular'),
          resources: [ off('Angular Docs', 'https://angular.dev/') ] },
        { title: 'Quản lý state', kind: 'info', description: 'Context, Zustand, Redux/Pinia — khi app phình to.',
          resources: [ off('Redux Toolkit', 'https://redux-toolkit.js.org/'), off('Zustand', 'https://zustand.docs.pmnd.rs/') ] },
      ]},
      { label: 'Chất lượng & Kiểm thử', nodes: [
        { title: 'Testing', kind: 'info', description: 'Unit (Vitest/Jest), component (Testing Library), E2E (Playwright).',
          resources: [ off('Testing Library', 'https://testing-library.com/docs/'), off('Playwright', 'https://playwright.dev/docs/intro') ] },
        { title: 'Accessibility (a11y)', kind: 'info', side: 'right', description: 'ARIA, keyboard nav, contrast — web cho mọi người.',
          resources: [ off('MDN — Accessibility', 'https://developer.mozilla.org/en-US/docs/Web/Accessibility'), art('web.dev — Learn Accessibility', 'https://web.dev/learn/accessibility') ] },
        { title: 'Data Structures & Algorithms', icon: 'Binary', side: 'left', description: 'Tư duy giải thuật — luyện trực quan tại trang Algorithms.', link: algos,
          resources: [ art('VisuAlgo — trực quan hoá thuật toán', 'https://visualgo.net/en'), crs('NeetCode — Roadmap', 'https://neetcode.io/roadmap') ] },
      ]},
      { label: 'Nâng cao & Production', nodes: [
        { title: 'Next.js', subtitle: 'React + SSR/SEO', icon: 'Layers', description: 'SSR/SSG, App Router, API routes, tối ưu SEO & ảnh.', link: cl('nextjs'),
          resources: [ off('Next.js — Learn', 'https://nextjs.org/learn') ] },
        { title: 'Web Performance', kind: 'info', side: 'right', description: 'Core Web Vitals, lazy-load, code-splitting, caching.',
          resources: [ art('web.dev — Learn Performance', 'https://web.dev/learn/performance'), art('Core Web Vitals', 'https://web.dev/articles/vitals') ] },
        { title: 'PWA & offline', kind: 'alternative', side: 'left', description: 'Service worker, cache, cài như app.',
          resources: [ art('web.dev — Learn PWA', 'https://web.dev/learn/pwa') ] },
        { title: 'React Native', subtitle: 'Sang mobile', icon: 'Smartphone', kind: 'alternative', side: 'right', description: 'Dùng React để làm app iOS/Android.', link: cl('react-native'),
          resources: [ off('React Native — Docs', 'https://reactnative.dev/docs/getting-started'), off('Expo — Docs', 'https://docs.expo.dev/') ] },
        { title: 'Tiếp: Backend', kind: 'alternative', side: 'left', description: 'Muốn full-stack? Xem lộ trình Backend / Full Stack.', link: rm('fullstack') },
      ]},
    ],
  },

  // ─────────────────────────────── BACKEND ───────────────────────────────
  {
    slug: 'backend', title: 'Backend', type: 'role', icon: 'Server', color: '#10b981',
    description: 'Lộ trình lập trình viên Backend theo roadmap.sh — nền tảng, một ngôn ngữ, cơ sở dữ liệu, API, caching, bảo mật, kiểm thử và triển khai.',
    stages: [
      { label: 'Nền tảng bắt buộc', nodes: [
        { title: 'Internet & HTTP', kind: 'info', description: 'Cách Internet hoạt động, HTTP/HTTPS, DNS, tên miền, hosting, trình duyệt.',
          resources: [ art('MDN — Tổng quan HTTP', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview'), art('roadmap.sh — Internet hoạt động thế nào', 'https://roadmap.sh/guides/what-is-internet') ] },
        { title: 'Terminal & Linux cơ bản', icon: 'Terminal', side: 'right', description: 'Dòng lệnh, quản lý tiến trình, quyền — nền của server.', link: cl('linux-bash'),
          resources: [ off('The Linux Command Line (sách)', 'https://linuxcommand.org/tlcl.php') ] },
        { title: 'Version Control — Git', icon: 'GitBranch', side: 'left', description: 'Git + GitHub/GitLab — quản lý mã, PR, review.', link: cl('git'),
          resources: [ off('Pro Git', 'https://git-scm.com/book/en/v2') ] },
      ]},
      { label: 'Chọn MỘT ngôn ngữ', nodes: [
        { title: 'Chọn một ngôn ngữ để đi sâu', kind: 'info', description: 'Đừng học nhiều ngôn ngữ cùng lúc — chọn 1, làm chủ nền tảng, rồi mới mở rộng.',
          resources: [ art('roadmap.sh — Backend', 'https://roadmap.sh/backend') ] },
        { title: 'Node.js', subtitle: 'JavaScript phía server', icon: 'Hexagon', side: 'left', description: 'Express/NestJS, non-blocking I/O.', link: cl('nodejs-express'),
          resources: [ off('Node.js — Learn', 'https://nodejs.org/en/learn'), off('Lộ trình Node.js', '/roadmap/nodejs') ] },
        { title: 'Python', icon: 'Braces', side: 'right', description: 'Django/FastAPI — gọn, mạnh về data & AI.', link: cl('python'),
          resources: [ off('Lộ trình Python', '/roadmap/python') ] },
        { title: 'Java', icon: 'Coffee', kind: 'alternative', side: 'left', description: 'Spring Boot — chuẩn doanh nghiệp.', link: cl('java-core'),
          resources: [ off('dev.java — Learn', 'https://dev.java/learn/'), off('Spring — Guides', 'https://spring.io/guides') ] },
        { title: 'Go', icon: 'Rabbit', kind: 'alternative', side: 'right', description: 'Nhanh, gọn — microservice & hạ tầng.', link: cl('go'),
          resources: [ off('A Tour of Go', 'https://go.dev/tour/'), off('Go — Learn', 'https://go.dev/learn/') ] },
      ]},
      { label: 'Cơ sở dữ liệu', nodes: [
        { title: 'SQL quan hệ (PostgreSQL)', icon: 'Database', description: 'Quan hệ, index, transaction, join — nền tảng bắt buộc.', link: cl('postgresql'),
          resources: [ off('PostgreSQL Tutorial', 'https://www.postgresql.org/docs/current/tutorial.html'), off('Lộ trình SQL', '/roadmap/sql') ] },
        { title: 'ORM', icon: 'Layers', side: 'right', description: 'Prisma/TypeORM/SQLAlchemy — thao tác DB an toàn, migration.', link: cl('prisma-orm'),
          resources: [ off('Prisma Docs', 'https://www.prisma.io/docs') ] },
        { title: 'NoSQL — MongoDB', icon: 'Database', kind: 'alternative', side: 'left', description: 'Document store — schema linh hoạt.', link: cl('mongodb'),
          resources: [ off('MongoDB — Manual', 'https://www.mongodb.com/docs/manual/'), crs('MongoDB University', 'https://learn.mongodb.com/') ] },
        { title: 'Sao chép, phân mảnh, ACID', kind: 'info', side: 'right', description: 'Replication, sharding, transaction, tính nhất quán.',
          resources: [ off('PostgreSQL — High Availability & Replication', 'https://www.postgresql.org/docs/current/high-availability.html'), art('Martin Kleppmann — Designing Data-Intensive Applications', 'https://dataintensive.net/') ] },
      ]},
      { label: 'API', nodes: [
        { title: 'REST API', icon: 'Webhook', description: 'Tài nguyên, versioning, status code, phân trang, JSON.', link: cl('rest-apis'),
          resources: [ art('MDN — REST', 'https://developer.mozilla.org/en-US/docs/Glossary/REST'), off('OpenAPI Specification', 'https://swagger.io/specification/') ] },
        { title: 'Xác thực & phân quyền', kind: 'info', side: 'right', description: 'JWT, OAuth2, session, cookie, hash mật khẩu, RBAC.',
          resources: [ art('JWT — Introduction', 'https://jwt.io/introduction'), art('OAuth 2.0 Simplified', 'https://www.oauth.com/') ] },
        { title: 'GraphQL', icon: 'Share2', kind: 'alternative', side: 'left', description: 'Query linh hoạt, 1 endpoint.', link: cl('graphql'),
          resources: [ off('GraphQL — Learn', 'https://graphql.org/learn/'), off('Apollo — Docs', 'https://www.apollographql.com/docs/') ] },
        { title: 'Realtime (WebSocket)', icon: 'Share2', kind: 'alternative', side: 'right', description: 'Socket.IO — chat, thông báo hai chiều.', link: cl('redis'),
          resources: [ art('MDN — WebSockets API', 'https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API'), off('Socket.IO — Docs', 'https://socket.io/docs/v4/') ] },
      ]},
      { label: 'Hiệu năng & Bảo mật', nodes: [
        { title: 'Caching', icon: 'Zap', description: 'Redis, cache tầng server/CDN, cache-aside, TTL.', link: cl('redis'),
          resources: [ off('Redis — Docs', 'https://redis.io/docs/latest/') ] },
        { title: 'Bảo mật web (OWASP)', kind: 'info', side: 'right', description: 'SQL injection, XSS, CSRF, CORS, rate limit, HTTPS.',
          resources: [ art('OWASP Top 10', 'https://owasp.org/www-project-top-ten/'), art('OWASP Cheat Sheets', 'https://cheatsheetseries.owasp.org/') ] },
        { title: 'Testing', kind: 'info', side: 'left', description: 'Unit, integration, E2E — API tin cậy.',
          resources: [ off('Jest — Getting Started', 'https://jestjs.io/docs/getting-started'), off('Vitest — Guide', 'https://vitest.dev/guide/') ] },
      ]},
      { label: 'Kiến trúc & Triển khai', nodes: [
        { title: 'Docker & container', icon: 'Container', description: 'Đóng gói app — chạy giống nhau mọi nơi.', link: cl('docker'),
          resources: [ off('Docker — Get Started', 'https://docs.docker.com/get-started/') ] },
        { title: 'Message Queue', kind: 'alternative', side: 'right', description: 'RabbitMQ/Kafka — xử lý bất đồng bộ, tách dịch vụ.',
          resources: [ off('RabbitMQ — Tutorials', 'https://www.rabbitmq.com/tutorials'), off('Apache Kafka — Docs', 'https://kafka.apache.org/documentation/') ] },
        { title: 'Kiến trúc & mở rộng', kind: 'info', side: 'left', description: 'Monolith vs microservice, load balancing, horizontal scaling.',
          resources: [ art('roadmap.sh — System Design', 'https://roadmap.sh/system-design'), off('Lộ trình System Design', '/roadmap/system-design') ] },
        { title: 'Tiếp: DevOps', kind: 'alternative', side: 'right', description: 'CI/CD, Kubernetes, giám sát.', link: rm('devops') },
      ]},
    ],
  },

  // ─────────────────────────────── DEVOPS ───────────────────────────────
  {
    slug: 'devops', title: 'DevOps', type: 'role', icon: 'Infinity', color: '#f59e0b',
    description: 'Lộ trình DevOps — hệ điều hành, mạng, container, CI/CD, hạ tầng như mã, giám sát và cloud.',
    stages: [
      { label: 'Nền tảng', nodes: [
        { title: 'Linux & Bash', icon: 'Terminal', description: 'Dòng lệnh, quyền, tiến trình, cron, shell script.', link: cl('linux-bash'),
          resources: [ off('The Linux Command Line', 'https://linuxcommand.org/tlcl.php') ] },
        { title: 'Mạng & giao thức', kind: 'info', side: 'right', description: 'IP/subnet, DNS, HTTP, SSH, TLS, firewall, load balancer.',
          resources: [ art('Cloudflare — Learning Center', 'https://www.cloudflare.com/learning/') ] },
        { title: 'Git', icon: 'GitBranch', side: 'left', description: 'Nền tảng cho mọi pipeline CI/CD.', link: cl('git'),
          resources: [ off('Pro Git', 'https://git-scm.com/book/en/v2') ] },
        { title: 'Một ngôn ngữ script', kind: 'info', side: 'right', description: 'Python/Go/Bash để tự động hoá.',
          resources: [ off('Bash Guide — Greg Wiki', 'https://mywiki.wooledge.org/BashGuide'), off('Python — Official Tutorial', 'https://docs.python.org/3/tutorial/') ] },
      ]},
      { label: 'Container', nodes: [
        { title: 'Docker', icon: 'Container', description: 'Image, container, Dockerfile, compose, registry, network/volume.', link: cl('docker'),
          resources: [ off('Docker — Get Started', 'https://docs.docker.com/get-started/') ] },
        { title: 'Kubernetes', icon: 'Ship', side: 'right', description: 'Điều phối quy mô lớn: pod, service, deployment, ingress.', link: cl('kubernetes'),
          resources: [ off('Kubernetes — Basics', 'https://kubernetes.io/docs/tutorials/kubernetes-basics/') ] },
        { title: 'Helm', kind: 'alternative', side: 'left', description: 'Đóng gói cấu hình K8s theo chart.', link: ext('https://helm.sh/docs/'),
          resources: [ off('Helm — Docs', 'https://helm.sh/docs/') ] },
        { title: 'Nginx (reverse proxy)', kind: 'alternative', side: 'right', description: 'Reverse proxy, TLS, cân bằng tải.', link: ext('https://nginx.org/en/docs/'),
          resources: [ off('Nginx — Beginner Guide', 'https://nginx.org/en/docs/beginners_guide.html') ] },
      ]},
      { label: 'Tự động hoá', nodes: [
        { title: 'CI/CD', kind: 'info', description: 'Pipeline build → test → deploy tự động.', link: cl('github-actions'),
          resources: [ off('GitHub Actions — Docs', 'https://docs.github.com/en/actions') ] },
        { title: 'Terraform (IaC)', kind: 'info', side: 'left', description: 'Dựng hạ tầng bằng mã, tái lập, state.', link: ext('https://developer.hashicorp.com/terraform/docs'),
          resources: [ off('Terraform — Docs', 'https://developer.hashicorp.com/terraform/docs') ] },
        { title: 'Ansible', kind: 'alternative', side: 'right', description: 'Cấu hình máy chủ theo playbook.', link: ext('https://docs.ansible.com/'),
          resources: [ off('Ansible — Getting Started', 'https://docs.ansible.com/ansible/latest/getting_started/index.html') ] },
      ]},
      { label: 'Cloud', nodes: [
        { title: 'AWS', icon: 'Ship', side: 'left', description: 'EC2, S3, VPC, IAM, RDS — cloud phổ biến nhất.', link: ext('https://roadmap.sh/aws'),
          resources: [ off('AWS — Getting Started', 'https://aws.amazon.com/getting-started/') ] },
        { title: 'GCP / Azure', kind: 'alternative', side: 'right', description: 'Cloud khác — khái niệm tương đương.', link: ext('https://cloud.google.com/docs'),
          resources: [ off('Google Cloud — Docs', 'https://cloud.google.com/docs'), off('Microsoft Azure — Docs', 'https://learn.microsoft.com/en-us/azure/') ] },
        { title: 'Serverless', kind: 'alternative', side: 'left', description: 'Lambda/Cloud Functions — chạy code không cần server.',
          resources: [ off('AWS Lambda — Developer Guide', 'https://docs.aws.amazon.com/lambda/latest/dg/welcome.html') ] },
      ]},
      { label: 'Vận hành', nodes: [
        { title: 'Giám sát & Metrics', kind: 'info', description: 'Prometheus + Grafana.', link: ext('https://prometheus.io/docs/introduction/overview/'),
          resources: [ off('Prometheus — Docs', 'https://prometheus.io/docs/introduction/overview/'), off('Grafana — Docs', 'https://grafana.com/docs/') ] },
        { title: 'Logging & Tracing', kind: 'info', side: 'right', description: 'Log tập trung (ELK), tracing phân tán (OpenTelemetry).',
          resources: [ off('OpenTelemetry — Docs', 'https://opentelemetry.io/docs/'), off('Elastic Stack — Guide', 'https://www.elastic.co/guide/index.html') ] },
        { title: 'Bảo mật & Secrets', kind: 'info', side: 'left', description: 'Quản lý bí mật, quét lỗ hổng, least-privilege.',
          resources: [ off('HashiCorp Vault — Docs', 'https://developer.hashicorp.com/vault/docs'), art('OWASP — DevSecOps Guideline', 'https://owasp.org/www-project-devsecops-guideline/') ] },
      ]},
    ],
  },

  // ─────────────────────────────── DATA ANALYST ───────────────────────────────
  {
    slug: 'data-analyst', title: 'Data Analyst', type: 'role', icon: 'Grid3x3', color: '#0ea5e9',
    description: 'Lộ trình Data Analyst — thống kê, SQL, Excel/Sheets, Python phân tích, và trực quan hoá dữ liệu.',
    stages: [
      { label: 'Nền tảng', nodes: [
        { title: 'Tư duy dữ liệu & thống kê', kind: 'info', description: 'Trung bình/trung vị, phân phối, tương quan, sai số, p-value.',
          resources: [ crs('Khan Academy — Statistics', 'https://www.khanacademy.org/math/statistics-probability') ] },
        { title: 'Excel / Google Sheets', kind: 'info', side: 'right', description: 'Hàm, pivot table, VLOOKUP/XLOOKUP, biểu đồ.',
          resources: [ off('Google Sheets — Trợ giúp', 'https://support.google.com/docs/topic/9054603') ] },
      ]},
      { label: 'Truy vấn dữ liệu', nodes: [
        { title: 'SQL cho phân tích', icon: 'Database', description: 'SELECT, JOIN, GROUP BY, window function — lấy & tổng hợp dữ liệu.', link: cl('sql'),
          resources: [ crs('Mode — SQL Tutorial', 'https://mode.com/sql-tutorial/'), off('Lộ trình SQL', '/roadmap/sql') ] },
        { title: 'Làm sạch dữ liệu', kind: 'info', side: 'right', description: 'Xử lý thiếu, trùng, chuẩn hoá, kiểu dữ liệu.',
          resources: [ off('Pandas — Working with Missing Data', 'https://pandas.pydata.org/docs/user_guide/missing_data.html') ] },
      ]},
      { label: 'Python phân tích', nodes: [
        { title: 'Python cơ bản', icon: 'Braces', description: 'Cú pháp, cấu trúc dữ liệu — nền cho phân tích.', link: cl('python'),
          resources: [ off('Lộ trình Python', '/roadmap/python') ] },
        { title: 'Pandas & NumPy', kind: 'info', side: 'right', description: 'DataFrame, lọc/nhóm/ghép, xử lý số.',
          resources: [ off('Pandas — Getting Started', 'https://pandas.pydata.org/docs/getting_started/index.html'), off('NumPy — Beginner Guide', 'https://numpy.org/doc/stable/user/absolute_beginners.html') ] },
        { title: 'Jupyter Notebook', kind: 'alternative', side: 'left', description: 'Môi trường phân tích tương tác.', link: ext('https://jupyter.org/'),
          resources: [ off('Jupyter — Docs', 'https://docs.jupyter.org/en/latest/') ] },
      ]},
      { label: 'Trực quan hoá', nodes: [
        { title: 'Biểu đồ & storytelling', kind: 'info', description: 'Chọn đúng loại biểu đồ, kể chuyện bằng dữ liệu.',
          resources: [ art('Data Viz Catalogue', 'https://datavizcatalogue.com/') ] },
        { title: 'BI tool (Power BI / Tableau)', kind: 'alternative', side: 'right', description: 'Dashboard doanh nghiệp, tự phục vụ.',
          resources: [ off('Power BI — Learn', 'https://learn.microsoft.com/en-us/power-bi/'), crs('Tableau — Training', 'https://www.tableau.com/learn/training') ] },
        { title: 'Tiếp: Data Scientist / MLOps', kind: 'alternative', side: 'left', description: 'Muốn đi sâu ML? Xem AI Engineer.', link: rm('ai-engineer') },
      ]},
    ],
  },

  // ─────────────────────────────── FULL STACK ───────────────────────────────
  {
    slug: 'fullstack', title: 'Full Stack', type: 'role', icon: 'Layers', color: '#8b5cf6',
    description: 'Lộ trình Full Stack — gộp Frontend + Backend + hạ tầng, xây được sản phẩm hoàn chỉnh đầu-cuối.',
    stages: [
      { label: 'Frontend', nodes: [
        { title: 'HTML, CSS, JavaScript', icon: 'FileCode', description: 'Nền tảng giao diện — xem chi tiết ở lộ trình Frontend.', link: cl('html-css'),
          resources: [ off('Lộ trình Frontend đầy đủ', '/roadmap/frontend') ] },
        { title: 'React + Next.js', icon: 'Atom', side: 'right', description: 'Framework UI + SSR/SEO.', link: cl('nextjs'),
          resources: [ off('Lộ trình React', '/roadmap/react') ] },
      ]},
      { label: 'Backend', nodes: [
        { title: 'Node.js + API', icon: 'Hexagon', description: 'Express/NestJS, REST/GraphQL — xem chi tiết ở lộ trình Backend.', link: cl('nodejs-express'),
          resources: [ off('Lộ trình Backend đầy đủ', '/roadmap/backend') ] },
        { title: 'Cơ sở dữ liệu + ORM', icon: 'Database', side: 'right', description: 'PostgreSQL + Prisma, thiết kế schema.', link: cl('postgresql'),
          resources: [ off('PostgreSQL — Tutorial', 'https://www.postgresql.org/docs/current/tutorial.html'), off('Prisma — Docs', 'https://www.prisma.io/docs') ] },
        { title: 'Xác thực & bảo mật', kind: 'info', side: 'left', description: 'JWT/OAuth, bảo vệ API, OWASP.',
          resources: [ art('JWT — Introduction', 'https://jwt.io/introduction'), art('OWASP Top 10', 'https://owasp.org/www-project-top-ten/') ] },
      ]},
      { label: 'Kết nối đầu-cuối', nodes: [
        { title: 'Gọi API từ FE ↔ BE', kind: 'info', description: 'Fetch/axios, state server (React Query), xử lý lỗi & loading.',
          resources: [ off('TanStack Query', 'https://tanstack.com/query/latest'), off('axios — Docs', 'https://axios-http.com/docs/intro') ] },
        { title: 'Realtime & upload', kind: 'alternative', side: 'right', description: 'WebSocket, upload file/ảnh (R2/S3).',
          resources: [ off('Socket.IO — Docs', 'https://socket.io/docs/v4/'), off('Cloudflare R2 — Docs', 'https://developers.cloudflare.com/r2/') ] },
      ]},
      { label: 'Triển khai', nodes: [
        { title: 'Docker & Deploy', icon: 'Container', description: 'Đóng gói & đưa sản phẩm lên VPS/cloud.', link: cl('docker'),
          resources: [ off('Lộ trình DevOps', '/roadmap/devops') ] },
        { title: 'CI/CD', kind: 'info', side: 'right', description: 'Tự động build/test/deploy.', link: cl('github-actions'),
          resources: [ off('GitHub Actions — Docs', 'https://docs.github.com/en/actions') ] },
      ]},
    ],
  },

  // ─────────────────────────────── AI ENGINEER ───────────────────────────────
  {
    slug: 'ai-engineer', title: 'AI Engineer', type: 'role', icon: 'Sparkles', color: '#ec4899',
    description: 'Lộ trình AI Engineer — nền toán/Python, machine learning, deep learning, LLM & xây ứng dụng AI.',
    stages: [
      { label: 'Nền tảng', nodes: [
        { title: 'Python cho AI', icon: 'Braces', description: 'Python + NumPy/Pandas — ngôn ngữ số 1 của AI.', link: cl('python'),
          resources: [ off('Lộ trình Python', '/roadmap/python') ] },
        { title: 'Toán: đại số tuyến tính & xác suất', kind: 'info', side: 'right', description: 'Vector/ma trận, đạo hàm, xác suất — nền của ML.',
          resources: [ crs('Khan Academy — Linear Algebra', 'https://www.khanacademy.org/math/linear-algebra') ] },
      ]},
      { label: 'Machine Learning', nodes: [
        { title: 'ML cơ bản', kind: 'info', description: 'Hồi quy, phân loại, overfitting, đánh giá mô hình.',
          resources: [ off('scikit-learn — User Guide', 'https://scikit-learn.org/stable/user_guide.html') ] },
        { title: 'Deep Learning', kind: 'info', side: 'right', description: 'Mạng nơ-ron, CNN, RNN, backprop.',
          resources: [ crs('Deep Learning (Google Crash Course)', 'https://developers.google.com/machine-learning/crash-course') ] },
      ]},
      { label: 'LLM & GenAI', nodes: [
        { title: 'Transformer & LLM', kind: 'info', description: 'Attention, tokenization, mô hình ngôn ngữ lớn.',
          resources: [ art('The Illustrated Transformer', 'https://jalammar.github.io/illustrated-transformer/') ] },
        { title: 'Prompt Engineering', kind: 'info', side: 'right', description: 'Viết prompt hiệu quả, few-shot, chain-of-thought.',
          resources: [ off('OpenAI — Prompt Engineering', 'https://platform.openai.com/docs/guides/prompt-engineering') ] },
        { title: 'RAG & Vector DB', kind: 'alternative', side: 'left', description: 'Truy hồi tài liệu + LLM, embedding, vector search.',
          resources: [ crs('Pinecone — Learn', 'https://www.pinecone.io/learn/'), off('LangChain — Docs', 'https://python.langchain.com/docs/introduction/') ] },
        { title: 'Agent & tool use', kind: 'alternative', side: 'right', description: 'LLM gọi công cụ, lập kế hoạch nhiều bước.',
          resources: [ off('Anthropic — Tool Use', 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use'), off('LangChain — Agents', 'https://python.langchain.com/docs/introduction/') ] },
      ]},
      { label: 'Xây ứng dụng AI', nodes: [
        { title: 'API LLM & tích hợp', kind: 'info', description: 'Gọi API model, streaming, quản lý chi phí/token.',
          resources: [ off('Anthropic — API Docs', 'https://docs.anthropic.com/'), off('OpenAI — API Docs', 'https://platform.openai.com/docs/') ] },
        { title: 'Triển khai & MLOps', kind: 'alternative', side: 'right', description: 'Đóng gói, giám sát, cập nhật mô hình.', link: rm('devops'),
          resources: [ crs('ml-ops.org — MLOps Principles', 'https://ml-ops.org/') ] },
      ]},
    ],
  },

  // ─────────────────────────────── QA / TESTING ───────────────────────────────
  {
    slug: 'qa', title: 'QA / Kiểm thử', type: 'role', icon: 'Check', color: '#14b8a6',
    description: 'Lộ trình QA/Automation — nền tảng kiểm thử, viết test case, tự động hoá UI/API và CI.',
    stages: [
      { label: 'Nền tảng', nodes: [
        { title: 'Nguyên lý kiểm thử', kind: 'info', description: 'Loại test, test case, bug report, chu trình QA, black/white-box.',
          resources: [ art('ISTQB — Foundation Syllabus', 'https://www.istqb.org/') ] },
        { title: 'Một ngôn ngữ (JS/Python)', icon: 'Braces', side: 'right', description: 'Để viết automation script.', link: cl('javascript'),
          resources: [ off('MDN — Học JavaScript', 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript'), off('Python — Official Tutorial', 'https://docs.python.org/3/tutorial/') ] },
      ]},
      { label: 'Automation', nodes: [
        { title: 'UI Automation (Playwright/Cypress)', kind: 'info', description: 'Tự động test giao diện đầu-cuối.',
          resources: [ off('Playwright — Docs', 'https://playwright.dev/docs/intro'), off('Cypress — Docs', 'https://docs.cypress.io/') ] },
        { title: 'API Testing', kind: 'info', side: 'right', description: 'Postman, REST client, kiểm thử hợp đồng.', link: cl('rest-apis'),
          resources: [ off('Postman — Learning', 'https://learning.postman.com/') ] },
        { title: 'Unit & Integration', kind: 'alternative', side: 'left', description: 'Test tầng thấp: Jest/Vitest/pytest.',
          resources: [ off('Jest — Getting Started', 'https://jestjs.io/docs/getting-started'), off('pytest — Docs', 'https://docs.pytest.org/en/stable/') ] },
      ]},
      { label: 'Chất lượng liên tục', nodes: [
        { title: 'CI cho test', kind: 'info', description: 'Chạy test tự động trong pipeline.', link: cl('github-actions'),
          resources: [ off('GitHub Actions — Docs', 'https://docs.github.com/en/actions') ] },
        { title: 'Performance & Load test', kind: 'alternative', side: 'right', description: 'k6/JMeter — đo chịu tải.',
          resources: [ off('Grafana k6 — Docs', 'https://grafana.com/docs/k6/latest/'), off('Apache JMeter — User Manual', 'https://jmeter.apache.org/usermanual/index.html') ] },
      ]},
    ],
  },

  // ─────────────────────────────── SYSTEM DESIGN ───────────────────────────────
  {
    slug: 'system-design', title: 'System Design', type: 'skill', icon: 'Boxes', color: '#f97316',
    description: 'Lộ trình thiết kế hệ thống — mở rộng, cân bằng tải, caching, database, hàng đợi, và các mẫu kiến trúc.',
    stages: [
      { label: 'Nền tảng', nodes: [
        { title: 'Client–Server & mạng', kind: 'info', description: 'HTTP, DNS, latency vs throughput, TCP/UDP.',
          resources: [ art('roadmap.sh — System Design', 'https://roadmap.sh/system-design') ] },
        { title: 'Ước lượng & trade-off', kind: 'info', side: 'right', description: 'Back-of-envelope, CAP theorem, nhất quán vs sẵn sàng.',
          resources: [ art('System Design Primer', 'https://github.com/donnemartin/system-design-primer'), art('CAP Theorem — Cloudflare', 'https://www.cloudflare.com/learning/') ] },
      ]},
      { label: 'Mở rộng', nodes: [
        { title: 'Horizontal vs Vertical Scaling', kind: 'info', description: 'Nhân bản dịch vụ, stateless, auto-scaling.',
          resources: [ art('System Design Primer — Scalability', 'https://github.com/donnemartin/system-design-primer') ] },
        { title: 'Load Balancer', kind: 'info', side: 'right', description: 'Phân phối tải, health check, sticky session.',
          resources: [ art('Cloudflare — What is Load Balancing', 'https://www.cloudflare.com/learning/performance/what-is-load-balancing/') ] },
        { title: 'Caching', icon: 'Zap', side: 'left', description: 'CDN, Redis, cache-aside, invalidation.', link: cl('redis'),
          resources: [ off('Redis — Docs', 'https://redis.io/docs/latest/'), art('Cloudflare — What is a CDN', 'https://www.cloudflare.com/learning/cdn/what-is-a-cdn/') ] },
      ]},
      { label: 'Dữ liệu', nodes: [
        { title: 'SQL vs NoSQL', icon: 'Database', description: 'Chọn store phù hợp; index, replication, sharding.', link: cl('postgresql'),
          resources: [ off('Lộ trình SQL', '/roadmap/sql') ] },
        { title: 'Message Queue', kind: 'info', side: 'right', description: 'Kafka/RabbitMQ — bất đồng bộ, tách dịch vụ.',
          resources: [ off('RabbitMQ — Tutorials', 'https://www.rabbitmq.com/tutorials'), off('Apache Kafka — Docs', 'https://kafka.apache.org/documentation/') ] },
      ]},
      { label: 'Kiến trúc & mẫu', nodes: [
        { title: 'Microservices vs Monolith', kind: 'info', description: 'Đánh đổi, API gateway, service discovery.',
          resources: [ art('Martin Fowler — Microservices', 'https://martinfowler.com/articles/microservices.html') ] },
        { title: 'Rate limiting & Idempotency', kind: 'alternative', side: 'right', description: 'Chống lạm dụng, xử lý trùng lặp an toàn.',
          resources: [ art('Cloudflare — What is Rate Limiting', 'https://www.cloudflare.com/learning/bots/what-is-rate-limiting/'), art('Stripe — Idempotent Requests', 'https://docs.stripe.com/api/idempotent_requests') ] },
        { title: 'Case studies', kind: 'alternative', side: 'left', description: 'Thiết kế URL shortener, feed, chat, thanh toán...',
          resources: [ art('System Design Primer (GitHub)', 'https://github.com/donnemartin/system-design-primer') ] },
      ]},
    ],
  },

  // ─────────────────────────────── PYTHON ───────────────────────────────
  {
    slug: 'python', title: 'Python', type: 'skill', icon: 'Braces', color: '#3b82f6',
    description: 'Từ cú pháp cơ bản đến OOP, giải thuật, web và thực hành chuyên nghiệp với Python.',
    stages: [
      { label: 'Cơ bản', nodes: [
        { title: 'Cú pháp & kiểu dữ liệu', icon: 'Braces', description: 'Biến, số, chuỗi, list/dict/set/tuple, if/for/while.', link: cl('python'),
          resources: [ off('Python — Official Tutorial', 'https://docs.python.org/3/tutorial/'), crs('freeCodeCamp — Scientific Computing with Python', 'https://www.freecodecamp.org/learn/scientific-computing-with-python/') ] },
        { title: 'Hàm & module', kind: 'info', side: 'right', description: 'def, *args/**kwargs, import, package.', link: cl('python'),
          resources: [ off('Python — Defining Functions', 'https://docs.python.org/3/tutorial/controlflow.html#defining-functions'), off('Python — Modules', 'https://docs.python.org/3/tutorial/modules.html') ] },
        { title: 'Xử lý lỗi & file', kind: 'info', side: 'left', description: 'try/except, context manager, đọc/ghi file, JSON/CSV.',
          resources: [ off('Python — Errors & Exceptions', 'https://docs.python.org/3/tutorial/errors.html'), off('Python — Reading & Writing Files', 'https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files') ] },
      ]},
      { label: 'Trung cấp', nodes: [
        { title: 'OOP', subtitle: 'Hướng đối tượng', icon: 'Boxes', description: 'class, kế thừa, dunder, property, dataclass.', link: cl('python'),
          resources: [ off('Python — Classes', 'https://docs.python.org/3/tutorial/classes.html'), art('Real Python — OOP in Python', 'https://realpython.com/python3-object-oriented-programming/') ] },
        { title: 'Comprehension & generator', kind: 'info', side: 'right', description: 'List/dict comprehension, yield, iterator.',
          resources: [ off('Python — List Comprehensions', 'https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions'), art('Real Python — Generators', 'https://realpython.com/introduction-to-python-generators/') ] },
        { title: 'Decorator & closure', kind: 'alternative', side: 'left', description: 'Hàm bậc cao, đóng gói hành vi.',
          resources: [ art('Real Python — Primer on Decorators', 'https://realpython.com/primer-on-python-decorators/') ] },
        { title: 'Type hints', kind: 'info', side: 'right', description: 'Chú thích kiểu + mypy.',
          resources: [ off('Python — typing', 'https://docs.python.org/3/library/typing.html'), off('mypy — Docs', 'https://mypy.readthedocs.io/en/stable/') ] },
      ]},
      { label: 'Giải thuật & Dữ liệu', nodes: [
        { title: 'Data Structures & Algorithms', icon: 'Binary', description: 'Sort, search, đệ quy, độ phức tạp — luyện trực quan.', link: algos,
          resources: [ art('VisuAlgo — trực quan hoá thuật toán', 'https://visualgo.net/en'), off('Lộ trình DSA', '/roadmap/dsa') ] },
        { title: 'DSA track (Code Lab)', icon: 'Code2', side: 'right', kind: 'alternative', description: 'Bài tập DSA có chấm tự động.', link: cl('data-structures-algorithms') },
        { title: 'NumPy / Pandas', kind: 'alternative', side: 'left', description: 'Xử lý số & bảng dữ liệu.', link: rm('data-analyst'),
          resources: [ off('NumPy — Beginner Guide', 'https://numpy.org/doc/stable/user/absolute_beginners.html'), off('Pandas — Getting Started', 'https://pandas.pydata.org/docs/getting_started/index.html') ] },
      ]},
      { label: 'Web với Python', nodes: [
        { title: 'FastAPI', subtitle: 'API hiện đại', icon: 'Zap', side: 'left', description: 'Async, type hint, tự sinh docs.', link: cl('fastapi'),
          resources: [ off('FastAPI — Tutorial', 'https://fastapi.tiangolo.com/tutorial/') ] },
        { title: 'Django', icon: 'Server', kind: 'alternative', side: 'right', description: 'Framework "pin sẵn".', link: cl('django'),
          resources: [ off('Django — Docs', 'https://docs.djangoproject.com/en/stable/'), crs('Django Girls Tutorial', 'https://tutorial.djangogirls.org/') ] },
        { title: 'Flask', kind: 'alternative', side: 'left', description: 'Micro-framework nhẹ.', link: ext('https://flask.palletsprojects.com/'),
          resources: [ off('Flask — Tutorial', 'https://flask.palletsprojects.com/en/stable/tutorial/') ] },
      ]},
      { label: 'Chuyên nghiệp', nodes: [
        { title: 'venv & pip', kind: 'info', description: 'Môi trường ảo, requirements.txt.',
          resources: [ off('Python — Virtual Environments', 'https://docs.python.org/3/tutorial/venv.html'), off('pip — User Guide', 'https://pip.pypa.io/en/stable/user_guide/') ] },
        { title: 'Testing', kind: 'info', side: 'right', description: 'pytest, fixture, mock.',
          resources: [ off('pytest — Docs', 'https://docs.pytest.org/en/stable/'), off('Python — unittest', 'https://docs.python.org/3/library/unittest.html') ] },
        { title: 'Đóng gói & Docker', icon: 'Container', side: 'left', description: 'Triển khai app Python.', link: cl('docker'),
          resources: [ off('Docker — Python Guide', 'https://docs.docker.com/language/python/') ] },
      ]},
    ],
  },

  // ─────────────────────────────── REACT ───────────────────────────────
  {
    slug: 'react', title: 'React', type: 'skill', icon: 'Atom', color: '#06b6d4',
    description: 'Làm chủ React — từ component cơ bản đến hook nâng cao, quản lý state, data-fetching và Next.js.',
    stages: [
      { label: 'Chuẩn bị', nodes: [
        { title: 'JavaScript vững', icon: 'Braces', description: 'ES6+, array method, promise/async, destructuring, module.', link: cl('javascript'),
          resources: [ off('MDN — Học JavaScript', 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript'), art('javascript.info', 'https://javascript.info/') ] },
        { title: 'TypeScript (nên có)', icon: 'Braces', kind: 'alternative', side: 'right', description: 'Kiểu cho props & state.', link: cl('typescript'),
          resources: [ off('React + TypeScript — Docs', 'https://react.dev/learn/typescript'), off('TypeScript Handbook', 'https://www.typescriptlang.org/docs/handbook/intro.html') ] },
      ]},
      { label: 'Cốt lõi', nodes: [
        { title: 'JSX & Component', icon: 'Atom', description: 'Component hàm, props, render danh sách, key.', link: cl('react'),
          resources: [ off('react.dev — Describing the UI', 'https://react.dev/learn/describing-the-ui') ] },
        { title: 'State & useState', kind: 'info', side: 'left', description: 'Trạng thái cục bộ, cập nhật bất biến.',
          resources: [ off('react.dev — State', 'https://react.dev/learn/state-a-components-memory') ] },
        { title: 'useEffect & vòng đời', kind: 'info', side: 'right', description: 'Side-effect, dependency array, cleanup.',
          resources: [ off('react.dev — Synchronizing with Effects', 'https://react.dev/learn/synchronizing-with-effects') ] },
        { title: 'Sự kiện & Form', kind: 'info', side: 'left', description: 'Controlled input, submit, validation.',
          resources: [ off('react.dev — Responding to Events', 'https://react.dev/learn/responding-to-events'), off('react.dev — Reacting to Input with State', 'https://react.dev/learn/reacting-to-input-with-state') ] },
        { title: 'Conditional & list render', kind: 'info', side: 'right', description: 'Render có điều kiện, map, fragment.',
          resources: [ off('react.dev — Conditional Rendering', 'https://react.dev/learn/conditional-rendering'), off('react.dev — Rendering Lists', 'https://react.dev/learn/rendering-lists') ] },
      ]},
      { label: 'Hook & State', nodes: [
        { title: 'Hook nâng cao', kind: 'info', description: 'useRef, useMemo, useCallback, useContext, custom hook.',
          resources: [ off('react.dev — Reusing Logic with Custom Hooks', 'https://react.dev/learn/reusing-logic-with-custom-hooks') ] },
        { title: 'State toàn cục', kind: 'info', side: 'right', description: 'Context, Zustand, Redux Toolkit.',
          resources: [ off('react.dev — Passing Data with Context', 'https://react.dev/learn/passing-data-deeply-with-context'), off('Zustand', 'https://zustand.docs.pmnd.rs/'), off('Redux Toolkit', 'https://redux-toolkit.js.org/') ] },
        { title: 'Data fetching', kind: 'alternative', side: 'left', description: 'TanStack Query/SWR — cache, revalidate.',
          resources: [ off('TanStack Query', 'https://tanstack.com/query/latest'), off('SWR', 'https://swr.vercel.app/') ] },
        { title: 'Form nâng cao', kind: 'alternative', side: 'right', description: 'React Hook Form + Zod.',
          resources: [ off('React Hook Form — Get Started', 'https://react-hook-form.com/get-started'), off('Zod', 'https://zod.dev/') ] },
      ]},
      { label: 'Chất lượng', nodes: [
        { title: 'Router', kind: 'info', description: 'React Router — điều hướng, route lồng, layout.',
          resources: [ off('React Router — Docs', 'https://reactrouter.com/') ] },
        { title: 'Testing', kind: 'info', side: 'right', description: 'Testing Library + Vitest.',
          resources: [ off('Testing Library — React', 'https://testing-library.com/docs/react-testing-library/intro/'), off('Vitest — Guide', 'https://vitest.dev/guide/') ] },
        { title: 'Performance', kind: 'alternative', side: 'left', description: 'memo, lazy, Suspense.',
          resources: [ off('react.dev — memo', 'https://react.dev/reference/react/memo'), off('react.dev — lazy', 'https://react.dev/reference/react/lazy') ] },
      ]},
      { label: 'Hệ sinh thái', nodes: [
        { title: 'Next.js', subtitle: 'Framework cho React', icon: 'Layers', description: 'SSR/SSG, App Router, SEO.', link: cl('nextjs'),
          resources: [ off('Next.js — Learn', 'https://nextjs.org/learn') ] },
        { title: 'React Native', icon: 'Smartphone', kind: 'alternative', side: 'right', description: 'Dùng React làm app di động.', link: cl('react-native'),
          resources: [ off('React Native — Docs', 'https://reactnative.dev/docs/getting-started'), off('Expo — Docs', 'https://docs.expo.dev/') ] },
        { title: 'UI library', kind: 'alternative', side: 'left', description: 'shadcn/ui, Tailwind, Radix.', link: cl('tailwind-css'),
          resources: [ off('shadcn/ui', 'https://ui.shadcn.com/docs'), off('Radix UI', 'https://www.radix-ui.com/primitives/docs/overview/introduction') ] },
      ]},
    ],
  },

  // ─────────────────────────────── NODE.JS ───────────────────────────────
  {
    slug: 'nodejs', title: 'Node.js', type: 'skill', icon: 'Hexagon', color: '#22c55e',
    description: 'Backend với Node.js — runtime, Express/NestJS, cơ sở dữ liệu, xác thực và API production.',
    stages: [
      { label: 'Nền tảng', nodes: [
        { title: 'JavaScript & TS', icon: 'Braces', description: 'Bất đồng bộ, module — gốc của Node.', link: cl('javascript'),
          resources: [ off('MDN — Học JavaScript', 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript'), off('TypeScript Handbook', 'https://www.typescriptlang.org/docs/handbook/intro.html') ] },
        { title: 'Node runtime', kind: 'info', side: 'right', description: 'Event loop, module hệ thống (fs/path/http/stream), npm.', link: cl('nodejs-express'),
          resources: [ off('Node.js — Learn', 'https://nodejs.org/en/learn') ] },
        { title: 'Package & script', kind: 'info', side: 'left', description: 'package.json, semver, npx.',
          resources: [ off('npm — package.json', 'https://docs.npmjs.com/cli/v10/configuring-npm/package-json'), art('Semantic Versioning', 'https://semver.org/') ] },
      ]},
      { label: 'Web framework', nodes: [
        { title: 'Express', subtitle: 'Tối giản, phổ biến', icon: 'Server', description: 'Route, middleware, request/response, lỗi.', link: cl('nodejs-express'),
          resources: [ off('Express — Guide', 'https://expressjs.com/en/guide/routing.html') ] },
        { title: 'NestJS', icon: 'Boxes', kind: 'alternative', side: 'right', description: 'Có kiến trúc, TypeScript-first, DI.', link: cl('nestjs'),
          resources: [ off('NestJS — Docs', 'https://docs.nestjs.com/') ] },
        { title: 'Fastify', kind: 'alternative', side: 'left', description: 'Nhẹ & nhanh, schema validation.', link: ext('https://fastify.dev/docs/latest/'),
          resources: [ off('Fastify — Docs', 'https://fastify.dev/docs/latest/') ] },
      ]},
      { label: 'Dữ liệu', nodes: [
        { title: 'SQL & PostgreSQL', icon: 'Database', side: 'left', description: 'Truy vấn, quan hệ, transaction.', link: cl('postgresql'),
          resources: [ off('PostgreSQL — Tutorial', 'https://www.postgresql.org/docs/current/tutorial.html'), off('Lộ trình SQL', '/roadmap/sql') ] },
        { title: 'Prisma ORM', icon: 'Layers', side: 'right', description: 'ORM type-safe.', link: cl('prisma-orm'),
          resources: [ off('Prisma — Docs', 'https://www.prisma.io/docs') ] },
        { title: 'MongoDB', icon: 'Database', kind: 'alternative', side: 'left', description: 'NoSQL — Mongoose.', link: cl('mongodb'),
          resources: [ off('MongoDB — Manual', 'https://www.mongodb.com/docs/manual/'), off('Mongoose — Docs', 'https://mongoosejs.com/docs/') ] },
        { title: 'Redis', icon: 'Zap', kind: 'alternative', side: 'right', description: 'Cache, session, hàng đợi.', link: cl('redis'),
          resources: [ off('Redis — Docs', 'https://redis.io/docs/latest/') ] },
      ]},
      { label: 'API & Realtime', nodes: [
        { title: 'REST API', icon: 'Webhook', description: 'Endpoint, status code, validation, phân trang.', link: cl('rest-apis'),
          resources: [ off('Express — Routing', 'https://expressjs.com/en/guide/routing.html'), art('MDN — REST', 'https://developer.mozilla.org/en-US/docs/Glossary/REST') ] },
        { title: 'Xác thực', kind: 'info', side: 'right', description: 'JWT, bcrypt, OAuth, middleware phân quyền.',
          resources: [ off('Passport.js', 'https://www.passportjs.org/'), art('JWT — Introduction', 'https://jwt.io/introduction') ] },
        { title: 'WebSocket (Socket.IO)', icon: 'Share2', kind: 'alternative', side: 'left', description: 'Realtime hai chiều.', link: ext('https://socket.io/docs/v4/'),
          resources: [ off('Socket.IO — Docs', 'https://socket.io/docs/v4/') ] },
        { title: 'GraphQL', kind: 'alternative', side: 'right', description: 'Query linh hoạt.', link: cl('graphql'),
          resources: [ off('GraphQL — Learn', 'https://graphql.org/learn/'), off('Apollo Server', 'https://www.apollographql.com/docs/apollo-server/') ] },
      ]},
      { label: 'Production', nodes: [
        { title: 'Testing', kind: 'info', description: 'Jest/Vitest, supertest.',
          resources: [ off('Jest — Getting Started', 'https://jestjs.io/docs/getting-started'), off('SuperTest', 'https://github.com/ladjs/supertest') ] },
        { title: 'Docker & deploy', icon: 'Container', side: 'right', description: 'Đóng gói & triển khai.', link: cl('docker'),
          resources: [ off('Docker — Node.js Guide', 'https://docs.docker.com/language/nodejs/') ] },
        { title: 'Logging & giám sát', kind: 'info', side: 'left', description: 'Log có cấu trúc, health check, metrics.',
          resources: [ off('Pino — Logger', 'https://getpino.io/'), off('Prometheus — Docs', 'https://prometheus.io/docs/introduction/overview/') ] },
      ]},
    ],
  },

  // ─────────────────────────────── SQL ───────────────────────────────
  {
    slug: 'sql', title: 'SQL', type: 'skill', icon: 'Database', color: '#a855f7',
    description: 'SQL từ truy vấn cơ bản đến join, subquery, window function, index và giao dịch.',
    stages: [
      { label: 'Truy vấn cơ bản', nodes: [
        { title: 'SELECT, WHERE, ORDER BY', icon: 'Database', description: 'Lọc, sắp xếp, LIMIT/OFFSET — nền tảng.', link: cl('sql'),
          resources: [ crs('Mode — SQL Tutorial', 'https://mode.com/sql-tutorial/'), crs('SQLBolt — tương tác', 'https://sqlbolt.com/') ] },
        { title: 'Toán tử & hàm chuỗi/ngày', kind: 'info', side: 'right', description: 'LIKE, IN, BETWEEN, CONCAT, DATE.',
          resources: [ off('PostgreSQL — Functions & Operators', 'https://www.postgresql.org/docs/current/functions.html') ] },
        { title: 'GROUP BY & tổng hợp', kind: 'info', side: 'left', description: 'COUNT/SUM/AVG/MIN/MAX, HAVING.', link: cl('sql'),
          resources: [ off('PostgreSQL — Aggregate Functions', 'https://www.postgresql.org/docs/current/tutorial-agg.html') ] },
      ]},
      { label: 'Kết hợp bảng', nodes: [
        { title: 'JOIN', subtitle: 'INNER/LEFT/RIGHT/FULL', icon: 'GitMerge', description: 'Ghép nhiều bảng qua khoá — cốt lõi.', link: cl('sql'),
          resources: [ art('Visual JOIN explained', 'https://joins.spathon.com/') ] },
        { title: 'Subquery & CTE', kind: 'info', side: 'right', description: 'Truy vấn lồng, WITH.',
          resources: [ off('PostgreSQL — WITH Queries (CTE)', 'https://www.postgresql.org/docs/current/queries-with.html') ] },
        { title: 'Window function', kind: 'alternative', side: 'left', description: 'ROW_NUMBER, RANK, LAG/LEAD, running total.',
          resources: [ off('PostgreSQL — Window Functions', 'https://www.postgresql.org/docs/current/tutorial-window.html') ] },
        { title: 'UNION & set ops', kind: 'alternative', side: 'right', description: 'UNION/INTERSECT/EXCEPT.',
          resources: [ off('PostgreSQL — Combining Queries', 'https://www.postgresql.org/docs/current/queries-union.html') ] },
      ]},
      { label: 'Thiết kế & thao tác', nodes: [
        { title: 'DDL & kiểu dữ liệu', kind: 'info', description: 'CREATE/ALTER TABLE, khoá chính/ngoại, ràng buộc.',
          resources: [ off('PostgreSQL — Data Definition', 'https://www.postgresql.org/docs/current/ddl.html'), off('PostgreSQL — Data Types', 'https://www.postgresql.org/docs/current/datatype.html') ] },
        { title: 'INSERT/UPDATE/DELETE', kind: 'info', side: 'right', description: 'Thay đổi dữ liệu an toàn, UPSERT.',
          resources: [ off('PostgreSQL — Data Manipulation', 'https://www.postgresql.org/docs/current/dml.html'), off('PostgreSQL — INSERT ... ON CONFLICT', 'https://www.postgresql.org/docs/current/sql-insert.html') ] },
        { title: 'Chuẩn hoá', kind: 'info', side: 'left', description: '1NF–3NF — dữ liệu sạch.',
          resources: [ art('Database Normalization (Wikipedia)', 'https://en.wikipedia.org/wiki/Database_normalization') ] },
        { title: 'View & Stored Procedure', kind: 'alternative', side: 'right', description: 'Đóng gói truy vấn & logic.',
          resources: [ off('PostgreSQL — Views', 'https://www.postgresql.org/docs/current/tutorial-views.html'), off('PostgreSQL — CREATE FUNCTION', 'https://www.postgresql.org/docs/current/sql-createfunction.html') ] },
      ]},
      { label: 'Nâng cao', nodes: [
        { title: 'Index & tối ưu', icon: 'Zap', description: 'B-tree index, EXPLAIN/ANALYZE.', link: cl('postgresql'),
          resources: [ off('Use The Index, Luke!', 'https://use-the-index-luke.com/') ] },
        { title: 'Transaction & ACID', kind: 'info', side: 'right', description: 'BEGIN/COMMIT/ROLLBACK, mức cô lập, deadlock.',
          resources: [ off('PostgreSQL — Transactions', 'https://www.postgresql.org/docs/current/tutorial-transactions.html'), off('PostgreSQL — Transaction Isolation', 'https://www.postgresql.org/docs/current/transaction-iso.html') ] },
        { title: 'PostgreSQL chuyên sâu', icon: 'Database', side: 'left', kind: 'alternative', description: 'JSONB, RLS, full-text, PostGIS.', link: cl('postgresql'),
          resources: [ off('PostgreSQL — JSON Types', 'https://www.postgresql.org/docs/current/datatype-json.html'), off('PostgreSQL — Full Text Search', 'https://www.postgresql.org/docs/current/textsearch.html') ] },
        { title: 'NoSQL đối chiếu', kind: 'alternative', side: 'right', description: 'Khi nào dùng MongoDB/Redis.', link: cl('mongodb'),
          resources: [ off('MongoDB — Manual', 'https://www.mongodb.com/docs/manual/'), off('Redis — Docs', 'https://redis.io/docs/latest/') ] },
      ]},
    ],
  },

  // ─────────────────────────── DSA ───────────────────────────
  {
    slug: 'dsa', title: 'Data Structures & Algorithms', type: 'skill', icon: 'Binary', color: '#ef4444',
    description: 'Cấu trúc dữ liệu & giải thuật — luyện trực quan tại trang Algorithms (80 thuật toán) và bài tập Code Lab.',
    stages: [
      { label: 'Nền tảng', nodes: [
        { title: 'Độ phức tạp (Big-O)', kind: 'info', description: 'Thời gian & bộ nhớ; O(1), O(n), O(log n), O(n²).', link: algos,
          resources: [ art('Big-O Cheat Sheet', 'https://www.bigocheatsheet.com/') ] },
        { title: 'Mảng & chuỗi', icon: 'Rows3', side: 'right', description: 'Truy cập, duyệt, đảo, xoay.', link: algos,
          resources: [ crs('NeetCode — Arrays & Hashing', 'https://neetcode.io/roadmap') ] },
        { title: 'Two-pointer & Sliding window', kind: 'alternative', side: 'left', description: 'Kỹ thuật quét mảng hiệu quả.', link: algos,
          resources: [ art('GeeksforGeeks — Two Pointers Technique', 'https://www.geeksforgeeks.org/two-pointers-technique/') ] },
      ]},
      { label: 'Cấu trúc tuyến tính', nodes: [
        { title: 'Stack & Queue', icon: 'Layers', side: 'left', description: 'LIFO/FIFO — duyệt, hoàn tác, BFS.', link: algos,
          resources: [ art('VisuAlgo — Linked List / Stack / Queue', 'https://visualgo.net/en/list') ] },
        { title: 'Linked List', kind: 'info', side: 'right', description: 'Đơn/đôi, đảo, phát hiện chu trình.',
          resources: [ art('VisuAlgo — Linked List', 'https://visualgo.net/en/list') ] },
        { title: 'Hash Table', icon: 'Hash', description: 'Ánh xạ khoá-giá trị O(1).',
          resources: [ art('VisuAlgo — Hash Table', 'https://visualgo.net/en/hashtable') ] },
      ]},
      { label: 'Sắp xếp & tìm kiếm', nodes: [
        { title: 'Sorting', subtitle: 'Bubble→Merge→Quick→Heap→Radix', icon: 'ArrowDownUp', description: 'Xem hoạt hình từng bước.', link: algos,
          resources: [ art('VisuAlgo — Sorting', 'https://visualgo.net/en/sorting'), art('Big-O Cheat Sheet — Sorting', 'https://www.bigocheatsheet.com/') ] },
        { title: 'Searching', icon: 'Search', side: 'right', description: 'Linear, Binary, Jump, Interpolation, Ternary.', link: algos,
          resources: [ art('cp-algorithms — Binary Search', 'https://cp-algorithms.com/num_methods/binary_search.html') ] },
      ]},
      { label: 'Cây', nodes: [
        { title: 'BST & Traversal', icon: 'GitFork', side: 'left', description: 'Cây tìm kiếm, in/pre/post/level order.', link: algos,
          resources: [ art('VisuAlgo — Binary Search Tree', 'https://visualgo.net/en/bst') ] },
        { title: 'Heap & Priority Queue', kind: 'info', side: 'right', description: 'Min/Max heap.', link: algos,
          resources: [ art('VisuAlgo — Binary Heap', 'https://visualgo.net/en/heap') ] },
        { title: 'Trie / Segment / Fenwick', kind: 'alternative', side: 'left', description: 'Tiền tố, truy vấn khoảng.', link: algos,
          resources: [ art('cp-algorithms — Data Structures', 'https://cp-algorithms.com/data_structures/segment_tree.html'), art('VisuAlgo — Segment Tree', 'https://visualgo.net/en/segmenttree') ] },
      ]},
      { label: 'Đồ thị', nodes: [
        { title: 'BFS / DFS', icon: 'Share2', description: 'Duyệt bề rộng / chiều sâu.', link: algos,
          resources: [ art('VisuAlgo — Graph Traversal', 'https://visualgo.net/en/dfsbfs') ] },
        { title: 'Đường đi ngắn nhất', kind: 'info', side: 'right', description: 'Dijkstra, Bellman-Ford, A*, Floyd-Warshall.', link: algos,
          resources: [ art('VisuAlgo — Single-Source Shortest Path', 'https://visualgo.net/en/sssp'), art('cp-algorithms — Shortest Paths', 'https://cp-algorithms.com/graph/dijkstra.html') ] },
        { title: 'MST & Union-Find', kind: 'alternative', side: 'left', description: 'Kruskal, Prim, disjoint set, topo sort.', link: algos,
          resources: [ art('VisuAlgo — Min Spanning Tree', 'https://visualgo.net/en/mst'), art('VisuAlgo — Union-Find (UFDS)', 'https://visualgo.net/en/ufds') ] },
      ]},
      { label: 'Kỹ thuật giải', nodes: [
        { title: 'Quy hoạch động (DP)', icon: 'Grid3x3', description: 'Knapsack, LCS, LIS, Kadane, Coin Change.', link: algos,
          resources: [ art('cp-algorithms — Dynamic Programming', 'https://cp-algorithms.com/dynamic_programming/intro-to-dp.html'), crs('NeetCode — 1-D & 2-D DP', 'https://neetcode.io/roadmap') ] },
        { title: 'Quay lui (Backtracking)', kind: 'info', side: 'right', description: 'N-Queens, Sudoku, hoán vị, tô màu.', link: algos,
          resources: [ art('VisuAlgo — Recursion Tree', 'https://visualgo.net/en/recursion') ] },
        { title: 'Tham lam & chia để trị', kind: 'alternative', side: 'left', description: 'Greedy, divide & conquer.', link: algos,
          resources: [ art('cp-algorithms — Divide & Conquer', 'https://cp-algorithms.com/') ] },
        { title: 'Luyện đề (Code Lab)', icon: 'Code2', kind: 'alternative', side: 'right', description: 'Bài tập DSA chấm tự động.', link: cl('data-structures-algorithms') },
      ]},
    ],
  },

  // ─────────────────────────────── TYPESCRIPT ───────────────────────────────
  {
    slug: 'typescript', title: 'TypeScript', type: 'skill', icon: 'Braces', color: '#3178c6',
    description: 'JavaScript có kiểu tĩnh — từ kiểu cơ bản đến generic, utility type và tích hợp React/Node trong dự án lớn.',
    stages: [
      { label: 'Chuẩn bị', nodes: [
        { title: 'JavaScript nền tảng', icon: 'Braces', description: 'ES6+, module, async — TypeScript là JS + kiểu.', link: cl('javascript'),
          resources: [ off('MDN — Học JavaScript', 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript'), art('javascript.info', 'https://javascript.info/') ] },
        { title: 'Cài đặt & tsconfig', kind: 'info', side: 'right', description: 'tsc, tsconfig.json, strict mode, target/module.',
          resources: [ off('TypeScript — tsconfig Reference', 'https://www.typescriptlang.org/tsconfig/') ] },
      ]},
      { label: 'Hệ thống kiểu', nodes: [
        { title: 'Kiểu cơ bản', icon: 'FileCode', description: 'string/number/boolean, array, tuple, any/unknown, void.', link: cl('typescript'),
          resources: [ off('TypeScript — Everyday Types', 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html') ] },
        { title: 'Interface & Type alias', kind: 'info', side: 'right', description: 'Định hình object, kế thừa, optional/readonly.',
          resources: [ off('TypeScript — Object Types', 'https://www.typescriptlang.org/docs/handbook/2/objects.html') ] },
        { title: 'Union & Narrowing', kind: 'info', side: 'left', description: 'Kiểu hợp, type guard, discriminated union.',
          resources: [ off('TypeScript — Narrowing', 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html') ] },
        { title: 'Generics', icon: 'Boxes', side: 'right', description: 'Kiểu tham số hoá — hàm, class, ràng buộc.',
          resources: [ off('TypeScript — Generics', 'https://www.typescriptlang.org/docs/handbook/2/generics.html') ] },
      ]},
      { label: 'Nâng cao', nodes: [
        { title: 'Utility Types', kind: 'info', description: 'Partial, Pick, Omit, Record, ReturnType...',
          resources: [ off('TypeScript — Utility Types', 'https://www.typescriptlang.org/docs/handbook/utility-types.html') ] },
        { title: 'Mapped & Conditional types', kind: 'alternative', side: 'right', description: 'Kiểu suy diễn động, infer, template literal type.',
          resources: [ off('TypeScript — Mapped Types', 'https://www.typescriptlang.org/docs/handbook/2/mapped-types.html'), off('TypeScript — Conditional Types', 'https://www.typescriptlang.org/docs/handbook/2/conditional-types.html') ] },
        { title: 'Decorators', kind: 'alternative', side: 'left', description: 'Metadata cho class/method — dùng nhiều trong NestJS/Angular.',
          resources: [ off('TypeScript — Decorators', 'https://www.typescriptlang.org/docs/handbook/decorators.html') ] },
        { title: 'Modules & khai báo kiểu', kind: 'info', side: 'right', description: 'import/export, .d.ts, DefinitelyTyped.',
          resources: [ off('TypeScript — Modules', 'https://www.typescriptlang.org/docs/handbook/2/modules.html') ] },
      ]},
      { label: 'Thực chiến', nodes: [
        { title: 'TypeScript với React', icon: 'Atom', side: 'left', description: 'Kiểu cho props, state, event, hook.', link: cl('react'),
          resources: [ off('React — Using TypeScript', 'https://react.dev/learn/typescript') ] },
        { title: 'TypeScript với Node', icon: 'Hexagon', kind: 'alternative', side: 'right', description: 'Backend type-safe với Express/NestJS.', link: cl('nestjs'),
          resources: [ off('Node.js — Learn', 'https://nodejs.org/en/learn'), off('NestJS — Docs', 'https://docs.nestjs.com/') ] },
        { title: 'Linting & tooling', kind: 'info', side: 'left', description: 'ESLint + typescript-eslint, Prettier, CI.',
          resources: [ off('typescript-eslint', 'https://typescript-eslint.io/') ] },
        { title: 'Migrate JS → TS', kind: 'alternative', side: 'right', description: 'Chuyển dự án JS sang TS từng bước.',
          resources: [ off('TypeScript — Migrating from JavaScript', 'https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html') ] },
      ]},
    ],
  },

  // ─────────────────────────────── GO ───────────────────────────────
  {
    slug: 'go', title: 'Go', type: 'skill', icon: 'Rabbit', color: '#00add8',
    description: 'Ngôn ngữ Go — cú pháp gọn, concurrency mạnh (goroutine/channel), lý tưởng cho microservice & hạ tầng.',
    stages: [
      { label: 'Nền tảng', nodes: [
        { title: 'Cài đặt & Tour of Go', icon: 'Rabbit', description: 'go toolchain, chạy chương trình đầu tiên, workspace.', link: cl('go'),
          resources: [ off('A Tour of Go', 'https://go.dev/tour/'), off('Go — Learn', 'https://go.dev/learn/') ] },
        { title: 'Cú pháp & kiểu', kind: 'info', side: 'right', description: 'Biến, slice, map, struct, interface, con trỏ.',
          resources: [ off('Effective Go', 'https://go.dev/doc/effective_go'), art('Go by Example', 'https://gobyexample.com/') ] },
        { title: 'Hàm, method & interface', kind: 'info', side: 'left', description: 'Nhiều giá trị trả về, receiver, interface ngầm định.',
          resources: [ off('Go — Language Specification', 'https://go.dev/ref/spec') ] },
      ]},
      { label: 'Concurrency', nodes: [
        { title: 'Goroutine & Channel', icon: 'Share2', description: 'Đồng thời nhẹ, giao tiếp qua channel.', link: cl('go'),
          resources: [ art('Go by Example — Goroutines', 'https://gobyexample.com/goroutines'), off('Effective Go — Concurrency', 'https://go.dev/doc/effective_go#concurrency') ] },
        { title: 'select & sync', kind: 'info', side: 'right', description: 'select, WaitGroup, Mutex, race detector.',
          resources: [ art('Go by Example — Select', 'https://gobyexample.com/select') ] },
        { title: 'Context', kind: 'alternative', side: 'left', description: 'Huỷ tác vụ, deadline, truyền giá trị request-scoped.',
          resources: [ off('Go Blog — Context', 'https://go.dev/blog/context') ] },
      ]},
      { label: 'Chuẩn nghề', nodes: [
        { title: 'Modules & package', kind: 'info', description: 'go mod, versioning, tổ chức mã.',
          resources: [ off('Go — Modules Reference', 'https://go.dev/ref/mod') ] },
        { title: 'Error handling', kind: 'info', side: 'right', description: 'error là giá trị, wrap/unwrap, errors.Is/As.',
          resources: [ off('Go Blog — Error handling', 'https://go.dev/blog/error-handling-and-go') ] },
        { title: 'Testing', kind: 'info', side: 'left', description: 'testing package, table-driven test, benchmark.',
          resources: [ off('Go — testing package', 'https://pkg.go.dev/testing') ] },
      ]},
      { label: 'Web & Backend', nodes: [
        { title: 'net/http & routing', icon: 'Webhook', description: 'HTTP server, handler, middleware.', link: cl('go'),
          resources: [ off('Go — Writing Web Applications', 'https://go.dev/doc/articles/wiki/'), off('Gin — Docs', 'https://gin-gonic.com/en/docs/') ] },
        { title: 'Database (database/sql)', icon: 'Database', side: 'right', description: 'Kết nối, query, transaction, pool.',
          resources: [ off('Go — Accessing a database', 'https://go.dev/doc/tutorial/database-access') ] },
        { title: 'Đóng gói & Docker', icon: 'Container', side: 'left', description: 'Binary tĩnh, image nhỏ, triển khai.', link: cl('docker'),
          resources: [ off('Docker — Go Guide', 'https://docs.docker.com/language/golang/') ] },
      ]},
    ],
  },

  // ─────────────────────────────── RUST ───────────────────────────────
  {
    slug: 'rust', title: 'Rust', type: 'skill', icon: 'Cog', color: '#f74c00',
    description: 'Rust — an toàn bộ nhớ không cần GC, hiệu năng như C++. Từ ownership đến async và WebAssembly.',
    stages: [
      { label: 'Nền tảng', nodes: [
        { title: 'The Book & Cargo', icon: 'BookOpen', description: 'rustup, cargo, chương trình đầu tiên.', link: cl('rust'),
          resources: [ off('The Rust Programming Language (Book)', 'https://doc.rust-lang.org/book/'), art('Rust by Example', 'https://doc.rust-lang.org/rust-by-example/') ] },
        { title: 'Ownership & Borrowing', kind: 'info', side: 'right', description: 'Trái tim của Rust: sở hữu, mượn, tham chiếu.',
          resources: [ off('Rust Book — Ch.4 Ownership', 'https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html') ] },
        { title: 'Struct, Enum & Pattern matching', kind: 'info', side: 'left', description: 'Kiểu dữ liệu, match, Option.',
          resources: [ off('Rust Book — Ch.6 Enums & Pattern Matching', 'https://doc.rust-lang.org/book/ch06-00-enums.html') ] },
      ]},
      { label: 'An toàn & trừu tượng', nodes: [
        { title: 'Lifetimes', kind: 'info', description: 'Chu kỳ sống tham chiếu — chống dangling.',
          resources: [ off('Rust Book — Ch.10.3 Lifetimes', 'https://doc.rust-lang.org/book/ch10-03-lifetime-syntax.html') ] },
        { title: 'Traits & Generics', icon: 'Boxes', side: 'right', description: 'Đa hình tĩnh, trait bound, trait object.',
          resources: [ off('Rust Book — Ch.10 Generic Types & Traits', 'https://doc.rust-lang.org/book/ch10-00-generics.html') ] },
        { title: 'Error handling', kind: 'info', side: 'left', description: 'Result, ?, panic vs recoverable error.',
          resources: [ off('Rust Book — Ch.9 Error Handling', 'https://doc.rust-lang.org/book/ch09-00-error-handling.html') ] },
      ]},
      { label: 'Nâng cao', nodes: [
        { title: 'Collections & Iterators', kind: 'info', description: 'Vec, HashMap, iterator, closure.',
          resources: [ off('Rust Book — Ch.13 Iterators & Closures', 'https://doc.rust-lang.org/book/ch13-00-functional-features.html') ] },
        { title: 'Concurrency', icon: 'Share2', side: 'right', description: 'Fearless concurrency: thread, channel, Arc/Mutex.',
          resources: [ off('Rust Book — Ch.16 Concurrency', 'https://doc.rust-lang.org/book/ch16-00-concurrency.html') ] },
        { title: 'Smart pointers', kind: 'alternative', side: 'left', description: 'Box, Rc, RefCell — sở hữu linh hoạt.',
          resources: [ off('Rust Book — Ch.15 Smart Pointers', 'https://doc.rust-lang.org/book/ch15-00-smart-pointers.html') ] },
        { title: 'Macros', kind: 'alternative', side: 'right', description: 'macro_rules! và derive macro.',
          resources: [ off('Rust Book — Ch.19 Macros', 'https://doc.rust-lang.org/book/ch19-06-macros.html') ] },
      ]},
      { label: 'Thực chiến', nodes: [
        { title: 'Cargo & crates.io', kind: 'info', description: 'Dependency, workspace, publish crate.',
          resources: [ off('The Cargo Book', 'https://doc.rust-lang.org/cargo/'), off('Cargo — Publishing on crates.io', 'https://doc.rust-lang.org/cargo/reference/publishing.html') ] },
        { title: 'Async (Tokio)', icon: 'Zap', kind: 'alternative', side: 'right', description: 'async/await, runtime, future.',
          resources: [ off('Tokio — Tutorial', 'https://tokio.rs/tokio/tutorial') ] },
        { title: 'Web (Axum/Actix)', icon: 'Webhook', kind: 'alternative', side: 'left', description: 'API hiệu năng cao bằng Rust.',
          resources: [ off('Axum — Docs', 'https://docs.rs/axum/latest/axum/') ] },
        { title: 'WebAssembly', kind: 'alternative', side: 'right', description: 'Biên dịch Rust sang WASM chạy trên trình duyệt.',
          resources: [ off('Rust and WebAssembly (Book)', 'https://rustwasm.github.io/docs/book/') ] },
      ]},
    ],
  },

  // ─────────────────────────────── JAVA ───────────────────────────────
  {
    slug: 'java', title: 'Java', type: 'skill', icon: 'Coffee', color: '#ea580c',
    description: 'Java — nền tảng doanh nghiệp: cú pháp, OOP, collection, stream, concurrency và Spring Boot.',
    stages: [
      { label: 'Nền tảng', nodes: [
        { title: 'Cú pháp & JVM', icon: 'Coffee', description: 'Biến, kiểu, điều khiển luồng, JVM/JRE/JDK.', link: cl('java-core'),
          resources: [ off('dev.java — Learn', 'https://dev.java/learn/'), off('Java SE — Documentation', 'https://docs.oracle.com/en/java/javase/') ] },
        { title: 'OOP', subtitle: 'Hướng đối tượng', icon: 'Boxes', side: 'right', description: 'Class, kế thừa, interface, abstract, đa hình.', link: cl('java-core'),
          resources: [ off('dev.java — Objects & Classes', 'https://dev.java/learn/language-basics/') ] },
        { title: 'Collections & Generics', kind: 'info', side: 'left', description: 'List/Set/Map, generic, comparator.',
          resources: [ off('dev.java — Collections Framework', 'https://dev.java/learn/api/collections-framework/') ] },
      ]},
      { label: 'Nâng cao', nodes: [
        { title: 'Exception & I/O', kind: 'info', description: 'try/catch/finally, checked/unchecked, file & stream.',
          resources: [ off('Java Tutorial — Exceptions', 'https://docs.oracle.com/javase/tutorial/essential/exceptions/') ] },
        { title: 'Streams & Lambda', kind: 'info', side: 'right', description: 'Functional style: map/filter/collect, Optional.',
          resources: [ off('dev.java — The Streams API', 'https://dev.java/learn/api/streams/') ] },
        { title: 'Concurrency & Threads', kind: 'alternative', side: 'left', description: 'Thread, ExecutorService, synchronized.',
          resources: [ off('Java Tutorial — Concurrency', 'https://docs.oracle.com/javase/tutorial/essential/concurrency/') ] },
        { title: 'Java hiện đại (records, sealed)', kind: 'info', side: 'right', description: 'var, record, sealed class, switch expression.',
          resources: [ off('dev.java — Records', 'https://dev.java/learn/records/') ] },
      ]},
      { label: 'Công cụ & Test', nodes: [
        { title: 'Build (Maven/Gradle)', icon: 'Wrench', description: 'Quản lý dependency, vòng đời build.',
          resources: [ off('Maven — Guides', 'https://maven.apache.org/guides/'), off('Gradle — User Manual', 'https://docs.gradle.org/current/userguide/userguide.html') ] },
        { title: 'Testing (JUnit)', kind: 'info', side: 'right', description: 'JUnit 5, assertion, mock (Mockito).',
          resources: [ off('JUnit 5 — User Guide', 'https://junit.org/junit5/docs/current/user-guide/') ] },
      ]},
      { label: 'Spring', nodes: [
        { title: 'Spring Boot', icon: 'Server', description: 'Auto-config, DI, REST controller, starter.', link: cl('spring-boot'),
          resources: [ off('Spring Boot', 'https://spring.io/projects/spring-boot'), crs('Spring — Guides', 'https://spring.io/guides') ] },
        { title: 'Spring Data JPA', icon: 'Database', side: 'right', description: 'Repository, entity, quan hệ, query.',
          resources: [ off('Spring Data JPA', 'https://spring.io/projects/spring-data-jpa') ] },
        { title: 'REST API', icon: 'Webhook', side: 'left', description: 'Controller, DTO, validation, xử lý lỗi.', link: cl('rest-apis'),
          resources: [ crs('Spring — Building a RESTful Web Service', 'https://spring.io/guides/gs/rest-service') ] },
      ]},
    ],
  },

  // ─────────────────────────────── C / C++ ───────────────────────────────
  {
    slug: 'cpp', title: 'C / C++', type: 'skill', icon: 'Cpu', color: '#3949ab',
    description: 'Lập trình hệ thống với C và C++ — con trỏ, quản lý bộ nhớ, OOP, template, STL và C++ hiện đại.',
    stages: [
      { label: 'Nền tảng', nodes: [
        { title: 'Trình biên dịch & toolchain', kind: 'info', description: 'gcc/clang, biên dịch, liên kết, chạy.',
          resources: [ off('isocpp — Get Started', 'https://isocpp.org/get-started'), crs('LearnCpp', 'https://www.learncpp.com/') ] },
        { title: 'Cú pháp cơ bản', icon: 'FileCode', side: 'right', description: 'Biến, kiểu, hàm, điều khiển luồng, mảng.', link: cl('c'),
          resources: [ crs('LearnCpp — C++ Basics', 'https://www.learncpp.com/'), off('cppreference', 'https://en.cppreference.com/w/') ] },
        { title: 'Con trỏ & bộ nhớ', kind: 'info', side: 'left', description: 'Pointer, reference, stack vs heap, new/delete.',
          resources: [ crs('LearnCpp — Dynamic Memory', 'https://www.learncpp.com/') ] },
      ]},
      { label: 'OOP & RAII', nodes: [
        { title: 'Class & RAII', icon: 'Boxes', description: 'Đóng gói, constructor/destructor, quy tắc 3/5.',
          resources: [ off('cppreference — Classes', 'https://en.cppreference.com/w/cpp/language/classes') ] },
        { title: 'Templates', kind: 'info', side: 'right', description: 'Lập trình tổng quát, function/class template.',
          resources: [ off('cppreference — Templates', 'https://en.cppreference.com/w/cpp/language/templates') ] },
        { title: 'STL: container & algorithm', kind: 'info', side: 'left', description: 'vector, map, set, iterator, <algorithm>.',
          resources: [ off('cppreference — Containers Library', 'https://en.cppreference.com/w/cpp/container') ] },
      ]},
      { label: 'Nâng cao', nodes: [
        { title: 'Smart pointers & move', kind: 'info', description: 'unique_ptr/shared_ptr, move semantics, rvalue.',
          resources: [ off('cppreference — Smart Pointers', 'https://en.cppreference.com/w/cpp/memory') ] },
        { title: 'Concurrency', kind: 'alternative', side: 'right', description: 'std::thread, mutex, atomic, async.',
          resources: [ off('cppreference — Thread Support Library', 'https://en.cppreference.com/w/cpp/thread') ] },
        { title: 'C++ hiện đại (11/14/17/20)', kind: 'info', side: 'left', description: 'auto, lambda, ranges, concepts.',
          resources: [ off('cppreference — C++ Language', 'https://en.cppreference.com/w/cpp/language') ] },
      ]},
      { label: 'Thực chiến', nodes: [
        { title: 'CMake & build', icon: 'Wrench', description: 'Dựng dự án đa file, thư viện, cross-platform.',
          resources: [ off('CMake — Tutorial', 'https://cmake.org/cmake/help/latest/guide/tutorial/index.html') ] },
        { title: 'Debug (gdb/valgrind)', kind: 'info', side: 'right', description: 'Gỡ lỗi, phát hiện rò bộ nhớ.',
          resources: [ off('GDB — Documentation', 'https://www.gnu.org/software/gdb/documentation/') ] },
        { title: 'Competitive programming', icon: 'Binary', kind: 'alternative', side: 'left', description: 'C++ nhanh cho luyện thuật toán.', link: algos,
          resources: [ art('cp-algorithms', 'https://cp-algorithms.com/') ] },
      ]},
    ],
  },

  // ─────────────────────────────── DOCKER ───────────────────────────────
  {
    slug: 'docker', title: 'Docker', type: 'skill', icon: 'Container', color: '#2496ed',
    description: 'Đóng gói ứng dụng bằng container — image, Dockerfile, volume, network, Compose và tối ưu production.',
    stages: [
      { label: 'Nền tảng', nodes: [
        { title: 'Container vs VM', kind: 'info', description: 'Vì sao container nhẹ & nhất quán môi trường.',
          resources: [ off('Docker — Overview', 'https://docs.docker.com/get-started/docker-overview/') ] },
        { title: 'Cài đặt & CLI', icon: 'Terminal', side: 'right', description: 'docker run/ps/exec/logs, Docker Desktop.', link: cl('docker'),
          resources: [ off('Docker — Get Started', 'https://docs.docker.com/get-started/') ] },
        { title: 'Image & Dockerfile', icon: 'Layers', side: 'left', description: 'Layer, build, FROM/RUN/COPY/CMD, .dockerignore.',
          resources: [ off('Dockerfile — Reference', 'https://docs.docker.com/reference/dockerfile/') ] },
      ]},
      { label: 'Vận hành', nodes: [
        { title: 'Volume & bind mount', kind: 'info', description: 'Lưu trữ bền vững, chia sẻ dữ liệu.',
          resources: [ off('Docker — Volumes', 'https://docs.docker.com/engine/storage/volumes/') ] },
        { title: 'Network', kind: 'info', side: 'right', description: 'bridge/host, port mapping, DNS nội bộ.',
          resources: [ off('Docker — Networking', 'https://docs.docker.com/engine/network/') ] },
        { title: 'Docker Compose', icon: 'Boxes', side: 'left', description: 'Nhiều service bằng 1 file YAML.',
          resources: [ off('Docker Compose', 'https://docs.docker.com/compose/') ] },
      ]},
      { label: 'Production', nodes: [
        { title: 'Multi-stage build', kind: 'info', description: 'Image nhỏ gọn, tách build & runtime.',
          resources: [ off('Docker — Multi-stage builds', 'https://docs.docker.com/build/building/multi-stage/') ] },
        { title: 'Tối ưu & bảo mật image', kind: 'info', side: 'right', description: 'Layer caching, non-root, scan lỗ hổng.',
          resources: [ off('Docker — Building best practices', 'https://docs.docker.com/build/building/best-practices/') ] },
        { title: 'Registry (Hub/GHCR)', kind: 'info', side: 'left', description: 'push/pull, tag, private registry.',
          resources: [ off('Docker — Push to registry', 'https://docs.docker.com/get-started/introduction/build-and-push-first-image/') ] },
        { title: 'Sang Kubernetes', icon: 'Ship', kind: 'alternative', side: 'right', description: 'Điều phối container quy mô lớn.', link: cl('kubernetes'),
          resources: [ off('Lộ trình Kubernetes', '/roadmap/kubernetes') ] },
      ]},
    ],
  },

  // ─────────────────────────────── KUBERNETES ───────────────────────────────
  {
    slug: 'kubernetes', title: 'Kubernetes', type: 'skill', icon: 'Ship', color: '#326ce5',
    description: 'Điều phối container ở quy mô lớn — pod, deployment, service, ingress, config, autoscaling và Helm.',
    stages: [
      { label: 'Nền tảng', nodes: [
        { title: 'Kiến trúc K8s', kind: 'info', description: 'Control plane, node, kubelet, etcd, scheduler.',
          resources: [ off('Kubernetes — Concepts Overview', 'https://kubernetes.io/docs/concepts/overview/') ] },
        { title: 'kubectl & cluster', icon: 'Terminal', side: 'right', description: 'minikube/kind, kubectl cơ bản, context.', link: cl('kubernetes'),
          resources: [ off('Kubernetes — Basics Tutorial', 'https://kubernetes.io/docs/tutorials/kubernetes-basics/'), off('kubectl — Reference', 'https://kubernetes.io/docs/reference/kubectl/') ] },
        { title: 'Pod & container', icon: 'Boxes', side: 'left', description: 'Đơn vị nhỏ nhất, manifest YAML, probe.',
          resources: [ off('Kubernetes — Pods', 'https://kubernetes.io/docs/concepts/workloads/pods/') ] },
      ]},
      { label: 'Workload', nodes: [
        { title: 'Deployment & ReplicaSet', kind: 'info', description: 'Rolling update, rollback, số bản sao.',
          resources: [ off('Kubernetes — Deployments', 'https://kubernetes.io/docs/concepts/workloads/controllers/deployment/') ] },
        { title: 'Service & Ingress', icon: 'Network', side: 'right', description: 'ClusterIP/NodePort/LoadBalancer, định tuyến HTTP.',
          resources: [ off('Kubernetes — Service', 'https://kubernetes.io/docs/concepts/services-networking/service/'), off('Kubernetes — Ingress', 'https://kubernetes.io/docs/concepts/services-networking/ingress/') ] },
        { title: 'ConfigMap & Secret', kind: 'info', side: 'left', description: 'Cấu hình & bí mật tách khỏi image.',
          resources: [ off('Kubernetes — ConfigMap', 'https://kubernetes.io/docs/concepts/configuration/configmap/') ] },
      ]},
      { label: 'Lưu trữ & mở rộng', nodes: [
        { title: 'Volume & PVC', kind: 'info', description: 'PersistentVolume, StorageClass, claim.',
          resources: [ off('Kubernetes — Persistent Volumes', 'https://kubernetes.io/docs/concepts/storage/persistent-volumes/') ] },
        { title: 'Autoscaling (HPA)', icon: 'Gauge', side: 'right', description: 'Tự co giãn theo CPU/metric.',
          resources: [ off('Kubernetes — Horizontal Pod Autoscaling', 'https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/') ] },
        { title: 'Namespace & RBAC', icon: 'Lock', kind: 'info', side: 'left', description: 'Phân vùng & phân quyền truy cập.',
          resources: [ off('Kubernetes — RBAC', 'https://kubernetes.io/docs/reference/access-authn-authz/rbac/') ] },
      ]},
      { label: 'Ecosystem', nodes: [
        { title: 'Helm', kind: 'alternative', description: 'Đóng gói ứng dụng K8s theo chart.',
          resources: [ off('Helm — Docs', 'https://helm.sh/docs/') ] },
        { title: 'Monitoring', icon: 'LineChart', side: 'right', description: 'Prometheus + Grafana giám sát cluster.',
          resources: [ off('Prometheus — Docs', 'https://prometheus.io/docs/introduction/overview/'), off('Grafana — Docs', 'https://grafana.com/docs/') ] },
        { title: 'GitOps (Argo CD)', kind: 'alternative', side: 'left', description: 'Triển khai khai báo bằng Git.',
          resources: [ off('Argo CD — Docs', 'https://argo-cd.readthedocs.io/en/stable/') ] },
      ]},
    ],
  },

  // ─────────────────────────────── GIT & GITHUB ───────────────────────────────
  {
    slug: 'git', title: 'Git & GitHub', type: 'skill', icon: 'GitBranch', color: '#f05033',
    description: 'Quản lý phiên bản với Git — commit, branch, merge, rebase, resolve conflict và cộng tác qua GitHub.',
    stages: [
      { label: 'Nền tảng', nodes: [
        { title: 'Cài đặt & cấu hình', icon: 'Terminal', description: 'git config, SSH key, .gitignore.', link: cl('git'),
          resources: [ off('Pro Git — Getting Started', 'https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup') ] },
        { title: 'Commit & staging', kind: 'info', side: 'right', description: 'add/commit, working tree vs index, amend.',
          resources: [ off('Pro Git — Recording Changes', 'https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository') ] },
        { title: 'Branch & merge', icon: 'GitMerge', side: 'left', description: 'Tạo/chuyển nhánh, fast-forward, three-way merge.',
          resources: [ off('Pro Git — Branches in a Nutshell', 'https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell'), art('Learn Git Branching (tương tác)', 'https://learngitbranching.js.org/') ] },
      ]},
      { label: 'Cộng tác', nodes: [
        { title: 'Remote & push/pull', kind: 'info', description: 'origin, fetch/pull/push, upstream, fork.',
          resources: [ off('Pro Git — Working with Remotes', 'https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes') ] },
        { title: 'Pull Request & review', icon: 'GitFork', side: 'right', description: 'PR, code review, protected branch.',
          resources: [ off('GitHub — Pull Requests', 'https://docs.github.com/en/pull-requests') ] },
        { title: 'Merge vs Rebase', kind: 'info', side: 'left', description: 'Lịch sử tuyến tính, khi nào rebase.',
          resources: [ off('Pro Git — Rebasing', 'https://git-scm.com/book/en/v2/Git-Branching-Rebasing') ] },
      ]},
      { label: 'Nâng cao', nodes: [
        { title: 'Giải quyết conflict', kind: 'info', description: 'Đọc marker, chọn thay đổi, mergetool.',
          resources: [ off('GitHub — Resolving merge conflicts', 'https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/addressing-merge-conflicts/about-merge-conflicts') ] },
        { title: 'Stash, cherry-pick, reflog', kind: 'alternative', side: 'right', description: 'Cứu commit, chọn commit lẻ, phục hồi.',
          resources: [ off('Pro Git — Stashing', 'https://git-scm.com/book/en/v2/Git-Tools-Stashing-and-Cleaning') ] },
        { title: 'Tag & release', kind: 'info', side: 'left', description: 'Gắn thẻ phiên bản, semver, GitHub Releases.',
          resources: [ off('Pro Git — Tagging', 'https://git-scm.com/book/en/v2/Git-Basics-Tagging') ] },
      ]},
      { label: 'Quy trình', nodes: [
        { title: 'Git workflow', icon: 'Workflow', description: 'GitFlow, trunk-based, feature branch.',
          resources: [ art('Atlassian — Gitflow Workflow', 'https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow'), off('GitHub — GitHub flow', 'https://docs.github.com/en/get-started/using-github/github-flow') ] },
        { title: 'GitHub Actions CI', icon: 'Infinity', kind: 'alternative', side: 'right', description: 'Tự động test/build/deploy khi push.',
          resources: [ off('GitHub Actions — Docs', 'https://docs.github.com/en/actions') ] },
      ]},
    ],
  },

  // ─────────────────────────────── MONGODB ───────────────────────────────
  {
    slug: 'mongodb', title: 'MongoDB', type: 'skill', icon: 'Database', color: '#13aa52',
    description: 'Cơ sở dữ liệu document — CRUD, index, aggregation pipeline, thiết kế schema, replication và Mongoose.',
    stages: [
      { label: 'Nền tảng', nodes: [
        { title: 'Mô hình document', kind: 'info', description: 'BSON, collection, document, khác biệt với SQL.',
          resources: [ off('MongoDB — Databases & Collections', 'https://www.mongodb.com/docs/manual/core/databases-and-collections/') ] },
        { title: 'CRUD', icon: 'Database', side: 'right', description: 'insert/find/update/delete, toán tử truy vấn.', link: cl('mongodb'),
          resources: [ off('MongoDB — CRUD Operations', 'https://www.mongodb.com/docs/manual/crud/'), crs('MongoDB University', 'https://learn.mongodb.com/') ] },
        { title: 'Query & projection', kind: 'info', side: 'left', description: 'Lọc, projection, sort, limit, skip.',
          resources: [ off('MongoDB — Query Documents', 'https://www.mongodb.com/docs/manual/tutorial/query-documents/') ] },
      ]},
      { label: 'Nâng cao', nodes: [
        { title: 'Index', icon: 'Zap', description: 'Single/compound/text index, EXPLAIN, hiệu năng.',
          resources: [ off('MongoDB — Indexes', 'https://www.mongodb.com/docs/manual/indexes/') ] },
        { title: 'Aggregation pipeline', kind: 'info', side: 'right', description: 'match/group/project/lookup — tổng hợp mạnh.',
          resources: [ off('MongoDB — Aggregation', 'https://www.mongodb.com/docs/manual/aggregation/') ] },
        { title: 'Thiết kế schema', kind: 'info', side: 'left', description: 'Embed vs reference, mẫu dữ liệu, mối quan hệ.',
          resources: [ off('MongoDB — Data Modeling', 'https://www.mongodb.com/docs/manual/data-modeling/') ] },
      ]},
      { label: 'Vận hành', nodes: [
        { title: 'Replication & Sharding', kind: 'info', description: 'Replica set, sharding, tính sẵn sàng.',
          resources: [ off('MongoDB — Replication', 'https://www.mongodb.com/docs/manual/replication/'), off('MongoDB — Sharding', 'https://www.mongodb.com/docs/manual/sharding/') ] },
        { title: 'Transactions', kind: 'info', side: 'right', description: 'Giao dịch đa document, ACID.',
          resources: [ off('MongoDB — Transactions', 'https://www.mongodb.com/docs/manual/core/transactions/') ] },
      ]},
      { label: 'Ecosystem', nodes: [
        { title: 'Mongoose (Node.js)', icon: 'Hexagon', kind: 'alternative', description: 'ODM: schema, model, validation, middleware.', link: cl('nodejs-express'),
          resources: [ off('Mongoose — Docs', 'https://mongoosejs.com/docs/') ] },
        { title: 'Atlas (cloud)', icon: 'Cloud', kind: 'alternative', side: 'right', description: 'MongoDB managed, backup, monitoring.',
          resources: [ off('MongoDB Atlas — Docs', 'https://www.mongodb.com/docs/atlas/') ] },
      ]},
    ],
  },

  // ─────────────────────────────── ANDROID ───────────────────────────────
  {
    slug: 'android', title: 'Android', type: 'role', icon: 'Smartphone', color: '#3ddc84',
    description: 'Lộ trình phát triển Android — Kotlin, Jetpack Compose, ViewModel, Room, Retrofit, Coroutines và phát hành.',
    stages: [
      { label: 'Nền tảng', nodes: [
        { title: 'Kotlin', icon: 'Braces', description: 'Ngôn ngữ chính thức của Android — null-safety, coroutine.', link: cl('kotlin'),
          resources: [ off('Kotlin — Docs', 'https://kotlinlang.org/docs/home.html') ] },
        { title: 'Android Studio & project', kind: 'info', side: 'right', description: 'Gradle, cấu trúc app, emulator.', link: cl('android-kotlin'),
          resources: [ off('Android — Developer Guides', 'https://developer.android.com/guide'), crs('Android — Courses', 'https://developer.android.com/courses') ] },
        { title: 'Activity & Lifecycle', kind: 'info', side: 'left', description: 'Vòng đời màn hình, Intent, back stack.',
          resources: [ off('Android — Activity lifecycle', 'https://developer.android.com/guide/components/activities/activity-lifecycle') ] },
      ]},
      { label: 'Giao diện', nodes: [
        { title: 'Jetpack Compose', icon: 'Palette', description: 'UI khai báo hiện đại thay XML.',
          resources: [ off('Android — Jetpack Compose', 'https://developer.android.com/develop/ui/compose/documentation') ] },
        { title: 'Navigation', icon: 'Route', side: 'right', description: 'Điều hướng nhiều màn hình, truyền tham số.',
          resources: [ off('Android — Navigation', 'https://developer.android.com/guide/navigation') ] },
        { title: 'Material Design', kind: 'info', side: 'left', description: 'Component chuẩn, theme, màu sắc.',
          resources: [ off('Material Design 3', 'https://m3.material.io/') ] },
      ]},
      { label: 'Dữ liệu & logic', nodes: [
        { title: 'ViewModel & State', kind: 'info', description: 'Tách UI khỏi logic, StateFlow, lifecycle-aware.',
          resources: [ off('Android — ViewModel', 'https://developer.android.com/topic/libraries/architecture/viewmodel') ] },
        { title: 'Room (Database)', icon: 'Database', side: 'right', description: 'SQLite ORM, DAO, migration.',
          resources: [ off('Android — Room', 'https://developer.android.com/training/data-storage/room') ] },
        { title: 'Coroutines & Flow', icon: 'Zap', side: 'left', description: 'Bất đồng bộ, luồng dữ liệu phản ứng.',
          resources: [ off('Android — Coroutines', 'https://developer.android.com/kotlin/coroutines') ] },
        { title: 'Retrofit (network)', icon: 'Webhook', kind: 'alternative', side: 'right', description: 'Gọi REST API, JSON, interceptor.',
          resources: [ off('Retrofit (GitHub)', 'https://github.com/square/retrofit') ] },
      ]},
      { label: 'Production', nodes: [
        { title: 'Dependency Injection (Hilt)', kind: 'alternative', description: 'Quản lý phụ thuộc gọn, dễ test.',
          resources: [ off('Android — Hilt', 'https://developer.android.com/training/dependency-injection/hilt-android') ] },
        { title: 'Testing', kind: 'info', side: 'right', description: 'Unit, UI (Espresso), Compose test.',
          resources: [ off('Android — Testing', 'https://developer.android.com/training/testing') ] },
        { title: 'Phát hành Play Store', kind: 'info', side: 'left', description: 'Ký app, App Bundle, release.',
          resources: [ off('Android — Publish', 'https://developer.android.com/studio/publish') ] },
      ]},
    ],
  },

  // ─────────────────────────────── IOS ───────────────────────────────
  {
    slug: 'ios', title: 'iOS', type: 'role', icon: 'Smartphone', color: '#0071e3',
    description: 'Lộ trình phát triển iOS — Swift, SwiftUI, state, networking, persistence, concurrency và App Store.',
    stages: [
      { label: 'Nền tảng', nodes: [
        { title: 'Swift', icon: 'Braces', description: 'Ngôn ngữ của Apple — optional, struct, protocol.',
          resources: [ off('The Swift Programming Language (Book)', 'https://docs.swift.org/swift-book/'), off('Swift.org — Getting Started', 'https://www.swift.org/getting-started/') ] },
        { title: 'Xcode & project', kind: 'info', side: 'right', description: 'IDE, simulator, target, Swift Package Manager.',
          resources: [ off('Apple — Developer Documentation', 'https://developer.apple.com/documentation/') ] },
        { title: 'SwiftUI cơ bản', icon: 'Palette', side: 'left', description: 'UI khai báo: View, modifier, layout.', link: cl('swiftui-ios'),
          resources: [ crs('Apple — SwiftUI Tutorials', 'https://developer.apple.com/tutorials/swiftui'), off('Apple — SwiftUI', 'https://developer.apple.com/documentation/swiftui') ] },
      ]},
      { label: 'Giao diện', nodes: [
        { title: 'State & Binding', kind: 'info', description: '@State, @Binding, @ObservedObject, @Environment.',
          resources: [ off('Apple — Managing model data', 'https://developer.apple.com/documentation/swiftui/managing-model-data-in-your-app') ] },
        { title: 'Navigation & List', icon: 'Route', side: 'right', description: 'NavigationStack, List, sheet, tab.',
          resources: [ off('Apple — Navigation', 'https://developer.apple.com/documentation/swiftui/navigation') ] },
        { title: 'UIKit (nền cũ)', kind: 'alternative', side: 'left', description: 'Nhiều dự án vẫn dùng UIKit + interop.',
          resources: [ off('Apple — UIKit', 'https://developer.apple.com/documentation/uikit') ] },
      ]},
      { label: 'Dữ liệu & logic', nodes: [
        { title: 'Networking (URLSession)', icon: 'Webhook', description: 'Gọi API, JSON Codable, async request.',
          resources: [ off('Apple — URLSession', 'https://developer.apple.com/documentation/foundation/urlsession') ] },
        { title: 'Persistence (SwiftData)', icon: 'Database', side: 'right', description: 'Lưu trữ cục bộ: SwiftData / Core Data.',
          resources: [ off('Apple — SwiftData', 'https://developer.apple.com/documentation/swiftdata') ] },
        { title: 'Concurrency (async/await)', icon: 'Zap', side: 'left', description: 'Task, actor, structured concurrency.',
          resources: [ off('Swift — Concurrency', 'https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/') ] },
      ]},
      { label: 'Production', nodes: [
        { title: 'Testing (XCTest)', kind: 'info', description: 'Unit & UI test, XCTest, preview.',
          resources: [ off('Apple — XCTest', 'https://developer.apple.com/documentation/xctest') ] },
        { title: 'Phát hành App Store', kind: 'info', side: 'right', description: 'Provisioning, TestFlight, review.',
          resources: [ off('Apple — Distribution', 'https://developer.apple.com/distribute/') ] },
      ]},
    ],
  },

  // ─────────────────────────────── GAME DEVELOPER ───────────────────────────────
  {
    slug: 'game-dev', title: 'Game Developer', type: 'role', icon: 'Gamepad2', color: '#9333ea',
    description: 'Lộ trình làm game — toán cho game, engine (Unity/Unreal/Godot), đồ hoạ 2D/3D, gameplay và xuất bản.',
    stages: [
      { label: 'Nền tảng', nodes: [
        { title: 'Toán cho game', kind: 'info', description: 'Vector, ma trận, biến đổi, va chạm, lượng giác.',
          resources: [ crs('Khan Academy — Linear Algebra', 'https://www.khanacademy.org/math/linear-algebra') ] },
        { title: 'Một ngôn ngữ (C#/C++)', icon: 'Cpu', side: 'right', description: 'C# cho Unity, C++ cho Unreal.', link: cl('c'),
          resources: [ off('Lộ trình C / C++', '/roadmap/cpp') ] },
        { title: 'Game loop & vòng lặp', kind: 'info', side: 'left', description: 'Update/render, delta time, mẫu thiết kế game.',
          resources: [ art('Game Programming Patterns', 'https://gameprogrammingpatterns.com/game-loop.html') ] },
      ]},
      { label: 'Engine', nodes: [
        { title: 'Unity', icon: 'Gamepad2', description: 'Engine phổ biến nhất — C#, GameObject, scene.', link: cl('unity-c'),
          resources: [ crs('Unity — Learn', 'https://learn.unity.com/'), off('Unity — Manual', 'https://docs.unity3d.com/Manual/index.html') ] },
        { title: 'Unreal Engine', kind: 'alternative', side: 'right', description: 'Đồ hoạ AAA, Blueprint & C++.',
          resources: [ off('Unreal Engine — Documentation', 'https://dev.epicgames.com/documentation/en-us/unreal-engine') ] },
        { title: 'Godot', kind: 'alternative', side: 'left', description: 'Engine mã nguồn mở nhẹ, GDScript.',
          resources: [ off('Godot — Docs', 'https://docs.godotengine.org/en/stable/') ] },
      ]},
      { label: 'Đồ hoạ', nodes: [
        { title: '2D: sprite & tilemap', kind: 'info', description: 'Sprite, animation, tilemap, camera 2D.',
          resources: [ crs('Unity Learn — 2D', 'https://learn.unity.com/') ] },
        { title: '3D: mesh & lighting', kind: 'info', side: 'right', description: 'Mesh, material, ánh sáng, camera 3D.',
          resources: [ off('Unity — Manual', 'https://docs.unity3d.com/Manual/index.html') ] },
        { title: 'Shader & OpenGL', icon: 'Palette', kind: 'alternative', side: 'left', description: 'Pipeline đồ hoạ, GLSL, hiệu ứng.', link: cl('opengl'),
          resources: [ crs('LearnOpenGL', 'https://learnopengl.com/') ] },
      ]},
      { label: 'Gameplay & xuất bản', nodes: [
        { title: 'Physics & Input', kind: 'info', description: 'Va chạm, rigidbody, xử lý điều khiển.',
          resources: [ off('Unity — Physics', 'https://docs.unity3d.com/Manual/PhysicsSection.html') ] },
        { title: 'Audio & Animation', kind: 'info', side: 'right', description: 'Âm thanh, animator, state machine.',
          resources: [ off('Unity — Animation', 'https://docs.unity3d.com/Manual/AnimationSection.html') ] },
        { title: 'Tối ưu & build đa nền tảng', icon: 'Gauge', side: 'left', description: 'Profiling, giảm draw call, build PC/mobile/console.',
          resources: [ off('Unity — Profiler', 'https://docs.unity3d.com/Manual/Profiler.html') ] },
      ]},
    ],
  },

  // ─────────────────────────────── CYBER SECURITY ───────────────────────────────
  {
    slug: 'cyber-security', title: 'Cyber Security', type: 'role', icon: 'Shield', color: '#e11d48',
    description: 'Lộ trình an ninh mạng — nền tảng mạng/OS, mật mã, bảo mật web (OWASP), pentest, phòng thủ và chứng chỉ.',
    stages: [
      { label: 'Nền tảng', nodes: [
        { title: 'Mạng & giao thức', kind: 'info', description: 'TCP/IP, DNS, HTTP/S, TLS, port, firewall.',
          resources: [ art('Cloudflare — Learning Center', 'https://www.cloudflare.com/learning/') ] },
        { title: 'Hệ điều hành & Linux', icon: 'Terminal', side: 'right', description: 'Quyền, tiến trình, log, dòng lệnh Linux.', link: cl('linux-bash'),
          resources: [ off('The Linux Command Line', 'https://linuxcommand.org/tlcl.php') ] },
        { title: 'Một ngôn ngữ script', icon: 'Braces', side: 'left', description: 'Python để tự động hoá & viết tool.', link: cl('python'),
          resources: [ off('Python — Official Tutorial', 'https://docs.python.org/3/tutorial/') ] },
      ]},
      { label: 'Nền an ninh', nodes: [
        { title: 'Mật mã học cơ bản', icon: 'Lock', description: 'Hash, mã hoá đối xứng/bất đối xứng, chữ ký số.',
          resources: [ crs('Khan Academy — Cryptography', 'https://www.khanacademy.org/computing/computer-science/cryptography') ] },
        { title: 'Xác thực & phân quyền', kind: 'info', side: 'right', description: 'Session, JWT, OAuth, MFA, least privilege.',
          resources: [ art('OWASP — Cheat Sheet Series', 'https://cheatsheetseries.owasp.org/') ] },
        { title: 'Bảo mật web (OWASP Top 10)', icon: 'Bug', side: 'left', description: 'Injection, XSS, CSRF, SSRF, cấu hình sai.',
          resources: [ art('OWASP Top 10', 'https://owasp.org/www-project-top-ten/'), crs('PortSwigger — Web Security Academy', 'https://portswigger.net/web-security') ] },
      ]},
      { label: 'Tấn công & phòng thủ', nodes: [
        { title: 'Pentest & công cụ', kind: 'info', description: 'Recon, scan, exploit; Nmap, Burp, Metasploit.',
          resources: [ off('Nmap — Reference Guide', 'https://nmap.org/book/'), crs('TryHackMe', 'https://tryhackme.com/') ] },
        { title: 'Network & endpoint security', kind: 'info', side: 'right', description: 'Firewall, VPN, IDS/IPS, hardening.',
          resources: [ off('Kali Linux — Docs', 'https://www.kali.org/docs/') ] },
        { title: 'Thực hành có kiểm soát', icon: 'Shield', side: 'left', description: 'Lab hợp pháp: HackTheBox, TryHackMe.',
          resources: [ crs('Hack The Box', 'https://www.hackthebox.com/'), crs('TryHackMe', 'https://tryhackme.com/') ] },
      ]},
      { label: 'Nâng cao', nodes: [
        { title: 'Blue team & SIEM', kind: 'alternative', description: 'Giám sát, phát hiện, phân tích log.',
          resources: [ off('Elastic Security — Docs', 'https://www.elastic.co/guide/en/security/current/index.html') ] },
        { title: 'Incident response', kind: 'info', side: 'right', description: 'Quy trình ứng phó sự cố, forensics.',
          resources: [ off('NIST — Computer Security Resource Center', 'https://csrc.nist.gov/') ] },
        { title: 'Chứng chỉ', kind: 'alternative', side: 'left', description: 'CompTIA Security+, CEH, OSCP.',
          resources: [ off('CompTIA — Security+', 'https://www.comptia.org/certifications/security') ] },
      ]},
    ],
  },

  // ─────────────────────────────── DATA SCIENTIST ───────────────────────────────
  {
    slug: 'data-scientist', title: 'Data Scientist', type: 'role', icon: 'Brain', color: '#0891b2',
    description: 'Lộ trình Data Scientist — Python, toán/thống kê, xử lý dữ liệu, trực quan hoá, machine learning và MLOps.',
    stages: [
      { label: 'Nền tảng', nodes: [
        { title: 'Python cho Data Science', icon: 'Braces', description: 'Cú pháp, cấu trúc dữ liệu, môi trường ảo.', link: cl('python'),
          resources: [ off('Lộ trình Python', '/roadmap/python') ] },
        { title: 'Toán & thống kê', kind: 'info', side: 'right', description: 'Xác suất, phân phối, hồi quy, đại số tuyến tính.',
          resources: [ crs('Khan Academy — Statistics', 'https://www.khanacademy.org/math/statistics-probability'), crs('Khan Academy — Linear Algebra', 'https://www.khanacademy.org/math/linear-algebra') ] },
        { title: 'SQL', icon: 'Database', side: 'left', description: 'Truy vấn & tổng hợp dữ liệu từ DB.', link: cl('sql'),
          resources: [ off('Lộ trình SQL', '/roadmap/sql') ] },
      ]},
      { label: 'Xử lý dữ liệu', nodes: [
        { title: 'Pandas & NumPy', kind: 'info', description: 'DataFrame, lọc/nhóm/ghép, xử lý số.',
          resources: [ off('Pandas — Getting Started', 'https://pandas.pydata.org/docs/getting_started/index.html'), off('NumPy — Beginner Guide', 'https://numpy.org/doc/stable/user/absolute_beginners.html') ] },
        { title: 'Làm sạch & EDA', kind: 'info', side: 'right', description: 'Xử lý thiếu/ngoại lai, khám phá dữ liệu.',
          resources: [ off('Pandas — Working with Missing Data', 'https://pandas.pydata.org/docs/user_guide/missing_data.html') ] },
        { title: 'Trực quan hoá', icon: 'LineChart', side: 'left', description: 'Matplotlib, Seaborn — biểu đồ, storytelling.',
          resources: [ off('Matplotlib — Users Guide', 'https://matplotlib.org/stable/users/index.html'), off('Seaborn — Tutorial', 'https://seaborn.pydata.org/tutorial.html') ] },
      ]},
      { label: 'Machine Learning', nodes: [
        { title: 'scikit-learn', icon: 'Brain', description: 'Hồi quy, phân loại, clustering, pipeline.',
          resources: [ off('scikit-learn — User Guide', 'https://scikit-learn.org/stable/user_guide.html') ] },
        { title: 'Feature engineering & đánh giá', kind: 'info', side: 'right', description: 'Chuẩn hoá, encoding, cross-validation, metric.',
          resources: [ crs('Kaggle — Feature Engineering', 'https://www.kaggle.com/learn/feature-engineering') ] },
        { title: 'Deep Learning', kind: 'alternative', side: 'left', description: 'Mạng nơ-ron, PyTorch/TensorFlow.',
          resources: [ crs('Google — Machine Learning Crash Course', 'https://developers.google.com/machine-learning/crash-course') ] },
      ]},
      { label: 'Chuyên nghiệp', nodes: [
        { title: 'Jupyter & thực hành Kaggle', kind: 'info', description: 'Notebook, thi đấu, dataset thật.',
          resources: [ off('Jupyter — Docs', 'https://docs.jupyter.org/en/latest/'), crs('Kaggle — Learn', 'https://www.kaggle.com/learn') ] },
        { title: 'MLOps', kind: 'alternative', side: 'right', description: 'Triển khai, theo dõi, tái huấn luyện mô hình.', link: rm('ai-engineer'),
          resources: [ crs('ml-ops.org — Principles', 'https://ml-ops.org/') ] },
      ]},
    ],
  },

  // ─────────────────────────────── BLOCKCHAIN ───────────────────────────────
  {
    slug: 'blockchain', title: 'Blockchain', type: 'role', icon: 'Blocks', color: '#f7931a',
    description: 'Lộ trình lập trình blockchain — nguyên lý, smart contract Solidity, dev tools, DApp và token standard.',
    stages: [
      { label: 'Nền tảng', nodes: [
        { title: 'Blockchain hoạt động thế nào', kind: 'info', description: 'Block, hash, consensus, phi tập trung.',
          resources: [ crs('ethereum.org — Learn', 'https://ethereum.org/en/learn/') ] },
        { title: 'Mật mã & ví', icon: 'Lock', side: 'right', description: 'Hash, cặp khoá, chữ ký số, địa chỉ ví.',
          resources: [ off('ethereum.org — Accounts', 'https://ethereum.org/en/developers/docs/accounts/') ] },
        { title: 'Giao dịch & EVM', kind: 'info', side: 'left', description: 'Transaction, gas, Ethereum Virtual Machine.',
          resources: [ off('ethereum.org — EVM', 'https://ethereum.org/en/developers/docs/evm/') ] },
      ]},
      { label: 'Smart Contract', nodes: [
        { title: 'Solidity', icon: 'Braces', description: 'Ngôn ngữ hợp đồng thông minh: type, function, event.',
          resources: [ off('Solidity — Docs', 'https://docs.soliditylang.org/'), crs('CryptoZombies', 'https://cryptozombies.io/') ] },
        { title: 'Dev tools (Hardhat/Foundry)', icon: 'Wrench', side: 'right', description: 'Compile, test, deploy contract cục bộ.',
          resources: [ off('Hardhat — Docs', 'https://hardhat.org/docs'), off('Foundry — Book', 'https://book.getfoundry.sh/') ] },
        { title: 'Bảo mật hợp đồng', icon: 'Shield', side: 'left', description: 'Reentrancy, overflow, kiểm toán, best practice.',
          resources: [ off('ethereum.org — Smart Contract Security', 'https://ethereum.org/en/developers/docs/smart-contracts/security/') ] },
      ]},
      { label: 'DApp', nodes: [
        { title: 'Web3 frontend', icon: 'Atom', description: 'Kết nối ví, gọi contract (ethers.js/viem).',
          resources: [ off('ethers.js — Docs', 'https://docs.ethers.org/') ] },
        { title: 'Deploy testnet/mainnet', kind: 'info', side: 'right', description: 'Faucet, RPC, verify contract.',
          resources: [ off('ethereum.org — Development Networks', 'https://ethereum.org/en/developers/docs/networks/') ] },
      ]},
      { label: 'Nâng cao', nodes: [
        { title: 'Token standards', icon: 'Coins', kind: 'alternative', description: 'ERC-20, ERC-721 (NFT), ERC-1155.',
          resources: [ off('EIPs — Ethereum Improvement Proposals', 'https://eips.ethereum.org/'), off('OpenZeppelin — Contracts', 'https://docs.openzeppelin.com/contracts/') ] },
        { title: 'Layer 2 & scaling', kind: 'info', side: 'right', description: 'Rollup, sidechain, phí thấp.',
          resources: [ off('ethereum.org — Layer 2', 'https://ethereum.org/en/layer-2/') ] },
        { title: 'DeFi & NFT', kind: 'alternative', side: 'left', description: 'AMM, lending, marketplace.',
          resources: [ crs('ethereum.org — DeFi', 'https://ethereum.org/en/defi/') ] },
      ]},
    ],
  },

  // ─────────────────────────────── SOFTWARE ARCHITECT ───────────────────────────────
  {
    slug: 'software-architect', title: 'Software Architect', type: 'role', icon: 'Compass', color: '#475569',
    description: 'Lộ trình kiến trúc sư phần mềm — design pattern, phong cách kiến trúc, DDD, khả năng mở rộng và tài liệu ADR.',
    stages: [
      { label: 'Nền tảng', nodes: [
        { title: 'Vững một domain kỹ thuật', kind: 'info', description: 'Làm chủ backend/frontend trước khi thiết kế hệ thống.', link: rm('backend'),
          resources: [ off('Lộ trình Backend', '/roadmap/backend') ] },
        { title: 'Design Patterns', icon: 'Puzzle', side: 'right', description: 'GoF: creational, structural, behavioral.',
          resources: [ crs('Refactoring.Guru — Design Patterns', 'https://refactoring.guru/design-patterns') ] },
        { title: 'SOLID & clean code', kind: 'info', side: 'left', description: 'Nguyên tắc thiết kế, dễ bảo trì & mở rộng.',
          resources: [ art('SOLID (Wikipedia)', 'https://en.wikipedia.org/wiki/SOLID'), art('Martin Fowler — Software Architecture Guide', 'https://martinfowler.com/architecture/') ] },
      ]},
      { label: 'Kiến trúc', nodes: [
        { title: 'Phong cách kiến trúc', kind: 'info', description: 'Monolith, microservice, event-driven, serverless.',
          resources: [ art('Martin Fowler — Microservices', 'https://martinfowler.com/articles/microservices.html') ] },
        { title: 'System Design', icon: 'Boxes', side: 'right', description: 'Mở rộng, cân bằng tải, caching, hàng đợi.', link: rm('system-design'),
          resources: [ off('Lộ trình System Design', '/roadmap/system-design'), art('System Design Primer', 'https://github.com/donnemartin/system-design-primer') ] },
        { title: 'Domain-Driven Design', kind: 'alternative', side: 'left', description: 'Bounded context, ubiquitous language, aggregate.',
          resources: [ art('Martin Fowler — Domain Driven Design', 'https://martinfowler.com/bliki/DomainDrivenDesign.html') ] },
      ]},
      { label: 'Chất lượng', nodes: [
        { title: 'Scalability & performance', icon: 'Gauge', description: 'Bottleneck, cache, async, đo lường.',
          resources: [ art('System Design Primer — Scalability', 'https://github.com/donnemartin/system-design-primer') ] },
        { title: 'Security & compliance', icon: 'Shield', side: 'right', description: 'Threat modeling, OWASP, dữ liệu nhạy cảm.',
          resources: [ art('OWASP Top 10', 'https://owasp.org/www-project-top-ten/') ] },
        { title: 'Observability', icon: 'LineChart', side: 'left', description: 'Log, metric, trace — quan sát hệ thống.',
          resources: [ off('OpenTelemetry — Docs', 'https://opentelemetry.io/docs/') ] },
      ]},
      { label: 'Kỹ năng & tài liệu', nodes: [
        { title: 'Tài liệu & ADR', icon: 'BookOpen', description: 'Architecture Decision Record, sơ đồ C4.',
          resources: [ off('ADR — Architectural Decision Records', 'https://adr.github.io/'), art('The Twelve-Factor App', 'https://12factor.net/') ] },
        { title: 'Trade-off & giao tiếp', kind: 'info', side: 'right', description: 'Cân nhắc đánh đổi, thuyết phục stakeholder.',
          resources: [ art('Martin Fowler — Architecture', 'https://martinfowler.com/architecture/') ] },
      ]},
    ],
  },
];
