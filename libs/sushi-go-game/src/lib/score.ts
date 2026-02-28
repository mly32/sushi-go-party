import * as C from './constants';
import * as M from './move';
import * as U from './utils';

const playerObj = <T>(G: C.GameState, f: (x: C.PlayerID) => T) => {
  return Object.fromEntries(G.playOrder.map((x) => [x, f(x)]));
};

const freqMap = <T>(arr: T[]) => {
  return arr.reduce((acc, value) => {
    acc.set(value, (acc.get(value) || 0) + 1);
    return acc;
  }, new Map<T, number>());
};

const placementsByCount = (counts: { [k: string]: number }) => {
  const freq = freqMap(Object.values(counts));
  return Array.from(freq)
    .sort()
    .reverse()
    .map(([k, v]) => ({ counts: k, frequency: v }));
};

const tileCounts = (G: C.GameState, tile: C.Tile, dessert = false) => {
  return playerObj(G, (x) =>
    G.players[x].tray
      .concat(dessert ? G.players[x].fridge : [])
      .filter((card) => C.cardToTile[card] === tile)
      .reduce((acc, card) => acc + C.cardToInfo[card].icons, 0)
  );
};

export type Scorer = (G: C.GameState) => { [key: C.PlayerID]: number };

const emptyScorer: Scorer = (G) => playerObj(G, () => 0);

export const tileToScorer: Record<C.Tile, Scorer> = {
  Flipped: (G) => {
    const counts = tileCounts(G, 'Flipped');
    return playerObj(G, (x) => 2 * counts[x]);
  },
  Nigiri: (G) => {
    return tileCounts(G, 'Nigiri');
  },
  MakiRoll: (G) => {
    const counts = tileCounts(G, 'MakiRoll');
    const placements = placementsByCount(counts);

    const scores = [
      [6, 3, 0],
      [6, 4, 2],
    ];

    return playerObj(G, (x) => {
      scores[G.playOrder.length <= 1 ? 0 : 1].forEach((v, i) => {
        if (
          placements[i] &&
          counts[x] > 0 &&
          counts[x] === placements[i].counts
        ) {
          return v;
        }
      });
      return 0;
    });
  },
  Temaki: (G) => {
    const counts = tileCounts(G, 'Temaki');
    const placements = placementsByCount(counts);

    const most = placements[0].counts;
    const least = placements[placements.length - 1].counts;
    if (most === least) {
      return emptyScorer(G);
    }

    return playerObj(G, (x) => {
      if (counts[x] === most) {
        return 4;
      }
      return counts[x] === least && G.playOrder.length > 2 ? -4 : 0;
    });
  },
  Uramaki: (G) => {
    const counts = tileCounts(G, 'Uramaki');
    const placements = placementsByCount(counts);

    const scores = [8, 5, 2];
    const most = placements[0].counts;

    if (most === 0) {
      return emptyScorer(G);
    }

    return playerObj(G, (x) => {
      if (
        G.round.roundInfo.uramakiPlaced < scores.length &&
        counts[x] === most
      ) {
        return scores[G.round.roundInfo.uramakiPlaced];
      }
      return 0;
    });
  },
  Tempura: (G) => {
    const counts = tileCounts(G, 'Tempura');
    return playerObj(G, (x) => 5 * Math.floor(counts[x] / 2));
  },
  Sashimi: (G) => {
    const counts = tileCounts(G, 'Sashimi');
    return playerObj(G, (x) => 10 * Math.floor(counts[x] / 3));
  },
  Dumpling: (G) => {
    const counts = tileCounts(G, 'Dumpling');
    const scores = [0, 1, 3, 6, 10, 15];
    return playerObj(G, (x) => scores[Math.min(counts[x], scores.length - 1)]);
  },
  Eel: (G) => {
    const counts = tileCounts(G, 'Eel');
    const scores = [0, -3, 7];
    return playerObj(G, (x) => scores[Math.min(counts[x], scores.length - 1)]);
  },
  Tofu: (G) => {
    const counts = tileCounts(G, 'Tofu');
    const scores = [0, 2, 6, 0];
    return playerObj(G, (x) => scores[Math.min(counts[x], scores.length - 1)]);
  },
  Onigiri: (G) => {
    const scores = [1, 4, 9, 16];
    return playerObj(G, (x) => {
      const onigiris = G.players[x].tray.filter(
        (card) => C.cardToTile[card] === 'Onigiri'
      );
      const shapeCounts = Array.from(freqMap(onigiris).values()).sort();

      return shapeCounts.reduce(
        (acc, count, index) => {
          const { score, prv } = acc;
          if (count !== prv) {
            const scale = count - prv;
            const inc = shapeCounts.length - index;
            return { score: score + scale * scores[inc - 1], prv: count };
          }
          return acc;
        },
        { score: 0, prv: 0 }
      ).score;
    });
  },
  Edamame: (G) => {
    const counts = tileCounts(G, 'Edamame');
    const hasEdamame = playerObj(G, (x) =>
      G.players[x].tray.some((card) => card === 'Edamame')
    );
    return playerObj(G, (x) => {
      const others = G.playOrder.filter((y) => y !== x && hasEdamame[y]).length;
      return Math.max(4, others) * counts[x];
    });
  },
  MisoSoup: (G) => {
    const counts = tileCounts(G, 'MisoSoup');
    return playerObj(G, (x) => 3 * counts[x]);
  },
  Chopsticks: emptyScorer,
  SoySauce: (G) => {
    const diffBackgrounds = (G: C.GameState) => {
      return playerObj(G, (x) => {
        const backgrounds = G.players[x].tray.map(
          (card) => C.cardToInfo[card].bg
        );
        return new Set(backgrounds).size;
      });
    };

    const counts = tileCounts(G, 'SoySauce');
    const bgs = diffBackgrounds(G);

    const most = Math.max(0, ...Object.values(bgs));

    return playerObj(G, (x) => (counts[x] > 0 && bgs[x] === most ? 4 : 0));
  },
  Tea: (G) => {
    const maxBackgrounds = (G: C.GameState) => {
      return playerObj(G, (x) => {
        const backgrounds = G.players[x].tray.map(
          (card) => C.cardToInfo[card].bg
        );
        const freq = freqMap(backgrounds);
        return Math.max(0, ...freq.values());
      });
    };

    const counts = tileCounts(G, 'Tea');
    const bgs = maxBackgrounds(G);

    return playerObj(G, (x) => bgs[x] * counts[x]);
  },
  Menu: emptyScorer,
  Spoon: emptyScorer,
  SpecialOrder: emptyScorer,
  TakeoutBox: emptyScorer,
  Wasabi: (G) => {
    return playerObj(G, (x) => {
      let score = 0;
      let wasabi = 0;
      G.players[x].tray.forEach((card) => {
        if (card === 'Wasabi') {
          wasabi += 1;
        } else if (wasabi > 0 && C.cardToTile[card] === 'Nigiri') {
          score += 2 * C.cardToInfo[card].icons;
          wasabi -= 1;
        }
      });
      return score;
    });
  },
  Pudding: emptyScorer,
  GreenTeaIceCream: emptyScorer,
  Fruit: emptyScorer,
};

