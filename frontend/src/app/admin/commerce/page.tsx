'use client';

/**
 * /admin/commerce — Bảng điều khiển doanh thu + đối soát.
 *
 * ⚠️ ĐỌC KỸ CỘT SỐ: "Tiền thật" và "Tổng giá trị" KHÁC NHAU và không được
 * cộng vào nhau.
 *
 * Tiền vào web đúng MỘT lần — lúc nạp ví, hoặc lúc trả thẳng qua cổng. Một
 * đơn trả bằng ĐIỂM không mang thêm đồng nào vào (tiền đó đã vào từ lúc nạp).
 * Cộng "doanh thu nạp ví" với "doanh thu bán hàng bằng điểm" là đếm cùng một
 * đồng hai lần. Vì thế mọi thẻ số ở đây đều ghi rõ nó đang đếm cái gì.
 */
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  TrendingUp, Wallet, ShoppingBag, Crown, Loader2, RefreshCw, AlertCircle,
  Landmark, KeyRound, Clock, Check, X, Settings, ArrowLeft, Info,
} from 'lucide-react';
import {
  commerceAdminApi,
  type CommerceDashboard, type BankTransferRow, type KeyReplacement, type PaymentSettings,
} from '@/lib/api';

const dongVN = (n: number) => `${Math.round(n).toLocaleString('vi-VN')} đ`;
const gonVN = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}tr` : n >= 1_000 ? `${Math.round(n / 1_000)}k` : String(n);

type Tab = 'doanhthu' | 'chuyenkhoan' | 'doikey' | 'caidat';

export default function AdminCommercePage() {
  const [tab, setTab] = useState<Tab>('doanhthu');
  const [soNgay, setSoNgay] = useState(30);
  const [data, setData] = useState<CommerceDashboard | null>(null);
  const [dangTai, setDangTai] = useState(true);

  const nap = useCallback(async () => {
    setDangTai(true);
    try {
      const r = await commerceAdminApi.dashboard(soNgay);
      setData(r.data.data);
    } catch {
      toast.error('Không tải được số liệu.');
    } finally {
      setDangTai(false);
    }
  }, [soNgay]);

  useEffect(() => { nap(); }, [nap]);

  const canXuLy = data?.tomTat.canXuLy;
  const tongCho = (canXuLy?.chuyenKhoanChoDuyet ?? 0) + (canXuLy?.yeuCauDoiKey ?? 0);

  return (
    <div className="min-h-screen bg-darkbg p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
          <div className="min-w-0">
            <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-neon-violet mb-2">
              <ArrowLeft className="w-4 h-4" /> Quản trị
            </Link>
            <h1 className="text-2xl font-heading font-bold text-text-primary">Thương mại</h1>
            <p className="text-text-muted text-sm mt-1">Doanh thu, đối soát chuyển khoản, đổi key</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {[7, 30, 90].map((n) => (
              <button
                key={n}
                onClick={() => setSoNgay(n)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  soNgay === n ? 'bg-neon-violet text-white' : 'bg-darkcard border border-darkborder text-text-muted hover:text-text-primary'
                }`}
              >
                {n} ngày
              </button>
            ))}
            <button onClick={nap} className="p-2 rounded-lg bg-darkcard border border-darkborder text-text-muted hover:text-neon-violet" aria-label="Tải lại">
              <RefreshCw className={`w-4 h-4 ${dangTai ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Việc cần xử lý — nổi lên trên cùng vì đây là thứ giữ tiền của khách */}
        {tongCho > 0 && (
          <button
            onClick={() => setTab(canXuLy!.chuyenKhoanChoDuyet > 0 ? 'chuyenkhoan' : 'doikey')}
            className="w-full mb-6 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 flex items-center gap-3 text-left hover:bg-amber-500/15 transition-colors"
          >
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-amber-300 font-semibold text-sm">Có {tongCho} việc đang chờ bạn</p>
              <p className="text-text-muted text-xs mt-0.5">
                {canXuLy!.chuyenKhoanChoDuyet > 0 && `${canXuLy!.chuyenKhoanChoDuyet} chuyển khoản chờ xác nhận`}
                {canXuLy!.chuyenKhoanChoDuyet > 0 && canXuLy!.yeuCauDoiKey > 0 && ' · '}
                {canXuLy!.yeuCauDoiKey > 0 && `${canXuLy!.yeuCauDoiKey} yêu cầu đổi key`}
                {' — khách đã trả tiền và đang chờ nhận hàng.'}
              </p>
            </div>
          </button>
        )}

        <div className="flex gap-1 mb-6 border-b border-darkborder overflow-x-auto">
          {([
            { id: 'doanhthu' as const, ten: 'Doanh thu', Icon: TrendingUp, badge: 0 },
            { id: 'chuyenkhoan' as const, ten: 'Chuyển khoản', Icon: Landmark, badge: canXuLy?.chuyenKhoanChoDuyet ?? 0 },
            { id: 'doikey' as const, ten: 'Đổi key', Icon: KeyRound, badge: canXuLy?.yeuCauDoiKey ?? 0 },
            { id: 'caidat' as const, ten: 'Cài đặt', Icon: Settings, badge: 0 },
          ]).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                tab === t.id ? 'border-neon-violet text-neon-violet' : 'border-transparent text-text-muted hover:text-text-primary'
              }`}
            >
              <t.Icon className="w-4 h-4" /> {t.ten}
              {t.badge > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-bold">{t.badge}</span>
              )}
            </button>
          ))}
        </div>

        {tab === 'doanhthu' && <TabDoanhThu data={data} dangTai={dangTai} />}
        {tab === 'chuyenkhoan' && <TabChuyenKhoan onXong={nap} />}
        {tab === 'doikey' && <TabDoiKey onXong={nap} />}
        {tab === 'caidat' && <TabCaiDat />}
      </div>
    </div>
  );
}

