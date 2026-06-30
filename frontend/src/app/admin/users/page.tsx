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
  Settings,
  BadgeCheck,
  MailWarning,
} from 'lucide-react';

interface BackendUser {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  /** "google" | "github" | "facebook" | null (null = credentials/thường) */
  provider?: string;
  // Backend may return either a flat string[] (e.g. ['user','admin'])
  // OR the raw Prisma include shape `[{ userId, roleId, role: { name } }]`.
  // The page-side helper `getRoles` normalizes both.
  roles: string[] | { role: { name: string } }[];
  primaryRole?: string;
  enabled: boolean;
  accountNonLocked: boolean;
  emailVerified: boolean;
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

/** Provider display config — cyberpunk neon style */
const PROVIDER_CONFIG: Record<string, { label: string; style: string; icon: string }> = {
  google: {
    label: 'Google',
    style: 'bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_8px_rgba(248,113,113,0.15)]',
    icon: 'G',
  },
  github: {
    label: 'GitHub',
    style: 'bg-white/[0.06] text-gray-200 border border-white/[0.12] shadow-[0_0_8px_rgba(255,255,255,0.05)]',
    icon: 'gh',
  },
  facebook: {
    label: 'Facebook',
    style: 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_8px_rgba(59,130,246,0.15)]',
    icon: 'f',
  },
  credentials: {
    label: 'Credentials',
    style: 'bg-violet-500/10 text-violet-400 border border-violet-500/20 shadow-[0_0_8px_rgba(139,92,246,0.15)]',
    icon: '🔑',
  },
};

type FilterMode = 'all' | 'credentials' | 'google' | 'github' | 'facebook';

const FILTER_OPTIONS: { value: FilterMode; label: string }[] = [
  { value: 'all',         label: 'Tất cả' },
  { value: 'credentials', label: 'Tài khoản thường' },
  { value: 'google',      label: 'Google' },
  { value: 'github',      label: 'GitHub' },
  { value: 'facebook',    label: 'Facebook' },
];

const ALL_ROLES = ['admin', 'user'];

function getRoles(user: BackendUser): string[] {
  if (!user.roles) return [];
  if (!Array.isArray(user.roles)) return [];
  return user.roles
    .map((r: unknown): string => {
      if (typeof r === 'string') return r;
      if (r && typeof r === 'object' && 'role' in r) {
        const inner = (r as { role?: { name?: unknown } }).role;
        if (inner && typeof inner.name === 'string') return inner.name;
      }
      return '';
    })
    .filter((name) => name.length > 0)
    .map((name) => name.replace('ROLE_', '').toLowerCase());
}

function RoleBadge({ role }: { role: string }) {
  const safe = typeof role === 'string' ? role : '';
  const normalized = safe.replace('ROLE_', '').toUpperCase();
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
  const canDelete = !user.emailVerified;
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
        {!canDelete && (
          <div className="flex items-start gap-2 mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
            <p className="text-xs text-yellow-300">
              Email đã xác minh — tài khoản này không thể bị xóa theo chính sách bảo vệ dữ liệu.
            </p>
          </div>
        )}
        <p className="text-sm text-text-secondary mb-1">
          Bạn có chắc muốn xóa tài khoản <span className="font-semibold text-text-primary">{user.username || user.email}</span>?
        </p>
        <p className="text-xs text-text-muted mb-1">
          User ID: {user.id} · {user.email}
        </p>
        <p className="text-xs text-text-muted mb-6">
          Email verified: <span className={user.emailVerified ? 'text-emerald-400' : 'text-orange-400'}>
            {user.emailVerified ? 'Có (không thể xóa)' : 'Chưa (có thể xóa)'}
          </span>
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
            disabled={!canDelete}
            className="flex-1 px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-sm font-medium text-red-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Xóa vĩnh viễn
          </button>
        </div>
      </div>
    </div>
  );
}

interface EditUserForm {
  displayName: string;
  emailVerified: boolean;
  roles: string[];
}

