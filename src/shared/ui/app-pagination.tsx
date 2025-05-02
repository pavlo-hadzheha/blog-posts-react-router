import { Pagination } from '@mantine/core';

export interface AppPaginationProps {
  /** Current page number (1-based) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Number of items per page */
  pageSize: number;
  /** Total number of items */
  totalItems?: number;
  /** Called when page changes */
  onPageChange: (page: number) => void;
}

export function AppPagination({ 
  currentPage, 
  totalPages, 
  totalItems,
  onPageChange 
}: AppPaginationProps) {
  return (
    <div className="flex flex-col items-center gap-2 my-6">
      <Pagination
        value={currentPage}
        onChange={onPageChange}
        total={totalPages}
        radius="md"
        hideWithOnePage
      />
      
      {totalItems !== undefined && totalPages > 1 && (
        <div className="text-sm text-gray-500">
          Showing page {currentPage} of {totalPages} 
          {totalItems > 0 && ` • ${totalItems} total items`}
        </div>
      )}
    </div>
  );
} 