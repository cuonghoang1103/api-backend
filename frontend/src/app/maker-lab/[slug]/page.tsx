'use client';

/**
 * Maker Lab — project page.
 *
 * Tabs ordered the way you actually build something:
 *   Tổng quan  → what and why, plus the system diagram
 *   Ngoại hình → the shell, drawn to scale, and where each part sits
 *   Linh kiện  → what to buy (and what NOT to buy instead)
 *   Nối dây    → where every wire goes
 *   Firmware   → what to write, module by module
 *   Điều khiển → the live console for the real board
 *   Sổ tay     → commands, errors hit, snippets — grows as you build
 *   Nhật ký    → build diary + the personality config
 */

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  Box,
  CircuitBoard,
  Clock,
  Cpu,
  FileCode2,
  Gauge,
  GraduationCap,
  Loader2,
  Mic2,
  NotebookPen,
  Radio,
  Sparkles,
  Wallet,
  Zap,
} from 'lucide-react';
import { getProject } from '@/lib/maker-lab-api';
import { useAuthStore } from '@/store/authStore';
import { BomTable } from '@/components/maker-lab/BomTable';
import { WiringDiagram } from '@/components/maker-lab/WiringDiagram';
import { SystemFlowDiagram } from '@/components/maker-lab/SystemFlowDiagram';
import { DeviceConsole } from '@/components/maker-lab/DeviceConsole';
import { FirmwarePlan } from '@/components/maker-lab/FirmwarePlan';
import { FirmwareUpload } from '@/components/maker-lab/FirmwareUpload';
import { RobotBlueprint } from '@/components/maker-lab/RobotBlueprint';
import { ProjectDocs } from '@/components/maker-lab/ProjectDocs';
import { ProjectNotebook } from '@/components/maker-lab/ProjectNotebook';
import PersonaEditor from '@/components/maker-lab/PersonaEditor';
import TrainingPanel from '@/components/maker-lab/TrainingPanel';
import { listDevices } from '@/lib/maker-lab-api';
import type { MakerDevice } from '@/types/maker-lab';
import type { MakerProjectDetail } from '@/types/maker-lab';

