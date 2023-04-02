import { Flex, FlexProps, NavLink, Popover, createStyles } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { NAV_ITEMS } from '../../constants';
import Icon from '../UI/Icon';

const useStyles = createStyles((theme, { vertical }: { vertical: boolean }) => {
  if (vertical) {
    return {
      link: { width: '100%' },
      dropDown: {},
      dropDownItem: {},
      rightSection: {},
    };
  }
  return {
    link: { borderRadius: theme.radius.sm, width: 'fit-content' },
    dropDown: { padding: 4 },
    dropDownItem: {
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      width: '100%',
    },
    rightSection: { marginLeft: 5 },
  };
});

export interface LayoutNavbarProps extends FlexProps {
  vertical: boolean;
}

const LayoutNavbar = ({ vertical, ...flexProps }: LayoutNavbarProps) => {
  const router = useRouter();
  const { classes, theme, cx } = useStyles({ vertical });

  const links = NAV_ITEMS.map((navItem) => {
    if (navItem.kind === 'many') {
      const manyActive =
        navItem.links.findIndex(({ link }) => link === router.pathname) !== -1;
      const items = navItem.links.map(({ label, link }) => (
        <NavLink
          key={label}
          label={label}
          active={link === router.pathname}
          className={cx(classes.link, classes.dropDownItem)}
          component={Link}
          href={link}
        />
      ));

      if (vertical) {
        return (
          <NavLink
            key={navItem.label}
            label={navItem.label}
            active={manyActive}
            variant="subtle"
            childrenOffset={theme.spacing.lg}
            defaultOpened
            className={classes.link}
          >
            {items}
          </NavLink>
        );
      }

      return (
        <Popover key={navItem.label}>
          <Popover.Target>
            <NavLink
              key={navItem.label}
              label={navItem.label}
              active={manyActive}
              rightSection={<Icon icon={IconChevronDown} size="sm" />}
              variant="subtle"
              className={classes.link}
              classNames={{ rightSection: classes.rightSection }}
            />
          </Popover.Target>
          <Popover.Dropdown className={classes.dropDown}>
            {items}
          </Popover.Dropdown>
        </Popover>
      );
    }

    return (
      <NavLink
        key={navItem.label}
        className={classes.link}
        active={navItem.link === router.pathname}
        component={Link}
        href={navItem.link}
        label={navItem.label}
      />
    );
  });

  return (
    <Flex
      direction={vertical ? 'column' : 'row'}
      gap={vertical ? 0 : 5}
      {...flexProps}
    >
      {links}
    </Flex>
  );
};

export default LayoutNavbar;
