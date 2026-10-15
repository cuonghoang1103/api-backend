'use client';

/**
 * 🎬 Video bài giảng.
 *
 * Hai nguồn, hai chỗ hiện:
 *  1. `CourseDef.videos[lessonId]` — danh sách đầu bài (YouTube tuyển chọn, hoặc mp4).
 *  2. `CourseDef.videoNeo[lessonId][neo]` — video mp4 TỰ LÀM gắn vào đúng MỤC của bài
 *     (neo = đầu tiêu đề `h`, vd `#ポイント 48`), hiện NGAY DƯỚI tiêu đề đó; đầu bài có
 *     thêm mục "🎬 Video của bài" để nhảy tới từng video. Xem `VideoNeoMap` (types.ts).
 *
 * YouTube: mỗi video là một ẢNH BÌA, bấm mới nạp khung YouTube — một bài có 2 video mà
 * nạp sẵn 2 iframe là ~1,5 MB JS của YouTube trước khi người học kịp đọc chữ nào. Dùng
 * youtube-nocookie (đã có trong `frame-src` của next.config.js) và bật sẵn phụ đề tiếng Anh.
 *
 * mp4 (có `src`, https://media.cuongthai.com/...): thẻ `<video controls preload="metadata"
 * playsInline>` — chạy cả web lẫn app desktop (CSP `media-src`: web next.config.js liệt kê
 * media.cuongthai.com; app desktop security.ts có MEDIA_ORIGIN + https:). Nhớ vị trí xem trên
 * máy (localStorage, lỗi thì thôi), phát video này thì dừng video/tiếng khác đang phát.
 *
 * Danh sách video nằm ở `videos.ts` của từng khoá, KHÔNG nằm trong blocks của bài:
 * thay video không phải đụng vào nội dung bài.
 */
import { useEffect, useRef, useState, type ComponentType } from 'react';
import { Check, Clapperboard, Play } from 'lucide-react';
import type { Block, LessonVideo, VideoMuc } from './types';
import { laAppDesktop } from './moiTruong';
import { stopAudio } from './audio';
import s from './course.module.css';

/**
 * Trình phát của APP DESKTOP (04/10/2026). App chặn mọi khung nhúng nên `<iframe>`
 * không chạy; app gắn trình phát native của nó vào `__CT_KHUNG_VIDEO__` (xem
 * desktop `features/ielts/IeltsPage.tsx`) để video phát NGAY TRONG APP thay vì mở
 * YouTube ngoài. Trên web biến này không có ⇒ iframe như cũ. CHỈ cho YouTube —
 * mp4 phát bằng `<video>` ở cả hai nơi.
 */
type KhungApp = ComponentType<{ url: string; onDong: () => void; batDau?: number; phuDe?: string }>;
const khungApp = (): KhungApp | null =>
  (laAppDesktop() ? ((globalThis as { __CT_KHUNG_VIDEO__?: KhungApp }).__CT_KHUNG_VIDEO__ ?? null) : null);

/* ── Neo: khớp video với tiêu đề mục ─────────────────────────────────────── */

/** Chữ tiêu đề để so neo: bỏ furigana `{漢字|かな}`→漢字, bỏ `** == ~~`, NFKC, gộp khoảng trắng. */
export function chuanTieuDe(t: string): string {
  return t
    .replace(/\{([^|}]+)\|[^}]+\}/g, '$1')
    .replace(/\*\*|==|~~/g, '')
    .normalize('NFKC')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Tiêu đề `h` có khớp neo `#…` không: tiêu đề BẮT ĐẦU bằng phần sau `#`, và ký tự
 * kế tiếp không nối dài một số/chữ Latin (`#ポイント 4` không khớp "ポイント 48").
 * `xuat/gan-sach.mts` (dự án video) dùng ĐÚNG luật này để kiểm neo — sửa thì sửa cả hai.
 */
export function khopNeo(tieuDe: string, neo: string): boolean {
  if (!neo.startsWith('#')) return false;
  const can = chuanTieuDe(neo.slice(1));
  const h = chuanTieuDe(tieuDe);
  if (!can || !h.startsWith(can)) return false;
  const sau = h.charAt(can.length);
  return !(/[0-9A-Za-z]/.test(sau) && /[0-9A-Za-z]$/.test(can));
}

/** id DOM ổn định của chỗ gắn video (để nhảy tới). */
export function neoId(lessonId: string, neo: string): string {
  let h = 0;
  for (const c of `${lessonId}|${neo}`) h = (Math.imul(h, 31) + c.codePointAt(0)!) | 0;
  return `vneo-${(h >>> 0).toString(36)}`;
}

