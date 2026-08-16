'use client';

/**
 * "Việc của tôi" — mọi công việc được gán cho người dùng, gom từ MỌI bảng.
 *
 * ─── Vì sao cần một chỗ riêng ───
 * Database giải quyết được "dự án này còn việc gì", nhưng không trả lời được
 * "hôm nay tôi phải làm gì" — câu đó cắt ngang mọi bảng và mọi môn học. Không
 * có chỗ này thì người dùng phải mở lần lượt từng bảng để tự gom, và họ sẽ
 * quay về dùng một danh sách phẳng ở đâu đó khác.
 *
 * Chỉ ĐỌC. Sửa việc thì bấm vào để mở đúng bảng chứa nó — nhân bản chức năng
 * sửa ở đây nghĩa là hai chỗ phải hiểu 17 kiểu cột, và chỗ này sẽ tụt lại.
 */
import { useEffect, useState } from 'react';
import { CircleCheck, CircleDashed, Clock, Loader2, RefreshCw } from 'lucide-react';
import { noteDatabaseApi, type MyTask } from '@/lib/api';

const DAY_MS = 86_400_000;

/** Nhãn hạn: "hôm nay", "trễ 3 ngày", "còn 5 ngày". */
function dueLabel(due: string | null): { text: string; tone: 'late' | 'soon' | 'ok' } | null {
  if (!due) return null;
  const time = new Date(due).getTime();
  if (Number.isNaN(time)) return null;
  // So theo NGÀY LỊCH: một việc hạn 23:00 hôm nay không được hiện là "trễ"
  // lúc 9 giờ sáng chỉ vì phép trừ mili giây ra số âm.
  const days = Math.floor(time / DAY_MS) - Math.floor(Date.now() / DAY_MS);
  if (days < 0) return { text: `trễ ${-days} ngày`, tone: 'late' };
  if (days === 0) return { text: 'hôm nay', tone: 'soon' };
  if (days <= 2) return { text: `còn ${days} ngày`, tone: 'soon' };
  return { text: `còn ${days} ngày`, tone: 'ok' };
}

const TONE_CLASS = {
  late: 'text-rose-600 dark:text-rose-300',
  soon: 'text-amber-600 dark:text-amber-300',
  ok: 'text-slate-500 dark:text-slate-400',
};

export default function MyTasksPanel({ onOpenDatabase }: { onOpenDatabase?: (databaseId: number) => void }) {
  const [tasks, setTasks] = useState<MyTask[] | null>(null);
  const [showDone, setShowDone] = useState(false);
  const [reloading, setReloading] = useState(false);

  const load = () => {
    setReloading(true);
    noteDatabaseApi.listMyTasks()
      .then((res) => setTasks(res.data.data))
      .catch(() => setTasks([]))
      .finally(() => setReloading(false));
  };

  useEffect(load, []);

  if (tasks === null) {
    return (
      <p className="flex items-center gap-2 px-3 py-6 text-[13px] text-slate-500">
        <Loader2 size={14} className="animate-spin" aria-hidden /> Đang gom việc…
      </p>
    );
  }

  const doneCount = tasks.filter((t) => t.statusGroup === 'done').length;
  const visible = showDone ? tasks : tasks.filter((t) => t.statusGroup !== 'done');

  return (
    <section className="rounded-xl border border-slate-200 bg-white dark:border-white/[0.07] dark:bg-white/[0.02]">
      <header className="flex items-center gap-2 border-b border-slate-100 px-3 py-2 dark:border-white/[0.05]">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Việc của tôi</h3>
        <span className="text-[11.5px] text-slate-500">{visible.length} việc</span>
        <span className="ml-auto flex items-center gap-1">
          {doneCount > 0 && (
            <button
              type="button"
              onClick={() => setShowDone((v) => !v)}
              className="rounded px-1.5 py-0.5 text-[11.5px] text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"
            >
              {showDone ? 'Ẩn việc xong' : `Hiện ${doneCount} việc đã xong`}
            </button>
          )}
          <button
            type="button"
            onClick={load}
            aria-label="Tải lại"
            className="rounded p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"
          >
            <RefreshCw size={13} className={reloading ? 'animate-spin' : ''} />
          </button>
        </span>
      </header>

      {visible.length === 0 ? (
        <p className="px-3 py-6 text-center text-[13px] text-slate-500">
          {/* Phân biệt "chưa có việc nào" với "đã xong hết" — hai chuyện khác
              hẳn nhau nhưng cùng ra một danh sách rỗng. */}
          {tasks.length === 0
            ? 'Chưa có việc nào được gán cho bạn. Thêm cột "Người" vào một bảng rồi gán việc cho mình.'
            : '🎉 Hết việc rồi.'}
        </p>
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-white/[0.05]">
          {visible.map((task) => {
            const due = dueLabel(task.due);
            return (
              <li key={`${task.databaseId}-${task.rowId}`}>
                <button
                  type="button"
                  onClick={() => onOpenDatabase?.(task.databaseId)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                >
                  {task.statusGroup === 'done'
                    ? <CircleCheck size={14} className="shrink-0 text-emerald-500" aria-hidden />
                    : <CircleDashed size={14} className="shrink-0 text-slate-400" aria-hidden />}

                  <span className={`min-w-0 flex-1 truncate text-[13px] ${
                    task.statusGroup === 'done'
                      ? 'text-slate-400 line-through dark:text-slate-500'
                      : 'text-slate-800 dark:text-slate-100'
                  }`}>
                    {task.title}
                  </span>

                  {task.priority && (
                    <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[10.5px] text-slate-600 dark:bg-white/10 dark:text-slate-300">
                      {task.priority}
                    </span>
                  )}
                  {due && (
                    <span className={`flex shrink-0 items-center gap-0.5 text-[11px] ${TONE_CLASS[due.tone]}`}>
                      <Clock size={10} aria-hidden /> {due.text}
                    </span>
                  )}
                  {/* Tên bảng + môn: cùng một tiêu đề việc có thể nằm ở nhiều
                      bảng, và không nói rõ thì người dùng không biết bấm vào
                      sẽ đi đâu. */}
                  <span className="hidden shrink-0 text-[10.5px] text-slate-400 sm:inline">
                    {task.subjectName} · {task.databaseTitle}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
