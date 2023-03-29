import { Center, Loader, createStyles } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  container: {
    height: '100vh',
  },
}));

const Loading = () => {
  const { classes } = useStyles();
  return (
    <Center className={classes.container}>
      <Loader size="xl" />
    </Center>
  );
};

export default Loading;
