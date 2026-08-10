'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Volume2,
  RotateCcw,
  Check,
  X,
  Ear,
  Gauge,
  ChevronRight,
  AlertTriangle,
  Flame,
} from 'lucide-react';

import { useJaSpeech } from './useJaSpeech';
import {
  LISTEN_SETS,
  LISTEN_STORAGE_KEY,
  checkListenAnswer,
  type ListenItem,
  type ListenSet,
} from './data/listening';
import { TALK_QUESTIONS, PICTURE_SETS, fillAnswer } from './data/speaking';
import { PERSONAL_QUESTIONS } from './data/personalQA';

/**
 * KHU NGHE HIỂU.
 *
 * Đây là khu được thêm sau kỳ thi trượt, chữa đúng lỗi đã bị mất điểm: nhìn chữ
 * thì hiểu, nghe thì không. Nguyên tắc thiết kế:
 *
 *  1. CHỮ LUÔN BỊ CHE cho tới khi trả lời xong. Hiện chữ ra là bài tập tự huỷ —
 *     người học sẽ đọc thay vì nghe mà không tự biết.
 *  2. Có nút chỉnh tốc độ. Luyện nghe chuẩn là nghe chậm cho ra từng âm rồi tăng
 *     dần lên tốc độ thật, chứ không phải nghe đi nghe lại ở một tốc độ.
 *  3. Ba chế độ khác nhau về ĐỘ CHẶT: chọn nghĩa (dễ, có thể đoán) → gõ lại
 *     (không đoán được) → nghe câu hỏi rồi tự trả lời (giống phòng thi nhất).
 *
 * Câu hỏi thi nói KHÔNG chép lại trong `listening.ts` — chúng được dựng ở đây từ
 * `speaking.ts` và `personalQA.ts` để không bao giờ lệch với khu Thi nói.
 */

type Stats = { seen: number; wrong: number };

const SPEEDS = [0.6, 0.8, 1] as const;

/* ── Dựng hai bộ 'respond' từ ngân hàng thi nói ─────────────── */

function buildSpeakSets(profile: Record<string, string>): ListenSet[] {
  const talk: ListenSet = {
    id: 'set-talk22',
    title: '22 câu hỏi giám thị — nghe & đáp',
    desc:
      'Chế độ giống phòng thi nhất: nghe câu hỏi (không nhìn chữ), đếm 1-2-3 rồi PHẢI nói ra câu trả lời, ' +
      'sau đó mới mở đáp án đối chiếu. Đáp án hiện ra là câu của chính bạn, theo hồ sơ đã điền ở khu Thi nói.',
    mode: 'respond',
    day: 'Ngày 20 · lặp tới hết tháng',
    course: 'JPD113',
    items: TALK_QUESTIONS.map((q) => ({
      id: `talk-${q.n}`,
      jp: q.jp,
      vi: `${q.vi}  →  ${fillAnswer(q.answer, profile)}`,
      note: q.note,
    })),
  };

  const pics: ListenSet = {
    id: 'set-pictures',
    title: 'Câu hỏi có tranh — nghe & đáp',
    desc:
      'Ba trong bốn câu ở phòng thi là câu hỏi tranh. Mở khu Thi nói ở tab khác để xem dữ liệu tranh, ' +
      'rồi nghe câu hỏi ở đây mà trả lời — đừng nhìn phần chữ của câu hỏi.',
    mode: 'respond',
    day: 'Ngày 21',
    course: 'JPD113',
    items: PICTURE_SETS.flatMap((set) =>
      set.qa.map((qa, i) => ({
        id: `pic-${set.n}-${i}`,
        jp: qa.q,
        vi: qa.a,
        note: `Bộ tranh ${set.n} — ${set.title} · ${set.data.join(' · ')}`,
      })),
    ),
  };

  const personal: ListenSet = {
    id: 'set-personal',
    title: 'Câu hỏi cá nhân mở rộng — nghe & đáp',
    desc:
      'Ngoài ngân hàng 22 câu, giám thị có quyền hỏi thêm về bản thân bạn — lần thi trước đúng là ' +
      'có một câu như vậy. Đây là 40 câu hay được hỏi nhất.',
    mode: 'respond',
    day: 'Ngày 22',
    course: 'JPD113',
    items: PERSONAL_QUESTIONS.map((q) => ({
      id: `pq-${q.n}`,
      jp: q.jp,
      vi: `${q.vi}  →  ${fillAnswer(q.answer, profile)}`,
      note: q.note,
    })),
  };

  return [talk, pics, personal];
}

