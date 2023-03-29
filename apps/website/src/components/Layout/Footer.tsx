import {
  ActionIcon,
  Container,
  Footer,
  FooterProps,
  Group,
  Text,
  createStyles,
} from '@mantine/core';
import { IconBrandGithub } from '@tabler/icons';

import { GITHUB_LINK, TITLE } from '../../constants';
import ColorSchemeToggle from '../UI/ColorSchemeToggle';
import Icon from '../UI/Icon';

const useStyles = createStyles((theme) => ({
  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },
}));

const LayoutFooter = (props: Omit<FooterProps, 'children'>) => {
  const { classes } = useStyles();
  const year = new Date().getFullYear();
  // TODO z index

  return (
    <Footer {...props}>
      <Container className={classes.inner} size="xl">
        <Text fz="sm">
          © {year} {TITLE}
        </Text>
        <Group spacing="xs">
          <ActionIcon
            size="lg"
            radius="lg"
            component="a"
            href={GITHUB_LINK}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon icon={IconBrandGithub} size="md" />
          </ActionIcon>
          <ColorSchemeToggle />
        </Group>
      </Container>
    </Footer>
  );
};

export default LayoutFooter;
