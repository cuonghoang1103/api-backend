'use client';
/** Tạo kỳ học, thêm môn (kèm lịch thi), và AI soạn kế hoạch → xem trước → áp dụng. */
import { useEffect, useMemo, useState } from 'react';
import { Sparkles, Plus } from 'lucide-react';
import { hocTapApi, NHAN_LOAI, type KeHoach, type ViecDeNghi } from '@/lib/hoc-tap-api';
import { HopThoai, Nut, oNhap } from './ui';
import { thongBao } from './ChiTietViec';

const isoNgay = (d: Date) => d.toISOString().slice(0, 10);

/** Thứ Hai của tuần 1 nếu hôm nay là tuần `n`. */
function thuHaiTuan1(n: number, now = new Date()) {
  const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7) - (n - 1) * 7);
  return d;
}

export function TaoKy({ onXong }: { onXong: () => void }) {
  const [ten, setTen] = useState(() => { const n = new Date(); const m = n.getMonth(); return `${m < 4 ? 'Spring' : m < 8 ? 'Summer' : 'Fall'} ${n.getFullYear()}`; });
  const [tuanNay, setTuanNay] = useState(1);
  const [batDau, setBatDau] = useState(isoNgay(thuHaiTuan1(1)));
  const [soTuan, setSoTuan] = useState(10);
  const [tuanThi, setTuanThi] = useState(10);
  const [loi, setLoi] = useState('');
  const [dang, setDang] = useState(false);
  return (
    <div className="mx-auto max-w-lg space-y-4 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
      <div className="text-center">
        <div className="text-5xl">🎯</div>
        <h1 className="mt-2 font-heading text-2xl font-black text-text-primary">Huấn luyện học kỳ</h1>
        <p className="mt-1 text-sm text-text-muted">AI lập kế hoạch từng môn, bạn bấm giờ làm và nộp bằng chứng, AI chấm rồi mới tích. Bước 1: cho biết kỳ học của bạn.</p>
      </div>
      <label className="block text-sm font-semibold text-text-primary">Tên kỳ<input className={oNhap} value={ten} onChange={(e) => setTen(e.target.value)} /></label>
      <label className="block text-sm font-semibold text-text-primary">Hôm nay là tuần thứ mấy của kỳ?
        <input type="number" min={1} max={20} className={oNhap} value={tuanNay} onChange={(e) => { const n = Math.max(1, Number(e.target.value) || 1); setTuanNay(n); setBatDau(isoNgay(thuHaiTuan1(n))); }} />
      </label>
      <label className="block text-sm font-semibold text-text-primary">Thứ Hai của tuần 1<input type="date" className={oNhap} value={batDau} onChange={(e) => setBatDau(e.target.value)} /></label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm font-semibold text-text-primary">Số tuần<input type="number" className={oNhap} value={soTuan} onChange={(e) => setSoTuan(Number(e.target.value) || 10)} /></label>
        <label className="block text-sm font-semibold text-text-primary">Tuần thi FE<input type="number" className={oNhap} value={tuanThi} onChange={(e) => setTuanThi(Number(e.target.value) || 10)} /></label>
      </div>
      {loi && <p className="text-sm text-red-500">{loi}</p>}
      <Nut className="w-full py-3" disabled={dang} onClick={async () => {
        setDang(true); setLoi('');
        try { await hocTapApi.taoKy({ ten, batDau, soTuan, tuanThi: Math.min(tuanThi, soTuan) }); onXong(); } catch (e) { setLoi(thongBao(e)); } finally { setDang(false); }
      }}>Tạo kỳ học</Nut>
    </div>
  );
}

