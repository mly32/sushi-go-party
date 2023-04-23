import { Box, DefaultMantineColor, Group, GroupProps } from '@mantine/core';
import { C, U, V } from '@sushi-go-party/sushi-go-game';

import CardCheckbox, { CardCheckboxProps } from './CardCheckbox';
import { ListAction } from './common';

export interface CardListProps extends GroupProps {
  bold?: [number, DefaultMantineColor];
  copyIndex?: number;
  flipList?: number[];
  G: C.GameState;
  loc: C.Location;
  x?: C.PlayerID;
  action?: ListAction;
}

const CardList = ({
  bold,
  copyIndex,
  flipList = [],
  G,
  loc,
  x = '',
  action,
  ...props
}: CardListProps) => {
  const indexedList: C.IndexCard[] = U.indexedList(G, loc, x);

  const CardInfo = ({ card, index }: C.IndexCard) => {
    const flipInfo =
      loc === 'tray'
        ? G.players[x].flipped.find(({ index: i }) => i === index)
        : undefined;
    const isCopied = G.players[x].copied.some(
      ({ index: i, loc: l }) => i === index && l === loc
    );

    const viewCard: CardCheckboxProps = {
      card: flipInfo?.card || card,
      copied: isCopied,
      flipped: flipInfo !== undefined || flipList.includes(index),
      boldColor: bold && bold[0] === index ? bold[1] : undefined,
    };

    if (action) {
      const checked =
        (action.enabled(index) || action.confirmed) &&
        (typeof action.selected === 'number'
          ? index === action.selected
          : action.selected.includes(index));
      if (
        checked &&
        (loc === 'hand' || loc === 'menuHand') &&
        V.validCopyIndex(G, x, copyIndex, C.cardToTile[card], true) &&
        copyIndex !== C.NO_INDEX
      ) {
        viewCard.card = G.players[x].tray[copyIndex];
        viewCard.copied = true;
      }

      return (
        <CardCheckbox
          key={index}
          {...viewCard}
          disabled={action.confirmed || !action.enabled(index)}
          checked={!action.hideSelected && checked}
          onChange={() =>
            !action.confirmed && action.enabled(index) && action.action(index)
          }
          color={action.color}
        />
      );
    }

    return <CardCheckbox key={index} {...viewCard} disabled />;
  };

  return (
    <Group spacing={2} {...props} py={4}>
      {indexedList.length === 0 ? (
        <Box sx={{ opacity: 0 }}>
          <CardInfo card="Flipped" index={0} />
        </Box>
      ) : (
        indexedList.map(CardInfo)
      )}
    </Group>
  );
};
export default CardList;
