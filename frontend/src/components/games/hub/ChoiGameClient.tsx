'use client';

/**
 * Chơi một game theo slug — bản CLIENT của `/games/[slug]` (trang web là server
 * component async, app desktop không dựng được). Tải game + game liên quan qua API rồi
 * dựng nguyên GamePlayClient (khung chơi, nộp điểm, bảng xếp hạng của game).
 */
import { useEffect, useState } from 'react';
import GamePlayClient from '@/app/games/[slug]/GamePlayClient';
import { gamesApi, type GameDto } from '@/lib/api';

export default function ChoiGameClient({ slug }: { slug: string }) {
  const [game, setGame] = useState<GameDto | null>(null);
  const [lienQuan, setLienQuan] = useState<GameDto[]>([]);
  const [loi, setLoi] = useState(false);
  useEffect(() => {
    let con = true;
    setGame(null); setLoi(false);
    gamesApi.getBySlug(slug)
      .then(async (r) => {
        if (!con) return;
        setGame(r.data.data);
        const rel = await gamesApi.related(r.data.data.id).catch(() => null);
        if (con && rel) setLienQuan(rel.data.data);
      })
      .catch(() => { if (con) setLoi(true); });
    return () => { con = false; };
  }, [slug]);
  if (loi) {
    return (
      <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-secondary)' }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Không tìm thấy trò chơi</h1>
        <p>Game “{slug}” không tồn tại hoặc chưa mở.</p>
      </div>
    );
  }
  if (!game) return <div style={{ minHeight: 400 }} aria-busy="true" />;
  return <GamePlayClient key={game.id} game={game} related={lienQuan} />;
}
