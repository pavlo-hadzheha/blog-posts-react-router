import { axiosInstance } from './axios-instance'
import { config } from '~/shared/config/env'
import type { paths, components } from '~/shared/api/schema/v1'
import { type SortCriterion } from '~/shared/model'
import qs from 'qs'

type PostSchema = components['schemas']['PostSchema']
type PostsResponse = paths['/api/Posts/']['get']['responses']['200']['content']['application/json']
type SinglePostResponse = paths['/api/Posts/{postId}/']['get']['responses']['200']['content']['application/json']

export type GetPostsParams = Required<paths['/api/Posts/']['get']['parameters']['query']> & {
  page: number;
  pageSize: number;
  search?: string;
  sort?: SortCriterion[];
}

// API functions for posts
export const postsApi = {
  // Get paginated list of posts
  getPosts: async (params: GetPostsParams): Promise<PostsResponse> => {
    const response = await axiosInstance.get(`${config.api.baseUrl}/Posts`, {
      params,
      paramsSerializer: {
        serialize: (params) => qs.stringify(params, { arrayFormat: 'indices' }),
      },
    })

    return response.data
  },

  // Get single post by ID
  getPostById: async (postId: string): Promise<SinglePostResponse> => {
    const response = await axiosInstance.get(`${config.api.baseUrl}/Posts/${postId}`);
    return response.data;
  },

  // Search posts
  searchPosts: async (query: string): Promise<PostSchema[]> => {
    const response = await axiosInstance.get(`${config.api.baseUrl}/Posts/search`, { 
      params: { q: query } 
    });
    return response.data.posts;
  },
}
