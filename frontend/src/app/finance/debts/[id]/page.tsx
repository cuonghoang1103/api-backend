'use client';
/**
 * Chi tiết khoản nợ (nâng cấp 28/09/2026): số tổng do máy chủ tính (gốc còn,
 * lãi đã trả / còn phải trả, ngày tất toán dự kiến, lãi suất danh nghĩa và
 * THỰC), lịch từng kỳ có cột dư nợ còn lại + trạng thái theo ngày Việt Nam,
 * mô phỏng tất toán sớm (và ghi nhận), sửa phí trả trước hạn tại chỗ.
 */
import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowLeft, Pencil, Trash2, RotateCcw, AlertTriangle } from 'lucide-react';
import { financeApi, interestLabel, LENDER_TYPE_LABELS, INTEREST_TYPE_LABELS, type Debt, type ScheduleItem, type DongLich } from '@/lib/finance-api';
import { cn } from '@/lib/utils';
import { FinanceShell } from '@/components/finance/FinanceShell';
import { Card, Sheet, Spinner, ProgressBar, inputCls } from '@/components/finance/primitives';
import { PayScheduleSheet, DebtStatusPill, DebtForm } from '@/components/finance/debt-ui';
import { DebtBalanceChart } from '@/components/finance/charts';
import { KhoiTatToan, KhungCuon, Th, Td, tien, ngayVN, phanTram } from '@/components/finance/phan-tich-ui';

const NHAN_TRANG_THAI: Record<DongLich['trangThai'], string> = { DA_TRA: 'Đã trả', QUA_HAN: 'Quá hạn', HOM_NAY: 'Hôm nay', CHUA_DEN: '' };

