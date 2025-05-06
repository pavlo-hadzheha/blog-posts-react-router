import { useDebouncedValue } from '@mantine/hooks'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { GetPostsParams } from '~/shared/api/posts.api'
import { postsApi } from '~/shared/api/posts.api'
import type { components } from '~/shared/api/schema/v1'

type PostSchema = components['schemas']['PostSchema']

export interface UsePostsResult {
  posts: PostSchema[]
  total: number
}

export function usePosts(params: GetPostsParams) {
  const [debouncedParams] = useDebouncedValue(params, 500)

  return useQuery({
    queryKey: ['posts', debouncedParams],
    queryFn: async () => {
      const result = await postsApi.getPosts(debouncedParams)
      return result
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData,
  })
}
