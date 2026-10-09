'use client';

/**
 * Hộp thoại + menu của kênh chat: tắt tiếng (theo kênh / toàn bộ), cài đặt chat, tạo kênh, thành viên kênh riêng,
 * chuyển tiếp, tạo thẻ từ tin, chia sẻ vào kênh (dùng ở thẻ / Docs / họp).
 */

import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Bell, BellOff, Check, Hash, Lock, MessagesSquare, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { userName, workError, type ProjectConfig } from '@/lib/work-api';
import { chatApi, chatKeys, type ChannelKind, type ChatChannel, type ChatMessage, type MuteChoice } from '@/lib/work-chat-api';
import { muteLabel } from '@/lib/work-chat-rules';
import { Dialog, Field, Popover, Spinner, UserAvatar } from '../ui';
import { requestChatNotifications } from './ChatNotifier';

const MUTE_OPTIONS: Array<{ v: MuteChoice; label: string }> = [
  { v: '30m', label: 'For 30 minutes' },
  { v: '1h', label: 'For 1 hour' },
  { v: '8h', label: 'For 8 hours' },
  { v: 'tomorrow', label: 'Until tomorrow morning' },
  { v: 'forever', label: 'Until I turn it back on' },
  { v: 'custom', label: 'Custom…' },
];

function CustomUntil({ onPick }: { onPick: (iso: string) => void }) {
  const [v, setV] = useState(() => {
    const d = new Date(Date.now() + 2 * 3600_000);
    d.setMinutes(0, 0, 0);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  });
  return (
    <div className="flex items-center gap-1.5 px-2 pb-2">
      <label className="sr-only" htmlFor="chat-mute-until">Mute until</label>
      <input id="chat-mute-until" type="datetime-local" className="w-input h-8 flex-1" value={v} onChange={(e) => setV(e.target.value)} />
      <button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={() => v && onPick(new Date(v).toISOString())}>Set</button>
    </div>
  );
}

/** Menu tắt tiếng một kênh (+ chế độ báo). */
export function ChannelMuteMenu({ pid, ch }: { pid: number; ch: ChatChannel }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const m = useMutation({
    mutationFn: (body: { mute?: MuteChoice; until?: string | null; notify?: 'DEFAULT' | 'ALL' | 'MENTIONS' }) => chatApi.setNotify(pid, ch.id, body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: chatKeys.channels(pid) });
      void qc.invalidateQueries({ queryKey: chatKeys.unread });
    },
    onError: (err) => toast.error(workError(err, 'Could not change notifications')),
  });
  const label = muteLabel(ch.mutedUntil, ch.mutedForever);
  const set = (body: Parameters<typeof m.mutate>[0]) => { m.mutate(body); setOpen(false); setCustom(false); };
  return (
    <>
      <button
        ref={btn} type="button" className={cn('w-btn w-btn-sm w-btn-icon', ch.muted && 'w-btn-on')} aria-haspopup="menu" aria-expanded={open}
        aria-label={label ?? 'Notification settings for this channel'} title={label ?? 'Notifications'} onClick={() => setOpen((o) => !o)} data-testid="chat-mute-menu"
      >
        {ch.muted ? <BellOff size={14} /> : <Bell size={14} />}
      </button>
      <Popover open={open} onClose={() => { setOpen(false); setCustom(false); }} anchorRef={btn} width={250} align="end">
        <div role="menu" aria-label={`Notifications for #${ch.name}`} className="p-1">
          {label && <p className="px-2 pb-1 pt-1.5 text-[12px] text-[var(--w-text-2)]">{label}</p>}
          {ch.muted && (
            <button type="button" role="menuitem" className="flex h-8 w-full items-center gap-2 rounded-[6px] px-2 text-left text-[13px] font-medium hover:bg-[var(--w-hover)]" onClick={() => set({ mute: 'off' })}>
              <Bell size={14} />Unmute
            </button>
          )}
          <p className="w-eyebrow px-2 pb-0.5 pt-1.5">Mute #{ch.name}</p>
          {MUTE_OPTIONS.map((o) => (
            <button key={o.v} type="button" role="menuitem" className="flex h-8 w-full items-center gap-2 rounded-[6px] px-2 text-left text-[13px] hover:bg-[var(--w-hover)]"
              onClick={() => (o.v === 'custom' ? setCustom(true) : set({ mute: o.v }))}>
              <BellOff size={13} className="text-[var(--w-text-3)]" />{o.label}
            </button>
          ))}
          {custom && <CustomUntil onPick={(iso) => set({ mute: 'custom', until: iso })} />}
          <div className="my-1 border-t border-[var(--w-border)]" />
          <p className="w-eyebrow px-2 pb-0.5 pt-1">Notify me about</p>
          {([['DEFAULT', 'Default (chat settings)'], ['ALL', 'All new messages'], ['MENTIONS', 'Only @mentions and replies']] as const).map(([v, l]) => (
            <button key={v} type="button" role="menuitemradio" aria-checked={ch.notify === v} className="flex h-8 w-full items-center gap-2 rounded-[6px] px-2 text-left text-[13px] hover:bg-[var(--w-hover)]" onClick={() => set({ notify: v })}>
              <span className="w-4">{ch.notify === v && <Check size={13} className="text-[var(--w-accent-text)]" />}</span>{l}
            </button>
          ))}
        </div>
      </Popover>
    </>
  );
}

