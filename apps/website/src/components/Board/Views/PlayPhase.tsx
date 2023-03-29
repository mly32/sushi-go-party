import { Button, Group, Input, SimpleGrid, Title } from '@mantine/core';
import { C, U, V } from '@sushi-go-party/sushi-go-game';
import { useState } from 'react';

import Card from '../../Image/Card';
import { HoverableSelect } from '../../UI/Hoverable';
import PhaseView from '../PhaseView';
import {
  ListAction,
  ListActionSelect,
  Props,
  showInvalidMove,
} from '../common';

const PlayPhase = (props: Props) => {
  const { G, moves, playerID: x } = props;
  // const active = ctx.activePlayers && ctx.activePlayers[x] !== undefined;

  const confirmed =
    G.players[x].playInfo.handIndex !== C.emptyPlayInfo.handIndex;

  const [playInfo, setPlayInfo] = useState(
    confirmed ? G.players[x].playInfo : C.emptyPlayInfo
  );

  const updatePlayInfo = (key: string) => {
    if (confirmed) {
      return;
    }
    return (index: number) => {
      const value = playInfo[key] === index ? C.emptyPlayInfo[key] : index;
      setPlayInfo({ ...playInfo, [key]: value });
    };
  };

  const handleConfirm = () => {
    if (!V.validPlayMove(G, x, playInfo)) {
      showInvalidMove();
    } else if (!confirmed) {
      moves.playMove(playInfo);
    }
  };

  const handAction: ListAction = {
    loc: 'hand',
    enabled: (i) => V.validHandIndex(G, x, i),
    action: updatePlayInfo('handIndex'),
    selected: playInfo.handIndex,
    confirmed,
  };

  const copyAction: ListAction = {
    loc: 'tray',
    enabled: (i) => {
      if (!V.validHandIndex(G, x, playInfo.handIndex)) {
        return false;
      }
      const tile = C.cardToTile[G.players[x].hand[playInfo.handIndex]];
      return V.validCopyIndex(G, x, i, tile, true);
    },
    action: updatePlayInfo('copyIndex'),
    selected: playInfo.copyIndex,
    confirmed,
    color: 'green',
    hideSelected: true,
  };

  const bonusAction: ListAction = {
    loc: 'tray',
    enabled: (i) => V.validBonusIndex(G, x, i),
    action: updatePlayInfo('bonusIndex'),
    selected: playInfo.bonusIndex,
    confirmed,
    color: 'red',
  };

  return (
    <>
      <Group position="apart">
        <Title mb={0}>Play Phase</Title>
        <Button disabled={confirmed} onClick={handleConfirm}>
          Confirm
        </Button>
      </Group>

      <SimpleGrid cols={2} w="fit-content" verticalSpacing={0}>
        <ListActionSelect
          {...props}
          wrapperProps={{
            label: 'Select a card',
            description: 'from your hand',
          }}
          action={handAction}
        />
        <ListActionSelect
          {...props}
          wrapperProps={{
            label: 'Copy a card',
            description: 'from your tray',
          }}
          action={copyAction}
        />
        <ListActionSelect
          {...props}
          wrapperProps={{
            label: 'Select a bonus card',
            description: 'from your tray',
          }}
          action={bonusAction}
        />
      </SimpleGrid>

      <PhaseView
        {...props}
        handAction={handAction}
        trayAction={
          G.players[x].hand[playInfo.handIndex] === 'SpecialOrder'
            ? copyAction
            : bonusAction
        }
        copyIndex={
          confirmed ? G.players[x].playInfo.copyIndex : playInfo.copyIndex
        }
        bonusIndex={
          confirmed ? G.players[x].playInfo.bonusIndex : playInfo.bonusIndex
        }
      />
    </>
  );
};

export default PlayPhase;
