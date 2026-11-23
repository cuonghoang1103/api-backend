'use client';

/**
 * Phòng thi mô phỏng — làm đề PE (thực hành), 22/11/2026.
 *
 * Mô phỏng QUY TRÌNH PE: đọc đề từng câu (điểm mỗi câu như tờ đề) · tải Given · đồng hồ · chuẩn bị môi
 * trường · nộp MỘT .zip (kiểm trước trong trình duyệt: đuôi, chữ ký ZIP, kích thước, node_modules,
 * package.json — máy chủ kiểm lại y hệt). Sau khi nộp:
 *   1. Checklist TỰ CHẤM theo rubric từng câu (đạt / một phần / chưa) ⇒ điểm.
 *   2. Đề lấy từ Code Lab có máy chấm ⇒ chấm tự động bằng máy chấm Code Lab, chạy TRONG TRÌNH DUYỆT
 *      (iframe sandbox ở máy người học, như Code Lab); máy chủ không chạy mã ai cả.
 *   3. AI nhận xét TĨNH (đọc mã, không chạy) — có trần lượt/ngày; điểm AI chỉ là ước lượng.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  ArrowLeft, Clock, Download, FileArchive, Upload, CheckCircle2, AlertTriangle, Bot, Cpu, ListChecks, Minus, Plus, Wrench, FileText, Send,
} from 'lucide-react';
import { examMockApi, type MockAiReview, type MockPeAttempt } from '@/lib/api';
import { codeLabApi } from '@/lib/code-lab-api';
import { dinhDangGiay, dungGivenZip, kiemFileZip, tepTuZip, type KiemZip } from '@/lib/examMoPhong';
import { pickLang, sanitizeHtml } from '@/lib/utils';
import ExamRichContent from '../../../ExamRichContent';
import AnhDePhongTo from '@/components/exam/AnhDePhongTo';
import '../../../exam.css';
import '../../mo-phong.css';

type L = 'en' | 'vi';
type Tab = 'de' | 'chuan-bi' | 'nop';
const loiCua = (e: unknown, d: string) => (e as { response?: { data?: { message?: string } } })?.response?.data?.message || d;
const MUC_AI: Record<string, [string, string, string]> = {
  dat: ['Đạt', 'Met', 'var(--exam-ok)'],
  mot_phan: ['Một phần', 'Partial', 'var(--exam-warn)'],
  chua: ['Chưa', 'Missing', 'var(--exam-danger)'],
  khong_ro: ['Không rõ', 'Unclear', 'var(--text-muted)'],
};

export default function ThiPeClient({ attemptId }: { attemptId: number }) {
  const router = useRouter();
  const [L, setL] = useState<L>('vi');
  const isVi = L === 'vi';
  const t = useCallback((vi: string, en: string) => (isVi ? vi : en), [isVi]);

  const [d, setD] = useState<MockPeAttempt | null>(null);
  const [tab, setTab] = useState<Tab>('de');
  const [cauIdx, setCauIdx] = useState(0);
  const [co, setCo] = useState(1);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [file, setFile] = useState<File | null>(null);
  const [kiem, setKiem] = useState<(KiemZip & { kichThuoc: number }) | null>(null);
  const [keo, setKeo] = useState(false);
  const [dangNop, setDangNop] = useState(false);
  const [tienDo, setTienDo] = useState(0);
  const [chon, setChon] = useState<Record<string, Record<string, number>>>({});
  const [dangLuuTc, setDangLuuTc] = useState(false);
  const [dangCham, setDangCham] = useState<string | null>(null);
  const [dangAi, setDangAi] = useState(false);
  const lechRef = useRef(0);
  const autoTriedRef = useRef(false);

  const nap = useCallback(async () => {
    try {
      const r = await examMockApi.getPe(attemptId);
      lechRef.current = new Date(r.data.data.attempt.serverNow).getTime() - Date.now();
      setD(r.data.data);
      if (r.data.data.tuCham?.chon) setChon(r.data.data.tuCham.chon);
    } catch (e) { toast.error(loiCua(e, 'Không tải được đề')); router.push('/exam/mo-phong?tab=pe'); }
  }, [attemptId, router]);
  useEffect(() => { void nap(); }, [nap]);

  const dangThi = d?.attempt.status === 'IN_PROGRESS';
  const expiresAt = d?.attempt.expiresAt ? new Date(d.attempt.expiresAt).getTime() - lechRef.current : null;
  const remaining = expiresAt ? expiresAt - nowMs : 0;
  useEffect(() => {
    if (!dangThi || !expiresAt) return;
    const iv = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(iv);
  }, [dangThi, expiresAt]);

  const chonFile = useCallback(async (f: File | null) => {
    setFile(f); setKiem(null);
    if (f) setKiem(await kiemFileZip(f, d?.loaiPe ?? 'node'));
  }, [d?.loaiPe]);

  const nop = useCallback(async () => {
    if (!d || !file || !kiem || kiem.loi.length) return;
    setDangNop(true); setTienDo(0);
    try {
      const tg = Math.floor((Date.now() + lechRef.current - new Date(d.attempt.startedAt).getTime()) / 1000);
      await examMockApi.submitPe(attemptId, file, tg, setTienDo);
      toast.success(t('Đã nộp bài', 'Submitted'));
      await nap();
    } catch (e) { toast.error(loiCua(e, t('Nộp thất bại', 'Submit failed'))); } finally { setDangNop(false); }
  }, [d, file, kiem, attemptId, nap, t]);

  // Hết giờ: thông báo MỘT lần, mở tab Nộp — PE không có "tự nộp" (máy không tự nén code của bạn).
  useEffect(() => {
    if (dangThi && expiresAt && remaining <= 0 && !autoTriedRef.current) {
      autoTriedRef.current = true;
      setTab('nop');
      toast(t('Hết giờ! Nộp ngay trong 90 giây ân hạn, sau đó bài không được nhận.', "Time's up! Submit within the 90-second grace period."));
    }
  }, [dangThi, expiresAt, remaining, t]);

  const taiGiven = useCallback(() => {
    if (!d?.paper.given) return;
    const blob = dungGivenZip(d.paper.given, d.paper.attachmentName || 'given.zip');
    const u = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = u; a.download = d.paper.attachmentName || 'given.zip'; a.click();
    setTimeout(() => URL.revokeObjectURL(u), 4000);
  }, [d]);

  const luuTuCham = useCallback(async () => {
    setDangLuuTc(true);
    try { await examMockApi.selfCheck(attemptId, chon); toast.success(t('Đã lưu điểm tự chấm', 'Self-check saved')); await nap(); }
    catch (e) { toast.error(loiCua(e, 'Lỗi')); } finally { setDangLuuTc(false); }
  }, [attemptId, chon, nap, t]);

  const chamMay = useCallback(async () => {
    if (!d?.paper.exerciseId) return;
    if (!file || !kiem || kiem.goc == null) { toast(t('Chọn lại file .zip đã nộp để chấm (file chỉ nằm trên máy bạn).', 'Pick the submitted .zip again (the file stays on your device).')); setTab('nop'); return; }
    setDangCham(t('Đang đọc zip…', 'Reading zip…'));
    try {
      const files = await tepTuZip(file, kiem.goc);
      setDangCham(t('Đang tải bộ kiểm…', 'Loading tests…'));
      const tr = await codeLabApi.getSubmitTests(d.paper.exerciseId);
      setDangCham(t('Máy chấm đang chạy trong trình duyệt…', 'Grader running in your browser…'));
      const { chamBai } = await import('@/components/code-lab/cham');
      const kq = await chamBai({ exerciseId: d.paper.exerciseId, tj: tr.data.data.testsJson, files });
      const ketQua = [...kq.ketQua].sort((a, b) => a.i - b.i).map((k) => ({ dat: k.dat && !k.boQua, thay: k.thay, ms: k.ms }));
      await examMockApi.autoGrade(attemptId, ketQua);
      toast.success(t(`Máy chấm: ${kq.dat}/${kq.tong} kiểm đạt`, `Grader: ${kq.dat}/${kq.tong} checks passed`));
      await nap();
    } catch (e) { toast.error(loiCua(e, (e as Error)?.message || t('Máy chấm lỗi', 'Grader failed'))); } finally { setDangCham(null); }
  }, [d, file, kiem, attemptId, nap, t]);

  const goiAi = useCallback(async () => {
    setDangAi(true);
    try { await examMockApi.aiReview(attemptId); await nap(); } catch (e) { toast.error(loiCua(e, 'AI lỗi')); } finally { setDangAi(false); }
  }, [attemptId, nap]);

  const diemTam = useMemo(() => {
    if (!d) return 0;
    let raw = 0; let max = 0;
    for (const c of d.paper.cau) {
      const rb = c.rubric?.length ? c.rubric : [{ id: 'all', criterion: '', maxScore: c.points }];
      const tongTc = rb.reduce((s, r) => s + r.maxScore, 0) || 1;
      const dat = rb.reduce((s, r) => s + (chon[String(c.id)]?.[r.id] ?? 0) * r.maxScore, 0);
      raw += (dat / tongTc) * c.points; max += c.points;
    }
    return Math.round((raw / (max || 1)) * d.paper.thangDiem * 100) / 100;
  }, [d, chon]);

  if (!d) return <div className="exam-root min-h-[60vh] flex items-center justify-center text-text-muted">{isVi ? 'Đang tải…' : 'Loading…'}</div>;

  const p = d.paper;
  const cau = p.cau[Math.min(cauIdx, p.cau.length - 1)];
  const timerCls = remaining <= 60_000 ? 'exam-timer-danger' : remaining <= 300_000 ? 'exam-timer-warn' : 'exam-timer-normal';
  const luyen = d.attempt.mode === 'MOCK_PRACTICE';

  const nutGiven = (p.attachmentUrl || p.given) && (
    p.attachmentUrl
      ? <a href={p.attachmentUrl} download className="mo-nut-phu"><Download className="w-4 h-4" />{t('Tải Given', 'Download Given')}</a>
      : <button onClick={taiGiven} className="mo-nut-phu"><Download className="w-4 h-4" />{t('Tải Given (.zip)', 'Download Given (.zip)')}</button>
  );

  return (
    <div className="exam-root mo-phong min-h-screen" data-ml={L} style={{ ['--mo-co' as string]: co }}>
      <div className="exam-bar">
        <div className="px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Link href="/exam/mo-phong?tab=pe" className="shrink-0 p-2 rounded-lg border border-[var(--border-color)] hover:border-[var(--exam-accent)]" aria-label={t('Về sảnh', 'Lobby')}><ArrowLeft className="w-4 h-4" /></Link>
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">{pickLang(p.title, L)}</div>
              <div className="text-[11px] text-text-muted">PE · {p.durationMinutes}′ · {t(`thang ${p.thangDiem}, đạt ≥ ${p.diemDat}`, `out of ${p.thangDiem}, pass ≥ ${p.diemDat}`)}{luyen ? ` · ${t('luyện', 'practice')}` : ''}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {dangThi && expiresAt && <div className={`exam-timer flex items-center gap-1 font-bold text-base sm:text-lg ${timerCls}`}><Clock className="w-4 h-4 sm:w-5 sm:h-5" />{dinhDangGiay(remaining / 1000)}</div>}
            <div className="mo-cong-cu">
              <button onClick={() => setCo((c) => Math.max(0.85, Math.round((c - 0.1) * 100) / 100))} aria-label={t('Chữ nhỏ hơn', 'Smaller text')}><Minus className="w-3.5 h-3.5" />A</button>
              <button onClick={() => setCo((c) => Math.min(1.5, Math.round((c + 0.1) * 100) / 100))} aria-label={t('Chữ lớn hơn', 'Larger text')}><Plus className="w-3.5 h-3.5" />A</button>
              <button onClick={() => setL(isVi ? 'en' : 'vi')}>{isVi ? 'EN' : 'VI'}</button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4">
        {dangThi ? (
          <>
            <div className="exam-tabs mb-4">
              <button className="exam-tab" data-active={tab === 'de'} onClick={() => setTab('de')}><FileText className="w-4 h-4" />{t('Đề', 'Paper')}</button>
              <button className="exam-tab" data-active={tab === 'chuan-bi'} onClick={() => setTab('chuan-bi')}><Wrench className="w-4 h-4" />{t('Chuẩn bị', 'Setup')}</button>
              <button className="exam-tab" data-active={tab === 'nop'} onClick={() => setTab('nop')}><Upload className="w-4 h-4" />{t('Nộp bài', 'Submit')}</button>
            </div>

            {tab === 'de' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  {p.cau.length > 1 && p.cau.map((c, i) => (
                    <button key={c.id} className="mo-chip" data-on={i === cauIdx} onClick={() => setCauIdx(i)}>{t('Câu', 'Q')} {i + 1} · {c.points}đ</button>
                  ))}
                  <span className="flex-1" />
                  {nutGiven}
                </div>
                <div className="exam-card p-4 sm:p-6 mo-pe-de">
                  {p.cau.length > 1 && <div className="text-sm font-semibold text-text-secondary mb-3">{t('Câu', 'Question')} {cauIdx + 1}/{p.cau.length} · {cau.points} {t('điểm', 'marks')}</div>}
                  <ExamRichContent html={gapMayCham(cau.prompt, isVi)} L={L} />
                  {cau.imageUrl && <AnhDePhongTo url={cau.imageUrl} isVi={isVi} className="mt-4" />}
                </div>
                <button className="mo-nut-chinh" onClick={() => setTab('nop')}><Upload className="w-4 h-4" />{t('Xong — sang nộp bài', 'Done — go to submit')}</button>
              </div>
            )}

            {tab === 'chuan-bi' && (
              <div className="exam-card p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3"><div className="font-semibold">{t('Chuẩn bị môi trường', 'Set up your environment')}</div>{nutGiven}</div>
                <ol className="mo-buoc">{d.huongDanMoiTruong.map((b, i) => <li key={i} dangerouslySetInnerHTML={{ __html: sanitizeHtml(pickLang(b, L)) }} />)}</ol>
                {p.given && <p className="text-[12px] text-text-muted mt-3">{t('Given của đề này dựng từ tệp khởi đầu + database.json của bài Code Lab tương ứng.', 'This paper\'s Given is built from the matching Code Lab starter files + database.json.')}</p>}
              </div>
            )}

            {tab === 'nop' && (
              <div className="exam-card p-5 space-y-4">
                <div className="font-semibold flex items-center gap-2"><FileArchive className="w-5 h-5 text-[var(--exam-accent)]" />{t('Nộp MỘT file .zip', 'Submit ONE .zip file')}</div>
                <ul className="text-sm text-text-secondary list-disc pl-5 space-y-1">
                  <li>{t('Xoá node_modules (và build/dist) trước khi nén.', 'Delete node_modules (and build/dist) before zipping.')}</li>
                  <li>{t('Nén thư mục có package.json + src/. Tối đa 20 MB, chỉ .zip.', 'Zip the folder that has package.json + src/. Max 20 MB, .zip only.')}</li>
                  <li>{t('Nộp xong vẫn tự chấm theo rubric được; nộp sau giờ (quá 90 giây ân hạn) không được nhận.', 'After submitting you self-check against the rubric; late submissions (past the 90 s grace) are refused.')}</li>
                </ul>
                <label className="mo-tha block cursor-pointer" data-keo={keo}
                  onDragOver={(e) => { e.preventDefault(); setKeo(true); }} onDragLeave={() => setKeo(false)}
                  onDrop={(e) => { e.preventDefault(); setKeo(false); void chonFile(e.dataTransfer.files?.[0] ?? null); }}>
                  <input type="file" accept=".zip,application/zip" className="hidden" onChange={(e) => void chonFile(e.target.files?.[0] ?? null)} />
                  <Upload className="w-6 h-6 mx-auto text-[var(--exam-accent)] mb-2" />
                  <div className="text-sm font-semibold">{file ? file.name : t('Chọn hoặc kéo thả file .zip', 'Choose or drop your .zip')}</div>
                  {file && <div className="text-xs text-text-muted mt-1">{(file.size / 1024).toFixed(0)} KB{kiem ? ` · ${kiem.soTep} ${t('tệp', 'files')}` : ''}</div>}
                </label>
                {kiem && (
                  <div className="space-y-1.5">
                    {kiem.loi.map((l, i) => <div key={i} className="mo-loi flex gap-1.5"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />{pickLang(l, L)}</div>)}
                    {kiem.canhBao.map((l, i) => <div key={i} className="mo-canh-bao flex gap-1.5"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />{pickLang(l, L)}</div>)}
                    {!kiem.loi.length && <div className="text-sm flex gap-1.5" style={{ color: 'var(--exam-ok)' }}><CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />{t(`Hợp lệ — dự án ở "${kiem.goc || '/'}"`, `Looks good — project at "${kiem.goc || '/'}"`)}</div>}
                  </div>
                )}
                <button className="mo-nut-chinh w-full sm:w-auto" disabled={!file || !kiem || kiem.loi.length > 0 || dangNop}
                  onClick={() => { if (window.confirm(t('Nộp bài? Sau khi nộp không sửa được file nữa.', 'Submit? You cannot change the file afterwards.'))) void nop(); }}>
                  <Send className="w-4 h-4" />{dangNop ? `${t('Đang tải lên', 'Uploading')} ${tienDo}%` : t('Nộp bài', 'Submit')}
                </button>
              </div>
            )}
          </>
        ) : (
          <SauKhiNop d={d} L={L} t={t} chon={chon} setChon={setChon} diemTam={diemTam} luuTuCham={luuTuCham} dangLuuTc={dangLuuTc}
            chamMay={chamMay} dangCham={dangCham} coFile={!!file} chonFile={chonFile} goiAi={goiAi} dangAi={dangAi} attemptId={attemptId} />
        )}
      </div>
    </div>
  );
}

function SauKhiNop({ d, L, t, chon, setChon, diemTam, luuTuCham, dangLuuTc, chamMay, dangCham, coFile, chonFile, goiAi, dangAi, attemptId }: {
  d: MockPeAttempt; L: L; t: (vi: string, en: string) => string;
  chon: Record<string, Record<string, number>>; setChon: (fn: (c: Record<string, Record<string, number>>) => Record<string, Record<string, number>>) => void;
  diemTam: number; luuTuCham: () => void; dangLuuTc: boolean;
  chamMay: () => void; dangCham: string | null; coFile: boolean; chonFile: (f: File | null) => void;
  goiAi: () => void; dangAi: boolean; attemptId: number;
}) {
  const p = d.paper;
  const ai = d.aiNhanXet;
  if (d.attempt.status === 'EXPIRED' && !d.nop) {
    return (
      <div className="exam-card p-6 text-center space-y-3">
        <AlertTriangle className="w-8 h-8 mx-auto text-[var(--exam-danger)]" />
        <div className="font-semibold">{t('Hết giờ — không có bài nộp (0 điểm như phòng thi thật).', 'Time ran out — no submission (0 marks, like the real room).')}</div>
        <Link href="/exam/mo-phong?tab=pe" className="mo-nut-chinh inline-flex">{t('Làm lại đề khác', 'Try another paper')}</Link>
      </div>
    );
  }
  return (
    <div className="space-y-5">
      <div className="exam-card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="text-sm text-text-secondary">{t('Đã nộp', 'Submitted')}</div>
          <div className="font-semibold truncate">{d.nop?.tenTep} · {d.nop ? `${(d.nop.kichThuoc / 1024).toFixed(0)} KB · ${d.nop.soTep} ${t('tệp mã', 'source files')}` : ''}</div>
          {d.nop?.canhBao?.map((c, i) => <div key={i} className="mo-canh-bao mt-1">{pickLang(c, L)}</div>)}
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold exam-timer" style={{ color: d.attempt.passed ? 'var(--exam-ok)' : d.attempt.score != null ? 'var(--exam-danger)' : undefined }}>{d.attempt.score ?? '—'}<span className="text-base text-text-muted">/{p.thangDiem}</span></div>
          <div className="text-[11px] text-text-muted">{d.attempt.gradingMode === 'AUTO' ? t('điểm máy chấm', 'auto-grader score') : d.tuCham ? t('điểm tự chấm', 'self-check score') : t('chưa chấm', 'not graded yet')}</div>
        </div>
        <Link href={`/exam/attempt/${attemptId}`} className="mo-nut-phu">{t('Xem đáp án mẫu', 'Model answer')}</Link>
      </div>

      {p.coMayCham && (
        <div className="exam-card p-5">
          <div className="font-semibold flex items-center gap-2 mb-1"><Cpu className="w-5 h-5 text-[var(--exam-accent)]" />{t('Máy chấm Code Lab (chạy trong trình duyệt của bạn)', 'Code Lab grader (runs in your browser)')}</div>
          <p className="text-[12px] text-text-muted mb-3">{t('Mã của bạn chạy trong khung cách ly NGAY TRÊN MÁY BẠN, với json-server giả lập — máy chủ không chạy mã. Kết quả do trình duyệt báo, dùng để ôn, không phải điểm chính thức.', 'Your code runs in an isolated frame ON YOUR DEVICE with a mocked json-server — the server never runs it. Results are browser-reported: for revision, not an official score.')}</p>
          {d.chamTuDong ? (
            <div className="space-y-2">
              <div className="text-sm">{t('Kết quả', 'Result')}: <b>{d.chamTuDong.score}/{d.chamTuDong.maxScore}</b> · {d.chamTuDong.dat}/{d.chamTuDong.tong} {t('kiểm đạt', 'checks passed')}</div>
              {d.chamTuDong.nhom.map((n) => (
                <div key={n.ma}><div className="flex justify-between text-[13px] gap-3"><span>{n.ten}</span><span className="tabular-nums text-text-secondary shrink-0">{n.diemDat}/{n.diem}</span></div>
                  <div className="mo-thanh"><div style={{ width: `${n.diem ? (n.diemDat / n.diem) * 100 : 0}%`, background: n.diemDat >= n.diem ? 'var(--exam-ok)' : n.diemDat > 0 ? 'var(--exam-warn)' : 'var(--exam-danger)' }} /></div></div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              {!coFile && (
                <label className="mo-nut-phu cursor-pointer"><Upload className="w-4 h-4" />{t('Chọn lại file .zip đã nộp', 'Pick your submitted .zip')}
                  <input type="file" accept=".zip" className="hidden" onChange={(e) => chonFile(e.target.files?.[0] ?? null)} /></label>
              )}
              <button className="mo-nut-chinh" disabled={!coFile || !!dangCham} onClick={chamMay}><Cpu className="w-4 h-4" />{dangCham ?? t('Chấm tự động', 'Auto-grade')}</button>
            </div>
          )}
        </div>
      )}

      <div className="exam-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
          <div className="font-semibold flex items-center gap-2"><ListChecks className="w-5 h-5 text-[var(--exam-accent)]" />{t('Checklist tự chấm theo rubric', 'Rubric self-check')}</div>
          <div className="text-sm">{t('Tạm tính', 'Running total')}: <b className="exam-timer">{diemTam}/{p.thangDiem}</b></div>
        </div>
        <p className="text-[12px] text-text-muted mb-3">{t('Mở app của bạn (json-server + npm start), thử đúng từng yêu cầu rồi đánh dấu thật thà — đây là cách giám khảo chấm từng dòng.', 'Open your app (json-server + npm start), try each requirement, then mark honestly — this is how examiners grade line by line.')}</p>
        {p.cau.map((c, i) => (
          <div key={c.id} className="mb-4">
            <div className="text-sm font-semibold text-text-secondary mb-1">{t('Câu', 'Question')} {i + 1} · {c.points}đ</div>
            {(c.rubric ?? []).map((r) => {
              const v = chon[String(c.id)]?.[r.id];
              return (
                <div key={r.id} className="mo-tc">
                  <div className="text-sm">{pickLang(r.criterion, L)} <span className="text-text-muted text-xs">({r.maxScore}đ)</span></div>
                  <div className="mo-ba-nut" role="group">
                    {([[1, t('Đạt', 'Met')], [0.5, t('Một phần', 'Partly')], [0, t('Chưa', 'No')]] as const).map(([val, nh]) => (
                      <button key={val} data-v={val} data-on={v === val} onClick={() => setChon((s) => ({ ...s, [String(c.id)]: { ...(s[String(c.id)] ?? {}), [r.id]: val } }))}>{nh}</button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <button className="mo-nut-chinh" disabled={dangLuuTc} onClick={luuTuCham}><CheckCircle2 className="w-4 h-4" />{dangLuuTc ? t('Đang lưu…', 'Saving…') : t('Lưu điểm tự chấm', 'Save self-check')}</button>
      </div>

      <div className="exam-card p-5">
        <div className="font-semibold flex items-center gap-2 mb-1"><Bot className="w-5 h-5 text-[var(--exam-accent)]" />{t('AI nhận xét tĩnh (đọc mã, không chạy)', 'Static AI review (reads code, never runs it)')}</div>
        <p className="text-[12px] text-text-muted mb-3">{t(
          `AI đọc tối đa ~40.000 ký tự mã nộp, soi từng tiêu chí rubric và chỉ chỗ dễ mất điểm. Điểm AI chỉ là ƯỚC LƯỢNG. Mỗi lượt một lần; hôm nay còn ${d.aiConLuot} lượt. Chi phí ước ~0,03–0,08 USD/lượt (một lời gọi cho cả đề).`,
          `AI reads up to ~40,000 characters of your code, checks each rubric line and points out likely point-losers. AI marks are an ESTIMATE only. Once per attempt; ${d.aiConLuot} left today. Est. cost ~US$0.03–0.08 per review (one call for the whole paper).`,
        )}</p>
        {ai ? <AiKetQua ai={ai} d={d} L={L} t={t} /> : (
          <button className="mo-nut-chinh" disabled={dangAi || d.aiConLuot <= 0} onClick={goiAi}><Bot className="w-4 h-4" />{dangAi ? t('AI đang đọc mã… (≈30–60 giây)', 'AI is reading… (≈30–60 s)') : t('Nhờ AI nhận xét', 'Get AI review')}</button>
        )}
      </div>
    </div>
  );
}

function AiKetQua({ ai, d, L, t }: { ai: MockAiReview; d: MockPeAttempt; L: L; t: (vi: string, en: string) => string }) {
  return (
    <div className="space-y-4">
      <div className="text-sm">{t('Điểm ước', 'Estimated')}: <b>{ai.diemUoc}/{d.paper.thangDiem}</b>{ai.catMa ? ` · ${t('mã bị cắt bớt khi gửi AI', 'code was truncated for AI')}` : ''}</div>
      {ai.tomTat && <p className="text-sm">{pickLang(ai.tomTat, L)}</p>}
      {ai.ruiRo.length > 0 && (
        <div className="exam-explain text-sm"><div className="font-semibold mb-1 text-[var(--exam-warn)]">{t('Dễ mất điểm', 'Likely point-losers')}</div>
          <ul className="list-disc pl-5 space-y-1">{ai.ruiRo.map((r, i) => <li key={i}>{pickLang(r, L)}</li>)}</ul></div>
      )}
      {ai.theoCau.map((c, i) => {
        const q = d.paper.cau.find((x) => x.id === c.questionId);
        return (
          <div key={c.questionId}>
            <div className="text-sm font-semibold text-text-secondary mb-1">{t('Câu', 'Question')} {i + 1} · {t('ước', 'est.')} {c.diemUoc}/{c.toiDa}</div>
            {c.tomTat && <p className="text-[13px] mb-1">{pickLang(c.tomTat, L)}</p>}
            {c.tieuChi.map((tc) => {
              const r = q?.rubric?.find((x) => x.id === tc.id);
              const m = MUC_AI[tc.muc] ?? MUC_AI.khong_ro;
              return (
                <div key={tc.id} className="mo-tc">
                  <div className="text-[13px]"><div>{pickLang(r?.criterion ?? tc.id, L)}</div>{tc.nhanXet && <div className="text-text-muted mt-0.5">{pickLang(tc.nhanXet, L)}</div>}</div>
                  <span className="exam-badge" style={{ color: m[2], borderColor: m[2], background: 'transparent' }}>{L === 'vi' ? m[0] : m[1]}</span>
                </div>
              );
            })}
          </div>
        );
      })}
      <p className="text-[11px] text-text-muted">{ai.model} · {ai.inputTokens.toLocaleString()} in / {ai.outputTokens.toLocaleString()} out tokens</p>
    </div>
  );
}

/**
 * Đề luyện Code Lab có mục "id / class máy chấm dùng" (h2 chứa "auto-grader" / "máy chấm") — tờ đề thật không có.
 * Ở PEA + EOS gập mục đó vào <details> (Code Lab vẫn hiện đầy đủ vì máy chấm ở đó cần) để đề đọc như tờ đề thật.
 */
