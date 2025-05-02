import { Card, Text, Title, Group, Badge, Button, Box } from '@mantine/core'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

// Initialize dayjs plugins
dayjs.extend(relativeTime)

export interface AppCardProps {
  id: string
  title: string
  description: string
  createdAt: string
  commentsCount: number
  onClick?: (id: string) => void
}

export function AppCard({ id, title, description, createdAt, commentsCount, onClick }: AppCardProps) {
  const handleClick = () => onClick?.(id)

  // Generate a consistent pastel color based on the post ID
  const getPastelColorFromId = (postId: string) => {
    // Simple hash function to get a numeric value from the ID string
    let hash = 0
    for (let i = 0; i < postId.length; i++) {
      hash = postId.charCodeAt(i) + ((hash << 5) - hash)
    }

    // Use the hash to get a hue value between 0-360
    const hue = Math.abs(hash % 360)
    return `hsla(${hue}, 70%, 80%, 0.2)`
  }

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      className="h-full flex flex-col hover:shadow-md transition-shadow duration-200"
    >
      <Box
        className="h-20 -mx-4 -mt-4 mb-4"
        style={{
          backgroundColor: getPastelColorFromId(id),
          borderTopLeftRadius: 'var(--mantine-radius-md)',
          borderTopRightRadius: 'var(--mantine-radius-md)',
        }}
      />

      <div className="flex-grow">
        <Title order={3} lineClamp={2} className="mb-2">
          {title}
        </Title>
        <Text lineClamp={3} size="sm" color="dimmed" className="mb-4">
          {description}
        </Text>
      </div>

      <Group justify="space-between" className="mt-auto">
        <Text size="xs" color="dimmed">
          {dayjs(createdAt).fromNow()}
        </Text>
        <Badge variant="light" color="blue">
          {commentsCount} {commentsCount === 1 ? 'comment' : 'comments'}
        </Badge>
      </Group>

      <Button variant="light" color="blue" fullWidth mt="md" radius="md" onClick={handleClick}>
        Read more
      </Button>
    </Card>
  )
}
