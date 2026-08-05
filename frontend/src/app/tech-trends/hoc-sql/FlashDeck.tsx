'use client';

/**
 * Bộ thẻ lật ôn cuối chương.
 *
 * Lật bằng cách đổi nội dung chứ không xoay 3D: trên điện thoại, hiệu ứng lật
 * làm chữ nhoè trong lúc chuyển và thẻ nào dài hơn thì bị cắt. Điều cần ở đây
 * là đọc được, không phải đẹp mắt.
 */
import { useState } from 'react';
import { RotateCw, ChevronLeft, ChevronRight } from 'lucide-react';
import type { FlashCard } from './data/types';
import { md } from './Blocks';

export default function FlashDeck({ cards }: { cards: FlashCard[] }) {
  const [i, setI] = useState(0);
  const [shown, setShown] = useState(false);

  if (!cards.length) return null;
  const card = cards[i];

  const go = (d: number) => {
    setI((v) => (v + d + cards.length) % cards.length);
    setShown(false);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400">Ôn nhanh cuối chương</span>
        <span className="font-mono text-xs tabular-nums text-slate-600">{i + 1}/{cards.length}</span>
      </div>

      <button
        type="button"
        onClick={() => setShown((s) => !s)}
        className="flex min-h-[128px] w-full flex-col justify-center rounded-2xl border border-violet-400/25 bg-violet-500/[0.07] px-5 py-6 text-left transition-colors hover:bg-violet-500/[0.11]"
      >
        <p className="text-[15px] font-semibold leading-relaxed text-white">{md(card.q)}</p>
        {shown ? (
          <p className="mt-3 border-t border-violet-400/20 pt-3 text-[14.5px] leading-relaxed text-slate-300">
            {md(card.a)}
          </p>
        ) : (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-violet-300/70">
            <RotateCw className="h-3.5 w-3.5" /> Bấm để xem đáp án
          </p>
        )}
      </button>

      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => go(-1)}
          className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-300 transition-all hover:border-white/20 active:scale-95"
        >
          <ChevronLeft className="h-4 w-4" /> Trước
        </button>
        <div className="flex flex-1 gap-1">
          {cards.map((c, j) => (
            <button
              key={c.q}
              type="button"
              onClick={() => { setI(j); setShown(false); }}
              aria-label={`Thẻ ${j + 1}`}
              className={`h-1.5 flex-1 rounded-full transition-colors ${j === i ? 'bg-violet-400' : 'bg-white/10 hover:bg-white/20'}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-300 transition-all hover:border-white/20 active:scale-95"
        >
          Sau <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