/** Nhãn ngắn của neo cho danh sách. */
export function nhanNeo(neo: string): string {
  return neo === 'dau-bai' ? 'Đầu bài' : chuanTieuDe(neo.replace(/^#/, ''));
}

export type NhomNeo = { neo: string; id: string; videos: VideoMuc[]; khoi: number | null };

/**
 * Chia video theo neo của MỘT bài: neo nào khớp tiêu đề nào (chỉ tiêu đề ĐẦU TIÊN khớp),
 * neo nào lên đầu bài (`dau-bai` + neo không khớp — để không bao giờ mất video).
 * Hàm thuần (không hook) — gọi thẳng trong render.
 */
export function chiaNeo(lessonId: string, theoNeo: Record<string, VideoMuc[]> | undefined, blocks: Block[] | undefined) {
  const dauBai: NhomNeo[] = [];
  const theoKhoi = new Map<number, NhomNeo[]>();
  const tatCa: NhomNeo[] = [];
  if (!theoNeo) return { dauBai, theoKhoi, tatCa, coMuc: false };
  for (const [neo, videos] of Object.entries(theoNeo)) {
    if (!videos?.length) continue;
    // Nội dung bài chưa tải ⇒ chưa biết neo khớp đâu: chờ, đừng đẩy tạm lên đầu bài rồi nhảy chỗ.
    if (neo !== 'dau-bai' && !blocks) continue;
    let khoi: number | null = null;
    if (neo !== 'dau-bai' && blocks) {
      const i = blocks.findIndex((b) => b.t === 'h' && khopNeo(b.text, neo));
      if (i >= 0) khoi = i;
      else if (process.env.NODE_ENV !== 'production') console.warn(`[video] neo "${neo}" của bài ${lessonId} không khớp tiêu đề nào — hiện ở đầu bài.`);
    }
    const nhom: NhomNeo = { neo, id: neoId(lessonId, neo), videos, khoi };
    if (khoi === null) dauBai.push(nhom);
    else theoKhoi.set(khoi, [...(theoKhoi.get(khoi) ?? []), nhom]);
    tatCa.push(nhom);
  }
  // Danh sách: đầu bài trước, rồi theo thứ tự mục trong bài.
  tatCa.sort((a, b) => (a.khoi ?? -1) - (b.khoi ?? -1));
  return { dauBai, theoKhoi, tatCa, coMuc: theoKhoi.size > 0 };
}

/* ── Tiện ích ────────────────────────────────────────────────────────────── */

export function gioPhut(giay?: number): string {
  if (!giay || !Number.isFinite(giay) || giay <= 0) return '';
  const t = Math.round(giay);
  const h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), x = t % 60;
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(x).padStart(2, '0')}` : `${m}:${String(x).padStart(2, '0')}`;
}

/** VideoMuc → LessonVideo (mp4) để dùng chung khung hiển thị. */
export function veLessonVideo(m: VideoMuc): LessonVideo {
  return { id: m.id ?? m.src, src: m.src, poster: m.poster, credit: m.tieuDe, dur: gioPhut(m.thoiLuongGiay), lang: 'vi', note: m.ghiChu ?? '' };
}

/* Nhớ vị trí xem — localStorage có thể ném (riêng tư, chặn dữ liệu trang) ⇒ bọc hết. */
type Nho = { t: number; xong?: boolean };
const khoaNho = (v: LessonVideo) => `sachhoc:video:${v.id || v.src}`;
function docNho(v: LessonVideo): Nho | null {
  try {
    const x = JSON.parse(localStorage.getItem(khoaNho(v)) ?? 'null') as Nho | null;
    return x && typeof x.t === 'number' ? x : null;
  } catch { return null; }
}
function ghiNho(v: LessonVideo, x: Nho) {
  try { localStorage.setItem(khoaNho(v), JSON.stringify(x)); } catch { /* bỏ qua */ }
}

/** Chỉ một video phát một lúc trên cả trang. */
let dangPhat: HTMLVideoElement | null = null;

/* ── Một video mp4 ───────────────────────────────────────────────────────── */

function MotVideoMp4({ v, first }: { v: LessonVideo; first: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [nho, setNho] = useState<Nho | null>(null);
  const daKhoiPhuc = useRef(false);
  const lanGhi = useRef(0);
  useEffect(() => { setNho(docNho(v)); }, [v]);
  useEffect(() => () => { if (dangPhat === ref.current) dangPhat = null; }, []);

  const xemTiep = nho && !nho.xong && nho.t > 5 ? nho.t : 0;

  return (
    <figure className={s.vidItem}>
      <div className={s.vidFrame}>
        <video
          ref={ref}
          src={v.src}
          poster={v.poster}
          controls
          preload="metadata"
          playsInline
          aria-label={`Video: ${v.credit}`}
          onPlay={(e) => {
            const el = e.currentTarget;
            if (dangPhat && dangPhat !== el) dangPhat.pause();
            dangPhat = el;
            stopAudio();
            // Xem tiếp chỗ cũ — làm lúc BẤM phát (không lúc nạp siêu dữ liệu) để trang có
            // nhiều video không tua sẵn cả loạt.
            if (!daKhoiPhuc.current) {
              daKhoiPhuc.current = true;
              if (xemTiep && el.currentTime < 1 && (!el.duration || xemTiep < el.duration - 15)) el.currentTime = xemTiep;
            }
          }}
          onTimeUpdate={(e) => {
            const t = e.currentTarget.currentTime;
            if (Math.abs(t - lanGhi.current) < 5) return;
            lanGhi.current = t;
            ghiNho(v, { t, xong: nho?.xong });
          }}
          onPause={(e) => {
            const el = e.currentTarget;
            if (!el.ended) ghiNho(v, { t: el.currentTime, xong: nho?.xong });
          }}
          onEnded={() => {
            const x = { t: 0, xong: true };
            ghiNho(v, x);
            setNho(x);
          }}
        />
      </div>
      <figcaption className={s.vidCap}>
        <div className={s.vidTitle}>
          {first && <span className={s.vidTag}>Video chính</span>}
          {v.credit}
        </div>
        <div className={s.vidMeta}>
          <span className={s.vidMetaTag}>Tiếng Việt · CuongThai</span>
          {v.dur && <span>{v.dur}</span>}
          {nho?.xong && <span className={s.vidXong}><Check size={13} /> Đã xem hết</span>}
          {!nho?.xong && xemTiep > 0 && <span>Xem tiếp từ {gioPhut(xemTiep)}</span>}
        </div>
        {v.note && <div className={s.vidNote}>{v.note}</div>}
      </figcaption>
    </figure>
  );
}

/* ── Một video YouTube ───────────────────────────────────────────────────── */

function MotVideo({ v, first, onXemTrongApp }: { v: LessonVideo; first: boolean; onXemTrongApp: (v: LessonVideo) => void }) {
  const [on, setOn] = useState(false);
  const [title, channel] = v.credit.includes(' — ') ? [v.credit.split(' — ').slice(1).join(' — '), v.credit.split(' — ')[0]] : [v.credit, ''];
  const src =
    `https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0&cc_load_policy=1` +
    (v.lang === 'en' ? '&cc_lang_pref=en&hl=en' : '') +
    (v.start ? `&start=${v.start}` : '');

  return (
    <figure className={s.vidItem}>
      <div className={s.vidFrame}>
        {on ? (
          <iframe
            src={src}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button
            type="button"
            className={s.vidCover}
            // App desktop chặn mọi khung nhúng (CSP frame-src 'none', cố ý) ⇒ mở video
            // bằng trình duyệt hệ thống (setWindowOpenHandler → shell.openExternal).
            onClick={() => {
              if (khungApp()) { onXemTrongApp(v); return; }
              if (laAppDesktop()) { window.open(`https://www.youtube.com/watch?v=${v.id}${v.start ? `&t=${v.start}s` : ''}`, '_blank'); return; }
              setOn(true);
            }}
            aria-label={`Phát video: ${title}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- ảnh bìa YouTube, không qua next/image */}
            <img src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`} alt="" loading="lazy" />
            <span className={s.vidPlay}><Play size={26} fill="currentColor" /></span>
            <span className={s.vidDur}>{v.dur}</span>
            {laAppDesktop() && !khungApp() && <span className={s.vidNgoai}>Mở trên YouTube ↗</span>}
          </button>
        )}
      </div>
      <figcaption className={s.vidCap}>
        <div className={s.vidTitle}>
          {first && <span className={s.vidTag}>Video chính</span>}
          {v.lang === 'vi' && <span className={s.vidTag}>Tiếng Việt</span>}
          {title}
        </div>
        <div className={s.vidNote}>{v.note}</div>
        {channel && <div className={s.vidCredit}>Kênh: {channel} · YouTube</div>}
      </figcaption>
    </figure>
  );
}

