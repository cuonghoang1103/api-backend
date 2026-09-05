'use client';

/**
 * Tab Học cùng AI — ba việc mà người tự học KHÔNG tự làm được.
 *
 * Vì sao chỉ có Viết, Nói và hỏi đáp: Nghe và Đọc trong khoá này đã có đáp án
 * kèm lời giải thích cho từng câu, người học TỰ CHẤM ĐƯỢC. Đưa AI vào đó chỉ
 * tốn tiền mà không thêm gì. Viết và Nói thì ngược lại — bạn không thể tự thấy
 * lỗi của mình, vì nếu thấy được thì đã không mắc.
 *
 * Nhật ký lỗi nằm ở đây chứ không tách thành tab riêng, vì nó chỉ có nghĩa khi
 * đứng ngay cạnh chỗ sinh ra nó: chấm xong là bấm lưu, không phải mở tab khác
 * rồi chép tay. Bài 12 của chặng 5 nói thẳng đây là công cụ quan trọng nhất
 * của chặng — mà cũng là thứ ít người làm nhất vì nó không giống "học".
 *
 * Nhật ký lưu ở localStorage, KHÔNG gửi lên máy chủ: nó là dữ liệu học tập
 * riêng, và giữ ở máy thì không cần đăng nhập cũng xem lại được.
 */
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Sparkles, PenLine, Mic, MessageCircleQuestion, Loader2, AlertTriangle,
  ClipboardList, Trash2, Save, Lock,
} from 'lucide-react';
import {
  ieltsAiApi, type IeltsWritingGrade, type IeltsSpeakingGrade, type IeltsFix,
} from '@/lib/api';
import type { StageBundle } from './data/bundles';

type Mode = 'writing' | 'speaking' | 'ask';

const LOG_KEY = 'ielts:ai:errorlog:v1';

interface LogEntry {
  at: number;
  kind: 'Viết' | 'Nói';
  wrong: string;
  right: string;
  why: string;
}

function readLog(): LogEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(LOG_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as LogEntry[]) : [];
  } catch {
    return [];
  }
}

function writeLog(entries: LogEntry[]): void {
  try {
    window.localStorage.setItem(LOG_KEY, JSON.stringify(entries.slice(-200)));
  } catch {
    /* hết chỗ hoặc bị chặn — không phải lỗi đáng chặn luồng học */
  }
}

/** Lấy thông điệp lỗi mà backend gửi kèm, thay vì hiện "Request failed". */
function errText(e: unknown): string {
  const r = e as { response?: { data?: { message?: string; error?: string } }; message?: string };
  return r?.response?.data?.message || r?.response?.data?.error || r?.message || 'Có lỗi xảy ra, thử lại nhé.';
}

/* ─────────────────── mảnh dùng lại ─────────────────── */

function BandRow({ label, sub, band }: { label: string; sub: string; band: string }) {
  const n = Number(band);
  const cls = !Number.isFinite(n)
    ? 'bg-white/5 text-slate-400'
    : n >= 8
      ? 'bg-emerald-500/20 text-emerald-300'
      : n >= 7
        ? 'bg-sky-500/20 text-sky-300'
        : n >= 6
          ? 'bg-amber-500/20 text-amber-300'
          : 'bg-rose-500/20 text-rose-300';
  return (
    <div className="flex items-center gap-3">
      <span className={`shrink-0 w-12 h-8 rounded-lg grid place-items-center text-sm font-bold tabular-nums ${cls}`}>
        {band}
      </span>
      <span className="min-w-0">
        <span className="block text-white text-sm font-semibold truncate">{label}</span>
        <span className="block text-slate-500 text-xs">{sub}</span>
      </span>
    </div>
  );
}

