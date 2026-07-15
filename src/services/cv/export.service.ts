/**
 * CV Builder — export orchestrator (Phase 4).
 * Renders the master profile to a requested format and returns the bytes for a
 * direct download. For PDF it runs a ROUND-TRIP check — re-extracts the text and
 * confirms key fields survive — so we never hand a user a PDF that an ATS reads
 * as blank. Exports are delivered inline (not stored in R2) so CV PII doesn't
 * sit in a bucket; revocable share links are a later phase.
 */
import { extractText, getDocumentProxy } from 'unpdf';
import { getOrCreateProfile } from './profile.service.js';
import { toRenderCv, suggestFilename } from './export/cvData.js';
import { renderPdf } from './export/pdf.js';
import { renderDocx } from './export/docx.js';
import { renderTxt, renderMarkdown } from './export/text.js';
import { renderJsonResume } from './export/jsonResume.js';
import { BadRequestError } from '../../middleware/errorHandler.js';

export type ExportFormat = 'pdf' | 'docx' | 'txt' | 'md' | 'json';
const MIME: Record<ExportFormat, string> = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  txt: 'text/plain; charset=utf-8',
  md: 'text/markdown; charset=utf-8',
  json: 'application/json; charset=utf-8',
};

export interface ExportResult {
  buffer: Buffer;
  mime: string;
  filename: string;
  roundTripOk: boolean | null; // only meaningful for PDF
}

/** Re-extract text from the generated PDF and confirm key fields round-trip. */
async function verifyPdfRoundTrip(buffer: Buffer, name: string, email: string): Promise<boolean> {
  try {
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const { text } = await extractText(pdf, { mergePages: true });
    const hay = String(text).toLowerCase().replace(/\s+/g, ' ');
    const nameToken = name.trim().split(/\s+/).pop()?.toLowerCase() ?? '';
    const emailOk = !email || hay.includes(email.toLowerCase());
    const nameOk = !nameToken || hay.includes(nameToken);
    return emailOk && nameOk;
  } catch {
    return false;
  }
}

export async function exportProfile(userId: number, format: ExportFormat): Promise<ExportResult> {
  if (!(format in MIME)) throw new BadRequestError('Định dạng không hỗ trợ');
  const profile = await getOrCreateProfile(userId);
  const cv = toRenderCv(profile);
  const ext = format === 'md' ? 'md' : format;
  const filename = suggestFilename(cv, ext);

  let buffer: Buffer;
  let roundTripOk: boolean | null = null;

  switch (format) {
    case 'pdf': {
      buffer = await renderPdf(cv);
      roundTripOk = await verifyPdfRoundTrip(buffer, cv.fullName, cv.email);
      if (!roundTripOk) {
        // Do not hand out a PDF ATS can't read. This should not happen with
        // pdfkit's real-text output — if it does, it's a template bug.
        throw new BadRequestError('PDF sinh ra không đọc lại được text (round-trip fail) — không xuất để tránh CV bị ATS đọc trắng.');
      }
      break;
    }
    case 'docx':
      buffer = await renderDocx(cv);
      break;
    case 'txt':
      buffer = Buffer.from(renderTxt(cv), 'utf8');
      break;
    case 'md':
      buffer = Buffer.from(renderMarkdown(cv), 'utf8');
      break;
    case 'json':
      buffer = Buffer.from(JSON.stringify(renderJsonResume(profile), null, 2), 'utf8');
      break;
    default:
      throw new BadRequestError('Định dạng không hỗ trợ');
  }

  return { buffer, mime: MIME[format], filename, roundTripOk };
}
