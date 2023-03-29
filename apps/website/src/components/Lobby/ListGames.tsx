import {
  ActionIcon,
  Group,
  Paper,
  Table,
  TableProps,
  Text,
  ThemeIcon,
  Tooltip,
  UnstyledButton,
  createStyles,
} from '@mantine/core';
import { IconCards, IconPlayerPlay, IconPlus } from '@tabler/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { MatchData } from '../../store/lobby';

const useStyles = createStyles((theme) => ({
  table: {
    whiteSpace: 'nowrap',

    '& thead': {
      position: 'sticky',
      top: 0,
      '& tr th': {
        fontSize: theme.fontSizes.md,
      },
      height: 40,
      backgroundColor:
        theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,

      boxShadow: theme.shadows.xs,

      '&::after': {
        content: '""',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        borderBottom: `1px solid ${
          theme.colorScheme === 'dark'
            ? theme.colors.dark[3]
            : theme.colors.gray[2]
        }`,
      },
    },

    '& tbody tr td': {
      padding: 0,
      '& a': {
        display: 'block',
        padding: `${theme.fn.size({
          size: 7,
          sizes: theme.spacing,
        })}px ${theme.fn.size({ size: 'xs', sizes: theme.spacing })}px`,
      },
    },
  },
  icon: {
    position: 'static',
  },
}));

export interface ListGamesProps extends TableProps {
  matches: MatchData[];
}

const ListGames = ({ matches, ...props }: ListGamesProps) => {
  const { classes } = useStyles();

  const data = matches.map(
    ({ matchID, createdAt, players, setupData = undefined }) => {
      const created = new Date(createdAt).toLocaleString();
      const numPlayers = players.length;
      const joined = players.filter((p) => p.name !== undefined).length;

      const path = joined === numPlayers ? 'game' : 'pre-game';

      const Td = ({ children }) => {
        return (
          <td>
            <Text component={Link} href={`/${path}/${matchID}`}>
              {children}
            </Text>
          </td>
        );
      };

      return (
        <tr key={matchID}>
          <Td>{matchID}</Td>
          <Td>{created}</Td>
          <Td>{players[0].name || 'Player 0'}</Td>

          <>
            <Td>{joined}</Td>
            <Td>{numPlayers}</Td>
          </>
          <Td>{setupData?.selectionName || 'Custom'}</Td>
          <Td>
            {joined === numPlayers ? (
              <Tooltip label="Spectate/Re-join">
                <ActionIcon
                  variant="transparent"
                  className={classes.icon}
                  color="theme"
                >
                  <IconPlayerPlay />
                </ActionIcon>
              </Tooltip>
            ) : (
              <Tooltip label="Join">
                <ActionIcon
                  variant="transparent"
                  className={classes.icon}
                  color="theme"
                >
                  <IconPlus />
                </ActionIcon>
              </Tooltip>
            )}
          </Td>
        </tr>
      );
    }
  );

  // TODO table with sort and search

  return (
    <Paper withBorder>
      <Table {...props} className={classes.table}>
        <thead>
          <tr>
            <th>Match ID</th>
            <th>Created At</th>
            <th>Creator</th>
            <th>Joined</th>
            <th>Players</th>
            <th>Menu</th>
            <th>
              <Tooltip label="Action">
                <ActionIcon
                  variant="transparent"
                  className={classes.icon}
                  color="theme"
                >
                  <IconCards />
                </ActionIcon>
              </Tooltip>
            </th>
          </tr>
        </thead>
        <tbody>
          {matches.length > 0 ? (
            data
          ) : (
            <tr>
              <td colSpan={7}>
                <Text ta="center" tt="uppercase" py="md">
                  no public games
                </Text>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Paper>
  );
};

export default ListGames;
