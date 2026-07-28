'use client';

/**
 * Bảng điều khiển trái: chọn kịch bản và các biến thể của nó.
 *
 * Mỗi kịch bản tự khai báo danh sách tuỳ chọn trong `scenario.options`, nên
 * bảng này không biết gì về REST hay Redis — thêm kịch bản mới là bảng tự
 * mọc thêm nút, không phải sửa một dòng nào ở đây.
 */

import { Check, GraduationCap } from 'lucide-react';
import type { Lang, Scenario, ScenarioOptions } from './types';
import { lessonPath, tr } from './types';
import { SCENARIO_GROUPS, scenariosInGroup } from './scenarios';

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
      {/* Kịch bản gom theo MỤC. Mười kịch bản nền tảng web nằm chung một danh
          sách phẳng thì còn đọc được; tới khi mỗi khoá học đóng góp thêm hai
          chục kịch bản của riêng nó thì phải có vách ngăn. */}
      {SCENARIO_GROUPS.map((group) => {
        const list = scenariosInGroup(group.id);
        if (list.length === 0) return null;
        return (
          <div key={group.id}>
            <h2 className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em]">
              <span className="inline-block h-2 w-2 shrink-0 rounded-full" style={{ background: group.accent, boxShadow: `0 0 10px ${group.accent}` }} />
              <span style={{ color: group.accent }}>{tr(group.name, lang)}</span>
              <span className="text-[#3f4d68]">{list.length}</span>
            </h2>
            {group.blurb ? <p className="mb-2.5 text-[11px] leading-relaxed text-[#5d6d8c]">{tr(group.blurb, lang)}</p> : null}
            <div className="space-y-2">
              {list.map((s) => {
                const active = s.id === scenario.id;
                const Icon = s.icon;
                return (
                  <div key={s.id}>
                    <button
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
                    {/* Bài giảng tương ứng — nằm NGOÀI nút chọn kịch bản, vì
                        một thẻ <a> lồng trong <button> là HTML sai và trình
                        duyệt sẽ nuốt mất một trong hai cú bấm. */}
                    {s.lesson ? (
                      <a
                        href={lessonPath(s.lesson)}
                        className="mt-1 flex items-start gap-1 px-3 font-mono text-[11px] text-[#4d5f7e] transition-colors hover:text-[#93a4c4]"
                        title={lang === 'vi' ? 'Mở bài học trong giáo trình' : 'Open the lesson in the curriculum'}
                      >
                        <GraduationCap className="mt-0.5 h-3 w-3 shrink-0" />
                        <span>
                          {s.lesson.subject ? `${s.lesson.subject} ` : ''}
                          {lang === 'vi' ? 'Bài' : 'Lesson'} {s.lesson.code} · {tr(s.lesson.title, lang)}
                        </span>
                      </a>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {scenario.options.map((opt) => {
        const current = opt.choices.find((c) => c.value === options[opt.id]);

        // Gom nhóm khi lựa chọn có khai báo `group` (14 mã HTTP → 4 nhóm).
        // Giữ đúng thứ tự nhóm xuất hiện lần đầu, không sắp xếp lại: thứ tự
        // trong dữ liệu là thứ tự sư phạm mà tác giả kịch bản đã cân nhắc.
        const grouped = opt.choices.some((c) => c.group);
        const groups: { name: string; choices: typeof opt.choices }[] = [];
        for (const choice of opt.choices) {
          const name = choice.group ? tr(choice.group, lang) : '';
          const bucket = groups.find((g) => g.name === name);
          if (bucket) bucket.choices.push(choice);
          else groups.push({ name, choices: [choice] });
        }

        const renderChoice = (choice: (typeof opt.choices)[number]) => {
          const active = options[opt.id] === choice.value;
          const color = choice.color ?? scenario.accent;
          return (
            <button
              key={choice.value}
              type="button"
              onClick={() => onChangeOption(opt.id, choice.value)}
              aria-pressed={active}
              aria-label={choice.fullLabel ?? choice.label}
              title={[choice.fullLabel, choice.hint ? tr(choice.hint, lang) : null].filter(Boolean).join(' — ') || undefined}
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
        };

        return (
          <div key={opt.id}>
            <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#5d6d8c]">
              {tr(opt.label, lang)}
            </h2>

            {grouped ? (
              <div className="space-y-2">
                {groups.map((g) => (
                  <div key={g.name}>
                    <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[#4d5b76]">{g.name}</div>
                    <div className="flex flex-wrap gap-1.5">{g.choices.map(renderChoice)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5">{opt.choices.map(renderChoice)}</div>
            )}

            {/* Nhãn đầy đủ + gợi ý của lựa chọn đang chọn. Nút bấm chỉ đủ chỗ
                cho "422", còn "422 Unprocessable Entity" và lời giải thích
                hiện ở đây — đọc được mà không phải rê chuột. */}
            {current?.fullLabel || current?.hint ? (
              <div className="mt-2 space-y-0.5">
                {current.fullLabel ? (
                  <p className="font-mono text-[11.5px] font-bold" style={{ color: current.color ?? scenario.accent }}>
                    {current.fullLabel}
                  </p>
                ) : null}
                {current.hint ? (
                  <p className="text-[11.5px] leading-relaxed text-[#6f8098]">{tr(current.hint, lang)}</p>
                ) : null}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
