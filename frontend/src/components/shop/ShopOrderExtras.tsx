'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Download, KeyRound, Eye, EyeOff, Truck, PackageCheck, Package, Clock, CheckCircle2, Copy,
  LifeBuoy, FileText, RotateCcw, Loader2, AlertTriangle, X,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  requestKeyReplacement, getMyKeyReplacements, downloadInvoice, getReorderItems,
  type OrderResponse, type KeyReplacementRow, type ReorderRow,
} from '@/lib/api/shop';
import { useCartStore } from '@/store/cartStore';

// Physical shipping lifecycle shown as a timeline.
const SHIP_STEPS: Array<{ key: string; label: string; icon: typeof Package }> = [
  { key: 'PENDING', label: 'Chờ xác nhận', icon: Clock },
  { key: 'PROCESSING', label: 'Đang chuẩn bị', icon: Package },
  { key: 'SHIPPED', label: 'Đang giao', icon: Truck },
  { key: 'DELIVERED', label: 'Đã giao', icon: PackageCheck },
  { key: 'COMPLETED', label: 'Hoàn thành', icon: CheckCircle2 },
];

function ShippingTimeline({ order }: { order: OrderResponse }) {
  const current = order.fulfillmentStatus || 'PENDING';
  const currentIdx = Math.max(0, SHIP_STEPS.findIndex((s) => s.key === current));
  return (
    <div className="bg-darkbg rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Truck className="w-4 h-4 text-neon-indigo" />
        <span className="text-xs font-semibold text-neon-indigo uppercase tracking-wide">Trạng thái giao hàng</span>
      </div>
      <div className="flex items-center">
        {SHIP_STEPS.map((step, i) => {
          const done = i <= currentIdx;
          const Icon = step.icon;
          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center border ${done ? 'bg-neon-violet/20 border-neon-violet text-neon-violet' : 'bg-darkcard border-darkborder text-text-muted'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-[10px] mt-1.5 text-center max-w-[70px] leading-tight ${done ? 'text-text-primary' : 'text-text-muted'}`}>{step.label}</span>
              </div>
              {i < SHIP_STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 mx-1 ${i < currentIdx ? 'bg-neon-violet' : 'bg-darkborder'}`} />
              )}
            </div>
          );
        })}
      </div>
      {order.trackingNumber && (
        <p className="text-xs text-text-muted mt-4">
          Mã vận đơn: <span className="font-mono text-text-primary font-semibold">{order.trackingNumber}</span>
        </p>
      )}
      {order.buyerAddress && (
        <p className="text-xs text-text-muted mt-1">Giao tới: {order.buyerAddress}{order.shippingProvince ? `, ${order.shippingProvince}` : ''}</p>
      )}
    </div>
  );
}

