import type {
  Game as BGGame,
  PlayerID,
  PhaseConfig as BGPhaseConfig,
  StageConfig as BGStageConfig,
  FnContext,
} from 'boardgame.io';
import { ActivePlayers, INVALID_MOVE, Stage } from 'boardgame.io/core';
import * as C from './constants';
import * as U from './utils';
import * as M from './move';
import * as S from './score';
import * as V from './valid';

type PluginAPIs = Record<string, never>;
export type Game = BGGame<C.GameState, PluginAPIs, C.SetupData>;
type PhaseConfig = Omit<BGPhaseConfig<C.GameState, PluginAPIs>, 'next'> & {
  next?:
    | ((context: FnContext<C.GameState, PluginAPIs>) => C.Phase | void)
    | C.Phase;
};
type StageConfig = BGStageConfig<C.GameState, PluginAPIs>;

const moveMsg = (
  G: C.GameState,
  x: PlayerID,
  { handIndex, copyIndex, bonusIndex }: C.PlayInfo,
  isMenu = false
) => {
  const hand = isMenu ? G.players[x].menuHand : G.players[x].hand;
  let msg = `plays ${U.cardLabel(hand[handIndex])}`;
  if (C.cardToTile[hand[handIndex]] === 'SpecialOrder') {
    msg += ` (copies ${
      copyIndex !== C.NO_INDEX
        ? U.cardLabel(G.players[x].tray[copyIndex])
        : 'nothing'
    })`;
  }
  if (bonusIndex !== C.NO_INDEX) {
    msg += ` and uses ${U.cardLabel(G.players[x].tray[bonusIndex])}`;
  }
  return msg;
};

const specialMsg = (G: C.GameState, x: PlayerID, info: C.SpecialInfo) => {
  const { handIndex, copyIndex, menuHandIndex, spoonInfo } = info;
  const special = G.specials[G.specialIndex];
  const specialcardLabel = U.cardLabel(special.card);
  let msg = '';
  if (C.cardToTile[special.card] === 'Chopsticks') {
    if (handIndex !== C.NO_INDEX) {
      msg += moveMsg(G, x, { handIndex, copyIndex, bonusIndex: C.NO_INDEX });
    } else {
      msg += 'selects nothing';
    }
    msg += `; moves ${specialcardLabel} to hand`;
  } else if (C.cardToTile[special.card] === 'Menu') {
    const menuInfo = {
      handIndex: menuHandIndex,
      copyIndex,
      bonusIndex: C.NO_INDEX,
    };
    msg += moveMsg(G, x, menuInfo, true) + `; discards ${specialcardLabel}`;
  } else if (C.cardToTile[special.card] === 'Spoon') {
    msg += `asks for ${U.spoonLabel(spoonInfo)}`;
    const tile =
      spoonInfo.kind === 'tile' ? spoonInfo.tile : C.cardToTile[spoonInfo.card];
    if (tile === 'SpecialOrder') {
      msg += ` (to copy ${
        copyIndex !== C.NO_INDEX
          ? U.cardLabel(G.players[x].tray[copyIndex])
          : 'nothing'
      })`;
    }
  } else if (C.cardToTile[special.card] === 'TakeoutBox') {
    msg += 'flips ';
    if (info.flipList.length === 0) {
      msg += 'nothing';
    } else {
      msg += info.flipList
        .map((index) => U.cardLabel(G.players[x].tray[index]))
        .join(', ');
    }
    msg += `; discards ${specialcardLabel}`;
  }
  return msg;
};

const playerView: Game['playerView'] = ({ G, playerID }) => {
  const strippedState = structuredClone(G);
  strippedState.playOrder.forEach((x) => {
    if (x !== playerID) {
      strippedState.players[x].playInfo = C.emptyPlayInfo;
      strippedState.players[x].hand = [];
      strippedState.players[x].menuHand = [];
    }
  });
  strippedState.deck = Array(G.deck.length).fill('Flipped');
  strippedState.desserts = [];

  return strippedState;
};

