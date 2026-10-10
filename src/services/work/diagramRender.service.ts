/**
 * CT Work đợt 8c (12/10/2026) — ẢNH SƠ ĐỒ MERMAID VẼ SẴN (SVG + PNG) cho API/MCP và xuất Docs — phần có DB.
 * Lý do + luật làm sạch ở diagramRender.ts.
 *
 *   POST /projects/:pid/diagram-renders                 { source, svg?, png? }  — trình duyệt thành viên gửi sau khi vẽ
 *   GET  /projects/:pid/diagrams/:n/image.(svg|png)?version=  — ảnh của phiên bản (mặc định: bản đã duyệt, không thì bản hiện tại)
 *
 * Tra ảnh theo MÃ BĂM nguồn, XUYÊN dự án: ảnh chỉ là hình vẽ của chính đoạn nguồn người gọi đã có trong tay ⇒ không lộ gì
 * (và cùng một sơ đồ mẫu trong nhiều dự án chỉ cần vẽ một lần). Ghi thì theo dự án (ai vẽ, dự án nào) để dọn được.
 * Xuất Docs: `registerMermaidResolver` ⇒ khối ```mermaid nào client không gửi ảnh thì lấy ảnh vẽ sẵn (docExport.fillMermaid).
 */

import sharp from 'sharp';
import { prisma } from '../../config/database.js';
import { AppError, BadRequestError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { registerMermaidResolver, type ExportImage } from './docExport.js';
import { decodePng, krokiUrl, MAX_PNG_BYTES, normalizeMermaid, renderHash, sanitizeSvg } from './diagramRender.js';
import { isClientScoped, requireProject } from './permissions.js';

const MAX_SOURCE = 60_000;

/** Ảnh đã có theo nguồn (mọi dự án). */
async function findRender(source: string) {
  return prisma.workDiagramRender.findFirst({ where: { hash: renderHash(source) }, orderBy: { id: 'desc' }, select: { svg: true, png: true, width: true, height: true } });
}

/** Kroki tự dựng (CTW_MERMAID_RENDER_URL) — chỉ khi người vận hành bật; không đặt ⇒ null, KHÔNG gửi nguồn đi đâu. */
async function fromKroki(source: string, format: 'svg' | 'png'): Promise<Buffer | null> {
  const base = process.env.CTW_MERMAID_RENDER_URL?.trim();
  if (!base) return null;
  const url = krokiUrl(base, format);
  if (!url) return null;
  try {
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: normalizeMermaid(source), signal: AbortSignal.timeout(15_000), redirect: 'error' });
    if (!r.ok) return null;
    const buf = Buffer.from(await r.arrayBuffer());
    return buf.length && buf.length <= MAX_PNG_BYTES ? buf : null;
  } catch (err) {
    logger.warn('[work] Kroki vẽ Mermaid lỗi', { err: (err as Error).message });
    return null;
  }
}

async function pngMeta(buf: Buffer): Promise<{ width: number; height: number } | null> {
  try {
    const m = await sharp(buf).metadata();
    return m.format === 'png' && m.width && m.height ? { width: m.width, height: m.height } : null;
  } catch { return null; }
}

