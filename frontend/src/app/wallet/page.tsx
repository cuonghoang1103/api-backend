'use client';

/**
 * /wallet — Ví điểm.
 *
 * Nạp tiền thật → nhận điểm theo tỉ lệ 1 điểm = 1 VND (+ thưởng theo mốc).
 * Điểm dùng để mua hàng trong shop và mua gói Pro.
 *
 * ⚠️ BA CHỖ DỄ SAI, đã xử lý ở đây:
 *  - Bấm "Nạp" hai lần → hai đơn nạp. Chặn bằng `khoaGui` (ref, đổi ngay)
 *    + `idempotencyKey` giữ nguyên cho tới khi đơn tạo xong.
 *  - Người dùng trả tiền ở tab khác rồi quay lại: trang tự hỏi lại trạng
 *    thái đơn đang chờ, không bắt họ tải lại thủ công.
 *  - Quay về từ PayOS (`?topup=<mã>`): hỏi đúng đơn đó và báo kết quả.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';
import {
  Wallet, Plus, Loader2, ArrowLeft, TrendingUp, TrendingDown, Gift,
  CreditCard, Landmark, Copy, Check, AlertCircle, Clock, RefreshCw, ShieldCheck,
} from 'lucide-react';
import {
  walletApi, newIdempotencyKey,
  type WalletBalance, type PointTx, type TopupTier, type TopupOrder, type BankTransferInfo,
} from '@/lib/api';
import { useDaDangNhap } from '@/hooks/useDaDangNhap';

const dongVN = (n: number) => `${n.toLocaleString('vi-VN')} đ`;
const diemVN = (n: number) => n.toLocaleString('vi-VN');

/** Nhãn + màu cho từng loại giao dịch trong sổ. */
const LOAI: Record<string, { nhan: string; mau: string; Icon: typeof TrendingUp }> = {
  TOPUP: { nhan: 'Nạp tiền', mau: 'text-green-400', Icon: TrendingUp },
  BONUS: { nhan: 'Thưởng', mau: 'text-amber-400', Icon: Gift },
  SPEND: { nhan: 'Thanh toán', mau: 'text-red-400', Icon: TrendingDown },
  REFUND: { nhan: 'Hoàn điểm', mau: 'text-blue-400', Icon: RefreshCw },
  ADMIN_ADJUST: { nhan: 'Điều chỉnh', mau: 'text-purple-400', Icon: ShieldCheck },
};

