'use client';

/**
 * Khu SỐ VIẾT BẰNG CHỮ HÁN — đặt trong mục "Chữ Hán" của tab Bảng tra cứu,
 * ngay sau khu lật thẻ.
 *
 * Vì sao cần dù cheat-sheet đã có bảng số: bảng đó tra CÁCH ĐỌC khi đã biết
 * con số. Ở đây là chiều ngược lại — nhìn 二万四千八百 phải ra được 24.800
 * rồi mới đọc. Đó mới là dạng đề FE hỏi, và là lý do bài đọc số 9 (mọi số
 * viết bằng kanji) bị chấm là khó nhất ngân hàng.
 *
 * Phần luyện tập sinh câu hỏi bằng chính bộ chuyển đổi `toKanji`/`toKana`
 * nên không bao giờ hết bài. Bộ chuyển đổi tự kiểm lúc mount bằng 12 đáp án
 * số có thật trong đề — hỏng thì hiện cảnh báo đỏ thay vì âm thầm dạy sai.
 */

import { useState, useMemo, useEffect, useCallback } from 'react';
import { AlertTriangle, RotateCcw, Eye, Sparkles, Check, X } from 'lucide-react';

import {
  DIGITS,
  PLACES,
  PLACE_RULE,
  COMPOSE_RULES,
  SOUND_CHANGES,
  SOUND_MNEMONIC,
  WORKED,
  COMMON_NUMBERS,
  toKanji,
  toKana,
  runSelfTest,
} from './data/kanjiNumbers';

type Mode = 'read' | 'write';

/** Sinh số giống đề: nghiêng hẳn về giá tiền và mốc tròn, không random đều */
function pickNumber(): number {
  const r = Math.random();
  if (r < 0.35) return COMMON_NUMBERS[Math.floor(Math.random() * COMMON_NUMBERS.length)];
  if (r < 0.55) return (Math.floor(Math.random() * 9) + 1) * 100 + Math.floor(Math.random() * 10) * 10;
  if (r < 0.75) return (Math.floor(Math.random() * 9) + 1) * 1000 + Math.floor(Math.random() * 10) * 100;
  if (r < 0.9) return (Math.floor(Math.random() * 9) + 1) * 10000 + Math.floor(Math.random() * 10) * 1000;
  return Math.floor(Math.random() * 99) + 1;
}

