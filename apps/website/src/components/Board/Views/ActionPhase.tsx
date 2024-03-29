import { Grid, Group, Input, Radio, Title } from '@mantine/core';
import { C, U, V } from '@sushi-go-party/sushi-go-game';
import { useState } from 'react';

import Card from '../../Image/Card';
import Tile from '../../Image/Tile';
import { HoverableSelect } from '../../UI/Hoverable';
import PhaseView from '../PhaseView';
import {
  ConfirmTurn,
  ListAction,
  ListActionSelect,
  Props,
  showInvalidMove,
} from '../common';

interface ItemFormProps {
  G: C.GameState;
  item: C.SpoonInfo;
  setItem: (item: C.SpoonInfo) => void;
}

const ItemForm = ({ G, item, setItem }: ItemFormProps) => {
  const cardSelection = G.selection
    .map((tile) => Array.from(C.tileToCards[tile]))
    .flat();

  const handleRadio = (kind) => {
    if (kind === 'tile') {
      setItem({ kind: 'tile', tile: 'Flipped' });
    } else {
      setItem({ kind: 'card', card: 'Flipped' });
    }
  };

  const handleTileSelect = (value: string) => {
    setItem({ kind: 'tile', tile: value as C.Tile });
  };
  const handleCardSelect = (value: string) => {
    setItem({ kind: 'card', card: value as C.Card });
  };

  return (
    <>
      <Group>
        <Input.Wrapper label="Item type" description="to request">
          <></>
        </Input.Wrapper>
        <Radio.Group value={item.kind} onChange={handleRadio}>
          <Radio value="tile" label="Tile" />
          <Radio value="card" label="Card" />
        </Radio.Group>
      </Group>

      <Group>
        <Input.Wrapper label="Selection" description="to request">
          <></>
        </Input.Wrapper>
        {item.kind === 'tile' ? (
          <HoverableSelect
            overData={G.selection.map((tile) => ({
              value: tile,
              label: U.tileLabel(tile),
              hover: (
                <Tile tile={tile} numPlayers={G.playOrder.length} width={100} />
              ),
            }))}
            value={item.tile === 'Flipped' ? '' : item.tile}
            onChange={handleTileSelect}
          />
        ) : (
          <HoverableSelect
            overData={cardSelection.map((card) => ({
              value: card,
              label: U.cardLabel(card),
              hover: <Card card={card} width={100} />,
            }))}
            value={item.card === 'Flipped' ? '' : item.card}
            onChange={handleCardSelect}
          />
        )}
      </Group>
    </>
  );
};

