'use client';

/**
 * /settings/account — Tài khoản & Dữ liệu (Nghị định 13/2023).
 * Self-service data export + account erasure (anonymisation).
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Download, Trash2, Loader2, ShieldAlert } from 'lucide-react';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export default function AccountDataPage() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [exporting, setExporting] = useState(false);
  const [confirm, setConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await authApi.exportData();
      const data = (res.data as { data?: unknown })?.data ?? res.data;
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cuongthai-du-lieu-cua-toi-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success('Đã tải bản sao dữ liệu của bạn.');
    } catch {
      toast.error('Không tải được dữ liệu. Vui lòng thử lại.');
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async () => {
    if (confirm.trim().toUpperCase() !== 'XOA') return;
    setDeleting(true);
    try {
      await authApi.deleteAccount();
      toast.success('Tài khoản của bạn đã được xoá.');
      await logout();
      router.replace('/');
    } catch {
      toast.error('Xoá tài khoản thất bại. Vui lòng thử lại hoặc liên hệ hỗ trợ.');
      setDeleting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-16" style={{ background: 'var(--bg-primary)' }}>
        <div className="mx-auto max-w-2xl px-4 py-16 text-center" style={{ color: 'var(--text-secondary)' }}>
          Vui lòng <button onClick={() => router.push('/login')} className="text-neon-violet hover:underline">đăng nhập</button> để quản lý dữ liệu tài khoản.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16" style={{ background: 'var(--bg-primary)' }}>
      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-12">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Tài khoản &amp; Dữ liệu</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
          Quyền của bạn theo Nghị định 13/2023/NĐ-CP. Xem thêm{' '}
          <a href="/chinh-sach-bao-mat" className="text-neon-violet hover:underline">Chính sách bảo mật</a>.
        </p>

        {/* Export */}
        <section className="mt-6 rounded-2xl border p-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <h2 className="flex items-center gap-2 text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            <Download className="h-4 w-4 text-neon-violet" /> Tải dữ liệu của tôi
          </h2>
          <p className="mt-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Tải về bản sao (JSON) thông tin cá nhân và đơn hàng của bạn.
          </p>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="mt-3 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg,#8b5cf6,#06b6d4)' }}
          >
            {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Tải xuống (.json)
          </button>
        </section>

        {/* Delete */}
        <section className="mt-6 rounded-2xl border p-5" style={{ borderColor: 'rgba(244,63,94,0.35)', background: 'rgba(244,63,94,0.05)' }}>
          <h2 className="flex items-center gap-2 text-base font-semibold" style={{ color: '#f43f5e' }}>
            <ShieldAlert className="h-4 w-4" /> Xoá tài khoản
          </h2>
          <p className="mt-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Thao tác này <b>không thể hoàn tác</b>. Thông tin cá nhân của bạn (tên, email,
            số điện thoại, địa chỉ, ảnh) sẽ được <b>ẩn danh hoá</b> và tài khoản bị vô hiệu hoá.
            Bản ghi đơn hàng được giữ ở dạng ẩn danh cho mục đích kế toán/pháp lý.
          </p>
          <label className="mt-3 block text-xs" style={{ color: 'var(--text-muted)' }}>
            Gõ <b>XOA</b> để xác nhận
          </label>
          <input
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="XOA"
            className="mt-1.5 w-full max-w-[200px] rounded-lg border px-3 py-2 text-sm outline-none"
            style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          />
          <div className="mt-3">
            <button
              onClick={handleDelete}
              disabled={deleting || confirm.trim().toUpperCase() !== 'XOA'}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:bg-red-700 disabled:opacity-40"
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Xoá tài khoản của tôi
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
