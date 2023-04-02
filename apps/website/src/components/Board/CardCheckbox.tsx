import {
  Box,
  CSSObject,
  Checkbox,
  CheckboxProps,
  DefaultMantineColor,
  Indicator,
  MantineColor,
  Tooltip,
  createStyles,
} from '@mantine/core';
import { C, U } from '@sushi-go-party/sushi-go-game';

import Card, { CARD_HEIGHT, CARD_WIDTH } from '../Image/Card';

interface StyleParams {
  boldColor?: DefaultMantineColor;
  color: MantineColor;
}

const useStyles = createStyles(
  (theme, { boldColor, color }: StyleParams, getRef) => {
    const cardWidth = 100;
    const cardHeight = (cardWidth / CARD_WIDTH) * CARD_HEIGHT;

    const inputWidth = cardWidth + 4;
    const inputHeight = cardHeight + 4;
    const checkedColor = color
      ? theme.colors[color][theme.fn.primaryShade()]
      : theme.colorScheme === 'dark'
      ? theme.colors.gray[3]
      : theme.colors.dark[6];
    const borderColor =
      theme.colorScheme === 'dark'
        ? theme.colors.dark[6]
        : theme.colors.gray[5];

    const selected: CSSObject = {
      backgroundColor: checkedColor,
      borderColor: borderColor,

      [`& + .${getRef('icon')}`]: {
        width: cardWidth - 8,
        height: cardHeight - 8,

        [`.${getRef('card')}`]: {
          border: 'none',
          borderRadius: theme.fn.radius('sm'),
        },
      },
    };

    const boldStyle: CSSObject = {
      backgroundColor: theme.fn.variant({
        variant: 'filled',
        color: boldColor ?? 'dark',
      }).background,
      border: `1px solid ${borderColor}`,
    };

    return {
      indicator: {
        background: checkedColor,
      },
      card: {
        ref: getRef('card'),
        borderRadius: theme.fn.radius('md'),
        border: `1px solid ${borderColor}`,
        width: '100%',
        height: '100%',
      },
      body: {
        display: 'block-flex',
      },
      inner: {
        position: 'relative',
        width: inputWidth,
        height: inputHeight,
      },
      icon: {
        ref: getRef('icon'),
        boxSizing: 'content-box',
        zIndex: 0,
        opacity: 1,
        transform: 'none',
        transitionProperty: 'all',
        pointerEvents: 'none',

        width: cardWidth,
        height: cardHeight,
      },
      input: {
        borderRadius: theme.fn.radius('md'),
        background: 'none',
        border: 'none',
        width: inputWidth,
        height: inputHeight,
        cursor: 'pointer',

        ...(boldColor ? { ...selected, ...boldStyle } : {}),

        '&:disabled': {
          cursor: 'default',
          backgroundColor: 'transparent',
          ...(boldColor ? boldStyle : {}),
        },

        '&:checked': selected,
      },
    };
  }
);

export interface CardCheckboxProps extends CheckboxProps {
  boldColor?: DefaultMantineColor;
  card: C.Card;
  flipped?: boolean;
  copied?: boolean;
}

const CardCheckbox = ({
  card,
  boldColor,
  flipped = false,
  copied = false,
  checked,
  disabled,
  color,
  ...props
}: CardCheckboxProps) => {
  const { classes } = useStyles({ color, boldColor });

  const CardIcon: CheckboxProps['icon'] = ({ className }) => {
    return (
      <Indicator
        className={className}
        classNames={{ indicator: classes.indicator }}
        withBorder
        processing
        size={14}
        offset={6}
        disabled={checked || disabled}
      >
        <Card
          card={card}
          flipped={flipped}
          copied={copied}
          className={classes.card}
        />
      </Indicator>
    );
  };

  const label = `${U.cardLabel(card)}${flipped ? ' (flipped)' : ''}${
    copied ? ' (copied)' : ''
  }`;

  return (
    <Tooltip label={label} position="bottom" withinPortal>
      <Box>
        <Checkbox
          checked={checked}
          disabled={disabled}
          {...props}
          icon={CardIcon}
          classNames={{
            body: classes.body,
            inner: classes.inner,
            input: classes.input,
            icon: classes.icon,
          }}
        />
      </Box>
    </Tooltip>
  );
};

export default CardCheckbox;
