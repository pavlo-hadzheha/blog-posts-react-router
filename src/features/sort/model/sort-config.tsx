import { IconSortAZ, IconSortZA, IconCalendar, IconMessageCircle } from '@tabler/icons-react'
import { SortDirection } from '~/shared/model'
import type { SortFieldName } from '~/shared/model'
import React from 'react'

// UI type for identifying the UI component to use
export type SortType = 'title' | 'date' | 'comments'

// Complete configuration for a sort field
export interface SortFieldConfig {
  field: SortFieldName // The field identifier
  type: SortType // UI component type
  label: string // Display label
  tooltip: string // Tooltip text
  defaultDirection?: SortDirection // Default direction if any
  dir?: SortDirection // Current active direction (if any)
  options: {
    [SortDirection.ASC]: SortConfigOption
    [SortDirection.DESC]: SortConfigOption
  }
}

// Option for a single sort direction
export interface SortConfigOption {
  value: SortDirection
  icon: React.ReactNode
  label: string
}

/**
 * Unified sort configuration for the entire application
 * Contains all UI and business logic configuration in one place
 */
export const SORT_CONFIG: SortFieldConfig[] = [
  {
    field: 'createdAt',
    type: 'date',
    label: 'Date',
    tooltip: 'Sort by date',
    defaultDirection: SortDirection.DESC,
    options: {
      [SortDirection.ASC]: {
        value: SortDirection.ASC,
        icon: <IconCalendar size={16} />,
        label: 'Oldest First',
      },
      [SortDirection.DESC]: {
        value: SortDirection.DESC,
        icon: <IconCalendar size={16} />,
        label: 'Newest First',
      },
    },
  },
  {
    field: 'title',
    type: 'title',
    label: 'Title',
    tooltip: 'Sort by title',
    options: {
      [SortDirection.ASC]: {
        value: SortDirection.ASC,
        icon: <IconSortAZ size={16} />,
        label: 'A-Z',
      },
      [SortDirection.DESC]: {
        value: SortDirection.DESC,
        icon: <IconSortZA size={16} />,
        label: 'Z-A',
      },
    },
  },
  {
    field: 'commentsCount',
    type: 'comments',
    label: 'Comments',
    tooltip: 'Sort by comments',
    options: {
      [SortDirection.ASC]: {
        value: SortDirection.ASC,
        icon: <IconMessageCircle size={16} />,
        label: 'Least Comments',
      },
      [SortDirection.DESC]: {
        value: SortDirection.DESC,
        icon: <IconMessageCircle size={16} />,
        label: 'Most Comments',
      },
    },
  },
]
