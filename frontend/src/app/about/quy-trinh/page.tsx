'use client';

/**
 * /about/quy-trinh — "Quy trình nhận & làm dự án".
 *
 * Hai mục đích (chủ web nói):
 *   1. Cho người đọc thấy tôi nhận và làm một dự án theo trình tự nào.
 *   2. Làm "đòn bẩy" để chính tôi học và làm dự án đúng trình tự — nên mỗi
 *      giai đoạn đều nối tới môn học / khoá học THẬT trên web.
 *
 * ⛔ Cùng luật với /about (xem đầu `app/about/page.tsx`): KHÔNG số liệu bịa,
 * không logo khách, không lời khen. Mọi con số trên trang này ĐẾM từ `data.ts`.
 *
 * Nhẹ là yêu cầu: chỉ CSS 3D + framer-motion (đã có sẵn), không thư viện 3D.
 */
import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowLeft, Mail, MessageSquare } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { CONTACT_ENABLED } from '@/lib/featureFlags';
import ContactSection from '@/components/home/ContactSection';
import Footer from '@/components/home/Footer';
import { PHASES, STAGES } from './data';
import ProcessRing from './ProcessRing';
import StageDetail from './StageDetail';
import StageTimeline from './StageTimeline';
import { CrossCutting, Engagements, LearningMap, ProductTypes, SectionHead } from './Sections';

// Cùng địa chỉ với /about, Footer, ContactSection — đổi thì đổi cả bốn chỗ.
const CONTACT_EMAIL = 'cuongthaihnhe176322@gmail.com';

/** Biến màu tối cục bộ cho khối ContactSection (khối đó tô nền tối cố định). */
const DARK_VARS = {
  '--text-primary': '#e4e6eb',
  '--text-secondary': '#b0b3b8',
  '--text-muted': '#8a8d91',
  '--border-color': '#3e4042',
  '--bg-card': '#242526',
  '--bg-surface': '#303031',
} as React.CSSProperties;

