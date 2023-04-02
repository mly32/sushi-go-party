import {
  ActionIcon,
  ActionIconProps,
  useMantineColorScheme,
} from '@mantine/core';
import { IconMoonStars, IconSun } from '@tabler/icons';

import Icon from './Icon';

const ColorSchemeToggle = (props: ActionIconProps) => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <ActionIcon
      onClick={() => toggleColorScheme()}
      variant="default"
      size="lg"
      {...props}
    >
      <Icon icon={colorScheme === 'dark' ? IconSun : IconMoonStars} size="md" />
    </ActionIcon>
  );
};

export default ColorSchemeToggle;
