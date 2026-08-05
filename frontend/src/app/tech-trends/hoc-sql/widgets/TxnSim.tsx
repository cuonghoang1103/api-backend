'use client';

/**
 * Hai phiên chạy song song trên cùng một hàng dữ liệu.
 *
 * Thứ duy nhất widget này phải truyền tải: TRƯỚC COMMIT, phiên khác vẫn đọc
 * được giá trị CŨ và KHÔNG bị chặn. Đọc chữ về MVCC thì trừu tượng; nhìn hai
 * cột số lệch nhau ở cùng một dòng thời gian thì hiểu ngay.
 */
import { useState } from 'react';
import { ChevronRight, RotateCcw, Check, Undo2 } from 'lucide-react';

interface Frame {
  a: string;
  b: string;
  /** Số dư mà mỗi phiên NHÌN THẤY tại thời điểm này. */
  seenA: number;
  seenB: number;
  /** Giá trị đã ghi nhận thật sự trên đĩa. */
  committed: number;
  note: string;
  tone: 'idle' | 'work' | 'commit' | 'rollback';
}

function frames(ending: 'commit' | 'rollback'): Frame[] {
  const base: Frame[] = [
    { a: '—', b: '—', seenA: 1000, seenB: 1000, committed: 1000, tone: 'idle', note: 'Trạng thái ban đầu. Tài khoản có 1.000k. Hai phiên đều thấy như nhau.' },
    { a: 'BEGIN;', b: '—', seenA: 1000, seenB: 1000, committed: 1000, tone: 'work', note: 'Phiên A mở transaction. Chưa thay đổi gì nên chưa ai thấy khác biệt.' },
    { a: 'UPDATE … SET balance = balance - 300;', b: '—', seenA: 700, seenB: 1000, committed: 1000, tone: 'work', note: '★ Đây là điểm mấu chốt: A thấy 700, nhưng B VẪN THẤY 1.000. Postgres giữ hai phiên bản của cùng một dòng — cơ chế MVCC.' },
    { a: '(đang xử lý)', b: 'SELECT balance;', seenA: 700, seenB: 1000, committed: 1000, tone: 'work', note: 'B chạy SELECT và nhận về 1.000 NGAY LẬP TỨC — không hề bị chặn, không phải chờ A. Đọc không bao giờ khoá ghi trong PostgreSQL.' },
  ];

  if (ending === 'commit') {
    return [
      ...base,
      { a: 'COMMIT;', b: '—', seenA: 700, seenB: 700, committed: 700, tone: 'commit', note: 'A xác nhận. Từ giây này thay đổi trở thành sự thật với mọi người, và đã ghi bền xuống đĩa qua nhật ký WAL.' },
      { a: '—', b: 'SELECT balance;', seenA: 700, seenB: 700, committed: 700, tone: 'commit', note: 'B chạy lại cùng câu SELECT và giờ nhận về 700. Đây là mức cô lập Read Committed — mặc định của PostgreSQL.' },
    ];
  }
  return [
    ...base,
    { a: 'ROLLBACK;', b: '—', seenA: 1000, seenB: 1000, committed: 1000, tone: 'rollback', note: 'A huỷ bỏ. Mọi thay đổi biến mất như chưa từng có — kể cả với chính A.' },
    { a: '—', b: 'SELECT balance;', seenA: 1000, seenB: 1000, committed: 1000, tone: 'rollback', note: 'B vẫn thấy 1.000 và không hề biết có chuyện gì vừa xảy ra. Đó chính là chữ A (Atomicity): cả nhóm lệnh, hoặc không gì cả.' },
  ];
}

const TONE: Record<Frame['tone'], string> = {
  idle: 'border-white/10 bg-white/[0.03]',
  work: 'border-sky-400/30 bg-sky-500/[0.07]',
  commit: 'border-emerald-400/30 bg-emerald-500/[0.07]',
  rollback: 'border-amber-400/30 bg-amber-500/[0.07]',
};

const vnd = (n: number) => `${n.toLocaleString('vi-VN')}k`;

export default function TxnSim() {
  const [ending, setEnding] = useState<'commit' | 'rollback'>('commit');
  const [i, setI] = useState(0);
  const list = frames(ending);
  const f = list[Math.min(i, list.length - 1)];
  const last = i >= list.length - 1;

  const switchEnding = (e: 'commit' | 'rollback') => { setEnding(e); setI(0); };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400">Kết thúc bằng:</span>
        <button
          type="button"
          onClick={() => switchEnding('commit')}
          className={[
            'inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-mono text-xs transition-all active:scale-95',
            ending === 'commit'
              ? 'border-emerald-400/50 bg-emerald-500/20 text-white'
              : 'border-white/10 bg-white/[0.03] text-slate-400 hover:text-white',
          ].join(' ')}
        >
          <Check className="h-3.5 w-3.5" /> COMMIT
        </button>
        <button
          type="button"
          onClick={() => switchEnding('rollback')}
          className={[
            'inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-mono text-xs transition-all active:scale-95',
            ending === 'rollback'
              ? 'border-amber-400/50 bg-amber-500/20 text-white'
              : 'border-white/10 bg-white/[0.03] text-slate-400 hover:text-white',
          ].join(' ')}
        >
          <Undo2 className="h-3.5 w-3.5" /> ROLLBACK
        </button>
        <span className="ml-auto font-mono text-[11px] text-slate-600">
          bước {Math.min(i, list.length - 1) + 1}/{list.length}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className={`rounded-xl border p-3 transition-colors ${TONE[f.tone]}`}>
          <p className="mb-2 text-xs font-semibold text-slate-300">Phiên A — người chuyển tiền</p>
          <code className="block min-h-[42px] rounded-lg bg-black/30 px-3 py-2 font-mono text-[12px] leading-relaxed text-slate-200">
            {f.a}
          </code>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xs text-slate-500">A nhìn thấy</span>
            <span className="text-xl font-bold tabular-nums text-white">{vnd(f.seenA)}</span>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <p className="mb-2 text-xs font-semibold text-slate-300">Phiên B — người khác đọc cùng lúc</p>
          <code className="block min-h-[42px] rounded-lg bg-black/30 px-3 py-2 font-mono text-[12px] leading-relaxed text-slate-200">
            {f.b}
          </code>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xs text-slate-500">B nhìn thấy</span>
            <span
              className={[
                'text-xl font-bold tabular-nums',
                f.seenA !== f.seenB ? 'text-amber-300' : 'text-white',
              ].join(' ')}
            >
              {vnd(f.seenB)}
            </span>
            {f.seenA !== f.seenB && (
              <span className="rounded-md border border-amber-400/30 bg-amber-500/15 px-1.5 py-0.5 text-[10px] text-amber-300">
                khác A
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3.5 py-2">
        <span className="text-xs text-slate-500">Đã ghi bền xuống đĩa</span>
        <span className="font-mono text-sm font-bold text-violet-300">{vnd(f.committed)}</span>
      </div>

      <p className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[13px] leading-relaxed text-slate-300">
        {f.note}
      </p>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => setI((s) => Math.min(list.length - 1, s + 1))}
          disabled={last}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-violet-400/40 bg-violet-500/20 px-3 py-2 text-sm font-medium text-white transition-all active:scale-95 disabled:opacity-30"
        >
          Bước tiếp <ChevronRight className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setI(0)}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-300 transition-all hover:border-white/20 active:scale-95"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
