import { showNotification } from '@mantine/notifications';
import { IconX } from '@tabler/icons';
import { useRouter } from 'next/router';

import AuthWrapper from '../components/Auth/AuthWrapper';
import { CreateMatchData, GameType } from '../components/CreateMatch';
import CreateMatch from '../components/CreateMatch';
import { useAppSelector } from '../store';
import { useCreateMatchMutation, useLeaveMatchMutation } from '../store/lobby';

const Create = () => {
  const router = useRouter();
  const roomData = useAppSelector((s) => s.user.roomData);
  const [createMatch] = useCreateMatchMutation();
  const [leaveMatch] = useLeaveMatchMutation();

  const handleSubmit = async ({ setupData, gameType }: CreateMatchData) => {
    try {
      if (roomData) {
        try {
          await leaveMatch(roomData).unwrap();
        } catch (e) {
          console.log('leaving failed. non existant');
        }
      }

      const createdMatchID = await createMatch({
        numPlayers: setupData.numPlayers,
        setupData,
        unlisted: gameType === GameType.Private,
      });

      if ('data' in createdMatchID) {
        router.push(`/pre-game/${createdMatchID.data}`);
      } else {
        throw createdMatchID.error;
      }
    } catch (err) {
      const msg = err?.data?.message || '...';

      showNotification({
        icon: <IconX />,
        color: 'red',
        title: 'Submission error',
        message: msg,
      });
    }
  };
  // TODO warn if roomData that creating will leave room

  return <CreateMatch handleSubmit={handleSubmit} />;
};

const WrappedCreate = () => (
  <AuthWrapper>
    <Create />
  </AuthWrapper>
);

export default WrappedCreate;
