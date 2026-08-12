'use client';

/**
 * Quản lý hạ tầng — VPS và máy GPU ở nhà.
 *
 * ⚠️ NGUYÊN TẮC XUYÊN SUỐT: KHÔNG VẼ SỐ KHÔNG CÓ.
 *
 * VPS là máy ảo, không có cảm biến nhiệt nào (kiểm 12/08/2026: chỉ có
 * `cooling_device`, không có `thermal_zone`). Nên ô nhiệt độ của nó ghi
 * thẳng "không có cảm biến" thay vì vẽ một vòng tròn màu xanh cho cân
 * bố cục. Ô trống là thông tin đúng; con số bịa thì người ta sẽ tin, và
 * tin sai về nhiệt máy chủ là kiểu tin sai đắt tiền.
 *
 * Tương tự với điện: GPU có số ĐO THẬT, CPU thì không (nhân Linux khoá
 * bộ đếm RAPL), nên phần ước lượng được ghi rõ ngay cạnh con số.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Activity, Cpu, HardDrive, Home, RefreshCw, Server, Thermometer, Zap } from 'lucide-react';
import { api } from '@/lib/api';

type Muc = 'mat' | 'binh-thuong' | 'am' | 'nong' | 'nguy' | 'khong-co';

/** Ngưỡng theo TỪNG loại linh kiện — GPU 80 °C là thường, NVMe 80 °C là sắp hỏng. */
const NGUONG: Record<'cpu' | 'gpu' | 'dia', number[]> = {
  cpu: [45, 65, 80, 95],
  gpu: [50, 70, 83, 90],
  dia: [40, 55, 68, 75],
};

const MAU: Record<Muc, { mau: string; chu: string }> = {
  mat: { mau: '#22d3ee', chu: 'Mát' },
  'binh-thuong': { mau: '#34d399', chu: 'Bình thường' },
  am: { mau: '#fbbf24', chu: 'Hơi ấm' },
  nong: { mau: '#fb923c', chu: 'Nóng' },
  nguy: { mau: '#ef4444', chu: 'Không ổn' },
  'khong-co': { mau: '#64748b', chu: 'Không có cảm biến' },
};

function mucNhiet(doC: number | null | undefined, loai: 'cpu' | 'gpu' | 'dia'): Muc {
  if (doC == null) return 'khong-co';
  const b = NGUONG[loai];
  if (doC < b[0]) return 'mat';
  if (doC < b[1]) return 'binh-thuong';
  if (doC < b[2]) return 'am';
  if (doC < b[3]) return 'nong';
  return 'nguy';
}

function gb(byte: number | null | undefined): string {
  if (byte == null) return '—';
  return `${(byte / 1024 ** 3).toFixed(1)} GB`;
}

function thoiGian(giay: number | null | undefined): string {
  if (giay == null) return '—';
  const ng = Math.floor(giay / 86400);
  const gio = Math.floor((giay % 86400) / 3600);
  const ph = Math.floor((giay % 3600) / 60);
  if (ng > 0) return `${ng} ngày ${gio} giờ`;
  if (gio > 0) return `${gio} giờ ${ph} phút`;
  return `${ph} phút`;
}

/** Vòng tròn nhiệt độ. SVG thuần — không kéo thêm thư viện cho một hình tròn. */
function VongNhiet({
  doC,
  loai,
  nhan,
}: {
  doC: number | null | undefined;
  loai: 'cpu' | 'gpu' | 'dia';
  nhan: string;
}) {
  const m = mucNhiet(doC, loai);
  const { mau, chu } = MAU[m];
  // Quy về 0-100 theo ngưỡng NGUY của chính loại đó, để vòng đầy đúng lúc
  // đáng lo — không phải lúc chạm một con số tuỳ tiện như 100 °C.
  const toiHan = NGUONG[loai][3];
  const ty = doC == null ? 0 : Math.max(0, Math.min(1, doC / toiHan));
  const R = 34;
  const chuVi = 2 * Math.PI * R;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="88" height="88" viewBox="0 0 88 88" className="-rotate-90">
        <circle cx="44" cy="44" r={R} fill="none" stroke="var(--border-color)" strokeWidth="7" />
        {doC != null && (
          <circle
            cx="44"
            cy="44"
            r={R}
            fill="none"
            stroke={mau}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={chuVi}
            strokeDashoffset={chuVi * (1 - ty)}
            style={{ transition: 'stroke-dashoffset .6s ease, stroke .6s ease' }}
          />
        )}
        <text
          x="44"
          y="44"
          textAnchor="middle"
          dominantBaseline="central"
          className="rotate-90"
          style={{ transformOrigin: '44px 44px', fill: 'var(--text-primary)', fontSize: 17, fontWeight: 700 }}
        >
          {doC == null ? '—' : `${Math.round(doC)}°`}
        </text>
      </svg>
      <div className="text-center">
        <div className="text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>
          {nhan}
        </div>
        <div className="text-[10px]" style={{ color: mau }}>
          {chu}
        </div>
      </div>
    </div>
  );
}