const ActionPhase = (props: Props) => {
  const { G, ctx, moves, playerID: x } = props;
  const active = ctx.activePlayers && ctx.activePlayers[x] !== undefined;
  const specialTile = C.cardToTile[G.specials[G.specialIndex].card];

  const [specialInfo, setSpecialInfo] = useState({
    ...C.emptySpecialInfo,
    playerID: x,
  });

  if (!active || x !== G.specials[G.specialIndex].playerID) {
    return (
      <>
        <Title mb={0}>Action Phase</Title>
        <PhaseView {...props} />
      </>
    );
  }

  const updateSpecialInfo = (key: string) => {
    return (index: number) => {
      const value =
        specialInfo[key] === index ? C.emptySpecialInfo[key] : index;
      setSpecialInfo({ ...specialInfo, [key]: value });
    };
  };

  const updateFlipList = (index: number) => {
    const filteredFlip = specialInfo.flipList.filter((i) => i !== index);
    if (filteredFlip.length === specialInfo.flipList.length) {
      setSpecialInfo({
        ...specialInfo,
        flipList: [...specialInfo.flipList, index],
      });
    } else {
      setSpecialInfo({ ...specialInfo, flipList: filteredFlip });
    }
  };

  const manyFlipAction = (list: number[]) => {
    setSpecialInfo({ ...specialInfo, flipList: list });
  };

  const setSpoonInfo = (spoonInfo: C.SpoonInfo) => {
    setSpecialInfo({ ...specialInfo, spoonInfo: spoonInfo });
  };

  const handleConfirm = () => {
    if (!V.validSpecialMove(G, x, specialInfo)) {
      showInvalidMove();
    } else {
      moves.specialMove(specialInfo);
    }
  };

  const menuAction: ListAction = {
    loc: 'menuHand',
    enabled: (i) => V.validMenuMove(G, x, i, specialInfo.copyIndex),
    action: updateSpecialInfo('menuHandIndex'),
    selected: specialInfo.menuHandIndex,
  };

  const chopsticksAction: ListAction = {
    loc: 'hand',
    enabled: (i) => V.validChopsticksMove(G, x, i, specialInfo.copyIndex),
    action: updateSpecialInfo('handIndex'),
    selected: specialInfo.handIndex,
  };

  const copyAction: ListAction = {
    loc: 'tray',
    enabled: (i) => {
      let selectedTile: C.Tile = 'Flipped';
      if (
        specialTile === 'Chopsticks' &&
        V.validHandIndex(G, x, specialInfo.handIndex)
      ) {
        selectedTile = C.cardToTile[G.players[x].hand[specialInfo.handIndex]];
      } else if (
        specialTile === 'Menu' &&
        specialInfo.menuHandIndex !== C.NO_INDEX
      ) {
        selectedTile =
          C.cardToTile[G.players[x].menuHand[specialInfo.menuHandIndex]];
      } else if (specialTile === 'Spoon') {
        if (specialInfo.spoonInfo.kind === 'tile') {
          selectedTile = specialInfo.spoonInfo.tile;
        } else {
          selectedTile = C.cardToTile[specialInfo.spoonInfo.card];
        }
      }
      return V.validCopyIndex(G, x, i, selectedTile, true);
    },
    action: updateSpecialInfo('copyIndex'),
    selected: specialInfo.copyIndex,
    color: 'green',
    hideSelected: true,
  };

  const takeoutAction: ListAction = {
    loc: 'tray',
    enabled: (i) => V.validTakeoutBoxMove(G, x, [i]),
    action: updateFlipList,
    manyAction: manyFlipAction,
    selected: specialInfo.flipList,
  };

  return (
    <>
      <ConfirmTurn
        title={`Action Phase (${U.tileLabel(specialTile)} Action)`}
        onClick={handleConfirm}
      />

      <Grid gutter={'xs'}>
        {specialTile === 'Menu' && (
          <Grid.Col span={6}>
            <ListActionSelect
              {...props}
              wrapperProps={{
                label: 'Select a card',
                description: 'from the menu',
              }}
              action={menuAction}
            />
          </Grid.Col>
        )}

        {specialTile === 'Chopsticks' && (
          <Grid.Col span={6}>
            <ListActionSelect
              {...props}
              wrapperProps={{
                label: 'Select a card',
                description: 'from your hand',
              }}
              action={chopsticksAction}
            />
          </Grid.Col>
        )}

        {specialTile === 'Spoon' && (
          <Grid.Col span={6}>
            <ItemForm
              G={G}
              item={specialInfo.spoonInfo}
              setItem={setSpoonInfo}
            />
          </Grid.Col>
        )}

        {specialTile === 'TakeoutBox' && (
          <Grid.Col span={12}>
            <ListActionSelect
              {...props}
              wrapperProps={{
                label: 'Select cards to flip',
                description: 'from your tray',
              }}
              action={takeoutAction}
            />
          </Grid.Col>
        )}

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
      </Grid>

      <PhaseView
        {...props}
        menuAction={specialTile === 'Menu' && menuAction}
        handAction={specialTile === 'Chopsticks' && chopsticksAction}
        trayAction={specialTile === 'TakeoutBox' ? takeoutAction : copyAction}
        copyIndex={specialInfo.copyIndex}
        flipList={specialInfo.flipList}
      />
    </>
  );
};

export default ActionPhase;
