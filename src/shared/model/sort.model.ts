/**
 * Sort field options
 */
export enum SortField {
  TITLE = 'title',
  CREATED_AT = 'createdAt',
  COMMENTS_COUNT = 'commentsCount',
}

/**
 * Sort direction options
 */
export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

/**
 * Sort criterion interface representing a single sort option
 */
export interface SortCriterion {
  field: SortField;
  direction: SortDirection;
}

/**
 * Sort option interface for UI controls
 */
export interface SortOption {
  label: string;
  value: SortDirection;
  icon?: string;
}

/**
 * Sort options for the title control
 */
export const TITLE_SORT_OPTIONS: SortOption[] = [
  { 
    label: 'A-Z', 
    value: SortDirection.ASC,
  },
  { 
    label: 'Z-A', 
    value: SortDirection.DESC,
  },
];

/**
 * Sort options for the created date control
 */
export const DATE_SORT_OPTIONS: SortOption[] = [
  { 
    label: 'Newest First', 
    value: SortDirection.DESC,
  },
  { 
    label: 'Oldest First', 
    value: SortDirection.ASC,
  },
];

/**
 * Sort options for the comments count control
 */
export const COMMENTS_SORT_OPTIONS: SortOption[] = [
  { 
    label: 'Most Comments', 
    value: SortDirection.DESC,
  },
  { 
    label: 'Least Comments', 
    value: SortDirection.ASC,
  },
];

/**
 * Default sort criteria
 */
export const DEFAULT_SORT_CRITERIA: SortCriterion[] = [
  { field: SortField.CREATED_AT, direction: SortDirection.DESC }
]; 