/** Thanh ngang cho phần trăm dùng — CPU, RAM, đĩa, VRAM. */
function Thanh({
  nhan,
  dung,
  tong,
  phanTram,
  donVi = 'GB',
}: {
  nhan: string;
  dung?: number | null;
  tong?: number | null;
  phanTram?: number | null;
  donVi?: string;
}) {
  const pt =
    phanTram != null ? phanTram : dung != null && tong ? Math.round((dung / tong) * 100) : null;
  // Màu theo mức đầy: xanh → vàng → đỏ. Đầy đĩa là sự cố có thật trên VPS
  // này rồi (Postgres chết vì hết chỗ), nên nó đáng được cảnh báo bằng màu.
  const mau = pt == null ? '#64748b' : pt < 60 ? '#34d399' : pt < 85 ? '#fbbf24' : '#ef4444';

  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-xs">
        <span style={{ color: 'var(--text-secondary)' }}>{nhan}</span>
        <span style={{ color: 'var(--text-primary)' }}>
          {pt == null ? '—' : `${pt}%`}
          {dung != null && tong != null && (
            <span className="ml-1.5" style={{ color: 'var(--text-muted)' }}>
              {donVi === 'GB' ? `${gb(dung)} / ${gb(tong)}` : `${dung} / ${tong} ${donVi}`}
            </span>
          )}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full" style={{ background: 'var(--border-color)' }}>
        <div
          className="h-full rounded-full"
          style={{ width: `${pt ?? 0}%`, background: mau, transition: 'width .6s ease, background .6s ease' }}
        />
      </div>
    </div>
  );
}

interface May {
  ten: string | null;
  heDieuHanh: string | null;
  nhan: string | null;
  uptimeGiay: number | null;
  cpu: { ten: string | null; soNhan: number; phanTram: number | null; tai: number[] | null };
  ram: { tong: number | null; daDung: number | null; conDung: number | null };
  dia: { duong: string; tong: number | null; daDung: number | null; conTrong: number | null };
  nhiet: { cpu: number | null; cpuNguong: number | null; cpuToiHan: number | null; dia: number | null };
  gpu: Array<Record<string, number | string>>;
  dien?: Record<string, number | string | boolean>;
  dienThang?: Record<string, number | string>;
  lichSu?: Record<string, string>;
  dichVu?: Record<string, string>;
  online: boolean;
  loi?: string;
}

