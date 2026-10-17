/**
 * TÔ MÀU CÚ PHÁP cho khối code và diff — highlight.js ⇒ ANSI.
 *
 * Không dùng `cli-highlight`: nó kéo highlight.js 10 + chalk 4 + parse5 +
 * yargs chỉ để làm đúng việc của 60 dòng dưới đây, và bảng màu của nó nhạt.
 * Ở đây: chỉ nạp ~30 ngôn ngữ hay gặp (bản đầy đủ ~190 ngôn ngữ nặng ~1MB),
 * và bảng màu sống động kiểu VS Code Dark+ / iTerm "hacker".
 *
 * Mỗi token chỉ đặt/huỷ MÀU CHỮ (`39`), không huỷ nền — để tô được trên nền
 * xanh/đỏ của diff (xem `mau.ts`).
 */
import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import c from 'highlight.js/lib/languages/c';
import cpp from 'highlight.js/lib/languages/cpp';
import csharp from 'highlight.js/lib/languages/csharp';
import css from 'highlight.js/lib/languages/css';
import dart from 'highlight.js/lib/languages/dart';
import diff from 'highlight.js/lib/languages/diff';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import go from 'highlight.js/lib/languages/go';
import graphql from 'highlight.js/lib/languages/graphql';
import ini from 'highlight.js/lib/languages/ini';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import kotlin from 'highlight.js/lib/languages/kotlin';
import lua from 'highlight.js/lib/languages/lua';
import makefile from 'highlight.js/lib/languages/makefile';
import markdown from 'highlight.js/lib/languages/markdown';
import nginx from 'highlight.js/lib/languages/nginx';
import php from 'highlight.js/lib/languages/php';
import plaintext from 'highlight.js/lib/languages/plaintext';
import powershell from 'highlight.js/lib/languages/powershell';
import python from 'highlight.js/lib/languages/python';
import ruby from 'highlight.js/lib/languages/ruby';
import rust from 'highlight.js/lib/languages/rust';
import scss from 'highlight.js/lib/languages/scss';
import shell from 'highlight.js/lib/languages/shell';
import sql from 'highlight.js/lib/languages/sql';
import swift from 'highlight.js/lib/languages/swift';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import yaml from 'highlight.js/lib/languages/yaml';
import { capMau, mau } from './mau';

const NGON_NGU = {
  bash, c, cpp, csharp, css, dart, diff, dockerfile, go, graphql, ini, java, javascript, json, kotlin, lua, makefile,
  markdown, nginx, php, plaintext, powershell, python, ruby, rust, scss, shell, sql, swift, typescript, xml, yaml,
};
for (const [ten, dinhNghia] of Object.entries(NGON_NGU)) hljs.registerLanguage(ten, dinhNghia);
hljs.registerAliases(['sh', 'zsh', 'console', 'terminal'], { languageName: 'bash' });
hljs.registerAliases(['js', 'jsx', 'mjs', 'cjs'], { languageName: 'javascript' });
hljs.registerAliases(['ts', 'tsx', 'mts', 'cts'], { languageName: 'typescript' });
hljs.registerAliases(['html', 'htm', 'svg', 'vue'], { languageName: 'xml' });
hljs.registerAliases(['py'], { languageName: 'python' });
hljs.registerAliases(['yml'], { languageName: 'yaml' });
hljs.registerAliases(['toml', 'env', 'properties'], { languageName: 'ini' });
hljs.registerAliases(['md'], { languageName: 'markdown' });
hljs.registerAliases(['text', 'txt', 'plain'], { languageName: 'plaintext' });

/** Bảng màu: tím từ khoá · xanh lá neon chuỗi · cam số · xám chú thích… */
export const BANG_MAU: Record<string, string> = {
  keyword: '#c678dd',
  'meta.keyword': '#c678dd',
  built_in: '#e5c07b',
  type: '#4ec9b0',
  literal: '#ff79c6',
  number: '#ff9e64',
  string: '#50fa7b',
  'char.escape': '#ffb86c',
  regexp: '#f78c6c',
  subst: '#e6e6e6',
  symbol: '#ff79c6',
  comment: '#7f848e',
  quote: '#7f848e',
  doctag: '#c678dd',
  meta: '#8be9fd',
  'meta.string': '#50fa7b',
  title: '#61afef',
  'title.function': '#61afef',
  'title.function.invoke': '#61afef',
  'title.class': '#4ec9b0',
  'title.class.inherited': '#4ec9b0',
  params: '#e6e6e6',
  attr: '#9cdcfe',
  attribute: '#9cdcfe',
  property: '#9cdcfe',
  variable: '#e06c75',
  'variable.language': '#ff79c6',
  'variable.constant': '#ff9e64',
  'template-variable': '#e06c75',
  tag: '#ff5f87',
  name: '#ff5f87',
  'selector-tag': '#ff5f87',
  'selector-class': '#e5c07b',
  'selector-id': '#61afef',
  'selector-attr': '#9cdcfe',
  'selector-pseudo': '#c678dd',
  operator: '#56b6c2',
  punctuation: '#abb2bf',
  addition: '#50fa7b',
  deletion: '#ff5555',
  section: '#61afef',
  bullet: '#ff9e64',
  link: '#61afef',
  emphasis: '#e6e6e6',
  strong: '#e6e6e6',
};

