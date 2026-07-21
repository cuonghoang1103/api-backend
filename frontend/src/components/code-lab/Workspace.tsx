'use client';

/**
 * Workspace — the learner's multi-file project for one exercise.
 *
 * WHY THIS REPLACED A SINGLE TEXTAREA
 * -----------------------------------
 * CodeProgress.savedCode was always an array of { name, language, code }, but
 * the page read savedCode[0] and saved one block called "Solution". With a
 * multi-file starter that was worse than limiting: switching starter tabs ran
 * setMyCode(block.code) over whatever the learner had typed, so their work
 * disappeared without a warning and was never saved anywhere.
 *
 * Here `name` IS the path — "model/Student.java". Folders are packages; there
 * is no separate folder list, because an empty folder means nothing to javac
 * and nothing to a marker.
 *
 * WHY THE UI CHANGES PER TRACK
 * ----------------------------
 * LAB211 is the university's Java OOP lab, done in NetBeans, so there the
 * vocabulary is NetBeans': packages, "New Java Class", a `package x;` header
 * written for you, and a zip that opens as a project. Node.js or SQL exercises
 * are not done in NetBeans and must not pretend to be — they get plain files
 * and folders. The flavour decides the words and the scaffold; the multi-file
 * machinery underneath is the same everywhere.
 */

