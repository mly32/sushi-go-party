import {
  Badge,
  Card,
  Divider,
  Notification,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { C, U } from '@sushi-go-party/sushi-go-game';

import { Props } from './common';
import { playerIDColor, useStyles } from './styles';

const MatchInfo = ({ G, matchID, ctx, matchData, playerID }: Props) => {
  const { classes } = useStyles();

  const ScoreView = ({ x }: { x: string }) => {
    const active = ctx.activePlayers && ctx.activePlayers[x] !== undefined;
    const scoreDiff = G.players[x].estimatedScore - G.players[x].score;

    return (
      <Notification
        disallowClose
        color={playerIDColor[x]}
        className={classes.notification}
      >
        <Text c={playerIDColor[x]} fw="bold">
          {matchData[x].name ?? x}
          {x === playerID && (
            <>
              {' '}
              <Badge
                sx={{ verticalAlign: 'middle' }}
                variant="outline"
                color={playerIDColor[x]}
              >
                You
              </Badge>
            </>
          )}
        </Text>

        <Text>
          Score: {G.players[x].score}{' '}
          <Tooltip inline position="right" withinPortal label="estimated score">
            <Text span>
              ({scoreDiff >= 0 && '+'}
              {scoreDiff >= 0 ? scoreDiff : scoreDiff})
            </Text>
          </Tooltip>
        </Text>
        <Text>Active: {active ? 'yes' : 'no'}</Text>
      </Notification>
    );
  };

  return (
    <Card p="xs" bg="none">
      <Title>Match: {matchID}</Title>
      <Text>
        Round: {Math.min(G.round.max, G.round.current)}/{G.round.max}
      </Text>
      <Text>
        Turn: {G.turn.current}/{G.turn.max}
      </Text>
      <Text>Deck Size: {G.deck.length}</Text>
      Passing: {!G.passBothWays || G.round.current % 2 === 1 ? 'Down' : 'Up'}
      <Card.Section>
        <Divider my={4} />
      </Card.Section>
      <Text>
        Phase: {ctx.gameover ? 'Game End' : U.phaseLabel(ctx.phase as C.Phase)}
      </Text>
      <Text></Text>
      <Text>
        Special Stage:{' '}
        {G.specials.length === 0
          ? 'N/A'
          : `${G.specialIndex + 1}/${G.specials.length}`}
      </Text>
      <Card.Section>
        {G.playOrder.map((x) => (
          <ScoreView key={x} x={x} />
        ))}
      </Card.Section>
    </Card>
  );
};

export default MatchInfo;
