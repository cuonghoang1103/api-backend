'use client';
/** Thang độ trễ của máy tính, phóng theo thời gian con người (1 chu kỳ CPU = 1 giây). Số liệu: B. Gregg, Systems Performance 2e (2020), bảng 2.2. */
import { useState } from 'react';
import { Controls, Explain, Frame, Seg, css as s, tx, usePlayer, type Lang } from './ui';

const ROWS: Array<{ en: string; vi: string; ns: number; human: [string, string]; c: string; noteEn: string; noteVi: string }> = [
  { en: '1 CPU cycle (3.3 GHz)', vi: '1 chu kỳ CPU (3,3 GHz)', ns: 0.3, human: ['1 s', '1 giây'], c: '#7c3aed', noteEn: 'One tick of the CPU clock. Registers are read within a cycle.', noteVi: 'Một nhịp đồng hồ CPU. Thanh ghi đọc trong một chu kỳ.' },
  { en: 'L1 cache', vi: 'Cache L1', ns: 0.9, human: ['3 s', '3 giây'], c: '#6d28d9', noteEn: 'Per core, ~32–64 KiB. Code that walks memory in order stays here.', noteVi: 'Riêng từng lõi, ~32–64 KiB. Code duyệt bộ nhớ tuần tự nằm lại ở đây.' },
  { en: 'L2 cache', vi: 'Cache L2', ns: 3, human: ['10 s', '10 giây'], c: '#2563eb', noteEn: 'Per core, ~1–2 MiB.', noteVi: 'Riêng từng lõi, ~1–2 MiB.' },
  { en: 'L3 cache', vi: 'Cache L3', ns: 10, human: ['33 s', '33 giây'], c: '#0891b2', noteEn: 'Shared by all cores, tens of MiB. A context switch can evict your data from here.', noteVi: 'Chung cho mọi lõi, vài chục MiB. Một lần chuyển ngữ cảnh có thể đẩy dữ liệu của bạn ra khỏi đây.' },
  { en: 'Main memory (DRAM)', vi: 'RAM (DRAM)', ns: 100, human: ['6 min', '6 phút'], c: '#059669', noteEn: 'A TLB miss adds page-table reads at this price. Still 100× slower than L1.', noteVi: 'Trượt TLB là thêm vài lần đọc bảng trang với giá này. Vẫn chậm hơn L1 100 lần.' },
  { en: 'SSD read', vi: 'Đọc SSD', ns: 50_000, human: ['9–90 hours', '9–90 giờ'], c: '#d97706', noteEn: '10–100 µs. A major page fault or a swap-in costs this much. This is why swapping feels like freezing.', noteVi: '10–100 µs. Một lỗi trang major hay một lần đọc swap tốn chừng này. Vì thế swap có cảm giác như máy đơ.' },
  { en: 'Spinning disk', vi: 'Ổ cứng quay (HDD)', ns: 5_000_000, human: ['1–12 months', '1–12 tháng'], c: '#dc2626', noteEn: '1–10 ms: the head has to move. fsync on an HDD costs this.', noteVi: '1–10 ms: đầu đọc phải di chuyển. fsync trên HDD tốn chừng này.' },
  { en: 'Internet: San Francisco → New York', vi: 'Internet: San Francisco → New York', ns: 40_000_000, human: ['4 years', '4 năm'], c: '#9f1239', noteEn: 'A network round trip across a continent. One remote API call inside a loop = years of CPU time.', noteVi: 'Một vòng mạng xuyên lục địa. Gọi API từ xa trong vòng lặp = hàng năm trời thời gian CPU.' },
  { en: 'TCP retransmit timer', vi: 'Hẹn giờ gửi lại của TCP', ns: 1_000_000_000, human: ['105–317 years', '105–317 năm'], c: '#4c0519', noteEn: '1–3 s: one lost packet on a fresh connection.', noteVi: '1–3 s: mất một gói trên kết nối mới.' },
];

export default function LatencyLadder({ lang = 'vi' }: { lang?: Lang; preset?: string }) {
  const [scale, setScale] = useState<'real' | 'human'>('human');
  const p = usePlayer(ROWS.length, 1800);
  const lo = Math.log10(0.3), hi = Math.log10(1e9);
  const w = (ns: number) => 6 + (94 * (Math.log10(ns) - lo)) / (hi - lo);
  const real = (ns: number) => (ns >= 1e9 ? `${ns / 1e9} s` : ns >= 1e6 ? `${ns / 1e6} ms` : ns >= 1e3 ? `${ns / 1e3} µs` : `${ns} ns`);
  const r = ROWS[p.i];
  return (
    <Frame badge={tx(lang, 'OS lab', 'Phòng lab OS')} title={tx(lang, 'How long things take — on a human scale', 'Mọi thứ tốn bao lâu — theo thang thời gian con người')}
      sub={tx(lang, 'If one CPU cycle took one second…', 'Nếu một chu kỳ CPU dài một giây…')}>
      <div className={s.bar}>
        <Seg label={tx(lang, 'Show', 'Hiện')} value={scale} options={[['human', tx(lang, 'human scale', 'thang con người')], ['real', tx(lang, 'real time', 'thời gian thật')]]} onChange={setScale} />
      </div>
      <Controls p={p} lang={lang} />
      <Explain tone={p.i >= 5 ? 'warn' : undefined}><b>{tx(lang, r.en, r.vi)}: {real(r.ns)} ≈ {tx(lang, r.human[0], r.human[1])}.</b> {tx(lang, r.noteEn, r.noteVi)}</Explain>
      <div className={s.stack} style={{ marginTop: 10, gap: 6 }}>
        {ROWS.map((x, k) => (
          <div key={k} style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 34%) 1fr', gap: 8, alignItems: 'center', opacity: k <= p.i ? 1 : 0.3, transition: 'opacity .3s' }}>
            <span style={{ fontSize: 12.5, fontWeight: k === p.i ? 800 : 600 }}>{tx(lang, x.en, x.vi)}</span>
            <div style={{ position: 'relative', height: 22, background: 'var(--ol-panel2)', borderRadius: 6 }}>
              <div style={{ width: `${k <= p.i ? w(x.ns) : 0}%`, height: '100%', background: x.c, borderRadius: 6, transition: 'width .6s ease' }} />
              <span className={s.mono} style={{ position: 'absolute', right: 6, top: 3, fontSize: 11.5, fontWeight: 800 }}>{scale === 'human' ? tx(lang, x.human[0], x.human[1]) : real(x.ns)}</span>
            </div>
          </div>
        ))}
      </div>
      <div className={s.small} style={{ marginTop: 8 }}>{tx(lang, 'Log scale: each grid step is ×10. Numbers: Brendan Gregg, Systems Performance, 2nd ed. (2020), table 2.2 — typical values; measure your own machine in the lab.', 'Thang log: mỗi bậc là ×10. Số liệu: Brendan Gregg, Systems Performance, bản 2 (2020), bảng 2.2 — giá trị điển hình; tự đo máy của bạn trong phòng lab.')}</div>
    </Frame>
  );
}
