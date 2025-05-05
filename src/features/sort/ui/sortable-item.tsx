import React, { forwardRef } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Group, Box } from '@mantine/core'
import { IconGripVertical } from '@tabler/icons-react'
import type { SortDirection, SortFieldName } from '~/shared/model'
import { SortSegmentControl } from './sort-segment-control'
import { type SortType } from '../model/sort-config'
import { cn } from '~/shared/utils'

// The presentational component that will be used both in SortableItem and DragOverlay
export const SortItemContent = forwardRef<
  HTMLDivElement,
  {
    type: SortType;
    label: string;
    value?: SortDirection;
    onChange?: (value?: SortDirection) => void;
    isDragging?: boolean;
    disabled?: boolean;
    attributes?: any;
    listeners?: any;
    style?: React.CSSProperties;
    className?: string;
  }
>(({ type, value, onChange, isDragging, disabled, attributes, listeners, style, className }, ref) => {
  return (
    <Box 
      ref={ref} 
      style={style} 
      className={`
        flex items-center gap-2 p-2 rounded-md
        ${value ? 'bg-blue-100' : ''}
        ${isDragging ? 'shadow-md' : ''}
        ${className || ''}
      `}
    >
      <Group align="center" className="flex items-center">
        <div {...attributes} {...listeners} className="cursor-grab flex items-center h-full">
          <IconGripVertical size={18} className={isDragging ? 'text-blue-600' : ''} />
        </div>
        <SortSegmentControl 
          type={type} 
          value={value} 
          onChange={onChange || (() => {})} 
          disabled={disabled || isDragging} 
        />
      </Group>
    </Box>
  )
});

SortItemContent.displayName = 'SortItemContent';

export interface SortableItemProps {
  id: SortFieldName
  type: SortType
  label: string
  value?: SortDirection
  onChange: (value?: SortDirection) => void
  priority?: number
  isDragging?: boolean
}

export function SortableItem({ id, type, label, value, onChange, isDragging: propIsDragging }: SortableItemProps) {
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition, 
    isDragging: dndIsDragging,
  } = useSortable({ 
    id,
    transition: {
      duration: 200,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
    }
  })

  const isDragging = propIsDragging || dndIsDragging

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 999 : 'auto',
  }

  return (
    <SortItemContent
      ref={setNodeRef}
      style={style}
      type={type}
      label={label}
      value={value}
      onChange={onChange}
      isDragging={isDragging}
      attributes={attributes}
      listeners={listeners}
    />
  )
}
