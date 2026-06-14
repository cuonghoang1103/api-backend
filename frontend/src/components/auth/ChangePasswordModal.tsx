'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2, Lock, ShieldCheck, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'),
    newPassword: z
      .string()
      .min(12, 'Mật khẩu mới phải có ít nhất 12 ký tự')
      .regex(/[A-Z]/, 'Phải có ít nhất 1 chữ hoa')
      .regex(/[a-z]/, 'Phải có ít nhất 1 chữ thường')
      .regex(/[0-9]/, 'Phải có ít nhất 1 chữ số')
      .regex(/[^A-Za-z0-9]/, 'Phải có ít nhất 1 ký tự đặc biệt'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: 'Mật khẩu mới phải khác mật khẩu hiện tại',
    path: ['newPassword'],
  });

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({ open, onClose }: ChangePasswordModalProps) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const logout = useAuthStore((s) => s.logout);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onBlur',
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      reset();
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
    }
  }, [open, reset]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitting) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, submitting, onClose]);

  const newPassword = watch('newPassword');

  const passwordChecks = [
    { label: 'Ít nhất 12 ký tự', ok: newPassword.length >= 12 },
    { label: 'Có chữ hoa (A-Z)', ok: /[A-Z]/.test(newPassword) },
    { label: 'Có chữ thường (a-z)', ok: /[a-z]/.test(newPassword) },
    { label: 'Có chữ số (0-9)', ok: /[0-9]/.test(newPassword) },
    { label: 'Có ký tự đặc biệt (!@#...)', ok: /[^A-Za-z0-9]/.test(newPassword) },
  ];

  const onSubmit = async (data: ChangePasswordForm) => {
    setSubmitting(true);
    try {
      await authApi.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      toast.success('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
      // Backend clears the backend_token cookie on success, so log the
      // user out client-side and bounce them to /login.
      try {
        logout();
      } catch {}
      onClose();
      // Hard navigation so all auth-dependent state resets cleanly
      window.location.href = '/login';
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const msg = error.response?.data?.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => !submitting && onClose()}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, type: 'spring', damping: 24, stiffness: 280 }}
            className="fixed inset-0 z-[61] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-md pointer-events-auto bg-[#0d0f18]/95 backdrop-blur-xl
                border border-white/[0.08] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            >
              {/* Top accent */}
              <div
                className="h-0.5 w-full rounded-t-2xl"
                style={{ background: 'linear-gradient(90deg, #8B5CF6, #06b6d4)' }}
              />

              {/* Close */}
              <button
                onClick={() => !submitting && onClose()}
                disabled={submitting}
                className="absolute top-3.5 right-3.5 w-8 h-8 rounded-lg flex items-center justify-center
                  text-text-muted hover:text-text-primary hover:bg-white/5
                  transition-colors disabled:opacity-40"
                aria-label="Đóng"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="px-6 pt-6 pb-3 text-center">
                <div
                  className="w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(6,182,212,0.2))',
                    border: '1px solid rgba(139,92,246,0.3)',
                  }}
                >
                  <ShieldCheck className="w-7 h-7 text-neon-violet" />
                </div>
                <h2 className="text-xl font-heading font-bold text-text-primary">
                  Đổi mật khẩu
                </h2>
                <p className="text-text-muted text-xs mt-1">
                  Sau khi đổi, bạn sẽ được đăng xuất và cần đăng nhập lại
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-6 space-y-4">
                {/* Current password */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    Mật khẩu hiện tại
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      {...register('currentPassword')}
                      type={showCurrent ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="Nhập mật khẩu hiện tại"
                      className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/[0.04] border text-text-primary
                        placeholder:text-text-muted text-sm outline-none transition-colors
                        focus:border-neon-violet/50 ${
                          errors.currentPassword ? 'border-red-500/60' : 'border-white/[0.08]'
                        }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                    >
                      {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.currentPassword && (
                    <p className="text-red-400 text-xs mt-1">{errors.currentPassword.message}</p>
                  )}
                </div>

                {/* New password */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    Mật khẩu mới
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      {...register('newPassword')}
                      type={showNew ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Nhập mật khẩu mới"
                      className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/[0.04] border text-text-primary
                        placeholder:text-text-muted text-sm outline-none transition-colors
                        focus:border-neon-violet/50 ${
                          errors.newPassword ? 'border-red-500/60' : 'border-white/[0.08]'
                        }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                    >
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-red-400 text-xs mt-1">{errors.newPassword.message}</p>
                  )}

                  {/* Strength hints (only show when user is typing) */}
                  {newPassword && (
                    <div className="mt-2 space-y-1">
                      {passwordChecks.map((c, i) => (
                        <div key={i} className="flex items-center gap-2 text-[11px]">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              c.ok ? 'bg-green-500' : 'bg-white/20'
                            }`}
                          />
                          <span className={c.ok ? 'text-green-400' : 'text-text-muted'}>
                            {c.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Confirm new password */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    Xác nhận mật khẩu mới
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      {...register('confirmPassword')}
                      type={showConfirm ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Nhập lại mật khẩu mới"
                      className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/[0.04] border text-text-primary
                        placeholder:text-text-muted text-sm outline-none transition-colors
                        focus:border-neon-violet/50 ${
                          errors.confirmPassword ? 'border-red-500/60' : 'border-white/[0.08]'
                        }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={submitting}
                    className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-text-secondary
                      hover:text-text-primary hover:bg-white/[0.04] transition-colors text-sm
                      font-medium disabled:opacity-40"
                  >
                    Hủy
                  </button>
                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileTap={{ scale: submitting ? 1 : 0.98 }}
                    className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold
                      flex items-center justify-center gap-2
                      hover:opacity-90 transition-opacity disabled:opacity-50"
                    style={{
                      background: 'linear-gradient(135deg, #8B5CF6, #06b6d4)',
                    }}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Đang đổi...
                      </>
                    ) : (
                      'Đổi mật khẩu'
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