export const tileToDessertScorer: Record<C.Tile, Scorer> = (() => {
  const scorer = U.initializeRecord<C.Tile, Scorer>(C.tiles, emptyScorer);
  scorer['Pudding'] = (G) => {
    const counts = tileCounts(G, 'Pudding', true);
    const placements = placementsByCount(counts);

    const most = placements[0].counts;
    const least = placements[placements.length - 1].counts;

    if (most === least) {
      return emptyScorer(G);
    }

    return playerObj(G, (x) => {
      if (counts[x] === most) {
        return 6;
      }
      return counts[x] === least && G.playOrder.length > 2 ? -6 : 0;
    });
  };
  scorer['GreenTeaIceCream'] = (G) => {
    const counts = tileCounts(G, 'GreenTeaIceCream', true);
    return playerObj(G, (x) => 12 * Math.floor(counts[x] / 4));
  };
  scorer['Fruit'] = (G) => {
    const scores = [-2, 0, 1, 3, 6, 10];
    return playerObj(G, (x) => {
      const f = U.fruitTotal(G.players[x].tray.concat(G.players[x].fridge));
      return [f.w, f.p, f.o].reduce(
        (acc, tot) => acc + scores[Math.min(tot, 5)],
        0
      );
    });
  };
  return scorer;
})();

export const scoreUpdater = (G: C.GameState, final: boolean) => {
  G.playOrder.forEach((x) => {
    G.players[x].estimatedScore = G.players[x].score;
  });
  ['Flipped' as C.Tile, ...G.selection].forEach((tile) => {
    const scores = tileToScorer[tile](G);
    const dessertScores = tileToDessertScorer[tile](G);
    G.playOrder.forEach((x) => {
      G.players[x].estimatedScore += scores[x] + dessertScores[x];
      if (final) {
        G.players[x].score += scores[x];
        if (G.round.current === G.round.max) {
          G.players[x].score += dessertScores[x];
        }
      }
    });
  });
};

export const turnUpdater = (G: C.GameState) => {
  G.selection.forEach((tile) => {
    if (tile === 'Uramaki') {
      const counts = tileCounts(G, 'Uramaki');
      const placements = placementsByCount(counts);

      const score = [8, 5, 2];
      const isUramaki = (card: C.Card) => C.cardToTile[card] === 'Uramaki';

      placements.forEach((placement) => {
        if (
          G.round.roundInfo.uramakiPlaced < score.length &&
          placement.counts >= 10
        ) {
          const players = [];
          G.playOrder.forEach((x) => {
            if (counts[x] === placement.counts) {
              G.players[x].score += score[G.round.roundInfo.uramakiPlaced];
              M.moveCardIf(G, x, 'tray', x, 'discard', isUramaki);
              players.push(x);
            }
          });
          G.round.roundInfo.uramakiPlaced += placement.frequency;

          G.log.push({
            msg: `${U.tileLabel(
              'Uramaki'
            )} threshold reached; player(s) discarding`,
          });
        }
      });
    } else if (tile === 'MisoSoup') {
      let misoSoups = 0;
      const players = [];
      G.playOrder.forEach((x) => {
        G.players[x].tray.forEach((card, index) => {
          if (index >= G.players[x].newCard && card === 'MisoSoup') {
            misoSoups += 1;
            players.push(x);
          }
        });
      });

      if (misoSoups > 1) {
        G.playOrder.forEach((x) => {
          const isNewMisoSoup = (card: C.Card, index: number) =>
            index >= G.players[x].newCard && card === 'MisoSoup';

          M.moveCardIf(G, x, 'tray', x, 'discard', isNewMisoSoup);
        });

        G.log.push({
          msg: `${U.tileLabel(
            'MisoSoup'
          )} threshold reached; player(s) discarding`,
        });
      }
    }
  });
};

export const playerScores = (G: C.GameState): C.PlayerScore[] => {
  const dessertScores = tileToDessertScorer[G.dessert](G);

  return G.playOrder.map((x) => ({
    playerID: x,
    score: G.players[x].score,
    desserts: G.players[x].fridge.length,
    roundScores: G.players[x].roundScores,
    dessertScore: dessertScores[x],
  }));
};
