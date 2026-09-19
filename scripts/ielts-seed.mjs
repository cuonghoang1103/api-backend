/**
 * ielts-seed — nạp `content/ielts/noi-dung.json` vào bảng `ielts_content`.
 * ─────────────────────────────────────────────────────────────────────────
 *   node scripts/ielts-seed.mjs            # DRY, chỉ in ra sẽ làm gì
 *   node scripts/ielts-seed.mjs --apply    # ghi DB
 *
 * Chạy được CẢ trong container lúc deploy: nó chỉ cần `content/` và
 * `@prisma/client`, không cần `frontend/` lẫn `tsx`. Tệp JSON do
 * `scripts/ielts-dung-json.mts` dựng ở máy nhà và đi theo git.
 *
 * Idempotent bằng `upsert` trên `uk_ielts_stage_kind`. Chạy lại mười lần vẫn
 * ra đúng 40 hàng.
 */
import path from 'node:path';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const APPLY = process.argv.includes('--apply');
const TEP = path.join(ROOT, 'content/ielts/noi-dung.json');

const prisma = new PrismaClient();

async function chay() {
  if (!existsSync(TEP)) {
    // Không ném: deploy chạy seeder này cùng năm sáu seeder khác, và một kho
    // chưa có nội dung IELTS không phải là lỗi deploy.
    console.log('⏭  chưa có content/ielts/noi-dung.json — bỏ qua');
    return;
  }
  const goi = JSON.parse(readFileSync(TEP, 'utf8'));
  const hang = goi.hang ?? [];
  console.log(`IELTS seed · ${hang.length} hàng · nguồn sha ${String(goi.nguonSha).slice(0, 16)}… · ${APPLY ? 'APPLY' : 'DRY'}`);

  let moi = 0;
  let capNhat = 0;
  for (const h of hang) {
    if (!APPLY) continue;
    const cu = await prisma.ieltsContent.findUnique({
      where: { uk_ielts_stage_kind: { stage: h.stage, kind: h.kind } },
      select: { id: true },
    });
    await prisma.ieltsContent.upsert({
      where: { uk_ielts_stage_kind: { stage: h.stage, kind: h.kind } },
      create: { stage: h.stage, kind: h.kind, payload: h.payload, soMuc: h.soMuc ?? 0 },
      update: { payload: h.payload, soMuc: h.soMuc ?? 0 },
    });
    if (cu) capNhat += 1; else moi += 1;
  }

  if (APPLY) {
    const tong = await prisma.ieltsContent.count();
    console.log(`✅ mới ${moi} · cập nhật ${capNhat} · tổng trong DB ${tong}`);
  } else {
    console.log('   (DRY — thêm --apply để ghi)');
    for (const h of hang.slice(0, 5)) console.log(`   ${h.stage}/${h.kind} — ${h.soMuc} mục`);
  }
}

chay()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
