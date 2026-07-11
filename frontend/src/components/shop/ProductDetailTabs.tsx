'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  ListChecks,
  FileText,
  Package,
  ShieldCheck,
  Download,
  Clock,
  Star,
  Wrench,
  BookOpen,
  Users,
  Zap,
} from 'lucide-react';
import type { Product, ProductSpec } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';
import ProductMarkdown from './ProductMarkdown';

type TabId = 'overview' | 'specs' | 'guidance';

// ─── Spec Table ────────────────────────────────────────────────────────────────
function SpecTable({ specs, category }: { specs?: ProductSpec[]; category: string }) {
  const safeSpecs = specs ?? [];

  if (safeSpecs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(168,85,247,0.1)' }}>
          <ListChecks className="w-7 h-7" style={{ color: 'rgba(168,85,247,0.4)' }} />
        </div>
        <p className="text-sm text-text-muted">Chưa có thông số kỹ thuật cho sản phẩm này</p>
      </div>
    );
  }

  const c = {
    primary: '#a855f7',
    secondary: '#ec4899',
    border: 'rgba(168,85,247,0.2)',
    borderLight: 'rgba(168,85,247,0.08)',
    rowHover: 'rgba(168,85,247,0.04)',
    label: 'rgba(168,85,247,0.7)',
  };

  return (
    <div className="rounded-xl overflow-hidden border" style={{ borderColor: c.border }}>
      {/* Table header */}
      <div
        className="grid px-5 py-3 text-[10px] font-bold uppercase tracking-widest"
        style={{
          gridTemplateColumns: '1fr 2fr',
          background: 'rgba(168,85,247,0.06)',
          borderBottom: `1px solid ${c.border}`,
          color: c.label,
        }}
      >
        <span>Thông số</span>
        <span>Giá trị</span>
      </div>

      {/* Rows */}
      {safeSpecs.map((spec, index) => (
        <div
          key={index}
          className="grid px-5 py-3.5 transition-colors"
          style={{
            gridTemplateColumns: '1fr 2fr',
            borderBottom: index < safeSpecs.length - 1 ? `1px solid ${c.borderLight}` : 'none',
            background: 'transparent',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = c.rowHover; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
        >
          <div className="flex items-center">
            <span className="w-1 h-1 rounded-full mr-3" style={{ background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})` }} />
            <span className="text-xs font-medium text-text-secondary">{spec.label}</span>
          </div>
          <span className="text-sm text-text-primary font-medium">{spec.value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
interface ProductDetailTabsProps {
  product: Product;
}

export default function ProductDetailTabs({ product }: ProductDetailTabsProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  const c = {
    primary: '#a855f7',
    secondary: '#ec4899',
    border: 'rgba(168,85,247,0.2)',
    borderLight: 'rgba(168,85,247,0.08)',
    glassBg: 'rgba(10,6,25,0.85)',
    glassBgLight: 'rgba(20,15,40,0.6)',
    tabActive: 'rgba(168,85,247,0.15)',
    text: '#f8fafc',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
  };

  const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Tổng quan & Tính năng', icon: BookOpen },
    { id: 'specs', label: 'Thông số kỹ thuật', icon: ListChecks },
    { id: 'guidance', label: 'Hướng dẫn & Bảo hành', icon: ShieldCheck },
  ];

  const safeFeatures = product.features ?? [];
  const displayedFeatures = showAllFeatures ? safeFeatures : safeFeatures.slice(0, 6);

  return (
    <div>
      {/* ── Tab Bar ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 p-1 rounded-xl border mb-8 w-fit" style={{ borderColor: c.border, background: c.glassBg }}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap"
            style={{
              background: activeTab === id ? `linear-gradient(135deg, ${c.primary}30, ${c.secondary}20)` : 'transparent',
              border: activeTab === id ? `1px solid ${c.border}` : '1px solid transparent',
              color: activeTab === id ? c.primary : c.textMuted,
              boxShadow: activeTab === id ? `0 0 12px ${c.primary}20` : 'none',
            }}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ─────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {/* Description */}
            <div
              className="rounded-2xl p-6 sm:p-8 mb-5 border"
              style={{ background: c.glassBgLight, borderColor: c.border }}
            >
              <h3 className="text-lg font-heading font-bold text-text-primary mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" style={{ color: c.primary }} />
                Mô tả sản phẩm
              </h3>
              <ProductMarkdown content={product.description || ''} />
            </div>

            {/* Feature bullets */}
            {safeFeatures.length > 0 && (
              <div
                className="rounded-2xl p-6 sm:p-8 border"
                style={{ background: c.glassBgLight, borderColor: c.border }}
              >
                <h3 className="text-lg font-heading font-bold text-text-primary mb-6 flex items-center gap-2">
                  <Zap className="w-5 h-5" style={{ color: c.primary }} />
                  Tính năng nổi bật
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {displayedFeatures.map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-start gap-3"
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          background: `linear-gradient(135deg, ${c.primary}20, ${c.secondary}20)`,
                          border: `1px solid ${c.primary}40`,
                          boxShadow: `0 0 8px ${c.primary}30`,
                        }}
                      >
                        <CheckCircle2 className="w-4 h-4" style={{ color: c.primary }} />
                      </div>
                      <span className="text-sm leading-relaxed" style={{ color: c.textSecondary }}>
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {safeFeatures.length > 6 && (
                  <button
                    onClick={() => setShowAllFeatures(!showAllFeatures)}
                    className="mt-4 text-sm font-medium transition-colors"
                    style={{ color: c.primary }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#818cf8'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = c.primary; }}
                  >
                    {showAllFeatures ? `↑ Thu gọn` : `↓ Xem thêm ${safeFeatures.length - 6} tính năng`}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'specs' && (
          <motion.div
            key="specs"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {/* Category + count header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${c.primary}15` }}
                >
                  <ListChecks className="w-4 h-4" style={{ color: c.primary }} />
                </div>
                <div>
                  <h3 className="text-base font-heading font-bold text-text-primary">Thông số kỹ thuật</h3>
                  <p className="text-xs" style={{ color: c.textMuted }}>{product.category}</p>
                </div>
              </div>
              {(product.specs?.length ?? 0) > 0 && (
                <span
                  className="px-2.5 py-1 rounded-full text-[10px] font-bold"
                  style={{ background: `${c.primary}15`, color: c.primary, border: `1px solid ${c.primary}30` }}
                >
                  {product.specs?.length} thông số
                </span>
              )}
            </div>

            <SpecTable specs={product.specs} category={product.category} />

            {/* Category hint */}
            <div className="mt-4 flex items-center gap-2 text-xs" style={{ color: c.textMuted }}>
              <Package className="w-3.5 h-3.5" />
              <span>Thông số được cập nhật theo danh mục: <strong style={{ color: c.primary }}>{product.category}</strong></span>
            </div>
          </motion.div>
        )}

        {activeTab === 'guidance' && (
          <motion.div
            key="guidance"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-center gap-2 mb-5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${c.primary}15` }}
              >
                <Wrench className="w-4 h-4" style={{ color: c.primary }} />
              </div>
              <div>
                <h3 className="text-base font-heading font-bold text-text-primary">Hướng dẫn & Bảo hành</h3>
                <p className="text-xs" style={{ color: c.textMuted }}>Cài đặt, sử dụng và chính sách đổi trả</p>
              </div>
            </div>

            {product.guidance ? (
              <div
                className="rounded-2xl p-6 sm:p-8 border"
                style={{
                  background: c.glassBgLight,
                  borderColor: c.border,
                }}
              >
                <ProductMarkdown content={product.guidance} />
              </div>
            ) : (
              <div
                className="rounded-2xl p-8 border text-center"
                style={{ background: c.glassBgLight, borderColor: c.border }}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: `${c.primary}10` }}>
                  <Wrench className="w-7 h-7" style={{ color: `${c.primary}60` }} />
                </div>
                <p className="text-sm font-medium text-text-primary mb-1">Chưa có hướng dẫn</p>
                <p className="text-xs" style={{ color: c.textMuted }}>
                  Admin có thể thêm nội dung "Hướng dẫn & Bảo hành" trong trang quản lý sản phẩm.
                </p>
              </div>
            )}

            {/* Quick info cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
              {[
                { icon: Download, label: 'File sản phẩm', value: product.fileUrl ? 'Có sẵn' : 'Không' },
                { icon: ShieldCheck, label: 'Bảo hành', value: product.category === 'Accounts' ? 'Có' : 'Theo sản phẩm' },
                { icon: Users, label: 'Đã bán', value: `${(product.soldCount ?? 0).toLocaleString()}` },
                { icon: Star, label: 'Đánh giá', value: `${product.rating}/5 (${product.reviewCount})` },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="rounded-xl p-3 border"
                  style={{ background: c.glassBgLight, borderColor: c.borderLight }}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon className="w-3.5 h-3.5" style={{ color: c.primary }} />
                    <span className="text-[10px] uppercase tracking-wider" style={{ color: c.textMuted }}>{label}</span>
                  </div>
                  <p className="text-xs font-semibold text-text-primary">{value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
