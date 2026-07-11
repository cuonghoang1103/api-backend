'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Zap, KeyRound, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';

const STORAGE_KEY = 'digital_shop_terms_v1';

const TERMS: Array<{ icon: typeof Zap; title: string; desc: string }> = [
  { icon: Zap, title: 'Giao hàng tự động, tức thì', desc: 'Sản phẩm số (tài khoản / API key / mã kích hoạt / file) được giao ngay sau khi thanh toán thành công, xem trong mục “Đơn hàng của tôi”.' },
  { icon: KeyRound, title: 'Bảo mật thông tin', desc: 'Bạn tự chịu trách nhiệm bảo quản key/tài khoản đã nhận. Không chia sẻ, mua đi bán lại hoặc sử dụng sai mục đích.' },
  { icon: ShieldCheck, title: 'Bảo hành trong thời gian sử dụng', desc: 'Sản phẩm được bảo hành theo thời hạn ghi trên mô tả. Lỗi do nhà cung cấp sẽ được hỗ trợ / đổi mới.' },
  { icon: RefreshCw, title: 'Chính sách hoàn/đổi', desc: 'Do đặc thù hàng số, đơn đã nhận key/tài khoản sẽ KHÔNG hoàn tiền — trừ trường hợp lỗi từ phía chúng tôi. Đổi mới nếu lỗi trong thời gian bảo hành.' },
  { icon: AlertTriangle, title: 'Sử dụng đúng quy định', desc: 'Nghiêm cấm dùng sản phẩm cho hành vi vi phạm pháp luật hoặc điều khoản của nhà cung cấp gốc. Vi phạm sẽ mất quyền bảo hành.' },
];

/**
 * Terms-of-service gate for the digital shop. Blocks access (blurred overlay)
 * until the visitor agrees. The choice is remembered in localStorage so it
 * only appears once. Renders nothing after agreement.
 */
export default function DigitalShopTermsGate() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [agree, setAgree] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) !== '1') setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  const accept = () => {
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* ignore */ }
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background: 'rgba(3,2,12,0.82)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
        >
          <motion.div
            initial={{ scale: 0.94, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.94, y: 24, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative w-full max-w-lg max-h-[88vh] overflow-hidden rounded-3xl border flex flex-col"
            style={{
              background: 'linear-gradient(160deg, rgba(20,15,40,0.98), rgba(10,8,24,0.98))',
              borderColor: 'rgba(168,85,247,0.28)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 60px rgba(168,85,247,0.15)',
            }}
          >
            {/* Header */}
            <div className="relative px-6 pt-7 pb-5 text-center border-b border-white/5">
              <div className="mx-auto w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
                style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', boxShadow: '0 8px 30px rgba(168,85,247,0.4)' }}>
                <ShieldCheck className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-xl font-heading font-bold text-text-primary">Điều khoản sử dụng — Hàng số</h2>
              <p className="text-xs text-text-muted mt-1.5">Vui lòng đọc và đồng ý trước khi truy cập gian hàng sản phẩm số</p>
            </div>

            {/* Terms */}
            <div className="px-6 py-5 space-y-4 overflow-y-auto">
              {TERMS.map((term) => {
                const Icon = term.icon;
                return (
                  <div key={term.title} className="flex gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(168,85,247,0.12)' }}>
                      <Icon className="w-4.5 h-4.5 text-neon-violet" style={{ width: 18, height: 18 }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{term.title}</p>
                      <p className="text-xs text-text-muted leading-relaxed mt-0.5">{term.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-white/5 bg-black/20">
              <button
                onClick={() => setAgree((v) => !v)}
                className="flex items-start gap-2.5 text-left w-full mb-4 group"
              >
                <span className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-colors ${agree ? 'bg-neon-violet border-neon-violet' : 'border-darkborder group-hover:border-neon-violet/50'}`}>
                  {agree && <CheckCircle2 className="w-4 h-4 text-white" />}
                </span>
                <span className="text-xs text-text-secondary leading-relaxed">
                  Tôi đã đọc và <span className="text-neon-violet font-semibold">đồng ý</span> với các điều khoản mua bán sản phẩm số ở trên.
                </span>
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => router.push('/')}
                  className="flex-1 py-3 rounded-xl bg-darkbg border border-darkborder text-text-secondary text-sm font-semibold hover:border-red-500/30 hover:text-red-300 transition-colors"
                >
                  Không đồng ý
                </button>
                <button
                  onClick={accept}
                  disabled={!agree}
                  className="flex-[1.6] py-3 rounded-xl text-white text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', boxShadow: agree ? '0 8px 24px rgba(168,85,247,0.4)' : 'none' }}
                >
                  Đồng ý & Tiếp tục
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
