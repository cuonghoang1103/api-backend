/**
 * Lối vào mục Đối kháng (05/10/2026) — băng lớn đặt ở trang Trò chơi (web GamesPortalClient +
 * GameHub dùng chung với app desktop). Dùng `Link` để Link-shim của app desktop bắt được.
 */
import Link from 'next/link';
import { Swords, Users, Bot } from 'lucide-react';
import s from './theVaoDoiKhang.module.css';

export default function TheVaoDoiKhang({ locale = 'vi' }: { locale?: 'vi' | 'en' }) {
  const vi = locale !== 'en';
  return (
    <Link href="/games/doi-khang" className={s.the}>
      <span className={s.quan} aria-hidden="true">
        <i>♞</i><i>帥</i><i>A♠</i><i>✕</i>
      </span>
      <span className={s.chu}>
        <span className={s.nhan}><Swords size={13} /> {vi ? 'Mới · Đối kháng realtime' : 'New · Live head-to-head'}</span>
        <strong>{vi ? 'Cờ vua · Cờ tướng · Tiến lên · Caro' : 'Chess · Xiangqi · Tiến lên · Gomoku'}</strong>
        <small>
          <Users size={13} /> {vi ? 'Mời bạn bè đang online, ghép ngẫu nhiên' : 'Invite online friends or quick match'}
          <span className={s.cham}>·</span>
          <Bot size={13} /> {vi ? 'hoặc đấu với máy 3 cấp' : 'or play the computer'}
        </small>
      </span>
      <span className={s.nut}>{vi ? 'Vào sảnh' : 'Enter'}</span>
    </Link>
  );
}
