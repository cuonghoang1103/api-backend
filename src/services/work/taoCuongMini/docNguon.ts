/**
 * "Create with CuongMini" — đọc NGUỒN người dùng đưa: tệp tải lên (PDF, DOCX, XLSX, PPTX, MD/TXT/CSV/JSON/SQL/mã, ZIP mã
 * nguồn, ảnh), link (Google Docs/Sheets/Slides/Drive, Figma, Notion…), repo GitHub/GitLab công khai.
 * Tái dùng bộ rút chữ có sẵn: cv/extract (PDF/DOCX), chatFileText (XLSX/PPTX), interview/projectZip (ZIP mã),
 * linkNgoai (link Google…), gitSource (repo, KHÔNG token), docTools/vision (ảnh — đọc chữ trong ảnh, có trần token).
 * Không ném lỗi cho từng nguồn: kết quả mang `status` để giao diện hiện "đọc được / trống / riêng tư / lỗi".
 */

import { logger } from '../../../utils/logger.js';
import { CAP } from './kieu.js';
import { detectStack, parseRepoUrl, REPO_KEY_FILES } from './lienKet.js';

export interface DocKetQua { text: string; status: 'OK' | 'EMPTY' | 'ERROR' | 'PRIVATE'; error?: string; title?: string; stack?: string[] }

const TEXT_EXT = /\.(txt|md|markdown|csv|tsv|json|sql|xml|ya?ml|html?|java|jsp|kt|ts|tsx|js|jsx|py|cs|php|go|rb|rs|c|cpp|h|hpp|swift|dart|vue|svelte|css|scss|ini|env\.example|properties|gradle|toml|sh|bat|ps1|puml|mmd|dbml)$/i;
const IMG_EXT = /\.(png|jpe?g|webp|gif|heic|heif)$/i;
const clip = (s: string) => (s.length > CAP.sourceChars ? `${s.slice(0, CAP.sourceChars)}\n…[truncated]` : s);

/** Đuôi tệp có đọc được không (giao diện kiểm trước khi tải). */
export function supportedFile(name: string): boolean {
  return /\.(pdf|docx|xlsx|xlsm|pptx|zip)$/i.test(name) || TEXT_EXT.test(name) || IMG_EXT.test(name);
}

export async function extractUpload(buf: Buffer, name: string, mime: string, o: { userId: number; ocrImages?: boolean }): Promise<DocKetQua> {
  const lower = name.toLowerCase();
  try {
    if (lower.endsWith('.pdf') || mime === 'application/pdf') {
      const { extractPdf } = await import('../../cv/extract.service.js');
      const r = await extractPdf(buf);
      if (r.imageOnly || !r.text.trim()) return { text: '', status: 'EMPTY', error: 'This PDF looks scanned (no text layer). Paste the important parts as text, or upload page images.' };
      return { text: clip(r.text), status: 'OK' };
    }
    if (lower.endsWith('.docx')) {
      const { extractDocx } = await import('../../cv/extract.service.js');
      const r = await extractDocx(buf);
      return r.text.trim() ? { text: clip(r.text), status: 'OK' } : { text: '', status: 'EMPTY', error: 'No text found in this document' };
    }
    if (lower.endsWith('.xlsx') || lower.endsWith('.xlsm')) {
      const { extractXlsx } = await import('../../chatFileText.js');
      const r = await extractXlsx(buf);
      return r.text.trim() ? { text: clip(r.text), status: 'OK' } : { text: '', status: 'EMPTY', error: 'The spreadsheet is empty' };
    }
    if (lower.endsWith('.pptx')) {
      const { extractPptx } = await import('../../chatFileText.js');
      const r = await extractPptx(buf);
      return r.text.trim() ? { text: clip(r.text), status: 'OK' } : { text: '', status: 'EMPTY', error: 'No text found in the slides' };
    }
    if (lower.endsWith('.zip')) {
      const { buildProjectDigest } = await import('../../interview/projectZip.service.js');
      const r = buildProjectDigest(buf, name);
      const tree = r.stats.tree.slice(0, 400);
      const stack = detectStack(tree, {});
      const head = `Files (${r.stats.filesIncluded} read, ${r.stats.filesSkipped} skipped${r.stats.truncated ? ', truncated' : ''}):\n${tree.join('\n')}`;
      return { text: clip(`${head}\n\n${r.digest}`), status: r.digest.trim() ? 'OK' : 'EMPTY', stack };
    }
    if (TEXT_EXT.test(lower) || mime.startsWith('text/') || mime === 'application/json') {
      const t = buf.toString('utf8').replace(/^﻿/, '');
      if (t.includes('\u0000')) return { text: '', status: 'ERROR', error: 'This file is not text' };
      return t.trim() ? { text: clip(t), status: 'OK' } : { text: '', status: 'EMPTY', error: 'The file is empty' };
    }
    if (IMG_EXT.test(lower) || mime.startsWith('image/')) {
      if (!o.ocrImages) return { text: '', status: 'EMPTY', error: 'Images are attached to the project but not read' };
      return await readImage(buf, o.userId);
    }
    return { text: '', status: 'ERROR', error: 'Unsupported file type — use PDF, DOCX, XLSX, PPTX, ZIP, images or text files' };
  } catch (e) {
    logger.warn('[tao-cuongmini] không đọc được tệp', { name, error: (e as Error).message });
    return { text: '', status: 'ERROR', error: (e as Error).message?.slice(0, 200) || 'Could not read this file' };
  }
}

