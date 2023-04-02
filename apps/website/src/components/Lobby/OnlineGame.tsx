import { Container, Text, Title } from '@mantine/core';
import { skipToken } from '@reduxjs/toolkit/query/react';
import SushiGo from '@sushi-go-party/sushi-go-game';
import { SocketIO } from 'boardgame.io/multiplayer';
import { Client } from 'boardgame.io/react';
import { useMemo } from 'react';

import { CONFIG } from '../../config';
import { useAppSelector } from '../../store';
import { useGetMatchQuery } from '../../store/lobby';
import SushiGoBoard from '../Board';
import Loading from '../UI/Loading';

export interface OnlineGameProps {
  matchID: string;
}

const OnlineGame = ({ matchID }: OnlineGameProps) => {
  const roomData = useAppSelector((s) => s.user.roomData);

  const {
    data: matchMetadata,
    isLoading,
    error,
  } = useGetMatchQuery(matchID ?? skipToken);

  const SushiGoClient = useMemo(() => {
    if (isLoading || error || !matchMetadata) {
      return undefined;
    }
    return Client({
      game: SushiGo,
      board: SushiGoBoard,
      loading: Loading,
      multiplayer: SocketIO({ server: CONFIG.serverUrl }),
      debug: {
        collapseOnLoad: true,
      },
    });
  }, [isLoading, error, matchMetadata]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    const errMsg =
      'status' in error ? JSON.stringify(error.data) : error.message;
    return (
      <Container size="lg">
        <Title>Match ID: {matchID}</Title>
        <Text>An error has occurred: {errMsg}</Text>
      </Container>
    );
  }

  const spectate = !roomData || roomData.matchID !== matchID;

  if (spectate) {
    return <SushiGoClient matchID={matchID} />;
  }

  return (
    <SushiGoClient
      matchID={matchID}
      playerID={roomData.playerID}
      credentials={roomData.credentials}
    />
  );
};

export default OnlineGame;
