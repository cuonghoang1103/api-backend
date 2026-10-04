/**
 * ============================================================
 * PHÒNG THI TOÀN KHUNG — bản desktop (04/10/2026)
 * ============================================================
 *
 * Giới thiệu đề → đang thi → soát bài → nộp → sang trang kết quả.
 * Đủ bốn dạng như web: FE trắc nghiệm (một/nhiều đáp án, câu code trong đề PT),
 * PE CODE (nộp .zip), PE WRITE (bài viết + ảnh sơ đồ), PE SPEAK (thu âm từng
 * câu, tự sinh câu hỏi nếu đề chưa có). Chế độ CuongMini (không tính giờ, hỏi AI
 * từng câu + bình luận) dùng nguyên `CuongMiniPanel` của web.
 *
 * Thêm của desktop:
 *  • Bảng câu hỏi cố định bên trái (lọc: tất cả / chưa làm / đánh dấu).
 *  • Phím tắt: ←/→ chuyển câu · 1–6 hoặc A–F chọn đáp án · F đánh dấu ·
 *    ⌘/Ctrl+Enter mở màn soát bài.
 *  • Màn SOÁT BÀI trước khi nộp: đếm câu chưa làm / đánh dấu, bấm để nhảy tới.
 *  • Bài làm GHI XUỐNG MÁY sau mỗi thao tác (khoá theo lượt thi) — đóng app, mất
 *    điện, mở lại vẫn còn; bấm vào đề lần nữa thì máy chủ NỐI LẠI lượt đang dở.
 *
 * ─── Ba chốt an toàn (đừng gỡ) ───
 * 1. Đồng hồ tính từ `expiresAt` CỦA MÁY CHỦ, không đếm lùi trong app — đóng app
 *    10 phút rồi mở lại thì đồng hồ đúng như máy chủ đã trừ.
 * 2. Tự nộp khi hết giờ ĐÚNG MỘT LẦN, kể cả khi lần đó hỏng (sự cố 06/08/2026
 *    trên web: vòng tự nộp lặp 18.297 lần/10 phút, đốt sạch rate limit của IP).
 *    Hỏng thì người dùng bấm "Nộp bài" tay — nút KHÔNG khoá khi hết giờ: máy chủ
 *    vẫn nhận bài của lượt còn `IN_PROGRESS` (đọc `submitFinalExam`), khoá nút
 *    là tự tay vứt bài của họ. (Bản native trước 04/10 khoá nút — đã sửa.)
 * 3. Nộp XONG mới xoá bản lưu trên máy. Xoá trước thì một lỗi mạng là mất trắng.
 *
 * Tải file đi `examApi` của web (axios + FormData): khác `api.request()` của app,
 * axios không biến FormData thành chuỗi JSON.
 */
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  AlertTriangle, ArrowLeft, ArrowRight, Bot, Check, CheckCircle2, ClipboardCheck, Clock,
  Download, Eye, EyeOff, FileArchive, FileText, Flag, Keyboard, Languages, Loader2, Mic,
  Play, Sparkles, Square, Upload, X,
} from 'lucide-react';
import { examApi, type ExamHeader, type ExamTakingQuestion } from '@/lib/api';
import { pickLang, sanitizeHtml, stripInlineColors } from '@/lib/utils';
import ExamRichContent from '@/app/exam/ExamRichContent';
import ExamQuestionComments from '@/app/exam/ExamQuestionComments';
import CuongMiniPanel from '@/app/exam/[examId]/CuongMiniPanel';
import { useAppState } from '../../app-state';
import {
  BAI_RONG, CHU_CAI, docBai, dongHo, ghiBai, layLoiNho, loaiDe, loiDoc, nhanDe, xoaBai,
  useNgonNguDe, useNoi, type BaiLam,
} from './chung';

type DeDay = ExamHeader & { questions: ExamTakingQuestion[] };
type Pha = 'tai' | 'gioithieu' | 'thi' | 'nop';
type T = (vi: string, en: string) => string;

/* Câu "vẽ sơ đồ" (SRS PE) — y bộ dò của web: khung chữ không trả lời được nên
   có thêm ô tải ảnh. */
const CAU_SO_DO = /\b(diagram|erd)\b/i;

