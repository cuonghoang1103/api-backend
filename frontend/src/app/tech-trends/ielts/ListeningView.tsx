'use client';

/**
 * Tab Nghe — 6 bài tự soạn (trình duyệt đọc transcript) + nguồn ngoài đã kiểm.
 *
 * Cách phát: đọc TỪNG DÒNG bằng speechSynthesis, dòng này xong mới sang dòng
 * kia. Không nối cả bài thành một chuỗi dài vì hai lý do: Chrome cắt ngang khi
 * chuỗi quá dài, và người học cần dừng đúng giữa hai lượt thoại để chép kịp.
 *
 * Transcript ẨN cho tới khi bấm chấm bài. Nhìn chữ mà bảo là luyện nghe thì
 * chỉ đang luyện đọc.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Play, Square, Check, X, RotateCcw, Lightbulb, Headphones, Youtube, Gauge, Eye, EyeOff,
} from 'lucide-react';
import type { StageBundle } from './data/bundles';
import FigureView from './FigureView';
import { isCorrect } from './check';

/** Tốc độ đọc — chặng 1 mặc định chậm hơn tốc độ thi thật. */
const RATES = [
  { label: 'Chậm', value: 0.7 },
  { label: 'Vừa', value: 0.85 },
  { label: 'Như thi', value: 1 },
];