const debugSelection: readonly C.Tile[] = [
  'Nigiri',
  'Uramaki',
  'MisoSoup',
  'Wasabi',
  'SpecialOrder',
  'Chopsticks',
  'Spoon',
  'Menu',
  'TakeoutBox',
  'GreenTeaIceCream',
];

const validateSetupData: Game['validateSetupData'] = (
  setupData,
  numPlayers
) => {
  if (!setupData || process.env.NX_DEBUG === 'true') {
    return;
  }
  if (numPlayers !== setupData.numPlayers || !V.validSetup(setupData)) {
    return 'Setup data is not valid.';
  }
};

const setup: Game['setup'] = (
  { ctx },
  setupData = { selection: 'Custom', numPlayers: ctx.numPlayers }
) => {
  const selection =
    process.env.NX_DEBUG === 'true'
      ? debugSelection
      : C.selectionToSelectionInfo[setupData.selection].selection;

  const players = Object.fromEntries(
    ctx.playOrder.map((x): [C.PlayerID, C.PlayerState] => [
      x,
      C.emptyPlayerState,
    ])
  );

  const dessert = C.dessertFromSelection(selection);

  const deck: C.Card[] = selection
    .filter((tile) => tile !== dessert)
    .map((tile) =>
      Array.from(C.tileToCards[tile]).map((card) =>
        Array(C.cardToInfo[card].copies).fill(card)
      )
    )
    .flat()
    .flat();

  const desserts: C.Card[] = Array.from(C.tileToCards[dessert])
    .map((card) => Array(C.cardToInfo[card].copies).fill(card))
    .flat();

  const maxTurns =
    process.env.NX_DEBUG === 'true' ? 4 : C.cardAmounts[ctx.numPlayers];

  const G: C.GameState = {
    selectionName: setupData.selection,
    selection,
    playOrder: ctx.playOrder,
    players,
    specials: [],
    specialIndex: 0,
    deck,
    desserts,
    discard: [],
    round: { max: 3, current: 0, roundInfo: C.emptyRoundInfo },
    turn: { max: maxTurns, current: 0, turnInfo: C.emptyTurnInfo },
    log: [],
  };
  return G;
};

const endIf: Game['endIf'] = ({ G }) => {
  if (G.round.current > G.round.max) {
    const finalScore = G.playOrder.map((x) => S.playerScore(G, x));
    finalScore.sort((a, b) =>
      b.score === a.score ? b.desserts - a.desserts : b.score - a.score
    );
    return finalScore;
  }
};

const setupPhase: PhaseConfig = {
  start: true,
  next: 'playPhase',
  endIf: () => true,
  onEnd: ({ G, random }) => {
    G.round.roundInfo = C.emptyRoundInfo;
    G.round.current += 1;
    G.turn.current = 0;

    if (G.round.current > G.round.max) {
      G.log.push({ msg: 'end of game' });
      return;
    }

    const dessertAmount = C.dessertAmounts(G.playOrder.length)[G.round.current];
    for (let i = 0; i < dessertAmount; i += 1) {
      M.moveCard(G, '', 'desserts', '', 'deck', G.desserts.length - 1);
    }

    G.deck = random.Shuffle(G.deck);
    G.playOrder.forEach((x) => {
      for (let i = 0; i < G.turn.max; i += 1) {
        M.moveCard(G, x, 'deck', x, 'hand', G.deck.length - 1);
      }
    });

    S.scoreUpdater(G, false);
    G.log.push({ msg: `round ${G.round.current} start` });
  },
};

