import { Button, ButtonProps, Group, Modal, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
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
        Hi
      </Modal>

      <Button onClick={open} {...props}>
        Sign Up
      </Button>
    </>
  );
};

export default SignUp;
