import { useQuery } from '@tanstack/react-query';
import type { PaginationParams } from '../../../shared/api/posts.api';
import { postsApi } from '../../../shared/api/posts.api';

export function usePosts(params: PaginationParams) {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: () => postsApi.getPosts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData,
  });
} 