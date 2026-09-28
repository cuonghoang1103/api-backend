'use client';
/**
 * Khoản nợ — tổng quan nợ ĐÃ TÍNH SẴN ở máy chủ (28/09/2026):
 *   · gốc còn lại, lãi còn phải trả, tổng còn phải trả, tháng này phải trả,
 *     ngày hết nợ; cảnh báo quá hạn / sắp đến hạn (theo ngày Việt Nam)
 *   · lịch phải trả từng tháng (gốc, lãi, tổng)
 *   · "Nên trả khoản nào trước" — mô phỏng trả thêm mỗi tháng / trả một lần
 *   · tất toán hôm nay: mỗi khoản tiết kiệm được bao nhiêu
 *   · thẻ từng khoản (lãi suất thực, lãi còn phải trả, kỳ tới)
 */
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, CalendarDays, CreditCard, AlertTriangle } from 'lucide-react';
import { financeApi, type Debt, type GoiPhanTich, LENDER_TYPE_LABELS, interestLabel } from '@/lib/finance-api';
import { cn } from '@/lib/utils';
import { FinanceShell } from '@/components/finance/FinanceShell';
import { Card, Button, Sheet, Spinner, EmptyState, ProgressBar } from '@/components/finance/primitives';
import { DebtForm, DebtStatusPill } from '@/components/finance/debt-ui';
import {
  DanhSachCanhBao, OChiSo, BangLichTheoThang, KhoiChienLuoc, KhungCuon, Th, Td, tien, ngayVN, phanTram,
} from '@/components/finance/phan-tich-ui';

