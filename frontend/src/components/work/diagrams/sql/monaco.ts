'use client';

/**
 * Database designer — NẠP MONACO (trình soạn của VS Code) TỪ GÓI CỦA MÌNH, không từ CDN: CSP chặn stylesheet ngoài, app
 * desktop chạy app:// và có thể ngoại tuyến. Chỉ nạp phần lõi + tiện ích soạn (edcore: tìm/thay, gợi ý, gập, nhiều con
 * trỏ…) — không kéo TypeScript/JSON/CSS worker ⇒ gói nhỏ hơn nhiều; nạp LƯỜI khi mở một sơ đồ SQL.
 *
 * Ngôn ngữ riêng `ctw-sql` (Monarch): từ khoá, KIỂU DỮ LIỆU, ràng buộc (PRIMARY/FOREIGN/UNIQUE…), hàm, chuỗi N'…', tên bọc
 * [x] "x" `x` — mỗi loại một màu (theme ctw-sql-light / ctw-sql-dark). Gợi ý: từ khoá, kiểu theo hệ quản trị, tên bảng sau
 * REFERENCES / ON, tên cột sau REFERENCES T( / ON T( / trong bảng đang viết, và vài đoạn mẫu (bảng, khoá ngoại, chỉ mục).
 */

import type * as Monaco from 'monaco-editor';
import type { DbModel, Dialect } from '@/lib/sqlDesign';

export type MonacoNs = typeof Monaco;

let loading: Promise<MonacoNs> | null = null;

/** Ngữ cảnh gợi ý theo từng mô hình (model URI ⇒ mô hình CSDL hiện tại + hệ quản trị). */
const contexts = new Map<string, () => { model: DbModel | null; dialect: Dialect }>();
export function registerContext(uri: string, get: () => { model: DbModel | null; dialect: Dialect }) {
  contexts.set(uri, get);
  return () => { contexts.delete(uri); };
}

