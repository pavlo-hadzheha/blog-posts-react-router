import { Alert, Button, Group } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

export interface AppErrorProps {
  /** Error message to display */
  message: string;
  /** Optional action to retry/reload */
  onRetry?: () => void;
}

export function AppError({ message, onRetry }: AppErrorProps) {
  return (
    <Alert
      icon={<IconAlertCircle size={16} />}
      title="An error occurred"
      color="red"
      radius="md"
      className="my-4"
    >
      {message}
      
      {onRetry && (
        <Group justify="flex-end" mt="md">
          <Button 
            variant="light" 
            color="red" 
            onClick={onRetry} 
            size="sm"
          >
            Try again
          </Button>
        </Group>
      )}
    </Alert>
  );
} 