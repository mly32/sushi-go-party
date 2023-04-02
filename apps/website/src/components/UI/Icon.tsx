import { MantineSizes } from '@mantine/core';
import { MantineNumberSize, useMantineTheme } from '@mantine/core';
import { TablerIcon, TablerIconProps } from '@tabler/icons';

const iconSizes: MantineSizes = {
  xs: 12,
  sm: 14,
  md: 18,
  lg: 26,
  xl: 34,
};

export interface IconProps extends Omit<TablerIconProps, 'size'> {
  size?: MantineNumberSize;
  icon: TablerIcon;
}

const Icon = ({ icon: Icon, size = 24, ...props }: IconProps) => {
  const theme = useMantineTheme();
  const iconSize = theme.fn.size({ size, sizes: iconSizes });
  return <Icon size={iconSize} {...props} />;
};

export default Icon;