export function LamBai({ examId }: { examId: number }) {
  const { t, en } = useNoi();
  const { navigate } = useAppState();
  const [L, datL] = useNgonNguDe();

  const [pha, datPha] = useState<Pha>('tai');
  const [de, datDe] = useState<DeDay | null>(null);
  const [loi, datLoi] = useState<string | null>(null);
  const [attemptId, datAttemptId] = useState<number | null>(null);
  const [coAi, datCoAi] = useState(false);
  const [hetLuc, datHetLuc] = useState<number | null>(null);
  const [bai, datBai] = useState<BaiLam>(BAI_RONG);
  const [anhSoDo, datAnhSoDo] = useState<Record<number, File>>({});
  const [zip, datZip] = useState<File | null>(null);
  const [ghiAm, datGhiAm] = useState<Record<string, Blob>>({});
  const [cauSinh, datCauSinh] = useState<Record<number, { text: string; imageUrl?: string }[]>>({});
  const [soat, datSoat] = useState(false);
  const [locNav, datLocNav] = useState<'all' | 'chua' | 'co'>('all');
  const [hetGio, datHetGio] = useState(false);

  const batDauLuc = useRef(Date.now());
  const roiMat = useRef(0);
  const daNop = useRef(false);
  const daTuNop = useRef(false);

  /* ── Tải đề ───────────────────────────────────────────────────────── */
  useEffect(() => {
    let song = true;
    examApi.getForTaking(examId)
      .then((r) => { if (song) { datDe(r.data.data); datPha('gioithieu'); } })
      .catch((e) => { if (song) datLoi(loiDoc(e, t('Không tải được đề thi.', 'Could not load the paper.'))); });
    return () => { song = false; };
  }, [examId, t]);

  /* ── Bắt đầu / nối lại ────────────────────────────────────────────── */
  const batDau = useCallback(async (ai: boolean) => {
    try {
      const r = await examApi.start(examId, ai ? { aiAssisted: true } : undefined);
      const d = r.data.data;
      datAttemptId(d.attemptId);
      datHetLuc(d.expiresAt ? new Date(d.expiresAt).getTime() : null);
      datCoAi(!!d.aiAssisted);
      datBai(docBai(d.attemptId));
      batDauLuc.current = Date.now();
      datPha('thi');
      if (d.resumed) toast(t('Đang làm tiếp lượt thi mở dở — bài đã làm vẫn còn.', 'Resumed your in-progress attempt — your answers are kept.'));
    } catch (e) {
      toast.error(loiDoc(e, t('Không bắt đầu được', 'Could not start')));
    }
  }, [examId, t]);

  /* Từ sảnh bấm "Bắt đầu" ⇒ vào thi luôn, không dừng ở màn giới thiệu. */
  const daXetLoiNho = useRef(false);
  useEffect(() => {
    if (pha !== 'gioithieu' || daXetLoiNho.current) return;
    daXetLoiNho.current = true;
    const nho = layLoiNho(examId);
    if (nho) void batDau(nho.ai);
  }, [pha, examId, batDau]);

  /* ── Ghi bài xuống máy sau MỖI thay đổi ───────────────────────────── */
  useEffect(() => { if (attemptId != null && pha === 'thi') ghiBai(attemptId, bai); }, [bai, attemptId, pha]);

  /* ── Đếm số lần rời cửa sổ (tín hiệu trung thực, gửi kèm bài FE) ──── */
  useEffect(() => {
    if (pha !== 'thi') return;
    const roi = () => { roiMat.current += 1; };
    const an = () => { if (document.hidden) roiMat.current += 1; };
    window.addEventListener('blur', roi);
    document.addEventListener('visibilitychange', an);
    return () => { window.removeEventListener('blur', roi); document.removeEventListener('visibilitychange', an); };
  }, [pha]);

  const giayDaLam = () => Math.max(0, Math.floor((Date.now() - batDauLuc.current) / 1000));

  /* ── Nộp ──────────────────────────────────────────────────────────── */
  const nop = useCallback(async (tuDong = false) => {
    if (!de || attemptId == null || daNop.current) return;
    daNop.current = true;
    datPha('nop');
    datSoat(false);
    const ts = giayDaLam();
    try {
      if (de.kind === 'FE') {
        const ma: Record<string, string> = {};
        for (const [k, v] of Object.entries(bai.ma)) if (v.trim()) ma[k] = v;
        await examApi.submitFe(attemptId, { answers: bai.chon as Record<string, number[]>, codeAnswers: ma, timeSpentSeconds: ts, integritySignals: { blurCount: roiMat.current, auto: tuDong, client: 'desktop' } });
      } else if (de.peType === 'CODE') {
        if (!zip) { daNop.current = false; datPha('thi'); toast.error(t('Hãy chọn file .zip để nộp', 'Please choose a .zip to submit')); return; }
        await examApi.submitCode(attemptId, zip, ts);
      } else if (de.peType === 'WRITE') {
        await examApi.submitWrite(attemptId, { essays: bai.luan as Record<string, string>, images: anhSoDo, timeSpentSeconds: ts });
      } else if (de.peType === 'SPEAK') {
        const q = de.questions.find((x) => x.kind === 'SPEAK');
        if (q) {
          const goiY = (q.speakingPrompts?.length ? q.speakingPrompts : cauSinh[q.id]) || [];
          const blobs: Blob[] = [];
          for (let i = 0; i < goiY.length; i++) { const b = ghiAm[`${q.id}:${i}`]; if (b) blobs.push(b); }
          if (!blobs.length) { daNop.current = false; datPha('thi'); toast.error(t('Hãy thu âm ít nhất một câu', 'Please record at least one answer')); return; }
          await examApi.submitSpeak(attemptId, q.id, blobs, ts);
        }
      }
      xoaBai(attemptId);
      toast.success(t('Đã nộp bài!', 'Submitted!'));
      navigate(`/exam/attempt/${attemptId}`);
    } catch (e) {
      daNop.current = false;
      datPha('thi');
      const m = loiDoc(e, t('Nộp bài thất bại', 'Submit failed'));
      toast.error(tuDong ? `${m} — ${t('hãy bấm "Nộp bài" để thử lại', 'press "Submit" to retry')}` : m);
    }
  }, [de, attemptId, bai, zip, anhSoDo, ghiAm, cauSinh, navigate, t]);

  const khiHetGio = useCallback(() => {
    datHetGio(true);
    if (daNop.current || daTuNop.current) return;
    daTuNop.current = true;
    toast(t('Hết giờ — tự động nộp bài', "Time's up — auto-submitting"));
    void nop(true);
  }, [nop, t]);

  const thoat = useCallback(() => {
    if (pha === 'thi' && !window.confirm(t('Thoát phòng thi? Bài đang làm vẫn được lưu để làm tiếp.', 'Leave the exam? Your progress is saved so you can resume.'))) return;
    navigate('/exam');
  }, [pha, navigate, t]);

  /* ── Câu / trạng thái ─────────────────────────────────────────────── */
  const qs = de?.questions ?? [];
  const idx = Math.min(bai.cau, Math.max(0, qs.length - 1));
  const q = qs[idx];
  const datIdx = useCallback((i: number) => datBai((b) => ({ ...b, cau: i })), []);
  const coCo = useCallback((id: number) => bai.co.includes(id), [bai.co]);
  const batCo = useCallback((id: number) => datBai((b) => ({ ...b, co: b.co.includes(id) ? b.co.filter((x) => x !== id) : [...b.co, id] })), []);

  const xong = useCallback((qq: ExamTakingQuestion) => {
    if (qq.kind === 'CODE') return (bai.ma[qq.id]?.trim().length ?? 0) > 0;
    if (qq.kind === 'WRITE') return (bai.luan[qq.id]?.trim().length ?? 0) > 0 || !!anhSoDo[qq.id];
    return (bai.chon[qq.id]?.length ?? 0) > 0;
  }, [bai, anhSoDo]);

  const coBangCau = !!de && (de.kind === 'FE' || de.peType === 'WRITE');
  const soXong = coBangCau ? qs.filter(xong).length : 0;

  const chonDapAn = useCallback((qq: ExamTakingQuestion, i: number) => {
    datBai((b) => {
      const cur = new Set(b.chon[qq.id] || []);
      if (qq.multiSelect) { if (cur.has(i)) cur.delete(i); else cur.add(i); } else { cur.clear(); cur.add(i); }
      return { ...b, chon: { ...b.chon, [qq.id]: [...cur].sort((x, y) => x - y) } };
    });
  }, []);

  /* ── Phím tắt khi đang thi ────────────────────────────────────────── */
  useEffect(() => {
    if (pha !== 'thi' || !de) return;
    const onKey = (ev: KeyboardEvent) => {
      if ((ev.metaKey || ev.ctrlKey) && ev.key === 'Enter') { ev.preventDefault(); datSoat(true); return; }
      const el = ev.target as HTMLElement | null;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return;
      if (ev.metaKey || ev.ctrlKey || ev.altKey || soat) return;
      if (!coBangCau || !q) return;
      if (ev.key === 'ArrowRight') { ev.preventDefault(); datIdx(Math.min(qs.length - 1, idx + 1)); return; }
      if (ev.key === 'ArrowLeft') { ev.preventDefault(); datIdx(Math.max(0, idx - 1)); return; }
      if (ev.key === 'f' || ev.key === 'F') { ev.preventDefault(); batCo(q.id); return; }
      if (q.kind === 'MCQ' && q.options?.length) {
        const k = ev.key.toUpperCase();
        let i = -1;
        if (/^[1-8]$/.test(k)) i = Number(k) - 1;
        else if (/^[A-H]$/.test(k)) i = CHU_CAI.indexOf(k);
        if (i >= 0 && i < q.options.length) { ev.preventDefault(); chonDapAn(q, i); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pha, de, q, qs.length, idx, coBangCau, soat, datIdx, batCo, chonDapAn]);

  /* ═══ Màn hình ═══ */
  if (loi) {
    return (
      <div className="ctx-trung exam-root" data-ml={L}>
        <div className="ct-empty">
          <AlertTriangle size={26} aria-hidden className="ct-empty-icon" />
          <p>{loi}</p>
          <button type="button" className="ct-btn ct-btn-ghost" onClick={() => navigate('/exam')}>{t('Về Phòng thi', 'Back to Exam Room')}</button>
        </div>
      </div>
    );
  }
  if (pha === 'tai' || !de) {
    return <div className="ctx-trung"><p className="ctx-mo"><Loader2 size={16} className="ct-spin" aria-hidden /> {t('Đang mở đề…', 'Opening paper…')}</p></div>;
  }

  if (pha === 'gioithieu') {
    return <GioiThieu de={de} L={L} datL={datL} en={en} t={t} onBatDau={batDau} onThoat={() => navigate('/exam')} onXemLuot={(id) => navigate(`/exam/attempt/${id}`)} />;
  }

  /* ── Đang thi ─────────────────────────────────────────────────────── */
  const pct = qs.length && coBangCau ? Math.round((soXong / qs.length) * 100) : 0;
  const hienCau = qs.map((qq, i) => ({ qq, i })).filter(({ qq }) =>
    locNav === 'all' ? true : locNav === 'chua' ? !xong(qq) : coCo(qq.id));

  return (
    <div className="ctx-thi exam-root" data-ml={L} data-co-bang={coBangCau}>
      {/* Thanh trên: luôn thấy đồng hồ + tiến độ, kể cả khi cuộn tới câu 50 */}
      <header className="ctx-thi-dau">
        <button type="button" className="ctx-icon" onClick={thoat} title={t('Thoát (bài vẫn được lưu)', 'Exit (progress is saved)')} aria-label={t('Thoát', 'Exit')}>
          <ArrowLeft size={16} aria-hidden />
        </button>
        <div className="ctx-thi-ten">
          <b>{pickLang(de.title, L)}</b>
          <span>
            {nhanDe(de, en)}{de.code ? ` · ${de.code}` : ''}
            {coBangCau ? ` · ${soXong}/${qs.length} ${t('đã làm', 'done')}` : ''}
            {coAi ? ` · ${t('Ôn với CuongMini — không tính giờ', 'CuongMini study room — untimed')}` : ''}
          </span>
        </div>
        <span className="ctx-thanh-gian" />
        {hetLuc != null && <DongHo hetLuc={hetLuc} onHet={khiHetGio} t={t} />}
        <button type="button" className="ctx-nn-nho" onClick={() => datL(L === 'en' ? 'vi' : 'en')}
          title={t('Đổi ngôn ngữ nội dung đề', 'Switch paper language')}>
          <Languages size={13} aria-hidden /> {L === 'en' ? 'EN' : 'VI'}
        </button>
        <button type="button" className="ctx-nut-chinh" onClick={() => datSoat(true)} disabled={pha === 'nop'}
          title={t('Soát bài rồi nộp (⌘/Ctrl+Enter)', 'Review then submit (⌘/Ctrl+Enter)')}>
          {pha === 'nop' ? <Loader2 size={14} className="ct-spin" aria-hidden /> : <ClipboardCheck size={14} aria-hidden />}
          {pha === 'nop' ? t('Đang chấm…', 'Grading…') : t('Nộp bài', 'Submit')}
        </button>
        {coBangCau && <div className="ctx-thi-vach"><span style={{ width: `${pct}%` }} /></div>}
      </header>

      {hetGio && pha === 'thi' && (
        <p className="ctx-bao" data-tone="warn">
          <AlertTriangle size={14} aria-hidden />
          {t('Hết giờ. Lượt tự nộp không thành công — bấm "Nộp bài" để gửi bài bạn đã làm.', 'Time is up. The automatic submit failed — press "Submit" to send what you have.')}
        </p>
      )}

      <div className="ctx-thi-than">
        {/* Bảng câu hỏi */}
        {coBangCau && (
          <aside className="ctx-bang-cau" aria-label={t('Danh sách câu', 'Questions')}>
            <div className="ctx-bang-cau-loc" role="group">
              <button type="button" data-on={locNav === 'all'} onClick={() => datLocNav('all')}>{t('Tất cả', 'All')} {qs.length}</button>
              <button type="button" data-on={locNav === 'chua'} onClick={() => datLocNav('chua')}>{t('Chưa làm', 'Open')} {qs.length - soXong}</button>
              <button type="button" data-on={locNav === 'co'} onClick={() => datLocNav('co')}><Flag size={11} aria-hidden /> {bai.co.length}</button>
            </div>
            <div className="ctx-luoi-cau">
              {hienCau.map(({ qq, i }) => (
                <button key={qq.id} type="button" className="ctx-o-cau" data-xong={xong(qq)} data-dang={i === idx} data-co={coCo(qq.id)}
                  onClick={() => datIdx(i)} title={qq.kind === 'CODE' ? t('Câu lập trình', 'Coding question') : undefined}>
                  {i + 1}{qq.kind === 'CODE' ? '⌨' : ''}
                </button>
              ))}
              {hienCau.length === 0 && <p className="ctx-mo">{t('Không có câu nào.', 'Nothing here.')}</p>}
            </div>
            <div className="ctx-chu-giai">
              <span><i className="ctx-chu-giai-xong" />{t('Đã làm', 'Answered')}</span>
              <span><i className="ctx-chu-giai-co" />{t('Đánh dấu', 'Flagged')}</span>
            </div>
            <div className="ctx-phim">
              <Keyboard size={12} aria-hidden />
              <span><kbd>←</kbd><kbd>→</kbd> {t('chuyển câu', 'move')}</span>
              {de.kind === 'FE' && <span><kbd>1</kbd>–<kbd>6</kbd> / <kbd>A</kbd>–<kbd>F</kbd> {t('chọn', 'pick')}</span>}
              <span><kbd>F</kbd> {t('đánh dấu', 'flag')}</span>
              <span><kbd>⌘</kbd><kbd>↵</kbd> {t('nộp', 'submit')}</span>
            </div>
            <p className="ctx-luu-may"><Check size={12} aria-hidden /> {t('Bài làm tự lưu trên máy', 'Answers auto-saved on this computer')}</p>
          </aside>
        )}

        <main className="ctx-thi-giua">
          <div className="ctx-thi-cot">
            {de.kind === 'FE' && q && q.kind === 'CODE' && (
              <CauCode key={q.id} q={q} idx={idx} tong={qs.length} L={L} t={t}
                giaTri={bai.ma[q.id] ?? q.starterCode ?? ''}
                onDoi={(v) => datBai((b) => ({ ...b, ma: { ...b.ma, [q.id]: v } }))}
                co={coCo(q.id)} onCo={() => batCo(q.id)} />
            )}
            {de.kind === 'FE' && q && q.kind !== 'CODE' && (
              <CauTracNghiem q={q} idx={idx} tong={qs.length} L={L} t={t}
                chon={bai.chon[q.id] || []} co={coCo(q.id)} onCo={() => batCo(q.id)}
                onChon={(i) => chonDapAn(q, i)} />
            )}
            {de.kind === 'FE' && coAi && q && <ExamQuestionComments key={`bl-${q.id}`} questionId={q.id} />}

            {de.kind === 'PE' && de.peType === 'CODE' && <NopZip de={de} L={L} t={t} zip={zip} datZip={datZip} />}

            {de.kind === 'PE' && de.peType === 'WRITE' && q && (
              <CauViet key={q.id} q={q} idx={idx} tong={qs.length} L={L} t={t}
                giaTri={bai.luan[q.id] || ''}
                onDoi={(v) => datBai((b) => ({ ...b, luan: { ...b.luan, [q.id]: v } }))}
                anh={anhSoDo[q.id]}
                onAnh={(f) => datAnhSoDo((d) => { const n = { ...d }; if (f) n[q.id] = f; else delete n[q.id]; return n; })} />
            )}

            {de.kind === 'PE' && de.peType === 'SPEAK' && (
              <PhanNoi de={de} L={L} t={t} ghiAm={ghiAm} datGhiAm={datGhiAm} cauSinh={cauSinh} datCauSinh={datCauSinh} />
            )}

            {coBangCau && (
              <nav className="ctx-chuyen">
                <button type="button" className="ctx-nut-phu" disabled={idx === 0} onClick={() => datIdx(idx - 1)}>
                  <ArrowLeft size={14} aria-hidden /> {t('Câu trước', 'Previous')}
                </button>
                <span className="ctx-mo">{t('Câu', 'Question')} {idx + 1}/{qs.length}</span>
                {idx < qs.length - 1 ? (
                  <button type="button" className="ctx-nut-phu" onClick={() => datIdx(idx + 1)}>
                    {t('Câu sau', 'Next')} <ArrowRight size={14} aria-hidden />
                  </button>
                ) : (
                  <button type="button" className="ctx-nut-chinh" onClick={() => datSoat(true)}>
                    <ClipboardCheck size={14} aria-hidden /> {t('Soát & nộp', 'Review & submit')}
                  </button>
                )}
              </nav>
            )}
          </div>
        </main>
      </div>

      {soat && (
        <SoatBai de={de} t={t} coBangCau={coBangCau} soXong={soXong}
          chua={qs.map((qq, i) => ({ qq, i })).filter(({ qq }) => !xong(qq)).map(({ i }) => i)}
          co={qs.map((qq, i) => ({ qq, i })).filter(({ qq }) => coCo(qq.id)).map(({ i }) => i)}
          zip={zip} soGhiAm={Object.keys(ghiAm).length} dangNop={pha === 'nop'}
          onDi={(i) => { datIdx(i); datSoat(false); }} onDong={() => datSoat(false)} onNop={() => void nop(false)} />
      )}

      {de.kind === 'FE' && coAi && attemptId != null && q && (
        <CuongMiniPanel key={q.id} examId={examId} attemptId={attemptId} questionId={q.id}
          questionLabel={`${t('Câu', 'Question')} ${idx + 1}`} isVi={!en} />
      )}
    </div>
  );
}

/* ── Đồng hồ: component riêng để chỉ NÓ vẽ lại mỗi giây, không phải cả phòng ── */
const DongHo = memo(function DongHo({ hetLuc, onHet, t }: { hetLuc: number; onHet: () => void; t: T }) {
  const [bay, datBay] = useState(() => Date.now());
  const goiHet = useRef(onHet);
  goiHet.current = onHet;
  const daBao = useRef(false);
  useEffect(() => {
    const h = window.setInterval(() => datBay(Date.now()), 1000);
    return () => window.clearInterval(h);
  }, []);
  const con = hetLuc - bay;
  useEffect(() => {
    if (con <= 0 && !daBao.current) { daBao.current = true; goiHet.current(); }
  }, [con]);
  const muc = con <= 60_000 ? 'het' : con <= 300_000 ? 'sap' : 'thuong';
  return (
    <span className="ctx-dongho exam-timer" data-muc={muc} role="timer" aria-label={t('Thời gian còn lại', 'Time remaining')}>
      <Clock size={15} aria-hidden /> {dongHo(con)}
    </span>
  );
});

/* ── Màn giới thiệu ────────────────────────────────────────────────────── */
function GioiThieu({ de, L, datL, en, t, onBatDau, onThoat, onXemLuot }: {
  de: DeDay; L: 'en' | 'vi'; datL: (l: 'en' | 'vi') => void; en: boolean; t: T;
  onBatDau: (ai: boolean) => Promise<void>; onThoat: () => void; onXemLuot: (id: number) => void;
}) {
  const [dang, datDang] = useState<null | 'thi' | 'ai'>(null);
  const l = loaiDe(de);
  const toanCode = de.kind === 'FE' && de.questions.every((x) => x.kind === 'CODE');
  const coCode = de.kind === 'FE' && de.questions.some((x) => x.kind === 'CODE');
  const moTa = de.kind === 'FE'
    ? toanCode
      ? t('Đề gồm toàn câu lập trình: gõ code ngay trong phòng thi cho từng câu, AI chấm theo tiêu chí.', 'All coding questions: type your code right here for each one; AI grades it against a rubric.')
      : coCode
        ? t('Trắc nghiệm chấm tự động; câu lập trình bạn gõ code ngay trong phòng và AI chấm theo tiêu chí.', 'MCQs are auto-graded; for the coding ones you type code right here and AI grades it.')
        : t('Chọn đáp án cho từng câu. Có câu chọn nhiều đáp án.', 'Answer each question. Some allow multiple answers.')
    : de.peType === 'CODE'
      ? t('Đọc đề, viết code ở IDE/VS Code của bạn, nén tất cả file thành .zip rồi nộp để AI chấm.', 'Read the problems, code in your own IDE/VS Code, then upload all files as one .zip for AI grading.')
      : de.peType === 'WRITE'
        ? t('Viết bài bằng TIẾNG ANH ngay trong phòng thi. Bài được AI chấm theo tiêu chí.', 'Write your answer in ENGLISH here in the exam room. Graded by AI against a rubric.')
        : t('Thu âm câu trả lời bằng tiếng Anh cho từng câu hỏi. AI chấm nội dung & phát âm.', 'Record your English answer for each question. AI grades content & pronunciation.');

  const bam = async (ai: boolean) => { datDang(ai ? 'ai' : 'thi'); try { await onBatDau(ai); } finally { datDang(null); } };

  return (
    <div className="ctx-gt exam-root" data-ml={L}>
      <div className="ctx-gt-dau">
        <button type="button" className="ctx-nut-phu" onClick={onThoat}><ArrowLeft size={14} aria-hidden /> {t('Phòng thi', 'Exam Room')}</button>
        <span className="ctx-thanh-gian" />
        <button type="button" className="ctx-nn-nho" onClick={() => datL(L === 'en' ? 'vi' : 'en')}><Languages size={13} aria-hidden /> {L === 'en' ? 'EN' : 'VI'}</button>
      </div>
      <div className="ctx-gt-luoi">
        <section className="ctx-gt-chinh">
          <div className="ctx-ct-nhan">
            <span className="exam-badge exam-badge-fe">
              {de.kind === 'FE' ? (toanCode ? t('Lập trình (FE)', 'Coding (FE)') : nhanDe(de, en)) : `PE · ${de.peType}`}
            </span>
            {l === 'PT' && <span className="exam-badge exam-badge-pt">{t('Kiểm tra tiến độ', 'Progress Test')}</span>}
            {de.source === 'REAL' && <span className="exam-badge exam-badge-real">{t('Đề thật', 'Real paper')}</span>}
            {de.code && <span className="ctx-ma">{de.code}</span>}
          </div>
          <h1 className="ctx-gt-ten">{pickLang(de.title, L)}</h1>
          {de.description && <p className="ctx-gt-mota">{pickLang(de.description, L)}</p>}
          <p className="exam-explain ctx-gt-luat">{moTa}</p>
          {de.instructions && (
            <div className="ctx-gt-hd">
              <h2>{t('Hướng dẫn làm bài', 'Instructions')}</h2>
              <div className="rich-content" data-ml={L}
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(stripInlineColors(pickLang(de.instructions, L))) }} />
            </div>
          )}
          {de.attachmentUrl && (
            <a className="ctx-ct-file" href={de.attachmentUrl} download target="_blank" rel="noreferrer">
              <Download size={14} aria-hidden /> {pickLang(de.attachmentName || 'Download exam files (Given)|||Tải file đề (Given)', L)}
            </a>
          )}
        </section>

        <aside className="ctx-gt-ben">
          <dl className="ctx-so">
            <div><dt>{t('Thời gian', 'Duration')}</dt><dd>{de.durationMinutes}′</dd></div>
            <div><dt>{t('Số câu', 'Questions')}</dt><dd>{de.questions.length}</dd></div>
            <div><dt>{t('Điểm tối đa', 'Max score')}</dt><dd>{de.totalPoints}</dd></div>
            <div><dt>{t('Điểm đạt', 'Pass')}</dt><dd>≥ {de.passMark}</dd></div>
          </dl>
          {de.my && de.my.attempts > 0 && (
            <p className="ctx-gt-cu">
              {t('Lần trước', 'Previous')}: <b>{de.my.lastScore ?? '—'}</b>/{de.totalPoints}
              {de.my.bestScore != null && <> · {t('Cao nhất', 'Best')}: <b>{de.my.bestScore}</b></>}
              {de.my.lastAttemptId && <> · <button type="button" className="ctx-link" onClick={() => onXemLuot(de.my!.lastAttemptId!)}>{t('Xem lại', 'Review')}</button></>}
            </p>
          )}
          <button type="button" className="ctx-nut-chinh ctx-nut-to" onClick={() => void bam(false)} disabled={dang !== null}>
            {dang === 'thi' ? <Loader2 size={16} className="ct-spin" aria-hidden /> : <Play size={16} aria-hidden />}
            {de.my?.inProgressId ? t('Tiếp tục bài thi', 'Resume attempt') : t('Bắt đầu thi', 'Start exam')}
          </button>
          <button type="button" className="ctx-nut-ai ctx-nut-to" onClick={() => void bam(true)} disabled={dang !== null}>
            {dang === 'ai' ? <Loader2 size={16} className="ct-spin" aria-hidden /> : <Bot size={16} aria-hidden />}
            {de.my?.aiInProgressId ? t('Tiếp tục với CuongMini', 'Continue with CuongMini') : t('Ôn với CuongMini', 'Study with CuongMini')}
          </button>
          <p className="ctx-mo ctx-gt-chu">
            {t('CuongMini: phòng ôn không tính giờ, làm từng câu, hỏi AI và bình luận (Pro). Nếu AI đang bận, vẫn xem được đáp án và bình luận.', 'CuongMini: an untimed study room — question by question, ask AI and discuss (Pro). If the AI is busy you can still reveal answers and comment.')}
          </p>
          <ul className="ctx-gt-meo">
            <li><Clock size={13} aria-hidden /> {t('Đồng hồ chạy theo máy chủ, tự nộp một lần khi hết giờ.', 'The timer follows the server and auto-submits once when it ends.')}</li>
            <li><Check size={13} aria-hidden /> {t('Bài làm tự lưu trên máy — đóng app vẫn làm tiếp được.', 'Answers auto-save on this computer — close the app and resume later.')}</li>
            <li><Keyboard size={13} aria-hidden /> {t('Phím tắt: ←/→ chuyển câu, 1–6 chọn đáp án, F đánh dấu.', 'Shortcuts: ←/→ move, 1–6 pick, F flag.')}</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}

/* ── Ảnh gốc của câu (đóng sẵn — chữ đã chép lại ở trên) ──────────────── */
function AnhGoc({ url, t }: { url: string; t: T }) {
  const [mo, datMo] = useState(false);
  return (
    <div className="ctx-anh-goc">
      <button type="button" className="ctx-nut-phu ctx-nut-nho" onClick={() => datMo((v) => !v)}>
        {mo ? <EyeOff size={13} aria-hidden /> : <Eye size={13} aria-hidden />}
        {mo ? t('Ẩn ảnh đề gốc', 'Hide original image') : t('Xem ảnh đề gốc', 'Show original image')}
      </button>
      {/* Luôn trong DOM, chỉ đổi `hidden` — xem chú thích cùng chỗ ở bản web. */}
      <img src={url} alt="" hidden={!mo} />
    </div>
  );
}

function DauCau({ idx, tong, diem, t, co, onCo, phu }: { idx: number; tong: number; diem?: number; t: T; co: boolean; onCo: () => void; phu?: React.ReactNode }) {
  return (
    <div className="ctx-cau-dau">
      <span className="ctx-cau-so">{t('Câu', 'Question')} {idx + 1}<small>/{tong}</small></span>
      {diem != null && <span className="ctx-mo">{diem} {t('điểm', 'pts')}</span>}
      {phu}
      <span className="ctx-thanh-gian" />
      <button type="button" className="ctx-co" data-on={co} onClick={onCo} title={t('Đánh dấu (F)', 'Flag (F)')}>
        <Flag size={13} aria-hidden /> {co ? t('Đã đánh dấu', 'Flagged') : t('Đánh dấu', 'Flag')}
      </button>
    </div>
  );
}

function CauTracNghiem({ q, idx, tong, L, t, chon, co, onCo, onChon }: {
  q: ExamTakingQuestion; idx: number; tong: number; L: 'en' | 'vi'; t: T;
  chon: number[]; co: boolean; onCo: () => void; onChon: (i: number) => void;
}) {
  return (
    <article className="ctx-cau">
      <DauCau idx={idx} tong={tong} t={t} co={co} onCo={onCo}
        phu={q.multiSelect ? <span className="exam-badge exam-badge-fe">{t(`Chọn ${q.selectCount} đáp án`, `Choose ${q.selectCount}`)}</span> : undefined} />
      {/* Hai khối trái/phải: hẹp thì xếp chồng; vùng thi đủ rộng thì ĐỀ bên trái,
          ĐÁP ÁN bên phải như phần mềm thi trên máy (exam-desk.css). */}
      <div className="ctx-cau-doi">
        <div className="ctx-cau-trai">
          <div className="ctx-cau-de"><ExamRichContent html={q.prompt} L={L} /></div>
          {q.imageUrl && <AnhGoc key={q.id} url={q.imageUrl} t={t} />}
        </div>
        <div className="ctx-pa">
          {(q.options || []).map((o, i) => {
            const sel = chon.includes(i);
            return (
              <button key={i} type="button" className="exam-opt" data-selected={sel} data-multi={q.multiSelect} onClick={() => onChon(i)}>
                <span className="exam-opt-mark">{sel ? <Check size={15} aria-hidden /> : CHU_CAI[i]}</span>
                <ExamRichContent html={o.text} L={L} inline className="ctx-pa-chu" />
                <kbd className="ctx-pa-phim">{i + 1}</kbd>
              </button>
            );
          })}
        </div>
      </div>
    </article>
  );
}

/** Ô gõ code: Tab chèn hai dấu cách thay vì rời ô — y web. */
function OMa({ giaTri, onDoi, t, cao = 320 }: { giaTri: string; onDoi: (v: string) => void; t: T; cao?: number }) {
  return (
    <textarea className="ctx-o-ma" value={giaTri} spellCheck={false} style={{ minHeight: cao }}
      placeholder={t('// Viết code của bạn ở đây…', '// Write your code here…')}
      onChange={(e) => onDoi(e.target.value)}
      onKeyDown={(e) => {
        if (e.key !== 'Tab') return;
        e.preventDefault();
        const el = e.currentTarget;
        const s = el.selectionStart; const k = el.selectionEnd;
        onDoi(`${giaTri.slice(0, s)}  ${giaTri.slice(k)}`);
        requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = s + 2; });
      }} />
  );
}

