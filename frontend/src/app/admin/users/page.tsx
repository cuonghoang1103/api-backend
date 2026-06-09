'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import {
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  RefreshCw,
  AlertTriangle,
  Lock,
  Unlock,
  Trash2,
  Shield,
} from 'lucide-react';

interface BackendUser {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  bio?: string;
  avatarUrl?: string;
  /** "google" | "github" | "facebook" | null (null = credentials/thường) */
  provider?: string;
  roles: string[];
  primaryRole?: string;
  enabled: boolean;
  accountNonLocked: boolean;
  createdAt: string;
  roleVersion?: number;
}

interface PageData<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

/** Provider display config */
const PROVIDER_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  google:     { label: 'Google',  color: 'bg-red-500/15 text-red-400',    icon: '🔴' },
  github:     { label: 'GitHub',  color: 'bg-gray-500/15 text-gray-300',  icon: '🐙' },
  facebook:   { label: 'Facebook',color: 'bg-blue-500/15 text-blue-400',  icon: '📘' },
  credentials:{ label: 'Thường',  color: 'bg-neon-indigo/15 text-neon-indigo', icon: '🔑' },
};

type FilterMode = 'all' | 'credentials' | 'google' | 'github' | 'facebook';

const FILTER_OPTIONS: { value: FilterMode; label: string }[] = [
  { value: 'all',         label: 'Tất cả' },
  { value: 'credentials', label: 'Tài khoản thường' },
  { value: 'google',      label: 'Google' },
  { value: 'github',      label: 'GitHub' },
  { value: 'facebook',    label: 'Facebook' },
];

