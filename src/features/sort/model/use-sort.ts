import { SortDirection } from '~/shared/model'
import type { SortCriterion, SortFieldName } from '~/shared/model'
import { useMemo, useState } from 'react'
import { SORT_CONFIG } from './sort-config'
import type { SortFieldConfig } from './sort-config'

/**
 * Create SortCriterion array from configuration objects
 * Only includes active sort criteria (those with a direction)
 */
const createSortCriteriaFromConfig = (config: SortFieldConfig[]): SortCriterion[] =>
  config
    .filter((item) => item.dir !== undefined)
    .map((item) => ({
      by: item.field,
      dir: item.dir,
    }))

export interface UseSortResult {
  sortConfigs: SortFieldConfig[]
  sortCriteria: SortCriterion[]
  updateSortCriterion: (field: SortFieldName, direction?: SortDirection) => void
  reorderSortConfigs: (newOrder: SortFieldConfig[]) => void
  resetSortCriteria: () => void
}

export const useSort = (initialConfigs: SortFieldConfig[] = SORT_CONFIG): UseSortResult => {
  const initializedConfigs = useMemo(() => {
    return initialConfigs.map((config) => ({
      ...config,
      dir: config.defaultDirection,
    }))
  }, [initialConfigs])

  const [sortConfigs, setSortConfigs] = useState<SortFieldConfig[]>(initializedConfigs)

  const sortCriteria = useMemo<SortCriterion[]>(() => createSortCriteriaFromConfig(sortConfigs), [sortConfigs])

  const updateSortCriterion = (field: SortFieldName, direction?: SortDirection) => {
    const configIndex = sortConfigs.findIndex((c) => c.field === field)
    if (configIndex === -1) return

    const newConfigs = [...sortConfigs]
    const wasActive = newConfigs[configIndex].dir !== undefined
    newConfigs[configIndex] = { ...newConfigs[configIndex], dir: direction }

    if (!wasActive && direction !== undefined) {
      const [item] = newConfigs.splice(configIndex, 1)
      newConfigs.unshift(item)
    }

    setSortConfigs(newConfigs)
  }

  const reorderSortConfigs = (newConfigs: SortFieldConfig[]) => {
    const dirMap = new Map(sortConfigs.map((config) => [config.field, config.dir]))

    const updatedConfigs = newConfigs.map((config) => ({
      ...config,
      dir: dirMap.get(config.field),
    }))

    setSortConfigs(updatedConfigs)
  }

  const resetSortCriteria = () => {
    setSortConfigs(initializedConfigs)
  }

  return {
    sortConfigs,
    sortCriteria,
    updateSortCriterion,
    reorderSortConfigs,
    resetSortCriteria,
  }
}
