'use client';

/**
 * Database designer — XUẤT THIẾT KẾ: chọn hệ đích (SQL Server · PostgreSQL · MySQL 8 · SQLite · MongoDB · Mermaid ERD · DBML ·
 * JSON), tuỳ chọn (đặt tên, xoá bảng cũ để chạy lại được, tạo CSDL, chú thích, IDENTITY của PostgreSQL, chỉ mục cho khoá
 * ngoại), xem trước có tô màu, Chép / Tải tệp (SQL Server kèm BOM cho SSMS) / Đính vào thẻ.
 */

import { useMemo, useState } from 'react';
import { Copy, Download, Paperclip } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { workApi, workError } from '@/lib/work-api';
import { useWT } from '@/components/work/i18n';
import { Dialog, Spinner } from '@/components/work/ui';
import { DIALECT_LABEL, EXPORT_TARGETS, exportModel, type DbModel, type ExportTarget, type Naming } from '@/lib/sqlDesign';
import { download } from '../render';

const SQL_TARGETS: ExportTarget[] = ['sqlserver', 'postgres', 'mysql', 'sqlite'];
const PREF = 'ctw.dg.export.v1';

interface Prefs { target: ExportTarget; naming: Naming; drop: boolean; comments: boolean; pgIdentity: 'always' | 'by_default'; indexFks: boolean; createDb: boolean }
function loadPrefs(): Prefs {
  const d: Prefs = { target: 'postgres', naming: 'keep', drop: true, comments: true, pgIdentity: 'always', indexFks: false, createDb: false };
  try { return { ...d, ...(JSON.parse(window.localStorage.getItem(PREF) ?? '{}') as Partial<Prefs>) }; } catch { return d; }
}

/** Tô màu nhẹ cho xem trước (không cần Monaco thứ hai). */
function highlight(text: string, target: ExportTarget): Array<{ s: string; c?: string }> {
  const out: Array<{ s: string; c?: string }> = [];
  const re = target === 'mongodb' || target === 'json'
    ? /(\/\/[^\n]*)|("(?:[^"\\\n]|\\.)*")|(\b(?:db|const|for|of|true|false|null|print)\b)|(\b\d+(?:\.\d+)?\b)/g
    : /(--[^\n]*|\/\*[\s\S]*?\*\/|%%[^\n]*)|(N?'(?:[^'\n]|'')*')|(\b(?:CREATE|TABLE|ALTER|ADD|DROP|IF|EXISTS|NOT|NULL|PRIMARY|FOREIGN|KEY|REFERENCES|UNIQUE|CHECK|CONSTRAINT|DEFAULT|INDEX|ON|WHERE|AND|OR|IN|SET|GO|USE|DATABASE|IDENTITY|GENERATED|ALWAYS|AS|BY|AUTO_INCREMENT|AUTOINCREMENT|CASCADE|COMMENT|IS|CASE|WHEN|THEN|END|BETWEEN|LIKE|INCLUDE|ENGINE|CHARSET|COLLATE|Table|Ref|Project|Note|indexes|erDiagram)\b)|(\b\d+(?:\.\d+)?\b)/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    const i = m.index ?? 0;
    if (i > last) out.push({ s: text.slice(last, i) });
    out.push({ s: m[0], c: m[1] ? 'c' : m[2] ? 's' : m[3] ? 'k' : 'n' });
    last = i + m[0].length;
  }
  if (last < text.length) out.push({ s: text.slice(last) });
  return out;
}
const COLOR: Record<string, string> = { c: 'text-[var(--w-text-3)] italic', s: 'text-[var(--w-green-text)]', k: 'text-[var(--w-accent-text)] font-medium', n: 'text-[var(--w-yellow-text)]' };

