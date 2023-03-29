import { Center, Title } from '@mantine/core';

import { useAppSelector } from '../../store';

export interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const playerName = useAppSelector((s) => s.user.playerName);

  if (playerName === '') {
    return (
      <Center>
        <Title>Log in first!</Title>
      </Center>
    );
  }

  return <>{children}</>;
};

export default AuthWrapper;
