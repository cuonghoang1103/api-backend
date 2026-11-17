'use client';

/**
 * ============================================================
 * MỤC LỤC VIDEO ngay dưới trình phát của trang học (17/11/2026)
 * ============================================================
 *
 * Người dùng: "trong video chia ra từng phần, từng chủ đề, có phút:giây để bấm vào hỏi đúng phần đó".
 *
 *  • Danh sách chương (sinh sẵn lúc dựng phụ đề — `chiaChuong`), mốc mm:ss, chương ĐANG PHÁT tô sáng, bấm = tua.
 *  • "Hỏi phần này" ⇒ mở CuongMini với chip "🎬 Tên chương · 3:20 – 5:10" ghim sẵn + bốn câu hỏi nhanh; máy chủ tự cắt
 *    đủ từng câu phụ đề của chương đó vào ngữ cảnh.
 *  • "Hỏi đoạn đang xem" (±30 s) · "Tóm tắt video" · mở "Lời giảng" của một chương (từng câu bấm để tua).
 *
 * Đồng thời CÔNG BỐ video vào kho gia sư (`datVideo`) ⇒ cả khung robot lẫn mục cuối bài gửi kèm phụ đề + giây đang xem
 * ở MỌI câu hỏi, và mốc `[3:20]` trong câu trả lời tua được video này.
 *
 * Chỉ đọc phụ đề qua `/video-hoc/phong/:id?track=` (đã đăng nhập, không trả URL video). Không có phụ đề ⇒ không vẽ gì.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, ListVideo, MessageCircleQuestion, Sparkles, Target } from 'lucide-react';
import { videoHocApi, type CauPhuDe, type PhanVideoRieng } from '@/lib/api';
import { moc } from '@/lib/mocThoiGian';
import {
  CAU_TOM_TAT_VIDEO, KHOA_TOM_TAT_VIDEO, cauTrongDoan, chiSoDangXem, denCua, doanCuaPhan, doanQuanhGiay,
} from '@/lib/mucLucVideo';
import { moGiaSuBai, useGiaSuBaiStore } from '@/store/giaSuBaiStore';
import './giaSu.css';

type Track = 'VI' | 'EN' | 'YT';

const chuCau = (c: CauPhuDe) => String((c as { vi?: string }).vi ?? (c as { en?: string }).en ?? '').trim();

export default function MucLucVideo({ lessonId, track, layGiay, tua }: {
  lessonId: number;
  track: Track | null;
  layGiay: () => number | null;
  /** Tua (trang học tự cuộn tới khung video). */
  tua: (giay: number) => void;
}) {
  const [duLieu, datDuLieu] = useState<{ khoa: string; cues: CauPhuDe[]; parts: PhanVideoRieng[]; coPhuDe: boolean } | null>(null);
  const khoa = `${lessonId}:${track}`;

  useEffect(() => {
    if (!track) { datDuLieu(null); return undefined; }
    let huy = false;
    datDuLieu(null);
    videoHocApi.phongHoc(lessonId, track)
      .then((r) => {
        if (huy) return;
        const d = r.data.data as { cues?: CauPhuDe[]; parts?: PhanVideoRieng[]; coPhuDe?: boolean };
        datDuLieu({ khoa, cues: d.cues ?? [], parts: d.parts ?? [], coPhuDe: !!d.coPhuDe && (d.cues?.length ?? 0) > 0 });
      })
      .catch(() => { if (!huy) datDuLieu({ khoa, cues: [], parts: [], coPhuDe: false }); });
    return () => { huy = true; };
  }, [lessonId, track, khoa]);

  const dl = duLieu?.khoa === khoa ? duLieu : null;
  const parts = dl?.parts ?? [];
  const cues = dl?.cues ?? [];
  const thoiLuong = useMemo(() => {
    const cuoi = parts[parts.length - 1];
    return cuoi?.den ?? (cues.length ? Number(cues[cues.length - 1].t) + 8 : null);
  }, [parts, cues]);

  /* ── Công bố video cho gia sư (robot + mục cuối bài) ── */
  const datVideo = useGiaSuBaiStore((s) => s.datVideo);
  const layGiayRef = useRef(layGiay); layGiayRef.current = layGiay;
  const tuaRef = useRef(tua); tuaRef.current = tua;
  useEffect(() => {
    if (!dl || !track) return undefined;
    datVideo({
      lessonId, track, coPhuDe: dl.coPhuDe, parts: dl.parts, thoiLuong,
      layGiay: () => layGiayRef.current(), tua: (g) => tuaRef.current(g),
    });
    return () => { if (useGiaSuBaiStore.getState().video?.lessonId === lessonId) datVideo(null); };
  }, [dl, track, lessonId, thoiLuong, datVideo]);

  /* ── Chương đang phát: đọc giây mỗi 1 s (đổi state CHỈ khi sang chương khác) ── */
  const [dangXem, datDangXem] = useState(-1);
  useEffect(() => {
    if (!parts.length) return undefined;
    const h = window.setInterval(() => {
      const i = chiSoDangXem(parts, layGiayRef.current());
      datDangXem((cu) => (cu === i ? cu : i));
    }, 1000);
    return () => window.clearInterval(h);
  }, [parts]);

  const [mo, datMo] = useState(true);
  const [moLoi, datMoLoi] = useState<number | null>(null);
  useEffect(() => { datMoLoi(null); }, [khoa]);

  /* Giữ chương đang phát trong tầm nhìn của DANH SÁCH (chỉ cuộn khung danh sách, không kéo cả trang). */
  const dsRef = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const ds = dsRef.current;
    const el = ds?.querySelector<HTMLElement>(`[data-i="${dangXem}"]`);
    if (!ds || !el) return;
    if (el.offsetTop < ds.scrollTop || el.offsetTop + el.offsetHeight > ds.scrollTop + ds.clientHeight) {
      ds.scrollTop = Math.max(0, el.offsetTop - 8);
    }
  }, [dangXem]);

  if (!dl?.coPhuDe) return null;

  const hoiDoanDangXem = () => {
    const g = layGiayRef.current() ?? 0;
    moGiaSuBai(lessonId, { loai: 'doan', doan: { ...doanQuanhGiay(g, thoiLuong), ten: `Quanh ${moc(g)}` } });
  };

  return (
    <section className="gsb mt-3 overflow-hidden rounded-2xl" aria-label="Mục lục video"
      style={{ border: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
      <div className="flex flex-wrap items-center gap-2 px-3 py-2.5" style={{ borderBottom: mo && parts.length ? '1px solid var(--gsb-vien)' : undefined }}>
        <button type="button" onClick={() => datMo((v) => !v)} aria-expanded={mo}
          className="inline-flex min-w-0 items-center gap-2 text-left text-sm font-semibold" style={{ color: 'var(--gsb-chu)' }}>
          <ListVideo size={16} style={{ color: 'var(--gsb-nhan)' }} />
          {parts.length ? <>Mục lục video <span className="gsb-huy-hieu">{parts.length} phần</span></> : 'Hỏi AI về video'}
          {parts.length > 0 && <ChevronDown size={15} className={mo ? 'rotate-180 transition-transform' : 'transition-transform'} />}
        </button>
        <div className="gsb-goi-y ml-auto">
          <button type="button" onClick={hoiDoanDangXem} title="Ghim ±30 giây quanh chỗ đang xem rồi hỏi CuongMini (Shift+A)">
            <Target size={13} /> Hỏi đoạn đang xem
          </button>
          <button type="button" title="CuongMini tóm tắt video theo từng phần, có mốc bấm để tua"
            onClick={() => {
              useGiaSuBaiStore.getState().datCauCho({ lessonId, cau: CAU_TOM_TAT_VIDEO, cacheKey: KHOA_TOM_TAT_VIDEO });
              moGiaSuBai(lessonId);
            }}>
            <Sparkles size={13} /> Tóm tắt video
          </button>
        </div>
      </div>

      {mo && parts.length > 0 && (
        <ol ref={dsRef} className="max-h-72 overflow-y-auto py-1" style={{ position: 'relative' }}>
          {parts.map((p, i) => {
            const dang = i === dangXem;
            const doan = doanCuaPhan(parts, i, thoiLuong);
            const moLoiGiang = moLoi === i;
            return (
              <li key={`${p.t}-${i}`} data-i={i}
                style={{ background: dang ? 'var(--gsb-nhan-nhat)' : undefined, borderLeft: `3px solid ${dang ? 'var(--gsb-nhan)' : 'transparent'}` }}>
                <div className="flex items-center gap-2 px-3 py-1.5">
                  <button type="button" onClick={() => tua(p.t)} title={`Tua tới ${moc(p.t)}`}
                    className="shrink-0 rounded-md px-1.5 py-0.5 text-xs font-semibold tabular-nums"
                    style={{ color: 'var(--gsb-nhan)', background: 'var(--gsb-nhan-nhat)' }}>
                    {moc(p.t)}
                  </button>
                  <button type="button" onClick={() => tua(p.t)} className="min-w-0 flex-1 truncate text-left text-[13.5px]"
                    style={{ color: dang ? 'var(--gsb-chu)' : 'var(--gsb-chu-2)', fontWeight: dang ? 600 : 400 }} title={p.ten}>
                    {p.ten}
                  </button>
                  <span className="hidden shrink-0 text-[11px] tabular-nums sm:inline" style={{ color: 'var(--gsb-chu-3)' }}>
                    {Math.max(1, Math.round((denCua(parts, i, thoiLuong) - p.t) / 60))} phút
                  </span>
                  <button type="button" onClick={() => datMoLoi(moLoiGiang ? null : i)} className="gsb-nut-tron" style={{ height: 26, minWidth: 26 }}
                    aria-expanded={moLoiGiang} title="Xem lời giảng của phần này">
                    <ChevronDown size={14} className={moLoiGiang ? 'rotate-180 transition-transform' : 'transition-transform'} />
                  </button>
                  <button type="button" onClick={() => moGiaSuBai(lessonId, { loai: 'doan', doan, theoMucLuc: true })}
                    className="gsb-nut-tron" style={{ height: 26, color: 'var(--gsb-nhan)', borderColor: 'var(--gsb-nhan-vien)' }}
                    title={`Hỏi CuongMini về phần “${p.ten}”`}>
                    <MessageCircleQuestion size={13} /> <span className="hidden sm:inline">Hỏi phần này</span>
                  </button>
                </div>
                {moLoiGiang && (
                  <div className="mx-3 mb-2 max-h-56 overflow-y-auto rounded-lg px-2 py-1.5 text-[13px] leading-relaxed"
                    style={{ background: 'var(--gsb-nen-2)', color: 'var(--gsb-chu-2)' }}>
                    {cauTrongDoan(cues, doan).map((c, k) => (
                      <button key={k} type="button" onClick={() => tua(Number(c.t))}
                        className="flex w-full gap-2 rounded px-1 py-0.5 text-left hover:opacity-80">
                        <span className="shrink-0 tabular-nums text-[11px]" style={{ color: 'var(--gsb-nhan)', paddingTop: 2 }}>{moc(Number(c.t))}</span>
                        <span>{chuCau(c)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