/* ── Khối đầu bài ────────────────────────────────────────────────────────── */

export function VideoBai({ videos, id }: { videos: LessonVideo[]; id?: string }) {
  /* App: MỘT trình phát cho cả bài (lớp phủ native chỉ có một) — đứng TRÊN lưới,
     rộng hết cột; bấm video khác là đổi video. */
  const [dangXem, datDangXem] = useState<LessonVideo | null>(null);
  if (!videos.length) return null;
  const Khung = dangXem ? khungApp() : null;
  const chiMp4 = videos.every((v) => v.src);
  return (
    <section className={`${s.vidBox} ${s.vidNeo}`} aria-label="Video bài giảng" id={id}>
      <div className={s.vidHead}>
        <span>🎬 Video bài giảng</span>
        <span className={s.quizSub}>
          {chiMp4
            ? 'Xem video trước, rồi học và làm bài luyện ngay bên dưới. Chậm/nhanh quá thì chỉnh tốc độ trong ⋮ của video.'
            : 'Xem video trước, rồi học phần bên dưới. Video tiếng Anh đã bật sẵn phụ đề — chậm quá thì chỉnh tốc độ 0.75× trong ⚙️ của video.'}
        </span>
      </div>
      {Khung && dangXem && (
        <Khung
          key={dangXem.id}
          url={`https://www.youtube.com/watch?v=${dangXem.id}`}
          onDong={() => datDangXem(null)}
          {...(dangXem.start ? { batDau: dangXem.start } : {})}
          {...(dangXem.lang === 'en' ? { phuDe: 'en' } : {})}
        />
      )}
      <div className={s.vidGrid}>
        {videos.map((v, i) => (v.src
          ? <MotVideoMp4 key={v.id} v={v} first={i === 0 && videos.length > 1} />
          : <MotVideo key={v.id} v={v} first={i === 0 && videos.length > 1} onXemTrongApp={datDangXem} />))}
      </div>
    </section>
  );
}

