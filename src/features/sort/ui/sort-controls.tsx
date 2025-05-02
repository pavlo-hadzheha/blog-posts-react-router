import { Group, Paper, Text } from '@mantine/core'
import { SortDirection, SortField } from '~/shared/model'
import { useMemo, useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import { SortSegmentControl } from './sort-segment-control'
import { IconGripVertical } from '@tabler/icons-react'
import { SortableItem } from './sortable-item'

export interface SortControlsProps {
  titleSort?: SortDirection
  dateSort?: SortDirection
  commentsSort?: SortDirection
  onTitleSortChange: (value?: SortDirection) => void
  onDateSortChange: (value?: SortDirection) => void
  onCommentsSortChange: (value?: SortDirection) => void
  sortOrder?: SortField[]
  onSortOrderChange?: (newOrder: SortField[]) => void
  className?: string
}

// All available sort fields
const ALL_SORT_FIELDS = [SortField.TITLE, SortField.CREATED_AT, SortField.COMMENTS_COUNT]

export function SortControls({
  titleSort,
  dateSort,
  commentsSort,
  onTitleSortChange,
  onDateSortChange,
  onCommentsSortChange,
  sortOrder = [],
  onSortOrderChange,
  className,
}: SortControlsProps) {
  // Track the current active (dragged) item
  const [activeId, setActiveId] = useState<SortField | null>(null)

  // Set up sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Get active sort fields in priority order
  const activeSortFields = useMemo(() => {
    const activeSortFields: SortField[] = []

    // Only include fields that have active sort values
    sortOrder.forEach((field) => {
      if (
        (field === SortField.TITLE && titleSort !== undefined) ||
        (field === SortField.CREATED_AT && dateSort !== undefined) ||
        (field === SortField.COMMENTS_COUNT && commentsSort !== undefined)
      ) {
        activeSortFields.push(field)
      }
    })

    return activeSortFields
  }, [sortOrder, titleSort, dateSort, commentsSort])

  // Get sorting information for each field
  const sortFieldInfo = useMemo(() => {
    return ALL_SORT_FIELDS.map((field) => {
      let value
      switch (field) {
        case SortField.TITLE:
          value = titleSort
          break
        case SortField.CREATED_AT:
          value = dateSort
          break
        case SortField.COMMENTS_COUNT:
          value = commentsSort
          break
      }

      // Calculate the priority of this field (if active)
      const priority = value !== undefined ? activeSortFields.indexOf(field) : -1

      return { id: field, value, priority }
    })
  }, [titleSort, dateSort, commentsSort, activeSortFields])

  // Sort the fields based on the sortOrder if it exists and has fields
  const sortedFieldInfo = useMemo(() => {
    if (!sortOrder || sortOrder.length === 0) return sortFieldInfo

    // Create a copy of fields
    const sorted = [...sortFieldInfo]

    // Sort based on the sortOrder
    sorted.sort((a, b) => {
      const aIndex = sortOrder.indexOf(a.id)
      const bIndex = sortOrder.indexOf(b.id)

      // If both items are in sortOrder, compare their positions
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex
      }

      // If only one item is in sortOrder, prioritize it
      if (aIndex !== -1) return -1
      if (bIndex !== -1) return 1

      // If neither is in sortOrder, maintain original order
      return 0
    })

    return sorted
  }, [sortFieldInfo, sortOrder])

  // Handle drag start event
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveId(active.id as SortField)
  }

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    // Only proceed if there's a valid drop target and it's different from the source
    if (!over || active.id === over.id) {
      return
    }

    // Use sortOrder as the source of truth for ordering, or fallback to ALL_SORT_FIELDS
    const effectiveOrder = sortOrder.length > 0 ? [...sortOrder] : [...ALL_SORT_FIELDS]

    // Find the dragged item and drop target in our order array
    const activeIndex = effectiveOrder.indexOf(active.id as SortField)
    const overIndex = effectiveOrder.indexOf(over.id as SortField)

    // Both indices should be valid
    if (activeIndex === -1 || overIndex === -1) {
      return
    }

    // Use arrayMove to correctly reorder the items
    const newOrder = arrayMove(effectiveOrder, activeIndex, overIndex)

    // Notify parent component
    onSortOrderChange?.(newOrder)
  }

  // Get handlers for each sort type
  const getSortChangeHandler = (field: SortField) => {
    switch (field) {
      case SortField.TITLE:
        return onTitleSortChange
      case SortField.CREATED_AT:
        return onDateSortChange
      case SortField.COMMENTS_COUNT:
        return onCommentsSortChange
      default:
        return () => {}
    }
  }

  // Map field to sort type
  const getTypeFromField = (field: SortField) => {
    switch (field) {
      case SortField.TITLE:
        return 'title'
      case SortField.CREATED_AT:
        return 'date'
      case SortField.COMMENTS_COUNT:
        return 'comments'
      default:
        return 'title'
    }
  }

  // Get value for each field
  const getValueForField = (field: SortField) => {
    switch (field) {
      case SortField.TITLE:
        return titleSort
      case SortField.CREATED_AT:
        return dateSort
      case SortField.COMMENTS_COUNT:
        return commentsSort
      default:
        return undefined
    }
  }

  // Find the item info for the active id
  const activeItem = activeId ? sortedFieldInfo.find((item) => item.id === activeId) : null

  return (
    <Paper p="md" withBorder radius="md" className={className}>
      <Group align="center" justify="space-between" wrap="wrap" gap="xs">
        <Text size="sm" fw={500} color="dimmed">
          Sort by:
        </Text>

        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          collisionDetection={closestCenter}
        >
          <SortableContext items={sortedFieldInfo} strategy={horizontalListSortingStrategy}>
            <Group gap="xs" wrap="wrap">
              {sortedFieldInfo.map(({ id, value, priority }) => (
                <SortableItem
                  key={id}
                  id={id}
                  type={getTypeFromField(id)}
                  value={getValueForField(id)}
                  onChange={getSortChangeHandler(id)}
                  priority={priority}
                />
              ))}
            </Group>
          </SortableContext>

          {/* Overlay for consistent dragging experience */}
          <DragOverlay adjustScale={false}>
            {activeId && activeItem && (
              <Group gap="xs" align="center">
                <div className="cursor-grab p-1">
                  <IconGripVertical size={18} />
                </div>
                <SortSegmentControl
                  type={getTypeFromField(activeId)}
                  value={getValueForField(activeId)}
                  onChange={() => {}}
                  disabled={true}
                />
              </Group>
            )}
          </DragOverlay>
        </DndContext>
      </Group>
    </Paper>
  )
}
