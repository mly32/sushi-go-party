import {
  Box,
  Group,
  Modal,
  Text,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { C, U } from '@sushi-go-party/sushi-go-game';
import { SVGProps } from 'react';

import { TILE_POSITION } from '../../constants';
import CardCheckbox from '../Board/CardCheckbox';

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
  const pos = TILE_POSITION[tile](numPlayers);

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
  showModal?: boolean;
  numPlayers: number;
}

const Tile = ({
  tile,
  numPlayers,
  tooltip = false,
  showModal = false,
  ...props
}: TileProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const content = (
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
  );

  if (!showModal) {
    return (
      <Tooltip label={U.tileLabel(tile)} withinPortal disabled={!tooltip}>
        {content}
      </Tooltip>
    );
  }

  return (
    <Tooltip label={U.tileLabel(tile)} withinPortal disabled={!tooltip}>
      <UnstyledButton onClick={open}>
        <Modal
          size="xl"
          opened={opened}
          onClose={close}
          title={<Text>{U.tileLabel(tile)}</Text>}
        >
          <Group spacing={2} py={4} px="sm" position="center">
            {Array.from(C.tileToCards[tile])
              .map((card) => Array(C.cardToInfo[card].copies).fill(card))
              .flat()
              .map((card, index) => (
                <CardCheckbox key={index} card={card} disabled />
              ))}
          </Group>
        </Modal>
        {content}
      </UnstyledButton>
    </Tooltip>
  );
};

export default Tile;
