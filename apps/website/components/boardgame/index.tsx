import { Game, C } from '@sushi-go-party/sushi-go-game';
import { Local } from 'boardgame.io/multiplayer';
import { Client } from 'boardgame.io/react';
import { useEffect, useState } from 'react';

import { SushiGoBoard } from './Board';
import styles from './styles.module.css';

const SushiGoPage = () => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) {
    return <div></div>;
  }

  const setupData: C.SetupData = {
    selection: 'Master Menu',
    numPlayers: 2,
  };

  const GameWithSetup = {
    ...Game.SushiGo,
    setup: (ctx) => Game.SushiGo.setup(ctx, setupData),
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
      <div className={styles['row-container']}>
        <SushiGoClient />
      </div>
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

export default SushiGoPage;
