import { Button, Group, GroupProps, Text } from '@mantine/core';

import { useAppDispatch } from '../../store';
import { useAppSelector } from '../../store';
import { setPlayerName } from '../../store/user';
import Login from './LogIn';
import SignUp from './SignUp';

export interface AuthProps extends GroupProps {
  hideButtons?: boolean;
}

const Auth = ({ hideButtons = false, ...props }: AuthProps) => {
  const playerName = useAppSelector((s) => s.user.playerName);
  const dispatch = useAppDispatch();

  const handleSubmit = (playerName: string) => {
    dispatch(setPlayerName(playerName));
    /*
    TODO
      if (state.roomData) {
        const params = {
          ...state.roomData,
          newName: valves.playerName
        }
        const [updatePlayer] = useUpdatePlayerMutation();
        updatePlayer(params);
      }
      */
    close();
  };

  const handleLogout = () => {
    dispatch(setPlayerName(''));
    // TODO
  };

  const Name = () => (
    <Text
      fz="lg"
      sx={{
        maxWidth: 225,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {playerName}
    </Text>
  );

  if (hideButtons) {
    return (
      playerName !== '' && (
        <Group {...props}>
          <Name />
        </Group>
      )
    );
  }

  return (
    <Group {...props}>
      {playerName !== '' ? (
        <>
          <Name />
          <Button onClick={handleLogout}>Log out</Button>
        </>
      ) : (
        <>
          <Login handleSubmit={handleSubmit} />
          <SignUp variant="default" handleSubmit={handleSubmit} disabled />
        </>
      )}
    </Group>
  );
};

export default Auth;
