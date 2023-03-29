import {
  DEFAULT_THEME,
  MantineNumberSize,
  MantineThemeOverride,
  Tuple,
} from '@mantine/core';

export const SITE_THEME: MantineThemeOverride = {
  colors: {
    theme: DEFAULT_THEME.colors.red,
    bright: [...DEFAULT_THEME.colors.gray].reverse() as Tuple<string, 10>,
  },
  components: {
    ScrollArea: {
      defaultProps: {
        type: 'auto',
      },
    },
    Divider: {
      defaultProps: {
        my: 'md',
      },
    },
    Title: {
      defaultProps: {
        color: 'theme',
        size: 'h3',
        mb: 'sm',
      },
    },
    Tooltip: {
      defaultProps: {
        events: { hover: true, focus: true, touch: true },
        withArrow: true,
      },
    },
  },
  focusRingStyles: {
    resetStyles: () => ({ outline: 'none' }),
    styles: (theme) => ({
      outlineOffset: 2,
      outline: `2px solid ${
        theme.colors['blue'][theme.colorScheme === 'dark' ? 7 : 5]
      }`,
    }),
    inputStyles: (theme) => ({
      outline: 'none',
      borderColor:
        theme.colors['blue'][
          typeof theme.primaryShade === 'object'
            ? theme.primaryShade[theme.colorScheme]
            : theme.primaryShade
        ],
    }),
  },
  primaryColor: 'theme',
};

export const LOGO_URL = '/assets/logo.png';
export const TITLE = 'Sushi Go Live';
export const MOBILE_BREAKPOINT: MantineNumberSize = 'sm';

export type NavItem =
  | { kind: 'single'; label: string; link: string }
  | { kind: 'many'; label: string; links: { label: string; link: string }[] };

export const NAV_ITEMS: NavItem[] = [
  {
    kind: 'single',
    label: 'Home',
    link: '/',
  },
  {
    kind: 'single',
    label: 'Create',
    link: '/create',
  },
  {
    kind: 'single',
    label: 'Settings',
    link: '/settings',
  },
  {
    kind: 'single',
    label: 'About',
    link: '/about',
  },
  {
    kind: 'many',
    label: 'Old',
    links: [
      { label: 'Local', link: '/old/local' },
      { label: 'Online', link: '/old/online' },
    ],
  },
];

export const GITHUB_LINK = 'https://github.com/mly32/sushi-go-party';
