import * as C from './constants';

const cleanName = (string: string) => {
  if (string === '') {
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

export const initializeRecord = <K extends string, T>(
  fields: ReadonlyArray<string>,
  value: T
) => {
  return Object.fromEntries(fields.map((k) => [k, value])) as Record<K, T>;
};
