'use client';

/**
 * Đo tốc độ mạng (web) — /toc-do-mang
 * ─────────────────────────────────────────────────────────────────────────
 * Đo download / upload / ping / jitter giữa TRÌNH DUYỆT và máy chủ
 * cuongthai.com. Cùng ba endpoint `/api/v1/toc-do-mang/*` mà app desktop dùng.
 *
 * ⚠️ Vì sao web KHÔNG có phần "quét thiết bị trong mạng" như app desktop:
 * trình duyệt bị sandbox, không đọc được bảng ARP, không thấy địa chỉ MAC của
 * thiết bị khác — không có API nào cho phép, và không có cách lách. Muốn xem ai
 * đang dùng chung WiFi thì phải mở trong ứng dụng máy tính. Trang này nói rõ
 * điều đó thay vì giả vờ làm được.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Activity, Download, Gauge, Play, Square, Upload, Wifi, MonitorSmartphone } from 'lucide-react';
import Link from 'next/link';
import { useDaDangNhap } from '@/hooks/useDaDangNhap';
import { doPing, doTaiXuong, doTaiLen, type MauTocDo } from './tocDo';

type GiaiDoan = 'san-sang' | 'ping' | 'taiXuong' | 'taiLen' | 'xong';

export default function TocDoMangPage() {
  const { daDangNhap, sanSang } = useDaDangNhap();
  const [giaiDoan, setGiaiDoan] = useState<GiaiDoan>('san-sang');
  const [mbpsSong, setMbpsSong] = useState(0);
  const [taiXuong, setTaiXuong] = useState<number | null>(null);
  const [taiLen, setTaiLen] = useState<number | null>(null);
  const [ping, setPing] = useState<number | null>(null);
  const [jitter, setJitter] = useState<number | null>(null);
  const [loi, setLoi] = useState<string | null>(null);
  const huyRef = useRef<AbortController | null>(null);

  const dangChay = giaiDoan !== 'san-sang' && giaiDoan !== 'xong';

  const chay = useCallback(async () => {
    const ac = new AbortController();
    huyRef.current = ac;
    setLoi(null);
    setTaiXuong(null); setTaiLen(null); setPing(null); setJitter(null); setMbpsSong(0);
    try {
      setGiaiDoan('ping');
      const p = await doPing(ac.signal);
      setPing(p.pingMs); setJitter(p.jitterMs);

      setGiaiDoan('taiXuong'); setMbpsSong(0);
      const dx = await doTaiXuong(ac.signal, (m: MauTocDo) => setMbpsSong(m.mbps));
      setTaiXuong(dx);

      setGiaiDoan('taiLen'); setMbpsSong(0);
      const ln = await doTaiLen(ac.signal, (m: MauTocDo) => setMbpsSong(m.mbps));
      setTaiLen(ln);

      setGiaiDoan('xong');
    } catch (e) {
      if (!ac.signal.aborted) setLoi(e instanceof Error ? e.message : String(e));
      setGiaiDoan('san-sang');
    }
  }, []);

  const dung = useCallback(() => {
    huyRef.current?.abort();
    setGiaiDoan('san-sang');
  }, []);

  useEffect(() => () => huyRef.current?.abort(), []);

  if (sanSang && !daDangNhap) {
    return (
      <div className="max-w-2xl mx-auto px-4 pt-32 pb-20 text-center" style={{ color: 'var(--text-primary)' }}>
        <h1 className="text-2xl font-bold mb-3">Cần đăng nhập</h1>
        <p style={{ color: 'var(--text-secondary)' }} className="mb-6">
          Đăng nhập để đo tốc độ mạng.
        </p>
        <Link href="/login" className="px-5 py-2.5 rounded-lg font-medium text-white inline-block" style={{ background: 'var(--accent-color)' }}>
          Đăng nhập
        </Link>
      </div>
    );
  }

  const nhanGiaiDoan =
    giaiDoan === 'ping' ? 'Đang đo độ trễ…'
    : giaiDoan === 'taiXuong' ? 'Đang đo tải xuống…'
    : giaiDoan === 'taiLen' ? 'Đang đo tải lên…'
    : giaiDoan === 'xong' ? 'Xong' : 'Sẵn sàng';

  const soLon = dangChay && (giaiDoan === 'taiXuong' || giaiDoan === 'taiLen')
    ? mbpsSong
    : (taiXuong ?? 0);

  return (
    <div className="max-w-[900px] mx-auto px-4 pt-16 pb-[calc(2rem+var(--app-chrome-bottom,0px))]"
      style={{ color: 'var(--text-primary)' }}>
      <div className="mb-6 mt-6 flex items-center gap-3">
        <Gauge size={28} style={{ color: 'var(--accent-color)' }} aria-hidden />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Tốc độ mạng</h1>
          <p style={{ color: 'var(--text-secondary)' }} className="text-sm">
            Đo đường truyền giữa máy bạn và máy chủ cuongthai.com.
          </p>
        </div>
      </div>

      <div className="rounded-2xl p-8 text-center" style={{ background: 'var(--surface-1)', border: '1px solid var(--border-color)' }}>
        <div className="text-6xl font-bold tabular-nums" style={{ color: 'var(--accent-color)' }}>
          {soLon.toFixed(1)}
          <span className="text-xl font-semibold ml-2" style={{ color: 'var(--text-secondary)' }}>Mbps</span>
        </div>
        <div className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>{nhanGiaiDoan}</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
        <ChiSo icon={<Download size={18} />} nhan="Tải xuống" gt={giaiDoan === 'taiXuong' ? mbpsSong : taiXuong} dv="Mbps" dangDo={giaiDoan === 'taiXuong'} />
        <ChiSo icon={<Upload size={18} />} nhan="Tải lên" gt={giaiDoan === 'taiLen' ? mbpsSong : taiLen} dv="Mbps" dangDo={giaiDoan === 'taiLen'} />
        <ChiSo icon={<Activity size={18} />} nhan="Độ trễ" gt={ping} dv="ms" />
        <ChiSo icon={<Activity size={18} />} nhan="Độ rung" gt={jitter} dv="ms" />
      </div>

      {loi && (
        <div className="mt-4 rounded-lg px-4 py-3 text-sm" style={{ background: 'var(--surface-2)', color: 'var(--danger-color, #b91c1c)' }}>
          {loi}
        </div>
      )}

      <div className="mt-6">
        {dangChay ? (
          <button type="button" onClick={dung}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium"
            style={{ border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
            <Square size={16} aria-hidden /> Dừng
          </button>
        ) : (
          <button type="button" onClick={() => void chay()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-white"
            style={{ background: 'var(--accent-color)' }}>
            <Play size={16} aria-hidden /> Bắt đầu đo
          </button>
        )}
      </div>

      <div className="mt-8 rounded-xl px-4 py-4 flex gap-3 items-start text-sm"
        style={{ background: 'var(--surface-2)', color: 'var(--text-secondary)' }}>
        <MonitorSmartphone size={20} aria-hidden style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <p className="mb-1" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
            Muốn xem ai đang dùng chung WiFi nhà bạn?
          </p>
          <p>
            Trình duyệt không quét được thiết bị trong mạng. Mở tính năng “Mạng nhà”
            trong <strong>ứng dụng máy tính CuongThai</strong> để thấy danh sách thiết bị
            đang kết nối và địa chỉ của chúng.
          </p>
        </div>
      </div>

      <p className="mt-6 text-xs leading-relaxed" style={{ color: 'var(--text-tertiary, var(--text-secondary))' }}>
        <Wifi size={12} className="inline mr-1" aria-hidden />
        Đây là tốc độ tới máy chủ cuongthai.com — đủ để biết mạng đang khoẻ hay yếu,
        không thay cho công cụ đo tới máy chủ quốc tế.
      </p>
    </div>
  );
}

function ChiSo({ icon, nhan, gt, dv, dangDo }: {
  icon: React.ReactNode; nhan: string; gt: number | null; dv: string; dangDo?: boolean;
}) {
  return (
    <div className="rounded-xl p-4" style={{
      background: 'var(--surface-1)',
      border: `1px solid ${dangDo ? 'var(--accent-color)' : 'var(--border-color)'}`,
    }}>
      <div className="flex items-center gap-1.5 text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>
        {icon} {nhan}
      </div>
      <div className="text-xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
        {gt !== null ? gt.toFixed(dv === 'ms' ? 0 : 1) : '—'}
        <span className="text-xs font-medium ml-1" style={{ color: 'var(--text-tertiary, var(--text-secondary))' }}>{dv}</span>
      </div>
    </div>
  );
}
