/**
 * ============================================================
 * Code Lab — the learner's project workspace
 * ============================================================
 *
 * A LAB211 submission is a folder of packages, not a single file. The database
 * always allowed for that — CodeProgress.savedCode is an array of
 * { name, language, code } — but the page only ever read savedCode[0], so a
 * learner who wrote five classes got one of them back.
 *
 * These two functions are the bridge to the IDE the assignment is really done
 * in: export the workspace as a .zip that opens in NetBeans, and import a
 * NetBeans project back as workspace files. Neither touches the database — the
 * page owns the files and saves them through the normal progress endpoint.
 *
 * `name` IS the path inside the project: "model/Student.java". Packages are
 * folders, exactly as javac expects.
 */
import AdmZip from 'adm-zip';
import { BadRequestError } from '../middleware/errorHandler.js';

export interface WorkspaceFile { name: string; language: string; code: string }

const MAX_FILES = 120;
const MAX_FILE_BYTES = 200 * 1024;
const MAX_TOTAL_BYTES = 4 * 1024 * 1024;
const MAX_ENTRIES = 2000;

/** Source we are willing to carry back into the editor. */
const SOURCE_EXT = /\.(java|kt|txt|md|properties|xml|json|csv|sql|gradle)$/i;
/** Never round-trip build output, IDE metadata, or the junk macOS adds to a zip. */
const SKIP = /(^|\/)(target|build|out|bin|dist|\.git|\.idea|\.settings|nbproject|__MACOSX)(\/|$)|(^|\/)\._|(^|\/)\.DS_Store$/;

function langOf(path: string): string {
  const m = path.toLowerCase().match(/\.([a-z0-9]+)$/);
  const ext = m ? m[1] : '';
  return ({ java: 'java', kt: 'kotlin', xml: 'xml', json: 'json', sql: 'sql', md: 'markdown' } as Record<string, string>)[ext] ?? 'text';
}

/**
 * Reject a path that would escape the project when written to disk. The zip is
 * built here rather than read, but the names come from the client, and a name
 * like "../../.bashrc" would escape the moment the student unzips it.
 */
function safeName(raw: string): string {
  const p = String(raw || '').replace(/\\/g, '/').replace(/^\/+/, '').trim();
  if (!p || p.includes('..') || /^[a-zA-Z]:/.test(p)) throw new BadRequestError(`Tên file không hợp lệ: "${raw}"`);
  return p;
}

/** Workspace files → a .zip laid out as a real project folder. */
export function exportWorkspaceZip(files: unknown, projectName = 'project'): Buffer {
  if (!Array.isArray(files) || !files.length) throw new BadRequestError('Chưa có file nào để tải về.');
  if (files.length > MAX_FILES) throw new BadRequestError(`Quá nhiều file (${files.length} > ${MAX_FILES}).`);

  const root = (projectName || 'project').replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'project';
  const zip = new AdmZip();
  let total = 0;
  const seen = new Set<string>();

  for (const f of files as WorkspaceFile[]) {
    const name = safeName(f?.name);
    if (seen.has(name)) throw new BadRequestError(`Hai file trùng đường dẫn: "${name}"`);
    seen.add(name);
    const code = String(f?.code ?? '');
    total += Buffer.byteLength(code, 'utf8');
    if (total > MAX_TOTAL_BYTES) throw new BadRequestError('Project quá lớn để đóng gói.');
    zip.addFile(`${root}/${name}`, Buffer.from(code, 'utf8'));
  }
  return zip.toBuffer();
}

/** A NetBeans project .zip → workspace files, with the project root stripped. */
export function importWorkspaceZip(buffer: Buffer): { files: WorkspaceFile[]; skipped: number } {
  let zip: AdmZip;
  try { zip = new AdmZip(buffer); } catch { throw new BadRequestError('File .zip không hợp lệ hoặc bị hỏng.'); }

  const entries = zip.getEntries().filter((e) => !e.isDirectory);
  if (!entries.length) throw new BadRequestError('File .zip rỗng.');
  if (entries.length > MAX_ENTRIES) throw new BadRequestError('Zip có quá nhiều file — hãy nén riêng phần source.');

  // NetBeans zips wrap everything in one folder, and put the source under src/.
  // Strip both, so `package model;` lines up with a file at model/Student.java —
  // get this wrong and every class looks misplaced to the structure check.
  //
  // Both prefixes are decided from the files we intend to KEEP. Deciding from
  // every entry meant one build/classes/Main.class was enough to make "does it
  // all live under src/?" false, and the whole project imported one level deep.
  const names = entries.map((e) => e.entryName.replace(/\\/g, '/'));
  const commonRoot = (list: string[]): string => {
    const first = list[0]?.split('/')[0];
    return first && list.length > 0 && list.every((n) => n.startsWith(first + '/')) ? first + '/' : '';
  };
  const rootPrefix = commonRoot(names);
  const kept = names
    .filter((n) => !n.includes('..') && !n.startsWith('/'))
    .map((n) => (rootPrefix && n.startsWith(rootPrefix) ? n.slice(rootPrefix.length) : n))
    .filter((n) => n && !SKIP.test(n) && SOURCE_EXT.test(n));
  const srcPrefix = kept.length > 0 && kept.every((n) => n.startsWith('src/')) ? 'src/' : '';

  const files: WorkspaceFile[] = [];
  let skipped = 0;
  let total = 0;

  for (const e of entries) {
    const raw = e.entryName.replace(/\\/g, '/');
    if (raw.includes('..') || raw.startsWith('/')) { skipped++; continue; }
    let path = rootPrefix && raw.startsWith(rootPrefix) ? raw.slice(rootPrefix.length) : raw;
    if (!path || SKIP.test(path) || !SOURCE_EXT.test(path)) { skipped++; continue; }
    if (srcPrefix && path.startsWith(srcPrefix)) path = path.slice(srcPrefix.length);
    if (!path) { skipped++; continue; }
    if (e.header.size > MAX_FILE_BYTES) { skipped++; continue; }

    let code: string;
    try {
      const buf = e.getData();
      // An AppleDouble "._Foo.java" survives the name filter on some archives;
      // it is binary, and pasting it into the editor shows mojibake.
      if (buf.includes(0)) { skipped++; continue; }
      code = buf.toString('utf8');
    } catch { skipped++; continue; }

    total += code.length;
    if (total > MAX_TOTAL_BYTES || files.length >= MAX_FILES) { skipped++; continue; }
    files.push({ name: path, language: langOf(path), code });
  }

  if (!files.length) throw new BadRequestError('Không tìm thấy file source nào trong zip (chỉ nhận .java, .txt, .xml…).');
  files.sort((a, b) => a.name.localeCompare(b.name));
  return { files, skipped };
}
