'use client';

/**
 * HubShareManagerModal — owner-side "manage who I've shared this
 * with" dialog.
 *
 * Opens from the "Quản lý chia sẻ" entry in the link/file/folder
 * context menu. Lists every HubShare row pointing at this item
 * (one row per recipient), grouped by permission. Each row has:
 *   - recipient avatar + username
 *   - permission badge (view vs view_download)
 *   - the optional note the owner attached
 *   - created-at timestamp
 *   - a revoke button (calls DELETE /hub/shares/:id)
 *
 * Also lets the owner share with a new user from inside the
 * manager so they don't have to close + reopen the basic share
 * modal just to add a 2nd recipient. Quick chips of recent
 * outbox recipients are reused for fast re-share.
 *
 * Data flow:
 *   - On open: load outbox via hubShareApi.listOutbox() and
 *     filter client-side to shares that point at this item.
 *     We don't have a "list shares for item" endpoint, so we
 *     re-use the existing outbox scan — fine at this scale
 *     (most users have <100 shares total).
 *   - On revoke: optimistically remove the row + call
 *     hubShareApi.delete. If the call fails, restore the row
 *     and toast the error.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Link2, FileText, FolderOpen, X, Trash2, Loader2, Search,
  Eye, Download, Clock, Send, Check,
} from 'lucide-react';
import { toast } from 'sonner';

import {
  hubShareApi,
  type HubShare, type HubShareOwnerMini, type SharePermission,
  type HubFolder, type HubLink, type HubFile,
} from '@/lib/api';
import { cn } from '@/lib/utils';

export type ShareItemKind = 'folder' | 'link' | 'file';

interface HubShareManagerModalProps {
  open: boolean;
  item: { kind: ShareItemKind; id: number } | null;
  itemLabel?: string;
  onClose: () => void;
  // Called after a successful revoke so the parent can refresh
  // any "Đã chia sẻ với N người" badges without a full reload.
  onChanged?: () => void;
}

export default function HubShareManagerModal({
  open, item, itemLabel, onClose, onChanged,
}: HubShareManagerModalProps) {
  const [shares, setShares] = useState<HubShare[]>([]);
  const [loading, setLoading] = useState(true);
  const [revokingId, setRevokingId] = useState<number | null>(null);
  // Inline "add new recipient" form (optional convenience —
  // the basic HubShareModal still exists for first-time share).
  const [adding, setAdding] = useState(false);
  const [newRecipientQuery, setNewRecipientQuery] = useState('');
  const [newRecipient, setNewRecipient] = useState<HubShareOwnerMini | null>(null);
  const [newPermission, setNewPermission] = useState<SharePermission>('view_download');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<HubShareOwnerMini[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load outbox + filter to shares pointing at this item.
  useEffect(() => {
    if (!open || !item) return;
    setLoading(true);
    hubShareApi.listOutbox()
      .then((r) => {
        const all = r.data.data ?? [];
        const filtered = all.filter((s) =>
          (item.kind === 'folder' && s.folderId === item.id) ||
          (item.kind === 'link' && s.linkId === item.id) ||
          (item.kind === 'file' && s.fileId === item.id),
        );
        setShares(filtered);
      })
      .catch(() => toast.error('Khong tai duoc danh sach share'))
      .finally(() => setLoading(false));
  }, [open, item?.id, item?.kind]);

  // Debounce typeahead in the "add new" form.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (newRecipient) return;
    const q = newRecipientQuery.trim();
    if (q.length === 0) { setSearchResults([]); return; }
    debounceRef.current = setTimeout(() => {
      setSearching(true);
      hubShareApi.searchUsers(q, 8)
        .then((r) => setSearchResults(r.data.data ?? []))
        .catch(() => setSearchResults([]))
        .finally(() => setSearching(false));
    }, 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [newRecipientQuery, newRecipient]);

  const revoke = async (share: HubShare) => {
    if (!confirm(`Revoke share cho @${share.recipient.username}? Ho se khong con xem duoc.`)) {
      return;
    }
    setRevokingId(share.id);
    // Optimistic remove
    const prev = shares;
    setShares((cur) => cur.filter((s) => s.id !== share.id));
    try {
      await hubShareApi.delete(share.id);
      toast.success(`Da revoke share cua @${share.recipient.username}`);
      onChanged?.();
    } catch (err: any) {
      // Restore on failure
      setShares(prev);
      const msg = err?.response?.data?.message ?? 'Khong the revoke';
      toast.error(msg);
    } finally {
      setRevokingId(null);
    }
  };

  const handleAddNew = async () => {
    if (!item || !newRecipient) return;
    try {
      const payload: Parameters<typeof hubShareApi.create>[0] = {
        recipientId: newRecipient.id,
        permission: newPermission,
        note: null,
      };
      if (item.kind === 'folder') payload.folderId = item.id;
      if (item.kind === 'link') payload.linkId = item.id;
      if (item.kind === 'file') payload.fileId = item.id;
      const r = await hubShareApi.create(payload);
      setShares((cur) => [r.data.data, ...cur]);
      setAdding(false);
      setNewRecipient(null);
      setNewRecipientQuery('');
      setSearchResults([]);
      toast.success(`Da share cho @${newRecipient.username}`);
      onChanged?.();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Khong the share';
      toast.error(msg);
    }
  };

  const itemIcon = useMemo(() => {
    if (!item) return null;
    if (item.kind === 'folder') return <FolderOpen className="h-5 w-5" />;
    if (item.kind === 'link') return <Link2 className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  }, [item]);

  return (
    <AnimatePresence>
      {open && item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-darkborder bg-[#0d0f18] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-darkborder/60 px-5 py-3.5">
              <div className="flex items-center gap-2.5 text-text-primary">
                <span className="text-neon-violet">{itemIcon}</span>
                <div>
                  <h2 className="text-base font-semibold">Quản lý chia sẻ</h2>
                  <p className="truncate text-xs text-text-muted">
                    {itemLabel ?? `Item #${item.id}`}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary"
                aria-label="Dong"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="max-h-[60vh] overflow-y-auto px-5 py-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-neon-violet" />
                </div>
              ) : shares.length === 0 && !adding ? (
                <div className="rounded-xl border border-dashed border-darkborder bg-darkbg/40 p-8 text-center">
                  <p className="mb-3 text-sm text-text-secondary">
                    Chua share item nay voi ai.
                  </p>
                  <button
                    onClick={() => setAdding(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-neon-violet/20 transition-opacity hover:opacity-90"
                  >
                    <Send className="h-4 w-4" />
                    Share voi nguoi dau tien
                  </button>
                </div>
              ) : (
                <>
                  <ul className="space-y-2">
                    <AnimatePresence>
                      {shares.map((s) => (
                        <motion.li
                          key={s.id}
                          layout
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8, height: 0 }}
                          transition={{ duration: 0.15 }}
                          className="flex items-start gap-3 rounded-xl border border-darkborder bg-darkcard/40 p-3"
                        >
                          <AvatarMini user={s.recipient} size={36} />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="truncate text-sm font-semibold text-text-primary">
                                {s.recipient.displayName || s.recipient.fullName || s.recipient.username}
                              </span>
                              <span className="text-xs text-text-muted">
                                @{s.recipient.username}
                              </span>
                            </div>
                            <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-text-muted">
                              <PermissionPill permission={s.permission} />
                              <span>·</span>
                              <Clock className="h-2.5 w-2.5" />
                              {formatRelativeTime(s.createdAt)}
                            </div>
                            {s.note && (
                              <p className="mt-1.5 truncate text-xs italic text-text-secondary">
                                &ldquo;{s.note}&rdquo;
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => void revoke(s)}
                            disabled={revokingId === s.id}
                            className="shrink-0 inline-flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
                            title="Thu hoi quyen truy cap"
                          >
                            {revokingId === s.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                            Revoke
                          </button>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>

                  {/* Add another recipient inline */}
                  {!adding ? (
                    <button
                      onClick={() => setAdding(true)}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-darkborder bg-darkbg/40 px-3 py-2.5 text-xs font-medium text-text-secondary transition-colors hover:border-neon-violet/40 hover:text-neon-violet"
                    >
                      <Send className="h-3.5 w-3.5" />
                      Them nguoi nhan
                    </button>
                  ) : (
                    <div className="mt-3 rounded-xl border border-neon-violet/30 bg-neon-violet/5 p-3">
                      {newRecipient ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <AvatarMini user={newRecipient} size={28} />
                            <div>
                              <div className="text-sm font-medium text-text-primary">
                                {newRecipient.displayName || newRecipient.fullName || newRecipient.username}
                              </div>
                              <div className="text-xs text-text-muted">@{newRecipient.username}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => { setNewRecipient(null); setNewRecipientQuery(''); }}
                            className="rounded p-1 text-text-muted hover:text-text-primary"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="relative mb-2">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
                            <input
                              autoFocus
                              value={newRecipientQuery}
                              onChange={(e) => setNewRecipientQuery(e.target.value)}
                              placeholder="Tim username hoac ten..."
                              className="w-full rounded-lg border border-darkborder bg-darkbg/60 py-2 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none"
                            />
                            {searching && (
                              <Loader2 className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-text-muted" />
                            )}
                          </div>
                          {searchResults.length > 0 && (
                            <div className="max-h-36 overflow-y-auto rounded-lg border border-darkborder bg-darkbg/60">
                              {searchResults.map((u) => (
                                <button
                                  key={u.id}
                                  onClick={() => setNewRecipient(u)}
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-white/5"
                                >
                                  <AvatarMini user={u} size={24} />
                                  <div className="min-w-0 flex-1">
                                    <div className="truncate text-sm font-medium text-text-primary">
                                      {u.displayName || u.fullName || u.username}
                                    </div>
                                    <div className="truncate text-xs text-text-muted">@{u.username}</div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                      {item.kind !== 'link' && (
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <PermissionTile
                            active={newPermission === 'view'}
                            onClick={() => setNewPermission('view')}
                            icon={<Eye className="h-3.5 w-3.5" />}
                            title="Chi xem"
                          />
                          <PermissionTile
                            active={newPermission === 'view_download'}
                            onClick={() => setNewPermission('view_download')}
                            icon={<Download className="h-3.5 w-3.5" />}
                            title="Xem + Tai"
                          />
                        </div>
                      )}
                      <div className="mt-2 flex justify-end gap-2">
                        <button
                          onClick={() => { setAdding(false); setNewRecipient(null); setNewRecipientQuery(''); }}
                          className="rounded-lg border border-darkborder bg-transparent px-3 py-1.5 text-xs text-text-secondary hover:bg-white/5 hover:text-text-primary"
                        >
                          Huy
                        </button>
                        <button
                          onClick={handleAddNew}
                          disabled={!newRecipient}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-neon-indigo to-neon-violet px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-neon-violet/20 transition-opacity hover:opacity-90 disabled:opacity-40"
                        >
                          <Check className="h-3.5 w-3.5" />
                          Them
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-darkborder/60 bg-darkbg/40 px-5 py-3 text-center text-[11px] text-text-muted">
              {shares.length > 0
                ? `${shares.length} nguoi dang co quyen truy cap`
                : 'Chua co ai duoc share'}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PermissionPill({ permission }: { permission: SharePermission }) {
  if (permission === 'view_download') {
    return (
      <span className="inline-flex items-center gap-0.5 rounded bg-emerald-500/15 px-1.5 text-[10px] font-medium text-emerald-400">
        <Download className="h-2.5 w-2.5" />
        Xem + Tai
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 rounded bg-blue-500/15 px-1.5 text-[10px] font-medium text-blue-400">
      <Eye className="h-2.5 w-2.5" />
      Chi xem
    </span>
  );
}

function PermissionTile({
  active, onClick, icon, title,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-xs font-medium transition-all',
        active
          ? 'border-neon-violet/50 bg-neon-violet/15 text-text-primary'
          : 'border-darkborder bg-darkbg/40 text-text-secondary hover:border-neon-violet/30 hover:text-text-primary',
      )}
    >
      <span className={active ? 'text-neon-violet' : 'text-text-muted'}>{icon}</span>
      {title}
      {active && <Check className="ml-auto h-3 w-3 text-neon-violet" />}
    </button>
  );
}

function AvatarMini({ user, size = 28 }: { user: HubShareOwnerMini; size?: number }) {
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
      className="flex items-center justify-center rounded-full bg-gradient-to-br from-neon-indigo to-neon-violet text-[10px] font-bold uppercase text-white"
    >
      {(user.displayName || user.fullName || user.username).slice(0, 2)}
    </div>
  );
}

/**
 * Lightweight relative timestamp. Avoids pulling in a date-fns
 * dependency for this single use — we only render durations
 * like "2 phut truoc", "1 gio truoc", "3 ngay truoc".
 */
function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return '';
  const diff = Date.now() - then;
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'vua xong';
  if (minutes < 60) return `${minutes} phut truoc`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} gio truoc`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} ngay truoc`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} thang truoc`;
  const years = Math.floor(months / 12);
  return `${years} nam truoc`;
}
