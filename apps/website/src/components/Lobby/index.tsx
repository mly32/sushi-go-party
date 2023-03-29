import { Box, Text, Title } from '@mantine/core';
import { useEffect, useState } from 'react';

import { CONFIG } from '../../config';
import { MatchData, useListMatchesQuery } from '../../store/lobby';
import ListGames from './ListGames';

const Lobby = () => {
  const [matches, setMatches] = useState<MatchData[]>([]);

  const { data: allMatches } = useListMatchesQuery(false, {
    // pollingInterval: CONFIG.lobbyPollingInterval,
  });

  useEffect(() => {
    if (allMatches) {
      setMatches(allMatches.filter((match) => !match.gameover));
    }
  }, [allMatches]);

  return (
    <Box>
      <Title>Lobby</Title>
      <ListGames matches={matches} highlightOnHover />
    </Box>
  );
};

export default Lobby;
