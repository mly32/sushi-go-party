import { Box, Tooltip } from '@mantine/core';
import { C, U } from '@sushi-go-party/sushi-go-game';
import { SVGProps } from 'react';

const CARD_SIZE_INFO = [
  [3138, 6],
  [3360, 10],
];
export const CARD_WIDTH = CARD_SIZE_INFO[1][0] / CARD_SIZE_INFO[1][1];
export const CARD_HEIGHT = CARD_SIZE_INFO[0][0] / CARD_SIZE_INFO[0][1];

interface CardImageProps extends SVGProps<SVGImageElement> {
  card: C.Card;
}

const CardImage = ({ card, ...props }: CardImageProps) => {
  const pos = C.cardPosition[card];

  return (
    <image
      id={card}
      href="/assets/cards.jpg"
      x={-CARD_WIDTH * pos[1]}
      y={-CARD_HEIGHT * pos[0]}
      height={CARD_SIZE_INFO[0][0]}
      width={CARD_SIZE_INFO[1][0]}
      {...props}
    />
  );
};

const cutRight = 0.42 - 0.06;
const cutLeft = 0.42 + 0.06;
const offset = 0.01;

const topHalf = [
  [0, 0],
  [CARD_WIDTH, 0],
  [CARD_WIDTH, CARD_HEIGHT * (cutRight - offset)],
  [0, CARD_HEIGHT * (cutLeft - offset)],
]
  .map((x) => x.join(' '))
  .join(',');

const bottomHalf = [
  [0, CARD_HEIGHT * cutLeft],
  [CARD_WIDTH, CARD_HEIGHT * cutRight],
  [CARD_WIDTH, CARD_HEIGHT],
  [0, CARD_HEIGHT],
]
  .map((x) => x.join(' '))
  .join(',');

export interface CardProps extends SVGProps<SVGSVGElement> {
  card: C.Card;
  tooltip?: boolean;
  flipped?: boolean;
  copied?: boolean;
}

const Card = ({
  card,
  tooltip = false,
  flipped = false,
  copied = false,
  ...props
}: CardProps) => {
  const top = flipped && copied ? 'SpecialOrder' : card;
  const bottom = flipped ? 'Flipped' : copied ? 'SpecialOrder' : card;

  const id = `${U.cardLabel(card)}${flipped ? ' (flipped)' : ''}${
    copied ? ' (copied)' : ''
  }`;

  const topID = 'top_' + card;
  const bottomID = 'bottom_' + card;

  return (
    <Tooltip label={id} withinPortal disabled={!tooltip}>
      <Box>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox={`0 0 ${CARD_WIDTH} ${CARD_HEIGHT}`}
          display="block"
          pointerEvents="none"
          {...props}
        >
          <title>{id}</title>
          <defs>
            <clipPath id={topID}>
              <polygon points={topHalf} />
            </clipPath>
            <clipPath id={bottomID}>
              <polygon points={bottomHalf} />
            </clipPath>
          </defs>
          {flipped || copied ? (
            <>
              <rect
                width={CARD_WIDTH}
                height={CARD_HEIGHT}
                style={{ fill: 'black' }}
              />
              <CardImage card={top} clipPath={`url(#${topID})`} />
              <CardImage card={bottom} clipPath={`url(#${bottomID})`} />
            </>
          ) : (
            <CardImage card={top} />
          )}
        </svg>
      </Box>
    </Tooltip>
  );
};

export default Card;
