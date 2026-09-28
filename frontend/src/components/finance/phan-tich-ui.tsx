'use client';
/**
 * Phân tích tài chính — khối giao diện dùng chung (28/09/2026).
 *
 * MỌI con số ở đây do máy chủ tính (`/finance/phan-tich`, `/debts/chien-luoc`,
 * `/debts/:id/tat-toan`, `/finance/ai/*`). Giao diện chỉ định dạng và tô màu —
 * không cộng trừ tiền lại ở trình duyệt, để web / app / AI nói cùng một số.
 *
 * Màu cảnh báo: đỏ = nguy (quá hạn, nợ > 50% thu nhập), cam = cảnh báo,
 * xanh/tím = thông tin. Theo biến CSS nên đúng cả nền sáng lẫn tối.
 */
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { toast } from 'sonner';
import { AlertOctagon, AlertTriangle, Info, Sparkles, Send, RefreshCw, TrendingDown, TrendingUp, Trophy, Calculator } from 'lucide-react';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import {
  financeApi, type CanhBao, type GoiPhanTich, type ChienLuocTraNo, type KetQuaMoPhong, type KetQuaTatToan,
  type TraLoiCoVan, type Wallet, type Money,
} from '@/lib/finance-api';
import { cn, formatMoney, formatVnd, formatVndCompact } from '@/lib/utils';
import { Card, Button, Field, inputCls, Spinner } from './primitives';

// ─── Định dạng ───────────────────────────────────────────────
export const tien = (v: Money | number | null | undefined, te?: string | null) => (v == null ? '—' : formatMoney(v, te));
export const phanTram = (v: number | null | undefined, le = 1) => (v == null ? '—' : `${v.toLocaleString('vi-VN', { maximumFractionDigits: le })}%`);
export const ngayVN = (s: string | null | undefined) => (s ? s.slice(0, 10).split('-').reverse().join('/') : '—');
export const thangVN = (s: string | null | undefined) => (s ? `${s.slice(5, 7)}/${s.slice(0, 4)}` : '—');
const soTien = (s: string) => Number(s.replace(/[^\d]/g, '')) || 0;
const nhapTien = (s: string) => { const n = soTien(s); return n ? n.toLocaleString('vi-VN') : ''; };

// ─── Cảnh báo ────────────────────────────────────────────────
const MUC = {
  nguy: { icon: AlertOctagon, cls: 'border-neon-red/40 bg-neon-red/10 text-neon-red' },
  canh: { icon: AlertTriangle, cls: 'border-neon-orange/40 bg-neon-orange/10 text-neon-orange' },
  tin: { icon: Info, cls: 'border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan' },
} as const;

export function DanhSachCanhBao({ ds, toiDa, rong }: { ds: CanhBao[]; toiDa?: number; rong?: ReactNode }) {
  const [moHet, setMoHet] = useState(false);
  if (ds.length === 0) return <>{rong ?? null}</>;
  const hien = toiDa && !moHet ? ds.slice(0, toiDa) : ds;
  return (
    <div className="space-y-2">
      {hien.map((c, i) => {
        const M = MUC[c.muc];
        const noiDung = (
          <div className={cn('flex items-start gap-2.5 rounded-xl border px-3 py-2.5', M.cls)}>
            <M.icon size={17} className="mt-0.5 shrink-0" />
            <div className="min-w-0">
              <div className="text-sm font-semibold">{c.tieuDe}</div>
              {c.chiTiet && <div className="mt-0.5 text-xs text-text-secondary">{c.chiTiet}</div>}
            </div>
          </div>
        );
        return c.lienKet ? <Link key={i} href={c.lienKet} className="block transition-opacity hover:opacity-85">{noiDung}</Link> : <div key={i}>{noiDung}</div>;
      })}
      {toiDa && ds.length > toiDa && (
        <button onClick={() => setMoHet((v) => !v)} className="text-xs font-medium text-neon-violet hover:underline">
          {moHet ? 'Thu gọn' : `Xem thêm ${ds.length - toiDa} cảnh báo`}
        </button>
      )}
    </div>
  );
}

// ─── Ô chỉ số ────────────────────────────────────────────────
export function OChiSo({ nhan, giaTri, phu, tone = 'default' }: { nhan: string; giaTri: ReactNode; phu?: ReactNode; tone?: 'red' | 'orange' | 'green' | 'cyan' | 'violet' | 'default' }) {
  const mau = { red: 'text-neon-red', orange: 'text-neon-orange', green: 'text-neon-green', cyan: 'text-neon-cyan', violet: 'text-neon-violet', default: 'text-text-primary' }[tone];
  return (
    <Card className="min-w-0">
      <div className="truncate text-xs font-medium text-text-muted">{nhan}</div>
      <div className={cn('mt-1 break-words font-heading text-base font-bold leading-tight tabular-nums sm:text-lg', mau)}>{giaTri}</div>
      {phu && <div className="mt-1 text-xs leading-snug text-text-muted">{phu}</div>}
    </Card>
  );
}

