import { C, U, V } from '@sushi-go-party/sushi-go-game';
import { BoardProps } from 'boardgame.io/react';
import { useState } from 'react';

import BoardLayout from '../../Board/BoardLayout';
import Card, { ListAction } from './Card';
import RawCardList, { CardListProps } from './CardList';
import ItemForm from './ItemForm';
import Selection from './Selection';
import styles from './styles.module.css';

type SushiGoBoardProps = BoardProps<C.GameState>;

const arrayRotate = <T,>(arr: T[], n: number) => {
  n = ((n % arr.length) + arr.length) % arr.length;
  return arr.slice(n, arr.length).concat(arr.slice(0, n));
};

const CardList = (props: CardListProps) => {
  return <RawCardList {...{ ...props, condensed: false }} />;
};

const Logs = ({ G }: SushiGoBoardProps) => (
  <div>
    <div>logs</div>
    <div
      className={[
        styles['col-container'],
        styles['reversed-col-container'],
      ].join(' ')}
    >
      {G.log
        .slice()
        .reverse()
        .map(({ playerID, msg }, index) => (
          <div key={index} style={{ border: '1px solid black' }}>
            <span style={{ color: 'blue' }}>{playerID || 'Game'}</span>: {msg}
          </div>
        ))}
    </div>
  </div>
);

const PlayPhase = ({ G, ctx, moves, playerID: x }: SushiGoBoardProps) => {
  const [playInfo, setPlayInfo] = useState(C.emptyPlayInfo);
  const active = ctx.activePlayers && ctx.activePlayers[x] !== undefined;

  const confirm = () => {
    if (!V.validPlayMove(G, x, playInfo)) {
      alert('invalid move');
    } else {
      moves.playMove(playInfo);
    }
  };

  const updatePlayInfo = (key: string) => {
    return (index: number) => {
      const value = playInfo[key] === index ? C.emptyPlayInfo[key] : index;
      setPlayInfo({ ...playInfo, [key]: value });
    };
  };

  const handAction: ListAction = {
    label: 'play',
    enabled: (i) => active && V.validHandIndex(G, x, i),
    action: updatePlayInfo('handIndex'),
    selected: (i) => playInfo.handIndex === i,
  };

  const selectedHandAction: ListAction = {
    label: 'selected',
    enabled: (i) => G.players[x].confirmed && i === playInfo.handIndex,
    action: () => {},
    selected: () => true,
  };

  const bonusAction: ListAction = {
    label: 'play',
    enabled: (i) => active && V.validBonusIndex(G, x, i),
    action: updatePlayInfo('bonusIndex'),
    selected: (i) => playInfo.bonusIndex === i,
  };

  const selectedBonusAction: ListAction = {
    label: 'selected',
    enabled: (i) => G.players[x].confirmed && i === playInfo.bonusIndex,
    action: () => {},
    selected: () => true,
  };

  const copyAction: ListAction = {
    label: 'copy',
    enabled: (i) => {
      if (!V.validHandIndex(G, x, playInfo.handIndex)) {
        return false;
      }
      const tile = C.cardToTile[G.players[x].hand[playInfo.handIndex]];
      return active && V.validCopyIndex(G, x, i, tile, true);
    },
    action: updatePlayInfo('copyIndex'),
    selected: (i) => playInfo.copyIndex === i,
  };

  return (
    <div>
      {active && <button onClick={confirm}>confirm</button>}
      <CardList
        G={G}
        loc="hand"
        x={x}
        actions={[handAction, selectedHandAction]}
      />
      <CardList
        G={G}
        loc="tray"
        x={x}
        actions={[copyAction, bonusAction, selectedBonusAction]}
        last={{
          add: G.players[x].confirmed,
          card: G.players[x].hand[G.players[x].playInfo.handIndex],
        }}
      />
    </div>
  );
};

const SpoonStage = ({ G, moves, playerID: x }: SushiGoBoardProps) => {
  const [handIndex, setHandIndex] = useState(C.NO_INDEX);

  const updateSpoon = (index: number) => {
    setHandIndex(handIndex === index ? C.NO_INDEX : index);
  };

  const spoonAction: ListAction = {
    label: 'play',
    enabled: () => true,
    action: updateSpoon,
    selected: (i) => handIndex === i,
  };

  const confirm = () => {
    if (!V.validSpoonResponseMove(G, x, handIndex)) {
      alert('invalid move');
    } else {
      moves.spoonMove(handIndex);
    }
  };

  return (
    <div>
      <button onClick={confirm}>confirm</button>
      <CardList G={G} loc="hand" x={x} actions={[spoonAction]} />
      <CardList G={G} loc="tray" x={x} />
    </div>
  );
};

