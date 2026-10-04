'use client';

/**
 * 🎬 Video bài giảng — đứng đầu mỗi bài, trước phần đọc.
 *
 * Mỗi video là một ẢNH BÌA, bấm mới nạp khung YouTube: một bài có 2 video mà
 * nạp sẵn 2 iframe là ~1,5 MB JS của YouTube trước khi người học kịp đọc chữ
 * nào. Dùng youtube-nocookie (đã có trong `frame-src` của next.config.js) và
 * bật sẵn phụ đề tiếng Anh — người mất gốc nghe chay video tiếng Anh thì vô ích.
 *
 * Danh sách video nằm ở `videos.ts` của từng khoá (CourseDef.videos), KHÔNG
 * nằm trong blocks của bài: thay video không phải đụng vào nội dung bài.
 */
import { useState, type ComponentType } from 'react';
import { Play } from 'lucide-react';
import type { LessonVideo } from './types';
import { laAppDesktop } from './moiTruong';
import s from './course.module.css';

/**
 * Trình phát của APP DESKTOP (04/10/2026). App chặn mọi khung nhúng nên `<iframe>`
 * không chạy; app gắn trình phát native của nó vào `__CT_KHUNG_VIDEO__` (xem
 * desktop `features/ielts/IeltsPage.tsx`) để video phát NGAY TRONG APP thay vì mở
 * YouTube ngoài. Trên web biến này không có ⇒ iframe như cũ.
 */
type KhungApp = ComponentType<{ url: string; onDong: () => void; batDau?: number; phuDe?: string }>;
const khungApp = (): KhungApp | null =>
  (laAppDesktop() ? ((globalThis as { __CT_KHUNG_VIDEO__?: KhungApp }).__CT_KHUNG_VIDEO__ ?? null) : null);

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

export function VideoBai({ videos }: { videos: LessonVideo[] }) {
  /* App: MỘT trình phát cho cả bài (lớp phủ native chỉ có một) — đứng TRÊN lưới,
     rộng hết cột; bấm video khác là đổi video. */
  const [dangXem, datDangXem] = useState<LessonVideo | null>(null);
  if (!videos.length) return null;
  const Khung = dangXem ? khungApp() : null;
  return (
    <section className={s.vidBox} aria-label="Video bài giảng">
      <div className={s.vidHead}>
        <span>🎬 Video bài giảng</span>
        <span className={s.quizSub}>
          Xem video trước, rồi học phần bên dưới. Video tiếng Anh đã bật sẵn phụ đề — chậm quá thì chỉnh tốc độ 0.75× trong ⚙️ của video.
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
        {videos.map((v, i) => <MotVideo key={v.id} v={v} first={i === 0 && videos.length > 1} onXemTrongApp={datDangXem} />)}
      </div>
    </section>
  );
}
