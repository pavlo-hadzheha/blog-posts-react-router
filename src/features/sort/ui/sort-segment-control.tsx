import { SegmentedControl, Tooltip } from '@mantine/core';
import { SortDirection } from '~/shared/model';
import { SORT_CONFIG } from '../model/sort-config';
import type { SortConfigOption, SortType } from '../model/sort-config';

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

  // Get configuration for this sort type from SORT_CONFIG
  const config = SORT_CONFIG.find(c => c.type === type);
  if (!config) {
    throw new Error(`Sort type ${type} not found in configuration`);
  }
  
  const renderLabel = (option: SortConfigOption) => {
    return (
      <div className="flex items-center gap-2">
        {option.icon}
        <span>{option.label}</span>
      </div>
    );
  };

  // Create options array from the configuration
  const options = [
    config.options[SortDirection.ASC],
    config.options[SortDirection.DESC]
  ];

  return (
    <Tooltip label={config.tooltip}>
      <SegmentedControl
        value={value}
        onChange={handleChange}
        data={options.map(option => ({
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