'use client';

/**
 * Khối "Sản phẩm chủ lực" trên trang chủ — CT Work + AI Code (viết lại 13/10/2026).
 *
 * Bản trước là hai thẻ hẹp, mỗi thẻ bốn gạch đầu dòng và một khung "Demo preview
 * coming soon" trống — người dùng chê "xấu, không đầy đủ". Nay mỗi sản phẩm là
 * một CHƯƠNG rộng cả trang:
 *   1. khung video demo (chưa có video ⇒ ảnh chụp THẬT của sản phẩm, không bao giờ
 *      là khung trống), kèm mốc chương bấm để tua;
 *   2. câu định vị · hợp với ai · ba con số ĐO được · nút Mở / Tải / Đọc câu chuyện;
 *   3. lưới tính năng đầy đủ theo nhóm;
 *   4. dải điểm mạnh.
 * Dữ liệu ở `flagshipData.ts` (có ghi lệnh đo từng con số).
 *
 * Video: KHÔNG tự phát có tiếng; tự phát câm chỉ khi khung lọt vào màn hình và
 * người xem không bật "giảm chuyển động". Ra khỏi màn hình là dừng — trang chủ
 * không được đốt CPU cho thứ không ai nhìn.
 */
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight, ArrowUpRight, Bot, Briefcase, ClipboardCheck, FileText, Files, GitBranch,
  Globe, GraduationCap, KanbanSquare, Pause, Play, Plug, ShieldCheck, SquareTerminal, Users,
  type LucideIcon,
} from 'lucide-react';
import { getFlagships, type Flagship, type FlagshipMedia } from './flagshipData';

const ICONS: Record<string, LucideIcon> = {
  kanban: KanbanSquare, school: GraduationCap, doc: FileText, test: ClipboardCheck,
  agent: Bot, people: Users, briefcase: Briefcase, plug: Plug, files: Files,
  terminal: SquareTerminal, globe: Globe, git: GitBranch, shield: ShieldCheck,
};

function fmtTime(s: number): string {
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
}

function FlagshipMediaFrame({ media, name, vi }: { media: FlagshipMedia; name: string; vi: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v || !media.video) return;
    const giam = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const io = new IntersectionObserver(([e]) => {
      if (!e) return;
      if (e.isIntersecting && !giam) void v.play().catch(() => {});
      else v.pause();
    }, { threshold: 0.45 });
    io.observe(v);
    return () => io.disconnect();
  }, [media.video]);

  return (
    <figure className="flag-media">
      <div className="flag-media-frame">
        {media.video ? (
          <>
            <video
              ref={ref}
              className="flag-media-el"
              src={media.video}
              poster={media.poster}
              muted
              loop
              playsInline
              preload="none"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              aria-label={vi ? `Video giới thiệu ${name}` : `${name} demo video`}
            />
            <button
              type="button"
              className="flag-media-toggle"
              onClick={() => { const v = ref.current; if (v) { if (v.paused) void v.play(); else v.pause(); } }}
              aria-label={playing ? (vi ? 'Tạm dừng' : 'Pause') : (vi ? 'Phát' : 'Play')}
            >
              {playing ? <Pause size={16} aria-hidden /> : <Play size={16} aria-hidden />}
            </button>
          </>
        ) : (
          <img className="flag-media-el" src={media.poster} alt={vi ? `Ảnh chụp ${name}` : `${name} screenshot`} loading="lazy" decoding="async" />
        )}
      </div>
      {media.video && media.chapters && media.chapters.length > 0 && (
        <figcaption className="flag-chapters">
          {media.chapters.map((c) => (
            <button key={c.t} type="button" onClick={() => { const v = ref.current; if (v) { v.currentTime = c.t; void v.play(); } }}>
              <span>{fmtTime(c.t)}</span> {c.label}
            </button>
          ))}
        </figcaption>
      )}
    </figure>
  );
}

