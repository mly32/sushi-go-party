import {
  Button,
  Container,
  Group,
  Text,
  Title,
  createStyles,
} from '@mantine/core';
import { useRouter } from 'next/router';

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: 80,
    paddingBottom: 120,
    backgroundColor: theme.fn.variant({
      variant: 'filled',
      color: theme.primaryColor,
    }).background,
    minHeight: '100vh',
  },

  label: {
    textAlign: 'center',
    fontWeight: 900,
    fontSize: 220,
    lineHeight: 1,
    marginBottom: theme.spacing.xl * 1.5,
    color: theme.colors[theme.primaryColor][3],

    [theme.fn.smallerThan('sm')]: {
      fontSize: 120,
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    textAlign: 'center',
    fontWeight: 900,
    fontSize: 38,
    color: theme.white,

    [theme.fn.smallerThan('sm')]: {
      fontSize: 32,
    },
  },

  description: {
    maxWidth: 540,
    margin: 'auto',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl * 1.5,
    color: theme.colors[theme.primaryColor][1],
  },
}));

const ServerErrorPage = () => {
  const router = useRouter();
  const { classes } = useStyles();

  const refresh = () => {
    router.reload();
  };

  return (
    <div className={classes.root}>
      <Container>
        <div className={classes.label}>500</div>
        <Title size="h1" className={classes.title}>
          Something bad just happened...
        </Title>
        <Text size="lg" align="center" className={classes.description}>
          Our servers could not handle your request. Try refreshing the page.
        </Text>
        <Group position="center">
          <Button variant="white" size="md" onClick={refresh}>
            Refresh the page
          </Button>
        </Group>
      </Container>
    </div>
  );
};

export default ServerErrorPage;
