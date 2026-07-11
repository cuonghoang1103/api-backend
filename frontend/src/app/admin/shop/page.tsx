'use client';

import { useState, useEffect } from 'react';
import {
  Plus, Search, Trash2, X, Loader2,
  Edit, Star, Flame, Sparkles, CheckCircle2,
  ShoppingBag, ChevronLeft, ChevronRight,
  Upload, Info, ChevronDown, PlusCircle, Trash,
  DollarSign, Package, Tag,
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { useProductStore } from '@/store/productStore';
import { adminCreateProduct, adminUpdateProduct, adminDeleteProduct, getProducts, mapProductFromBackend, adminGetCategories, type AdminCategoryResponse } from '@/lib/api/shop';
import { fileApi } from '@/lib/api';
import type { Product, ProductSpec } from '@/types';
import ImageUpload from '@/components/admin/ImageUpload';
import ShopCategoryManager from '@/components/admin/ShopCategoryManager';
import { useTranslation } from '@/hooks/useTranslation';

const REVALIDATE_SECRET = process.env.NEXT_PUBLIC_REVALIDATE_SECRET ?? '';

/** Calls the revalidate endpoint so public pages reflect admin mutations immediately. */
async function triggerRevalidate(paths: string[], tags: string[] = []) {
  try {
    await fetch('/api/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paths, tags }),
    });
  } catch {
    // Non-fatal: revalidation is best-effort
  }
}

// ─── Category-specific spec templates ─────────────────────────────────────────────

interface SpecTemplate {
  placeholderLabel: string;
  placeholderValue: string;
}

const SPEC_TEMPLATES: Record<string, SpecTemplate[]> = {
  'Accounts': [
    { placeholderLabel: 'Warranty Period', placeholderValue: '12 months' },
    { placeholderLabel: 'Login Method', placeholderValue: 'Email + Password' },
    { placeholderLabel: 'Validity', placeholderValue: '12 months active' },
    { placeholderLabel: 'Access Included', placeholderValue: 'GPT-4, DALL-E 3' },
    { placeholderLabel: 'Delivery Method', placeholderValue: 'Email within 2 hours' },
    { placeholderLabel: 'Replacement Policy', placeholderValue: 'Free if banned within 24h' },
  ],
  'Tools': [
    { placeholderLabel: 'Runtime', placeholderValue: 'Node.js 18+' },
    { placeholderLabel: 'Supported OS', placeholderValue: 'Windows, macOS, Linux' },
    { placeholderLabel: 'Latest Version', placeholderValue: 'v1.0.0' },
    { placeholderLabel: 'Hardware Requirements', placeholderValue: '2GB RAM, 500MB disk' },
    { placeholderLabel: 'License Type', placeholderValue: 'Perpetual' },
  ],
  'Software': [
    { placeholderLabel: 'Supported OS', placeholderValue: 'Windows 10+, macOS 12+' },
    { placeholderLabel: 'Latest Version', placeholderValue: 'v1.0.0' },
    { placeholderLabel: 'License', placeholderValue: 'Perpetual, 1 device' },
    { placeholderLabel: 'File Size', placeholderValue: '~50MB' },
  ],
  'Web Template': [
    { placeholderLabel: 'Framework', placeholderValue: 'Next.js 14 + Tailwind' },
    { placeholderLabel: 'Components', placeholderValue: '60+ pre-built' },
    { placeholderLabel: 'Responsive', placeholderValue: 'Mobile-first' },
    { placeholderLabel: 'Animations', placeholderValue: 'Framer Motion' },
    { placeholderLabel: 'License', placeholderValue: 'Single project' },
  ],
  'Ebook': [
    { placeholderLabel: 'Format', placeholderValue: 'PDF, EPUB, MOBI' },
    { placeholderLabel: 'Pages', placeholderValue: '300+ pages' },
    { placeholderLabel: 'Language', placeholderValue: 'English' },
    { placeholderLabel: 'Last Updated', placeholderValue: '2024 Edition' },
  ],
  default: [
    { placeholderLabel: 'Category', placeholderValue: 'Value' },
    { placeholderLabel: 'Feature', placeholderValue: 'Details' },
    { placeholderLabel: 'Version', placeholderValue: 'v1.0' },
  ],
};