function TheMay({ m, icon: Icon }: { m: May; icon: typeof Server }) {
  const gpu = m.gpu?.[0] as Record<string, number | string> | undefined;

  return (
    <div
      className="rounded-2xl border p-5"
      style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className="grid h-10 w-10 place-items-center rounded-xl"
            style={{ background: 'color-mix(in srgb, var(--accent, #6366f1) 14%, transparent)' }}
          >
            <Icon className="h-5 w-5" style={{ color: 'var(--accent, #6366f1)' }} />
          </div>
          <div>
            <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              {m.ten ?? '—'}
            </div>
            <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              {m.heDieuHanh ?? '—'}
            </div>
          </div>
        </div>
        <span
          className="rounded-full px-2.5 py-1 text-[11px] font-medium"
          style={{
            background: m.online ? 'color-mix(in srgb, #34d399 18%, transparent)' : 'color-mix(in srgb, #ef4444 18%, transparent)',
            color: m.online ? '#34d399' : '#ef4444',
          }}
        >
          {m.online ? 'Đang chạy' : 'Không kết nối'}
        </span>
      </div>

      {!m.online && (
        <p className="rounded-lg p-3 text-xs" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
          {m.loi ?? 'Không lấy được số liệu.'}
        </p>
      )}

      {m.online && (
        <>
          <div className="mb-4 flex flex-wrap items-center justify-center gap-5">
            <VongNhiet doC={m.nhiet?.cpu} loai="cpu" nhan="CPU" />
            {gpu && <VongNhiet doC={gpu.nhiet as number} loai="gpu" nhan="GPU" />}
            <VongNhiet doC={m.nhiet?.dia} loai="dia" nhan="Ổ đĩa" />
          </div>

          <div className="space-y-2.5">
            <Thanh nhan={`CPU — ${m.cpu?.ten ?? '—'} (${m.cpu?.soNhan ?? 0} nhân)`} phanTram={m.cpu?.phanTram} />
            <Thanh nhan="RAM" dung={m.ram?.daDung} tong={m.ram?.tong} />
            <Thanh nhan={`Đĩa ${m.dia?.duong ?? ''}`} dung={m.dia?.daDung} tong={m.dia?.tong} />
            {gpu && (
              <Thanh nhan={`VRAM — ${gpu.ten}`} dung={gpu.vramDung as number} tong={gpu.vramTong as number} />
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
            <Muc2 nhan="Chạy liên tục" gt={thoiGian(m.uptimeGiay)} />
            <Muc2 nhan="Tải TB (1/5/15p)" gt={m.cpu?.tai ? m.cpu.tai.map((x) => x.toFixed(2)).join(' · ') : '—'} />
            {m.lichSu?.tatGanNhat && <Muc2 nhan="Tắt gần nhất" gt={m.lichSu.tatGanNhat} />}
            {gpu && <Muc2 nhan="Quạt GPU" gt={gpu.quat != null ? `${gpu.quat}%` : '—'} />}
            {gpu && <Muc2 nhan="Xung GPU" gt={gpu.xungNhip != null ? `${gpu.xungNhip} MHz` : '—'} />}
            {gpu && <Muc2 nhan="Driver" gt={String(gpu.driver ?? '—')} />}
          </div>

          {m.dien && (
            <div
              className="mt-4 rounded-xl p-3"
              style={{ background: 'var(--bg-secondary)' }}
            >
              <div className="mb-1.5 flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5" style={{ color: '#fbbf24' }} />
                <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Điện năng
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                <Muc2 nhan="Đang tiêu thụ" gt={`${m.dien.tongW} W`} />
                <Muc2 nhan="GPU (đo thật)" gt={m.dien.gpuW != null ? `${m.dien.gpuW} W` : '—'} />
                {m.dienThang && <Muc2 nhan={`Điện ${m.dienThang.thang}`} gt={`${m.dienThang.kWh} kWh`} />}
                {m.dienThang && (
                  <Muc2
                    nhan="Ước tính tiền"
                    gt={`${Number(m.dienThang.tienVnd ?? 0).toLocaleString('vi-VN')} đ`}
                  />
                )}
              </div>
              <p className="mt-2 text-[10px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Chỉ GPU là số đo thật. CPU và phần nền là <strong>ước lượng</strong> — nhân Linux
                khoá bộ đếm điện RAPL nên không đọc được. Tiền tính theo{' '}
                {Number(m.dienThang?.giaMoiKwh ?? 3500).toLocaleString('vi-VN')} đ/kWh.
                {m.dienThang?.batDauDo && ` Bắt đầu đếm từ ${m.dienThang.batDauDo}.`}
              </p>
            </div>
          )}

          {m.dichVu && Object.keys(m.dichVu).length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {Object.entries(m.dichVu).map(([ten, tt]) => (
                <span
                  key={ten}
                  className="rounded-lg px-2 py-1 text-[11px]"
                  style={{
                    background: tt === 'active' ? 'color-mix(in srgb, #34d399 15%, transparent)' : 'color-mix(in srgb, #ef4444 15%, transparent)',
                    color: tt === 'active' ? '#34d399' : '#ef4444',
                  }}
                >
                  {ten}: {tt}
                </span>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Muc2({ nhan, gt }: { nhan: string; gt: string }) {
  return (
    <div>
      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
        {nhan}
      </div>
      <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
        {gt}
      </div>
    </div>
  );
}

export function HaTangBang() {
  const [vps, setVps] = useState<May | null>(null);
  const [nha, setNha] = useState<May | null>(null);
  const [dangTai, setDangTai] = useState(true);
  const [tuLamMoi, setTuLamMoi] = useState(true);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const tai = useCallback(async () => {
    try {
      const res = await api.get('/admin/maker-lab/ha-tang');
      setVps(res.data?.data?.vps ?? null);
      setNha(res.data?.data?.nha ?? null);
    } catch {
      /* giữ nguyên số cũ — nháy "—" mỗi lần mạng chớp thì khó đọc hơn */
    } finally {
      setDangTai(false);
    }
  }, []);

  useEffect(() => {
    void tai();
  }, [tai]);

  useEffect(() => {
    if (!tuLamMoi) {
      if (timer.current) clearInterval(timer.current);
      return;
    }
    // 5 giây: đủ nhanh để thấy tải nhảy khi robot đang nói, đủ chậm để
    // không tự mình thành một nguồn tải.
    timer.current = setInterval(() => void tai(), 5000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [tuLamMoi, tai]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Hạ tầng — VPS &amp; GPU
          </h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Số liệu đọc trực tiếp từ máy, làm mới mỗi 5 giây.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <input type="checkbox" checked={tuLamMoi} onChange={(e) => setTuLamMoi(e.target.checked)} />
            Tự làm mới
          </label>
          <button
            type="button"
            onClick={() => void tai()}
            className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Làm mới
          </button>
        </div>
      </div>

      {dangTai && !vps && (
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Đang đọc số liệu…
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {vps && <TheMay m={vps} icon={Server} />}
        {nha && <TheMay m={nha} icon={Home} />}
      </div>
    </div>
  );
}
