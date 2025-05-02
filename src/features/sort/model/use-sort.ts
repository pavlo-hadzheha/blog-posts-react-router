import { useState } from 'react';
import { SortDirection, SortField } from '~/shared/model';

export interface SortCriterion {
  field: SortField;
  direction: SortDirection;
}

export interface SortState {
  titleSort?: SortDirection;
  dateSort?: SortDirection;
  commentsSort?: SortDirection;
  // Array to track the order of active sort criteria
  sortOrder: SortField[];
}

interface UseSortResult extends SortState {
  setTitleSort: (direction?: SortDirection) => void;
  setDateSort: (direction?: SortDirection) => void;
  setCommentsSort: (direction?: SortDirection) => void;
  resetSort: () => void;
  // Methods for handling sort order
  reorderSortCriteria: (newOrder: SortField[]) => void;
  addSortCriterion: (field: SortField) => void;
  removeSortCriterion: (field: SortField) => void;
}

// Map sort fields to their corresponding state property names
const sortFieldToProperty = {
  [SortField.TITLE]: 'titleSort',
  [SortField.CREATED_AT]: 'dateSort',
  [SortField.COMMENTS_COUNT]: 'commentsSort',
};

// Default order of all available sort fields
const DEFAULT_SORT_ORDER = [
  SortField.CREATED_AT,
  SortField.TITLE,
  SortField.COMMENTS_COUNT
];

export const useSort = (initialState?: Partial<SortState>): UseSortResult => {
  const [titleSort, setTitleSort] = useState<SortDirection | undefined>(
    initialState?.titleSort
  );
  
  const [dateSort, setDateSort] = useState<SortDirection | undefined>(
    initialState?.dateSort || SortDirection.DESC // Default to newest first
  );
  
  const [commentsSort, setCommentsSort] = useState<SortDirection | undefined>(
    initialState?.commentsSort
  );

  // Initialize sort order with all available fields
  const [sortOrder, setSortOrder] = useState<SortField[]>(
    initialState?.sortOrder || DEFAULT_SORT_ORDER
  );

  // Helper function to ensure all fields are present in the sort order
  const ensureAllFieldsInSortOrder = (currentOrder: SortField[]): SortField[] => {
    const allFields = [SortField.TITLE, SortField.CREATED_AT, SortField.COMMENTS_COUNT];
    const result = [...currentOrder];
    
    // Add any missing fields at the end
    allFields.forEach(field => {
      if (!result.includes(field)) {
        result.push(field);
      }
    });
    
    return result;
  };

  const addSortCriterion = (field: SortField) => {
    setSortOrder((current) => {
      // Only add if not already in the order array
      if (!current.includes(field)) {
        return [...current, field];
      }
      return current;
    });
  };

  const removeSortCriterion = (field: SortField) => {
    // We no longer remove from sortOrder, just mark as inactive
    // The field stays in the order for visual consistency
  };

  // Reorder the sort criteria
  const reorderSortCriteria = (newOrder: SortField[]) => {
    // Ensure all fields are present
    setSortOrder(ensureAllFieldsInSortOrder(newOrder));
  };

  // Enhance the existing setters to update the sort order
  const setTitleSortWithOrder = (direction?: SortDirection) => {
    setTitleSort(direction);
    if (direction) {
      addSortCriterion(SortField.TITLE);
    }
  };

  const setDateSortWithOrder = (direction?: SortDirection) => {
    setDateSort(direction);
    if (direction) {
      addSortCriterion(SortField.CREATED_AT);
    }
  };

  const setCommentsSortWithOrder = (direction?: SortDirection) => {
    setCommentsSort(direction);
    if (direction) {
      addSortCriterion(SortField.COMMENTS_COUNT);
    }
  };

  const resetSort = () => {
    setTitleSort(undefined);
    setDateSort(SortDirection.DESC); // Default to newest first
    setCommentsSort(undefined);
    setSortOrder(DEFAULT_SORT_ORDER); // Reset to default order
  };

  return {
    titleSort,
    dateSort,
    commentsSort,
    sortOrder,
    setTitleSort: setTitleSortWithOrder,
    setDateSort: setDateSortWithOrder,
    setCommentsSort: setCommentsSortWithOrder,
    resetSort,
    reorderSortCriteria,
    addSortCriterion,
    removeSortCriterion,
  };
}; 