import { axiosInstance } from './axios-instance';
import type { paths } from './schema/v1';
import { mockPosts } from './mock-data';

// Response types from the API schema
type PostResponse = paths['/api/Posts/']['get']['responses']['200']['content']['application/json'][0];
type GetPostsParams = paths['/api/Posts/']['get']['parameters']['query'];

// Type for pagination parameters
export interface PaginationParams {
  page: number;
  pageSize: number;
  search?: string;
}

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API functions for posts
export const postsApi = {
  // Get paginated list of posts
  getPosts: async (params: PaginationParams): Promise<PostResponse[]> => {
    // For demo purposes, use mock data instead of real API
    await delay(800); // Simulate network delay
    
    let filteredPosts = [...mockPosts];
    
    // Apply search filter if provided
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(searchLower) || 
        post.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Calculate pagination
    const startIndex = (params.page - 1) * params.pageSize;
    const endIndex = startIndex + params.pageSize;
    
    // Return paginated results
    return filteredPosts.slice(startIndex, endIndex);
  },

  // Get single post by ID
  getPostById: async (postId: string): Promise<PostResponse> => {
    // For demo purposes, use mock data instead of real API
    await delay(500);
    
    const post = mockPosts.find(p => p.id === postId);
    
    if (!post) {
      throw new Error(`Post with ID ${postId} not found`);
    }
    
    return post;
  }
}; 