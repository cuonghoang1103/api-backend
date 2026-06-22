export interface DevPostCard {
  id: number;
  title: string;
  description: string;
  category: string;
  sourceUrl: string;
  downloadCount: number;
  commentCount: number;
  createdAt: string;
}

export interface DevPostComment {
  id: number;
  userName: string;
  userAvatar: string;
  commentText: string;
  createdAt: string;
}

export interface DevPostDetail {
  id: number;
  title: string;
  description: string;
  content: string;
  sourceUrl: string;
  videoUrl?: string | null;
  downloadCount: number;
  category: string;
  createdAt: string;
  updatedAt: string;
  comments: DevPostComment[];
  commentCount: number;
}