function FlagshipChapter({ p, vi, reverse }: { p: Flagship; vi: boolean; reverse: boolean }) {
  const [moHet, setMoHet] = useState(false);
  return (
    <article className="flag-chapter" data-product={p.id} aria-labelledby={`flag-${p.id}`}>
      <div className="flag-top" data-reverse={reverse}>
        <FlagshipMediaFrame media={p.media} name={p.name} vi={vi} />

        <div className="flag-copy">
          <p className="flag-kicker">
            <img src={p.logo} alt="" width={28} height={28} aria-hidden />
            {p.kicker}
          </p>
          <h3 id={`flag-${p.id}`} className="flag-name">{p.name}</h3>
          <p className="flag-pitch">{p.pitch}</p>

          <p className="flag-fits-label">{vi ? 'Hợp với' : 'Made for'}</p>
          <ul className="flag-fits">
            {p.fits.map((f) => <li key={f}>{f}</li>)}
          </ul>

          <dl className="flag-stats">
            {p.stats.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>

          <div className="flag-actions">
            {p.actions.map((a) => (
              <Link key={a.href} href={a.href} className={a.primary ? 'landing-primary-action' : 'landing-secondary-action'}>
                <span>{a.label}</span>
                {a.primary ? <ArrowRight aria-hidden size={17} /> : <ArrowUpRight aria-hidden size={16} />}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="flag-features" data-mo={moHet}>
        <h4 className="flag-sub">{vi ? 'Tính năng' : 'Features'}</h4>
        <ul className="flag-groups">
          {p.groups.map((g) => {
            const Icon = ICONS[g.icon] ?? KanbanSquare;
            return (
              <li key={g.title} className="flag-group">
                <span className="flag-group-icon"><Icon size={18} aria-hidden /></span>
                <h5>{g.title}</h5>
                <ul>{g.items.map((it) => <li key={it}>{it}</li>)}</ul>
              </li>
            );
          })}
        </ul>
        {/* Điện thoại: chỉ hiện 2 nhóm đầu, phần còn lại sau một cú bấm. */}
        <button type="button" className="flag-more" onClick={() => setMoHet((x) => !x)} aria-expanded={moHet}>
          {moHet
            ? (vi ? 'Thu gọn' : 'Show less')
            : (vi ? `Xem đủ ${p.groups.length} nhóm tính năng` : `See all ${p.groups.length} feature groups`)}
        </button>
      </div>

      <div className="flag-strengths">
        <h4 className="flag-sub">{vi ? 'Điểm mạnh' : 'Why it stands out'}</h4>
        <ol>
          {p.strengths.map((s, i) => (
            <li key={s.title}>
              <span className="flag-strength-n" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
              <h5>{s.title}</h5>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </article>
  );
}

export default function FlagshipShowcase({ vi }: { vi: boolean }) {
  const ds = getFlagships(vi);
  return (
    <section className="landing-showcase" aria-labelledby="landing-showcase-title">
      <div className="landing-showcase-head">
        <p className="landing-showcase-eyebrow">{vi ? 'Sản phẩm chủ lực' : 'Flagship tools'}</p>
        <h2 id="landing-showcase-title">
          {vi ? 'Hai công cụ chúng tôi tự dựng và dùng mỗi ngày' : 'Two tools we built and use every day'}
        </h2>
        <p>
          {vi
            ? 'Không chỉ là bài học — đây là phần mềm thật, có người dùng thật: sinh viên, giảng viên, mentor ở trường và các team ở công ty phần mềm. Một nơi quản lý dự án kiểu Jira, và một agent lập trình chạy ngay trên máy bạn — hai thứ nối được vào nhau.'
            : 'Not just lessons — real software with real users: students, lecturers and mentors, and teams at software companies. A Jira-style place to run projects, and a coding agent that runs on your own machine — and the two plug into each other.'}
        </p>
      </div>
      <div className="flag-list">
        {ds.map((p, i) => <FlagshipChapter key={p.id} p={p} vi={vi} reverse={i % 2 === 1} />)}
      </div>
    </section>
  );
}
