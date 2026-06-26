'use client';

/**
 * HubShareModal — owner-side "share this item with a user" dialog.
 *
 * Opens from the HubLinkCard / HubFileCard context menu. Lets the
 * owner pick a recipient (typeahead by username/displayName/fullName),
 * choose a permission (view-only vs view+download), and attach an
 * optional note. Re-sharing the same item to the same user updates
 * the existing row's permission/note (the backend is idempotent on
 * the unique constraint).
 *
 * Design notes:
 *   - Two columns: left = item preview, right = share form.
 *     Keeps the owner's context visible while they configure.
 *   - Recipient typeahead debounces by 250ms to avoid spamming
 *     the API while typing.
 *   - We surface the most recent outbox entries as quick chips
 *     so the owner can re-share with the same people without
 *     typing their username again. Big win for repeat shares.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Link2, FileText, FolderOpen, X, Send, Check, Download, Eye,
  Loader2, Search,
} from 'lucide-react';
import { toast } from 'sonner';

import {
  hubShareApi, hubApi, hubFileApi,
  type HubShareOwnerMini, type HubShare, type SharePermission,
  type HubFolder, type HubLink, type HubFile,
} from '@/lib/api';
import { cn } from '@/lib/utils';

export type ShareItemKind = 'folder' | 'link' | 'file';

interface HubShareModalProps {
  open: boolean;
  item: { kind: ShareItemKind; id: number } | null;
  // We need the label for display only — the API call only uses the id.
  itemLabel?: string;
  onClose: () => void;
  onShared?: (share: HubShare) => void;
}

export default function HubShareModal({
  open, item, itemLabel, onClose, onShared,
}: HubShareModalProps) {
  const [recipientQuery, setRecipientQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [searchResults, setSearchResults] = useState<HubShareOwnerMini[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<HubShareOwnerMini | null>(null);
  const [permission, setPermission] = useState<SharePermission>('view_download');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [searching, setSearching] = useState(false);
  // Quick chips — last 8 unique recipients I've shared with.
  const [recentRecipients, setRecentRecipients] = useState<HubShareOwnerMini[]>([]);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset state when modal opens/closes — important so opening for
  // a different item doesn't carry over a stale recipient.
  useEffect(() => {
    if (!open) {
      setRecipientQuery('');
      setDebouncedQuery('');
      setSearchResults([]);
      setSelectedRecipient(null);
      setPermission('view_download');
      setNote('');
      setSubmitting(false);
    }
  }, [open]);

  // Debounce recipient query → API call.
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (selectedRecipient) return; // skip search when one is picked
    if (debouncedQuery.trim().length === 0) {
      setSearchResults([]);
      return;
    }
    debounceTimer.current = setTimeout(() => {
      setSearching(true);
      hubShareApi.searchUsers(debouncedQuery.trim(), 8)
        .then((r) => setSearchResults(r.data.data ?? []))
        .catch(() => setSearchResults([]))
        .finally(() => setSearching(false));
    }, 250);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [debouncedQuery, selectedRecipient]);

  // Pre-load recent recipients when the modal opens.
  useEffect(() => {
    if (!open) return;
    hubShareApi.listOutbox()
      .then((r) => {
        const seen = new Set<number>();
        const list: HubShareOwnerMini[] = [];
        for (const s of r.data.data ?? []) {
          if (seen.has(s.recipient.id)) continue;
          seen.add(s.recipient.id);
          list.push(s.recipient);
          if (list.length >= 8) break;
        }
        setRecentRecipients(list);
      })
      .catch(() => setRecentRecipients([]));
  }, [open]);

  const handleSubmit = async () => {
    if (!item || !selectedRecipient) {
      toast.error('Chon nguoi nhan truoc khi share');
      return;
    }
    setSubmitting(true);
    try {
      const payload: Parameters<typeof hubShareApi.create>[0] = {
        recipientId: selectedRecipient.id,
        permission,
        note: note.trim() || null,
      };
      if (item.kind === 'folder') payload.folderId = item.id;
      if (item.kind === 'link') payload.linkId = item.id;
      if (item.kind === 'file') payload.fileId = item.id;
      const r = await hubShareApi.create(payload);
      toast.success(`Da share cho @${selectedRecipient.username}`);
      onShared?.(r.data.data);
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Khong the share';
      toast.error(msg);
    } finally {
      setSubmitting(false);
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
            className="w-full max-w-md overflow-hidden rounded-2xl border border-darkborder bg-[#0d0f18] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-darkborder/60 px-5 py-3.5">
              <div className="flex items-center gap-2.5 text-text-primary">
                <span className="text-neon-violet">{itemIcon}</span>
                <div>
                  <h2 className="text-base font-semibold">Chia se</h2>
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
            <div className="space-y-4 px-5 py-4">
              {/* Recipient */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-text-muted">
                  Nguoi nhan
                </label>
                {selectedRecipient ? (
                  <div className="flex items-center justify-between rounded-xl border border-neon-violet/40 bg-neon-violet/10 px-3 py-2">
                    <div className="flex items-center gap-2.5">
                      <AvatarMini user={selectedRecipient} size={32} />
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-text-primary">
                          {selectedRecipient.displayName || selectedRecipient.fullName || selectedRecipient.username}
                        </div>
                        <div className="truncate text-xs text-text-muted">
                          @{selectedRecipient.username}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => { setSelectedRecipient(null); setRecipientQuery(''); }}
                      className="rounded p-1 text-text-muted hover:text-text-primary"
                      title="Chon lai"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
                      <input
                        autoFocus
                        value={recipientQuery}
                        onChange={(e) => {
                          setRecipientQuery(e.target.value);
                          setDebouncedQuery(e.target.value);
                        }}
                        placeholder="Tim username hoac ten..."
                        className="w-full rounded-xl border border-darkborder bg-darkbg/60 py-2 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none"
                      />
                      {searching && (
                        <Loader2 className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin text-text-muted" />
                      )}
                    </div>
                    {/* Quick chips from recent outbox */}
                    {recentRecipients.length > 0 && debouncedQuery.trim().length === 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {recentRecipients.map((u) => (
                          <button
                            key={u.id}
                            onClick={() => setSelectedRecipient(u)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-darkborder bg-darkbg/40 px-2 py-1 text-xs text-text-secondary transition-colors hover:border-neon-violet/40 hover:text-text-primary"
                          >
                            <AvatarMini user={u} size={18} />
                            @{u.username}
                          </button>
                        ))}
                      </div>
                    )}
                    {/* Search results */}
                    {searchResults.length > 0 && (
                      <div className="mt-2 max-h-44 overflow-y-auto rounded-xl border border-darkborder bg-darkbg/60">
                        {searchResults.map((u) => (
                          <button
                            key={u.id}
                            onClick={() => setSelectedRecipient(u)}
                            className="flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-white/5"
                          >
                            <AvatarMini user={u} size={28} />
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
              </div>

              {/* Permission — only meaningful for files. Links are
                  always "view_download" in spirit (clicking is the
                  download), so we hide the picker for them. */}
              {item.kind !== 'link' && (
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-text-muted">
                    Quyen
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <PermissionTile
                      active={permission === 'view'}
                      onClick={() => setPermission('view')}
                      icon={<Eye className="h-4 w-4" />}
                      title="Chi xem"
                      desc="Xem thong tin, khong tai xuong"
                    />
                    <PermissionTile
                      active={permission === 'view_download'}
                      onClick={() => setPermission('view_download')}
                      icon={<Download className="h-4 w-4" />}
                      title="Xem + Tai"
                      desc="Xem va download file"
                    />
                  </div>
                </div>
              )}

              {/* Note */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-text-muted">
                  Loi nhan <span className="font-normal text-text-muted/70">(khong bat buoc)</span>
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value.slice(0, 500))}
                  placeholder="Vi du: Tai lieu cho du an cuoi ky..."
                  rows={2}
                  className="w-full resize-none rounded-xl border border-darkborder bg-darkbg/60 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none"
                />
                <div className="mt-1 text-right text-[10px] text-text-muted">
                  {note.length}/500
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 border-t border-darkborder/60 bg-darkbg/40 px-5 py-3">
              <button
                onClick={onClose}
                disabled={submitting}
                className="rounded-xl border border-darkborder bg-transparent px-4 py-2 text-sm text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary disabled:opacity-50"
              >
                Huy
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedRecipient || submitting}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-neon-violet/20 transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Chia se
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PermissionTile({
  active, onClick, icon, title, desc,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-start gap-1 rounded-xl border px-3 py-2.5 text-left transition-all',
        active
          ? 'border-neon-violet/50 bg-neon-violet/10 text-text-primary shadow-[0_0_12px_rgba(167,139,250,0.18)]'
          : 'border-darkborder bg-darkbg/40 text-text-secondary hover:border-neon-violet/30 hover:text-text-primary',
      )}
    >
      <div className="flex items-center gap-2 text-sm font-semibold">
        <span className={active ? 'text-neon-violet' : 'text-text-muted'}>{icon}</span>
        {title}
        {active && <Check className="ml-auto h-3.5 w-3.5 text-neon-violet" />}
      </div>
      <p className="text-xs text-text-muted">{desc}</p>
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

// Re-export the icons + types so callers can import from one place.
export { hubApi, hubFileApi };
export type { HubFolder, HubLink, HubFile };
