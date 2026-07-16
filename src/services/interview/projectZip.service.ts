/**
 * projectZip.service.ts — turn an uploaded project .zip into a Markdown digest
 * that feeds the EXISTING project-interview pipeline (generateProjectQuestions
 * caps its input at 100k chars — the digest is built to fit under that).
 *
 * Design goals:
 *  - SMALL foundational projects (a folder of .java / .html+.css+.js exercises,
 *    no README/manifest) work first-class: few files → include EVERYTHING, so
 *    the interviewer can review the actual code line by line.
 *  - Large real projects get smart selection: manifests, README, schema, entry
 *    points, routes/services first; junk (node_modules, dist, binaries,
 *    lockfiles) never wastes budget.
 *  - Deterministic, zero LLM cost. Nothing is persisted — the digest goes into
 *    the session config exactly like a hand-written .md.
 *
 * Safety: zip-slip entries are skipped, decompression is capped (entries,
 * per-file and total bytes) to neutralise zip bombs, binary files are dropped.
 */
import AdmZip from 'adm-zip';
import { BadRequestError } from '../../middleware/errorHandler.js';

const MAX_ENTRIES = 4000;               // zip-bomb guard: entry count
const MAX_TOTAL_UNCOMPRESSED = 80 * 1024 * 1024; // zip-bomb guard: total bytes we'll even LOOK at
const MAX_FILE_BYTES = 300 * 1024;      // any single file bigger than this is skipped (minified/vendored)
const DIGEST_BUDGET = 95_000;           // chars — stays under the pipeline's 100k slice
const SMALL_PROJECT_FILES = 40;         // ≤ this many code files → include all of them
const PER_FILE_LINES_SMALL = 500;       // generous for small foundational projects
const PER_FILE_LINES_LARGE = 220;

// Directories that never contain the candidate's own thinking.
const SKIP_DIRS = /(^|\/)(node_modules|\.git|\.svn|\.hg|dist|build|out|target|vendor|coverage|\.next|\.nuxt|\.output|__pycache__|\.venv|venv|\.idea|\.vscode|\.gradle|Pods|DerivedData|bin|obj)(\/|$)/;
// Files that are noise even when small.
const SKIP_FILES = /(^|\/)(package-lock\.json|yarn\.lock|pnpm-lock\.yaml|composer\.lock|Gemfile\.lock|Cargo\.lock|poetry\.lock|\.DS_Store|Thumbs\.db)$|\.min\.(js|css)$|\.map$/i;
// Extensions we can meaningfully read as text/code.
const TEXT_EXT = /\.(java|kt|kts|scala|groovy|py|rb|php|go|rs|c|h|cpp|hpp|cc|cs|swift|m|mm|js|jsx|ts|tsx|mjs|cjs|vue|svelte|html|htm|css|scss|sass|less|sql|prisma|graphql|proto|sh|bash|zsh|bat|ps1|yml|yaml|json|jsonc|toml|ini|cfg|conf|env\.example|xml|gradle|properties|md|markdown|txt|csv|dockerfile|makefile|cmake|tf|hcl)$/i;
const SPECIAL_NAMES = /(^|\/)(dockerfile|makefile|cmakelists\.txt|gemfile|rakefile|procfile|\.gitignore|\.editorconfig|\.eslintrc[^/]*|\.prettierrc[^/]*|tsconfig[^/]*\.json)$/i;

