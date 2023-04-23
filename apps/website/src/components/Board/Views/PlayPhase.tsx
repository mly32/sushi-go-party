import { Grid } from '@mantine/core';
import { C, V } from '@sushi-go-party/sushi-go-game';
import { useState } from 'react';

import PhaseView from '../PhaseView';
import {
  ConfirmTurn,
  ListAction,
  ListActionSelect,
  Props,
  showInvalidMove,
} from '../common';

const PlayPhase = (props: Props) => {
  const { G, moves, playerID: x } = props;

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
      <ConfirmTurn
        title="Play Phase"
        disabled={confirmed}
        onClick={handleConfirm}
      />

      <Grid gutter={'xs'}>
        <Grid.Col span={6}>
          <ListActionSelect
            {...props}
            wrapperProps={{
              label: 'Select a card',
              description: 'from your hand',
            }}
            action={handAction}
          />
        </Grid.Col>
        {G.players[x].hand.includes('SpecialOrder') && (
          <Grid.Col span={6}>
            <ListActionSelect
              {...props}
              wrapperProps={{
                label: 'Copy a card',
                description: 'from your tray',
              }}
              action={copyAction}
            />
          </Grid.Col>
        )}
        <Grid.Col span={6}>
          <ListActionSelect
            {...props}
            wrapperProps={{
              label: 'Select a bonus card',
              description: 'from your tray',
            }}
            action={bonusAction}
          />
        </Grid.Col>
      </Grid>

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
