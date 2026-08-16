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
  DownloadCloud,
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
  updatePersona,
} from '@/lib/maker-lab-api';
import { listVoices } from '@/lib/voice-mini-api';
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

/**
 * Arm poses worth a one-click button. Elbow is always ≤ 0 — it only
 * folds one way, and a positive value would drive the forearm into the
 * upper arm and stall the servo. The same clamp exists server-side in
 * commands.ts; this is just so the buttons never generate one.
 */
const ARM_POSES: Array<{ label: string; hint: string; payload: Record<string, unknown> }> = [
  { label: '👋 Chào', hint: 'Giơ tay phải lên, khuỷu gập', payload: { side: 'right', shoulder: 70, elbow: -80 } },
  { label: '👉 Chỉ', hint: 'Duỗi thẳng tay phải ra trước', payload: { side: 'right', shoulder: 45, elbow: 0 } },
  { label: '🤗 Mời', hint: 'Dang cả hai tay ra', payload: { side: 'both', shoulder: 60, elbow: -30 } },
  { label: '🙅 Khoanh', hint: 'Gập cả hai khuỷu vào trước ngực', payload: { side: 'both', shoulder: 15, elbow: -110 } },
  { label: '⬇️ Hạ', hint: 'Về tư thế nghỉ, tay duỗi xuống', payload: { side: 'both', shoulder: 0, elbow: 0 } },
];

/**
 * Đổi cường độ sóng WiFi (dBm) sang chữ người đọc hiểu.
 *
 * Thang quen dùng của WiFi: trên -50 là rất mạnh, dưới -80 thì gần như
 * không dùng được. Số âm càng lớn càng yếu — điều này ngược trực giác
 * với hầu hết mọi người, nên đừng bắt họ tự suy.
 */
function sucSong(dbm: unknown): string {
  if (typeof dbm !== 'number') return '—';
  if (dbm > -50) return 'rất mạnh';
  if (dbm > -60) return 'mạnh';
  if (dbm > -70) return 'khá';
  if (dbm > -80) return 'yếu';
  return 'rất yếu';
}

/** Nhãn hiển thị — để một chỗ, khỏi rải chuỗi ba ngôi khắp file. */
const CHE_DO_NHAN: Record<string, string> = {
  vi: '🇻🇳 Tiếng Việt',
  en: '🇬🇧 English',
  robot: '🤖 Robot',
};

const NAO_NHAN: Record<string, string> = {
  auto: 'não tự động',
  'may-nha': 'não ở nhà',
  cong: 'não trên mạng',
};

/**
 * Giọng mặc định của từng chế độ khi người dùng chưa chọn riêng.
 *
 * Phải KHỚP với `CHE_DO` bên server (`src/services/makerlab/cheDo.ts`).
 * Ở đây chỉ để hiện chữ "mặc định: …" cho người dùng biết cái gì sẽ chạy
 * nếu họ không chọn gì — server vẫn là nơi quyết định thật.
 */
const GIONG_MAC_DINH: Record<string, string> = {
  vi: 'giọng trong tab Tính cách',
  en: 'en-cham',
  robot: 'robot-walle',
};

