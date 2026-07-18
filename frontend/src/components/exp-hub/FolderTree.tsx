'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, MoreHorizontal, Plus } from 'lucide-react';
import type { SnippetCategory } from '@/types/exp-hub';
import { useTranslation } from '@/hooks/useTranslation';
import { CategoryIcon } from './CategoryIcon';

interface FolderTreeProps {
  categories: SnippetCategory[];
  selectedCategoryId?: number;
  onSelectCategory: (category: SnippetCategory | null) => void;
  // Label + behaviour for the top "all" row (scoped to the active group).
  allLabel?: string;
  isAdmin?: boolean;
  onCreateCategory?: (parentId?: number) => void;
  onEditCategory?: (category: SnippetCategory) => void;
  onDeleteCategory?: (category: SnippetCategory) => void;
}

function CategoryItem({
  category,
  level,
  selectedId,
  onSelect,
  isAdmin,
  onCreate,
  onEdit,
  onDelete,
}: {
  category: SnippetCategory;
  level: number;
  selectedId?: number;
  onSelect: (c: SnippetCategory) => void;
  isAdmin?: boolean;
  onCreate?: (parentId: number) => void;
  onEdit?: (c: SnippetCategory) => void;
  onDelete?: (c: SnippetCategory) => void;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = category.children && category.children.length > 0;
  const isSelected = selectedId === category.id;
  const snippetCount = category._count?.snippets ?? 0;

  return (
    <div>
      {/* Whole row is the click target for selecting the folder — not just
          the label — so taps don't miss. The chevron / admin actions
          stopPropagation so they don't also trigger a select. */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelect(category)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(category); } }}
        className={`group flex items-center gap-1 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
          isSelected
            ? 'bg-violet-500/15 text-violet-600 dark:text-violet-200'
            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
            className="p-0.5 hover:bg-[var(--bg-surface-active)] rounded"
            aria-label={isOpen ? 'Thu gọn' : 'Mở rộng'}
          >
            {isOpen ? (
              <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            )}
          </button>
        ) : (
          <span className="w-4" />
        )}

        <span className="flex-1 flex items-center gap-2 min-w-0">
          <CategoryIcon name={category.name} slug={category.slug} icon={category.icon} color={category.color} size={16} className="shrink-0" />
          <span className="truncate text-sm font-medium">{category.name}</span>
          {snippetCount > 0 && (
            <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-surface-active)] px-1.5 py-0.5 rounded-full">
              {snippetCount}
            </span>
          )}
        </span>

        {isAdmin && (
          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onCreate?.(category.id); }}
              className="p-1 hover:bg-[var(--bg-surface-active)] rounded"
              title="Add subfolder"
            >
              <Plus className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onEdit?.(category); }}
              className="p-1 hover:bg-[var(--bg-surface-active)] rounded"
            >
              <MoreHorizontal className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {isOpen && hasChildren && (
        <div>
          {category.children!.map((child) => (
            <CategoryItem
              key={child.id}
              category={child}
              level={level + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              isAdmin={isAdmin}
              onCreate={onCreate}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FolderTree({
  categories,
  selectedCategoryId,
  onSelectCategory,
  allLabel,
  isAdmin,
  onCreateCategory,
  onEditCategory,
  onDeleteCategory,
}: FolderTreeProps) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col">
      {isAdmin && onCreateCategory && (
        <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border-color)]">
          <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
            {t('expHub.categories')}
          </h3>
          <button
            type="button"
            onClick={() => onCreateCategory()}
            className="p-1 hover:bg-[var(--bg-surface-hover)] rounded"
            title={t('expHub.addCategory')}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="py-2">
        <div
          className={`group flex items-center gap-1 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
            selectedCategoryId === undefined
              ? 'bg-violet-500/15 text-violet-600 dark:text-violet-200'
              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
          }`}
          onClick={() => onSelectCategory(null)}
        >
          <Folder className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-sm font-medium">{allLabel ?? t('expHub.allItems')}</span>
        </div>

        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
            level={0}
            selectedId={selectedCategoryId}
            onSelect={onSelectCategory}
            isAdmin={isAdmin}
            onCreate={onCreateCategory}
            onEdit={onEditCategory}
            onDelete={onDeleteCategory}
          />
        ))}

        {categories.length === 0 && (
          <p className="px-3 py-4 text-sm text-[var(--text-muted)] text-center">
            {t('expHub.noCategories')}
          </p>
        )}
      </div>
    </div>
  );
}
