'use client';

/**
 * Cảm xúc trên tin nhắn — kiểu Messenger.
 *
 *   · `ChonCamXuc`  — thanh chọn nhanh 6 emoji + nút "+" mở bảng đầy đủ
 *   · `ChipCamXuc`  — viên nhỏ đè lên góc dưới bong bóng: tối đa 3 emoji + tổng
 *
 * Trước 14/10/2026 dưới MỖI tin có một nút "+" tròn chiếm một hàng riêng ⇒
 * bong bóng của người kia thụt ra thụt vào, và cả cột chat đầy nút "+". Nay
 * việc thả cảm xúc nằm trong thanh công cụ hiện khi rê chuột / nhấn giữ.
 */
import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { MessagingReaction } from '@/lib/api';
import { cn } from '@/lib/utils';

export const QUICK_EMOJI = ['👍', '❤️', '😂', '😮', '😢', '🔥'] as const;
const EXTRA_EMOJI = ['👏', '🎉', '🙏', '👀', '💯', '🤔', '🙄', '💪', '😡', '🥰', '😎', '🤝'] as const;

export function ChonCamXuc({
  reactions = [],
  myUserId,
  onChon,
}: {
  reactions?: MessagingReaction[];
  myUserId: number | undefined;
  onChon: (emoji: string) => void;
}) {
  const [moRong, datMoRong] = useState(false);
  const cuaToi = (e: string) =>
    myUserId !== undefined && !!reactions.find((r) => r.emoji === e)?.userIds.includes(myUserId);
  return (
    <div className="rounded-full border border-white/10 bg-[#24252f] p-1 shadow-[0_8px_30px_rgba(0,0,0,0.55)]">
      <div className="flex items-center gap-0.5">
        {QUICK_EMOJI.map((e) => (
          <button
            key={e}
            type="button"
            onClick={() => onChon(e)}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full text-[22px] leading-none transition-transform hover:scale-125',
              cuaToi(e) && 'bg-cyan-500/25',
            )}
            aria-label={`Thả ${e}`}
            aria-pressed={cuaToi(e)}
          >
            {e}
          </button>
        ))}
        <button
          type="button"
          onClick={() => datMoRong((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] text-text-muted hover:bg-white/[0.12] hover:text-text-primary"
          aria-label="Thêm cảm xúc"
          aria-expanded={moRong}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      {moRong && (
        <div className="mt-1 grid grid-cols-6 gap-0.5 border-t border-white/[0.08] px-0.5 pt-1">
          {EXTRA_EMOJI.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => onChon(e)}
              className={cn('flex h-9 w-9 items-center justify-center rounded-full text-[20px] hover:bg-white/10', cuaToi(e) && 'bg-cyan-500/25')}
              aria-label={`Thả ${e}`}
            >
              {e}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ChipCamXuc({
  reactions,
  myUserId,
  onClick,
}: {
  reactions: MessagingReaction[];
  myUserId: number | undefined;
  onClick?: () => void;
}) {
  const coThat = reactions.filter((r) => r.count > 0);
  if (coThat.length === 0) return null;
  const tong = coThat.reduce((n, r) => n + r.count, 0);
  const toi = myUserId !== undefined && coThat.some((r) => r.userIds.includes(myUserId));
  const xep = [...coThat].sort((a, b) => b.count - a.count);
  return (
    <button
      type="button"
      onClick={onClick}
      title={xep.map((r) => `${r.emoji} ${r.count}`).join('  ')}
      data-testid="reaction-chip"
      className={cn(
        'flex h-[22px] items-center gap-0.5 rounded-full border px-1.5 text-[11px] leading-none shadow-[0_2px_6px_rgba(0,0,0,0.45)]',
        toi ? 'border-cyan-400/50 bg-[#1d2a33] text-cyan-100' : 'border-white/10 bg-[#24252f] text-text-secondary',
      )}
    >
      {xep.slice(0, 3).map((r) => (
        <span key={r.emoji} className="text-[13px]">{r.emoji}</span>
      ))}
      {tong > 1 && <span className="ml-0.5 font-medium tabular-nums">{tong}</span>}
    </button>
  );
}