export default function KanjiNumberPanel() {
  const [mode, setMode] = useState<Mode>('read');
  const [n, setN] = useState<number>(8500);
  const [shown, setShown] = useState(false);
  const [score, setScore] = useState({ ok: 0, total: 0 });
  const [openWorked, setOpenWorked] = useState<number | null>(0);
  const [input, setInput] = useState('');

  // Bộ chuyển đổi tự kiểm — thà hiện cảnh báo còn hơn âm thầm dạy sai
  const selfTestErrors = useMemo(() => runSelfTest(), []);

  const next = useCallback(() => {
    setN(pickNumber());
    setShown(false);
    setInput('');
  }, []);

  useEffect(() => {
    setN(pickNumber());
  }, []);

  const grade = (correct: boolean) => {
    setScore((s) => ({ ok: s.ok + (correct ? 1 : 0), total: s.total + 1 }));
    next();
  };

  return (
    <div className="space-y-4">
      {selfTestErrors.length > 0 && (
        <div className="rounded-xl border border-neon-red/40 bg-neon-red/10 p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-neon-red mb-1.5">
            <AlertTriangle className="w-4 h-4" /> Bộ chuyển đổi đang SAI — đừng học phần luyện tập
          </div>
          <ul className="text-[12px] text-slate-300 space-y-0.5">
            {selfTestErrors.map((e) => (
              <li key={e}>• {e}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Mở đầu: luật nhóm 4 chữ số ── */}
      <section className="rounded-2xl border border-neon-orange/30 bg-neon-orange/[0.06] p-5">
        <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-neon-orange" />
          Điều khác tiếng Việt nhất — đọc kỹ 1 phút này trước
        </h3>
        <p className="text-[13px] text-slate-300 leading-relaxed">{PLACE_RULE}</p>
        <div className="mt-3 grid sm:grid-cols-2 gap-2">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="text-[11px] text-slate-500 mb-1">Tiếng Việt cắt 3 chữ số</div>
            <div className="text-lg text-white font-mono tracking-wider">83<span className="text-neon-red">.</span>000</div>
            <div className="text-[12px] text-slate-400 mt-1">tám mươi ba <b className="text-white">nghìn</b></div>
          </div>
          <div className="rounded-xl border border-neon-cyan/25 bg-neon-cyan/[0.05] p-3">
            <div className="text-[11px] text-slate-500 mb-1">Tiếng Nhật cắt 4 chữ số</div>
            <div className="text-lg text-white font-mono tracking-wider">8<span className="text-neon-cyan">|</span>3000</div>
            <div className="text-[12px] text-neon-cyan mt-1">はちまん さんぜん = 8 <b>vạn</b> 3 nghìn</div>
          </div>
        </div>
      </section>

      {/* ── 10 chữ số ── */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
        <div className="p-4 border-b border-white/[0.06]">
          <h3 className="text-sm font-bold text-white mb-1">Mười chữ số — bạn đã biết hết bằng Hán-Việt</h3>
          <p className="text-[13px] text-slate-400 leading-relaxed">
            NHẤT NHỊ TAM TỨ NGŨ LỤC THẤT BÁT CỬU THẬP — đọc to một lượt là xong. Ba chữ 一二三 chỉ
            là 1, 2, 3 vạch ngang, cho không.
          </p>
        </div>
        <div className="divide-y divide-white/[0.05]">
          {DIGITS.map((d) => (
            <div key={d.n} className="p-3.5 flex items-start gap-3">
              <span className="shrink-0 w-8 text-center text-[11px] text-slate-500 mt-2">{d.n}</span>
              <span className="shrink-0 text-3xl text-white w-12 text-center leading-none mt-0.5">{d.kanji}</span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                  <span className="text-base text-neon-cyan font-semibold">{d.kana}</span>
                  <span className="text-[13px] text-neon-green font-bold tracking-wide">{d.hanviet}</span>
                </div>
                <div className="text-[12px] text-slate-400 mt-0.5 leading-relaxed">{d.viWord}</div>
                {d.shape && <div className="text-[12px] text-slate-500 mt-0.5">✎ {d.shape}</div>}
                {d.alt && <div className="text-[12px] text-neon-orange/90 mt-0.5">⚠ {d.alt}</div>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4 hàng ── */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
        <div className="p-4 border-b border-white/[0.06]">
          <h3 className="text-sm font-bold text-white">Bốn hàng — THẬP · BÁCH · THIÊN · VẠN</h3>
        </div>
        <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 divide-white/[0.05]">
          {PLACES.map((p) => (
            <div key={p.kanji} className="p-3.5 flex items-start gap-3 sm:border-b sm:border-white/[0.05]">
              <span className="shrink-0 text-3xl text-white w-12 text-center leading-none">{p.kanji}</span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-2.5">
                  <span className="text-base text-neon-cyan font-semibold">{p.kana}</span>
                  <span className="text-[13px] text-neon-green font-bold">{p.hanviet}</span>
                  <span className="text-[12px] text-slate-500">= {p.n.toLocaleString('vi-VN')}</span>
                </div>
                <div className="text-[12px] text-slate-400 mt-0.5">{p.viWord}</div>
                {p.shape && <div className="text-[12px] text-slate-500 mt-0.5">✎ {p.shape}</div>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Luật ghép ── */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
        <div className="p-4 border-b border-white/[0.06]">
          <h3 className="text-sm font-bold text-white">Sáu luật ghép số</h3>
        </div>
        <div className="divide-y divide-white/[0.05]">
          {COMPOSE_RULES.map((r, i) => (
            <div key={i} className="p-3.5">
              <div className="text-[13px] text-white font-medium mb-1">
                {i + 1}. {r.rule}
              </div>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 pl-4">
                <span className="text-lg text-white">{r.ex}</span>
                <span className="text-[13px] text-neon-cyan">{r.read}</span>
                <span className="text-[12px] text-slate-500">{r.vi}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Biến âm ── */}
      <section className="rounded-2xl border border-neon-red/25 bg-neon-red/[0.04] overflow-hidden">
        <div className="p-4 border-b border-neon-red/15">
          <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-neon-red" />
            Sáu chỗ biến âm — học vẹt, không suy ra được
          </h3>
          <p className="text-[13px] text-slate-300 leading-relaxed">{SOUND_MNEMONIC}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] min-w-[460px]">
            <thead>
              <tr className="text-[11px] uppercase tracking-wide text-slate-500">
                <th className="px-3 py-2 font-semibold">Kanji</th>
                <th className="px-3 py-2 font-semibold">Số</th>
                <th className="px-3 py-2 font-semibold">SAI</th>
                <th className="px-3 py-2 font-semibold">ĐÚNG</th>
                <th className="px-3 py-2 font-semibold">Vì sao</th>
              </tr>
            </thead>
            <tbody>
              {SOUND_CHANGES.map((s) => (
                <tr key={s.kanji} className="border-t border-white/[0.06]">
                  <td className="px-3 py-2.5 text-white text-base">{s.kanji}</td>
                  <td className="px-3 py-2.5 text-slate-400">{s.n}</td>
                  <td className="px-3 py-2.5 text-neon-red/80 line-through">{s.wrong}</td>
                  <td className="px-3 py-2.5 text-neon-green font-semibold">{s.right}</td>
                  <td className="px-3 py-2.5 text-slate-400 text-[12px]">{s.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Giải mẫu ── */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
        <div className="p-4 border-b border-white/[0.06]">
          <h3 className="text-sm font-bold text-white mb-1">Giải từng bước — 6 số lấy thẳng từ đề thật</h3>
          <p className="text-[13px] text-slate-400">Bấm vào từng số để mở lời giải.</p>
        </div>
        <div className="divide-y divide-white/[0.05]">
          {WORKED.map((w, i) => {
            const open = openWorked === i;
            return (
              <div key={w.kanji}>
                <button
                  onClick={() => setOpenWorked(open ? null : i)}
                  className="w-full p-3.5 flex items-center gap-3 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-xl text-white">{w.kanji}</span>
                  <span className="text-[12px] text-slate-500 ml-auto shrink-0">
                    {open ? '−' : '+'}
                  </span>
                </button>
                {open && (
                  <div className="px-3.5 pb-4 space-y-2">
                    <ol className="space-y-1">
                      {w.steps.map((s, j) => (
                        <li key={j} className="text-[13px] text-slate-300 leading-relaxed flex gap-2">
                          <span className="text-neon-violet font-bold shrink-0">{j + 1}.</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ol>
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 pt-1">
                      <span className="text-lg text-neon-cyan font-semibold">{w.read}</span>
                      <span className="text-base text-white font-mono">{w.n.toLocaleString('vi-VN')}</span>
                    </div>
                    <p className="text-[11px] text-slate-600">{w.source}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── LUYỆN TẬP ── */}
      <section className="rounded-2xl border border-neon-violet/30 bg-neon-violet/[0.05] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h3 className="text-base font-bold text-white">Luyện tập — câu sinh tự động, không bao giờ hết</h3>
          <div className="flex items-center gap-3">
            <span className="text-sm text-white font-semibold">
              {score.ok}/{score.total}
            </span>
            <button
              onClick={() => {
                setScore({ ok: 0, total: 0 });
                next();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-white/[0.05] border border-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Làm lại
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {([
            { id: 'read' as const, label: 'Đọc kanji → ra số + cách đọc' },
            { id: 'write' as const, label: 'Thấy số → viết kanji' },
          ]).map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setMode(m.id);
                next();
              }}
              className={`px-3.5 py-2 rounded-xl text-[13px] font-medium border transition-all active:scale-95 ${
                mode === m.id
                  ? 'bg-neon-violet/20 border-neon-violet/45 text-white'
                  : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-white/12 bg-[#0a0a0f]/60 px-5 py-8 text-center">
          {mode === 'read' ? (
            <div className="text-4xl sm:text-5xl text-white tracking-wide leading-tight">{toKanji(n)}</div>
          ) : (
            <div className="text-4xl sm:text-5xl text-white font-mono tracking-wide leading-tight">
              {n.toLocaleString('vi-VN')}
            </div>
          )}

          {!shown ? (
            <>
              <p className="text-[12px] text-slate-500 mt-5">
                {mode === 'read'
                  ? 'Đọc to thành tiếng rồi bấm để so'
                  : 'Viết ra giấy rồi bấm để so'}
              </p>
              {mode === 'read' && (
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    // Nhường phím cho bộ gõ tiếng Nhật: Enter lúc đang ghép
                    // chữ là để CHỐT kana, không phải để nộp bài.
                    if (e.key === 'Enter' && !e.nativeEvent.isComposing) setShown(true);
                  }}
                  placeholder="gõ thử cách đọc (không bắt buộc) — Enter để so"
                  className="mt-3 w-full max-w-sm mx-auto block px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-sm text-white text-center placeholder:text-slate-600 focus:outline-none focus:border-neon-violet/50"
                />
              )}
              <button
                onClick={() => setShown(true)}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm bg-white/[0.06] border border-white/15 text-white hover:bg-white/[0.1] transition-colors"
              >
                <Eye className="w-4 h-4" /> Hiện đáp án
              </button>
            </>
          ) : (
            <>
              <div className="mt-5 space-y-1.5">
                {mode === 'read' ? (
                  <>
                    <div className="text-2xl text-neon-cyan font-semibold">{toKana(n)}</div>
                    <div className="text-lg text-white font-mono">{n.toLocaleString('vi-VN')}</div>
                  </>
                ) : (
                  <>
                    <div className="text-3xl text-white">{toKanji(n)}</div>
                    <div className="text-xl text-neon-cyan font-semibold">{toKana(n)}</div>
                  </>
                )}
                {input.trim() && (
                  <div className="text-[12px] text-slate-500">
                    bạn gõ: <span className="text-slate-300">{input}</span>
                  </div>
                )}
              </div>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => grade(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm bg-neon-green/15 border border-neon-green/40 text-white hover:bg-neon-green/25 transition-colors active:scale-95"
                >
                  <Check className="w-4 h-4" /> Tôi đúng
                </button>
                <button
                  onClick={() => grade(false)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm bg-neon-red/15 border border-neon-red/40 text-white hover:bg-neon-red/25 transition-colors active:scale-95"
                >
                  <X className="w-4 h-4" /> Tôi sai
                </button>
              </div>
            </>
          )}
        </div>

        <p className="text-[12px] text-slate-500 mt-3 leading-relaxed">
          Số được sinh nghiêng về giá tiền và mốc tròn giống đề thật (35% bốc thẳng từ danh sách số
          đã ra trong 420 câu), chứ không random đều — luyện đúng thứ sẽ gặp.
        </p>
      </section>
    </div>
  );
}
