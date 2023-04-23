import {
  DEFAULT_THEME,
  MantineNumberSize,
  MantineThemeOverride,
  Tuple,
} from '@mantine/core';
import { C } from '@sushi-go-party/sushi-go-game';

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
];

export const GITHUB_LINK = 'https://github.com/mly32/sushi-go-party';

export const TILE_POSITION: Record<C.Tile, (n: number) => [number, number]> = {
  Wasabi: () => [0, 0],
  Chopsticks: () => [0, 1],
  Spoon: () => [0, 2],
  TakeoutBox: () => [0, 3],
  SoySauce: () => [0, 4],
  Tea: () => [1, 0],
  Menu: () => [1, 1],
  SpecialOrder: () => [1, 2],
  Tempura: () => [1, 3],
  Sashimi: () => [1, 4],
  Dumpling: () => [2, 0],
  Eel: () => [2, 1],
  Tofu: () => [2, 2],
  Onigiri: () => [2, 3],
  Edamame: () => [2, 4],
  MisoSoup: () => [3, 0],
  Pudding: () => [3, 1],
  GreenTeaIceCream: () => [3, 2],
  Fruit: () => [3, 3],
  MakiRoll: (n) => (n <= 5 ? [3, 4] : [4, 4]),
  Uramaki: () => [4, 0],
  Temaki: () => [4, 1],
  Nigiri: () => [4, 2],
  Flipped: () => [4, 3],
};

export const CARD_POSITION: Record<C.Card, [number, number]> = {
  Flipped: [1, 3],
  Nigiri_Egg: [1, 4],
  Nigiri_Salmon: [1, 5],
  Nigiri_Squid: [1, 6],
  Wasabi: [1, 7],
  Sashimi: [1, 8],
  Tempura: [1, 9],
  Dumpling: [2, 0],
  MakiRoll_1: [2, 1],
  MakiRoll_2: [2, 2],
  MakiRoll_3: [2, 3],
  Chopsticks_1: [2, 4],
  Pudding: [2, 5],
  MisoSoup: [2, 6],
  Tea: [2, 7],
  GreenTeaIceCream: [2, 8],
  Temaki: [2, 9],
  Tofu: [3, 0],
  Menu_7: [3, 1],
  Onigiri_Circle: [3, 2],
  Onigiri_Rectangle: [3, 3],
  Onigiri_Square: [3, 4],
  Onigiri_Triangle: [3, 5],
  Spoon_4: [3, 6],
  TakeoutBox_10: [3, 7],
  Eel: [3, 8],
  SoySauce: [3, 9],
  Edamame: [4, 0],
  SpecialOrder: [4, 1],
  Fruit_2W: [4, 2],
  Fruit_2P: [4, 3],
  Fruit_2O: [4, 4],
  Fruit_1W1P: [4, 5],
  Fruit_1P1O: [4, 6],
  Fruit_1W1O: [4, 7],
  Uramaki_5: [4, 8],
  Uramaki_4: [4, 9],
  Uramaki_3: [5, 0],
  Menu_8: [5, 1],
  Menu_9: [5, 2],
  Spoon_5: [5, 3],
  Spoon_6: [5, 4],
  Chopsticks_2: [5, 5],
  Chopsticks_3: [5, 6],
  TakeoutBox_11: [5, 7],
  TakeoutBox_12: [5, 8],
};
