'use client';

/**
 * Thẻ tiến độ cho một việc AI đang chạy nền: đồng hồ, số ký tự đã viết, và
 * đuôi văn bản AI đang sinh (để thấy nó THẬT SỰ đang viết, không treo).
 */
import { AlertCircle, Loader2, RotateCcw } from 'lucide-react';
import type { TrangThaiViec } from '@/lib/creator-ai';

export function TienDoAi({
  tt,
  dangChay,
  loi,
  tieuDe = 'AI đang soạn…',
  goiY,
  onThuLai,
}: {
  tt: TrangThaiViec | null;
  dangChay: boolean;
  loi: string | null;
  tieuDe?: string;
  goiY?: string;
  onThuLai?: () => void;
}) {
  if (loi) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-300 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-red-200">AI chưa làm xong</p>
          <p className="text-[13px] text-red-100/80 mt-0.5 break-words">{loi}</p>
        </div>
        {onThuLai && (
          <button type="button" onClick={onThuLai}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-red-400/40 text-red-200 text-xs font-semibold hover:bg-red-500/15">
            <RotateCcw className="w-3.5 h-3.5" /> Thử lại
          </button>
        )}
      </div>
    );
  }
  if (!dangChay) return null;
  const giay = tt?.giay ?? 0;
  return (
    <div className="rounded-2xl border border-studio-500/30 bg-darkcard p-4">
      <div className="flex items-center gap-3">
        <Loader2 className="w-5 h-5 text-studio-400 animate-spin shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text-primary">{tieuDe}</p>
          <p className="text-[12px] text-text-muted">
            {giay}s{tt && tt.kyTu > 0 ? ` · đã viết ${tt.kyTu.toLocaleString('vi-VN')} ký tự` : ' · đang đọc nội dung nguồn'}
            {goiY ? ` · ${goiY}` : ''}
          </p>
        </div>
      </div>
      <div className="mt-3 h-1 rounded-full bg-white/5 overflow-hidden">
        <div className="h-full w-1/3 rounded-full bg-studio-gradient animate-shimmer-sweep" />
      </div>
      {tt?.duoi && (
        <pre className="mt-3 max-h-28 overflow-hidden text-[11.5px] leading-relaxed text-text-muted whitespace-pre-wrap font-mono [mask-image:linear-gradient(to_bottom,transparent,black_40%)]">
          {tt.duoi}
        </pre>
      )}
    </div>
  );
}
