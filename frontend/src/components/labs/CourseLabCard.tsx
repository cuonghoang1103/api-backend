/**
 * Lối vào phòng lab trên trang giới thiệu khoá (/courses/<slug>): một thẻ nhỏ cho đúng các khoá có mô phỏng nhúng.
 * Không import danh mục mô phỏng (giữ gói JS trang khoá học nhẹ) — chỉ chữ + link.
 */
import Link from 'next/link';
import { FlaskConical, ArrowRight } from 'lucide-react';

const LAB_OF: Record<string, { href: string; vi: string; en: string; subVi: string; subEn: string }> = {
  'introduction-to-computer-science': {
    href: '/cpu-lab', vi: 'Phòng lab: Máy tính từ số 0', en: 'Lab: A computer from zero',
    subVi: '6 mô phỏng (bit, chữ & số thực, cổng logic, CPU, từ C tới mã máy, cache) — mỗi cái có hướng dẫn từng bước.',
    subEn: '6 simulations (bits, text & floats, logic gates, a CPU, C to machine code, cache) — each with a step-by-step guide.',
  },
  'computer-organization-and-architecture': {
    href: '/cpu-lab?sim=cpu', vi: 'Phòng lab: CPU, bus, bộ nhớ, cache', en: 'Lab: CPU, bus, memory, cache',
    subVi: 'Chạy chương trình MARIE từng vi bước nạp–giải mã–thực thi, dựng bộ cộng từ cổng logic, đo cache — có hướng dẫn từng bước.',
    subEn: 'Run MARIE programs micro-step by micro-step, build an adder from gates, measure a cache — with step-by-step guides.',
  },
  'operating-systems-for-developers': {
    href: '/os-lab', vi: 'Phòng lab hệ điều hành', en: 'Operating systems lab',
    subVi: '14 mô phỏng: tiến trình, lập lịch, race, deadlock, bộ nhớ ảo, top/htop, event loop… — có hướng dẫn từng bước.',
    subEn: '14 simulations: processes, scheduling, races, deadlock, virtual memory, top/htop, the event loop… — with step-by-step guides.',
  },
};

export default function CourseLabCard({ slug, locale }: { slug: string; locale: string }) {
  const L = LAB_OF[slug];
  if (!L) return null;
  const vi = locale !== 'en';
  return (
    <Link href={L.href} className="group mb-6 flex items-start gap-3 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-3.5 transition-colors hover:border-[var(--accent-color)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent-color)]">
      <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-[var(--accent-color)] text-white" aria-hidden>
        <FlaskConical className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-text-primary">🔬 {vi ? L.vi : L.en}</span>
        <span className="mt-0.5 block text-sm leading-relaxed text-text-secondary">{vi ? L.subVi : L.subEn}</span>
      </span>
      <ArrowRight className="mt-2.5 h-4 w-4 flex-none text-text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--accent-color)] motion-reduce:transition-none" aria-hidden />
    </Link>
  );
}
