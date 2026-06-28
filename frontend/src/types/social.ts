// Social Feed Types

// Phase 3 add — minimal track shape for the music sticker
// (only fields the sticker needs). Matches what the backend
// social.service.ts selects in the `include: { musicTrack: … }`
// block: id, title, artist, audioUrl, coverImage, durationSeconds.
export interface MusicTrackMini {
  id: number;
  title: string;
  artist: string;
  coverImage?: string | null;
  audioUrl?: string | null;
  durationSeconds?: number | null;
}

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

/**
 * Visual-only extension of ReactionType. WOW is rendered in the
 * emoji picker (Facebook-style 6-emoji bar) but is NOT sent to the
 * server — clicking it just triggers a regular LIKE so the existing
 * backend contract stays unchanged. Keeping a separate type here
 * makes the client-only nature obvious to any future reader.
 */
export type ExtendedReactionType = ReactionType | 'WOW';

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

// WOW is shown in the picker but maps to a normal LIKE on the wire.
export const WOW_META = { emoji: '😮', label: 'Wow', color: '#f59e0b' } as const;

/** Order of the 6 emoji buttons in the hover-reaction popover. */
export const REACTION_PICKER_ORDER: ExtendedReactionType[] = [
  'LIKE',
  'LOVE',
  'HAHA',
  'WOW',
  'SAD',
  'ANGRY',
];

export interface SocialPost {
  id: number;
  content: string;
  // Content-type bucket driving the home feed tabs (Tất cả / Bài viết /
  // Video / File) and the per-type badge. Optional so older cached post
  // shapes (pre-tabs) keep type-checking; readers default to 'POST'.
  type?: 'POST' | 'VIDEO' | 'FILE';
  visibility: 'PUBLIC' | 'FRIENDS' | 'PRIVATE';
  latitude?: number | null;
  longitude?: number | null;
  locationName?: string | null;
  // Optional YouTube URL the user pasted into the composer. The
  // post card renders this as an inline embed when present.
  youtubeUrl?: string | null;
  // Phase 3 add — Instagram-style music sticker. When set,
  // the post card renders a small overlay on the first media
  // tile with track title + artist. musicStartSec is the
  // optional snippet offset; not yet played in the feed (TODO).
  musicTrackId?: number | null;
  musicStartSec?: number | null;
  musicTrack?: MusicTrackMini | null;
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
  sharesCount?: number; // Phase 6 — repost count
  isLiked: boolean;
  isSaved: boolean;
  isShared?: boolean; // Phase 6 — whether current user has shared/reposted
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
  // Phase 5 home upgrade: comment threading depth (0 = top-level,
  // 1 = first reply). maxDepth=2 is enforced server-side; the
  // frontend uses this to hide the reply button on depth=1
  // comments.
  depth?: number;
  content: string;
  // ─── @mentions (added 2026-06-20) ─────────────────────────────
  // User ids the commenter tagged with `@username`. PostCard
  // reads this to render clickable mention chips inside the
  // comment body. Default `[]` so old payloads (no mentions
  // table) don't crash.
  mentions?: number[];
  likesCount: number;
  repliesCount: number;
  // Phase 5 home upgrade: when the server fetched fewer replies
  // than `repliesCount`, these two flags tell the UI to render a
  // "Xem thêm N phản hồi" button that lazy-loads the rest via
  // /comments/by-root/:rootId.
  repliesShown?: number;
  hasMoreReplies?: boolean;
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
  /**
   * Thread id for NEW_MESSAGE notifications. The backend doesn't
   * emit NEW_MESSAGE today but the field is reserved for when it
   * does, so the dropdown can deep-link straight to the right
   * conversation. Optional because the existing /api/v1/messages/
   * notifications endpoint doesn't surface it; treat undefined as
   * 'unknown' and fall back to /messages without a thread query.
   */
  threadId?: number | null;
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

// ════════════════════════════════════════════════════════════════════
// FeedCollection / FeedSavedPost — Multi-folder bookmark (2026-06-20)
// ════════════════════════════════════════════════════════════════════
//
// A user owns N named collections. A post can be saved into
// MANY collections per user. The contract mirrors the backend
// route layer in `src/routes/social.routes.ts`.

/** One row of the `FeedCollection` table. */
export interface FeedCollection {
  id: number;
  name: string;
  icon: string | null;
  sortOrder: number;
  /** Number of posts this user has saved INTO this collection. */
  count: number;
  createdAt: string;
}

/** Result of GET /api/v1/feed/collections */
export interface FeedCollectionsResponse {
  collections: FeedCollection[];
  /** Legacy "Chưa phân loại" bucket = old `SocialSave.folder
   *  IS NULL` rows. Non-zero only for users who saved posts
   *  before this feature. */
  uncategorized: number;
  total: number;
}

/** Result of POST /api/v1/feed/collections */
export interface FeedCollectionCreated {
  id: number;
  name: string;
  icon: string | null;
  sortOrder: number;
  count: number;
  createdAt: string;
}

/** Result of POST /api/v1/feed/save-post-v2 */
export interface FeedSaveResult {
  postId: number;
  collectionIds: number[];
  added: number[];
  removed: number[];
  isSaved: boolean;
}

/** Result of GET /api/v1/feed/save-context?postId=… */
export interface FeedPostSaveContext {
  collectionIds: number[];
  collections: Array<Pick<FeedCollection, 'id' | 'name' | 'icon'>>;
  isSaved: boolean;
}

/** Result of GET /api/v1/feed/collections/:id/posts */
export interface FeedSavedPostsResponse {
  items: Array<{
    saveId: number;
    savedAt: string;
    collectionId?: number;
    folder?: string | null;
    post: SocialPost;
  }>;
  nextCursor: number | null;
}
