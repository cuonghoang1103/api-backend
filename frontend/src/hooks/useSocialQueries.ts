'use client';

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { socialApi } from '@/lib/api';
import type { SocialPost, SocialComment } from '@/types/social';

export interface SocialFeedParams {
  cursor?: number;
  limit?: number;
  authorId?: number;
  visibility?: string;
  hashtag?: string;
  // Phase 5 home upgrade: feed filter tabs.
  sort?: 'recent' | 'popular';
  following?: boolean;
}

export interface SocialFeedResponse {
  success: boolean;
  data: SocialPost[];
  nextCursor: number | null;
  hasMore: boolean;
}

// ─── Query Keys ────────────────────────────────────────────────────────────────

export const socialKeys = {
  all: ['social'] as const,
  feed: (params?: SocialFeedParams) => [...socialKeys.all, 'feed', params ?? {}] as const,
  post: (id: number) => [...socialKeys.all, 'post', id] as const,
  comments: (postId: number) => [...socialKeys.all, 'comments', postId] as const,
};

// ─── Feed Query ───────────────────────────────────────────────────────────────

/**
 * Fetch the social feed with TanStack Query caching.
 *
 * staleTime: 30s — if the user navigates back to the feed within 30s,
 * the cached posts are shown instantly without an API call.
 * gcTime: 5min — keeps the cache alive in the background tab.
 *
 * The feed is considered stale after 30s, so a background refetch
 * runs automatically to pick up new posts without blocking the UI.
 */
export function useSocialFeed(params?: SocialFeedParams) {
  return useQuery({
    queryKey: socialKeys.feed(params),
    queryFn: () => socialApi.getFeed(params).then((r) => r.data as unknown as SocialFeedResponse),
    staleTime: 30_000,    // 30 seconds
    gcTime: 5 * 60_000,  // 5 minutes
    placeholderData: (prev) => prev, // keep showing old data while refetching
  });
}

// ─── Post Query ───────────────────────────────────────────────────────────────

export function useSocialPost(id: number | null) {
  return useQuery({
    queryKey: socialKeys.post(id ?? -1),
    queryFn: () => socialApi.getPost(id as number).then((r) => r.data),
    enabled: id != null && id > 0,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
  });
}

// ─── Comments Query ────────────────────────────────────────────────────────────

export function useSocialComments(postId: number, params?: { cursor?: number; limit?: number }) {
  return useQuery({
    queryKey: [...socialKeys.comments(postId), params] as const,
    queryFn: () => socialApi.getComments(postId, params).then((r) => r.data),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    placeholderData: (prev) => prev,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

/**
 * Force a background refetch of the feed. We use `refetchType:
 * 'all'` so even queries that are still within their 30s
 * staleTime will get re-pulled — the alternative (`'none'`)
 * leaves stale data on screen until the user navigates.
 */
export function useInvalidateFeed() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({
      queryKey: socialKeys.feed(),
      refetchType: 'all',
    });
  };
}

export function useOptimisticPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: socialApi.createPost,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: socialKeys.feed() });
    },
  });
}

export function useToggleLike() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, liked }: { id: number; liked: boolean }) =>
      liked ? socialApi.unlikePost(id) : socialApi.likePost(id),
    onMutate: async ({ id, liked }) => {
      await qc.cancelQueries({ queryKey: socialKeys.feed() });
      const prev = qc.getQueriesData({ queryKey: socialKeys.feed() });
      qc.setQueriesData({ queryKey: socialKeys.feed() }, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.map((post: SocialPost) =>
              post.id === id
                ? { ...post, _likeCount: (post as any)._likeCount ?? post.likesCount, likesCount: (post.likesCount ?? 0) + (liked ? -1 : 1), _liked: !liked }
                : post,
            ),
          })),
        };
      });
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueriesData({ queryKey: socialKeys.feed() }, ctx.prev);
    },
  });
}