/** Cài đặt chat CHUNG (đồng bộ web ↔ app desktop qua máy chủ). */
export function ChatSettingsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: chatKeys.prefs, queryFn: chatApi.prefs, enabled: open });
  const [custom, setCustom] = useState(false);
  const [perm, setPerm] = useState<string>(() => (typeof Notification === 'undefined' ? 'unsupported' : Notification.permission));
  const m = useMutation({
    mutationFn: chatApi.setPrefs,
    onSuccess: (p) => { qc.setQueryData(chatKeys.prefs, p); void qc.invalidateQueries({ queryKey: chatKeys.all }); },
    onError: (err) => toast.error(workError(err, 'Could not save chat settings')),
  });
  const p = q.data;
  const label = p ? muteLabel(p.mutedUntil, p.mutedForever) : null;
  const toggle = (name: 'sound' | 'desktop' | 'emailDigest', value: boolean, text: string, hint?: string) => (
    <label className="flex items-start gap-2.5 py-1.5 text-[13.5px]">
      <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[var(--w-accent)]" checked={value} onChange={(e) => m.mutate({ [name]: e.target.checked })} />
      <span><span className="text-[var(--w-text)]">{text}</span>{hint && <span className="block text-[12px] text-[var(--w-text-3)]">{hint}</span>}</span>
    </label>
  );
  return (
    <Dialog open={open} onClose={onClose} title="Chat notifications" width={520}>
      {!p ? <div className="flex justify-center py-6"><Spinner /></div> : (
        <div className="space-y-4" data-testid="chat-settings">
          <section>
            <h3 className="w-eyebrow mb-1.5">Pause all chat notifications</h3>
            {label ? (
              <div className="flex items-center gap-2 rounded-[8px] bg-[var(--w-sunken)] px-3 py-2 text-[13px]">
                <BellOff size={14} className="text-[var(--w-text-2)]" /><span className="flex-1">{label}</span>
                <button type="button" className="w-btn w-btn-sm" onClick={() => m.mutate({ mute: 'off' })}>Resume</button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {MUTE_OPTIONS.map((o) => (
                  <button key={o.v} type="button" className="w-btn w-btn-sm" onClick={() => (o.v === 'custom' ? setCustom((c) => !c) : m.mutate({ mute: o.v }))}>{o.label}</button>
                ))}
              </div>
            )}
            {custom && !label && <div className="mt-2 -mx-2"><CustomUntil onPick={(iso) => { m.mutate({ mute: 'custom', until: iso }); setCustom(false); }} /></div>}
            <p className="mt-1.5 text-[12px] text-[var(--w-text-3)]">Unread badges keep counting while paused.</p>
          </section>
          <section>
            <h3 className="w-eyebrow mb-1.5">Notify me about</h3>
            <div className="flex gap-1.5" role="radiogroup" aria-label="Notify me about">
              {([['ALL', 'All new messages'], ['MENTIONS', 'Only @mentions and replies']] as const).map(([v, l]) => (
                <button key={v} type="button" role="radio" aria-checked={p.notify === v} className={cn('w-btn w-btn-sm', p.notify === v && 'w-btn-on')} onClick={() => m.mutate({ notify: v })}>{l}</button>
              ))}
            </div>
            <p className="mt-1.5 text-[12px] text-[var(--w-text-3)]">Each channel can override this from its bell menu.</p>
          </section>
          <section>
            <h3 className="w-eyebrow mb-1">Alerts</h3>
            {toggle('sound', p.sound, 'Play a sound for new messages', 'Turn off to keep badges and notifications but stay silent.')}
            {toggle('desktop', p.desktop, 'Show system notifications when CT Work is in the background')}
            {p.desktop && perm !== 'granted' && perm !== 'unsupported' && (
              <div className="ml-6 flex flex-wrap items-center gap-2 text-[12.5px] text-[var(--w-text-2)]">
                <span>{perm === 'denied' ? 'Notifications are blocked for this site — allow them in your browser settings.' : 'Your browser needs permission first.'}</span>
                {perm === 'default' && (
                  <button type="button" className="w-btn w-btn-sm w-btn-primary" onClick={() => void requestChatNotifications().then((r) => setPerm(r))} data-testid="chat-enable-os">Enable notifications</button>
                )}
              </div>
            )}
            {toggle('emailDigest', p.emailDigest, 'Email me a morning digest of unread chat', 'Off by default. Sent with the CT Work digest at 08:00.')}
          </section>
          <section className="rounded-[8px] bg-[var(--w-sunken)] px-3 py-2 text-[12.5px] text-[var(--w-text-2)]">
            Quiet hours: {p.quietStart !== null && p.quietEnd !== null ? `${String(p.quietStart).padStart(2, '0')}:00–${String(p.quietEnd).padStart(2, '0')}:00${p.quietNow ? ' (now)' : ''}` : 'off'} ·
            {' '}set them in My work → Notification settings (shared with email notifications).
          </section>
        </div>
      )}
    </Dialog>
  );
}

