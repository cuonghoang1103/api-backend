/**
 * Kết quả & chữa bài — bản desktop (04/10/2026).
 *
 * Đủ như web: vòng điểm + ĐẠT/CHƯA ĐẠT, từng câu đánh dấu đúng/sai/bỏ sót kèm
 * giải thích song ngữ; PE có điểm từng tiêu chí, nhận xét, gợi ý, bản ghi giọng
 * nói, đáp án mẫu; lưu đề / lưu câu vào sổ tay + ghi chú; bình luận theo câu;
 * thi lại.
 * Thêm của desktop: bảng câu bên trái tô màu đúng/sai để nhảy thẳng tới câu
 * sai; lọc Tất cả / Sai / Đúng / Đã lưu; bình luận mở theo từng câu (web tải
 * bình luận của MỌI câu ngay khi mở trang — 50 câu là 50 yêu cầu).
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  ArrowLeft, Bookmark, CheckCircle2, Clock, Eye, EyeOff, Languages, Loader2, MessageSquare,
  RotateCw, XCircle, AlertTriangle, Trophy,
} from 'lucide-react';
import { examApi } from '@/lib/api';
import { pickLang } from '@/lib/utils';
import ExamRichContent from '@/app/exam/ExamRichContent';
import ExamQuestionComments from '@/app/exam/ExamQuestionComments';
import { useAppState } from '../../app-state';
import { CHU_CAI, loiDoc, nhanDe, phutGiay, useNgonNguDe, useNoi } from './chung';

interface CauChua {
  id: number; kind: string; sortOrder: number; points: number; prompt: string; imageUrl: string | null;
  options: { text: string }[] | null; correctIndexes: number[]; explanation: string | null;
  language: string | null; starterCode: string | null; sampleSolution: string | null;
  expectedOutput: string | null; rubric: unknown; speakingPrompts: { text: string }[] | null;
  myAnswer: unknown; bookmarked?: boolean; bookmarkNote?: string | null;
}
interface DiemPe {
  score: number; maxScore: number; percent: number; verdict: string; summary: string;
  criteria: { id: string; name: string; score: number; maxScore: number; comment: string }[];
  suggestions: string[]; transcript?: string;
}
interface DuLieu {
  attempt: { id: number; examId: number; status: string; submittedAt: string | null; timeSpentSeconds: number; score: number | null; maxScore: number | null; passed: boolean | null; gradingMode: string; feedback: Record<string, unknown> };
  exam: { id: number; kind: string; peType: string | null; title: string; code: string | null; courseId: number; totalPoints: number; passMark: number };
  examBookmarked?: boolean;
  questions: CauChua[];
}
type T = (vi: string, en: string) => string;
type TrangThai = 'dung' | 'sai' | 'trong' | 'cham' | 'chua';
type Loc = 'all' | 'sai' | 'dung' | 'luu';

function sameSet(a: number[], b: number[]) {
  if (a.length !== b.length) return false;
  const s = [...a].sort((x, y) => x - y); const z = [...b].sort((x, y) => x - y);
  return s.every((v, i) => v === z[i]);
}

export function KetQua({ attemptId }: { attemptId: number }) {
  const { t, en } = useNoi();
  const { navigate } = useAppState();
  const [L, datL] = useNgonNguDe();
  const [d, datD] = useState<DuLieu | null>(null);
  const [loi, datLoi] = useState<string | null>(null);
  const [luuDe, datLuuDe] = useState(false);
  const [luuCau, datLuuCau] = useState<Record<number, { on: boolean; note: string }>>({});
  const [loc, datLoc] = useState<Loc>('all');

  useEffect(() => {
    let song = true;
    examApi.getAttempt(attemptId)
      .then((r) => {
        if (!song) return;
        const x = (r.data as { data: DuLieu }).data;
        datD(x);
        datLuuDe(!!x.examBookmarked);
        const init: Record<number, { on: boolean; note: string }> = {};
        for (const q of x.questions) init[q.id] = { on: !!q.bookmarked, note: q.bookmarkNote || '' };
        datLuuCau(init);
      })
      .catch((e) => { if (song) datLoi(loiDoc(e, t('Không tải được kết quả', 'Could not load the result'))); });
    return () => { song = false; };
  }, [attemptId, t]);

  const batLuuDe = async () => {
    if (!d) return;
    try {
      const r = await examApi.toggleExamBookmark(d.exam.id);
      datLuuDe(r.data.data.bookmarked);
      toast.success(r.data.data.bookmarked ? t('Đã lưu đề', 'Exam saved') : t('Đã bỏ lưu', 'Removed'));
    } catch { toast.error(t('Lỗi', 'Error')); }
  };
  const batLuuCau = useCallback(async (qid: number) => {
    try {
      const cur = luuCau[qid];
      const r = await examApi.toggleQuestionBookmark(qid, cur?.note || undefined);
      datLuuCau((s) => ({ ...s, [qid]: { on: r.data.data.bookmarked, note: s[qid]?.note || '' } }));
      toast.success(r.data.data.bookmarked ? t('Đã lưu câu vào sổ tay', 'Saved to notebook') : t('Đã bỏ lưu', 'Removed'));
    } catch { toast.error(t('Lỗi', 'Error')); }
  }, [luuCau, t]);
  const luuGhiChu = useCallback(async (qid: number, note: string) => {
    try {
      await examApi.updateQuestionBookmarkNote(qid, note);
      datLuuCau((s) => ({ ...s, [qid]: { on: true, note } }));
      toast.success(t('Đã lưu ghi chú', 'Note saved'));
    } catch { toast.error(t('Lỗi', 'Error')); }
  }, [t]);

  const peTheoCau = useMemo(
    () => ((d?.attempt.feedback?.perQuestion as { questionId: number; grade?: DiemPe; ungraded?: boolean }[]) || []),
    [d],
  );

  const trangThai = useCallback((q: CauChua): TrangThai => {
    if (q.kind === 'MCQ') {
      const my = Array.isArray(q.myAnswer) ? (q.myAnswer as number[]) : [];
      if (!my.length) return 'trong';
      return sameSet(my, q.correctIndexes) ? 'dung' : 'sai';
    }
    const g = peTheoCau.find((p) => p.questionId === q.id)?.grade;
    if (!g) return 'chua';
    return g.percent >= 50 ? 'dung' : 'sai';
  }, [peTheoCau]);

  if (loi) {
    return (
      <div className="ctx-trung">
        <div className="ct-empty">
          <AlertTriangle size={26} aria-hidden className="ct-empty-icon" />
          <p>{loi}</p>
          <button type="button" className="ct-btn ct-btn-ghost" onClick={() => navigate('/exam')}>{t('Về Phòng thi', 'Back to Exam Room')}</button>
        </div>
      </div>
    );
  }
  if (!d) return <div className="ctx-trung"><p className="ctx-mo"><Loader2 size={16} className="ct-spin" aria-hidden /> {t('Đang tải kết quả…', 'Loading result…')}</p></div>;

  const { attempt: a, exam, questions } = d;
  const diem = a.score ?? 0;
  const max = a.maxScore ?? exam.totalPoints;
  const pct = max ? Math.round((diem / max) * 100) : 0;
  const dat = a.passed === true;
  const mau = dat ? 'var(--exam-ok)' : 'var(--exam-danger)';
  const fe = a.feedback as { correctCount?: number; total?: number };
  const tt = questions.map(trangThai);
  const soSai = tt.filter((x) => x === 'sai' || x === 'trong').length;
  const soDung = tt.filter((x) => x === 'dung').length;
  const soLuu = questions.filter((q) => luuCau[q.id]?.on).length;
  const hien = questions.map((q, i) => ({ q, i })).filter(({ q, i }) =>
    loc === 'all' ? true : loc === 'sai' ? (tt[i] === 'sai' || tt[i] === 'trong') : loc === 'dung' ? tt[i] === 'dung' : !!luuCau[q.id]?.on);

  return (
    <div className="ctx-kq exam-root" data-ml={L}>
      <header className="ctx-thi-dau">
        <button type="button" className="ctx-icon" onClick={() => navigate('/exam')} title={t('Phòng thi', 'Exam Room')} aria-label={t('Phòng thi', 'Exam Room')}>
          <ArrowLeft size={16} aria-hidden />
        </button>
        <div className="ctx-thi-ten">
          <b>{pickLang(exam.title, L)}</b>
          <span>{nhanDe(exam, en)}{exam.code ? ` · ${exam.code}` : ''} · {t('Kết quả', 'Result')}</span>
        </div>
        <span className="ctx-thanh-gian" />
        <button type="button" className="ctx-nut-phu" data-on={luuDe} onClick={() => void batLuuDe()}>
          <Bookmark size={14} fill={luuDe ? 'currentColor' : 'none'} aria-hidden /> {luuDe ? t('Đã lưu đề', 'Saved') : t('Lưu đề', 'Save paper')}
        </button>
        <button type="button" className="ctx-nn-nho" onClick={() => datL(L === 'en' ? 'vi' : 'en')}><Languages size={13} aria-hidden /> {L === 'en' ? 'EN' : 'VI'}</button>
        <button type="button" className="ctx-nut-chinh" onClick={() => navigate(`/exam/${exam.id}`)}>
          <RotateCw size={14} aria-hidden /> {t('Thi lại', 'Retake')}
        </button>
      </header>

      <div className="ctx-thi-than">
        <aside className="ctx-bang-cau">
          <div className="ctx-kq-diem">
            <div className="exam-ring" style={{ ['--p' as string]: pct, ['--ring-col' as string]: mau, ['--sz' as string]: '128px' }}>
              <div className="exam-ring-hole">
                <div className="ctx-kq-so" style={{ color: mau }}>{diem}</div>
                <div className="ctx-mo">/ {max}</div>
              </div>
            </div>
            <span className={`exam-badge ${dat ? 'exam-badge-pass' : 'exam-badge-fail'}`}>
              {dat ? <CheckCircle2 size={14} aria-hidden /> : <XCircle size={14} aria-hidden />}
              {dat ? t('ĐẠT', 'PASSED') : t('CHƯA ĐẠT', 'NOT PASSED')}
            </span>
            <div className="ctx-kq-phu">
              <span><Trophy size={12} aria-hidden /> {t('Điểm đạt', 'Pass')} ≥ {exam.passMark}</span>
              <span><Clock size={12} aria-hidden /> {phutGiay(a.timeSpentSeconds)}</span>
              {exam.kind === 'FE' && fe.correctCount != null && <span><CheckCircle2 size={12} aria-hidden /> {fe.correctCount}/{fe.total} {t('câu đúng', 'correct')}</span>}
            </div>
          </div>

          <div className="ctx-bang-cau-loc" role="group">
            <button type="button" data-on={loc === 'all'} onClick={() => datLoc('all')}>{t('Tất cả', 'All')} {questions.length}</button>
            <button type="button" data-on={loc === 'sai'} onClick={() => datLoc('sai')}>{t('Sai', 'Wrong')} {soSai}</button>
            <button type="button" data-on={loc === 'dung'} onClick={() => datLoc('dung')}>{t('Đúng', 'Right')} {soDung}</button>
            {soLuu > 0 && <button type="button" data-on={loc === 'luu'} onClick={() => datLoc('luu')}><Bookmark size={11} aria-hidden /> {soLuu}</button>}
          </div>
          <div className="ctx-luoi-cau">
            {questions.map((q, i) => (
              <button key={q.id} type="button" className="ctx-o-cau" data-kq={tt[i]}
                onClick={() => { if (loc !== 'all') datLoc('all'); requestAnimationFrame(() => document.getElementById(`ctx-kq-${q.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })); }}>
                {i + 1}
              </button>
            ))}
          </div>
          <div className="ctx-chu-giai">
            <span><i className="ctx-chu-giai-dung" />{t('Đúng', 'Right')}</span>
            <span><i className="ctx-chu-giai-sai" />{t('Sai', 'Wrong')}</span>
            <span><i className="ctx-chu-giai-trong" />{t('Bỏ trống', 'Blank')}</span>
          </div>
        </aside>

        <main className="ctx-thi-giua">
          <div className="ctx-thi-cot">
            {hien.length === 0 && <p className="ctx-mo">{t('Không có câu nào trong mục này.', 'No questions in this filter.')}</p>}
            {hien.map(({ q, i }) => (
              <TheChua key={q.id} q={q} i={i} L={L} t={t} exam={exam} tt={tt[i]!}
                pe={peTheoCau.find((p) => p.questionId === q.id)}
                luu={luuCau[q.id]} onLuu={() => void batLuuCau(q.id)} onGhiChu={luuGhiChu} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

function TheChua({ q, i, L, t, exam, tt, pe, luu, onLuu, onGhiChu }: {
  q: CauChua; i: number; L: 'en' | 'vi'; t: T; exam: DuLieu['exam']; tt: TrangThai;
  pe?: { grade?: DiemPe; ungraded?: boolean } | undefined; luu?: { on: boolean; note: string } | undefined;
  onLuu: () => void; onGhiChu: (qid: number, note: string) => void;
}) {
  const [anh, datAnh] = useState(false);
  const [bl, datBl] = useState(false);
  const g = pe?.grade;
  const myCode = typeof q.myAnswer === 'string' ? q.myAnswer : null;
  const my = Array.isArray(q.myAnswer) ? (q.myAnswer as number[]) : [];
  return (
    <article className="ctx-cau" id={`ctx-kq-${q.id}`} data-kq={tt}>
      <div className="ctx-cau-dau">
        <span className="ctx-cau-so">{t('Câu', 'Question')} {i + 1}</span>
        <span className="ctx-mo">{q.points} {t('điểm', 'pts')}</span>
        {tt === 'dung' && <span className="exam-badge exam-badge-pass"><CheckCircle2 size={12} aria-hidden /> {t('Đúng', 'Right')}</span>}
        {tt === 'sai' && <span className="exam-badge exam-badge-fail"><XCircle size={12} aria-hidden /> {t('Sai', 'Wrong')}</span>}
        {tt === 'trong' && <span className="exam-badge exam-badge-real">{t('Bỏ trống', 'Blank')}</span>}
        <span className="ctx-thanh-gian" />
        <button type="button" className="ctx-co" data-on={!!luu?.on} onClick={onLuu}>
          <Bookmark size={13} fill={luu?.on ? 'currentColor' : 'none'} aria-hidden /> {luu?.on ? t('Đã lưu', 'Saved') : t('Lưu câu', 'Save')}
        </button>
      </div>
      <div className={q.kind === 'MCQ' ? 'ctx-cau-doi' : 'ctx-cau-mot'}>
      <div className="ctx-cau-trai">
        <div className="ctx-cau-de"><ExamRichContent html={q.prompt} L={L} /></div>
        {q.imageUrl && (
          <div className="ctx-anh-goc">
            <button type="button" className="ctx-nut-phu ctx-nut-nho" onClick={() => datAnh((v) => !v)}>
              {anh ? <EyeOff size={13} aria-hidden /> : <Eye size={13} aria-hidden />} {anh ? t('Ẩn ảnh đề gốc', 'Hide original image') : t('Xem ảnh đề gốc', 'Show original image')}
            </button>
            <img src={q.imageUrl} alt="" hidden={!anh} />
          </div>
        )}
      </div>

      {q.kind === 'MCQ' && (
        <div className="ctx-pa">
          {(q.options || []).map((o, oi) => {
            const dung = q.correctIndexes.includes(oi);
            const chon = my.includes(oi);
            const st = dung && chon ? 'correct' : chon && !dung ? 'wrong' : dung ? 'missed' : undefined;
            return (
              <div key={oi} className="exam-opt" data-state={st} style={{ cursor: 'default' }}>
                <span className="exam-opt-mark">{CHU_CAI[oi]}</span>
                <span className="ctx-pa-chu">
                  <ExamRichContent html={o.text} L={L} inline />
                  {st === 'missed' && <em className="ctx-xanh ctx-pa-ghi">({t('đáp án đúng', 'correct answer')})</em>}
                  {st === 'wrong' && <em className="ctx-do ctx-pa-ghi">({t('bạn chọn', 'your pick')})</em>}
                </span>
              </div>
            );
          })}
          {q.explanation && (
            <div className="exam-explain ctx-giai">
              <div className="ctx-giai-ten">{t('Giải thích', 'Explanation')}</div>
              <ExamRichContent html={q.explanation} L={L} />
            </div>
          )}
        </div>
      )}
      </div>

      {q.kind !== 'MCQ' && g && (
        <div className="ctx-pe-diem">
          <span className={`exam-badge ${g.percent >= (exam.passMark / exam.totalPoints) * 100 ? 'exam-badge-pass' : 'exam-badge-fail'}`}>{g.score}/{g.maxScore} · {g.verdict}</span>
          {myCode && <details><summary>{t('Bài làm của bạn', 'Your submission')}</summary><pre className="exam-terminal">{myCode}</pre></details>}
          {g.summary && <p>{pickLang(g.summary, L)}</p>}
          {g.criteria?.length > 0 && (
            <ul className="ctx-tieuchi">
              {g.criteria.map((c) => (
                <li key={c.id}>
                  <div><b>{pickLang(c.name, L)}</b><span className="exam-timer">{c.score}/{c.maxScore}</span></div>
                  <span className="ctx-vach"><span style={{ width: `${c.maxScore ? (c.score / c.maxScore) * 100 : 0}%` }} /></span>
                  {c.comment && <p className="ctx-mo">{pickLang(c.comment, L)}</p>}
                </li>
              ))}
            </ul>
          )}
          {g.suggestions?.length > 0 && (
            <div className="exam-explain ctx-giai">
              <div className="ctx-giai-ten">{t('Gợi ý cải thiện', 'Suggestions')}</div>
              <ul>{g.suggestions.map((s, si) => <li key={si}>{pickLang(s, L)}</li>)}</ul>
            </div>
          )}
          {g.transcript && <><div className="ctx-nhan-nho">{t('Bản ghi giọng nói', 'Transcript')}</div><p className="ctx-mo"><i>“{g.transcript}”</i></p></>}
          {q.sampleSolution && <details><summary>{t('Xem đáp án mẫu', 'Show reference solution')}</summary><pre className="exam-terminal">{q.sampleSolution}</pre></details>}
          {q.expectedOutput && <details><summary>{t('Kết quả mong đợi', 'Expected output')}</summary><pre className="exam-terminal">{q.expectedOutput}</pre></details>}
        </div>
      )}

      {q.kind !== 'MCQ' && !g && (
        <div className="ctx-pe-diem">
          <p className="ctx-mo">
            {pe?.ungraded
              ? t('AI không chấm được câu này lúc bạn nộp nên câu này KHÔNG bị tính vào điểm (không trừ điểm). Thi lại để được chấm.', 'AI could not grade this question when you submitted, so it was left OUT of the score (no penalty). Retake to get it graded.')
              : t('Chưa có bài chấm cho câu này.', 'No grade for this question.')}
          </p>
          {myCode && <pre className="exam-terminal">{myCode}</pre>}
          {q.sampleSolution && <details><summary>{t('Xem đáp án mẫu', 'Show reference solution')}</summary><pre className="exam-terminal">{q.sampleSolution}</pre></details>}
        </div>
      )}

      {luu?.on && <GhiChu qid={q.id} dau={luu.note} t={t} onLuu={onGhiChu} />}

      <button type="button" className="ctx-link ctx-bl-nut" onClick={() => datBl((v) => !v)}>
        <MessageSquare size={13} aria-hidden /> {bl ? t('Ẩn bình luận', 'Hide discussion') : t('Bình luận về câu này', 'Discuss this question')}
      </button>
      {bl && <ExamQuestionComments questionId={q.id} />}
    </article>
  );
}

function GhiChu({ qid, dau, t, onLuu }: { qid: number; dau: string; t: T; onLuu: (qid: number, note: string) => void }) {
  const [note, datNote] = useState(dau);
  useEffect(() => { datNote(dau); }, [dau]);
  const dirty = note.trim() !== dau.trim();
  return (
    <div className="ctx-ghichu">
      <textarea value={note} onChange={(e) => datNote(e.target.value)} rows={1} className="exam-note"
        placeholder={t('Ghi chú ôn tập (vì sao khó nhớ…)', 'Revision note (why it was tricky…)')} />
      {dirty && <button type="button" className="ctx-nut-chinh ctx-nut-nho" onClick={() => onLuu(qid, note)}>{t('Lưu ghi chú', 'Save note')}</button>}
    </div>
  );
}
