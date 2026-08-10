'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Volume2,
  Play,
  Square,
  Mic,
  Timer,
  Gauge,
  Eye,
  EyeOff,
  AlertTriangle,
  BookOpen,
  Scissors,
} from 'lucide-react';

import { useJaSpeech } from './useJaSpeech';
import {
  READ_PIECES,
  CHUNK_RULES,
  READALOUD_STORAGE_KEY,
  pieceFullText,
  pieceChunkCount,
  type ReadPiece,
} from './data/readaloud';

/**
 * KHU ĐỌC TO.
 *
 * Chữa ba lỗi bị nêu đích danh ở bài thi đọc: ngắt không trôi chảy, chữ Hán không
 * thuộc, đọc rời từng chữ. Cách chữa là kỹ thuật chứ không phải chăm hơn:
 *
 *  - Bài được cắt sẵn thành CỤM. Mỗi cụm bấm nghe riêng được, nên luyện được theo
 *    lối "nghe một cụm → nhại ngay cụm đó" (shadowing) thay vì đọc mò cả bài.
 *  - Mỗi cụm có kana đầy đủ ⇒ không còn chữ Hán nào là chỗ đứng hình.
 *  - Ba mức độ trợ giúp tắt dần được: kana → romaji → nghĩa. Lượt cuối tắt hết,
 *    đó mới là điều kiện phòng thi.
 *
 * Bấm giờ và ghi âm nằm ngay trong khu này vì "ghi âm rồi nghe lại" là việc bắt
 * buộc: lúc đang đọc thì không ai tự nghe ra mình đang đọc rời từng chữ.
 */

const SPEEDS = [0.6, 0.8, 1] as const;

const LEVEL_META: Record<ReadPiece['level'], { label: string; color: string }> = {
  easy: { label: 'DỄ', color: '#4ade80' },
  medium: { label: 'VỪA', color: '#fb923c' },
  hard: { label: 'KHÓ', color: '#f43f5e' },
};

