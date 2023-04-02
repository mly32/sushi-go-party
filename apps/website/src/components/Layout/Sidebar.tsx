import { Divider, Navbar, NavbarProps, ScrollArea } from '@mantine/core';

import Auth from '../Auth';
import LayoutNavbar from './Navbar';

const Sidebar = (props: Omit<NavbarProps, 'children'>) => {
  return (
    <Navbar p="md" {...props}>
      <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
        <LayoutNavbar vertical={true} />
      </Navbar.Section>

      <Navbar.Section>
        <Divider my="sm" />
        <Auth grow position="apart" px="md" />
      </Navbar.Section>
    </Navbar>
  );
};
export default Sidebar;
