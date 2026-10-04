'use client';

/**
 * /creator/y-tuong-ai — "Ý tưởng AI" (04/10/2026).
 *
 * Người dùng chỉ MÔ TẢ ý tưởng (vlog, video ngắn, hướng dẫn, quảng bá khoá học…)
 * → AI đề xuất 5 góc tiếp cận khác hẳn nhau → chọn một → AI viết trọn gói quay
 * (kịch bản, cảnh, lời thoại, góc máy, chữ trên màn hình, mô tả đăng) và lưu
 * thành dự án. Góc hay mà chưa quay thì cất vào Kho ý tưởng.
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Bookmark, Check, CheckCircle2, Lightbulb, Loader2, Sparkles, Wand2 } from 'lucide-react';
import GoiQuayView from '@/components/studio/ai/GoiQuayView';
import { TienDoAi } from '@/components/studio/ai/TienDoAi';
import { useViecAi, type GocYTuong, type KetQuaGoi, type NgonNguQuay, type PhongCachQuay } from '@/lib/creator-ai';
import { contentApi } from '@/lib/api';
import { contentKeys } from '@/hooks/useContentQueries';
import type { ContentType } from '@/types';
import css from '@/components/studio/ai/creatorAi.module.css';

const DINH_DANG: Array<{ id: string; ten: string; loai: ContentType; phut: number }> = [
  { id: 'Vlog', ten: 'Vlog', loai: 'VLOG', phut: 8 },
  { id: 'Video ngắn dọc (Shorts/TikTok/Reels)', ten: 'Video ngắn', loai: 'SHORTS', phut: 1 },
  { id: 'Video hướng dẫn', ten: 'Hướng dẫn', loai: 'TUTORIAL', phut: 10 },
  { id: 'Review sản phẩm/công cụ', ten: 'Review', loai: 'REVIEW', phut: 8 },
  { id: 'Video quảng bá khoá học', ten: 'Quảng bá khoá học', loai: 'OTHER', phut: 3 },
  { id: 'Kể chuyện nghề / chia sẻ kinh nghiệm', ten: 'Kể chuyện', loai: 'VLOG', phut: 10 },
  { id: 'Làm dự án từ đầu đến cuối', ten: 'Làm dự án', loai: 'PROJECT_BUILD', phut: 20 },
  { id: 'Livestream', ten: 'Livestream', loai: 'LIVESTREAM', phut: 45 },
];
const NEN_TANG = ['YouTube', 'TikTok', 'Facebook', 'Instagram Reels'];
const PHUT = [1, 3, 5, 8, 12, 20, 30, 45];

export default function YTuongAiPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const [moTa, setMoTa] = useState('');
  const [dinhDang, setDinhDang] = useState(DINH_DANG[0]);
  const [nenTang, setNenTang] = useState('YouTube');
  const [phut, setPhut] = useState(8);
  const [giongDieu, setGiongDieu] = useState('');
  const [lang, setLang] = useState<NgonNguQuay>('VI');
  const [phongCach, setPhongCach] = useState<PhongCachQuay>('ket_hop');
  const [gocs, setGocs] = useState<GocYTuong[]>([]);
  const [chonGoc, setChonGoc] = useState<number | null>(null);
  const [ketQua, setKetQua] = useState<KetQuaGoi | null>(null);
  const [daLuu, setDaLuu] = useState<Set<number>>(new Set());

  const viecGoc = useViecAi<{ goc: GocYTuong[] }>();
  const viecGoi = useViecAi<KetQuaGoi>();
  const du = moTa.trim().length >= 8;

  const goiYGoc = async () => {
    setGocs([]);
    setChonGoc(null);
    const kq = await viecGoc.chay({ loai: 'goc_y_tuong', moTa, dinhDang: dinhDang.id, nenTang, phut, giongDieu, lang });
    if (kq?.goc?.length) {
      setGocs(kq.goc);
      setChonGoc(0);
    }
  };

  const vietGoi = async () => {
    setKetQua(null);
    const goc = chonGoc != null ? gocs[chonGoc] : null;
    const kq = await viecGoi.chay({
      loai: 'goi_y_tuong', moTa, dinhDang: dinhDang.id, nenTang, phut, giongDieu, lang, phongCach,
      ghiChu: giongDieu ? `Giọng điệu: ${giongDieu}` : '',
      goc, loaiNoiDung: dinhDang.loai, luu: 'tao_du_an',
    });
    if (kq) {
      setKetQua(kq);
      void qc.invalidateQueries({ queryKey: contentKeys.all });
    }
  };

  const luuYTuong = async (i: number) => {
    const g = gocs[i];
    await contentApi.ideas.create({
      title: g.tieuDe.slice(0, 200),
      hook: g.hook || null,
      notes: [g.goc, g.cauTruc?.length ? `Nhịp: ${g.cauTruc.join(' → ')}` : '', g.viSao ? `Vì sao: ${g.viSao}` : '', `Ý gốc: ${moTa}`].filter(Boolean).join('\n\n'),
      suggestedType: dinhDang.loai,
      tags: ['y-tuong-ai'],
    });
    setDaLuu((s) => new Set(s).add(i));
  };

  return (
    <div className={css.trang}>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 rounded-xl bg-studio-500/15 ring-1 ring-studio-500/30 flex items-center justify-center">
          <Wand2 className="w-6 h-6 text-studio-400" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold text-text-primary">Ý tưởng AI</h1>
          <p className="text-[13px] text-text-muted">Bạn chỉ mô tả ý tưởng. AI đề xuất góc tiếp cận, rồi viết trọn kịch bản, cảnh, lời thoại và chỉ dẫn quay.</p>
        </div>
      </div>

      <div className={css.haiCotYTuong}>
        {/* Bước 1 — mô tả */}
        <section className={`${css.dinhYTuong} rounded-2xl border border-darkborder bg-darkcard p-4 sm:p-5 space-y-4`}>
          <label className="block">
            <span className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">1 · Ý tưởng của bạn</span>
            <textarea value={moTa} onChange={(e) => setMoTa(e.target.value)} rows={6} maxLength={4000}
              placeholder="VD: Vlog một ngày đi học ở FPT kết hợp ôn thi PE PRO192, có đoạn code thật và lời khuyên cho tân sinh viên…"
              className="mt-1.5 w-full rounded-xl border border-darkborder bg-black/20 px-3 py-2.5 text-[14px] leading-relaxed text-text-primary placeholder:text-text-muted focus:outline-none focus:border-studio-500/50 resize-y" />
          </label>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-text-muted font-semibold mb-1.5">Định dạng</p>
            <div className="flex flex-wrap gap-1.5">
              {DINH_DANG.map((d) => (
                <button key={d.id} type="button" onClick={() => { setDinhDang(d); setPhut(d.phut); if (d.loai === 'SHORTS') setNenTang('TikTok'); }}
                  className={`h-8 px-3 rounded-lg text-[13px] border ${dinhDang.id === d.id ? 'border-studio-500/50 bg-studio-500/15 text-studio-300' : 'border-darkborder text-text-secondary hover:text-text-primary'}`}>
                  {d.ten}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">Nền tảng</span>
              <select value={nenTang} onChange={(e) => setNenTang(e.target.value)}
                className="mt-1.5 w-full h-9 rounded-lg border border-darkborder bg-darkcard px-2 text-[13px] text-text-primary">
                {NEN_TANG.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">Thời lượng</span>
              <select value={phut} onChange={(e) => setPhut(Number(e.target.value))}
                className="mt-1.5 w-full h-9 rounded-lg border border-darkborder bg-darkcard px-2 text-[13px] text-text-primary">
                {PHUT.map((p) => <option key={p} value={p}>{p === 1 ? '≤ 60 giây' : `${p} phút`}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">Ngôn ngữ video</span>
              <select value={lang} onChange={(e) => setLang(e.target.value as NgonNguQuay)}
                className="mt-1.5 w-full h-9 rounded-lg border border-darkborder bg-darkcard px-2 text-[13px] text-text-primary">
                <option value="VI">Tiếng Việt</option>
                <option value="EN">English</option>
              </select>
            </label>
            <label className="block">
              <span className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">Cách quay</span>
              <select value={phongCach} onChange={(e) => setPhongCach(e.target.value as PhongCachQuay)}
                className="mt-1.5 w-full h-9 rounded-lg border border-darkborder bg-darkcard px-2 text-[13px] text-text-primary">
                <option value="ket_hop">Kết hợp</option>
                <option value="truoc_may">Trước máy</option>
                <option value="man_hinh">Quay màn hình</option>
              </select>
            </label>
          </div>
          <label className="block">
            <span className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">Giọng điệu (tuỳ chọn)</span>
            <input value={giongDieu} onChange={(e) => setGiongDieu(e.target.value)} maxLength={200}
              placeholder="VD: hài hước nhẹ, chân thật, truyền cảm hứng…"
              className="mt-1.5 w-full h-9 rounded-lg border border-darkborder bg-black/20 px-3 text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-studio-500/50" />
          </label>
          <div className="flex flex-wrap gap-2 pt-1">
            <button type="button" disabled={!du || viecGoc.dangChay || viecGoi.dangChay} onClick={() => void goiYGoc()}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl border border-studio-500/40 text-studio-300 text-sm font-semibold hover:bg-studio-500/10 disabled:opacity-40">
              {viecGoc.dangChay ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lightbulb className="w-4 h-4" />} Gợi ý 5 góc tiếp cận
            </button>
            <button type="button" disabled={!du || viecGoi.dangChay} onClick={() => void vietGoi()}
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-studio-gradient text-studio-950 text-sm font-bold disabled:opacity-40">
              {viecGoi.dangChay ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {chonGoc != null && gocs.length ? 'Viết gói quay từ góc đã chọn' : 'Viết luôn gói quay'}
            </button>
          </div>
          {!du && moTa.length > 0 && <p className="text-[12px] text-text-muted">Mô tả dài thêm một chút để AI hiểu ý bạn.</p>}
        </section>

        {/* Bước 2–3 */}
        <section className="min-w-0 space-y-4">
          <TienDoAi tt={viecGoc.tt} dangChay={viecGoc.dangChay} loi={viecGoc.loi} tieuDe="AI đang nghĩ góc tiếp cận…" onThuLai={() => void goiYGoc()} />
          {gocs.length > 0 && (
            <div>
              <p className="text-[11px] uppercase tracking-wider text-text-muted font-semibold mb-2">2 · Chọn một góc tiếp cận</p>
              <div className={css.luoiTheRong}>
                {gocs.map((g, i) => (
                  <div key={i} role="button" tabIndex={0} onClick={() => setChonGoc(i)} onKeyDown={(e) => { if (e.key === 'Enter') setChonGoc(i); }}
                    className={`text-left rounded-2xl border p-4 cursor-pointer transition-colors ${chonGoc === i ? 'border-studio-500/60 bg-studio-500/[0.07]' : 'border-darkborder bg-darkcard hover:border-white/20'}`}>
                    <div className="flex items-start gap-2">
                      <span className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${chonGoc === i ? 'border-studio-400 bg-studio-500 text-studio-950' : 'border-darkborder'}`}>
                        {chonGoc === i && <Check className="w-3 h-3" />}
                      </span>
                      <h3 className="text-[15px] font-semibold text-text-primary leading-snug flex-1">{g.tieuDe}</h3>
                      {g.doKho && <span className="text-[10px] text-text-muted shrink-0 mt-1">{g.doKho}</span>}
                    </div>
                    <p className="text-[13px] text-text-secondary mt-2">{g.goc}</p>
                    {g.hook && <p className="text-[13px] text-studio-200 mt-2 italic">“{g.hook}”</p>}
                    {g.cauTruc?.length > 0 && <p className="text-[12px] text-text-muted mt-2">{g.cauTruc.join(' → ')}</p>}
                    {g.viSao && <p className="text-[12px] text-text-muted mt-1.5">💡 {g.viSao}</p>}
                    <div className="mt-3 flex justify-end">
                      <button type="button" disabled={daLuu.has(i)} onClick={(e) => { e.stopPropagation(); void luuYTuong(i); }}
                        className="inline-flex items-center gap-1 h-7 px-2.5 rounded-lg text-[12px] text-text-muted hover:text-text-primary hover:bg-white/5 disabled:text-emerald-300">
                        {daLuu.has(i) ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                        {daLuu.has(i) ? 'Đã cất vào Kho ý tưởng' : 'Cất vào Kho ý tưởng'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <TienDoAi tt={viecGoi.tt} dangChay={viecGoi.dangChay} loi={viecGoi.loi} tieuDe="AI đang viết gói quay…" goiY="thường 1–3 phút" onThuLai={() => void vietGoi()} />

          {ketQua && (
            <>
              {ketQua.duAnId && (
                <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                  <span className="text-sm text-emerald-100 flex-1">Đã lưu thành dự án — mở ra để sửa kịch bản, chạy Teleprompter, xếp lịch quay.</span>
                  <button type="button" onClick={() => router.push(`/creator/projects/${ketQua.duAnId}`)}
                    className="h-8 px-3 rounded-lg bg-emerald-500/20 text-emerald-100 text-xs font-semibold hover:bg-emerald-500/30">Mở dự án</button>
                </div>
              )}
              <GoiQuayView goi={ketQua.goi} nhan={dinhDang.ten} />
            </>
          )}

          {!gocs.length && !ketQua && !viecGoc.dangChay && !viecGoi.dangChay && !viecGoc.loi && !viecGoi.loi && (
            <div className="rounded-2xl border border-dashed border-darkborder bg-darkcard/50 p-10 text-center">
              <Lightbulb className="w-10 h-10 text-studio-400 mx-auto mb-3" />
              <p className="text-text-primary font-semibold">Mô tả ý tưởng ở bên trái</p>
              <p className="text-[13px] text-text-muted mt-1 max-w-md mx-auto">
                Chưa chắc hướng nào? Bấm “Gợi ý 5 góc tiếp cận”. Đã rõ ý? Bấm “Viết luôn gói quay”.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
