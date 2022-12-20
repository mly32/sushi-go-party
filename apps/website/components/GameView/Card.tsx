import { C, U } from '@sushi-go-party/sushi-go-game';
import { CSSProperties } from 'react';

import styles from './styles.module.css';

export interface ListAction {
  label: string;
  enabled: (index: number) => boolean;
  action: (index: number) => void;
  selected: (index: number) => boolean;
}

const cardSizeInfo = [
  [3138, 6],
  [3360, 10],
];
const cardSize = [
  cardSizeInfo[0][0] / cardSizeInfo[0][1],
  cardSizeInfo[1][0] / cardSizeInfo[1][1],
];

const width = 100;
const scale = width / cardSize[1];

export interface CardProps {
  card: C.Card;
  index: number;
  actions: ListAction[];
}

const Card = ({ card, index, actions }: CardProps) => {
  const position = C.cardPosition[card];
  const info: CSSProperties = {
    backgroundSize: `${cardSizeInfo[1][1] * 100}%`,
    backgroundPositionY: -position[0] * cardSize[0] * scale,
    backgroundPositionX: -position[1] * cardSize[1] * scale,
    height: cardSize[0] * scale,
    width: cardSize[1] * scale,
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