function getSpecTemplates(category: string): SpecTemplate[] {
  return SPEC_TEMPLATES[category as keyof typeof SPEC_TEMPLATES] ?? SPEC_TEMPLATES.default;
}

function emptySpec(): ProductSpec {
  return { label: '', value: '' };
}

const emptyProduct = {
  name: '',
  slug: '',
  price: 0,
  originalPrice: 0,
  thumbnail: '',
  category: '' as string,
  rating: 5,
  reviewCount: 0,
  description: '',
  features: [] as string[],
  specs: [] as ProductSpec[],
  guidance: '',
  isHot: false,
  isNew: false,
  stock: 999,
  isFeatured: false,
  soldCount: 0,
  tags: [] as string[],
  fileUrl: '',
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(price);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// ─── Specs Editor Sub-component ────────────────────────────────────────────────
function SpecsEditor({
  specs,
  onChange,
  category,
}: {
  specs: ProductSpec[];
  onChange: (specs: ProductSpec[]) => void;
  category: string;
}) {
  const templates = getSpecTemplates(category);
  const [showTemplates, setShowTemplates] = useState(false);

  const addSpec = () => onChange([...specs, emptySpec()]);

  const updateSpec = (index: number, field: keyof ProductSpec, value: string) => {
    const updated = specs.map((s, i) =>
      i === index ? { ...s, [field]: value } : s
    );
    onChange(updated);
  };

  const removeSpec = (index: number) => {
    onChange(specs.filter((_, i) => i !== index));
  };

  const applyTemplate = (template: SpecTemplate) => {
    const exists = specs.some((s) => s.label === template.placeholderLabel);
    if (!exists) {
      onChange([...specs, { label: template.placeholderLabel, value: template.placeholderValue }]);
    }
    setShowTemplates(false);
  };

  const c = {
    primary: '#a855f7',
    border: 'rgba(168,85,247,0.25)',
    borderFocus: 'rgba(168,85,247,0.5)',
    bg: '#0a0a0f',
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-medium text-text-muted">
          Thông số kỹ thuật (theo danh mục)
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowTemplates(!showTemplates)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors"
            style={{
              background: `${c.primary}10`,
              border: `1px solid ${c.border}`,
              color: c.primary,
            }}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Thêm nhanh
            <ChevronDown className="w-3 h-3" />
          </button>
          {showTemplates && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowTemplates(false)} />
              <div
                className="absolute right-0 top-full mt-2 z-20 rounded-xl border overflow-hidden shadow-xl w-64"
                style={{ background: c.bg, borderColor: c.border }}
              >
                <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-text-muted border-b" style={{ borderColor: c.border }}>
                  Chọn thông số cho: {category}
                </p>
                {templates.map((t, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => applyTemplate(t)}
                    className="w-full text-left px-3 py-2 text-xs text-text-secondary hover:bg-white/5 transition-colors border-b last:border-0"
                    style={{ borderColor: `${c.border}50` }}
                  >
                    <span style={{ color: c.primary }}>{t.placeholderLabel}</span>
                    <span className="text-text-muted ml-1"> — {t.placeholderValue}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Spec rows */}
      <div className="space-y-2">
        {specs.map((spec, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              type="text"
              value={spec.label}
              onChange={(e) => updateSpec(i, 'label', e.target.value)}
              placeholder="Tên thông số (VD: Warranty Period)"
              className="flex-1 px-3 py-2 bg-darkbg border border-darkborder rounded-lg text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors"
            />
            <input
              type="text"
              value={spec.value}
              onChange={(e) => updateSpec(i, 'value', e.target.value)}
              placeholder="Giá trị (VD: 12 months)"
              className="flex-1 px-3 py-2 bg-darkbg border border-darkborder rounded-lg text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors"
            />
            <button
              type="button"
              onClick={() => removeSpec(i)}
              className="p-2 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors"
            >
              <Trash className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {specs.length === 0 && (
        <p className="text-xs text-text-muted italic py-2">
          Chưa có thông số kỹ thuật. Nhấn "Thêm nhanh" để chọn mẫu hoặc thêm thủ công.
        </p>
      )}

      <button
        type="button"
        onClick={addSpec}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
        style={{
          background: `${c.primary}08`,
          border: `1px dashed ${c.border}`,
          color: c.primary,
        }}
      >
        <PlusCircle className="w-3.5 h-3.5" />
        Thêm thông số
      </button>
    </div>
  );
}

// ─── Main Admin Shop Page ────────────────────────────────────────────────────────
export default function AdminShopPage() {
  const { t } = useTranslation();
  const { products, fetchProducts, isLoaded, updateProduct, deleteProduct, toggleFeatured, toggleHot, toggleNew } = useProductStore();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dbCategories, setDbCategories] = useState<AdminCategoryResponse[]>([]);
  const [page, setPage] = useState(0);
  // Category names for the filter tabs + product-form dropdown — ONLY the
  // real admin-managed categories (no phantom demo names). Empty until the
  // admin creates some in the category manager.
  const categoryNames = dbCategories.map((c) => c.name);
  const loadCategories = () => { adminGetCategories().then(setDbCategories).catch(() => {}); };
  const [pageSize] = useState(8);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({ ...emptyProduct });
  const [featureInput, setFeatureInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isLoaded) fetchProducts();
    loadCategories();
  }, []);

  const reloadProducts = async () => {
    setLoading(true);
    try {
      const pageData = await getProducts({ size: 100 });
      const mapped = pageData.content.map(mapProductFromBackend);
      useProductStore.setState({ products: mapped, isLoaded: true, isLoading: false, error: null });
    } catch {
      toast.error('Không thể tải lại sản phẩm từ backend');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-darkbg pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-neon-violet" />
      </div>
    );
  }

  const filtered = products.filter((p) => {
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice(page * pageSize, (page + 1) * pageSize);

  const openCreate = () => {
    setEditingId(null);
    setProductForm({ ...emptyProduct });
    setFeatureInput('');
    setTagInput('');
    setShowForm(true);
  };

  const openEdit = (product: Product) => {
    setEditingId(product.id);
    setProductForm({
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice || 0,
      thumbnail: product.thumbnail || '',
      category: product.category,
      rating: product.rating || 5,
      reviewCount: product.reviewCount || 0,
      description: product.description || '',
      features: product.features || [],
      specs: product.specs || [],
      guidance: product.guidance || '',
      isHot: Boolean(product.isHot),
      isNew: Boolean(product.isNew),
      stock: product.stock || 0,
      isFeatured: Boolean(product.isFeatured),
      soldCount: product.soldCount || 0,
      tags: product.tags || [],
      fileUrl: product.fileUrl || '',
    });
    setFeatureInput('');
    setTagInput('');
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    try {
      await adminDeleteProduct(Number(id));
      deleteProduct(id);
      await reloadProducts();
      toast.success('Đã xóa sản phẩm');
    } catch {
      toast.error('Xóa sản phẩm thất bại');
    }
  };

  const handleSave = async () => {
    if (!productForm.name.trim()) {
      toast.error('Tên sản phẩm không được để trống');
      return;
    }

    if (productForm.price < 0) {
      toast.error('Giá sản phẩm không hợp lệ');
      return;
    }

    setSaving(true);
    try {
      const payload: Partial<import('@/lib/api/shop').ProductResponse> = {
        name: productForm.name.trim(),
        slug: productForm.slug.trim(),
        description: productForm.description.trim(),
        shortDescription: productForm.description.trim().slice(0, 500),
        thumbnailUrl: productForm.thumbnail.trim(),
        price: productForm.price,
        originalPrice: productForm.originalPrice > 0 ? productForm.originalPrice : undefined,
        stockQuantity: productForm.stock,
        soldCount: productForm.soldCount || 0,
        featured: productForm.isFeatured,
        isHot: productForm.isHot,
        isNew: productForm.isNew,
        categoryName: productForm.category,
        fileUrl: productForm.fileUrl.trim(),
        specs: productForm.specs,
        guidance: productForm.guidance.trim(),
        active: true,
      };

      if (editingId) {
        const updated = await adminUpdateProduct(Number(editingId), payload);
        updateProduct(editingId, mapProductFromBackend(updated.data));
        toast.success('Cập nhật sản phẩm thành công');
      } else {
        const created = await adminCreateProduct(payload);
        useProductStore.setState((state) => ({
          products: [mapProductFromBackend(created.data), ...state.products],
        }));
        toast.success('Tạo sản phẩm thành công');
      }

      setShowForm(false);
      setEditingId(null);
      setProductForm({ ...emptyProduct });
      await reloadProducts();
      await triggerRevalidate(['/shop'], ['shop']);
    } catch {
      toast.error('Lưu sản phẩm thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    try {
      const updated = await adminUpdateProduct(Number(product.id), { featured: !product.isFeatured });
      updateProduct(product.id, mapProductFromBackend(updated.data));
      await reloadProducts();
      toast.success('Đã cập nhật trạng thái featured');
    } catch {
      toast.error('Cập nhật featured thất bại');
    }
  };

  const handleToggleHot = async (product: Product) => {
    try {
      const updated = await adminUpdateProduct(Number(product.id), { isHot: !product.isHot });
      updateProduct(product.id, mapProductFromBackend(updated.data));
      await reloadProducts();
      toast.success('Đã cập nhật trạng thái hot');
    } catch {
      toast.error('Cập nhật hot thất bại');
    }
  };

  const handleToggleNew = async (product: Product) => {
    try {
      const updated = await adminUpdateProduct(Number(product.id), { isNew: !product.isNew });
      updateProduct(product.id, mapProductFromBackend(updated.data));
      await reloadProducts();
      toast.success('Đã cập nhật trạng thái new');
    } catch {
      toast.error('Cập nhật new thất bại');
    }
  };

  const addFeature = () => {
    if (!featureInput.trim()) return;
    setProductForm((f) => ({ ...f, features: [...f.features, featureInput.trim()] }));
    setFeatureInput('');
  };

  const removeFeature = (i: number) => {
    setProductForm((f) => ({ ...f, features: f.features.filter((_, idx) => idx !== i) }));
  };

  const addTag = () => {
    if (!tagInput.trim() || productForm.tags.includes(tagInput.trim())) return;
    setProductForm((f) => ({ ...f, tags: [...f.tags, tagInput.trim()] }));
    setTagInput('');
  };

  const removeTag = (i: number) => {
    setProductForm((f) => ({ ...f, tags: f.tags.filter((_, idx) => idx !== i) }));
  };

  /**
   * Uploads digital product files through the backend file upload endpoint.
   */
  const uploadFile = async (file: File, category: string): Promise<string | null> => {
    const res = await fileApi.upload(file, category);
    const url = res.data?.data?.url;
    return typeof url === 'string' ? url : null;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 100 * 1024 * 1024) {
      toast.error('File tối đa 100MB');
      return;
    }
    setUploadingFile(true);
    try {
      const url = await uploadFile(file, 'products');
      if (url) {
        setProductForm((f) => ({ ...f, fileUrl: url }));
        toast.success('Tải file thành công');
      } else {
        toast.error('Tải file thất bại');
      }
    } catch {
      toast.error('Tải file thất bại');
    } finally {
      setUploadingFile(false);
      e.target.value = '';
    }
  };

  const clearFileUrl = () => {
    setProductForm((f) => ({ ...f, fileUrl: '' }));
  };

  const c = {
    primary: '#a855f7',
    secondary: '#ec4899',
    border: 'rgba(168,85,247,0.2)',
    borderDark: '#27272a',
    surface: 'rgba(20,15,40,0.5)',
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-neon-violet" />
            {t('admin.shop.title')}
          </h1>
          <p className="text-text-muted text-sm mt-1">{t('admin.shop.totalProducts', { count: products.length })}</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          {t('admin.shop.addProduct')}
        </button>
      </div>

      {/* Category manager */}
      <div className="mb-6">
        <ShopCategoryManager onChange={() => { loadCategories(); reloadProducts(); }} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder={t('admin.shop.searchPlaceholder')}
            className="w-full pl-9 pr-4 py-2.5 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => { setCategoryFilter('all'); setPage(0); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              categoryFilter === 'all'
                ? 'bg-neon-violet/20 border-neon-violet text-neon-violet'
                : 'bg-darkcard border-darkborder text-text-secondary hover:border-neon-violet/30'
            }`}
          >
            {t('admin.shop.all')}
          </button>
          {categoryNames.map((cat) => (
            <button
              key={cat}
              onClick={() => { setCategoryFilter(cat); setPage(0); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                categoryFilter === cat
                  ? 'bg-neon-violet/20 border-neon-violet text-neon-violet'
                  : 'bg-darkcard border-darkborder text-text-secondary hover:border-neon-violet/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-darkcard border border-darkborder rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-darkborder">
                <th className="text-left px-4 py-3 text-text-muted font-medium">{t('admin.shop.product')}</th>
                <th className="text-left px-4 py-3 text-text-muted font-medium hidden md:table-cell">{t('admin.shop.category')}</th>
                <th className="text-left px-4 py-3 text-text-muted font-medium hidden lg:table-cell">Giá / Giảm giá</th>
                <th className="text-left px-4 py-3 text-text-muted font-medium hidden sm:table-cell">{t('admin.shop.stock')}</th>
                <th className="text-left px-4 py-3 text-text-muted font-medium hidden xl:table-cell">Đã bán</th>
                <th className="text-right px-4 py-3 text-text-muted font-medium">{t('admin.shop.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-text-muted">
                    {t('admin.shop.noProducts')}
                  </td>
                </tr>
              ) : (
                paginated.map((product) => {
                  const discountPercent = product.originalPrice
                    ? Math.round((1 - product.price / product.originalPrice) * 100)
                    : 0;
                  return (
                    <tr key={product.id} className="border-b border-darkborder/50 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-darkbg">
                            {product.thumbnail ? (
                              <Image src={product.thumbnail} alt={product.name} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full bg-darkcard flex items-center justify-center">
                                <ShoppingBag className="w-5 h-5 text-text-muted" />
                              </div>
                            )}
                            {/* Discount badge on thumbnail */}
                            {discountPercent > 0 && (
                              <div className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold text-white"
                                style={{ background: 'linear-gradient(135deg,#a855f7,#ec4899)' }}>
                                -{discountPercent}%
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-text-primary truncate max-w-[180px]">{product.name}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs text-text-muted">{product.rating} ({product.reviewCount})</span>
                              {product.specs && product.specs.length > 0 && (
                                <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded" style={{ background: `${c.primary}15`, color: c.primary }}>
                                  {product.specs.length} specs
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="px-2 py-1 bg-darkbg rounded-lg text-xs text-text-muted">{product.category}</span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <p className="font-semibold text-neon-violet">{formatPrice(product.price)}</p>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-xs text-text-muted line-through">{formatPrice(product.originalPrice)}</span>
                            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                              -{discountPercent}%
                            </span>
                          </div>
                        )}
                        {!product.originalPrice && <span className="text-xs text-text-muted">—</span>}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        {product.stock === 0 ? (
                          <span className="text-xs text-red-400">{t('admin.shop.outOfStock')}</span>
                        ) : product.stock <= 20 ? (
                          <span className="text-xs text-yellow-400">{t('admin.shop.inStock')} ({product.stock})</span>
                        ) : (
                          <span className="text-xs text-text-muted">{product.stock}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden xl:table-cell">
                        <span className="text-xs text-text-muted">{(product.soldCount || 0).toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleToggleFeatured(product)}
                            className={`p-1.5 rounded-lg transition-colors ${product.isFeatured ? 'text-neon-violet bg-neon-violet/10' : 'text-text-muted hover:text-text-primary hover:bg-white/5'}`}
                            title={product.isFeatured ? t('admin.shop.removeFeatured') : t('admin.shop.markFeatured')}
                          >
                            <Star className={`w-4 h-4 ${product.isFeatured ? 'fill-current' : ''}`} />
                          </button>
                          <button
                            onClick={() => handleToggleHot(product)}
                            className={`p-1.5 rounded-lg transition-colors ${(product as any).isHot ? 'text-orange-400 bg-orange-500/10' : 'text-text-muted hover:text-text-primary hover:bg-white/5'}`}
                            title="Toggle Hot"
                          >
                            <Flame className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleNew(product)}
                            className={`p-1.5 rounded-lg transition-colors ${(product as any).isNew ? 'text-neon-cyan bg-neon-cyan/10' : 'text-text-muted hover:text-text-primary hover:bg-white/5'}`}
                            title="Toggle New"
                          >
                            <Sparkles className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEdit(product)}
                            className="p-1.5 rounded-lg text-text-muted hover:text-neon-violet hover:bg-neon-violet/10 transition-colors"
                            title={t('admin.shop.edit')}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title={t('admin.shop.delete')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-darkborder">
            <p className="text-xs text-text-muted">
              {t('admin.shop.paginationInfo', { start: page * pageSize + 1, end: Math.min((page + 1) * pageSize, filtered.length), total: filtered.length })}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-2 rounded-lg border border-darkborder text-text-muted hover:text-text-primary disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i).map((i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                    page === i
                      ? 'bg-neon-violet text-white'
                      : 'border border-darkborder text-text-muted hover:text-text-primary'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="p-2 rounded-lg border border-darkborder text-text-muted hover:text-text-primary disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
            style={{ background: '#12121a', border: `1px solid ${c.border}` }}
          >
            {/* Modal Header */}
            <div
              className="sticky top-0 px-6 py-4 flex items-center justify-between z-10"
              style={{ background: '#12121a', borderBottom: `1px solid ${c.border}` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})` }}>
                  <Tag className="w-4 h-4 text-white" />
                </div>
                <h2 className="font-heading font-bold text-text-primary">
                  {editingId ? t('admin.shop.editProduct') : t('admin.shop.addProductTitle')}
                </h2>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-text-muted hover:text-text-primary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Name + Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1.5">{t('admin.shop.productName')} *</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm((f) => ({ ...f, name: e.target.value, slug: f.slug || slugify(e.target.value) }))}
                    placeholder="VD: Nexus Dashboard"
                    className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1.5">Slug</label>
                  <input
                    type="text"
                    value={productForm.slug}
                    onChange={(e) => setProductForm((f) => ({ ...f, slug: e.target.value }))}
                    placeholder="auto-generated-from-name"
                    className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50"
                  />
                </div>
              </div>

              {/* Category + Price + Original Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1.5">{t('admin.shop.categoryLabel')}</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => {
                      const cat = e.target.value;
                      setProductForm((f) => ({ ...f, category: cat }));
                    }}
                    className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary focus:outline-none focus:border-neon-violet/50 cursor-pointer"
                  >
                    <option value="">— Chưa phân loại —</option>
                    {/* Real categories; keep the current value selectable even if not in the managed list */}
                    {(productForm.category && !categoryNames.includes(productForm.category)
                      ? [productForm.category, ...categoryNames]
                      : categoryNames
                    ).map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {categoryNames.length === 0 && (
                    <p className="text-[11px] text-text-muted mt-1">Chưa có danh mục — thêm ở mục &quot;Danh mục sản phẩm&quot; phía trên.</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1.5">{t('admin.shop.price')} (VND)</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm((f) => ({ ...f, price: Number(e.target.value) }))}
                    className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary focus:outline-none focus:border-neon-violet/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1.5">
                    {t('admin.shop.originalPrice')} (VND)
                    <span className="ml-1 text-neon-violet font-normal">(giá gốc)</span>
                  </label>
                  <input
                    type="number"
                    value={productForm.originalPrice || ''}
                    onChange={(e) => setProductForm((f) => ({ ...f, originalPrice: Number(e.target.value) || 0 }))}
                    placeholder="Để trống = không giảm giá"
                    className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50"
                  />
                  {productForm.originalPrice > 0 && productForm.price > 0 && productForm.originalPrice > productForm.price && (
                    <p className="text-[10px] text-emerald-400 mt-1 font-medium">
                      Giảm {Math.round((1 - productForm.price / productForm.originalPrice) * 100)}%
                    </p>
                  )}
                </div>
              </div>

              {/* Thumbnail */}
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1.5">{t('admin.shop.productImage')}</label>
                <ImageUpload
                  value={productForm.thumbnail}
                  onChange={(url) => setProductForm((f) => ({ ...f, thumbnail: url }))}
                />
              </div>

              {/* Digital File Upload */}
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1.5">File sản phẩm số (tải về)</label>
                {productForm.fileUrl ? (
                  <div className="flex items-center gap-3 p-3 bg-darkbg border border-darkborder rounded-xl">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary truncate">{productForm.fileUrl.split('/').pop()?.split('?')[0]}</p>
                      <p className="text-xs text-neon-emerald">Đã tải lên</p>
                    </div>
                    <button
                      onClick={clearFileUrl}
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 transition-colors"
                    >
                      Xóa file
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center gap-3 p-4 border-2 border-dashed border-darkborder rounded-xl cursor-pointer hover:border-neon-violet/40 transition-colors">
                    <input
                      type="file"
                      accept=".zip,.rar,.pdf,.doc,.docx,.exe,.dmg,.pkg"
                      onChange={handleFileUpload}
                      disabled={uploadingFile}
                      className="hidden"
                    />
                    {uploadingFile ? (
                      <>
                        <Loader2 className="w-5 h-5 text-neon-violet animate-spin" />
                        <span className="text-sm text-text-muted">Đang tải...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-text-muted" />
                        <div>
                          <p className="text-sm text-text-primary">Tải lên file sản phẩm</p>
                          <p className="text-xs text-text-muted">ZIP, PDF, DOC, EXE, DMG — tối đa 100MB</p>
                        </div>
                      </>
                    )}
                  </label>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1.5">{t('admin.shop.description')}</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  placeholder={t('admin.shop.descriptionPlaceholder')}
                  className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 resize-none"
                />
              </div>

              {/* Features */}
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1.5">{t('admin.shop.features')}</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
                    placeholder={t('admin.shop.addFeaturePlaceholder')}
                    className="flex-1 px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50"
                  />
                  <button onClick={addFeature} className="px-4 py-2.5 bg-neon-indigo/20 border border-neon-indigo/40 text-neon-indigo rounded-xl text-sm font-medium hover:bg-neon-indigo/30 transition-colors">
                    {t('admin.shop.add')}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {productForm.features.map((f, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-darkbg border border-darkborder rounded-lg text-xs text-text-secondary">
                      {f}
                      <button onClick={() => removeFeature(i)} className="text-text-muted hover:text-red-400">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* ── Category-Specific Specs Editor ─────────────────────── */}
              <div
                className="rounded-xl p-4 border"
                style={{ background: `${c.primary}06`, borderColor: `${c.primary}25` }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-4 h-4" style={{ color: c.primary }} />
                  <p className="text-xs font-semibold" style={{ color: c.primary }}>
                    Thông số kỹ thuật — {productForm.category}
                  </p>
                </div>
                <SpecsEditor
                  specs={productForm.specs}
                  onChange={(specs) => setProductForm((f) => ({ ...f, specs }))}
                  category={productForm.category}
                />
              </div>

              {/* ── Guidance / Hướng dẫn & Bảo hành ─────────────────── */}
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1.5">
                  Hướng dẫn & Bảo hành
                  <span className="ml-1 text-text-muted font-normal">(hiển thị ở Tab 3)</span>
                </label>
                <textarea
                  value={productForm.guidance}
                  onChange={(e) => setProductForm((f) => ({ ...f, guidance: e.target.value }))}
                  rows={5}
                  placeholder={`## Hướng dẫn cài đặt\n\n1. Giải nén file ZIP\n2. Chạy lệnh cài đặt...\n\n## Bảo hành\n\n- Hoàn tiền trong 7 ngày\n- Hỗ trợ qua email`}
                  className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 resize-none font-mono"
                />
                <p className="text-[10px] text-text-muted mt-1">
                  Hỗ trợ Markdown đơn giản: ## Tiêu đề, **bold**, `code`, - danh sách
                </p>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1.5">{t('admin.shop.tagsLabel')}</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                    placeholder={t('admin.shop.addTagPlaceholder')}
                    className="flex-1 px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50"
                  />
                  <button onClick={addTag} className="px-4 py-2.5 bg-neon-cyan/20 border border-neon-cyan/40 text-neon-cyan rounded-xl text-sm font-medium hover:bg-neon-cyan/30 transition-colors">
                    {t('admin.shop.add')}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {productForm.tags.map((t, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-darkbg border border-darkborder rounded-lg text-xs text-text-secondary">
                      #{t}
                      <button onClick={() => removeTag(i)} className="text-text-muted hover:text-red-400">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Badges */}
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1.5">{t('admin.shop.specialBadges')}</label>
                <div className="flex gap-3 flex-wrap">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.isHot}
                      onChange={(e) => setProductForm((f) => ({ ...f, isHot: e.target.checked }))}
                      className="w-4 h-4 rounded border-darkborder bg-darkbg text-neon-violet focus:ring-neon-violet/50 cursor-pointer"
                    />
                    <span className="text-sm text-orange-400">Hot</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.isNew}
                      onChange={(e) => setProductForm((f) => ({ ...f, isNew: e.target.checked }))}
                      className="w-4 h-4 rounded border-darkborder bg-darkbg text-neon-violet focus:ring-neon-violet/50 cursor-pointer"
                    />
                    <span className="text-sm text-neon-cyan">New</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.isFeatured}
                      onChange={(e) => setProductForm((f) => ({ ...f, isFeatured: e.target.checked }))}
                      className="w-4 h-4 rounded border-darkborder bg-darkbg text-neon-violet focus:ring-neon-violet/50 cursor-pointer"
                    />
                    <span className="text-sm text-neon-violet">Featured</span>
                  </label>
                </div>
              </div>

              {/* Stock + Sold */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1.5">{t('admin.shop.stockLabel')}</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm((f) => ({ ...f, stock: Number(e.target.value) }))}
                    className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary focus:outline-none focus:border-neon-violet/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1.5">{t('admin.shop.soldLabel')}</label>
                  <input
                    type="number"
                    value={productForm.soldCount || 0}
                    onChange={(e) => setProductForm((f) => ({ ...f, soldCount: Number(e.target.value) }))}
                    className="w-full px-4 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary focus:outline-none focus:border-neon-violet/50"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              className="sticky bottom-0 px-6 py-4 flex items-center justify-end gap-3"
              style={{ background: '#12121a', borderTop: `1px solid ${c.border}` }}
            >
              <button
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 border border-darkborder rounded-xl text-sm text-text-muted hover:text-text-primary hover:border-darkborder/80 transition-colors"
              >
                {t('admin.shop.cancel')}
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingId ? t('admin.shop.update') : t('admin.shop.createProduct')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