const playPhase: PhaseConfig = {
  next: ({ G }) => (G.specials.length === 0 ? 'rotatePhase' : 'actionPhase'),
  endIf: ({ G }) => G.playOrder.every((x) => G.players[x].confirmed),
  onBegin: ({ G }) => {
    G.turn.current += 1;
    G.specialIndex = C.NO_INDEX;
    G.specials = [];
    G.log.push({ msg: `turn ${G.turn.current} start` });
  },
  onEnd: ({ G }) => {
    G.playOrder.forEach((x) => {
      const { handIndex, copyIndex, bonusIndex } = G.players[x].playInfo;

      G.log.push({
        playerID: x,
        msg: moveMsg(G, x, G.players[x].playInfo),
      });

      M.moveCard(G, x, 'hand', x, 'tray', handIndex, copyIndex);
      M.updateBonus(G, x, bonusIndex);
    });

    G.playOrder.forEach((x) => {
      G.players[x].playInfo = C.emptyPlayInfo;
      G.players[x].confirmed = false;
    });

    S.scoreUpdater(G, false);
  },
  moves: {
    playMove: {
      client: true,
      redact: true,
      move: ({ G, playerID: x }, info: C.PlayInfo) => {
        if (!V.validPlayMove(G, x, info)) {
          return INVALID_MOVE;
        }
        G.players[x].playInfo = info;
        G.players[x].confirmed = true;
      },
    },
  },
  turn: { activePlayers: ActivePlayers.ALL_ONCE },
};

const spoonStage: StageConfig = {
  moves: {
    spoonMove: {
      client: false,
      redact: true,
      move: ({ G, playerID: y }, handIndex: number) => {
        if (!V.validSpoonResponseMove(G, y, handIndex)) {
          return INVALID_MOVE;
        }

        const special = G.specials[G.specialIndex];
        const x = special.playerID;

        const card = G.players[y].hand[handIndex];
        G.log.push({
          playerID: y,
          msg:
            `completes spoon request and gives ${U.cardLabel(card)}` +
            `; moves ${U.cardLabel(special.card)} to hand`,
        });

        const copyIndex = G.turn.turnInfo.copyIndex;
        M.moveCard(G, y, 'hand', x, 'tray', handIndex, copyIndex);
        M.moveCard(G, x, 'tray', y, 'hand', special.index);

        special.confirmed = true;
      },
    },
  },
};

const actionPhase: PhaseConfig = {
  next: 'rotatePhase',
  endIf: ({ G }) => G.specials.every((special) => special.confirmed),
  onBegin: ({ G, events }) => {
    if (G.specialIndex + 1 < G.specials.length) {
      events.endTurn({ next: G.specials[G.specialIndex + 1].playerID });

      G.log.push({ msg: `special start` });
    }
  },
  moves: {
    specialMove: {
      client: false,
      redact: true,
      move: ({ G, events, playerID: x, random }, info: C.SpecialInfo) => {
        if (!V.validSpecialMove(G, x, info)) {
          return INVALID_MOVE;
        }
        const special = G.specials[G.specialIndex];
        let goToSpoonStage = false;

        G.log.push({ playerID: x, msg: specialMsg(G, x, info) });

        const { handIndex, copyIndex, menuHandIndex, flipList, spoonInfo } =
          info;

        if (C.cardToTile[special.card] === 'Chopsticks') {
          M.moveCard(G, x, 'hand', x, 'tray', handIndex, copyIndex);

          M.moveCard(G, x, 'tray', x, 'hand', special.index);
        } else if (C.cardToTile[special.card] === 'Menu') {
          M.moveCard(G, x, 'menuHand', x, 'tray', menuHandIndex, copyIndex);
          M.moveCardIf(G, x, 'menuHand', x, 'deck', () => true);
          G.deck = random.Shuffle(G.deck);

          M.moveCard(G, x, 'tray', x, 'discard', special.index);
        } else if (C.cardToTile[special.card] === 'Spoon') {
          const index = G.playOrder.findIndex((y) => y === x);

          const n = G.playOrder.length;
          const d = G.round.current % 2 === 1 ? 1 : n - 1;

          for (let i = (index + d) % n; i !== index; i = (i + d) % n) {
            const y = G.playOrder[i];
            const hasSpoonItem = G.players[y].hand.some((card) => {
              if (spoonInfo.kind === 'tile') {
                return C.cardToTile[card] === spoonInfo.tile;
              }
              return card === spoonInfo.card;
            });

            if (hasSpoonItem) {
              G.turn.turnInfo = { playerID: x, spoonInfo, copyIndex };
              events.setActivePlayers({
                value: { [y]: 'spoonStage' },
                minMoves: 1,
                maxMoves: 1,
              });

              goToSpoonStage = true;
              break;
            }
          }

          if (!goToSpoonStage) {
            G.log.push({
              playerID: x,
              msg: `spoon request not met; discards ${U.cardLabel(
                special.card
              )}`,
            });
            M.moveCard(G, x, 'tray', x, 'discard', special.index);
          }
        } else if (C.cardToTile[special.card] === 'TakeoutBox') {
          M.doFlip(G, x, flipList);

          M.moveCard(G, x, 'tray', x, 'discard', special.index);
        }

        if (!goToSpoonStage) {
          special.confirmed = true;
        }
      },
    },
  },
  turn: {
    endIf: ({ G }) => {
      if (G.specials[G.specialIndex].confirmed) {
        return { next: G.specials[G.specialIndex + 1].playerID };
      }
      return false;
    },
    onBegin: ({ G, events }) => {
      G.specialIndex += 1;
      const special = G.specials[G.specialIndex];
      events.setActivePlayers({
        value: {
          [special.playerID]: Stage.NULL,
        },
        minMoves: 1,
        maxMoves: 1,
      });
      if (C.cardToTile[special.card] === 'Menu') {
        const x = special.playerID;
        for (let i = Math.min(G.deck.length - 1, 3); i >= 0; i -= 1) {
          M.moveCard(G, x, 'deck', x, 'menuHand', G.deck.length - 1);
        }
      }
    },
    onEnd: ({ G }) => {
      G.turn.turnInfo = C.emptyTurnInfo;
      S.scoreUpdater(G, false);
    },
    stages: { spoonStage },
  },
};

