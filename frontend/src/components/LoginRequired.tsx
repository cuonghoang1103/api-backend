'use client';

import { motion } from 'framer-motion';
import { Lock, LogIn, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface LoginRequiredProps {
  message?: string;
  redirectAfterLogin?: string;
  onClose?: () => void;
  variant?: 'inline' | 'modal';
}

/**
 * Reusable "Login required" prompt.
 * Used for:
 * - /learn/:lessonId when user not logged in
 * - "Tạo playlist" button in /music when user not logged in
 * - /admin/* redirects (as inline banner)
 */
export function LoginRequired({
  message = 'Vui lòng đăng nhập để tiếp tục',
  redirectAfterLogin,
  onClose,
  variant = 'inline',
}: LoginRequiredProps) {
  const router = useRouter();

  const handleLogin = () => {
    const redirect = redirectAfterLogin ?? (typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/');
    router.push(`/login?callbackUrl=${encodeURIComponent(redirect)}`);
  };

  const content = (
    <div className="text-center py-8 px-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.1 }}
        className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/10 flex items-center justify-center"
      >
        <Lock className="w-8 h-8 text-amber-400" />
      </motion.div>
      <h3 className="text-xl font-heading font-bold text-text-primary mb-2">
        Yêu cầu đăng nhập
      </h3>
      <p className="text-text-secondary mb-6 max-w-md mx-auto">
        {message}
      </p>
      <button
        onClick={handleLogin}
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
      >
        <LogIn className="w-4 h-4" />
        Đăng nhập
      </button>
    </div>
  );

  if (variant === 'modal') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-md bg-darkcard border border-darkborder rounded-2xl p-6 shadow-2xl"
        >
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          {content}
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-darkcard border border-darkborder rounded-2xl p-6">
      {content}
    </div>
  );
}
