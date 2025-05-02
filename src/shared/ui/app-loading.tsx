import { Loader, Center, Text, Stack } from '@mantine/core';

export interface AppLoadingProps {
  /** Text to display while loading */
  text?: string;
}

export function AppLoading({ text = 'Loading...' }: AppLoadingProps) {
  return (
    <Center className="min-h-[200px] w-full">
      <Stack gap="md" align="center">
        <Loader size="md" />
        <Text size="sm" c="dimmed">{text}</Text>
      </Stack>
    </Center>
  );
} 