const TABS = [
  { id: 'overview', label: 'Tổng quan', icon: BookOpen },
  { id: 'shell', label: 'Ngoại hình', icon: Box },
  { id: 'bom', label: 'Linh kiện', icon: CircuitBoard },
  { id: 'wiring', label: 'Nối dây', icon: Zap },
  { id: 'firmware', label: 'Firmware', icon: FileCode2 },
  { id: 'console', label: 'Điều khiển', icon: Radio },
  { id: 'persona', label: 'Tính cách', icon: Mic2 },
  { id: 'training', label: 'Huấn luyện', icon: GraduationCap },
  { id: 'notebook', label: 'Sổ tay', icon: NotebookPen },
  { id: 'docs', label: 'Nhật ký', icon: Cpu },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function MakerProjectPage() {
  const params = useParams();
  const router = useRouter();
  const search = useSearchParams();
  const slug = String(params?.slug ?? '');

  const [project, setProject] = useState<MakerProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  // Chỉ dùng cho nút "Nghe thử" ở tab Tính cách. Lỗi thì bỏ qua: chưa
  // đăng nhập là 401, mà cả trang vẫn phải xem được bình thường.
  const [devices, setDevices] = useState<MakerDevice[]>([]);
  const [tab, setTab] = useState<TabId>(() => {
    const t = search.get('tab');
    return (TABS.find((x) => x.id === t)?.id ?? 'overview') as TabId;
  });

  const isAuthed = useAuthStore((s) => !!s.user);

  useEffect(() => {
    void (async () => {
      try {
        setProject(await getProject(slug));
      } finally {
        setLoading(false);
      }
      try {
        setDevices(await listDevices());
      } catch {
        /* chưa đăng nhập — nút "Nghe thử" tự vô hiệu hoá */
      }
    })();
  }, [slug]);

  function selectTab(id: TabId) {
    setTab(id);
    // Deep-linkable without a reload — handy when sharing "look at the
    // wiring tab" with someone.
    const url = new URL(window.location.href);
    url.searchParams.set('tab', id);
    router.replace(url.pathname + url.search, { scroll: false });
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin" style={{ color: 'var(--text-muted)' }} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
          Không tìm thấy dự án này.
        </p>
        <Link href="/maker-lab" className="text-sm font-medium" style={{ color: 'var(--accent-color)' }}>
          ← Về Maker Lab
        </Link>
      </div>
    );
  }

  const accent = project.accentColor ?? '#22d3ee';

  return (
    // pt-20 clears the fixed navbar (64px) plus the sidebar toggle
    // floating over its left edge — otherwise the "← Maker Lab" link
    // lands underneath the hamburger button.
    <div className="mx-auto max-w-6xl px-4 pb-10 pt-20 sm:px-6 sm:pt-24 lg:pb-14">
      <Link
        href="/maker-lab"
        className="mb-5 inline-flex items-center gap-1.5 text-sm"
        style={{ color: 'var(--text-muted)' }}
      >
        <ArrowLeft size={14} /> Maker Lab
      </Link>

      {/* ── Header ── */}
      <header className="mb-7">
        <h1
          className="text-3xl font-extrabold tracking-tight sm:text-4xl"
          style={{ color: 'var(--text-primary)' }}
        >
          {project.name}
        </h1>
        {project.tagline && (
          <p className="mt-2 text-base" style={{ color: 'var(--text-secondary)' }}>
            {project.tagline}
          </p>
        )}

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <HeadStat
            icon={<Wallet size={15} />}
            label="Chi phí linh kiện"
            value={`${project.totalCostVnd.toLocaleString('vi-VN')} đ`}
            accent={accent}
          />
          <HeadStat
            icon={<CircuitBoard size={15} />}
            label="Đã gom"
            value={`${project.acquiredCount}/${project.components.length}`}
            accent="#34d399"
          />
          <HeadStat
            icon={<Clock size={15} />}
            label="Thời gian ước tính"
            value={project.estHours ? `~${project.estHours} giờ` : '—'}
            accent="#a78bfa"
          />
          <HeadStat
            icon={<Gauge size={15} />}
            label="Độ khó"
            value={'●'.repeat(project.difficulty) + '○'.repeat(5 - project.difficulty)}
            accent="#fb923c"
          />
        </div>
      </header>

      {/* ── Tabs ── */}
      <nav
        className="mb-6 flex gap-1 overflow-x-auto border-b pb-px"
        style={{ borderColor: 'var(--border-color)' }}
      >
        {TABS.map((t) => {
          const Icon = t.icon;
          const on = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => selectTab(t.id)}
              className="flex shrink-0 items-center gap-1.5 border-b-2 px-3.5 py-2.5 text-sm font-medium transition-colors"
              style={{
                borderColor: on ? accent : 'transparent',
                color: on ? 'var(--text-primary)' : 'var(--text-muted)',
              }}
            >
              <Icon size={14} />
              {t.label}
            </button>
          );
        })}
      </nav>

      {/* ── Panels ── */}
      {tab === 'overview' && <Overview project={project} accent={accent} />}
      {tab === 'shell' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              Vỏ ngoài & bố trí bên trong
            </h2>
            <p className="mt-1 max-w-2xl text-sm" style={{ color: 'var(--text-muted)' }}>
              Bản vẽ theo đúng tỉ lệ, dựng từ kích thước thật của từng linh kiện — không phải hình
              minh hoạ. Rê chuột vào từng khoang để xem nó chứa gì.
            </p>
          </div>
          <RobotBlueprint data={project.enclosure} />
        </div>
      )}
      {tab === 'bom' && <BomTable components={project.components} canEdit={isAuthed} />}
      {tab === 'wiring' && <WiringDiagram wiring={project.wiring} />}
      {tab === 'firmware' && (
        <>
          {/* Chỉ hiện cho người đã đăng nhập: route bên dưới đòi quyền
              admin, nên bày nút cho khách chỉ tổ cho họ bấm rồi ăn 401. */}
          {isAuthed && <FirmwareUpload projectId={project.id} builds={project.firmwares} />}
          <FirmwarePlan
            modules={project.firmwareModules}
            builds={project.firmwares}
            slug={project.slug}
          />
        </>
      )}
      {tab === 'console' && (
        <DeviceConsole
          projectId={project.id}
          projectSlug={project.slug}
          isAuthed={isAuthed}
          speechRate={Number(project.persona?.traits?.speechRate) || 1}
          cheDo={String(project.persona?.traits?.cheDo || 'vi')}
        />
      )}
      {tab === 'persona' && (
        <PersonaEditor
          projectId={project.id}
          persona={project.persona}
          devices={devices}
          accent={accent}
        />
      )}
      {tab === 'training' && <TrainingPanel projectId={project.id} accent={accent} />}
      {tab === 'notebook' && <ProjectNotebook data={project.notebook} />}
      {tab === 'docs' && <ProjectDocs project={project} />}
    </div>
  );
}

