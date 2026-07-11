'use client';

import { useState } from 'react';
import { Download, KeyRound, Eye, EyeOff, Truck, PackageCheck, Package, Clock, CheckCircle2, Copy } from 'lucide-react';
import { toast } from 'sonner';
import type { OrderResponse } from '@/lib/api/shop';

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

function DigitalDelivery({ order }: { order: OrderResponse }) {
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
            </div>
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

/**
 * Post-purchase extras for a shop order: digital delivery (file / account-key)
 * and, for physical orders, the shipping status timeline. Renders nothing for
 * unpaid orders (the backend only releases deliverables once PAID).
 */
export default function ShopOrderExtras({ order }: { order?: OrderResponse | null }) {
  if (!order || order.status !== 'PAID') return null;
  const isPhysical = order.orderType === 'PHYSICAL' || order.orderType === 'MIXED';
  return (
    <div className="space-y-4">
      <DigitalDelivery order={order} />
      {isPhysical && <ShippingTimeline order={order} />}
    </div>
  );
}
