'use client';

/**
 * HubSharedWithMe — right-side widget + section header for the
 * inbox of shares the current user has received.
 *
 * Shows two things in one card:
 *   1) A small avatar stack of users who have shared with me
 *      (the count is "X người đang share với bạn"). Click → opens
 *      a dropdown listing each user + the count of items they
 *      shared; clicking a user drills into their shared items.
 *   2) The list of received shares, filtered by the selected
 *      user (or all if none selected). Each row shows the
 *      sender avatar, the item kind icon, and the note if any.
 *
 * Why a dedicated component instead of more state in HubClient:
 * HubClient is already 629 lines. Pulling the inbox UI out keeps
 * the orchestrator focused on the owner's own hub view.
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Link2, FileText, FolderOpen, Inbox, Users, ChevronDown,
  Loader2, X, Eye, Download,
} from 'lucide-react';
import { toast } from 'sonner';

import {
  hubShareApi,
  type HubShare, type HubShareUserSummary, type SharePermission,
} from '@/lib/api';
import { cn } from '@/lib/utils';

interface HubSharedWithMeProps {
  onOpenShare: (share: HubShare) => void;
}

export default function HubSharedWithMe({ onOpenShare }: HubSharedWithMeProps) {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<HubShareUserSummary[]>([]);
  const [shares, setShares] = useState<HubShare[]>([]);
  const [filterUserId, setFilterUserId] = useState<number | null>(null);
  const [usersOpen, setUsersOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [u, s] = await Promise.all([
        hubShareApi.listUsersSharingWithMe(),
        hubShareApi.listInbox(),
      ]);
      setUsers(u.data.data ?? []);
      setShares(s.data.data ?? []);
    } catch {
      toast.error('Khong tai duoc shares');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const filtered = filterUserId
    ? shares.filter((s) => s.ownerId === filterUserId)
    : shares;

  const selectedUser = filterUserId ? users.find((u) => u.user.id === filterUserId)?.user : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-darkborder/50 bg-darkcard/60 p-6 backdrop-blur-xl">
        <Loader2 className="h-4 w-4 animate-spin text-neon-violet" />
      </div>
    );
  }

  if (users.length === 0 && shares.length === 0) {
    return (
      <div className="rounded-2xl border border-darkborder/50 bg-darkcard/60 p-4 backdrop-blur-xl">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-text-primary">
          <Inbox className="h-4 w-4 text-neon-violet" />
          Shared with me
        </div>
        <p className="text-xs text-text-muted">
          Khi ai do share link / file / folder cho ban, no se xuat hien o day.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-darkborder/50 bg-darkcard/60 p-4 backdrop-blur-xl">
      {/* Header — users summary + dropdown */}
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-text-primary">
        <Inbox className="h-4 w-4 text-neon-violet" />
        Shared with me
        {users.length > 0 && (
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-neon-violet/15 px-2 py-0.5 text-[10px] font-medium text-neon-violet">
            {users.length} nguoi
          </span>
        )}
      </div>

      {/* Avatar stack + chevron to open user list */}
      {users.length > 0 && (
        <div className="relative mb-3">
          <button
            onClick={() => setUsersOpen((v) => !v)}
            className="flex w-full items-center gap-2 rounded-xl border border-darkborder bg-darkbg/40 px-3 py-2 text-left transition-colors hover:border-neon-violet/40"
          >
            <div className="flex -space-x-2">
              {users.slice(0, 5).map((u) => (
                <AvatarBubble key={u.user.id} user={u.user} size={26} />
              ))}
              {users.length > 5 && (
                <div className="flex h-[26px] w-[26px] items-center justify-center rounded-full border border-darkborder bg-darkcard text-[10px] font-bold text-text-secondary">
                  +{users.length - 5}
                </div>
              )}
            </div>
            <span className="flex-1 truncate text-xs text-text-secondary">
              {filterUserId && selectedUser
                ? `Tu @${selectedUser.username}`
                : `${users.length} nguoi dang share voi ban`}
            </span>
            <ChevronDown
              className={cn(
                'h-3.5 w-3.5 text-text-muted transition-transform',
                usersOpen && 'rotate-180',
              )}
            />
          </button>

          <AnimatePresence>
            {usersOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.12 }}
                className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-xl border border-darkborder bg-[#0d0f18]/95 shadow-2xl backdrop-blur-xl"
              >
                <button
                  onClick={() => { setFilterUserId(null); setUsersOpen(false); }}
                  className={cn(
                    'flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition-colors hover:bg-white/5',
                    filterUserId === null ? 'bg-white/5 text-text-primary' : 'text-text-secondary',
                  )}
                >
                  <Users className="h-3.5 w-3.5" />
                  Tat ca ({shares.length})
                </button>
                <div className="my-1 border-t border-darkborder/60" />
                {users.map((u) => (
                  <button
                    key={u.user.id}
                    onClick={() => { setFilterUserId(u.user.id); setUsersOpen(false); }}
                    className={cn(
                      'flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-white/5',
                      filterUserId === u.user.id ? 'bg-white/5 text-text-primary' : 'text-text-secondary',
                    )}
                  >
                    <AvatarBubble user={u.user} size={22} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-medium">
                        {u.user.displayName || u.user.fullName || u.user.username}
                      </div>
                      <div className="truncate text-[10px] text-text-muted">@{u.user.username}</div>
                    </div>
                    <span className="rounded-full bg-darkborder/60 px-1.5 py-0.5 text-[10px] text-text-muted">
                      {u.shareCount}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Filter chip when user is selected */}
      {filterUserId && selectedUser && (
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-neon-violet/40 bg-neon-violet/10 px-2 py-1 text-[11px] text-neon-violet">
          Loc: @{selectedUser.username}
          <button
            onClick={() => setFilterUserId(null)}
            className="rounded-full p-0.5 hover:bg-white/10"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Inbox list */}
      {filtered.length === 0 ? (
        <p className="text-center text-xs text-text-muted py-4">
          Khong co share nao.
        </p>
      ) : (
        <ul className="space-y-1.5">
          {filtered.slice(0, 8).map((s) => (
            <li key={s.id}>
              <button
                onClick={() => onOpenShare(s)}
                className="flex w-full items-center gap-2.5 rounded-xl border border-transparent px-2 py-2 text-left transition-colors hover:border-neon-violet/30 hover:bg-white/[0.04]"
              >
                <ItemIcon kind={s.folderId ? 'folder' : s.linkId ? 'link' : 'file'} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <AvatarBubble user={s.owner} size={16} />
                    <span className="truncate text-[11px] text-text-muted">
                      @{s.owner.username}
                    </span>
                    <PermissionBadge permission={s.permission} />
                  </div>
                  <div className="truncate text-xs font-medium text-text-primary">
                    {s.folder?.name ?? s.link?.title ?? s.file?.name ?? `Item #${s.id}`}
                  </div>
                  {s.note && (
                    <div className="mt-0.5 truncate text-[10px] italic text-text-muted">
                      &ldquo;{s.note}&rdquo;
                    </div>
                  )}
                </div>
              </button>
            </li>
          ))}
          {filtered.length > 8 && (
            <li className="pt-1 text-center text-[10px] text-text-muted">
              +{filtered.length - 8} share khac
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

function ItemIcon({ kind }: { kind: 'folder' | 'link' | 'file' }) {
  const Icon = kind === 'folder' ? FolderOpen : kind === 'link' ? Link2 : FileText;
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neon-violet/10 text-neon-violet">
      <Icon className="h-3.5 w-3.5" />
    </div>
  );
}

function PermissionBadge({ permission }: { permission: SharePermission }) {
  if (permission === 'view_download') {
    return (
      <span className="inline-flex items-center gap-0.5 rounded bg-emerald-500/15 px-1 text-[9px] font-medium text-emerald-400">
        <Download className="h-2.5 w-2.5" />
        TAI
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 rounded bg-blue-500/15 px-1 text-[9px] font-medium text-blue-400">
      <Eye className="h-2.5 w-2.5" />
      XEM
    </span>
  );
}

function AvatarBubble({ user, size = 24 }: { user: HubShareUserSummary['user']; size?: number }) {
  const dim = `${size}px`;
  if (user.avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.avatarUrl}
        alt={user.username}
        style={{ width: dim, height: dim }}
        className="rounded-full border border-darkborder object-cover"
      />
    );
  }
  return (
    <div
      style={{ width: dim, height: dim }}
      className="flex items-center justify-center rounded-full border border-darkborder bg-gradient-to-br from-neon-indigo to-neon-violet text-[8px] font-bold uppercase text-white"
    >
      {(user.displayName || user.fullName || user.username).slice(0, 2)}
    </div>
  );
}