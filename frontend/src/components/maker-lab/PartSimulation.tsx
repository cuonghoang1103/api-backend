'use client';

/**
 * Maker Lab — mô phỏng tương tác cho từng linh kiện.
 *
 * Mấy nguyên lý này đọc bằng chữ thì trôi tuột: vì sao thiếu tụ lại
 * làm ESP32 reset, vì sao cầu H đảo chiều được mà không cần nguồn âm,
 * vì sao cảm biến siêu âm mù trước tấm rèm. Kéo một thanh trượt rồi
 * thấy nó xảy ra thì nhớ được.
 *
 * Tất cả đều là SVG + state React, không thư viện ngoài, không canvas
 * — nhẹ và tự theo light/dark.
 */

import { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

export function PartSimulation({ sim }: { sim?: string }) {
  if (!sim) return null;
  const Sim = SIMS[sim];
  if (!Sim) return null;
  return (
    <div
      className="rounded-xl border p-4"
      style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
    >
      <Sim />
    </div>
  );
}

// ─── Khung chung ───────────────────────────────────────────

function SimShell({
  title,
  hint,
  children,
  controls,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
  controls?: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h4>
      <p className="mb-3 text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        {hint}
      </p>
      <div className="overflow-x-auto">{children}</div>
      {controls && <div className="mt-3 space-y-2">{controls}</div>}
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  suffix = '',
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex items-center gap-3 text-xs">
      <span className="w-32 shrink-0" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1 flex-1 accent-cyan-500"
      />
      <span className="w-20 shrink-0 text-right font-mono" style={{ color: 'var(--text-primary)' }}>
        {value}
        {suffix}
      </span>
    </label>
  );
}

/** requestAnimationFrame với nút tạm dừng. */
function useTick(running: boolean, speed = 1) {
  const [t, setT] = useState(0);
  const raf = useRef<number>();
  useEffect(() => {
    if (!running) return;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setT((v) => v + dt * speed);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [running, speed]);
  return [t, setT] as const;
}

function PlayBar({
  running,
  setRunning,
  onReset,
}: {
  running: boolean;
  setRunning: (v: boolean) => void;
  onReset?: () => void;
}) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => setRunning(!running)}
        className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium"
        style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
      >
        {running ? <Pause size={12} /> : <Play size={12} />}
        {running ? 'Dừng' : 'Chạy'}
      </button>
      {onReset && (
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs"
          style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
        >
          <RotateCcw size={12} /> Đặt lại
        </button>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// 1. BROWNOUT — vì sao thiếu tụ là ESP32 reset
//    Đây là mô phỏng quan trọng nhất của cả trang.
// ══════════════════════════════════════════════════════════

function BrownoutSim() {
  const [capUf, setCapUf] = useState(0);
  const [running, setRunning] = useState(true);
  const [t] = useTick(running, 1);

  // Chu kỳ 3 giây: động cơ khởi động ở giây 1, chạy đều từ giây 1.4
  const phase = t % 3;
  const surging = phase > 1 && phase < 1.4;

  // Sụt áp phụ thuộc dòng đỉnh và lượng điện tích tụ có sẵn.
  // Đơn giản hoá nhưng giữ đúng quan hệ: tụ càng lớn, sụt càng ít.
  const baseV = 7.4;
  const surgeDrop = surging ? 3.2 / (1 + capUf / 420) : 0;
  const runDrop = phase >= 1.4 ? 0.35 : 0;
  const busV = baseV - surgeDrop - runDrop;

  // Ổn áp 3.3V trên bo cần đầu vào tối thiểu ~4.5V để giữ được ngõ ra.
  const brownout = busV < 4.5;

  const W = 560;
  const H = 190;
  const vToY = (v: number) => H - 20 - ((v - 3) / 5.4) * (H - 45);

  // Vẽ dạng sóng của cả một chu kỳ để thấy toàn cảnh
  const pts: string[] = [];
  for (let i = 0; i <= 120; i++) {
    const p = (i / 120) * 3;
    const s = p > 1 && p < 1.4;
    const v = baseV - (s ? 3.2 / (1 + capUf / 420) : 0) - (p >= 1.4 ? 0.35 : 0);
    pts.push(`${60 + (i / 120) * (W - 80)},${vToY(v)}`);
  }

  return (
    <SimShell
      title="Vì sao thiếu tụ là ESP32 khởi động lại"
      hint="Động cơ lúc khởi động rút dòng gấp 5–8 lần lúc chạy đều. Kéo thanh trượt tụ từ 0 lên và xem điện áp bus sụt bao nhiêu."
      controls={
        <>
          <Slider label="Tụ lọc" value={capUf} min={0} max={2200} step={100} suffix=" µF" onChange={setCapUf} />
          <PlayBar running={running} setRunning={setRunning} />
          <div
            className="rounded-lg px-3 py-2 text-xs font-medium"
            style={{
              background: brownout ? 'rgba(239,68,68,0.12)' : 'rgba(52,211,153,0.12)',
              color: brownout ? '#ef4444' : '#059669',
            }}
          >
            {brownout
              ? `⚠️ Bus tụt còn ${busV.toFixed(1)} V — dưới ngưỡng 4,5 V. ESP32 KHỞI ĐỘNG LẠI giữa câu đang nói.`
              : capUf === 0
                ? `Bus ${busV.toFixed(1)} V — đang ổn, nhưng chưa tới lúc động cơ khởi động.`
                : `✅ Bus giữ ở ${busV.toFixed(1)} V. Tụ ${capUf} µF hấp thụ được cú giật dòng.`}
          </div>
        </>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="block">
        {/* ngưỡng brownout */}
        <line x1="60" y1={vToY(4.5)} x2={W - 20} y2={vToY(4.5)} stroke="#ef4444" strokeWidth="1.4" strokeDasharray="5 3" />
        <text x="64" y={vToY(4.5) - 5} fontSize="9.5" fill="#ef4444">
          4,5 V — dưới mức này ESP32 reset
        </text>

        {/* trục */}
        <line x1="60" y1="14" x2="60" y2={H - 20} stroke="var(--text-muted)" strokeWidth="1" />
        <line x1="60" y1={H - 20} x2={W - 20} y2={H - 20} stroke="var(--text-muted)" strokeWidth="1" />
        {[4, 6, 8].map((v) => (
          <g key={v}>
            <text x="54" y={vToY(v) + 3} fontSize="9" textAnchor="end" fill="var(--text-muted)">
              {v}V
            </text>
            <line x1="57" y1={vToY(v)} x2="60" y2={vToY(v)} stroke="var(--text-muted)" />
          </g>
        ))}

        {/* vùng khởi động */}
        <rect x={60 + (1 / 3) * (W - 80)} y="14" width={(0.4 / 3) * (W - 80)} height={H - 34} fill="#fb923c" opacity="0.12" />
        <text x={60 + (1.2 / 3) * (W - 80)} y="26" fontSize="9" fill="#fb923c">
          động cơ khởi động
        </text>

        {/* dạng sóng */}
        <polyline points={pts.join(' ')} fill="none" stroke="#22d3ee" strokeWidth="2" />

        {/* con trỏ thời gian */}
        <line
          x1={60 + (phase / 3) * (W - 80)}
          y1="14"
          x2={60 + (phase / 3) * (W - 80)}
          y2={H - 20}
          stroke="var(--text-primary)"
          strokeWidth="1"
          opacity="0.4"
        />
        <circle cx={60 + (phase / 3) * (W - 80)} cy={vToY(busV)} r="4.5" fill={brownout ? '#ef4444' : '#22d3ee'} />
      </svg>
    </SimShell>
  );
}

// ══════════════════════════════════════════════════════════
// 2. CẦU H — đảo chiều động cơ mà không cần nguồn âm
// ══════════════════════════════════════════════════════════

function HBridgeSim() {
  const [mode, setMode] = useState<'fwd' | 'rev' | 'brake' | 'coast'>('fwd');

  const on = {
    fwd: { q1: true, q2: false, q3: false, q4: true },
    rev: { q1: false, q2: true, q3: true, q4: false },
    brake: { q1: false, q2: true, q3: false, q4: true },
    coast: { q1: false, q2: false, q3: false, q4: false },
  }[mode];

  const label = {
    fwd: 'IN1=PWM, IN2=0 → quay thuận',
    rev: 'IN1=0, IN2=PWM → quay ngược',
    brake: 'IN1=1, IN2=1 → phanh (nối tắt hai đầu cuộn dây)',
    coast: 'IN1=0, IN2=0 → thả trôi (động cơ quay theo quán tính)',
  }[mode];

  const W = 380;
  const H = 210;
  const flowColor = mode === 'fwd' ? '#34d399' : mode === 'rev' ? '#fb923c' : 'none';

  return (
    <SimShell
      title="Cầu H — bốn transistor đảo được chiều quay"
      hint="Bật cặp chéo này thì dòng chạy một chiều, bật cặp chéo kia thì chạy ngược. Không cần nguồn âm."
      controls={
        <>
          <div className="flex flex-wrap gap-1.5">
            {(['fwd', 'rev', 'brake', 'coast'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="rounded-lg border px-2.5 py-1.5 text-xs"
                style={{
                  borderColor: mode === m ? '#22d3ee' : 'var(--border-color)',
                  background: mode === m ? 'rgba(34,211,238,0.1)' : 'transparent',
                  color: mode === m ? '#0891b2' : 'var(--text-secondary)',
                }}
              >
                {{ fwd: 'Thuận', rev: 'Ngược', brake: 'Phanh', coast: 'Thả trôi' }[m]}
              </button>
            ))}
          </div>
          <p className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
            {label}
          </p>
        </>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="block">
        {/* thanh nguồn */}
        <line x1="40" y1="26" x2={W - 40} y2="26" stroke="#ef4444" strokeWidth="2.5" />
        <text x="26" y="30" fontSize="10" fill="#ef4444" textAnchor="end">
          V+
        </text>
        <line x1="40" y1={H - 24} x2={W - 40} y2={H - 24} stroke="var(--text-muted)" strokeWidth="2.5" />
        <text x="26" y={H - 20} fontSize="10" fill="var(--text-muted)" textAnchor="end">
          GND
        </text>

        {/* 4 transistor */}
        {[
          { id: 'q1', x: 110, y: 62, on: on.q1 },
          { id: 'q3', x: 270, y: 62, on: on.q3 },
          { id: 'q2', x: 110, y: 146, on: on.q2 },
          { id: 'q4', x: 270, y: 146, on: on.q4 },
        ].map((q) => (
          <g key={q.id}>
            <rect
              x={q.x - 22}
              y={q.y - 15}
              width="44"
              height="30"
              rx="4"
              fill={q.on ? '#34d399' : 'var(--bg-surface)'}
              fillOpacity={q.on ? 0.35 : 1}
              stroke={q.on ? '#34d399' : 'var(--border-color)'}
              strokeWidth="1.6"
            />
            <text
              x={q.x}
              y={q.y + 4}
              fontSize="11"
              textAnchor="middle"
              fontWeight="600"
              fill={q.on ? '#059669' : 'var(--text-muted)'}
            >
              {q.id.toUpperCase()}
            </text>
          </g>
        ))}

        {/* dây nối */}
        <path d="M110 26 L110 47 M270 26 L270 47" stroke="var(--text-muted)" strokeWidth="1.6" />
        <path d={`M110 ${H - 24} L110 161 M270 ${H - 24} L270 161`} stroke="var(--text-muted)" strokeWidth="1.6" />
        <path d="M110 77 L110 104 M270 77 L270 104" stroke="var(--text-muted)" strokeWidth="1.6" />
        <path d="M110 131 L110 104 M270 131 L270 104" stroke="var(--text-muted)" strokeWidth="1.6" />

        {/* động cơ ở thanh ngang */}
        <line x1="132" y1="104" x2="158" y2="104" stroke="var(--text-muted)" strokeWidth="1.6" />
        <line x1="222" y1="104" x2="248" y2="104" stroke="var(--text-muted)" strokeWidth="1.6" />
        <circle cx="190" cy="104" r="32" fill="var(--bg-surface)" stroke="var(--border-color)" strokeWidth="1.8" />
        <text x="190" y="100" fontSize="11" textAnchor="middle" fill="var(--text-primary)" fontWeight="600">
          M
        </text>
        <text x="190" y="114" fontSize="9" textAnchor="middle" fill="var(--text-muted)">
          {mode === 'brake' ? 'phanh' : mode === 'coast' ? 'trôi' : 'quay'}
        </text>

        {/* mũi tên dòng điện */}
        {flowColor !== 'none' && (
          <g stroke={flowColor} strokeWidth="2.5" fill="none">
            <path
              d={
                mode === 'fwd'
                  ? 'M110 30 L110 47 M110 77 L110 104 L158 104 M222 104 L270 104 L270 131 M270 161 L270 182'
                  : 'M270 30 L270 47 M270 77 L270 104 L222 104 M158 104 L110 104 L110 131 M110 161 L110 182'
              }
              strokeDasharray="6 4"
            >
              <animate attributeName="stroke-dashoffset" from="20" to="0" dur="0.6s" repeatCount="indefinite" />
            </path>
          </g>
        )}

        {/* mũi tên chiều quay */}
        {(mode === 'fwd' || mode === 'rev') && (
          <path
            d={mode === 'fwd' ? 'M190 78 A26 26 0 0 1 212 118' : 'M190 78 A26 26 0 0 0 168 118'}
            fill="none"
            stroke={flowColor}
            strokeWidth="2.5"
            markerEnd="url(#hb-arrow)"
          />
        )}
        <defs>
          <marker id="hb-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" fill={flowColor === 'none' ? 'var(--text-muted)' : flowColor} />
          </marker>
        </defs>
      </svg>
    </SimShell>
  );
}

// ══════════════════════════════════════════════════════════
// 3. ENCODER — vì sao đếm xung mới biết đi được bao xa
// ══════════════════════════════════════════════════════════

function EncoderSim() {
  const [running, setRunning] = useState(true);
  const [pwm, setPwm] = useState(180);
  const [t, setT] = useTick(running, 1);

  const TICKS_PER_REV = 374;
  const WHEEL_CIRC = 204; // mm
  const rps = (pwm / 255) * 3.4; // vòng/giây ở PWM tối đa
  const revs = t * rps;
  const ticks = Math.floor(revs * TICKS_PER_REV);
  const distanceMm = revs * WHEEL_CIRC;

  const angle = (revs % 1) * 360;
  const W = 400;
  const H = 150;

  return (
    <SimShell
      title="Encoder — cách robot biết mình đã đi bao xa"
      hint="Mỗi vòng bánh cho 374 xung. Đếm xung là ra quãng đường chính xác, không cần đoán bằng thời gian chạy động cơ."
      controls={
        <>
          <Slider label="Mức PWM" value={pwm} min={0} max={255} onChange={setPwm} />
          <PlayBar running={running} setRunning={setRunning} onReset={() => setT(0)} />
          <div className="grid grid-cols-3 gap-2 text-xs">
            <Stat label="Số xung" value={ticks.toLocaleString('vi-VN')} color="#22d3ee" />
            <Stat label="Số vòng" value={revs.toFixed(2)} color="#a78bfa" />
            <Stat label="Quãng đường" value={`${(distanceMm / 10).toFixed(1)} cm`} color="#34d399" />
          </div>
        </>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="block">
        {/* bánh xe quay */}
        <g transform={`translate(70, 75)`}>
          <circle r="46" fill="var(--bg-surface)" stroke="var(--border-color)" strokeWidth="2" />
          <g transform={`rotate(${angle})`}>
            {Array.from({ length: 8 }, (_, i) => (
              <line
                key={i}
                x1="0"
                y1="0"
                x2={40 * Math.cos((i * Math.PI) / 4)}
                y2={40 * Math.sin((i * Math.PI) / 4)}
                stroke={i === 0 ? '#22d3ee' : 'var(--text-muted)'}
                strokeWidth={i === 0 ? 3 : 1.4}
              />
            ))}
          </g>
          <circle r="7" fill="var(--text-muted)" />
        </g>

        {/* chuỗi xung */}
        <text x="140" y="42" fontSize="10" fill="var(--text-muted)">
          xung từ cảm biến Hall
        </text>
        <g stroke="#22d3ee" strokeWidth="2" fill="none">
          <path
            d={(() => {
              let d = 'M140 100';
              const step = 14;
              for (let i = 0; i < 17; i++) {
                const x = 140 + i * step;
                const phase = ((revs * TICKS_PER_REV) / 8 + i) % 2 < 1;
                d += ` L${x} ${phase ? 72 : 100} L${x + step / 2} ${phase ? 72 : 100} L${x + step / 2} ${phase ? 100 : 72}`;
              }
              return d;
            })()}
          />
        </g>
        <line x1="140" y1="112" x2={W - 20} y2="112" stroke="var(--text-muted)" strokeWidth="1" />
        <text x="140" y="128" fontSize="9" fill="var(--text-muted)">
          mỗi cạnh lên = 1 xung → firmware cộng 1
        </text>
      </svg>
    </SimShell>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-lg p-2" style={{ background: 'var(--bg-surface)' }}>
      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
        {label}
      </p>
      <p className="font-mono text-sm font-bold" style={{ color }}>
        {value}
      </p>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// 4. SERVO — góc truyền bằng độ rộng xung
// ══════════════════════════════════════════════════════════

function ServoSim() {
  const [deg, setDeg] = useState(90);
  const pulseMs = 1.0 + (deg / 180) * 1.0;
  const W = 440;
  const H = 170;
  const pxPerMs = 22;

  return (
    <SimShell
      title="Servo — góc được truyền bằng ĐỘ RỘNG xung"
      hint="Chu kỳ luôn 20 ms. Chỉ độ rộng phần xung cao có ý nghĩa: 1,0 ms = 0°, 2,0 ms = 180°."
      controls={
        <>
          <Slider label="Góc yêu cầu" value={deg} min={0} max={180} suffix="°" onChange={setDeg} />
          <p className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
            xung cao {pulseMs.toFixed(2)} ms · nấc PCA9685 ={' '}
            <span style={{ color: '#22d3ee' }}>{Math.round(205 + (deg / 180) * 205)}</span> / 4096
          </p>
        </>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="block">
        {/* cần servo */}
        <g transform="translate(62, 84)">
          <circle r="42" fill="var(--bg-surface)" stroke="var(--border-color)" strokeWidth="1.6" />
          <path d="M-42 0 A42 42 0 0 1 42 0" fill="none" stroke="var(--text-muted)" strokeWidth="1" strokeDasharray="3 3" />
          <g transform={`rotate(${deg - 180})`}>
            <rect x="0" y="-4" width="40" height="8" rx="3" fill="#22d3ee" />
            <circle cx="40" cy="0" r="4" fill="#0891b2" />
          </g>
          <circle r="6" fill="var(--text-muted)" />
          <text x="-42" y="18" fontSize="9" fill="var(--text-muted)">
            0°
          </text>
          <text x="34" y="18" fontSize="9" fill="var(--text-muted)">
            180°
          </text>
        </g>

        {/* dạng xung */}
        <text x="130" y="30" fontSize="10" fill="var(--text-muted)">
          tín hiệu tới servo — chu kỳ 20 ms
        </text>
        <line x1="130" y1="120" x2={W - 16} y2="120" stroke="var(--text-muted)" strokeWidth="1" />
        <path
          d={`M130 120 L130 66 L${130 + pulseMs * pxPerMs} 66 L${130 + pulseMs * pxPerMs} 120 L${130 + 20 * pxPerMs > W - 16 ? W - 16 : 130 + 20 * pxPerMs} 120`}
          fill="none"
          stroke="#22d3ee"
          strokeWidth="2.2"
        />
        {/* đo độ rộng */}
        <line x1="130" y1="56" x2={130 + pulseMs * pxPerMs} y2="56" stroke="#f0b429" strokeWidth="1.4" />
        <line x1="130" y1="52" x2="130" y2="60" stroke="#f0b429" strokeWidth="1.4" />
        <line x1={130 + pulseMs * pxPerMs} y1="52" x2={130 + pulseMs * pxPerMs} y2="60" stroke="#f0b429" strokeWidth="1.4" />
        <text x={130 + (pulseMs * pxPerMs) / 2} y="48" fontSize="10" textAnchor="middle" fill="#f0b429" fontWeight="600">
          {pulseMs.toFixed(2)} ms
        </text>
        <text x="134" y="136" fontSize="9" fill="var(--text-muted)">
          1,0 ms = 0° · 1,5 ms = 90° · 2,0 ms = 180°
        </text>
        <text x="134" y="150" fontSize="9" fill="var(--text-muted)">
          phần còn lại của 20 ms là im lặng
        </text>
      </svg>
    </SimShell>
  );
}

// ══════════════════════════════════════════════════════════
// 5. I2S — ba dây chở âm thanh số
// ══════════════════════════════════════════════════════════

function I2sSim() {
  const [running, setRunning] = useState(true);
  const [t] = useTick(running, 0.55);
  const W = 520;
  const H = 190;
  const bits = 16;
  const cellW = (W - 90) / bits;
  const pos = (t * 3) % (bits * 2);

  // Mẫu âm thanh giả để hiện bit
  const sample = Math.round(((Math.sin(t * 1.6) + 1) / 2) * 65535);
  const bitStr = sample.toString(2).padStart(16, '0');

  const rows = [
    { name: 'SCK', y: 52, desc: 'xung nhịp bit' },
    { name: 'WS', y: 100, desc: 'chọn kênh trái/phải' },
    { name: 'SD', y: 148, desc: 'dữ liệu 16 bit' },
  ];

  return (
    <SimShell
      title="I2S — ba dây chở tiếng nói dưới dạng số"
      hint="Micro số hoá ngay trong vỏ chip rồi đẩy từng bit ra. Nhiễu điện từ của động cơ và WiFi không kịp bám vào tín hiệu."
      controls={
        <>
          <PlayBar running={running} setRunning={setRunning} />
          <p className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
            mẫu hiện tại: {sample} → 0b{bitStr}
          </p>
        </>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="block">
        {rows.map((r) => (
          <g key={r.name}>
            <text x="8" y={r.y + 4} fontSize="10" fontWeight="600" fill="var(--text-primary)">
              {r.name}
            </text>
            <text x="8" y={r.y + 16} fontSize="8" fill="var(--text-muted)">
              {r.desc}
            </text>
            <line x1="80" y1={r.y + 14} x2={W - 10} y2={r.y + 14} stroke="var(--border-color)" strokeWidth="1" />
          </g>
        ))}

        {/* SCK: xung vuông đều */}
        <path
          d={(() => {
            let d = `M80 ${52 + 14}`;
            for (let i = 0; i < bits; i++) {
              const x = 80 + i * cellW;
              d += ` L${x} 52 L${x + cellW / 2} 52 L${x + cellW / 2} ${52 + 14} L${x + cellW} ${52 + 14}`;
            }
            return d;
          })()}
          fill="none"
          stroke="#a78bfa"
          strokeWidth="1.8"
        />

        {/* WS: đổi mức giữa chừng = đổi kênh */}
        <path
          d={`M80 ${100 + 14} L${80 + (W - 90) / 2} ${100 + 14} L${80 + (W - 90) / 2} 100 L${W - 10} 100`}
          fill="none"
          stroke="#34d399"
          strokeWidth="1.8"
        />
        <text x={80 + (W - 90) / 4} y="96" fontSize="8.5" textAnchor="middle" fill="#34d399">
          kênh trái
        </text>
        <text x={80 + ((W - 90) * 3) / 4} y="96" fontSize="8.5" textAnchor="middle" fill="#34d399">
          kênh phải
        </text>

        {/* SD: bit thật của mẫu */}
        <path
          d={(() => {
            let d = `M80 ${148 + 14}`;
            for (let i = 0; i < bits; i++) {
              const x = 80 + i * cellW;
              const hi = bitStr[i] === '1';
              d += ` L${x} ${hi ? 148 : 148 + 14} L${x + cellW} ${hi ? 148 : 148 + 14}`;
            }
            return d;
          })()}
          fill="none"
          stroke="#22d3ee"
          strokeWidth="1.8"
        />
        {bitStr.split('').map((b, i) => (
          <text
            key={i}
            x={80 + i * cellW + cellW / 2}
            y="178"
            fontSize="8"
            textAnchor="middle"
            fill={b === '1' ? '#22d3ee' : 'var(--text-muted)'}
            fontFamily="monospace"
          >
            {b}
          </text>
        ))}

        {/* con trỏ chạy */}
        <line
          x1={80 + (pos / (bits * 2)) * (W - 90)}
          y1="40"
          x2={80 + (pos / (bits * 2)) * (W - 90)}
          y2="168"
          stroke="var(--text-primary)"
          strokeWidth="1"
          opacity="0.35"
        />
      </svg>
    </SimShell>
  );
}

// ══════════════════════════════════════════════════════════
// 6. ToF vs SIÊU ÂM — vì sao HC-SR04 mù trước tấm rèm
// ══════════════════════════════════════════════════════════

function TofSim() {
  const [surface, setSurface] = useState<'wall' | 'curtain' | 'angled'>('wall');

  const result = {
    wall: { tof: 420, us: 425, tofOk: true, usOk: true, note: 'Tường phẳng — cả hai đều đo đúng.' },
    curtain: {
      tof: 380,
      us: 0,
      tofOk: true,
      usOk: false,
      note: 'Vải HÚT sóng âm gần hết. Siêu âm không nhận được tiếng vọng → báo "trống" → robot đâm thẳng vào rèm.',
    },
    angled: {
      tof: 510,
      us: 0,
      tofOk: true,
      usOk: false,
      note: 'Mặt nghiêng 40° dội sóng âm đi hướng khác, không quay lại cảm biến. Laser vẫn có phần tán xạ ngược nên đo được.',
    },
  }[surface];

  const W = 460;
  const H = 190;

  return (
    <SimShell
      title="Laser so với siêu âm — vì sao chọn VL53L0X"
      hint="Đổi loại bề mặt và xem cảm biến nào còn 'thấy' được nó."
      controls={
        <>
          <div className="flex flex-wrap gap-1.5">
            {(['wall', 'curtain', 'angled'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSurface(s)}
                className="rounded-lg border px-2.5 py-1.5 text-xs"
                style={{
                  borderColor: surface === s ? '#22d3ee' : 'var(--border-color)',
                  background: surface === s ? 'rgba(34,211,238,0.1)' : 'transparent',
                  color: surface === s ? '#0891b2' : 'var(--text-secondary)',
                }}
              >
                {{ wall: 'Tường phẳng', curtain: 'Rèm vải', angled: 'Mặt nghiêng' }[s]}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg p-2" style={{ background: 'rgba(52,211,153,0.1)' }}>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                VL53L0X (laser)
              </p>
              <p className="font-mono text-sm font-bold" style={{ color: '#059669' }}>
                {result.tof} mm ✓
              </p>
            </div>
            <div
              className="rounded-lg p-2"
              style={{ background: result.usOk ? 'rgba(52,211,153,0.1)' : 'rgba(239,68,68,0.1)' }}
            >
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                HC-SR04 (siêu âm)
              </p>
              <p className="font-mono text-sm font-bold" style={{ color: result.usOk ? '#059669' : '#ef4444' }}>
                {result.usOk ? `${result.us} mm ✓` : 'không thấy gì ✗'}
              </p>
            </div>
          </div>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {result.note}
          </p>
        </>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="block">
        {/* robot */}
        <rect x="16" y="70" width="52" height="50" rx="6" fill="#f0b429" fillOpacity="0.25" stroke="#f0b429" strokeWidth="1.6" />
        <text x="42" y="100" fontSize="9" textAnchor="middle" fill="#f0b429">
          robot
        </text>

        {/* bề mặt */}
        {surface === 'wall' && <rect x="360" y="30" width="14" height="130" fill="var(--text-muted)" opacity="0.5" />}
        {surface === 'curtain' && (
          <g>
            {Array.from({ length: 7 }, (_, i) => (
              <path
                key={i}
                d={`M${356 + i * 3} 30 Q${362 + i * 3} 95 ${356 + i * 3} 160`}
                fill="none"
                stroke="#a78bfa"
                strokeWidth="3"
                opacity="0.5"
              />
            ))}
          </g>
        )}
        {surface === 'angled' && (
          <line x1="340" y1="30" x2="400" y2="160" stroke="var(--text-muted)" strokeWidth="9" opacity="0.5" />
        )}

        {/* tia laser: luôn về được */}
        <g stroke="#ef4444" strokeWidth="1.8">
          <line x1="70" y1="86" x2="352" y2="86" strokeDasharray="7 4">
            <animate attributeName="stroke-dashoffset" from="22" to="0" dur="0.5s" repeatCount="indefinite" />
          </line>
          <line x1="352" y1="94" x2="70" y2="94" strokeDasharray="7 4" opacity="0.65">
            <animate attributeName="stroke-dashoffset" from="0" to="22" dur="0.5s" repeatCount="indefinite" />
          </line>
        </g>
        <text x="200" y="80" fontSize="9" fill="#ef4444">
          laser đi và về → đo được
        </text>

        {/* sóng âm */}
        <g>
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M${86 + i * 22} 122 Q${96 + i * 22} 134 ${86 + i * 22} 146`}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="1.8"
              opacity={0.85 - i * 0.2}
            />
          ))}
          {result.usOk ? (
            <>
              <line x1="150" y1="134" x2="352" y2="134" stroke="#38bdf8" strokeWidth="1.4" strokeDasharray="5 3" />
              <text x="230" y="152" fontSize="9" fill="#38bdf8">
                sóng âm dội lại → đo được
              </text>
            </>
          ) : (
            <>
              <line x1="150" y1="134" x2="340" y2="134" stroke="#38bdf8" strokeWidth="1.4" strokeDasharray="5 3" opacity="0.4" />
              {surface === 'angled' && (
                <line x1="340" y1="134" x2="420" y2="60" stroke="#38bdf8" strokeWidth="1.4" strokeDasharray="5 3" opacity="0.5" />
              )}
              <text x="215" y="166" fontSize="9" fill="#ef4444">
                {surface === 'curtain' ? 'vải hút hết — không có tiếng vọng' : 'dội đi hướng khác — không quay lại'}
              </text>
            </>
          )}
        </g>
      </svg>
    </SimShell>
  );
}

// ══════════════════════════════════════════════════════════
// 7. SPI — hai màn hình dùng chung ba dây
// ══════════════════════════════════════════════════════════

function SpiSim() {
  const [active, setActive] = useState<'left' | 'right' | 'none'>('left');
  const W = 420;
  const H = 180;

  return (
    <SimShell
      title="SPI — hai mắt dùng chung ba dây, khác nhau ở chân CS"
      hint="Chân CS quyết định màn nào đang nghe. Kéo CS của màn nào xuống thấp thì màn đó nhận dữ liệu, màn kia lờ đi."
      controls={
        <div className="flex flex-wrap gap-1.5">
          {(['left', 'right', 'none'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setActive(s)}
              className="rounded-lg border px-2.5 py-1.5 text-xs"
              style={{
                borderColor: active === s ? '#22d3ee' : 'var(--border-color)',
                background: active === s ? 'rgba(34,211,238,0.1)' : 'transparent',
                color: active === s ? '#0891b2' : 'var(--text-secondary)',
              }}
            >
              {{ left: 'Chọn mắt trái', right: 'Chọn mắt phải', none: 'Không chọn' }[s]}
            </button>
          ))}
        </div>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="block">
        {/* ESP32 */}
        <rect x="12" y="56" width="72" height="70" rx="6" fill="var(--bg-surface)" stroke="var(--border-color)" strokeWidth="1.6" />
        <text x="48" y="88" fontSize="10" textAnchor="middle" fill="var(--text-primary)" fontWeight="600">
          ESP32
        </text>
        <text x="48" y="102" fontSize="8" textAnchor="middle" fill="var(--text-muted)">
          -S3
        </text>

        {/* bus chung */}
        {[
          { y: 40, name: 'SCLK · MOSI · DC (dùng chung)' },
        ].map((b) => (
          <g key={b.name}>
            <path d={`M84 76 L120 76 L120 ${b.y} L${W - 30} ${b.y}`} fill="none" stroke="#a78bfa" strokeWidth="2" />
            <text x="128" y={b.y - 6} fontSize="9" fill="#a78bfa">
              {b.name}
            </text>
          </g>
        ))}

        {/* hai màn hình */}
        {[
          { id: 'left', cx: 250, label: 'mắt trái', cs: 'GPIO10' },
          { id: 'right', cx: 350, label: 'mắt phải', cs: 'GPIO9' },
        ].map((eye) => {
          const on = active === eye.id;
          return (
            <g key={eye.id}>
              <line x1={eye.cx} y1="40" x2={eye.cx} y2="88" stroke="#a78bfa" strokeWidth="1.6" />
              <circle
                cx={eye.cx}
                cy="118"
                r="30"
                fill={on ? '#0f172a' : 'var(--bg-surface)'}
                stroke={on ? '#22d3ee' : 'var(--border-color)'}
                strokeWidth="2"
              />
              {on && (
                <>
                  <circle cx={eye.cx} cy="118" r="18" fill="#1e88e5" />
                  <circle cx={eye.cx} cy="118" r="9" fill="#05070a" />
                  <circle cx={eye.cx - 5} cy="113" r="4" fill="#fff" opacity="0.8" />
                </>
              )}
              <text x={eye.cx} y="164" fontSize="9" textAnchor="middle" fill="var(--text-muted)">
                {eye.label}
              </text>
              {/* dây CS */}
              <path
                d={`M84 100 L${eye.cx - 34} 100 L${eye.cx - 34} 118`}
                fill="none"
                stroke={on ? '#34d399' : 'var(--text-muted)'}
                strokeWidth={on ? 2.2 : 1.2}
                opacity={on ? 1 : 0.4}
              />
              <text
                x={eye.cx - 34}
                y="94"
                fontSize="8"
                textAnchor="middle"
                fill={on ? '#059669' : 'var(--text-muted)'}
                fontFamily="monospace"
              >
                {eye.cs} {on ? 'LOW' : 'HIGH'}
              </text>
            </g>
          );
        })}

        <text x="12" y={H - 6} fontSize="9" fill="var(--text-muted)">
          {active === 'none'
            ? 'Cả hai CS ở mức cao → không màn nào nhận dữ liệu'
            : `CS kéo xuống thấp → chỉ ${active === 'left' ? 'mắt trái' : 'mắt phải'} nhận dữ liệu`}
        </text>
      </svg>
    </SimShell>
  );
}

// ══════════════════════════════════════════════════════════
// 8. PIN — đường xả và vì sao phần trăm pin khó đoán
// ══════════════════════════════════════════════════════════

function BatterySim() {
  const [pct, setPct] = useState(70);

  // Đường xả thật của lithium: phẳng ở giữa, dốc ở hai đầu
  const cellV = 3.0 + 1.2 * (0.15 + 0.85 * Math.pow(pct / 100, 0.42));
  const busV = cellV * 2;
  const adcV = busV / 3.128; // qua chia áp 100k/47k
  const adcRaw = Math.round((adcV / 3.3) * 4095);

  const W = 460;
  const H = 170;
  const curve: string[] = [];
  for (let i = 0; i <= 100; i++) {
    const v = 3.0 + 1.2 * (0.15 + 0.85 * Math.pow(i / 100, 0.42));
    curve.push(`${40 + (i / 100) * (W - 70)},${H - 30 - ((v - 3) / 1.3) * (H - 60)}`);
  }

  return (
    <SimShell
      title="Pin lithium — vì sao phần trăm pin khó đoán"
      hint="Điện áp gần như phẳng suốt phần giữa dải xả. Đo áp mà đoán phần trăm thì sai ở khoảng giữa, chính xác ở hai đầu."
      controls={
        <>
          <Slider label="Dung lượng còn" value={pct} min={0} max={100} suffix="%" onChange={setPct} />
          <div className="grid grid-cols-3 gap-2">
            <Stat label="Mỗi viên" value={`${cellV.toFixed(2)} V`} color="#22d3ee" />
            <Stat label="Bus 2S" value={`${busV.toFixed(2)} V`} color="#a78bfa" />
            <Stat label="ADC đọc được" value={String(adcRaw)} color="#34d399" />
          </div>
          {busV < 6.2 && (
            <p className="text-xs font-medium" style={{ color: '#ef4444' }}>
              ⚠️ Dưới 6,2 V — BMS sắp cắt để bảo vệ pin. Firmware nên cảnh báo từ mức này.
            </p>
          )}
        </>
      }
    >
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="block">
        <line x1="40" y1="14" x2="40" y2={H - 30} stroke="var(--text-muted)" strokeWidth="1" />
        <line x1="40" y1={H - 30} x2={W - 20} y2={H - 30} stroke="var(--text-muted)" strokeWidth="1" />
        {[3.0, 3.6, 4.2].map((v) => (
          <g key={v}>
            <text x="34" y={H - 30 - ((v - 3) / 1.3) * (H - 60) + 3} fontSize="9" textAnchor="end" fill="var(--text-muted)">
              {v}
            </text>
            <line
              x1="40"
              y1={H - 30 - ((v - 3) / 1.3) * (H - 60)}
              x2={W - 20}
              y2={H - 30 - ((v - 3) / 1.3) * (H - 60)}
              stroke="var(--border-light)"
              strokeDasharray="3 3"
            />
          </g>
        ))}

        {/* vùng phẳng khó đoán */}
        <rect x={40 + 0.25 * (W - 70)} y="14" width={0.55 * (W - 70)} height={H - 44} fill="#fbbf24" opacity="0.1" />
        <text x={40 + 0.52 * (W - 70)} y="28" fontSize="9" textAnchor="middle" fill="#d97706">
          vùng phẳng — đo áp khó đoán phần trăm
        </text>

        <polyline points={curve.join(' ')} fill="none" stroke="#22d3ee" strokeWidth="2.2" />
        <circle
          cx={40 + (pct / 100) * (W - 70)}
          cy={H - 30 - ((cellV - 3) / 1.3) * (H - 60)}
          r="5"
          fill="#22d3ee"
        />
        <text x={W - 20} y={H - 14} fontSize="9" textAnchor="end" fill="var(--text-muted)">
          dung lượng còn lại →
        </text>
      </svg>
    </SimShell>
  );
}

// ─── Bảng tra ──────────────────────────────────────────────

const SIMS: Record<string, () => JSX.Element> = {
  brownout: BrownoutSim,
  hbridge: HBridgeSim,
  encoder: EncoderSim,
  servo: ServoSim,
  i2s: I2sSim,
  tof: TofSim,
  spi: SpiSim,
  battery: BatterySim,
};

export const AVAILABLE_SIMS = Object.keys(SIMS);
