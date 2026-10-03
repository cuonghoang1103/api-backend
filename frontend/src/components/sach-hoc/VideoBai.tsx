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
import { useState } from 'react';
import { Play } from 'lucide-react';
import type { LessonVideo } from './types';
import s from './course.module.css';

function MotVideo({ v, first }: { v: LessonVideo; first: boolean }) {
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
          <button type="button" className={s.vidCover} onClick={() => setOn(true)} aria-label={`Phát video: ${title}`}>
            {/* eslint-disable-next-line @next/next/no-img-element -- ảnh bìa YouTube, không qua next/image */}
            <img src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`} alt="" loading="lazy" />
            <span className={s.vidPlay}><Play size={26} fill="currentColor" /></span>
            <span className={s.vidDur}>{v.dur}</span>
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
  if (!videos.length) return null;
  return (
    <section className={s.vidBox} aria-label="Video bài giảng">
      <div className={s.vidHead}>
        <span>🎬 Video bài giảng</span>
        <span className={s.quizSub}>
          Xem video trước, rồi học phần bên dưới. Video tiếng Anh đã bật sẵn phụ đề — chậm quá thì chỉnh tốc độ 0.75× trong ⚙️ của video.
        </span>
      </div>
      <div className={s.vidGrid}>
        {videos.map((v, i) => <MotVideo key={v.id} v={v} first={i === 0 && videos.length > 1} />)}
      </div>
    </section>
  );
}