function CauCode({ q, idx, tong, L, t, giaTri, onDoi, co, onCo }: {
  q: ExamTakingQuestion; idx: number; tong: number; L: 'en' | 'vi'; t: T;
  giaTri: string; onDoi: (v: string) => void; co: boolean; onCo: () => void;
}) {
  const dong = giaTri ? giaTri.split('\n').length : 0;
  return (
    <article className="ctx-cau">
      <DauCau idx={idx} tong={tong} diem={q.points} t={t} co={co} onCo={onCo}
        phu={<span className="exam-badge exam-badge-pe">{t('Lập trình', 'Coding')}{q.language ? ` · ${q.language}` : ''}</span>} />
      <div className="ctx-cau-de"><ExamRichContent html={q.prompt} L={L} /></div>
      {q.imageUrl && <AnhGoc url={q.imageUrl} t={t} />}
      {q.expectedOutput && (<><div className="ctx-nhan-nho">{t('Kết quả mong đợi', 'Expected output')}</div><pre className="exam-terminal">{q.expectedOutput}</pre></>)}
      <OMa giaTri={giaTri} onDoi={onDoi} t={t} />
      <p className="ctx-mo">{dong} {t('dòng', 'lines')} · {t('AI chấm theo tiêu chí', 'Graded by AI against a rubric')}</p>
    </article>
  );
}

