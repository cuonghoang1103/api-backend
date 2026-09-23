'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Check, Copy, Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  userName, workApi, workError,
  type ProjectRole, type WorkInvite, type WorkspaceDetail, type WorkspaceRole,
} from '@/lib/work-api';
import { wk } from '../hooks';
import { EmptyState, Field, Spinner, formatDate } from '../ui';
import { ConfirmDialog, PROJECT_ROLE_LABEL, ReadOnlyNotice, Section, Select, WS_ROLE_HELP, WS_ROLE_LABEL } from './shared';
import { wsMembersKey } from './WorkspaceMembers';

const invitesKey = (wsId: number) => ['work', 'ws-invites', wsId] as const;
const INVITE_ROLES: Array<Exclude<WorkspaceRole, 'OWNER'>> = ['MEMBER', 'ADMIN', 'GUEST'];
const PROJECT_ROLES: ProjectRole[] = ['MEMBER', 'VIEWER', 'TEACHER', 'CLIENT', 'ADMIN'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type InviteResult = { email: string; status: 'ADDED' | 'ALREADY_MEMBER' | 'INVITED' };
const RESULT_LABEL: Record<InviteResult['status'], string> = { ADDED: 'Added', ALREADY_MEMBER: 'Already a member', INVITED: 'Invitation sent' };

/** Chọn vai trò không gian + (tuỳ chọn) dự án + vai trò dự án — dùng chung cho mời email và link. */
function RolePickers({
  ws, role, setRole, projectId, setProjectId, projectRole, setProjectRole,
}: {
  ws: WorkspaceDetail;
  role: Exclude<WorkspaceRole, 'OWNER'>; setRole: (r: Exclude<WorkspaceRole, 'OWNER'>) => void;
  projectId: number | ''; setProjectId: (v: number | '') => void;
  projectRole: ProjectRole; setProjectRole: (r: ProjectRole) => void;
}) {
  // Backend chỉ cho mời thẳng vào dự án mà người mời là quản trị.
  const projects = ws.projects.filter((p) => !p.archivedAt && p.role === 'ADMIN');
  return (
    <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-3">
      <Field label="Workspace role" hint={WS_ROLE_HELP[role]}>
        <Select value={role} onChange={(e) => setRole(e.target.value as Exclude<WorkspaceRole, 'OWNER'>)}>
          {INVITE_ROLES.map((r) => <option key={r} value={r}>{WS_ROLE_LABEL[r]}</option>)}
        </Select>
      </Field>
      <Field label="Add to project (optional)">
        <Select value={projectId} onChange={(e) => setProjectId(e.target.value ? Number(e.target.value) : '')} disabled={!projects.length}>
          <option value="">{projects.length ? 'No project' : 'No projects you admin'}</option>
          {projects.map((p) => <option key={p.id} value={p.id}>{p.key} · {p.name}</option>)}
        </Select>
      </Field>
      <Field label="Project role">
        <Select value={projectRole} onChange={(e) => setProjectRole(e.target.value as ProjectRole)} disabled={!projectId}>
          {PROJECT_ROLES.map((r) => <option key={r} value={r}>{PROJECT_ROLE_LABEL[r]}</option>)}
        </Select>
      </Field>
    </div>
  );
}

function useRoleState() {
  const [role, setRole] = useState<Exclude<WorkspaceRole, 'OWNER'>>('MEMBER');
  const [projectId, setProjectId] = useState<number | ''>('');
  const [projectRole, setProjectRole] = useState<ProjectRole>('MEMBER');
  // Khách mặc định chỉ xem trong dự án.
  const pickRole = (r: Exclude<WorkspaceRole, 'OWNER'>) => {
    setRole(r);
    if (r === 'GUEST' && projectRole === 'MEMBER') setProjectRole('VIEWER');
  };
  return { role, setRole: pickRole, projectId, setProjectId, projectRole, setProjectRole };
}

function parseEmails(text: string) {
  const all = [...new Set(text.split(/[\s,;]+/).map((e) => e.trim().toLowerCase()).filter(Boolean))];
  return { valid: all.filter((e) => EMAIL_RE.test(e)), invalid: all.filter((e) => !EMAIL_RE.test(e)) };
}

export default function WorkspaceInvitations({ ws }: { ws: WorkspaceDetail }) {
  const qc = useQueryClient();
  const canManage = ws.role === 'OWNER' || ws.role === 'ADMIN';

  // (a) Mời qua email
  const emailRoles = useRoleState();
  const [emailText, setEmailText] = useState('');
  const [results, setResults] = useState<InviteResult[] | null>(null);
  const parsed = useMemo(() => parseEmails(emailText), [emailText]);
  const inviteEmails = useMutation({
    mutationFn: () => workApi.inviteEmails(ws.id, {
      emails: parsed.valid,
      role: emailRoles.role,
      projectId: emailRoles.projectId || null,
      projectRole: emailRoles.projectId ? emailRoles.projectRole : null,
    }),
    onSuccess: (r) => {
      setResults(r);
      setEmailText('');
      const n = r.filter((x) => x.status !== 'ALREADY_MEMBER').length;
      toast.success(n ? `${n} ${n === 1 ? 'person' : 'people'} invited` : 'Everyone is already a member');
      qc.invalidateQueries({ queryKey: invitesKey(ws.id) });
      qc.invalidateQueries({ queryKey: wsMembersKey(ws.id) });
      qc.invalidateQueries({ queryKey: wk.workspace(ws.slug) });
      qc.invalidateQueries({ queryKey: wk.workspaces });
    },
    onError: (err) => toast.error(workError(err, 'Could not send invitations')),
  });
  const canInvite = parsed.valid.length > 0 && parsed.valid.length <= 50 && !parsed.invalid.length && !inviteEmails.isPending;

  // (b) Link mời
  const linkRoles = useRoleState();
  const [maxUses, setMaxUses] = useState(30);
  const [days, setDays] = useState(7);
  const [link, setLink] = useState<{ url: string; expiresAt: string; maxUses: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const createLink = useMutation({
    mutationFn: () => workApi.createInviteLink(ws.id, {
      role: linkRoles.role,
      projectId: linkRoles.projectId || null,
      projectRole: linkRoles.projectId ? linkRoles.projectRole : null,
      maxUses,
      expiresInDays: days,
    }),
    onSuccess: (r) => {
      setLink(r);
      setCopied(false);
      qc.invalidateQueries({ queryKey: invitesKey(ws.id) });
    },
    onError: (err) => toast.error(workError(err, 'Could not create the invite link')),
  });
  const copy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link.url);
      setCopied(true);
      toast.success('Link copied');
    } catch {
      toast.error('Copy failed — select the link and copy it manually');
    }
  };

  // (c) Lời mời đang chờ
  const invites = useQuery({ queryKey: invitesKey(ws.id), queryFn: () => workApi.invites(ws.id), enabled: canManage, staleTime: 15_000 });
  const [revoking, setRevoking] = useState<WorkInvite | null>(null);
  const revoke = useMutation({
    mutationFn: (id: number) => workApi.revokeInvite(ws.id, id),
    onSuccess: () => { toast.success('Invitation revoked'); setRevoking(null); qc.invalidateQueries({ queryKey: invitesKey(ws.id) }); },
    onError: (err) => toast.error(workError(err, 'Could not revoke the invitation')),
  });
  const projectName = (id: number | null) => (id ? ws.projects.find((p) => p.id === id)?.key ?? 'a project' : null);

  if (!canManage) return <ReadOnlyNotice>Only workspace owners and admins can invite people.</ReadOnlyNotice>;

  return (
    <div>
      <Section title="Invite by email" description="People who already have an account are added right away. Everyone else receives an email with a link that expires in 7 days.">
        <form onSubmit={(e) => { e.preventDefault(); if (canInvite) inviteEmails.mutate(); }}>
          <Field
            label="Email addresses"
            hint={parsed.invalid.length
              ? undefined
              : parsed.valid.length > 50 ? 'At most 50 addresses at a time.' : 'Separate with commas or new lines.'}
          >
            <textarea
              className="w-input"
              rows={3}
              value={emailText}
              onChange={(e) => setEmailText(e.target.value)}
              onKeyDown={(e) => {
                // ⌘/Ctrl+Enter gửi (Enter thường xuống dòng để dán danh sách).
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); if (canInvite) inviteEmails.mutate(); }
              }}
              placeholder={'an@fpt.edu.vn, binh@fpt.edu.vn\nteacher@fe.edu.vn'}
            />
          </Field>
          {parsed.invalid.length > 0 && (
            <p className="-mt-3 mb-4 text-[12px] text-[var(--w-red)]">Not a valid email: {parsed.invalid.slice(0, 3).join(', ')}{parsed.invalid.length > 3 ? '…' : ''}</p>
          )}
          <RolePickers ws={ws} {...emailRoles} />
          <button type="submit" className="w-btn w-btn-primary" disabled={!canInvite}>
            {inviteEmails.isPending && <Spinner size={12} />}
            {parsed.valid.length > 1 ? `Invite ${parsed.valid.length} people` : 'Send invitation'}
          </button>
        </form>

        {results && results.length > 0 && (
          <div className="mt-4 overflow-hidden rounded-[8px] border border-[var(--w-border)]">
            {results.map((r) => (
              <div key={r.email} className="flex items-center justify-between gap-3 border-b border-[var(--w-border)] px-3 py-2 text-[13px] last:border-b-0">
                <span className="min-w-0 truncate">{r.email}</span>
                <span className={cn('shrink-0 text-[12px]', r.status === 'ALREADY_MEMBER' ? 'text-[var(--w-text-3)]' : 'text-[var(--w-green)]')}>
                  {RESULT_LABEL[r.status]}
                </span>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="Invite link" description="Share one link in your class or team chat. Anyone with the link can join until it expires or runs out of uses.">
        <form onSubmit={(e) => { e.preventDefault(); if (!createLink.isPending) createLink.mutate(); }}>
          <RolePickers ws={ws} {...linkRoles} />
          <div className="grid grid-cols-2 gap-x-3 sm:max-w-[340px]">
            <Field label="Max uses">
              <input type="number" className="w-input tabular" min={1} max={200} value={maxUses} onChange={(e) => setMaxUses(Math.min(200, Math.max(1, Number(e.target.value) || 1)))} />
            </Field>
            <Field label="Expires in (days)">
              <input type="number" className="w-input tabular" min={1} max={30} value={days} onChange={(e) => setDays(Math.min(30, Math.max(1, Number(e.target.value) || 1)))} />
            </Field>
          </div>
          <button type="submit" className="w-btn" disabled={createLink.isPending}>
            {createLink.isPending ? <Spinner size={12} /> : <Link2 size={14} />}
            Create invite link
          </button>
        </form>

        {link && (
          <div className="mt-4 rounded-[8px] border border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] p-3">
            <div className="flex gap-2">
              <input className="w-input min-w-0 flex-1 font-mono text-[12px]" readOnly value={link.url} onFocus={(e) => e.currentTarget.select()} />
              <button type="button" className="w-btn w-btn-primary shrink-0" onClick={copy}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="mt-2 text-[12px] text-[var(--w-text-2)]">
              This link is shown only once — copy it now. Valid for {link.maxUses} {link.maxUses === 1 ? 'use' : 'uses'} until {formatDate(link.expiresAt)}.
            </p>
          </div>
        )}
      </Section>

      <Section title="Pending invitations" description="Invitations that have not expired or been revoked.">
        {invites.isLoading ? (
          <div className="flex justify-center py-6"><Spinner size={16} /></div>
        ) : invites.error ? (
          <EmptyState title="Couldn't load invitations" body={workError(invites.error)} />
        ) : !invites.data?.length ? (
          <p className="text-[13px] text-[var(--w-text-3)]">No pending invitations.</p>
        ) : (
          <div className="overflow-hidden rounded-[8px] border border-[var(--w-border)]">
            <table className="w-full table-fixed text-[13px]">
              <thead>
                <tr className="border-b border-[var(--w-border)] bg-[var(--w-sunken)] text-left text-[11px] uppercase tracking-wide text-[var(--w-text-3)]">
                  <th className="px-3 py-2 font-medium">Invitee</th>
                  <th className="w-[92px] px-2 py-2 font-medium">Role</th>
                  <th className="hidden w-[64px] px-2 py-2 font-medium sm:table-cell">Uses</th>
                  <th className="hidden w-[110px] px-2 py-2 font-medium md:table-cell">Expires</th>
                  <th className="hidden w-[150px] px-2 py-2 font-medium md:table-cell">Invited by</th>
                  <th className="w-[78px]" />
                </tr>
              </thead>
              <tbody>
                {invites.data.map((inv) => (
                  <tr key={inv.id} className="border-b border-[var(--w-border)] last:border-b-0">
                    <td className="max-w-0 px-3 py-2">
                      <div className="flex items-center gap-1.5 truncate">
                        {inv.email ? <span className="truncate">{inv.email}</span> : <><Link2 size={13} className="shrink-0 text-[var(--w-text-3)]" /><span>Invite link</span></>}
                      </div>
                      {projectName(inv.projectId) && (
                        <div className="truncate text-[11px] text-[var(--w-text-3)]">
                          + {projectName(inv.projectId)}{inv.projectRole ? ` as ${PROJECT_ROLE_LABEL[inv.projectRole]}` : ''}
                        </div>
                      )}
                    </td>
                    <td className="px-2 py-2 text-[var(--w-text-2)]">{WS_ROLE_LABEL[inv.role]}</td>
                    <td className="tabular hidden px-2 py-2 text-[var(--w-text-2)] sm:table-cell">{inv.usedCount}/{inv.maxUses}</td>
                    <td className="hidden px-2 py-2 text-[var(--w-text-2)] md:table-cell">{formatDate(inv.expiresAt)}</td>
                    <td className="hidden truncate px-2 py-2 text-[var(--w-text-2)] md:table-cell">{userName(inv.invitedBy)}</td>
                    <td className="px-2 py-2 text-right">
                      <button type="button" className="w-btn w-btn-ghost w-btn-sm w-btn-danger" onClick={() => setRevoking(inv)}>Revoke</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      <ConfirmDialog
        open={!!revoking}
        onClose={() => setRevoking(null)}
        title="Revoke invitation?"
        body={revoking?.email ? <>The link sent to <span className="font-medium text-[var(--w-text)]">{revoking.email}</span> will stop working.</> : 'Anyone who has this link will no longer be able to join.'}
        confirmLabel="Revoke"
        pending={revoke.isPending}
        onConfirm={() => revoking && revoke.mutate(revoking.id)}
      />
    </div>
  );
}
