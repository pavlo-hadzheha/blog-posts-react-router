import { axiosInstance } from './axios-instance';
import { config } from '~/shared/config/env';
import type { paths, components } from '~/shared/api/schema/v1';
import { SortDirection } from '~/shared/model';
import type { SortCriterion, SortField } from '~/shared/model';

// Response types from the API schema
type PostSchema = components['schemas']['PostSchema'];
type PostsResponse = paths['/api/Posts/']['get']['responses']['200']['content']['application/json'];
type SinglePostResponse = paths['/api/Posts/{postId}/']['get']['responses']['200']['content']['application/json'];
export type GetPostsParams = Required<paths['/api/Posts/']['get']['parameters']['query']> & {
  titleSort?: SortDirection;
  dateSort?: SortDirection;
  commentsSort?: SortDirection;
};

// Type for pagination parameters
export interface PaginationParams {
  page: number;
  pageSize: number;
  search?: string;
  titleSort?: SortDirection;
  dateSort?: SortDirection;
  commentsSort?: SortDirection;
}

// Convert sort parameters to API format
const formatSortParams = (params: GetPostsParams): GetPostsParams => {
  const formattedParams = { ...params };
  
  // Apply sort criteria in order of importance
  // The backend expects these specific parameter names
  return formattedParams;
};

// API functions for posts
export const postsApi = {
  // Get paginated list of posts
  getPosts: async (params: GetPostsParams): Promise<{ posts: PostSchema[]; total: number }> => {
    const formattedParams = formatSortParams(params);
    const response = await axiosInstance.get(`${config.api.baseUrl}/Posts`, { params: formattedParams });
    return response.data;
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
}; 