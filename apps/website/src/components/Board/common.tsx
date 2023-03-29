import {
  Box,
  DefaultMantineColor,
  Group,
  Input,
  InputWrapperBaseProps,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { C, U } from '@sushi-go-party/sushi-go-game';
import { IconX } from '@tabler/icons';
import { BoardProps } from 'boardgame.io/react';

import Card from '../Image/Card';
import { HoverableMultiSelect, HoverableSelect } from '../UI/Hoverable';

export type Props = BoardProps<C.GameState>;

export const showInvalidMove = () =>
  showNotification({
    icon: <IconX />,
    color: 'red',
    message: 'Invalid move',
  });

export interface ListAction {
  color?: DefaultMantineColor;
  loc: C.Location;
  enabled: (index: number) => boolean;
  action: (index: number) => void;
  manyAction?: (index: number[]) => void;
  selected: number | number[];
  confirmed?: boolean;
  hideSelected?: boolean;
}

export const ListActionSelect = ({
  action,
  wrapperProps,
  ...props
}: Props & { action: ListAction; wrapperProps?: InputWrapperBaseProps }) => {
  const { G, playerID: x } = props;
  const list = U.indexedList(G, action.loc, x).filter(({ index }) =>
    action.enabled(index)
  );

  if (list.length === 0) {
    return <Box></Box>;
  }

  const data = list.map(({ card, index }) => {
    const flipInfo =
      action.loc === 'tray'
        ? G.players[x].flipped.find(({ index: i }) => i === index)
        : undefined;
    const isCopied = G.players[x].copied.some(
      ({ index: i, loc: l }) => i === index && l === action.loc
    );

    return {
      value: index.toString(),
      label: U.cardLabel(card),
      hover: (
        <Card
          card={flipInfo?.card || card}
          copied={isCopied}
          flipped={flipInfo !== undefined}
          width={100}
        />
      ),
    };
  });

  if (typeof action.selected === 'number') {
    const value = action.selected.toString();

    const setValue = (value: string) => {
      if (action.confirmed) {
        return;
      }
      if (value === null) {
        action.action(C.NO_INDEX);
        return;
      }
      const i = Number(value);
      if (!isNaN(i) && action.enabled(i)) {
        action.action(i);
      }
    };

    return (
      <Group position="apart">
        {wrapperProps && (
          <Input.Wrapper {...wrapperProps}>
            <></>
          </Input.Wrapper>
        )}
        <HoverableSelect
          clearable
          readOnly={action.confirmed}
          overData={data}
          value={value}
          onChange={setValue}
        />
      </Group>
    );
  }

  const value = action.selected.map((i) => i.toString());

  const setValue = (value: string[]) => {
    if (action.confirmed) {
      return;
    }
    if (value === null) {
      action.manyAction([]);
      return;
    }
    console.log(
      'value:',
      value,

      value.map(Number),
      Number('1'),
      Number('a')
    );
    action.manyAction(
      value.map(Number).filter((i) => !isNaN(i) && action.enabled(i))
    );
  };

  return (
    <Group position="apart">
      {wrapperProps && (
        <Input.Wrapper {...wrapperProps}>
          <></>
        </Input.Wrapper>
      )}
      <HoverableMultiSelect
        clearable
        readOnly={action.confirmed}
        overData={data}
        value={value}
        onChange={setValue}
      />
    </Group>
  );
};
