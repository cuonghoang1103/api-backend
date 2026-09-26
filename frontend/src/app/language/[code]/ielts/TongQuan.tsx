'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, CalendarPlus, Volume2, PlayCircle } from 'lucide-react';
import { DAYS, INTRO, KIND_LABEL, daySummary, type Day, type Lesson } from './data';
import { buildIcs, fmtDate, schedule, todayIso, WEEKDAYS, type Plan } from './useTienDo';
import { speak } from './Blocks';
import s from './ielts.module.css';

type Common = {
  done: string[];
  scores: Record<string, number>;
  plan: Plan | null;
  onOpen: (l: Lesson) => void;
};

/** Buổi n đã học xong khi mọi bài CÓ NỘI DUNG của nó đã đánh dấu xong. */
export function dayDone(d: Day, done: string[]) {
  const ready = d.lessons.filter((l) => l.blocks?.length);
  return ready.length > 0 && ready.every((l) => done.includes(l.id));
}

/* ─────────────────────────── Tổng quan một buổi ─────────────────────────── */

export function TongQuanBuoi({ day, done, scores, plan, onOpen, onAskDay }: Common & { day: Day; onAskDay: () => void }) {
  const sum = daySummary(day);
  const date = plan ? schedule(plan, DAYS.length)[day.n - 1] : null;
  const lessons = day.n === 1 ? [INTRO, ...day.lessons] : day.lessons;
  const firstTodo = lessons.find((l) => l.blocks?.length && !done.includes(l.id));

  return (
    <>
      <header className={s.dayHead}>
        <div className={s.dayBadge}>
          <span className={s.dayWord}>Day</span>
          <span className={s.dayNum}>{String(day.n).padStart(2, '0')}</span>
        </div>
        <div className="min-w-0">
          <div className={s.dayKind}>Tổng quan buổi · Session overview</div>
          <h1 className={s.h1}>Buổi {day.n}</h1>
        </div>
      </header>
      <div className={s.goal}>
        <b>Buổi này gói gọn:</b> {sum.grammar.length ? `${sum.grammar.length} điểm ngữ pháp, ` : ''}
        {sum.vocab.length ? `${sum.vocab.length} từ & cụm từ, ` : ''}
        {sum.skills.length} bài kỹ năng{sum.quizzes.length ? `, ${sum.quizzes.length} bài tập` : ''}. Khoảng {sum.minutes} phút.
        {date && <> Lịch học: <b>{fmtDate(date)}</b>{date === todayIso() ? ' (hôm nay)' : ''}.</>}
      </div>

      {!sum.ready ? (
        <div className={s.soonBox}>
          Buổi này đang được soạn theo sách. Chụp tiếp các trang của Ngày {day.n} vào thư mục <b>Ielts</b> là bài sẽ có ở đây.
        </div>
      ) : (
        <>
          {firstTodo && (
            <div className={s.nextBox}>
              <div className="min-w-0">
                <div className={s.nextLabel}>Học tiếp</div>
                <div className={s.nextTitle}>{KIND_LABEL[firstTodo.kind]}: {firstTodo.title}</div>
              </div>
              <button type="button" className={s.btn} onClick={() => onOpen(firstTodo)}>
                <PlayCircle size={16} /> Vào học
              </button>
            </div>
          )}

          <section className={s.gbox}>
            <div className={s.gboxTitle}>1. Các bài trong buổi</div>
            <div className={s.checklist}>
              {lessons.map((l) => {
                const isDone = done.includes(l.id);
                return (
                  <button key={l.id} type="button" className={s.checkRow} onClick={() => onOpen(l)} disabled={!l.blocks?.length}>
                    <span className={`${s.tocDot} ${isDone ? s.tocDotDone : ''}`}>{isDone && <Check size={11} strokeWidth={3} />}</span>
                    <span className="min-w-0 flex-1 text-left">
                      <span className={s.tocKind}>{KIND_LABEL[l.kind]} · ~{l.minutes} phút</span>
                      {l.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {sum.grammar.length > 0 && (
            <section className={s.gbox}>
              <div className={s.gboxTitle}>2. Ngữ pháp của buổi</div>
              <ul className={s.noteList}>
                {sum.grammar.map((g) => <li key={g} className={s.noteItem}>{g}</li>)}
              </ul>
            </section>
          )}

          {sum.vocab.length > 0 && (
            <section className={s.gbox}>
              <div className={s.gboxTitle}>3. Từ vựng của buổi ({sum.vocab.length})</div>
              <p className={s.quizSub} style={{ marginBottom: 10 }}>Bấm một từ để nghe. Che nghĩa tiếng Việt đi và tự nhớ lại là cách ôn nhanh nhất.</p>
              <div className={s.wordGrid}>
                {sum.vocab.map((v) => (
                  <button key={v.w} type="button" className={s.wordChip} onClick={() => speak(v.w)}>
                    <Volume2 size={13} className={s.muted} />
                    <b>{v.w}</b>
                    <span className={s.muted}>{v.vi}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {sum.quizzes.length > 0 && (
            <section className={s.gbox}>
              <div className={s.gboxTitle}>4. Bài tập & điểm</div>
              <div className={s.checklist}>
                {sum.quizzes.map((q) => {
                  const sc = scores[q.id];
                  const l = lessons.find((x) => x.id === q.lessonId);
                  return (
                    <button key={q.id} type="button" className={s.checkRow} onClick={() => l && onOpen(l)}>
                      <span className="min-w-0 flex-1 text-left">
                        {q.title}
                        <span className={s.tocKind}>{q.count} câu</span>
                      </span>
                      <span className={sc == null ? s.muted : sc >= 80 ? s.good : s.bad} style={{ fontWeight: 600, fontSize: 14 }}>
                        {sc == null ? 'Chưa làm' : `${sc}%`}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className={s.quizSub} style={{ marginTop: 10 }}>Dưới 80% thì nên làm lại bài đó trước khi sang buổi sau.</p>
            </section>
          )}

          <div className={s.nextBox} style={{ marginTop: 28 }}>
            <div className="min-w-0">
              <div className={s.nextTitle}>Tự kiểm tra cả buổi</div>
              <div className={s.quizSub}>Gia sư ra câu hỏi trộn ngữ pháp + từ vựng của buổi {day.n}.</div>
            </div>
            <button type="button" className={s.btnGhost} onClick={onAskDay}>Hỏi gia sư</button>
          </div>
        </>
      )}
    </>
  );
}

/* ─────────────────────────── Kế hoạch & tiến độ ─────────────────────────── */

export function KeHoach({ done, scores, plan, onOpen, onOpenDay, savePlan, loggedIn }: Common & {
  onOpenDay: (n: number) => void;
  savePlan: (p: Plan | null) => void;
  loggedIn: boolean;
}) {
  const [draft, setDraft] = useState<Plan>(plan ?? { start: todayIso(), days: [1, 2, 3, 4, 5], time: '20:00' });
  const [editing, setEditing] = useState(!plan);
  // Kế hoạch về SAU lần vẽ đầu (localStorage đọc trong effect, server còn
  // chậm hơn) — lúc đó mới biết người dùng đã có lịch, nên đóng form lại.
  // Chỉ một lần: đang sửa dở thì đừng giật form khỏi tay người ta.
  const seen = useRef(!!plan);
  useEffect(() => {
    if (plan && !seen.current) {
      seen.current = true;
      setDraft(plan);
      setEditing(false);
    }
  }, [plan]);
  const dates = plan ? schedule(plan, DAYS.length) : [];
  const today = todayIso();

  const readyDays = DAYS.filter((d) => daySummary(d).ready);
  const doneDays = DAYS.filter((d) => dayDone(d, done)).length;
  const lessonsReady = DAYS.flatMap((d) => d.lessons).filter((l) => l.blocks?.length);
  const lessonsDone = lessonsReady.filter((l) => done.includes(l.id)).length;
  const scoreVals = Object.values(scores);
  const avg = scoreVals.length ? Math.round(scoreVals.reduce((a, b) => a + b, 0) / scoreVals.length) : null;

  // Buổi đang học = buổi đầu tiên chưa xong. Trễ lịch nếu ngày dự kiến của nó đã qua.
  const current = DAYS.find((d) => !dayDone(d, done)) ?? DAYS[DAYS.length - 1];
  const due = plan ? dates[current.n - 1] : null;
  const late = due ? due < today : false;

  const downloadIcs = () => {
    if (!plan) return;
    const ics = buildIcs(
      plan,
      DAYS.map((d) => ({ n: d.n, title: d.lessons.map((l) => l.title).join(' · ') })),
      `${window.location.origin}/language/en/ielts`,
    );
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    a.download = 'lich-hoc-ielts.ics';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };

  return (
    <>
      <header className={s.dayHead}>
        <div className={s.dayBadge}>
          <span className={s.dayWord}>Plan</span>
          <span className={s.dayNum}>{doneDays}</span>
        </div>
        <div className="min-w-0">
          <div className={s.dayKind}>Kế hoạch & tiến độ</div>
          <h1 className={s.h1}>Quản lý việc học IELTS</h1>
        </div>
      </header>

      <div className={s.statGrid}>
        <div className={s.statBox}><div className={s.statBig}>{doneDays}<span>/{DAYS.length}</span></div><div className={s.statLbl}>buổi đã xong</div></div>
        <div className={s.statBox}><div className={s.statBig}>{lessonsDone}<span>/{lessonsReady.length}</span></div><div className={s.statLbl}>bài đã học (bài đã có)</div></div>
        <div className={s.statBox}><div className={s.statBig}>{avg == null ? '—' : `${avg}%`}</div><div className={s.statLbl}>điểm bài tập trung bình</div></div>
      </div>
      <div className={s.progressBar}><span style={{ width: `${(doneDays / DAYS.length) * 100}%` }} /></div>
      <p className={s.quizSub} style={{ marginTop: 6 }}>
        {loggedIn ? 'Tiến độ lưu vào tài khoản — mở trên laptop hay iPad đều thấy như nhau.' : 'Đăng nhập để tiến độ đồng bộ giữa laptop và iPad. Hiện chỉ lưu trên trình duyệt này.'}
        {' '}Đã soạn xong {readyDays.length}/{DAYS.length} buổi.
      </p>

      <div className={s.nextBox} style={{ marginTop: 24 }}>
        <div className="min-w-0">
          <div className={s.nextLabel}>{late ? 'Bạn đang trễ lịch' : 'Buổi tiếp theo'}</div>
          <div className={s.nextTitle}>
            Buổi {current.n}{due ? ` · ${fmtDate(due)}${due === today ? ' (hôm nay)' : ''}` : ''}
          </div>
          {late && <div className={s.quizSub}>Không sao cả — học tiếp buổi này hôm nay, lịch các buổi sau giữ nguyên nhịp.</div>}
        </div>
        <button type="button" className={s.btn} onClick={() => onOpenDay(current.n)}>Mở buổi {current.n}</button>
      </div>

      <section className={s.gbox}>
        <div className={s.gboxTitle}>Lịch học của bạn</div>
        {editing ? (
          <div className={s.planForm}>
            <label className={s.field}>
              <span>Ngày bắt đầu</span>
              <input type="date" className={s.input} value={draft.start} onChange={(e) => setDraft({ ...draft, start: e.target.value })} />
            </label>
            <div className={s.field}>
              <span>Học vào các thứ</span>
              <div className="flex flex-wrap gap-1.5">
                {WEEKDAYS.map((w, i) => {
                  const on = draft.days.includes(i);
                  return (
                    <button
                      key={w}
                      type="button"
                      className={`${s.dayToggle} ${on ? s.dayToggleOn : ''}`}
                      onClick={() => setDraft({ ...draft, days: on ? draft.days.filter((x) => x !== i) : [...draft.days, i].sort() })}
                    >
                      {w}
                    </button>
                  );
                })}
              </div>
            </div>
            <label className={s.field}>
              <span>Giờ học</span>
              <input type="time" className={s.input} value={draft.time} onChange={(e) => setDraft({ ...draft, time: e.target.value })} />
            </label>
            <div className="flex flex-wrap gap-2" style={{ marginTop: 6 }}>
              <button
                type="button"
                className={s.btn}
                disabled={!draft.days.length || !draft.start}
                onClick={() => { savePlan(draft); setEditing(false); }}
              >
                Lưu kế hoạch
              </button>
              {plan && <button type="button" className={s.btnGhost} onClick={() => setEditing(false)}>Huỷ</button>}
            </div>
            <p className={s.quizSub}>
              Gợi ý: 5 buổi/tuần là xong 15 buổi trong 3 tuần. Mỗi buổi 60–90 phút. Học đều quan trọng hơn học nhiều.
            </p>
          </div>
        ) : plan ? (
          <>
            <div className="flex flex-wrap items-center gap-2" style={{ marginBottom: 12 }}>
              <span className={s.p} style={{ margin: 0 }}>
                Học <b>{plan.days.map((d) => WEEKDAYS[d]).join(', ')}</b> lúc <b>{plan.time}</b>, bắt đầu {fmtDate(plan.start)}. Dự kiến xong: <b>{fmtDate(dates[dates.length - 1])}</b>.
              </span>
            </div>
            <div className="flex flex-wrap gap-2" style={{ marginBottom: 16 }}>
              <button type="button" className={s.btn} onClick={downloadIcs}><CalendarPlus size={16} /> Thêm nhắc nhở vào Lịch</button>
              <button type="button" className={s.btnGhost} onClick={() => { setDraft(plan); setEditing(true); }}>Sửa lịch</button>
            </div>
            <p className={s.quizSub} style={{ marginBottom: 12 }}>
              Nút trên tải một file lịch: mở nó trên Mac hoặc iPad là 15 buổi vào app Lịch, mỗi buổi nhắc trước 10 phút, kể cả khi không mở web.
            </p>
            <div className={s.tableWrap} style={{ margin: 0 }}>
              <table className={s.table}>
                <thead><tr><th>Buổi</th><th>Ngày</th><th>Nội dung</th><th>Trạng thái</th></tr></thead>
                <tbody>
                  {DAYS.map((d, i) => {
                    const isDone = dayDone(d, done);
                    const date = dates[i];
                    const st = isDone ? 'Xong' : date < today ? 'Trễ' : date === today ? 'Hôm nay' : '';
                    return (
                      <tr key={d.n} className={s.schedRow} onClick={() => onOpenDay(d.n)}>
                        <td className={`${s.cell} ${s.cellFirst}`}>{d.n}</td>
                        <td className={s.cell} style={{ whiteSpace: 'nowrap' }}>{fmtDate(date)}</td>
                        <td className={s.cell}>{d.lessons.map((l) => l.title).join(' · ')}</td>
                        <td className={s.cell} style={{ whiteSpace: 'nowrap' }}>
                          <span className={isDone ? s.good : st === 'Trễ' ? s.bad : st ? s.linkBtn : s.muted}>{st || '—'}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </section>

      <section className={s.gbox}>
        <div className={s.gboxTitle}>Cách dùng khoá cho hiệu quả</div>
        <ul className={s.noteList}>
          <li className={s.noteItem}>Mỗi buổi: mở <b>Tổng quan buổi</b> → học lần lượt từng bài → làm Homework → xem điểm.</li>
          <li className={s.noteItem}>Bài tập dưới <b>80%</b>: làm lại sau 1 ngày. Lặp lại cách quãng giúp nhớ lâu hơn học dồn.</li>
          <li className={s.noteItem}>Trước mỗi buổi mới, dành 5 phút ôn <b>từ vựng buổi trước</b> ở trang tổng quan của nó.</li>
          <li className={s.noteItem}>Không hiểu thì hỏi <b>gia sư</b> ngay trên trang, đừng để dồn sang buổi sau.</li>
        </ul>
      </section>
      <button type="button" className={s.btnGhost} style={{ marginTop: 16 }} onClick={() => onOpen(INTRO)}>Đọc phần Bắt đầu tại đây</button>
    </>
  );
}
