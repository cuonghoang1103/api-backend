'use client';

/**
 * Tab "Chat notifications" — đổ thông báo dự án vào kênh chat của nhóm
 * (Discord / Slack / Google Chat) qua incoming webhook. Chỉ ADMIN dự án thấy tab
 * này; URL webhook là bí mật nên server chỉ trả bản che (discord.com/…abcd).
 * Zalo không có incoming webhook công khai ⇒ không có trong danh sách.
 */

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { MessageSquareShare, Plus, Send, Trash2 } from 'lucide-react';
import { workApi, workError, type ChatHook, type ChatHookEvent, type ChatHookKind, type ProjectConfig } from '@/lib/work-api';
import { cn } from '@/lib/utils';
import { wk } from '../hooks';
import { relativeTime, Spinner } from '../ui';
import { ConfirmDialog, Section, Select, Switch } from './shared';
import { wt } from '@/components/work/i18n';

const KINDS: Array<{ kind: ChatHookKind; label: string; how: string; placeholder: string }> = [
  { kind: 'DISCORD', label: 'Discord', get how() { return wt('pchat.howDiscord'); }, placeholder: 'https://discord.com/api/webhooks/…' },
  { kind: 'SLACK', label: 'Slack', get how() { return wt('pchat.howSlack'); }, placeholder: 'https://hooks.slack.com/services/…' },
  { kind: 'GOOGLE_CHAT', label: 'Google Chat', get how() { return wt('pchat.howGchat'); }, placeholder: 'https://chat.googleapis.com/v1/spaces/…/messages?key=…' },
];
const EVENTS: Array<{ ev: ChatHookEvent; label: string }> = [
  { ev: 'issue.created', get label() { return wt('pchat.evCreated'); } },
  { ev: 'issue.assigned', get label() { return wt('pchat.evAssigned'); } },
  { ev: 'issue.done', get label() { return wt('pchat.evDone'); } },
  { ev: 'comment.created', get label() { return wt('pchat.evComment'); } },
];
const kindLabel = (k: ChatHookKind) => KINDS.find((x) => x.kind === k)?.label ?? k;

