'use client';

/**
 * Cài đặt → Giao diện → "Chủ đề mùa": 6 thẻ xem trước (Mặc định · Tự động · Xuân · Hạ · Thu · Đông) + công tắc
 * "Hiệu ứng động". Thẻ mùa chạy ĐÚNG bộ vẽ của nền (thu nhỏ), mang bảng màu của chính nó (`.xem-mua[data-xem]`
 * trong app/chu-de-mua.css) để thấy chữ trên nền trông ra sao trước khi chọn. Đổi là có hiệu lực ngay, lưu trên máy này.
 */

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { CalendarDays, Check, Flower2, Leaf, Palette, Snowflake, Sun } from 'lucide-react';
import { SettingsCard, SettingsRow, Toggle } from '@/components/settings/primitives';
import { useChuDeMua, useDomChuDe } from '@/lib/chuDeMua/useChuDeMua';
import { CAC_CHU_DE, TEN_CHU_DE, TEN_MUA, giaiMua, type ChuDe } from '@/lib/chuDeMua/logic';
import LoiChaoMua from './LoiChaoMua';

const CanvasXemTruoc = dynamic(() => import('./CanvasXemTruoc'), { ssr: false });

const BIEU_TUONG: Record<ChuDe, React.ReactNode> = {
  macDinh: <Palette className="h-3.5 w-3.5" />,
  tuDong: <CalendarDays className="h-3.5 w-3.5" />,
  xuan: <Flower2 className="h-3.5 w-3.5" />,
  ha: <Sun className="h-3.5 w-3.5" />,
  thu: <Leaf className="h-3.5 w-3.5" />,
  dong: <Snowflake className="h-3.5 w-3.5" />,
};

function useGiamChuyenDong() {
  const [v, setV] = useState(false);
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setV(mql.matches);
    const f = () => setV(mql.matches);
    mql.addEventListener?.('change', f);
    return () => mql.removeEventListener?.('change', f);
  }, []);
  return v;
}

function TheXemTruoc({ chuDe, dangChon, chay, toi, onChon }: {
  chuDe: ChuDe; dangChon: boolean; chay: boolean; toi: boolean; onChon: () => void;
}) {
  const mua = giaiMua(chuDe);
  const xem = mua ?? 'macDinh';
  const { ten, moTa } = TEN_CHU_DE[chuDe];
  return (
    <button
      type="button"
      onClick={onChon}
      aria-pressed={dangChon}
      aria-label={`${ten} — ${moTa}`}
      className="group overflow-hidden rounded-xl border text-left transition-colors"
      style={{
        borderColor: dangChon ? 'var(--accent-color)' : 'var(--border-color)',
        boxShadow: dangChon ? '0 0 0 1.5px var(--accent-color)' : undefined,
        background: 'var(--bg-card)',
      }}
    >
      <div className="xem-mua relative h-24 overflow-hidden" data-xem={xem} style={{ background: 'var(--bg-primary)' }}>
        {mua && <CanvasXemTruoc mua={mua} toi={toi} chay={chay} />}
        {/* "thẻ nội dung" giả bằng chính bảng màu của chủ đề */}
        <div
          className="absolute bottom-5 left-5 flex flex-col gap-1.5 rounded-lg border p-2"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
        >
          <span className="block h-1.5 w-12 rounded-full" style={{ background: 'var(--text-primary)' }} />
          <span className="block h-1 w-16 rounded-full opacity-70" style={{ background: 'var(--text-secondary)' }} />
          <span className="block h-3 w-9 rounded-full" style={{ background: 'var(--accent-color)' }} />
        </div>
      </div>
      <div className="flex items-center gap-2 px-3 py-2">
        <span style={{ color: 'var(--accent-color)' }}>{BIEU_TUONG[chuDe]}</span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>{ten}</p>
          <p className="truncate text-[11px]" style={{ color: 'var(--text-muted)' }}>{moTa}</p>
        </div>
        {dangChon && <Check className="h-4 w-4 shrink-0" style={{ color: 'var(--accent-color)' }} />}
      </div>
    </button>
  );
}

export default function CaiDatChuDeMua() {
  const { chuDe, setChuDe, hieuUngDong, setHieuUngDong } = useChuDeMua();
  const { toi, giamClass } = useDomChuDe();
  const giamHdh = useGiamChuyenDong();
  const [daMount, setDaMount] = useState(false);
  useEffect(() => setDaMount(true), []);
  const chay = hieuUngDong && !giamHdh && !giamClass;
  const muaTuDong = giaiMua('tuDong');

  return (
    <SettingsCard
      title="Chủ đề mùa"
      description="Thêm màu và hình trang trí theo mùa — chọn Mặc định để giữ giao diện như cũ. Chỉ lưu trên máy này."
      icon={<Flower2 className="h-4 w-4" />}
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {CAC_CHU_DE.map((c) => (
          <TheXemTruoc
            key={c}
            chuDe={c}
            dangChon={daMount && chuDe === c}
            chay={daMount && chay}
            toi={toi}
            onChon={() => setChuDe(c)}
          />
        ))}
      </div>
      {daMount && chuDe === 'tuDong' && muaTuDong && (
        <p className="mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
          Đang là mùa {TEN_MUA[muaTuDong]}. Đông: tháng 11–12 · Xuân: 1–3 · Hạ: 4–7 · Thu: 8–10.
        </p>
      )}
      {daMount && <LoiChaoMua className="mt-3" />}
      <div className="mt-4 border-t pt-2" style={{ borderColor: 'var(--border-color)' }}>
        <SettingsRow
          label="Hiệu ứng động"
          description={
            giamHdh || giamClass
              ? 'Đang đứng yên vì bạn bật Giảm chuyển động. Trang trí vẫn hiện, chỉ không chuyển động.'
              : 'Hoa rơi, tuyết rơi, sóng, đèn nháy. Tắt đi thì trang trí đứng yên. Màn đọc dài (bài học, đọc sách, làm bài thi, video, CT Work) luôn chỉ giữ màu để bạn tập trung.'
          }
          control={
            <Toggle
              checked={daMount && hieuUngDong}
              onChange={setHieuUngDong}
              disabled={daMount && chuDe === 'macDinh'}
              label="Hiệu ứng động"
            />
          }
        />
      </div>
    </SettingsCard>
  );
}