function NopZip({ de, L, t, zip, datZip }: { de: DeDay; L: 'en' | 'vi'; t: T; zip: File | null; datZip: (f: File | null) => void }) {
  const [keo, datKeo] = useState(false);
  const nhan = (f: File | undefined | null) => {
    if (!f) return;
    if (!/\.zip$/i.test(f.name)) { toast.error(t('Chỉ nhận file .zip', 'Only .zip files are accepted')); return; }
    datZip(f);
  };
  return (
    <div className="ctx-pe">
      {de.attachmentUrl && (
        <a className="ctx-ct-file" href={de.attachmentUrl} download target="_blank" rel="noreferrer">
          <Download size={14} aria-hidden /> {pickLang(de.attachmentName || 'Download exam files (Given)|||Tải file đề (Given)', L)}
          <span className="ctx-mo">{t('giải nén rồi làm', 'extract & work on it')}</span>
        </a>
      )}
      {de.questions.filter((x) => x.kind === 'CODE').map((x, i) => (
        <article key={x.id} className="ctx-cau">
          <div className="ctx-cau-dau">
            <span className="ctx-cau-so">{t('Câu', 'Question')} {i + 1}</span>
            <span className="ctx-mo">{x.points} {t('điểm', 'pts')}{x.language ? ` · ${x.language}` : ''}</span>
          </div>
          <div className="ctx-cau-de"><ExamRichContent html={x.prompt} L={L} /></div>
          {x.imageUrl && <AnhGoc url={x.imageUrl} t={t} />}
          {x.starterCode && (<><div className="ctx-nhan-nho">{t('Mã cho sẵn', 'Starter')}</div><pre className="exam-terminal">{x.starterCode}</pre></>)}
          {x.expectedOutput && (<><div className="ctx-nhan-nho">{t('Ví dụ / kết quả mong đợi', 'Example / expected output')}</div><pre className="exam-terminal">{x.expectedOutput}</pre></>)}
        </article>
      ))}
      {/* Kéo-thả thẳng file .zip từ Finder vào khung — tiện hơn hộp chọn file. */}
      <label className="ctx-tha" data-keo={keo} data-co={!!zip}
        onDragOver={(e) => { e.preventDefault(); datKeo(true); }}
        onDragLeave={() => datKeo(false)}
        onDrop={(e) => { e.preventDefault(); datKeo(false); nhan(e.dataTransfer.files?.[0]); }}>
        <input type="file" accept=".zip,application/zip" hidden
          onChange={(e) => { const f = [...(e.target.files ?? [])][0] ?? null; e.target.value = ''; nhan(f); }} />
        {zip ? <FileArchive size={26} aria-hidden /> : <Upload size={26} aria-hidden />}
        <b>{zip ? zip.name : t('Kéo file .zip vào đây hoặc bấm để chọn', 'Drop your .zip here or click to choose')}</b>
        <span className="ctx-mo">
          {zip
            ? `${(zip.size / 1048576).toFixed(2)} MB — ${t('bấm "Nộp bài" để gửi', 'press "Submit" to send')}`
            : t('Nén tất cả file mã nguồn (Q1.c, Q2.c…) thành một .zip. AI chấm từng câu theo đề + đáp án mẫu.', 'Zip all your source files (Q1.c, Q2.c…) into one .zip. AI grades each question against the spec.')}
        </span>
        {zip && <button type="button" className="ctx-link" onClick={(e) => { e.preventDefault(); datZip(null); }}><X size={12} aria-hidden /> {t('Bỏ file', 'Remove')}</button>}
      </label>
    </div>
  );
}

