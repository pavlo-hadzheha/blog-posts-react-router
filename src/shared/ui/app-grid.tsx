import type { ReactNode } from 'react';
import { SimpleGrid } from '@mantine/core';

export interface AppGridProps {
  /** Child components to render in the grid */
  children: ReactNode;
  /** Optional CSS classes to apply to the grid */
  className?: string;
}

export function AppGrid({ children, className = '' }: AppGridProps) {
  return (
    <SimpleGrid
      cols={{ base: 1, sm: 2 }}
      spacing={{ base: 'md', sm: 'lg' }}
      verticalSpacing={{ base: 'md', sm: 'lg' }}
      className={className}
    >
      {children}
    </SimpleGrid>
  );
} 