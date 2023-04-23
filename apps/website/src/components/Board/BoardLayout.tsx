import {
  ActionIcon,
  Box,
  Group,
  Paper,
  ScrollArea,
  Tabs,
  TabsPanelProps,
  createStyles,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import {
  IconChevronLeft,
  IconChevronRight,
  IconInfoCircle,
  IconMessages,
  IconNotebook,
} from '@tabler/icons';
import { useEffect, useState } from 'react';

import { FOOTER_HEIGHT, HEADER_HEIGHT } from '../Layout';
import Icon from '../UI/Icon';

const SIDE_WIDTH = 250;
const BORDER_WIDTH = 2;
const BUTTON_OFFSET = 8;
const TABS_LIST = 40;

const useStyles = createStyles(
  (theme, { left, right }: { left: boolean; right: boolean }, getRef) => {
    const gameHeight = `calc(100vh - ${HEADER_HEIGHT + FOOTER_HEIGHT}px)`;
    const gameWidth = `calc(100vw - ${
      (left ? SIDE_WIDTH : 0) + (right ? SIDE_WIDTH : 0)
    }px)`;

    const radius = '50%';

    return {
      leftButton: {
        position: 'absolute',
        borderRadius: `0% ${radius} ${radius} 0%`,
        left: left ? SIDE_WIDTH : 0,
        top: BUTTON_OFFSET,
        justifyContent: 'left',
        minWidth: 0,
        width: 22,
        zIndex: 2,
      },
      rightButton: {
        position: 'absolute',
        borderRadius: `${radius} 0% 0% ${radius}`,
        right: right ? SIDE_WIDTH : 0,
        top: BUTTON_OFFSET,
        justifyContent: 'right',
        minWidth: 0,
        width: 22,
        zIndex: 2,
      },
      sidebar: {
        ref: getRef('sidebar'),
        height: gameHeight,
        borderRadius: 0,
        borderLeftWidth: BORDER_WIDTH,
        borderRightWidth: BORDER_WIDTH,
      },
      leftSidebar: {
        borderRightStyle: 'solid',
        borderRightColor: theme.fn.primaryColor(),
        zIndex: 2,
      },
      rightSidebar: {
        borderLeftStyle: 'solid',
        borderLeftColor: theme.fn.primaryColor(),
        zIndex: 2,
      },
      tab: {
        width: SIDE_WIDTH - BORDER_WIDTH,
      },
      tabList: {
        height: TABS_LIST,
      },
      main: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        height: gameHeight,
        minWidth: gameWidth,
      },
      scroll: {
        height: gameHeight,
      },
      scrollbar: {},
      scrollPanel: {
        height: `calc(100vh - ${HEADER_HEIGHT + FOOTER_HEIGHT + TABS_LIST}px)`,
      },
    };
  }
);

interface BoardLayoutProps {
  matchInfo: React.ReactNode;
  log: React.ReactNode;
  chat: React.ReactNode;
  children: React.ReactNode;
  allLeft?: boolean;
}

const Panel = ({ children, ...props }: TabsPanelProps) => {
  const { classes } = useStyles({ left: false, right: false });
  return (
    <Tabs.Panel {...props}>
      <ScrollArea className={classes.scrollPanel}>{children}</ScrollArea>
    </Tabs.Panel>
  );
};

const BoardLayout = ({
  matchInfo,
  log,
  chat,
  children,
  allLeft = false,
}: BoardLayoutProps) => {
  const [left, { toggle: toggleLeft }] = useDisclosure(true);
  const [right, { toggle: toggleRight }] = useDisclosure(false);
  const [leftTab, setLeftTab] = useState<string | null>('info');
  const [rightTab, setRightTab] = useState<string | null>('log');
  const { classes, cx } = useStyles({ left, right });

  const alwaysShow = useMediaQuery('(min-width: 1280px)');

  useEffect(() => {
    if (alwaysShow) {
      if (leftTab !== 'info') {
        setRightTab(leftTab);
        if (!right) {
          toggleRight();
        }
      }
      setLeftTab('info');
    }
  }, [alwaysShow, leftTab, right, toggleRight]);

  const leftChevron = <Icon icon={IconChevronLeft} size="md" />;
  const rightChevron = <Icon icon={IconChevronRight} size="md" />;

  const infoTab = (
    <Tabs.Tab value="info" icon={<Icon icon={IconInfoCircle} size="sm" />}>
      Info
    </Tabs.Tab>
  );

  const logTab = (
    <Tabs.Tab value="log" icon={<Icon icon={IconNotebook} size="sm" />}>
      Log
    </Tabs.Tab>
  );

  const chatTab = (
    <Tabs.Tab value="chat" icon={<Icon icon={IconMessages} size="sm" />}>
      Chat
    </Tabs.Tab>
  );

  const leftGroup = (
    <>
      <ActionIcon
        color="theme"
        variant="filled"
        size="md"
        onClick={toggleLeft}
        className={classes.leftButton}
      >
        {left ? leftChevron : rightChevron}
      </ActionIcon>

      {left && (
        <Paper className={cx(classes.sidebar, classes.leftSidebar)}>
          <Tabs
            value={leftTab}
            onTabChange={setLeftTab}
            className={classes.tab}
          >
            <Tabs.List grow className={classes.tabList}>
              {infoTab}
              {(allLeft || !alwaysShow) && (
                <>
                  {logTab}
                  {chatTab}
                </>
              )}
            </Tabs.List>

            <Panel value="info">{matchInfo}</Panel>
            <Panel value="log">{log}</Panel>
            <Panel value="chat">{chat}</Panel>
          </Tabs>
        </Paper>
      )}
    </>
  );

  const rightGroup = (
    <>
      <ActionIcon
        color="theme"
        variant="filled"
        size="md"
        onClick={toggleRight}
        className={classes.rightButton}
      >
        {right ? rightChevron : leftChevron}
      </ActionIcon>
      {right && (
        <Paper className={cx(classes.sidebar, classes.rightSidebar)}>
          <Tabs
            value={rightTab}
            onTabChange={setRightTab}
            className={classes.tab}
          >
            <Tabs.List grow className={classes.tabList}>
              {logTab}
              {chatTab}
            </Tabs.List>

            <Panel value="log">{log}</Panel>
            <Panel value="chat">{chat}</Panel>
          </Tabs>
        </Paper>
      )}
    </>
  );

  return (
    <Group spacing={0} noWrap>
      {leftGroup}

      <Box className={classes.main}>
        <ScrollArea
          className={classes.scroll}
          classNames={{ scrollbar: classes.scrollbar }}
        >
          <Box px="xl" py="md" w="100%">
            {children}
          </Box>
        </ScrollArea>
      </Box>

      {alwaysShow && rightGroup}
    </Group>
  );
};
export default BoardLayout;
