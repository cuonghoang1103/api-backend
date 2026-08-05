'use client';

/**
 * Phòng thí nghiệm NULL.
 *
 * Mỗi dòng là một biểu thức mà người học ĐOÁN trước rồi mới lật đáp án — chứ
 * không phải một bảng chân trị đọc lướt qua. Việc đoán sai một lần dạy nhanh
 * hơn nhiều so với đọc mười lần rằng "NULL nghĩa là không biết".
 */
import { useState } from 'react';
import { Check, X, HelpCircle } from 'lucide-react';

type Row = {
  expr: string;
  result: 'TRUE' | 'FALSE' | 'NULL';
  why: string;
  trap?: boolean;
};

const ROWS: Row[] = [
  { expr: "SELECT 1 = 1", result: 'TRUE', why: 'So sánh bình thường giữa hai giá trị đã biết.' },
  { expr: "SELECT NULL = NULL", result: 'NULL', trap: true, why: '"Không biết" có bằng "không biết" không? Không xác định được, nên kết quả là NULL chứ không phải TRUE.' },
  { expr: "SELECT NULL <> NULL", result: 'NULL', trap: true, why: 'Cùng lý do. Không so sánh được thì phủ định cũng không so sánh được.' },
  { expr: "SELECT NULL IS NULL", result: 'TRUE', why: '`IS NULL` không phải phép so sánh — nó là câu hỏi "ô này có rỗng không?". Đây là cách DUY NHẤT kiểm tra NULL.' },
  { expr: "SELECT 5 > NULL", result: 'NULL', why: '5 lớn hơn một số không biết? Không trả lời được.' },
  { expr: "SELECT NULL + 100", result: 'NULL', why: 'Mọi phép toán có NULL tham gia đều ra NULL. Cộng tiền vào một ô rỗng vẫn là rỗng.' },
  { expr: "SELECT 'abc' || NULL", result: 'NULL', trap: true, why: 'Nối chuỗi cũng vậy — cả chuỗi thành NULL. Đây là lý do tên hiển thị đôi khi biến mất sạch trên giao diện.' },
  { expr: "SELECT TRUE OR NULL", result: 'TRUE', why: 'Đã có một vế TRUE thì vế kia là gì cũng không đổi kết quả. Logic ba trị vẫn rút gọn được ở đây.' },
  { expr: "SELECT FALSE AND NULL", result: 'FALSE', why: 'Đã có một vế FALSE thì cả biểu thức chắc chắn FALSE.' },
  { expr: "SELECT TRUE AND NULL", result: 'NULL', why: 'Ở đây thì vế NULL quyết định — chưa biết được.' },
  { expr: "SELECT 3 IN (1, 2, NULL)", result: 'NULL', trap: true, why: '3 không bằng 1, không bằng 2, còn NULL thì không biết → chưa thể kết luận là "không có trong danh sách".' },
  { expr: "SELECT 3 NOT IN (1, 2, NULL)", result: 'NULL', trap: true, why: '★ CÁI BẪY ĐẮT NHẤT. Vì không bao giờ ra TRUE, mọi dòng bị WHERE loại bỏ → câu query trả về RỖNG mà không báo lỗi. Hãy dùng NOT EXISTS.' },
  { expr: "SELECT COUNT(*) FROM (VALUES (1),(NULL)) t(x)", result: 'TRUE', why: 'Trả về 2 — COUNT(*) đếm DÒNG nên NULL vẫn được tính.' },
  { expr: "SELECT COUNT(x) FROM (VALUES (1),(NULL)) t(x)", result: 'FALSE', trap: true, why: 'Trả về 1 — COUNT(cột) bỏ qua NULL. Khác biệt này lặng lẽ đi thẳng vào báo cáo.' },
];

const LABEL: Record<Row['result'], string> = { TRUE: 'true', FALSE: 'false', NULL: 'NULL' };
const STYLE: Record<Row['result'], string> = {
  TRUE: 'border-emerald-400/40 bg-emerald-500/15 text-emerald-300',
  FALSE: 'border-rose-400/40 bg-rose-500/15 text-rose-300',
  NULL: 'border-amber-400/40 bg-amber-500/15 text-amber-300',
};

export default function NullLab() {
  const [open, setOpen] = useState<Record<number, boolean>>({});
  const openedCount = Object.values(open).filter(Boolean).length;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-slate-400">
          Tự đoán kết quả trước, rồi bấm để lật đáp án. Dòng viền vàng là bẫy thật sự.
        </p>
        <span className="font-mono text-[11px] text-slate-600">{openedCount}/{ROWS.length}</span>
      </div>

      <div className="space-y-1.5">
        {ROWS.map((r, i) => {
          const shown = !!open[i];
          return (
            <div
              key={r.expr}
              className={[
                'overflow-hidden rounded-xl border transition-colors',
                r.trap ? 'border-amber-400/25 bg-amber-500/[0.04]' : 'border-white/10 bg-white/[0.02]',
              ].join(' ')}
            >
              <button
                type="button"
                onClick={() => setOpen((s) => ({ ...s, [i]: !s[i] }))}
                className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition-colors hover:bg-white/[0.03]"
              >
                <code className="min-w-0 flex-1 truncate font-mono text-[12.5px] text-slate-200">{r.expr}</code>
                {shown ? (
                  <span className={`shrink-0 rounded-md border px-2 py-0.5 font-mono text-[11px] font-bold ${STYLE[r.result]}`}>
                    {LABEL[r.result]}
                  </span>
                ) : (
                  <span className="shrink-0 rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[11px] text-slate-500">
                    ?
                  </span>
                )}
              </button>
              {shown && (
                <p className="border-t border-white/[0.07] px-3.5 py-2.5 text-[12.5px] leading-relaxed text-slate-400">
                  {r.why}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 space-y-2 rounded-xl border border-violet-400/25 bg-violet-500/10 px-4 py-3">
        <p className="flex items-start gap-2 text-sm leading-relaxed text-slate-200">
          <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />
          <span>
            Một câu tóm gọn cả bảng trên: <b className="text-violet-300">NULL không phải giá trị, nó là sự vắng mặt của giá trị.</b>{' '}
            Nên không so sánh được với bất cứ thứ gì — kể cả với chính nó.
          </span>
        </p>
        <p className="flex items-start gap-2 text-sm leading-relaxed text-slate-300">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
          <span>Kiểm tra rỗng: <code className="font-mono text-emerald-300">IS NULL</code> / <code className="font-mono text-emerald-300">IS NOT NULL</code></span>
        </p>
        <p className="flex items-start gap-2 text-sm leading-relaxed text-slate-300">
          <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
          <span>Không bao giờ: <code className="font-mono text-rose-300">= NULL</code>, <code className="font-mono text-rose-300">&lt;&gt; NULL</code>, hay <code className="font-mono text-rose-300">NOT IN (…có thể chứa NULL…)</code></span>
        </p>
      </div>
    </div>
  );
}
