import * as C from './constants';
import * as U from './utils';

export const validHandIndex = (
  G: C.GameState,
  x: C.PlayerID,
  handIndex: number
) => {
  return handIndex >= 0 && handIndex < G.players[x].hand.length;
};

export const validCopyIndex = (
  G: C.GameState,
  x: C.PlayerID,
  copyIndex: number,
  tile: C.Tile,
  strict: boolean
) => {
  if (tile !== 'SpecialOrder') {
    return !strict;
  }
  if (G.players[x].newCard === 0) {
    return copyIndex === C.NO_INDEX;
  }
  return copyIndex >= 0 && copyIndex < G.players[x].newCard;
};

export const validBonusIndex = (
  G: C.GameState,
  x: C.PlayerID,
  bonusIndex: number
) => {
  return (
    bonusIndex === C.NO_INDEX ||
    (G.turn.current < G.turn.max &&
      C.bonusCards.has(G.players[x].tray[bonusIndex]))
  );
};

export const validPlayMove = (
  G: C.GameState,
  x: C.PlayerID,
  info: C.PlayInfo
) => {
  if (!validHandIndex(G, x, info.handIndex)) {
    return false;
  }
  const tile = C.cardToTile[G.players[x].hand[info.handIndex]];
  return (
    validCopyIndex(G, x, info.copyIndex, tile, false) &&
    validBonusIndex(G, x, info.bonusIndex)
  );
};

export const validChopsticksMove = (
  G: C.GameState,
  x: C.PlayerID,
  handIndex: number,
  copyIndex: number
) => {
  if (G.players[x].hand.length === 0) {
    return handIndex === C.NO_INDEX;
  }
  if (!validHandIndex(G, x, handIndex)) {
    return false;
  }
  const tile = C.cardToTile[G.players[x].hand[handIndex]];

  return validCopyIndex(G, x, copyIndex, tile, false);
};

export const validMenuMove = (
  G: C.GameState,
  x: C.PlayerID,
  menuHandIndex: number,
  copyIndex: number
) => {
  if (!(menuHandIndex >= 0 && menuHandIndex < G.players[x].menuHand.length)) {
    return false;
  }
  const tile = C.cardToTile[G.players[x].menuHand[menuHandIndex]];
  return tile !== 'Menu' && validCopyIndex(G, x, copyIndex, tile, false);
};

export const validSpoonMove = (
  G: C.GameState,
  x: C.PlayerID,
  spoonInfo: C.SpoonInfo,
  copyIndex: number
) => {
  if (spoonInfo.kind === 'tile') {
    return (
      spoonInfo.tile !== 'Flipped' &&
      validCopyIndex(G, x, copyIndex, spoonInfo.tile, false)
    );
  } else {
    const tile = C.cardToTile[spoonInfo.card];
    return (
      spoonInfo.card !== 'Flipped' &&
      validCopyIndex(G, x, copyIndex, tile, false)
    );
  }
};

export const validFlip = (G: C.GameState, x: C.PlayerID, index: number) => {
  return (
    index >= 0 &&
    index < G.players[x].newCard &&
    G.players[x].tray[index] !== 'Flipped'
  );
};

export const validTakeoutBoxMove = (
  G: C.GameState,
  x: C.PlayerID,
  flipList: number[]
) => {
  return flipList.every((index) => validFlip(G, x, index));
};

export const validSpecialMove = (
  G: C.GameState,
  x: C.PlayerID,
  info: C.SpecialInfo
) => {
  if (info.playerID !== x) {
    return false;
  }
  const special = G.specials[G.specialIndex];
  if (C.cardToTile[special.card] === 'Chopsticks') {
    return validChopsticksMove(G, x, info.handIndex, info.copyIndex);
  } else if (C.cardToTile[special.card] === 'Menu') {
    return validMenuMove(G, x, info.menuHandIndex, info.copyIndex);
  } else if (C.cardToTile[special.card] === 'Spoon') {
    return validSpoonMove(G, x, info.spoonInfo, info.copyIndex);
  } else if (C.cardToTile[special.card] === 'TakeoutBox') {
    return validTakeoutBoxMove(G, x, info.flipList);
  }

  return false;
};

export const validSpoonResponseMove = (
  G: C.GameState,
  y: C.PlayerID,
  handIndex: number
) => {
  const special = G.specials[G.specialIndex];
  const x = special.playerID;
  const xTile = C.cardToTile[special.card];

  if (!(x !== y && xTile === 'Spoon' && validHandIndex(G, y, handIndex))) {
    return false;
  }
  if (G.turn.turnInfo.spoonInfo.kind === 'tile') {
    const tile = C.cardToTile[G.players[y].hand[handIndex]];
    return tile === G.turn.turnInfo.spoonInfo.tile;
  } else {
    return G.players[y].hand[handIndex] === G.turn.turnInfo.spoonInfo.card;
  }
};

export const validGroupCounts: Record<C.Group, number> = {
  Flipped: 0,
  Nigiri: 1,
  SushiRolls: 1,
  Appetizers: 3,
  Specials: 2,
  Desserts: 1,
};

export const validTile = (tile: C.Tile, numPlayers: number) => {
  if (numPlayers === 2) {
    return !(tile === 'Spoon' || tile === 'Edamame');
  }
  if (numPlayers === 7 || numPlayers === 8) {
    return !(tile === 'Menu' || tile === 'SpecialOrder');
  }
  return true;
};

const validSelection = (numPlayers: number, selection: readonly C.Tile[]) => {
  if (selection.some((tile) => !validTile(tile, numPlayers))) {
    return false;
  }

  const groupCounts = U.initializeRecord<C.Group, number>(C.groups, 0);
  selection.forEach((tile) => {
    groupCounts[C.tileToGroup[tile]] += 1;
  });

  return (
    C.groups.every((group) => groupCounts[group] === validGroupCounts[group]) &&
    selection.length === new Set(selection).size
  );
};

export const validSetup = (setupData: C.SetupData) => {
  if (setupData.selectionName === 'Custom') {
    return validSelection(setupData.numPlayers, setupData.customSelection);
  }
  const selection =
    C.selectionToSelectionInfo[setupData.selectionName].selection;
  return validSelection(setupData.numPlayers, selection);
};