function EditUserModal({
  user,
  onSave,
  onClose,
  isSaving,
}: {
  user: BackendUser;
  onSave: (form: EditUserForm) => void;
  onClose: () => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState<EditUserForm>({
    displayName: user.displayName ?? user.fullName ?? '',
    emailVerified: user.emailVerified ?? false,
    roles: getRoles(user),
  });

  const toggleRole = (role: string) => {
    setForm((prev) => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-darkcard border border-darkborder rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-neon-violet/10 flex items-center justify-center">
            <Settings className="w-5 h-5 text-neon-violet" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-text-primary">Chỉnh sửa người dùng</h3>
            <p className="text-xs text-text-muted">{user.username} · {user.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Display Name */}
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">
              Tên hiển thị (Display Name)
            </label>
            <input
              type="text"
              value={form.displayName}
              onChange={(e) => setForm((p) => ({ ...p, displayName: e.target.value }))}
              placeholder="Nhập tên hiển thị…"
              className="w-full px-3 py-2 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors"
            />
          </div>

          {/* Email Verified Toggle */}
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">
              Trạng thái xác minh email
            </label>
            <button
              type="button"
              onClick={() => setForm((p) => ({ ...p, emailVerified: !p.emailVerified }))}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl border transition-colors text-sm ${
                form.emailVerified
                  ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                  : 'bg-orange-500/10 border-orange-500/25 text-orange-400'
              }`}
            >
              {form.emailVerified
                ? <BadgeCheck className="w-4 h-4 shrink-0" />
                : <MailWarning className="w-4 h-4 shrink-0" />}
              <span className="font-medium">
                {form.emailVerified ? 'Email đã xác minh' : 'Email chưa xác minh'}
              </span>
              <span className="ml-auto text-xs opacity-60">
                {form.emailVerified ? 'Nhấn để hủy xác minh' : 'Nhấn để xác minh thủ công'}
              </span>
            </button>
            {form.emailVerified && !user.emailVerified && (
              <p className="text-xs text-yellow-400/80 mt-1.5 pl-1">
                ⚠ Sau khi lưu, tài khoản sẽ không thể xóa cho đến khi hủy xác minh trở lại.
              </p>
            )}
          </div>

          {/* Roles */}
          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">Vai trò (Roles)</label>
            <div className="flex flex-wrap gap-2">
              {ALL_ROLES.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRole(role)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    form.roles.includes(role)
                      ? 'bg-neon-violet/15 text-neon-violet border-neon-violet/30'
                      : 'bg-darkbg text-text-muted border-darkborder hover:border-neon-violet/20'
                  }`}
                >
                  {role.toUpperCase()}
                </button>
              ))}
            </div>
            {form.roles.length === 0 && (
              <p className="text-xs text-red-400/80 mt-1.5 pl-1">Phải chọn ít nhất một vai trò.</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 px-4 py-2 rounded-xl border border-darkborder text-sm text-text-secondary hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={isSaving || form.roles.length === 0}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-neon-violet/20 hover:bg-neon-violet/30 border border-neon-violet/30 text-sm font-medium text-neon-violet transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
            Lưu thay đổi
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
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BackendUser | null>(null);
  const [editTarget, setEditTarget] = useState<BackendUser | null>(null);
  const [selfRoleChanged, setSelfRoleChanged] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isOAuthAdmin, setIsOAuthAdmin] = useState(false);
  const initialRoleVersion = { current: null as number | null };

  const backendUser = useAuthStore((s) => s.user);
  const currentAuthUser = ((backendUser ?? session?.user) as any) || null;

  // ── Auth detection ───────────────────────────────────────────────────────
  useEffect(() => {
    const currentUser = currentAuthUser;
    // OAuth/session users carry a singular `role` string; credentials users
    // (backendUser from authStore) carry a `roles` array — check both.
    const rawRole = (currentUser?.role || '');
    const roleFromStr = (typeof rawRole === 'string' ? rawRole : '').replace('ROLE_', '').toUpperCase();
    const rolesArr: unknown[] = Array.isArray(currentUser?.roles) ? currentUser.roles : [];
    const isAdmin =
      roleFromStr === 'ADMIN' ||
      rolesArr.some((r: unknown) => (typeof r === 'string' ? r : '').replace('ROLE_', '').toUpperCase() === 'ADMIN');
    setIsSuperAdmin(isAdmin);
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
      const rawRole = currentUser.role;
      const roleStr = typeof rawRole === 'string' ? rawRole : '';
      const role = roleStr.replace('ROLE_', '').toUpperCase();
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

  const isAdmin = (user: BackendUser) =>
    getRoles(user).some((r) => r.toUpperCase() === 'ADMIN');

  // ── Edit user (Settings modal) ──────────────────────────────────────────
  const handleSaveEdit = async (form: EditUserForm) => {
    if (!editTarget) return;
    setActionLoading(editTarget.id);
    try {
      const originalRoles = getRoles(editTarget);
      const rolesChanged =
        form.roles.length !== originalRoles.length ||
        form.roles.some((r) => !originalRoles.includes(r));

      // Update profile fields (displayName, emailVerified)
      await api.put(`/admin/users/${editTarget.id}`, {
        displayName: form.displayName || null,
        emailVerified: form.emailVerified,
      });

      // Update roles if changed
      if (rolesChanged) {
        await api.patch(`/admin/users/${editTarget.id}/roles`, {
          roles: form.roles,
        });
      }

      toast.success('Đã cập nhật thông tin người dùng!');
      setEditTarget(null);
      fetchUsers();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.code ||
        'Cập nhật thất bại';
      toast.error(msg);
    } finally {
      setActionLoading(null);
    }
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
      setDeleteTarget(null);
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
                  const isActing = actionLoading === user.id;
                  const pcfg = user.provider
                    ? (PROVIDER_CONFIG[user.provider] || { label: user.provider, style: 'bg-gray-500/10 text-gray-300 border border-gray-500/20 shadow-[0_0_8px_rgba(156,163,175,0.1)]', icon: '?' })
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
                              <p className="text-sm font-medium text-text-primary truncate">
                                {user.displayName || user.username || '—'}
                              </p>
                              {isSelf && <span className="text-[10px] px-1 py-0.5 rounded bg-neon-violet/20 text-neon-violet">bạn</span>}
                              {isAdmin(user) && !isSelf && <Shield className="w-3 h-3 text-yellow-400 shrink-0" />}
                            </div>
                            <p className="text-xs text-text-muted truncate">
                              {user.displayName ? `@${user.username} · ` : ''}{user.email || '—'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Provider badge */}
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide ${pcfg.style}`}>
                          {pcfg.icon} {pcfg.label}
                        </span>
                      </td>

                      {/* Roles */}
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {getRoles(user).map((role) => (
                            <RoleBadge key={role} role={role} />
                          ))}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <div className="flex flex-col gap-1.5">
                          {user.enabled ? (
                            <span className="inline-flex items-center gap-2 text-xs font-medium text-emerald-400">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 text-xs font-medium text-red-400">
                              <span className="w-2 h-2 rounded-full bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.6)]" />
                              Disabled
                            </span>
                          )}
                          {!user.accountNonLocked && (
                            <span className="inline-flex items-center gap-2 text-xs font-medium text-orange-400">
                              <span className="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_6px_rgba(251,146,60,0.8)]" />
                              Locked
                            </span>
                          )}
                          {user.emailVerified ? (
                            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400/70">
                              <BadgeCheck className="w-3 h-3" /> Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs text-text-muted/60">
                              <MailWarning className="w-3 h-3" /> Unverified
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Created at */}
                      <td className="px-5 py-4 hidden xl:table-cell">
                        <span className="text-xs font-mono text-text-muted">
                          {(() => {
                            try {
                              const d = new Date(user.createdAt);
                              const day = String(d.getDate()).padStart(2, '0');
                              const month = String(d.getMonth() + 1).padStart(2, '0');
                              const year = d.getFullYear();
                              return `${day}/${month}/${year}`;
                            } catch { return '—'; }
                          })()}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          {/* Settings / Edit User — super-admin only */}
                          {isSuperAdmin ? (
                            <button
                              onClick={() => setEditTarget(user)}
                              disabled={isActing}
                              className="p-2 rounded-lg hover:bg-neon-violet/10 text-text-muted hover:text-neon-violet transition-colors disabled:opacity-50"
                              title="Chỉnh sửa người dùng"
                            >
                              <Settings className="w-4 h-4" />
                            </button>
                          ) : (
                            <div className="p-2 rounded-lg text-darkborder cursor-not-allowed opacity-30" title="Chỉ cuong03dx có quyền">
                              <Settings className="w-4 h-4" />
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

                          {/* Delete — super-admin only, not self */}
                          {isSuperAdmin && !isSelf ? (
                            <button
                              onClick={() => setDeleteTarget(user)}
                              disabled={isActing}
                              className="p-2 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors disabled:opacity-50"
                              title={user.emailVerified ? 'Email đã xác minh — không thể xóa' : 'Xóa tài khoản'}
                            >
                              <Trash2 className={`w-4 h-4 ${user.emailVerified ? 'opacity-40' : ''}`} />
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

      {/* ── Edit User modal ──────────────────────────────────────────── */}
      {editTarget && (
        <EditUserModal
          user={editTarget}
          onSave={handleSaveEdit}
          onClose={() => setEditTarget(null)}
          isSaving={actionLoading === editTarget.id}
        />
      )}
    </div>
  );
}