/** Phạm vi in nghiêng (chú thích). */
const NGHIENG = new Set(['comment', 'quote', 'doctag']);

const THUC_THE: Record<string, string> = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#x27;': "'", '&#39;': "'" };
const giaiMa = (s: string): string => s.replace(/&(amp|lt|gt|quot|#x27|#39);/g, (m) => THUC_THE[m] ?? m);

/** `hljs-title function_` ⇒ `title.function`. */
function phamVi(lop: string): string {
  const phan = lop.split(/\s+/).filter(Boolean);
  const dau = (phan[0] ?? '').replace(/^hljs-/, '');
  const sau = phan.slice(1).map((p) => p.replace(/^hljs-/, '').replace(/_+$/, ''));
  return [dau, ...sau].join('.');
}

function mauCua(scope: string): string | undefined {
  if (BANG_MAU[scope]) return BANG_MAU[scope];
  const phan = scope.split('.');
  for (let i = phan.length - 1; i > 0; i -= 1) {
    const thu = phan.slice(0, i).join('.');
    if (BANG_MAU[thu]) return BANG_MAU[thu];
  }
  return undefined;
}

/** HTML của highlight.js ⇒ ANSI. Span lồng nhau: màu của span TRONG CÙNG có màu thắng. */
export function htmlSangAnsi(html: string): string {
  const ngan: Array<{ mau?: string; nghieng: boolean }> = [];
  let ra = '';
  const re = /<span class="([^"]+)">|<\/span>|([^<]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    if (m[1] !== undefined) {
      const sc = phamVi(m[1]);
      const cha = ngan[ngan.length - 1];
      ngan.push({ mau: mauCua(sc) ?? cha?.mau, nghieng: NGHIENG.has(sc.split('.')[0]!) || Boolean(cha?.nghieng) });
    } else if (m[0] === '</span>') {
      ngan.pop();
    } else {
      const chu = giaiMa(m[2] ?? '');
      const dinh = ngan[ngan.length - 1];
      if (!dinh?.mau) { ra += chu; continue; }
      // Tô TỪNG DÒNG: mã màu không được vắt qua ký tự xuống dòng (Ink cắt theo dòng).
      ra += chu.split('\n').map((d) => {
        if (!d) return d;
        const t = mau(dinh.mau!)(d);
        return dinh.nghieng && capMau() > 0 ? `\x1b[3m${t}\x1b[23m` : t;
      }).join('\n');
    }
  }
  return ra;
}

/** Ngôn ngữ đăng ký được không (đã qua bí danh). */
export function coNgonNgu(ten: string | undefined | null): boolean {
  return Boolean(ten && hljs.getLanguage(ten));
}

const DUOI: Record<string, string> = {
  ts: 'typescript', tsx: 'typescript', mts: 'typescript', cts: 'typescript', js: 'javascript', jsx: 'javascript', mjs: 'javascript', cjs: 'javascript',
  json: 'json', jsonc: 'json', py: 'python', java: 'java', kt: 'kotlin', kts: 'kotlin', swift: 'swift', go: 'go', rs: 'rust',
  c: 'c', h: 'c', cpp: 'cpp', cc: 'cpp', hpp: 'cpp', cs: 'csharp', php: 'php', rb: 'ruby', lua: 'lua', dart: 'dart',
  css: 'css', scss: 'scss', sass: 'scss', less: 'css', html: 'xml', htm: 'xml', xml: 'xml', svg: 'xml', vue: 'xml',
  sql: 'sql', yml: 'yaml', yaml: 'yaml', toml: 'ini', ini: 'ini', env: 'ini', md: 'markdown', mdx: 'markdown',
  sh: 'bash', bash: 'bash', zsh: 'bash', ps1: 'powershell', graphql: 'graphql', gql: 'graphql', diff: 'diff', patch: 'diff',
};

/** Đoán ngôn ngữ từ đường dẫn file (`Dockerfile`, `Makefile` không có đuôi). */
export function ngonNguTuDuong(duong: string | undefined | null): string | null {
  if (!duong) return null;
  const ten = duong.split(/[\\/]/).pop() ?? '';
  if (/^dockerfile/i.test(ten)) return 'dockerfile';
  if (/^makefile$/i.test(ten)) return 'makefile';
  if (/^\.env(\.|$)/.test(ten)) return 'ini';
  const duoi = /\.([a-z0-9]+)$/i.exec(ten)?.[1]?.toLowerCase();
  return duoi ? DUOI[duoi] ?? null : null;
}

/**
 * Tô một đoạn code. Không rõ ngôn ngữ ⇒ để highlight.js tự đoán (chỉ với
 * đoạn ngắn — đoán trên 4000+ ký tự chậm thấy rõ khi chữ đang chảy).
 */
export function toMauCode(code: string, ngonNgu?: string | null): string {
  if (capMau() === 0 || !code) return code;
  try {
    if (ngonNgu && hljs.getLanguage(ngonNgu)) {
      return htmlSangAnsi(hljs.highlight(code, { language: ngonNgu, ignoreIllegals: true }).value);
    }
    if (ngonNgu && /^(text|txt|plain|plaintext|output|log)$/i.test(ngonNgu)) return code;
    if (code.length > 4000) return code;
    return htmlSangAnsi(hljs.highlightAuto(code).value);
  } catch {
    return code;
  }
}
