import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Group, Box, Badge } from '@mantine/core'
import { IconGripVertical } from '@tabler/icons-react'
import type { SortDirection, SortFieldName } from '~/shared/model'
import { SortSegmentControl } from './sort-segment-control'
import { type SortType } from '../model/sort-config'

export interface SortableItemProps {
  id: SortFieldName
  type: SortType
  label: string
  value?: SortDirection
  onChange: (value?: SortDirection) => void
  priority?: number
  isDragging?: boolean
}

export function SortableItem({ id, type, value, onChange, isDragging: propIsDragging }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: dndIsDragging } = useSortable({ id })

  const isDragging = propIsDragging || dndIsDragging

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