const rotatePhase: PhaseConfig = {
  next: ({ G }) => (G.turn.current === G.turn.max ? 'scorePhase' : 'playPhase'),
  endIf: () => true,
  onEnd: ({ G }) => {
    S.turnUpdater(G);

    const hands = G.playOrder.map((x) => [...G.players[x].hand]);

    const n = G.playOrder.length;
    const d = G.round.current % 2 === 0 ? 1 : n - 1;

    G.playOrder.forEach((x, i) => {
      G.players[x].hand = hands[(i + d) % n];
      G.players[x].newCard = G.players[x].tray.length;
    });

    G.playOrder.forEach((x) => (G.players[x].confirmed = false));

    G.log.push({ msg: 'rotating hands' });
  },
};

const scorePhase: PhaseConfig = {
  next: 'setupPhase',
  endIf: ({ G }) => G.playOrder.every((x) => G.players[x].confirmed),
  onBegin: ({ G }) => {
    S.scoreUpdater(G, true);
    G.log.push({ msg: `round ${G.round.current} scoring` });
  },
  onEnd: ({ G }) => {
    M.moveCardIf(G, '', 'discard', '', 'deck', () => true);

    const dessert = C.dessertFromSelection(G.selection);
    const isDessert = (card: C.Card) => C.cardToTile[card] === dessert;

    G.playOrder.forEach((x) => {
      M.moveCardIf(G, x, 'tray', x, 'fridge', isDessert);
      M.moveCardIf(G, x, 'tray', x, 'deck', () => true);
      G.players[x].confirmed = false;
    });
  },
  moves: {
    scoreMove: {
      client: true,
      move: ({ G, playerID: x }) => {
        G.players[x].confirmed = true;
      },
    },
  },
  turn: { activePlayers: ActivePlayers.ALL_ONCE },
};

export const SushiGo: Game = {
  name: 'sushi-go',
  minPlayers: 2,
  maxPlayers: 8,

  playerView,
  validateSetupData,
  setup,
  endIf,
  phases: {
    setupPhase,
    playPhase,
    actionPhase,
    rotatePhase,
    scorePhase,
  } as Record<C.Phase, PhaseConfig>,
};
