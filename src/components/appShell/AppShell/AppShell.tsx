"use client";

import React from "react";
import {
  Burger,
  Group,
  AppShell as MantineAppShell,
  NavLink,
} from "@mantine/core";
import Link from "next/link";
import { useDisclosure } from "@mantine/hooks";

type Props = {
  children: React.ReactNode;
};

const AppShell = ({ children }: Props) => {
  const [opened, { toggle }] = useDisclosure();
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
          <Link href="/">Ketaab Khooneh</Link>
        </Group>
      </MantineAppShell.Header>
      <MantineAppShell.Navbar p="md">
        <NavLink href="/profile" label="Profile" />
        <NavLink href="#" label="Borrowings" />
      </MantineAppShell.Navbar>
      <MantineAppShell.Main>{children}</MantineAppShell.Main>
    </MantineAppShell>
  );
};

export default AppShell;