const boNhoGap = new Map<string, string>();
function gapMayCham(html: string, isVi: boolean): string {
  const k = `${isVi ? 'v' : 'e'}${html}`;
  const co = boNhoGap.get(k);
  if (co != null) return co;
  const kq = gapMayChamTinh(html, isVi);
  if (boNhoGap.size > 50) boNhoGap.clear();
  boNhoGap.set(k, kq);
  return kq;
}
function gapMayChamTinh(html: string, isVi: boolean): string {
  // Đề tải ở client (useEffect) ⇒ luôn có DOMParser; phòng hờ môi trường không có thì trả nguyên.
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined' || !/auto-grader|máy chấm/i.test(html)) return html;
  const doc = new DOMParser().parseFromString(`<div id="goc">${html}</div>`, 'text/html');
  const nhan = isVi ? 'Ghi chú cho máy chấm (không thuộc tờ đề)' : 'Auto-grader notes (not part of the paper)';
  doc.querySelectorAll('h2').forEach((h) => {
    if (!/auto-grader|máy chấm/i.test(h.textContent || '')) return;
    const det = doc.createElement('details');
    det.className = 'mo-may-cham';
    const sum = doc.createElement('summary');
    sum.textContent = nhan;
    det.appendChild(sum);
    // Gom các anh em phía sau cho tới h2 kế tiếp (cùng cha) — giữ nguyên cấu trúc lồng, không cắt bằng regex.
    let n = h.nextSibling;
    while (n && !(n.nodeType === 1 && (n as Element).tagName === 'H2')) { const sau = n.nextSibling; det.appendChild(n); n = sau; }
    h.replaceWith(det);
  });
  return doc.getElementById('goc')?.innerHTML ?? html;
}