/** Bốn chỉ số sức khoẻ: dòng tiền ròng, nợ/thu nhập, quỹ khẩn cấp, chi so cùng kỳ. */
export function SucKhoeTaiChinh({ g }: { g: GoiPhanTich }) {
  const rong = Number(g.dongTien.thangNay.rong);
  const dti = g.chiSo.tyLeNoTrenThu;
  const quy = g.quyKhanCap.soThang;
  const cungKy = g.chiTieu.soVoiCungKyPct;
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <OChiSo nhan="Dòng tiền ròng tháng này" tone={rong < 0 ? 'red' : 'green'} giaTri={tien(g.dongTien.thangNay.rong)}
        phu={<>Thu {formatVndCompact(g.dongTien.thangNay.thu)} − chi {formatVndCompact(g.dongTien.thangNay.chi)} − trả nợ {formatVndCompact(g.dongTien.thangNay.traNo)}</>} />
      <OChiSo nhan="Trả nợ / thu nhập" tone={dti == null ? 'default' : dti > 50 ? 'red' : dti > 35 ? 'orange' : 'green'} giaTri={phanTram(dti)}
        phu={dti == null ? 'Chưa đủ dữ liệu thu nhập' : <>Nghĩa vụ tháng này {formatVndCompact(g.chiSo.nghiaVuNoThangNay)} / thu bình quân {formatVndCompact(g.chiSo.thuBinhQuan3Thang)}</>} />
      <OChiSo nhan="Quỹ khẩn cấp đủ" tone={quy == null ? 'default' : quy < 1 ? 'red' : quy < 3 ? 'orange' : 'green'}
        giaTri={quy == null ? '—' : `${quy.toLocaleString('vi-VN', { maximumFractionDigits: 1 })} tháng`}
        phu={quy == null ? 'Chưa đủ dữ liệu chi tiêu' : <>Kể cả sổ tiết kiệm: {g.quyKhanCap.soThangKeCaTietKiem?.toLocaleString('vi-VN', { maximumFractionDigits: 1 })} tháng</>} />
      <OChiSo nhan={`Chi tới ngày ${g.chiTieu.ngayTrongThang}/${g.thang.slice(5)}`} tone={cungKy != null && cungKy >= 20 ? 'orange' : 'default'}
        giaTri={tien(g.chiTieu.thangNay)}
        phu={<>{cungKy == null ? 'Tháng trước chưa có dữ liệu cùng kỳ' : <>{cungKy >= 0 ? '▲' : '▼'} {phanTram(Math.abs(cungKy))} so với cùng kỳ tháng trước</>}{g.chiTieu.duBaoCuoiThang && <> · dự báo cả tháng {formatVndCompact(g.chiTieu.duBaoCuoiThang)}</>}</>} />
    </div>
  );
}

// ─── Biểu đồ dòng tiền 6 tháng ───────────────────────────────
const tooltipStyle = { background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 12, fontSize: 12, color: 'var(--text-primary)' } as const;

export function BieuDoDongTien({ g }: { g: GoiPhanTich }) {
  const data = g.dongTien.xuHuong.map((x) => ({ thang: thangVN(x.thang).slice(0, 2) + '/' + x.thang.slice(2, 4), thu: Number(x.thu), chi: Number(x.chi), traNo: Number(x.traNo), rong: Number(x.rong) }));
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
          <XAxis dataKey="thang" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={(v) => formatVndCompact(v)} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={56} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v: number, k: string) => [formatVnd(v), ({ thu: 'Thu', chi: 'Chi', traNo: 'Trả nợ', rong: 'Ròng' } as Record<string, string>)[k] ?? k]} />
          <Legend formatter={(k: string) => ({ thu: 'Thu', chi: 'Chi tiêu', traNo: 'Trả nợ', rong: 'Dòng tiền ròng' } as Record<string, string>)[k] ?? k} wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="thu" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={22} />
          <Bar dataKey="chi" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={22} />
          <Bar dataKey="traNo" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={22} />
          <Line dataKey="rong" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 3 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Bảng dòng tiền 6 tháng — con số chính xác (biểu đồ chỉ để nhìn xu hướng). */
