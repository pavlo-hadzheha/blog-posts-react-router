/**
 * Sort direction options
 */
export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

/**
 * Valid sort field names supported by the API
 */
export type SortFieldName = 'title' | 'createdAt' | 'commentsCount';

/**
 * Sort criterion interface for use throughout the application
 * Array position implicitly determines priority
 */
export interface SortCriterion {
  by: SortFieldName;
  dir: SortDirection | undefined;
}

/**
 * Convert a sort criterion for API consumption
 * Currently just passes through since we're using the same format
 */
export const toApiSortCriterion = (criterion: SortCriterion): SortCriterion => criterion; 