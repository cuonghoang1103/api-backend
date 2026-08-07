/**
 * repos-seed.mjs — nạp kho repo tuyển chọn vào bảng `github_repos` (/repos).
 * ─────────────────────────────────────────────────────────────────────────────
 *   node scripts/repos-seed.mjs --dry      # xem trước, không ghi gì
 *   node scripts/repos-seed.mjs --apply    # ghi thật
 *   node scripts/repos-seed.mjs --apply --force-review   # ghi đè cả review đã sửa tay
 *
 * NGUỒN DỮ LIỆU — hai file, cố ý tách:
 *   • content/repos/curated.mjs  — người viết: slug, tags, review
 *   • content/repos/meta.json    — máy fetch: số sao, ngôn ngữ, mô tả GitHub
 *
 * IDEMPOTENT. Khoá là `url` (đã UNIQUE trong schema), nên chạy lại bao nhiêu
 * lần cũng không đẻ thêm dòng. Ba quy tắc giữ cho một lần deploy không xoá mất
 * công sức chỉnh tay trong /admin/repos:
 *
 *   1. REVIEW — chỉ ghi khi tạo mới hoặc khi review trong DB đang rỗng. Repo đã
 *      có review mà nội dung khác file thì BỎ QUA và in cảnh báo: không phân
 *      biệt được "file vừa sửa" với "người vừa sửa trong UI", nên mặc định
 *      nghiêng về phía không phá. Muốn ép theo file thì thêm --force-review.
 *   2. METADATA (sao/ngôn ngữ/mô tả) — chỉ ghi lúc TẠO MỚI. Sau đó nút
 *      "Sync all" ở trang admin là nguồn chân lý, vì số sao trong file chỉ là
 *      ảnh chụp tại ngày fetch và sẽ cũ dần.
 *   3. TAGS — chỉ THÊM, không bao giờ xoá. Tag admin gắn tay ở lại nguyên.
 *
 * STATUS: repo tạo mới vào thẳng PUBLISHED (đã có sẵn review nên không cần
 * duyệt). Repo đã tồn tại thì giữ nguyên status — admin chuyển về DRAFT là có
 * chủ đích, deploy sau không được kéo ngược lên.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const FORCE_REVIEW = args.includes('--force-review');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CURATED = path.join(ROOT, 'content/repos/curated.mjs');
const META = path.join(ROOT, 'content/repos/meta.json');

function slugifyTag(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
}

async function main() {
  for (const f of [CURATED, META]) {
    if (!fs.existsSync(f)) {
      console.error(`✗ Thiếu file dữ liệu: ${path.relative(ROOT, f)}`);
      process.exit(1);
    }
  }

  const curated = (await import(pathToFileURL(CURATED).href)).default;
  const meta = JSON.parse(fs.readFileSync(META, 'utf8')).repos;

  if (!Array.isArray(curated) || curated.length === 0) {
    console.error('✗ curated.mjs rỗng hoặc không phải mảng');
    process.exit(1);
  }

  // ── Kiểm tra dữ liệu TRƯỚC khi chạm vào DB ────────────────────────────
  // Một slug sai chính tả sẽ tạo ra repo trỏ tới URL 404 mà không có lỗi nào
  // lộ ra ở tầng dưới, nên chặn ngay ở đây.
  const problems = [];
  const seen = new Set();
  for (const [i, r] of curated.entries()) {
    const where = `#${i + 1} ${r?.slug || '(không có slug)'}`;
    if (!r?.slug || !/^[\w.-]+\/[\w.-]+$/.test(r.slug)) problems.push(`${where}: slug sai định dạng owner/repo`);
    else if (seen.has(r.slug)) problems.push(`${where}: slug trùng`);
    else seen.add(r.slug);
    if (!r?.review || !r.review.trim()) problems.push(`${where}: review rỗng`);
    if (!Array.isArray(r?.tags) || r.tags.length === 0) problems.push(`${where}: chưa có tag`);
    if (r?.slug && !meta[r.slug]) problems.push(`${where}: không có metadata trong meta.json`);
    if (r?.review?.trimStart().startsWith('#')) {
      problems.push(`${where}: review mở đầu bằng heading — thẻ ở /repos render không bật heading nên sẽ lòi dấu #`);
    }
  }
  if (problems.length) {
    console.error(`✗ Dữ liệu không hợp lệ (${problems.length} lỗi):`);
    for (const p of problems.slice(0, 20)) console.error('  -', p);
    process.exit(1);
  }

  console.log(`Đọc ${curated.length} repo từ content/repos/ · chế độ: ${APPLY ? 'APPLY' : 'DRY-RUN'}`);

  // ── Tag: gom toàn bộ tên tag, upsert theo slug một lần ────────────────
  const tagNames = [...new Set(curated.flatMap((r) => r.tags))];
  const tagIdByName = new Map();
  let tagsCreated = 0;
  for (const name of tagNames) {
    const slug = slugifyTag(name);
    const existing = await prisma.tag.findUnique({ where: { slug } });
    if (existing) {
      tagIdByName.set(name, existing.id);
      continue;
    }
    if (!APPLY) {
      tagIdByName.set(name, -1);
      tagsCreated += 1;
      continue;
    }
    const created = await prisma.tag.create({ data: { name, slug } });
    tagIdByName.set(name, created.id);
    tagsCreated += 1;
  }

  let created = 0;
  let reviewFilled = 0;
  let skippedReview = 0;
  let tagsAdded = 0;
  let unchanged = 0;

  for (const r of curated) {
    const [owner, repoName] = r.slug.split('/');
    const url = `https://github.com/${owner}/${repoName}`;
    const m = meta[r.slug];
    const wantTagIds = r.tags.map((t) => tagIdByName.get(t)).filter((id) => id && id > 0);

    const existing = await prisma.githubRepo.findUnique({
      where: { url },
      include: { tags: true },
    });

    if (!existing) {
      created += 1;
      if (APPLY) {
        await prisma.githubRepo.create({
          data: {
            repoName,
            owner,
            url,
            stars: m.stars ?? 0,
            language: m.language ?? null,
            description: m.description ?? null,
            myReview: r.review.trim(),
            status: 'PUBLISHED',
            tags: wantTagIds.length ? { create: wantTagIds.map((tagId) => ({ tagId })) } : undefined,
          },
        });
      }
      console.log(`  + ${r.slug}  ★${m.stars ?? 0}  ${m.language ?? '—'}  [${r.tags.join(', ')}]`);
      continue;
    }

    // ── Repo đã có: chỉ vá những chỗ an toàn ───────────────────────────
    let touched = false;

    const dbReview = (existing.myReview || '').trim();
    const fileReview = r.review.trim();
    if (dbReview !== fileReview) {
      if (!dbReview || FORCE_REVIEW) {
        reviewFilled += 1;
        touched = true;
        if (APPLY) {
          await prisma.githubRepo.update({ where: { id: existing.id }, data: { myReview: fileReview } });
        }
        console.log(`  ~ ${r.slug}: cập nhật review${dbReview ? ' (ép theo file)' : ' (DB đang rỗng)'}`);
      } else {
        skippedReview += 1;
        console.log(`  ! ${r.slug}: review trong DB khác file — GIỮ NGUYÊN (dùng --force-review để ép)`);
      }
    }

    const haveTagIds = new Set(existing.tags.map((t) => t.tagId));
    const missing = wantTagIds.filter((id) => !haveTagIds.has(id));
    if (missing.length) {
      tagsAdded += missing.length;
      touched = true;
      if (APPLY) {
        await prisma.githubRepoTag.createMany({
          data: missing.map((tagId) => ({ repoId: existing.id, tagId })),
          skipDuplicates: true,
        });
      }
      console.log(`  ~ ${r.slug}: thêm ${missing.length} tag`);
    }

    if (!touched) unchanged += 1;
  }

  const total = await prisma.githubRepo.count();
  const published = await prisma.githubRepo.count({ where: { status: 'PUBLISHED' } });

  console.log(
    `\n${APPLY ? 'Đã ghi' : 'Sẽ ghi (dry-run)'}: repo mới +${created} · review +${reviewFilled} · ` +
      `tag mới +${tagsCreated} · gắn thêm tag +${tagsAdded} · giữ nguyên ${unchanged}` +
      (skippedReview ? ` · bỏ qua review đã sửa tay ${skippedReview}` : ''),
  );
  if (APPLY) console.log(`Tổng trong DB: ${total} repo (${published} đã xuất bản).`);
  else console.log('Chưa ghi gì. Chạy lại với --apply để áp dụng.');
}

main()
  .catch((err) => {
    console.error('✗ Seed lỗi:', err?.message || err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