export default function ProcessPage() {
  const { locale } = useTranslation();
  const lang: 'vi' | 'en' = locale === 'en' ? 'en' : 'vi';
  const L = (vi: string, en: string): string => (lang === 'en' ? en : vi);
  const reduced = !!useReducedMotion();
  const [selected, setSelected] = useState(0);

  // Con số ĐẾM từ dữ liệu, không gõ tay.
  const counts = useMemo(() => {
    const learn = new Set<string>();
    const std = new Set<string>();
    let deliverables = 0;
    for (const s of STAGES) {
      s.learn.forEach((l) => learn.add(l.href));
      s.standards.forEach((x) => std.add(x.name));
      deliverables += s.deliverables.length;
    }
    return { stages: STAGES.length, deliverables, standards: std.size, learn: learn.size };
  }, []);

  const openStage = useCallback(
    (n: number) => {
      setSelected(n);
      document.getElementById('chi-tiet')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    },
    [reduced],
  );

  return (
    <div className="min-h-screen overflow-x-clip" style={{ background: 'var(--bg-primary)' }}>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-20 sm:pt-24 pb-10">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] max-w-[140vw] h-[520px] rounded-full blur-3xl opacity-60"
            style={{ background: 'radial-gradient(closest-side, color-mix(in srgb, #8b5cf6 22%, transparent), transparent)' }} />
          <div className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                'linear-gradient(color-mix(in srgb, var(--text-muted) 14%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--text-muted) 14%, transparent) 1px, transparent 1px)',
              backgroundSize: '44px 44px',
              maskImage: 'radial-gradient(ellipse at 50% 30%, #000 20%, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(ellipse at 50% 30%, #000 20%, transparent 70%)',
            }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-4">
          <Link href="/about" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary mb-6">
            <ArrowLeft className="w-4 h-4" /> {L('Giới thiệu', 'About')}
          </Link>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-[0.18em] text-neon-violet"
              style={{ background: 'color-mix(in srgb, #8b5cf6 12%, transparent)', border: '1px solid color-mix(in srgb, #8b5cf6 30%, transparent)' }}>
              {L('Quy trình tôi áp dụng', 'How I work')}
            </span>
            <h1 className="mt-4 font-heading text-4xl sm:text-5xl lg:text-[3.6rem] font-bold text-text-primary leading-[1.08]">
              {L('Quy trình nhận', 'From first message')}{' '}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(120deg, #6366f1, #d946ef 55%, #f59e0b)' }}>
                {L('& làm dự án', 'to handover')}
              </span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-text-secondary leading-relaxed max-w-3xl mx-auto">
              {L(
                'Từ lúc bạn nhắn tin đến lúc sản phẩm chạy thật, được bàn giao tận tay và chăm sóc sau đó — cho web, mobile app, tool nội bộ, AI hay IoT. Mỗi giai đoạn có mục tiêu, tài liệu bàn giao và điều kiện đi tiếp rõ ràng.',
                'From your first message to a product running in production, handed over in person and cared for afterwards — for web, mobile, internal tools, AI or IoT. Every stage has a goal, concrete deliverables and an explicit exit gate.',
              )}
            </p>
          </motion.div>

          <div className="mt-2">
            <ProcessRing stages={STAGES} selected={selected} onSelect={setSelected} lang={lang} reduced={reduced} />
          </div>

          {/* Chú giải nhóm */}
          <ul className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
            {PHASES.map((p) => (
              <li key={p.key} className="flex items-center gap-1.5 text-xs text-text-secondary">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                {L(p.label[0], p.label[1])}
              </li>
            ))}
          </ul>

          <dl className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {[
              [counts.stages, L('giai đoạn', 'stages')],
              [counts.deliverables, L('đầu ra bàn giao', 'deliverables')],
              [counts.standards, L('tiêu chuẩn tham chiếu', 'reference standards')],
              [counts.learn, L('môn & khoá học liên kết', 'linked subjects & courses')],
            ].map(([v, label]) => (
              <div key={String(label)} className="rounded-2xl border px-3 py-3 text-center" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
                <dt className="sr-only">{label}</dt>
                <dd className="font-heading text-2xl sm:text-3xl font-bold text-text-primary tabular-nums">{v}</dd>
                <dd className="text-[11px] sm:text-xs text-text-muted leading-tight mt-0.5">{label}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-8 text-sm text-text-muted leading-relaxed text-center max-w-3xl mx-auto">
            {L(
              'Tôi là Cường — sinh viên Kỹ thuật phần mềm FPTU, tự dựng và vận hành cuongthai.com (Next.js · Express · PostgreSQL · Docker · VPS · Cloudflare · CI/CD). Tôi làm một mình hoặc nhóm nhỏ, nên quy trình được rút gọn cho vừa dự án — nhưng không bỏ bước.',
              'I’m Cường — a Software Engineering student at FPT University who builds and runs cuongthai.com (Next.js · Express · PostgreSQL · Docker · VPS · Cloudflare · CI/CD). I work solo or in a small team, so the process is tailored to the project size — without skipping steps.',
            )}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#chi-tiet" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-neon-gradient shadow-neon">
              {L('Xem từng giai đoạn', 'Explore each stage')} <ArrowDown className="w-4 h-4" />
            </a>
            <a href="#lien-he" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-text-primary border"
              style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
              <MessageSquare className="w-4 h-4" /> {L('Trao đổi dự án', 'Discuss a project')}
            </a>
          </div>
        </div>
      </section>

      {/* ── CHI TIẾT GIAI ĐOẠN ĐANG CHỌN ─────────────────────────────────── */}
      <section id="chi-tiet" className="scroll-mt-20 py-14">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            kicker={L('Chi tiết giai đoạn', 'Stage detail')}
            title={L('Mỗi giai đoạn trả lời 7 câu hỏi', 'Every stage answers seven questions')}
            sub={L(
              'Làm gì · giao gì · khách tham gia gì · dùng công cụ gì · theo chuẩn nào · điều kiện đi tiếp · và học nó ở đâu trên chính trang web này.',
              'What we do · what you get · your part · tools · which standard · the exit gate · and where to learn it on this very site.',
            )}
          />
          <StageDetail stages={STAGES} selected={selected} onSelect={setSelected} lang={lang} reduced={reduced} />
        </div>
      </section>

      {/* ── DÒNG THỜI GIAN ────────────────────────────────────────────────── */}
      <section className="py-14">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHead
            kicker={L('Toàn bộ trình tự', 'The whole sequence')}
            title={L('Từ lời nhắn đầu tiên đến bản v2', 'From first message to v2')}
            sub={L(
              'Giai đoạn 14 vòng lại giai đoạn 2: sản phẩm tốt không kết thúc ở ngày bàn giao.',
              'Stage 14 loops back to stage 2: a good product doesn’t end on handover day.',
            )}
            color="#0ea5e9"
          />
          <StageTimeline stages={STAGES} lang={lang} reduced={reduced} onOpen={openStage} />
        </div>
      </section>

      {/* ── XUYÊN SUỐT ────────────────────────────────────────────────────── */}
      <section className="py-14">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            kicker={L('Xuyên suốt dự án', 'Across every stage')}
            title={L('Những thứ không thuộc riêng giai đoạn nào', 'What runs through every stage')}
            color="#d946ef"
          />
          <CrossCutting lang={lang} reduced={reduced} />
        </div>
      </section>

      {/* ── LOẠI SẢN PHẨM ─────────────────────────────────────────────────── */}
      <section className="py-14">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            kicker={L('Loại sản phẩm', 'Product types')}
            title={L('Cùng quy trình, khác chỗ nhấn', 'Same process, different emphasis')}
            sub={L('Bấm vào một giai đoạn để mở chi tiết của nó.', 'Tap a stage to open its detail.')}
            color="#6366f1"
          />
          <ProductTypes lang={lang} reduced={reduced} onPickStage={openStage} />
        </div>
      </section>

      {/* ── MÔ HÌNH HỢP TÁC ───────────────────────────────────────────────── */}
      <section className="py-14">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            kicker={L('Mô hình hợp tác', 'Engagement models')}
            title={L('Chọn cách làm việc hợp với dự án', 'Pick the way of working that fits')}
            sub={L('Chi phí báo riêng sau khảo sát — trang này không niêm yết giá.', 'Pricing is quoted after discovery — this page lists no prices.')}
            color="#10b981"
          />
          <Engagements lang={lang} reduced={reduced} />
        </div>
      </section>

      {/* ── BẢN ĐỒ HỌC ────────────────────────────────────────────────────── */}
      <section className="py-14">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead
            kicker={L('Quy trình cũng là lộ trình học', 'The process is also a study map')}
            title={L('Học đúng thứ tự dự án cần', 'Learn in the order a project needs it')}
            sub={L(
              'Trang này là đòn bẩy cho chính tôi: mỗi nhóm giai đoạn gắn với môn trường và khoá học trên web — học xong môn nào thì làm được giai đoạn đó.',
              'This page is a lever for me too: each group of stages maps to university subjects and courses on this site — finish the subject, own the stage.',
            )}
            color="#f59e0b"
          />
          <LearningMap lang={lang} reduced={reduced} />
        </div>
      </section>

      {/* ── LIÊN HỆ ───────────────────────────────────────────────────────── */}
      <section id="lien-he" className="scroll-mt-20 pt-14 pb-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl border p-6 sm:p-10 text-center" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
            <div aria-hidden className="pointer-events-none absolute -inset-px rounded-3xl opacity-60"
              style={{ background: 'radial-gradient(600px 200px at 50% 0%, color-mix(in srgb, #8b5cf6 20%, transparent), transparent)' }} />
            <div className="relative">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary">
                {L('Bắt đầu từ giai đoạn 0', 'Start at stage 0')}
              </h2>
              <p className="mt-3 text-text-secondary max-w-xl mx-auto">
                {L(
                  'Kể tôi nghe vấn đề bạn đang gặp — chưa cần tài liệu gì. Nếu dự án không hợp với tôi, tôi sẽ nói thẳng.',
                  'Tell me about the problem — no documents needed yet. If the project isn’t a fit for me, I’ll say so.',
                )}
              </p>
              <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(L('Trao đổi dự án', 'Project enquiry'))}`}
                className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-neon-gradient shadow-neon break-all">
                <Mail className="w-4 h-4 shrink-0" /> {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </div>
      </section>

      {CONTACT_ENABLED && (
        <div style={DARK_VARS}>
          <ContactSection />
        </div>
      )}

      <Footer />
    </div>
  );
}