/** Trộn mảng — chỉ gọi trong event handler / effect, không gọi lúc render SSR */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ListeningPanel({ profile }: { profile: Record<string, string> }) {
  const { speak, stop, speaking, voiceReady, voiceName, supported } = useJaSpeech();

  const sets = useMemo(() => [...LISTEN_SETS, ...buildSpeakSets(profile)], [profile]);

  const [setId, setSetId] = useState(sets[0].id);
  const [rate, setRate] = useState<number>(0.8);
  const [order, setOrder] = useState<number[]>([]);
  const [pos, setPos] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const [typed, setTyped] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [round, setRound] = useState({ right: 0, wrong: 0 });
  const [stats, setStats] = useState<Record<string, Stats>>({});
  const [onlyWrong, setOnlyWrong] = useState(false);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const set = sets.find((s) => s.id === setId) ?? sets[0];

  /* ── localStorage ─────────────────────────────────────────── */
  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(LISTEN_STORAGE_KEY);
      if (raw) setStats(JSON.parse(raw));
    } catch {
      /* dữ liệu hỏng — coi như chưa có thống kê */
    }
  }, []);

  const bump = useCallback((id: string, wrong: boolean) => {
    setStats((prev) => {
      const cur = prev[id] ?? { seen: 0, wrong: 0 };
      const next = { ...prev, [id]: { seen: cur.seen + 1, wrong: cur.wrong + (wrong ? 1 : 0) } };
      try {
        localStorage.setItem(LISTEN_STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* hết quota — thống kê chỉ còn trong phiên này */
      }
      return next;
    });
  }, []);

  /* ── Rổ câu hỏi ───────────────────────────────────────────────
     `wrongSnapshot` là ẢNH CHỤP danh sách câu sai lúc bấm nút, KHÔNG phải
     bộ lọc sống theo `stats`. Nếu lọc sống thì mỗi lần trả lời `stats` đổi →
     `pool` đổi identity → effect bốc lại thứ tự → vòng luyện reset sau ĐÚNG
     MỘT câu. Ảnh chụp giữ rổ đứng yên suốt vòng. */
  const [wrongSnapshot, setWrongSnapshot] = useState<string[]>([]);

  const pool = useMemo(() => {
    if (!onlyWrong) return set.items;
    const ids = new Set(wrongSnapshot);
    const bad = set.items.filter((it) => ids.has(it.id));
    return bad.length ? bad : set.items;
  }, [set, onlyWrong, wrongSnapshot]);

  const startRound = useCallback(() => {
    setOrder(shuffle(pool.map((_, i) => i)));
    setPos(0);
    setRevealed(false);
    setPicked(null);
    setTyped('');
    setRound({ right: 0, wrong: 0 });
  }, [pool]);

  // Đổi bộ / đổi rổ → bốc lại thứ tự. Chạy trong effect nên Math.random không
  // đụng tới lần render đầu (server và client vẫn khớp nhau).
  useEffect(() => {
    setOrder(shuffle(pool.map((_, i) => i)));
    setPos(0);
    setRevealed(false);
    setPicked(null);
    setTyped('');
    setRound({ right: 0, wrong: 0 });
  }, [pool]);

  // % pool.length ở ngoài: khi đổi bộ, `order` còn là thứ tự của rổ CŨ trong đúng
  // một lần render (effect chạy sau) — không kẹp lại thì chỉ số vượt rổ mới và
  // câu hỏi biến mất một nhịp.
  const item: ListenItem | undefined =
    order.length && pool.length ? pool[order[pos % order.length] % pool.length] : undefined;

  /* ── Lựa chọn cho chế độ chọn nghĩa ───────────────────────── */
  useEffect(() => {
    if (!item || set.mode !== 'mcq') {
      setOptions([]);
      return;
    }
    if (item.options?.length) {
      setOptions(shuffle(item.options));
      return;
    }
    const others = pool
      .filter((x) => x.id !== item.id && x.vi !== item.vi)
      .map((x) => x.vi);
    setOptions(shuffle([item.vi, ...shuffle(others).slice(0, 3)]));
  }, [item, set.mode, pool]);

  /* ── Tự đọc khi sang câu mới ──────────────────────────────── */
  useEffect(() => {
    if (!item || !mounted || !voiceReady) return;
    const t = setTimeout(() => speak(item.jp, rate), 220);
    return () => clearTimeout(t);
    // rate cố tình KHÔNG nằm trong deps: đổi tốc độ giữa chừng thì người học tự
    // bấm nghe lại, chứ không nên tự phát lại ngay lúc đang kéo nút.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, mounted, voiceReady]);

  const next = useCallback(() => {
    stop();
    setRevealed(false);
    setPicked(null);
    setTyped('');
    setPos((p) => p + 1);
  }, [stop]);

  const answerMcq = (opt: string) => {
    if (revealed || !item) return;
    setPicked(opt);
    setRevealed(true);
    const ok = opt === item.vi;
    setRound((r) => ({ right: r.right + (ok ? 1 : 0), wrong: r.wrong + (ok ? 0 : 1) }));
    bump(item.id, !ok);
  };

  const answerTyped = () => {
    if (revealed || !item) return;
    const ok = checkListenAnswer(item, typed);
    setRevealed(true);
    setRound((r) => ({ right: r.right + (ok ? 1 : 0), wrong: r.wrong + (ok ? 0 : 1) }));
    bump(item.id, !ok);
  };

  const typedOk = item ? checkListenAnswer(item, typed) : false;
  const wrongCount = set.items.filter((it) => (stats[it.id]?.wrong ?? 0) > 0).length;

  return (
    <div className="space-y-6">
      {/* Giới thiệu */}
      <section className="rounded-2xl border border-neon-yellow/25 bg-neon-yellow/[0.05] p-6">
        <h2 className="flex items-center gap-2 text-lg font-heading font-semibold text-white mb-3">
          <Ear className="w-5 h-5 text-neon-yellow" />
          Vì sao khu này là khu quan trọng nhất
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed mb-3">
          Ở kỳ thi trước, phần mất điểm nặng nhất không phải là <b className="text-white">nói</b> mà là{' '}
          <b className="text-white">nghe</b>: giám thị hỏi 4 câu, không câu nào nghe ra. Nhìn chữ thì hiểu,
          nghe thì không — đó là dấu hiệu của việc học tiếng Nhật hoàn toàn bằng mắt.
        </p>
        <p className="text-sm text-slate-400 leading-relaxed">
          Nghe hiểu <b className="text-white">không</b> học được bằng cách đọc thêm. Nó chỉ đến bằng số giờ
          tai bạn tiếp xúc với tiếng Nhật. Vì thế khu này thiết kế để chạy{' '}
          <b className="text-white">10 phút mỗi ngày trong 30 ngày</b> — cộng lại 5 giờ, đủ để khuôn câu hỏi
          của giám thị trở nên quen thuộc.
        </p>
      </section>

      {/* Cảnh báo thiếu giọng tiếng Nhật */}
      {mounted && supported && !voiceReady && (
        <section className="rounded-2xl border border-neon-orange/30 bg-neon-orange/[0.07] p-5">
          <h3 className="flex items-center gap-2 text-sm font-bold text-neon-orange mb-2">
            <AlertTriangle className="w-4 h-4" />
            Máy bạn chưa có giọng đọc tiếng Nhật
          </h3>
          <p className="text-[13px] text-slate-300 leading-relaxed mb-2">
            Trang cố tình <b className="text-white">không</b> đọc bằng giọng tiếng Việt thay thế — nghe sai âm
            còn hại hơn không nghe. Cài giọng tiếng Nhật rồi tải lại trang:
          </p>
          <ul className="text-[13px] text-slate-400 space-y-1 leading-relaxed">
            <li>
              <b className="text-slate-300">macOS:</b> Cài đặt hệ thống → Trợ năng → Nội dung đọc → Giọng nói
              → thêm tiếng Nhật (Kyoko hoặc Otoya)
            </li>
            <li>
              <b className="text-slate-300">Windows:</b> Settings → Time &amp; language → Speech → Add voices
              → Japanese
            </li>
            <li>
              <b className="text-slate-300">Android / Chrome:</b> thường có sẵn giọng Google 日本語
            </li>
            <li>
              <b className="text-slate-300">iPhone:</b> Cài đặt → Trợ năng → Nội dung nói → Giọng nói → Tiếng
              Nhật
            </li>
          </ul>
        </section>
      )}

      {/* Chọn bộ */}
      <div className="flex flex-wrap gap-2">
        {sets.map((s) => {
          const active = s.id === set.id;
          return (
            <button
              key={s.id}
              onClick={() => {
                stop();
                setSetId(s.id);
                setOnlyWrong(false);
              }}
              className={`px-3 py-2 rounded-xl text-[13px] font-medium border transition-all active:scale-95 ${
                active
                  ? 'bg-neon-yellow/15 border-neon-yellow/40 text-white'
                  : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:border-white/20'
              }`}
            >
              {s.title}
              <span className="ml-1.5 text-[11px] text-slate-500">{s.items.length}</span>
            </button>
          );
        })}
      </div>

      {/* Mô tả bộ đang chọn */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-neon-violet/15 text-neon-violet border border-neon-violet/25">
            {set.course}
          </span>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/[0.06] text-slate-400">
            {set.mode === 'mcq' ? 'NGHE → CHỌN NGHĨA' : set.mode === 'dictation' ? 'NGHE → GÕ LẠI' : 'NGHE → TỰ TRẢ LỜI'}
          </span>
          <span className="text-[11px] text-slate-500">{set.day}</span>
        </div>
        <p className="text-[13px] text-slate-400 leading-relaxed">{set.desc}</p>
      </div>

      {/* Thanh điều khiển */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] p-1">
          <Gauge className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
          {SPEEDS.map((s) => (
            <button
              key={s}
              onClick={() => setRate(s)}
              className={`px-2.5 py-1 rounded-lg text-[12px] font-semibold transition-colors ${
                rate === s ? 'bg-neon-yellow/20 text-neon-yellow' : 'text-slate-500 hover:text-white'
              }`}
            >
              {s}×
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            if (!onlyWrong) {
              setWrongSnapshot(set.items.filter((it) => (stats[it.id]?.wrong ?? 0) > 0).map((it) => it.id));
            }
            setOnlyWrong((v) => !v);
          }}
          disabled={!wrongCount}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] border transition-all active:scale-95 disabled:opacity-40 ${
            onlyWrong
              ? 'bg-neon-red/15 border-neon-red/40 text-neon-red'
              : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          {onlyWrong ? `Đang luyện ${pool.length} câu hay sai` : `Luyện ${wrongCount} câu hay sai`}
        </button>

        <button
          onClick={startRound}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] bg-white/[0.03] border border-white/10 text-slate-400 hover:text-white transition-all active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Trộn lại
        </button>

        <div className="ml-auto flex items-center gap-3 text-[13px]">
          <span className="text-neon-green font-semibold">{round.right} đúng</span>
          <span className="text-neon-red font-semibold">{round.wrong} sai</span>
          <span className="text-slate-500">
            {order.length ? `${(pos % order.length) + 1}/${order.length}` : '—'}
          </span>
        </div>
      </div>

      {/* Câu hỏi */}
      {item && (
        <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#141220] to-[#0d0b14] p-6 sm:p-8">
          {/* Nút nghe */}
          <div className="flex flex-col items-center gap-4 mb-7">
            <button
              onClick={() => speak(item.jp, rate)}
              disabled={!voiceReady}
              className={`w-24 h-24 rounded-full flex items-center justify-center border-2 transition-all active:scale-95 disabled:opacity-30 ${
                speaking
                  ? 'bg-neon-yellow/25 border-neon-yellow text-neon-yellow animate-pulse'
                  : 'bg-neon-yellow/10 border-neon-yellow/40 text-neon-yellow hover:bg-neon-yellow/20'
              }`}
              aria-label="Nghe lại"
            >
              <Volume2 className="w-10 h-10" />
            </button>
            <p className="text-[12px] text-slate-500">
              Bấm để nghe lại · tốc độ {rate}×{voiceName ? ` · giọng ${voiceName}` : ''}
            </p>
          </div>

          {/* Chế độ CHỌN NGHĨA */}
          {set.mode === 'mcq' && (
            <div className="grid sm:grid-cols-2 gap-2.5">
              {options.map((opt) => {
                const isRight = opt === item.vi;
                const isPicked = opt === picked;
                return (
                  <button
                    key={opt}
                    onClick={() => answerMcq(opt)}
                    disabled={revealed}
                    className={`text-left px-4 py-3 rounded-xl border text-sm transition-all active:scale-[0.98] ${
                      revealed && isRight
                        ? 'border-neon-green/50 bg-neon-green/10 text-white'
                        : revealed && isPicked
                          ? 'border-neon-red/50 bg-neon-red/10 text-slate-300'
                          : revealed
                            ? 'border-white/8 bg-white/[0.02] text-slate-500'
                            : 'border-white/12 bg-white/[0.03] text-slate-200 hover:border-neon-yellow/40 hover:bg-white/[0.06]'
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      {revealed && isRight && <Check className="w-4 h-4 text-neon-green shrink-0" />}
                      {revealed && isPicked && !isRight && <X className="w-4 h-4 text-neon-red shrink-0" />}
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Chế độ GÕ LẠI */}
          {set.mode === 'dictation' && (
            <div className="max-w-md mx-auto">
              <input
                ref={inputRef}
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                onKeyDown={(e) => {
                  // BẮT BUỘC: bỏ qua Enter khi bộ gõ tiếng Nhật đang ghép chữ,
                  // nếu không thì lúc nhấn Enter để chốt わたし bài bị nộp non.
                  if (e.key !== 'Enter' || e.nativeEvent.isComposing) return;
                  e.preventDefault();
                  if (revealed) next();
                  else answerTyped();
                }}
                disabled={revealed}
                placeholder="Gõ lại những gì bạn nghe được…"
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white text-center text-lg placeholder:text-slate-600 focus:outline-none focus:border-neon-yellow/50 disabled:opacity-60"
              />
              <p className="text-[11px] text-slate-500 text-center mt-2">
                Gõ kana, katakana, romaji hay chữ số đều được — chấm rất khoan dung.
              </p>
              {!revealed && (
                <button
                  onClick={answerTyped}
                  className="w-full mt-3 px-4 py-2.5 rounded-xl bg-neon-yellow/15 border border-neon-yellow/40 text-neon-yellow text-sm font-semibold hover:bg-neon-yellow/25 transition-colors active:scale-95"
                >
                  Kiểm tra
                </button>
              )}
              {revealed && (
                <div
                  className={`mt-3 rounded-xl border p-3 text-center ${
                    typedOk
                      ? 'border-neon-green/40 bg-neon-green/10'
                      : 'border-neon-red/40 bg-neon-red/10'
                  }`}
                >
                  <div className={`text-sm font-bold ${typedOk ? 'text-neon-green' : 'text-neon-red'}`}>
                    {typedOk ? 'ĐÚNG' : 'SAI'}
                  </div>
                  <div className="text-lg text-white mt-1">{item.vi}</div>
                </div>
              )}
            </div>
          )}

          {/* Chế độ NGHE & TỰ TRẢ LỜI */}
          {set.mode === 'respond' && (
            <div className="max-w-2xl mx-auto text-center">
              {!revealed ? (
                <>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">
                    Nghe câu hỏi, đếm <b className="text-white">1 — 2 — 3</b> rồi{' '}
                    <b className="text-white">nói to</b> câu trả lời. Nói xong mới bấm mở đáp án — và tự chấm
                    thật thà, câu tự chấm &ldquo;chưa được&rdquo; sẽ quay lại ở nút{' '}
                    <b className="text-white">Luyện câu hay sai</b>.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2.5">
                    <button
                      onClick={() => {
                        setRevealed(true);
                        setRound((r) => ({ ...r, right: r.right + 1 }));
                        if (item) bump(item.id, false);
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neon-green/15 border border-neon-green/40 text-neon-green text-sm font-semibold hover:bg-neon-green/25 transition-colors active:scale-95"
                    >
                      <Check className="w-4 h-4" />
                      Nói ra được — mở đáp án
                    </button>
                    <button
                      onClick={() => {
                        setRevealed(true);
                        setRound((r) => ({ ...r, wrong: r.wrong + 1 }));
                        if (item) bump(item.id, true);
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neon-red/12 border border-neon-red/40 text-neon-red text-sm font-semibold hover:bg-neon-red/22 transition-colors active:scale-95"
                    >
                      <X className="w-4 h-4" />
                      Chưa nói được
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-xl border border-white/12 bg-black/30 p-4">
                    <div className="text-[11px] font-bold tracking-wider text-slate-500 mb-1">
                      CÂU HỎI
                    </div>
                    <div className="text-xl text-white leading-relaxed">{item.jp}</div>
                  </div>
                  <div className="rounded-xl border border-neon-green/30 bg-neon-green/[0.07] p-4">
                    <div className="text-[11px] font-bold tracking-wider text-neon-green mb-1">
                      NGHĨA &amp; CÂU TRẢ LỜI CỦA BẠN
                    </div>
                    <div className="text-base text-slate-200 leading-relaxed">{item.vi}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Lật đáp án + ghi chú */}
          {revealed && (
            <div className="mt-6 space-y-3">
              {set.mode !== 'respond' && (
                <div className="rounded-xl border border-white/12 bg-black/30 p-4 text-center">
                  <div className="text-[11px] font-bold tracking-wider text-slate-500 mb-1">
                    BẠN VỪA NGHE
                  </div>
                  <div className="text-2xl text-white">{item.jp}</div>
                  {item.kana && <div className="text-sm text-slate-400 mt-1">{item.kana}</div>}
                </div>
              )}

              {item.note && (
                <div className="rounded-xl border border-neon-cyan/25 bg-neon-cyan/[0.06] p-3.5">
                  <div className="text-[11px] font-bold tracking-wider text-neon-cyan mb-1">GHI CHÚ</div>
                  <p className="text-[13px] text-slate-300 leading-relaxed">{item.note}</p>
                </div>
              )}

              <button
                onClick={next}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-neon-violet/15 border border-neon-violet/40 text-white text-sm font-semibold hover:bg-neon-violet/25 transition-colors active:scale-95"
              >
                Câu tiếp theo
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </section>
      )}

      {/* Bảng câu hay sai */}
      {mounted && wrongCount > 0 && (
        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h3 className="text-sm font-bold text-white mb-3">
            Câu bạn hay nghe sai trong bộ này ({wrongCount})
          </h3>
          <div className="flex flex-wrap gap-2">
            {set.items
              .filter((it) => (stats[it.id]?.wrong ?? 0) > 0)
              .sort((a, b) => (stats[b.id]?.wrong ?? 0) - (stats[a.id]?.wrong ?? 0))
              .slice(0, 30)
              .map((it) => (
                <span
                  key={it.id}
                  className="px-2.5 py-1 rounded-lg text-[13px] bg-neon-red/10 border border-neon-red/25 text-slate-300"
                >
                  {it.jp}
                  <span className="ml-1.5 text-[11px] text-neon-red font-bold">
                    ×{stats[it.id]?.wrong}
                  </span>
                </span>
              ))}
          </div>
        </section>
      )}
    </div>
  );
}
