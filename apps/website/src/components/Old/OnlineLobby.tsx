import SushiGo from '@sushi-go-party/sushi-go-game';
import { Lobby } from 'boardgame.io/react';

import { CONFIG } from '../../config';
import SushiGoBoard from './GameView/Board';

const MultiLobby = () => {
  return (
    <Lobby
      gameServer={CONFIG.serverUrl}
      lobbyServer={CONFIG.serverUrl}
      gameComponents={[{ game: SushiGo, board: SushiGoBoard }]}
    />
  );
};

export default MultiLobby;
