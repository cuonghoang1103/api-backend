/**
 * CT Work — dm5 G2 (27/11/2026) B18: PlantUML — phần có DB (thuần ở plantuml.ts).
 *   renderSource   bản nháp đang gõ ⇒ SVG (xem trước trong Diagram Studio, chưa lưu)
 *   renderDiagram  sơ đồ D-n (phiên bản hiện tại hoặc ?v=) ⇒ SVG
 *   importFromRepo tệp .puml / .mmd / .sql / .drawio trong repo đã nối ⇒ sơ đồ mới (đúng đường importDiagram)
 * Quyền: như Diagram Studio (diagramCtx) — đội dự án + giảng viên đọc; nhập = quyền sửa.
 */

import { prisma } from '../../config/database.js';
import { AppError, BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';
import { repoFor } from './diagramRepo.js';
import { PlantUmlUnavailable, renderPlantUml } from './plantuml.js';

async function render(source: string): Promise<string> {
  try {
    return await renderPlantUml(source);
  } catch (err) {
    if (err instanceof PlantUmlUnavailable) throw new AppError(err.message, 503, 'WORK_PLANTUML_UNAVAILABLE');
    throw new AppError(`The PlantUML renderer did not answer (${(err as Error).message})`, 502, 'WORK_PLANTUML_FAILED');
  }
}

export async function renderSource(userId: number, projectId: number, source: string) {
  const { diagramCtx } = await import('./diagrams.service.js');
  await diagramCtx(userId, projectId, 'view');
  const { lintPlantUml } = await import('./plantuml.js');
  const bad = lintPlantUml(source).errors.find((e) => /not allowed/.test(e.message));
  if (bad) throw new BadRequestError(`Line ${bad.line}: ${bad.message}`, 'WORK_DIAGRAM_BAD_SOURCE');
  return render(source);
}

export async function renderDiagram(userId: number, projectId: number, number: number, version?: number) {
  const { diagramCtx } = await import('./diagrams.service.js');
  await diagramCtx(userId, projectId, 'view');
  const d = await prisma.workDiagram.findFirst({ where: { projectId, number, deletedAt: null }, select: { id: true, format: true, currentVersion: true } });
  if (!d) throw new NotFoundError('Diagram not found');
  if (d.format !== 'PLANTUML') throw new BadRequestError('This diagram is not PlantUML', 'WORK_DIAGRAM_BAD_SOURCE');
  const v = await prisma.workDiagramVersion.findFirst({ where: { diagramId: d.id, number: version ?? d.currentVersion }, select: { source: true } });
  if (!v) throw new NotFoundError('Version not found');
  return render(v.source);
}

export async function importFromRepo(userId: number, projectId: number, input: { path: string; title?: string | null; to?: 'mermaid' | 'native' }) {
  const { importDiagram } = await import('./diagrams.service.js');
  const { handle, error } = await repoFor(projectId);
  if (!handle) throw new BadRequestError(error ?? 'No repository connected', 'WORK_NO_REPO');
  const path = input.path.replace(/^\/+/, '');
  if (!handle.paths.includes(path)) throw new NotFoundError(`${path} is not in ${handle.repo}@${handle.branch}`);
  const text = await handle.read(path);
  if (text === null) throw new NotFoundError(`Could not read ${path}`);
  return importDiagram(userId, projectId, { fileName: path, content: text, title: input.title ?? null, to: input.to });
}
