'use client';

/**
 * /creator/quay-khoa-hoc — "Quay khoá học" (04/10/2026).
 *
 * Gõ mã môn hoặc tên khoá (Academy + Courses gộp một danh sách) → chọn chương →
 * chọn bài (hoặc "Tổng quan chương" / "Giới thiệu khoá") → AI đọc NỘI DUNG BÀI
 * THẬT ở máy chủ và soạn trọn gói quay: hook, giới thiệu, lời giảng từng cảnh,
 * góc máy, màn hình, b-roll, tóm tắt, câu hỏi, CTA, mô tả YouTube. Gói được lưu
 * thành một dự án (gắn môn/bài) — mở ra là có Kịch bản, Teleprompter, Phân cảnh.
 *
 * Soạn hàng loạt: tick nhiều bài → xác nhận số lượng → máy chủ soạn LẦN LƯỢT
 * từng bài (không song song — đỡ tốn tiền đột biến, dừng được giữa chừng).
 *
 * Chọn khoá/bài được ghi vào chuỗi truy vấn (`?khoa=&bai=`) qua `moiTruong.ts`
 * nên chạy đúng cả trên web lẫn trong app desktop (app://…/index.html).
 */
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDashed,
  Clapperboard,
  FileQuestion,
  GraduationCap,
  Layers,
  Loader2,
  Mic,
  PlayCircle,
  RefreshCw,
  Search,
  Sparkles,
  Square,
  SquareCheck,
  X,
  XCircle,
} from 'lucide-react';
import { docTruyVan, ghiTruyVan } from '@/components/sach-hoc/moiTruong';
import GoiQuayView from '@/components/studio/ai/GoiQuayView';
import { TienDoAi } from '@/components/studio/ai/TienDoAi';
import {
  creatorAiApi,
  useViecAi,
  type BaiMuc,
  type BaiTrongLo,
  type DuAnGan,
  type KetQuaGoi,
  type KhoaHocMuc,
  type MucLucKhoa,
  type NgonNguQuay,
  type PhongCachQuay,
} from '@/lib/creator-ai';
import { contentKeys } from '@/hooks/useContentQueries';
import css from '@/components/studio/ai/creatorAi.module.css';

type Nguon = 'ALL' | 'ACADEMY' | 'COURSES';
type Chon =
  | { phamVi: 'bai'; id: number; ten: string; chuong: string; duAn: DuAnGan | null; soKyTu: number }
  | { phamVi: 'chuong'; id: number; ten: string; duAn: DuAnGan | null }
  | { phamVi: 'khoa'; ten: string; duAn: DuAnGan | null };

function boDau(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\u0111/g, 'd');
}

const PHUT_CHON = [0, 5, 8, 10, 15, 20, 30];
const PHONG_CACH: Array<{ id: PhongCachQuay; ten: string; moTa: string }> = [
  { id: 'ket_hop', ten: 'Kết hợp', moTa: 'Trước máy cho mở/kết & khái niệm, quay màn hình cho sơ đồ/code' },
  { id: 'truoc_may', ten: 'Trước máy', moTa: 'Người trong khung là chính, chèn slide bên cạnh' },
  { id: 'man_hinh', ten: 'Quay màn hình', moTa: 'Slide/code là chính, giọng lồng' },
];

export default function QuayKhoaHocPage() {
  return (
    <Suspense fallback={null}>
      <QuayKhoaHoc />
    </Suspense>
  );
}

