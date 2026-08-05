'use client';

/**
 * Luyện gõ cả đoạn văn tiếng Anh.
 *
 * Khác bản kana ở /tech-trends/on-thi-jpd113: ở đó phải chuyển romaji sang
 * kana nên cần bộ tokenize riêng; ở đây so khớp thẳng từng ký tự, nên logic
 * đơn giản hơn nhiều và không cần bảng chuyển.
 *
 * Ba quyết định về cách chấm, giữ lại từ bản kana vì chúng đúng:
 *
 *  - **Gõ sai KHÔNG làm kẹt bài.** Ký tự đỏ lên, được ghi vào sổ lỗi, rồi vẫn
 *    cho đi tiếp. Chặn lại giữa chừng chỉ làm mất nhịp và nản, mà nhịp mới là
 *    thứ đang luyện.
 *  - **Độ chính xác tính theo lần gõ ĐẦU TIÊN** ở mỗi vị trí. Gõ sai rồi xoá
 *    đi gõ lại vẫn tính là sai — nếu không thì con số vô nghĩa.
 *  - **Đồng hồ chỉ chạy từ ký tự đầu tiên**, không chạy từ lúc mở bài. Mở ra
 *    ngồi đọc đề năm phút rồi mới gõ thì tốc độ không bị tính oan.
 *
 * WPM tính theo quy ước chuẩn của ngành: 1 "từ" = 5 ký tự.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Keyboard, RotateCcw, Trophy, Timer, Zap, Target, AlertTriangle, Eye, EyeOff,
} from 'lucide-react';
import { TYPING_PASSAGES, TYPING_KEY, type TypingPassage } from './data/typing';

interface Best {
  wpm: number;
  accuracy: number;
}

interface Wrong {
  index: number;
  expected: string;
  typed: string;
}

export default function TypingPanel({ stageId }: { stageId: string }) {
  const forStage = useMemo(
    () => TYPING_PASSAGES.filter((p) => p.stage === stageId),
    [stageId],
  );
  // Chặng chưa có đoạn riêng thì rơi về toàn bộ, để tab không bao giờ trống.
  const list = forStage.length ? forStage : TYPING_PASSAGES;

  const [passage, setPassage] = useState<TypingPassage>(list[0]);
  const [typed, setTyped] = useState('');
  const [wrongs, setWrongs] = useState<Wrong[]>([]);
  /** Vị trí đã từng gõ sai ở lần đầu — dùng để tính độ chính xác cho trung thực. */
  const firstWrong = useRef<Set<number>>(new Set());
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState<number>(0);
  const [best, setBest] = useState<Record<string, Best>>({});
  const [showVi, setShowVi] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const target = passage.text;
  const done = typed.length >= target.length;

  useEffect(() => {
    setHydrated(true);
    try {
      const raw = localStorage.getItem(TYPING_KEY);
      if (raw) setBest(JSON.parse(raw));
    } catch {
      /* localStorage bị chặn — vẫn gõ được, chỉ không nhớ kỷ lục */
    }
  }, []);

  // Đổi chặng thì đổi luôn đoạn, nếu không đoạn của chặng cũ vẫn nằm lại.
  const [owner, setOwner] = useState(stageId);
  if (owner !== stageId) {
    setOwner(stageId);
    setPassage(list[0]);
    setTyped('');
    setWrongs([]);
    firstWrong.current = new Set();
    setStartedAt(null);
  }

  /** Đồng hồ chỉ chạy trong lúc đang gõ dở. */
  useEffect(() => {
    if (startedAt === null || done) return;
    const id = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, [startedAt, done]);

  const reset = useCallback(() => {
    setTyped('');
    setWrongs([]);
    firstWrong.current = new Set();
    setStartedAt(null);
    setNow(0);
    inputRef.current?.focus();
  }, []);

  const pick = useCallback((p: TypingPassage) => {
    setPassage(p);
    setTyped('');
    setWrongs([]);
    firstWrong.current = new Set();
    setStartedAt(null);
    setNow(0);
  }, []);

  const onChange = useCallback(
    (v: string) => {
      if (v.length > target.length) return;
      if (startedAt === null && v.length > 0) setStartedAt(Date.now());

      // Chỉ soát các ký tự VỪA thêm — gõ lùi (xoá) thì không ghi lỗi mới.
      if (v.length > typed.length) {
        const added: Wrong[] = [];
        for (let i = typed.length; i < v.length; i++) {
          if (v[i] !== target[i]) {
            if (!firstWrong.current.has(i)) firstWrong.current.add(i);
            added.push({ index: i, expected: target[i], typed: v[i] });
          }
        }
        if (added.length) setWrongs((w) => [...w, ...added].slice(-40));
      }
      setTyped(v);
    },
    [target, typed.length, startedAt],
  );

  const elapsedMs = startedAt === null ? 0 : (done ? (now || Date.now()) : now || Date.now()) - startedAt;
  const elapsedSec = Math.max(1, Math.round(elapsedMs / 1000));
  const wpm = startedAt === null ? 0 : Math.round((typed.length / 5) / (elapsedSec / 60));
  const accuracy =
    typed.length === 0 ? 100 : Math.max(0, Math.round(((typed.length - firstWrong.current.size) / typed.length) * 100));

  /** Ghi kỷ lục khi gõ xong. Chỉ ghi nếu tốt hơn lần trước. */
  useEffect(() => {
    if (!done || startedAt === null) return;
    setBest((prev) => {
      const cur = prev[passage.id];
      if (cur && cur.wpm >= wpm) return prev;
      const next = { ...prev, [passage.id]: { wpm, accuracy } };
      try {
        localStorage.setItem(TYPING_KEY, JSON.stringify(next));
      } catch {
        /* bỏ qua */
      }
      return next;
    });
    // Chốt đồng hồ tại thời điểm gõ xong.
    setNow(Date.now());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const record = hydrated ? best[passage.id] : undefined;

  return (
    <div>
      <p className="text-sm text-slate-400 leading-relaxed mb-4 rounded-xl border border-white/10 bg-white/[0.02] p-3">
        Bài thi IELTS trên máy tính bắt gõ toàn bộ phần Viết trong 60 phút — gõ mổ cò là mất vài phút và mất
        cả sức chú ý lẽ ra dành cho nội dung. Ngoài ra, gõ lại một câu ĐÚNG làm câu đó dính vào tay nhanh hơn
        đọc nó năm lần, nên mọi đoạn ở đây đều là câu mẫu dùng được thật, không phải văn bản ngẫu nhiên.
      </p>

      {/* Chọn đoạn */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
        {list.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => pick(p)}
            className={`shrink-0 px-3 py-2 rounded-xl border text-sm whitespace-nowrap transition-all active:scale-95 ${
              p.id === passage.id
                ? 'bg-sky-500/20 border-sky-400/40 text-white'
                : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            {p.title}
            {hydrated && best[p.id] && (
              <span className="ml-1.5 text-[10px] text-amber-300">{best[p.id].wpm}</span>
            )}
          </button>
        ))}
      </div>

      {/* Thông tin đoạn + chỉ số */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5 mb-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-white">{passage.title}</h3>
            <p className="text-slate-400 text-sm mt-1 leading-relaxed">{passage.why}</p>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-white/5 text-slate-300">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              {wpm} <span className="text-slate-500">wpm</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-white/5 text-slate-300">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              {accuracy}%
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-white/5 text-slate-300">
              <Timer className="w-3.5 h-3.5 text-sky-400" />
              {startedAt === null ? 0 : elapsedSec}s
            </span>
          </div>
        </div>

        {hydrated && record && (
          <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-amber-300">
            <Trophy className="w-3.5 h-3.5" />
            Kỷ lục của bạn: {record.wpm} wpm · {record.accuracy}% chính xác
          </p>
        )}

        {passage.watch && passage.watch.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-slate-500 mb-1.5">Từ hay gõ sai trong đoạn này</p>
            <div className="flex flex-wrap gap-1.5">
              {passage.watch.map((w) => (
                <span
                  key={w}
                  className="text-xs rounded-lg border border-amber-500/25 bg-amber-500/10 text-amber-200 px-2 py-1 font-mono"
                >
                  {w}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Đoạn văn — tô màu từng ký tự */}
      <div
        className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 mb-3 cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        <p className="font-mono text-[15px] leading-[1.9] break-words">
          {target.split('').map((ch, i) => {
            let cls = 'text-slate-500';
            if (i < typed.length) {
              cls = typed[i] === ch ? 'text-emerald-300' : 'text-rose-300 bg-rose-500/25 rounded-sm';
            } else if (i === typed.length) {
              cls = 'text-white bg-sky-500/40 rounded-sm';
            }
            // Khoảng trắng gõ sai phải nhìn thấy được, nên thay bằng ký tự gạch dưới.
            const show = ch === ' ' && i < typed.length && typed[i] !== ch ? '␣' : ch;
            return (
              <span key={i} className={cls}>
                {show}
              </span>
            );
          })}
        </p>
      </div>

      {/* Ô gõ */}
      <textarea
        ref={inputRef}
        value={typed}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        rows={3}
        placeholder="Bấm vào đây rồi gõ theo đoạn văn phía trên…"
        className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-sky-400/50 font-mono leading-relaxed resize-none"
      />

      <div className="flex items-center justify-between gap-3 mt-3 flex-wrap">
        <div className="h-2 rounded-full bg-white/10 overflow-hidden flex-1 min-w-[10rem]">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-200"
            style={{ width: `${(typed.length / target.length) * 100}%` }}
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowVi((v) => !v)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-colors"
          >
            {showVi ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            Sổ lỗi ({wrongs.length})
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Gõ lại
          </button>
        </div>
      </div>

      {/* Sổ lỗi */}
      {showVi && (
        <div className="mt-3 rounded-2xl border border-rose-500/25 bg-rose-500/[0.06] p-4">
          <p className="flex items-center gap-2 text-rose-300 text-sm font-semibold mb-2">
            <AlertTriangle className="w-4 h-4" />
            Sổ lỗi — những chỗ bạn gõ sai
          </p>
          {wrongs.length === 0 ? (
            <p className="text-slate-400 text-sm">Chưa có lỗi nào. Gõ tiếp đi.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {wrongs.map((w, i) => (
                <span
                  key={i}
                  className="text-xs rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 font-mono"
                >
                  <span className="text-slate-500">vị trí {w.index + 1}: </span>
                  <span className="text-rose-300">{w.typed === ' ' ? '␣' : w.typed}</span>
                  <span className="text-slate-600"> → </span>
                  <span className="text-emerald-300">{w.expected === ' ' ? '␣' : w.expected}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Kết quả */}
      {done && (
        <div className="mt-4 rounded-2xl border border-emerald-400/30 bg-emerald-500/[0.08] p-6 text-center">
          <p className="text-4xl mb-2">{accuracy >= 98 ? '🏆' : accuracy >= 92 ? '👍' : '💪'}</p>
          <p className="text-2xl font-bold text-white">
            {wpm} wpm · {accuracy}% chính xác
          </p>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed max-w-lg mx-auto">
            {accuracy >= 98
              ? 'Rất tốt. Tốc độ này gõ Writing trên máy thoải mái. Thử đoạn khó hơn.'
              : accuracy >= 92
                ? 'Khá ổn. Mở sổ lỗi xem bạn hay sai ở từ nào — thường chỉ vài từ lặp đi lặp lại.'
                : 'Còn sai nhiều. Gõ CHẬM lại và đúng, tốc độ tự lên sau. Gõ nhanh mà sai thì không luyện được gì.'}
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-sm hover:bg-white/10 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Gõ lại đoạn này
          </button>
        </div>
      )}

      <p className="mt-4 text-xs text-slate-500 leading-relaxed flex gap-2">
        <Keyboard className="w-3.5 h-3.5 shrink-0 mt-0.5" />
        <span>
          Độ chính xác tính theo lần gõ ĐẦU TIÊN ở mỗi vị trí — xoá đi gõ lại vẫn tính là sai, nếu không thì
          con số vô nghĩa. Gõ sai không làm kẹt bài: ký tự đỏ lên, ghi vào sổ lỗi, rồi bạn vẫn đi tiếp.
        </span>
      </p>
    </div>
  );
}