/* ── Khối dưới một mục (neo) ─────────────────────────────────────────────── */

export function VideoTheoMuc({ nhom }: { nhom: NhomNeo[] }) {
  const videos = nhom.flatMap((n) => n.videos.map(veLessonVideo));
  if (!videos.length) return null;
  return (
    <section className={`${s.vidMuc} ${s.vidNeo}`} id={nhom[0]!.id} aria-label="Video giảng mục này">
      {/* neo phụ (hai neo khớp cùng tiêu đề) vẫn nhảy tới được */}
      {nhom.slice(1).map((n) => <span key={n.id} id={n.id} />)}
      <div className={s.vidMucHead}>
        <Clapperboard size={16} aria-hidden /> Video giảng mục này
        <span className={s.vidMucSub}>xem xong làm phần luyện ngay bên dưới</span>
      </div>
      <div className={s.vidMucGrid}>
        {videos.map((v) => <MotVideoMp4 key={v.id} v={v} first={false} />)}
      </div>
    </section>
  );
}

/* ── "🎬 Video của bài" — danh sách đầu bài, bấm nhảy tới mục ────────────── */

export function DanhSachVideoBai({ nhom }: { nhom: NhomNeo[] }) {
  const [xong, setXong] = useState<Set<string>>(new Set());
  const ds = nhom.flatMap((n) => n.videos.map((m) => ({ n, v: veLessonVideo(m), giay: m.thoiLuongGiay ?? 0 })));
  useEffect(() => {
    setXong(new Set(ds.filter((x) => docNho(x.v)?.xong).map((x) => x.v.id)));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- đọc lại khi đổi bài là đủ
  }, [nhom]);
  if (!ds.length) return null;
  const tong = ds.reduce((a, x) => a + x.giay, 0);
  const nhay = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    // Video dưới một mục ⇒ cuộn tới TIÊU ĐỀ mục (phần tử ngay trước nó: h2, hoặc tên khung ngữ pháp)
    // để người học thấy mình đang ở ポイント nào; scrollIntoView chạy cả trong khung cuộn của app desktop.
    const truoc = el.classList.contains(s.vidMuc!) ? el.previousElementSibling as HTMLElement | null : null;
    const dich = truoc ?? el;
    if (truoc) truoc.style.scrollMarginTop = 'calc(var(--app-nav-h, 64px) + 72px)';
    dich.scrollIntoView({ behavior: 'smooth', block: 'start' });
    el.classList.add(s.vidNhay!);
    window.setTimeout(() => el.classList.remove(s.vidNhay!), 1600);
  };
  return (
    <nav className={s.vidList} aria-label="Video của bài">
      <div className={s.vidListHead}>
        <span>🎬 Video của bài</span>
        <span className={s.vidListSub}>
          {ds.length} video{tong ? ` · ${Math.round(tong / 60)} phút` : ''}{xong.size ? ` · đã xem ${xong.size}` : ''} — bấm để nhảy tới đúng mục
        </span>
      </div>
      <ol className={s.vidListOl}>
        {ds.map(({ n, v }, i) => (
          <li key={`${n.id}-${v.id}`}>
            <button type="button" className={s.vidListItem} onClick={() => nhay(n.id)}>
              <span className={`${s.vidListNum} ${xong.has(v.id) ? s.vidListNumXong : ''}`}>
                {xong.has(v.id) ? <Check size={13} /> : i + 1}
              </span>
              <span className={s.vidListTen}>
                <span className={s.vidListTitle}>{v.credit}</span>
                <span className={s.vidListMuc}>{nhanNeo(n.neo)}</span>
              </span>
              {v.dur && <span className={s.vidListDur}>{v.dur}</span>}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
