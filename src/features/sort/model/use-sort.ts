import { SortDirection } from '~/shared/model'
import type { SortCriterion, SortFieldName } from '~/shared/model'
import { useMemo, useState } from 'react'
import { SORT_CONFIG } from './sort-config'
import type { SortFieldConfig } from './sort-config'

const createSortCriteriaFromConfig = (config: SortFieldConfig[]): SortCriterion[] =>
  config.map((item) => ({
    by: item.field as SortFieldName,
    dir: item.defaultDirection,
  }))

export interface UseSortResult {
  sortConfigs: SortFieldConfig[]
  sortCriteria: SortCriterion[]
  updateSortCriterion: (field: SortFieldName, direction?: SortDirection) => void
  reorderSortConfigs: (newOrder: SortFieldConfig[]) => void
  resetSortCriteria: () => void
}

export const useSort = (initialConfigs: SortFieldConfig[] = SORT_CONFIG): UseSortResult => {
  const [sortConfigs, setSortConfigs] = useState<SortFieldConfig[]>(initialConfigs)

  const sortCriteria = useMemo<SortCriterion[]>(() => createSortCriteriaFromConfig(sortConfigs), [sortConfigs])

  const [activeCriteria, setActiveCriteria] = useState<Map<SortFieldName, SortDirection>>(
    new Map(sortCriteria.filter((c) => c.dir !== undefined).map((c) => [c.by, c.dir as SortDirection]))
  )

  const updateSortCriterion = (field: SortFieldName, direction?: SortDirection) => {
    const newActiveCriteria = new Map(activeCriteria)

    if (!direction) {
      newActiveCriteria.delete(field)
    } else {
      const wasActive = newActiveCriteria.has(field)
      newActiveCriteria.delete(field)

      const activeFields = Array.from(newActiveCriteria.keys())

      if (!wasActive) {
        activeFields.unshift(field)
      } else {
        const index = sortConfigs.findIndex((c) => c.field === field)
        if (index !== -1) {
          activeFields.splice(index, 0, field)
        } else {
          activeFields.push(field)
        }
      }

      newActiveCriteria.clear()
      activeFields.forEach((f) => {
        if (f === field) {
          newActiveCriteria.set(f, direction)
        } else {
          const dir = activeCriteria.get(f)
          if (dir !== undefined) {
            newActiveCriteria.set(f, dir)
          }
        }
      })
    }

    setActiveCriteria(newActiveCriteria)

    const activeKeys = Array.from(newActiveCriteria.keys())
    const orderedConfigs = [...sortConfigs].sort((a, b) => {
      const aIndex = activeKeys.indexOf(a.field as SortFieldName)
      const bIndex = activeKeys.indexOf(b.field as SortFieldName)

      if (aIndex === -1 && bIndex === -1) return 0
      if (aIndex === -1) return 1
      if (bIndex === -1) return -1
      return aIndex - bIndex
    })

    setSortConfigs(orderedConfigs)
  }

  const reorderSortConfigs = (newConfigs: SortFieldConfig[]) => {
    setSortConfigs(newConfigs)

    const newActiveCriteria = new Map<SortFieldName, SortDirection>()
    newConfigs.forEach((config) => {
      const direction = activeCriteria.get(config.field as SortFieldName)
      if (direction !== undefined) {
        newActiveCriteria.set(config.field as SortFieldName, direction)
      }
    })

    setActiveCriteria(newActiveCriteria)
  }

  const resetSortCriteria = () => {
    setSortConfigs(initialConfigs)

    // Reset active criteria based on default directions
    const newActiveCriteria = new Map<SortFieldName, SortDirection>()
    initialConfigs.forEach((config) => {
      if (config.defaultDirection !== undefined) {
        newActiveCriteria.set(config.field as SortFieldName, config.defaultDirection)
      }
    })

    setActiveCriteria(newActiveCriteria)
  }

  return useMemo(
    () => ({
      sortConfigs,
      sortCriteria: Array.from(activeCriteria.entries()).map(([by, dir]) => ({ by, dir })),
      updateSortCriterion,
      reorderSortConfigs,
      resetSortCriteria,
    }),
    [sortConfigs, activeCriteria]
  )
}
