import { notFound } from 'next/navigation';
import GameDetailClient from './GameDetailClient';
import { GAMES_DATA } from '@/types/games';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return GAMES_DATA.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props) {
  const game = GAMES_DATA.find((g) => g.slug === params.slug);
  if (!game) return { title: 'Game Not Found' };
  return {
    title: `${game.title} — Games | CuongHoangDev`,
    description: game.shortDescription,
  };
}

export default function GameDetailPage({ params }: Props) {
  const game = GAMES_DATA.find((g) => g.slug === params.slug);
  if (!game) notFound();

  const relatedGames = GAMES_DATA
    .filter((g) => g.slug !== game.slug && (g.category === game.category || g.isPlayable))
    .slice(0, 3);

  return <GameDetailClient game={game} relatedGames={relatedGames} />;
}
