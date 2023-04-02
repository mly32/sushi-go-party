import { C, U } from '@sushi-go-party/sushi-go-game';
import { CSSProperties } from 'react';

import styles from './styles.module.css';

export interface ListAction {
  label: string;
  enabled: (index: number) => boolean;
  action: (index: number) => void;
  selected: (index: number) => boolean;
}

const CARD_SIZE_INFO = [
  [3138, 6],
  [3360, 10],
];
const CARD_SIZE = [
  CARD_SIZE_INFO[0][0] / CARD_SIZE_INFO[0][1],
  CARD_SIZE_INFO[1][0] / CARD_SIZE_INFO[1][1],
];

const CARD_WIDTH = 100;
const CARD_HEIGHT = (CARD_WIDTH / CARD_SIZE[1]) * CARD_SIZE[0];

export interface CardProps {
  card: C.Card;
  index: number;
  actions: ListAction[];
}

const Card = ({ card, index, actions }: CardProps) => {
  const position = C.cardPosition[card];
  const info: CSSProperties = {
    backgroundSize: `${CARD_SIZE_INFO[1][1] * 100}%`,
    backgroundPositionY: -position[0] * CARD_HEIGHT,
    backgroundPositionX: -position[1] * CARD_WIDTH,
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
  };

  return (
    <div>
      <div
        role="img"
        aria-label={U.cardLabel(card)}
        className={styles['sushi-go-card']}
        style={info}
      />
      {actions
        .filter(({ enabled }) => enabled(index))
        .map(({ label, action, selected }) => (
          <button
            key={label}
            onClick={() => action(index)}
            style={{
              color: selected(index) ? 'blue' : 'black',
            }}
          >
            {label}
          </button>
        ))}
    </div>
  );
};

export default Card;