function CauViet({ q, idx, tong, L, t, giaTri, onDoi, anh, onAnh }: {
  q: ExamTakingQuestion; idx: number; tong: number; L: 'en' | 'vi'; t: T;
  giaTri: string; onDoi: (v: string) => void; anh?: File | undefined; onAnh: (f: File | null) => void;
}) {
  const tu = giaTri.trim() ? giaTri.trim().split(/\s+/).length : 0;
  const soDo = CAU_SO_DO.test(q.prompt);
  const [xem, datXem] = useState<string | null>(null);
  useEffect(() => {
    if (!anh) { datXem(null); return undefined; }
    const u = URL.createObjectURL(anh);
    datXem(u);
    return () => URL.revokeObjectURL(u);
  }, [anh]);
  return (
    <article className="ctx-cau">
      <div className="ctx-cau-dau">
        <FileText size={15} aria-hidden />
        <span className="ctx-cau-so">{t('Câu', 'Question')} {idx + 1}<small>/{tong}</small></span>
        <span className="ctx-mo">{q.points} {t('điểm', 'pts')}</span>
      </div>
      <div className="ctx-cau-de"><ExamRichContent html={q.prompt} L={L} /></div>
      {q.imageUrl && <AnhGoc url={q.imageUrl} t={t} />}
      {soDo && (
        <div className="ctx-so-do">
          <div className="ctx-nhan-nho">{t('Ảnh sơ đồ bạn đã vẽ (AI chấm theo ảnh này)', 'Your drawn diagram (AI grades from this image)')}</div>
          {xem ? (
            <>
              <img src={xem} alt={t('Ảnh sơ đồ', 'Diagram')} />
              <button type="button" className="ctx-link" onClick={() => onAnh(null)}>{t('Xoá ảnh', 'Remove image')}</button>
            </>
          ) : (
            <label className="ctx-nut-phu ctx-nut-nho">
              <Upload size={13} aria-hidden /> {t('Chọn ảnh sơ đồ (PNG/JPG)', 'Choose diagram image (PNG/JPG)')}
              <input type="file" accept="image/png,image/jpeg,image/webp" hidden
                onChange={(e) => { const f = [...(e.target.files ?? [])][0] ?? null; e.target.value = ''; onAnh(f); }} />
            </label>
          )}
        </div>
      )}
      <textarea className="ctx-o-viet" value={giaTri} onChange={(e) => onDoi(e.target.value)}
        placeholder={soDo ? t('Mô tả thêm sơ đồ (không bắt buộc)…', 'Optionally describe the diagram in words…') : t('Viết bài của bạn bằng tiếng Anh tại đây…', 'Write your answer in English here…')} />
      <p className="ctx-mo">{tu} {t('từ', 'words')} · {t('Viết bằng tiếng Anh', 'Write in English')}</p>
    </article>
  );
}