export default function ReadAloudPanel() {
  const { speak, stop, speaking, voiceReady, supported } = useJaSpeech();

  const [pieceN, setPieceN] = useState(READ_PIECES[0].n);
  const [rate, setRate] = useState<number>(0.8);
  const [showKana, setShowKana] = useState(true);
  const [showRomaji, setShowRomaji] = useState(false);
  const [showVi, setShowVi] = useState(true);
  const [activeChunk, setActiveChunk] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Bấm giờ
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [best, setBest] = useState<Record<number, number>>({});

  // Ghi âm
  const [recording, setRecording] = useState(false);
  const [recUrl, setRecUrl] = useState<string | null>(null);
  const [recError, setRecError] = useState<string | null>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const piece = READ_PIECES.find((p) => p.n === pieceN) ?? READ_PIECES[0];

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(READALOUD_STORAGE_KEY);
      if (raw) setBest(JSON.parse(raw));
    } catch {
      /* dữ liệu hỏng — coi như chưa có kỷ lục */
    }
  }, []);

  /* ── Bấm giờ ──────────────────────────────────────────────── */
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setElapsed((e) => e + 0.1), 100);
    return () => clearInterval(t);
  }, [running]);

  /**
   * Lưu thời gian LẦN GẦN NHẤT, không lưu "kỷ lục nhanh nhất".
   * Cố ý: phần thi đọc chấm ĐỘ CHÍNH XÁC chứ không chấm tốc độ, nên một cái
   * bảng kỷ lục sẽ dạy đúng thói quen sai — đọc lướt cho kịp số. Thời gian ở
   * đây chỉ để so giữa các tuần và thấy độ trôi chảy tăng lên.
   */
  const finishTimer = useCallback(() => {
    setRunning(false);
    const secs = Math.round(elapsed * 10) / 10;
    if (secs < 1) return;
    setBest((prev) => {
      const next = { ...prev, [piece.n]: secs };
      try {
        localStorage.setItem(READALOUD_STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* hết quota — con số chỉ còn trong phiên này */
      }
      return next;
    });
  }, [elapsed, piece.n]);

  /* ── Ghi âm ───────────────────────────────────────────────── */
  const startRecording = async () => {
    setRecError(null);
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setRecError('Trình duyệt này không hỗ trợ ghi âm. Dùng ứng dụng ghi âm của điện thoại thay thế.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        if (chunksRef.current.length) {
          const blob = new Blob(chunksRef.current, { type: mr.mimeType || 'audio/webm' });
          setRecUrl(URL.createObjectURL(blob));
        }
        chunksRef.current = [];
        setRecording(false);
      };
      mediaRef.current = mr;
      mr.start();
      setRecording(true);
    } catch {
      setRecording(false);
      setRecError('Không truy cập được micro. Kiểm tra quyền micro của trình duyệt.');
    }
  };

  const stopRecording = () => {
    try {
      mediaRef.current?.stop();
    } catch {
      setRecording(false);
    }
  };

  useEffect(
    () => () => {
      try {
        mediaRef.current?.stop();
      } catch {
        /* bỏ qua */
      }
    },
    [],
  );

  // Thu hồi URL blob của bản ghi CŨ khi có bản mới, và khi rời khu.
  useEffect(
    () => () => {
      if (recUrl) URL.revokeObjectURL(recUrl);
    },
    [recUrl],
  );

  const playChunk = (key: string, kana: string) => {
    setActiveChunk(key);
    speak(kana, rate);
  };

  return (
    <div className="space-y-6">
      {/* Vì sao */}
      <section className="rounded-2xl border border-neon-pink/25 bg-neon-pink/[0.05] p-6">
        <h2 className="flex items-center gap-2 text-lg font-heading font-semibold text-white mb-3">
          <Scissors className="w-5 h-5 text-neon-pink" />
          Đọc theo CỤM, không đọc theo chữ
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed mb-4">
          Biên bản kỳ thi trước ghi ba lỗi ở phần đọc: <b className="text-white">ngắt không trôi chảy</b>,{' '}
          <b className="text-white">chữ Hán không thuộc</b>, <b className="text-white">đọc rời từng chữ</b>.
          Ba lỗi đó cùng một gốc: bài được nhìn như một chuỗi chữ rời chứ không phải một chuỗi cụm.
        </p>
        <div className="space-y-2">
          {CHUNK_RULES.map((r) => (
            <div key={r.n} className="rounded-xl border border-white/10 bg-black/25 p-3.5">
              <div className="text-[13px] font-bold text-white mb-1">
                {r.n}. {r.rule}
              </div>
              <p className="text-[13px] text-slate-400 leading-relaxed">{r.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {mounted && supported && !voiceReady && (
        <div className="rounded-2xl border border-neon-orange/30 bg-neon-orange/[0.07] p-4 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-neon-orange shrink-0 mt-0.5" />
          <p className="text-[13px] text-slate-300 leading-relaxed">
            Máy chưa có giọng đọc tiếng Nhật nên nút nghe sẽ im lặng. Xem hướng dẫn cài giọng ở khu{' '}
            <b className="text-white">Nghe hiểu</b>. Phần chia cụm, furigana và bấm giờ vẫn dùng bình thường.
          </p>
        </div>
      )}

      {/* Chọn bài */}
      <div className="flex flex-wrap gap-2">
        {READ_PIECES.map((p) => {
          const active = p.n === piece.n;
          const meta = LEVEL_META[p.level];
          return (
            <button
              key={p.n}
              onClick={() => {
                stop();
                setPieceN(p.n);
                setElapsed(0);
                setRunning(false);
                setActiveChunk(null);
              }}
              className={`px-3 py-2 rounded-xl text-[13px] font-medium border transition-all active:scale-95 ${
                active
                  ? 'bg-neon-pink/15 border-neon-pink/40 text-white'
                  : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:border-white/20'
              }`}
            >
              Bài {p.n}
              <span
                className="ml-1.5 px-1 py-0.5 rounded text-[9px] font-bold"
                style={{ background: `${meta.color}22`, color: meta.color }}
              >
                {meta.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Thanh công cụ */}
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          onClick={() => (speaking ? stop() : speak(pieceFullText(piece), rate))}
          disabled={!voiceReady}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold border transition-all active:scale-95 disabled:opacity-40 ${
            speaking
              ? 'bg-neon-pink/25 border-neon-pink text-white'
              : 'bg-neon-pink/10 border-neon-pink/40 text-neon-pink hover:bg-neon-pink/20'
          }`}
        >
          {speaking ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          {speaking ? 'Dừng' : 'Nghe cả bài'}
        </button>

        <div className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] p-1">
          <Gauge className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
          {SPEEDS.map((s) => (
            <button
              key={s}
              onClick={() => setRate(s)}
              className={`px-2.5 py-1 rounded-lg text-[12px] font-semibold transition-colors ${
                rate === s ? 'bg-neon-pink/20 text-neon-pink' : 'text-slate-500 hover:text-white'
              }`}
            >
              {s}×
            </button>
          ))}
        </div>

        <Toggle on={showKana} onClick={() => setShowKana((v) => !v)} label="Furigana" />
        <Toggle on={showRomaji} onClick={() => setShowRomaji((v) => !v)} label="Romaji" />
        <Toggle on={showVi} onClick={() => setShowVi((v) => !v)} label="Nghĩa" />
      </div>

      {/* Bấm giờ & ghi âm */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-2 text-[13px] font-bold text-white">
              <Timer className="w-4 h-4 text-neon-cyan" />
              Bấm giờ
            </span>
            <span className="text-2xl font-bold text-neon-cyan tabular-nums">{elapsed.toFixed(1)}s</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (running) finishTimer();
                else {
                  setElapsed(0);
                  setRunning(true);
                }
              }}
              className="flex-1 px-3 py-2 rounded-xl text-[13px] font-semibold bg-neon-cyan/10 border border-neon-cyan/35 text-neon-cyan hover:bg-neon-cyan/20 transition-colors active:scale-95"
            >
              {running ? 'Xong — chốt giờ' : 'Bắt đầu đọc'}
            </button>
          </div>
          {mounted && best[piece.n] !== undefined && (
            <p className="text-[12px] text-slate-500 mt-2 leading-relaxed">
              Lần gần nhất bài {piece.n}: <b className="text-neon-green">{best[piece.n]}s</b>. Ghi vào sổ, mỗi
              tuần đọc lại và so.
            </p>
          )}
          <p className="text-[12px] text-neon-orange/90 mt-2 leading-relaxed">
            Nhanh hơn KHÔNG phải mục tiêu. Phòng thi chấm độ chính xác, không chấm tốc độ — đọc chậm và rõ.
            Con số này chỉ để thấy độ trôi chảy tăng dần giữa các tuần.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-2 text-[13px] font-bold text-white">
              <Mic className="w-4 h-4 text-neon-red" />
              Ghi âm & nghe lại
            </span>
          </div>
          <button
            onClick={() => (recording ? stopRecording() : void startRecording())}
            className={`w-full px-3 py-2 rounded-xl text-[13px] font-semibold border transition-colors active:scale-95 ${
              recording
                ? 'bg-neon-red/25 border-neon-red text-white animate-pulse'
                : 'bg-neon-red/10 border-neon-red/35 text-neon-red hover:bg-neon-red/20'
            }`}
          >
            {recording ? 'Đang ghi — bấm để dừng' : 'Bắt đầu ghi âm'}
          </button>
          {recError && <p className="text-[12px] text-neon-orange mt-2 leading-relaxed">{recError}</p>}
          {recUrl && (
            <>
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <audio src={recUrl} controls className="w-full mt-3" />
              <p className="text-[12px] text-slate-500 mt-2 leading-relaxed">
                Nghe lại và so ba thứ với bản đọc mẫu: chỗ ngắt · độ dài trường âm · っ có im được một nhịp
                không.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Bài đọc chia cụm */}
      <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#141220] to-[#0d0b14] p-5 sm:p-7">
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <h3 className="text-lg font-heading font-bold text-white">
            Bài {piece.n} — {piece.title}
          </h3>
          <span className="text-[11px] text-slate-500">{pieceChunkCount(piece)} cụm</span>
        </div>

        <div className="space-y-5">
          {piece.lines.map((line, li) => (
            <div key={li}>
              {line.speaker && (
                <div className="text-[12px] font-bold text-neon-cyan mb-2">{line.speaker}</div>
              )}
              <div className="flex flex-wrap gap-2">
                {line.chunks.map((c, ci) => {
                  const key = `${li}-${ci}`;
                  const active = activeChunk === key;
                  return (
                    <button
                      key={key}
                      onClick={() => playChunk(key, c.kana)}
                      className={`text-left rounded-xl border px-3 py-2.5 transition-all active:scale-[0.98] ${
                        active
                          ? 'border-neon-pink/60 bg-neon-pink/10'
                          : c.warn
                            ? 'border-neon-orange/30 bg-neon-orange/[0.05] hover:border-neon-orange/50'
                            : 'border-white/10 bg-white/[0.03] hover:border-white/25'
                      }`}
                    >
                      {showKana && (
                        <div className="text-[11px] text-neon-cyan leading-tight mb-0.5">{c.kana}</div>
                      )}
                      <div className="text-lg text-white leading-snug">{c.jp}</div>
                      {showRomaji && (
                        <div className="text-[11px] text-slate-500 italic leading-tight mt-0.5">
                          {c.romaji}
                        </div>
                      )}
                      {showVi && c.vi && (
                        <div className="text-[12px] text-slate-400 leading-tight mt-0.5">{c.vi}</div>
                      )}
                      {c.warn && (
                        <div className="text-[11px] text-neon-orange leading-snug mt-1.5 flex items-start gap-1">
                          <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                          <span>{c.warn}</span>
                        </div>
                      )}
                      <div className="text-[10px] text-slate-600 mt-1 inline-flex items-center gap-1">
                        <Volume2 className="w-3 h-3" />
                        bấm để nghe cụm này
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Chữ Hán trong bài */}
      {piece.kanji.length > 0 && (
        <section className="rounded-2xl border border-neon-red/20 bg-neon-red/[0.04] p-5">
          <h3 className="flex items-center gap-2 text-sm font-bold text-white mb-3">
            <BookOpen className="w-4 h-4 text-neon-red" />
            Toàn bộ chữ Hán trong bài này ({piece.kanji.length})
          </h3>
          <p className="text-[13px] text-slate-400 mb-3 leading-relaxed">
            Danh sách HỮU HẠN — học hết là hết vấp ở bài này. Đây là cách học kanji hiệu quả hơn hẳn học
            &ldquo;kanji nói chung&rdquo;.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {piece.kanji.map((k) => (
              <div key={k.c} className="rounded-xl border border-white/10 bg-black/25 px-3 py-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg text-white font-semibold">{k.c}</span>
                  <span className="text-[13px] text-neon-cyan">{k.yomi}</span>
                </div>
                <div className="text-[12px] text-slate-400 leading-snug mt-0.5">{k.vi}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Mẹo cho bài */}
      <section className="rounded-2xl border border-neon-green/20 bg-neon-green/[0.04] p-5">
        <h3 className="text-sm font-bold text-neon-green mb-2.5">Mẹo riêng cho bài {piece.n}</h3>
        <ul className="space-y-2">
          {piece.tips.map((t, i) => (
            <li key={i} className="text-[13px] text-slate-300 leading-relaxed flex gap-2">
              <span className="text-neon-green shrink-0">▸</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Quy trình 3 lượt */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <h3 className="text-sm font-bold text-white mb-3">Quy trình luyện một bài — 3 lượt</h3>
        <ol className="space-y-2.5 text-[13px] text-slate-300 leading-relaxed">
          <li>
            <b className="text-neon-cyan">Lượt 1 — nhại từng cụm.</b> Bật đủ furigana + nghĩa. Bấm nghe MỘT
            cụm rồi nhại lại ngay cụm đó, chưa ghép cả bài. Đây là bước phá thói đọc rời từng chữ.
          </li>
          <li>
            <b className="text-neon-orange">Lượt 2 — tắt furigana.</b> Đọc liền cả bài, bấm giờ. Vấp ở đâu thì
            bật lại cụm đó nghe rồi đọc lại riêng nó.
          </li>
          <li>
            <b className="text-neon-green">Lượt 3 — tắt hết, ghi âm.</b> Chỉ còn mặt chữ như đề thật. Ghi âm,
            nghe lại, chấm theo 4 tiêu chí: đúng âm · っ và trường âm đúng độ dài · ngắt theo cụm · không dừng
            quá 2 giây ở đâu.
          </li>
        </ol>
      </section>
    </div>
  );
}

function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] border transition-all active:scale-95 ${
        on
          ? 'bg-neon-cyan/12 border-neon-cyan/35 text-neon-cyan'
          : 'bg-white/[0.03] border-white/10 text-slate-500 hover:text-white'
      }`}
    >
      {on ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
      {label}
    </button>
  );
}
