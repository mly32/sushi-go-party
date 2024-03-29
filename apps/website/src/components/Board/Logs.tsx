import { Flex, Notification, Text } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons';

import { Props } from './common';
import { playerIDColor, useStyles } from './styles';

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
            <Text>
              {playerID ? (
                <Text span c={playerIDColor[playerID]} fw="bold">
                  {matchData[playerID].name ?? playerID}
                </Text>
              ) : (
                <IconInfoCircle
                  className={classes.logIcon}
                  size={theme.fontSizes.lg}
                />
              )}{' '}
              {msg}
            </Text>
          </Notification>
        ))}
    </Flex>
  );
};
export default Logs;