export function ThemMon({ mo, onDong, onXong, hocKyId }: { mo: boolean; onDong: () => void; onXong: (monId: number) => void; hocKyId?: number }) {
  const [maMon, setMaMon] = useState('');
  const [ten, setTen] = useState('');
  const [trinhDo, setTrinhDo] = useState('');
  const [mucTieu, setMucTieu] = useState('Qua môn chắc chắn');
  const [pe, setPe] = useState('');
  const [fe, setFe] = useState('');
  const [loi, setLoi] = useState('');
  const [dang, setDang] = useState(false);
  return (
    <HopThoai mo={mo} onDong={onDong} tieuDe="➕ Thêm môn">
      <div className="space-y-3">
        <div className="grid grid-cols-[1fr_2fr] gap-2">
          <label className="text-sm font-semibold text-text-primary">Mã môn<input className={oNhap} placeholder="FER202" value={maMon} onChange={(e) => setMaMon(e.target.value)} /></label>
          <label className="text-sm font-semibold text-text-primary">Tên (để trống = lấy từ Academy)<input className={oNhap} value={ten} onChange={(e) => setTen(e.target.value)} /></label>
        </div>
        <label className="block text-sm font-semibold text-text-primary">Bạn đang ở đâu với môn này? <span className="font-normal text-text-muted">(AI đọc để xếp việc — nói thật)</span>
          <textarea rows={4} className={oNhap} placeholder="Ví dụ: tuần 4 rồi mà chưa biết tạo project React, chưa vững HTML/CSS/JS, mới làm Lab3 nhờ AI…" value={trinhDo} onChange={(e) => setTrinhDo(e.target.value)} />
        </label>
        <label className="block text-sm font-semibold text-text-primary">Mục tiêu<input className={oNhap} value={mucTieu} onChange={(e) => setMucTieu(e.target.value)} /></label>
        <div className="grid grid-cols-2 gap-2">
          <label className="text-sm font-semibold text-text-primary">Ngày thi PE (nếu biết)<input type="date" className={oNhap} value={pe} onChange={(e) => setPe(e.target.value)} /></label>
          <label className="text-sm font-semibold text-text-primary">Ngày thi FE (nếu biết)<input type="date" className={oNhap} value={fe} onChange={(e) => setFe(e.target.value)} /></label>
        </div>
        {loi && <p className="text-sm text-red-500">{loi}</p>}
        <Nut className="w-full" disabled={dang || maMon.trim().length < 2} onClick={async () => {
          setDang(true); setLoi('');
          try {
            const m = await hocTapApi.themMon({ maMon: maMon.trim(), ten: ten.trim() || undefined, trinhDo: trinhDo.trim() || undefined, mucTieu: mucTieu.trim() || undefined });
            for (const [loai, ngay] of [['PE', pe], ['FE', fe]] as const) {
              if (ngay) await hocTapApi.themThi({ monHoc: ten.trim() || maMon.trim(), maMon: maMon.trim().toUpperCase(), loai, ngay, batDau: '07:30', ketThuc: '09:30', hocKyId }).catch(() => undefined);
            }
            setMaMon(''); setTen(''); setTrinhDo(''); setPe(''); setFe('');
            onXong(m.id);
          } catch (e) { setLoi(thongBao(e)); } finally { setDang(false); }
        }}><Plus size={14} /> Thêm môn</Nut>
      </div>
    </HopThoai>
  );
}

