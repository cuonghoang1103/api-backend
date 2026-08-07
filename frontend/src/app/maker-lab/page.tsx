'use client';

/**
 * Maker Lab — hub.
 *
 * One place for every physical build, whatever board it runs on.
 * The ESP32 robot is project #1, not the point of the page: the
 * platform filter and the per-project structure exist so the next
 * build (a Pi camera node, an STM32 drone) drops in without a rewrite.
 */

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Boxes,
  CircuitBoard,
  Cpu,
  Loader2,
  Radio,
  Wrench,
} from 'lucide-react';
import { listProjects } from '@/lib/maker-lab-api';
import type { MakerPlatform, MakerProjectStatus, MakerProjectSummary } from '@/types/maker-lab';

const PLATFORM_LABEL: Record<MakerPlatform, string> = {
  ESP32: 'ESP32',
  ESP32_S3: 'ESP32-S3',
  ESP8266: 'ESP8266',
  RP2040: 'RP2040',
  STM32: 'STM32',
  ARDUINO: 'Arduino',
  RASPBERRY_PI: 'Raspberry Pi',
  JETSON: 'Jetson',
  OTHER: 'Khác',
};

const STATUS_META: Record<MakerProjectStatus, { label: string; color: string }> = {
  PLANNING: { label: 'Lên ý tưởng', color: '#94a3b8' },
  SOURCING: { label: 'Đang gom linh kiện', color: '#fbbf24' },
  BUILDING: { label: 'Đang lắp', color: '#fb923c' },
  TESTING: { label: 'Đang chỉnh', color: '#a78bfa' },
  LIVE: { label: 'Đang chạy', color: '#34d399' },
  ARCHIVED: { label: 'Cất kho', color: '#64748b' },
};