export default function DebtDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [debt, setDebt] = useState<Debt | null>(null);
  const [loading, setLoading] = useState(true);
  const [payItem, setPayItem] = useState<ScheduleItem | null>(null);
  const [editing, setEditing] = useState(false);
  const [phi, setPhi] = useState<string | null>(null);

  const load = useCallback(() => {
    financeApi.getDebt(id).then(setDebt).catch(() => undefined).finally(() => setLoading(false));
  }, [id]);
  useEffect(() => { load(); }, [load]);

  if (loading && !debt) return <FinanceShell><Spinner /></FinanceShell>;
  if (!debt) return <FinanceShell><div className="py-10 text-center text-text-muted">Không tìm thấy khoản nợ</div></FinanceShell>;

  const p = debt.phanTich;
  const te = debt.currency;
  const lich = p?.lich ?? [];
  const schedule = debt.schedule ?? [];
  const byId = new Map(schedule.map((s) => [s.id, s]));
  const balanceSeries = lich.map((k) => ({ label: `K${k.ky}`, remaining: Number(k.duNoSau) }));

  const unpay = async (itemId: number) => {
    if (!confirm('Hoàn tác thanh toán kỳ này?')) return;
    try { const d = await financeApi.unpayScheduleItem(id, itemId); setDebt(d); toast.success('Đã hoàn tác'); } catch { toast.error('Thất bại'); }
  };
  const luuPhi = async () => {
    if (phi == null) return;
    try { const d = await financeApi.updateDebt(id, { prepayFeePct: phi === '' ? null : Number(phi.replace(',', '.')) }); setDebt(d); setPhi(null); toast.success('Đã lưu phí trả trước hạn'); }
    catch (e) { toast.error((e as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Lưu thất bại'); }
  };

  return (
    <FinanceShell onQuickAddSuccess={load}>
      <Link href="/finance/debts" className="mb-3 inline-flex items-center gap-1 text-sm text-text-muted hover:text-neon-violet"><ArrowLeft size={15} /> Khoản nợ</Link>

      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-heading text-2xl font-bold text-text-primary">{debt.lenderName}</h1>
            <DebtStatusPill status={debt.status} />
            {te === 'USD' && <span className="rounded-full bg-neon-cyan/15 px-2 py-0.5 text-xs font-medium text-neon-cyan">USD</span>}
          </div>
          <div className="text-sm text-text-muted">{LENDER_TYPE_LABELS[debt.lenderType]} · {INTEREST_TYPE_LABELS[debt.interestType] ?? debt.interestType}</div>
          <div className="mt-0.5 text-sm text-text-secondary">{interestLabel(debt)}</div>
        </div>
        <div className="flex gap-1">
          <button onClick={() => setEditing(true)} className="rounded-lg p-2 text-text-muted hover:text-neon-violet" title="Sửa"><Pencil size={16} /></button>
          <button onClick={async () => { if (confirm('Xoá khoản nợ này?')) { await financeApi.deleteDebt(id); toast.success('Đã xoá'); router.push('/finance/debts'); } }} className="rounded-lg p-2 text-text-muted hover:text-neon-red" title="Xoá"><Trash2 size={16} /></button>
        </div>
      </div>

      {p && p.quaHan.soKy > 0 && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-neon-red/40 bg-neon-red/10 px-3 py-2.5 text-sm font-medium text-neon-red">
          <AlertTriangle size={16} className="shrink-0" /> Quá hạn {p.quaHan.lauNhatNgay} ngày — {p.quaHan.soKy} kỳ chưa trả, tổng {tien(p.quaHan.soTien, te)} (gốc {tien(p.quaHan.goc, te)}, lãi {tien(p.quaHan.lai, te)}).
        </div>
      )}

      {/* Tổng */}
      <Card className="mb-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div><span className="font-heading text-2xl font-bold tabular-nums text-neon-red">{tien(p?.gocConLai ?? debt.computed?.remaining, te)}</span> <span className="text-sm text-text-muted">gốc còn lại / {tien(debt.principal, te)}</span></div>
          {p && <span className="text-sm text-text-muted">{p.soKyDaTra}/{p.soKy} kỳ đã trả</span>}
        </div>
        <div className="mt-2"><ProgressBar ratio={p && Number(p.gocBanDau) > 0 ? (Number(p.gocDaTra) / Number(p.gocBanDau)) * 100 : 0} status="ok" /></div>
        {p && (
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3 lg:grid-cols-6">
            <O nhan="Lãi đã trả" giaTri={tien(p.laiDaTra, te)} />
            <O nhan="Lãi còn phải trả" giaTri={tien(p.laiConPhaiTra, te)} mau="text-neon-orange" />
            <O nhan="Tổng còn phải trả" giaTri={tien(p.tongConPhaiTra, te)} />
            <O nhan="Tổng lãi cả khoản" giaTri={tien(p.tongLaiCaKhoan, te)} phu={`trên gốc ${tien(p.gocBanDau, te)}`} />
            <O nhan="Tất toán theo lịch" giaTri={ngayVN(p.ngayTatToanDuKien)} mau="text-neon-violet" />
            <O nhan="Kỳ tới" giaTri={p.kyToi ? tien(p.kyToi.tong, te) : '—'} phu={p.kyToi ? `${ngayVN(p.kyToi.ngay)} · lãi ${tien(p.kyToi.lai, te)}` : undefined} />
          </div>
        )}
        {p && (
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-[var(--border-color)] pt-3 text-sm">
            <div><span className="text-text-muted">Lãi danh nghĩa: </span><b>{phanTram(Number(p.laiSuat.danhNghiaThang), 4)}/tháng</b> <span className="text-text-muted">({phanTram(Number(p.laiSuat.danhNghiaNam), 2)}/năm)</span></div>
            {p.laiSuat.thucThang != null && (
              <div title="Lãi suất thực (IRR) tính từ đúng lịch trả — dùng để so các khoản khác kiểu lãi với nhau">
                <span className="text-text-muted">Lãi suất thực: </span>
                <b className={Number(p.laiSuat.thucThang) > Number(p.laiSuat.danhNghiaThang) + 0.01 ? 'text-neon-red' : ''}>{phanTram(Number(p.laiSuat.thucThang), 2)}/tháng</b>
                <span className="text-text-muted"> ({phanTram(Number(p.laiSuat.thucNam), 1)}/năm)</span>
                {debt.interestType === 'FLAT_MONTHLY' && <span className="ml-1 text-xs text-neon-orange">lãi phẳng đắt hơn con số trên hợp đồng</span>}
              </div>
            )}
            {p.laiMoiNgay && <div><span className="text-text-muted">Lãi mỗi ngày: </span><b>{tien(p.laiMoiNgay, te)}</b></div>}
            <div className="flex items-center gap-1.5">
              <span className="text-text-muted">Phí trả trước hạn:</span>
              {phi === null ? (
                <button onClick={() => setPhi(debt.prepayFeePct == null ? '' : String(Number(debt.prepayFeePct)))} className={cn('font-semibold hover:underline', debt.prepayFeePct == null ? 'text-neon-orange' : '')}>{debt.prepayFeePct == null ? 'chưa khai — bấm để khai' : `${Number(debt.prepayFeePct).toLocaleString('vi-VN')}% · sửa`}</button>
              ) : (
                <span className="flex items-center gap-1"><input autoFocus inputMode="decimal" value={phi} onChange={(e) => setPhi(e.target.value.replace(/[^\d.,]/g, ''))} className={cn(inputCls, 'h-8 w-20 py-1')} placeholder="%" /><span>%</span><button onClick={luuPhi} className="rounded-lg bg-neon-violet px-2 py-1 text-xs text-white">Lưu</button><button onClick={() => setPhi(null)} className="text-xs text-text-muted">Huỷ</button></span>
              )}
            </div>
          </div>
        )}
        {p && Number(p.chenhLechThucTra) !== 0 && (
          <div className="mt-3 text-xs text-text-muted">Tổng đã trả thực tế {tien(p.daTraThucTe, te)} — {Number(p.chenhLechThucTra) > 0 ? 'nhiều' : 'ít'} hơn lịch {tien(String(Math.abs(Number(p.chenhLechThucTra))), te)}.</div>
        )}
        {p?.thieuDuLieu.map((x, i) => <div key={i} className="mt-2 text-sm text-neon-orange">{x}</div>)}
        {debt.attachmentUrl && <a href={debt.attachmentUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs text-neon-violet hover:underline">📎 Xem ảnh hợp đồng</a>}
      </Card>

      {/* Tất toán sớm */}
      {p && !p.daTatToan && p.soKyConLai > 0 && (
        <Card className="mb-4">
          <div className="mb-1 text-sm font-semibold text-text-primary">Tất toán sớm thì tiết kiệm bao nhiêu?</div>
          <div className="mb-3 text-xs text-text-muted">Chọn ngày muốn đóng khoản — máy tính gốc còn lại, lãi dồn của kỳ đang chạy và phí trả trước (nếu đã khai).</div>
          <KhoiTatToan debtId={id} tienTe={te} onDaGhi={load} />
        </Card>
      )}

      {/* Lịch từng kỳ */}
      {lich.length > 0 && (
        <Card className="mb-4 overflow-hidden p-0">
          <div className="border-b border-[var(--border-color)] px-4 py-2.5 text-sm font-semibold text-text-primary">Lịch trả từng kỳ</div>
          <div className="max-h-[520px] overflow-auto">
            <KhungCuon className="mx-0 px-0">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="sticky top-0 z-[1] bg-[var(--bg-card)] text-xs text-text-muted">
                  <tr><Th trai>Kỳ</Th><Th trai>Đến hạn</Th><Th>Gốc</Th><Th>Lãi</Th><Th>Tổng</Th><Th>Dư nợ còn lại</Th><Th>Trả</Th></tr>
                </thead>
                <tbody>
                  {lich.map((k) => {
                    const s = k.id ? byId.get(k.id) : undefined;
                    const daTra = k.trangThai === 'DA_TRA';
                    return (
                      <tr key={k.ky} className={cn('border-t border-[var(--border-color)]', daTra && 'bg-neon-green/5 text-text-muted', k.trangThai === 'QUA_HAN' && 'bg-neon-red/5', k.trangThai === 'HOM_NAY' && 'bg-neon-orange/5')}>
                        <Td trai>{k.ky}</Td>
                        <Td trai>
                          <span className={cn(k.trangThai === 'QUA_HAN' && 'font-medium text-neon-red', k.trangThai === 'HOM_NAY' && 'font-medium text-neon-orange')}>{ngayVN(k.ngay)}</span>
                          {k.trangThai === 'QUA_HAN' && <span className="ml-1.5 rounded-full bg-neon-red/15 px-1.5 py-0.5 text-[10px] font-semibold text-neon-red">quá {k.soNgayQuaHan} ngày</span>}
                          {k.trangThai === 'HOM_NAY' && <span className="ml-1.5 rounded-full bg-neon-orange/15 px-1.5 py-0.5 text-[10px] font-semibold text-neon-orange">{NHAN_TRANG_THAI.HOM_NAY}</span>}
                          {k.trangThai === 'CHUA_DEN' && k.soNgayQuaHan >= -7 && <span className="ml-1.5 text-[10px] text-neon-orange">còn {-k.soNgayQuaHan} ngày</span>}
                        </Td>
                        <Td>{tien(k.goc, te)}</Td>
                        <Td className={daTra ? '' : 'text-neon-orange'}>{tien(k.lai, te)}</Td>
                        <Td className="font-medium">{tien(k.tong, te)}</Td>
                        <Td className="text-text-secondary">{tien(k.duNoSau, te)}</Td>
                        <Td>
                          {daTra ? (
                            <button onClick={() => k.id && unpay(k.id)} className="inline-flex items-center gap-1 text-xs text-neon-green hover:text-neon-red" title="Hoàn tác"><RotateCcw size={13} /> {NHAN_TRANG_THAI.DA_TRA}</button>
                          ) : s ? (
                            <button onClick={() => setPayItem(s)} className="rounded-lg bg-neon-green/15 px-2 py-1 text-xs font-medium text-neon-green hover:bg-neon-green/25">Trả kỳ này</button>
                          ) : null}
                        </Td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </KhungCuon>
          </div>
        </Card>
      )}

      {balanceSeries.length > 1 && (
        <Card className="mb-4">
          <div className="mb-2 text-sm font-semibold text-text-primary">Dư nợ gốc theo lịch</div>
          <DebtBalanceChart data={balanceSeries} />
        </Card>
      )}

      {(debt.payments?.length ?? 0) > 0 && (
        <Card className="overflow-hidden p-0">
          <div className="border-b border-[var(--border-color)] px-4 py-2.5 text-sm font-semibold text-text-primary">Lịch sử thanh toán</div>
          <div className="divide-y divide-[var(--border-color)]">
            {debt.payments!.map((pm) => (
              <div key={pm.id} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                <span className="min-w-0 text-text-secondary">{ngayVN(pm.date)} {pm.note && <span className="text-text-muted">· {pm.note}</span>}</span>
                <span className="shrink-0 font-medium tabular-nums text-neon-green">-{tien(pm.amount, te)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <PayScheduleSheet open={!!payItem} onClose={() => setPayItem(null)} debtId={id} item={payItem} currency={te} onPaid={(d) => { setDebt(d); setPayItem(null); }} />
      {editing && (
        <Sheet open onClose={() => setEditing(false)} title="Sửa khoản nợ" size="lg">
          <DebtForm initial={debt} onSaved={(d) => { setDebt(d); setEditing(false); }} onCancel={() => setEditing(false)} />
        </Sheet>
      )}
    </FinanceShell>
  );
}

function O({ nhan, giaTri, phu, mau }: { nhan: string; giaTri: string; phu?: string; mau?: string }) {
  return (
    <div className="min-w-0">
      <div className="truncate text-xs text-text-muted">{nhan}</div>
      <div className={cn('truncate font-semibold tabular-nums', mau ?? 'text-text-primary')}>{giaTri}</div>
      {phu && <div className="truncate text-[11px] text-text-muted">{phu}</div>}
    </div>
  );
}
