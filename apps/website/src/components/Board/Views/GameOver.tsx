import { List, Text, Title } from '@mantine/core';

import { Props } from '../common';
import { playerIDColor } from '../styles';

const GameOver = ({ ctx, playerID: x, matchData }: Props) => {
  const order = ctx.gameover;
  const winner = order[0].playerID;
  const winnerName =
    winner === x ? (
      <>
        <Text span c={playerIDColor[x]} fw="bold">
          You
        </Text>{' '}
        win
      </>
    ) : (
      <>
        <Text span c={playerIDColor[winner]} fw="bold">
          {matchData[winner].name ?? winner}
        </Text>{' '}
        wins
      </>
    );

  return (
    <>
      <Title mb={0}>Game Over</Title>
      <Text fz="xl">{winnerName}!!!</Text>
      <List type="ordered" withPadding>
        {order.map(({ playerID: y, score, desserts }) => (
          <List.Item key={y}>
            <Text span c={playerIDColor[y]} fw="bold">
              {matchData[y].name ?? y}
            </Text>
            : {score} points ({desserts} desserts)
          </List.Item>
        ))}
      </List>
    </>
  );
};

export default GameOver;
