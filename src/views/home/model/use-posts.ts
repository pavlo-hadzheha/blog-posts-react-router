import { useQuery } from '@tanstack/react-query';
import type { GetPostsParams } from '~/shared/api/posts.api';
import { postsApi } from '~/shared/api/posts.api';
import type { components } from '~/shared/api/schema/v1';

type PostSchema = components['schemas']['PostSchema'];

export interface UsePostsResult {
  posts: PostSchema[];
  total: number;
}

export function usePosts(params: GetPostsParams) {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: async () => {
      const result = await postsApi.getPosts(params);
      return result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData,
  });
} 