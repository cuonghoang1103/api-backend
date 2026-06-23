// ──────────────────────────────────────────────────────────
// Client-side PDF export for a project case study
// ──────────────────────────────────────────────────────────
//
// We use jspdf to render the title, description, milestones,
// features, resources, and a plain-text rendering of the
// case-study body. We intentionally skip the HTML body and
// convert bodyMdx to a simple line-by-line text — jspdf
// doesn't ship a full HTML renderer, and pulling in html2canvas
// for a single page would balloon the bundle.
//
// The export is wrapped in a try/catch and a setTimeout to
// avoid blocking the UI: PDF generation runs synchronously
// inside jspdf, so the button briefly shows a "Đang tạo…"
// state before the file is downloaded.
//
// ─── Font: Vietnamese support ────────────────────────────────
//
// jspdf's built-in fonts (Helvetica, Times, Courier) only
// cover Latin-1, so a case study with diacritics like
// "Vấn đề" or "Giải pháp" would render as garbage. We
// embed a subset of Noto Sans (45KB on disk) that covers
// ASCII + Latin Extended A/B + common currency symbols,
// which is enough for Vietnamese case studies. The font
// is registered on first export and cached for subsequent
// calls in the same session.

'use client';

import { useState } from 'react';
import jsPDF from 'jspdf';
import { FileDown, Loader2 } from 'lucide-react';
import type { Project } from '@/types';
import { NOTO_SANS_VI_BASE64 } from '@/lib/fonts/notoSansVi';

interface Props {
 project: Project;
}

const labelStatus = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();

// ─── Font registration cache ─────────────────────────────────
// jspdf's `addFileToVFS` + `addFont` is somewhat expensive
// (it decodes the base64 and parses the TTF tables) so we
// do it once per session and reuse the registered name
// afterwards. Subsequent exports skip registration entirely.
let VI_FONT_REGISTERED = false;
const VI_FONT_NAME = 'NotoSansVI';

function ensureVietnameseFont(doc: jsPDF): string {
 if (!VI_FONT_REGISTERED) {
 doc.addFileToVFS(VI_FONT_NAME + '.ttf', NOTO_SANS_VI_BASE64);
 // Register the same TTF under three style aliases
 // (normal, bold, italic). jspdf picks the style-specific
 // font when setFont is called, but since we only ship
 // Regular weight, all three render identically. The point
 // is that setFont(VI, 'bold') no longer falls back to
 // Helvetica, which would corrupt diacritics.
 doc.addFont(VI_FONT_NAME + '.ttf', VI_FONT_NAME, 'normal');
 doc.addFont(VI_FONT_NAME + '.ttf', VI_FONT_NAME, 'bold');
 doc.addFont(VI_FONT_NAME + '.ttf', VI_FONT_NAME, 'italic');
 VI_FONT_REGISTERED = true;
 }
 return VI_FONT_NAME;
}

/**
 * Convert markdown to a list of printable lines.
 * We strip most inline syntax (links, bold, italic, code)
 * and only honor block-level constructs we can render
 * with jspdf's text API: headings, paragraphs, lists,
 * blockquotes, and code blocks (rendered as monospace).
 *
 * This is intentionally simple — we want the PDF to be a
 * readable offline copy, not a pixel-perfect replica of
 * the web page.
 */
