// Social Feed Types

export interface SocialAuthor {
  id: number;
  username: string;
  fullName: string | null;
  displayName?: string | null;
  avatarUrl: string | null;
}

export interface SocialMedia {
  id: number;
  type: 'IMAGE' | 'VIDEO' | 'CODE_FILE' | 'FILE';
  url: string;
  thumbnail?: string | null;
  width?: number | null;
  height?: number | null;
  duration?: number | null;
  mimeType?: string | null;
  // Original file name. For FILE attachments (zip, md, …) this
  // is shown next to the download button and used as the
  // suggested filename when downloading. For media it's the
  // same value as `alt`.
  fileName?: string | null;
  fileSize?: number | string | null;
  alt?: string | null;
  sortOrder: number;
}

export interface SocialPollOption {
  id: number;
  pollId: number;
  text: string;
  votesCount: number;
  sortOrder: number;
  createdAt: string;
}

export interface SocialPoll {
  id: number;
  postId: number;
  question: string;
  multiChoice: boolean;
  closesAt: string | null;
  totalVotes: number;
  createdAt: string;
  options: SocialPollOption[];
  // Per-viewer array of option ids the current user has voted for.
  // Empty array if the viewer hasn't voted or is anonymous.
  userVotes: number[];
}

export type ReactionType = 'LIKE' | 'LOVE' | 'HAHA' | 'SAD' | 'ANGRY';

export interface ReactionBreakdown {
  LIKE: number;
  LOVE: number;
  HAHA: number;
  SAD: number;
  ANGRY: number;
}

export const EMPTY_REACTION_BREAKDOWN: ReactionBreakdown = {
  LIKE: 0,
  LOVE: 0,
  HAHA: 0,
  SAD: 0,
  ANGRY: 0,
};

export const REACTION_META: Record<ReactionType, { emoji: string; label: string; color: string }> = {
  LIKE: { emoji: '👍', label: 'Thích', color: '#3b82f6' },
  LOVE: { emoji: '❤️', label: 'Yêu thích', color: '#ec4899' },
  HAHA: { emoji: '😆', label: 'Haha', color: '#eab308' },
  SAD:  { emoji: '😢', label: 'Buồn', color: '#06b6d4' },
  ANGRY:{ emoji: '😡', label: 'Phẫn nộ', color: '#ef4444' },
};

export interface SocialPost {
  id: number;
  content: string;
  visibility: 'PUBLIC' | 'FRIENDS' | 'PRIVATE';
  latitude?: number | null;
  longitude?: number | null;
  locationName?: string | null;
  // Optional YouTube URL the user pasted into the composer. The
  // post card renders this as an inline embed when present.
  youtubeUrl?: string | null;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  author: SocialAuthor;
  media: SocialMedia[];
  // Optional poll attached to the post (Phase 2).
  poll: SocialPoll | null;
  likesCount: number;
  commentsCount: number;
  savesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  savedFolder?: string | null;
  // ─── Multi-emoji reactions (added 2026-06-20) ──────────────────
  // The viewer's CURRENT reaction (one of ReactionType) or null
  // if they haven't reacted. Replaces the older isLiked for the
  // rendering logic — PostCard still uses isLiked for the
  // optimistic toggle so existing callers don't break.
  myReaction?: ReactionType | null;
  // Per-type counts so the card can render the emoji stack
  // ("👍 12  ❤️ 3") without an extra round-trip. Default is the
  // empty object so old payloads (no reactions table yet) don't
  // crash the renderer.
  reactionBreakdown?: ReactionBreakdown;
}

export interface SocialComment {
  id: number;
  postId: number;
  parentId?: number | null;
  content: string;
  // ─── @mentions (added 2026-06-20) ─────────────────────────────
  // User ids the commenter tagged with `@username`. PostCard
  // reads this to render clickable mention chips inside the
  // comment body. Default `[]` so old payloads (no mentions
  // table) don't crash.
  mentions?: number[];
  likesCount: number;
  repliesCount: number;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  user: SocialAuthor;
  isLiked: boolean;
  replies: SocialComment[];
}

/* ─── In-app social notifications (added 2026-06-20) ─────────── */

export type NotificationType =
  | 'NEW_POST'
  | 'NEW_REACTION'
  | 'NEW_COMMENT'
  | 'NEW_REPLY'
  | 'NEW_MENTION'
  | 'NEW_MESSAGE';

export interface SocialNotification {
  id: number;
  type: NotificationType;
  entityId: number | null;
  secondaryEntityId: number | null;
  payload: { type?: string; parentCommentId?: number; [k: string]: unknown } | null;
  isRead: boolean;
  createdAt: string;
  receiverId: number;
  sender: SocialAuthor;
}

export interface NotificationListResponse {
  items: SocialNotification[];
  pagination: { nextCursor: number | null; hasNextPage: boolean; limit: number };
  unreadCount: number;
}

export interface FeedResponse {
  success: boolean;
  data: SocialPost[];
  pagination: {
    nextCursor: number | null;
    hasNextPage: boolean;
    limit: number;
  };
}

export interface CommentResponse {
  success: boolean;
  data: SocialComment[];
  pagination: {
    nextCursor: number | null;
    hasNextPage: boolean;
    limit: number;
  };
}

export interface ReactionResponse {
  reacted: boolean;
  myType: ReactionType | null;
  likesCount: number;
  breakdown: ReactionBreakdown;
}

export interface SavedPost {
  savedId: number;
  folder: string | null;
  savedAt: string;
  post: SocialPost;
}

export interface SaveFolder {
  name: string;
  count: number;
}

export interface SaveResponse {
  folders: SaveFolder[];
  total: number;
  uncategorized: number;
}

export interface MediaUploadItem {
  id: string;
  file: File;
  preview: string;
  type: 'IMAGE' | 'VIDEO' | 'CODE_FILE' | 'FILE';
  progress: number;
  url?: string;
  thumbnail?: string;
  width?: number;
  height?: number;
  duration?: number;
  // Human-readable original file name (e.g. "report.pdf").
  // Displayed in the upload chip and used to drive the
  // download filename on the post card.
  fileName?: string;
  error?: string;
}