const ActionPhase = ({ G, ctx, moves, playerID: x }: SushiGoBoardProps) => {
  const [specialInfo, setSpecialInfo] = useState({
    ...C.emptySpecialInfo,
    playerID: x,
  });
  const active = ctx.activePlayers && ctx.activePlayers[x] !== undefined;
  const specialTile = C.cardToTile[G.specials[G.specialIndex].card];

  const confirm = () => {
    if (!V.validSpecialMove(G, x, specialInfo)) {
      alert('invalid move');
    } else {
      moves.specialMove(specialInfo);
    }
  };

  const updateSpecialInfo = (key: string) => {
    return (index: number) => {
      const value =
        specialInfo[key] === index ? C.emptySpecialInfo[key] : index;
      setSpecialInfo({ ...specialInfo, [key]: value });
    };
  };

  const updateFlipList = (index: number) => {
    const filteredFlip = specialInfo.flipList.filter((i) => i !== index);
    if (filteredFlip.length === specialInfo.flipList.length) {
      setSpecialInfo({
        ...specialInfo,
        flipList: [...specialInfo.flipList, index],
      });
    } else {
      setSpecialInfo({ ...specialInfo, flipList: filteredFlip });
    }
  };

  const setSpoonInfo = (spoonInfo: C.SpoonInfo) => {
    setSpecialInfo({ ...specialInfo, spoonInfo: spoonInfo });
  };

  const activeSpecialAction: ListAction = {
    label: 'active',
    enabled: (i) => active && i === G.specials[G.specialIndex].index,
    action: () => {},
    selected: () => true,
  };

  const menuAction: ListAction = {
    label: 'play',
    enabled: () => active,
    action: updateSpecialInfo('menuHandIndex'),
    selected: (i) => specialInfo.menuHandIndex === i,
  };

  const handAction: ListAction = {
    label: 'play',
    enabled: () => active,
    action: updateSpecialInfo('handIndex'),
    selected: (i) => specialInfo.handIndex === i,
  };

  const takeoutAction: ListAction = {
    label: 'flip',
    enabled: (i) => active && V.validTakeoutBoxMove(G, x, [i]),
    action: updateFlipList,
    selected: (i) => specialInfo.flipList.find((v) => v === i) !== undefined,
  };

  const copyAction: ListAction = {
    label: 'copy',
    enabled: (i) => {
      let selectedTile: C.Tile = 'Flipped';
      if (
        specialTile === 'Chopsticks' &&
        V.validHandIndex(G, x, specialInfo.handIndex)
      ) {
        selectedTile = C.cardToTile[G.players[x].hand[specialInfo.handIndex]];
      } else if (
        specialTile === 'Menu' &&
        specialInfo.menuHandIndex !== C.NO_INDEX
      ) {
        selectedTile =
          C.cardToTile[G.players[x].menuHand[specialInfo.menuHandIndex]];
      } else if (specialTile === 'Spoon') {
        if (specialInfo.spoonInfo.kind === 'tile') {
          selectedTile = specialInfo.spoonInfo.tile;
        } else {
          selectedTile = C.cardToTile[specialInfo.spoonInfo.card];
        }
      }
      return active && V.validCopyIndex(G, x, i, selectedTile, true);
    },
    action: updateSpecialInfo('copyIndex'),
    selected: (i) => specialInfo.copyIndex === i,
  };

  const flipNumber = G.players[x].tray.filter((_, index) =>
    V.validFlip(G, x, index)
  ).length;

  return (
    <div>
      <div>{specialTile} action</div>
      {active && <button onClick={confirm}>confirm</button>}
      {active && specialTile === 'TakeoutBox' && (
        <div>
          flipping {specialInfo.flipList.length}/{flipNumber}
        </div>
      )}
      {active && specialTile === 'Menu' && (
        <CardList G={G} loc="menuHand" x={x} actions={[menuAction]} />
      )}
      {active && specialTile === 'Spoon' && (
        <ItemForm G={G} item={specialInfo.spoonInfo} setItem={setSpoonInfo} />
      )}
      <CardList
        G={G}
        loc="hand"
        x={x}
        actions={specialTile === 'Chopsticks' ? [handAction] : []}
      />

      <CardList
        G={G}
        loc="tray"
        x={x}
        actions={[
          activeSpecialAction,
          copyAction,
          ...(specialTile === 'TakeoutBox' ? [takeoutAction] : []),
        ]}
      />
    </div>
  );
};

const ScorePhase = ({ ctx, G, moves, playerID: x }: SushiGoBoardProps) => {
  const active = ctx.activePlayers && ctx.activePlayers[x] !== undefined;

  const confirm = () => {
    moves.scoreMove();
  };

  return (
    <div>
      {active ? (
        <button onClick={confirm}>confirm</button>
      ) : (
        <div>confirmed</div>
      )}

      <CardList G={G} loc="tray" x={x} />
    </div>
  );
};

interface ViewProps {
  board: SushiGoBoardProps;
  playerID: C.PlayerID;
}

