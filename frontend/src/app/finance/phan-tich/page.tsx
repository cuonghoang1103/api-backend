'use client';
/**
 * Phân tích tài chính (28/09/2026) — một trang đọc hết tình hình tiền bạc:
 * cảnh báo, sức khoẻ tài chính, dòng tiền 6 tháng, chi theo nhóm so cùng kỳ,
 * nợ theo tháng, đầu tư, thu theo nguồn, tiết kiệm + cố vấn AI.
 * Toàn bộ số lấy từ `GET /finance/phan-tich` (máy chủ tính).
 */
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, AlertTriangle } from 'lucide-react';
import { financeApi, type GoiPhanTich } from '@/lib/finance-api';
import { FinanceShell } from '@/components/finance/FinanceShell';
import { Card, Spinner, EmptyState } from '@/components/finance/primitives';
import {
  DanhSachCanhBao, SucKhoeTaiChinh, BieuDoDongTien, BangDongTien, BangChiTheoNhom, BangDauTu, BangLichTheoThang,
  CoVanAI, OChiSo, tien, ngayVN, KhungCuon, Th, Td,
} from '@/components/finance/phan-tich-ui';

export default function PhanTichPage() {
  const [g, setG] = useState<GoiPhanTich | null>(null);
  const [dangTai, setDangTai] = useState(true);
  const tai = useCallback(() => { financeApi.phanTich().then(setG).catch(() => undefined).finally(() => setDangTai(false)); }, []);
  useEffect(() => { tai(); }, [tai]);

  return (
    <FinanceShell onQuickAddSuccess={tai} rong>
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="font-heading text-2xl font-bold text-text-primary">Phân tích tài chính</h1>
        {g && <span className="text-sm text-text-muted">Số liệu tới {ngayVN(g.homNay)} · giờ Việt Nam</span>}
      </div>

      {dangTai && !g ? <Spinner label="Đang tính…" /> : !g ? <EmptyState title="Không tải được dữ liệu" hint="Thử tải lại trang." /> : (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="min-w-0 space-y-4">
            {g.coUsdChuaQuyDoi && (
              <div className="flex items-center gap-2 rounded-xl bg-neon-orange/10 px-3 py-2.5 text-sm text-neon-orange">
                <AlertTriangle size={16} className="shrink-0" /> Có khoản bằng $ nhưng chưa đặt tỷ giá — các tổng chưa gồm phần này. <Link href="/finance/currency" className="font-semibold underline">Đặt tỷ giá</Link>
              </div>
            )}

            <DanhSachCanhBao ds={g.canhBao} toiDa={6} rong={<Card className="text-sm text-neon-green">Không có cảnh báo nào — mọi kỳ nợ đúng hạn, chi tiêu trong ngân sách.</Card>} />

            <SucKhoeTaiChinh g={g} />

            <Card>
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-semibold text-text-primary">Nợ</div>
                <Link href="/finance/debts" className="inline-flex items-center gap-1 text-xs text-neon-violet hover:underline">Chi tiết & chiến lược <ArrowRight size={13} /></Link>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <OChiSo nhan="Gốc còn lại" tone="red" giaTri={tien(g.no.tong.gocConLai)} phu={`${g.no.tong.soKhoanDangNo} khoản đang nợ`} />
                <OChiSo nhan="Lãi còn phải trả" tone="orange" giaTri={tien(g.no.tong.laiConPhaiTra)} phu={<>Đã trả lãi {tien(g.no.tong.laiDaTra)}</>} />
                <OChiSo nhan="Tháng này còn phải trả" giaTri={tien(g.no.thangNay.conPhaiTra)} phu={<>trong đó lãi {tien(g.no.thangNay.laiTrongDo)} · đã trả {tien(g.no.thangNay.daTra)}</>} />
                <OChiSo nhan="Hết nợ theo lịch" tone="violet" giaTri={ngayVN(g.no.tong.ngayHetNo)} phu={<>Tổng còn phải trả {tien(g.no.tong.tongConPhaiTra)}</>} />
              </div>
              <div className="mt-4 text-xs font-medium text-text-secondary">Phải trả từng tháng (12 tháng tới)</div>
              <BangLichTheoThang g={g} />
            </Card>

            <Card>
              <div className="mb-2 text-sm font-semibold text-text-primary">Dòng tiền 6 tháng (thu − chi − trả nợ)</div>
              <BieuDoDongTien g={g} />
              <div className="mt-3"><BangDongTien g={g} /></div>
              <div className="mt-2 text-[11px] text-text-muted">Chuyển tiền giữa các ví, gửi tiết kiệm, mua tài sản đầu tư không tính là chi tiêu. Trả nợ tính theo ngày trả thật.</div>
            </Card>

            <Card>
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                <div className="text-sm font-semibold text-text-primary">Chi tiêu theo nhóm — tháng này so với tháng trước</div>
                <Link href="/finance/expenses" className="text-xs text-neon-violet hover:underline">Chi tiêu →</Link>
              </div>
              <BangChiTheoNhom g={g} />
              <div className="mt-2 text-[11px] text-text-muted">&ldquo;So cùng kỳ&rdquo; = từ ngày 1 tới ngày {g.chiTieu.ngayTrongThang} của tháng này so với cùng khoảng ngày tháng trước.</div>
            </Card>

            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <div className="mb-2 text-sm font-semibold text-text-primary">Thu theo nguồn (3 tháng gần nhất)</div>
                {g.thuTheoNguon.length === 0 ? <div className="py-4 text-center text-sm text-text-muted">Chưa có thu nhập.</div> : (
                  <div className="space-y-1.5">
                    {g.thuTheoNguon.map((x) => (
                      <div key={x.ten} className="flex items-center justify-between gap-2 text-sm"><span className="truncate text-text-secondary">{x.ten}</span><span className="shrink-0 font-medium tabular-nums text-neon-green">{tien(x.tong)}</span></div>
                    ))}
                  </div>
                )}
              </Card>
              <Card>
                <div className="mb-2 text-sm font-semibold text-text-primary">Sổ tiết kiệm</div>
                {g.soTietKiem.length === 0 ? <div className="py-4 text-center text-sm text-text-muted">Chưa có sổ tiết kiệm.</div> : (
                  <KhungCuon>
                    <table className="w-full min-w-[360px] text-sm">
                      <thead className="text-xs text-text-muted"><tr><Th trai>Ngân hàng</Th><Th>Số tiền</Th><Th>Đáo hạn</Th><Th>Lãi khi đáo hạn</Th></tr></thead>
                      <tbody>{g.soTietKiem.map((s) => (
                        <tr key={s.id} className="border-t border-[var(--border-color)]"><Td trai>{s.nganHang} <span className="text-[11px] text-text-muted">{Number(s.laiSuatNam).toLocaleString('vi-VN')}%/năm</span></Td><Td>{tien(s.soTien, s.tienTe)}</Td><Td className={s.conNgay <= 7 ? 'text-neon-orange' : ''}>{ngayVN(s.ngayDaoHan)}</Td><Td className="text-neon-green">{tien(s.laiKhiDaoHan, s.tienTe)}</Td></tr>
                      ))}</tbody>
                    </table>
                  </KhungCuon>
                )}
              </Card>
            </div>

            <Card>
              <div className="mb-2 flex items-baseline justify-between gap-2">
                <div className="text-sm font-semibold text-text-primary">Đầu tư & kinh doanh tài sản</div>
                <Link href="/finance/investments" className="text-xs text-neon-violet hover:underline">Đầu tư →</Link>
              </div>
              <BangDauTu g={g} />
            </Card>

            {g.thieuDuLieu.length > 0 && (
              <Card className="border-neon-orange/40">
                <div className="mb-1 text-sm font-semibold text-neon-orange">Chưa đủ dữ liệu để tính</div>
                <ul className="list-disc space-y-0.5 pl-5 text-sm text-text-secondary">{g.thieuDuLieu.map((x, i) => <li key={i}>{x}</li>)}</ul>
              </Card>
            )}
          </div>

          <div className="min-w-0 xl:sticky xl:top-20 xl:self-start">
            <CoVanAI />
          </div>
        </div>
      )}
    </FinanceShell>
  );
}
