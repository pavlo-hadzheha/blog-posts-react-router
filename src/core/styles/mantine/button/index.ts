import { Button, type MantineThemeComponent } from '@mantine/core'

import classes from './button.module.css'

export const customButton: MantineThemeComponent = Button.extend({
  classNames: {
    label: classes.label,
    section: classes.section,
  },
})
