import { PrismaClient } from '@prisma/client';
const { generateLesson } = await import('../dist/services/codeLab.lesson.service.js');
const prisma = new PrismaClient();
const mod = await prisma.codeModule.findFirst({ where: { track: { slug: 'javascript' } }, orderBy: { sortOrder: 'asc' } });
if (!mod) { console.log('no module'); process.exit(0); }
console.log('module:', mod.id, mod.name);
try {
  const res = await generateLesson(1, { moduleId: mod.id });
  console.log('OK blocks:', res.blocks.length);
  const types = {}; res.blocks.forEach(b => types[b.type] = (types[b.type]||0)+1);
  console.log('block types:', JSON.stringify(types));
  console.log('total chars:', JSON.stringify(res.blocks).length);
} catch (e) {
  console.log('FAIL:', String(e?.message || e));
}
process.exit(0);
