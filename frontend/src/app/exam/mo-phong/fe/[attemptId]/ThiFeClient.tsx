'use client';

/**
 * Phòng thi mô phỏng — làm đề FE (trắc nghiệm) trộn từ ngân hàng, 22/11/2026.
 *
 * Thi thật: đồng hồ theo giờ MÁY CHỦ (bù lệch đồng hồ máy), tự nộp MỘT lần khi hết giờ (cùng luật
 * chống vòng lặp với ExamRoomClient — xem autoSubmitTriedRef ở đó), đáp án ẩn tới khi nộp; máy chủ cũng
 * tự thu bài nếu tab bị đóng quá giờ. Luyện: không giờ, "Kiểm tra" từng câu ⇒ đúng/sai + giải thích, đáp
 * án câu đã kiểm bị khoá. Cả hai: lưới câu, đánh dấu, cỡ chữ, toàn màn hình, TỰ LƯU sau mỗi thao tác.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  ArrowLeft, ArrowRight, Check, Clock, Flag, Maximize2, Minimize2, Minus, Plus, Send, CheckCircle2, XCircle, LayoutGrid, Eye, EyeOff,
} from 'lucide-react';
import { examMockApi, type MockFeAttempt } from '@/lib/api';
import { dinhDangGiay } from '@/lib/examMoPhong';
import ExamRichContent from '../../../ExamRichContent';
import AnhDePhongTo from '@/components/exam/AnhDePhongTo';
import '../../../exam.css';
import '../../mo-phong.css';

type L = 'en' | 'vi';
const CO_KEY = 'ctw-mo-phong-co-chu';
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
const loiCua = (e: unknown, d: string) => (e as { response?: { data?: { message?: string } } })?.response?.data?.message || d;

export default function ThiFeClient({ attemptId }: { attemptId: number }) {
  const router = useRouter();
  const [L, setL] = useState<L>('en'); // đề FE thật bằng tiếng Anh — mặc định EN như Exam Room
  const isVi = L === 'vi';
  const t = useCallback((vi: string, en: string) => (isVi ? vi : en), [isVi]);

  const [data, setData] = useState<MockFeAttempt | null>(null);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [flags, setFlags] = useState<Set<number>>(new Set());
  const [kiem, setKiem] = useState<Record<number, { correct: boolean; correctIndexes: number[]; explanation: string | null }>>({});
  const [co, setCo] = useState(1);
  const [full, setFull] = useState(false);
  const [moLuoi, setMoLuoi] = useState(false);
  const [xacNhan, setXacNhan] = useState(false);
  const [dangNop, setDangNop] = useState(false);
  const [dangKiem, setDangKiem] = useState(false);
  const [luu, setLuu] = useState<{ luc: Date | null; loi: boolean }>({ luc: null, loi: false });
  const [nowMs, setNowMs] = useState(() => Date.now());

  const lechRef = useRef(0); // giờ máy chủ − giờ máy
  const rootRef = useRef<HTMLDivElement>(null);
  const submittedRef = useRef(false);
  const autoSubmitTriedRef = useRef(false);
  const blurRef = useRef(0);
  const dirtyRef = useRef(false);
  const startedRef = useRef(Date.now());

  // ── Nạp đề ──
  useEffect(() => {
    let alive = true;
    examMockApi.getFe(attemptId)
      .then((r) => {
        if (!alive) return;
        const d = r.data.data;
        if (d.attempt.status !== 'IN_PROGRESS') { router.replace(`/exam/attempt/${attemptId}`); return; }
        lechRef.current = new Date(d.attempt.serverNow).getTime() - Date.now();
        startedRef.current = new Date(d.attempt.startedAt).getTime() - lechRef.current;
        setData(d);
        setAnswers(d.answers || {});
        setFlags(new Set(d.progress.flags));
        setIdx(Math.min(d.progress.idx || 0, Math.max(0, d.questions.length - 1)));
        const k: Record<number, { correct: boolean; correctIndexes: number[]; explanation: string | null }> = {};
        for (const q of d.questions) {
          if (q.correctIndexes) {
            const sel = d.answers[String(q.id)] ?? [];
            k[q.id] = { correct: [...sel].sort().join() === [...q.correctIndexes].sort().join(), correctIndexes: q.correctIndexes, explanation: q.explanation ?? null };
          }
        }
        setKiem(k);
      })
      .catch((e) => { toast.error(loiCua(e, 'Không tải được đề')); router.push('/exam/mo-phong'); });
    try { const v = Number(localStorage.getItem(CO_KEY)); if (v >= 0.85 && v <= 1.5) setCo(v); } catch { /* chế độ riêng tư */ }
    return () => { alive = false; };
  }, [attemptId, router]);

  const expiresAt = data?.attempt.expiresAt ? new Date(data.attempt.expiresAt).getTime() - lechRef.current : null;
  const remaining = expiresAt ? expiresAt - nowMs : 0;

  useEffect(() => {
    if (!data || !expiresAt) return;
    const iv = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(iv);
  }, [data, expiresAt]);

  // ── Tự lưu (debounce 700 ms) ──
  const luuNgay = useCallback(async () => {
    if (!data || submittedRef.current || !dirtyRef.current) return;
    dirtyRef.current = false;
    try {
      await examMockApi.saveProgress(attemptId, { answers, flags: [...flags], idx });
      setLuu({ luc: new Date(), loi: false });
    } catch {
      dirtyRef.current = true;
      setLuu((s) => ({ ...s, loi: true }));
    }
  }, [attemptId, data, answers, flags, idx]);

  useEffect(() => {
    if (!data) return;
    const h = setTimeout(() => { void luuNgay(); }, 700);
    return () => clearTimeout(h);
  }, [data, answers, flags, idx, luuNgay]);

  useEffect(() => {
    const onVis = () => { if (document.hidden) { blurRef.current += 1; void luuNgay(); } };
    const onBlur = () => { blurRef.current += 1; };
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('blur', onBlur);
    return () => { document.removeEventListener('visibilitychange', onVis); window.removeEventListener('blur', onBlur); };
  }, [luuNgay]);

  // ── Toàn màn hình ──
  useEffect(() => {
    const onFs = () => setFull(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);
  const coFullscreen = typeof document !== 'undefined' && !!document.documentElement?.requestFullscreen;
  const batFull = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await rootRef.current?.requestFullscreen();
    } catch { toast(t('Trình duyệt không cho toàn màn hình', 'Full screen not allowed by this browser')); }
  }, [t]);

  const doiCo = (d: number) => setCo((c) => {
    const v = Math.round(Math.max(0.85, Math.min(1.5, c + d)) * 100) / 100;
    try { localStorage.setItem(CO_KEY, String(v)); } catch { /* bỏ qua */ }
    return v;
  });

  // ── Nộp ──
  const nop = useCallback(async (tuDong = false) => {
    if (!data || submittedRef.current) return;
    submittedRef.current = true;
    setDangNop(true);
    try {
      await examMockApi.submitFe(attemptId, {
        answers,
        timeSpentSeconds: Math.floor((Date.now() - startedRef.current) / 1000),
        integritySignals: { blurCount: blurRef.current, auto: tuDong },
      });
      try { if (document.fullscreenElement) await document.exitFullscreen(); } catch { /* bỏ qua */ }
      toast.success(t('Đã nộp — đang chấm', 'Submitted — grading'));
      router.push(`/exam/attempt/${attemptId}`);
    } catch (e) {
      submittedRef.current = false;
      setDangNop(false);
      toast.error(`${loiCua(e, t('Nộp bài thất bại', 'Submit failed'))}${tuDong ? t(' — bấm "Nộp bài" để thử lại', ' — press "Submit" to retry') : ''}`);
    }
  }, [attemptId, answers, data, router, t]);

  useEffect(() => {
    if (data && expiresAt && remaining <= 0 && !submittedRef.current && !autoSubmitTriedRef.current) {
      autoSubmitTriedRef.current = true;
      toast(t('Hết giờ — tự động nộp bài', "Time's up — submitting"));
      void nop(true);
    }
  }, [data, expiresAt, remaining, nop, t]);

  const q = data?.questions[idx];
  const luyen = data?.attempt.mode === 'MOCK_PRACTICE';
  const daLam = useMemo(() => (data?.questions ?? []).filter((x) => (answers[String(x.id)]?.length ?? 0) > 0).length, [data, answers]);

  const chon = useCallback((i: number) => {
    if (!q || kiem[q.id]) return;
    dirtyRef.current = true;
    setAnswers((a) => {
      const cur = new Set(a[String(q.id)] ?? []);
      if (q.multiSelect) { if (cur.has(i)) cur.delete(i); else cur.add(i); } else { cur.clear(); cur.add(i); }
      return { ...a, [String(q.id)]: [...cur].sort((x, y) => x - y) };
    });
  }, [q, kiem]);

  const diToi = useCallback((i: number) => {
    if (!data) return;
    dirtyRef.current = true;
    setIdx(Math.max(0, Math.min(data.questions.length - 1, i)));
    setMoLuoi(false);
  }, [data]);

  const doiCo2 = useCallback(() => {
    if (!q) return;
    dirtyRef.current = true;
    setFlags((s) => { const n = new Set(s); if (n.has(q.id)) n.delete(q.id); else n.add(q.id); return n; });
  }, [q]);

  // Phím tắt: ←/→ chuyển câu, 1–6 chọn, F đánh dấu.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (xacNhan || (e.target as HTMLElement)?.closest('input,textarea,select')) return;
      if (e.key === 'ArrowRight') diToi(idx + 1);
      else if (e.key === 'ArrowLeft') diToi(idx - 1);
      else if (/^[1-6]$/.test(e.key) && q && Number(e.key) <= q.options.length) chon(Number(e.key) - 1);
      else if (e.key.toLowerCase() === 'f' && !e.metaKey && !e.ctrlKey) doiCo2();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [idx, q, chon, diToi, doiCo2, xacNhan]);

  const kiemTra = useCallback(async () => {
    if (!q) return;
    const sel = answers[String(q.id)] ?? [];
    if (!sel.length) { toast(t('Chọn đáp án trước đã', 'Pick an answer first')); return; }
    setDangKiem(true);
    try {
      const r = await examMockApi.checkFe(attemptId, q.id, sel);
      setKiem((k) => ({ ...k, [q.id]: { correct: r.data.data.correct, correctIndexes: r.data.data.correctIndexes, explanation: r.data.data.explanation } }));
    } catch (e) { toast.error(loiCua(e, 'Lỗi')); } finally { setDangKiem(false); }
  }, [q, answers, attemptId, t]);

  if (!data || !q) return <div className="exam-root min-h-[60vh] flex items-center justify-center text-text-muted">{isVi ? 'Đang tải…' : 'Loading…'}</div>;

  const tong = data.questions.length;
  const timerCls = remaining <= 60_000 ? 'exam-timer-danger' : remaining <= 300_000 ? 'exam-timer-warn' : 'exam-timer-normal';
  const kq = kiem[q.id];
  const sel = answers[String(q.id)] ?? [];
  const chuaLam = tong - daLam;

  const luoi = (
    <div className="exam-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-semibold text-text-secondary">{t('Danh sách câu', 'Questions')}</div>
        <div className="text-xs text-text-muted">{daLam}/{tong}</div>
      </div>
      <div className="exam-nav-grid">
        {data.questions.map((qq, i) => (
          <button key={qq.id} className="exam-nav-cell" onClick={() => diToi(i)}
            data-answered={(answers[String(qq.id)]?.length ?? 0) > 0} data-current={i === idx} data-flagged={flags.has(qq.id)}
            data-checked={!!kiem[qq.id]} data-ok={kiem[qq.id]?.correct ?? undefined}
            aria-label={`${t('Câu', 'Question')} ${i + 1}`}>{i + 1}</button>
        ))}
      </div>
      <div className="mo-chu-giai">
        <span><span className="mo-o-mau" style={{ background: 'rgba(99,102,241,.16)', borderColor: 'var(--exam-accent)' }} />{t('Đã làm', 'Answered')}</span>
        <span><span className="mo-o-mau" />{t('Chưa làm', 'Blank')}</span>
        <span><span className="mo-cham" style={{ background: 'var(--exam-warn)' }} />{t('Xem lại', 'Review later')}</span>
        {luyen && <span><span className="mo-o-mau" style={{ background: 'rgba(16,185,129,.16)', borderColor: 'var(--exam-ok)' }} />{t('Đúng', 'Right')}</span>}
        {luyen && <span><span className="mo-o-mau" style={{ background: 'rgba(239,68,68,.14)', borderColor: 'var(--exam-danger)' }} />{t('Sai', 'Wrong')}</span>}
      </div>
    </div>
  );

  return (
    <div ref={rootRef} className="exam-root mo-phong min-h-screen" data-ml={L} style={{ ['--mo-co' as string]: co }}>
      <div className="exam-bar">
        <div className="px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <button onClick={() => { if (window.confirm(t('Thoát? Bài đã tự lưu, làm tiếp được ở sảnh mô phỏng.', 'Leave? Your work is saved — resume from the mock lobby.'))) router.push(`/exam/mo-phong?course=${data.paper.courseCode}`); }}
              className="shrink-0 p-2 rounded-lg border border-[var(--border-color)] hover:border-[var(--exam-accent)]" aria-label={t('Thoát', 'Leave')}><ArrowLeft className="w-4 h-4" /></button>
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">{data.paper.courseCode} · FE {luyen ? t('luyện', 'practice') : t('mô phỏng', 'mock')}</div>
              <div className="text-[11px] text-text-muted flex items-center gap-2">
                <span>{daLam}/{tong} {t('đã làm', 'done')}</span>
                <span className="mo-luu" data-loi={luu.loi}>{luu.loi ? t('chưa lưu được — đang thử lại', 'not saved — retrying') : luu.luc ? `${t('đã lưu', 'saved')} ${luu.luc.toLocaleTimeString(isVi ? 'vi-VN' : 'en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}` : ''}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {expiresAt && <div className={`exam-timer flex items-center gap-1 font-bold text-base sm:text-lg ${timerCls}`} role="timer" aria-live="off"><Clock className="w-4 h-4 sm:w-5 sm:h-5" />{dinhDangGiay(remaining / 1000)}</div>}
            <div className="mo-cong-cu">
              <button onClick={() => doiCo(-0.1)} aria-label={t('Chữ nhỏ hơn', 'Smaller text')}><Minus className="w-3.5 h-3.5" />A</button>
              <button onClick={() => doiCo(0.1)} aria-label={t('Chữ lớn hơn', 'Larger text')}><Plus className="w-3.5 h-3.5" />A</button>
              {coFullscreen && <button onClick={batFull} className="hidden sm:inline-flex" aria-label={t('Toàn màn hình', 'Full screen')}>{full ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}</button>}
              <button onClick={() => setL(isVi ? 'en' : 'vi')}>{isVi ? 'EN' : 'VI'}</button>
              <button className="lg:hidden" onClick={() => setMoLuoi((v) => !v)} data-on={moLuoi} aria-label={t('Lưới câu', 'Question grid')}><LayoutGrid className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
        <div className="exam-progress"><div className="exam-progress-fill" style={{ width: `${Math.round((daLam / tong) * 100)}%` }} /></div>
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 grid lg:grid-cols-[1fr_290px] gap-4">
        <div className="min-w-0 mo-noi-dung">
          {moLuoi && <div className="lg:hidden mb-4">{luoi}</div>}
          <div className="exam-card p-4 sm:p-6">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="text-sm font-semibold text-text-secondary flex flex-wrap items-center gap-2">
                <span>{t('Câu', 'Question')} {idx + 1}/{tong}</span>
                {q.multiSelect && <span className="exam-badge exam-badge-fe">{t(`Chọn ${q.selectCount} đáp án`, `Choose ${q.selectCount}`)}</span>}
                {luyen && <span className="text-[11px] font-normal text-text-muted">{q.nhomTen.split('|||')[isVi ? 1 : 0]?.split('—')[0]?.trim()}</span>}
              </div>
              <button onClick={doiCo2} className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg border ${flags.has(q.id) ? 'border-[var(--exam-warn)] text-[var(--exam-warn)]' : 'border-[var(--border-color)] text-text-muted'}`}>
                <Flag className="w-3.5 h-3.5" />{t('Xem lại sau', 'Review later')}
              </button>
            </div>
            <div className="mb-5"><ExamRichContent html={q.prompt} L={L} /></div>
            {q.imageUrl && <AnhGocAn key={q.id} url={q.imageUrl} isVi={isVi} />}
            <div className="space-y-2.5">
              {q.options.map((o, i) => {
                const daChon = sel.includes(i);
                const state = kq ? (kq.correctIndexes.includes(i) ? (daChon ? 'correct' : 'missed') : daChon ? 'wrong' : undefined) : undefined;
                return (
                  <button key={i} className="exam-opt" data-selected={!kq && daChon} data-multi={q.multiSelect} data-state={state}
                    onClick={() => chon(i)} disabled={!!kq} style={kq ? { cursor: 'default' } : undefined}>
                    <span className="exam-opt-mark">{!kq && daChon ? <Check className="w-4 h-4" /> : LETTERS[i]}</span>
                    <ExamRichContent html={o.text} L={L} inline className="pt-0.5" />
                  </button>
                );
              })}
            </div>
            {luyen && !kq && (
              <button onClick={kiemTra} disabled={dangKiem || !sel.length} className="mo-nut-chinh mt-4">{dangKiem ? t('Đang kiểm…', 'Checking…') : t('Kiểm tra', 'Check')}</button>
            )}
            {kq && (
              <div className="mo-ket-qua-luyen" data-ok={kq.correct}>
                <div className="font-semibold flex items-center gap-1.5 mb-1" style={{ color: kq.correct ? 'var(--exam-ok)' : 'var(--exam-danger)' }}>
                  {kq.correct ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  {kq.correct ? t('Đúng', 'Correct') : t(`Sai — đáp án: ${kq.correctIndexes.map((i) => LETTERS[i]).join(', ')}`, `Wrong — answer: ${kq.correctIndexes.map((i) => LETTERS[i]).join(', ')}`)}
                </div>
                {kq.explanation && <ExamRichContent html={kq.explanation} L={L} />}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 mt-4">
            <button disabled={idx === 0} onClick={() => diToi(idx - 1)} className="mo-nut-phu flex-1"><ArrowLeft className="w-4 h-4" />{t('Trước', 'Prev')}</button>
            <button disabled={idx === tong - 1} onClick={() => diToi(idx + 1)} className="mo-nut-phu flex-1">{t('Sau', 'Next')}<ArrowRight className="w-4 h-4" /></button>
          </div>
          <p className="hidden sm:block text-[11px] text-text-muted mt-2">{t('Phím tắt: ← → chuyển câu · 1–6 chọn đáp án · F đánh dấu xem lại', 'Shortcuts: ← → move · 1–6 pick · F flag for review')}</p>
        </div>

        <aside className="lg:sticky lg:top-[70px] self-start space-y-4">
          <div className="hidden lg:block">{luoi}</div>
          <button onClick={() => setXacNhan(true)} disabled={dangNop} className="mo-nut-chinh w-full py-3"><Send className="w-4 h-4" />{dangNop ? t('Đang chấm…', 'Grading…') : t('Nộp bài', 'Submit')}</button>
          <p className="text-[11px] text-text-muted text-center">{luyen ? t('Nộp để xem điểm + thống kê chương/CLO.', 'Submit to get your score + chapter/CLO stats.') : t('Đáp án hiện sau khi nộp.', 'Answers appear after you submit.')}</p>
        </aside>
      </div>

      {xacNhan && (
        <div className="mo-phu" role="dialog" aria-modal="true" aria-labelledby="mo-xac-nhan" onClick={() => setXacNhan(false)}>
          <div className="mo-hop" onClick={(e) => e.stopPropagation()}>
            <h2 id="mo-xac-nhan" className="text-lg font-bold mb-2">{t('Nộp bài?', 'Submit your paper?')}</h2>
            <ul className="text-sm space-y-1 mb-4">
              <li>{t('Đã làm', 'Answered')}: <b>{daLam}/{tong}</b></li>
              <li style={{ color: chuaLam ? 'var(--exam-danger)' : undefined }}>{t('Chưa làm', 'Blank')}: <b>{chuaLam}</b></li>
              <li style={{ color: flags.size ? 'var(--exam-warn)' : undefined }}>{t('Đánh dấu xem lại', 'Flagged for review')}: <b>{flags.size}</b></li>
              {expiresAt && <li>{t('Còn', 'Time left')}: <b className="exam-timer">{dinhDangGiay(remaining / 1000)}</b></li>}
            </ul>
            {chuaLam > 0 && (
              <button className="text-sm text-[var(--exam-accent)] font-semibold mb-3" onClick={() => {
                const i = data.questions.findIndex((x) => !(answers[String(x.id)]?.length));
                setXacNhan(false); if (i >= 0) diToi(i);
              }}>{t('→ Tới câu chưa làm đầu tiên', '→ Go to the first blank question')}</button>
            )}
            <div className="flex gap-2">
              <button className="mo-nut-phu flex-1" onClick={() => setXacNhan(false)}>{t('Làm tiếp', 'Keep working')}</button>
              <button className="mo-nut-chinh flex-1" disabled={dangNop} onClick={() => { setXacNhan(false); void nop(false); }}><Send className="w-4 h-4" />{t('Nộp', 'Submit')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Ảnh quét đề gốc chỉ là tư liệu đối chiếu (đề đã chép thành chữ ở trên) và có ảnh cắt hỏng (FER202 FE3 q39:
// 65×484 px chỉ có cột ô chọn) ⇒ ẩn mặc định như Phòng thi thường (QuestionImageToggle), bấm mới hiện.
// `key={q.id}` ở chỗ gọi ⇒ sang câu khác tự gập lại. Luôn giữ node trong DOM, chỉ đổi `hidden`.
function AnhGocAn({ url, isVi }: { url: string; isVi: boolean }) {
  const [hien, setHien] = useState(false);
  return (
    <div className="mb-5">
      <button type="button" onClick={() => setHien((h) => !h)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-[var(--border-color)] hover:border-[var(--exam-accent)] text-text-secondary">
        {hien ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        {hien ? (isVi ? 'Ẩn ảnh đề gốc' : 'Hide original image') : (isVi ? 'Xem ảnh đề gốc' : 'Show original image')}
      </button>
      <AnhDePhongTo url={url} hidden={!hien} isVi={isVi} className="mt-2.5" />
    </div>
  );
}
