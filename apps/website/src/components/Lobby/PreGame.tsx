import {
  Accordion,
  ActionIcon,
  Button,
  Code,
  CopyButton,
  Group,
  List,
  Mark,
  Paper,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { IconCheck, IconCopy, IconEye, IconPlayerPlay } from '@tabler/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';

import { CONFIG } from '../../config';
import { useAppSelector } from '../../store';
import {
  useGetMatchQuery,
  useJoinMatchMutation,
  useLeaveMatchMutation,
} from '../../store/lobby';
import CreateMatch, { CreateMatchData, GameType } from '../CreateMatch';
import Icon from '../UI/Icon';
import Loading from '../UI/Loading';

export interface PreGameProps {
  matchID: string;
}

const PreGame = ({ matchID }: PreGameProps) => {
  const [done, setDone] = useState(false);
  const playerName = useAppSelector((s) => s.user.playerName);
  const roomData = useAppSelector((s) => s.user.roomData);
  const { asPath } = useRouter();
  const [joinMatch] = useJoinMatchMutation();
  const [leaveMatch] = useLeaveMatchMutation();

  const shareLink =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin + asPath
      : asPath;

  const handleJoin = async () => {
    if (playerName && matchID && roomData?.matchID !== matchID) {
      if (roomData) {
        await leaveMatch(roomData);
        console.log('left');
      }
      await joinMatch({ matchID, playerName });
    }
  };

  /* poll for match data to see if more players have joined */
  const { data: matchMetadata } = useGetMatchQuery(matchID ?? skipToken, {
    pollingInterval: done ? 0 : CONFIG.joinPollingInterval,
  });

  const joinedPlayers = useMemo(() => {
    if (matchMetadata) {
      const res =
        matchMetadata.players.filter((p) => p.name !== undefined).length || 0;
      if (res === matchMetadata.players.length) {
        setDone(true);
      }
      return res;
    } else {
      return 0;
    }
  }, [matchMetadata]);

  if (!matchMetadata) {
    return <Loading />;
  }

  const sameRoom = roomData?.matchID === matchID;

  const matchData: CreateMatchData = {
    setupData: matchMetadata.setupData,
    gameType: matchMetadata.unlisted ? GameType.Private : GameType.Public,
  };

  const joined = (
    <List withPadding my="sm">
      {matchMetadata.players?.map((player) => {
        if (!player.name) {
          return <List.Item key={player.id}>Waiting for player...</List.Item>;
        }
        const isPlayer =
          roomData &&
          roomData.matchID === matchID &&
          roomData.playerID === player.id.toString();

        if (isPlayer) {
          return (
            <List.Item key={player.id}>
              <Mark color="theme">{player.name}</Mark>
            </List.Item>
          );
        }

        return <List.Item key={player.id}>{player.name}</List.Item>;
      })}
    </List>
  );

  return (
    <>
      <Title>Match ID: {matchID}</Title>

      <Group>
        <Text>Share link:</Text>
        <Code color="theme">{shareLink}</Code>
        <CopyButton value={shareLink} timeout={2000}>
          {({ copied, copy }) => (
            <Tooltip label={copied ? 'Copied' : 'Copy'} position="right">
              <ActionIcon
                variant="outline"
                color={copied ? 'teal' : 'gray'}
                onClick={copy}
              >
                <Icon icon={copied ? IconCheck : IconCopy} size="md" />
              </ActionIcon>
            </Tooltip>
          )}
        </CopyButton>
      </Group>

      <Group my="sm" position="apart">
        <Button
          disabled={roomData?.matchID === matchID || done}
          onClick={handleJoin}
        >
          Join game
        </Button>
        <Button.Group>
          <Button
            disabled={!done || !sameRoom}
            component={Link}
            leftIcon={<IconPlayerPlay />}
            href={`/game/${matchID}`}
          >
            Start game
          </Button>

          <Button
            component={Link}
            href={`/game/${matchID}`}
            disabled={sameRoom}
            leftIcon={<IconEye />}
            variant="default"
          >
            Spectate
          </Button>
        </Button.Group>
      </Group>

      {roomData && !sameRoom && (
        <Text>You have already joined in a different game</Text>
      )}

      <Text>
        Players: {joinedPlayers}/{matchMetadata.players.length}
      </Text>

      {joined}

      {matchData.setupData && (
        <Paper withBorder radius="md">
          <Accordion defaultValue="matchData">
            <Accordion.Item value="matchData">
              <Accordion.Control>Match Data</Accordion.Control>
              <Accordion.Panel>
                <CreateMatch
                  title={false}
                  matchData={matchData}
                  handleSubmit={() => {}}
                />
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Paper>
      )}
    </>
  );
};

export default PreGame;
