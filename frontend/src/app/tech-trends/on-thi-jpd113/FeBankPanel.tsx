'use client';

/**
 * NGÂN HÀNG CÂU FE ĐÃ RA THẬT — nằm trong tab "Đề thi & mục tiêu".
 *
 * Vì sao tách khỏi tab Bảng tra cứu: cheat-sheet dạy LUẬT (đọc số ra sao,
 * trợ từ nào khi nào). Khu này là DANH SÁCH CÂU CÓ THẬT rút từ 420 câu của
 * 14 đề — học vẹt thẳng đáp án, không suy luận. Hai mục đích khác nhau nên
 * trộn vào một tab thì người học không biết đang làm gì.
 *
 * Mọi bảng đều CHE ĐÁP ÁN mặc định: nhìn thấy đáp án ngay cạnh câu hỏi thì
 * não không truy xuất, chỉ nhận ra — mà phòng thi thì phải truy xuất.
 */

import { useState, useMemo } from 'react';
import { Eye, EyeOff, AlertTriangle, Check, X, RotateCcw, Flame } from 'lucide-react';

import {
  KANJI_READ,
  KANJI_WRITE,
  BLANKS,
  BLANK_GROUPS,
  ODD_ONE_OUT,
  SENTENCE_BUILD,
  BUILD_FORMULA,
  LOANWORD_MEANINGS,
  FE_STATS,
  type BlankGroup,
} from './data/feBank';

type Sub = 'read' | 'write' | 'blank' | 'odd' | 'build';

const SUBS: { id: Sub; label: string }[] = [
  { id: 'read', label: `Đọc Hán tự (${KANJI_READ.length})` },
  { id: 'write', label: `Viết Hán tự (${KANJI_WRITE.length})` },
  { id: 'blank', label: `Điền chỗ trống (${BLANKS.length})` },
  { id: 'odd', label: `Từ khác loại (${ODD_ONE_OUT.length})` },
  { id: 'build', label: `Ghép câu & katakana` },
];

/** Nhãn tần suất — mục ra ≥3 lần thì gần như chắc chắn gặp lại */
function FreqBadge({ n }: { n: number }) {
  if (n >= 3)
    return (
      <span className="inline-flex items-center gap-1 shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold bg-neon-red/15 text-tone-red border border-neon-red/30">
        <Flame className="w-2.5 h-2.5" />
        {n}×
      </span>
    );
  if (n === 2)
    return (
      <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold bg-neon-orange/15 text-tone-orange border border-neon-orange/25">
        2×
      </span>
    );
  return (
    <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[var(--bg-surface-hover)] text-text-muted border border-[var(--border-light)]">
      1×
    </span>
  );
}

