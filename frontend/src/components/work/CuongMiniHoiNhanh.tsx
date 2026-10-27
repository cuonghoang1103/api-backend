'use client';

/**
 * CT Work 27/10/2026 — thẻ nhỏ "CuongMini hỏi nhanh": ≤ 3 thẻ CỦA BẠN trông như đã xong (PR đã merge, commit lên nhánh
 * chính, checklist / thẻ con xong, thẻ cơ bản nằm im lâu) ⇒ "Chuyển sang …?" [Có, chuyển] [Chưa]. Có ⇒ server chuyển dưới
 * quyền của bạn + bình luận nội bộ kèm bằng chứng (ghi chú / ảnh tuỳ chọn). Chưa ⇒ hoãn 3 ngày. Không có gì ⇒ không hiện.
 * `pid` có ⇒ gợi ý của một dự án (đầu Board/Backlog); không ⇒ mọi dự án (Việc của tôi).
 */

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowRight, ImagePlus, Sparkles } from 'lucide-react';
import { workError } from '@/lib/work-api';
import { workCommentsApi } from '@/lib/work-comments-api';
import { nudgeKeys, nudgesApi, type StatusSuggestion } from '@/lib/work-nudges-api';
import { Spinner } from './ui';
import { wt } from '@/components/work/i18n';

function Row({ s, pid, href, onDone }: { s: StatusSuggestion; pid: number; href: string; onDone: (msg: string) => void }) {
  const [busy, setBusy] = useState<'yes' | 'no' | null>(null);
  const [proof, setProof] = useState(false);
  const [note, setNote] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const yes = async () => {
    setBusy('yes');
    setError(null);
    try {
      const ids: number[] = [];
      for (const f of files.slice(0, 5)) ids.push((await workCommentsApi.uploadFile(pid, s.issue.number, f)).id);
      const r = await nudgesApi.apply(pid, s.issue.number, { note: note.trim() || null, attachmentIds: ids });
      onDone(wt('home.nudgeMoved', { key: r.issue, to: r.to }));
    } catch (err) {
      setError(workError(err, wt('home.nudgeFailed')));
      setBusy(null);
    }
  };
  const no = async () => {
    setBusy('no');
    try {
      await nudgesApi.snooze(pid, s.issue.number);
      onDone('');
    } catch (err) {
      setError(workError(err, wt('home.nudgeFailed')));
      setBusy(null);
    }
  };

  return (
    <li className="px-3 py-2.5">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px]">
        <Link href={href} className="font-mono text-[12px] text-[var(--w-accent-text)] hover:underline">{s.issue.key}</Link>
        <span className="min-w-0 flex-1 truncate font-medium" title={s.issue.title}>{s.issue.title}</span>
      </div>
      <p className="mt-0.5 text-[12.5px] text-[var(--w-text-2)]">
        {s.reason}{' '}
        <span className="inline-flex items-center gap-1 font-medium text-[var(--w-text)]">
          {s.from.name} <ArrowRight size={11} aria-hidden="true" /> {s.to.name}
        </span>
      </p>
      {s.evidence.length > 0 && (
        <ul className="mt-1 space-y-0.5">
          {s.evidence.slice(0, 3).map((e, i) => (
            <li key={i} className="truncate text-[11.5px] text-[var(--w-text-3)]">
              {e.url ? <a href={e.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{e.label}</a> : e.label}
            </li>
          ))}
        </ul>
      )}
      {proof && (
        <div className="mt-2 space-y-1.5">
          <textarea value={note} onChange={(e) => setNote(e.target.value)} maxLength={2000} rows={2} placeholder={wt('home.nudgeNotePh')} className="w-input w-full text-[12.5px]" />
          <div className="flex flex-wrap items-center gap-2 text-[11.5px] text-[var(--w-text-2)]">
            <button type="button" className="w-btn h-7 px-2 text-[12px]" onClick={() => fileRef.current?.click()}><ImagePlus size={12} /> {wt('home.nudgeAttach')}</button>
            <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => setFiles([...(e.target.files ?? [])].slice(0, 5))} />
            {files.map((f) => <span key={f.name} className="truncate">{f.name}</span>)}
          </div>
        </div>
      )}
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="text-[12px] text-[var(--w-text-2)]">{s.question ? wt('home.nudgeDoneQ', { to: s.to.name }) : wt('home.nudgeMove', { to: s.to.name })}</span>
        <button type="button" className="w-btn w-btn-primary h-7 px-2.5 text-[12px]" onClick={yes} disabled={!!busy}>{busy === 'yes' ? <Spinner size={10} /> : null}{wt('home.nudgeYes')}</button>
        <button type="button" className="w-btn h-7 px-2.5 text-[12px]" onClick={no} disabled={!!busy}>{busy === 'no' ? <Spinner size={10} /> : null}{wt('home.nudgeNotYet')}</button>
        {!proof && <button type="button" className="text-[12px] text-[var(--w-accent-text)] hover:underline" onClick={() => setProof(true)}>{wt('home.nudgeAddProof')}</button>}
      </div>
      {error && <p className="mt-1 text-[11.5px] text-[var(--w-red-text)]" role="alert">{error}</p>}
    </li>
  );
}

export default function CuongMiniHoiNhanh({ pid, slug, projectKey, className }: { pid?: number; slug?: string; projectKey?: string; className?: string }) {
  const qc = useQueryClient();
  const [msg, setMsg] = useState('');
  const q = useQuery({
    queryKey: pid ? nudgeKeys.project(pid) : nudgeKeys.mine,
    queryFn: async () => (pid ? (await nudgesApi.project(pid, 3)).items : (await nudgesApi.mine(3)).items),
    staleTime: 60_000, retry: false,
  });
  const items = q.data ?? [];
  if (!items.length && !msg) return null;

  const done = (m: string) => {
    setMsg(m);
    void qc.invalidateQueries({ queryKey: ['work'] });
  };
  return (
    <section className={className ?? 'w-card overflow-hidden'} aria-label={wt('home.nudgeTitle')}>
      <div className="flex items-center gap-1.5 border-b border-[var(--w-border)] px-3 py-2 text-[12.5px] font-semibold">
        <Sparkles size={13} className="text-[var(--w-accent-text)]" aria-hidden="true" /> {wt('home.nudgeTitle')}
        {msg && <span className="ml-auto truncate text-[12px] font-normal text-[var(--w-green)]">{msg}</span>}
      </div>
      <ul className="divide-y divide-[var(--w-border)]">
        {items.map((s) => {
          const p = s.project ?? (pid && slug && projectKey ? { id: pid, slug, key: projectKey } : null);
          if (!p) return null;
          return <Row key={`${p.id}:${s.issue.number}`} s={s} pid={p.id} href={`/work/${p.slug}/${p.key}/issue/${s.issue.number}`} onDone={done} />;
        })}
      </ul>
    </section>
  );
}