function RoleBadge({ role }: { role: string }) {
  const normalized = role.replace('ROLE_', '').toUpperCase();
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
      normalized === 'ADMIN'     ? 'bg-yellow-500/15 text-yellow-400' :
      normalized === 'MODERATOR'? 'bg-blue-500/15 text-blue-400'     :
      normalized === 'EDITOR'    ? 'bg-emerald-500/15 text-emerald-400':
      'bg-neon-indigo/15 text-neon-indigo'
    }`}>
      {normalized}
    </span>
  );
}

function DeleteConfirmDialog({
  user,
  onConfirm,
  onCancel,
}: {
  user: BackendUser;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-darkcard border border-darkborder rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-text-primary">Xóa tài khoản</h3>
            <p className="text-xs text-text-muted">Hành động không thể hoàn tác</p>
          </div>
        </div>
        <p className="text-sm text-text-secondary mb-1">
          Bạn có chắc muốn xóa tài khoản <span className="font-semibold text-text-primary">{user.username || user.email}</span>?
        </p>
        <p className="text-xs text-text-muted mb-6">
          User ID: {user.id} · {user.email}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-xl border border-darkborder text-sm text-text-secondary hover:bg-white/5 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-sm font-medium text-red-400 transition-colors"
          >
            Xóa vĩnh viễn
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // ── State ────────────────────────────────────────────────────────────────
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [users, setUsers] = useState<BackendUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editRoles, setEditRoles] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BackendUser | null>(null);
  const [selfRoleChanged, setSelfRoleChanged] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isOAuthAdmin, setIsOAuthAdmin] = useState(false);
  const initialRoleVersion = { current: null as number | null };

  const backendUser = useAuthStore((s) => s.user);
  const currentAuthUser = ((backendUser ?? session?.user) as any) || null;

  // ── Auth detection ───────────────────────────────────────────────────────
  useEffect(() => {
    const currentUser = currentAuthUser;
    const isSAdmin =
      currentUser?.username === 'cuong03dx' ||
      backendUser?.username === 'cuong03dx' ||
      (currentUser?.email || '').toLowerCase() === 'cuong03dx@gmail.com' ||
      (backendUser?.email || '').toLowerCase() === 'cuong03dx@gmail.com';
    setIsSuperAdmin(isSAdmin);
    setIsOAuthAdmin(!backendUser && !!session?.user);
  }, [currentAuthUser, session, backendUser]);

  // ── Self role change detection ───────────────────────────────────────────
  useEffect(() => {
    const currentUser = currentAuthUser;
    if (!currentUser) return;
    if (initialRoleVersion.current === null) {
      initialRoleVersion.current = currentUser.roleVersion ?? 0;
      return;
    }
    const currentVersion = currentUser.roleVersion ?? 0;
    if (initialRoleVersion.current > 0 && currentVersion > initialRoleVersion.current) {
      const role = (currentUser.role as string || '').replace('ROLE_', '').toUpperCase();
      if (role !== 'ADMIN') {
        setSelfRoleChanged(true);
      }
    }
  }, [currentAuthUser]);

  // ── Fetch users from backend (with provider filter) ─────────────────────
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        size: '15',
        ...(search && { keyword: search }),
      });
      // Backend handles provider filtering — no client-side filter needed
      const providerParam = filterMode === 'all' ? '' : filterMode;
      if (providerParam) params.set('provider', providerParam);

      const res = await api.get(`/admin/users?${params}`);
      const usersData = res.data?.data;
      const pagination = res.data?.pagination;
      setUsers(Array.isArray(usersData) ? usersData : []);
      setTotalPages(pagination?.totalPages || 0);
      setTotalElements(pagination?.total || 0);
    } catch {
      toast.error('Lỗi tải danh sách users');
    } finally {
      setLoading(false);
    }
  }, [page, search, filterMode]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ── Role helpers ─────────────────────────────────────────────────────────
  const getRoles = (user: BackendUser): string[] => {
    if (!user.roles) return [];
    if (Array.isArray(user.roles)) return user.roles.map((r: string) => r.replace('ROLE_', ''));
    return [];
  };

  const isAdmin = (user: BackendUser) =>
    getRoles(user).some((r) => r.toUpperCase() === 'ADMIN');

  // ── Edit roles ──────────────────────────────────────────────────────────
  const startEditRoles = (user: BackendUser) => {
    setEditingId(user.id);
    setEditRoles(getRoles(user));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditRoles([]);
  };

  const saveRoles = async (userId: number) => {
    void userId;
    toast.info('Cập nhật vai trò chưa được backend hiện tại hỗ trợ.');
  };

  const toggleRole = (role: string) => {
    setEditRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  // ── Toggle enabled ─────────────────────────────────────────────────────
  const handleToggleEnabled = async (user: BackendUser) => {
    setActionLoading(user.id);
    try {
      await api.patch(`/admin/users/${user.id}/toggle-enabled`);
      toast.success(
        user.enabled ? 'Đã vô hiệu hóa tài khoản' : 'Đã kích hoạt tài khoản'
      );
      fetchUsers();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.userFriendlyMessage ||
        'Thao tác thất bại';
      toast.error(msg);
    } finally {
      setActionLoading(null);
    }
  };

  // ── Toggle locked ───────────────────────────────────────────────────────
  const handleToggleLocked = async (user: BackendUser) => {
    setActionLoading(user.id);
    try {
      await api.patch(`/admin/users/${user.id}/toggle-locked`);
      toast.success(
        user.accountNonLocked ? 'Đã khóa tài khoản' : 'Đã mở khóa tài khoản'
      );
      fetchUsers();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.userFriendlyMessage ||
        'Thao tác thất bại';
      toast.error(msg);
    } finally {
      setActionLoading(null);
    }
  };

  // ── Delete user ─────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(deleteTarget.id);
    try {
      await api.delete(`/admin/users/${deleteTarget.id}`);
      toast.success('Đã xóa tài khoản thành công!');
      setDeleteTarget(null);
      // If deleting self, sign out
      const currentUser = currentAuthUser;
      if (currentUser?.id === deleteTarget.id || currentUser?.email === deleteTarget.email) {
        await signOut({ redirect: false });
        setTimeout(() => router.push('/login'), 1000);
        return;
      }
      fetchUsers();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.userFriendlyMessage ||
        'Xóa thất bại';
      toast.error(msg);
    } finally {
      setActionLoading(null);
    }
  };

  // ── OAuth refresh ───────────────────────────────────────────────────────
  const refreshOAuthSession = async () => {
    toast.info('Đang làm mới phiên...');
    await signOut({ redirect: false });
    setTimeout(() => router.push('/login'), 500);
  };

  const allRoles = ['ADMIN', 'USER', 'MODERATOR', 'EDITOR'];
  const pageSize = 15;

  return (
    <div className="space-y-6">
      {/* ── Alerts ──────────────────────────────────────────────────── */}
      {isOAuthAdmin && (session?.user as any)?.role === 'ADMIN' && (
        <div className="flex items-center gap-3 px-4 py-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-400">Phiên OAuth có thể chưa cập nhật vai trò mới nhất</p>
            <p className="text-xs text-yellow-300/70">Nếu bạn mới được thêm ADMIN, hãy đăng nhập lại.</p>
          </div>
          <button onClick={refreshOAuthSession} className="px-3 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 text-xs font-medium rounded-lg transition-colors shrink-0">
            Đăng nhập lại
          </button>
        </div>
      )}

      {selfRoleChanged && (
        <div className="flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-400">Quyền admin của bạn đã bị thu hồi</p>
            <p className="text-xs text-red-300/70">Bạn sẽ không còn truy cập trang admin sau khi thoát.</p>
          </div>
          <button
            onClick={async () => { await signOut({ redirect: false }); router.push('/login'); }}
            className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-medium rounded-lg transition-colors shrink-0"
          >
            Đăng xuất
          </button>
        </div>
      )}

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">Quản lý Users</h1>
          <p className="text-text-secondary mt-1">
            {totalElements > 0 ? `${totalElements} tài khoản` : 'Tất cả tài khoản'} — credentials, Google & GitHub
          </p>
        </div>
        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-darkcard border border-darkborder text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Làm mới</span>
        </button>
      </div>

      {/* ── Filter + search row ──────────────────────────────────────── */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Provider filter tabs */}
        <div className="flex gap-1 bg-darkcard border border-darkborder rounded-xl p-1 overflow-x-auto">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { setFilterMode(opt.value); setPage(0); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                filterMode === opt.value
                  ? 'bg-neon-violet text-white shadow-sm'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {opt.value === 'google'   ? '🔴 Google'   :
               opt.value === 'github'   ? '🐙 GitHub'    :
               opt.value === 'facebook' ? '📘 Facebook' :
               opt.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Tìm user..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full pl-10 pr-4 py-2 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors"
          />
        </div>
      </div>

      {/* ── Table ─────────────────────────────────────────────────────── */}
      <div className="bg-darkcard border border-darkborder rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-darkborder">
                <th className="text-left px-5 py-4 text-xs font-medium text-text-muted uppercase tracking-wider">User</th>
                <th className="text-left px-5 py-4 text-xs font-medium text-text-muted uppercase tracking-wider hidden md:table-cell">Loại</th>
                <th className="text-left px-5 py-4 text-xs font-medium text-text-muted uppercase tracking-wider hidden sm:table-cell">Roles</th>
                <th className="text-left px-5 py-4 text-xs font-medium text-text-muted uppercase tracking-wider hidden lg:table-cell">Trạng thái</th>
                <th className="text-left px-5 py-4 text-xs font-medium text-text-muted uppercase tracking-wider hidden xl:table-cell">Ngày tạo</th>
                <th className="text-right px-5 py-4 text-xs font-medium text-text-muted uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-darkborder">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-5 py-6">
                      <div className="h-4 bg-darkborder/50 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-text-muted">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Không có user nào</p>
                    <p className="text-xs mt-1 opacity-60">
                      {filterMode !== 'all' ? `Thử chọn filter khác` : search ? 'Thử từ khóa khác' : ''}
                    </p>
                  </td>
                </tr>
              ) : (
                users.map((user: BackendUser) => {
                  const isSelf = currentAuthUser?.id === user.id ||
                    currentAuthUser?.email === user.email;
                  const isEditing = editingId === user.id;
                  const isActing = actionLoading === user.id;
                  const pcfg = user.provider
                    ? (PROVIDER_CONFIG[user.provider] || { label: user.provider, color: 'bg-gray-500/15 text-gray-300', icon: '?' })
                    : PROVIDER_CONFIG['credentials'];

                  return (
                    <tr key={user.id} className={`hover:bg-white/[0.02] transition-colors ${isSelf ? 'bg-neon-violet/5' : ''}`}>
                      {/* User info */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neon-indigo to-neon-violet flex items-center justify-center text-white text-sm font-medium flex-shrink-0 overflow-hidden">
                            {user.avatarUrl ? (
                              <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              (user.username || user.email || 'U')?.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="text-sm font-medium text-text-primary truncate">{user.username || '—'}</p>
                              {isSelf && <span className="text-[10px] px-1 py-0.5 rounded bg-neon-violet/20 text-neon-violet">bạn</span>}
                              {isAdmin(user) && !isSelf && <Shield className="w-3 h-3 text-yellow-400 shrink-0" />}
                            </div>
                            <p className="text-xs text-text-muted truncate">{user.email || '—'}</p>
                          </div>
                        </div>
                      </td>

                      {/* Provider badge */}
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${pcfg.color}`}>
                          {pcfg.icon} {pcfg.label}
                        </span>
                      </td>

                      {/* Roles */}
                      <td className="px-5 py-4 hidden sm:table-cell">
                        {isEditing ? (
                          <div className="flex flex-wrap gap-1 max-w-[180px]">
                            {allRoles.map((role) => (
                              <button
                                key={role}
                                onClick={() => toggleRole(role)}
                                className={`px-2 py-0.5 rounded-full text-xs font-medium border transition-colors ${
                                  editRoles.includes(role)
                                    ? 'bg-neon-violet/15 text-neon-violet border-neon-violet/30'
                                    : 'bg-darkbg text-text-muted border-darkborder hover:border-neon-violet/20'
                                }`}
                              >
                                {role}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {getRoles(user).map((role) => (
                              <RoleBadge key={role} role={role} />
                            ))}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <div className="flex flex-col gap-1">
                          {user.enabled ? (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                              <CheckCircle className="w-3.5 h-3.5" /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-red-400">
                              <XCircle className="w-3.5 h-3.5" /> Disabled
                            </span>
                          )}
                          {user.accountNonLocked === false && (
                            <span className="inline-flex items-center gap-1 text-xs text-orange-400">
                              <Lock className="w-3.5 h-3.5" /> Locked
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Created at */}
                      <td className="px-5 py-4 hidden xl:table-cell">
                        <span className="text-sm text-text-muted">
                          {(() => {
                            try {
                              return new Date(user.createdAt).toLocaleDateString('vi-VN', {
                                day: '2-digit', month: '2-digit', year: 'numeric',
                              });
                            } catch { return '—'; }
                          })()}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => saveRoles(user.id)}
                                disabled={isActing}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition-colors text-xs font-medium disabled:opacity-50"
                              >
                                {isActing ? <RefreshCw className="w-3 h-3 animate-spin" /> : 'Lưu'}
                              </button>
                              <button
                                onClick={cancelEdit}
                                disabled={isActing}
                                className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text-primary transition-colors disabled:opacity-50"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <>
                              {/* Edit roles — super-admin only */}
                              {isSuperAdmin ? (
                                <button
                                  onClick={() => startEditRoles(user)}
                                  disabled={isActing}
                                  className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-neon-violet transition-colors disabled:opacity-50"
                                  title="Phân quyền (chỉ cuong03dx)"
                                >
                                  ⚙️
                                </button>
                              ) : (
                                <div className="p-2 rounded-lg text-darkborder cursor-not-allowed opacity-30" title="Chỉ cuong03dx có quyền">
                                  ⚙️
                                </div>
                              )}

                              {/* Toggle enabled/disabled */}
                              <button
                                onClick={() => handleToggleEnabled(user)}
                                disabled={isActing}
                                className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                                  user.enabled
                                    ? 'hover:bg-red-500/10 text-text-muted hover:text-red-400'
                                    : 'hover:bg-emerald-500/10 text-text-muted hover:text-emerald-400'
                                }`}
                                title={user.enabled ? 'Vô hiệu hóa' : 'Kích hoạt'}
                              >
                                {user.enabled
                                  ? <XCircle className="w-4 h-4" />
                                  : <CheckCircle className="w-4 h-4" />}
                              </button>

                              {/* Toggle lock/unlock */}
                              <button
                                onClick={() => handleToggleLocked(user)}
                                disabled={isActing}
                                className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                                  user.accountNonLocked
                                    ? 'hover:bg-orange-500/10 text-text-muted hover:text-orange-400'
                                    : 'hover:bg-emerald-500/10 text-text-muted hover:text-emerald-400'
                                }`}
                                title={user.accountNonLocked ? 'Khóa tài khoản' : 'Mở khóa'}
                              >
                                {user.accountNonLocked
                                  ? <Lock className="w-4 h-4" />
                                  : <Unlock className="w-4 h-4" />}
                              </button>

                              {/* Delete — super-admin only */}
                              {isSuperAdmin && !isSelf ? (
                                <button
                                  onClick={() => setDeleteTarget(user)}
                                  disabled={isActing}
                                  className="p-2 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors disabled:opacity-50"
                                  title="Xóa tài khoản"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              ) : isSelf ? (
                                <div className="p-2 rounded-lg text-darkborder cursor-not-allowed opacity-20" title="Không thể tự xóa mình">
                                  <Trash2 className="w-4 h-4" />
                                </div>
                              ) : (
                                <div className="p-2 rounded-lg text-darkborder cursor-not-allowed opacity-20" title="Chỉ cuong03dx được xóa">
                                  <Trash2 className="w-4 h-4" />
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ────────────────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-darkborder flex items-center justify-between">
            <span className="text-sm text-text-muted">
              Tổng: {totalElements} user · Trang {page + 1} / {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-2 rounded-lg hover:bg-white/5 text-text-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-text-primary px-2">{page + 1}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="p-2 rounded-lg hover:bg-white/5 text-text-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Delete confirmation dialog ───────────────────────────────── */}
      {deleteTarget && (
        <DeleteConfirmDialog
          user={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