export default function FeBankPanel() {
  const [sub, setSub] = useState<Sub>('read');
  const [reveal, setReveal] = useState(false);
  const [group, setGroup] = useState<BlankGroup | 'all'>('all');
  const [oddPick, setOddPick] = useState<Record<number, number>>({});

  const blanks = useMemo(
    () => (group === 'all' ? BLANKS : BLANKS.filter((b) => b.group === group)),
    [group],
  );

  const oddScore = useMemo(
    () => ODD_ONE_OUT.filter((o, i) => oddPick[i] === o.ansIndex).length,
    [oddPick],
  );

  return (
    <div className="space-y-4">
      {/* ── Giới thiệu ── */}
      <section className="rounded-2xl border border-neon-violet/25 bg-neon-violet/[0.05] p-5">
        <h2 className="text-lg font-heading font-bold text-text-primary mb-1.5">
          Ngân hàng câu FE đã ra thật
        </h2>
        <p className="text-[13px] text-text-secondary leading-relaxed">
          Toàn bộ khai thác từ <b className="text-text-primary">{FE_STATS.totalQuestions} câu</b> trong{' '}
          <b className="text-text-primary">{FE_STATS.totalExams} đề FE thật</b> ở Phòng thi. Số{' '}
          <span className="text-tone-red font-semibold">n×</span> là số lần mục đó xuất hiện — ra
          từ 3 lần trở lên thì gần như chắc chắn có trong đề bạn bốc phải.
        </p>
        <div className="mt-3 rounded-xl border border-[var(--border-light)] bg-[var(--bg-surface-hover)] p-3.5">
          <p className="text-[13px] text-text-secondary leading-relaxed">
            <b className="text-text-primary">Đường ngắn nhất tới 4 điểm:</b> đề có{' '}
            {FE_STATS.perExam} câu / {FE_STATS.minutes} phút, cần đúng{' '}
            <b className="text-tone-cyan">{FE_STATS.passQuestions} câu</b>. Hai bảng Hán tự dưới
            đây chiếm ~22% đề (≈6–7 câu) và <b className="text-text-primary">bốc trong đúng hai bảng đó</b>
            . Thuộc chúng là đã có hơn nửa số câu cần.
          </p>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {FE_STATS.topKanji.map((k) => (
            <span
              key={k.k}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--bg-surface-hover)] border border-[var(--border-light)] text-xs"
            >
              <span className="text-text-primary font-bold text-sm">{k.k}</span>
              <span className="text-text-muted">{k.vi}</span>
              <span className="text-tone-violet font-semibold">{k.n}</span>
            </span>
          ))}
        </div>
      </section>

      {/* ── Sub tabs + nút che đáp án ── */}
      <div className="flex flex-wrap items-center gap-2">
        {SUBS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSub(s.id)}
            className={`px-3.5 py-2 rounded-xl text-[13px] font-medium border transition-all active:scale-95 ${
              sub === s.id
                ? 'bg-neon-violet/15 border-neon-violet/40 text-text-primary'
                : 'bg-[var(--bg-surface-hover)] border-[var(--border-light)] text-text-secondary hover:text-text-primary'
            }`}
          >
            {s.label}
          </button>
        ))}
        {sub !== 'odd' && (
          <button
            onClick={() => setReveal(!reveal)}
            className="ml-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] bg-[var(--bg-surface-hover)] border border-[var(--border-light)] text-text-secondary hover:text-text-primary transition-colors"
          >
            {reveal ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {reveal ? 'Che đáp án' : 'Hiện đáp án'}
          </button>
        )}
      </div>

      {/* ══════════ ĐỌC HÁN TỰ ══════════ */}
      {sub === 'read' && (
        <section className="rounded-2xl border border-[var(--border-light)] bg-[var(--bg-surface-hover)] overflow-hidden">
          <div className="p-4 border-b border-[var(--border-light)]">
            <p className="text-[13px] text-text-secondary leading-relaxed">
              Dạng đề: <b className="text-text-primary">「Chữ Hán trong ngoặc 【 】 đọc thế nào?」</b> — 46
              câu thật, gom lại còn {KANJI_READ.length} mục. Viền đỏ = bất quy tắc, không suy ra
              được, phải học vẹt.
            </p>
          </div>
          <div className="divide-y divide-[var(--border-light)]">
            {KANJI_READ.map((k) => (
              <div
                key={k.kanji}
                className={`p-3.5 flex items-start gap-3 ${
                  k.irregular ? 'bg-neon-red/[0.03] border-l-2 border-l-neon-red/50' : ''
                }`}
              >
                <FreqBadge n={k.n} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-xl font-bold text-text-primary">{k.kanji}</span>
                    <span
                      className={`text-base font-semibold transition-all ${
                        reveal ? 'text-tone-cyan' : 'text-transparent bg-[var(--bg-surface-active)] rounded px-2 select-none'
                      }`}
                    >
                      {k.yomi}
                    </span>
                    <span className="text-[13px] text-text-secondary">{k.vi}</span>
                  </div>
                  {k.ctx && (
                    <p className="text-[12px] text-text-muted mt-1 leading-relaxed">{k.ctx}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══════════ VIẾT HÁN TỰ ══════════ */}
      {sub === 'write' && (
        <section className="rounded-2xl border border-[var(--border-light)] bg-[var(--bg-surface-hover)] overflow-hidden">
          <div className="p-4 border-b border-[var(--border-light)]">
            <p className="text-[13px] text-text-secondary leading-relaxed">
              Dạng đề: <b className="text-text-primary">「Từ trong ngoặc 【 】 viết bằng chữ Hán nào?」</b> —
              45 câu thật, gom lại còn {KANJI_WRITE.length} mục. Đây là chiều NGƯỢC của bảng trên,
              học một lần được cả hai dạng.
            </p>
          </div>
          <div className="divide-y divide-[var(--border-light)]">
            {KANJI_WRITE.map((k) => (
              <div
                key={k.kana + k.kanji}
                className={`p-3.5 flex items-start gap-3 ${
                  k.irregular ? 'bg-neon-red/[0.03] border-l-2 border-l-neon-red/50' : ''
                }`}
              >
                <FreqBadge n={k.n} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-base font-semibold text-text-primary">{k.kana}</span>
                    <span className="text-text-muted">→</span>
                    <span
                      className={`text-xl font-bold transition-all ${
                        reveal ? 'text-tone-cyan' : 'text-transparent bg-[var(--bg-surface-active)] rounded px-2 select-none'
                      }`}
                    >
                      {k.kanji}
                    </span>
                    <span className="text-[13px] text-text-secondary">{k.vi}</span>
                  </div>
                  {k.ctx && (
                    <p className="text-[12px] text-text-muted mt-1 leading-relaxed">{k.ctx}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══════════ ĐIỀN CHỖ TRỐNG ══════════ */}
      {sub === 'blank' && (
        <section className="space-y-3">
          <div className="rounded-2xl border border-[var(--border-light)] bg-[var(--bg-surface-hover)] p-4">
            <p className="text-[13px] text-text-secondary leading-relaxed mb-3">
              Dạng chiếm <b className="text-text-primary">70% đề</b> (~21/30 câu). Dưới đây là những câu
              LẶP LẠI nhiều lần trong 14 đề — học thuộc thẳng đáp án, không cần suy.
            </p>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setGroup('all')}
                className={`px-2.5 py-1.5 rounded-lg text-xs border transition-all ${
                  group === 'all'
                    ? 'bg-neon-fuchsia/15 border-neon-fuchsia/40 text-text-primary'
                    : 'bg-[var(--bg-surface-hover)] border-[var(--border-light)] text-text-secondary hover:text-text-primary'
                }`}
              >
                Tất cả ({BLANKS.length})
              </button>
              {BLANK_GROUPS.map((g) => {
                const c = BLANKS.filter((b) => b.group === g).length;
                return (
                  <button
                    key={g}
                    onClick={() => setGroup(g)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs border transition-all ${
                      group === g
                        ? 'bg-neon-fuchsia/15 border-neon-fuchsia/40 text-text-primary'
                        : 'bg-[var(--bg-surface-hover)] border-[var(--border-light)] text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {g} ({c})
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border-light)] bg-[var(--bg-surface-hover)] divide-y divide-[var(--border-light)] overflow-hidden">
            {blanks.map((b, i) => (
              <div key={`${b.jp}-${i}`} className="p-4">
                <div className="flex items-start gap-3">
                  <FreqBadge n={b.n} />
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <p className="text-[15px] text-text-primary leading-relaxed">{b.jp}</p>
                    <p className="text-[13px] text-text-secondary leading-relaxed italic">{b.vi}</p>
                    <div className="flex items-center gap-2 pt-0.5">
                      <span className="text-[11px] text-text-muted shrink-0">Đáp án:</span>
                      <span
                        className={`text-[15px] font-bold transition-all ${
                          reveal
                            ? 'text-tone-cyan'
                            : 'text-transparent bg-[var(--bg-surface-active)] rounded px-3 select-none'
                        }`}
                      >
                        {b.ans}
                      </span>
                    </div>
                    {b.why && reveal && (
                      <p className="text-[12px] text-neon-orange/90 leading-relaxed pt-0.5">
                        {b.why}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══════════ TỪ KHÁC LOẠI ══════════ */}
      {sub === 'odd' && (
        <section className="space-y-3">
          <div className="rounded-2xl border border-[var(--border-light)] bg-[var(--bg-surface-hover)] p-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[13px] text-text-secondary leading-relaxed max-w-lg">
              Cả {ODD_ONE_OUT.length} câu odd-one-out đã ra trong 14 đề. Bấm chọn từ bạn cho là
              lạc loài — trả lời xong hiện ngay lời giải.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-sm text-text-primary font-semibold">
                {oddScore}/{ODD_ONE_OUT.length}
              </span>
              <button
                onClick={() => setOddPick({})}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-[var(--bg-surface-hover)] border border-[var(--border-light)] text-text-secondary hover:text-text-primary transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Làm lại
              </button>
            </div>
          </div>

          {ODD_ONE_OUT.map((o, qi) => {
            const picked = oddPick[qi];
            const done = picked !== undefined;
            return (
              <div key={qi} className="rounded-2xl border border-[var(--border-light)] bg-[var(--bg-surface-hover)] p-4">
                <p className="text-[12px] text-text-muted mb-2.5">
                  Câu {qi + 1} — chọn từ KHÁC LOẠI
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {o.options.map((opt, oi) => {
                    const isAns = oi === o.ansIndex;
                    const isPick = picked === oi;
                    let cls = 'bg-[var(--bg-surface-hover)] border-[var(--border-light)] text-text-secondary hover:text-text-primary';
                    if (done && isAns) cls = 'bg-neon-green/15 border-neon-green/45 text-text-primary';
                    else if (done && isPick) cls = 'bg-neon-red/15 border-neon-red/45 text-text-primary';
                    else if (done) cls = 'bg-[var(--bg-surface-hover)] border-[var(--border-light)] text-text-muted';
                    return (
                      <button
                        key={oi}
                        disabled={done}
                        onClick={() => setOddPick({ ...oddPick, [qi]: oi })}
                        className={`px-3 py-2.5 rounded-xl border text-left transition-all active:scale-95 ${cls}`}
                      >
                        <span className="flex items-center gap-1.5">
                          {done && isAns && <Check className="w-3.5 h-3.5 text-tone-green shrink-0" />}
                          {done && isPick && !isAns && (
                            <X className="w-3.5 h-3.5 text-tone-red shrink-0" />
                          )}
                          <span className="text-sm font-medium">{opt.jp}</span>
                        </span>
                        <span className="block text-[11px] text-text-muted mt-0.5">{opt.vi}</span>
                      </button>
                    );
                  })}
                </div>
                {done && (
                  <p className="mt-2.5 text-[13px] text-tone-cyan leading-relaxed">{o.why}</p>
                )}
              </div>
            );
          })}
        </section>
      )}

      {/* ══════════ GHÉP CÂU & KATAKANA ══════════ */}
      {sub === 'build' && (
        <section className="space-y-4">
          <div className="rounded-2xl border border-[var(--border-light)] bg-[var(--bg-surface-hover)] overflow-hidden">
            <div className="p-4 border-b border-[var(--border-light)]">
              <h3 className="text-sm font-bold text-text-primary mb-1">
                Ghép câu từ gợi ý ({SENTENCE_BUILD.length} câu đã ra)
              </h3>
              <p className="text-[13px] text-text-secondary leading-relaxed">{BUILD_FORMULA}</p>
            </div>
            <div className="divide-y divide-[var(--border-light)]">
              {SENTENCE_BUILD.map((b, i) => (
                <div key={i} className="p-4 space-y-1.5">
                  <p className="text-[13px] text-text-secondary">{b.cues}</p>
                  <p
                    className={`text-[15px] font-semibold transition-all ${
                      reveal
                        ? 'text-tone-cyan'
                        : 'text-transparent bg-[var(--bg-surface-active)] rounded px-3 inline-block select-none'
                    }`}
                  >
                    {b.answer}
                  </p>
                  <p className="text-[13px] text-text-muted italic">{b.vi}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border-light)] bg-[var(--bg-surface-hover)] overflow-hidden">
            <div className="p-4 border-b border-[var(--border-light)]">
              <h3 className="text-sm font-bold text-text-primary mb-1">
                Từ mượn katakana — dạng hỏi nghĩa tiếng Việt
              </h3>
              <p className="text-[13px] text-text-secondary leading-relaxed">
                Chiếm ~2% đề nhưng là câu <b className="text-text-primary">cho không điểm</b> nếu biết
                nghĩa. Toàn bộ từ đã từng được hỏi nằm ở đây.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 divide-[var(--border-light)]">
              {LOANWORD_MEANINGS.map((w) => (
                <div
                  key={w.jp}
                  className="p-3.5 flex items-baseline gap-3 sm:border-b sm:border-[var(--border-light)]"
                >
                  <span className="text-[15px] font-semibold text-text-primary shrink-0">{w.jp}</span>
                  <span
                    className={`text-[13px] transition-all ${
                      reveal
                        ? 'text-tone-cyan'
                        : 'text-transparent bg-[var(--bg-surface-active)] rounded px-2 select-none'
                    }`}
                  >
                    {w.vi}
                  </span>
                  {w.note && (
                    <span className="ml-auto text-[11px] text-text-muted shrink-0">{w.note}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-neon-red/25 bg-neon-red/[0.05] p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-tone-red mb-2">
              <AlertTriangle className="w-4 h-4" />
              Hai câu đề THẬT in SAI đáp án — đừng học theo đề
            </div>
            <ul className="space-y-1.5 text-[13px] text-text-secondary leading-relaxed">
              <li>
                • <b className="text-text-primary">「にちようび、（ ）も しません。」</b> — đề chọn どこ,
                nhưng đúng phải là <b className="text-tone-cyan">なに</b>. どこも đi với いきません,
                なにも mới đi với しません.
              </li>
              <li>
                • <b className="text-text-primary">「あしたも 7時に 学校へ（ ）。」</b> — đề 11 chọn
                ききます (nghe), nhưng đúng là <b className="text-tone-cyan">きます</b> (đến). Đề 13
                cùng câu này lại in đúng.
              </li>
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
