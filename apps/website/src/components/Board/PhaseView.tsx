import {
  Box,
  Button,
  Card,
  Flex,
  Group,
  Loader,
  Modal,
  Stack,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { C, U } from '@sushi-go-party/sushi-go-game';
import Image from 'next/image';

import CardList from './CardList';
import { ListAction, Props } from './common';
import { playerIDColor, useStyles } from './styles';

const arrayRotate = <T,>(arr: T[], n: number) => {
  n = ((n % arr.length) + arr.length) % arr.length;
  return arr.slice(n, arr.length).concat(arr.slice(0, n));
};

export interface PhaseViewProps extends Props {
  copyIndex?: number;
  bonusIndex?: number;
  flipList?: number[];
  menuAction?: ListAction;
  handAction?: ListAction;
  trayAction?: ListAction;
  hideHand?: boolean;
}

type Dessert = 'fruit1' | 'fruit2' | 'fruit3' | 'greenteaicecream' | 'pudding';

const total = (G: C.GameState, y: C.PlayerID): [number, Dessert][] => {
  const dessert = C.dessertFromSelection(G.selection);

  if (dessert === 'Pudding') {
    return [[G.players[y].fridge.length, 'pudding']];
  } else if (dessert === 'GreenTeaIceCream') {
    return [[G.players[y].fridge.length, 'greenteaicecream']];
  }
  const totals = U.fruitTotal(G.players[y].fridge);

  return [
    [totals.w, 'fruit1'],
    [totals.p, 'fruit2'],
    [totals.o, 'fruit3'],
  ];
};

const Tray = ({
  G,
  ctx,
  matchData,
  playerID: x,
  bonusIndex,
  flipList = [],
  trayAction,
  otherPlayer: y,
}: PhaseViewProps & { otherPlayer: C.PlayerID }) => {
  const [opened, { open, close }] = useDisclosure(false);

  const { classes } = useStyles();

  const action = y === x ? trayAction : undefined;

  const traySpecialIndex = G.specials.find(
    (special, index) => index >= G.specialIndex && special.playerID === y
  )?.index;

  const active = ctx.activePlayers && ctx.activePlayers[y] !== undefined;

  const name =
    y === x ? (
      <Text span c={playerIDColor[y]} fw="bold">
        Your
      </Text>
    ) : (
      <>
        <Text span c={playerIDColor[y]} fw="bold">
          {matchData[y].name ?? y}
        </Text>
        {"'s"}
      </>
    );

  const list = total(G, y);

  return (
    <Card withBorder>
      <Modal
        size="xl"
        opened={opened}
        onClose={close}
        title={<Text>{name} Desserts</Text>}
      >
        <CardList G={G} loc="fridge" x={y} px="sm" position="center" />
      </Modal>

      <Card.Section>
        <Flex align="flex-end">
          <Box sx={{ flex: 1 }}>
            <Text px="sm">
              {name} Tray
              {active && <Loader size={16} ml="sm" />}
            </Text>

            <CardList
              G={G}
              loc="tray"
              x={y}
              action={action}
              bold={
                y === x && bonusIndex !== undefined
                  ? [bonusIndex, 'red']
                  : traySpecialIndex && [traySpecialIndex, 'red']
              }
              flipList={y === x ? flipList : []}
              className={classes.tray}
              w="100%"
              px="sm"
            />
          </Box>

          <Box>
            <Button
              variant="default"
              color="dark"
              w="100%"
              compact
              radius={0}
              onClick={open}
              disabled={G.players[y].fridge.length === 0}
            >
              Desserts
            </Button>
            <Stack
              align="center"
              justify={list.length > 1 ? 'space-between' : 'center'}
              spacing={0}
              className={classes.fridge}
              px="25px"
              pt="15px"
              pb="30px"
            >
              {list.map(([count, dessert]: [number, string]) => {
                return (
                  <Group key={dessert} spacing={0} w="100%" position="apart">
                    <Text
                      variant="gradient"
                      gradient={{ from: 'pink.9', to: 'indigo.9', deg: 45 }}
                      fz="xl"
                      fw="bold"
                      td="underlined"
                    >
                      {count}
                    </Text>
                    <Text>
                      <Image
                        src={`/assets/fridge/fridge_${dessert}.png`}
                        alt={dessert}
                        width={24}
                        height={24}
                        className={classes.dessertIcon}
                      />
                    </Text>
                  </Group>
                );
              })}
            </Stack>
          </Box>
        </Flex>
      </Card.Section>
    </Card>
  );
};

const PhaseView = (props: PhaseViewProps) => {
  const {
    G,
    playerID: x,
    copyIndex,
    menuAction,
    handAction,
    hideHand = false,
  } = props;
  const { classes } = useStyles();
  const localPlayerOrder = x
    ? arrayRotate(
        [...G.playOrder],
        G.playOrder.findIndex((y) => y === x)
      )
    : [...G.playOrder];

  return (
    <Stack my="sm" spacing="sm">
      {menuAction && (
        <Card p="sm" withBorder>
          <Text>Menu Hand</Text>

          <Card.Section className={classes.hand} inheritPadding>
            <CardList
              G={G}
              loc="menuHand"
              x={x}
              action={menuAction}
              copyIndex={copyIndex}
            />
          </Card.Section>
        </Card>
      )}

      {x && !hideHand && (
        <Card p="sm" withBorder>
          <Text>Hand</Text>

          <Card.Section className={classes.hand} inheritPadding>
            <CardList
              G={G}
              loc="hand"
              x={x}
              action={handAction}
              copyIndex={copyIndex}
            />
          </Card.Section>
        </Card>
      )}

      {localPlayerOrder.map((y) => (
        <Tray key={y} {...props} otherPlayer={y} />
      ))}
    </Stack>
  );
};

export default PhaseView;