/** Ảnh đề bài / ảnh chụp bảng: thu nhỏ rồi nhờ model nhìn ảnh chép chữ (trần token nhỏ). */
async function readImage(buf: Buffer, userId: number): Promise<DocKetQua> {
  try {
    const { default: sharp } = await import('sharp');
    const small = await sharp(buf).rotate().resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 82 }).toBuffer();
    const { visionComplete } = await import('../../docTools/vision.js');
    const r = await visionComplete({
      system: 'Transcribe ALL readable text in this image faithfully (keep Vietnamese diacritics, tables as Markdown). If it is a diagram/UI mockup, describe its structure briefly. No commentary.',
      userText: 'Transcribe this image.', images: [{ data: small.toString('base64'), mediaType: 'image/jpeg' }],
      maxTokens: 2500, userId, purpose: 'doc_ocr', feature: 'work', timeoutMs: 90_000, maxRetries: 1,
    });
    return r.text.trim() ? { text: clip(r.text), status: 'OK' } : { text: '', status: 'EMPTY', error: 'No text found in the image' };
  } catch (e) {
    return { text: '', status: 'EMPTY', error: `The image is attached but could not be read (${(e as Error).message?.slice(0, 120)})` };
  }
}

/** Link (Google Docs/Sheets/Slides/Drive, Figma, Notion, GitHub…) ⇒ chữ. Link web thường: chỉ lưu, không tải. */
export async function readLink(url: string): Promise<DocKetQua> {
  const { nhanDienLink } = await import('../../linkNgoai/nhanDien.js');
  const l = nhanDienLink(url);
  if (!l) return { text: '', status: 'OK', error: undefined, title: undefined };
  const { docLinkNgoai } = await import('../../linkNgoai/docLink.js');
  const r = await docLinkNgoai(l, { tranChu: CAP.sourceChars });
  if (r.trangThai === 'ok') return { text: clip(r.chu), status: r.chu.trim() ? 'OK' : 'EMPTY', title: r.tieuDe };
  if (r.trangThai === 'rieng_tu') return { text: '', status: 'PRIVATE', error: 'This link is not public. Share it as “Anyone with the link can view”, or upload the file instead.' };
  if (r.trangThai === 'goi_y') return { text: '', status: 'EMPTY', error: r.chu.slice(0, 300) || 'This link cannot be read automatically — upload the file instead.' };
  return { text: '', status: 'ERROR', error: r.chu.slice(0, 300) || 'Could not open this link' };
}

/**
 * Repo công khai ⇒ mô tả + cây thư mục 2 tầng + tệp chính (README, package.json, pom.xml…). Không token: dùng chung trần
 * 60 lượt/giờ của GitHub ⇒ tối đa ~14 lời gọi một lần đọc (gitSource tự đệm).
 */
export async function readRepo(url: string, branch?: string | null): Promise<DocKetQua> {
  const link = parseRepoUrl(url, branch);
  if (!link) return { text: '', status: 'ERROR', error: 'Not a GitHub or GitLab repository link' };
  const git = await import('../gitSource.js');
  let apiBase = link.apiBase;
  if (link.provider === 'GITLAB') {
    const safe = git.safeGitlabBase(link.webBase);
    if (!safe) return { text: '', status: 'ERROR', error: 'This GitLab address is not allowed' };
    apiBase = `${safe}/api/v4`;
  }
  const t = { provider: link.provider, repo: link.repo, apiBase, webBase: link.webBase, token: null, projectId: 0 };
  try {
    const meta = await git.repoMeta(t);
    if (meta.private) return { text: '', status: 'PRIVATE', error: 'This repository is private — make it public or connect it later in the project Code page.' };
    const ref = link.branch || meta.defaultBranch;
    const root = await git.tree(t, ref, '');
    const lines: string[] = root.map((e) => `${e.type === 'dir' ? '📁' : '·'} ${e.path}`);
    const dirs = root.filter((e) => e.type === 'dir' && !/^(\.|node_modules|dist|build|target|vendor|out|coverage)/.test(e.name)).slice(0, 6);
    for (const d of dirs) {
      try {
        const sub = await git.tree(t, ref, d.path);
        for (const e of sub.slice(0, 40)) lines.push(`  ${e.type === 'dir' ? '📁' : '·'} ${e.path}`);
      } catch { /* bỏ thư mục lỗi */ }
    }
    const files: Record<string, string> = {};
    const names = root.filter((e) => e.type === 'file').map((e) => e.name);
    const want = REPO_KEY_FILES.flatMap((f) => (f.startsWith('*') ? names.filter((n) => n.endsWith(f.slice(1))) : names.includes(f) ? [f] : [])).slice(0, 6);
    for (const f of want) {
      try {
        const b = await git.blob(t, ref, f);
        if (b.content) files[f] = b.content.slice(0, 12_000);
      } catch { /* bỏ */ }
    }
    const stack = detectStack(lines.map((l) => l.replace(/^[\s📁·]+/u, '')), files);
    const text = [
      `Repository: ${meta.webUrl} (branch ${ref})`,
      meta.description ? `Description: ${meta.description}` : '',
      stack.length ? `Detected stack: ${stack.join(', ')}` : '',
      `Tree:\n${lines.slice(0, 300).join('\n')}`,
      ...Object.entries(files).map(([k, v]) => `--- ${k} ---\n${v}`),
    ].filter(Boolean).join('\n\n');
    return { text: clip(text), status: 'OK', title: link.repo, stack };
  } catch (e) {
    const code = (e as { code?: string }).code;
    if (code === 'WORK_GIT_PRIVATE' || code === 'WORK_GIT_NOT_FOUND') return { text: '', status: 'PRIVATE', error: 'Repository not found or private. Check the link, or make it public.' };
    if (code === 'WORK_GIT_RATE_LIMIT') return { text: '', status: 'ERROR', error: 'GitHub is rate-limiting reads right now — try again in a few minutes.' };
    return { text: '', status: 'ERROR', error: (e as Error).message?.slice(0, 200) || 'Could not read the repository' };
  }
}