/** Tạo kênh: tên, chủ đề, loại (công khai trong đội / riêng / khách), thành viên (kênh riêng). */
export function CreateChannelDialog({ open, onClose, pid, config, canClient, onCreated }: {
  open: boolean; onClose: () => void; pid: number; config: ProjectConfig; canClient: boolean; onCreated: (id: number) => void;
}) {
  const qc = useQueryClient();
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const [kind, setKind] = useState<ChannelKind>('PUBLIC');
  const [members, setMembers] = useState<number[]>([]);
  useEffect(() => { if (open) { setName(''); setTopic(''); setKind('PUBLIC'); setMembers([]); } }, [open]);
  const team = config.members.filter((m) => m.role !== 'CLIENT');
  const m = useMutation({
    mutationFn: () => chatApi.createChannel(pid, { name, topic: topic || null, kind, memberIds: kind === 'PRIVATE' ? members : undefined }),
    onSuccess: (r) => { void qc.invalidateQueries({ queryKey: chatKeys.channels(pid) }); toast.success(`#${r.name} created`); onCreated(r.id); onClose(); },
    onError: (err) => toast.error(workError(err, 'Could not create the channel')),
  });
  const kinds: Array<{ v: ChannelKind; icon: typeof Hash; t: string; d: string; show: boolean }> = [
    { v: 'PUBLIC', icon: Hash, t: 'Public', d: 'Everyone on the project team can read and join.', show: true },
    { v: 'PRIVATE', icon: Lock, t: 'Private', d: 'Only the people you add. Clients never see it.', show: true },
    { v: 'CLIENT', icon: MessagesSquare, t: 'Client channel', d: 'Shared with the project’s clients. One per project.', show: canClient },
  ];
  return (
    <Dialog open={open} onClose={onClose} title="Create a channel" width={520}
      footer={<><button type="button" className="w-btn" onClick={onClose}>Cancel</button><button type="button" className="w-btn w-btn-primary" disabled={name.trim().length < 2 || m.isPending} onClick={() => m.mutate()}>{m.isPending ? <Spinner size={12} /> : null}Create</button></>}>
      <div className="space-y-3">
        <Field label="Name"><input className="w-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. frontend, report-3, testing" maxLength={60} autoFocus /></Field>
        <Field label="Topic (optional)"><input className="w-input" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="What is this channel about?" maxLength={250} /></Field>
        <fieldset>
          <legend className="w-label mb-1.5">Who can see it</legend>
          <div className="grid gap-1.5">
            {kinds.filter((k) => k.show).map((k) => (
              <label key={k.v} className={cn('flex cursor-pointer items-start gap-2.5 rounded-[8px] border px-3 py-2', kind === k.v ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)]' : 'border-[var(--w-border)] hover:bg-[var(--w-hover)]')}>
                <input type="radio" name="chat-kind" className="mt-1" checked={kind === k.v} onChange={() => setKind(k.v)} />
                <k.icon size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
                <span><span className="block text-[13.5px] font-medium">{k.t}</span><span className="block text-[12px] text-[var(--w-text-2)]">{k.d}</span></span>
              </label>
            ))}
          </div>
        </fieldset>
        {kind === 'PRIVATE' && (
          <fieldset>
            <legend className="w-label mb-1.5">Members</legend>
            <div className="max-h-[200px] space-y-0.5 overflow-y-auto rounded-[8px] border border-[var(--w-border)] p-1">
              {team.map((u) => (
                <label key={u.id} className="flex h-8 cursor-pointer items-center gap-2 rounded-[6px] px-2 text-[13px] hover:bg-[var(--w-hover)]">
                  <input type="checkbox" checked={members.includes(u.id)} onChange={(e) => setMembers((ms) => (e.target.checked ? [...ms, u.id] : ms.filter((x) => x !== u.id)))} />
                  <UserAvatar user={u} size={18} /><span className="truncate">{userName(u)}</span><span className="ml-auto text-[11px] text-[var(--w-text-3)]">{u.role}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}
      </div>
    </Dialog>
  );
}

/** Thành viên kênh (+ online). Kênh riêng: thêm/bớt (người tạo hoặc ADMIN). */
export function ChannelMembersDialog({ open, onClose, pid, ch, config }: { open: boolean; onClose: () => void; pid: number; ch: ChatChannel; config: ProjectConfig }) {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: chatKeys.members(pid, ch.id), queryFn: () => chatApi.members(pid, ch.id), enabled: open, refetchInterval: open ? 60_000 : false });
  const m = useMutation({
    mutationFn: (body: { add?: number[]; remove?: number[] }) => chatApi.setMembers(pid, ch.id, body),
    onSuccess: (r) => { qc.setQueryData(chatKeys.members(pid, ch.id), r); void qc.invalidateQueries({ queryKey: chatKeys.channels(pid) }); },
    onError: (err) => toast.error(workError(err, 'Could not change members')),
  });
  const list = q.data ?? [];
  const ids = new Set(list.map((u) => u.id));
  const addable = ch.kind === 'PRIVATE' && ch.canManage ? config.members.filter((u) => u.role !== 'CLIENT' && !ids.has(u.id)) : [];
  return (
    <Dialog open={open} onClose={onClose} title={<span className="inline-flex items-center gap-1.5"><Users size={15} />#{ch.name} · {list.length} {list.length === 1 ? 'member' : 'members'}</span>} width={460}>
      {q.isLoading ? <div className="flex justify-center py-6"><Spinner /></div> : (
        <div className="space-y-3">
          <ul className="max-h-[320px] space-y-0.5 overflow-y-auto" aria-label="Members">
            {list.map((u) => (
              <li key={u.id} className="flex h-9 items-center gap-2 rounded-[6px] px-1.5 text-[13px]">
                <span className="relative">
                  <UserAvatar user={u} size={24} />
                  {u.online !== null && <span className={cn('absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--w-panel)]', u.online ? 'bg-[var(--w-green)]' : 'bg-[var(--w-text-3)]')} aria-hidden="true" />}
                </span>
                <span className="min-w-0 flex-1 truncate">{userName(u)} <span className="text-[var(--w-text-3)]">@{u.username}</span></span>
                <span className="text-[11.5px] text-[var(--w-text-3)]">{u.online === null ? 'AI agent' : u.online ? 'Online' : 'Offline'}</span>
                {ch.kind === 'PRIVATE' && ch.canManage && <button type="button" className="w-btn w-btn-ghost w-btn-sm h-7" onClick={() => m.mutate({ remove: [u.id] })}>Remove</button>}
              </li>
            ))}
          </ul>
          {addable.length > 0 && (
            <div>
              <p className="w-eyebrow mb-1">Add people</p>
              <div className="flex flex-wrap gap-1.5">
                {addable.map((u) => <button key={u.id} type="button" className="w-btn w-btn-sm" onClick={() => m.mutate({ add: [u.id] })}><UserAvatar user={u} size={16} />{userName(u)}</button>)}
              </div>
            </div>
          )}
        </div>
      )}
    </Dialog>
  );
}

/** Chuyển tiếp một tin sang kênh khác cùng dự án. */
export function ForwardDialog({ open, onClose, pid, from, channels }: { open: boolean; onClose: () => void; pid: number; from: ChatMessage | null; channels: ChatChannel[] }) {
  const qc = useQueryClient();
  const [to, setTo] = useState<number | null>(null);
  const [note, setNote] = useState('');
  useEffect(() => { if (open) { setTo(null); setNote(''); } }, [open]);
  const targets = channels.filter((c) => c.id !== from?.channelId && c.canPost && !c.archived);
  const m = useMutation({
    mutationFn: () => chatApi.forward(pid, from!.channelId, from!.id, { toChannelId: to!, note: note || null }),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['work', 'chat', pid] }); toast.success('Message forwarded'); onClose(); },
    onError: (err) => toast.error(workError(err, 'Could not forward')),
  });
  return (
    <Dialog open={open} onClose={onClose} title="Forward message" width={460}
      footer={<><button type="button" className="w-btn" onClick={onClose}>Cancel</button><button type="button" className="w-btn w-btn-primary" disabled={!to || m.isPending} onClick={() => m.mutate()}>Forward</button></>}>
      <div className="space-y-3">
        {from && <blockquote className="line-clamp-3 border-l-[3px] border-[var(--w-border-strong)] pl-2.5 text-[13px] text-[var(--w-text-2)]">{from.body || 'Attachment'}</blockquote>}
        <Field label="To channel">
          <select className="w-input" value={to ?? ''} onChange={(e) => setTo(Number(e.target.value) || null)}>
            <option value="">Choose a channel…</option>
            {targets.map((c) => <option key={c.id} value={c.id}>#{c.name}{c.kind === 'PRIVATE' ? ' (private)' : c.kind === 'CLIENT' ? ' (client)' : ''}</option>)}
          </select>
        </Field>
        <Field label="Add a note (optional)"><textarea className="w-input min-h-[64px] py-2" value={note} onChange={(e) => setNote(e.target.value)} maxLength={2000} /></Field>
      </div>
    </Dialog>
  );
}

/** "Tạo thẻ" từ một tin: tiêu đề + loại thẻ; mô tả = nội dung tin + link về tin (máy chủ ghép). */
export function CreateIssueFromMessageDialog({ open, onClose, pid, msg, config }: { open: boolean; onClose: () => void; pid: number; msg: ChatMessage | null; config: ProjectConfig }) {
  const qc = useQueryClient();
  const types = config.issueTypes.filter((t) => !['EPIC', 'SUBTASK'].includes(t.key));
  const [title, setTitle] = useState('');
  const [typeId, setTypeId] = useState<number>(types.find((t) => t.key === 'TASK')?.id ?? types[0]?.id ?? 0);
  useEffect(() => {
    if (open && msg) setTitle(msg.body.replace(/[#*_`>[\]()]/g, '').replace(/\s+/g, ' ').trim().slice(0, 120));
  }, [open, msg]);
  const m = useMutation({
    mutationFn: () => chatApi.createIssue(pid, msg!.channelId, msg!.id, { typeId, title }),
    onSuccess: (r) => { void qc.invalidateQueries({ queryKey: ['work', 'chat', pid] }); toast.success(`${r.key} created`, { action: { label: 'Open', onClick: () => { window.location.href = r.url; } } }); onClose(); },
    onError: (err) => toast.error(workError(err, 'Could not create the issue')),
  });
  return (
    <Dialog open={open} onClose={onClose} title="Create issue from message" width={500}
      footer={<><button type="button" className="w-btn" onClick={onClose}>Cancel</button><button type="button" className="w-btn w-btn-primary" disabled={!title.trim() || !typeId || m.isPending} onClick={() => m.mutate()}>Create issue</button></>}>
      <div className="space-y-3">
        <Field label="Title"><input className="w-input" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={255} autoFocus /></Field>
        <Field label="Type">
          <select className="w-input" value={typeId} onChange={(e) => setTypeId(Number(e.target.value))}>
            {types.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </Field>
        <p className="text-[12px] text-[var(--w-text-3)]">The message becomes the description, with a link back to it. A reply in the thread links to the new issue.</p>
      </div>
    </Dialog>
  );
}