export default function WalletPage() {
  const router = useRouter();
  const params = useSearchParams();
  // Xem hooks/useDaDangNhap.ts — `isAuthenticated` một mình KHÔNG đủ.
  const { daDangNhap: isAuthenticated, sanSang } = useDaDangNhap();

  const [vi, setVi] = useState<WalletBalance | null>(null);
  const [soCai, setSoCai] = useState<PointTx[]>([]);
  const [moc, setMoc] = useState<TopupTier[]>([]);
  const [gioiHan, setGioiHan] = useState({ minVnd: 10000, maxVnd: 50000000 });
  const [payosSan, setPayosSan] = useState(true);
  const [dangTai, setDangTai] = useState(true);

  const [soTien, setSoTien] = useState<number>(0);
  const [soTienTuNhap, setSoTienTuNhap] = useState('');
  const [cach, setCach] = useState<'PAYOS' | 'BANK_TRANSFER'>('PAYOS');
  const [dangGui, setDangGui] = useState(false);
  const [bank, setBank] = useState<BankTransferInfo | null>(null);
  const [donCho, setDonCho] = useState<TopupOrder | null>(null);
  const [chep, setChep] = useState<string | null>(null);

  const khoaGui = useRef(false);
  const khoaIdem = useRef<string>('');

  const napLai = useCallback(async () => {
    try {
      const [b, tx] = await Promise.all([walletApi.balance(), walletApi.transactions(0, 30)]);
      setVi(b.data.data);
      setSoCai(tx.data.data);
    } catch { /* chưa đăng nhập hoặc mạng lỗi — khối dưới đã có trạng thái riêng */ }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) { setDangTai(false); return; }
    (async () => {
      setDangTai(true);
      try {
        const t = await walletApi.tiers();
        setMoc(t.data.data.tiers);
        setGioiHan({ minVnd: t.data.data.minVnd, maxVnd: t.data.data.maxVnd });
        setPayosSan(t.data.data.payosAvailable);
        if (!t.data.data.payosAvailable) setCach('BANK_TRANSFER');
      } catch { /* mốc nạp hỏng thì vẫn nhập tay được */ }
      await napLai();
      setDangTai(false);
    })();
  }, [isAuthenticated, napLai]);

  /**
   * Quay về từ cổng thanh toán (`?topup=<mã>`).
   *
   * Hỏi lại trạng thái đơn vài nhịp: webhook của cổng có thể về CHẬM hơn
   * trình duyệt người dùng. Hỏi một lần rồi kết luận "chưa trả" là báo sai
   * cho một người vừa trả tiền xong — kiểu lỗi làm người ta trả lần hai.
   */
  useEffect(() => {
    const ma = params.get('topup');
    if (!ma || !isAuthenticated) return;
    let huy = false;
    let lan = 0;
    const hoi = async () => {
      if (huy) return;
      try {
        const r = await walletApi.getTopup(ma);
        const d = r.data.data;
        if (d.status === 'PAID') {
          toast.success(`Nạp thành công! +${diemVN(d.totalPoints)} điểm`);
          await napLai();
          router.replace('/wallet');
          return;
        }
        if (d.status === 'CANCELLED' || d.status === 'FAILED' || d.status === 'EXPIRED') {
          toast.error('Lượt nạp chưa hoàn tất.');
          router.replace('/wallet');
          return;
        }
        setDonCho(d);
      } catch { /* đơn không thuộc về mình — bỏ qua im lặng */ }
      if (++lan < 8 && !huy) setTimeout(hoi, 2000);
    };
    hoi();
    return () => { huy = true; };
  }, [params, isAuthenticated, napLai, router]);

  const soTienChon = soTienTuNhap ? Number(soTienTuNhap.replace(/\D/g, '')) || 0 : soTien;
  const mocKhop = [...moc].filter((m) => m.amountVnd <= soTienChon).sort((a, b) => b.amountVnd - a.amountVnd)[0];
  const phanTramThuong = mocKhop?.bonusPercent ?? 0;
  const diemGoc = soTienChon;
  const diemThuong = Math.floor((diemGoc * phanTramThuong) / 100);
  const hopLe = soTienChon >= gioiHan.minVnd && soTienChon <= gioiHan.maxVnd;

  const nap = async () => {
    if (khoaGui.current) return;
    if (!hopLe) {
      toast.warning(`Số tiền nạp từ ${dongVN(gioiHan.minVnd)} đến ${dongVN(gioiHan.maxVnd)}`);
      return;
    }
    khoaGui.current = true;
    setDangGui(true);
    // Khoá giữ NGUYÊN qua các lần thử lại của cùng một ý định nạp.
    if (!khoaIdem.current) khoaIdem.current = newIdempotencyKey();
    try {
      const r = await walletApi.createTopup(soTienChon, cach, khoaIdem.current);
      const { order, bank: bankData } = r.data.data;
      setDonCho(order);

      if (cach === 'BANK_TRANSFER') {
        setBank(bankData);
        toast.success('Đã tạo yêu cầu nạp. Quét mã QR để chuyển khoản.');
        khoaIdem.current = ''; // ý định này xong; lần nạp sau là khoá mới
      } else {
        const link = await walletApi.payosLink(order.orderCode);
        const url = link.data.data?.checkoutUrl;
        if (!url) throw new Error('Không tạo được liên kết thanh toán');
        window.location.href = url;
        await new Promise(() => {}); // giữ khoá cho tới khi rời trang
      }
    } catch (e) {
      const loi = e as { response?: { data?: { message?: string } } };
      toast.error(loi.response?.data?.message || 'Không tạo được lượt nạp. Vui lòng thử lại.');
    } finally {
      khoaGui.current = false;
      setDangGui(false);
    }
  };

  const chepChu = async (chu: string, nhan: string) => {
    try {
      await navigator.clipboard.writeText(chu);
      setChep(nhan);
      setTimeout(() => setChep(null), 1800);
    } catch {
      toast.error('Trình duyệt không cho chép tự động — vui lòng chép tay.');
    }
  };

  // ── Chưa đăng nhập ──
  // `sanSang` chặn một nháy "Đăng nhập" ở lần render đầu rồi biến mất —
  // nháy như thế trông y hệt một lỗi.
  if (sanSang && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-darkbg pt-24 px-4">
        <div className="max-w-md mx-auto text-center bg-darkcard border border-darkborder rounded-2xl p-8">
          <Wallet className="w-12 h-12 text-neon-violet mx-auto mb-4" />
          <h1 className="text-xl font-heading font-bold text-text-primary mb-2">Ví điểm</h1>
          <p className="text-text-muted text-sm mb-6">
            Đăng nhập để xem số dư, nạp tiền và dùng điểm mua hàng.
          </p>
          <Link
            href="/login?redirect=/wallet"
            className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-semibold"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darkbg pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8 gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-text-primary">Ví điểm</h1>
            <p className="text-text-muted text-sm mt-1">
              1 điểm = 1 đ · dùng để mua hàng trong shop và nâng cấp Pro
            </p>
          </div>
          <Link href="/" className="flex items-center gap-2 text-sm text-text-muted hover:text-neon-violet flex-shrink-0">
            <ArrowLeft className="w-4 h-4" /> Trang chủ
          </Link>
        </div>

        {/* ── Số dư ── */}
        <div className="rounded-2xl bg-gradient-to-br from-neon-indigo/25 via-neon-violet/15 to-transparent border border-neon-violet/30 p-6 md:p-8 mb-8">
          <p className="text-text-muted text-sm mb-2">Số dư khả dụng</p>
          {dangTai ? (
            <Loader2 className="w-7 h-7 animate-spin text-neon-violet" />
          ) : (
            <>
              <p className="text-4xl md:text-5xl font-bold text-text-primary tabular-nums">
                {diemVN(vi?.balance ?? 0)} <span className="text-xl font-semibold text-neon-violet">điểm</span>
              </p>
              <p className="text-text-muted text-sm mt-2">≈ {dongVN(vi?.balance ?? 0)}</p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5 text-xs text-text-muted">
                <span>Đã nạp tổng cộng: <b className="text-text-primary">{diemVN(vi?.totalEarned ?? 0)}</b></span>
                <span>Đã tiêu: <b className="text-text-primary">{diemVN(vi?.totalSpent ?? 0)}</b></span>
              </div>
            </>
          )}
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* ── Nạp tiền ── */}
          <div className="lg:col-span-3">
            <div className="bg-darkcard border border-darkborder rounded-2xl p-6">
              <h2 className="font-heading font-bold text-text-primary text-lg mb-5 flex items-center gap-2">
                <Plus className="w-5 h-5 text-neon-violet" /> Nạp điểm
              </h2>

              {bank ? (
                <div className="rounded-xl border border-neon-violet/30 bg-darkbg p-5">
                  <p className="text-sm font-semibold text-text-primary mb-4">Quét mã để chuyển khoản</p>
                  <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                    <div className="bg-white p-3 rounded-xl flex-shrink-0">
                      <QRCodeSVG value={bank.qrString} size={168} level="M" />
                    </div>
                    <div className="flex-1 w-full space-y-2.5 text-sm">
                      {[
                        { nhan: 'Ngân hàng', gt: bank.bank.name ?? '—', c: false },
                        { nhan: 'Số tài khoản', gt: bank.bank.accountNo ?? '—', c: true },
                        { nhan: 'Chủ tài khoản', gt: bank.bank.accountName ?? '—', c: false },
                        { nhan: 'Số tiền', gt: dongVN(bank.amountVnd), c: true },
                        { nhan: 'Nội dung', gt: bank.noiDungChuyenKhoan, c: true },
                      ].map((d) => (
                        <div key={d.nhan} className="flex items-center justify-between gap-3">
                          <span className="text-text-muted text-xs flex-shrink-0">{d.nhan}</span>
                          <span className="flex items-center gap-2 min-w-0">
                            <span className="font-mono text-text-primary truncate">{d.gt}</span>
                            {d.c && (
                              <button
                                onClick={() => chepChu(d.nhan === 'Số tiền' ? String(bank.amountVnd) : d.gt, d.nhan)}
                                className="text-text-muted hover:text-neon-violet flex-shrink-0"
                                aria-label={`Chép ${d.nhan}`}
                              >
                                {chep === d.nhan ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 flex items-start gap-2 text-xs text-text-muted bg-darkcard rounded-lg p-3">
                    <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>
                      <b className="text-amber-300">Ghi đúng nội dung “{bank.noiDungChuyenKhoan}”</b> — đây là
                      thứ duy nhất để đối chiếu. Điểm được cộng sau khi admin xác nhận đã nhận tiền.
                    </span>
                  </div>
                  <button
                    onClick={() => { setBank(null); setDonCho(null); }}
                    className="mt-4 w-full py-3 rounded-xl bg-darkcard border border-darkborder text-sm text-text-primary hover:border-neon-violet/40"
                  >
                    Tạo lượt nạp khác
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-5">
                    {moc.map((m) => {
                      const chon = !soTienTuNhap && soTien === m.amountVnd;
                      return (
                        <button
                          key={m.id}
                          onClick={() => { setSoTien(m.amountVnd); setSoTienTuNhap(''); }}
                          className={`relative rounded-xl border p-3 text-left transition-all ${
                            chon ? 'border-neon-violet bg-neon-violet/10' : 'border-darkborder bg-darkbg hover:border-neon-violet/40'
                          }`}
                        >
                          {m.popular && (
                            <span className="absolute -top-2 right-2 text-[10px] px-1.5 py-0.5 rounded bg-neon-violet text-white font-semibold">
                              PHỔ BIẾN
                            </span>
                          )}
                          <p className="font-bold text-text-primary text-sm">{dongVN(m.amountVnd)}</p>
                          <p className="text-xs text-text-muted mt-0.5">{diemVN(m.totalPoints)} điểm</p>
                          {m.bonusPercent > 0 && (
                            <p className="text-xs text-amber-400 mt-1">+{diemVN(m.bonusPoints)} thưởng</p>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <label className="block text-xs text-text-muted mb-1.5">Hoặc nhập số tiền khác</label>
                  <div className="relative mb-5">
                    <input
                      inputMode="numeric"
                      value={soTienTuNhap ? Number(soTienTuNhap.replace(/\D/g, '') || 0).toLocaleString('vi-VN') : ''}
                      onChange={(e) => { setSoTienTuNhap(e.target.value); setSoTien(0); }}
                      placeholder={`Từ ${dongVN(gioiHan.minVnd)}`}
                      className="w-full bg-darkbg border border-darkborder rounded-xl px-4 py-3 pr-12 text-text-primary tabular-nums focus:border-neon-violet outline-none"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted text-sm">đ</span>
                  </div>

                  {soTienChon > 0 && (
                    <div className="rounded-xl bg-darkbg border border-darkborder p-4 mb-5 text-sm space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-text-muted">Điểm nhận được</span>
                        <span className="text-text-primary font-semibold tabular-nums">{diemVN(diemGoc)}</span>
                      </div>
                      {diemThuong > 0 && (
                        <div className="flex justify-between">
                          <span className="text-amber-400">Thưởng +{phanTramThuong}%</span>
                          <span className="text-amber-400 font-semibold tabular-nums">+{diemVN(diemThuong)}</span>
                        </div>
                      )}
                      <div className="flex justify-between pt-2 border-t border-darkborder">
                        <span className="text-text-primary font-semibold">Tổng cộng</span>
                        <span className="text-neon-violet font-bold tabular-nums">{diemVN(diemGoc + diemThuong)} điểm</span>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2.5 mb-5">
                    {([
                      { id: 'PAYOS' as const, Icon: CreditCard, ten: 'PayOS', mo: 'Tự động', dung: payosSan },
                      { id: 'BANK_TRANSFER' as const, Icon: Landmark, ten: 'Chuyển khoản', mo: 'Admin duyệt', dung: true },
                    ]).map((c) => (
                      <button
                        key={c.id}
                        onClick={() => c.dung && setCach(c.id)}
                        disabled={!c.dung}
                        className={`rounded-xl border p-3 text-left transition-all ${
                          cach === c.id ? 'border-neon-violet bg-neon-violet/10' : 'border-darkborder bg-darkbg hover:border-neon-violet/40'
                        } ${!c.dung ? 'opacity-45 cursor-not-allowed' : ''}`}
                      >
                        <c.Icon className={`w-4 h-4 mb-1.5 ${cach === c.id ? 'text-neon-violet' : 'text-text-muted'}`} />
                        <p className="text-sm font-semibold text-text-primary">{c.ten}</p>
                        <p className="text-xs text-text-muted">{c.dung ? c.mo : 'Chưa sẵn sàng'}</p>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={nap}
                    disabled={dangGui || !hopLe}
                    className="w-full py-4 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {dangGui ? <><Loader2 className="w-4 h-4 animate-spin" /> Đang xử lý…</>
                      : <><Plus className="w-4 h-4" /> Nạp {soTienChon > 0 ? dongVN(soTienChon) : ''}</>}
                  </button>

                  <p className="text-xs text-text-muted mt-4 leading-relaxed">
                    Điểm <b>không quy đổi ngược ra tiền mặt</b>, không chuyển được cho tài khoản khác
                    và <b>không hết hạn</b>. Nạp là để dùng trên chính website này.
                  </p>
                </>
              )}
            </div>

            {donCho && donCho.status === 'PENDING' && !bank && (
              <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm min-w-0">
                  <p className="text-amber-300 font-semibold">Đang chờ thanh toán</p>
                  <p className="text-text-muted text-xs mt-1 break-all">
                    Đơn {donCho.orderCode} · {dongVN(donCho.amountVnd)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── Sổ giao dịch ── */}
          <div className="lg:col-span-2">
            <div className="bg-darkcard border border-darkborder rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-heading font-bold text-text-primary text-lg">Lịch sử</h2>
                <button onClick={napLai} className="text-text-muted hover:text-neon-violet" aria-label="Tải lại">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {dangTai ? (
                <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-neon-violet" /></div>
              ) : soCai.length === 0 ? (
                <p className="text-text-muted text-sm text-center py-8">Chưa có giao dịch nào.</p>
              ) : (
                <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
                  {soCai.map((t) => {
                    const meta = LOAI[t.kind] ?? { nhan: t.kind, mau: 'text-text-muted', Icon: Wallet };
                    return (
                      <div key={t.id} className="flex items-start gap-3 pb-3 border-b border-darkborder last:border-0">
                        <div className="w-8 h-8 rounded-lg bg-darkbg flex items-center justify-center flex-shrink-0">
                          <meta.Icon className={`w-4 h-4 ${meta.mau}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-text-primary break-words">{t.description}</p>
                          <p className="text-xs text-text-muted mt-0.5">
                            {new Date(t.createdAt).toLocaleString('vi-VN')}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className={`text-sm font-semibold tabular-nums ${t.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {t.amount > 0 ? '+' : ''}{diemVN(t.amount)}
                          </p>
                          <p className="text-xs text-text-muted tabular-nums">{diemVN(t.balanceAfter)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <Link
              href="/pro"
              className="mt-4 block rounded-2xl border border-neon-violet/30 bg-gradient-to-br from-neon-violet/15 to-transparent p-5 hover:border-neon-violet/50 transition-colors"
            >
              <p className="font-semibold text-text-primary text-sm">Dùng điểm nâng cấp Pro</p>
              <p className="text-xs text-text-muted mt-1">
                Từ 50.000đ / tháng — mở khoá AI Chat Pro, Academy, CV Builder và nhiều hơn.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
