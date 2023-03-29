import { Title } from '@mantine/core';
import { useRouter } from 'next/router';

import AuthWrapper from '../../components/Auth/AuthWrapper';
import PreGame from '../../components/Lobby/PreGame';

const PreGameSlug = () => {
  const router = useRouter();
  const { matchID } = router.query;

  return typeof matchID !== 'string' ? (
    <Title>Invalid match ID</Title>
  ) : (
    <PreGame matchID={matchID} />
  );
};

const WrappedPreGameSlug = () => (
  <AuthWrapper>
    <PreGameSlug />
  </AuthWrapper>
);

export default WrappedPreGameSlug;
