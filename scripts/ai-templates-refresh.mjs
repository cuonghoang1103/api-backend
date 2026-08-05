#!/usr/bin/env node
/**
 * Làm mới danh mục của kho AI Templates (/ai-templates).
 *
 *   node scripts/ai-templates-refresh.mjs
 *
 * Tải 10 tệp JSON từ aitmpl.com — trang duyệt của dự án mã nguồn mở
 * `davila7/claude-code-templates` (MIT) — rồi CHUẨN HOÁ vào
 * `frontend/src/data/ai-templates/`.
 *
 * ─── VÌ SAO PHẢI CÓ SCRIPT NÀY ──────────────────────────────────────────────
 * Dữ liệu là bản chụp tại một thời điểm, không phải tải lúc chạy (xem chú thích
 * đầu `frontend/src/lib/ai-templates/data.server.ts`). Không có script, lần
 * cập nhật sau sẽ là chép tay 1.877 bản ghi — và phần chuẩn hoá bên dưới sẽ bị
 * làm lại theo trí nhớ, mỗi lần một kiểu.
 *
 * ─── PHẦN CHUẨN HOÁ LÀM GÌ ──────────────────────────────────────────────────
 * 1. Sửa lỗi gõ `"type": "sandbo"` trong sandbox.json.
 * 2. Mô tả của agent vốn là prompt hệ thống cắt ra, nên mang theo dãy `\n`
 *    DẠNG CHỮ (hai ký tự) và cả khối `<example>…` minh hoạ hội thoại —
 *    162/421 agent dính. Để nguyên thì thẻ nào cũng hiện "\n\n<example>\n
 *    Context:" trông y như lỗi hiển thị.
 * 3. Bỏ những trường không dùng tới trong plugins.json (`plugin_manifest` lồng
 *    nhau) — riêng nó là 1,1 MB trong khi phần dùng thật chỉ 17 KB.
 * 4. Ghi ra JSON đã nén (không xuống dòng, không thụt lề) và sắp xếp ổn định,
 *    để `git diff` giữa hai lần làm mới chỉ hiện đúng phần THẬT SỰ đổi.
 *
 * Chạy xong nhớ: `(cd frontend && npx tsc --noEmit && npm run build)`.
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'frontend/src/data/ai-templates');

const BASE = 'https://www.aitmpl.com';

/** Tên tệp nguồn → mã loại dùng trong `ComponentRecord.type`. */
const SIMPLE = {
  skills: 'skill',
  agents: 'agent',
  commands: 'command',
  mcps: 'mcp',
  settings: 'setting',
  hooks: 'hook',
  loops: 'loop',
  sandbox: 'sandbox',
};

// Cắt từ chỗ khối ví dụ bắt đầu — phần đứng trước đã là mô tả trọn nghĩa.
const CUT = /\s*(?:Specifically\s*:|<example>|<commentary>|Examples?\s*:)[\s\S]*$/i;

function clean(input) {
  let s = (input ?? '').trim();
  if (!s) return '';
  if (s.length > 1 && s.startsWith('"') && s.endsWith('"')) s = s.slice(1, -1).trim();
  s = s.replace(/\\n/g, ' ').replace(/\\t/g, ' ').replace(/\\"/g, '"');
  s = s.replace(CUT, '');
  s = s.replace(/<[^>]{1,40}>/g, ' ');
  return s.replace(/\s+/g, ' ').trim().replace(/[ ,;:-]+$/, '');
}

/**
 * Làm phẳng `contains` của plugin thành bảng `tên → số`.
 *
 * 11/33 plugin khai lồng một tầng: `{plugins: 255, components: {agents: 23,
 * skills: 40, …}}`. Để nguyên thì giao diện nhận phải một OBJECT ở chỗ nó chờ
 * một con số, và React ném thẳng "Objects are not valid as a React child" —
 * trang chi tiết của đúng 11 plugin đó trắng bóc. Kiểu TS khai là
 * `Record<string, number>` nhưng JSON được nạp bằng `as ComponentRecord[]`,
 * nên phép ép kiểu đã che lỗi này cho tới khi chạy thật.
 *
 * Chuẩn hoá ngay ở đây, chỗ dữ liệu vào, để kiểu khai báo nói đúng sự thật.
 */
function flattenContains(raw) {
  const out = {};
  for (const [k, v] of Object.entries(raw || {})) {
    if (typeof v === 'number') {
      out[k] = (out[k] || 0) + v;
    } else if (v && typeof v === 'object') {
      for (const [k2, v2] of Object.entries(v)) {
        if (typeof v2 === 'number') out[k2] = (out[k2] || 0) + v2;
      }
    }
  }
  return out;
}

async function getJson(path) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'User-Agent': 'cuongthai-ai-templates-refresh/1.0' },
  });
  if (!res.ok) throw new Error(`${path} → HTTP ${res.status}`);
  return res.json();
}

/** Ghi JSON nén. Sắp xếp ổn định để diff giữa hai lần chạy đọc được. */
async function write(name, rows) {
  await writeFile(join(OUT, `${name}.json`), JSON.stringify(rows), 'utf8');
  console.log(`  ${name.padEnd(10)} ${String(rows.length).padStart(4)} bản ghi`);
}

async function main() {
  await mkdir(OUT, { recursive: true });
  console.log(`Tải danh mục từ ${BASE} …\n`);

  let total = 0;

  for (const [file, type] of Object.entries(SIMPLE)) {
    const rows = (await getJson(`/components/${file}.json`))
      .map((x) => ({
        name: x.name,
        path: x.path,
        category: x.category || 'other',
        type, // ghi đè, vì sandbox.json khai sai là "sandbo"
        description: clean(x.description),
        author: clean(x.author),
        repo: x.repo || '',
        version: x.version || '',
        license: x.license || '',
        keywords: x.keywords || [],
      }))
      .sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
    await write(file, rows);
    total += rows.length;
  }

  const templates = (await getJson('/components/templates.json'))
    .map((x) => ({
      name: x.name,
      path: x.id,
      category: x.category || 'other',
      type: 'template',
      description: clean(x.description),
      author: '',
      repo: '',
      version: '',
      license: '',
      keywords: [x.language, x.subtype].filter(Boolean),
      files: x.files || [],
      installCommand: x.installCommand || '',
    }))
    .sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
  await write('templates', templates);
  total += templates.length;

  // plugins.json nằm ở gốc, không nằm trong /components/, và mang theo
  // `plugin_manifest` lồng nhiều tầng mà trang không dùng tới — bỏ hẳn.
  const plugins = (await getJson('/plugins.json'))
    .map((x) => ({
      name: x.name || x.slug,
      path: x.slug,
      category: (x.tags || ['other'])[0],
      type: 'plugin',
      description: clean(x.description),
      author: x.author || '',
      repo: x.github || '',
      version: '',
      license: '',
      keywords: x.tags || [],
      stars: x.stars || 0,
      website: x.website || '',
      contains: flattenContains(x.contains),
      highlights: (x.highlights || []).slice(0, 4),
    }))
    .sort((a, b) => b.stars - a.stars);
  await write('plugins', plugins);
  total += plugins.length;

  console.log(`\nXong — ${total} component vào ${OUT}`);
  console.log('Chạy tiếp: (cd frontend && npx tsc --noEmit && npm run build)');
}

main().catch((err) => {
  console.error('\nLỖI:', err.message);
  process.exit(1);
});
