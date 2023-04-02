import { Box, Tooltip } from '@mantine/core';
import { C, U } from '@sushi-go-party/sushi-go-game';
import { SVGProps } from 'react';

const TILE_SIZE_INFO = [
  [2055, 5],
  [1680, 5],
];
export const TILE_WIDTH = TILE_SIZE_INFO[1][0] / TILE_SIZE_INFO[1][1];
export const TILE_HEIGHT = TILE_SIZE_INFO[0][0] / TILE_SIZE_INFO[0][1];

interface TileImageProps extends SVGProps<SVGImageElement> {
  tile: C.Tile;
  numPlayers: number;
}

const TileImage = ({ tile, numPlayers, ...props }: TileImageProps) => {
  const pos = C.tilePosition[tile](numPlayers);

  return (
    <image
      href="/assets/tiles.jpg"
      x={-TILE_WIDTH * pos[1]}
      y={-TILE_HEIGHT * pos[0]}
      height={TILE_SIZE_INFO[0][0]}
      width={TILE_SIZE_INFO[1][0]}
      {...props}
    />
  );
};

export interface TileProps extends SVGProps<SVGSVGElement> {
  tile: C.Tile;
  tooltip?: boolean;
  numPlayers: number;
}

const Tile = ({ tile, numPlayers, tooltip = false, ...props }: TileProps) => {
  return (
    <Tooltip label={U.tileLabel(tile)} withinPortal disabled={!tooltip}>
      <Box>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox={`0 0 ${TILE_WIDTH} ${TILE_HEIGHT}`}
          display="block"
          pointerEvents="none"
          {...props}
        >
          <title>{U.tileLabel(tile)}</title>
          <TileImage tile={tile} numPlayers={numPlayers} />
        </svg>
      </Box>
    </Tooltip>
  );
};

export default Tile;
