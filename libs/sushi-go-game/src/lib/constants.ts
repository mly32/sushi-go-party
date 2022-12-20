export type PlayerID = string;

const _locations = [
  'hand',
  'menuHand',
  'tray',
  'fridge',
  'discard',
  'deck',
  'desserts',
] as const;

export type Location = typeof _locations[number];

export const locations: readonly Location[] = _locations;

const _groups = [
  'Flipped',
  'Nigiri',
  'SushiRolls',
  'Appetizers',
  'Specials',
  'Desserts',
] as const;

export type Group = typeof _groups[number];

export const groups: readonly Group[] = _groups;

const _tiles = [
  'Flipped',
  'Nigiri',
  'MakiRoll',
  'Temaki',
  'Uramaki',
  'Tempura',
  'Sashimi',
  'Dumpling',
  'Eel',
  'Tofu',
  'Onigiri',
  'Edamame',
  'MisoSoup',
  'Chopsticks',
  'SoySauce',
  'Tea',
  'Menu',
  'Spoon',
  'SpecialOrder',
  'TakeoutBox',
  'Wasabi',
  'Pudding',
  'GreenTeaIceCream',
  'Fruit',
] as const;

export type Tile = typeof _tiles[number];

export const tiles: readonly Tile[] = _tiles;

const _cards = [
  'Flipped',
  'Nigiri_Egg',
  'Nigiri_Salmon',
  'Nigiri_Squid',
  'MakiRoll_1',
  'MakiRoll_2',
  'MakiRoll_3',
  'Temaki',
  'Uramaki_3',
  'Uramaki_4',
  'Uramaki_5',
  'Tempura',
  'Sashimi',
  'Dumpling',
  'Eel',
  'Tofu',
  'Onigiri_Circle',
  'Onigiri_Rectangle',
  'Onigiri_Square',
  'Onigiri_Triangle',
  'Edamame',
  'MisoSoup',
  'Chopsticks_1',
  'Chopsticks_2',
  'Chopsticks_3',
  'SoySauce',
  'Tea',
  'Menu_7',
  'Menu_8',
  'Menu_9',
  'Spoon_4',
  'Spoon_5',
  'Spoon_6',
  'SpecialOrder',
  'TakeoutBox_10',
  'TakeoutBox_11',
  'TakeoutBox_12',
  'Wasabi',
  'Pudding',
  'GreenTeaIceCream',
  'Fruit_2W',
  'Fruit_2P',
  'Fruit_2O',
  'Fruit_1W1P',
  'Fruit_1P1O',
  'Fruit_1W1O',
] as const;

export type Card = typeof _cards[number];

export const cards: readonly Card[] = _cards;

const _selections = [
  'My First Meal',
  'Sushi Go!',
  'Party Sampler',
  'Master Menu',
  'Points Platter',
  'Cutthroat Combo',
  'Big Banquet',
  'Dinner for Two',
  'Custom',
] as const;

export type Selection = typeof _selections[number];

export const selections: readonly Selection[] = _selections;

const invertMapToSet = <K extends string, T extends string>(
  mp: Record<K, Set<T>>
): Record<T, K> =>
  Object.fromEntries(
    Object.entries(mp)
      .map(([k, set]) => Array.from(set as Set<T>).map((v) => [v, k]))
      .flat()
  );

export const groupToTiles: Record<Group, Set<Tile>> = {
  Flipped: new Set(['Flipped']),
  Nigiri: new Set(['Nigiri']),
  SushiRolls: new Set(['MakiRoll', 'Temaki', 'Uramaki']),
  Appetizers: new Set([
    'Tempura',
    'Sashimi',
    'Dumpling',
    'Eel',
    'Tofu',
    'Onigiri',
    'Edamame',
    'MisoSoup',
  ]),
  Specials: new Set([
    'Chopsticks',
    'SoySauce',
    'Tea',
    'Menu',
    'Spoon',
    'SpecialOrder',
    'TakeoutBox',
    'Wasabi',
  ]),
  Desserts: new Set(['Pudding', 'GreenTeaIceCream', 'Fruit']),
};

export const tileToGroup: Record<Tile, Group> = invertMapToSet(groupToTiles);

