import { Carousel, CarouselProps } from '@mantine/carousel';
import {
  ActionIcon,
  Checkbox,
  Divider,
  Group,
  Input,
  Slider,
  Text,
  Title,
  Tooltip,
  createStyles,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { C } from '@sushi-go-party/sushi-go-game';
import { IconMusic } from '@tabler/icons';
import { useState } from 'react';

import Card from '../components/Image/Card';
import Tile from '../components/Image/Tile';

const useStyles = createStyles((theme) => ({
  element: {
    width: 100,
    border: '1px solid transparent',
    borderRadius: theme.fn.radius('lg'),
  },
}));

const Settings = () => {
  const { classes } = useStyles();

  const audio = new Audio('/assets/ping_sound.mp3');
  const [volume, setVolume] = useState(50);

  const form = useForm({
    initialValues: {
      checked: [] as ('flipped' | 'copied')[],
    },
  });

  const partialProps: Partial<CarouselProps> = {
    mx: 'auto',
    loop: true,
    w: { base: 100, xs: 300, sm: 500, md: 700, lg: 900 },
    slideSize: `${100 / 9}%`,
    breakpoints: [
      { maxWidth: 'xs', slideSize: '100%' },
      { maxWidth: 'sm', slideSize: `${100 / 3}%` },
      { maxWidth: 'md', slideSize: '20%' },
      { maxWidth: 'lg', slideSize: `${100 / 7}%` },
    ],
  };

  const handleSound = () => {
    audio.volume = volume / 100;
    audio.play();
  };

  return (
    <>
      <Title>Settings</Title>
      <Checkbox disabled label="Hide card images" />
      <Checkbox disabled label="Play a sound when a move is made" />
      <Checkbox
        disabled
        label="Show a desktop notification when it reaches your turn"
      />
      <Input.Wrapper label="Volume">
        <Group>
          <Slider
            w="100%"
            maw={200}
            value={volume}
            onChange={setVolume}
            min={0}
            max={100}
          />
          <Tooltip label="Test sound">
            <ActionIcon
              onClick={handleSound}
              variant="transparent"
              color="dark"
              disabled={volume === 0}
            >
              <IconMusic />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Input.Wrapper>
      <Text>... more to come</Text>
      <Divider />
      <Text>
        For now, view some art &#128522;
        {/* smile emoji */}
      </Text>

      <Text align="center" fz="lg">
        Tiles
      </Text>

      <Carousel {...partialProps}>
        {C.tiles.slice(1).map((tile) => (
          <Carousel.Slide key={tile}>
            <Tile
              tooltip
              tile={tile}
              numPlayers={2}
              className={classes.element}
            />
          </Carousel.Slide>
        ))}
      </Carousel>

      <Text align="center" fz="lg">
        Cards
      </Text>

      <Carousel {...partialProps}>
        {C.cards.slice(1).map((card) => (
          <Carousel.Slide key={card}>
            <Card
              card={card}
              tooltip
              flipped={form.values.checked.includes('flipped')}
              copied={form.values.checked.includes('copied')}
              className={classes.element}
            />
          </Carousel.Slide>
        ))}
      </Carousel>

      <form>
        <Checkbox.Group
          {...form.getInputProps('checked')}
          label="Select card properties"
        >
          <Checkbox value="flipped" label="Flipped" />
          <Checkbox value="copied" label="Copied" />
        </Checkbox.Group>
      </form>
    </>
  );
};

export default Settings;