const PlayerView = ({ board, playerID: x }: ViewProps) => {
  const { G, ctx, playerID } = board;
  const SimpleView = () => (
    <div>
      <CardList
        G={G}
        loc="tray"
        x={x}
        last={{
          add: ctx.phase === 'playPhase' && G.players[x].confirmed,
          card: 'Flipped',
        }}
      />
    </div>
  );

  const PlayerInfo = () => {
    switch (ctx.phase as C.Phase) {
      case 'playPhase':
        return <PlayPhase {...board} />;
      case 'actionPhase':
        if (ctx.activePlayers && ctx.activePlayers[x] === 'spoonStage') {
          return <SpoonStage {...board} />;
        }
        if (x === G.specials[G.specialIndex].playerID) {
          return <ActionPhase {...board} />;
        }
        return <SimpleView />;
      case 'scorePhase':
        return <ScorePhase {...board} />;
      default:
        return <SimpleView />;
    }
  };

  return (
    <div>
      {x === playerID ? <PlayerInfo /> : <SimpleView />}

      <CardList G={G} loc="fridge" x={x} />
    </div>
  );
};

const ScoreView = ({ board, playerID: x }: ViewProps) => {
  const { G, ctx, matchData } = board;
  const active = ctx.activePlayers && ctx.activePlayers[x] !== undefined;
  const scoreDiff = G.players[x].estimatedScore - G.players[x].score;

  return (
    <div key={x} style={{ border: '1px solid blue' }}>
      <div>Player: {matchData[x].name ?? x}</div>
      <div>
        {matchData[x].isConnected === false ? 'NOT CONNECTED' : 'CONNECTED'}
      </div>
      <div>score: {G.players[x].score}</div>
      <div>
        estimated: {scoreDiff >= 0 && '+'}
        {scoreDiff >= 0 ? scoreDiff : scoreDiff}
      </div>
      <div>active: {active ? 'yes' : 'no'}</div>
    </div>
  );
};

const SushiGoBoard = (props: SushiGoBoardProps) => {
  const { G, ctx, playerID, matchID, matchData } = props;

  if (playerID === null) {
    return <div>spectator</div>;
  }

  if (ctx.gameover !== undefined) {
    const order: C.PlayerScore[] = ctx.gameover;
    return (
      <div className={styles['row-container']}>
        <div>
          <div>{matchData[order[0].playerID].name} wins !!!</div>
          <ol>
            {order.map(({ playerID: x, score, desserts }) => (
              <li key={x}>
                Player {matchData[x].name}: {score} points ({desserts} desserts)
              </li>
            ))}
          </ol>
        </div>
        <Logs {...props} />
      </div>
    );
  }

  const localPlayerOrder = playerID
    ? arrayRotate(
        [...G.playOrder],
        G.playOrder.findIndex((x) => x === playerID)
      )
    : [...G.playOrder];

  const matchInfo = (
    <div>
      <div>match: {matchID}</div>
      <div>selection: {G.selectionName}</div>
      <div>
        round: {G.round.current}/{G.round.max}
      </div>
      <div>phase: {U.phaseLabel(ctx.phase as C.Phase)}</div>
      <div>
        turn: {G.turn.current}/{G.turn.max}
      </div>
      <div>
        special stage: {G.specialIndex + 1}/{G.specials.length}
      </div>
      <div>deck size: {G.deck.length}</div>

      {G.turn.turnInfo.playerID !== '' && (
        <div>
          Player {G.turn.turnInfo.playerID} requests:{' '}
          {U.spoonLabel(G.turn.turnInfo.spoonInfo)}
        </div>
      )}

      <div className={styles['col-container']}>
        {G.playOrder.map((x) => (
          <ScoreView key={x} board={props} playerID={x} />
        ))}
      </div>
    </div>
  );

  return (
    <BoardLayout
      allLeft
      matchInfo={matchInfo}
      chat={<div>chat</div>}
      log={<Logs {...props} />}
    >
      <div>
        <div>
          <div>Menu selection: {G.selectionName}</div>
          <Selection numPlayers={G.playOrder.length} list={G.selection} />
        </div>

        <div className={styles['row-container']}>
          <div>
            <div>Deck</div>
            {G.deck.length === 0 ? (
              <div>Empty</div>
            ) : (
              <div style={{ border: '1px solid black', position: 'relative' }}>
                <Card card={'Flipped'} index={0} actions={[]} />
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: 30,
                    WebkitTextStroke: '1px black',
                    fontWeight: 'bolder',
                    color: 'whitesmoke',
                  }}
                >
                  x{G.deck.length}
                </div>
              </div>
            )}
          </div>

          <CardList G={G} loc="discard" />
        </div>

        {localPlayerOrder.map((x) => (
          <PlayerView key={x} board={props} playerID={x} />
        ))}
      </div>
    </BoardLayout>
  );
};

export default SushiGoBoard;
