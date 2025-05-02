import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Group, Box } from '@mantine/core'
import { IconGripVertical } from '@tabler/icons-react'
import { SortDirection, SortField } from '~/shared/model'
import { SortSegmentControl } from './sort-segment-control'
import { type SortType } from '../model/sort-config'

export interface SortableItemProps {
  id: SortField
  type: SortType
  value?: SortDirection
  onChange: (value?: SortDirection) => void
  priority?: number
}

export function SortableItem({ id, type, value, onChange, priority }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Box ref={setNodeRef} style={style} className={`flex items-center gap-2 w-auto p-2 rounded-md`}>
      <Group gap="xs" align="center">
        <div {...attributes} {...listeners} className="cursor-grab p-1">
          <IconGripVertical size={18} />
        </div>
        <SortSegmentControl type={type} value={value} onChange={onChange} disabled={isDragging} />
      </Group>
    </Box>
  )
}
