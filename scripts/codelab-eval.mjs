// One-off: generate ONE exercise (batch-1 depth) for a module and print field sizes.
import { PrismaClient } from '@prisma/client';
const { generateExercises } = await import('../dist/services/codeLab.ai.service.js');
const prisma = new PrismaClient();
const mod = await prisma.codeModule.findFirst({ where: { track: { slug: 'python' } }, orderBy: { sortOrder: 'asc' } });
if (!mod) { console.log('no module'); process.exit(0); }
console.log('module:', mod.name);
const res = await generateExercises(1, { moduleId: mod.id, count: 1 });
const e = res.exercises[0];
console.log('title:', e.title, '| diff:', e.difficulty, '| minutes:', e.estimatedMinutes);
console.log('problemHtml len:', (e.problemHtml || '').length);
console.log('concepts:', (e.concepts || []).length, '| prerequisites:', (e.prerequisites || []).length);
console.log('examples:', (e.examples || []).length, '| hints:', (e.hints || []).length);
console.log('solutionCode len:', JSON.stringify(e.solutionCode || []).length);
console.log('solutionExplanationHtml len:', (e.solutionExplanationHtml || '').length);
console.log('--- problem preview ---');
console.log((e.problemHtml || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 400));
process.exit(0);