const KEYWORDS = [
  'ADD', 'ALL', 'ALTER', 'AND', 'ANY', 'AS', 'ASC', 'AUTO_INCREMENT', 'AUTOINCREMENT', 'BEGIN', 'BETWEEN', 'BY', 'CASCADE', 'CASE', 'CHARACTER', 'CHARSET',
  'CLUSTERED', 'COLLATE', 'COLUMN', 'COMMENT', 'CONCURRENTLY', 'CREATE', 'DATABASE', 'DECLARE', 'DEFERRABLE', 'DELETE', 'DESC', 'DISTINCT', 'DROP', 'ELSE', 'END',
  'ENGINE', 'ENUM', 'EXEC', 'EXISTS', 'FOR', 'FROM', 'GENERATED', 'GO', 'IDENTITY', 'IF', 'IN', 'INCLUDE', 'INDEX', 'INSERT', 'INTO', 'IS', 'JOIN', 'LIKE', 'NO', 'ACTION',
  'NONCLUSTERED', 'NOT', 'NULL', 'OF', 'ON', 'ONLY', 'OR', 'ORDER', 'PERSISTED', 'PROCEDURE', 'RESTRICT', 'RETURNS', 'SCHEMA', 'SELECT', 'SET', 'STORED', 'TABLE',
  'THEN', 'TO', 'TRIGGER', 'TYPE', 'UNSIGNED', 'UPDATE', 'USE', 'USING', 'VALUES', 'VIEW', 'VIRTUAL', 'WHEN', 'WHERE', 'WITH', 'ALWAYS', 'COMMENT', 'IS',
];
const CONSTRAINTS = ['PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'UNIQUE', 'CHECK', 'CONSTRAINT', 'DEFAULT'];
const TYPES_BY: Record<Dialect, string[]> = {
  sqlserver: ['INT', 'BIGINT', 'SMALLINT', 'TINYINT', 'BIT', 'DECIMAL(12,0)', 'DECIMAL(19,4)', 'NUMERIC', 'MONEY', 'FLOAT', 'REAL', 'CHAR(10)', 'VARCHAR(100)', 'NVARCHAR(100)', 'NVARCHAR(MAX)', 'NCHAR(10)', 'DATE', 'TIME', 'DATETIME2(0)', 'DATETIMEOFFSET', 'UNIQUEIDENTIFIER', 'VARBINARY(MAX)', 'XML'],
  postgres: ['INTEGER', 'BIGINT', 'SMALLINT', 'SERIAL', 'BIGSERIAL', 'BOOLEAN', 'NUMERIC(12,2)', 'REAL', 'DOUBLE PRECISION', 'VARCHAR(100)', 'TEXT', 'CHAR(10)', 'DATE', 'TIME', 'TIMESTAMP', 'TIMESTAMPTZ', 'INTERVAL', 'UUID', 'JSONB', 'JSON', 'BYTEA', 'INET', 'CITEXT'],
  mysql: ['INT', 'BIGINT', 'SMALLINT', 'TINYINT', 'BOOLEAN', 'DECIMAL(12,2)', 'FLOAT', 'DOUBLE', 'VARCHAR(100)', 'CHAR(10)', 'TEXT', 'MEDIUMTEXT', 'LONGTEXT', 'ENUM(...)', 'DATE', 'TIME', 'DATETIME', 'TIMESTAMP', 'YEAR', 'JSON', 'BLOB', 'BINARY(16)'],
  sqlite: ['INTEGER', 'REAL', 'TEXT', 'BLOB', 'NUMERIC', 'BOOLEAN', 'DATE', 'DATETIME'],
};
const ALL_TYPES = [...new Set(Object.values(TYPES_BY).flat().map((t) => t.replace(/\(.*$/, '').split(' ')[0]))].concat(['PRECISION', 'VARYING', 'WITHOUT', 'ZONE', 'TIMESTAMP', 'NTEXT', 'SMALLDATETIME', 'DATETIME', 'MEDIUMINT', 'TINYTEXT', 'LONGBLOB', 'SERIAL4', 'SERIAL8', 'INT4', 'INT8', 'FLOAT8']);
const FUNCTIONS = ['GETDATE', 'SYSDATETIME', 'SYSUTCDATETIME', 'NEWID', 'LEN', 'LENGTH', 'CHAR_LENGTH', 'NOW', 'CURRENT_TIMESTAMP', 'CURRENT_DATE', 'COALESCE', 'ISNULL', 'IFNULL', 'UPPER', 'LOWER', 'TRIM', 'CAST', 'CONVERT', 'GEN_RANDOM_UUID', 'UUID', 'DATEADD', 'DATEDIFF', 'YEAR', 'MONTH', 'DAY', 'ROUND', 'ABS', 'COUNT', 'SUM', 'MAX', 'MIN', 'AVG', 'NEXTVAL', 'DB_ID', 'OBJECT_ID'];

function language(m: MonacoNs) {
  m.languages.register({ id: 'ctw-sql', extensions: ['.sql'], aliases: ['SQL'] });
  m.languages.setLanguageConfiguration('ctw-sql', {
    comments: { lineComment: '--', blockComment: ['/*', '*/'] },
    brackets: [['(', ')'], ['[', ']']],
    autoClosingPairs: [{ open: '(', close: ')' }, { open: '[', close: ']' }, { open: "'", close: "'", notIn: ['string', 'comment'] }, { open: '"', close: '"', notIn: ['string', 'comment'] }, { open: '`', close: '`', notIn: ['string', 'comment'] }],
    surroundingPairs: [{ open: '(', close: ')' }, { open: "'", close: "'" }, { open: '[', close: ']' }, { open: '"', close: '"' }],
    folding: { markers: { start: /^\s*(--\s*#?region\b|CREATE\s+TABLE\b)/i, end: /^\s*(--\s*#?endregion\b|\)\s*;?\s*$)/i } },
  });
  m.languages.setMonarchTokensProvider('ctw-sql', {
    ignoreCase: true,
    defaultToken: '',
    keywords: KEYWORDS,
    constraints: CONSTRAINTS,
    types: ALL_TYPES,
    functions: FUNCTIONS,
    tokenizer: {
      root: [
        [/--.*$/, 'comment'],
        [/#\s.*$/, 'comment'],
        [/\/\*/, 'comment', '@comment'],
        [/^\s*GO\s*$/i, 'keyword.batch'],
        [/[Nn]'/, 'string', '@string'],
        [/[Ee]'/, 'string', '@string'],
        [/'/, 'string', '@string'],
        [/\$\$/, 'string', '@dollar'],
        [/\[[^\]\n]*\]/, 'identifier.quoted'],
        [/"[^"\n]*"/, 'identifier.quoted'],
        [/`[^`\n]*`/, 'identifier.quoted'],
        [/@@?[A-Za-z_]\w*/, 'variable'],
        [/\d*\.\d+([eE][-+]?\d+)?/, 'number'],
        [/0[xX][0-9a-fA-F]+/, 'number'],
        [/\d+/, 'number'],
        [/[A-Za-z_À-￿][\w$À-￿]*(?=\s*\()/, { cases: { '@types': 'type', '@functions': 'predefined', '@keywords': 'keyword', '@constraints': 'keyword.constraint', '@default': 'function' } }],
        [/[A-Za-z_À-￿][\w$À-￿]*/, { cases: { '@constraints': 'keyword.constraint', '@types': 'type', '@keywords': 'keyword', '@functions': 'predefined', '@default': 'identifier' } }],
        [/[()]/, '@brackets'],
        [/[,;.]/, 'delimiter'],
        [/[<>=!%&+\-*/|~^:]+/, 'operator'],
      ],
      comment: [[/[^/*]+/, 'comment'], [/\*\//, 'comment', '@pop'], [/[/*]/, 'comment']],
      string: [[/[^']+/, 'string'], [/''/, 'string.escape'], [/'/, 'string', '@pop']],
      dollar: [[/[^$]+/, 'string'], [/\$\$/, 'string', '@pop'], [/\$/, 'string']],
    },
  } as Monaco.languages.IMonarchLanguage);

  const theme = (dark: boolean): Monaco.editor.IStandaloneThemeData => ({
    base: dark ? 'vs-dark' : 'vs',
    inherit: true,
    rules: dark ? [
      { token: 'keyword', foreground: 'c792ea' }, { token: 'keyword.constraint', foreground: 'ffb86c', fontStyle: 'bold' }, { token: 'keyword.batch', foreground: 'ff79c6', fontStyle: 'bold' },
      { token: 'type', foreground: '4ec9b0' }, { token: 'predefined', foreground: '82aaff' }, { token: 'function', foreground: '82aaff' },
      { token: 'string', foreground: 'c3e88d' }, { token: 'string.escape', foreground: 'f78c6c' }, { token: 'number', foreground: 'f78c6c' },
      { token: 'comment', foreground: '7f8c98', fontStyle: 'italic' }, { token: 'identifier.quoted', foreground: 'ffcb6b' }, { token: 'identifier', foreground: 'e6e6e6' },
      { token: 'variable', foreground: 'f07178' }, { token: 'operator', foreground: '89ddff' }, { token: 'delimiter', foreground: '89ddff' },
    ] : [
      { token: 'keyword', foreground: '7c3aed' }, { token: 'keyword.constraint', foreground: 'c2410c', fontStyle: 'bold' }, { token: 'keyword.batch', foreground: 'be185d', fontStyle: 'bold' },
      { token: 'type', foreground: '0f766e' }, { token: 'predefined', foreground: '1d4ed8' }, { token: 'function', foreground: '1d4ed8' },
      { token: 'string', foreground: '15803d' }, { token: 'string.escape', foreground: 'b45309' }, { token: 'number', foreground: 'b45309' },
      { token: 'comment', foreground: '6b7280', fontStyle: 'italic' }, { token: 'identifier.quoted', foreground: '92400e' }, { token: 'identifier', foreground: '1f2328' },
      { token: 'variable', foreground: 'b91c1c' }, { token: 'operator', foreground: '0369a1' }, { token: 'delimiter', foreground: '57606a' },
    ],
    colors: dark ? { 'editor.background': '#17171b', 'editorLineNumber.foreground': '#5c5c66', 'editorLineNumber.activeForeground': '#c8c8d0', 'editor.lineHighlightBackground': '#ffffff08', 'editorGutter.background': '#17171b' }
      : { 'editor.background': '#fbfaf7', 'editorLineNumber.foreground': '#a8a59c', 'editorLineNumber.activeForeground': '#3d3c38', 'editor.lineHighlightBackground': '#0000000a', 'editorGutter.background': '#fbfaf7' },
  });
  m.editor.defineTheme('ctw-sql-light', theme(false));
  m.editor.defineTheme('ctw-sql-dark', theme(true));

  m.languages.registerCompletionItemProvider('ctw-sql', {
    triggerCharacters: [' ', '(', ',', '.'],
    provideCompletionItems(model, pos) {
      const ctx = contexts.get(model.uri.toString())?.();
      const dialect = ctx?.dialect ?? 'sqlserver';
      const db = ctx?.model ?? null;
      const word = model.getWordUntilPosition(pos);
      const range = { startLineNumber: pos.lineNumber, endLineNumber: pos.lineNumber, startColumn: word.startColumn, endColumn: word.endColumn };
      const before = model.getValueInRange({ startLineNumber: Math.max(1, pos.lineNumber - 3), startColumn: 1, endLineNumber: pos.lineNumber, endColumn: pos.column }).replace(/\s+/g, ' ');
      const K = m.languages.CompletionItemKind;
      const tables = db?.tables ?? [];
      const strip = (s: string) => s.replace(/^[[`"]|[\]`"]$/g, '');
      // REFERENCES T( | ON T( ⇒ cột của T
      const colCtx = /(?:REFERENCES|ON(?:\s+ONLY)?)\s+([\w."[\]`]+)\s*\(\s*(?:[\w"[\]`]+\s*,\s*)*$/i.exec(before);
      if (colCtx) {
        const tn = strip(colCtx[1].split('.').pop() ?? '');
        const t = tables.find((x) => x.name.toLowerCase() === tn.toLowerCase());
        if (t) return { suggestions: t.columns.map((c, i) => ({ label: c.name, kind: K.Field, detail: `${c.type.raw}${c.nullable ? '' : ' NOT NULL'}`, insertText: c.name, range, sortText: String(i).padStart(3, '0') })) };
      }
      // REFERENCES | ON | ALTER TABLE | INSERT INTO ⇒ tên bảng
      if (/(?:REFERENCES|\bON(?:\s+ONLY)?|ALTER\s+TABLE|INTO|FROM|JOIN)\s+[\w"[\]`]*$/i.test(before)) {
        return { suggestions: tables.map((t) => ({ label: t.name, kind: K.Class, detail: `${t.columns.length} columns`, documentation: t.comment, insertText: t.name, range })) };
      }
      const types = TYPES_BY[dialect].map((ty) => ({ label: ty, kind: K.TypeParameter, insertText: ty.replace('(...)', "('${1:A}', '${2:B}')"), insertTextRules: ty.includes('(...)') ? m.languages.CompletionItemInsertTextRule.InsertAsSnippet : undefined, range, sortText: `1${ty}` }));
      const kws = [...KEYWORDS, ...CONSTRAINTS, 'NOT NULL', 'PRIMARY KEY', 'FOREIGN KEY', 'ON DELETE CASCADE', 'ON DELETE SET NULL', 'CREATE TABLE', 'CREATE INDEX', 'CREATE UNIQUE INDEX', 'ALTER TABLE']
        .map((k) => ({ label: k, kind: K.Keyword, insertText: k, range, sortText: `3${k}` }));
      const fns = FUNCTIONS.map((f) => ({ label: `${f}()`, kind: K.Function, insertText: `${f}($0)`, insertTextRules: m.languages.CompletionItemInsertTextRule.InsertAsSnippet, range, sortText: `4${f}` }));
      const tbls = tables.map((t) => ({ label: t.name, kind: K.Class, detail: `${t.columns.length} columns`, insertText: t.name, range, sortText: `2${t.name}` }));
      const id = dialect === 'postgres' ? 'BIGINT GENERATED ALWAYS AS IDENTITY' : dialect === 'mysql' ? 'INT NOT NULL AUTO_INCREMENT' : dialect === 'sqlite' ? 'INTEGER' : 'INT IDENTITY(1,1) NOT NULL';
      const text = dialect === 'sqlserver' ? 'NVARCHAR(100)' : 'VARCHAR(100)';
      const S = m.languages.CompletionItemInsertTextRule.InsertAsSnippet;
      const snippets = [
        { label: 'table', detail: 'CREATE TABLE …', insertText: `CREATE TABLE \${1:Name} (\n    \${1:Name}Id ${id},\n    \${2:title} ${text} NOT NULL,\n    CONSTRAINT PK_\${1:Name} PRIMARY KEY (\${1:Name}Id)\n);\n` },
        { label: 'fk', detail: 'CONSTRAINT FK_… FOREIGN KEY …', insertText: 'CONSTRAINT FK_${1:Child}_${2:Parent} FOREIGN KEY (${3:parentId}) REFERENCES ${2:Parent}(${4:parentId})' },
        { label: 'index', detail: 'CREATE INDEX …', insertText: 'CREATE INDEX IX_${1:Table}_${2:column} ON ${1:Table}(${2:column});' },
        { label: 'unique-filtered', detail: 'CREATE UNIQUE INDEX … WHERE …', insertText: "CREATE UNIQUE INDEX UX_${1:Table}_${2:column} ON ${1:Table}(${2:column}) WHERE ${3:status} = '${4:ACTIVE}';" },
        { label: 'junction', detail: 'N–N junction table', insertText: 'CREATE TABLE ${1:A}${2:B} (\n    ${3:a}Id INT NOT NULL,\n    ${4:b}Id INT NOT NULL,\n    CONSTRAINT PK_${1:A}${2:B} PRIMARY KEY (${3:a}Id, ${4:b}Id),\n    CONSTRAINT FK_${1:A}${2:B}_${1:A} FOREIGN KEY (${3:a}Id) REFERENCES ${1:A}(${3:a}Id),\n    CONSTRAINT FK_${1:A}${2:B}_${2:B} FOREIGN KEY (${4:b}Id) REFERENCES ${2:B}(${4:b}Id)\n);\n' },
      ].map((s) => ({ ...s, kind: K.Snippet, insertTextRules: S, range, sortText: `0${s.label}` }));
      return { suggestions: [...snippets, ...types, ...tbls, ...kws, ...fns] };
    },
  });

  m.languages.registerHoverProvider('ctw-sql', {
    provideHover(model, pos) {
      const w = model.getWordAtPosition(pos);
      const db = contexts.get(model.uri.toString())?.()?.model;
      if (!w || !db) return null;
      const t = db.tables.find((x) => x.name.toLowerCase() === w.word.toLowerCase());
      if (!t) return null;
      const rows = t.columns.slice(0, 30).map((c) => `| ${t.primaryKey?.columns.some((k) => k.toLowerCase() === c.name.toLowerCase()) ? '🔑 ' : ''}${c.name} | \`${c.type.raw}\` | ${c.nullable ? 'NULL' : 'NOT NULL'} |`);
      return {
        range: { startLineNumber: pos.lineNumber, endLineNumber: pos.lineNumber, startColumn: w.startColumn, endColumn: w.endColumn },
        contents: [{ value: `**${t.name}**${t.comment ? ` — ${t.comment}` : ''}` }, { value: `| column | type | null |\n|---|---|---|\n${rows.join('\n')}` }],
      };
    },
  });
}

export function loadMonaco(): Promise<MonacoNs> {
  if (!loading) {
    loading = (async () => {
      // Worker riêng cho phần chạy nền của trình soạn (so khác, gợi ý theo từ). Đường dẫn TƯƠNG ĐỐI ⇒ webpack (Next) và
      // Vite (app desktop) đều đóng gói được.
      (self as unknown as { MonacoEnvironment?: unknown }).MonacoEnvironment = {
        getWorker: () => new Worker(new URL('./monaco.worker.ts', import.meta.url), { type: 'module' }),
      };
      const m = (await import('monaco-editor/esm/vs/editor/edcore.main.js')) as unknown as MonacoNs;
      language(m);
      return m;
    })().catch((e) => { loading = null; throw e; });
  }
  return loading;
}
