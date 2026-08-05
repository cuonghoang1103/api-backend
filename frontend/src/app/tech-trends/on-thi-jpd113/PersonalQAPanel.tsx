'use client';

/**
 * HỎI ĐÁP VỀ CHÍNH BẠN — sub-tab thứ 4 của tab "Thi nói & đọc".
 *
 * Ngân hàng chính thức (22 câu trong speaking.ts) không phủ hết những gì giám
 * thị thực sự hỏi: trường nào, năm mấy, ngành gì, sinh năm nào, sống ở đâu —
 * và đặc biệt là dạng ĐÚNG/SAI, nơi sinh viên biết đáp án nhưng chỉ gật/lắc
 * rồi im, mất điểm dựng câu. Khu này lấp đúng hai lỗ đó.
 *
 * Câu trả lời chạy qua `fillAnswer()` với hồ sơ cá nhân, nên người học đọc
 * thấy câu của CHÍNH MÌNH chứ không phải câu mẫu của người khác — thuộc
 * nhanh hơn hẳn và không bị lắp nhầm dữ liệu lúc thi.
 */

import { useState, useMemo } from 'react';
import { AlertTriangle, Eye, EyeOff, MessageSquare, Sparkles, LifeBuoy } from 'lucide-react';

import { fillAnswer } from './data/speaking';
import {
  PERSONAL_QUESTIONS,
  PERSONAL_GROUPS,
  YESNO_QUESTIONS,
  YESNO_RULE,
  RESCUE_PHRASES,
  MOCK_SCRIPT,
  GOLDEN_RULES,
  type PersonalGroup,
} from './data/personalQA';

type Sub = 'qa' | 'yesno' | 'script';