export const tileToCards: Record<Tile, Set<Card>> = {
  Flipped: new Set(['Flipped']),
  Nigiri: new Set(['Nigiri_Egg', 'Nigiri_Salmon', 'Nigiri_Squid']),
  MakiRoll: new Set(['MakiRoll_1', 'MakiRoll_2', 'MakiRoll_3']),
  Temaki: new Set(['Temaki']),
  Uramaki: new Set(['Uramaki_3', 'Uramaki_4', 'Uramaki_5']),
  Tempura: new Set(['Tempura']),
  Sashimi: new Set(['Sashimi']),
  Dumpling: new Set(['Dumpling']),
  Eel: new Set(['Eel']),
  Tofu: new Set(['Tofu']),
  Onigiri: new Set([
    'Onigiri_Circle',
    'Onigiri_Rectangle',
    'Onigiri_Square',
    'Onigiri_Triangle',
  ]),
  Edamame: new Set(['Edamame']),
  MisoSoup: new Set(['MisoSoup']),
  Chopsticks: new Set(['Chopsticks_1', 'Chopsticks_2', 'Chopsticks_3']),
  SoySauce: new Set(['SoySauce']),
  Tea: new Set(['Tea']),
  Menu: new Set(['Menu_7', 'Menu_8', 'Menu_9']),
  Spoon: new Set(['Spoon_4', 'Spoon_5', 'Spoon_6']),
  SpecialOrder: new Set(['SpecialOrder']),
  TakeoutBox: new Set(['TakeoutBox_10', 'TakeoutBox_11', 'TakeoutBox_12']),
  Wasabi: new Set(['Wasabi']),
  Pudding: new Set(['Pudding']),
  GreenTeaIceCream: new Set(['GreenTeaIceCream']),
  Fruit: new Set([
    'Fruit_2W',
    'Fruit_2P',
    'Fruit_2O',
    'Fruit_1W1P',
    'Fruit_1P1O',
    'Fruit_1W1O',
  ]),
};

export const cardToTile: Record<Card, Tile> = invertMapToSet(tileToCards);

export const dessertFromSelection = (selection: readonly Tile[]) => {
  return selection.find((tile) => tileToGroup[tile] === 'Desserts');
};

export const cardAmounts: readonly number[] = [0, 0, 10, 10, 9, 9, 8, 8, 7];

export const dessertAmounts = (numPlayers: number) => {
  return numPlayers <= 5 ? [0, 5, 3, 2] : [0, 7, 5, 3];
};

export const bonusCards: Set<Card> = new Set([
  ...tileToCards['Chopsticks'],
  ...tileToCards['Spoon'],
]);

export const specialCards: Set<Card> = new Set([
  ...tileToCards['Menu'],
  ...tileToCards['TakeoutBox'],
]);

export const NO_INDEX = -1;

export interface PlayInfo {
  handIndex: number;
  copyIndex: number;
  bonusIndex: number;
}

export const emptyPlayInfo: PlayInfo = {
  handIndex: NO_INDEX,
  copyIndex: NO_INDEX,
  bonusIndex: NO_INDEX,
};

export type SpoonInfo =
  | { kind: 'tile'; tile: Tile }
  | { kind: 'card'; card: Card };

export const emptySpoonInfo: SpoonInfo = { kind: 'tile', tile: 'Flipped' };

export interface SpecialInfo {
  playerID: PlayerID;
  handIndex: number;
  copyIndex: number;
  menuHandIndex: number;
  flipList: number[];
  spoonInfo: SpoonInfo;
}

export const emptySpecialInfo: SpecialInfo = {
  playerID: '',
  handIndex: NO_INDEX,
  copyIndex: NO_INDEX,
  menuHandIndex: NO_INDEX,
  flipList: [],
  spoonInfo: emptySpoonInfo,
};

export interface RoundInfo {
  uramakiPlaced: number;
}

export const emptyRoundInfo: RoundInfo = {
  uramakiPlaced: 0,
};

export interface TurnInfo {
  playerID: PlayerID;
  spoonInfo: SpoonInfo;
  copyIndex: number;
}

export const emptyTurnInfo: TurnInfo = {
  playerID: '',
  spoonInfo: emptySpoonInfo,
  copyIndex: NO_INDEX,
};

export interface IndexCard {
  index: number;
  card: Card;
}