import { useCallback, useMemo, useRef, useState } from 'react';
import { FilePlus, FolderPlus, Trash2, Pencil, Download, Upload, Loader2, FileCode2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { CodeEditor } from '@/components/exp-hub/CodeEditor';
import { codeLabApi } from '@/lib/code-lab-api';
import type { CodeBlock } from '@/types/code-lab';

export interface WorkspaceFlavor {
  /** NetBeans wording: "class" and "package" instead of "file" and "folder". */
  javaStyle: boolean;
  ext: string;
  defaultFile: string;
  /** Offering a project zip only makes sense where a project is a folder. */
  canZip: boolean;
  scaffold: (dir: string, base: string) => string;
}

/** A Java identifier NetBeans would accept, so the scaffold compiles. */
const javaIdent = (s: string) => /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(s);

export function flavorFor(trackSlug: string, language: string): WorkspaceFlavor {
  const lang = (language || '').toLowerCase();
  if (trackSlug === 'lab211' || lang === 'java') {
    return {
      javaStyle: true,
      ext: '.java',
      defaultFile: 'Main.java',
      canZip: true,
      scaffold: (dir, base) => {
        const pkg = dir.replace(/\//g, '.');
        const head = pkg ? `package ${pkg};\n\n` : '';
        return `${head}public class ${base} {\n\n}\n`;
      },
    };
  }
  const table: Record<string, Partial<WorkspaceFlavor>> = {
    javascript: { ext: '.js', defaultFile: 'index.js', canZip: true },
    typescript: { ext: '.ts', defaultFile: 'index.ts', canZip: true },
    python: { ext: '.py', defaultFile: 'main.py', canZip: true },
    sql: { ext: '.sql', defaultFile: 'query.sql', canZip: false },
    kotlin: { ext: '.kt', defaultFile: 'Main.kt', canZip: true },
    rust: { ext: '.rs', defaultFile: 'main.rs', canZip: true },
    go: { ext: '.go', defaultFile: 'main.go', canZip: true },
    c: { ext: '.c', defaultFile: 'main.c', canZip: true },
    cpp: { ext: '.cpp', defaultFile: 'main.cpp', canZip: true },
  };
  const t = table[lang] ?? {};
  return {
    javaStyle: false,
    ext: t.ext ?? '.txt',
    defaultFile: t.defaultFile ?? `solution${t.ext ?? '.txt'}`,
    canZip: t.canZip ?? false,
    scaffold: () => '',
  };
}

const dirOf = (path: string) => (path.includes('/') ? path.slice(0, path.lastIndexOf('/')) : '');
const baseOf = (path: string) => path.slice(path.lastIndexOf('/') + 1);

interface Props {
  files: CodeBlock[];
  onChange: (files: CodeBlock[]) => void;
  exerciseId: number;
  trackSlug: string;
  language: string;
  projectName: string;
}

export function Workspace({ files, onChange, exerciseId, trackSlug, language, projectName }: Props) {
  const flavor = useMemo(() => flavorFor(trackSlug, language), [trackSlug, language]);
  const [active, setActive] = useState(0);
  const [busy, setBusy] = useState<'zip' | 'import' | null>(null);
  const importRef = useRef<HTMLInputElement>(null);

  const idx = Math.min(active, Math.max(0, files.length - 1));
  const current = files[idx];

  const words = flavor.javaStyle
    ? { file: 'class', files: 'class', folder: 'package', newFile: 'New Java Class', newFolder: 'New package' }
    : { file: 'file', files: 'file', folder: 'thư mục', newFile: 'Thêm file', newFolder: 'Thêm thư mục' };

  const setCode = useCallback((code: string) => {
    onChange(files.map((f, i) => (i === idx ? { ...f, code } : f)));
  }, [files, idx, onChange]);

  const addFile = (presetDir?: string) => {
    const prompt1 = flavor.javaStyle
      ? `Tên package (để trống nếu đặt ở gốc), ví dụ: model`
      : `Thư mục (để trống nếu đặt ở gốc)`;
    const dir = presetDir !== undefined ? presetDir : (window.prompt(prompt1, '') ?? null);
    if (dir === null) return;
    const cleanDir = dir.replace(/^\/+|\/+$/g, '').replace(/\.+/g, flavor.javaStyle ? '/' : '.');

    const prompt2 = flavor.javaStyle ? 'Tên class, ví dụ: Student' : `Tên file, ví dụ: ${flavor.defaultFile}`;
    const raw = window.prompt(prompt2, '');
    if (!raw) return;
    let base = raw.trim();

    if (flavor.javaStyle) {
      base = base.replace(/\.java$/i, '');
      if (!javaIdent(base)) { toast.error('Tên class không hợp lệ (chữ cái, số, _ và không bắt đầu bằng số).'); return; }
      base += '.java';
    } else if (!/\.[a-z0-9]+$/i.test(base)) {
      base += flavor.ext;
    }

    const path = cleanDir ? `${cleanDir}/${base}` : base;
    if (files.some((f) => f.name === path)) { toast.error(`Đã có ${path}`); return; }
    const code = flavor.scaffold(cleanDir, base.replace(/\.[a-z0-9]+$/i, ''));
    onChange([...files, { name: path, language, code }]);
    setActive(files.length);
  };

  const rename = () => {
    if (!current) return;
    const next = window.prompt('Đường dẫn mới', current.name);
    if (!next || next === current.name) return;
    const path = next.replace(/^\/+/, '').trim();
    if (!path || path.includes('..')) { toast.error('Đường dẫn không hợp lệ.'); return; }
    if (files.some((f, i) => i !== idx && f.name === path)) { toast.error(`Đã có ${path}`); return; }
    onChange(files.map((f, i) => (i === idx ? { ...f, name: path } : f)));
  };

  const remove = () => {
    if (!current) return;
    if (!window.confirm(`Xoá ${current.name}? Không khôi phục được.`)) return;
    onChange(files.filter((_, i) => i !== idx));
    setActive(Math.max(0, idx - 1));
  };

  const exportZip = async () => {
    setBusy('zip');
    try {
      const res = await codeLabApi.exportWorkspace(exerciseId, files, projectName);
      const url = URL.createObjectURL(new Blob([res.data as BlobPart], { type: 'application/zip' }));
      const a = document.createElement('a');
      a.href = url; a.download = `${projectName}.zip`;
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    } catch { toast.error('Không tải được .zip.'); } finally { setBusy(null); }
  };

  const importZip = async (file: File) => {
    setBusy('import');
    try {
      const res = await codeLabApi.importWorkspace(exerciseId, file);
      const got = res.data.data;
      if (files.some((f) => f.code.trim()) &&
          !window.confirm(`Nạp ${got.files.length} file từ zip và THAY THẾ toàn bộ nội dung đang có?`)) return;
      onChange(got.files);
      setActive(0);
      toast.success(`Đã nạp ${got.files.length} file${got.skipped ? ` (bỏ qua ${got.skipped})` : ''}`);
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Không đọc được file .zip.');
    } finally { setBusy(null); }
  };

  // Group by folder for the tree. Sorted so packages read in a stable order.
  const tree = useMemo(() => {
    const byDir = new Map<string, { file: CodeBlock; i: number }[]>();
    files.forEach((file, i) => {
      const d = dirOf(file.name);
      if (!byDir.has(d)) byDir.set(d, []);
      byDir.get(d)!.push({ file, i });
    });
    return [...byDir.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [files]);

  return (
    <div className="rounded-lg border" style={{ borderColor: 'var(--border-color)' }}>
      <div className="flex flex-wrap items-center gap-1.5 border-b p-2" style={{ borderColor: 'var(--border-color)' }}>
        <button onClick={() => addFile()} className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium"
          style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
          <FilePlus size={13} /> {words.newFile}
        </button>
        {flavor.javaStyle && (
          <button onClick={() => { const p = window.prompt('Tên package, ví dụ: service', ''); if (p) addFile(p.replace(/\./g, '/')); }}
            className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
            <FolderPlus size={13} /> {words.newFolder}
          </button>
        )}
        <span className="mx-1 h-4 w-px" style={{ background: 'var(--border-color)' }} />
        <button onClick={rename} disabled={!current} className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs disabled:opacity-40"
          style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
          <Pencil size={13} /> Đổi tên
        </button>
        <button onClick={remove} disabled={files.length <= 1} className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs disabled:opacity-40"
          style={{ borderColor: 'var(--border-color)', color: '#ef4444' }}>
          <Trash2 size={13} /> Xoá
        </button>
        {flavor.canZip && (
          <>
            <span className="mx-1 h-4 w-px" style={{ background: 'var(--border-color)' }} />
            <button onClick={exportZip} disabled={busy !== null || !files.length}
              className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs disabled:opacity-40"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
              {busy === 'zip' ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
              {flavor.javaStyle ? 'Tải .zip (mở bằng NetBeans)' : 'Tải .zip'}
            </button>
            <button onClick={() => importRef.current?.click()} disabled={busy !== null}
              className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs disabled:opacity-40"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
              {busy === 'import' ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />} Nạp .zip
            </button>
            <input ref={importRef} type="file" accept=".zip" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) void importZip(f); e.target.value = ''; }} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[190px_1fr]">
        <div className="max-h-[380px] overflow-y-auto border-b p-2 sm:border-b-0 sm:border-r" style={{ borderColor: 'var(--border-color)' }}>
          {tree.map(([dir, entries]) => (
            <div key={dir || '(root)'} className="mb-1.5">
              <div className="mb-0.5 truncate px-1 text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
                {dir ? (flavor.javaStyle ? dir.replace(/\//g, '.') : dir) : '(gốc)'}
              </div>
              {entries.map(({ file, i }) => (
                <button key={file.name} onClick={() => setActive(i)}
                  className="flex w-full items-center gap-1 truncate rounded px-1.5 py-1 text-left text-xs"
                  style={i === idx
                    ? { background: '#6366f1', color: '#fff' }
                    : { color: 'var(--text-primary)' }}>
                  <FileCode2 size={12} className="shrink-0" />
                  <span className="truncate">{baseOf(file.name)}</span>
                </button>
              ))}
            </div>
          ))}
          {!files.length && <p className="px-1 text-xs" style={{ color: 'var(--text-secondary)' }}>Chưa có file nào.</p>}
        </div>

        <div className="p-2">
          {current ? (
            <>
              <div className="mb-1 truncate font-mono text-[11px]" style={{ color: 'var(--text-secondary)' }}>{current.name}</div>
              <CodeEditor value={current.code} language={current.language || language} onChange={setCode} height={320}
                placeholder={flavor.javaStyle ? 'Viết code Java của bạn…' : 'Viết lời giải của bạn…'} />
            </>
          ) : (
            <p className="p-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Bấm “{words.newFile}” để bắt đầu.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