export default function PersonalQAPanel({ profile }: { profile: Record<string, string> }) {
  const [sub, setSub] = useState<Sub>('qa');
  const [group, setGroup] = useState<PersonalGroup | 'all'>('all');
  const [hideAnswer, setHideAnswer] = useState(false);

  const list = useMemo(
    () => (group === 'all' ? PERSONAL_QUESTIONS : PERSONAL_QUESTIONS.filter((q) => q.group === group)),
    [group],
  );

  const fill = (s: string) => fillAnswer(s, profile);

  return (
    <div className="space-y-4">
      {/* ── Giới thiệu ── */}
      <section className="rounded-2xl border border-neon-pink/25 bg-neon-pink/[0.05] p-5">
        <h2 className="text-lg font-heading font-bold text-white mb-1.5">
          Giám thị sẽ hỏi gì về CHÍNH BẠN
        </h2>
        <p className="text-[13px] text-slate-300 leading-relaxed">
          {PERSONAL_QUESTIONS.length} câu hỏi cá nhân + {YESNO_QUESTIONS.length} câu dạng ĐÚNG/SAI
          + kịch bản diễn thử nguyên bài. Mọi câu trả lời dưới đây đã{' '}
          <b className="text-white">tự điền hồ sơ của bạn</b> ở đầu tab này — sửa hồ sơ thì cả
          trang đổi theo.
        </p>
        <div className="mt-3 rounded-xl border border-neon-red/25 bg-neon-red/[0.06] p-3.5">
          <div className="flex items-center gap-2 text-xs font-bold text-neon-red mb-1.5">
            <AlertTriangle className="w-4 h-4" />
            Bẫy lớn nhất cả bài thi
          </div>
          <p className="text-[13px] text-slate-300 leading-relaxed">
            <b className="text-white">やすみの日 なにを しますか</b> (làm GÌ → đáp hoạt động) nghe
            rất giống <b className="text-white">やすみの日 どこへ いきますか</b> (đi ĐÂU → đáp nơi
            chốn). Nghe kỹ từ để hỏi trước khi mở miệng — trả lời lạc là mất điểm dù tiếng Nhật
            hoàn hảo.
          </p>
        </div>
      </section>

      {/* ── Sub tabs ── */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'qa' as const, label: `${PERSONAL_QUESTIONS.length} câu về bạn` },
          { id: 'yesno' as const, label: `Câu ĐÚNG/SAI (${YESNO_QUESTIONS.length})` },
          { id: 'script' as const, label: 'Diễn thử nguyên bài' },
        ].map((s) => (
          <button
            key={s.id}
            onClick={() => setSub(s.id)}
            className={`px-3.5 py-2 rounded-xl text-[13px] font-medium border transition-all active:scale-95 ${
              sub === s.id
                ? 'bg-neon-pink/15 border-neon-pink/40 text-white'
                : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            {s.label}
          </button>
        ))}
        {sub === 'qa' && (
          <button
            onClick={() => setHideAnswer(!hideAnswer)}
            className="ml-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] bg-white/[0.04] border border-white/10 text-slate-300 hover:text-white transition-colors"
          >
            {hideAnswer ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            {hideAnswer ? 'Hiện đáp án' : 'Che đáp án (tự kiểm)'}
          </button>
        )}
      </div>

      {/* ══════════ 40 CÂU VỀ BẠN ══════════ */}
      {sub === 'qa' && (
        <section className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setGroup('all')}
              className={`px-2.5 py-1.5 rounded-lg text-xs border transition-all ${
                group === 'all'
                  ? 'bg-neon-violet/15 border-neon-violet/40 text-white'
                  : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              Tất cả ({PERSONAL_QUESTIONS.length})
            </button>
            {PERSONAL_GROUPS.map((g) => {
              const c = PERSONAL_QUESTIONS.filter((q) => q.group === g).length;
              return (
                <button
                  key={g}
                  onClick={() => setGroup(g)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs border transition-all ${
                    group === g
                      ? 'bg-neon-violet/15 border-neon-violet/40 text-white'
                      : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {g} ({c})
                </button>
              );
            })}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] divide-y divide-white/[0.05] overflow-hidden">
            {list.map((q) => (
              <div key={q.n} className="p-4 space-y-2">
                {/* Câu hỏi */}
                <div className="flex items-start gap-2.5">
                  <span className="shrink-0 w-6 h-6 rounded-lg bg-neon-pink/15 border border-neon-pink/30 text-neon-pink text-[11px] font-bold grid place-items-center mt-0.5">
                    {q.n}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[15px] text-white font-medium leading-relaxed">{q.jp}</p>
                    {q.romaji && (
                      <p className="text-[11px] text-slate-600 italic">{q.romaji}</p>
                    )}
                    <p className="text-[13px] text-slate-400 leading-relaxed">{q.vi}</p>
                  </div>
                </div>

                {/* Trả lời */}
                <div className="ml-[34px] pl-3 border-l-2 border-neon-cyan/30 space-y-0.5">
                  <p
                    className={`text-[15px] font-semibold leading-relaxed transition-all ${
                      hideAnswer
                        ? 'text-transparent bg-white/[0.07] rounded px-3 inline-block select-none'
                        : 'text-neon-cyan'
                    }`}
                  >
                    {fill(q.answer)}
                  </p>
                  {!hideAnswer && (
                    <p className="text-[13px] text-slate-500 italic leading-relaxed">
                      {fill(q.answerVi)}
                    </p>
                  )}
                </div>

                {q.note && (
                  <p className="ml-[34px] text-[12px] text-neon-orange/90 leading-relaxed">{q.note}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══════════ ĐÚNG / SAI ══════════ */}
      {sub === 'yesno' && (
        <section className="space-y-4">
          <div className="rounded-2xl border border-neon-cyan/25 bg-neon-cyan/[0.05] p-5">
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-neon-cyan" />
              {YESNO_RULE.title}
            </h3>
            <div className="space-y-2.5 text-[13px] leading-relaxed">
              <p className="text-slate-300">
                <b className="text-neon-green">Khi ĐÚNG:</b> {YESNO_RULE.yes}
              </p>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5 space-y-2">
                <p className="text-slate-300">
                  <b className="text-white">{YESNO_RULE.noNoun}</b>
                </p>
                <p className="text-slate-300">
                  <b className="text-white">{YESNO_RULE.noVerb}</b>
                </p>
                <p className="text-slate-400">{YESNO_RULE.generic}</p>
              </div>
              <p className="text-neon-orange leading-relaxed">{YESNO_RULE.gold}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] divide-y divide-white/[0.05] overflow-hidden">
            {YESNO_QUESTIONS.map((y, i) => (
              <div key={i} className="p-4 space-y-2.5">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-[15px] text-white font-medium">{y.jp}</span>
                  <span className="text-[13px] text-slate-400">{y.vi}</span>
                  <span
                    className={`ml-auto shrink-0 px-2 py-0.5 rounded text-[10px] font-bold border ${
                      y.kind === 'noun'
                        ? 'bg-neon-violet/15 text-neon-violet border-neon-violet/30'
                        : 'bg-neon-orange/15 text-neon-orange border-neon-orange/30'
                    }`}
                  >
                    {y.kind === 'noun' ? 'DANH TỪ → じゃありません' : 'ĐỘNG TỪ → ません'}
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 gap-2">
                  <div className="rounded-xl border border-neon-green/25 bg-neon-green/[0.05] p-3">
                    <p className="text-[10px] font-bold text-neon-green mb-1">NẾU ĐÚNG</p>
                    <p className="text-[14px] text-white leading-relaxed">{y.yes}</p>
                    <p className="text-[12px] text-slate-500 italic mt-0.5">{y.yesVi}</p>
                  </div>
                  <div className="rounded-xl border border-neon-red/25 bg-neon-red/[0.05] p-3">
                    <p className="text-[10px] font-bold text-neon-red mb-1">NẾU SAI</p>
                    <p className="text-[14px] text-white leading-relaxed">{y.no}</p>
                    <p className="text-[12px] text-slate-500 italic mt-0.5">{y.noVi}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Câu cứu hộ */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
            <div className="p-4 border-b border-white/[0.06] flex items-center gap-2">
              <LifeBuoy className="w-4 h-4 text-neon-cyan" />
              <h3 className="text-sm font-bold text-white">
                4 câu cứu hộ — thuộc lòng, dùng khi bí
              </h3>
            </div>
            <div className="divide-y divide-white/[0.05]">
              {RESCUE_PHRASES.map((r) => (
                <div key={r.jp} className="p-3.5">
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <span className="text-[15px] text-white font-semibold">{r.jp}</span>
                    <span className="text-[11px] text-slate-600 italic">{r.romaji}</span>
                  </div>
                  <p className="text-[13px] text-neon-cyan mt-0.5">{r.vi}</p>
                  <p className="text-[12px] text-slate-500 mt-1 leading-relaxed">{r.when}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════ KỊCH BẢN ══════════ */}
      {sub === 'script' && (
        <section className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <MessageSquare className="w-4 h-4 text-neon-pink" />
              <h3 className="text-sm font-bold text-white">Diễn thử nguyên bài — đọc to 3 lần</h3>
            </div>
            <p className="text-[13px] text-slate-400 leading-relaxed">
              Kịch bản đã điền hồ sơ của bạn. Đọc to thành tiếng, đừng đọc thầm — miệng phải quen
              chuyển động trước khi vào phòng thi.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] divide-y divide-white/[0.05] overflow-hidden">
            {MOCK_SCRIPT.map((l, i) => (
              <div
                key={i}
                className={`p-3.5 flex items-start gap-3 ${
                  l.who === 'you' ? 'bg-neon-cyan/[0.03]' : ''
                }`}
              >
                <span
                  className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold border mt-0.5 ${
                    l.who === 'you'
                      ? 'bg-neon-cyan/15 text-neon-cyan border-neon-cyan/30'
                      : 'bg-white/[0.05] text-slate-400 border-white/10'
                  }`}
                >
                  {l.who === 'you' ? 'BẠN' : 'THẦY'}
                </span>
                <div className="min-w-0">
                  <p
                    className={`text-[15px] leading-relaxed ${
                      l.who === 'you' ? 'text-white font-medium' : 'text-slate-300'
                    }`}
                  >
                    {fill(l.jp)}
                  </p>
                  <p className="text-[12px] text-slate-500 italic leading-relaxed">{fill(l.vi)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-neon-orange/25 bg-neon-orange/[0.05] p-5">
            <h3 className="text-sm font-bold text-white mb-2.5">
              Luật vàng — đọc lại ngay trước khi vào phòng
            </h3>
            <ul className="space-y-2 text-[13px] text-slate-300 leading-relaxed">
              {GOLDEN_RULES.map((r, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-neon-orange font-bold shrink-0">{i + 1}.</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