function PhanNoi({ de, L, t, ghiAm, datGhiAm, cauSinh, datCauSinh }: {
  de: DeDay; L: 'en' | 'vi'; t: T;
  ghiAm: Record<string, Blob>; datGhiAm: React.Dispatch<React.SetStateAction<Record<string, Blob>>>;
  cauSinh: Record<number, { text: string; imageUrl?: string }[]>;
  datCauSinh: React.Dispatch<React.SetStateAction<Record<number, { text: string; imageUrl?: string }[]>>>;
}) {
  const q = de.questions.find((x) => x.kind === 'SPEAK');
  const [dangSinh, datDangSinh] = useState(false);
  if (!q) return <p className="ctx-mo">{t('Đề không có câu nói.', 'This paper has no speaking task.')}</p>;
  const goiY = (q.speakingPrompts?.length ? q.speakingPrompts : cauSinh[q.id]) || [];
  const sinh = async () => {
    datDangSinh(true);
    try {
      const r = await examApi.genSpeakingQuestions(q.id, 4);
      datCauSinh((g) => ({ ...g, [q.id]: r.data.data }));
    } catch (e) { toast.error(loiDoc(e, t('Không tạo được câu hỏi', 'Could not generate questions'))); }
    finally { datDangSinh(false); }
  };
  const daThu = goiY.filter((_, i) => ghiAm[`${q.id}:${i}`]).length;
  return (
    <div className="ctx-pe">
      <article className="ctx-cau">
        <div className="ctx-cau-dau">
          <Mic size={15} aria-hidden />
          <span className="ctx-cau-so">{t('Đề nói', 'Speaking task')}</span>
          <span className="ctx-mo">{q.points} {t('điểm', 'pts')}</span>
          {goiY.length > 0 && <><span className="ctx-thanh-gian" /><span className="ctx-mo">{daThu}/{goiY.length} {t('đã thu', 'recorded')}</span></>}
        </div>
        <div className="ctx-cau-de"><ExamRichContent html={q.prompt} L={L} /></div>
      </article>
      {goiY.length === 0 && (
        <div className="ctx-cau ctx-giua-chu">
          <p>{t('Đề chưa có câu hỏi nói. Tạo câu hỏi từ đề để luyện:', 'This paper has no speaking questions yet. Generate some from the topic:')}</p>
          <button type="button" className="ctx-nut-chinh" onClick={() => void sinh()} disabled={dangSinh}>
            {dangSinh ? <Loader2 size={14} className="ct-spin" aria-hidden /> : <Sparkles size={14} aria-hidden />}
            {dangSinh ? t('Đang tạo…', 'Generating…') : t('Tạo câu hỏi', 'Generate questions')}
          </button>
        </div>
      )}
      {goiY.map((p, i) => (
        <MayThu key={i} so={i} chu={pickLang(p.text, L)} anh={p.imageUrl} t={t}
          blob={ghiAm[`${q.id}:${i}`]} onXong={(b) => datGhiAm((r) => ({ ...r, [`${q.id}:${i}`]: b }))} />
      ))}
    </div>
  );
}

