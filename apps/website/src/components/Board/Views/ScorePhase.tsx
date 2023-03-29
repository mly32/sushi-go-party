import { Button, Group, List, Text, Title, Tooltip } from '@mantine/core';

import PhaseView from '../PhaseView';
import { Props } from '../common';
import { playerIDColor } from '../styles';

const ScorePhase = (props: Props) => {
  const { G, ctx, moves, playerID: x, matchData } = props;
  const active = ctx.activePlayers && ctx.activePlayers[x] !== undefined;
  const handleConfirm = () => {
    moves.scoreMove();
  };

  const scores = [...G.playOrder]
    .sort((a, b) => G.players[b].score - G.players[a].score)
    .map((y) => {
      const scoreDiff = G.players[y].estimatedScore - G.players[y].score;
      return (
        <List.Item key={y}>
          <Text span c={playerIDColor[y]} fw="bold">
            {matchData[y].name ?? y}
          </Text>
          : {G.players[y].score}{' '}
          <Tooltip inline position="right" withinPortal label="estimated score">
            <Text span>
              ({scoreDiff >= 0 && '+'}
              {scoreDiff >= 0 ? scoreDiff : scoreDiff})
            </Text>
          </Tooltip>
        </List.Item>
      );
    });

  return (
    <>
      <Group position="apart">
        <Title mb={0}>Score Phase</Title>
        <Button disabled={!active} onClick={handleConfirm}>
          Confirm
        </Button>
      </Group>
      <List withPadding type="ordered" mt="md">
        {scores}
      </List>
      <PhaseView hideHand {...props} />
    </>
  );
};

export default ScorePhase;
