import { useState, useMemo } from 'react'
import { Title, Container, Paper, Box, Text } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { AppCard, AppGrid, AppPagination, AppLoading, AppError } from '../../../shared/ui'
import { usePosts } from '../model/use-posts'
import { SortControls, useSort } from '~/features/sort'
import { toApiSortCriterion } from '~/shared/model'
import type { SortDirection, SortFieldName } from '~/shared/model'
import type { SortFieldConfig } from '~/features/sort/model/sort-config'

export interface BlogPostsGridProps {
  /** Title displayed at the top of the posts grid */
  title?: string
}

export function BlogPostsGrid({ title = 'Blog Posts' }: BlogPostsGridProps) {
  // Pagination and search state
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 500)

  // Sort state using our enhanced hook
  const { sortConfigs, sortCriteria, updateSortCriterion, reorderSortConfigs, resetSortCriteria } = useSort()

  const PAGE_SIZE = 10

  // Create API-friendly sort array for backend
  const apiSortCriteria = useMemo(
    () => sortCriteria.map(toApiSortCriterion),
    [sortCriteria]
  )

  // Fetch posts data with pagination, search, and sort
  const { data, isLoading, isError, error, refetch } = usePosts({
    page,
    pageSize: PAGE_SIZE,
    search: debouncedSearchQuery,
    sort: apiSortCriteria,
  })

  // Extract posts and total from API response
  const posts = data?.posts || []
  const totalPosts = data?.total || 0
  const totalPages = Math.max(1, Math.ceil(totalPosts / PAGE_SIZE))

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setPage(1) // Reset to first page when search changes
  }

  // Handle sort field change
  const handleSortChange = (field: SortFieldName, direction?: SortDirection) => {
    updateSortCriterion(field, direction)
    setPage(1) // Reset to first page when sort changes
  }

  // Handle sort reordering
  const handleSortReorder = (newConfigs: SortFieldConfig[]) => {
    reorderSortConfigs(newConfigs)
    setPage(1) // Reset to first page when sort order changes
  }

  return (
    <>
      <Box
        className="w-full py-20 mb-8"
        style={{
          background: 'linear-gradient(135deg, #4dabf7 0%, #3c78e8 100%)',
          boxShadow: '0 4px 20px rgba(61, 159, 255, 0.2)',
        }}
      >
        <Container size="xl">
          <Title order={1} className="text-white text-4xl font-bold mb-4">
            {title}
          </Title>
          <Text c={'white'} className="opacity-90 text-xl mb-8">
            Explore our collection of thoughtful articles and insights
          </Text>
        </Container>
      </Box>

      <Container size="xl" className="pb-16">
        <SortControls
          sortConfigs={sortConfigs}
          sortCriteria={sortCriteria}
          onSortChange={handleSortChange}
          onSortReorder={handleSortReorder}
          className="mb-6"
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />

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
                  commentsCount={post.commentsCount}
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
            <Title order={3} className="text-gray-500">
              No posts found
            </Title>
            {debouncedSearchQuery && (
              <Title order={5} className="text-gray-400 mt-2">
                Try different search terms
              </Title>
            )}
          </Paper>
        )}
      </Container>
    </>
  )
}