export default function ExportDialog({ open, onClose, model, title, pid, issueNumber }: { open: boolean; onClose: () => void; model: DbModel; title: string; pid: number; issueNumber?: number | null }) {
  const { t, locale } = useWT();
  const [p, setP] = useState<Prefs>(loadPrefs);
  const [db, setDb] = useState(model.database ?? '');
  const [issue, setIssue] = useState(issueNumber ? String(issueNumber) : '');
  const [attaching, setAttaching] = useState(false);
  const set = (x: Partial<Prefs>) => setP((o) => { const n = { ...o, ...x }; try { window.localStorage.setItem(PREF, JSON.stringify(n)); } catch { /* */ } return n; });
  const isSql = SQL_TARGETS.includes(p.target);
  const out = useMemo(() => {
    if (!open) return null;
    try {
      return exportModel(model, {
        target: p.target, naming: p.naming, drop: p.drop, comments: p.comments, pgIdentity: p.pgIdentity, indexForeignKeys: p.indexFks,
        database: p.createDb ? db.trim() || null : null, title, lang: locale === 'vi' ? 'vi' : 'en',
      });
    } catch (e) { return { text: `-- ${(e as Error).message}`, fileName: 'export.txt', mime: 'text/plain', ext: 'txt', notes: [], bom: false }; }
  }, [open, model, p, db, title, locale]);
  const parts = useMemo(() => (out && out.text.length < 400_000 ? highlight(out.text, p.target) : null), [out, p.target]);
  const blob = () => new Blob([(out!.bom ? '﻿' : '') + out!.text], { type: `${out!.mime};charset=utf-8` });
  const attach = async () => {
    const n = Number(issue);
    if (!out || !Number.isInteger(n) || n <= 0) { toast.error(t('dbd.attachNeedIssue')); return; }
    setAttaching(true);
    try {
      await workApi.uploadAttachment(pid, n, new File([blob()], out.fileName, { type: out.mime }));
      toast.success(t('dbd.attached', { file: out.fileName, n }));
    } catch (e) { toast.error(workError(e, t('dbd.attachFailed'))); } finally { setAttaching(false); }
  };
  if (!open || !out) return null;
  const lines = out.text.split('\n').length;
  return (
    <Dialog open={open} onClose={onClose} width={1040} title={t('dbd.exportTitle', { count: model.tables.length })}
      footer={<>
        <span className="mr-auto self-center text-[12px] text-[var(--w-text-3)]">{out.fileName} · {t('dbd.linesN', { count: lines })}</span>
        <button type="button" className="w-btn" onClick={() => { void navigator.clipboard.writeText(out.text).then(() => toast.success(t('dbd.copied'))); }}><Copy size={13} /> {t('dbd.copy')}</button>
        <button type="button" className="w-btn w-btn-primary" onClick={() => download(blob(), out.fileName)}><Download size={13} /> {t('dbd.download')}</button>
      </>}>
      <div role="tablist" aria-label={t('dbd.target')} className="mb-3 flex flex-wrap gap-1">
        {EXPORT_TARGETS.map((k) => (
          <button key={k} type="button" role="tab" aria-selected={p.target === k} onClick={() => set({ target: k })}
            className={cn('rounded-[6px] border px-2.5 py-1 text-[12.5px]', p.target === k ? 'border-[var(--w-accent)] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]' : 'border-[var(--w-border)] hover:bg-[var(--w-hover)]')}>{DIALECT_LABEL[k]}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[250px_minmax(0,1fr)]">
        <div className="flex flex-col gap-2.5 text-[12.5px]">
          {(isSql || p.target === 'mongodb') && (
            <>
              {isSql && (
                <label className="flex flex-col gap-1"><span className="font-medium">{t('dbd.naming')}</span>
                  <select className="w-input" value={p.naming} onChange={(e) => set({ naming: e.target.value as Naming })}>
                    <option value="keep">{t('dbd.namingKeep')}</option><option value="snake">{t('dbd.namingSnake')}</option><option value="lower">{t('dbd.namingLower')}</option>
                  </select>
                  {p.target === 'postgres' && p.naming === 'keep' && model.tables.some((x) => /[A-Z]/.test(x.name)) && <span className="text-[11.5px] text-[var(--w-text-3)]">{t('dbd.pgQuoteHint')}</span>}
                </label>
              )}
              <label className="flex items-start gap-2"><input type="checkbox" className="mt-0.5" checked={p.drop} onChange={(e) => set({ drop: e.target.checked })} /><span>{t('dbd.optDrop')}<span className="block text-[11.5px] text-[var(--w-red-text)]">{t('dbd.optDropWarn')}</span></span></label>
              <label className="flex items-start gap-2"><input type="checkbox" className="mt-0.5" checked={p.createDb} onChange={(e) => set({ createDb: e.target.checked })} /><span>{t('dbd.optDb')}</span></label>
              {p.createDb && <input className="w-input" value={db} onChange={(e) => setDb(e.target.value)} placeholder="NhaTroSV" aria-label={t('dbd.dbName')} maxLength={80} />}
              {isSql && <label className="flex items-start gap-2"><input type="checkbox" className="mt-0.5" checked={p.comments} onChange={(e) => set({ comments: e.target.checked })} /><span>{t('dbd.optComments')}</span></label>}
              {isSql && <label className="flex items-start gap-2"><input type="checkbox" className="mt-0.5" checked={p.indexFks} onChange={(e) => set({ indexFks: e.target.checked })} /><span>{t('dbd.optIndexFks')}</span></label>}
              {p.target === 'postgres' && (
                <label className="flex flex-col gap-1"><span className="font-medium">IDENTITY</span>
                  <select className="w-input" value={p.pgIdentity} onChange={(e) => set({ pgIdentity: e.target.value as Prefs['pgIdentity'] })}>
                    <option value="always">GENERATED ALWAYS — {t('dbd.pgAlways')}</option><option value="by_default">GENERATED BY DEFAULT — {t('dbd.pgByDefault')}</option>
                  </select>
                </label>
              )}
            </>
          )}
          <p className="rounded-[8px] border border-[var(--w-border)] bg-[var(--w-sunken)] p-2 text-[12px] leading-relaxed text-[var(--w-text-2)]">{t(`dbd.about_${p.target}`)}</p>
          {out.notes.length > 0 && (
            <div className="rounded-[8px] border border-[var(--w-yellow-border,rgba(154,116,16,0.4))] bg-[var(--w-yellow-soft,rgba(154,116,16,0.08))] p-2">
              <p className="mb-1 text-[12px] font-semibold text-[var(--w-yellow-text)]">{t('dbd.notesN', { count: out.notes.length })}</p>
              <ul className="max-h-[180px] list-disc space-y-0.5 overflow-y-auto pl-4 text-[11.5px] leading-snug">{out.notes.map((n, i) => <li key={i}>{locale === 'vi' ? n.vi : n.en}</li>)}</ul>
            </div>
          )}
          <div className="flex flex-col gap-1 border-t border-[var(--w-border)] pt-2">
            <span className="font-medium">{t('dbd.attachTitle')}</span>
            <div className="flex gap-1.5">
              <input className="w-input w-24" inputMode="numeric" value={issue} onChange={(e) => setIssue(e.target.value.replace(/\D/g, ''))} placeholder="#" aria-label={t('dbd.issueNumber')} />
              <button type="button" className="w-btn w-btn-sm" disabled={attaching || !issue} onClick={() => void attach()}>{attaching ? <Spinner size={12} /> : <Paperclip size={13} />} {t('dbd.attach')}</button>
            </div>
            <span className="text-[11px] text-[var(--w-text-3)]">{t('dbd.attachHint')}</span>
          </div>
        </div>
        <pre className="ctw-dbd-pre max-h-[62vh] min-h-[320px] overflow-auto rounded-[8px] border border-[var(--w-border)] bg-[var(--w-sunken)] p-3 font-mono text-[12px] leading-[18px]" tabIndex={0} aria-label={t('dbd.preview')}>
          {parts ? parts.map((x, i) => (x.c ? <span key={i} className={COLOR[x.c]}>{x.s}</span> : x.s)) : out.text}
        </pre>
      </div>
    </Dialog>
  );
}