function FixList({
  fixes, kind, onSave, saved,
}: {
  fixes: IeltsFix[];
  kind: 'Viết' | 'Nói';
  onSave: (fixes: IeltsFix[], kind: 'Viết' | 'Nói') => void;
  saved: boolean;
}) {
  if (fixes.length === 0) {
    return (
      <p className="text-sm text-emerald-300 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.06] p-3">
        Không tìm thấy lỗi cụ thể nào đáng nêu. Ở mức này, thứ chặn bạn không còn là lỗi ngữ pháp —
        đọc kỹ phần nhận xét từng tiêu chí ở trên.
      </p>
    );
  }
  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-2">
        <p className="text-white text-sm font-semibold">Lỗi cụ thể ({fixes.length})</p>
        <button
          type="button"
          onClick={() => onSave(fixes, kind)}
          disabled={saved}
          className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-slate-300 hover:text-white disabled:opacity-50 transition-colors"
        >
          <Save className="w-3.5 h-3.5" />
          {saved ? 'Đã lưu vào nhật ký' : 'Lưu vào nhật ký lỗi'}
        </button>
      </div>
      <div className="space-y-2">
        {fixes.map((f, i) => (
          <div key={i} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <p className="text-rose-300 text-sm leading-relaxed break-words">✗ {f.wrong}</p>
            <p className="text-emerald-300 text-sm leading-relaxed mt-1 break-words">✓ {f.right}</p>
            {f.why && <p className="text-slate-400 text-xs leading-relaxed mt-1.5">{f.why}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────── view ─────────────────── */

export default function AiCoachView({ d }: { d: StageBundle }) {
  const [mode, setMode] = useState<Mode>('writing');
  const [status, setStatus] = useState<{ available: boolean; isPro: boolean } | null>(null);
  const [statusFailed, setStatusFailed] = useState(false);

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  // Viết
  const [wTask, setWTask] = useState('Task 2');
  const [wPrompt, setWPrompt] = useState('');
  const [wEssay, setWEssay] = useState('');
  const [wRes, setWRes] = useState<IeltsWritingGrade | null>(null);

  // Nói
  const [sPart, setSPart] = useState('Part 3');
  const [sQuestion, setSQuestion] = useState('');
  const [sAnswer, setSAnswer] = useState('');
  const [sRes, setSRes] = useState<IeltsSpeakingGrade | null>(null);

  // Hỏi gia sư
  const [q, setQ] = useState('');
  const [qRes, setQRes] = useState('');

  // Nhật ký lỗi
  const [log, setLog] = useState<LogEntry[]>([]);
  const [savedTick, setSavedTick] = useState(0);

  useEffect(() => { setLog(readLog()); }, []);

  useEffect(() => {
    let alive = true;
    ieltsAiApi.status()
      .then((r) => { if (alive) setStatus(r.data.data); })
      .catch(() => { if (alive) setStatusFailed(true); });
    return () => { alive = false; };
  }, []);

  const wordCount = useMemo(() => wEssay.trim().split(/\s+/).filter(Boolean).length, [wEssay]);

  const saveFixes = (fixes: IeltsFix[], kind: 'Viết' | 'Nói') => {
    const add: LogEntry[] = fixes.map((f) => ({ at: Date.now(), kind, ...f }));
    const next = [...readLog(), ...add];
    writeLog(next);
    setLog(next);
    setSavedTick((n) => n + 1);
  };

  const clearLog = () => {
    if (!window.confirm('Xoá toàn bộ nhật ký lỗi? Không khôi phục lại được.')) return;
    writeLog([]);
    setLog([]);
  };

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setErr('');
    try {
      await fn();
    } catch (e) {
      setErr(errText(e));
    } finally {
      setBusy(false);
    }
  };

  const gradeWriting = () => run(async () => {
    setWRes(null);
    setSavedTick(0);   // kết quả mới ⇒ nút "Lưu vào nhật ký" phải bấm được lại
    const r = await ieltsAiApi.gradeWriting({ task: wTask, prompt: wPrompt, essay: wEssay });
    setWRes(r.data.data);
  });

  const gradeSpeaking = () => run(async () => {
    setSRes(null);
    setSavedTick(0);
    const r = await ieltsAiApi.gradeSpeaking({ part: sPart, question: sQuestion, answer: sAnswer });
    setSRes(r.data.data);
  });

  const ask = () => run(async () => {
    setQRes('');
    const r = await ieltsAiApi.ask(q, `${d.label} — ${d.band}`);
    setQRes(r.data.data.answer);
  });

  /* ── chặn sớm: chưa đăng nhập / chưa Pro / AI tắt ── */

  const gate = (() => {
    if (statusFailed) {
      return {
        icon: Lock,
        title: 'Cần đăng nhập để dùng trợ lý AI',
        body: 'Phần chấm bài và hỏi gia sư yêu cầu tài khoản. Mọi nội dung học còn lại của khoá vẫn dùng được bình thường mà không cần đăng nhập.',
        cta: { href: '/login', label: 'Đăng nhập' },
      };
    }
    if (status && !status.available) {
      return {
        icon: AlertTriangle,
        title: 'Trợ lý AI đang tạm ngắt',
        body: 'Máy chủ chưa cấu hình được khoá AI hoặc đang tạm ngắt để bảo vệ chi phí. Quay lại sau nhé — phần nội dung học không bị ảnh hưởng.',
        cta: null,
      };
    }
    if (status && !status.isPro) {
      return {
        icon: Lock,
        title: 'Chấm bài bằng AI dành cho tài khoản Pro',
        body: 'Chấm một bài Task 2 là lượt gọi AI nặng nhất trên web này, nên phần đó giới hạn cho tài khoản Pro. Toàn bộ 5 chặng bài học, từ vựng, bài đọc, bài nghe và tra cứu vẫn miễn phí.',
        cta: { href: '/pro', label: 'Xem gói Pro' },
      };
    }
    return null;
  })();

  const MODES: { id: Mode; label: string; icon: typeof PenLine }[] = [
    { id: 'writing', label: 'Chấm bài viết', icon: PenLine },
    { id: 'speaking', label: 'Chấm câu trả lời nói', icon: Mic },
    { id: 'ask', label: 'Hỏi gia sư', icon: MessageCircleQuestion },
  ];

  const SUGGESTED = [
    'Vì sao bài viết của tôi mãi 6.5 dù không sai ngữ pháp?',
    'Khác nhau thật giữa band 7 và band 8 ở tiêu chí Ngữ pháp là gì?',
    'Task 1 nên viết overview thế nào cho đúng?',
    'Làm sao để chỗ ngập ngừng khi nói không bị trừ điểm?',
  ];

  return (
    <div>
      <p className="text-sm text-slate-400 leading-relaxed mb-4 rounded-xl border border-sky-500/25 bg-sky-500/[0.06] p-3">
        Ba việc người tự học <b className="text-slate-200">không tự làm được</b>: chấm bài viết, chấm câu trả lời
        nói, và hỏi cho ra nhẽ. Nghe và Đọc thì khoá này đã có đáp án kèm lời giải cho từng câu nên bạn tự chấm
        được — đưa AI vào đó chỉ tốn tiền.
      </p>

      <div className="mb-4 rounded-xl border border-amber-500/25 bg-amber-500/[0.06] p-3">
        <p className="flex items-center gap-2 text-amber-300 text-sm font-semibold mb-1.5">
          <AlertTriangle className="w-4 h-4" />
          Đọc trước khi tin điểm số
        </p>
        <p className="text-slate-300 text-sm leading-relaxed">
          AI bắt lỗi <b className="text-white">bề mặt</b> rất tốt: ngữ pháp, từ vựng, kết hợp từ. Điểm mù của nó là
          phát hiện bài <b className="text-white">trả lời SAI ĐỀ</b> — mà đó lại đúng là thứ chặn band 7 lên 8. Band
          nó đưa ra là <b className="text-white">ước lượng để theo dõi xu hướng</b>, không phải điểm thi. Ở chặng
          7.5+, vẫn phải có người thật chấm ít nhất vài bài.
        </p>
      </div>

      {/* Chọn việc */}
      <div className="flex gap-2 flex-wrap mb-5">
        {MODES.map((m) => {
          const Icon = m.icon;
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => { setMode(m.id); setErr(''); }}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm transition-all active:scale-95 ${
                active
                  ? 'bg-sky-500/20 border-sky-400/45 text-white'
                  : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {m.label}
            </button>
          );
        })}
      </div>

      {gate ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center">
          <gate.icon className="w-8 h-8 text-slate-500 mx-auto mb-3" />
          <p className="text-white font-semibold">{gate.title}</p>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed max-w-xl mx-auto">{gate.body}</p>
          {gate.cta && (
            <Link
              href={gate.cta.href}
              className="inline-block mt-4 px-4 py-2 rounded-xl bg-sky-500/20 border border-sky-400/45 text-white text-sm hover:bg-sky-500/30 transition-colors"
            >
              {gate.cta.label}
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* ─────────── CHẤM BÀI VIẾT ─────────── */}
          {mode === 'writing' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
                <div className="flex gap-2 flex-wrap">
                  {['Task 1', 'Task 2'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setWTask(t)}
                      className={`px-3 py-1.5 rounded-lg text-xs border transition-all active:scale-95 ${
                        wTask === t
                          ? 'bg-sky-500/20 border-sky-400/45 text-white'
                          : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs text-slate-500 mb-1.5">
                    Đề bài — dán đề vào đây, hoặc chọn một đề có sẵn của {d.label}
                  </label>
                  {d.writings.length > 0 && (
                    <div className="flex gap-2 flex-wrap mb-2">
                      {d.writings.map((w) => (
                        <button
                          key={w.id}
                          type="button"
                          onClick={() => { setWPrompt(w.prompt); setWTask(w.task.startsWith('Task 1') ? 'Task 1' : 'Task 2'); }}
                          className="text-xs px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-slate-400 hover:text-white transition-colors"
                        >
                          {w.title}
                        </button>
                      ))}
                    </div>
                  )}
                  <textarea
                    value={wPrompt}
                    onChange={(e) => setWPrompt(e.target.value)}
                    rows={3}
                    placeholder="Ví dụ: Some people think universities should only offer subjects useful in the future…"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-sky-400/50 resize-y"
                  />
                  <p className="text-xs text-slate-600 mt-1">
                    Thiếu đề thì AI không chấm được tiêu chí Task Response — ba tiêu chí kia vẫn chấm bình thường.
                  </p>
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                    <span>Bài viết của bạn (tiếng Anh)</span>
                    <span className={wordCount < (wTask === 'Task 1' ? 150 : 250) ? 'text-amber-400' : 'text-emerald-400'}>
                      {wordCount} từ · tối thiểu {wTask === 'Task 1' ? 150 : 250}
                    </span>
                  </label>
                  <textarea
                    value={wEssay}
                    onChange={(e) => setWEssay(e.target.value)}
                    rows={12}
                    placeholder="Dán nguyên bài viết của bạn vào đây. Đừng sửa trước khi dán — bản chưa sửa mới cho biết bạn đang sai ở đâu."
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-sky-400/50 resize-y leading-relaxed"
                  />
                </div>

                <button
                  type="button"
                  onClick={gradeWriting}
                  disabled={busy || wEssay.trim().length < 80}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500/20 border border-sky-400/45 text-white text-sm hover:bg-sky-500/30 disabled:opacity-40 transition-colors"
                >
                  {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {busy ? 'Đang chấm… (30–60 giây)' : 'Chấm bài'}
                </button>
              </div>

              {wRes && (
                <div className="rounded-2xl border border-sky-500/25 bg-sky-500/[0.04] p-4 space-y-4">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-3xl font-bold text-white tabular-nums">{wRes.overall}</span>
                    <span className="text-slate-400 text-sm">ước lượng band · {wRes.wordCount} từ</span>
                    <span className="text-slate-400 text-sm">· câu không lỗi: <b className="text-white">{wRes.cleanSentences}</b></span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {wRes.criteria.map((c) => (
                      <div key={c.name} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                        <BandRow label={c.name} sub={c.nameVi} band={c.band} />
                        <p className="text-slate-300 text-sm mt-2.5 leading-relaxed">{c.comment}</p>
                      </div>
                    ))}
                  </div>

                  <FixList fixes={wRes.fixes} kind="Viết" onSave={saveFixes} saved={savedTick > 0} />

                  <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.06] p-3">
                    <p className="text-emerald-300 text-sm font-semibold mb-1">Việc cần làm tiếp</p>
                    <p className="text-slate-300 text-sm leading-relaxed">{wRes.nextStep}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─────────── CHẤM CÂU TRẢ LỜI NÓI ─────────── */}
          {mode === 'speaking' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
                <div className="flex gap-2 flex-wrap">
                  {['Part 1', 'Part 2', 'Part 3'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setSPart(p)}
                      className={`px-3 py-1.5 rounded-lg text-xs border transition-all active:scale-95 ${
                        sPart === p
                          ? 'bg-sky-500/20 border-sky-400/45 text-white'
                          : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs text-slate-500 mb-1.5">
                    Câu hỏi — chọn một câu của {d.label} hoặc tự gõ
                  </label>
                  <div className="flex gap-2 flex-wrap mb-2">
                    {d.speakings.flatMap((t) => t.questions.slice(0, 3).map((qq) => ({ part: t.part, q: qq.q }))).map((item, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => { setSQuestion(item.q); setSPart(item.part); }}
                        className="text-xs px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-slate-400 hover:text-white transition-colors max-w-full truncate"
                      >
                        {item.q}
                      </button>
                    ))}
                  </div>
                  <input
                    value={sQuestion}
                    onChange={(e) => setSQuestion(e.target.value)}
                    placeholder="Do you think exam results are a good way to judge a student?"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-sky-400/50"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-500 mb-1.5">Câu trả lời của bạn — gõ lại đúng những gì bạn đã nói</label>
                  <textarea
                    value={sAnswer}
                    onChange={(e) => setSAnswer(e.target.value)}
                    rows={8}
                    placeholder="Thu âm rồi gõ lại nguyên văn, kể cả chỗ lặp và chỗ nói vấp. Gõ bản đã 'dọn sạch' thì kết quả chấm không phản ánh điều bạn thật sự nói."
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-sky-400/50 resize-y leading-relaxed"
                  />
                  <p className="text-xs text-slate-600 mt-1">
                    Đây là bản ghi bằng chữ nên <b className="text-slate-400">không chấm được Pronunciation</b> — tiêu chí đó phải tự nghe lại bản thu.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={gradeSpeaking}
                  disabled={busy || sAnswer.trim().length < 40}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500/20 border border-sky-400/45 text-white text-sm hover:bg-sky-500/30 disabled:opacity-40 transition-colors"
                >
                  {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {busy ? 'Đang chấm…' : 'Chấm câu trả lời'}
                </button>
              </div>

              {sRes && (
                <div className="rounded-2xl border border-sky-500/25 bg-sky-500/[0.04] p-4 space-y-4">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-3xl font-bold text-white tabular-nums">{sRes.overall}</span>
                    <span className="text-slate-400 text-sm">ước lượng band trên 3 tiêu chí (không gồm Pronunciation)</span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {sRes.criteria.map((c) => (
                      <div key={c.name} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                        <BandRow label={c.name} sub={c.nameVi} band={c.band} />
                        <p className="text-slate-300 text-sm mt-2.5 leading-relaxed">{c.comment}</p>
                      </div>
                    ))}
                  </div>

                  <FixList fixes={sRes.fixes} kind="Nói" onSave={saveFixes} saved={savedTick > 0} />

                  <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.06] p-3">
                    <p className="text-emerald-300 text-sm font-semibold mb-1.5">Bản nâng cấp cùng ý — để ĐỐI CHIẾU, không để học thuộc</p>
                    <p className="text-slate-200 text-sm leading-relaxed">{sRes.better}</p>
                    <p className="text-slate-400 text-sm leading-relaxed mt-2.5 pt-2.5 border-t border-white/10">{sRes.why}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─────────── HỎI GIA SƯ ─────────── */}
          {mode === 'ask' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
                <div className="flex gap-2 flex-wrap">
                  {SUGGESTED.map((sq) => (
                    <button
                      key={sq}
                      type="button"
                      onClick={() => setQ(sq)}
                      className="text-xs px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-slate-400 hover:text-white transition-colors"
                    >
                      {sq}
                    </button>
                  ))}
                </div>
                <textarea
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  rows={3}
                  placeholder="Hỏi bất cứ điều gì về kỳ thi hoặc về nội dung khoá học…"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-sky-400/50 resize-y"
                />
                <button
                  type="button"
                  onClick={ask}
                  disabled={busy || q.trim().length < 5}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500/20 border border-sky-400/45 text-white text-sm hover:bg-sky-500/30 disabled:opacity-40 transition-colors"
                >
                  {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {busy ? 'Đang trả lời…' : 'Hỏi'}
                </button>
              </div>

              {qRes && (
                <div className="rounded-2xl border border-sky-500/25 bg-sky-500/[0.04] p-4">
                  <div className="text-slate-200 text-sm leading-relaxed space-y-3 [&_strong]:text-white [&_code]:text-sky-300 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mt-1">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{qRes}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          )}

          {err && (
            <p className="mt-4 text-sm text-rose-300 rounded-xl border border-rose-500/25 bg-rose-500/[0.06] p-3">
              {err}
            </p>
          )}
        </>
      )}

      {/* ─────────── NHẬT KÝ LỖI ─────────── */}
      <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
        <div className="flex items-center justify-between gap-3 mb-2">
          <p className="flex items-center gap-2 text-white text-sm font-semibold">
            <ClipboardList className="w-4 h-4 text-sky-400" />
            Nhật ký lỗi ({log.length})
          </p>
          {log.length > 0 && (
            <button
              type="button"
              onClick={clearLog}
              className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-slate-400 hover:text-rose-300 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Xoá hết
            </button>
          )}
        </div>
        <p className="text-slate-400 text-sm leading-relaxed">
          Lỗi của bạn <b className="text-slate-200">không ngẫu nhiên</b>: một người viết ở 7.5 thường chỉ có 5–8 loại
          lỗi lặp, và ba loại đầu chiếm quá nửa. Chấm xong bấm <b className="text-slate-200">Lưu vào nhật ký lỗi</b>,
          rồi đọc lại danh sách này TRƯỚC mỗi lần viết bài mới. Nhật ký lưu ở máy bạn, không gửi lên máy chủ.
        </p>
        {log.length > 0 && (
          <div className="mt-3 space-y-2 max-h-80 overflow-y-auto pr-1">
            {[...log].reverse().map((e, i) => (
              <div key={`${e.at}-${i}`} className="rounded-xl border border-white/10 bg-white/[0.02] p-2.5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-500">{e.kind}</span>
                  <span className="text-[10px] text-slate-600">
                    {new Date(e.at).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <p className="text-rose-300 text-sm leading-relaxed break-words">✗ {e.wrong}</p>
                <p className="text-emerald-300 text-sm leading-relaxed break-words">✓ {e.right}</p>
                {e.why && <p className="text-slate-500 text-xs leading-relaxed mt-1">{e.why}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
