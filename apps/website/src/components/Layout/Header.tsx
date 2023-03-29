import {
  Avatar,
  Burger,
  Button,
  Container,
  Group,
  Header,
  HeaderProps,
  MediaQuery,
  Text,
  createStyles,
} from '@mantine/core';

import { LOGO_URL, MOBILE_BREAKPOINT, TITLE } from '../../constants';
import Auth from '../Auth';
import LayoutNavbar from './Navbar';

const useStyles = createStyles((theme) => ({
  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },

  hiddenMobile: {
    [theme.fn.smallerThan(MOBILE_BREAKPOINT)]: {
      display: 'none',
    },
  },

  hiddenDesktop: {
    [theme.fn.largerThan(MOBILE_BREAKPOINT)]: {
      display: 'none',
    },
  },

  title: { color: theme.primaryColor },
}));

export interface LayoutHeaderProps extends Omit<HeaderProps, 'children'> {
  opened: boolean;
  toggleOpened: () => void;
}

function LayoutHeader({ opened, toggleOpened, ...props }: LayoutHeaderProps) {
  const { classes, theme } = useStyles();

  return (
    <Header {...props}>
      <Container className={classes.inner} size="xl">
        <Group spacing="xs">
          <Burger
            opened={opened}
            size="md"
            onClick={toggleOpened}
            className={classes.hiddenDesktop}
          />
          <Avatar
            src={LOGO_URL}
            size="md"
            alt={TITLE}
            className={classes.hiddenMobile}
          />
          <Text
            color={theme.primaryColor}
            fz="xl"
            fw="bold"
            className={classes.hiddenDesktop}
          >
            {TITLE}
          </Text>

          <LayoutNavbar className={classes.hiddenMobile} vertical={false} />
        </Group>

        <MediaQuery
          smallerThan={MOBILE_BREAKPOINT}
          styles={{ display: 'none' }}
        >
          <Auth spacing="sm" />
        </MediaQuery>

        <MediaQuery largerThan={MOBILE_BREAKPOINT} styles={{ display: 'none' }}>
          {opened ? <></> : <Auth spacing="sm" hideButtons={true} />}
        </MediaQuery>
      </Container>
    </Header>
  );
}

export default LayoutHeader;
