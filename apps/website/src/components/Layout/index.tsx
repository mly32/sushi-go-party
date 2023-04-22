import {
  AppShell,
  Container,
  MediaQuery,
  ScrollArea,
  createStyles,
} from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { MOBILE_BREAKPOINT } from '../../constants';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';

export const HEADER_HEIGHT = 60;
export const FOOTER_HEIGHT = 60;
export const MIN_SIZE = 300;

export enum Show {
  Contained,
  Free,
  None,
}

const useStyles = createStyles((theme, { show }: { show: Show }) => ({
  notifications: {
    bottom: `${theme.spacing.md + FOOTER_HEIGHT}px !important`,
  },
  bound: {
    minWidth: MIN_SIZE,
    height:
      show === Show.None
        ? '100vh'
        : `calc(100vh - ${HEADER_HEIGHT + FOOTER_HEIGHT}px)`,
    marginTop: show === Show.None ? 0 : HEADER_HEIGHT,
    marginBottom: show === Show.None ? 0 : FOOTER_HEIGHT,
    background:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[7]
        : theme.colors.gray[0],

    [`@media (max-height: ${MIN_SIZE}px)`]: {
      ...(show !== Show.Free ? { height: MIN_SIZE } : {}),
    },
  },
}));
export interface LayoutProps {
  children: React.ReactNode;
  show?: Show;
}

export const Layout = ({ children, show = Show.Contained }: LayoutProps) => {
  const router = useRouter();
  const { classes } = useStyles({ show });
  const [opened, setOpened] = useState(false);

  const toggleOpened = () => {
    setOpened(!opened);
  };

  useEffect(() => {
    setOpened(false);
  }, [router.pathname]);

  return (
    <NotificationsProvider className={classes.notifications}>
      <ScrollArea className={classes.bound}>
        <AppShell
          fixed={false}
          hidden={show === Show.None}
          navbar={
            <MediaQuery
              largerThan={MOBILE_BREAKPOINT}
              styles={{ display: 'none' }}
            >
              <Sidebar hidden={!opened} fixed={true} />
            </MediaQuery>
          }
          header={
            <Header
              height={HEADER_HEIGHT}
              fixed={true}
              opened={opened}
              toggleOpened={toggleOpened}
            />
          }
          footer={<Footer height={FOOTER_HEIGHT} fixed={true} />}
          padding={0}
        >
          {show === Show.Contained ? (
            <Container size="lg" p="md">
              {children}
            </Container>
          ) : (
            <>{children}</>
          )}
        </AppShell>
      </ScrollArea>
    </NotificationsProvider>
  );
};
