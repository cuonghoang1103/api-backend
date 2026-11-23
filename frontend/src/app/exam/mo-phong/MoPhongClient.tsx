'use client';

/**
 * PEA + EOS — sảnh (Exam Room › /exam/mo-phong), 22/11/2026. Đổi tên + chọn môn 23/11/2026 (user: tên
 * "Phòng thi mô phỏng" trùng Phòng thi có sẵn; chữ ngắn gọn, không giải thích; chọn môn nào chỉ hiện môn đó).
 * Không có `?course=` ⇒ lưới chọn môn (GET /exams/mock/mon); có ⇒ chỉ môn đó, đổi môn bằng ô chọn ở đầu trang.
 *
 * Mở rộng Exam Room chứ không phải trang riêng: đề thật từng đề vẫn thi ở /exam/:id; ở đây là phần
 * Exam Room còn thiếu — đề FE TRỘN theo phân bố chương như đề thật, chế độ "thi thật / luyện", PE mô
 * phỏng quy trình (Given, giờ, nộp zip, checklist rubric, máy chấm Code Lab nếu đề có, AI nhận xét tĩnh)
 * và lịch sử + biểu đồ tiến bộ + điểm yếu theo chương/CLO. Kết quả từng lượt xem ở /exam/attempt/:id.
 *
 * Là sản phẩm của cuongthai.com để quen QUY TRÌNH thi — không mô phỏng giao diện/phần mềm thi của trường.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  ArrowLeft, ListChecks, Code2, LineChart, Play, Timer, BookOpenCheck, Download, CheckCircle2, Layers, Search,
} from 'lucide-react';
import { examMockApi, type MockHistory, type MockMon, type MockOverview } from '@/lib/api';
import { pickLang, sanitizeHtml } from '@/lib/utils';
import { TEN_PHONG } from '@/lib/examMoPhong';
import '../exam.css';
import './mo-phong.css';

type Tab = 'fe' | 'pe' | 'tien-bo';
type L = 'en' | 'vi';

const loiCua = (e: unknown, macDinh: string) =>
  (e as { response?: { data?: { message?: string } } })?.response?.data?.message || macDinh;

export default function MoPhongClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const course = (sp.get('course') || '').toUpperCase();
  const tabDau = (sp.get('tab') as Tab) || 'fe';

  const [L, setL] = useState<L>('vi');
  const isVi = L === 'vi';
  const [tab, setTab] = useState<Tab>(['fe', 'pe', 'tien-bo'].includes(tabDau) ? tabDau : 'fe');
  const [ov, setOv] = useState<MockOverview | null>(null);
  const [hist, setHist] = useState<MockHistory | null>(null);
  const [loi, setLoi] = useState<string | null>(null);
  const [dangTao, setDangTao] = useState(false);
  const [dsMon, setDsMon] = useState<MockMon[] | null>(null);

  useEffect(() => {
    let alive = true;
    examMockApi.mon().then((r) => { if (alive) setDsMon(r.data.data); }).catch(() => { if (alive) setDsMon([]); });
    return () => { alive = false; };
  }, []);

  // Cấu hình đề FE
  const [cheDo, setCheDo] = useState<'thi' | 'luyen'>('thi');
  const [kieuFe, setKieuFe] = useState<'tron' | 'nguyen'>('tron');
  const [soCau, setSoCau] = useState(50);
  const [phut, setPhut] = useState(60);
  const [phutTay, setPhutTay] = useState(false);
  const [nguon, setNguon] = useState<'mix' | 'real' | 'quiz'>('mix');
  const [nhomChon, setNhomChon] = useState<Set<string>>(new Set());

  useEffect(() => {
    let alive = true;
    setLoi(null); setOv(null); setHist(null); setNhomChon(new Set()); setPhutTay(false);
    if (!course) return () => { alive = false; };
    examMockApi.overview(course)
      .then((r) => {
        if (!alive) return;
        setOv(r.data.data);
        setSoCau(r.data.data.fe.soCau);
        setPhut(r.data.data.fe.phut);
      })
      .catch((e) => { if (alive) setLoi(loiCua(e, 'Không tải được môn này')); });
    examMockApi.history(course).then((r) => { if (alive) setHist(r.data.data); }).catch(() => {});
    return () => { alive = false; };
  }, [course]);

  // Phút tự tính theo số câu (như đề thật: 50 câu / 60 phút) cho tới khi người học tự sửa.
  useEffect(() => {
    if (!ov || phutTay) return;
    setPhut(Math.max(5, Math.round((ov.fe.phut * soCau) / ov.fe.soCau)));
  }, [soCau, ov, phutTay]);

  const nhomHienThi = useMemo(() => (ov?.nganHang.nhom ?? []).filter((n) => {
    if (nguon === 'real') return n.nganHang - n.quiz > 0;
    if (nguon === 'quiz') return n.quiz > 0;
    return n.nganHang > 0;
  }), [ov, nguon]);

  // Ước phân bố (để người học thấy trước) — máy chủ chia lại chính xác khi tạo đề.
  const uocPhanBo = useMemo(() => {
    if (!ov) return new Map<string, number>();
    const chon = nhomHienThi.filter((n) => !nhomChon.size || nhomChon.has(n.nhom));
    const sucChua = chon.map((n) => (nguon === 'real' ? n.nganHang - n.quiz : nguon === 'quiz' ? n.quiz : n.nganHang));
    const w = chon.map((n, i) => (ov.nganHang.nguonPhanBo === 'DE_THAT' ? n.deThat || (nhomChon.size ? 1 : 0) : sucChua[i]));
    const tong = w.reduce((s, x) => s + x, 0) || 1;
    const m = new Map<string, number>();
    chon.forEach((n, i) => m.set(n.nhom, Math.min(sucChua[i], Math.round((w[i] / tong) * soCau))));
    return m;
  }, [ov, nhomHienThi, nhomChon, soCau, nguon]);

  const batDauFe = useCallback(async () => {
    setDangTao(true);
    try {
      const r = await examMockApi.startFe(course, { soCau, phut, cheDo, nguon, nhom: nhomChon.size ? [...nhomChon] : undefined });
      router.push(`/exam/mo-phong/fe/${r.data.data.attemptId}`);
    } catch (e) {
      toast.error(loiCua(e, isVi ? 'Không tạo được đề' : 'Could not create the paper'));
      setDangTao(false);
    }
  }, [course, soCau, phut, cheDo, nguon, nhomChon, router, isVi]);

  const luyenDeThat = useCallback(async (deId: number) => {
    setDangTao(true);
    try {
      const r = await examMockApi.startFe(course, { deId, cheDo: 'luyen' });
      router.push(`/exam/mo-phong/fe/${r.data.data.attemptId}`);
    } catch (e) {
      toast.error(loiCua(e, isVi ? 'Không mở được đề' : 'Could not open the paper'));
      setDangTao(false);
    }
  }, [course, router, isVi]);

  const batDauPe = useCallback(async (p: { examId?: number; exerciseId?: number }, cd: 'thi' | 'luyen') => {
    setDangTao(true);
    try {
      const r = await examMockApi.startPe(course, { ...p, cheDo: cd });
      router.push(`/exam/mo-phong/pe/${r.data.data.attemptId}`);
    } catch (e) {
      toast.error(loiCua(e, isVi ? 'Không mở được đề' : 'Could not open the paper'));
      setDangTao(false);
    }
  }, [course, router, isVi]);

  const t = (vi: string, en: string) => (isVi ? vi : en);
  const doiMon = (ma: string) => router.push(ma ? `/exam/mo-phong?course=${encodeURIComponent(ma)}` : '/exam/mo-phong');
  const thanh = (
    <div className="flex items-center justify-between gap-3 mb-4">
      <Link href={course ? '/exam/mo-phong' : '/exam'} className="text-sm text-text-secondary hover:text-text-primary flex items-center gap-1">
        <ArrowLeft className="w-4 h-4" />{course ? t('Chọn môn', 'Courses') : t('Phòng thi', 'Exam Room')}
      </Link>
      <div className="flex items-center gap-2">
        {course && dsMon && dsMon.length > 0 && (
          <select value={course} onChange={(e) => doiMon(e.target.value)} aria-label={t('Đổi môn', 'Switch course')}
            className="mo-o text-sm font-semibold max-w-[11rem]">
            {!dsMon.some((m) => m.courseCode === course) && <option value={course}>{course}</option>}
            {dsMon.map((m) => <option key={m.courseCode} value={m.courseCode}>{m.courseCode}</option>)}
          </select>
        )}
        <button onClick={() => setL(isVi ? 'en' : 'vi')} className="text-xs font-semibold px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--exam-accent)]">
          {isVi ? 'EN' : 'VI'}
        </button>
      </div>
    </div>
  );

  if (!course) {
    return (
      <div className="exam-root exam-portal min-h-screen" data-ml={L}>
        <div className="exam-portal-bg"><span className="exam-blob exam-blob-1" /><span className="exam-blob exam-blob-2" /><span className="exam-blob exam-blob-3" /></div>
        <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
          {thanh}
          <ChonMon ds={dsMon} L={L} onChon={doiMon} />
        </div>
      </div>
    );
  }

  if (loi) {
    return (
      <div className="exam-root min-h-[60vh] flex flex-col items-center justify-center gap-3 px-4 text-center" data-ml={L}>
        <p className="text-text-secondary">{loi}</p>
        <Link href="/exam" className="text-[var(--exam-accent)] font-semibold text-sm">{isVi ? '← Về Phòng thi' : '← Back to Exam Room'}</Link>
      </div>
    );
  }
  if (!ov) return <div className="exam-root min-h-[60vh] flex items-center justify-center text-text-muted">{isVi ? 'Đang tải…' : 'Loading…'}</div>;

  return (
    <div className="exam-root exam-portal min-h-screen" data-ml={L}>
      <div className="exam-portal-bg"><span className="exam-blob exam-blob-1" /><span className="exam-blob exam-blob-2" /><span className="exam-blob exam-blob-3" /></div>
      <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
        {thanh}

        <div className="exam-hero mb-5">
          <div className="flex items-center gap-2 text-[var(--exam-accent)] mb-2"><Layers className="w-5 h-5" /><span className="text-sm font-semibold uppercase tracking-wide">{TEN_PHONG} · {ov.courseCode}</span></div>
          <h1 className="text-2xl sm:text-3xl font-bold">{pickLang(ov.course.title, L)}</h1>
          <div className="flex flex-wrap gap-2 mt-3 text-xs">
            <span className="exam-badge exam-badge-fe">FE · {ov.fe.soCau} {t('câu', 'q')} · {ov.fe.phut}′</span>
            <span className="exam-badge exam-badge-pe">PE · {ov.pe.phut}′</span>
          </div>
        </div>

        {ov.dangDo.length > 0 && (
          <div className="exam-card p-4 mb-5">
            <div className="text-sm font-semibold mb-2">{t('Đang làm dở', 'In progress')}</div>
            <div className="flex flex-wrap gap-2">
              {ov.dangDo.map((d) => (
                <Link key={d.id} href={`/exam/mo-phong/${d.loai === 'PE' ? 'pe' : 'fe'}/${d.id}`} className="mo-chip" data-on="true">
                  <Play className="w-3.5 h-3.5" />{pickLang(d.tieuDe, L)}
                  <span className="opacity-70">· {d.mode === 'MOCK_PRACTICE' ? t('luyện', 'practice') : t('thi thật', 'timed')}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="exam-tabs mb-5">
          <button className="exam-tab" data-active={tab === 'fe'} onClick={() => setTab('fe')}><ListChecks className="w-4 h-4" />FE {t('trắc nghiệm', 'multiple choice')}</button>
          <button className="exam-tab" data-active={tab === 'pe'} onClick={() => setTab('pe')}><Code2 className="w-4 h-4" />PE {t('thực hành', 'practical')}</button>
          <button className="exam-tab" data-active={tab === 'tien-bo'} onClick={() => setTab('tien-bo')}><LineChart className="w-4 h-4" />{t('Tiến bộ', 'Progress')}{hist?.luot.length ? <span className="ml-1 text-[11px] opacity-80">({hist.luot.length})</span> : null}</button>
        </div>

        {tab === 'fe' && (
          <div className="flex flex-wrap gap-2 mb-4">
            <button className="mo-chip" data-on={kieuFe === 'tron'} onClick={() => setKieuFe('tron')}>{t('Đề trộn', 'Mixed paper')}</button>
            <button className="mo-chip" data-on={kieuFe === 'nguyen'} onClick={() => setKieuFe('nguyen')}>{t(`Đề thật nguyên bộ (${ov.deFe.length})`, `Full real papers (${ov.deFe.length})`)}</button>
          </div>
        )}

        {tab === 'fe' && kieuFe === 'nguyen' && (
          ov.deFe.length === 0
            ? <div className="exam-card p-6 text-center text-text-secondary">{t('Môn này chưa có đề FE thật.', 'No real FE papers for this course yet.')}</div>
            : (
              <div className="grid sm:grid-cols-2 gap-3">
                {ov.deFe.map((d) => (
                  <div key={d.id} className="exam-card p-4 flex flex-col gap-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="exam-badge exam-badge-fe">FE · {d.soCau} {t('câu', 'q')} · {d.phut}′</span>
                      {d.code && <span className="exam-badge" style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>{d.code}</span>}
                    </div>
                    <div className="font-semibold leading-snug">{pickLang(d.tieuDe, L)}</div>
                    <div className="mt-auto flex gap-2">
                      {/* Thi có giờ = đúng đề đó ở Phòng thi (/exam/:id) — không dựng lại lượt thi thứ hai ở đây. */}
                      <Link href={`/exam/${d.id}`} className="mo-nut-chinh flex-1 justify-center"><Timer className="w-4 h-4" />{t('Thi', 'Exam')} {d.phut}′</Link>
                      <button disabled={dangTao} onClick={() => luyenDeThat(d.id)} className="mo-nut-phu flex-1">{t('Luyện', 'Practice')}</button>
                    </div>
                  </div>
                ))}
              </div>
            )
        )}

        {tab === 'fe' && kieuFe === 'tron' && (
          <div className="grid lg:grid-cols-[1fr_320px] gap-5">
            <div className="exam-card p-5 space-y-5">
              <div>
                <div className="mo-nhan">{t('Chế độ', 'Mode')}</div>
                <div className="grid sm:grid-cols-2 gap-2">
                  <button className="mo-che-do" data-on={cheDo === 'thi'} onClick={() => setCheDo('thi')}>
                    <Timer className="w-5 h-5" /><span><b>{t('Thi', 'Exam')}</b><small>{t('Tính giờ · tự nộp', 'Timed · auto-submit')}</small></span>
                  </button>
                  <button className="mo-che-do" data-on={cheDo === 'luyen'} onClick={() => setCheDo('luyen')}>
                    <BookOpenCheck className="w-5 h-5" /><span><b>{t('Luyện', 'Practice')}</b><small>{t('Không giờ · xem đáp án từng câu', 'Untimed · per-question answers')}</small></span>
                  </button>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <div className="mo-nhan">{t('Số câu', 'Questions')}</div>
                  <div className="flex flex-wrap gap-2">
                    {[10, 25, ov.fe.soCau].filter((v, i, a) => a.indexOf(v) === i).map((n) => (
                      <button key={n} className="mo-chip" data-on={soCau === n} onClick={() => setSoCau(n)}>{n}</button>
                    ))}
                    <input type="number" min={5} max={100} value={soCau} onChange={(e) => setSoCau(Math.max(5, Math.min(100, Number(e.target.value) || 5)))} className="mo-o w-20" aria-label={t('Số câu tuỳ chọn', 'Custom question count')} />
                  </div>
                </div>
                {cheDo === 'thi' && (
                  <div>
                    <div className="mo-nhan">{t('Thời gian (phút)', 'Time (minutes)')}</div>
                    <input type="number" min={5} max={180} value={phut} onChange={(e) => { setPhutTay(true); setPhut(Math.max(5, Math.min(180, Number(e.target.value) || 5))); }} className="mo-o w-24" />
                  </div>
                )}
              </div>

              <div>
                <div className="mo-nhan">{t('Ngân hàng câu', 'Question bank')}</div>
                <div className="flex flex-wrap gap-2">
                  {([['mix', t('Trộn cả hai', 'Both mixed')], ['real', t(`Đề FE thật (${ov.nganHang.deThat})`, `Real FE papers (${ov.nganHang.deThat})`)], ['quiz', t(`Quiz chương Academy (${ov.nganHang.quiz})`, `Academy chapter quizzes (${ov.nganHang.quiz})`)]] as const).map(([k, nh]) => (
                    <button key={k} className="mo-chip" data-on={nguon === k} onClick={() => setNguon(k)}>{nh}</button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="mo-nhan">{t('Chương', 'Chapters')}</div>
                  {nhomChon.size > 0 && <button className="text-xs text-[var(--exam-accent)]" onClick={() => setNhomChon(new Set())}>{t('Bỏ chọn', 'Clear')}</button>}
                </div>
                <div className="mo-bang-cuon">
                  <table className="mo-bang">
                    <thead><tr><th></th><th>{t('Chương', 'Chapter')}</th><th className="text-right">{t('Đề thật', 'Real')}</th><th className="text-right">{t('Ngân hàng', 'Bank')}</th><th className="text-right">{t('Trong đề', 'In paper')}</th></tr></thead>
                    <tbody>
                      {nhomHienThi.map((n) => (
                        <tr key={n.nhom}>
                          <td><input type="checkbox" checked={nhomChon.has(n.nhom)} aria-label={pickLang(n.ten, L)}
                            onChange={() => setNhomChon((s) => { const x = new Set(s); x.has(n.nhom) ? x.delete(n.nhom) : x.add(n.nhom); return x; })} /></td>
                          <td className="mo-ten-chuong">{pickLang(n.ten, L)}{n.chuong != null && ov.cloTheoChuong[String(n.chuong)]?.length ? <span className="mo-clo">{ov.cloTheoChuong[String(n.chuong)].join(' · ')}</span> : null}</td>
                          <td className="text-right tabular-nums">{n.deThat}</td>
                          <td className="text-right tabular-nums">{nguon === 'real' ? n.nganHang - n.quiz : nguon === 'quiz' ? n.quiz : n.nganHang}</td>
                          <td className="text-right tabular-nums font-semibold">{uocPhanBo.get(n.nhom) ?? 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <aside className="space-y-4 lg:sticky lg:top-4 self-start">
              <div className="exam-card p-5">
                <div className="text-sm text-text-secondary">{t('Đề sẽ tạo', 'Paper to generate')}</div>
                <div className="text-3xl font-bold exam-timer mt-1">{soCau} <span className="text-base font-semibold text-text-secondary">{t('câu', 'questions')}</span></div>
                <div className="text-sm text-text-secondary mt-1">{cheDo === 'thi' ? `${phut} ${t('phút · tự nộp khi hết giờ', 'min · auto-submit at time-up')}` : t('Không tính giờ', 'Untimed')}</div>
                <div className="text-sm text-text-secondary">{t(`Thang ${ov.fe.thangDiem} · đạt ≥ ${ov.fe.diemDat}`, `Out of ${ov.fe.thangDiem} · pass ≥ ${ov.fe.diemDat}`)}</div>
                <button disabled={dangTao} onClick={batDauFe} className="mo-nut-chinh mt-4 w-full"><Play className="w-4 h-4" />{dangTao ? t('Đang tạo đề…', 'Generating…') : t('Bắt đầu', 'Start')}</button>
              </div>
            </aside>
          </div>
        )}

        {tab === 'pe' && (
          <div className="space-y-5">
            <div className="exam-card p-5">
              <div className="font-semibold mb-2">{t('Chuẩn bị', 'Setup')}</div>
              <ol className="mo-buoc">
                {ov.huongDanMoiTruong.map((b, i) => <li key={i} dangerouslySetInnerHTML={{ __html: sanitizeHtml(pickLang(b, L)) }} />)}
              </ol>
            </div>
            {ov.dePe.length === 0 && <div className="exam-card p-6 text-center text-text-secondary">{t('Môn này chưa có đề PE.', 'No PE papers for this course yet.')}</div>}
            {(['EXAM', 'CODELAB'] as const).map((nguonDe) => {
              const ds = ov.dePe.filter((p) => p.nguon === nguonDe);
              if (!ds.length) return null;
              return (
                <div key={nguonDe}>
                  <div className="mo-nhan mb-2">{nguonDe === 'EXAM' ? t(`Đề thật (${ds.length})`, `Real papers (${ds.length})`) : t(`Đề luyện (${ds.length})`, `Practice papers (${ds.length})`)}</div>
            <div className="grid sm:grid-cols-2 gap-4">
              {ds.map((p) => (
                <div key={`${p.nguon}-${p.id}`} className="exam-card p-4 flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="exam-badge exam-badge-pe">PE · {p.phut}′</span>
                    {p.coMayCham && <span className="exam-badge exam-badge-pass"><CheckCircle2 className="w-3.5 h-3.5" />{t('tự chấm', 'auto-graded')}</span>}
                    {p.coGiven && <span className="exam-badge" style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}><Download className="w-3.5 h-3.5" />Given</span>}
                    {p.soCau ? <span className="exam-badge" style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>{p.soCau} {t('câu', 'q')}</span> : null}
                  </div>
                  <div className="font-semibold leading-snug">{pickLang(p.tieuDe, L)}</div>
                  <div className="mt-auto flex gap-2">
                    <button disabled={dangTao} onClick={() => batDauPe(p.nguon === 'CODELAB' ? { exerciseId: p.id } : { examId: p.id }, 'thi')} className="mo-nut-chinh flex-1"><Timer className="w-4 h-4" />{t('Thi', 'Timed')} {p.phut}′</button>
                    <button disabled={dangTao} onClick={() => batDauPe(p.nguon === 'CODELAB' ? { exerciseId: p.id } : { examId: p.id }, 'luyen')} className="mo-nut-phu flex-1">{t('Luyện', 'Practice')}</button>
                  </div>
                </div>
              ))}
            </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'tien-bo' && <TienBo hist={hist} L={L} cloTen={ov.cloTen} />}
      </div>
    </div>
  );
}

function ChonMon({ ds, L, onChon }: { ds: MockMon[] | null; L: L; onChon: (ma: string) => void }) {
  const isVi = L === 'vi';
  const t = (vi: string, en: string) => (isVi ? vi : en);
  const [q, setQ] = useState('');
  const loc = useMemo(() => {
    const k = q.trim().toLowerCase();
    return (ds ?? []).filter((m) => !k || m.courseCode.toLowerCase().includes(k) || m.title.toLowerCase().includes(k));
  }, [ds, q]);
  return (
    <>
      <div className="exam-hero mb-5">
        <div className="flex items-center gap-2 text-[var(--exam-accent)] mb-2"><Layers className="w-5 h-5" /><span className="text-sm font-semibold uppercase tracking-wide">{TEN_PHONG}</span></div>
        <h1 className="text-2xl sm:text-3xl font-bold">{t('Chọn môn thi', 'Choose a course')}</h1>
        <label className="mt-4 flex items-center gap-2 max-w-md rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-2">
          <Search className="w-4 h-4 text-text-muted shrink-0" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('Mã môn hoặc tên môn', 'Course code or name')}
            className="bg-transparent outline-none text-sm flex-1 min-w-0" />
        </label>
      </div>
      {!ds ? (
        <div className="text-text-muted text-sm">{t('Đang tải…', 'Loading…')}</div>
      ) : !loc.length ? (
        <div className="exam-card p-6 text-center text-text-secondary">{t('Không có môn phù hợp.', 'No matching course.')}</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {loc.map((m) => (
            <button key={m.courseCode} onClick={() => onChon(m.courseCode)}
              className="exam-card p-4 text-left hover:border-[var(--exam-accent)] transition-colors flex flex-col gap-2">
              <span className="font-bold text-lg tracking-wide">{m.courseCode}</span>
              <span className="text-sm text-text-secondary line-clamp-2 min-h-[2.5rem]">{pickLang(m.title, L)}</span>
              <span className="flex flex-wrap gap-1.5 mt-auto">
                {m.soDeFe > 0 && <span className="exam-badge exam-badge-fe">FE · {m.soDeFe} {t('đề', m.soDeFe > 1 ? 'papers' : 'paper')}</span>}
                {m.soDePe > 0 && <span className="exam-badge exam-badge-pe">PE · {m.soDePe} {t('đề', m.soDePe > 1 ? 'papers' : 'paper')}</span>}
              </span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}

function TienBo({ hist, L, cloTen }: { hist: MockHistory | null; L: L; cloTen: Record<string, string> }) {
  const isVi = L === 'vi';
  const t = (vi: string, en: string) => (isVi ? vi : en);
  if (!hist) return <div className="text-text-muted text-sm">{t('Đang tải…', 'Loading…')}</div>;
  if (!hist.luot.length) return <div className="exam-card p-6 text-center text-text-secondary">{t('Chưa có lượt nào — làm một đề FE hoặc PE để thấy biểu đồ tiến bộ.', 'No attempts yet — take an FE or PE paper to see your progress chart.')}</div>;
  const yeu = [...hist.theoChuong].filter((c) => c.tong >= 2).sort((a, b) => a.tiLe - b.tiLe).slice(0, 3);
  return (
    <div className="space-y-5">
      <div className="exam-card p-5">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="font-semibold">{t('Điểm qua các lần thi', 'Score over attempts')}</div>
          <div className="flex items-center gap-3 text-[11px] text-text-muted">
            <span className="flex items-center gap-1"><span className="mo-cham" style={{ background: 'var(--exam-accent)' }} />FE</span>
            <span className="flex items-center gap-1"><span className="mo-cham" style={{ background: 'var(--exam-warn)' }} />PE</span>
            <span className="flex items-center gap-1"><span className="mo-gach" />{t('mức đạt', 'pass mark')}</span>
          </div>
        </div>
        <BieuDo luot={hist.luot} diemDat={hist.diemDatFe} isVi={isVi} />
      </div>

      {hist.theoChuong.length > 0 && (
        <div className="grid md:grid-cols-2 gap-5">
          <div className="exam-card p-5">
            <div className="font-semibold mb-1">{t('Theo chương', 'By chapter')}</div>
            <div className="text-[11px] text-text-muted mb-3">{t(`Gộp ${hist.soLuotGop} lượt FE mô phỏng gần nhất`, `Across your last ${hist.soLuotGop} mock FE attempts`)}</div>
            {yeu.length > 0 && <p className="text-sm mb-3">{t('Nên ôn trước:', 'Revise first:')} <b>{yeu.map((y) => pickLang(y.ten, L).split('—')[0].trim()).join(', ')}</b></p>}
            <Thanh ds={hist.theoChuong} L={L} />
          </div>
          <div className="exam-card p-5">
            <div className="font-semibold mb-3">{t('Theo CLO (chuẩn đầu ra)', 'By CLO (learning outcome)')}</div>
            <Thanh ds={hist.theoClo.map((c) => ({ ...c, ten: `${c.khoa} — ${pickLang(cloTen[c.khoa] ?? '', L)}` }))} L={L} />
          </div>
        </div>
      )}

      <div className="exam-card p-0 overflow-hidden">
        <div className="mo-bang-cuon">
          <table className="mo-bang">
            <thead><tr><th>{t('Lúc', 'When')}</th><th>{t('Đề', 'Paper')}</th><th>{t('Chế độ', 'Mode')}</th><th className="text-right">{t('Điểm', 'Score')}</th><th></th></tr></thead>
            <tbody>
              {[...hist.luot].reverse().map((l) => (
                <tr key={l.id}>
                  <td className="whitespace-nowrap text-text-muted">{l.at ? new Date(l.at).toLocaleString(isVi ? 'vi-VN' : 'en-GB', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                  <td><span className={`exam-badge ${l.kind === 'FE' ? 'exam-badge-fe' : 'exam-badge-pe'} mr-1.5`}>{l.kind}</span>{pickLang(l.tieuDe, L)}</td>
                  <td className="whitespace-nowrap text-text-secondary">{l.mode === 'STANDARD' ? t('đề thật', 'real paper') : l.mode === 'MOCK_PRACTICE' ? t('luyện', 'practice') : t('thi thật', 'timed')}</td>
                  <td className="text-right tabular-nums font-semibold" style={{ color: l.passed ? 'var(--exam-ok)' : l.passed === false ? 'var(--exam-danger)' : undefined }}>{l.score ?? '—'}{l.maxScore ? `/${l.maxScore}` : ''}</td>
                  <td className="text-right"><Link className="text-[var(--exam-accent)] text-xs font-semibold" href={`/exam/attempt/${l.id}`}>{t('Xem lại', 'Review')}</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Thanh({ ds, L }: { ds: Array<{ khoa: string; ten: string; dung: number; tong: number; tiLe: number }>; L: L }) {
  return (
    <div className="space-y-2.5">
      {ds.map((c) => (
        <div key={c.khoa}>
          <div className="flex justify-between gap-3 text-[13px]"><span className="truncate">{pickLang(c.ten, L)}</span><span className="tabular-nums text-text-secondary shrink-0">{c.dung}/{c.tong} · {c.tiLe}%</span></div>
          <div className="mo-thanh"><div style={{ width: `${c.tiLe}%`, background: c.tiLe >= 70 ? 'var(--exam-ok)' : c.tiLe >= 40 ? 'var(--exam-warn)' : 'var(--exam-danger)' }} /></div>
        </div>
      ))}
    </div>
  );
}

/** Biểu đồ đường SVG thuần (điểm quy về thang 10), không cần thư viện. */
function BieuDo({ luot, diemDat, isVi }: { luot: MockHistory['luot']; diemDat: number; isVi: boolean }) {
  const ds = luot.filter((l) => l.score != null && l.maxScore);
  const W = 640, H = 220, P = { l: 30, r: 12, t: 12, b: 26 };
  const x = (i: number) => P.l + (ds.length <= 1 ? (W - P.l - P.r) / 2 : (i * (W - P.l - P.r)) / (ds.length - 1));
  const y = (v: number) => P.t + (1 - v / 10) * (H - P.t - P.b);
  const diem = ds.map((l, i) => ({ i, v: Math.round(((l.score as number) / (l.maxScore as number)) * 1000) / 100, kind: l.kind, id: l.id }));
  const duong = (k: string) => diem.filter((d) => d.kind === k).map((d, j) => `${j ? 'L' : 'M'}${x(d.i).toFixed(1)},${y(d.v).toFixed(1)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={isVi ? 'Biểu đồ điểm' : 'Score chart'}>
      {[0, 2, 4, 6, 8, 10].map((v) => (
        <g key={v}>
          <line x1={P.l} x2={W - P.r} y1={y(v)} y2={y(v)} stroke="var(--border-color)" strokeWidth="1" />
          <text x={P.l - 6} y={y(v) + 4} textAnchor="end" fontSize="10" fill="var(--text-muted)">{v}</text>
        </g>
      ))}
      <line x1={P.l} x2={W - P.r} y1={y(diemDat)} y2={y(diemDat)} stroke="var(--exam-danger)" strokeDasharray="5 4" strokeWidth="1.2" />
      <path d={duong('FE')} fill="none" stroke="var(--exam-accent)" strokeWidth="2.2" />
      <path d={duong('PE')} fill="none" stroke="var(--exam-warn)" strokeWidth="2.2" />
      {diem.map((d) => (
        <circle key={d.id} cx={x(d.i)} cy={y(d.v)} r="4" fill={d.kind === 'FE' ? 'var(--exam-accent)' : 'var(--exam-warn)'} stroke="var(--bg-card)" strokeWidth="1.5">
          <title>{`#${d.i + 1}: ${d.v}/10`}</title>
        </circle>
      ))}
      <text x={W - P.r} y={H - 6} textAnchor="end" fontSize="10" fill="var(--text-muted)">{isVi ? `${ds.length} lượt — cũ → mới` : `${ds.length} attempts — old → new`}</text>
    </svg>
  );
}
