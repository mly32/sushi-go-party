import { C, U } from '@sushi-go-party/sushi-go-game';
import { CSSProperties } from 'react';

import { TILE_POSITION } from '../../../constants';
import styles from './styles.module.css';

const tileSizeInfo = [
  [2055, 5],
  [1680, 5],
];
const tileSize = [
  tileSizeInfo[0][0] / tileSizeInfo[0][1],
  tileSizeInfo[1][0] / tileSizeInfo[1][1],
];

const width = 100;
const scale = width / tileSize[1];

export interface SelectionProps {
  numPlayers: number;
  list: readonly C.Tile[];
}

const Selection = ({ numPlayers, list }: SelectionProps) => {
  return (
    <div className={styles['row-container']}>
      {list.map((tile, index) => {
        const position = TILE_POSITION[tile](numPlayers);
        const info: CSSProperties = {
          backgroundSize: `${tileSizeInfo[1][1] * 100}%`,
          backgroundPositionY: -position[0] * tileSize[0] * scale,
          backgroundPositionX: -position[1] * tileSize[1] * scale,
          height: tileSize[0] * scale,
          width: tileSize[1] * scale,
        };
        return (
          <div key={index}>
            <div
              role="img"
              aria-label={U.tileLabel(tile)}
              className={styles['sushi-go-tile']}
              style={info}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Selection;