export default function DebtsPage() {
  const router = useRouter();
  const [debts, setDebts] = useState<Debt[]>([]);
  const [g, setG] = useState<GoiPhanTich | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const load = useCallback(() => {
    Promise.all([financeApi.listDebts(), financeApi.phanTich()])
      .then(([d, p]) => { setDebts(d); setG(p); })
      .catch(() => undefined).finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const canhBaoNo = g?.canhBao.filter((c) => ['qua_han', 'sap_han', 'tra_du', 'dti'].includes(c.ma)) ?? [];
  // Trả thêm gợi ý = dòng tiền ròng bình quân còn dư (nếu dương) — để khối
  // chiến lược mở ra đã có con số thật của người dùng, không phải số bịa.
  const rongBQ = g && g.chiSo.thuBinhQuan3Thang && g.chiSo.chiBinhQuan3Thang && g.chiSo.traNoBinhQuan3Thang
    ? Number(g.chiSo.thuBinhQuan3Thang) - Number(g.chiSo.chiBinhQuan3Thang) - Number(g.chiSo.traNoBinhQuan3Thang) : 0;
  const traThemGoiY = rongBQ > 100_000 ? Math.floor(rongBQ / 100_000) * 100_000 : 0;

  return (
    <FinanceShell onQuickAddSuccess={load}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h1 className="font-heading text-2xl font-bold text-text-primary">Khoản nợ</h1>
        <div className="flex gap-2">
          <Link href="/finance/debts/calendar" className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-color)] px-3 py-2 text-sm text-text-secondary hover:border-neon-violet/50"><CalendarDays size={15} /> Lịch</Link>
          <Button onClick={() => setCreating(true)}><Plus size={15} /> Thêm nợ</Button>
        </div>
      </div>

      {loading && !g ? <Spinner /> : debts.length === 0 ? (
        <EmptyState icon="💳" title="Chưa có khoản nợ nào" hint="Thêm khoản vay để theo dõi lịch trả, tiền lãi và cách trả nhanh nhất." action={<Button onClick={() => setCreating(true)}><Plus size={15} /> Thêm nợ</Button>} />
      ) : (
        <div className="space-y-4">
          {g && (
            <>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
                <OChiSo nhan="Gốc còn lại" tone="red" giaTri={tien(g.no.tong.gocConLai)} phu={`${g.no.tong.soKhoanDangNo} khoản · gốc vay ${tien(g.no.tong.gocBanDau)}`} />
                <OChiSo nhan="Lãi còn phải trả" tone="orange" giaTri={tien(g.no.tong.laiConPhaiTra)} phu={<>Tổng lãi cả các khoản {tien(g.no.tong.tongLaiCaKhoan)}</>} />
                <OChiSo nhan="Tổng còn phải trả" giaTri={tien(g.no.tong.tongConPhaiTra)} phu="Gốc + lãi theo lịch" />
                <OChiSo nhan="Tháng này còn phải trả" tone={Number(g.no.thangNay.conPhaiTra) > 0 ? 'orange' : 'green'} giaTri={tien(g.no.thangNay.conPhaiTra)} phu={<>Lãi {tien(g.no.thangNay.laiTrongDo)} · đã trả {tien(g.no.thangNay.daTra)}</>} />
                <OChiSo nhan="Hết nợ theo lịch" tone="violet" giaTri={ngayVN(g.no.tong.ngayHetNo)} phu={<>Đã trả lãi tới nay {tien(g.no.tong.laiDaTra)}</>} />
              </div>

              <DanhSachCanhBao ds={canhBaoNo} />

              <Card>
                <div className="mb-2 text-sm font-semibold text-text-primary">Phải trả từng tháng</div>
                <BangLichTheoThang g={g} toiDa={24} />
              </Card>

              <Card>
                <div className="mb-1 text-sm font-semibold text-text-primary">Nên trả khoản nào trước?</div>
                <div className="mb-3 text-xs text-text-muted">Mô phỏng trên chính lịch trả của bạn, theo đúng kiểu lãi từng khoản (lãi phẳng chỉ tiết kiệm khi đóng HẲN khoản).{traThemGoiY > 0 && <> Gợi ý sẵn: số dư bình quân mỗi tháng của bạn ({tien(traThemGoiY)}).</>}</div>
                <KhoiChienLuoc traThemMacDinh={traThemGoiY} />
              </Card>

              {g.no.tatToanHomNay.length > 0 && (
                <Card>
                  <div className="mb-1 text-sm font-semibold text-text-primary">Nếu tất toán HÔM NAY</div>
                  <div className="mb-2 text-xs text-text-muted">Chưa gồm các kỳ đã tới hạn (vẫn phải trả). Mở từng khoản để chọn ngày khác và ghi nhận.</div>
                  <KhungCuon>
                    <table className="w-full min-w-[520px] text-sm">
                      <thead className="text-xs text-text-muted"><tr><Th trai>Khoản</Th><Th>Cần chi để đóng</Th><Th>Tiết kiệm</Th><Th>Bỏ qua</Th></tr></thead>
                      <tbody>
                        {g.no.tatToanHomNay.map((t) => (
                          <tr key={t.debtId} className="cursor-pointer border-t border-[var(--border-color)] hover:bg-[var(--border-color)]/30" onClick={() => router.push(`/finance/debts/${t.debtId}`)}>
                            <Td trai>{t.ten}{t.chuaKhaiPhi && <span className="ml-1 text-[11px] text-neon-orange">chưa khai phí</span>}</Td>
                            <Td>{tien(t.chiPhiTatToan, t.tienTe)}</Td>
                            <Td className={Number(t.tietKiem) > 0 ? 'font-semibold text-neon-green' : 'text-text-muted'}>{tien(t.tietKiem, t.tienTe)}</Td>
                            <Td className="text-text-muted">{t.soKyBoQua} kỳ</Td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </KhungCuon>
                </Card>
              )}
            </>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            {debts.map((d) => <TheKhoanNo key={d.id} debt={d} onClick={() => router.push(`/finance/debts/${d.id}`)} />)}
          </div>
        </div>
      )}

      {creating && (
        <Sheet open onClose={() => setCreating(false)} title="Thêm khoản nợ" size="lg">
          <DebtForm onSaved={(d) => { setCreating(false); router.push(`/finance/debts/${d.id}`); }} onCancel={() => setCreating(false)} />
        </Sheet>
      )}
    </FinanceShell>
  );
}

function TheKhoanNo({ debt, onClick }: { debt: Debt; onClick: () => void }) {
  const p = debt.phanTich;
  const te = debt.currency;
  const tienDo = p && Number(p.gocBanDau) > 0 ? (Number(p.gocDaTra) / Number(p.gocBanDau)) * 100 : debt.computed?.progressPct ?? 0;
  const quaHan = p?.quaHan.soKy ?? 0;
  const ky = p?.kyToi;
  return (
    <div onClick={onClick} className={cn('cursor-pointer rounded-2xl border bg-[var(--bg-card)] p-4 transition-colors hover:border-neon-violet/50', quaHan > 0 ? 'border-neon-red/50' : 'border-[var(--border-color)]')}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-neon-red/10 text-neon-red"><CreditCard size={18} /></div>
          <div className="min-w-0">
            <div className="truncate font-semibold text-text-primary">{debt.lenderName}</div>
            <div className="truncate text-xs text-text-muted">{LENDER_TYPE_LABELS[debt.lenderType] ?? debt.lenderType} · {interestLabel(debt)}</div>
          </div>
        </div>
        <DebtStatusPill status={debt.status} />
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-2">
        <span className="font-heading text-lg font-bold tabular-nums text-neon-red">{tien(p?.gocConLai ?? debt.computed?.remaining, te)}</span>
        <span className="text-xs text-text-muted">gốc còn / {tien(debt.principal, te)}</span>
      </div>
      <div className="mt-1.5"><ProgressBar ratio={tienDo} status="ok" /></div>
      {p && (
        <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
          <div><div className="text-text-muted">Lãi còn phải trả</div><div className="font-semibold tabular-nums text-neon-orange">{tien(p.laiConPhaiTra, te)}</div></div>
          <div><div className="text-text-muted">Lãi suất thực</div><div className="font-semibold tabular-nums">{p.laiSuat.thucThang == null ? '—' : `${phanTram(Number(p.laiSuat.thucThang), 2)}/th`}</div></div>
          <div><div className="text-text-muted">Kỳ còn lại</div><div className="font-semibold tabular-nums">{p.soKyConLai}/{p.soKy}</div></div>
        </div>
      )}
      {quaHan > 0 ? (
        <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-neon-red/10 px-2.5 py-1.5 text-xs font-medium text-neon-red"><AlertTriangle size={13} /> Quá hạn {p!.quaHan.lauNhatNgay} ngày · {quaHan} kỳ · {tien(p!.quaHan.soTien, te)}</div>
      ) : ky ? (
        <div className="mt-3 text-xs text-text-muted">Kỳ tới {ngayVN(ky.ngay)} · <span className="font-medium text-text-primary">{tien(ky.tong, te)}</span> (lãi {tien(ky.lai, te)}){ky.soNgayQuaHan >= -3 && <span className="ml-1 text-neon-orange">{ky.soNgayQuaHan === 0 ? '· hôm nay' : `· còn ${-ky.soNgayQuaHan} ngày`}</span>}</div>
      ) : null}
    </div>
  );
}