export default function MakerLabHub() {
  const [projects, setProjects] = useState<MakerProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [platform, setPlatform] = useState<string>('');

  useEffect(() => {
    void (async () => {
      try {
        setProjects(await listProjects());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const platforms = useMemo(
    () => [...new Set(projects.map((p) => p.platform))],
    [projects],
  );

  const visible = useMemo(
    () => (platform ? projects.filter((p) => p.platform === platform) : projects),
    [projects, platform],
  );

  return (
    // pt-20 clears the fixed navbar (64px) and the sidebar toggle that
    // floats over its left edge — without it the page title sits under
    // the hamburger button. Same reservation as /exp-hub.
    <div className="mx-auto max-w-6xl px-4 pb-10 pt-20 sm:px-6 sm:pt-24 lg:pb-14">
      {/* ── Header ── */}
      <header className="mb-10">
        <div className="mb-3 flex items-center gap-2">
          <CircuitBoard size={22} style={{ color: '#22d3ee' }} />
          <span
            className="text-xs font-bold uppercase tracking-[0.2em]"
            style={{ color: '#22d3ee' }}
          >
            Maker Lab
          </span>
        </div>
        <h1
          className="text-3xl font-extrabold tracking-tight sm:text-4xl"
          style={{ color: 'var(--text-primary)' }}
        >
          Xưởng phần cứng
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Mọi dự án phần cứng và nhúng ở một chỗ: robot, cảm biến, drone, bo tự thiết kế. Mỗi dự án
          có danh sách linh kiện kèm lý do chọn, sơ đồ nối dây, lộ trình firmware, và{' '}
          <strong style={{ color: 'var(--text-primary)' }}>bảng điều khiển trực tiếp</strong> — thiết
          bị thật nối thẳng vào server này.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <FilterChip active={!platform} onClick={() => setPlatform('')} label="Tất cả" />
          {platforms.map((p) => (
            <FilterChip
              key={p}
              active={platform === p}
              onClick={() => setPlatform(p)}
              label={PLATFORM_LABEL[p]}
            />
          ))}
        </div>
      </header>

      {/* ── Projects ── */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin" style={{ color: 'var(--text-muted)' }} />
        </div>
      ) : visible.length === 0 ? (
        <div
          className="rounded-2xl border px-6 py-20 text-center"
          style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
        >
          <Boxes size={30} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Chưa có dự án nào ở nền tảng này.</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {visible.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}

      {/* ── How this works ── */}
      <section className="mt-14">
        <h2 className="mb-4 text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
          Xưởng này khác gì một trang hướng dẫn
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <InfoCard
            icon={<Wrench size={18} />}
            title="Có lý do, không chỉ có danh sách"
            body="Mỗi linh kiện đều kèm giải thích vì sao chọn con đó thay vì con rẻ hơn — thứ mà bảng giá không nói cho bạn biết, và thứ khiến bạn mất một buổi tối nếu chọn sai."
          />
          <InfoCard
            icon={<Radio size={18} />}
            title="Thiết bị nối thẳng vào đây"
            body="Bo mạch mở WebSocket tới chính server này. Không qua đám mây của hãng nào, không tài khoản bên thứ ba, dữ liệu cảm biến nằm trong Postgres của bạn."
          />
          <InfoCard
            icon={<Cpu size={18} />}
            title="Chạy thử trước khi mua"
            body="Bảng điều khiển hoạt động với robot giả lập, nên bạn kiểm được toàn bộ đường đi của dữ liệu trước khi bỏ tiền mua linh kiện đầu tiên."
          />
        </div>
      </section>
    </div>
  );
}

function ProjectCard({ project: p }: { project: MakerProjectSummary }) {
  const status = STATUS_META[p.status];
  const progress = p.componentCount ? p.acquiredCount / p.componentCount : 0;
  const accent = p.accentColor ?? '#22d3ee';

  return (
    <Link
      href={`/maker-lab/${p.slug}`}
      className="group block overflow-hidden rounded-2xl border transition-all hover:-translate-y-0.5"
      style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
    >
      <div className="h-1" style={{ background: accent }} />
      <div className="p-5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span
            className="rounded-md px-2 py-0.5 text-[11px] font-bold"
            style={{ background: `${accent}22`, color: accent }}
          >
            {PLATFORM_LABEL[p.platform]}
          </span>
          <span className="flex items-center gap-1.5 text-[11px]" style={{ color: status.color }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: status.color }} />
            {status.label}
          </span>
          {p.featured && (
            <span className="ml-auto text-[11px]" style={{ color: 'var(--text-muted)' }}>
              ★ nổi bật
            </span>
          )}
        </div>

        <h3
          className="text-xl font-bold tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          {p.name}
        </h3>
        {p.tagline && (
          <p className="mt-1.5 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {p.tagline}
          </p>
        )}

        <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
          <Stat label="Linh kiện" value={String(p.componentCount)} />
          <Stat
            label="Chi phí"
            value={p.estCostVnd ? `~${(p.estCostVnd / 1_000_000).toFixed(1)}tr` : '—'}
          />
          <Stat label="Độ khó" value={'●'.repeat(p.difficulty) + '○'.repeat(5 - p.difficulty)} />
        </div>

        {p.componentCount > 0 && (
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-[11px]" style={{ color: 'var(--text-muted)' }}>
              <span>Đã gom linh kiện</span>
              <span>
                {p.acquiredCount}/{p.componentCount}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full" style={{ background: 'var(--bg-surface)' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${Math.round(progress * 100)}%`, background: accent }}
              />
            </div>
          </div>
        )}

        <div
          className="mt-4 flex items-center gap-1.5 text-sm font-medium transition-transform group-hover:translate-x-0.5"
          style={{ color: accent }}
        >
          Mở dự án <ArrowRight size={15} />
        </div>
      </div>
    </Link>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
        {label}
      </p>
      <p className="mt-0.5 font-semibold" style={{ color: 'var(--text-primary)' }}>
        {value}
      </p>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors"
      style={{
        borderColor: active ? '#22d3ee' : 'var(--border-color)',
        background: active ? 'rgba(34,211,238,0.1)' : 'transparent',
        color: active ? '#0891b2' : 'var(--text-secondary)',
      }}
    >
      {label}
    </button>
  );
}

function InfoCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
    >
      <div className="mb-2" style={{ color: '#22d3ee' }}>
        {icon}
      </div>
      <h3 className="mb-1.5 text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h3>
      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {body}
      </p>
    </div>
  );
}
