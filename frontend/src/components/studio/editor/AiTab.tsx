'use client';

/**
 * Tab "Trợ lý AI" trong trình sửa dự án (04/10/2026).
 *
 * Năm việc: soạn (lại) gói quay · hook mở đầu · tiêu đề + chữ thumbnail + mô tả ·
 * cắt Shorts từ bản dài · viết lại một cảnh.
 *
 * ⚠️ Mọi kết quả áp vào FORM của trình sửa (qua `onPatch`), KHÔNG ghi thẳng DB:
 * trình sửa tự lưu form 1,2 giây sau mỗi thay đổi, nên một lần ghi DB từ phía
 * máy chủ sẽ bị lượt tự lưu kế tiếp đè mất. Trước khi thay kịch bản, bản đang có
 * được chụp thành phiên bản (Lịch sử kịch bản) để hoàn tác.
 */
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import {
  CheckCircle2,
  Clapperboard,
  Copy,
  Film,
  Loader2,
  Megaphone,
  PenLine,
  Scissors,
  Sparkles,
  Type,
  Zap,
} from 'lucide-react';
import GoiQuayView from '@/components/studio/ai/GoiQuayView';
import { TienDoAi } from '@/components/studio/ai/TienDoAi';
import {
  NHAN_NGAY_AI,
  chepChu,
  useViecAi,
  type KetQuaGoi,
  type NgonNguQuay,
  type PhongCachQuay,
} from '@/lib/creator-ai';
import { contentApi } from '@/lib/api';
import { contentKeys, scriptKeys } from '@/hooks/useContentQueries';
import { parseOutline } from '@/lib/script-utils';
import type { ContentPlatformPost, ContentProductionDay, ContentProject } from '@/types';
import css from '@/components/studio/ai/creatorAi.module.css';

type Viec = 'goi' | 'hook' | 'tieu_de' | 'shorts' | 'viet_lai';

interface HookAi { kieu: string; loi: string; chuTrenManHinh?: string; gocMay?: string }
interface TieuDeAi { tieuDe?: string[]; thumbnail?: string[]; moTa?: string; the?: string[] }
interface ShortAi { tieuDe: string; hook: string; loi: string; chuTrenManHinh?: string[]; canhQuay?: string; giay?: number; lyDo?: string }

const YEU_CAU_NHANH: Array<{ id: string; ten: string }> = [
  { id: 'ngan', ten: 'Ngắn lại' },
  { id: 'dai', ten: 'Sâu hơn' },
  { id: 'tu_nhien', ten: 'Tự nhiên hơn' },
  { id: 'nang_luong', ten: 'Năng lượng hơn' },
  { id: 'vi_du', ten: 'Thêm ví dụ' },
  { id: 'dich_en', ten: 'Dịch sang Anh' },
  { id: 'dich_vi', ten: 'Dịch sang Việt' },
];

/** Nguồn bài học của dự án — đọc từ thẻ do "Quay khoá học" gắn. */
function nguonTuThe(tags: string[]): { phamVi: 'bai' | 'chuong' | 'khoa'; id?: number } | null {
  for (const t of tags) {
    const b = /^bai-(\d+)$/.exec(t);
    if (b) return { phamVi: 'bai', id: Number(b[1]) };
    const c = /^chuong-(\d+)$/.exec(t);
    if (c) return { phamVi: 'chuong', id: Number(c[1]) };
    if (/^khoa-\d+-gioi-thieu$/.test(t)) return { phamVi: 'khoa' };
  }
  return null;
}

function NutNho({ onClick, children, title }: { onClick: () => void; children: React.ReactNode; title?: string }) {
  return (
    <button type="button" onClick={onClick} title={title}
      className="inline-flex items-center gap-1 h-7 px-2.5 rounded-lg border border-darkborder text-[12px] text-text-secondary hover:text-text-primary hover:border-studio-500/40 transition-colors">
      {children}
    </button>
  );
}