export interface PlayerState {
  confirmed: boolean;
  score: number;
  estimatedScore: number;
  playInfo: PlayInfo;
  hand: Card[];
  menuHand: Card[];
  tray: Card[];
  newCard: number;
  copied: { index: number; loc: Location }[];
  flipped: IndexCard[];
  fridge: Card[];
}

export const emptyPlayerState: PlayerState = {
  confirmed: false,
  score: 0,
  estimatedScore: 0,
  playInfo: emptyPlayInfo,
  hand: [],
  menuHand: [],
  tray: [],
  newCard: 0,
  copied: [],
  flipped: [],
  fridge: [],
};

export interface SpecialPlayerState {
  playerID: PlayerID;
  card: Card;
  index: number;
  confirmed: boolean;
}

export interface Log {
  playerID?: PlayerID;
  msg: string;
}

export interface GameState {
  selectionName: string;
  selection: readonly Tile[];
  playOrder: readonly PlayerID[];
  players: { [key: PlayerID]: PlayerState };
  specials: SpecialPlayerState[];
  specialIndex: number;
  deck: Card[];
  desserts: Card[];
  discard: Card[];
  round: { max: number; current: number; roundInfo: RoundInfo };
  turn: { max: number; current: number; turnInfo: TurnInfo };
  log: Log[];
}

export type Phase =
  | 'setupPhase'
  | 'playPhase'
  | 'actionPhase'
  | 'rotatePhase'
  | 'scorePhase';

export interface SetupData {
  selection: Selection;
  numPlayers: number;
}

export interface PlayerScore {
  playerID: PlayerID;
  score: number;
  desserts: number;
}

export interface CardInfo {
  label: string;
  bg: number;
  copies: number;
  icons: number;
  order: number;
}

const cardInfo = (
  label: string,
  bg: number,
  copies: number,
  { icons = 1, order = 0 } = {}
) => ({ label, bg, copies, icons, order } as CardInfo);

export const cardToInfo: Record<Card, CardInfo> = {
  Flipped: cardInfo('Flipped', -1, 0),
  Nigiri_Egg: cardInfo('Egg Nigiri', 0, 4, { icons: 1 }),
  Nigiri_Salmon: cardInfo('Salmon Nigiri', 0, 5, { icons: 2 }),
  Nigiri_Squid: cardInfo('Squid Nigiri', 0, 3, { icons: 3 }),
  MakiRoll_1: cardInfo('1 Maki Roll', 1, 4, { icons: 1 }),
  MakiRoll_2: cardInfo('2 Maki Rolls', 1, 5, { icons: 2 }),
  MakiRoll_3: cardInfo('3 Maki Rolls', 1, 3, { icons: 3 }),
  Temaki: cardInfo('Temaki', 2, 12),
  Uramaki_3: cardInfo('3 Uramaki', 3, 3, { icons: 3 }),
  Uramaki_4: cardInfo('4 Uramaki', 3, 5, { icons: 4 }),
  Uramaki_5: cardInfo('5 Uramaki', 3, 4, { icons: 5 }),
  Tempura: cardInfo('Tempura', 4, 8),
  Sashimi: cardInfo('Sashimi', 5, 8),
  Dumpling: cardInfo('Dumpling', 6, 8),
  Eel: cardInfo('Eel', 7, 8),
  Tofu: cardInfo('Tofu', 8, 8),
  Onigiri_Circle: cardInfo('Circle Onigiri', 9, 2),
  Onigiri_Rectangle: cardInfo('Rectangle Onigiri', 9, 2),
  Onigiri_Square: cardInfo('Square Onigiri', 9, 2),
  Onigiri_Triangle: cardInfo('Triangle Onigiri', 9, 2),
  Edamame: cardInfo('Edamame', 10, 8),
  MisoSoup: cardInfo('Miso Soup', 11, 8),
  Chopsticks_1: cardInfo('Chopsticks (1)', 12, 1, { order: 1 }),
  Chopsticks_2: cardInfo('Chopsticks (2)', 12, 1, { order: 2 }),
  Chopsticks_3: cardInfo('Chopsticks (3)', 12, 1, { order: 3 }),
  SoySauce: cardInfo('Soy Sauce', 13, 3),
  Tea: cardInfo('Tea', 14, 3),
  Menu_7: cardInfo('Menu (7)', 15, 1, { order: 7 }),
  Menu_8: cardInfo('Menu (8)', 15, 1, { order: 8 }),
  Menu_9: cardInfo('Menu (9)', 15, 1, { order: 9 }),
  Spoon_4: cardInfo('Spoon (4)', 16, 1, { order: 4 }),
  Spoon_5: cardInfo('Spoon (5)', 16, 1, { order: 5 }),
  Spoon_6: cardInfo('Spoon (6)', 16, 1, { order: 6 }),
  SpecialOrder: cardInfo('Special Order', 17, 3),
  TakeoutBox_10: cardInfo('Take-out Box (10)', 18, 1, { order: 10 }),
  TakeoutBox_11: cardInfo('Take-out Box (11)', 18, 1, { order: 11 }),
  TakeoutBox_12: cardInfo('Take-out Box (12)', 18, 1, { order: 12 }),
  Wasabi: cardInfo('Wasabi', 0, 3),
  Pudding: cardInfo('Pudding', 19, 15),
  GreenTeaIceCream: cardInfo('Green Tea Ice Cream', 20, 15),
  Fruit_2W: cardInfo('2 Watermelons (Fruit)', 21, 2),
  Fruit_2P: cardInfo('2 Pineapples (Fruit)', 21, 2),
  Fruit_2O: cardInfo('2 Oranges (Fruit)', 21, 2),
  Fruit_1W1P: cardInfo('Watermelon and Pineapple (Fruit)', 21, 3),
  Fruit_1P1O: cardInfo('Pineapple and Orange (Fruit)', 21, 3),
  Fruit_1W1O: cardInfo('Watermelon and Orange (Fruit)', 21, 3),
};

