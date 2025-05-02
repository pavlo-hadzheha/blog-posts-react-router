import { axiosInstance } from './axios-instance';
import { config } from '~/shared/config/env';
import type { paths, components } from '~/shared/api/schema/v1';
import { SortDirection, SortField } from '~/shared/model';
import qs from 'qs';

// Response types from the API schema
type PostSchema = components['schemas']['PostSchema'];
type PostsResponse = paths['/api/Posts/']['get']['responses']['200']['content']['application/json'];
type SinglePostResponse = paths['/api/Posts/{postId}/']['get']['responses']['200']['content']['application/json'];
export type GetPostsParams = Required<paths['/api/Posts/']['get']['parameters']['query']> & {
  titleSort?: SortDirection;
  dateSort?: SortDirection;
  commentsSort?: SortDirection;
  sortOrder?: SortField[];
  sort_order?: string;
};

// Type for pagination parameters
export interface PaginationParams {
  page: number;
  pageSize: number;
  search?: string;
  titleSort?: SortDirection;
  dateSort?: SortDirection;
  commentsSort?: SortDirection;
  sortOrder?: SortField[];
}

// Interface for formatted parameters with sort criteria
interface FormattedParams {
  page: number;
  pageSize: number;
  search?: string;
  sort?: Array<{by: string, dir: SortDirection}>;
  [key: string]: any;
}

// Convert sort parameters to API format
const formatSortParams = (params: GetPostsParams): FormattedParams => {
  const formattedParams: FormattedParams = { 
    page: params.page,
    pageSize: params.pageSize,
    search: params.search 
  };
  
  // Create an array to hold all active sort criteria
  const sortCriteria: Array<{by: string, dir: SortDirection}> = [];
  
  // Map our separate parameters to the expected format
  if (params.titleSort) {
    sortCriteria.push({ by: SortField.TITLE, dir: params.titleSort });
  }
  
  if (params.dateSort) {
    sortCriteria.push({ by: SortField.CREATED_AT, dir: params.dateSort });
  }
  
  if (params.commentsSort) {
    sortCriteria.push({ by: SortField.COMMENTS_COUNT, dir: params.commentsSort });
  }
  
  // Sort the criteria based on sortOrder if available
  if (params.sortOrder && params.sortOrder.length > 0 && sortCriteria.length > 0) {
    // Create a map for faster lookups of priorities
    const priorityMap = new Map(
      params.sortOrder.map((field, index) => [field, index])
    );
    
    // Sort based on the priority order
    sortCriteria.sort((a, b) => {
      const aPriority = priorityMap.get(a.by as SortField) ?? Number.MAX_SAFE_INTEGER;
      const bPriority = priorityMap.get(b.by as SortField) ?? Number.MAX_SAFE_INTEGER;
      return aPriority - bPriority;
    });
  }
  
  // Add the sort criteria to the parameters
  if (sortCriteria.length > 0) {
    formattedParams.sort = sortCriteria;
  }
  
  return formattedParams;
};

// API functions for posts
export const postsApi = {
  // Get paginated list of posts
  getPosts: async (params: GetPostsParams): Promise<{ posts: PostSchema[]; total: number }> => {
    const formattedParams = formatSortParams(params);
    
    const response = await axiosInstance.get(
      `${config.api.baseUrl}/Posts`, 
      { 
        params: formattedParams,
        paramsSerializer: {
          serialize: (params) => qs.stringify(params, { arrayFormat: 'indices' })
        }
      }
    );
    
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