import { Button, Code, Container, Text, Title } from '@mantine/core';
import Link from 'next/link';

import { Props } from './common';

const NotStarted = (props: Props) => {
  const { matchData, matchID, playerID } = props;
  const playerData = matchData.find((x) => x.id.toString() === playerID);

  return (
    <Container size="lg" p="md">
      <Title>Match: {matchID}</Title>
      <Text>{playerData ? `Player: ${playerData.name}` : 'Spectator'}</Text>
      <Text my="sm">
        Not all players are here. Currently joined:
        <Code>
          {JSON.stringify(
            matchData
              .map(({ name }) => name)
              .filter((name) => name !== undefined)
          )}
        </Code>
      </Text>

      <Button component={Link} href={`/pre-game/${matchID}`}>
        Pre Game Lobby
      </Button>
    </Container>
  );
};

export default NotStarted;