function Overview({ project, accent }: { project: MakerProjectDetail; accent: string }) {
  return (
    <div className="space-y-8">
      {project.summary && (
        <section className="max-w-3xl space-y-3 text-[15px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {project.summary.split('\n\n').map((para, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: boldify(para) }} />
          ))}
        </section>
      )}

      {project.goals?.length ? (
        <section>
          <h2 className="mb-3 text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            Mục tiêu
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {project.goals.map((g, i) => (
              <div
                key={i}
                className="rounded-xl border p-4"
                style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
              >
                <div className="flex items-start gap-2">
                  <span
                    className="mt-1 h-2 w-2 shrink-0 rounded-full"
                    style={{ background: g.done ? '#34d399' : accent }}
                  />
                  <div className="min-w-0">
                    <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {g.title}
                    </p>
                    {g.detail && (
                      <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {g.detail}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {project.architecture && (
        <section>
          <h2 className="mb-1 text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            Sơ đồ hoạt động
          </h2>
          <p className="mb-4 max-w-2xl text-sm" style={{ color: 'var(--text-muted)' }}>
            Điều đáng chú ý nhất không phải các khối, mà là <strong>chúng chạy ở đâu</strong>: phần
            nặng nằm trên VPS, con bo chỉ lo nghe, phát tiếng và cử động.
          </p>
          <SystemFlowDiagram architecture={project.architecture} />
        </section>
      )}

      {project.features?.length ? (
        <section>
          <h2 className="mb-1 text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            Có thể làm thêm gì
          </h2>
          <p className="mb-4 text-sm" style={{ color: 'var(--text-muted)' }}>
            Sắp theo độ khó — mấy cái 1 sao làm xong trong một buổi tối.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {[...project.features]
              .sort((a, b) => (a.difficulty ?? 3) - (b.difficulty ?? 3))
              .map((f, i) => (
                <div
                  key={i}
                  className="rounded-xl border p-4"
                  style={{
                    borderColor: f.status === 'ready' ? '#34d39955' : 'var(--border-color)',
                    background: 'var(--bg-card)',
                  }}
                >
                  <div className="mb-1.5 flex items-center gap-2">
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {f.title}
                    </span>
                    {f.status === 'ready' && (
                      <span
                        className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold"
                        style={{ background: 'rgba(52,211,153,0.15)', color: '#059669' }}
                      >
                        <Sparkles size={9} /> sẵn sàng
                      </span>
                    )}
                    <span className="ml-auto shrink-0 text-xs" style={{ color: 'var(--text-muted)' }}>
                      {'●'.repeat(f.difficulty ?? 3)}
                      <span style={{ opacity: 0.3 }}>{'●'.repeat(5 - (f.difficulty ?? 3))}</span>
                    </span>
                  </div>
                  {f.detail && (
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {f.detail}
                    </p>
                  )}
                  {f.dependsOn?.length ? (
                    <p className="mt-2 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                      Cần thêm: {f.dependsOn.join(', ')}
                    </p>
                  ) : null}
                </div>
              ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

/** Tiny subset of markdown: **bold** only. The summary is prose, not a document. */
function boldify(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*([^*]+)\*\*/g, '<strong style="color:var(--text-primary)">$1</strong>');
}

function HeadStat({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div
      className="rounded-xl border p-3"
      style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
    >
      <p className="flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--text-muted)' }}>
        <span style={{ color: accent }}>{icon}</span>
        {label}
      </p>
      <p className="mt-1 font-mono text-base font-bold" style={{ color: 'var(--text-primary)' }}>
        {value}
      </p>
    </div>
  );
}