export function SoanKeHoach({ monId, maMon, onDong, onXong }: { monId: number | null; maMon?: string; onDong: () => void; onXong: () => void }) {
  const [ghiChu, setGhiChu] = useState('');
  const [job, setJob] = useState<string | null>(null);
  const [kq, setKq] = useState<KeHoach | null>(null);
  const [chon, setChon] = useState<Set<number>>(new Set());
  const [loi, setLoi] = useState('');
  const [giay, setGiay] = useState(0);
  const [dangApDung, setDangApDung] = useState(false);

  useEffect(() => { setJob(null); setKq(null); setLoi(''); setGhiChu(''); }, [monId]);

  useEffect(() => {
    if (!job) return;
    const bd = Date.now();
    const t = setInterval(async () => {
      setGiay(Math.round((Date.now() - bd) / 1000));
      try {
        const r = await hocTapApi.trangThaiSoan(job);
        if (r.trangThai === 'xong' && r.ketQua) { setKq(r.ketQua); setChon(new Set(r.ketQua.viec.map((_, i) => i))); setJob(null); }
        if (r.trangThai === 'loi') { setLoi(r.loi ?? 'AI soạn lỗi'); setJob(null); }
      } catch (e) { setLoi(thongBao(e)); setJob(null); }
    }, 3000);
    return () => clearInterval(t);
  }, [job]);

  const theoTuan = useMemo(() => {
    const m = new Map<number, Array<{ v: ViecDeNghi; i: number }>>();
    kq?.viec.forEach((v, i) => { m.set(v.tuan, [...(m.get(v.tuan) ?? []), { v, i }]); });
    return [...m.entries()].sort((a, b) => a[0] - b[0]);
  }, [kq]);
  const tongPhut = kq?.viec.filter((_, i) => chon.has(i)).reduce((s, v) => s + (v.thoiLuongPhut ?? 30), 0) ?? 0;

  return (
    <HopThoai mo={monId !== null} onDong={onDong} rong tieuDe={<span>✨ AI soạn kế hoạch {maMon}</span>}>
      {!kq ? (
        <div className="space-y-3">
          <p className="text-sm text-text-muted">AI (gpt-6-sol) đọc mục lục môn trên Academy, những bài bạn đã học, lịch thi, tuần hiện tại và trình độ bạn tự kể, rồi soạn việc từng ngày gồm cả phần bù những tuần đã qua và các khoá nền cần học trước. Bạn xem trước rồi mới áp dụng.</p>
          <textarea rows={3} className={oNhap} placeholder="Dặn thêm (tuỳ chọn): ví dụ “buổi sau cô rev Lab3”, “tối nào cũng rảnh 3 tiếng”…" value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} />
          {loi && <p className="text-sm text-red-500">{loi}</p>}
          {job ? (
            <div className="flex items-center gap-3 rounded-2xl bg-neon-violet/10 p-4 text-sm text-text-primary">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-neon-violet border-t-transparent" />
              AI đang soạn… {giay}s (thường 2–6 phút — cứ để đó, đừng đóng tab)
            </div>
          ) : (
            <Nut className="w-full py-3" onClick={async () => {
              setLoi('');
              try { if (monId) setJob((await hocTapApi.soanKeHoach(monId, ghiChu.trim() || undefined)).jobId); } catch (e) { setLoi(thongBao(e)); }
            }}><Sparkles size={16} /> Soạn kế hoạch</Nut>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {kq.tomTat && <div className="rounded-2xl bg-neon-violet/10 p-3 text-sm text-text-primary">{kq.tomTat}</div>}
          {kq.nenTang.length > 0 && (
            <div className="text-sm text-text-primary">
              <b>🧱 Khoá nền cần học trước:</b>
              <ul className="mt-1 list-disc pl-5">{kq.nenTang.map((n) => <li key={n.slug}><a className="text-neon-violet underline" href={`/courses/${n.slug}`} target="_blank" rel="noreferrer">{n.ten}</a>{n.lyDo ? ` — ${n.lyDo}` : ''}</li>)}</ul>
            </div>
          )}
          {kq.canhBao.length > 0 && <details className="text-xs text-amber-600"><summary>{kq.canhBao.length} cảnh báo khi kiểm kế hoạch</summary><ul className="list-disc pl-5">{kq.canhBao.map((c, i) => <li key={i}>{c}</li>)}</ul></details>}
          <div className="text-xs text-text-muted">Đã chọn {chon.size}/{kq.viec.length} việc · tổng ~{Math.round(tongPhut / 60)} giờ</div>
          <div className="space-y-3">
            {theoTuan.map(([tuan, ds]) => (
              <div key={tuan}>
                <div className="mb-1 text-xs font-bold uppercase tracking-wider text-text-muted">Tuần {tuan}</div>
                <div className="space-y-1">
                  {ds.map(({ v, i }) => (
                    <label key={i} className="flex cursor-pointer items-start gap-2 rounded-xl border border-[var(--border-color)] p-2 text-sm">
                      <input type="checkbox" className="mt-1" checked={chon.has(i)} onChange={() => setChon((s) => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; })} />
                      <span className="min-w-0 flex-1">
                        <span className="font-semibold text-text-primary">{NHAN_LOAI[v.loai]?.bieuTuong} {v.tieuDe}</span>
                        <span className="block text-[11px] text-text-muted">{NHAN_LOAI[v.loai]?.ten} · thứ {(v.thu ?? 7) === 7 ? 'CN' : (v.thu ?? 7) + 1} · ⏱ {v.thoiLuongPhut}′ · trọng số {v.trongSo}{v.yeuCauBangChung ? ` · nộp: ${v.yeuCauBangChung.slice(0, 80)}` : ''}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {loi && <p className="text-sm text-red-500">{loi}</p>}
          <div className="sticky bottom-0 flex gap-2 bg-[var(--bg-card)] pt-2">
            <Nut kieu="phu" onClick={() => setKq(null)}>Soạn lại</Nut>
            <Nut className="flex-1" disabled={!chon.size || dangApDung} onClick={async () => {
              if (!monId) return;
              setDangApDung(true); setLoi('');
              try { await hocTapApi.apDung(monId, kq.viec.filter((_, i) => chon.has(i)), kq.nenTang); onXong(); onDong(); }
              catch (e) { setLoi(thongBao(e)); } finally { setDangApDung(false); }
            }}>Áp dụng {chon.size} việc</Nut>
          </div>
        </div>
      )}
    </HopThoai>
  );
}