export const selectionToSelectionInfo: Record<
  Selection,
  {
    description: string;
    selection: readonly Tile[];
  }
> = {
  'My First Meal': {
    description: 'A mellow menu that goes down easy for first time players.',
    selection: [
      'Nigiri',
      'MakiRoll',
      'Tempura',
      'Sashimi',
      'MisoSoup',
      'Wasabi',
      'Tea',
      'GreenTeaIceCream',
    ],
  },
  'Sushi Go!': {
    description: 'The classic menu from the original game.',
    selection: [
      'Nigiri',
      'MakiRoll',
      'Tempura',
      'Sashimi',
      'Dumpling',
      'Chopsticks',
      'Wasabi',
      'Pudding',
    ],
  },
  'Party Sampler': {
    description: "Taste what's new in Sushi Go Party!",
    selection: [
      'Nigiri',
      'Temaki',
      'Tempura',
      'Dumpling',
      'Tofu',
      'Wasabi',
      'Menu',
      'GreenTeaIceCream',
    ],
  },
  'Master Menu': {
    description: 'For seasoned Sushi Go! players who want to think!',
    selection: [
      'Nigiri',
      'Temaki',
      'Onigiri',
      'Tofu',
      'Sashimi',
      'Spoon',
      'TakeoutBox',
      'Fruit',
    ],
  },
  'Points Platter': {
    description: 'Score big points!',
    selection: [
      'Nigiri',
      'Uramaki',
      'Onigiri',
      'Dumpling',
      'Edamame',
      'SpecialOrder',
      'Tea',
      'GreenTeaIceCream',
    ],
  },
  'Cutthroat Combo': {
    description: 'Interactive and in your face!',
    selection: [
      'Nigiri',
      'Temaki',
      'Eel',
      'Tofu',
      'MisoSoup',
      'Spoon',
      'SoySauce',
      'Pudding',
    ],
  },
  'Big Banquet': {
    description: 'Works well with 6-8 players',
    selection: [
      'Nigiri',
      'MakiRoll',
      'Tempura',
      'Dumpling',
      'Eel',
      'Spoon',
      'Chopsticks',
      'GreenTeaIceCream',
    ],
  },
  'Dinner for Two': {
    description: 'Works well with 2 players.',
    selection: [
      'Nigiri',
      'Uramaki',
      'Onigiri',
      'Tofu',
      'MisoSoup',
      'Menu',
      'SpecialOrder',
      'Fruit',
    ],
  },
  Custom: {
    description: 'Create your own menu.',
    selection: [],
  },
};

export const tilePosition: Record<Tile, (n: number) => [number, number]> = {
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

export const cardPosition: Record<Card, [number, number]> = {
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
