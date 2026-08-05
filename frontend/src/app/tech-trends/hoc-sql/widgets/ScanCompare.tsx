'use client';

/**
 * Quét tuần tự vs dùng index — chạy song song trên CÙNG một tập 100 dòng.
 *
 * Điểm cần người học rút ra không phải "index nhanh hơn" (ai cũng đoán được)
 * mà là CON SỐ: 73 lần đọc so với 3. Nên bộ đếm được đặt to và cập nhật theo
 * từng bước, chứ không chỉ hiện kết quả cuối.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

const TOTAL = 100;
/** Dòng cần tìm — cố định để lần nào chạy cũng ra cùng con số, dễ đối chiếu. */
const TARGET = 73;
/** Số lần đọc của bên index: 3 tầng cây + 1 lần lấy dòng thật từ bảng. */
const INDEX_STEPS = [1, 2, 3, 4];

export default function ScanCompare() {
  const [seqAt, setSeqAt] = useState(-1);
  const [idxAt, setIdxAt] = useState(-1);
  const [running, setRunning] = useState(false);
  const timers = useRef<number[]>([]);

  const clear = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);

  useEffect(() => clear, [clear]);

  const run = () => {
    clear();
    setRunning(true);
    setSeqAt(-1);
    setIdxAt(-1);

    // Bên index xong rất sớm — đó chính là điều cần thấy.
    INDEX_STEPS.forEach((_, i) => {
      timers.current.push(window.setTimeout(() => setIdxAt(i), 260 * (i + 1)));
    });

    for (let i = 0; i <= TARGET; i += 1) {
      timers.current.push(window.setTimeout(() => setSeqAt(i), 26 * (i + 1)));
    }
    timers.current.push(
      window.setTimeout(() => setRunning(false), 26 * (TARGET + 2)),
    );
  };

  const reset = () => {
    clear();
    setRunning(false);
    setSeqAt(-1);
    setIdxAt(-1);
  };

  const seqReads = seqAt < 0 ? 0 : seqAt + 1;
  const idxReads = idxAt < 0 ? 0 : idxAt + 1;
  const done = !running && seqAt >= TARGET;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={run}
          disabled={running}
          className="inline-flex items-center gap-2 rounded-xl border border-violet-400/40 bg-violet-500/20 px-3.5 py-2 text-sm font-medium text-white transition-all active:scale-95 disabled:opacity-40"
        >
          <Play className="h-4 w-4" /> Chạy tìm kiếm
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm text-slate-300 transition-all hover:border-white/20 active:scale-95"
        >
          <RotateCcw className="h-4 w-4" /> Đặt lại
        </button>
        <span className="ml-auto font-mono text-xs text-slate-500">
          WHERE email = &apos;dòng #{TARGET + 1}&apos;
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* ── Bên trái: quét tuần tự ── */}
        <div className="rounded-xl border border-rose-400/25 bg-rose-500/[0.05] p-3">
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-xs font-semibold text-rose-300">KHÔNG CÓ INDEX</span>
            <span className="font-mono text-[10px] text-slate-500">Seq Scan</span>
          </div>
          <div className="grid grid-cols-10 gap-[3px]">
            {Array.from({ length: TOTAL }, (_, i) => {
              const scanned = seqAt >= i;
              const hit = i === TARGET && seqAt >= TARGET;
              return (
                <div
                  key={i}
                  className={[
                    'aspect-square rounded-[3px] transition-colors duration-100',
                    hit
                      ? 'bg-emerald-400'
                      : scanned
                        ? 'bg-rose-400/70'
                        : 'bg-white/[0.06]',
                  ].join(' ')}
                />
              );
            })}
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tabular-nums text-rose-300">{seqReads}</span>
            <span className="text-xs text-slate-400">lần đọc</span>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
            Đọc từng dòng từ đầu tới khi gặp. Bảng 1 triệu dòng thì trung bình phải đọc 500.000 dòng.
          </p>
        </div>

        {/* ── Bên phải: dùng index ── */}
        <div className="rounded-xl border border-emerald-400/25 bg-emerald-500/[0.05] p-3">
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-xs font-semibold text-emerald-300">CÓ INDEX</span>
            <span className="font-mono text-[10px] text-slate-500">Index Scan</span>
          </div>
          <div className="space-y-2">
            {[
              { t: 'Root node', d: 'so sánh, chọn nhánh' },
              { t: 'Branch node', d: 'so sánh, chọn lá' },
              { t: 'Leaf node', d: 'tìm thấy khoá + con trỏ dòng' },
              { t: 'Bảng thật (heap)', d: 'theo con trỏ lấy dữ liệu đầy đủ' },
            ].map((s, i) => {
              const on = idxAt >= i;
              return (
                <div
                  key={s.t}
                  className={[
                    'rounded-lg border px-3 py-2 transition-all duration-200',
                    on
                      ? 'border-emerald-400/50 bg-emerald-400/15'
                      : 'border-white/10 bg-white/[0.02]',
                  ].join(' ')}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={[
                        'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold',
                        on ? 'bg-emerald-400 text-slate-900' : 'bg-white/10 text-slate-500',
                      ].join(' ')}
                    >
                      {i + 1}
                    </span>
                    <span className={on ? 'text-sm text-white' : 'text-sm text-slate-500'}>{s.t}</span>
                  </div>
                  <p className="mt-0.5 pl-7 text-[11px] text-slate-500">{s.d}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tabular-nums text-emerald-300">{idxReads}</span>
            <span className="text-xs text-slate-400">lần đọc</span>
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
            Số lần đọc gần như KHÔNG đổi khi bảng lớn lên — cây chỉ cao thêm một tầng mỗi khi dữ liệu gấp vài trăm lần.
          </p>
        </div>
      </div>

      {done && (
        <p className="mt-4 rounded-xl border border-violet-400/25 bg-violet-500/10 px-4 py-3 text-sm leading-relaxed text-slate-200">
          <b className="text-violet-300">{seqReads} so với {idxReads}.</b>{' '}
          Trên 100 dòng thì chênh lệch này chưa thấy được bằng mắt. Trên 1 triệu dòng, nó là khác biệt giữa
          <b className="text-white"> 3 giây</b> và <b className="text-white">3 mili-giây</b>.
        </p>
      )}
    </div>
  );
}
