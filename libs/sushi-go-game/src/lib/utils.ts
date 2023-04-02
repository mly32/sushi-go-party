import * as C from './constants';

const cleanName = (string: string) => {
  if (!string) {
    return '';
  }
  const cleaned = string.replace(/([A-Z])/g, ' $1');
  if (cleaned.charAt(0) === ' ') {
    return cleaned.slice(1);
  } else {
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
};

export const phaseLabel = (phase: C.Phase) => {
  return cleanName(phase);
};

export const locationLabel = (location: C.Location) => {
  return cleanName(location);
};

export const groupLabel = (group: C.Group) => {
  return cleanName(group);
};

export const tileLabel = (tile: C.Tile) => {
  return cleanName(tile);
};

export const cardLabel = (card: C.Card) => {
  if (!C.cardToInfo[card]) {
    return 'undefined';
  }
  return C.cardToInfo[card].label;
};

export const spoonLabel = (spoonInfo: C.SpoonInfo) => {
  return spoonInfo.kind === 'tile'
    ? tileLabel(spoonInfo.tile)
    : cardLabel(spoonInfo.card);
};

export const isDirect = (loc: C.Location) => {
  return loc === 'deck' || loc === 'desserts' || loc === 'discard';
};

export const stateLoc = (G: C.GameState, loc: C.Location, x: C.PlayerID) => {
  return (isDirect(loc) ? G[loc] : G.players[x][loc]) as C.Card[];
};

export const cardBackground = (
  G: C.GameState,
  x: C.PlayerID,
  info: C.IndexCard
) => {
  const flipInfo = G.players[x].flipped.find(
    ({ index }) => index === info.index
  );
  if (flipInfo) {
    return C.cardToInfo[flipInfo.card].bg;
  }
  return C.cardToInfo[info.card].bg;
};

export const indexedList = (
  G: C.GameState,
  loc: C.Location,
  x: C.PlayerID
): C.IndexCard[] =>
  stateLoc(G, loc, x)
    .map((card, index) => ({ index, card }))
    .sort((a, b) => cardBackground(G, x, a) - cardBackground(G, x, b));

export const initializeRecord = <K extends string, T>(
  fields: ReadonlyArray<string>,
  value: T
) => {
  return Object.fromEntries(fields.map((k) => [k, value])) as Record<K, T>;
};

export const fruitTotal = (cards: C.Card[]) => {
  const fruits = {
    w: ['Fruit_2W', 'Fruit_1W1P', 'Fruit_1W1O'] as C.Card[],
    p: ['Fruit_2P', 'Fruit_1W1P', 'Fruit_1P1O'] as C.Card[],
    o: ['Fruit_2O', 'Fruit_1P1O', 'Fruit_1W1O'] as C.Card[],
  };

  const fruitCounts = (fruitInfo: C.Card[]) => {
    return cards
      .map((card) => {
        if (card === fruitInfo[0]) {
          return 2;
        } else if (card === fruitInfo[1] || card === fruitInfo[2]) {
          return 1;
        }
        return 0;
      })
      .reduce((acc, v) => acc + v, 0);
  };

  return {
    w: fruitCounts(fruits.w),
    p: fruitCounts(fruits.p),
    o: fruitCounts(fruits.o),
  };
};
