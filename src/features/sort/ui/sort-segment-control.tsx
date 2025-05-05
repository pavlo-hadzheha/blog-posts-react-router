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
      <div className="flex items-center gap-1">
        {option.icon}
        <span>{option.value === SortDirection.ASC ? 'Asc' : 'Desc'}</span>
      </div>
    );
  };

  // Create options array from the configuration
  const options = [
    config.options[SortDirection.ASC],
    config.options[SortDirection.DESC]
  ];

  // Create tooltip text that includes the field and detailed sort information
  const tooltipText = `${config.label}: ${value === SortDirection.ASC ? 
    config.options[SortDirection.ASC].label : 
    value === SortDirection.DESC ? 
    config.options[SortDirection.DESC].label : 
    config.tooltip}`;

  return (
    <Tooltip label={tooltipText}>
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
        styles={{
          root: { minWidth: '100px' },
          label: { 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 8px'
          }
        }}
      />
    </Tooltip>
  );
} 