export default function AiTab({ project, onPatch }: {
  project: ContentProject;
  onPatch: (patch: Partial<ContentProject>) => void;
}) {
  const router = useRouter();
  const qc = useQueryClient();
  const [viec, setViec] = useState<Viec>('goi');
  const nguon = useMemo(() => nguonTuThe(project.tags), [project.tags]);
  const [lang, setLang] = useState<NgonNguQuay>(project.scriptLang === 'EN' ? 'EN' : 'VI');
  const [phut, setPhut] = useState(project.targetDurationSec ? Math.max(1, Math.round(project.targetDurationSec / 60)) : 0);
  const [phongCach, setPhongCach] = useState<PhongCachQuay>('ket_hop');
  const [ghiChu, setGhiChu] = useState('');
  const [thongBao, setThongBao] = useState<string | null>(null);

  const vGoi = useViecAi<KetQuaGoi>();
  const vHook = useViecAi<{ hooks?: HookAi[] }>();
  const vTieuDe = useViecAi<TieuDeAi>();
  const vShorts = useViecAi<{ shorts?: ShortAi[] }>();
  const vVietLai = useViecAi<{ text: string }>();

  const [goi, setGoi] = useState<KetQuaGoi | null>(null);
  const [hooks, setHooks] = useState<HookAi[]>([]);
  const [tieuDe, setTieuDe] = useState<TieuDeAi | null>(null);
  const [shorts, setShorts] = useState<ShortAi[]>([]);
  const [daTaoShort, setDaTaoShort] = useState<Record<number, number>>({});
  const muc = useMemo(() => parseOutline(project.script), [project.script]);
  const [mucChon, setMucChon] = useState(0);
  const [yeuCau, setYeuCau] = useState('tu_nhien');
  const [yeuCauRieng, setYeuCauRieng] = useState('');
  const [banViet, setBanViet] = useState<{ cu: string; moi: string; mucIdx: number } | null>(null);

  const boiCanh = { duAnId: project.id, tieuDe: project.title, khaiNiem: project.concept ?? '', kichBan: project.script ?? '', lang };

  const bao = (s: string) => { setThongBao(s); setTimeout(() => setThongBao(null), 3500); };

  /** Chụp kịch bản hiện tại thành phiên bản trước khi AI thay nó. */
  const chupTruoc = async (nhan: string) => {
    if (!project.script?.trim()) return;
    await contentApi.scriptVersions.create(project.id, { label: nhan, origin: 'MANUAL', script: project.script }).catch(() => undefined);
  };

  // ── 1. Gói quay ──
  const soanGoi = async () => {
    setGoi(null);
    const chung = { lang, phut, phongCach, ghiChu, luu: 'tra_ve' };
    const kq = nguon
      ? await vGoi.chay({ loai: 'goi_bai', phamVi: nguon.phamVi, lessonId: nguon.phamVi === 'bai' ? nguon.id : undefined, sectionId: nguon.phamVi === 'chuong' ? nguon.id : undefined, courseSlug: project.courseSlug, ...chung })
      : await vGoi.chay({
        loai: 'goi_y_tuong', ...chung, phut: phut || 8, loaiNoiDung: project.type,
        dinhDang: project.type, nenTang: 'YouTube',
        moTa: [project.title, project.concept, project.mainHook && `Hook: ${project.mainHook}`, project.script && `Ghi chú/kịch bản nháp:\n${project.script.slice(0, 4000)}`].filter(Boolean).join('\n\n'),
      });
    if (kq) setGoi(kq);
  };

  const apDungGoi = async () => {
    const ba = goi?.banVa;
    if (!ba) return;
    await chupTruoc('Trước khi áp dụng gói quay AI');
    const ngayCu = project.days.filter((d) => d.location !== NHAN_NGAY_AI);
    const ngayMoi: ContentProductionDay = { ...ba.ngayQuay, dayNumber: ngayCu.length + 1, order: ngayCu.length };
    const yt = project.platformPosts.find((p) => p.platform === 'YOUTUBE');
    const platformPosts: ContentPlatformPost[] = yt
      ? project.platformPosts.map((p) => (p === yt && !p.isPublished ? { ...p, caption: ba.youtube.caption, hashtags: ba.youtube.hashtags } : p))
      : [...project.platformPosts, { platform: 'YOUTUBE', caption: ba.youtube.caption, hashtags: ba.youtube.hashtags, scheduledTime: null, postUrl: null, isPublished: false, order: project.platformPosts.length }];
    onPatch({
      script: ba.script,
      mainHook: ba.mainHook ?? project.mainHook,
      concept: project.concept?.trim() ? project.concept : ba.concept,
      targetDurationSec: ba.targetDurationSec,
      scriptLang: lang,
      status: project.status === 'IDEA' ? 'SCRIPTING' : project.status,
      days: [...ngayCu, ngayMoi],
      platformPosts,
    });
    void qc.invalidateQueries({ queryKey: scriptKeys.versions(project.id) });
    bao('Đã áp dụng: Kịch bản, Phân cảnh, Teleprompter và bài đăng YouTube đã cập nhật. Bản cũ nằm trong Lịch sử kịch bản.');
  };

  // ── 2–4 ──
  const taoHook = async () => { const kq = await vHook.chay({ loai: 'hook', ...boiCanh }); if (kq?.hooks) setHooks(kq.hooks); };
  const taoTieuDe = async () => { const kq = await vTieuDe.chay({ loai: 'tieu_de', ...boiCanh }); if (kq) setTieuDe(kq); };
  const taoShorts = async () => { const kq = await vShorts.chay({ loai: 'shorts', ...boiCanh }); if (kq?.shorts) setShorts(kq.shorts); };

  const chenHook = (h: HookAi) => {
    const khoi = `## Hook\n<!-- 🎥 ${h.gocMay || 'Cận cảnh, nhìn thẳng ống kính'}${h.chuTrenManHinh ? `\n🔤 Chữ: ${h.chuTrenManHinh}` : ''} -->\n${h.loi}\n\n`;
    onPatch({ script: khoi + (project.script ?? ''), mainHook: h.loi.slice(0, 280) });
    bao('Đã chèn hook lên đầu kịch bản.');
  };

  const taoDuAnShort = async (s: ShortAi, i: number) => {
    const script = [
      `<!-- 📱 Video dọc 9:16 · cắt từ “${project.title}”${s.canhQuay ? `\n🎥 ${s.canhQuay}` : ''}${s.chuTrenManHinh?.length ? `\n🔤 Chữ: ${s.chuTrenManHinh.join(' / ')}` : ''} -->`,
      '', '## Short', s.loi,
    ].join('\n');
    const { data } = await contentApi.create({
      title: s.tieuDe.slice(0, 200), type: 'SHORTS', status: 'SCRIPTING', script, mainHook: s.hook.slice(0, 280),
      concept: s.lyDo ?? null, tags: [`short-tu-${project.id}`], scriptLang: lang,
      targetDurationSec: s.giay && s.giay > 0 ? s.giay : 45,
      courseSlug: project.courseSlug, courseTitle: project.courseTitle, seriesName: project.seriesName, lessonRef: project.lessonRef,
    });
    setDaTaoShort((m) => ({ ...m, [i]: data.data.id }));
    void qc.invalidateQueries({ queryKey: contentKeys.all });
  };

  // ── 5. Viết lại một cảnh ──
  const doanCuaMuc = (idx: number): { start: number; end: number; text: string } | null => {
    const lines = (project.script ?? '').split('\n');
    const m = muc[idx];
    if (!m) return null;
    const end = idx + 1 < muc.length ? muc[idx + 1].lineIndex : lines.length;
    return { start: m.lineIndex, end, text: lines.slice(m.lineIndex, end).join('\n').trimEnd() };
  };

  const vietLai = async () => {
    const d = doanCuaMuc(mucChon);
    if (!d) return;
    setBanViet(null);
    const kq = await vVietLai.chay({ loai: 'viet_lai', ...boiCanh, doan: d.text, yeuCau: yeuCauRieng.trim() || yeuCau });
    if (kq?.text) setBanViet({ cu: d.text, moi: kq.text, mucIdx: mucChon });
  };

  const thayVao = async () => {
    if (!banViet) return;
    const d = doanCuaMuc(banViet.mucIdx);
    if (!d || d.text !== banViet.cu) { bao('Kịch bản vừa đổi — viết lại lần nữa cho chắc.'); return; }
    await chupTruoc(`Trước khi viết lại “${muc[banViet.mucIdx]?.title ?? 'cảnh'}”`);
    const lines = (project.script ?? '').split('\n');
    const moi = [...lines.slice(0, d.start), ...banViet.moi.split('\n'), '', ...lines.slice(d.end)].join('\n').replace(/\n{3,}/g, '\n\n');
    onPatch({ script: moi });
    setBanViet(null);
    bao('Đã thay đoạn mới vào kịch bản.');
  };

  const VIEC: Array<{ id: Viec; ten: string; icon: React.ComponentType<{ className?: string }>; moTa: string }> = [
    { id: 'goi', ten: nguon ? 'Gói quay từ bài học' : 'Gói quay từ ý tưởng', icon: Clapperboard, moTa: 'Kịch bản + cảnh + lời thoại + góc máy' },
    { id: 'hook', ten: 'Hook mở đầu', icon: Zap, moTa: '8 kiểu mở 10–20 giây đầu' },
    { id: 'tieu_de', ten: 'Tiêu đề & thumbnail', icon: Type, moTa: 'Tiêu đề, chữ thumbnail, mô tả, thẻ' },
    { id: 'shorts', ten: 'Cắt Shorts', icon: Scissors, moTa: '3 video dọc từ bản dài' },
    { id: 'viet_lai', ten: 'Viết lại một cảnh', icon: PenLine, moTa: 'Ngắn lại, sâu hơn, tự nhiên hơn…' },
  ];

  return (
    <div className={css.troLy}><div className={css.troLyLuoi}>
      <nav className={`${css.troLyNav} rounded-2xl border border-darkborder bg-darkcard p-2`}>
        {VIEC.map((v) => {
          const Icon = v.icon;
          const on = viec === v.id;
          return (
            <button key={v.id} type="button" onClick={() => setViec(v.id)}
              className={`w-full text-left flex items-start gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${on ? 'bg-studio-500/15 ring-1 ring-studio-500/30' : 'hover:bg-white/[0.04]'}`}>
              <Icon className={`w-4 h-4 mt-0.5 ${on ? 'text-studio-400' : 'text-text-muted'}`} />
              <span className="min-w-0">
                <span className={`block text-[13px] font-semibold ${on ? 'text-studio-200' : 'text-text-primary'}`}>{v.ten}</span>
                <span className="block text-[11px] text-text-muted leading-snug">{v.moTa}</span>
              </span>
            </button>
          );
        })}
      </nav>

      <div className="min-w-0 space-y-4">
        {thongBao && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-[13px] text-emerald-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" /> {thongBao}
          </div>
        )}

        {viec === 'goi' && (
          <>
            <div className="rounded-2xl border border-darkborder bg-darkcard p-4 sm:p-5">
              <h3 className="font-heading text-base font-bold text-text-primary">
                {nguon ? 'Soạn lại gói quay từ nội dung bài học' : 'Viết gói quay từ ý tưởng của dự án'}
              </h3>
              <p className="text-[13px] text-text-muted mt-1">
                {nguon
                  ? `Dự án gắn với ${project.courseTitle ?? 'khoá học'}${project.lessonRef ? ` · ${project.lessonRef}` : ''}. AI đọc lại đúng nội dung bài trên hệ thống.`
                  : 'AI dựa vào tiêu đề, khái niệm và ghi chú hiện có. Muốn bám đúng một bài trong khoá học? Dùng trang “Quay khoá học”.'}
              </p>
              <div className="mt-4 flex flex-wrap items-end gap-3">
                <label className="block">
                  <span className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">Ngôn ngữ</span>
                  <select value={lang} onChange={(e) => setLang(e.target.value as NgonNguQuay)} className="mt-1 block h-9 rounded-lg border border-darkborder bg-darkcard px-2 text-[13px] text-text-primary">
                    <option value="VI">Tiếng Việt</option><option value="EN">English</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">Thời lượng</span>
                  <select value={phut} onChange={(e) => setPhut(Number(e.target.value))} className="mt-1 block h-9 rounded-lg border border-darkborder bg-darkcard px-2 text-[13px] text-text-primary">
                    {[0, 1, 3, 5, 8, 10, 12, 15, 20, 30].map((p) => <option key={p} value={p}>{p === 0 ? 'Tự động' : `${p} phút`}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">Cách quay</span>
                  <select value={phongCach} onChange={(e) => setPhongCach(e.target.value as PhongCachQuay)} className="mt-1 block h-9 rounded-lg border border-darkborder bg-darkcard px-2 text-[13px] text-text-primary">
                    <option value="ket_hop">Kết hợp</option><option value="truoc_may">Trước máy</option><option value="man_hinh">Quay màn hình</option>
                  </select>
                </label>
                <label className="block flex-1 min-w-[220px]">
                  <span className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">Ghi chú cho AI</span>
                  <input value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} maxLength={1500} placeholder="VD: nhấn mạnh phần demo, giọng vui hơn…"
                    className="mt-1 w-full h-9 rounded-lg border border-darkborder bg-black/20 px-3 text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-studio-500/50" />
                </label>
                <button type="button" disabled={vGoi.dangChay} onClick={() => void soanGoi()}
                  className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-studio-gradient text-studio-950 text-sm font-bold disabled:opacity-50">
                  {vGoi.dangChay ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} Soạn gói quay
                </button>
              </div>
            </div>
            <TienDoAi tt={vGoi.tt} dangChay={vGoi.dangChay} loi={vGoi.loi} tieuDe="AI đang soạn gói quay…" goiY="thường 1–4 phút, đừng đóng tab này" onThuLai={() => void soanGoi()} />
            {goi && (
              <>
                <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-studio-500/30 bg-studio-500/[0.07] p-3">
                  <Film className="w-5 h-5 text-studio-300" />
                  <span className="text-[13px] text-text-primary flex-1">
                    Xem trước bên dưới. “Áp dụng” sẽ thay Kịch bản, thêm ngày quay “{NHAN_NGAY_AI}” ở Phân cảnh và cập nhật bài đăng YouTube.
                  </span>
                  <button type="button" onClick={() => void apDungGoi()}
                    className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-studio-gradient text-studio-950 text-sm font-bold">
                    <CheckCircle2 className="w-4 h-4" /> Áp dụng vào dự án
                  </button>
                </div>
                <GoiQuayView goi={goi.goi} nhan={goi.nguon?.nhan} />
              </>
            )}
          </>
        )}

        {viec === 'hook' && (
          <PhanViec tieuDe="Hook mở đầu" moTa="8 kiểu mở khác nhau, bám đúng nội dung video. Chọn một làm hook chính hoặc chèn lên đầu kịch bản."
            nut="Viết 8 hook" dangChay={vHook.dangChay} onChay={() => void taoHook()}>
            <TienDoAi tt={vHook.tt} dangChay={vHook.dangChay} loi={vHook.loi} tieuDe="AI đang viết hook…" onThuLai={() => void taoHook()} />
            <div className={css.luoiTheRong}>
              {hooks.map((h, i) => (
                <div key={i} className="rounded-2xl border border-darkborder bg-darkcard p-4">
                  <p className="text-[10px] uppercase tracking-wider text-studio-300 font-bold">{h.kieu}</p>
                  <p className="text-[15px] text-text-primary mt-1.5 leading-relaxed">{h.loi}</p>
                  {(h.chuTrenManHinh || h.gocMay) && (
                    <p className="text-[12px] text-text-muted mt-2">{h.chuTrenManHinh && <>🔤 {h.chuTrenManHinh} </>}{h.gocMay && <>· 🎥 {h.gocMay}</>}</p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <NutNho onClick={() => { onPatch({ mainHook: h.loi.slice(0, 280) }); bao('Đã đặt làm hook chính.'); }}>Dùng làm hook chính</NutNho>
                    <NutNho onClick={() => chenHook(h)}>Chèn đầu kịch bản</NutNho>
                    <NutNho onClick={() => void chepChu(h.loi)}><Copy className="w-3 h-3" /> Chép</NutNho>
                  </div>
                </div>
              ))}
            </div>
          </PhanViec>
        )}

        {viec === 'tieu_de' && (
          <PhanViec tieuDe="Tiêu đề, chữ thumbnail & mô tả" moTa="Bấm một tiêu đề để đặt làm tên dự án. Mô tả có thể đưa thẳng vào bài đăng YouTube."
            nut="Viết tiêu đề" dangChay={vTieuDe.dangChay} onChay={() => void taoTieuDe()}>
            <TienDoAi tt={vTieuDe.tt} dangChay={vTieuDe.dangChay} loi={vTieuDe.loi} tieuDe="AI đang viết tiêu đề…" onThuLai={() => void taoTieuDe()} />
            {tieuDe && (
              <div className={css.luoiTheRong}>
                <div className="rounded-2xl border border-darkborder bg-darkcard p-4">
                  <p className="text-[11px] uppercase tracking-wider text-text-muted font-semibold mb-2">Tiêu đề</p>
                  <ul className="space-y-1.5">
                    {(tieuDe.tieuDe ?? []).map((t) => (
                      <li key={t} className="flex items-center gap-2">
                        <span className="text-[14px] text-text-primary flex-1">{t}</span>
                        <span className="text-[10px] text-text-muted tabular-nums">{t.length}</span>
                        <NutNho onClick={() => { onPatch({ title: t }); bao('Đã đổi tên dự án.'); }}>Đặt tên</NutNho>
                      </li>
                    ))}
                  </ul>
                  <p className="text-[11px] uppercase tracking-wider text-text-muted font-semibold mt-4 mb-2">Chữ thumbnail</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(tieuDe.thumbnail ?? []).map((t) => (
                      <button key={t} type="button" onClick={() => void chepChu(t)} className="px-2.5 h-8 rounded-lg bg-studio-500/10 text-studio-200 text-[13px] font-bold uppercase hover:bg-studio-500/20">{t}</button>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-darkborder bg-darkcard p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-[11px] uppercase tracking-wider text-text-muted font-semibold flex-1">Mô tả YouTube</p>
                    <NutNho onClick={() => void chepChu(tieuDe.moTa ?? '')}><Copy className="w-3 h-3" /> Chép</NutNho>
                    <NutNho title="Ghi vào bài đăng YouTube của dự án" onClick={() => {
                      const yt = project.platformPosts.find((p) => p.platform === 'YOUTUBE');
                      const caption = tieuDe.moTa ?? '';
                      const hashtags = tieuDe.the ?? [];
                      onPatch({
                        platformPosts: yt
                          ? project.platformPosts.map((p) => (p === yt ? { ...p, caption, hashtags } : p))
                          : [...project.platformPosts, { platform: 'YOUTUBE', caption, hashtags, scheduledTime: null, postUrl: null, isPublished: false, order: project.platformPosts.length }],
                      });
                      bao('Đã ghi vào bài đăng YouTube (tab Nền tảng).');
                    }}><Megaphone className="w-3 h-3" /> Vào bài đăng</NutNho>
                  </div>
                  <p className="text-[13px] text-text-secondary whitespace-pre-wrap">{tieuDe.moTa}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {(tieuDe.the ?? []).map((t) => <span key={t} className="px-1.5 h-5 rounded bg-white/5 text-[11px] text-text-muted inline-flex items-center">#{t}</span>)}
                  </div>
                </div>
              </div>
            )}
          </PhanViec>
        )}

        {viec === 'shorts' && (
          <PhanViec tieuDe="Cắt Shorts từ bản dài" moTa="3 video dọc 30–55 giây, đứng độc lập, chỉ dùng nội dung có trong kịch bản. Mỗi cái tạo được thành một dự án Shorts riêng."
            nut="Cắt 3 Shorts" dangChay={vShorts.dangChay} onChay={() => void taoShorts()} khoa={!project.script?.trim()} lyDoKhoa="Cần có kịch bản trước.">
            <TienDoAi tt={vShorts.tt} dangChay={vShorts.dangChay} loi={vShorts.loi} tieuDe="AI đang cắt Shorts…" onThuLai={() => void taoShorts()} />
            <div className={css.luoiThe}>
              {shorts.map((s, i) => (
                <div key={i} className="rounded-2xl border border-darkborder bg-darkcard p-4 flex flex-col">
                  <p className="text-[14px] font-semibold text-text-primary">{s.tieuDe}</p>
                  <p className="text-[11px] text-text-muted mt-0.5">{s.giay ? `${s.giay} giây · ` : ''}{s.lyDo}</p>
                  <p className="text-[13px] text-studio-200 mt-2 italic">“{s.hook}”</p>
                  <p className="text-[13px] text-text-secondary mt-2 whitespace-pre-wrap flex-1">{s.loi}</p>
                  {s.chuTrenManHinh?.length ? <p className="text-[12px] text-text-muted mt-2">🔤 {s.chuTrenManHinh.join(' / ')}</p> : null}
                  {s.canhQuay && <p className="text-[12px] text-text-muted mt-1">🎥 {s.canhQuay}</p>}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {daTaoShort[i] ? (
                      <NutNho onClick={() => router.push(`/creator/projects/${daTaoShort[i]}`)}><CheckCircle2 className="w-3 h-3 text-emerald-400" /> Mở dự án Shorts</NutNho>
                    ) : (
                      <NutNho onClick={() => void taoDuAnShort(s, i)}><Sparkles className="w-3 h-3" /> Tạo dự án Shorts</NutNho>
                    )}
                    <NutNho onClick={() => void chepChu(s.loi)}><Copy className="w-3 h-3" /> Chép</NutNho>
                  </div>
                </div>
              ))}
            </div>
          </PhanViec>
        )}

        {viec === 'viet_lai' && (
          <div className="rounded-2xl border border-darkborder bg-darkcard p-4 sm:p-5 space-y-3">
            <h3 className="font-heading text-base font-bold text-text-primary">Viết lại một cảnh</h3>
            {muc.length === 0 ? (
              <p className="text-[13px] text-text-muted">Kịch bản chưa có mục “##” nào. Soạn gói quay trước, hoặc chia kịch bản thành các mục “## Tên cảnh”.</p>
            ) : (
              <>
                <div className="flex flex-wrap items-end gap-3">
                  <label className="block flex-1 min-w-[260px]">
                    <span className="text-[11px] uppercase tracking-wider text-text-muted font-semibold">Cảnh</span>
                    <select value={mucChon} onChange={(e) => { setMucChon(Number(e.target.value)); setBanViet(null); }}
                      className="mt-1 block w-full h-9 rounded-lg border border-darkborder bg-darkcard px-2 text-[13px] text-text-primary">
                      {muc.map((m, i) => <option key={i} value={i}>{m.title} · {m.words} từ</option>)}
                    </select>
                  </label>
                  <button type="button" disabled={vVietLai.dangChay} onClick={() => void vietLai()}
                    className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-studio-gradient text-studio-950 text-sm font-bold disabled:opacity-50">
                    {vVietLai.dangChay ? <Loader2 className="w-4 h-4 animate-spin" /> : <PenLine className="w-4 h-4" />} Viết lại
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {YEU_CAU_NHANH.map((y) => (
                    <button key={y.id} type="button" onClick={() => { setYeuCau(y.id); setYeuCauRieng(''); }}
                      className={`h-8 px-3 rounded-lg text-[13px] border ${yeuCau === y.id && !yeuCauRieng ? 'border-studio-500/50 bg-studio-500/15 text-studio-300' : 'border-darkborder text-text-secondary hover:text-text-primary'}`}>
                      {y.ten}
                    </button>
                  ))}
                </div>
                <input value={yeuCauRieng} onChange={(e) => setYeuCauRieng(e.target.value)} maxLength={1500}
                  placeholder="Hoặc tự viết yêu cầu: VD “thêm một ví dụ về HashMap trong thực tế, giữ dưới 120 từ”"
                  className="w-full h-9 rounded-lg border border-darkborder bg-black/20 px-3 text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-studio-500/50" />
                <TienDoAi tt={vVietLai.tt} dangChay={vVietLai.dangChay} loi={vVietLai.loi} tieuDe="AI đang viết lại…" onThuLai={() => void vietLai()} />
                {banViet && (
                  <>
                    <div className={css.luoiTheRong}>
                      <div className="rounded-xl border border-darkborder bg-black/20 p-3">
                        <p className="text-[11px] uppercase tracking-wider text-text-muted font-semibold mb-1.5">Bản đang có</p>
                        <pre className="text-[12.5px] leading-relaxed text-text-muted whitespace-pre-wrap font-sans max-h-[420px] overflow-y-auto">{banViet.cu}</pre>
                      </div>
                      <div className="rounded-xl border border-studio-500/30 bg-studio-500/[0.05] p-3">
                        <p className="text-[11px] uppercase tracking-wider text-studio-300 font-semibold mb-1.5">Bản AI viết lại</p>
                        <pre className="text-[12.5px] leading-relaxed text-text-primary whitespace-pre-wrap font-sans max-h-[420px] overflow-y-auto">{banViet.moi}</pre>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setBanViet(null)} className="h-9 px-3 rounded-lg text-sm text-text-muted hover:text-text-primary">Bỏ</button>
                      <button type="button" onClick={() => void thayVao()} className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-studio-gradient text-studio-950 text-sm font-bold">
                        <CheckCircle2 className="w-4 h-4" /> Thay vào kịch bản
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div></div>
  );
}

function PhanViec({ tieuDe, moTa, nut, dangChay, onChay, khoa, lyDoKhoa, children }: {
  tieuDe: string; moTa: string; nut: string; dangChay: boolean; onChay: () => void; khoa?: boolean; lyDoKhoa?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-darkborder bg-darkcard p-4 sm:p-5 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[240px]">
          <h3 className="font-heading text-base font-bold text-text-primary">{tieuDe}</h3>
          <p className="text-[13px] text-text-muted mt-0.5">{khoa && lyDoKhoa ? lyDoKhoa : moTa}</p>
        </div>
        <button type="button" disabled={dangChay || khoa} onClick={onChay}
          className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-studio-gradient text-studio-950 text-sm font-bold disabled:opacity-50">
          {dangChay ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} {nut}
        </button>
      </div>
      {children}
    </div>
  );
}
