'use client';

/**
 * Maker Lab — Live Console.
 *
 * The control plane for a physical board: register it, drive it, talk
 * to it, and watch what it reports — all over the socket.io room the
 * device gateway fans events into.
 *
 * Works before you own any hardware. Register a device, copy the
 * credentials, and point `scratchpad/fake-device.mjs` at them — every
 * panel here lights up against the simulator, which is how this got
 * verified without a robot on the desk.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Activity,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Copy,
  Cpu,
  KeyRound,
  Loader2,
  Plus,
  Power,
  Send,
  Square,
  Terminal,
  Trash2,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  connectSocket,
  joinDeviceRoom,
  leaveDeviceRoom,
  onDeviceLog,
  onDeviceStatus,
  onDeviceTelemetry,
  onDeviceTranscript,
  type MakerLogEvent,
  type MakerTelemetryEvent,
  type MakerTranscriptEvent,
} from '@/lib/socket';
import {
  chatWithDevice,
  deleteDevice,
  getDeviceLogs,
  listDevices,
  registerDevice,
  sendCommand,
} from '@/lib/maker-lab-api';
import type { MakerDevice, MakerDeviceCredentials } from '@/types/maker-lab';

const EMOTIONS = [
  { key: 'happy', label: '😊 Vui' },
  { key: 'sad', label: '😢 Buồn' },
  { key: 'angry', label: '😠 Giận' },
  { key: 'surprised', label: '😲 Bất ngờ' },
  { key: 'sleepy', label: '😴 Buồn ngủ' },
  { key: 'love', label: '🥰 Thích' },
  { key: 'thinking', label: '🤔 Nghĩ' },
  { key: 'confused', label: '😕 Bối rối' },
];

const SPEED = 180;

export function DeviceConsole({
  projectId,
  projectSlug,
  isAuthed,
}: {
  projectId: number;
  projectSlug: string;
  isAuthed: boolean;
}) {
  const [devices, setDevices] = useState<MakerDevice[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [creds, setCreds] = useState<MakerDeviceCredentials | null>(null);

  const [logs, setLogs] = useState<MakerLogEvent[]>([]);
  const [telemetry, setTelemetry] = useState<Record<string, number | string | boolean>>({});
  const [chat, setChat] = useState<MakerTranscriptEvent[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [thinking, setThinking] = useState(false);

  const logEndRef = useRef<HTMLDivElement>(null);
  const active = devices.find((d) => d.id === activeId) ?? null;

  // ── Load devices ──
  const refresh = useCallback(async () => {
    if (!isAuthed) {
      setLoading(false);
      return;
    }
    try {
      const list = await listDevices();
      const mine = list.filter((d) => d.projectId === projectId);
      setDevices(mine);
      setActiveId((cur) => cur ?? mine[0]?.id ?? null);
    } catch {
      /* not fatal — the panel shows the empty state */
    } finally {
      setLoading(false);
    }
  }, [isAuthed, projectId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // ── Live wiring ──
  useEffect(() => {
    if (!activeId || !isAuthed) return;
    let cleanups: Array<() => void> = [];
    let cancelled = false;

    void (async () => {
      try {
        await connectSocket();
      } catch {
        return;
      }
      if (cancelled) return;
      joinDeviceRoom(activeId);

      cleanups = [
        onDeviceLog((e) => {
          if (e.deviceId !== activeId) return;
          setLogs((l) => [...l.slice(-400), e]);
        }),
        onDeviceTelemetry((e: MakerTelemetryEvent) => {
          if (e.deviceId !== activeId) return;
          setTelemetry((t) => ({ ...t, ...e.payload }));
        }),
        onDeviceStatus((e) => {
          if (e.deviceId !== activeId) return;
          setDevices((ds) =>
            ds.map((d) =>
              d.id === activeId
                ? { ...d, status: e.status, connected: e.status !== 'OFFLINE' }
                : d,
            ),
          );
        }),
        onDeviceTranscript((e) => {
          if (e.deviceId !== activeId) return;
          setChat((c) => [...c.slice(-60), e]);
        }),
      ];

      // Backfill the serial view so the console isn't blank on open.
      try {
        const past = await getDeviceLogs(activeId);
        if (!cancelled) {
          setLogs(
            past.map((p) => ({
              deviceId: p.deviceId,
              level: p.level,
              message: p.message,
              at: p.createdAt,
            })),
          );
        }
      } catch {
        /* ignore */
      }
    })();

    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
      leaveDeviceRoom(activeId);
    };
  }, [activeId, isAuthed]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ block: 'end' });
  }, [logs]);

  // ── Actions ──
  async function handleCreate() {
    const name = newName.trim();
    if (!name) return;
    setCreating(true);
    try {
      const out = await registerDevice({ projectId, name });
      setCreds(out.credentials);
      setNewName('');
      await refresh();
      setActiveId(out.device.id);
    } catch {
      toast.error('Không tạo được thiết bị');
    } finally {
      setCreating(false);
    }
  }

  async function cmd(type: string, payload?: Record<string, unknown>) {
    if (!activeId) return;
    try {
      const res = await sendCommand(activeId, type, payload);
      if (!res.delivered) toast.info('Thiết bị offline — lệnh đã xếp hàng chờ');
    } catch {
      toast.error('Gửi lệnh thất bại');
    }
  }

  async function handleChat() {
    const text = chatInput.trim();
    if (!text || !activeId) return;
    setChatInput('');
    setChat((c) => [
      ...c,
      { deviceId: activeId, role: 'user', text, at: new Date().toISOString() },
    ]);
    setThinking(true);
    try {
      const out = await chatWithDevice(activeId, text);
      // The bot line also arrives over the socket; guard against a
      // double render when both land.
      setChat((c) =>
        c.some((m) => m.role === 'bot' && m.text === out.said)
          ? c
          : [...c, { deviceId: activeId, role: 'bot', text: out.said, at: new Date().toISOString() }],
      );
      if (out.ms?.total) {
        toast.success(
          `${out.ms.total} ms (nghĩ ${out.ms.llm} · nói ${out.ms.tts})${out.spoken ? ' · đã phát ra loa' : ''}`,
        );
      }
    } catch {
      toast.error('Robot không trả lời được');
    } finally {
      setThinking(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Xoá thiết bị này? Firmware đang dùng secret cũ sẽ mất kết nối.')) return;
    try {
      await deleteDevice(id);
      setActiveId(null);
      await refresh();
    } catch {
      toast.error('Xoá thất bại');
    }
  }

  // ── Render ──
  if (!isAuthed) {
    return (
      <EmptyPanel
        icon={<KeyRound size={28} />}
        title="Đăng nhập để điều khiển thiết bị"
        body="Bảng điều khiển gắn với tài khoản của bạn: mỗi thiết bị có khoá riêng và chỉ chủ sở hữu thấy được dữ liệu cảm biến."
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="animate-spin" style={{ color: 'var(--text-muted)' }} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ── Device picker + registration ── */}
      <section
        className="rounded-xl border p-4"
        style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
      >
        <div className="flex flex-wrap items-center gap-2">
          {devices.map((d) => (
            <button
              key={d.id}
              onClick={() => {
                setActiveId(d.id);
                setLogs([]);
                setChat([]);
                setTelemetry({});
              }}
              className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors"
              style={{
                borderColor: d.id === activeId ? 'var(--accent-color)' : 'var(--border-color)',
                background: d.id === activeId ? 'rgba(24,119,242,0.08)' : 'transparent',
                color: 'var(--text-primary)',
              }}
            >
              {d.connected ? (
                <Wifi size={14} style={{ color: '#34d399' }} />
              ) : (
                <WifiOff size={14} style={{ color: 'var(--text-muted)' }} />
              )}
              {d.name}
            </button>
          ))}

          <div className="flex items-center gap-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                // Never steal Enter from an IME candidate window — a
                // Vietnamese/Japanese typist would lose their input.
                if (e.key === 'Enter' && !e.nativeEvent.isComposing) void handleCreate();
              }}
              placeholder="Tên robot mới…"
              className="w-40 rounded-lg border px-3 py-2 text-sm outline-none"
              style={{
                borderColor: 'var(--border-color)',
                background: 'var(--bg-surface)',
                color: 'var(--text-primary)',
              }}
            />
            <button
              onClick={handleCreate}
              disabled={creating || !newName.trim()}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-white disabled:opacity-40"
              style={{ background: 'var(--accent-color)' }}
            >
              {creating ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Đăng ký
            </button>
          </div>
        </div>

        {creds && <CredentialsCard creds={creds} projectSlug={projectSlug} onClose={() => setCreds(null)} />}
      </section>

      {!active ? (
        <EmptyPanel
          icon={<Cpu size={28} />}
          title="Chưa có thiết bị nào"
          body="Đăng ký một cái ở trên. Bạn sẽ nhận được khoá và secret để nạp vào firmware — hoặc chạy thử ngay bằng robot giả lập (node tools/fake-device.mjs) trước khi mua linh kiện."
        />
      ) : (
        <>
          {/* ── Status strip ── */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Metric
              label="Kết nối"
              value={active.connected ? 'ONLINE' : 'OFFLINE'}
              accent={active.connected ? '#34d399' : '#94a3b8'}
            />
            <Metric
              label="Pin"
              value={num(telemetry.battery ?? active.batteryPct, '%')}
              accent="#fbbf24"
            />
            <Metric label="Sóng WiFi" value={num(telemetry.rssi ?? active.rssi, ' dBm')} accent="#38bdf8" />
            <Metric
              label="Firmware"
              value={active.firmwareVersion ?? '—'}
              accent="#a78bfa"
            />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {/* ── Drive + express ── */}
            <section
              className="rounded-xl border p-4"
              style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
            >
              <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                <Activity size={15} /> Điều khiển
              </h4>

              <div className="mx-auto grid w-[168px] grid-cols-3 gap-2">
                <span />
                <PadButton onClick={() => cmd('move', { left: SPEED, right: SPEED, ms: 600 })}>
                  <ArrowUp size={18} />
                </PadButton>
                <span />
                <PadButton onClick={() => cmd('move', { left: -SPEED, right: SPEED, ms: 400 })}>
                  <ArrowLeft size={18} />
                </PadButton>
                <PadButton onClick={() => cmd('stop')} danger>
                  <Square size={15} />
                </PadButton>
                <PadButton onClick={() => cmd('move', { left: SPEED, right: -SPEED, ms: 400 })}>
                  <ArrowRight size={18} />
                </PadButton>
                <span />
                <PadButton onClick={() => cmd('move', { left: -SPEED, right: -SPEED, ms: 600 })}>
                  <ArrowDown size={18} />
                </PadButton>
                <span />
              </div>

              <div className="mt-4">
                <p className="mb-2 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                  Biểu cảm
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {EMOTIONS.map((e) => (
                    <button
                      key={e.key}
                      onClick={() => cmd('face', { emotion: e.key, ms: 3000 })}
                      className="rounded-lg border px-2.5 py-1.5 text-xs transition-colors"
                      style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                    >
                      {e.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {(['spin', 'wiggle', 'nod', 'shake', 'celebrate'] as const).map((n) => (
                  <button
                    key={n}
                    onClick={() => cmd('dance', { name: n })}
                    className="rounded-lg border px-2.5 py-1.5 text-xs"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => cmd('reboot')}
                  className="ml-auto flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs"
                  style={{ borderColor: '#ef444455', color: '#ef4444' }}
                >
                  <Power size={12} /> Khởi động lại
                </button>
                <button
                  onClick={() => handleDelete(active.id)}
                  className="flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs"
                  style={{ borderColor: '#ef444455', color: '#ef4444' }}
                >
                  <Trash2 size={12} /> Xoá
                </button>
              </div>
            </section>

            {/* ── Talk ── */}
            <section
              className="flex flex-col rounded-xl border p-4"
              style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
            >
              <h4 className="mb-3 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Nói chuyện với robot
              </h4>

              <div className="mb-3 h-56 space-y-2 overflow-y-auto pr-1">
                {chat.length === 0 && (
                  <p className="pt-16 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                    Gõ gì đó. Robot nghĩ bằng tính cách bạn đã đặt, rồi phát ra loa nếu nó đang online.
                  </p>
                )}
                {chat.map((m, i) => (
                  <div
                    key={i}
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${m.role === 'user' ? 'ml-auto' : ''}`}
                    style={{
                      background: m.role === 'user' ? 'var(--accent-color)' : 'var(--bg-surface)',
                      color: m.role === 'user' ? '#fff' : 'var(--text-primary)',
                    }}
                  >
                    {m.text}
                  </div>
                ))}
                {thinking && (
                  <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <Loader2 size={12} className="animate-spin" /> đang nghĩ…
                  </div>
                )}
              </div>

              <div className="mt-auto flex gap-2">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.nativeEvent.isComposing) void handleChat();
                  }}
                  placeholder="Nói gì đó với robot…"
                  className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none"
                  style={{
                    borderColor: 'var(--border-color)',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                  }}
                />
                <button
                  onClick={handleChat}
                  disabled={thinking || !chatInput.trim()}
                  className="rounded-lg px-3 text-white disabled:opacity-40"
                  style={{ background: 'var(--accent-color)' }}
                >
                  <Send size={15} />
                </button>
              </div>
            </section>
          </div>

          {/* ── Serial monitor ── */}
          <section
            className="overflow-hidden rounded-xl border"
            style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
          >
            <div
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold"
              style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
            >
              <Terminal size={14} /> Nhật ký thiết bị
              <span className="ml-auto text-xs font-normal" style={{ color: 'var(--text-muted)' }}>
                {logs.length} dòng
              </span>
            </div>
            <div className="h-64 overflow-y-auto p-3 font-mono text-xs" style={{ background: '#0b0d10' }}>
              {logs.length === 0 && (
                <p className="text-slate-500">
                  Chưa có log. Bật robot lên — hoặc chạy{' '}
                  <span className="text-cyan-400">node tools/fake-device.mjs</span> để giả lập.
                </p>
              )}
              {logs.map((l, i) => (
                <div key={i} className="flex gap-2">
                  <span className="shrink-0 text-slate-600">
                    {new Date(l.at).toLocaleTimeString('vi-VN')}
                  </span>
                  <span className={`shrink-0 uppercase ${levelColor(l.level)}`}>{l.level}</span>
                  <span className="text-slate-300">{l.message}</span>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </section>

          {/* ── Raw telemetry ── */}
          {Object.keys(telemetry).length > 0 && (
            <section
              className="rounded-xl border p-4"
              style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
            >
              <h4 className="mb-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Cảm biến (trực tiếp)
              </h4>
              <div className="grid gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(telemetry).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-xs">
                    <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                    <span className="font-mono" style={{ color: 'var(--text-primary)' }}>
                      {String(v)}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

// ─── Bits ──────────────────────────────────────────────────

function levelColor(level: string): string {
  if (level === 'error') return 'text-red-400';
  if (level === 'warn') return 'text-amber-400';
  if (level === 'debug') return 'text-slate-500';
  return 'text-emerald-400';
}

function num(v: unknown, suffix = ''): string {
  if (typeof v === 'number') return `${v}${suffix}`;
  return '—';
}

function PadButton({
  children,
  onClick,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex h-12 w-12 items-center justify-center rounded-lg border transition-transform active:scale-95"
      style={{
        borderColor: danger ? '#ef444455' : 'var(--border-color)',
        color: danger ? '#ef4444' : 'var(--text-primary)',
        background: 'var(--bg-surface)',
      }}
    >
      {children}
    </button>
  );
}

function Metric({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div
      className="rounded-xl border p-3"
      style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
    >
      <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
        {label}
      </p>
      <p className="mt-0.5 font-mono text-base font-bold" style={{ color: accent }}>
        {value}
      </p>
    </div>
  );
}

function EmptyPanel({
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
      className="rounded-xl border px-6 py-14 text-center"
      style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
    >
      <div className="mx-auto mb-3 w-fit" style={{ color: 'var(--text-muted)' }}>
        {icon}
      </div>
      <h4 className="mb-1.5 font-semibold" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h4>
      <p className="mx-auto max-w-md text-sm" style={{ color: 'var(--text-secondary)' }}>
        {body}
      </p>
    </div>
  );
}

/**
 * Shown once, right after registration. The secret is bcrypt-hashed
 * server-side and genuinely unrecoverable, so this panel is loud about
 * it rather than letting someone close the tab and find out later.
 */
function CredentialsCard({
  creds,
  projectSlug,
  onClose,
}: {
  creds: MakerDeviceCredentials;
  projectSlug: string;
  onClose: () => void;
}) {
  const wsUrl =
    typeof window !== 'undefined'
      ? `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/device-ws?key=${creds.deviceKey}&secret=${creds.secret}`
      : '';

  const snippet = `// firmware/${projectSlug}/src/secrets.h
#define DEVICE_KEY    "${creds.deviceKey}"
#define DEVICE_SECRET "${creds.secret}"
#define WS_HOST       "${typeof window !== 'undefined' ? window.location.host : 'cuongthai.com'}"
#define WS_PATH       "/device-ws"`;

  return (
    <div
      className="mt-4 rounded-xl border p-4"
      style={{ borderColor: '#f59e0b', background: 'rgba(245,158,11,0.06)' }}
    >
      <p className="mb-3 text-sm font-semibold" style={{ color: '#f59e0b' }}>
        Lưu ngay — secret này sẽ KHÔNG hiện lại lần nữa
      </p>

      <CopyRow label="Device key" value={creds.deviceKey} />
      <CopyRow label="Secret" value={creds.secret} />
      <CopyRow label="URL WebSocket" value={wsUrl} mono />

      <details className="mt-3">
        <summary className="cursor-pointer text-xs font-medium" style={{ color: 'var(--accent-color)' }}>
          Dán vào firmware
        </summary>
        <pre
          className="mt-2 overflow-x-auto rounded-lg p-3 text-[11px] leading-relaxed"
          style={{ background: '#0b0d10', color: '#a5f3fc' }}
        >
          {snippet}
        </pre>
      </details>

      <button
        onClick={onClose}
        className="mt-3 text-xs font-medium"
        style={{ color: 'var(--text-muted)' }}
      >
        Tôi đã lưu rồi, đóng đi
      </button>
    </div>
  );
}

function CopyRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <span className="w-28 shrink-0 text-xs" style={{ color: 'var(--text-muted)' }}>
        {label}
      </span>
      <code
        className={`min-w-0 flex-1 truncate rounded px-2 py-1 text-xs ${mono ? 'font-mono' : ''}`}
        style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
      >
        {value}
      </code>
      <button
        onClick={() => {
          void navigator.clipboard.writeText(value);
          toast.success('Đã sao chép');
        }}
        className="shrink-0 rounded p-1.5"
        style={{ color: 'var(--text-secondary)' }}
      >
        <Copy size={13} />
      </button>
    </div>
  );
}