function MayThu({ so, chu, anh, t, blob, onXong }: { so: number; chu: string; anh?: string | undefined; t: T; blob?: Blob | undefined; onXong: (b: Blob) => void }) {
  const [dangThu, datDangThu] = useState(false);
  const [giay, datGiay] = useState(0);
  const mr = useRef<MediaRecorder | null>(null);
  const manh = useRef<BlobPart[]>([]);
  const url = useMemo(() => (blob ? URL.createObjectURL(blob) : null), [blob]);
  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);
  useEffect(() => {
    if (!dangThu) return undefined;
    datGiay(0);
    const h = window.setInterval(() => datGiay((g) => g + 1), 1000);
    return () => window.clearInterval(h);
  }, [dangThu]);
  useEffect(() => () => { mr.current?.stream.getTracks().forEach((x) => x.stop()); }, []);

  const batDau = async () => {
    try {
      /* Quyền micro: app cho phép `media` cho chính renderer (ALLOWED_PERMISSIONS
         trong main/security.ts). */
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const r = new MediaRecorder(stream);
      manh.current = [];
      r.ondataavailable = (e) => { if (e.data.size) manh.current.push(e.data); };
      r.onstop = () => { onXong(new Blob(manh.current, { type: 'audio/webm' })); stream.getTracks().forEach((x) => x.stop()); };
      r.start();
      mr.current = r;
      datDangThu(true);
    } catch { toast.error(t('Không truy cập được micro', 'Microphone access denied')); }
  };
  const dung = () => { mr.current?.stop(); mr.current = null; datDangThu(false); };

  return (
    <article className="ctx-cau ctx-thu" data-thu={dangThu} data-xong={!!blob}>
      {anh && <img src={anh} alt="" className="ctx-thu-anh" />}
      <p className="ctx-thu-chu"><b>{so + 1}.</b> {chu}</p>
      <div className="ctx-thu-nut">
        {!dangThu ? (
          <button type="button" className="ctx-nut-phu" onClick={() => void batDau()}>
            <Mic size={14} className="ctx-do" aria-hidden /> {blob ? t('Thu lại', 'Re-record') : t('Thu âm', 'Record')}
          </button>
        ) : (
          <button type="button" className="ctx-nut-do" onClick={dung}>
            <Square size={13} aria-hidden /> {t('Dừng', 'Stop')} · {dongHo(giay * 1000)}
          </button>
        )}
        {url && !dangThu && <audio src={url} controls />}
        {blob && !dangThu && <span className="exam-badge exam-badge-pass"><Check size={12} aria-hidden /> {t('Đã thu', 'Recorded')}</span>}
      </div>
    </article>
  );
}