function markdownToLines(md: string): { text: string; style: 'h1' | 'h2' | 'h3' | 'p' | 'li' | 'quote' | 'code' }[] {
 const lines: { text: string; style: 'h1' | 'h2' | 'h3' | 'p' | 'li' | 'quote' | 'code' }[] = [];
 const blocks = md.split(/\n{2,}/);

 for (const raw of blocks) {
 const block = raw.trim();
 if (!block) continue;

 // Fenced code block
 const fence = block.match(/^```([a-z0-9_-]*)\n([\s\S]*?)\n?```$/i);
 if (fence) {
 for (const line of fence[2].split('\n')) {
 lines.push({ text: line || ' ', style: 'code' });
 }
 lines.push({ text: ' ', style: 'p' });
 continue;
 }

 // Heading
 const h = block.match(/^(#{1,6})\s+(.*)$/);
 if (h) {
 const level = h[1].length;
 lines.push({ text: h[2], style: level <= 1 ? 'h1' : level === 2 ? 'h2' : 'h3' });
 continue;
 }

 // List item(s) — one block may contain a sequence
 if (/^[-*]\s+/.test(block)) {
 for (const item of block.split('\n').filter(Boolean)) {
 const m = item.match(/^[-*]\s+(.*)$/);
 if (m) lines.push({ text: '• ' + stripInline(m[1]), style: 'li' });
 }
 continue;
 }

 // Blockquote
 if (block.startsWith('>')) {
 const q = block.split('\n').map((l) => l.replace(/^>\s?/, '')).join(' ');
 lines.push({ text: '“' + stripInline(q) + '”', style: 'quote' });
 continue;
 }

 // Default: paragraph
 lines.push({ text: stripInline(block), style: 'p' });
 }

 return lines;
}

/**
 * Strip inline markdown syntax (bold, italic, inline code,
 * links). We replace link `[text](url)` with just `text` —
 * URLs in a printed PDF are noise unless they're primary
 * content.
 */
function stripInline(s: string): string {
 return s
 .replace(/`([^`]+)`/g, '$1')
 .replace(/\*\*([^*]+)\*\*/g, '$1')
 .replace(/\*([^*]+)\*/g, '$1')
 .replace(/_([^_]+)_/g, '$1')
 .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');
}

export default function ProjectPdfExport({ project }: Props) {
 const [busy, setBusy] = useState(false);
 const [error, setError] = useState<string | null>(null);

 const handleExport = async () => {
 setBusy(true);
 setError(null);

 // Defer to next tick so the busy state renders first.
 await new Promise((r) => setTimeout(r, 50));

 try {
 const doc = new jsPDF({ unit: 'mm', format: 'a4' });
 // Register the Vietnamese-capable font BEFORE any text
 // is drawn. The font is reused for the entire document
 // (title, description, body, footer) so the Vietnamese
 // diacritics render correctly throughout.
 const FONT = ensureVietnameseFont(doc);
 doc.setFont(FONT, 'normal');

 const pageWidth = doc.internal.pageSize.getWidth();
 const pageHeight = doc.internal.pageSize.getHeight();
 const margin = 15;
 const contentWidth = pageWidth - margin * 2;
 let y = margin;

 // ── Title ─────────────────────────────────────────────
 doc.setFont(FONT, 'bold');
 doc.setFontSize(20);
 const titleLines = doc.splitTextToSize(project.title, contentWidth);
 doc.text(titleLines, margin, y);
 y += titleLines.length * 8 + 2;

 // ── Description ───────────────────────────────────────
 if (project.description) {
 doc.setFont(FONT, 'normal');
 doc.setFontSize(11);
 doc.setTextColor(80);
 const descLines = doc.splitTextToSize(project.description, contentWidth);
 doc.text(descLines, margin, y);
 y += descLines.length * 5 + 4;
 doc.setTextColor(0);
 }

 // ── Meta line ─────────────────────────────────────────
 doc.setFont(FONT, 'italic');
 doc.setFontSize(9);
 doc.setTextColor(120);
 const metaBits: string[] = [];
 if (project.category) metaBits.push(project.category);
 if (project.difficulty) metaBits.push(labelStatus(project.difficulty));
 if (project.role) metaBits.push(project.role);
 if (project.startDate && project.endDate) {
 metaBits.push(`${project.startDate} → ${project.endDate}`);
 }
 if (metaBits.length) {
 doc.text(metaBits.join(' · '), margin, y);
 y += 6;
 }
 doc.setTextColor(0);

 // ── Milestones ────────────────────────────────────────
 if (project.milestones && project.milestones.length) {
 y += 4;
 doc.setFont(FONT, 'bold');
 doc.setFontSize(13);
 doc.text('Milestones', margin, y);
 y += 6;

 doc.setFont(FONT, 'normal');
 doc.setFontSize(10);
 for (const m of project.milestones) {
 y = checkPage(doc, y, pageHeight, margin);
 doc.setFont(FONT, 'bold');
 const head = `${m.title}${m.phase ? ` — ${m.phase}` : ''}${m.date ? ` (${m.date})` : ''}`;
 doc.text(doc.splitTextToSize(head, contentWidth), margin, y);
 y += 5;
 doc.setFont(FONT, 'normal');
 if (m.description) {
 const dl = doc.splitTextToSize(m.description, contentWidth - 4);
 doc.text(dl, margin + 4, y);
 y += dl.length * 4.5 + 2;
 }
 y += 1;
 }
 }

 // ── Features ──────────────────────────────────────────
 if (project.features && project.features.length) {
 y += 4;
 y = checkPage(doc, y, pageHeight, margin);
 doc.setFont(FONT, 'bold');
 doc.setFontSize(13);
 doc.text('Features', margin, y);
 y += 6;

 doc.setFont(FONT, 'normal');
 doc.setFontSize(10);
 for (const f of project.features) {
 y = checkPage(doc, y, pageHeight, margin);
 const status = f.status ? ` [${labelStatus(f.status)}]` : '';
 const text = `• ${f.title}${status}${f.description ? ' — ' + f.description : ''}`;
 const tl = doc.splitTextToSize(text, contentWidth);
 doc.text(tl, margin, y);
 y += tl.length * 4.5 + 1;
 }
 }

 // ── Resources ─────────────────────────────────────────
 if (project.resources && project.resources.length) {
 y += 4;
 y = checkPage(doc, y, pageHeight, margin);
 doc.setFont(FONT, 'bold');
 doc.setFontSize(13);
 doc.text('Resources', margin, y);
 y += 6;

 doc.setFont(FONT, 'normal');
 doc.setFontSize(10);
 for (const r of project.resources) {
 y = checkPage(doc, y, pageHeight, margin);
 const type = r.type ? `[${r.type}] ` : '';
 const text = `• ${type}${r.title}${r.url ? ` — ${r.url}` : ''}${r.description ? ' (' + r.description + ')' : ''}`;
 const tl = doc.splitTextToSize(text, contentWidth);
 doc.text(tl, margin, y);
 y += tl.length * 4.5 + 1;
 }
 }

 // ── Body (plain-text rendering of markdown) ───────────
 if (project.bodyMdx && project.bodyMdx.trim()) {
 y += 6;
 y = checkPage(doc, y, pageHeight, margin);
 doc.setFont(FONT, 'bold');
 doc.setFontSize(14);
 doc.text('Case study', margin, y);
 y += 7;

 const blocks = markdownToLines(project.bodyMdx);
 doc.setFontSize(10);
 for (const b of blocks) {
 // Style switch
 if (b.style === 'h1') { doc.setFont(FONT, 'bold'); doc.setFontSize(15); }
 else if (b.style === 'h2') { doc.setFont(FONT, 'bold'); doc.setFontSize(13); }
 else if (b.style === 'h3') { doc.setFont(FONT, 'bold'); doc.setFontSize(11); }
 else if (b.style === 'quote') { doc.setFont(FONT, 'italic'); doc.setTextColor(80); }
 else if (b.style === 'code') { doc.setFont(FONT, 'normal'); doc.setFontSize(9); doc.setTextColor(60); }
 else if (b.style === 'li') { doc.setFont(FONT, 'normal'); doc.setTextColor(0); }
 else { doc.setFont(FONT, 'normal'); doc.setTextColor(0); }

 const tl = doc.splitTextToSize(b.text, contentWidth);
 for (const line of tl) {
 y = checkPage(doc, y, pageHeight, margin);
 doc.text(line, margin, y);
 y += b.style === 'h1' ? 8 : b.style === 'h2' ? 7 : b.style === 'h3' ? 6 : 5;
 }
 y += 2;
 // Reset color after quote/code
 if (b.style === 'quote' || b.style === 'code') doc.setTextColor(0);
 }
 }

 // ── Footer on every page ──────────────────────────────
 const pageCount = doc.getNumberOfPages();
 for (let i = 1; i <= pageCount; i++) {
 doc.setPage(i);
 doc.setFont(FONT, 'italic');
 doc.setFontSize(8);
 doc.setTextColor(150);
 doc.text(
 `${project.title} — generated ${new Date().toLocaleDateString('vi-VN')} — page ${i}/${pageCount}`,
 margin,
 pageHeight - 8,
 );
 doc.setTextColor(0);
 }

 const filename = `${project.slug}-case-study.pdf`;
 doc.save(filename);
 } catch (e) {
 setError(e instanceof Error ? e.message : 'PDF export failed');
 } finally {
 setBusy(false);
 }
 };

 return (
 <button
 type="button"
 onClick={handleExport}
 disabled={busy}
 title={error ?? 'Tải PDF case study'}
 className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition hover:border-violet-500/50 hover:bg-white/10 disabled:opacity-50"
 >
 {busy ? (
 <>
 <Loader2 className="h-4 w-4 animate-spin" />
 Đang tạo…
 </>
 ) : (
 <>
 <FileDown className="h-4 w-4" />
 Tải PDF
 </>
 )}
 </button>
 );
}

/**
 * Add a new page when the next line would overflow the
 * bottom margin. Returns the new y (which is the top
 * margin if a new page was started).
 */
function checkPage(doc: jsPDF, y: number, pageHeight: number, margin: number): number {
 if (y > pageHeight - margin - 5) {
 doc.addPage();
 return margin;
 }
 return y;
}
