"use client";

import React, { useState } from "react";
import {
  Burger,
  Group,
  AppShell as MantineAppShell,
  Text,
  NavLink,
  Button,
  Stack,
  Modal,
  Flex,
  rem,
  Menu,
} from "@mantine/core";
import Link from "next/link";
import { useDisclosure } from "@mantine/hooks";
import { useLogoutApi } from "@/hooks/auth";
import {
  IconBooks,
  IconFeather,
  IconHandGrab,
  IconLogout,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import PopUp from "@/common/components/PopUp";
import Logout from "@/components/appShell/Logout";
import SidebarItem from "@/components/appShell/SidebarItem";

type Props = {
  children: React.ReactNode;
};

const AppShell = ({ children }: Props) => {
  const [opened, { toggle }] = useDisclosure();
  const sidebarItems = [
    {
      title: "Books",
      url: "/book",
      icon: IconBooks,
    },
    {
      title: "Authors",
      url: "/author",
      icon: IconFeather,
    },
    {
      title: "Borrows",
      url: "/borrow",
      icon: IconHandGrab,
    },
    {
      title: "Profile",
      url: "/profile",
      icon: IconUser,
    },
  ];
  return (
    <MantineAppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened, desktop: !opened },
      }}
      padding="md"
    >
      <MantineAppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} size="sm" />
          <Link href="/book">Ketaab Khooneh</Link>
        </Group>
      </MantineAppShell.Header>
      <MantineAppShell.Navbar p="md">
        <Stack gap={0} flex={1}>
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.title}
              title={item.title}
              url={item.url}
              icon={item.icon}
            />
          ))}
        </Stack>
        <Logout />
      </MantineAppShell.Navbar>
      <MantineAppShell.Main>{children}</MantineAppShell.Main>
    </MantineAppShell>
  );
};

export default AppShell;
