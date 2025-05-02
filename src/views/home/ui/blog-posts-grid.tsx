import { useState } from 'react';
import { Title, TextInput, Container, Paper, Box, Text } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useDebouncedValue } from '@mantine/hooks';
import { AppCard, AppGrid, AppPagination, AppLoading, AppError } from '../../../shared/ui';
import { usePosts } from '../model/use-posts';

export interface BlogPostsGridProps {
  /** Title displayed at the top of the posts grid */
  title?: string;
}

export function BlogPostsGrid({ title = 'Blog Posts' }: BlogPostsGridProps) {
  // Pagination and search state
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 500);
  
  const PAGE_SIZE = 10;

  // Fetch posts data with pagination and search
  const { data, isLoading, isError, error, refetch } = usePosts({
    page,
    pageSize: PAGE_SIZE,
    search: debouncedSearchQuery
  });
  
  // Extract posts and total from API response
  const posts = data?.posts || [];
  const totalPosts = data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(totalPosts / PAGE_SIZE));
  
  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(1); // Reset to first page when search changes
  };
  
  return (
    <>
      <Box 
        className="w-full py-20 mb-8"
        style={{ 
          background: 'linear-gradient(135deg, #4dabf7 0%, #3c78e8 100%)',
          boxShadow: '0 4px 20px rgba(61, 159, 255, 0.2)'
        }}
      >
        <Container size="xl">
          <Title order={1} className="text-white text-4xl font-bold mb-4">
            {title}
          </Title>
          <Text className="text-white opacity-90 text-xl mb-8">
            Explore our collection of thoughtful articles and insights
          </Text>
          
          <TextInput
            placeholder="Search posts..."
            size="lg"
            radius="md"
            rightSection={<IconSearch size={20} />}
            value={searchQuery}
            onChange={handleSearchChange}
            className="max-w-md"
          />
        </Container>
      </Box>
      
      <Container size="xl" className="pb-16">
        {isLoading ? (
          <AppLoading text="Loading posts..." />
        ) : isError ? (
          <AppError 
            message={`Error loading posts: ${error instanceof Error ? error.message : 'Unknown error'}`} 
            onRetry={() => refetch()}
          />
        ) : posts.length > 0 ? (
          <>
            <AppGrid>
              {posts.map((post) => (
                <AppCard
                  key={post.id}
                  id={post.id}
                  title={post.title || ''}
                  description={post.description || ''}
                  createdAt={post.createdAt}
                  commentsCount={0} // Default to 0 since posts from API might not have comments array
                  onClick={(id) => console.log(`Clicked post ${id}`)}
                />
              ))}
            </AppGrid>
            
            <AppPagination
              currentPage={page}
              totalPages={totalPages}
              pageSize={PAGE_SIZE}
              totalItems={totalPosts}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <Paper p="xl" radius="md" withBorder className="text-center">
            <Title order={3} className="text-gray-500">No posts found</Title>
            {debouncedSearchQuery && (
              <Title order={5} className="text-gray-400 mt-2">
                Try different search terms
              </Title>
            )}
          </Paper>
        )}
      </Container>
    </>
  );
} 