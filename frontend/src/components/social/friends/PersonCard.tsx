'use client';

/**
 * A single person row/card used across the /friends page tabs
 * (search results, suggestions, all friends, following, followers).
 *
 * It owns its own optimistic relationship state so each card updates
 * independently. Which buttons appear is driven by the props that are
 * present:
 *   - `friendStatus` present  → show the Kết bạn/Phản hồi/Bạn bè button
 *   - `isFollowing` present    → show the Theo dõi/Đang theo dõi button
 *   - `onRemoved`              → after unfriend, parent can drop the row
 *
 * Reuses friendApi + socialUserApi + the messaging store's
 * startUserThread (same flow as SocialRightWidget / profile).
 */

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus, UserCheck, Clock, UserMinus, MessageSquare, Loader2, X, Check } from 'lucide-react';
import SafeAvatar from '@/components/ui/SafeAvatar';
import { friendApi, socialUserApi, type FriendStatus } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useMessagingStore } from '@/store/messagingStore';
import toast from 'react-hot-toast';

export interface PersonCardData {
  id: number;
  username: string;
  displayName?: string | null;
  fullName?: string | null;
  avatarUrl?: string | null;
  isOnline?: boolean;
  friendStatus?: FriendStatus;
  isFollowing?: boolean;
}

export default function PersonCard({
  person,
  onRemoved,
  /** Layout: 'grid' (FB-style card) or 'row' (compact list item). */
  layout = 'grid',
}: {
  person: PersonCardData;
  onRemoved?: (id: number) => void;
  layout?: 'grid' | 'row';
}) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [friendStatus, setFriendStatus] = useState<FriendStatus | undefined>(person.friendStatus);
  const [isFollowing, setIsFollowing] = useState<boolean | undefined>(person.isFollowing);
  const [busyFriend, setBusyFriend] = useState(false);
  const [busyFollow, setBusyFollow] = useState(false);
  const [busyMsg, setBusyMsg] = useState(false);

  const name = person.displayName?.trim() || person.fullName?.trim() || person.username;

  const requireAuth = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return false;
    }
    return true;
  };

  const handleFriend = async () => {
    if (busyFriend || friendStatus === undefined) return;
    if (!requireAuth()) return;
    setBusyFriend(true);
    try {
      if (friendStatus === 'none') {
        const res = await friendApi.sendRequest(person.id);
        setFriendStatus(res.data.data.status);
      } else if (friendStatus === 'pending_outgoing') {
        await friendApi.cancel(person.id);
        setFriendStatus('none');
      } else if (friendStatus === 'pending_incoming') {
        await friendApi.respond(person.id, true);
        setFriendStatus('friends');
      } else if (friendStatus === 'friends') {
        await friendApi.unfriend(person.id);
        setFriendStatus('none');
        onRemoved?.(person.id);
      }
    } catch {
      toast.error('Không thực hiện được, thử lại sau');
    } finally {
      setBusyFriend(false);
    }
  };

  const handleFollow = async () => {
    if (busyFollow || isFollowing === undefined) return;
    if (!requireAuth()) return;
    setBusyFollow(true);
    try {
      const res = await socialUserApi.toggleFollow(person.id);
      setIsFollowing(!!res.data?.data?.isFollowing);
    } catch {
      toast.error('Không thực hiện được, thử lại sau');
    } finally {
      setBusyFollow(false);
    }
  };

  const handleMessage = async () => {
    if (busyMsg) return;
    if (!isAuthenticated) {
      router.push(`/login?next=/messages?peer=${person.id}`);
      return;
    }
    setBusyMsg(true);
    try {
      await useMessagingStore.getState().startUserThread(person.id);
    } catch {
      /* navigate anyway */
    } finally {
      setBusyMsg(false);
    }
    router.push(`/messages?peer=${person.id}`);
  };

  // Friend button appearance per status.
  const friendBtn = () => {
    if (friendStatus === undefined) return null;
    const map: Record<FriendStatus, { text: string; icon: typeof UserPlus; cls: string }> = {
      none: { text: 'Kết bạn', icon: UserPlus, cls: 'bg-neon-violet/20 text-neon-violet hover:bg-neon-violet/30' },
      pending_outgoing: { text: 'Huỷ lời mời', icon: Clock, cls: 'bg-white/[0.05] text-text-secondary hover:bg-white/[0.08]' },
      pending_incoming: { text: 'Đồng ý', icon: Check, cls: 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30' },
      friends: { text: 'Bạn bè', icon: UserCheck, cls: 'bg-white/[0.05] text-text-secondary hover:bg-white/[0.08]' },
    };
    const cfg = map[friendStatus];
    const Icon = cfg.icon;
    return (
      <button
        type="button"
        onClick={handleFriend}
        disabled={busyFriend}
        className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${cfg.cls}`}
      >
        {busyFriend ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Icon className="h-3.5 w-3.5" />}
        {cfg.text}
      </button>
    );
  };

  const followBtn = () => {
    if (isFollowing === undefined) return null;
    return (
      <button
        type="button"
        onClick={handleFollow}
        disabled={busyFollow}
        className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
          isFollowing
            ? 'bg-white/[0.05] text-text-secondary hover:bg-white/[0.08]'
            : 'bg-neon-cyan/15 text-neon-cyan hover:bg-neon-cyan/25'
        }`}
      >
        {busyFollow ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : isFollowing ? <UserCheck className="h-3.5 w-3.5" /> : <UserPlus className="h-3.5 w-3.5" />}
        {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
      </button>
    );
  };

  if (layout === 'row') {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
        <Link href={`/profile/${person.id}`} className="relative shrink-0">
          <SafeAvatar src={person.avatarUrl} alt={name} seed={person.username} size={44} rounded="full" />
          {person.isOnline && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#0e1218] bg-emerald-400" />}
        </Link>
        <Link href={`/profile/${person.id}`} className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-text-primary">{name}</p>
          <p className="truncate text-[11px] text-text-muted">@{person.username}</p>
        </Link>
        <div className="flex shrink-0 items-center gap-1.5">
          {friendBtn()}
          {followBtn()}
          <button
            type="button"
            onClick={handleMessage}
            disabled={busyMsg}
            title="Nhắn tin"
            className="flex items-center justify-center rounded-lg bg-white/[0.05] p-2 text-text-secondary hover:bg-white/[0.08] hover:text-text-primary transition-colors disabled:opacity-50"
          >
            {busyMsg ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <MessageSquare className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
    );
  }

  // grid card
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02]">
      <Link href={`/profile/${person.id}`} className="flex items-center gap-3 p-3">
        <div className="relative shrink-0">
          <SafeAvatar src={person.avatarUrl} alt={name} seed={person.username} size={56} rounded="full" />
          {person.isOnline && <span className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#0e1218] bg-emerald-400" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-text-primary">{name}</p>
          <p className="truncate text-[11px] text-text-muted">@{person.username}</p>
          {person.isOnline && <p className="mt-0.5 text-[10px] text-emerald-400/80">Đang hoạt động</p>}
        </div>
      </Link>
      <div className="mt-auto flex items-center gap-1.5 px-3 pb-3">
        {friendBtn()}
        {followBtn()}
        <button
          type="button"
          onClick={handleMessage}
          disabled={busyMsg}
          title="Nhắn tin"
          className="flex items-center justify-center rounded-lg bg-white/[0.05] p-2 text-text-secondary hover:bg-white/[0.08] hover:text-text-primary transition-colors disabled:opacity-50"
        >
          {busyMsg ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <MessageSquare className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}

/**
 * Incoming friend-request card with Confirm / Delete (FB-style).
 * `onResolved` lets the parent drop the row once handled.
 */
export function FriendRequestCard({
  requesterId,
  username,
  displayName,
  avatarUrl,
  isOnline,
  onResolved,
}: {
  requesterId: number;
  username: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  isOnline?: boolean;
  onResolved?: (id: number, accepted: boolean) => void;
}) {
  const [busy, setBusy] = useState<'accept' | 'decline' | null>(null);
  const name = displayName?.trim() || username;

  const act = async (accept: boolean) => {
    if (busy) return;
    setBusy(accept ? 'accept' : 'decline');
    try {
      await friendApi.respond(requesterId, accept);
      onResolved?.(requesterId, accept);
      toast.success(accept ? `Đã kết bạn với ${name}` : 'Đã xoá lời mời');
    } catch {
      toast.error('Không thực hiện được, thử lại sau');
      setBusy(null);
    }
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02]">
      <Link href={`/profile/${requesterId}`} className="flex items-center gap-3 p-3">
        <div className="relative shrink-0">
          <SafeAvatar src={avatarUrl} alt={name} seed={username} size={56} rounded="full" />
          {isOnline && <span className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#0e1218] bg-emerald-400" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-text-primary">{name}</p>
          <p className="truncate text-[11px] text-text-muted">@{username}</p>
          <p className="mt-0.5 text-[10px] text-text-muted/80">đã gửi lời mời kết bạn</p>
        </div>
      </Link>
      <div className="mt-auto flex items-center gap-1.5 px-3 pb-3">
        <button
          type="button"
          onClick={() => act(true)}
          disabled={busy !== null}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-neon-violet/25 px-3 py-1.5 text-xs font-medium text-neon-violet hover:bg-neon-violet/35 transition-colors disabled:opacity-50"
        >
          {busy === 'accept' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
          Xác nhận
        </button>
        <button
          type="button"
          onClick={() => act(false)}
          disabled={busy !== null}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white/[0.05] px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-white/[0.08] transition-colors disabled:opacity-50"
        >
          {busy === 'decline' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
          Xoá
        </button>
      </div>
    </div>
  );
}
