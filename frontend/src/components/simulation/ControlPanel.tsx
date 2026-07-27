'use client';

/**
 * Bảng điều khiển trái: chọn kịch bản và các biến thể của nó.
 *
 * Mỗi kịch bản tự khai báo danh sách tuỳ chọn trong `scenario.options`, nên
 * bảng này không biết gì về REST hay Redis — thêm kịch bản mới là bảng tự
 * mọc thêm nút, không phải sửa một dòng nào ở đây.
 */

import { Check } from 'lucide-react';
import type { Lang, Scenario, ScenarioOptions } from './types';
import { tr } from './types';
import { SCENARIOS } from './scenarios';

interface Props {
  scenario: Scenario;
  options: ScenarioOptions;
  lang: Lang;
  onSelectScenario: (id: string) => void;
  onChangeOption: (optionId: string, value: string) => void;
}

export default function ControlPanel({ scenario, options, lang, onSelectScenario, onChangeOption }: Props) {
  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto p-4">
      <div>
        <h2 className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#5d6d8c]">
          {lang === 'vi' ? 'Kịch bản' : 'Scenario'}
        </h2>
        <div className="space-y-2">
          {SCENARIOS.map((s) => {
            const active = s.id === scenario.id;
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onSelectScenario(s.id)}
                aria-pressed={active}
                className="group flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-all"
                style={{
                  borderColor: active ? `${s.accent}88` : '#1d2740',
                  background: active ? `${s.accent}14` : '#0a0f1e',
                  boxShadow: active ? `0 0 26px -10px ${s.accent}` : 'none',
                }}
              >
                <span
                  className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border"
                  style={{ borderColor: `${s.accent}55`, background: `${s.accent}1a`, color: s.accent }}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span className={`text-[13.5px] font-bold ${active ? 'text-[#f2f6ff]' : 'text-[#c3cfe4]'}`}>
                      {tr(s.name, lang)}
                    </span>
                    {active ? <Check className="h-3.5 w-3.5 shrink-0" style={{ color: s.accent }} /> : null}
                  </span>
                  <span className="mt-1 block text-[11.5px] leading-relaxed text-[#6f8098]">{tr(s.tagline, lang)}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {scenario.options.map((opt) => (
        <div key={opt.id}>
          <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#5d6d8c]">
            {tr(opt.label, lang)}
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {opt.choices.map((choice) => {
              const active = options[opt.id] === choice.value;
              const color = choice.color ?? scenario.accent;
              return (
                <button
                  key={choice.value}
                  type="button"
                  onClick={() => onChangeOption(opt.id, choice.value)}
                  aria-pressed={active}
                  title={choice.hint ? tr(choice.hint, lang) : undefined}
                  className="rounded-lg border px-2.5 py-1.5 font-mono text-[12px] font-bold transition-all"
                  style={{
                    borderColor: active ? color : '#233052',
                    background: active ? `${color}22` : '#0a0f1e',
                    color: active ? color : '#7f8fab',
                    boxShadow: active ? `0 0 18px -8px ${color}` : 'none',
                  }}
                >
                  {choice.label}
                </button>
              );
            })}
          </div>
          {/* Gợi ý của lựa chọn đang chọn — dạy được ngay mà không cần rê chuột. */}
          {(() => {
            const current = opt.choices.find((c) => c.value === options[opt.id]);
            return current?.hint ? (
              <p className="mt-2 text-[11.5px] leading-relaxed text-[#6f8098]">{tr(current.hint, lang)}</p>
            ) : null;
          })()}
        </div>
      ))}
    </div>
  );
}