function EventChips({ value, onChange, disabled }: { value: ChatHookEvent[]; onChange: (v: ChatHookEvent[]) => void; disabled?: boolean }) {
  return (
    <div className="flex flex-wrap gap-1.5" role="group" aria-label={wt('pchat.whichEvents')}>
      {EVENTS.map(({ ev, label }) => {
        const on = value.includes(ev);
        return (
          <button key={ev} type="button" disabled={disabled} aria-pressed={on}
            onClick={() => onChange(on ? value.filter((x) => x !== ev) : [...value, ev])}
            className={cn('inline-flex h-7 items-center rounded-full border px-2.5 text-[12.5px]', on ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]' : 'border-[var(--w-border)] text-[var(--w-text-2)] hover:bg-[var(--w-hover)]')}>
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default function ProjectChat({ config }: { config: ProjectConfig; slug: string }) {
  const pid = config.id;
  const qc = useQueryClient();
  const q = useQuery({ queryKey: wk.chatHooks(pid), queryFn: () => workApi.chatHooks(pid) });
  const refresh = () => qc.invalidateQueries({ queryKey: wk.chatHooks(pid) });

  const [adding, setAdding] = useState(false);
  const [kind, setKind] = useState<ChatHookKind>('DISCORD');
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [events, setEvents] = useState<ChatHookEvent[]>(EVENTS.map((e) => e.ev));
  const [removing, setRemoving] = useState<ChatHook | null>(null);

  const create = useMutation({
    mutationFn: () => workApi.createChatHook(pid, { kind, url: url.trim(), name: name.trim() || undefined, events }),
    onSuccess: async (h) => {
      toast.success(wt('pchat.added', { k: kindLabel(h.kind) }));
      setAdding(false); setUrl(''); setName('');
      refresh();
      try { await workApi.testChatHook(pid, h.id); toast.success(wt('pchat.testSent')); } catch (err) { toast.error(workError(err, wt('pchat.testFailed'))); refresh(); }
    },
    onError: (err) => toast.error(workError(err, wt('pchat.addFailed'))),
  });
  const update = useMutation({
    mutationFn: ({ id, body }: { id: number; body: { events?: ChatHookEvent[]; enabled?: boolean } }) => workApi.updateChatHook(pid, id, body),
    onSuccess: () => refresh(),
    onError: (err) => toast.error(workError(err, wt('common.couldNotSave'))),
  });
  const test = useMutation({
    mutationFn: (id: number) => workApi.testChatHook(pid, id),
    onSuccess: () => { toast.success(wt('pchat.testSent')); refresh(); },
    onError: (err) => { toast.error(workError(err, wt('pchat.testFailed'))); refresh(); },
  });
  const remove = useMutation({
    mutationFn: (id: number) => workApi.deleteChatHook(pid, id),
    onSuccess: () => { setRemoving(null); toast.success(wt('pchat.removed')); refresh(); },
    onError: (err) => toast.error(workError(err, wt('pchat.removeFailed'))),
  });

  const pick = KINDS.find((k) => k.kind === kind)!;

  return (
    <>
      <Section
        title={wt('pchat.title')}
        description={wt('pchat.desc')}
        action={!adding && <button type="button" className="w-btn w-btn-sm w-btn-primary" onClick={() => setAdding(true)}><Plus size={13} /> {wt('pchat.addChannel')}</button>}
      >
        {adding && (
          <form className="mb-4 max-w-[640px] space-y-3 rounded-[8px] border border-[var(--w-border)] p-4" onSubmit={(e) => { e.preventDefault(); if (url.trim() && events.length && !create.isPending) create.mutate(); }}>
            <div className="flex flex-wrap gap-2">
              <Select id="chat-kind" value={kind} onChange={(e) => setKind(e.target.value as ChatHookKind)} aria-label={wt('pchat.service')} className="w-[180px]">
                {KINDS.map((k) => <option key={k.kind} value={k.kind}>{k.label}</option>)}
              </Select>
              <input id="chat-name" className="w-input min-w-0 flex-1" placeholder={wt('pchat.namePh')} maxLength={80} value={name} onChange={(e) => setName(e.target.value)} aria-label={wt('pchat.channelName')} />
            </div>
            <p className="text-[12.5px] leading-relaxed text-[var(--w-text-2)]">{pick.how}</p>
            <input id="chat-url" className="w-input w-full font-mono !text-[12px]" placeholder={pick.placeholder} value={url} onChange={(e) => setUrl(e.target.value)} aria-label={wt('pchat.webhookUrl')} spellCheck={false} autoComplete="off" required />
            <div>
              <div className="mb-1.5 text-[12.5px] font-medium">{wt('pchat.send')}</div>
              <EventChips value={events} onChange={setEvents} />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="w-btn w-btn-primary" disabled={!url.trim() || !events.length || create.isPending}>{create.isPending && <Spinner size={12} />} {wt('pchat.addTest')}</button>
              <button type="button" className="w-btn" onClick={() => setAdding(false)}>{wt('common.cancel')}</button>
            </div>
            <p className="text-[11.5px] text-[var(--w-text-3)]">{wt('pchat.password')}</p>
          </form>
        )}

        {q.isLoading ? (
          <div className="flex justify-center py-6"><Spinner /></div>
        ) : q.isError ? (
          <p className="text-[13px] text-[var(--w-red)]">{workError(q.error, wt('pchat.loadFailed'))}</p>
        ) : !q.data?.length && !adding ? (
          <div className="max-w-[640px] rounded-[8px] border border-dashed border-[var(--w-border-strong)] px-4 py-6 text-center text-[13px] text-[var(--w-text-2)]">
            <MessageSquareShare size={20} className="mx-auto mb-2 text-[var(--w-text-3)]" />
            {wt('pchat.noChannels')}
          </div>
        ) : (
          <ul className="max-w-[720px] space-y-2.5">
            {q.data?.map((h) => (
              <li key={h.id} className="rounded-[8px] border border-[var(--w-border)] p-3.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-[4px] bg-[var(--w-sunken)] px-1.5 py-0.5 text-[11px] font-semibold">{kindLabel(h.kind)}</span>
                  <span className="text-[13.5px] font-medium">{h.name}</span>
                  <span className="font-mono text-[11.5px] text-[var(--w-text-3)]">{h.urlMasked}</span>
                  <span className="ml-auto flex items-center gap-2">
                    <Switch checked={h.enabled} label={wt('pchat.sendTo', { n: h.name })} disabled={update.isPending} onChange={(v) => update.mutate({ id: h.id, body: { enabled: v } })} />
                    <button type="button" className="w-btn w-btn-sm" disabled={test.isPending} onClick={() => test.mutate(h.id)}><Send size={12} /> {wt('agents.test')}</button>
                    <button type="button" className="w-btn w-btn-sm w-btn-ghost w-btn-icon" onClick={() => setRemoving(h)} aria-label={wt('chat.removeX', { name: h.name })}><Trash2 size={13} /></button>
                  </span>
                </div>
                <div className="mt-2.5"><EventChips value={h.events} disabled={update.isPending} onChange={(v) => update.mutate({ id: h.id, body: { events: v } })} /></div>
                <div className="mt-2 text-[12px]">
                  {h.lastError
                    ? <span className="text-[var(--w-red)]">{wt('pchat.lastFailed')} {h.lastError}</span>
                    : h.lastSentAt ? <span className="text-[var(--w-text-3)]">{wt('pchat.lastSent', { t: relativeTime(h.lastSentAt) })}</span>
                    : <span className="text-[var(--w-text-3)]">{wt('pchat.nothingSent')}</span>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title={wt('pchat.whatPosted')} description={wt('pchat.whatPostedDesc')}>
        <></>
      </Section>

      <ConfirmDialog open={!!removing} onClose={() => setRemoving(null)} title={wt('pchat.removeQ', { n: removing?.name ?? wt('pchat.thisChannel') })}
        body={wt('pchat.removeBody')}
        confirmLabel={wt('common.remove')} pending={remove.isPending} onConfirm={() => removing && remove.mutate(removing.id)} />
    </>
  );
}
