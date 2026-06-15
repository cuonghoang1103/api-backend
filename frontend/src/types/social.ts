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
  type: 'IMAGE' | 'VIDEO' | 'CODE_FILE';
  url: string;
  thumbnail?: string | null;
  width?: number | null;
  height?: number | null;
  duration?: number | null;
  mimeType?: string | null;
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

export interface SocialPost {
  id: number;
  content: string;
  visibility: 'PUBLIC' | 'FRIENDS' | 'PRIVATE';
  latitude?: number | null;
  longitude?: number | null;
  locationName?: string | null;
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
}

export interface SocialComment {
  id: number;
  postId: number;
  parentId?: number | null;
  content: string;
  likesCount: number;
  repliesCount: number;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  user: SocialAuthor;
  isLiked: boolean;
  replies: SocialComment[];
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
  type: 'IMAGE' | 'VIDEO' | 'CODE_FILE';
  progress: number;
  url?: string;
  thumbnail?: string;
  width?: number;
  height?: number;
  duration?: number;
  error?: string;
}
