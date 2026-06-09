'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Tag, Plus, Edit2, Trash2, X, CheckCircle, XCircle,
  Percent, TrendingDown, Loader2, Copy, Clock,
  Search, ToggleLeft, ToggleRight,
} from 'lucide-react';
import { adminGetDiscounts, adminCreateDiscount, adminUpdateDiscount, adminDeleteDiscount } from '@/lib/api/shop';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(price);
}

interface DiscountCode {
  id: number;
  code: string;
  discountType: string;
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  maxUses?: number;
  usedCount: number;
  active: boolean;
  description?: string;
  expiresAt?: string;
}

export default function AdminDiscountsPage() {
  const { t } = useTranslation();
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return t('admin.discounts.noExpiry');
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(dateStr));
  };

  const [showModal, setShowModal] = useState(false);
  const [editingCode, setEditingCode] = useState<DiscountCode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [form, setForm] = useState({
    code: '',
    description: '',
    discountType: 'PERCENT',
    discountValue: '',
    maxUses: '100',
    minOrderAmount: '',
    maxDiscountAmount: '',
    expiresAt: '',
  });

  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    setLoading(true);
    try {
      const res = await adminGetDiscounts();
      setCodes(res.data);
      } catch {
      toast.error(t('admin.discounts.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const filteredCodes = codes.filter((c) =>
    c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openCreate = () => {
    setEditingCode(null);
    setForm({
      code: '',
      description: '',
      discountType: 'PERCENT',
      discountValue: '',
      maxUses: '100',
      minOrderAmount: '',
      maxDiscountAmount: '',
      expiresAt: '',
    });
    setShowModal(true);
  };

  const openEdit = (code: DiscountCode) => {
    setEditingCode(code);
    setForm({
      code: code.code,
      description: code.description || '',
      discountType: code.discountType,
      discountValue: String(code.discountValue),
      maxUses: String(code.maxUses || 100),
      minOrderAmount: code.minOrderAmount ? String(code.minOrderAmount) : '',
      maxDiscountAmount: code.maxDiscountAmount ? String(code.maxDiscountAmount) : '',
      expiresAt: code.expiresAt ? code.expiresAt.split('T')[0] : '',
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.code.trim()) {
      toast.error(t('admin.discounts.codeRequired'));
      return;
    }
    if (!form.discountValue || Number(form.discountValue) <= 0) {
      toast.error(t('admin.discounts.valueMustBePositive'));
      return;
    }

    setSaving(true);
    const data: Record<string, unknown> = {
      code: form.code.toUpperCase().trim(),
      description: form.description || undefined,
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      maxUses: form.maxUses ? Number(form.maxUses) : undefined,
      minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : 0,
      maxDiscountAmount: form.maxDiscountAmount ? Number(form.maxDiscountAmount) : undefined,
      expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : undefined,
      active: true,
    };

    try {
      if (editingCode) {
        await adminUpdateDiscount(editingCode.id, data);
        toast.success(t('admin.discounts.updateSuccess'));
      } else {
        await adminCreateDiscount(data);
        toast.success(t('admin.discounts.createSuccess'));
      }
      setShowModal(false);
      fetchCodes();
    } catch {
      toast.error(editingCode ? t('admin.discounts.updateError') : t('admin.discounts.createError'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, code: string) => {
    if (!confirm(t('admin.discounts.deleteConfirm', { code }))) return;
    try {
      await adminDeleteDiscount(id);
      setCodes((prev) => prev.filter((c) => c.id !== id));
      toast.success(t('admin.discounts.deleteSuccess'));
    } catch {
      toast.error(t('admin.discounts.deleteError'));
    }
  };

  const handleToggle = async (code: DiscountCode) => {
    try {
      await adminUpdateDiscount(code.id, { active: !code.active });
      setCodes((prev) =>
        prev.map((c) => (c.id === code.id ? { ...c, active: !c.active } : c))
      );
      toast.success(code.active ? t('admin.discounts.deactivated') : t('admin.discounts.activated'));
    } catch {
      toast.error(t('admin.discounts.toggleError'));
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(t('admin.discounts.codeCopied', { code }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">
            {t('admin.discounts.title')}
          </h1>
          <p className="text-text-muted text-sm mt-1">
            {t('admin.discounts.subtitle')}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          {t('admin.discounts.createNew')}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-darkcard border border-darkborder rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neon-violet/10 flex items-center justify-center">
              <Tag className="w-5 h-5 text-neon-violet" />
            </div>
            <div>
              <p className="text-2xl font-heading font-bold text-text-primary">{codes.length}</p>
              <p className="text-xs text-text-muted">{t('admin.discounts.totalCodes')}</p>
            </div>
          </div>
        </div>
        <div className="bg-darkcard border border-darkborder rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-heading font-bold text-text-primary">
                {codes.filter((c) => c.active).length}
              </p>
              <p className="text-xs text-text-muted">{t('admin.discounts.active')}</p>
            </div>
          </div>
        </div>
        <div className="bg-darkcard border border-darkborder rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-heading font-bold text-text-primary">
                {codes.reduce((sum, c) => sum + c.usedCount, 0)}
              </p>
              <p className="text-xs text-text-muted">{t('admin.discounts.totalUses')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('admin.discounts.searchPlaceholder')}
            className="w-full pl-10 pr-4 py-2.5 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-darkcard border border-darkborder rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-neon-violet" />
            </div>
          ) : filteredCodes.length === 0 ? (
            <div className="text-center py-12">
              <Tag className="w-10 h-10 text-text-muted/30 mx-auto mb-3" />
              <p className="text-text-muted text-sm">{t('admin.discounts.noCodes')}</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-darkborder">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">{t('admin.discounts.code')}</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">{t('admin.discounts.descriptionCol')}</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">{t('admin.discounts.discount')}</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">{t('admin.discounts.uses')}</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">{t('admin.discounts.expiresAt')}</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">{t('admin.discounts.status')}</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">{t('admin.discounts.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredCodes.map((code, i) => (
                  <motion.tr
                    key={code.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-darkborder/50 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-neon-violet text-sm">{code.code}</span>
                        <button
                          onClick={() => copyCode(code.code)}
                          className="p-1 rounded hover:bg-white/5 text-text-muted hover:text-text-primary transition-colors"
                          title={t('admin.discounts.copyCode')}
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-text-secondary line-clamp-1">{code.description || '-'}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        {code.discountType === 'PERCENT' ? (
                          <Percent className="w-3.5 h-3.5 text-neon-indigo" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5 text-neon-indigo" />
                        )}
                        <span className="text-sm font-semibold text-text-primary">
                          {code.discountType === 'PERCENT'
                            ? `${code.discountValue}%`
                            : formatPrice(code.discountValue)}
                        </span>
                      </div>
                      {code.maxDiscountAmount && (
                        <p className="text-xs text-text-muted">{t('admin.discounts.maxDiscount')}: {formatPrice(code.maxDiscountAmount)}</p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <span className="text-sm font-semibold text-text-primary">
                          {code.usedCount} / {code.maxUses || '∞'}
                        </span>
                        <div className="w-16 h-1.5 bg-darkborder rounded-full mt-1.5">
                          <div
                            className={`h-full rounded-full transition-all ${
                              (code.maxUses && code.usedCount >= code.maxUses)
                                ? 'bg-red-400'
                                : (code.maxUses && code.usedCount >= code.maxUses * 0.8)
                                ? 'bg-yellow-400'
                                : 'bg-neon-violet'
                            }`}
                            style={{ width: `${Math.min(100, code.maxUses ? (code.usedCount / code.maxUses) * 100 : 0)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-text-muted" />
                        <span className="text-sm text-text-secondary">{formatDate(code.expiresAt || '')}</span>
                      </div>
                      {code.minOrderAmount > 0 && (
                        <p className="text-xs text-text-muted">{t('admin.discounts.minOrder')}: {formatPrice(code.minOrderAmount)}</p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggle(code)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors ${
                          code.active
                            ? 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20'
                            : 'bg-darkbg border-darkborder text-text-muted hover:bg-white/5'
                        }`}
                      >
                        {code.active ? (
                          <ToggleRight className="w-4 h-4" />
                        ) : (
                          <ToggleLeft className="w-4 h-4" />
                        )}
                        {code.active ? t('admin.discounts.active') : t('admin.discounts.inactive')}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(code)}
                          className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-neon-violet transition-colors"
                          title={t('admin.discounts.edit')}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(code.id, code.code)}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors"
                          title={t('admin.discounts.delete')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-darkcard border border-darkborder rounded-2xl p-6 w-full max-w-lg shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-bold text-lg text-text-primary">
                {editingCode ? t('admin.discounts.editCode') : t('admin.discounts.createCode')}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">{t('admin.discounts.codeLabel')} <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="VD: SUMMER20"
                  className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">{t('admin.discounts.descriptionLabel')}</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="VD: Giảm 20% cho đơn hàng mới"
                  className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">{t('admin.discounts.discountType')} <span className="text-red-400">*</span></label>
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                    className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary focus:outline-none focus:border-neon-violet/50 transition-colors"
                  >
                    <option value="PERCENT">{t('admin.discounts.percent')}</option>
                    <option value="FIXED">{t('admin.discounts.fixed')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">{t('admin.discounts.discountValue')} <span className="text-red-400">*</span></label>
                  <input
                    type="number"
                    value={form.discountValue}
                    onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                    placeholder={form.discountType === 'PERCENT' ? 'VD: 20' : 'VD: 50000'}
                    min="0"
                    className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">{t('admin.discounts.maxUses')}</label>
                  <input
                    type="number"
                    value={form.maxUses}
                    onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                    placeholder="VD: 100"
                    min="1"
                    className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">{t('admin.discounts.minOrderAmount')}</label>
                  <input
                    type="number"
                    value={form.minOrderAmount}
                    onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
                    placeholder="VD: 100000"
                    min="0"
                    className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors"
                  />
                </div>
              </div>

              {form.discountType === 'PERCENT' && (
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">{t('admin.discounts.maxDiscountAmount')}</label>
                  <input
                    type="number"
                    value={form.maxDiscountAmount}
                    onChange={(e) => setForm({ ...form, maxDiscountAmount: e.target.value })}
                    placeholder="VD: 100000 (không giới hạn nếu bỏ trống)"
                    min="0"
                    className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">{t('admin.discounts.expiresAtLabel')}</label>
                <input
                  type="date"
                  value={form.expiresAt}
                  onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                  className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary focus:outline-none focus:border-neon-violet/50 transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 bg-darkbg border border-darkborder rounded-xl text-text-secondary font-medium hover:border-neon-violet/30 transition-colors"
              >
                {t('admin.discounts.cancel')}
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 py-3 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingCode ? t('admin.discounts.saveChanges') : t('admin.discounts.createCodeButton')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
