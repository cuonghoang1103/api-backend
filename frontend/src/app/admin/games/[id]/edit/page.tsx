'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, AlertTriangle } from 'lucide-react';
import GameForm from '@/components/games/admin/GameForm';
import { adminGamesApi, adminGameCategoriesApi, type GameDto, type GameCategoryDto } from '@/lib/api';

/** Edit an existing game. Loads the game + categories before mounting the form
 *  so react-hook-form's defaultValues are correct on first render. */
export default function EditGamePage() {
  const params = useParams<{ id: string }>();
  const id = Number(params?.id);

  const [game, setGame] = useState<GameDto | null>(null);
  const [categories, setCategories] = useState<GameCategoryDto[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isFinite(id)) { setError('ID không hợp lệ'); return; }
    let cancelled = false;
    Promise.all([adminGamesApi.get(id), adminGameCategoriesApi.list()])
      .then(([g, c]) => {
        if (cancelled) return;
        setGame(g.data.data);
        setCategories(c.data.data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Không tải được game');
      });
    return () => { cancelled = true; };
  }, [id]);

  if (error) {
    return (
      <div className="rounded-2xl bg-darkcard/60 border border-darkborder p-10 text-center">
        <AlertTriangle className="w-7 h-7 text-red-400 mx-auto mb-3" />
        <p className="text-sm text-text-secondary">{error}</p>
        <a href="/admin/games" className="mt-3 inline-block text-neon-violet hover:underline text-sm">Quay lại danh sách</a>
      </div>
    );
  }

  if (!game || !categories) {
    return (
      <div className="py-20 text-center text-text-muted">
        <Loader2 className="w-5 h-5 mx-auto animate-spin text-neon-violet" />
      </div>
    );
  }

  return <GameForm categories={categories} game={game} />;
}
