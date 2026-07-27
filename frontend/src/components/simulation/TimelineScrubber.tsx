'use client';

/**
 * Thanh tua theo BƯỚC, không theo giây.
 *
 * Khi dạy, câu hỏi luôn là "quay lại lúc gói tin chạm middleware" chứ không
 * phải "quay lại giây thứ 7,4". Vì vậy mỗi ô ở đây là một bước, bề rộng ô
 * tỉ lệ với thời lượng bước, và điểm dừng giảng bài (teachingNote) được đánh
 * dấu bằng chấm vàng để giảng viên nhắm trúng chỗ cần dừng.
 */

import { FLOW_STYLES } from './theme';
import type { Lang, SimStep } from './types';
import { tr } from './types';

interface Props {
  steps: SimStep[];
  stepIndex: number;
  stepProgress: number;
  lang: Lang;
  onSeek: (index: number) => void;
}

export default function TimelineScrubber({ steps, stepIndex, stepProgress, lang, onSeek }: Props) {
  const total = steps.reduce((a, s) => a + s.duration, 0) || 1;

  return (
    <div className="px-1">
      <div className="mb-1.5 flex items-center justify-between text-[11px] font-medium text-[#5d6d8c]">
        <span>
          {lang === 'vi' ? 'Bước' : 'Step'}{' '}
          <span className="font-mono text-[#93a4c4]">
            {stepIndex + 1}/{steps.length}
          </span>
        </span>
        <span className="truncate pl-3 text-right text-[#7f8fab]">{tr(steps[stepIndex]?.title, lang)}</span>
      </div>

      <div
        className="flex h-9 gap-[3px] overflow-hidden rounded-lg border border-[#1d2740] bg-[#070b16] p-[3px]"
        role="group"
        aria-label={lang === 'vi' ? 'Thanh tua theo bước' : 'Step scrubber'}
      >
        {steps.map((s, i) => {
          const flow = FLOW_STYLES[s.kind];
          const done = i < stepIndex;
          const current = i === stepIndex;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSeek(i)}
              title={`${i + 1}. ${tr(s.title, lang)}`}
              aria-label={`${i + 1}. ${tr(s.title, lang)}`}
              aria-current={current}
              className="relative min-w-[10px] overflow-hidden rounded-[5px] transition-colors"
              style={{
                // Bề rộng tỉ lệ thời lượng → nhìn thanh là đoán được nhịp bài.
                flexGrow: s.duration / total,
                flexBasis: 0,
                background: done ? `${flow.color}55` : current ? '#101a2e' : '#0d1424',
                border: current ? `1px solid ${flow.color}` : '1px solid transparent',
              }}
            >
              {current ? (
                <span
                  className="absolute inset-y-0 left-0 transition-[width] duration-100"
                  style={{ width: `${Math.min(100, stepProgress * 100)}%`, background: `${flow.color}bb` }}
                />
              ) : null}
              {s.teachingNote ? (
                <span
                  className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[#fbbf24]"
                  title={lang === 'vi' ? 'Điểm dừng để giảng' : 'Pause point'}
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
