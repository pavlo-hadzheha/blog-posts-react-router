import { MantineProvider } from '@mantine/core'

import { customButton } from '../styles/mantine/button'
import { theme } from '../styles/mantine'
import { useState } from 'react'

export const MantineConfigProvider = ({ children }: TChildrenProps) => {
  const [themeWithComponents] = useState(() => ({
    ...theme,
    components: {
      Button: customButton,
    },
  }))

  return (
    <MantineProvider theme={themeWithComponents} defaultColorScheme="light">
      {children}
    </MantineProvider>
  )
}
