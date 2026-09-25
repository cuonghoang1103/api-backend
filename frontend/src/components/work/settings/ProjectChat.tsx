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

const KINDS: Array<{ kind: ChatHookKind; label: string; how: string; placeholder: string }> = [
  { kind: 'DISCORD', label: 'Discord', how: 'In Discord: Server settings → Integrations → Webhooks → New Webhook → pick the channel → Copy Webhook URL.', placeholder: 'https://discord.com/api/webhooks/…' },
  { kind: 'SLACK', label: 'Slack', how: 'In Slack: create an app at api.slack.com/apps → Incoming Webhooks → On → Add New Webhook to Workspace → pick the channel → copy the URL.', placeholder: 'https://hooks.slack.com/services/…' },
  { kind: 'GOOGLE_CHAT', label: 'Google Chat', how: 'In Google Chat: open the space → Apps & integrations → Webhooks → Add webhook → copy the URL.', placeholder: 'https://chat.googleapis.com/v1/spaces/…/messages?key=…' },
];
const EVENTS: Array<{ ev: ChatHookEvent; label: string }> = [
  { ev: 'issue.created', label: 'New issues' },
  { ev: 'issue.assigned', label: 'Assignments' },
  { ev: 'issue.done', label: 'Moved to Done' },
  { ev: 'comment.created', label: 'New comments' },
];
const kindLabel = (k: ChatHookKind) => KINDS.find((x) => x.kind === k)?.label ?? k;

function EventChips({ value, onChange, disabled }: { value: ChatHookEvent[]; onChange: (v: ChatHookEvent[]) => void; disabled?: boolean }) {
  return (
    <div className="flex flex-wrap gap-1.5" role="group" aria-label="Which events to send">
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
      toast.success(`${kindLabel(h.kind)} channel added — sending a test message…`);
      setAdding(false); setUrl(''); setName('');
      refresh();
      try { await workApi.testChatHook(pid, h.id); toast.success('Test message sent. Check your channel.'); } catch (err) { toast.error(workError(err, 'The test message failed')); refresh(); }
    },
    onError: (err) => toast.error(workError(err, 'Could not add this channel')),
  });
  const update = useMutation({
    mutationFn: ({ id, body }: { id: number; body: { events?: ChatHookEvent[]; enabled?: boolean } }) => workApi.updateChatHook(pid, id, body),
    onSuccess: () => refresh(),
    onError: (err) => toast.error(workError(err, 'Could not save')),
  });
  const test = useMutation({
    mutationFn: (id: number) => workApi.testChatHook(pid, id),
    onSuccess: () => { toast.success('Test message sent. Check your channel.'); refresh(); },
    onError: (err) => { toast.error(workError(err, 'The test message failed')); refresh(); },
  });
  const remove = useMutation({
    mutationFn: (id: number) => workApi.deleteChatHook(pid, id),
    onSuccess: () => { setRemoving(null); toast.success('Channel removed'); refresh(); },
    onError: (err) => toast.error(workError(err, 'Could not remove this channel')),
  });

  const pick = KINDS.find((k) => k.kind === kind)!;

  return (
    <>
      <Section
        title="Chat notifications"
        description="Post project updates to your team’s chat so nobody has to keep CT Work open. Zalo has no public webhook, so it can’t be connected — Discord is the easiest alternative."
        action={!adding && <button type="button" className="w-btn w-btn-sm w-btn-primary" onClick={() => setAdding(true)}><Plus size={13} /> Add channel</button>}
      >
        {adding && (
          <form className="mb-4 max-w-[640px] space-y-3 rounded-[8px] border border-[var(--w-border)] p-4" onSubmit={(e) => { e.preventDefault(); if (url.trim() && events.length && !create.isPending) create.mutate(); }}>
            <div className="flex flex-wrap gap-2">
              <Select id="chat-kind" value={kind} onChange={(e) => setKind(e.target.value as ChatHookKind)} aria-label="Chat service" className="w-[180px]">
                {KINDS.map((k) => <option key={k.kind} value={k.kind}>{k.label}</option>)}
              </Select>
              <input id="chat-name" className="w-input min-w-0 flex-1" placeholder="Name (e.g. #swp391-team)" maxLength={80} value={name} onChange={(e) => setName(e.target.value)} aria-label="Channel name" />
            </div>
            <p className="text-[12.5px] leading-relaxed text-[var(--w-text-2)]">{pick.how}</p>
            <input id="chat-url" className="w-input w-full font-mono !text-[12px]" placeholder={pick.placeholder} value={url} onChange={(e) => setUrl(e.target.value)} aria-label="Webhook URL" spellCheck={false} autoComplete="off" required />
            <div>
              <div className="mb-1.5 text-[12.5px] font-medium">Send</div>
              <EventChips value={events} onChange={setEvents} />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="w-btn w-btn-primary" disabled={!url.trim() || !events.length || create.isPending}>{create.isPending && <Spinner size={12} />} Add and send a test</button>
              <button type="button" className="w-btn" onClick={() => setAdding(false)}>Cancel</button>
            </div>
            <p className="text-[11.5px] text-[var(--w-text-3)]">Treat the webhook URL like a password — anyone who has it can post to your channel. Only project admins can see this page.</p>
          </form>
        )}

        {q.isLoading ? (
          <div className="flex justify-center py-6"><Spinner /></div>
        ) : q.isError ? (
          <p className="text-[13px] text-[var(--w-red)]">{workError(q.error, 'Could not load the chat channels')}</p>
        ) : !q.data?.length && !adding ? (
          <div className="max-w-[640px] rounded-[8px] border border-dashed border-[var(--w-border-strong)] px-4 py-6 text-center text-[13px] text-[var(--w-text-2)]">
            <MessageSquareShare size={20} className="mx-auto mb-2 text-[var(--w-text-3)]" />
            No channels yet. Add one to get new issues, assignments, finished work and comments in Discord, Slack or Google Chat.
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
                    <Switch checked={h.enabled} label={`Send to ${h.name}`} disabled={update.isPending} onChange={(v) => update.mutate({ id: h.id, body: { enabled: v } })} />
                    <button type="button" className="w-btn w-btn-sm" disabled={test.isPending} onClick={() => test.mutate(h.id)}><Send size={12} /> Test</button>
                    <button type="button" className="w-btn w-btn-sm w-btn-ghost w-btn-icon" onClick={() => setRemoving(h)} aria-label={`Remove ${h.name}`}><Trash2 size={13} /></button>
                  </span>
                </div>
                <div className="mt-2.5"><EventChips value={h.events} disabled={update.isPending} onChange={(v) => update.mutate({ id: h.id, body: { events: v } })} /></div>
                <div className="mt-2 text-[12px]">
                  {h.lastError
                    ? <span className="text-[var(--w-red)]">Last delivery failed: {h.lastError}</span>
                    : h.lastSentAt ? <span className="text-[var(--w-text-3)]">Last message sent {relativeTime(h.lastSentAt)}</span>
                    : <span className="text-[var(--w-text-3)]">Nothing sent yet</span>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="What gets posted" description="Each message links straight to the issue. Changes made by imports or the system are not posted, and each channel is capped at 30 messages a minute so bulk edits don’t flood it. Mentions like @everyone in issue titles never ping anyone.">
        <></>
      </Section>

      <ConfirmDialog open={!!removing} onClose={() => setRemoving(null)} title={`Remove ${removing?.name ?? 'this channel'}?`}
        body="CT Work stops posting to this channel. You can add it again later with the same webhook URL."
        confirmLabel="Remove" pending={remove.isPending} onConfirm={() => removing && remove.mutate(removing.id)} />
    </>
  );
}