export default function ListeningView({ d, supported }: { d: StageBundle; supported: boolean }) {
  const LISTENINGS = d.listenings;
  const LISTENING_SOURCES = d.sources;
  const [id, setId] = useState(LISTENINGS[0].id);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [graded, setGraded] = useState(false);
  const [rate, setRate] = useState(0.7);
  const [playing, setPlaying] = useState(false);
  const [lineIdx, setLineIdx] = useState(-1);
  const [showScript, setShowScript] = useState(false);

  /** Chặn callback của lượt phát cũ khi người dùng đã bấm Dừng hoặc đổi bài. */
  const runId = useRef(0);

  const ex = LISTENINGS.find((l) => l.id === id) ?? LISTENINGS[0];

  const stop = useCallback(() => {
    runId.current += 1;
    try {
      window.speechSynthesis?.cancel();
    } catch {
      /* bỏ qua */
    }
    setPlaying(false);
    setLineIdx(-1);
  }, []);

  // Rời tab hoặc rời trang mà còn đang đọc thì tiếng vẫn chạy — phải dọn.
  useEffect(() => stop, [stop]);

  const reset = useCallback(() => {
    stop();
    setAnswers({});
    setGraded(false);
    setShowScript(false);
  }, [stop]);

  /**
   * Đọc lần lượt từng dòng. Dùng đệ quy qua onend thay vì đẩy cả mảng vào hàng
   * đợi: cách này biết được đang ở dòng nào để tô sáng, và dừng được giữa chừng.
   */
  const play = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;
    synth.cancel();

    runId.current += 1;
    const myRun = runId.current;
    setPlaying(true);

    const voices = synth.getVoices();
    const enVoice = voices.find((v) => v.lang === 'en-US') || voices.find((v) => v.lang?.startsWith('en'));

    const speakLine = (i: number): void => {
      if (myRun !== runId.current) return;
      if (i >= ex.lines.length) {
        setPlaying(false);
        setLineIdx(-1);
        return;
      }
      setLineIdx(i);
      const u = new SpeechSynthesisUtterance(ex.lines[i].text);
      if (enVoice) {
        u.voice = enVoice;
        u.lang = enVoice.lang || 'en-US';
      } else {
        u.lang = 'en-US';
      }
      u.rate = rate;
      u.onend = () => {
        if (myRun !== runId.current) return;
        // Nghỉ ngắn giữa hai lượt thoại để người học kịp chép.
        setTimeout(() => speakLine(i + 1), 350);
      };
      u.onerror = () => {
        if (myRun !== runId.current) return;
        setPlaying(false);
        setLineIdx(-1);
      };
      synth.speak(u);
    };

    speakLine(0);
  }, [ex.lines, rate]);

  const correctCount = ex.questions.filter((q, i) => isCorrect(answers[i] ?? '', q.answer, q.alt)).length;


  // Đổi chặng thì về mục đầu — id của chặng cũ không tồn tại ở chặng mới.
  const [owner, setOwner] = useState(d.id);
  if (owner !== d.id) {
    setOwner(d.id);
    setId(LISTENINGS[0].id); setAnswers({}); setGraded(false); setShowScript(false);
  }

  return (
    <div>
      {/* Chọn bài */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
        {LISTENINGS.map((l, i) => (
          <button
            key={l.id}
            type="button"
            onClick={() => { setId(l.id); reset(); }}
            className={`shrink-0 px-3 py-2 rounded-xl border text-sm whitespace-nowrap transition-all active:scale-95 ${
              l.id === id
                ? 'bg-sky-500/20 border-sky-400/40 text-white'
                : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            Bài {i + 1} · {l.titleVi}
          </button>
        ))}
      </div>

      {!supported && (
        <p className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200 leading-relaxed">
          Trình duyệt này không có giọng đọc tiếng Anh nên phần phát tiếng sẽ không chạy. Bạn vẫn xem được
          transcript và làm được câu hỏi. Thử mở bằng Chrome hoặc Safari bản mới.
        </p>
      )}

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5 mb-4">
        <h3 className="text-xl font-bold text-white">{ex.title}</h3>
        <p className="text-slate-400 text-sm mt-0.5">{ex.titleVi}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
          <span>{ex.kind}</span>
          <span>{ex.level}</span>
          <span>{ex.questions.length} câu</span>
        </div>
        <p className="mt-3 text-slate-300 text-sm leading-relaxed rounded-xl border border-white/10 bg-white/[0.03] p-3">
          {ex.context}
        </p>

        {/* Bản đồ cho dạng Map Labelling — nghe mà không có hình thì không luyện được dạng này */}
        {ex.figure && (
          <div className="mt-4">
            <FigureView figure={ex.figure} />
          </div>
        )}

        {/* Điều khiển phát */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={playing ? stop : play}
            disabled={!supported}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border transition-colors ${
              !supported
                ? 'bg-white/[0.02] border-white/5 text-slate-600 cursor-not-allowed'
                : playing
                  ? 'bg-rose-500/20 border-rose-400/40 text-rose-200 hover:bg-rose-500/30'
                  : 'bg-emerald-500/20 border-emerald-400/40 text-emerald-200 hover:bg-emerald-500/30'
            }`}
          >
            {playing ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {playing ? 'Dừng' : 'Phát bài nghe'}
          </button>

          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
            <Gauge className="w-3.5 h-3.5" />
            Tốc độ
          </span>
          {RATES.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => { setRate(r.value); if (playing) stop(); }}
              className={`px-2.5 py-1.5 rounded-lg text-xs border transition-all active:scale-95 ${
                rate === r.value
                  ? 'bg-sky-500/20 border-sky-400/40 text-white'
                  : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {r.label}
            </button>
          ))}

          {playing && lineIdx >= 0 && (
            <span className="text-xs text-slate-500">
              Đang đọc dòng {lineIdx + 1}/{ex.lines.length}
            </span>
          )}
        </div>

        {/* Từ khoá cần bắt */}
        <div className="mt-4">
          <p className="text-xs text-slate-500 mb-1.5">Nghe kỹ những chỗ này</p>
          <div className="flex flex-wrap gap-2">
            {ex.listenFor.map((k, i) => (
              <span key={i} className="text-xs rounded-lg border border-violet-500/25 bg-violet-500/10 text-violet-200 px-2.5 py-1">
                {k}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Câu hỏi */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="flex items-center gap-2 text-sm font-semibold text-white">
              <Headphones className="w-4 h-4 text-sky-400" />
              Điền đáp án
            </p>
            {graded && (
              <span
                className={`text-sm px-3 py-1 rounded-lg ${
                  correctCount >= ex.questions.length * 0.75
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-amber-500/20 text-amber-300'
                }`}
              >
                Đúng {correctCount}/{ex.questions.length}
              </span>
            )}
          </div>

          <div className="space-y-2.5">
            {ex.questions.map((q, i) => {
              const given = answers[i] ?? '';
              const ok = isCorrect(given, q.answer, q.alt);
              return (
                <div
                  key={i}
                  className={`rounded-xl border p-3 transition-colors ${
                    graded
                      ? ok
                        ? 'border-emerald-400/30 bg-emerald-500/[0.07]'
                        : 'border-rose-400/30 bg-rose-500/[0.07]'
                      : 'border-white/10 bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="shrink-0 text-xs font-bold text-sky-400 bg-sky-500/15 px-1.5 py-0.5 rounded">
                      {i + 1}
                    </span>
                    <p className="flex-1 text-slate-200 text-sm leading-relaxed">{q.q}</p>
                    {graded && (ok
                      ? <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      : <X className="w-4 h-4 text-rose-400 shrink-0" />)}
                  </div>
                  <input
                    type="text"
                    value={given}
                    disabled={graded}
                    onChange={(e) => setAnswers((a) => ({ ...a, [i]: e.target.value }))}
                    placeholder="Nghe rồi gõ vào đây…"
                    className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none focus:border-sky-400/50 disabled:text-slate-400"
                  />
                  {graded && (
                    <div className="mt-2 pt-2 border-t border-white/10">
                      <p className="text-xs text-emerald-300">
                        Đáp án: <b>{q.answer}</b>
                        {q.alt && q.alt.length > 0 && (
                          <span className="text-slate-500"> (chấp nhận: {q.alt.join(', ')})</span>
                        )}
                      </p>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{q.why}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4">
            {!graded ? (
              <button
                type="button"
                onClick={() => { setGraded(true); stop(); }}
                className="w-full px-4 py-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-white text-sm hover:bg-emerald-500/30 transition-colors"
              >
                Chấm bài
              </button>
            ) : (
              <button
                type="button"
                onClick={reset}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-sm hover:bg-white/10 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Nghe lại từ đầu
              </button>
            )}
          </div>
        </div>

        {/* Transcript + mẹo */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <p className="text-sm font-semibold text-white">Transcript</p>
              <button
                type="button"
                disabled={!graded}
                onClick={() => setShowScript((v) => !v)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border transition-colors ${
                  graded
                    ? 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                    : 'bg-white/[0.02] border-white/5 text-slate-600 cursor-not-allowed'
                }`}
              >
                {showScript ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {graded ? (showScript ? 'Ẩn' : 'Hiện') : 'Mở sau khi chấm'}
              </button>
            </div>

            {graded && showScript ? (
              <div className="space-y-2">
                {ex.lines.map((l, i) => (
                  <div
                    key={i}
                    className={`rounded-lg px-3 py-2 transition-colors ${
                      lineIdx === i ? 'bg-violet-500/20' : 'bg-white/[0.03]'
                    }`}
                  >
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide">{l.who}</p>
                    <p className="text-slate-200 text-sm leading-relaxed">{l.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 leading-relaxed">
                {graded
                  ? 'Bấm "Hiện" để đối chiếu. Chép chính tả xong mới mở transcript mới có tác dụng — xem bài 38 ở tab Bài học.'
                  : 'Transcript mở sau khi bạn chấm bài. Nhìn chữ trong lúc nghe thì đang luyện đọc chứ không phải luyện nghe.'}
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-amber-500/25 bg-amber-500/[0.06] p-4">
            <p className="flex items-center gap-2 text-amber-300 text-sm font-semibold mb-2">
              <Lightbulb className="w-4 h-4" />
              Mẹo cho bài này
            </p>
            <ul className="space-y-2">
              {ex.tips.map((t, i) => (
                <li key={i} className="text-slate-200 text-sm leading-relaxed flex gap-2">
                  <span className="text-amber-400 shrink-0">→</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Nguồn nghe ngoài ── */}
      <div className="mt-8">
        <h3 className="flex items-center gap-2 text-lg font-bold text-white mb-1">
          <Youtube className="w-5 h-5 text-rose-400" />
          Nguồn nghe uy tín ({LISTENING_SOURCES.length})
        </h3>
        <p className="text-sm text-slate-400 mb-4 leading-relaxed">
          Toàn bộ là kênh CHÍNH CHỦ của BBC Learning English, British Council và VOA — đã kiểm từng link
          trước khi đưa lên. Dùng để nghe thêm mỗi ngày; phần bài tập có chấm điểm thì dùng 6 bài ở trên.
        </p>
        <div className="grid gap-4 lg:grid-cols-2">
          {LISTENING_SOURCES.map((s) => (
            <div key={s.ytId} className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
              <div className="aspect-video bg-black">
                <iframe
                  src={
                    s.kind === 'playlist'
                      ? `https://www.youtube-nocookie.com/embed/videoseries?list=${s.ytId}`
                      : `https://www.youtube-nocookie.com/embed/${s.ytId}`
                  }
                  title={s.name}
                  loading="lazy"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
              <div className="p-4">
                <p className="font-semibold text-white text-sm">{s.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {s.channel} · {s.kind === 'playlist' ? 'Playlist' : 'Video'}
                </p>
                <span className="inline-block mt-2 text-[11px] rounded-lg border border-sky-500/25 bg-sky-500/10 text-sky-200 px-2 py-1">
                  {s.level}
                </span>
                <p className="text-slate-300 text-sm mt-2.5 leading-relaxed">{s.how}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
