import * as C from './constants';
import * as V from './valid';
import * as U from './utils';

const updateSpecials = (
  G: C.GameState,
  x: C.PlayerID,
  index: number,
  isBonus: boolean
) => {
  const card = G.players[x].tray[index];
  if (
    (isBonus && index < G.players[x].newCard && C.bonusCards.has(card)) ||
    (!isBonus && index >= G.players[x].newCard && C.specialCards.has(card))
  ) {
    const order = C.cardToInfo[card].order;
    const loc = G.specials.findIndex((special) => {
      return C.cardToInfo[special.card].order > order;
    });

    const special = { playerID: x, card, index, confirmed: false };

    G.specials.splice(loc === -1 ? G.specials.length : loc, 0, special);
  }
};

export const updateBonus = (G: C.GameState, x: C.PlayerID, index: number) => {
  return updateSpecials(G, x, index, true);
};

const tryCopy = (G: C.GameState, x: C.PlayerID, copyIndex: number) => {
  const last = G.players[x].tray.length - 1;
  const tile = C.cardToTile[G.players[x].tray[last]];
  if (V.validCopyIndex(G, x, copyIndex, tile, true)) {
    const specialOrder = G.players[x].tray.splice(last, 1).pop();

    if (copyIndex === C.NO_INDEX) {
      G.discard.push(specialOrder);
    } else {
      const copiedCard = G.players[x].tray[copyIndex];
      G.players[x].copied.push({
        index: G.players[x].tray.length,
        loc: 'tray',
      });
      G.players[x].tray.push(copiedCard);
    }
  }
};

export const doFlip = (G: C.GameState, x: C.PlayerID, flipList: number[]) => {
  flipList.forEach((index) => {
    const card = G.players[x].tray[index];
    if (card !== 'Flipped') {
      G.players[x].flipped.push({ index, card });
      G.players[x].tray[index] = 'Flipped';
    }
  });
};

export const moveCard = (
  G: C.GameState,
  x: C.PlayerID,
  fromLoc: C.Location,
  y: C.PlayerID,
  toLoc: C.Location,
  moveIndex: number,
  copyIndex = -1
) => {
  const from = U.stateLoc(G, fromLoc, x);
  const to = U.stateLoc(G, toLoc, y);

  if (moveIndex < 0 || moveIndex >= from.length) {
    console.log('move error', x, fromLoc, y, toLoc, moveIndex, copyIndex);
    throw new Error(`Invalid moveIndex: ${moveIndex}`);
  }
  let movedCard: C.Card = from.splice(moveIndex, 1).pop();

  if (U.isDirect(fromLoc) && x === '') {
    to.push(movedCard);
    return;
  }

  if (fromLoc === 'tray') {
    if (moveIndex < G.players[x].newCard) {
      G.players[x].newCard -= 1;
    }

    G.specials.forEach((state) => {
      if (state.playerID === x && state.index > moveIndex) {
        state.index -= 1;
      }
    });

    const flippedIndex = G.players[x].flipped.findIndex(
      ({ index }) => index === moveIndex
    );

    G.players[x].flipped.forEach((info) => {
      if (info.index > moveIndex) {
        info.index -= 1;
      }
    });

    if (flippedIndex !== -1) {
      const { card } = G.players[x].flipped.splice(flippedIndex, 1).pop();

      if (U.isDirect(toLoc)) {
        movedCard = card;
      } else {
        G.players[y].flipped.push({ index: to.length, card });
      }
    }
  }

  const copiedIndex = G.players[x].copied.findIndex(
    ({ index, loc }) => index === moveIndex && loc === fromLoc
  );

  G.players[x].copied.forEach((info) => {
    if (info.index > moveIndex && info.loc === fromLoc) {
      info.index -= 1;
    }
  });

  if (copiedIndex !== -1) {
    G.players[x].copied.splice(copiedIndex, 1);

    if (U.isDirect(toLoc)) {
      movedCard = 'SpecialOrder';
    } else {
      G.players[y].copied.push({ index: to.length, loc: toLoc });
    }
  }

  to.push(movedCard);

  if (toLoc === 'tray') {
    tryCopy(G, y, copyIndex);
    updateSpecials(G, y, G.players[x].tray.length - 1, false);
  }
};

export const moveCardIf = (
  G: C.GameState,
  x: C.PlayerID,
  fromLoc: C.Location,
  y: C.PlayerID,
  toLoc: C.Location,
  condition: (card: C.Card, index: number) => boolean
) => {
  const from = U.stateLoc(G, fromLoc, x);
  for (let index = from.length - 1; index >= 0; index -= 1) {
    if (condition(from[index], index)) {
      moveCard(G, x, fromLoc, y, toLoc, index);
    }
  }
};
