import dayjs from 'dayjs';

// Simple UUID generator for browser compatibility
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Generate a list of mock posts
export const mockPosts = Array.from({ length: 30 }, (_, index) => {
  const id = generateId();
  const commentsCount = Math.floor(Math.random() * 10);
  
  return {
    id,
    title: `Blog Post ${index + 1}`,
    description: `This is a description for blog post ${index + 1}. It contains some sample text to show how the card will look with a multi-line description.`,
    createdAt: dayjs().subtract(Math.floor(Math.random() * 30), 'day').toISOString(),
    updatedAt: dayjs().subtract(Math.floor(Math.random() * 5), 'day').toISOString(),
    comments: Array.from({ length: commentsCount }, (_, i) => ({
      id: generateId(),
      text: `This is comment ${i + 1} for post ${index + 1}`,
      createdAt: dayjs().subtract(Math.floor(Math.random() * 15), 'day').toISOString(),
      updatedAt: dayjs().subtract(Math.floor(Math.random() * 2), 'day').toISOString(),
    }))
  };
}); 