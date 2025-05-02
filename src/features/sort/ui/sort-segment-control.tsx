import { SegmentedControl, Tooltip } from '@mantine/core';
import { SortDirection } from '~/shared/model';
import { getSortConfig } from '../model/sort-config';
import type { SortOption, SortType } from '../model/sort-config';

export interface SortSegmentControlProps {
  type: SortType;
  value?: SortDirection;
  onChange: (value?: SortDirection) => void;
  className?: string;
  disabled?: boolean;
}

export function SortSegmentControl({ type, value, onChange, className, disabled }: SortSegmentControlProps) {
  const handleChange = (newValue: string) => {
    onChange(newValue as SortDirection);
  };

  // Get configuration for this sort type
  const config = getSortConfig(type);
  
  const renderLabel = (option: SortOption) => {
    return (
      <div className="flex items-center gap-2">
        {option.icon}
        {option.secondIcon}
        <span>{option.label}</span>
      </div>
    );
  };

  return (
    <Tooltip label={config.tooltip}>
      <SegmentedControl
        value={value}
        onChange={handleChange}
        data={config.options.map(option => ({
          value: option.value,
          label: renderLabel(option),
        }))}
        className={className}
        size="sm"
        disabled={disabled}
      />
    </Tooltip>
  );
} 