export function BangDongTien({ g }: { g: GoiPhanTich }) {
  return (
    <KhungCuon>
      <table className="w-full min-w-[520px] text-sm">
        <thead className="text-xs text-text-muted">
          <tr><Th trai>Tháng</Th><Th>Thu</Th><Th>Chi tiêu</Th><Th>Trả nợ</Th><Th>Ròng</Th></tr>
        </thead>
        <tbody>
          {[...g.dongTien.xuHuong].reverse().map((x) => (
            <tr key={x.thang} className="border-t border-[var(--border-color)]">
              <Td trai>{thangVN(x.thang)}{x.thang === g.thang && <span className="ml-1 text-[10px] text-text-muted">(đang chạy)</span>}</Td>
              <Td className="text-neon-green">{tien(x.thu)}</Td>
              <Td className="text-neon-orange">{tien(x.chi)}</Td>
              <Td className="text-neon-red">{tien(x.traNo)}</Td>
              <Td className={cn('font-semibold', Number(x.rong) < 0 ? 'text-neon-red' : 'text-text-primary')}>{tien(x.rong)}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </KhungCuon>
  );
}

// ─── Bảng dùng chung ─────────────────────────────────────────
/** Bảng rộng cuộn NGANG trong khung riêng — trang không bị đẩy tràn trên điện thoại. */
export function KhungCuon({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0', className)}>{children}</div>;
}
export function Th({ children, trai }: { children?: ReactNode; trai?: boolean }) {
  return <th className={cn('whitespace-nowrap px-2.5 py-2 font-medium', trai ? 'text-left' : 'text-right')}>{children}</th>;
}
export function Td({ children, trai, className }: { children?: ReactNode; trai?: boolean; className?: string }) {
  return <td className={cn('whitespace-nowrap px-2.5 py-2 tabular-nums', trai ? 'text-left' : 'text-right', className)}>{children}</td>;
}

// ─── Chi theo nhóm ───────────────────────────────────────────
export function BangChiTheoNhom({ g }: { g: GoiPhanTich }) {
  if (g.chiTieu.nhom.length === 0) return <div className="py-6 text-center text-sm text-text-muted">Chưa có khoản chi nào trong 2 tháng gần đây.</div>;
  return (
    <KhungCuon>
      <table className="w-full min-w-[600px] text-sm">
        <thead className="text-xs text-text-muted">
          <tr><Th trai>Nhóm</Th><Th>Tháng này</Th><Th>Tháng trước</Th><Th>So cùng kỳ</Th><Th trai>Ngân sách</Th></tr>
        </thead>
        <tbody>
          {g.chiTieu.nhom.map((n) => {
            const tang = n.chenhCungKyPct;
            const ns = n.tiLeNganSach;
            return (
              <tr key={n.nhomId} className="border-t border-[var(--border-color)]">
                <Td trai><span className="mr-1">{n.icon}</span>{n.ten}{n.tiTrong != null && <span className="ml-1 text-[11px] text-text-muted">{phanTram(n.tiTrong, 0)}</span>}</Td>
                <Td className="font-medium text-text-primary">{tien(n.thangNay)}</Td>
                <Td className="text-text-muted">{tien(n.thangTruoc)}</Td>
                <Td className={cn(tang == null ? 'text-text-muted' : tang >= 20 ? 'text-neon-red' : tang > 0 ? 'text-neon-orange' : 'text-neon-green')}>
                  {tang == null ? 'mới' : <span className="inline-flex items-center gap-0.5">{tang >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}{phanTram(Math.abs(tang))}</span>}
                </Td>
                <Td trai>
                  {ns == null ? <span className="text-xs text-text-muted">—</span> : (
                    <div className="w-36">
                      <div className="flex justify-between text-[11px]"><span className="text-text-muted">{formatVndCompact(n.nganSach)}</span><span className={ns > 100 ? 'font-semibold text-neon-red' : ns >= 90 ? 'text-neon-orange' : 'text-text-muted'}>{phanTram(ns, 0)}</span></div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[var(--border-color)]"><div className={cn('h-full rounded-full', ns > 100 ? 'bg-neon-red' : ns >= 90 ? 'bg-neon-orange' : 'bg-neon-green')} style={{ width: `${Math.min(100, ns)}%` }} /></div>
                    </div>
                  )}
                </Td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </KhungCuon>
  );
}

// ─── Đầu tư ──────────────────────────────────────────────────
export function BangDauTu({ g }: { g: GoiPhanTich }) {
  const ds = g.dauTu.cacKhoan;
  if (ds.length === 0) return <div className="py-6 text-center text-sm text-text-muted">Chưa có khoản đầu tư nào.</div>;
  const t = g.dauTu.tong;
  return (
    <>
      <div className="mb-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <div><div className="text-xs text-text-muted">Vốn đang giữ</div><div className="font-semibold tabular-nums">{tien(t.vonDangGiu)}</div></div>
        <div><div className="text-xs text-text-muted">Giá trị hiện tại</div><div className="font-semibold tabular-nums">{tien(t.giaTriDangGiu)}</div></div>
        <div><div className="text-xs text-text-muted">Lãi/lỗ tạm tính</div><div className={cn('font-semibold tabular-nums', Number(t.laiLoTamTinh) < 0 ? 'text-neon-red' : 'text-neon-green')}>{tien(t.laiLoTamTinh)} <span className="text-xs">({phanTram(t.tySuatTamTinh)})</span></div></div>
        <div><div className="text-xs text-text-muted">Lãi/lỗ đã chốt</div><div className={cn('font-semibold tabular-nums', Number(t.laiLoDaChot) < 0 ? 'text-neon-red' : 'text-text-primary')}>{tien(t.laiLoDaChot)}</div></div>
      </div>
      <KhungCuon>
        <table className="w-full min-w-[560px] text-sm">
          <thead className="text-xs text-text-muted"><tr><Th trai>Khoản</Th><Th>Vốn</Th><Th>Giá trị</Th><Th>Lãi/lỗ</Th><Th>Tỷ suất</Th></tr></thead>
          <tbody>
            {ds.map((i) => (
              <tr key={i.id} className="border-t border-[var(--border-color)]">
                <Td trai>{i.ten} <span className="text-[11px] text-text-muted">· {i.loai === 'SELF' ? 'bản thân' : i.daChot ? 'đã bán' : 'đang giữ'}{i.tienTe === 'USD' ? ' · $' : ''}</span>{i.chuaCapNhatGia && <span className="ml-1 text-[11px] text-neon-orange">chưa cập nhật giá</span>}</Td>
                <Td>{tien(i.von)}</Td>
                <Td>{i.giaTri == null ? '—' : tien(i.giaTri)}</Td>
                <Td className={i.laiLo == null ? 'text-text-muted' : Number(i.laiLo) < 0 ? 'text-neon-red' : 'text-neon-green'}>{i.laiLo == null ? '—' : tien(i.laiLo)}</Td>
                <Td className={i.tySuat == null ? 'text-text-muted' : i.tySuat < 0 ? 'text-neon-red' : 'text-neon-green'}>{phanTram(i.tySuat)}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </KhungCuon>
    </>
  );
}

// ─── Lịch trả nợ theo tháng ──────────────────────────────────
export function BangLichTheoThang({ g, toiDa = 12 }: { g: GoiPhanTich; toiDa?: number }) {
  const ds = g.no.lichTheoThang.slice(0, toiDa);
  const qh = g.no.thangNay.quaHanThangTruoc;
  if (ds.length === 0 && qh.soKy === 0) return <div className="py-6 text-center text-sm text-text-muted">Không còn kỳ trả nào.</div>;
  return (
    <KhungCuon>
      <table className="w-full min-w-[480px] text-sm">
        <thead className="text-xs text-text-muted"><tr><Th trai>Tháng</Th><Th>Gốc</Th><Th>Lãi</Th><Th>Tổng phải trả</Th><Th>Số kỳ</Th></tr></thead>
        <tbody>
          {qh.soKy > 0 && (
            <tr className="border-t border-[var(--border-color)] bg-neon-red/5 text-neon-red">
              <Td trai>Quá hạn từ tháng trước</Td><Td>{tien(qh.goc)}</Td><Td>{tien(qh.lai)}</Td><Td className="font-semibold">{tien(qh.tong)}</Td><Td>{qh.soKy}</Td>
            </tr>
          )}
          {ds.map((t) => (
            <tr key={t.thang} className={cn('border-t border-[var(--border-color)]', t.thang === g.thang && 'bg-neon-violet/5')}>
              <Td trai>{thangVN(t.thang)}{t.thang === g.thang && Number(t.daTraTrongThang) > 0 && <span className="ml-1 text-[11px] text-neon-green">đã trả {formatVndCompact(t.daTraTrongThang)}</span>}</Td>
              <Td>{tien(t.goc)}</Td>
              <Td className="text-neon-orange">{tien(t.lai)}</Td>
              <Td className="font-semibold text-text-primary">{tien(t.tong)}</Td>
              <Td className="text-text-muted">{t.soKy}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </KhungCuon>
  );
}

// ─── Nên trả khoản nào trước ─────────────────────────────────
const TEN_CHIEN_LUOC: Record<string, { ten: string; mo: string }> = {
  theoLich: { ten: 'Chỉ trả theo lịch', mo: 'Không trả thêm' },
  toiUu: { ten: 'Rẻ nhất', mo: 'Máy thử mọi thứ tự, chọn cách tốn ít lãi + phí nhất' },
  avalanche: { ten: 'Lãi cao trước', mo: 'Dồn tiền vào khoản lãi suất THỰC cao nhất' },
  snowball: { ten: 'Nợ nhỏ trước', mo: 'Đóng khoản dư nợ nhỏ nhất trước cho nhẹ đầu' },
};

export function KhoiChienLuoc({ traThemMacDinh = 0 }: { traThemMacDinh?: number }) {
  const [them, setThem] = useState(traThemMacDinh ? traThemMacDinh.toLocaleString('vi-VN') : '');
  const [motLan, setMotLan] = useState('');
  const [data, setData] = useState<ChienLuocTraNo | null>(null);
  const [dangTai, setDangTai] = useState(false);
  const tinh = useCallback(() => {
    setDangTai(true);
    financeApi.chienLuoc(soTien(them), soTien(motLan)).then(setData).catch(() => toast.error('Không tính được chiến lược')).finally(() => setDangTai(false));
  }, [them, motLan]);
  const daChay = useRef(false);
  useEffect(() => { if (!daChay.current) { daChay.current = true; tinh(); } }, [tinh]);

  const ss = data?.soSanh;
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <Field label="Trả thêm MỖI THÁNG (ngoài lịch)"><input inputMode="numeric" value={them} onChange={(e) => setThem(nhapTien(e.target.value))} className={inputCls} placeholder="vd. 3.000.000" /></Field>
        <Field label="Có sẵn MỘT khoản để trả ngay"><input inputMode="numeric" value={motLan} onChange={(e) => setMotLan(nhapTien(e.target.value))} className={inputCls} placeholder="vd. 20.000.000" /></Field>
        <Button onClick={tinh} disabled={dangTai}><Calculator size={15} /> {dangTai ? 'Đang tính…' : 'Tính'}</Button>
      </div>

      {!ss ? (dangTai ? <Spinner /> : <div className="py-4 text-center text-sm text-text-muted">Không có khoản nợ nào có lịch trả để mô phỏng.</div>) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
            {(['toiUu', 'avalanche', 'snowball', 'theoLich'] as const).map((k) => {
              const x: KetQuaMoPhong = ss[k];
              const deXuat = k === 'toiUu' && ss.deXuat;
              const tk = Number(x.tietKiemSoVoiLich ?? 0);
              return (
                <div key={k} className={cn('rounded-2xl border p-3.5', deXuat ? 'border-neon-green/50 bg-neon-green/5' : 'border-[var(--border-color)]')}>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-text-primary">{deXuat && <Trophy size={14} className="text-neon-green" />}{TEN_CHIEN_LUOC[k].ten}</div>
                  <div className="text-[11px] text-text-muted">{TEN_CHIEN_LUOC[k].mo}</div>
                  <div className="mt-2 space-y-0.5 text-sm">
                    <div className="flex justify-between gap-2"><span className="text-text-muted">Tổng lãi còn trả</span><span className="font-semibold tabular-nums text-neon-orange">{tien(x.tongLai)}</span></div>
                    {Number(x.tongPhi) > 0 && <div className="flex justify-between gap-2"><span className="text-text-muted">Phí trả trước</span><span className="tabular-nums">{tien(x.tongPhi)}</span></div>}
                    <div className="flex justify-between gap-2"><span className="text-text-muted">Hết nợ</span><span className="font-semibold tabular-nums">{thangVN(x.thangHetNo)} · {x.soThang} tháng</span></div>
                    {k !== 'theoLich' && <div className="flex justify-between gap-2"><span className="text-text-muted">Tiết kiệm</span><span className={cn('font-semibold tabular-nums', tk > 0 ? 'text-neon-green' : 'text-text-muted')}>{tien(x.tietKiemSoVoiLich)}{(x.somHonThang ?? 0) > 0 && <span className="text-xs font-normal"> · sớm {x.somHonThang} th</span>}</span></div>}
                  </div>
                  {k !== 'theoLich' && x.thuTu.length > 0 && (
                    <ol className="mt-2 space-y-0.5 border-t border-[var(--border-color)] pt-2 text-xs text-text-secondary">
                      {x.thuTu.map((t, i) => {
                        const kh = x.tungKhoan.find((z) => z.id === t.id);
                        return <li key={t.id} className="flex justify-between gap-2"><span className="truncate">{i + 1}. {t.ten}</span><span className="shrink-0 text-text-muted">{thangVN(kh?.thangTatToan)}</span></li>;
                      })}
                    </ol>
                  )}
                </div>
              );
            })}
          </div>
          {!ss.deXuat && <div className="rounded-xl bg-neon-violet/10 px-3 py-2 text-sm text-neon-violet">Nhập số tiền trả thêm mỗi tháng để so sánh các cách ưu tiên — không trả thêm thì mọi cách đều như trả theo lịch.</div>}
          {data?.traMotLan && data.traMotLan.xepHang.length > 0 && (
            <div>
              <div className="mb-2 text-sm font-semibold text-text-primary">Dồn {tien(data.traMotLan.soTien)} vào khoản nào lợi nhất?</div>
              <KhungCuon>
                <table className="w-full min-w-[520px] text-sm">
                  <thead className="text-xs text-text-muted"><tr><Th trai>Khoản</Th><Th>Dùng được</Th><Th>Tiết kiệm lãi + phí</Th><Th>Tất toán</Th></tr></thead>
                  <tbody>
                    {data.traMotLan.xepHang.map((h, i) => (
                      <tr key={h.id} className={cn('border-t border-[var(--border-color)]', i === 0 && 'bg-neon-green/5')}>
                        <Td trai>{i === 0 && <Trophy size={12} className="mr-1 inline text-neon-green" />}{h.ten}{h.dongKhoanLuon && <span className="ml-1 text-[11px] text-neon-green">đóng luôn</span>}</Td>
                        <Td>{tien(h.tienDungDuoc)}</Td>
                        <Td className={Number(h.tietKiem) > 0 ? 'font-semibold text-neon-green' : 'text-text-muted'}>{tien(h.tietKiem)}</Td>
                        <Td className="text-text-muted">{thangVN(h.thangTatToanCu)} → <span className="text-text-primary">{thangVN(h.thangTatToanMoi)}</span></Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </KhungCuon>
            </div>
          )}
          <details className="text-xs text-text-muted">
            <summary className="cursor-pointer select-none">Cách tính & giả định</summary>
            <ul className="mt-1 list-disc space-y-0.5 pl-5">
              {ss.giaDinh.map((x, i) => <li key={i}>{x}</li>)}
              {data!.khoanChuaKhaiPhi.length > 0 && <li className="text-neon-orange">Chưa khai phí trả trước hạn: {data!.khoanChuaKhaiPhi.join(', ')} — đang tính phí = 0.</li>}
              {data!.loaiKhoiMoPhong.map((x, i) => <li key={`l${i}`} className="text-neon-orange">Không mô phỏng: {x}</li>)}
              {data!.thieuDuLieu.map((x, i) => <li key={`t${i}`} className="text-neon-orange">{x}</li>)}
            </ul>
          </details>
        </>
      )}
    </div>
  );
}

// ─── Tất toán sớm (một khoản) ────────────────────────────────
function homNayVN() { return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date()); }

export function KhoiTatToan({ debtId, tienTe, onDaGhi }: { debtId: number; tienTe?: string; onDaGhi: () => void }) {
  const [ngay, setNgay] = useState(homNayVN());
  const [kq, setKq] = useState<KetQuaTatToan | null>(null);
  const [loi, setLoi] = useState<string | null>(null);
  const [dangTai, setDangTai] = useState(false);
  const [xacNhan, setXacNhan] = useState(false);
  const [vi, setVi] = useState<Wallet[]>([]);
  const [viId, setViId] = useState<number | null>(null);
  const [dangGhi, setDangGhi] = useState(false);

  useEffect(() => {
    setDangTai(true); setLoi(null);
    financeApi.xemTatToan(debtId, ngay).then(setKq).catch((e) => { setKq(null); setLoi(e?.response?.data?.message ?? 'Không tính được'); }).finally(() => setDangTai(false));
  }, [debtId, ngay]);
  useEffect(() => { if (xacNhan && vi.length === 0) financeApi.listWallets().then((w) => { setVi(w); setViId(w[0]?.id ?? null); }).catch(() => undefined); }, [xacNhan, vi.length]);

  const ghi = async () => {
    setDangGhi(true);
    try { await financeApi.ghiTatToan(debtId, { ngay, walletId: viId }); toast.success('Đã ghi nhận tất toán'); setXacNhan(false); onDaGhi(); }
    catch (e) { toast.error((e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Ghi thất bại'); }
    finally { setDangGhi(false); }
  };

  const te = kq?.tienTe ?? tienTe;
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end gap-3">
        <Field label="Tất toán vào ngày"><input type="date" value={ngay} min={homNayVN()} onChange={(e) => setNgay(e.target.value)} className={cn(inputCls, 'w-44')} /></Field>
        {dangTai && <span className="pb-2 text-xs text-text-muted">Đang tính…</span>}
      </div>
      {loi && <div className="text-sm text-neon-orange">{loi}</div>}
      {kq && kq.soKyBoQua > 0 && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl bg-[var(--border-color)]/40 p-3"><div className="text-xs text-text-muted">Cần chi để đóng khoản</div><div className="font-heading text-lg font-bold tabular-nums">{tien(kq.chiPhiTatToan, te)}</div><div className="text-[11px] text-text-muted">gốc {tien(kq.gocTatToan, te)} + lãi dồn {tien(kq.laiDonKyDangChay, te)}{Number(kq.phiTraTruoc) > 0 && <> + phí {tien(kq.phiTraTruoc, te)}</>}</div></div>
            <div className="rounded-xl bg-[var(--border-color)]/40 p-3"><div className="text-xs text-text-muted">Nếu trả theo lịch ({kq.soKyBoQua} kỳ)</div><div className="font-heading text-lg font-bold tabular-nums">{tien(kq.neuTraTheoLich, te)}</div></div>
            <div className="rounded-xl bg-neon-green/10 p-3"><div className="text-xs text-neon-green">Tiết kiệm</div><div className="font-heading text-lg font-bold tabular-nums text-neon-green">{tien(kq.tietKiem, te)}</div></div>
            <div className="rounded-xl bg-[var(--border-color)]/40 p-3"><div className="text-xs text-text-muted">Tổng chi hôm đó</div><div className="font-heading text-lg font-bold tabular-nums">{tien(kq.tongCanChi, te)}</div>{kq.kyDenHanPhaiTra.soKy > 0 && <div className="text-[11px] text-neon-red">gồm {kq.kyDenHanPhaiTra.soKy} kỳ đã tới hạn {tien(kq.kyDenHanPhaiTra.soTien, te)}</div>}</div>
          </div>
          <ul className="list-disc space-y-0.5 pl-5 text-xs text-text-muted">{kq.giaDinh.map((g, i) => <li key={i} className={g.startsWith('Chưa khai') ? 'text-neon-orange' : ''}>{g}</li>)}</ul>
          {!xacNhan ? (
            <Button variant="outline" onClick={() => setXacNhan(true)}>Tôi đã tất toán khoản này…</Button>
          ) : (
            <div className="space-y-2 rounded-xl border border-neon-violet/40 p-3">
              <div className="text-sm text-text-secondary">Ghi nhận: các kỳ còn lại được thay bằng một kỳ &ldquo;Tất toán&rdquo; {tien(kq.chiPhiTatToan, te)} ngày {ngayVN(ngay)}. {kq.kyDenHanPhaiTra.soKy > 0 && <b className="text-neon-red">Hãy tích trả các kỳ đã tới hạn trước.</b>}</div>
              <div className="flex flex-wrap gap-1.5">
                <button onClick={() => setViId(null)} className={cn('rounded-full border px-3 py-1 text-sm', viId === null ? 'border-neon-violet bg-neon-violet/15 text-neon-violet' : 'border-[var(--border-color)] text-text-secondary')}>Không trừ ví</button>
                {vi.map((w) => <button key={w.id} onClick={() => setViId(w.id)} className={cn('rounded-full border px-3 py-1 text-sm', viId === w.id ? 'border-neon-cyan bg-neon-cyan/15 text-neon-cyan' : 'border-[var(--border-color)] text-text-secondary')}>{w.icon} {w.name}</button>)}
              </div>
              <div className="flex gap-2"><Button variant="ghost" onClick={() => setXacNhan(false)}>Huỷ</Button><Button onClick={ghi} disabled={dangGhi || kq.kyDenHanPhaiTra.soKy > 0}>{dangGhi ? 'Đang ghi…' : 'Xác nhận đã tất toán'}</Button></div>
            </div>
          )}
        </>
      )}
      {kq && kq.soKyBoQua === 0 && <div className="text-sm text-text-muted">{kq.giaDinh[kq.giaDinh.length - 1]}</div>}
    </div>
  );
}

// ─── Cố vấn AI ───────────────────────────────────────────────
function ChuAI({ chu }: { chu: string }) {
  return (
    <div className="prose-sm max-w-none text-sm leading-relaxed text-text-primary [&_li]:my-0.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-1.5 [&_strong]:font-semibold [&_strong]:text-text-primary [&_ul]:list-disc [&_ul]:pl-5 [&_em]:text-neon-orange">
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{chu}</ReactMarkdown>
    </div>
  );
}

const GOI_Y_MAC_DINH = [
  'Tổng nợ và tổng tiền lãi tôi còn phải trả là bao nhiêu?',
  'Nên ưu tiên trả khoản nợ nào trước?',
  'Tất toán sớm khoản nào thì tiết kiệm nhiều nhất?',
  'Tháng này tôi tiêu quá tay chỗ nào?',
];

export function CoVanAI({ gon }: { gon?: boolean }) {
  const [tomTat, setTomTat] = useState<TraLoiCoVan | null>(null);
  const [dangTomTat, setDangTomTat] = useState(false);
  const [hoiThoai, setHoiThoai] = useState<Array<{ toi: boolean; chu: string; kiem?: TraLoiCoVan['kiemSo'] }>>([]);
  const [cau, setCau] = useState('');
  const [dangHoi, setDangHoi] = useState(false);
  const cuoi = useRef<HTMLDivElement>(null);

  const layTomTat = useCallback(() => {
    setDangTomTat(true);
    financeApi.aiTomTat().then(setTomTat).catch(() => setTomTat({ nhanXet: null, lyDo: 'loi' })).finally(() => setDangTomTat(false));
  }, []);
  useEffect(() => { layTomTat(); }, [layTomTat]);
  useEffect(() => { cuoi.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, [hoiThoai.length, dangHoi]);

  const hoi = async (c: string) => {
    const t = c.trim();
    if (t.length < 2 || dangHoi) return;
    setCau('');
    setHoiThoai((h) => [...h, { toi: true, chu: t }]);
    setDangHoi(true);
    try {
      const kq = await financeApi.aiHoi(t);
      setHoiThoai((h) => [...h, { toi: false, chu: kq.traLoi ?? (kq.lyDo === 'ai_unavailable' ? 'Phần trả lời bằng AI đang tắt trên máy chủ — các con số ở trang Phân tích vẫn đúng.' : 'Chưa có câu trả lời.'), kiem: kq.kiemSo }]);
    } catch (e) {
      setHoiThoai((h) => [...h, { toi: false, chu: (e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Không hỏi được, thử lại sau.' }]);
    } finally { setDangHoi(false); }
  };

  const goiY = tomTat?.goiY?.length ? tomTat.goiY : GOI_Y_MAC_DINH;
  return (
    <Card className="flex flex-col p-0">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] px-4 py-3">
        <div className="flex items-center gap-2 font-semibold text-text-primary"><Sparkles size={16} className="text-neon-violet" /> Cố vấn AI</div>
        <button onClick={layTomTat} disabled={dangTomTat} className="rounded-lg p-1.5 text-text-muted hover:text-neon-violet disabled:opacity-50" title="Nhận xét lại"><RefreshCw size={15} className={dangTomTat ? 'animate-spin' : ''} /></button>
      </div>
      <div className={cn('space-y-3 overflow-y-auto px-4 py-3', gon ? 'max-h-[420px]' : 'max-h-[640px]')}>
        {dangTomTat && !tomTat ? <div className="flex items-center gap-2 text-sm text-text-muted"><div className="h-4 w-4 animate-spin rounded-full border-2 border-neon-violet border-t-transparent" /> AI đang đọc số liệu của bạn…</div>
          : tomTat?.nhanXet ? <ChuAI chu={tomTat.nhanXet} />
          : <div className="text-sm text-text-muted">{tomTat?.lyDo === 'ai_unavailable' ? 'Phần nhận xét bằng AI đang tắt. Các con số trong trang vẫn do máy tính chính xác.' : 'Chưa có nhận xét.'}</div>}
        {hoiThoai.map((d, i) => (
          <div key={i} className={cn('flex', d.toi ? 'justify-end' : 'justify-start')}>
            <div className={cn('max-w-[92%] rounded-2xl px-3 py-2', d.toi ? 'bg-neon-violet text-sm text-white' : 'bg-[var(--border-color)]/40')}>
              {d.toi ? d.chu : <ChuAI chu={d.chu} />}
              {!d.toi && d.kiem && (d.kiem.hopLe
                ? <div className="mt-1 text-[10px] text-text-muted">✓ {d.kiem.soDaKiem} con số đã đối chiếu với bảng tính của ứng dụng</div>
                : <div className="mt-1 text-[11px] text-neon-orange">Có số không khớp bảng tính: {d.kiem.soKhongKhop.join(', ')}</div>)}
            </div>
          </div>
        ))}
        {dangHoi && <div className="flex items-center gap-2 text-xs text-text-muted"><div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-neon-violet border-t-transparent" /> Đang xem số liệu…</div>}
        {hoiThoai.length === 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {goiY.map((g) => <button key={g} onClick={() => hoi(g)} disabled={dangHoi} className="rounded-full border border-[var(--border-color)] px-3 py-1.5 text-left text-xs text-text-secondary transition-colors hover:border-neon-violet/50 hover:text-neon-violet disabled:opacity-50">{g}</button>)}
          </div>
        )}
        <div ref={cuoi} />
      </div>
      <form onSubmit={(e) => { e.preventDefault(); hoi(cau); }} className="flex items-end gap-2 border-t border-[var(--border-color)] p-3">
        <textarea value={cau} onChange={(e) => setCau(e.target.value)} rows={1} maxLength={500}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); hoi(cau); } }}
          placeholder="Hỏi về tiền của bạn… (vd. mỗi tháng trả thêm 2 triệu thì bao lâu hết nợ?)" className={cn(inputCls, 'max-h-28 min-h-[40px] resize-none')} />
        <button type="submit" disabled={dangHoi || cau.trim().length < 2} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neon-violet text-white disabled:opacity-40" aria-label="Gửi"><Send size={16} /></button>
      </form>
      <div className="px-4 pb-3 text-[10px] text-text-muted">AI chỉ diễn giải bảng số do ứng dụng tính; mọi con số trong câu trả lời được đối chiếu tự động. Không phải lời khuyên đầu tư.</div>
    </Card>
  );
}
