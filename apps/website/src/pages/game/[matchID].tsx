import { Title } from '@mantine/core';
import Head from 'next/head';
import { useRouter } from 'next/router';

import AuthWrapper from '../../components/Auth/AuthWrapper';
import OnlineGame from '../../components/Lobby/OnlineGame';

const GameSlug = () => {
  const router = useRouter();
  const { matchID } = router.query;

  return (
    <>
      <Head>
        <link rel="preload" as="image" href="/assets/cards.jpg" />
        <link rel="preload" as="image" href="/assets/tiles.jpg" />
      </Head>

      {typeof matchID !== 'string' ? (
        <Title>Invalid match ID</Title>
      ) : (
        <OnlineGame matchID={matchID} />
      )}
    </>
  );
};

const WrappedGameSlug = () => (
  <AuthWrapper>
    <GameSlug />
  </AuthWrapper>
);

export default WrappedGameSlug;