function DigitalDelivery({
  order, yeuCau, onDoiKey,
}: {
  order: OrderResponse;
  yeuCau: KeyReplacementRow[];
  onDoiKey: (itemId: number, productName: string) => void;
}) {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const digitalItems = (order.items || []).filter((it) => it.fileUrl || it.digitalContent);
  if (digitalItems.length === 0) return null;

  const copy = (text: string) => {
    navigator.clipboard?.writeText(text).then(() => toast.success('Đã sao chép')).catch(() => {});
  };

  return (
    <div className="bg-darkbg rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <KeyRound className="w-4 h-4 text-neon-emerald" />
        <span className="text-xs font-semibold text-neon-emerald uppercase tracking-wide">Sản phẩm số của bạn</span>
      </div>
      <div className="space-y-3">
        {digitalItems.map((it) => (
          <div key={it.id} className="border border-darkborder rounded-lg p-3">
            <p className="text-sm font-medium text-text-primary mb-2">{it.productName}</p>
            <div className="flex flex-wrap gap-2">
              {it.fileUrl && (
                <a
                  href={it.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neon-violet/15 border border-neon-violet/30 text-neon-violet text-xs font-medium hover:bg-neon-violet/25 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Tải file
                </a>
              )}
              {it.digitalContent && (
                <button
                  onClick={() => setRevealed((r) => ({ ...r, [it.id]: !r[it.id] }))}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-darkcard border border-darkborder text-text-secondary text-xs font-medium hover:border-neon-emerald/40 transition-colors"
                >
                  {revealed[it.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {revealed[it.id] ? 'Ẩn' : 'Xem tài khoản / mã'}
                </button>
              )}
              {/* Đổi key hỏng — trạng thái của yêu cầu hiện ngay trên nút, để
                  người mua không gửi lại yêu cầu thứ hai vì tưởng chưa gửi. */}
              {(() => {
                const yc = yeuCau.find((y) => y.orderItemId === it.id);
                if (yc?.status === 'PENDING') {
                  return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium">
                      <Clock className="w-3.5 h-3.5" /> Đang chờ admin xử lý
                    </span>
                  );
                }
                if (yc?.status === 'APPROVED') {
                  return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Đã cấp key mới
                    </span>
                  );
                }
                return (
                  <button
                    onClick={() => onDoiKey(it.id, it.productName)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-darkcard border border-darkborder text-text-muted text-xs font-medium hover:border-amber-500/40 hover:text-amber-300 transition-colors"
                  >
                    <LifeBuoy className="w-3.5 h-3.5" /> Key không dùng được?
                  </button>
                );
              })()}
            </div>
            {(() => {
              const yc = yeuCau.find((y) => y.orderItemId === it.id);
              return yc?.status === 'REJECTED' && yc.adminNote ? (
                <p className="mt-2 text-xs text-red-300/90 bg-red-500/10 border border-red-500/25 rounded-lg p-2.5">
                  Yêu cầu đổi key bị từ chối: {yc.adminNote}
                </p>
              ) : null;
            })()}
            {it.digitalContent && revealed[it.id] && (
              <div className="mt-2 relative">
                <pre className="text-xs text-text-primary bg-darkcard border border-darkborder rounded-lg p-3 whitespace-pre-wrap break-words font-mono">{it.digitalContent}</pre>
                <button
                  onClick={() => copy(it.digitalContent!)}
                  className="absolute top-2 right-2 p-1 rounded bg-darkbg/80 text-text-muted hover:text-neon-emerald"
                  title="Sao chép"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Hộp thoại mô tả lỗi key. Bắt buộc ≥10 ký tự — backend cũng chặn. */
function HopThoaiDoiKey({
  moFor, onDong, onGui, dangGui,
}: {
  moFor: { itemId: number; productName: string } | null;
  onDong: () => void;
  onGui: (lyDo: string) => void;
  dangGui: boolean;
}) {
  const [lyDo, setLyDo] = useState('');
  useEffect(() => { if (moFor) setLyDo(''); }, [moFor]);
  if (!moFor) return null;
  const du = lyDo.trim().length >= 10;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={onDong}>
      <div
        className="w-full max-w-md bg-darkcard border border-darkborder rounded-2xl p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <h3 className="font-semibold text-text-primary">Yêu cầu đổi key</h3>
            <p className="text-xs text-text-muted mt-0.5 break-words">{moFor.productName}</p>
          </div>
          <button onClick={onDong} className="text-text-muted hover:text-text-primary flex-shrink-0" aria-label="Đóng">
            <X className="w-4 h-4" />
          </button>
        </div>
        <label className="block text-xs text-text-muted mb-1.5">
          Mô tả lỗi bạn gặp (càng cụ thể càng được xử lý nhanh)
        </label>
        <textarea
          value={lyDo}
          onChange={(e) => setLyDo(e.target.value)}
          rows={4}
          maxLength={2000}
          placeholder="e.g. Login says wrong password, tried 3 times, screenshot sent via support chat…"
          className="w-full bg-darkbg border border-darkborder rounded-xl px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted/60 focus:border-neon-violet outline-none resize-none"
        />
        <div className="flex items-center justify-between mt-1.5 mb-4">
          <span className={`text-xs ${du ? 'text-text-muted' : 'text-amber-400'}`}>
            {du ? 'Đủ thông tin' : `Cần thêm ${10 - lyDo.trim().length} ký tự`}
          </span>
          <span className="text-xs text-text-muted">{lyDo.length}/2000</span>
        </div>
        <div className="flex items-start gap-2 text-xs text-text-muted bg-darkbg rounded-lg p-3 mb-4">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <span>Admin sẽ kiểm tra và cấp key mới từ kho nếu hợp lệ. Key cũ sẽ bị vô hiệu hoá.</span>
        </div>
        <button
          onClick={() => onGui(lyDo.trim())}
          disabled={!du || dangGui}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {dangGui ? <><Loader2 className="w-4 h-4 animate-spin" /> Đang gửi…</> : 'Gửi yêu cầu'}
        </button>
      </div>
    </div>
  );
}

/**
 * Phần sau bán của một đơn shop: hàng số đã giao, timeline vận chuyển, đổi
 * key hỏng, tải hoá đơn và mua lại.
 *
 * Không hiện gì với đơn CHƯA thanh toán — backend cũng chỉ nhả nội dung số
 * khi đơn đã PAID, đây chỉ là lớp thứ hai.
 */
export default function ShopOrderExtras({ order }: { order?: OrderResponse | null }) {
  const [yeuCau, setYeuCau] = useState<KeyReplacementRow[]>([]);
  const [hopThoai, setHopThoai] = useState<{ itemId: number; productName: string } | null>(null);
  const [dangGui, setDangGui] = useState(false);
  const [dangTaiHd, setDangTaiHd] = useState(false);
  const [dangMuaLai, setDangMuaLai] = useState(false);
  const addShopItem = useCartStore((s) => s.addShopItem);

  const orderCode = order?.orderCode;
  const daTra = order?.status === 'PAID';

  const napYeuCau = useCallback(async () => {
    if (!daTra) return;
    try {
      const r = await getMyKeyReplacements();
      setYeuCau(r.data ?? []);
    } catch { /* không lấy được thì nút đổi key vẫn bấm được, backend sẽ chặn trùng */ }
  }, [daTra]);

  useEffect(() => { napYeuCau(); }, [napYeuCau]);

  if (!order || !daTra) return null;
  const isPhysical = order.orderType === 'PHYSICAL' || order.orderType === 'MIXED';
  const cuaDon = yeuCau.filter((y) => y.orderCode === orderCode);

  const guiDoiKey = async (lyDo: string) => {
    if (!hopThoai || !orderCode) return;
    setDangGui(true);
    try {
      await requestKeyReplacement(orderCode, hopThoai.itemId, lyDo);
      toast.success('Đã gửi yêu cầu. Admin sẽ xử lý sớm nhất.');
      setHopThoai(null);
      await napYeuCau();
    } catch (e) {
      let msg = 'Không gửi được yêu cầu.';
      try { msg = (JSON.parse((e as Error).message) as { message?: string }).message ?? msg; } catch { /* không phải JSON */ }
      toast.error(msg);
    } finally {
      setDangGui(false);
    }
  };

  const taiHoaDon = async () => {
    if (!orderCode) return;
    setDangTaiHd(true);
    try {
      await downloadInvoice(orderCode);
    } catch {
      toast.error('Không tải được hoá đơn. Vui lòng thử lại.');
    } finally {
      setDangTaiHd(false);
    }
  };

  /**
   * Mua lại: lấy trạng thái HIỆN TẠI của từng sản phẩm rồi mới nạp vào giỏ.
   * Nạp thẳng theo giá cũ là bán sai giá; bỏ qua hàng đã gỡ bán là để người
   * mua đi tới checkout rồi mới nhận lỗi.
   */
  const muaLai = async () => {
    if (!orderCode) return;
    setDangMuaLai(true);
    try {
      const r = await getReorderItems(orderCode);
      const rows: ReorderRow[] = r.data ?? [];
      const duocMua = rows.filter((x) => x.duHang && x.productId !== null);
      const boQua = rows.length - duocMua.length;

      for (const x of duocMua) {
        for (let i = 0; i < x.quantity; i++) {
          addShopItem({
            id: String(x.productId),
            name: x.name,
            slug: x.slug ?? '',
            price: x.giaMoi ?? x.giaCu,
            thumbnail: x.image ?? '',
          } as Parameters<typeof addShopItem>[0]);
        }
      }

      if (duocMua.length === 0) {
        toast.error('Không sản phẩm nào trong đơn này còn bán.');
        return;
      }
      const doiGia = duocMua.filter((x) => x.doiGia).length;
      toast.success(
        `Đã thêm ${duocMua.length} sản phẩm vào giỏ.` +
        (doiGia > 0 ? ` ${doiGia} sản phẩm đã đổi giá.` : '') +
        (boQua > 0 ? ` ${boQua} sản phẩm bỏ qua (hết hàng hoặc ngừng bán).` : ''),
      );
    } catch {
      toast.error('Không nạp lại được đơn này.');
    } finally {
      setDangMuaLai(false);
    }
  };

  return (
    <div className="space-y-4">
      <DigitalDelivery
        order={order}
        yeuCau={cuaDon}
        onDoiKey={(itemId, productName) => setHopThoai({ itemId, productName })}
      />
      {isPhysical && <ShippingTimeline order={order} />}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={taiHoaDon}
          disabled={dangTaiHd}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-darkbg border border-darkborder text-text-secondary text-xs font-medium hover:border-neon-violet/40 transition-colors disabled:opacity-60"
        >
          {dangTaiHd ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
          Tải hoá đơn PDF
        </button>
        <button
          onClick={muaLai}
          disabled={dangMuaLai}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-darkbg border border-darkborder text-text-secondary text-xs font-medium hover:border-neon-violet/40 transition-colors disabled:opacity-60"
        >
          {dangMuaLai ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
          Mua lại
        </button>
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-darkbg border border-darkborder text-text-muted text-xs font-medium hover:border-neon-violet/40 transition-colors"
        >
          Xem giỏ hàng
        </Link>
      </div>

      <HopThoaiDoiKey
        moFor={hopThoai}
        onDong={() => setHopThoai(null)}
        onGui={guiDoiKey}
        dangGui={dangGui}
      />
    </div>
  );
}
