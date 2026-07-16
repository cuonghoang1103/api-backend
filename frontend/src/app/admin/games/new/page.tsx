'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import GameForm from '@/components/games/admin/GameForm';
import { adminGameCategoriesApi, type GameCategoryDto } from '@/lib/api';

/** Create a game. Categories must exist first — the form needs them for the select. */
export default function NewGamePage() {
  const [categories, setCategories] = useState<GameCategoryDto[] | null>(null);

  useEffect(() => {
    adminGameCategoriesApi.list()
      .then((r) => setCategories(r.data.data))
      .catch(() => setCategories([]));
  }, []);

  if (!categories) {
    return (
      <div className="py-20 text-center text-text-muted">
        <Loader2 className="w-5 h-5 mx-auto animate-spin text-neon-violet" />
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="rounded-2xl bg-darkcard/60 border border-darkborder p-10 text-center">
        <p className="text-sm text-text-secondary">
          Chưa có chuyên mục nào. Hãy tạo chuyên mục trước khi thêm game.
        </p>
        <a href="/admin/games/categories" className="mt-3 inline-block text-neon-violet hover:underline text-sm">
          Tới trang Chuyên mục
        </a>
      </div>
    );
  }

  return <GameForm categories={categories} />;
}