// ═══════════════════════════ DOANH THU ═══════════════════════════

function TabDoanhThu({ data, dangTai }: { data: CommerceDashboard | null; dangTai: boolean }) {
  if (dangTai && !data) {
    return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-neon-violet" /></div>;
  }
  if (!data) return <p className="text-text-muted text-center py-20">Không có dữ liệu.</p>;

  const { tomTat, theoNgay, sanPhamBanChay, thanhToan } = data;

  const the = [
    { nhan: 'Tiền thật hôm nay', gt: dongVN(tomTat.homNay.tienThat), Icon: TrendingUp, mau: 'text-green-400' },
    { nhan: 'Tiền thật 7 ngày', gt: dongVN(tomTat.bayNgay.tienThat), Icon: TrendingUp, mau: 'text-green-400' },
    { nhan: 'Tiền thật 30 ngày', gt: dongVN(tomTat.baMuoiNgay.tienThat), Icon: TrendingUp, mau: 'text-green-400' },
    { nhan: 'Nạp ví 30 ngày', gt: dongVN(tomTat.napViBaMuoiNgay), Icon: Wallet, mau: 'text-blue-400' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {the.map((c) => (
          <div key={c.nhan} className="bg-darkcard border border-darkborder rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <c.Icon className={`w-4 h-4 ${c.mau}`} />
              <span className="text-xs text-text-muted">{c.nhan}</span>
            </div>
            <p className="text-xl font-bold text-text-primary tabular-nums break-all">{c.gt}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-blue-500/25 bg-blue-500/[0.07] p-4 flex items-start gap-3">
        <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-text-muted leading-relaxed">
          <b className="text-blue-300">&ldquo;Tiền thật&rdquo;</b> là dòng tiền vào tài khoản — chỉ tính các đơn trả
          bằng cổng hoặc chuyển khoản. Đơn trả bằng <b>ví điểm</b> không cộng vào đây vì tiền đó đã
          vào từ lúc nạp; cộng cả hai là đếm một đồng hai lần. Điểm chưa tiêu trong mọi ví hiện là{' '}
          <b className="text-text-primary tabular-nums">{tomTat.diemDangLuuHanh.toLocaleString('vi-VN')}</b>{' '}
          — đây là <b>nghĩa vụ</b> của web với người dùng, không phải doanh thu.
        </p>
      </div>

      <div className="bg-darkcard border border-darkborder rounded-xl p-4 sm:p-5">
        <h2 className="font-semibold text-text-primary mb-4">Doanh thu theo ngày</h2>
        <div className="h-72 -ml-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={theoNgay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
              <XAxis dataKey="ngay" tick={{ fontSize: 11, fill: '#8b8b9e' }} tickFormatter={(v: string) => v.slice(5)} />
              <YAxis tick={{ fontSize: 11, fill: '#8b8b9e' }} tickFormatter={gonVN} width={46} />
              <Tooltip
                contentStyle={{ background: '#16161f', border: '1px solid #2a2a35', borderRadius: 10, fontSize: 12 }}
                formatter={(v: number, n: string) => [dongVN(v), n]}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="tienThat" name="Tiền thật" stroke="#4ade80" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="tieuDiem" name="Trả bằng điểm" stroke="#a78bfa" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="topup" name="Nạp ví" stroke="#60a5fa" strokeWidth={2} strokeDasharray="4 3" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-darkcard border border-darkborder rounded-xl p-4 sm:p-5">
          <h2 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-neon-violet" /> Bán chạy nhất
          </h2>
          {sanPhamBanChay.length === 0 ? (
            <p className="text-text-muted text-sm py-8 text-center">Chưa có đơn nào trong khoảng này.</p>
          ) : (
            <div className="h-72 -ml-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sanPhamBanChay.slice(0, 7)} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#8b8b9e' }} tickFormatter={gonVN} />
                  <YAxis
                    type="category" dataKey="name" width={110}
                    tick={{ fontSize: 10, fill: '#8b8b9e' }}
                    tickFormatter={(v: string) => (v.length > 18 ? `${v.slice(0, 18)}…` : v)}
                  />
                  <Tooltip
                    contentStyle={{ background: '#16161f', border: '1px solid #2a2a35', borderRadius: 10, fontSize: 12 }}
                    formatter={(v: number) => [dongVN(v), 'Doanh thu']}
                  />
                  <Bar dataKey="doanhThu" fill="#a78bfa" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-darkcard border border-darkborder rounded-xl p-4 sm:p-5">
          <h2 className="font-semibold text-text-primary mb-1">Tỉ lệ hoàn tất thanh toán</h2>
          {/* Nói đúng cái đang đo. "Bỏ giỏ hàng" theo nghĩa TMĐT là thêm vào
              giỏ rồi không checkout — giỏ nằm ở trình duyệt nên backend
              không thấy. Đây là bước SAU đó. */}
          <p className="text-xs text-text-muted mb-5">
            Đo bước <b>đã bấm đặt đơn nhưng không trả tiền</b> — không phải bỏ giỏ hàng
            (giỏ nằm ở trình duyệt, máy chủ không thấy).
          </p>
          <div className="flex items-end gap-3 mb-5">
            <span className="text-4xl font-bold text-text-primary tabular-nums">{thanhToan.tiLeHoanTat}%</span>
            <span className="text-sm text-text-muted mb-1.5">hoàn tất</span>
          </div>
          <div className="h-2.5 rounded-full bg-darkbg overflow-hidden mb-5">
            <div className="h-full bg-gradient-to-r from-neon-indigo to-neon-violet" style={{ width: `${thanhToan.tiLeHoanTat}%` }} />
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { n: 'Tổng đơn tạo', v: thanhToan.tongDon, m: 'text-text-primary' },
              { n: 'Đã thanh toán', v: thanhToan.daTra, m: 'text-green-400' },
              { n: 'Còn chờ trả', v: thanhToan.dangCho, m: 'text-amber-400' },
              { n: 'Huỷ / hỏng', v: thanhToan.huy, m: 'text-red-400' },
            ].map((x) => (
              <div key={x.n} className="bg-darkbg rounded-lg p-3">
                <p className="text-xs text-text-muted">{x.n}</p>
                <p className={`text-lg font-bold tabular-nums ${x.m}`}>{x.v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════ ĐỐI SOÁT CHUYỂN KHOẢN ═══════════════════════

function TabChuyenKhoan({ onXong }: { onXong: () => void }) {
  const [rows, setRows] = useState<BankTransferRow[]>([]);
  const [dangTai, setDangTai] = useState(true);
  const [loc, setLoc] = useState('AWAITING');
  const [dangLam, setDangLam] = useState<string | null>(null);

  const nap = useCallback(async () => {
    setDangTai(true);
    try {
      const r = await commerceAdminApi.listTransfers({ status: loc || undefined, size: 50 });
      setRows(r.data.data);
    } catch { toast.error('Không tải được danh sách.'); }
    finally { setDangTai(false); }
  }, [loc]);

  useEffect(() => { nap(); }, [nap]);

  const xacNhan = async (refCode: string, amountVnd: number) => {
    // Nút này GIAO HÀNG THẬT. Hỏi lại một lần — bấm nhầm là mất hàng.
    if (!window.confirm(
      `Xác nhận ĐÃ NHẬN ${dongVN(amountVnd)} cho mã ${refCode}?\n\n` +
      `Hệ thống sẽ giao hàng / cộng điểm / cấp Pro NGAY. Không hoàn tác được.`,
    )) return;
    setDangLam(refCode);
    try {
      const r = await commerceAdminApi.confirmTransfer(refCode);
      toast.success(`Đã xác nhận. Kết quả giao hàng: ${r.data.data.fulfillment}`);
      await nap();
      onXong();
    } catch (e) {
      const loi = e as { response?: { data?: { message?: string } } };
      toast.error(loi.response?.data?.message || 'Không xác nhận được.');
    } finally { setDangLam(null); }
  };

  const tuChoi = async (refCode: string) => {
    const note = window.prompt('Lý do từ chối (hiện cho người mua):', 'Không nhận được tiền');
    if (note === null) return;
    setDangLam(refCode);
    try {
      await commerceAdminApi.rejectTransfer(refCode, note);
      toast.success('Đã từ chối.');
      await nap();
      onXong();
    } catch { toast.error('Không từ chối được.'); }
    finally { setDangLam(null); }
  };

  return (
    <div>
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {[
          { v: 'AWAITING', n: 'Chờ xác nhận' },
          { v: 'CONFIRMED', n: 'Đã xác nhận' },
          { v: 'REJECTED', n: 'Từ chối' },
          { v: 'EXPIRED', n: 'Hết hạn' },
          { v: '', n: 'Tất cả' },
        ].map((f) => (
          <button
            key={f.v}
            onClick={() => setLoc(f.v)}
            className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
              loc === f.v ? 'bg-neon-violet text-white' : 'bg-darkcard border border-darkborder text-text-muted hover:text-text-primary'
            }`}
          >
            {f.n}
          </button>
        ))}
      </div>

      {dangTai ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-neon-violet" /></div>
      ) : rows.length === 0 ? (
        <p className="text-text-muted text-center py-16">Không có lượt nào.</p>
      ) : (
        <div className="space-y-2.5">
          {rows.map((r) => (
            <div key={r.id} className="bg-darkcard border border-darkborder rounded-xl p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-text-primary">{r.refCode}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-darkbg border border-darkborder text-text-muted">
                      {r.orderKind}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      r.status === 'AWAITING' ? 'bg-amber-500/20 text-amber-300'
                      : r.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-300'
                      : 'bg-red-500/20 text-red-300'
                    }`}>
                      {r.status}
                    </span>
                  </div>
                  <p className="text-sm text-text-muted mt-1.5 break-all">
                    Đơn {r.orderCode} · {new Date(r.createdAt).toLocaleString('vi-VN')}
                  </p>
                  {r.adminNote && <p className="text-xs text-text-muted mt-1">Ghi chú: {r.adminNote}</p>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-lg font-bold text-text-primary tabular-nums">{dongVN(r.amountVnd)}</span>
                  {r.status === 'AWAITING' && (
                    <>
                      <button
                        onClick={() => xacNhan(r.refCode, r.amountVnd)}
                        disabled={dangLam === r.refCode}
                        className="p-2 rounded-lg bg-green-500/15 border border-green-500/30 text-green-400 hover:bg-green-500/25 disabled:opacity-50"
                        title="Xác nhận đã nhận tiền"
                      >
                        {dangLam === r.refCode ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => tuChoi(r.refCode)}
                        disabled={dangLam === r.refCode}
                        className="p-2 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 disabled:opacity-50"
                        title="Từ chối"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════ ĐỔI KEY ═══════════════════════════

function TabDoiKey({ onXong }: { onXong: () => void }) {
  const [rows, setRows] = useState<Array<KeyReplacement & { user: { id: number; username: string; fullName: string | null; email: string } }>>([]);
  const [dangTai, setDangTai] = useState(true);
  const [loc, setLoc] = useState('PENDING');
  const [dangLam, setDangLam] = useState<number | null>(null);

  const nap = useCallback(async () => {
    setDangTai(true);
    try {
      const r = await commerceAdminApi.listKeyReplacements(loc || undefined);
      setRows(r.data.data);
    } catch { toast.error('Không tải được danh sách.'); }
    finally { setDangTai(false); }
  }, [loc]);

  useEffect(() => { nap(); }, [nap]);

  const duyet = async (id: number, sp: string) => {
    if (!window.confirm(`Duyệt đổi key cho "${sp}"?\n\nHệ thống sẽ lấy một key AVAILABLE từ kho, cấp cho người mua và vô hiệu hoá key cũ.`)) return;
    setDangLam(id);
    try {
      await commerceAdminApi.approveKeyReplacement(id);
      toast.success('Đã cấp key mới.');
      await nap();
      onXong();
    } catch (e) {
      const loi = e as { response?: { data?: { message?: string } } };
      toast.error(loi.response?.data?.message || 'Không duyệt được.');
    } finally { setDangLam(null); }
  };

  const tuChoi = async (id: number) => {
    const note = window.prompt('Lý do từ chối (người mua sẽ đọc được):', 'Không đủ căn cứ');
    if (note === null) return;
    setDangLam(id);
    try {
      await commerceAdminApi.rejectKeyReplacement(id, note);
      toast.success('Đã từ chối.');
      await nap();
      onXong();
    } catch { toast.error('Không từ chối được.'); }
    finally { setDangLam(null); }
  };

  return (
    <div>
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {[{ v: 'PENDING', n: 'Chờ xử lý' }, { v: 'APPROVED', n: 'Đã duyệt' }, { v: 'REJECTED', n: 'Từ chối' }, { v: '', n: 'Tất cả' }].map((f) => (
          <button
            key={f.v}
            onClick={() => setLoc(f.v)}
            className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
              loc === f.v ? 'bg-neon-violet text-white' : 'bg-darkcard border border-darkborder text-text-muted hover:text-text-primary'
            }`}
          >
            {f.n}
          </button>
        ))}
      </div>

      {dangTai ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-neon-violet" /></div>
      ) : rows.length === 0 ? (
        <p className="text-text-muted text-center py-16">Không có yêu cầu nào.</p>
      ) : (
        <div className="space-y-2.5">
          {rows.map((r) => (
            <div key={r.id} className="bg-darkcard border border-darkborder rounded-xl p-4">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <p className="font-semibold text-text-primary break-words">{r.productName}</p>
                  <p className="text-xs text-text-muted mt-1 break-all">
                    {r.user?.username} ({r.user?.email}) · đơn {r.orderCode} · {new Date(r.createdAt).toLocaleString('vi-VN')}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {r.status === 'PENDING' ? (
                    <>
                      <button
                        onClick={() => duyet(r.id, r.productName)}
                        disabled={dangLam === r.id}
                        className="px-3 py-1.5 rounded-lg bg-green-500/15 border border-green-500/30 text-green-400 text-sm hover:bg-green-500/25 disabled:opacity-50 inline-flex items-center gap-1.5"
                      >
                        {dangLam === r.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />} Duyệt
                      </button>
                      <button
                        onClick={() => tuChoi(r.id)}
                        disabled={dangLam === r.id}
                        className="px-3 py-1.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 text-sm hover:bg-red-500/25 disabled:opacity-50"
                      >
                        Từ chối
                      </button>
                    </>
                  ) : (
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      r.status === 'APPROVED' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                    }`}>
                      {r.status === 'APPROVED' ? 'Đã duyệt' : 'Từ chối'}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-text-secondary bg-darkbg rounded-lg p-3 whitespace-pre-wrap break-words">{r.reason}</p>
              {r.adminNote && <p className="text-xs text-text-muted mt-2">Ghi chú admin: {r.adminNote}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════ CÀI ĐẶT ═══════════════════════════

/** Mã BIN theo chuẩn VietQR của các ngân hàng hay dùng. */
const NGAN_HANG = [
  { bin: '970436', ten: 'Vietcombank' },
  { bin: '970418', ten: 'BIDV' },
  { bin: '970405', ten: 'Agribank' },
  { bin: '970415', ten: 'VietinBank' },
  { bin: '970422', ten: 'MB Bank' },
  { bin: '970407', ten: 'Techcombank' },
  { bin: '970432', ten: 'VPBank' },
  { bin: '970423', ten: 'TPBank' },
  { bin: '970416', ten: 'ACB' },
  { bin: '970403', ten: 'Sacombank' },
  { bin: '970443', ten: 'SHB' },
  { bin: '970441', ten: 'VIB' },
  { bin: '970426', ten: 'MSB' },
  { bin: '963388', ten: 'TIMO' },
  { bin: '970448', ten: 'OCB' },
];

function TabCaiDat() {
  const [ch, setCh] = useState<PaymentSettings | null>(null);
  const [dangTai, setDangTai] = useState(true);
  const [dangLuu, setDangLuu] = useState(false);

  useEffect(() => {
    commerceAdminApi.getSettings()
      .then((r) => setCh(r.data.data))
      .catch(() => toast.error('Không tải được cấu hình.'))
      .finally(() => setDangTai(false));
  }, []);

  const luu = async () => {
    if (!ch) return;
    setDangLuu(true);
    try {
      const r = await commerceAdminApi.saveSettings(ch);
      setCh(r.data.data);
      toast.success('Đã lưu cấu hình.');
    } catch (e) {
      const loi = e as { response?: { data?: { message?: string } } };
      toast.error(loi.response?.data?.message || 'Không lưu được.');
    } finally { setDangLuu(false); }
  };

  if (dangTai || !ch) {
    return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-neon-violet" /></div>;
  }

  const dat = <K extends keyof PaymentSettings>(k: K, v: PaymentSettings[K]) => setCh({ ...ch, [k]: v });

  return (
    <div className="max-w-2xl">
      <div className="bg-darkcard border border-darkborder rounded-xl p-5 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="font-semibold text-text-primary">Nhận chuyển khoản ngân hàng</h2>
            <p className="text-xs text-text-muted mt-1">
              Cổng dự phòng khi PayOS gặp sự cố. Bạn tự xác nhận tiền về ở tab &ldquo;Chuyển khoản&rdquo;.
            </p>
          </div>
          <button
            onClick={() => dat('bankTransferEnabled', !ch.bankTransferEnabled)}
            className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
              ch.bankTransferEnabled ? 'bg-neon-violet' : 'bg-darkborder'
            }`}
            aria-label="Bật/tắt chuyển khoản"
          >
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
              ch.bankTransferEnabled ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </div>

        {ch.bankTransferEnabled && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-text-muted">
              Phải điền đủ <b>ngân hàng, số tài khoản và tên chủ tài khoản</b> thì mới lưu được —
              thiếu một trường là người mua nhận mã QR hỏng.
            </p>
          </div>
        )}

        <div>
          <label className="block text-xs text-text-muted mb-1.5">Ngân hàng</label>
          <select
            value={ch.bankBin ?? ''}
            onChange={(e) => {
              const nh = NGAN_HANG.find((x) => x.bin === e.target.value);
              setCh({ ...ch, bankBin: e.target.value || null, bankName: nh?.ten ?? null });
            }}
            className="w-full bg-darkbg border border-darkborder rounded-xl px-4 py-2.5 text-text-primary focus:border-neon-violet outline-none"
          >
            <option value="">— Chọn ngân hàng —</option>
            {NGAN_HANG.map((n) => <option key={n.bin} value={n.bin}>{n.ten} ({n.bin})</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs text-text-muted mb-1.5">Số tài khoản</label>
          <input
            value={ch.bankAccountNo ?? ''}
            onChange={(e) => dat('bankAccountNo', e.target.value.replace(/\D/g, '') || null)}
            inputMode="numeric"
            placeholder="Chỉ chữ số"
            className="w-full bg-darkbg border border-darkborder rounded-xl px-4 py-2.5 text-text-primary font-mono focus:border-neon-violet outline-none"
          />
        </div>

        <div>
          <label className="block text-xs text-text-muted mb-1.5">Tên chủ tài khoản</label>
          <input
            value={ch.bankAccountName ?? ''}
            onChange={(e) => dat('bankAccountName', e.target.value.toUpperCase() || null)}
            placeholder="NGUYEN VAN A"
            className="w-full bg-darkbg border border-darkborder rounded-xl px-4 py-2.5 text-text-primary uppercase focus:border-neon-violet outline-none"
          />
        </div>

        <div>
          <label className="block text-xs text-text-muted mb-1.5">
            Thời hạn chuyển khoản (phút) — quá hạn thì mã QR hết hiệu lực
          </label>
          <input
            type="number" min={5} max={1440}
            value={ch.transferTtlMinutes}
            onChange={(e) => dat('transferTtlMinutes', Number(e.target.value))}
            className="w-full bg-darkbg border border-darkborder rounded-xl px-4 py-2.5 text-text-primary tabular-nums focus:border-neon-violet outline-none"
          />
        </div>

        <div>
          <label className="block text-xs text-text-muted mb-1.5">Ghi chú hiện cho người mua (không bắt buộc)</label>
          <textarea
            rows={3}
            value={ch.note ?? ''}
            onChange={(e) => dat('note', e.target.value || null)}
            placeholder="VD: Đơn được duyệt trong giờ hành chính, tối đa 2 tiếng."
            className="w-full bg-darkbg border border-darkborder rounded-xl px-4 py-2.5 text-text-primary text-sm resize-none focus:border-neon-violet outline-none"
          />
        </div>

        <button
          onClick={luu}
          disabled={dangLuu}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-semibold disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {dangLuu ? <><Loader2 className="w-4 h-4 animate-spin" /> Đang lưu…</> : 'Lưu cấu hình'}
        </button>
      </div>

      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        <Link href="/admin/pro-codes" className="bg-darkcard border border-darkborder rounded-xl p-4 hover:border-neon-violet/40 transition-colors">
          <Crown className="w-4 h-4 text-amber-400 mb-2" />
          <p className="text-sm font-semibold text-text-primary">Gói Pro &amp; mã Pro</p>
          <p className="text-xs text-text-muted mt-0.5">Sửa bảng giá, tạo mã tặng</p>
        </Link>
        <Link href="/admin/shop" className="bg-darkcard border border-darkborder rounded-xl p-4 hover:border-neon-violet/40 transition-colors">
          <ShoppingBag className="w-4 h-4 text-neon-violet mb-2" />
          <p className="text-sm font-semibold text-text-primary">Sản phẩm &amp; kho key</p>
          <p className="text-xs text-text-muted mt-0.5">Thêm hàng, nhập key, đơn hàng</p>
        </Link>
      </div>
    </div>
  );
}