export function DeviceConsole({
  projectId,
  projectSlug,
  isAuthed,
  speechRate: speechRate0 = 1,
  cheDo: cheDo0 = 'vi',
  amLuong: amLuong0 = 50,
  giongTheoCheDo: giong0 = {},
  nao: nao0 = null,
}: {
  projectId: number;
  projectSlug: string;
  isAuthed: boolean;
  /** Chế độ tiếng đang lưu trong persona. */
  cheDo?: string;
  /** Âm lượng đang lưu trong persona. */
  amLuong?: number;
  /** Giọng riêng từng chế độ đang lưu: `{ vi, en, robot }`. */
  giongTheoCheDo?: Record<string, string>;
  /** Não ghim: `'may-nha'` | `'cong'` | `null` = tự động. */
  nao?: string | null;
  /** Tốc độ đọc đang lưu trong persona, để thanh trượt khởi động đúng chỗ. */
  speechRate?: number;
}) {
  const [rate, setRate] = useState(speechRate0);
  const [savingRate, setSavingRate] = useState(false);

  // ── Chế độ tiếng ──
  const [cheDo, setCheDo] = useState(cheDo0);
  const [savingCheDo, setSavingCheDo] = useState(false);

  // ── Âm lượng ──
  const [amLuong, setAmLuong] = useState(amLuong0);

  /**
   * Giọng RIÊNG cho từng chế độ + danh sách giọng có thật trên máy đọc.
   *
   * ⚠️ Danh sách phải NẠP TỪ MÁY CHỦ. Giọng nhân bản do người dùng tự
   * đặt tên lúc tải mẫu lên, nên mã nguồn không thể biết trước — viết
   * cứng là nhân bản xong mở ô chọn không thấy đâu.
   */
  const [giongCheDo, setGiongCheDo] = useState<Record<string, string>>(giong0);
  const [dsGiong, setDsGiong] = useState<Array<{ id: string; label: string; lang?: string }>>([]);
  useEffect(() => {
    listVoices()
      .then((v) => setDsGiong(v as Array<{ id: string; label: string; lang?: string }>))
      .catch(() => setDsGiong([]));
  }, []);

  // ── Não (model) ──
  const [nao, setNao] = useState<string>(nao0 ?? 'auto');

  /**
   * Lưu MỘT lượt: tốc độ đọc, chế độ tiếng, âm lượng.
   *
   * Vì sao có nút Lưu riêng thay vì tự lưu từng thứ: người dùng muốn
   * chỉnh vài thứ rồi mới chốt, và muốn biết chắc cái gì đã được ghi
   * xuống. Tự lưu từng bước kéo thanh trượt vừa bắn nhiều lệnh chồng
   * nhau, vừa không cho người ta cơ hội đổi ý.
   *
   * Âm lượng lưu vào persona VÀ gửi thẳng xuống bo: persona để tắt web
   * mở lại vẫn nhớ, lệnh xuống bo để nghe thấy tác dụng ngay.
   */
  const [dangLuu, setDangLuu] = useState(false);
  const luuTatCa = useCallback(async () => {
    setDangLuu(true);
    try {
      await updatePersona(projectId, {
        speechRate: rate,
        cheDo,
        amLuong,
        giongTheoCheDo: giongCheDo,
        nao: nao === 'auto' ? null : nao,
      });
      if (activeIdRef.current) {
        try {
          // `level`, KHÔNG phải `percent`: firmware đọc
          // `payload["level"] | 100` nên tên sai = âm lượng nhảy về hết
          // cỡ mà không báo gì. Nguồn sự thật là schema Zod `volume`
          // trong `src/services/makerlab/commands.ts`.
          await sendCommand(activeIdRef.current, 'volume', { level: amLuong });
        } catch {
          /* bo có thể đang tắt — cài đặt vẫn lưu, áp dụng ở lần bật sau */
        }
      }
      toast.success(
        `Đã lưu · ${CHE_DO_NHAN[cheDo] ?? cheDo} · giọng ${giongCheDo[cheDo] || 'mặc định'} · ` +
          `tốc độ ${rate.toFixed(2)}× · âm lượng ${amLuong}% · ${NAO_NHAN[nao] ?? nao}`,
      );
    } catch {
      toast.error('Không lưu được');
    } finally {
      setDangLuu(false);
    }
  }, [projectId, rate, cheDo, amLuong, giongCheDo, nao]);

  /**
   * Đổi chế độ tiếng. Đổi CẢ BA tầng ở phía server (tai nghe, đầu nghĩ,
   * miệng nói) — ở đây chỉ gửi một chữ.
   */
  const doiCheDo = useCallback(
    async (moi: string) => {
      if (moi === cheDo || savingCheDo) return;
      setSavingCheDo(true);
      const cu = cheDo;
      setCheDo(moi);
      try {
        await updatePersona(projectId, { cheDo: moi });
        toast.success(
          moi === 'vi' ? 'Robot nói tiếng Việt' : moi === 'en' ? 'Robot speaks English' : 'Giọng robot',
        );
      } catch {
        setCheDo(cu); // trả lại trạng thái cũ, đừng để nút nói dối
        toast.error('Không đổi được chế độ tiếng');
      } finally {
        setSavingCheDo(false);
      }
    },
    [cheDo, projectId, savingCheDo],
  );

  /**
   * Chỉ lưu khi NHẢ chuột, không lưu theo từng bước kéo.
   *
   * Kéo một lần từ 1,0 sang 1,5 là ~10 bước; lưu theo `onChange` sẽ bắn
   * mười lệnh PUT chồng lên nhau và lệnh về sau cùng chưa chắc là lệnh
   * có giá trị mới nhất.
   */
  const saveRate = useCallback(async () => {
    setSavingRate(true);
    try {
      await updatePersona(projectId, { speechRate: rate });
      toast.success(`Tốc độ đọc ${rate.toFixed(2)}×`);
    } catch {
      toast.error('Không lưu được tốc độ đọc');
    } finally {
      setSavingRate(false);
    }
  }, [projectId, rate]);

  const [devices, setDevices] = useState<MakerDevice[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [creds, setCreds] = useState<MakerDeviceCredentials | null>(null);

  const [logs, setLogs] = useState<MakerLogEvent[]>([]);
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPass, setWifiPass] = useState('');
  const [telemetry, setTelemetry] = useState<Record<string, number | string | boolean>>({});
  const [chat, setChat] = useState<MakerTranscriptEvent[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [thinking, setThinking] = useState(false);

  const logEndRef = useRef<HTMLDivElement>(null);
  // `luuTatCa` khai báo TRƯỚC `activeId` nên không đọc trực tiếp được.
  // Dùng ref thay vì đảo thứ tự: đảo thì phải kéo theo cả cụm state của
  // thiết bị lên trên, và cụm đó vốn thuộc về phần dưới.
  const activeIdRef = useRef<number | null>(null);
  const active = devices.find((d) => d.id === activeId) ?? null;
  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

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

  /**
   * Tự cuộn xuống tin mới nhất.
   *
   * ⚠️ KHÔNG CÓ CÁI NÀY THÌ TIN NHẮN TRÔNG NHƯ BỊ TRỄ.
   *
   * Tin của người dùng và của robot đều tới NGAY qua socket — máy chủ
   * phát bản chép lời ngay sau khi nghe xong, trước cả lúc model nghĩ.
   * Nhưng nếu khung không cuộn thì chúng rơi xuống dưới vùng nhìn thấy,
   * và người dùng kết luận "sao nó chậm thế". Đúng dữ liệu, sai chỗ
   * nhìn.
   *
   * Cuộn cả khi `thinking` đổi, để dòng "đang nghĩ…" cũng hiện ra.
   */
  const khungChat = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = khungChat.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [chat, thinking]);

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
            {/* Hiện TÊN MẠNG + sức sóng bằng chữ, không phải con số dBm
                trần. "-42 dBm" không nói được gì với người không làm
                mạng; "rất mạnh" thì ai cũng hiểu ngay. Số dBm vẫn giữ
                trong tooltip cho ai cần. */}
            <Metric
              label="WiFi"
              value={
                typeof telemetry.ssid === 'string' && telemetry.ssid
                  ? `${telemetry.ssid} · ${sucSong(telemetry.rssi ?? active.rssi)}`
                  : sucSong(telemetry.rssi ?? active.rssi)
              }
              accent="#38bdf8"
            />
            <Metric
              label="Tới server"
              value={typeof telemetry.pingMs === 'number' ? `${telemetry.pingMs} ms` : '—'}
              accent="#22d3ee"
            />
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

              <div className="mt-4">
                <p className="mb-2 text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                  Tay (vai + khuỷu)
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {ARM_POSES.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => cmd('arm', p.payload)}
                      title={p.hint}
                      className="rounded-lg border px-2.5 py-1.5 text-xs transition-colors"
                      style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Tốc độ đọc ──
                  Lưu vào persona chứ không gửi xuống bo: giọng được
                  tổng hợp trên server, bo chỉ phát ra thứ nó nhận
                  được. Gửi lệnh xuống bo thì không có gì bên đó chỉnh
                  được cả. */}
              <div className="mt-4">
                <label
                  className="mb-1.5 block text-sm font-medium"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Chế độ tiếng
                </label>
                <div className="flex gap-1.5">
                  {[
                    { id: 'vi', nhan: '🇻🇳 Tiếng Việt' },
                    { id: 'en', nhan: '🇬🇧 English' },
                    { id: 'robot', nhan: '🤖 Robot' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => void doiCheDo(c.id)}
                      disabled={savingCheDo}
                      className="flex-1 rounded-lg border px-2 py-2 text-xs font-medium transition disabled:opacity-50"
                      style={{
                        borderColor:
                          cheDo === c.id ? 'var(--accent, #6366f1)' : 'var(--border-color)',
                        background:
                          cheDo === c.id
                            ? 'color-mix(in srgb, var(--accent, #6366f1) 14%, transparent)'
                            : 'var(--bg-secondary)',
                        color: cheDo === c.id ? 'var(--accent, #6366f1)' : 'var(--text-secondary)',
                      }}
                    >
                      {c.nhan}
                    </button>
                  ))}
                </div>
                <p className="mt-1.5 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  Đổi được cả bằng giọng nói: &ldquo;nói tiếng Anh đi&rdquo;, &ldquo;nói giọng
                  robot&rdquo;, &ldquo;nói tiếng Việt&rdquo;. Robot đáp lại ngay bằng thứ tiếng mới
                  để bạn biết lệnh đã ăn.
                </p>

                {/* ── Giọng RIÊNG cho chế độ đang chọn ──
                    Một ô giọng chung cho ba chế độ là sai từ ý tưởng:
                    đổi qua tiếng Anh rồi quay về tiếng Việt là mất giọng
                    đã lưu, và người nghe tưởng "robot tự đổi giọng". */}
                <div className="mt-3">
                  <label
                    className="mb-1.5 block text-xs font-medium"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Giọng cho {CHE_DO_NHAN[cheDo] ?? cheDo}
                  </label>
                  <select
                    value={giongCheDo[cheDo] ?? ''}
                    onChange={(e) =>
                      setGiongCheDo((cu) => {
                        const moi = { ...cu };
                        if (e.target.value) moi[cheDo] = e.target.value;
                        else delete moi[cheDo];
                        return moi;
                      })
                    }
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    style={{
                      borderColor: 'var(--border-color)',
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <option value="">— Mặc định ({GIONG_MAC_DINH[cheDo]}) —</option>
                    {dsGiong
                      // Chế độ Việt chỉ hiện giọng Việt, Anh/Robot chỉ hiện
                      // giọng Anh. Trộn lẫn là mời người dùng chọn giọng
                      // Việt để đọc tiếng Anh — đúng lỗi "phi lê" đã chữa.
                      .filter((v) =>
                        cheDo === 'vi' ? (v.lang ?? 'vi') === 'vi' : v.lang === 'en',
                      )
                      .map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.label || v.id}
                        </option>
                      ))}
                  </select>
                  <p className="mt-1 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    Mỗi chế độ nhớ giọng riêng — đổi qua đổi lại không mất giọng của chế độ kia.
                  </p>
                </div>
              </div>

              {/* ── Não (model) ── */}
              <div className="mt-4">
                <label
                  className="mb-1.5 block text-sm font-medium"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Não (model)
                </label>
                <div className="flex gap-1.5">
                  {[
                    { id: 'auto', nhan: '⚙️ Tự động' },
                    { id: 'may-nha', nhan: '🏠 Máy nhà' },
                    { id: 'cong', nhan: '☁️ Trên mạng' },
                  ].map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => setNao(n.id)}
                      className="flex-1 rounded-lg border px-2 py-2 text-xs font-medium transition"
                      style={{
                        borderColor:
                          nao === n.id ? 'var(--accent, #6366f1)' : 'var(--border-color)',
                        background:
                          nao === n.id
                            ? 'color-mix(in srgb, var(--accent, #6366f1) 14%, transparent)'
                            : 'var(--bg-secondary)',
                        color: nao === n.id ? 'var(--accent, #6366f1)' : 'var(--text-secondary)',
                      }}
                    >
                      {n.nhan}
                    </button>
                  ))}
                </div>
                <p className="mt-1.5 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  Máy nhà nhanh hơn nhiều nhưng tiếng Việt kém hơn chút. <b>Máy nhà chết thì
                  robot tự nhảy sang não trên mạng</b> — mất điện ở nhà cũng vẫn nói được, không
                  cần bạn làm gì. Đổi được cả bằng giọng nói: &ldquo;đổi về model cũ đi&rdquo;.
                </p>
              </div>

              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                    Tốc độ đọc
                  </p>
                  <span className="text-xs tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                    {rate.toFixed(2)}× {savingRate && '…'}
                  </span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={2}
                  step={0.05}
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  onMouseUp={() => void saveRate()}
                  onTouchEnd={() => void saveRate()}
                  onKeyUp={() => void saveRate()}
                  className="w-full"
                  style={{ accentColor: 'var(--accent, #6366f1)' }}
                />
                <div
                  className="mt-1 flex justify-between text-[10px]"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <span>chậm rãi</span>
                  <span>bình thường</span>
                  <span>nhanh</span>
                </div>
                <p className="mt-1.5 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  Dưới 1,0 là chậm lại, trên 1,0 là nhanh lên — cao độ giữ nguyên.
                  Có tác dụng với giọng nhân bản CuongMini và Google Cloud (WaveNet).
                  Riêng giọng miễn phí <code>translate_tts</code> không nhận tham số tốc độ.
                </p>
              </div>

              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    Âm lượng loa
                  </label>
                  <span className="text-xs font-semibold" style={{ color: 'var(--accent, #6366f1)' }}>
                    {amLuong}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAmLuong((v) => Math.max(10, v - 10))}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border text-sm font-bold"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                    aria-label="Giảm âm lượng"
                  >
                    −
                  </button>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    step={5}
                    value={amLuong}
                    onChange={(e) => setAmLuong(Number(e.target.value))}
                    className="w-full"
                    style={{ accentColor: 'var(--accent, #6366f1)' }}
                  />
                  <button
                    type="button"
                    onClick={() => setAmLuong((v) => Math.min(100, v + 10))}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border text-sm font-bold"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                    aria-label="Tăng âm lượng"
                  >
                    +
                  </button>
                </div>
                <p className="mt-1.5 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  Chỉnh bằng phần mềm vì mạch khuếch đại MAX98357A không có chân
                  chỉnh — bấm Lưu để áp dụng và nhớ luôn cho lần bật sau.
                </p>
              </div>

              <button
                type="button"
                onClick={() => void luuTatCa()}
                disabled={dangLuu}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-50"
                style={{ background: 'var(--accent, #6366f1)' }}
              >
                {dangLuu ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {dangLuu ? 'Đang lưu…' : 'Lưu cài đặt'}
              </button>
              <p className="mt-1.5 text-center text-[11px]" style={{ color: 'var(--text-muted)' }}>
                Lưu chế độ tiếng, tốc độ đọc và âm lượng vào robot. Tắt web mở lại
                vẫn giữ nguyên.
              </p>


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
                {/* Cập nhật firmware qua WiFi.
                    Hỏi lại trước khi gửi: bo sẽ câm, tải cả MB rồi tự
                    khởi động lại — bấm nhầm giữa lúc đang nói chuyện
                    thì mất mạch. */}
                <button
                  onClick={() => {
                    if (
                      confirm(
                        'Cập nhật firmware qua WiFi?\n\n' +
                          'Robot sẽ ngừng nói, tải bản mới rồi tự khởi động lại (khoảng 1 phút).\n' +
                          'Bản mới ghi vào khe trống nên hỏng giữa chừng vẫn quay về bản cũ được.',
                      )
                    )
                      cmd('ota');
                  }}
                  className="ml-auto flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                >
                  <DownloadCloud size={12} /> Cập nhật firmware
                </button>
                <button
                  onClick={() => cmd('reboot')}
                  className="flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs"
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

              {/* ⚠️ `flex-1` chứ KHÔNG phải chiều cao cố định.
                  Bản trước để `h-56` (224px) trong một `section` vốn giãn
                  theo cột bên cạnh — nên tin nhắn bị nhốt trong một dải
                  hẹp ở trên còn hai phần ba khung để trống, và tin mới
                  nhất bị cắt ngang giữa dòng.
                  `min-h-0` là bắt buộc: mặc định `min-height:auto` của
                  flex item không cho con co lại, và khi đó `overflow-y`
                  không bao giờ kích hoạt — hộp cứ dài ra đẩy ô nhập
                  xuống khỏi màn hình. */}
              <div
                ref={khungChat}
                className="mb-3 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1"
                style={{ minHeight: '18rem' }}
              >
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
          {/* ── Dạy robot một WiFi mới ──
              Đặt TRƯỚC nhật ký vì đây là việc người ta chủ động làm, còn
              nhật ký là thứ để đọc khi có chuyện. */}
          <section
            className="rounded-xl border p-4"
            style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
          >
            <h3
              className="flex items-center gap-2 text-sm font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              <Wifi size={14} /> Dạy robot một WiFi mới
            </h3>
            {/* Nút mở cổng đặt LÊN TRÊN ô nhập tay: đây là đường dùng
                được ở mọi tình huống, còn nhập tay chỉ dùng khi bạn biết
                trước tên mạng. Và tuyệt đối không nên bắt người dùng phải
                NÓI câu này cho robot nghe — đo thật 12/08: Whisper nghe
                "kết nối wifi mới" thành phụ đề YouTube. */}
            <button
              type="button"
              disabled={!active.connected}
              onClick={() => void cmd('wifi_portal')}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-40"
              style={{ background: 'var(--accent, #6366f1)' }}
            >
              <Wifi size={15} /> Mở cổng cài WiFi trên robot
            </button>
            <p className="mt-2 text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Robot sẽ phát ra WiFi{' '}
              <strong style={{ color: 'var(--text-secondary)' }}>Odin-Setup</strong> (mật khẩu{' '}
              <strong style={{ color: 'var(--text-secondary)' }}>12345678</strong>) và hiện hướng
              dẫn lên màn hình của nó. Nối điện thoại vào là trang cài đặt tự hiện lên — chọn mạng
              từ danh sách, gõ mật khẩu, robot thử ngay rồi báo đúng/sai. Cổng tự đóng sau 3 phút.
            </p>

            <p className="mt-4 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Hoặc thêm sẵn bằng tay, nếu bạn biết trước tên mạng:
            </p>
            <p className="mt-1.5 text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Thêm sẵn WiFi nơi bạn sắp mang robot tới — tới nơi bật lên là nó tự vào, khỏi cài
              đặt gì. Robot nhớ được 6 mạng.
              <br />
              Còn nếu tới nơi mà chưa thêm sẵn: robot sẽ tự phát ra WiFi{' '}
              <strong style={{ color: 'var(--text-secondary)' }}>Odin-Setup</strong> (mật khẩu{' '}
              <strong style={{ color: 'var(--text-secondary)' }}>12345678</strong>) — nối điện
              thoại vào là trang cài đặt tự hiện lên.
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
              <input
                value={wifiSsid}
                onChange={(e) => setWifiSsid(e.target.value)}
                placeholder="Tên WiFi"
                maxLength={32}
                className="rounded-lg border px-3 py-2 text-sm"
                style={{
                  borderColor: 'var(--border-color)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                }}
              />
              <input
                value={wifiPass}
                onChange={(e) => setWifiPass(e.target.value)}
                placeholder="Mật khẩu"
                type="password"
                maxLength={63}
                autoComplete="off"
                className="rounded-lg border px-3 py-2 text-sm"
                style={{
                  borderColor: 'var(--border-color)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                }}
              />
              <button
                type="button"
                disabled={!wifiSsid.trim() || !active.connected}
                onClick={() => {
                  void cmd('wifi_add', { ssid: wifiSsid.trim(), pass: wifiPass });
                  setWifiSsid('');
                  setWifiPass('');
                }}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-40"
                style={{ background: 'var(--accent, #6366f1)' }}
              >
                Dạy
              </button>
            </div>
            {!active.connected && (
              <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                Robot đang offline — phải nối được mạng thì mới dạy được mạng mới. Dùng cổng{' '}
                <strong style={{ color: 'var(--text-secondary)' }}>Odin-Setup</strong> ngay trên
                robot thay cho chỗ này.
              </p>
            )}
          </section>

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
