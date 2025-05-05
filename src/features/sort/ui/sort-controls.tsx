import {
  Group,
  TextInput,
  Stack,
  Flex,
  Box,
} from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import { 
  useSensors, 
  useSensor, 
  PointerSensor, 
  KeyboardSensor,
  DndContext, 
  closestCenter, 
  DragOverlay
} from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy, arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useState } from 'react'
import type { SortFieldConfig } from '../model/sort-config'
import { SortableItem, SortItemContent } from './sortable-item'
import type { SortDirection, SortFieldName, SortCriterion } from '~/shared/model'

export interface SortControlsProps {
  sortConfigs: SortFieldConfig[]
  sortCriteria: SortCriterion[] // Kept for backward compatibility
  onSortChange: (field: SortFieldName, direction?: SortDirection) => void
  onSortReorder: (configs: SortFieldConfig[]) => void
  searchQuery?: string
  onSearchChange: (value: string) => void
  className?: string
}

export function SortControls({
  sortConfigs,
  onSortChange,
  onSortReorder,
  searchQuery = '',
  onSearchChange,
  className,
}: SortControlsProps) {
  const [activeId, setActiveId] = useState<SortFieldName | null>(null)
  
  // Find the active config for the overlay
  const activeConfig = activeId 
    ? sortConfigs.find(config => config.field === activeId) 
    : null

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px of movement required before activation
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

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
                  // Calculate priority based on position in the active configs
                  const activeConfigs = sortConfigs.filter(c => c.dir !== undefined)
                  const priority = activeConfigs.findIndex(c => c.field === config.field)

                  return (
                    <SortableItem
                      key={config.field}
                      id={config.field}
                      label={config.label}
                      type={config.type}
                      value={config.dir}
                      onChange={(direction) => onSortChange(config.field, direction)}
                      isDragging={activeId === config.field}
                      priority={priority !== -1 ? priority : undefined}
                    />
                  )
                })}
              </Group>
            </SortableContext>
            
            <DragOverlay adjustScale={true} zIndex={1000}>
              {activeId && activeConfig && (
                <SortItemContent
                  type={activeConfig.type}
                  label={activeConfig.label}
                  value={activeConfig.dir}
                  isDragging={true}
                  className="shadow-lg"
                  style={{ 
                    opacity: 1,
                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                    background: 'white', 
                    cursor: 'grabbing',
                    transform: 'scale(1.05)',
                  }}
                />
              )}
            </DragOverlay>
          </DndContext>
        </Flex>
      </Box>
    </Stack>
  )
}