function QuayKhoaHoc() {
  const router = useRouter();
  const qc = useQueryClient();
  const [tim, setTim] = useState('');
  const [nguon, setNguon] = useState<Nguon>('ALL');
  const [khoaSlug, setKhoaSlug] = useState<string | null>(null);
  const [chon, setChon] = useState<Chon | null>(null);
  const [mo, setMo] = useState<Set<number>>(new Set());
  const [lo, setLo] = useState<Set<number>>(new Set());
  const [lang, setLang] = useState<NgonNguQuay>('VI');
  const [phut, setPhut] = useState(0);
  const [phongCach, setPhongCach] = useState<PhongCachQuay>('ket_hop');
  const [ghiChu, setGhiChu] = useState('');
  const [ketQua, setKetQua] = useState<KetQuaGoi | null>(null);
  const [xacNhanLo, setXacNhanLo] = useState(false);
  const [boQuaDaCo, setBoQuaDaCo] = useState(true);
  const [baiChoBai, setBaiChoBai] = useState<number | null>(null);

  const viec = useViecAi<KetQuaGoi>();
  const viecLo = useViecAi<{ soXong: number; lo: BaiTrongLo[] }>();

  // ── Đọc lựa chọn từ chuỗi truy vấn (deep link + giữ chỗ khi quay lại) ──
  useEffect(() => {
    const q = docTruyVan();
    const k = q.get('khoa');
    if (k) setKhoaSlug(k);
    const b = Number(q.get('bai'));
    if (b > 0) setBaiChoBai(b);
  }, []);

  const danhMuc = useQuery({
    queryKey: ['creator-ai', 'khoa-hoc'],
    queryFn: async () => (await creatorAiApi.khoaHoc()).data.data,
    staleTime: 5 * 60_000,
  });
  const mucLuc = useQuery({
    queryKey: ['creator-ai', 'muc-luc', khoaSlug],
    queryFn: async () => (await creatorAiApi.mucLuc(khoaSlug!)).data.data,
    enabled: !!khoaSlug,
    staleTime: 30_000,
  });

  // Mở sẵn chương chứa bài trong link, rồi chọn bài đó.
  useEffect(() => {
    const ml = mucLuc.data;
    if (!ml || !baiChoBai) return;
    for (const c of ml.chuong) {
      const b = c.bai.find((x) => x.id === baiChoBai);
      if (b) {
        setMo((s) => new Set(s).add(c.id));
        setChon({ phamVi: 'bai', id: b.id, ten: b.ten, chuong: c.ten, duAn: b.duAn, soKyTu: b.soKyTu });
        break;
      }
    }
    setBaiChoBai(null);
  }, [mucLuc.data, baiChoBai]);

  const loc = useMemo(() => {
    const ds = danhMuc.data ?? [];
    const q = boDau(tim.trim());
    return ds.filter((k) => {
      if (nguon !== 'ALL' && k.nguon !== nguon) return false;
      if (!q) return true;
      return boDau(`${k.ma ?? ''} ${k.ten} ${k.tenEn} ${k.hocKy ?? ''}`).includes(q);
    }).sort((a, b) => {
      // Gõ đúng mã môn thì môn đó lên đầu.
      if (!q) return 0;
      const am = boDau(a.ma ?? '').startsWith(q) ? 0 : 1;
      const bm = boDau(b.ma ?? '').startsWith(q) ? 0 : 1;
      return am - bm;
    });
  }, [danhMuc.data, tim, nguon]);

  const chonKhoa = useCallback((k: KhoaHocMuc | null) => {
    setKhoaSlug(k?.slug ?? null);
    setChon(null);
    setLo(new Set());
    setKetQua(null);
    viec.datLai();
    ghiTruyVan((q) => {
      if (k) q.set('khoa', k.slug); else q.delete('khoa');
      q.delete('bai');
    });
  }, [viec]);

  const chonMuc = useCallback((c: Chon) => {
    setChon(c);
    setKetQua(null);
    viec.datLai();
    ghiTruyVan((q) => {
      if (c.phamVi === 'bai') q.set('bai', String(c.id)); else q.delete('bai');
    });
  }, [viec]);

  const lamMoiMucLuc = () => {
    void qc.invalidateQueries({ queryKey: ['creator-ai'] });
    void qc.invalidateQueries({ queryKey: contentKeys.all });
  };

  const soan = async () => {
    if (!chon || !mucLuc.data) return;
    setKetQua(null);
    const kq = await viec.chay({
      loai: 'goi_bai',
      phamVi: chon.phamVi,
      lessonId: chon.phamVi === 'bai' ? chon.id : undefined,
      sectionId: chon.phamVi === 'chuong' ? chon.id : undefined,
      courseSlug: mucLuc.data.slug,
      lang, phut, phongCach, ghiChu,
      luu: 'tao_du_an',
    });
    if (kq) {
      setKetQua(kq);
      if (kq.duAnId) setChon((c) => (c ? { ...c, duAn: { id: kq.duAnId!, status: 'SCRIPTING', updatedAt: new Date().toISOString() } } : c));
      lamMoiMucLuc();
    }
  };

  const tatCaBai = useMemo(() => (mucLuc.data?.chuong ?? []).flatMap((c) => c.bai), [mucLuc.data]);
  const baiLo = tatCaBai.filter((b) => lo.has(b.id));
  const soDaCo = baiLo.filter((b) => b.duAn).length;
  const soSeSoan = boQuaDaCo ? baiLo.length - soDaCo : baiLo.length;

  const chayLo = async () => {
    setXacNhanLo(false);
    const kq = await viecLo.chay({
      loai: 'lo_bai',
      lessonIds: baiLo.map((b) => b.id),
      boQuaDaCo, lang, phut, phongCach, ghiChu,
    });
    if (kq) lamMoiMucLuc();
  };

  const ml = mucLuc.data;

  return (
    <div className={css.trang}>
      {/* Đầu trang */}
      <div className="flex flex-wrap items-end gap-4 mb-5">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-11 h-11 rounded-xl bg-studio-500/15 ring-1 ring-studio-500/30 flex items-center justify-center shrink-0">
            <GraduationCap className="w-6 h-6 text-studio-400" />
          </div>
          <div className="min-w-0">
            <h1 className="font-heading text-2xl font-bold text-text-primary">Quay khoá học</h1>
            <p className="text-[13px] text-text-muted">
              Chọn môn → chương → bài. AI đọc đúng nội dung bài trong Academy/Courses và soạn trọn gói quay — bạn chỉ việc đặt máy và nói.
            </p>
          </div>
        </div>
        {ml && (
          <button type="button" onClick={() => chonKhoa(null)}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-darkborder text-sm text-text-secondary hover:text-text-primary hover:bg-white/5">
            <X className="w-4 h-4" /> Đổi khoá học
          </button>
        )}
      </div>

      {!khoaSlug ? (
        <ChonKhoa
          tim={tim} setTim={setTim} nguon={nguon} setNguon={setNguon}
          ds={loc} dangTai={danhMuc.isLoading} loi={danhMuc.isError}
          onChon={chonKhoa}
        />
      ) : (
        <div className={css.haiCot}>
          {/* ── Cột mục lục ── */}
          <aside className={`${css.dinh} rounded-2xl border border-darkborder bg-darkcard overflow-hidden flex flex-col`}>
            {mucLuc.isLoading || !ml ? (
              <div className="p-6 text-sm text-text-muted flex items-center gap-2">
                {mucLuc.isError ? 'Không tải được mục lục khoá này.' : (<><Loader2 className="w-4 h-4 animate-spin" /> Đang tải mục lục…</>)}
              </div>
            ) : (
              <>
                <div className="p-4 border-b border-darkborder">
                  <div className="flex items-center gap-2 mb-1">
                    {ml.ma && <span className="px-2 h-6 rounded-md bg-studio-500/15 text-studio-300 text-xs font-bold inline-flex items-center">{ml.ma}</span>}
                    <span className="text-[11px] text-text-muted">{ml.nguon === 'ACADEMY' ? `Academy${ml.hocKy ? ` · ${ml.hocKy}` : ''}` : 'Courses'}</span>
                  </div>
                  <h2 className="font-heading text-base font-bold text-text-primary leading-snug">{ml.ten}</h2>
                  <p className="text-[11px] text-text-muted mt-1">
                    {ml.chuong.length} chương · {tatCaBai.length} bài · {tatCaBai.filter((b) => b.duAn).length} bài đã có dự án
                  </p>
                </div>
                <div className="overflow-y-auto flex-1 p-2">
                  <HangMuc
                    active={chon?.phamVi === 'khoa'}
                    icon={<PlayCircle className="w-4 h-4 text-studio-400" />}
                    ten="Video giới thiệu khoá học"
                    phu="Trailer + định hướng cả khoá"
                    duAn={ml.gioiThieu}
                    onClick={() => chonMuc({ phamVi: 'khoa', ten: 'Giới thiệu khoá học', duAn: ml.gioiThieu })}
                  />
                  {ml.chuong.map((c) => {
                    const dangMo = mo.has(c.id);
                    const daChonHet = c.bai.length > 0 && c.bai.every((b) => lo.has(b.id));
                    return (
                      <div key={c.id} className="mt-1">
                        <div className="flex items-center gap-1 rounded-lg hover:bg-white/[0.03]">
                          <button type="button" onClick={() => setMo((s) => { const n = new Set(s); if (n.has(c.id)) n.delete(c.id); else n.add(c.id); return n; })}
                            className="flex items-center gap-1.5 flex-1 min-w-0 px-2 py-2 text-left">
                            {dangMo ? <ChevronDown className="w-4 h-4 text-text-muted shrink-0" /> : <ChevronRight className="w-4 h-4 text-text-muted shrink-0" />}
                            <span className="text-[13px] font-semibold text-text-primary truncate" title={c.ten}>{c.ten}</span>
                            <span className="ml-auto text-[10px] text-text-muted shrink-0">{c.bai.filter((b) => b.duAn).length}/{c.bai.length}</span>
                          </button>
                          <button type="button" title={daChonHet ? 'Bỏ chọn cả chương' : 'Chọn cả chương để soạn hàng loạt'}
                            onClick={() => setLo((s) => { const n = new Set(s); for (const b of c.bai) { if (daChonHet) n.delete(b.id); else n.add(b.id); } return n; })}
                            className="p-1.5 rounded-md text-text-muted hover:text-studio-300">
                            {daChonHet ? <SquareCheck className="w-4 h-4 text-studio-400" /> : <Square className="w-4 h-4" />}
                          </button>
                        </div>
                        {dangMo && (
                          <div className="ml-3 pl-2 border-l border-darkborder">
                            <HangMuc
                              active={chon?.phamVi === 'chuong' && chon.id === c.id}
                              icon={<Layers className="w-4 h-4 text-sky-400" />}
                              ten="Tổng quan chương"
                              phu="Một video đi qua cả chương"
                              duAn={c.duAn}
                              onClick={() => chonMuc({ phamVi: 'chuong', id: c.id, ten: `Tổng quan · ${c.ten}`, duAn: c.duAn })}
                            />
                            {c.bai.map((b) => (
                              <DongBai key={b.id} b={b}
                                active={chon?.phamVi === 'bai' && chon.id === b.id}
                                tick={lo.has(b.id)}
                                onTick={() => setLo((s) => { const n = new Set(s); if (n.has(b.id)) n.delete(b.id); else n.add(b.id); return n; })}
                                onClick={() => chonMuc({ phamVi: 'bai', id: b.id, ten: b.ten, chuong: c.ten, duAn: b.duAn, soKyTu: b.soKyTu })}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {lo.size > 0 && (
                  <div className="p-3 border-t border-darkborder bg-studio-500/[0.06] flex items-center gap-2">
                    <span className="text-[13px] text-text-primary flex-1">Đã chọn <b>{lo.size}</b> bài</span>
                    <button type="button" onClick={() => setLo(new Set())} className="h-8 px-2.5 rounded-lg text-xs text-text-muted hover:text-text-primary">Bỏ chọn</button>
                    <button type="button" disabled={viecLo.dangChay} onClick={() => setXacNhanLo(true)}
                      className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-studio-gradient text-studio-950 text-xs font-bold disabled:opacity-50">
                      <Sparkles className="w-3.5 h-3.5" /> Soạn hàng loạt
                    </button>
                  </div>
                )}
              </>
            )}
          </aside>

          {/* ── Cột làm việc ── */}
          <section className="min-w-0 space-y-4">
            {(viecLo.dangChay || viecLo.tt?.lo || viecLo.loi) && (
              <TienDoLo tt={viecLo.tt} dangChay={viecLo.dangChay} loi={viecLo.loi}
                onHuy={() => void viecLo.huy()}
                onMo={(id) => router.push(`/creator/projects/${id}`)}
                onDong={() => viecLo.datLai()} />
            )}

            {!chon ? (
              <div className="rounded-2xl border border-dashed border-darkborder bg-darkcard/50 p-10 text-center">
                <BookOpen className="w-10 h-10 text-studio-400 mx-auto mb-3" />
                <p className="text-text-primary font-semibold">Chọn một bài ở mục lục bên trái</p>
                <p className="text-[13px] text-text-muted mt-1 max-w-md mx-auto">
                  Hoặc “Video giới thiệu khoá học” / “Tổng quan chương”. Tick nhiều bài để soạn hàng loạt cả chương.
                </p>
              </div>
            ) : (
              <>
                <div className="rounded-2xl border border-darkborder bg-darkcard p-4 sm:p-5">
                  <div className="flex flex-wrap items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">
                        {chon.phamVi === 'bai' ? chon.chuong : chon.phamVi === 'chuong' ? 'Video tổng quan chương' : 'Video giới thiệu khoá'}
                      </p>
                      <h2 className="font-heading text-xl font-bold text-text-primary leading-snug mt-0.5">{chon.ten}</h2>
                      {chon.phamVi === 'bai' && chon.soKyTu < 800 && (
                        <p className="mt-1.5 text-[12px] text-amber-300">
                          Bài này có ít nội dung văn bản ({chon.soKyTu} ký tự) — AI sẽ soạn khung và đánh dấu chỗ cần bạn bổ sung, không bịa.
                        </p>
                      )}
                    </div>
                    {chon.duAn && (
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => router.push(`/creator/projects/${chon.duAn!.id}`)}
                          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-emerald-500/40 text-emerald-300 text-sm font-semibold hover:bg-emerald-500/10">
                          <Clapperboard className="w-4 h-4" /> Mở dự án
                        </button>
                        <button type="button" onClick={() => router.push(`/creator/projects/${chon.duAn!.id}?tab=teleprompter`)}
                          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-darkborder text-text-secondary text-sm hover:text-text-primary hover:bg-white/5">
                          <Mic className="w-4 h-4" /> Teleprompter
                        </button>
                      </div>
                    )}
                  </div>

                  <CaiDat lang={lang} setLang={setLang} phut={phut} setPhut={setPhut} phongCach={phongCach} setPhongCach={setPhongCach} ghiChu={ghiChu} setGhiChu={setGhiChu} />

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button type="button" onClick={() => void soan()} disabled={viec.dangChay}
                      className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-studio-gradient text-studio-950 font-bold text-sm shadow-[0_0_20px_rgba(245,158,11,0.25)] disabled:opacity-50">
                      {viec.dangChay ? <Loader2 className="w-4 h-4 animate-spin" /> : chon.duAn ? <RefreshCw className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                      {chon.duAn ? 'Soạn lại gói quay' : 'Soạn gói quay'}
                    </button>
                    <p className="text-[12px] text-text-muted max-w-xl">
                      {chon.duAn
                        ? 'Soạn lại sẽ ghi vào dự án đã có; kịch bản cũ được lưu thành phiên bản để khôi phục.'
                        : 'Gói quay được lưu thành dự án mới (gắn môn/bài) với Kịch bản, Phân cảnh, Teleprompter, bài đăng YouTube.'}
                      {' '}Thường mất 1–4 phút.
                    </p>
                  </div>
                </div>

                <TienDoAi tt={viec.tt} dangChay={viec.dangChay} loi={viec.loi}
                  tieuDe="AI đang đọc bài và soạn gói quay…" goiY="có thể rời trang — dự án vẫn được lưu khi xong"
                  onThuLai={() => void soan()} />

                {ketQua && (
                  <>
                    {ketQua.duAnId && (
                      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                        <span className="text-sm text-emerald-100 flex-1">
                          {ketQua.taoMoi ? 'Đã tạo dự án mới từ gói quay.' : 'Đã cập nhật dự án (bản cũ nằm trong Lịch sử kịch bản).'}
                        </span>
                        <button type="button" onClick={() => router.push(`/creator/projects/${ketQua.duAnId}`)}
                          className="h-8 px-3 rounded-lg bg-emerald-500/20 text-emerald-100 text-xs font-semibold hover:bg-emerald-500/30">Mở dự án</button>
                        <button type="button" onClick={() => router.push(`/creator/projects/${ketQua.duAnId}?tab=teleprompter`)}
                          className="h-8 px-3 rounded-lg border border-emerald-500/40 text-emerald-100 text-xs font-semibold hover:bg-emerald-500/15">Teleprompter</button>
                      </div>
                    )}
                    <GoiQuayView goi={ketQua.goi} nhan={ketQua.nguon?.nhan} />
                  </>
                )}
              </>
            )}
          </section>
        </div>
      )}

      {xacNhanLo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70" onClick={() => setXacNhanLo(false)}>
          <div className="w-full max-w-lg rounded-2xl border border-studio-500/25 bg-darkcard p-5 shadow-2xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <h3 className="font-heading text-lg font-bold text-text-primary">Soạn hàng loạt {baiLo.length} bài?</h3>
            <p className="text-[13px] text-text-secondary mt-1.5">
              Máy chủ soạn <b>lần lượt từng bài</b> (không song song) và tạo một dự án cho mỗi bài. Bạn có thể huỷ giữa chừng — các bài đã xong vẫn giữ.
            </p>
            <ul className="mt-3 space-y-1 text-[13px] text-text-secondary">
              <li>• Sẽ soạn: <b className="text-text-primary">{soSeSoan}</b> bài{soDaCo > 0 ? ` (${soDaCo} bài đã có dự án)` : ''}</li>
              <li>• Thời gian ước tính: khoảng {Math.max(1, Math.round(soSeSoan * 2.5))} phút</li>
              <li>• Ngôn ngữ {lang === 'EN' ? 'tiếng Anh' : 'tiếng Việt'} · {phut ? `${phut} phút/bài` : 'thời lượng tự động theo bài'} · {PHONG_CACH.find((p) => p.id === phongCach)?.ten}</li>
              <li>• Mỗi bài tốn một lượt AI dài — có trần token/ngày và trần chi phí, chạm trần thì lô tự dừng.</li>
            </ul>
            {soDaCo > 0 && (
              <label className="mt-3 flex items-center gap-2 text-[13px] text-text-secondary cursor-pointer">
                <input type="checkbox" checked={boQuaDaCo} onChange={(e) => setBoQuaDaCo(e.target.checked)} className="accent-amber-500" />
                Bỏ qua {soDaCo} bài đã có dự án (bỏ tick = soạn lại cả những bài đó)
              </label>
            )}
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setXacNhanLo(false)} className="h-9 px-4 rounded-lg text-sm text-text-secondary hover:bg-white/5">Huỷ</button>
              <button type="button" disabled={soSeSoan === 0} onClick={() => void chayLo()}
                className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-studio-gradient text-studio-950 text-sm font-bold disabled:opacity-50">
                <Sparkles className="w-4 h-4" /> Bắt đầu soạn {soSeSoan} bài
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Chọn khoá ───────────────────────────────────────────────────────────────

function ChonKhoa({ tim, setTim, nguon, setNguon, ds, dangTai, loi, onChon }: {
  tim: string; setTim: (s: string) => void; nguon: Nguon; setNguon: (n: Nguon) => void;
  ds: KhoaHocMuc[]; dangTai: boolean; loi: boolean; onChon: (k: KhoaHocMuc) => void;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <label className="relative flex-1 min-w-[260px] max-w-2xl">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            autoFocus
            value={tim}
            onChange={(e) => setTim(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && ds[0]) onChon(ds[0]); }}
            placeholder="Gõ mã môn (CSD201, PRO192…) hoặc tên khoá học…"
            className="w-full h-12 pl-10 pr-4 rounded-xl border border-darkborder bg-darkcard text-[15px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-studio-500/60 focus:ring-2 focus:ring-studio-500/20"
          />
        </label>
        <div className="flex items-center gap-1 p-1 rounded-xl border border-darkborder bg-darkcard">
          {([['ALL', 'Tất cả'], ['ACADEMY', 'Academy'], ['COURSES', 'Courses']] as const).map(([id, ten]) => (
            <button key={id} type="button" onClick={() => setNguon(id)}
              className={`h-9 px-3 rounded-lg text-sm font-medium transition-colors ${nguon === id ? 'bg-studio-500/15 text-studio-300' : 'text-text-muted hover:text-text-primary'}`}>
              {ten}
            </button>
          ))}
        </div>
        <span className="text-[12px] text-text-muted">{dangTai ? 'Đang tải…' : `${ds.length} khoá`}</span>
      </div>
      {loi && <p className="text-sm text-red-300">Không tải được danh mục khoá học.</p>}
      <div className={css.luoiThe}>
        {ds.map((k) => (
          <button key={k.slug} type="button" onClick={() => onChon(k)}
            className="group text-left rounded-2xl border border-darkborder bg-darkcard p-4 hover:border-studio-500/50 transition-colors">
            <div className="flex items-center gap-2 mb-1.5">
              {k.ma && <span className="px-2 h-6 rounded-md bg-studio-500/15 text-studio-300 text-xs font-bold inline-flex items-center">{k.ma}</span>}
              <span className={`text-[10px] font-semibold uppercase tracking-wider ${k.nguon === 'ACADEMY' ? 'text-sky-300' : 'text-violet-300'}`}>{k.nguon === 'ACADEMY' ? 'Academy' : 'Courses'}</span>
              {!k.daXuatBan && <span className="text-[10px] text-text-muted">· nháp</span>}
            </div>
            <p className="text-[14px] font-semibold text-text-primary leading-snug line-clamp-2 group-hover:text-studio-200">{k.ten}</p>
            <p className="text-[11px] text-text-muted mt-1.5">
              {k.hocKy ? `${k.hocKy} · ` : ''}{k.soChuong} chương · {k.soBai} bài{k.soDuAn ? ` · ${k.soDuAn} dự án` : ''}
            </p>
          </button>
        ))}
      </div>
      {!dangTai && ds.length === 0 && !loi && (
        <p className="text-sm text-text-muted mt-6 text-center">Không có khoá nào khớp “{tim}”.</p>
      )}
    </div>
  );
}

// ─── Mục lục ─────────────────────────────────────────────────────────────────

function HangMuc({ active, icon, ten, phu, duAn, onClick }: {
  active: boolean; icon: React.ReactNode; ten: string; phu: string; duAn: DuAnGan | null; onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors ${active ? 'bg-studio-500/15 ring-1 ring-studio-500/30' : 'hover:bg-white/[0.04]'}`}>
      {icon}
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-medium text-text-primary truncate">{ten}</span>
        <span className="block text-[11px] text-text-muted truncate">{phu}</span>
      </span>
      {duAn && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-label="Đã có dự án" />}
    </button>
  );
}

function DongBai({ b, active, tick, onTick, onClick }: {
  b: BaiMuc; active: boolean; tick: boolean; onTick: () => void; onClick: () => void;
}) {
  const mong = b.soKyTu < 800;
  return (
    <div className={`flex items-center gap-1 rounded-lg ${active ? 'bg-studio-500/15 ring-1 ring-studio-500/30' : 'hover:bg-white/[0.04]'}`}>
      <button type="button" onClick={onTick} className="p-1.5 text-text-muted hover:text-studio-300" aria-label="Chọn để soạn hàng loạt">
        {tick ? <SquareCheck className="w-4 h-4 text-studio-400" /> : <Square className="w-4 h-4" />}
      </button>
      <button type="button" onClick={onClick} className="flex items-center gap-2 flex-1 min-w-0 py-1.5 pr-2 text-left">
        <span className="text-[13px] text-text-primary truncate flex-1" title={b.ten}>{b.ten}</span>
        {b.loai === 'QUIZ' || b.coQuiz ? <FileQuestion className="w-3.5 h-3.5 text-pink-300 shrink-0" aria-label="Có quiz" /> : null}
        {mong && <span className="text-[10px] text-amber-300/90 shrink-0" title="Ít nội dung văn bản">mỏng</span>}
        {b.duAn ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-label="Đã có dự án" /> : <CircleDashed className="w-4 h-4 text-text-muted/50 shrink-0" />}
      </button>
    </div>
  );
}

// ─── Cài đặt ─────────────────────────────────────────────────────────────────

function CaiDat({ lang, setLang, phut, setPhut, phongCach, setPhongCach, ghiChu, setGhiChu }: {
  lang: NgonNguQuay; setLang: (l: NgonNguQuay) => void; phut: number; setPhut: (n: number) => void;
  phongCach: PhongCachQuay; setPhongCach: (p: PhongCachQuay) => void; ghiChu: string; setGhiChu: (s: string) => void;
}) {
  return (
    <div className={`mt-4 ${css.caiDat}`}><div className={css.caiDatLuoi}>
      <div className="space-y-3">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-text-muted font-semibold mb-1.5">Ngôn ngữ video</p>
          <div className="inline-flex p-1 rounded-xl border border-darkborder">
            {(['VI', 'EN'] as const).map((l) => (
              <button key={l} type="button" onClick={() => setLang(l)}
                className={`h-8 px-3 rounded-lg text-sm font-medium ${lang === l ? 'bg-studio-500/15 text-studio-300' : 'text-text-muted hover:text-text-primary'}`}>
                {l === 'VI' ? 'Tiếng Việt' : 'English'}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-text-muted font-semibold mb-1.5">Thời lượng</p>
          <div className="flex flex-wrap gap-1">
            {PHUT_CHON.map((p) => (
              <button key={p} type="button" onClick={() => setPhut(p)}
                className={`h-8 px-3 rounded-lg text-sm border ${phut === p ? 'border-studio-500/50 bg-studio-500/15 text-studio-300' : 'border-darkborder text-text-muted hover:text-text-primary'}`}>
                {p === 0 ? 'Tự động' : `${p} phút`}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-text-muted font-semibold mb-1.5">Phong cách quay</p>
          <div className="grid gap-1.5 [grid-template-columns:repeat(auto-fit,minmax(150px,1fr))]">
            {PHONG_CACH.map((p) => (
              <button key={p.id} type="button" onClick={() => setPhongCach(p.id)} title={p.moTa}
                className={`text-left rounded-lg border px-2.5 py-2 ${phongCach === p.id ? 'border-studio-500/50 bg-studio-500/10' : 'border-darkborder hover:border-white/20'}`}>
                <span className={`flex items-center gap-1 text-[13px] font-semibold ${phongCach === p.id ? 'text-studio-300' : 'text-text-primary'}`}>
                  {phongCach === p.id && <Check className="w-3.5 h-3.5" />}{p.ten}
                </span>
                <span className="block text-[11px] text-text-muted leading-snug mt-0.5">{p.moTa}</span>
              </button>
            ))}
          </div>
        </div>
        <label className="block">
          <span className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">Ghi chú cho AI (tuỳ chọn)</span>
          <textarea value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} rows={2} maxLength={1500}
            placeholder="VD: nhấn mạnh phần lỗi hay gặp khi thi PE; demo bằng IntelliJ; giọng vui hơn…"
            className="mt-1.5 w-full rounded-lg border border-darkborder bg-black/20 px-3 py-2 text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-studio-500/50 resize-y" />
        </label>
      </div>
    </div></div>
  );
}

// ─── Tiến độ lô ──────────────────────────────────────────────────────────────

function TienDoLo({ tt, dangChay, loi, onHuy, onMo, onDong }: {
  tt: { lo: BaiTrongLo[] | null; giay: number; kyTu: number; trangThai: string } | null;
  dangChay: boolean; loi: string | null; onHuy: () => void; onMo: (id: number) => void; onDong: () => void;
}) {
  const lo = tt?.lo ?? [];
  const xong = lo.filter((b) => b.trangThai === 'xong').length;
  const boQua = lo.filter((b) => b.trangThai === 'bo_qua').length;
  const hong = lo.filter((b) => b.trangThai === 'loi').length;
  const phanTram = lo.length ? Math.round(((xong + boQua + hong) / lo.length) * 100) : 0;
  return (
    <div className="rounded-2xl border border-studio-500/30 bg-darkcard p-4">
      <div className="flex items-center gap-3">
        {dangChay ? <Loader2 className="w-5 h-5 text-studio-400 animate-spin" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text-primary">
            {dangChay ? 'Đang soạn hàng loạt…' : tt?.trangThai === 'huy' ? 'Đã dừng lô' : 'Lô đã xong'}
          </p>
          <p className="text-[12px] text-text-muted">
            {xong} xong · {boQua} bỏ qua · {hong} lỗi · {lo.length} bài · {tt?.giay ?? 0}s
          </p>
        </div>
        {dangChay ? (
          <button type="button" onClick={onHuy} className="h-8 px-3 rounded-lg border border-darkborder text-xs text-text-secondary hover:text-red-300 hover:border-red-400/40">Dừng sau bài này</button>
        ) : (
          <button type="button" onClick={onDong} className="h-8 px-3 rounded-lg text-xs text-text-muted hover:text-text-primary">Đóng</button>
        )}
      </div>
      <div className="mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div className="h-full rounded-full bg-studio-gradient transition-all" style={{ width: `${phanTram}%` }} />
      </div>
      {loi && <p className="mt-2 text-[13px] text-red-300">{loi}</p>}
      {lo.length > 0 && (
        <ul className="mt-3 max-h-64 overflow-y-auto divide-y divide-darkborder">
          {lo.map((b) => (
            <li key={b.lessonId} className="flex items-center gap-2 py-1.5 text-[13px]">
              {b.trangThai === 'dang' ? <Loader2 className="w-4 h-4 text-studio-400 animate-spin" />
                : b.trangThai === 'xong' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  : b.trangThai === 'loi' ? <XCircle className="w-4 h-4 text-red-400" />
                    : b.trangThai === 'bo_qua' ? <CircleDashed className="w-4 h-4 text-text-muted" />
                      : <CircleDashed className="w-4 h-4 text-text-muted/40" />}
              <span className="flex-1 min-w-0 truncate text-text-secondary" title={b.loi}>{b.ten}{b.loi ? ` — ${b.loi}` : ''}</span>
              {b.duAnId && (
                <button type="button" onClick={() => onMo(b.duAnId!)} className="text-[12px] text-studio-300 hover:text-studio-200">Mở</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
