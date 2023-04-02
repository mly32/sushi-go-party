import SushiGo, { C } from '@sushi-go-party/sushi-go-game';
import { Local } from 'boardgame.io/multiplayer';
import { Client } from 'boardgame.io/react';
import { useEffect, useState } from 'react';

import { SushiGoBoard } from './SimpleBoard';
import styles from './styles.module.css';

export interface GameViewProps {
  setupData: C.SetupData;
}

const GameView = ({ setupData }: GameViewProps) => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) {
    return <div></div>;
  }

  const GameWithSetup: C.Game = {
    ...SushiGo,
    setup: (ctx) => SushiGo.setup(ctx, setupData),
  };

  const SushiGoClient = Client({
    game: GameWithSetup,
    board: SushiGoBoard,
    numPlayers: setupData.numPlayers,
    multiplayer: Local(),
    debug: {
      collapseOnLoad: true,
    },
  });

  return (
    <div className={styles['container']}>
      <SushiGoClient />
      <div className={styles['row-container']}>
        {[...Array(setupData.numPlayers).keys()].map((x) => (
          <div key={x} style={{ minWidth: '300px', border: '1px solid red' }}>
            <SushiGoClient playerID={`${x}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameView;