export async function putRender(userId: number, projectId: number, input: { source: string; svg?: string | null; png?: string | null }) {
  const access = await requireProject(userId, projectId, 'project.view');
  if (isClientScoped(access)) throw new ForbiddenError('Only the project team can store diagram images');
  const source = normalizeMermaid(input.source);
  if (!source || source.length > MAX_SOURCE) throw new BadRequestError('The diagram source is empty or too long', 'VALIDATION_ERROR');
  const svg = input.svg ? sanitizeSvg(input.svg) : null;
  if (input.svg && !svg) throw new BadRequestError('That is not a valid SVG image (max 2 MB)', 'WORK_DIAGRAM_BAD_IMAGE');
  const png = input.png ? decodePng(input.png) : null;
  if (input.png && !png) throw new BadRequestError('That is not a PNG image (max 4 MB)', 'WORK_DIAGRAM_BAD_IMAGE');
  const meta = png ? await pngMeta(png) : null;
  if (png && !meta) throw new BadRequestError('That is not a PNG image', 'WORK_DIAGRAM_BAD_IMAGE');
  if (!svg && !png) throw new BadRequestError('Send the SVG and/or PNG drawing', 'VALIDATION_ERROR');
  const hash = renderHash(source);
  await prisma.workDiagramRender.upsert({
    where: { projectId_hash: { projectId, hash } },
    create: { projectId, hash, svg, png: png ?? undefined, width: meta?.width ?? null, height: meta?.height ?? null, createdById: userId },
    // Giữ phần đã có nếu lần này chỉ gửi một định dạng.
    update: { ...(svg ? { svg } : {}), ...(png ? { png, width: meta!.width, height: meta!.height } : {}) },
  });
  return { hash, svg: !!svg, png: !!png };
}

/** Trạng thái ảnh của một nguồn (cho MCP/API: đã có ảnh chưa). */
export async function renderStatus(source: string): Promise<{ svg: boolean; png: boolean; hash: string }> {
  const r = await findRender(source);
  return { svg: !!r?.svg, png: !!r?.png, hash: renderHash(source) };
}

/** Ảnh của một sơ đồ D-n (Mermaid). Không có ảnh vẽ sẵn (và không có Kroki) ⇒ 404 có hướng dẫn. */
export async function diagramImage(userId: number, projectId: number, number: number, format: 'svg' | 'png', version?: number) {
  const access = await requireProject(userId, projectId, 'project.view');
  if (isClientScoped(access)) throw new NotFoundError('Diagram not found');
  const d = await prisma.workDiagram.findFirst({ where: { projectId, number, deletedAt: null }, select: { id: true, format: true, currentVersion: true, approvedVersion: true, title: true } });
  if (!d) throw new NotFoundError('Diagram not found');
  if (d.format !== 'MERMAID') throw new BadRequestError('Only Mermaid diagrams have server images — export whiteboards from Diagram Studio', 'WORK_DIAGRAM_NOT_MERMAID');
  const v = await prisma.workDiagramVersion.findFirst({ where: { diagramId: d.id, number: version ?? d.approvedVersion ?? d.currentVersion }, select: { number: true, source: true } });
  if (!v) throw new NotFoundError('Diagram version not found');
  const r = await findRender(v.source);
  let body: Buffer | null = format === 'svg' ? (r?.svg ? Buffer.from(r.svg, 'utf8') : null) : (r?.png ? Buffer.from(r.png) : null);
  if (!body) {
    body = await fromKroki(v.source, format);
    if (body && format === 'svg') {
      const clean = sanitizeSvg(body.toString('utf8'));
      body = clean ? Buffer.from(clean, 'utf8') : null;
    }
  }
  if (!body) {
    throw new AppError('This diagram version has not been drawn yet — open it once in CT Work (Diagram Studio) and the image is stored automatically', 404, 'WORK_DIAGRAM_NOT_RENDERED', { hash: renderHash(v.source), version: v.number });
  }
  const safe = d.title.replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '_').slice(0, 60) || 'diagram';
  return { body, mime: format === 'svg' ? 'image/svg+xml' : 'image/png', file: `D-${number}_v${v.number}_${safe}.${format}` };
}

/** Bộ tra cho xuất Docs (docExport.fillMermaid). */
export async function mermaidPng(source: string): Promise<ExportImage | null> {
  const r = await findRender(source);
  let buf: Buffer | null = r?.png ? Buffer.from(r.png) : null;
  let meta = r?.png && r.width && r.height ? { width: r.width, height: r.height } : null;
  if (!buf) {
    buf = await fromKroki(source, 'png');
    meta = buf ? await pngMeta(buf) : null;
  }
  if (!buf || !meta) return null;
  return { buffer: buf, type: 'png', width: meta.width, height: meta.height };
}

registerMermaidResolver(mermaidPng);
