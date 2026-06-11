'use client';

import { useState } from 'react';
import { Wallet, Gift, Copy, Check, AlertCircle } from 'lucide-react';
import type { CyberInventory, DiscountCode } from '@/lib/api';

interface InventoryWindowProps {
  inventory: CyberInventory | null;
  loading: boolean;
  onMintCoupon: (amount: number) => Promise<DiscountCode>;
  onMintSuccess?: (coupon: DiscountCode) => void;
}

export function InventoryWindow({
  inventory,
  loading,
  onMintCoupon,
  onMintSuccess,
}: InventoryWindowProps) {
  const [mintAmount, setMintAmount] = useState(10);
  const [minting, setMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<number | null>(null);
  const [lastCoupon, setLastCoupon] = useState<DiscountCode | null>(null);

  const handleMint = async () => {
    if (!inventory || mintAmount > inventory.pointBalance) {
      setError('Insufficient point balance.');
      return;
    }
    setError(null);
    setMinting(true);
    try {
      const coupon = await onMintCoupon(mintAmount);
      setLastCoupon(coupon);
      onMintSuccess?.(coupon);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Minting failed.');
    } finally {
      setMinting(false);
    }
  };

  const showCoupon = (coupon: DiscountCode) => setLastCoupon(coupon);

  const copyCode = (code: string, id: number) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
        <div className="h-8 bg-white/5 rounded animate-pulse" />
        <div className="h-4 bg-white/5 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Balance */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet size={16} className="text-neon-amber" />
          <span className="font-mono text-xs text-white/50">POINT_BALANCE</span>
        </div>
        <span className="font-mono text-2xl font-black text-neon-amber">
          {inventory?.pointBalance ?? 0}
        </span>
      </div>

      {/* Mint Form */}
      <div className="border border-neon-amber/20 rounded bg-neon-amber/5 p-3 space-y-2">
        <div className="flex items-center gap-2">
          <Gift size={12} className="text-neon-amber" />
          <span className="font-mono text-xs text-neon-amber">MINT_COUPON</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            max={100}
            value={mintAmount}
            onChange={(e) => {
              setMintAmount(parseInt(e.target.value) || 1);
              setError(null);
            }}
            disabled={minting}
            className="flex-1 bg-cyber-bg border border-neon-amber/30 rounded px-2 py-1 font-mono text-sm text-neon-amber outline-none placeholder:text-white/20 disabled:opacity-50"
            placeholder="1-100"
          />
          <span className="font-mono text-xs text-white/40">POINTS</span>
          <button
            onClick={handleMint}
            disabled={minting || !inventory || mintAmount > inventory.pointBalance}
            className="px-3 py-1 rounded bg-neon-amber/20 border border-neon-amber/40 text-neon-amber font-mono text-xs hover:bg-neon-amber/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            {minting ? '[...]' : '[MINT]'}
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-1 text-red-400 font-mono text-[10px]">
            <AlertCircle size={10} />
            {error}
          </div>
        )}

        {lastCoupon && (
          <div className="flex items-center gap-2 bg-neon-green/10 border border-neon-green/30 rounded px-2 py-1">
            <span className="font-mono text-xs text-neon-green">
              COUPON: {lastCoupon.code}
            </span>
            <span className="font-mono text-[10px] text-white/50">
              {lastCoupon.discountValue}% OFF
            </span>
          </div>
        )}
      </div>

      {/* Coupon History */}
      <div className="space-y-1">
        <div className="font-mono text-[10px] text-white/30 mb-1">COUPON_HISTORY</div>
        {inventory?.coupons && inventory.coupons.length > 0 ? (
          <div className="max-h-40 overflow-y-auto space-y-1">
            {inventory.coupons.map((coupon) => (
              <div
                key={coupon.id}
                className="flex items-center justify-between bg-white/5 border border-white/10 rounded px-2 py-1"
              >
                <div>
                  <span className="font-mono text-xs text-neon-green">{coupon.code}</span>
                  <span className="ml-2 font-mono text-[10px] text-white/40">
                    {coupon.discountValue}% OFF
                  </span>
                  {coupon.expiresAt && (
                    <span className="ml-2 font-mono text-[9px] text-white/20">
                      EXP: {new Date(coupon.expiresAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => copyCode(coupon.code, coupon.id)}
                  className="text-white/30 hover:text-neon-green transition-colors"
                >
                  {copied === coupon.id ? <Check size={10} /> : <Copy size={10} />}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="font-mono text-[10px] text-white/20 italic">
            &gt; no coupons minted yet
          </div>
        )}
      </div>
    </div>
  );
}
