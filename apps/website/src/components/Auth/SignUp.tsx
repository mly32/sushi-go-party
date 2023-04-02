import { Button, ButtonProps, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

export interface SignUpProps extends ButtonProps {
  playerName?: string;
  handleSubmit: (playerName: string) => void;
}

const SignUp = ({
  playerName: initPlayerName = '',
  handleSubmit,
  ...props
}: SignUpProps) => {
  const [opened, { close, open }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Sign Up">
        ... to come
      </Modal>

      <Button onClick={open} {...props}>
        Sign Up
      </Button>
    </>
  );
};

export default SignUp;
