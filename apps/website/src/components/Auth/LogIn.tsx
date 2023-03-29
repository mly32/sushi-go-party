import { Button, ButtonProps, Group, Modal, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';

export interface LoginProps extends ButtonProps {
  playerName?: string;
  handleSubmit: (playerName: string) => void;
}

const LogIn = ({
  playerName: initPlayerName = '',
  handleSubmit: callback,
  ...props
}: LoginProps) => {
  const [opened, { close, open }] = useDisclosure(false);

  const form = useForm({
    validateInputOnChange: true,
    initialValues: {
      playerName: initPlayerName,
    },
    validate: {
      playerName: (value) =>
        /^\w+$/.test(value)
          ? value.length < 20
            ? null
            : 'Too long'
          : 'Invalid name',
    },
  });

  const handleSubmit: Parameters<typeof form.onSubmit>[0] = (values) => {
    callback(values.playerName);
  };

  return (
    <>
      <Modal opened={opened} onClose={close} title="Log In">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            withAsterisk
            label="Player name"
            {...form.getInputProps('playerName')}
          />

          <Group position="right" mt="md">
            <Button type="submit">Submit</Button>
          </Group>
        </form>
      </Modal>

      <Button onClick={open} {...props}>
        Log In
      </Button>
    </>
  );
};

export default LogIn;
