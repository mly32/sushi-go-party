import {
  Accordion,
  Box,
  Card,
  Flex,
  Group,
  Notification,
  Paper,
  ScrollArea,
  Space,
  Text,
  Title,
} from '@mantine/core';
import { C, U } from '@sushi-go-party/sushi-go-game';
import { IconInfoCircle, IconToolsKitchen2, IconTrash } from '@tabler/icons';

import Tile from '../Image/Tile';
import Icon from '../UI/Icon';
import BoardLayout from './BoardLayout';
import CardCheckbox from './CardCheckbox';
import MatchInfo from './MatchInfo';
import NotStarted from './NotStarted';
import PhaseView from './PhaseView';
import {
  ActionPhase,
  GameOver,
  PlayPhase,
  ScorePhase,
  SpoonStage,
} from './Views';
import { Props } from './common';
import { playerIDColor, useStyles } from './styles';

const Chat = (props: Props) => {
  return (
    <Card p="xs" bg="none">
      <Text>... to be added</Text>
    </Card>
  );
};

const Logs = ({ G, matchData }: Props) => {
  const { classes, theme } = useStyles();
  const gameColor = theme.colorScheme === 'dark' ? 'bright' : 'dark';

  return (
    <Flex direction="column-reverse">
      {G.log
        .slice()
        .reverse()
        .map(({ playerID, msg }, index) => (
          <Notification
            key={index}
            disallowClose
            color={playerIDColor[playerID] ?? gameColor}
            className={classes.notification}
          >
            {playerID ? (
              <Text span c={playerIDColor[playerID]} fw="bold">
                {matchData[playerID].name ?? playerID}
              </Text>
            ) : (
              <IconInfoCircle
                style={{
                  verticalAlign: 'bottom',
                }}
                size={theme.fontSizes.lg}
              />
            )}{' '}
            {msg}
          </Notification>
        ))}
    </Flex>
  );
};

const TopInfo = ({ G, ctx }: Props) => {
  const { classes } = useStyles();
  return (
    <Paper withBorder radius="md">
      <Accordion styles={{ content: { padding: 0 } }}>
        <Accordion.Item value="selection">
          <Accordion.Control icon={<Icon icon={IconToolsKitchen2} size="md" />}>
            {G.selectionName}
          </Accordion.Control>
          <Accordion.Panel>
            <Group spacing={2} grow>
              {G.selection.map((tile, index) => (
                <Tile
                  key={index}
                  tooltip
                  tile={tile}
                  numPlayers={ctx.numPlayers}
                />
              ))}
            </Group>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="discard">
          <Accordion.Control icon={<Icon icon={IconTrash} size="md" />}>
            Discard ({G.discard.length})
          </Accordion.Control>
          <Accordion.Panel>
            <ScrollArea>
              <Group spacing={2} px="sm" className={classes.tray} noWrap>
                {G.discard.length === 0 ? (
                  <CardCheckbox card={'Flipped'} disabled sx={{ opacity: 0 }} />
                ) : (
                  G.discard.map((card, index) => (
                    <CardCheckbox key={index} card={card} disabled />
                  ))
                )}
              </Group>
            </ScrollArea>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Paper>
  );
};

const Spectate = (props: Props) => {
  const { ctx } = props;
  return (
    <>
      <Title mb={0}>
        {U.phaseLabel(ctx.phase as C.Phase) || 'Unknown Phase'}
      </Title>
      <Text>Spectator View</Text>
      <PhaseView {...props} />
    </>
  );
};

const CommonView = (props: Props) => {
  const { ctx } = props;
  return (
    <>
      <Title mb={0}>
        {U.phaseLabel(ctx.phase as C.Phase) || 'Unknown Phase'}
      </Title>
      <PhaseView {...props} />
    </>
  );
};

const Body = (props: Props) => {
  const { G, ctx, playerID: x } = props;
  const BOARD_WIDTH = Math.max(800, 1200 - 100 * Math.max(0, 10 - G.turn.max));
  const spectate = x === null;

  const View = () => {
    if (ctx.gameover !== undefined) {
      return <GameOver {...props} />;
    }
    if (spectate) {
      return <Spectate {...props} />;
    }
    switch (ctx.phase as C.Phase) {
      case 'playPhase':
        return <PlayPhase {...props} />;
      case 'actionPhase':
        if (ctx.activePlayers && ctx.activePlayers[x] === 'spoonStage') {
          return <SpoonStage {...props} />;
        }
        return <ActionPhase {...props} />;
      case 'scorePhase':
        return <ScorePhase {...props} />;
      default:
        return <CommonView {...props} />;
    }
  };

  return (
    <Box w={BOARD_WIDTH}>
      <TopInfo {...props} />
      <Space h="md" />

      <View key={G.turn.current} />
    </Box>
  );
};

export type SushiGoBoardProps = Props;

const SushiGoBoard = (props: Props) => {
  const { ctx, matchData } = props;

  const joinedPlayers =
    matchData.filter((p) => p.name !== undefined).length || 0;

  if (joinedPlayers !== ctx.numPlayers) {
    return <NotStarted {...props} />;
  }

  return (
    <BoardLayout
      matchInfo={<MatchInfo {...props} />}
      chat={<Chat {...props} />}
      log={<Logs {...props} />}
    >
      <Body {...props} />
    </BoardLayout>
  );
};

export default SushiGoBoard;