// Selection priority (lower = read first). Manifests/README explain the project;
// schema + entries explain the architecture; then the code bulk.
function priorityOf(p: string): number {
  const base = p.toLowerCase();
  if (/(^|\/)readme(\.|$)/.test(base)) return 0;
  if (/(^|\/)(package\.json|pom\.xml|build\.gradle(\.kts)?|composer\.json|requirements\.txt|pyproject\.toml|go\.mod|cargo\.toml|[^/]+\.csproj|gemfile|mix\.exs)$/.test(base)) return 1;
  if (/(schema\.prisma|(^|\/)migrations?\/|\.sql$|models?\.py$|entities?\/)/.test(base)) return 2;
  if (/(^|\/)(main|index|app|application|server|program)\.[a-z]+$/.test(base)) return 3;
  if (/(routes?|controllers?|services?|handlers?|api)\//.test(base)) return 4;
  if (/\.(java|kt|py|go|rs|cs|php|rb|swift|c|cpp|cc)$/.test(base)) return 5;
  if (/\.(ts|tsx|js|jsx|vue|svelte|mjs|cjs)$/.test(base)) return 5;
  if (/\.(html|htm|css|scss|sass|less)$/.test(base)) return 6;
  if (SPECIAL_NAMES.test(base) || /\.(yml|yaml|toml|xml|gradle|properties|conf|ini)$/.test(base)) return 7;
  if (/\.(md|markdown|txt)$/.test(base)) return 8;
  return 9;
}

function looksBinary(buf: Buffer): boolean {
  const n = Math.min(buf.length, 2000);
  for (let i = 0; i < n; i++) if (buf[i] === 0) return true;
  return false;
}

function langOf(p: string): string {
  const m = p.toLowerCase().match(/\.([a-z0-9]+)$/);
  return m ? m[1] : '';
}

export interface ZipDigestResult {
  digest: string;
  stats: {
    filesIncluded: number;
    filesSkipped: number;
    bytesIncluded: number;
    truncated: boolean;
    tree: string[]; // included file paths, for the FE preview
  };
}

export function buildProjectDigest(zipBuffer: Buffer, zipName?: string): ZipDigestResult {
  let zip: AdmZip;
  try {
    zip = new AdmZip(zipBuffer);
  } catch {
    throw new BadRequestError('File .zip không hợp lệ hoặc bị hỏng.');
  }
  const entries = zip.getEntries().filter((e) => !e.isDirectory);
  if (!entries.length) throw new BadRequestError('File .zip rỗng.');
  if (entries.length > MAX_ENTRIES) throw new BadRequestError(`Zip có quá nhiều file (${entries.length} > ${MAX_ENTRIES}). Hãy nén riêng phần source code (bỏ node_modules/build).`);

  // Strip a single shared root folder ("my-project/…") so paths read naturally.
  const names = entries.map((e) => e.entryName.replace(/\\/g, '/'));
  const rootPrefix = (() => {
    const first = names[0].split('/')[0];
    return first && names.every((n) => n.startsWith(first + '/')) ? first + '/' : '';
  })();

  interface Candidate { path: string; size: number; priority: number; entry: AdmZip.IZipEntry }
  const candidates: Candidate[] = [];
  let skipped = 0;
  let totalUncompressed = 0;

  for (const e of entries) {
    const raw = e.entryName.replace(/\\/g, '/');
    // zip-slip / absolute paths — never trust archive paths.
    if (raw.includes('..') || raw.startsWith('/')) { skipped++; continue; }
    const path = rootPrefix && raw.startsWith(rootPrefix) ? raw.slice(rootPrefix.length) : raw;
    if (!path) { skipped++; continue; }
    totalUncompressed += e.header.size;
    if (totalUncompressed > MAX_TOTAL_UNCOMPRESSED) throw new BadRequestError('Zip giải nén quá lớn (>80MB). Hãy nén riêng phần source code.');
    if (SKIP_DIRS.test(path) || SKIP_FILES.test(path)) { skipped++; continue; }
    if (e.header.size > MAX_FILE_BYTES) { skipped++; continue; }
    const isText = TEXT_EXT.test(path) || SPECIAL_NAMES.test(path);
    if (!isText) { skipped++; continue; }
    candidates.push({ path, size: e.header.size, priority: priorityOf(path), entry: e });
  }
  if (!candidates.length) throw new BadRequestError('Không tìm thấy file code/text nào đọc được trong zip.');

  // Small foundational project (a handful of .java / .html files)? Read it ALL,
  // in a stable natural order — this is the "review my fundamentals" case.
  const isSmall = candidates.length <= SMALL_PROJECT_FILES;
  const perFileLines = isSmall ? PER_FILE_LINES_SMALL : PER_FILE_LINES_LARGE;
  candidates.sort((a, b) => (a.priority - b.priority) || a.path.localeCompare(b.path));

  // Full file tree (helps the interviewer see structure even for skipped files).
  const treeAll = candidates.map((c) => c.path);
  const header: string[] = [
    `# PROJECT DIGEST${zipName ? ` — ${zipName}` : ''}`,
    '',
    `Auto-extracted from the candidate's uploaded project archive. ${isSmall ? 'This is a SMALL/foundational project — the FULL source is included below; review it deeply (code quality, underlying language/CS fundamentals, why it works).' : 'Large project — the most architecture-relevant files are included below.'}`,
    '',
    '## File tree',
    '```',
    ...treeAll.slice(0, 400),
    treeAll.length > 400 ? `… (+${treeAll.length - 400} more files)` : '',
    '```',
    '',
  ].filter(Boolean);

  let digest = header.join('\n');
  let bytesIncluded = 0;
  let filesIncluded = 0;
  let truncated = false;
  const includedPaths: string[] = [];

  for (const c of candidates) {
    if (digest.length >= DIGEST_BUDGET) { truncated = true; break; }
    let text: string;
    try {
      const buf = c.entry.getData();
      if (looksBinary(buf)) { skipped++; continue; }
      text = buf.toString('utf8');
    } catch { skipped++; continue; }

    const lines = text.split('\n');
    const body = lines.length > perFileLines
      ? lines.slice(0, perFileLines).join('\n') + `\n… (${lines.length - perFileLines} more lines truncated)`
      : text;
    const block = `\n## ${c.path}\n\`\`\`${langOf(c.path)}\n${body}\n\`\`\`\n`;
    if (digest.length + block.length > DIGEST_BUDGET) {
      // Budget nearly spent — take what fits if it's meaningful, then stop.
      const room = DIGEST_BUDGET - digest.length;
      if (room > 600) {
        digest += block.slice(0, room) + '\n… (digest budget reached)\n';
        filesIncluded++;
        includedPaths.push(c.path);
      }
      truncated = true;
      break;
    }
    digest += block;
    bytesIncluded += body.length;
    filesIncluded++;
    includedPaths.push(c.path);
  }

  return {
    digest,
    stats: { filesIncluded, filesSkipped: skipped + (candidates.length - filesIncluded), bytesIncluded, truncated, tree: includedPaths },
  };
}
