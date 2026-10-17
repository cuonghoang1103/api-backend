'use client';

/**
 * Database designer — TRÌNH SOẠN SQL (Monaco): tô màu theo loại token, số dòng, gạch lỗi ĐÚNG chỗ (lỗi cú pháp đỏ, cảnh báo
 * thiết kế vàng, gợi ý xanh), gợi ý từ khoá/kiểu/tên bảng/cột, rê chuột lên tên bảng thấy các cột, tô sáng câu CREATE TABLE
 * đang chọn trên ERD. Không nạp được Monaco (mạng/CSP/thiết bị yếu) ⇒ ô soạn đơn giản có số dòng — vẫn sửa được.
 */

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import type * as Monaco from 'monaco-editor';
import { cn } from '@/lib/utils';
import { useWT } from '@/components/work/i18n';
import type { DbModel, Dialect, Problem, Span } from '@/lib/sqlDesign';
import { loadMonaco, registerContext, type MonacoNs } from './monaco';

export interface SqlEditorHandle {
  /** Nhảy tới + chọn + tô sáng một đoạn. */
  reveal(span: Span, opts?: { select?: boolean; focus?: boolean }): void;
  focus(): void;
}

let seq = 0;

const SqlEditor = forwardRef<SqlEditorHandle, {
  value: string;
  onChange: (v: string) => void;
  readOnly: boolean;
  dark: boolean;
  problems: Problem[];
  model: DbModel | null;
  dialect: Dialect;
  /** Đoạn tô nền (bảng đang chọn). */
  highlight: Span | null;
  /** Con trỏ dời ⇒ offset (để ERD biết bảng đang soạn). */
  onCursor?: (offset: number) => void;
  label: string;
}>(function SqlEditor({ value, onChange, readOnly, dark, problems, model, dialect, highlight, onCursor, label }, ref) {
  const { t, locale } = useWT();
  const host = useRef<HTMLDivElement>(null);
  const ed = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const mon = useRef<MonacoNs | null>(null);
  const deco = useRef<Monaco.editor.IEditorDecorationsCollection | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'fallback'>('loading');
  const ctx = useRef({ model, dialect });
  ctx.current = { model, dialect };
  const changeCb = useRef(onChange); changeCb.current = onChange;
  const cursorCb = useRef(onCursor); cursorCb.current = onCursor;
  const applying = useRef(false);
  /** Giá trị chính trình soạn vừa báo lên — React có thể vẽ lại với bản CŨ hơn chữ đang có (gõ nhanh), đừng nạp ngược. */
  const echoes = useRef<Set<string>>(new Set());
  const ta = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let alive = true;
    let dispose: Array<() => void> = [];
    loadMonaco().then((m) => {
      if (!alive || !host.current) return;
      mon.current = m;
      const uri = m.Uri.parse(`inmemory://ctw-sql/${++seq}.sql`);
      const tm = m.editor.createModel(value, 'ctw-sql', uri);
      tm.updateOptions({ tabSize: 4, insertSpaces: true });
      const e = m.editor.create(host.current, {
        model: tm, theme: dark ? 'ctw-sql-dark' : 'ctw-sql-light', readOnly, automaticLayout: true, minimap: { enabled: false }, fontSize: 13, lineHeight: 20,
        fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", fontLigatures: false, scrollBeyondLastLine: false, wordWrap: 'off',
        renderLineHighlight: 'line', smoothScrolling: true, padding: { top: 10, bottom: 10 }, tabSize: 4, bracketPairColorization: { enabled: true },
        guides: { bracketPairs: 'active', indentation: true }, folding: true, glyphMargin: false, lineNumbersMinChars: 3, quickSuggestions: { other: true, comments: false, strings: false },
        suggestOnTriggerCharacters: true, acceptSuggestionOnEnter: 'smart', ariaLabel: label, fixedOverflowWidgets: true, stickyScroll: { enabled: true, maxLineCount: 1 }, unicodeHighlight: { ambiguousCharacters: false, invisibleCharacters: true },
      });
      ed.current = e;
      deco.current = e.createDecorationsCollection();
      dispose.push(registerContext(uri.toString(), () => ctx.current));
      const sub = tm.onDidChangeContent(() => {
        if (applying.current) return;
        const v = tm.getValue();
        echoes.current.add(v);
        if (echoes.current.size > 200) echoes.current = new Set([...echoes.current].slice(-50));
        changeCb.current(v);
      });
      const cur = e.onDidChangeCursorPosition((ev) => cursorCb.current?.(tm.getOffsetAt(ev.position)));
      dispose.push(() => { sub.dispose(); cur.dispose(); e.dispose(); tm.dispose(); });
      setState('ready');
    }).catch((err) => { console.warn('[ctw] Monaco failed to load — using the plain editor', err); if (alive) setState('fallback'); });
    return () => { alive = false; dispose.forEach((f) => f()); dispose = []; ed.current = null; };
    // Gắn MỘT lần; giá trị/readOnly/theme đồng bộ ở các effect dưới.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Giá trị từ ngoài (đổi phiên bản, chèn mẫu, chuyển hệ quản trị) ⇒ thay nội dung, giữ lịch sử undo.
  useEffect(() => {
    const e = ed.current; const m = mon.current;
    if (!e || !m) return;
    const tm = e.getModel();
    if (!tm || tm.getValue() === value || echoes.current.has(value)) return;
    echoes.current.clear();
    applying.current = true;
    tm.pushEditOperations([], [{ range: tm.getFullModelRange(), text: value }], () => null);
    applying.current = false;
  }, [value, state]);
  useEffect(() => { ed.current?.updateOptions({ readOnly }); }, [readOnly, state]);
  useEffect(() => { mon.current?.editor.setTheme(dark ? 'ctw-sql-dark' : 'ctw-sql-light'); }, [dark, state]);

  // Lỗi / cảnh báo ⇒ marker đúng chỗ.
  useEffect(() => {
    const e = ed.current; const m = mon.current;
    const tm = e?.getModel();
    if (!e || !m || !tm) return;
    const sev = (s: Problem['severity']) => (s === 'error' ? m.MarkerSeverity.Error : s === 'warning' ? m.MarkerSeverity.Warning : m.MarkerSeverity.Info);
    m.editor.setModelMarkers(tm, 'ctw-sql', problems.filter((p) => p.span).slice(0, 400).map((p) => {
      const s = p.span!;
      const msg = locale === 'vi' ? p.message.vi : p.message.en;
      const why = p.why ? `\n\n${locale === 'vi' ? p.why.vi : p.why.en}` : '';
      return { severity: sev(p.severity), message: msg + why, code: p.code, startLineNumber: s.line, startColumn: s.col, endLineNumber: s.endLine, endColumn: Math.max(s.endCol + (s.endLine === s.line && s.endCol <= s.col ? 1 : 0), s.col + 1) };
    }));
  }, [problems, locale, state]);

  // Tô nền đoạn đang chọn
  useEffect(() => {
    const m = mon.current;
    if (!deco.current || !m) return;
    deco.current.set(highlight ? [{ range: new m.Range(highlight.line, 1, highlight.endLine, 1), options: { isWholeLine: true, className: 'ctw-sql-hl-line', linesDecorationsClassName: 'ctw-sql-hl-gutter' } }] : []);
  }, [highlight, state]);

  useImperativeHandle(ref, () => ({
    reveal(span, opts) {
      const e = ed.current; const m = mon.current;
      if (e && m) {
        e.revealLinesInCenterIfOutsideViewport(span.line, span.endLine);
        if (opts?.select) e.setSelection(new m.Range(span.line, span.col, span.endLine, span.endCol));
        if (opts?.focus) e.focus();
        return;
      }
      const el = ta.current;
      if (el) { el.focus(); el.setSelectionRange(span.start, span.end); const lh = 20; el.scrollTop = Math.max(0, (span.line - 4) * lh); }
    },
    focus() { if (ed.current) ed.current.focus(); else ta.current?.focus(); },
  }), []);

  if (state === 'fallback') {
    const lines = value.split('\n').length;
    const bad = new Set(problems.filter((p) => p.severity === 'error' && p.span).map((p) => p.span!.line));
    return (
      <div className="flex h-full min-h-0 overflow-hidden bg-[var(--w-sunken)]">
        <div aria-hidden="true" className="w-11 shrink-0 select-none overflow-hidden py-2.5 pr-2 text-right font-mono text-[12px] leading-[20px] text-[var(--w-text-3)]" id="ctw-sql-gutter">
          {Array.from({ length: lines }, (_, i) => <div key={i} className={cn(bad.has(i + 1) && 'rounded-sm bg-[var(--w-red-soft,rgba(207,52,47,0.14))] text-[var(--w-red-text)]')}>{i + 1}</div>)}
        </div>
        <textarea ref={ta} value={value} readOnly={readOnly} spellCheck={false} wrap="off" aria-label={label}
          onScroll={(e) => { const g = document.getElementById('ctw-sql-gutter'); if (g) g.scrollTop = e.currentTarget.scrollTop; }}
          onChange={(e) => onChange(e.target.value)} onSelect={(e) => onCursor?.(e.currentTarget.selectionStart)}
          className="min-h-0 flex-1 resize-none bg-transparent py-2.5 pr-3 font-mono text-[12.5px] leading-[20px] text-[var(--w-text)] outline-none" />
      </div>
    );
  }
  return (
    <div className="relative h-full min-h-0">
      <div ref={host} className="absolute inset-0" />
      {state === 'loading' && <div className="absolute inset-0 grid place-items-center text-[12.5px] text-[var(--w-text-3)]">{t('dbd.loadingEditor')}</div>}
    </div>
  );
});

export default SqlEditor;
