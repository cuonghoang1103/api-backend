'use client';

/**
 * NotesShareManagerModal — Manage sharing for a NoteSubject (folder)
 *
 * Features:
 * - List current shares (who has access)
 * - Add new share (search users)
 * - Revoke share access
 * - Update permission (view/edit)
 */

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Users, UserPlus, Trash2, Loader2, Search,
  Eye, Edit3, Send, FolderOpen,
} from 'lucide-react';
import { toast } from 'sonner';
import { noteShareApi, type NoteShare, type NoteShareRecipientMini } from '@/lib/api';
import { cn } from '@/lib/utils';

interface NotesShareManagerModalProps {
  open: boolean;
  subject: { id: number; name: string; emoji?: string | null; color?: string | null } | null;
  onClose: () => void;
  onChanged?: () => void;
}

export default function NotesShareManagerModal({
  open, subject, onClose, onChanged,
}: NotesShareManagerModalProps) {
  const [shares, setShares] = useState<NoteShare[]>([]);
  const [loading, setLoading] = useState(true);
  const [revokingId, setRevokingId] = useState<number | null>(null);

  // Add new share form
  const [adding, setAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<NoteShareRecipientMini[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<NoteShareRecipientMini | null>(null);
  const [newPermission, setNewPermission] = useState<'view' | 'edit'>('view');
  const [creating, setCreating] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load shares for this subject
  useEffect(() => {
    if (!open || !subject) return;
    setLoading(true);
    noteShareApi.listBySubject(subject.id)
      .then(r => setShares(r.data.data ?? []))
      .catch(() => toast.error('Không tải được danh sách chia sẻ'))
      .finally(() => setLoading(false));
  }, [open, subject?.id]);

  // Search users
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    debounceRef.current = setTimeout(() => {
      setSearching(true);
      noteShareApi.searchUsers(searchQuery, 8)
        .then(r => setSearchResults(r.data.data ?? []))
        .catch(() => setSearchResults([]))
        .finally(() => setSearching(false));
    }, 250);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchQuery]);

  const revokeShare = async (share: NoteShare) => {
    if (!confirm(`Thu hồi quyền truy cập của @${share.recipient?.username}?`)) return;
    setRevokingId(share.id);
    const prev = shares;
    setShares(cur => cur.filter(s => s.id !== share.id));
    try {
      await noteShareApi.delete(share.id);
      toast.success(`Đã thu hồi quyền của @${share.recipient?.username}`);
      onChanged?.();
    } catch {
      setShares(prev);
      toast.error('Không thể thu hồi');
    } finally {
      setRevokingId(null);
    }
  };

  const addShare = async () => {
    if (!subject || !selectedUser) return;
    setCreating(true);
    try {
      const r = await noteShareApi.create({
        subjectId: subject.id,
        recipientId: selectedUser.id,
        permission: newPermission,
      });
      setShares(cur => [r.data.data, ...cur]);
      setAdding(false);
      setSelectedUser(null);
      setSearchQuery('');
      setSearchResults([]);
      toast.success(`Đã chia sẻ với @${selectedUser.username}`);
      onChanged?.();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Không thể chia sẻ');
    } finally {
      setCreating(false);
    }
  };

  return (
    <AnimatePresence>
      {open && subject && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-lg bg-darkcard rounded-2xl border border-darkborder shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-darkborder">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-neon-violet/10">
                  <FolderOpen className="h-5 w-5 text-neon-violet" />
                </div>
                <div>
                  <h2 className="font-semibold text-text-primary">Chia sẻ ghi chú</h2>
                  <p className="text-xs text-text-muted">{subject.emoji} {subject.name}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-text-primary transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {/* Current shares */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-text-muted mb-3">
                  Đã chia sẻ với ({shares.length} người)
                </h3>

                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin text-text-muted" />
                  </div>
                ) : shares.length === 0 ? (
                  <div className="text-center py-6 text-text-muted text-sm">
                    Chưa chia sẻ với ai
                  </div>
                ) : (
                  <div className="space-y-2">
                    {shares.map(share => (
                      <div
                        key={share.id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-darkbg/50 border border-darkborder/50"
                      >
                        {/* Avatar */}
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-gradient-to-br from-neon-violet to-neon-pink flex items-center justify-center shrink-0">
                          {share.recipient?.avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={share.recipient.avatarUrl} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-sm font-semibold text-white">
                              {(share.recipient?.displayName || share.recipient?.username || '?').slice(0, 1).toUpperCase()}
                            </span>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-text-primary truncate">
                            {share.recipient?.displayName || share.recipient?.username}
                          </p>
                          <p className="text-xs text-text-muted">
                            @{share.recipient?.username}
                          </p>
                        </div>

                        {/* Permission badge */}
                        <div className={cn(
                          'px-2 py-1 rounded-full text-xs font-medium',
                          share.permission === 'edit'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-slate-500/10 text-slate-400'
                        )}>
                          {share.permission === 'edit' ? (
                            <span className="flex items-center gap-1">
                              <Edit3 className="h-3 w-3" /> Chỉnh sửa
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" /> Xem
                            </span>
                          )}
                        </div>

                        {/* Revoke button */}
                        <button
                          onClick={() => revokeShare(share)}
                          disabled={revokingId === share.id}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors"
                          title="Thu hồi quyền truy cập"
                        >
                          {revokingId === share.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add new share */}
              {adding ? (
                <div className="border-t border-darkborder pt-4 mt-4">
                  <h3 className="text-sm font-medium text-text-muted mb-3">Chia sẻ với</h3>

                  {/* User search */}
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => { setSearchQuery(e.target.value); setSelectedUser(null); }}
                      placeholder="Tìm người dùng..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-darkborder bg-darkbg/60 text-sm text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none"
                    />
                    {/* Search results */}
                    {searchQuery && (
                      <div className="absolute z-10 w-full mt-1 bg-darkcard rounded-xl border border-darkborder shadow-xl max-h-48 overflow-y-auto">
                      {searching ? (
                        <div className="p-3 text-center text-text-muted text-sm">
                          <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                        </div>
                      ) : searchResults.length === 0 ? (
                        <div className="p-3 text-center text-text-muted text-sm">
                          Không tìm thấy người dùng
                        </div>
                      ) : (
                        searchResults.map(user => (
                          <button
                            key={user.id}
                            onClick={() => { setSelectedUser(user); setSearchQuery(''); setSearchResults([]); }}
                            className={cn(
                              'w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-colors text-left',
                              selectedUser?.id === user.id && 'bg-neon-violet/10'
                            )}
                          >
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-neon-violet to-neon-pink flex items-center justify-center shrink-0">
                              {user.avatarUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={user.avatarUrl} alt="" className="h-full w-full object-cover rounded-full" />
                              ) : (
                                <span className="text-xs font-semibold text-white">
                                  {(user.displayName || user.username || '?').slice(0, 1).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-text-primary">{user.displayName || user.username}</p>
                              <p className="text-xs text-text-muted">@{user.username}</p>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                  {selectedUser && (
                    <div className="mt-2 p-3 rounded-xl bg-darkbg/50 border border-darkborder/50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-neon-violet to-neon-pink flex items-center justify-center">
                          {selectedUser.avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={selectedUser.avatarUrl} alt="" className="h-full w-full object-cover rounded-full" />
                          ) : (
                            <span className="text-xs font-semibold text-white">
                              {(selectedUser.displayName || selectedUser.username || '?').slice(0, 1).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-medium text-text-primary">@{selectedUser.username}</span>
                      </div>
                      <button
                        onClick={() => setSelectedUser(null)}
                        className="text-text-muted hover:text-text-primary"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
                </div>
              ) : null}

              {/* Permission select */}
              {adding && selectedUser && (
                <div className="mb-3">
                  <label className="text-xs text-text-muted mb-1.5 block">Quyền truy cập</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setNewPermission('view')}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border text-sm font-medium transition-colors',
                        newPermission === 'view'
                          ? 'border-neon-violet bg-neon-violet/10 text-neon-violet'
                          : 'border-darkborder text-text-muted hover:border-darkborder/80'
                      )}
                    >
                      <Eye className="h-4 w-4" /> Xem
                    </button>
                    <button
                      onClick={() => setNewPermission('edit')}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border text-sm font-medium transition-colors',
                        newPermission === 'edit'
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                          : 'border-darkborder text-text-muted hover:border-darkborder/80'
                      )}
                    >
                      <Edit3 className="h-4 w-4" /> Chỉnh sửa
                    </button>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                {adding ? (
                  <>
                    <button
                      onClick={() => { setAdding(false); setSelectedUser(null); setSearchQuery(''); }}
                      className="flex-1 py-2.5 rounded-xl border border-darkborder text-text-secondary hover:bg-darkcard/50 transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={addShare}
                      disabled={!selectedUser || creating}
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-neon-violet to-neon-purple text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {creating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      Chia sẻ
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setAdding(true)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-darkborder text-text-muted hover:border-neon-violet hover:text-neon-violet transition-colors"
                  >
                    <UserPlus className="h-4 w-4" />
                    Chia sẻ với người khác
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