/* ── Màn soát bài trước khi nộp ───────────────────────────────────────── */
function SoatBai({ de, t, coBangCau, soXong, chua, co, zip, soGhiAm, dangNop, onDi, onDong, onNop }: {
  de: DeDay; t: T; coBangCau: boolean; soXong: number; chua: number[]; co: number[];
  zip: File | null; soGhiAm: number; dangNop: boolean;
  onDi: (i: number) => void; onDong: () => void; onNop: () => void;
}) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onDong(); };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onDong]);
  const tong = de.questions.length;
  return (
    <div className="ctx-phu" role="dialog" aria-modal="true" aria-label={t('Soát bài', 'Review answers')} onClick={onDong}>
      <div className="ctx-phu-hop" onClick={(e) => e.stopPropagation()}>
        <header>
          <ClipboardCheck size={18} aria-hidden />
          <h2>{t('Soát bài trước khi nộp', 'Review before submitting')}</h2>
          <button type="button" className="ctx-icon" onClick={onDong} aria-label={t('Đóng', 'Close')}><X size={15} /></button>
        </header>
        {coBangCau ? (
          <>
            <div className="ctx-tongket">
              <div><b className="ctx-xanh">{soXong}</b><span>{t('đã làm', 'answered')}</span></div>
              <div><b className={chua.length ? 'ctx-vang' : ''}>{chua.length}</b><span>{t('chưa làm', 'unanswered')}</span></div>
              <div><b>{co.length}</b><span>{t('đánh dấu', 'flagged')}</span></div>
              <div><b>{tong}</b><span>{t('tổng', 'total')}</span></div>
            </div>
            {chua.length > 0 && (
              <div className="ctx-soat-nhom">
                <div className="ctx-nhan-nho">{t('Chưa làm — bấm để quay lại', 'Unanswered — click to jump back')}</div>
                <div className="ctx-soat-o">{chua.map((i) => <button key={i} type="button" onClick={() => onDi(i)}>{i + 1}</button>)}</div>
              </div>
            )}
            {co.length > 0 && (
              <div className="ctx-soat-nhom">
                <div className="ctx-nhan-nho">{t('Đã đánh dấu', 'Flagged')}</div>
                <div className="ctx-soat-o" data-co>{co.map((i) => <button key={i} type="button" onClick={() => onDi(i)}>{i + 1}</button>)}</div>
              </div>
            )}
          </>
        ) : (
          <p className="ctx-soat-pe">
            {de.peType === 'CODE'
              ? (zip ? <><FileArchive size={14} aria-hidden /> {zip.name}</> : <span className="ctx-vang">{t('Chưa chọn file .zip.', 'No .zip chosen yet.')}</span>)
              : `${soGhiAm} ${t('đoạn ghi âm', 'recordings')}`}
          </p>
        )}
        <p className="ctx-mo">
          {de.kind === 'FE'
            ? t('Trắc nghiệm chấm ngay; câu lập trình (nếu có) AI chấm, có thể mất tới một phút. Nộp rồi không sửa được.', 'MCQs are graded instantly; coding questions (if any) are AI-graded and may take up to a minute. You cannot edit after submitting.')
            : t('AI chấm bài và trả kết quả ngay — có thể mất tới một phút. Nộp rồi không sửa được.', 'AI grades it right away — this can take up to a minute. You cannot edit after submitting.')}
        </p>
        <footer>
          <button type="button" className="ctx-nut-phu" onClick={onDong}>{t('Làm tiếp', 'Keep working')}</button>
          <button type="button" className="ctx-nut-chinh" onClick={onNop} disabled={dangNop} autoFocus>
            {dangNop ? <Loader2 size={14} className="ct-spin" aria-hidden /> : <CheckCircle2 size={14} aria-hidden />}
            {dangNop ? t('Đang chấm…', 'Grading…') : t('Nộp bài', 'Submit')}
          </button>
        </footer>
      </div>
    </div>
  );
}
