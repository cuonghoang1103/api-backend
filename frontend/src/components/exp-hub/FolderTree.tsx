'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, MoreHorizontal, Plus } from 'lucide-react';
import type { SnippetCategory } from '@/types/exp-hub';

interface FolderTreeProps {
  categories: SnippetCategory[];
  selectedCategoryId?: number;
  onSelectCategory: (category: SnippetCategory | null) => void;
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
      <div
        className={`group flex items-center gap-1 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
          isSelected
            ? 'bg-violet-500/15 text-violet-200'
            : 'text-slate-300 hover:bg-white/5'
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {hasChildren ? (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-0.5 hover:bg-white/10 rounded"
          >
            {isOpen ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>
        ) : (
          <span className="w-4" />
        )}

        <button
          onClick={() => onSelect(category)}
          className="flex-1 flex items-center gap-2 min-w-0"
        >
          {isOpen && hasChildren ? (
            <FolderOpen className="w-4 h-4 text-amber-400 shrink-0" />
          ) : (
            <Folder className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <span className="truncate text-sm font-medium">{category.name}</span>
          {snippetCount > 0 && (
            <span className="text-xs text-slate-400 bg-white/10 px-1.5 py-0.5 rounded-full">
              {snippetCount}
            </span>
          )}
        </button>

        {isAdmin && (
          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 shrink-0">
            <button
              onClick={() => onCreate?.(category.id)}
              className="p-1 hover:bg-white/10 rounded"
              title="Add subfolder"
            >
              <Plus className="w-3 h-3" />
            </button>
            <button
              onClick={() => onEdit?.(category)}
              className="p-1 hover:bg-white/10 rounded"
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
  isAdmin,
  onCreateCategory,
  onEditCategory,
  onDeleteCategory,
}: FolderTreeProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
          Categories
        </h3>
        {isAdmin && onCreateCategory && (
          <button
            onClick={() => onCreateCategory()}
            className="p-1 hover:bg-white/10 rounded"
            title="Add category"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <div
          className={`group flex items-center gap-1 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
            selectedCategoryId === undefined
              ? 'bg-violet-500/15 text-violet-200'
              : 'text-slate-300 hover:bg-white/5'
          }`}
          onClick={() => onSelectCategory(null)}
        >
          <Folder className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-sm font-medium">All Snippets</span>
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
          <p className="px-3 py-4 text-sm text-neutral-500 text-center">
            No categories yet
          </p>
        )}
      </div>
    </div>
  );
}
