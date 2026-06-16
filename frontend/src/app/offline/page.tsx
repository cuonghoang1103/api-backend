'use client';
import Link from 'next/link';
import { WifiOff, RefreshCcw } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center">
        <WifiOff className="mx-auto mb-4 h-12 w-12 text-cyan-400" />
        <h1 className="mb-2 text-2xl font-bold text-text-primary">Bạn đang ngoại tuyến</h1>
        <p className="mb-6 text-sm text-text-secondary">
          Không có kết nối mạng. Một số nội dung trên trang này vẫn có thể truy cập được từ bộ nhớ đệm.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => typeof window !== 'undefined' && window.location.reload()}
            className="flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300 transition-colors hover:bg-cyan-400/20"
          >
            <RefreshCcw className="h-4 w-4" />
            Thử lại
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-text-secondary transition-colors hover:bg-white/[0.08] hover:text-text-primary"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
