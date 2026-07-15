'use client';

/**
 * /pro — the "Update Pro" page. Shows current Pro status, the benefits, and a
 * code-redeem box. Admins see a "you already have everything" note. Guests are
 * prompted to log in before redeeming.
 */
import { useState } from 'react';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Crown, Music, Bot, GraduationCap, ClipboardCheck, BadgeCheck, Sparkles, Loader2, Check, ArrowLeft } from 'lucide-react';
import { proApi } from '@/lib/api';
import { usePro } from '@/hooks/usePro';
import { useAuthStore } from '@/store/authStore';

const BENEFITS = [
  { icon: Music, title: 'Trang nhạc mở vĩnh viễn', desc: 'Không cần admin cấp quyền — vào /music bất cứ lúc nào.' },
  { icon: Bot, title: 'AI Chat Pro & Max', desc: 'Dùng CuongMini Pro (Sonnet) và Max (Opus) không giới hạn.' },
  { icon: ClipboardCheck, title: 'Interview AI chấm điểm', desc: 'Mở khoá "AI chấm" và "AI đầy đủ" khi luyện phỏng vấn.' },
  // NEW (2026-07-16): the two AI-heavy modules are Pro entitlements.
  { icon: Sparkles, title: 'CV Builder — toàn bộ AI', desc: 'AI chấm sâu + rủi ro phỏng vấn, AI viết lại từng dòng, AI phỏng vấn lấy nội dung, cover letter và xuất CV song ngữ Việt–Anh.' },
  { icon: Bot, title: 'My Language — gia sư AI', desc: 'Gia sư giải thích, chấm phát âm, quiz AI, chấm bài viết và role-play hội thoại.' },
  { icon: GraduationCap, title: 'Full khoá học Academy', desc: 'Truy cập mọi khoá học, không cần nhập mã kích hoạt.' },
  { icon: BadgeCheck, title: 'Huy hiệu PRO', desc: 'Khung avatar + logo gắn nhãn PRO nổi bật, khác biệt.' },
];

export default function ProPage() {
  const { status, isPro, isLoading, refetch } = usePro();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const qc = useQueryClient();
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const redeem = async () => {
    if (!code.trim()) { toast.warning('Nhập mã Pro'); return; }
    setSubmitting(true);
    try {
      await proApi.redeem(code.trim());
      toast.success('🎉 Chúc mừng! Tài khoản của bạn đã được nâng cấp Pro.');
      setCode('');
      await refetch();
      qc.invalidateQueries({ queryKey: ['pro-status'] });
      qc.invalidateQueries({ queryKey: ['music-access'] });
    } catch (e) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Mã không hợp lệ hoặc đã hết lượt.');
    } finally {
      setSubmitting(false);
    }
  };

  const expiryLabel = status.lifetime
    ? 'Vĩnh viễn'
    : status.expiresAt
      ? `đến ${new Date(status.expiresAt).toLocaleDateString('vi-VN')}`
      : '';

  return (
    <div className="min-h-screen pt-20 pb-16 px-4" style={{ background: 'radial-gradient(1200px 600px at 50% -10%, rgba(139,92,246,0.15), transparent), var(--bg-primary, #0a0a0f)' }}>
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-6"><ArrowLeft className="w-4 h-4" /> Trang chủ</Link>

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-4 bg-gradient-to-br from-amber-400 via-amber-500 to-violet-500 shadow-[0_8px_40px_rgba(245,158,11,0.35)]">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            CuongThai <span className="bg-gradient-to-r from-amber-300 to-violet-300 bg-clip-text text-transparent">PRO</span>
          </h1>
          <p className="text-slate-400 mt-2">Mở khoá toàn bộ tính năng cao cấp của web.</p>
        </div>

        {/* Status banner */}
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 text-slate-400 mb-8"><Loader2 className="w-4 h-4 animate-spin" /> Đang tải…</div>
        ) : status.isAdmin ? (
          <div className="rounded-2xl border border-violet-500/40 bg-violet-500/10 p-5 mb-8 flex items-center gap-3">
            <Crown className="w-6 h-6 text-violet-300 shrink-0" />
            <div>
              <div className="font-semibold text-violet-200">Bạn là Admin — cấp cao nhất</div>
              <p className="text-sm text-violet-200/70">Tài khoản admin mặc định có toàn bộ quyền Pro, không cần nhập mã.</p>
            </div>
          </div>
        ) : isPro ? (
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5 mb-8 flex items-center gap-3">
            <BadgeCheck className="w-6 h-6 text-emerald-300 shrink-0" />
            <div>
              <div className="font-semibold text-emerald-200">Bạn đang là thành viên PRO ✨</div>
              <p className="text-sm text-emerald-200/70">Thời hạn: <b>{expiryLabel}</b>. Cảm ơn bạn đã ủng hộ!</p>
            </div>
          </div>
        ) : null}

        {/* Benefits */}
        <div className="grid sm:grid-cols-2 gap-3 mb-8">
          {BENEFITS.map((b, i) => {
            const Icon = b.icon;
            return (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 to-violet-500/20 border border-white/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <div className="font-medium text-white text-sm">{b.title}</div>
                  <p className="text-xs text-slate-400 mt-0.5">{b.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Redeem */}
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-500/[0.06] to-transparent p-5">
          <div className="flex items-center gap-2 mb-1 text-white font-semibold"><Sparkles className="w-4 h-4 text-amber-300" /> {isPro ? 'Gia hạn / nhập mã khác' : 'Kích hoạt Pro bằng mã'}</div>
          <p className="text-xs text-slate-400 mb-4">Nhập mã Pro do admin cấp. Chưa có mã? Liên hệ admin để được cấp.</p>

          {isAuthenticated ? (
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => { if (e.key === 'Enter') redeem(); }}
                placeholder="VD: PRO-XXXXXXXX"
                className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono tracking-wider placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50"
              />
              <button
                onClick={redeem}
                disabled={submitting || !code.trim()}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white bg-gradient-to-r from-amber-500 to-violet-500 hover:opacity-90 disabled:opacity-50 transition"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Kích hoạt
              </button>
            </div>
          ) : (
            <Link href="/login?redirect=/pro" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white bg-gradient-to-r from-amber-500 to-violet-500 hover:opacity-90 transition">
              Đăng nhập để kích hoạt
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
