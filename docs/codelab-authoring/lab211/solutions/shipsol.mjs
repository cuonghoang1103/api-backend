// Attach verified solutions + Vietnamese briefs to their exercises.
import fs from 'fs';
const { prisma } = await import('/app/dist/config/database.js');
const items = JSON.parse(fs.readFileSync('/tmp/lab211-solutions.json', 'utf8'));

let ok = 0;
for (const it of items) {
  const ex = await prisma.codeExercise.findFirst({
    where: { track: { slug: 'lab211' }, title: { startsWith: `${it.lab}_` } },
    select: { id: true, title: true },
  });
  if (!ex) { console.error('KHÔNG TÌM THẤY', it.lab); continue; }
  await prisma.codeExercise.update({
    where: { id: ex.id },
    data: {
      solutionCodeJson: it.solutionCodeJson,
      solutionExplanationHtml: it.solutionExplanationHtml,
      solutionExplanationHtmlVi: it.solutionExplanationHtmlVi,
      hintsJson: it.hintsJson,
      problemHtmlVi: it.problemHtmlVi,
      ...(it.starterCodeJson ? { starterCodeJson: it.starterCodeJson } : {}),
    },
  });
  console.log(`ok ${it.lab} -> ${it.solutionCodeJson.length} file`);
  ok++;
}
console.log(`[solutions] ${ok}/${items.length}`);
await prisma.$disconnect();
