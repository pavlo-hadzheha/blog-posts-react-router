import {
  Group,
  TextInput,
  Stack,
  Flex,
  Box,
} from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import { useSensors, useSensor, PointerSensor, DndContext, closestCenter } from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { useState, useMemo } from 'react'
import type { SortFieldConfig } from '../model/sort-config'
import { SortableItem } from './sortable-item'
import type { SortCriterion, SortFieldName } from '~/shared/model'
import type { SortDirection } from '~/shared/model'

export interface SortControlsProps {
  sortConfigs: SortFieldConfig[]
  sortCriteria: SortCriterion[]
  onSortChange: (field: SortFieldName, direction?: SortDirection) => void
  onSortReorder: (configs: SortFieldConfig[]) => void
  searchQuery?: string
  onSearchChange: (value: string) => void
  className?: string
}

export function SortControls({
  sortConfigs,
  sortCriteria,
  onSortChange,
  onSortReorder,
  searchQuery = '',
  onSearchChange,
  className,
}: SortControlsProps) {
  const [activeId, setActiveId] = useState<SortFieldName | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor)
  )

  // Create a map of active sort criteria for easy lookup
  const activeSortCriteriaMap = useMemo(() => {
    const map = new Map<SortFieldName, SortDirection>();
    sortCriteria.forEach(criterion => {
      if (criterion.dir !== undefined) {
        map.set(criterion.by, criterion.dir);
      }
    });
    return map;
  }, [sortCriteria]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveId(active.id as SortFieldName)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over || active.id === over.id) {
      return
    }

    const oldIndex = sortConfigs.findIndex((config) => config.field === active.id)
    const newIndex = sortConfigs.findIndex((config) => config.field === over.id)

    if (oldIndex === -1 || newIndex === -1) {
      return
    }

    const newSortConfigs = arrayMove([...sortConfigs], oldIndex, newIndex)
    onSortReorder(newSortConfigs)
  }

  return (
    <Stack className={className} gap="xs">
      <TextInput
        placeholder="Search..."
        leftSection={<IconSearch size={16} />}
        value={searchQuery}
        onChange={(event) => onSearchChange(event.currentTarget.value)}
      />

      <Box mt={4}>
        <Flex justify="space-between" align="center">
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            collisionDetection={closestCenter}
          >
            <SortableContext 
              items={sortConfigs.map(config => config.field)} 
              strategy={horizontalListSortingStrategy}
            >
              <Group gap="xs" wrap="wrap">
                {sortConfigs.map((config) => {
                  const value = activeSortCriteriaMap.get(config.field);
                  const priority = value !== undefined 
                    ? sortCriteria.findIndex(c => c.by === config.field)
                    : -1;

                  return (
                    <SortableItem
                      key={config.field}
                      id={config.field}
                      label={config.label}
                      type={config.type}
                      value={value}
                      onChange={(direction) => onSortChange(config.field, direction)}
                      isDragging={activeId === config.field}
                      priority={priority}
                    />
                  )
                })}
              </Group>
            </SortableContext>
          </DndContext>
        </Flex>
      </Box>
    </Stack>
  )
}
