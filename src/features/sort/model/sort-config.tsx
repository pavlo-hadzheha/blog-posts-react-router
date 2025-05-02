import { IconSortAZ, IconSortZA, IconArrowDown, IconArrowUp, IconCalendar, IconMessageCircle } from '@tabler/icons-react';
import { SortDirection } from '~/shared/model';
import React from 'react';

export type SortType = 'title' | 'date' | 'comments';

export interface SortOption {
  value: SortDirection;
  icon: React.ReactNode;
  label: string;
  secondIcon?: React.ReactNode;
}

export interface SortTypeConfig {
  tooltip: string;
  options: SortOption[];
}

/**
 * Get configuration for a specific sort type
 */
export const getSortConfig = (type: SortType): SortTypeConfig => {
  switch (type) {
    case 'title':
      return {
        tooltip: 'Sort by title',
        options: [
          {
            value: SortDirection.ASC,
            icon: <IconSortAZ size={16} />,
            label: 'Asc',
          },
          {
            value: SortDirection.DESC,
            icon: <IconSortZA size={16} />,
            label: 'Desc',
          },
        ],
      };
      
    case 'date':
      return {
        tooltip: 'Sort by date',
        options: [
          {
            value: SortDirection.ASC,
            icon: <IconCalendar size={16} />,
            label: 'Asc',
          },
          {
            value: SortDirection.DESC,
            icon: <IconCalendar size={16} />,
            label: 'Desc',
          },
        ],
      };
      
    case 'comments':
      return {
        tooltip: 'Sort by comments',
        options: [
          {
            value: SortDirection.DESC,
            icon: <IconMessageCircle size={16} />,
            label: 'Asc',
          },
          {
            value: SortDirection.ASC,
            icon: <IconMessageCircle size={16} />,
            label: 'Desc',
          },
        ],
      };
  }
}; 