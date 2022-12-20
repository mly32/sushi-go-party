import SushiGo from '@sushi-go-party/sushi-go-game';
import { Lobby } from 'boardgame.io/react';

import SushiGoBoard from '../../Multi/Board';

const MultiLobby = () => {
  return (
    <Lobby
      gameServer={process.env.NX_SUSHI_GO_SERVER_URL}
      lobbyServer={process.env.NX_SUSHI_GO_SERVER_URL}
      gameComponents={[{ game: SushiGo, board: SushiGoBoard }]}
    />
  );
};

export default MultiLobby;
