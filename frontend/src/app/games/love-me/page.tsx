import { redirect } from 'next/navigation';

export default function LoveMePage() {
  redirect('/games/love-me-game/love-me.html');
}

export const dynamic = 'force-dynamic';
