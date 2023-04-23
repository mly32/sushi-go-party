import { Box, Text } from '@mantine/core';
import { C, U, V } from '@sushi-go-party/sushi-go-game';
import { useState } from 'react';

import PhaseView from '../PhaseView';
import {
  ConfirmTurn,
  ListAction,
  ListActionSelect,
  Props,
  showInvalidMove,
} from '../common';
import { playerIDColor } from '../styles';

const SpoonStage = (props: Props) => {
  const { G, moves, matchData, playerID: x } = props;
  const [handIndex, setHandIndex] = useState(C.NO_INDEX);

  const spoonInfo = G.turn.turnInfo.spoonInfo;

  const updateSpoon = (index: number) => {
    setHandIndex(handIndex === index ? C.NO_INDEX : index);
  };

  const spoonAction: ListAction = {
    loc: 'hand',
    enabled: (i) =>
      spoonInfo.kind === 'tile'
        ? C.cardToTile[G.players[x].hand[i]] === spoonInfo.tile
        : G.players[x].hand[i] === spoonInfo.card,
    action: updateSpoon,
    selected: handIndex,
  };

  const handleConfirm = () => {
    if (!V.validSpoonResponseMove(G, x, handIndex)) {
      showInvalidMove();
    } else {
      moves.spoonMove(handIndex);
    }
  };

  const other = G.specials[G.specialIndex].playerID;

  return (
    <>
      <ConfirmTurn title="Spoon Stage" onClick={handleConfirm} />
      <Text>
        <Text span fw="bold" color={playerIDColor[other]}>
          {matchData[other].name ?? other}
        </Text>{' '}
        asks for a {U.spoonLabel(spoonInfo)} ({spoonInfo.kind})
      </Text>
      <Box w="fit-content">
        <ListActionSelect
          {...props}
          wrapperProps={{
            label: 'Select a card',
            description: 'from your hand',
          }}
          action={spoonAction}
        />
      </Box>
      <PhaseView {...props} handAction={spoonAction} />
    </>
  );
};
export default SpoonStage;
