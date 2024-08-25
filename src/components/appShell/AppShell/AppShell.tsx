"use client";

import React, {useState} from "react";
import {
    Burger,
    Group,
    AppShell as MantineAppShell,
    Text,
    NavLink, Button, Stack, Modal, Flex,
} from "@mantine/core";
import Link from "next/link";
import { useDisclosure } from "@mantine/hooks";
import {useLogoutApi} from "@/hooks/auth";
import {IconLogout} from "@tabler/icons-react";
import PopUp from "@/common/components/PopUp";

type Props = {
  children: React.ReactNode;
};

const AppShell = ({ children }: Props) => {
  const [opened, { toggle }] = useDisclosure();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { mutate: logout, isLoading: logoutIsLoading } = useLogoutApi();
  return (
    <>
      <PopUp title="Logout" opened={showLogoutModal} onClose={() => setShowLogoutModal(false)}>
          <Stack>
              <Text>Are you sure you want to logout?</Text>
              <Flex gap="xs">
                  <Button color="red" onClick={() => logout()}>Logout!</Button>
                  <Button c="red" color="transparent" onClick={() => setShowLogoutModal(false)}>Cancel</Button>
              </Flex>
          </Stack>
      </PopUp>
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
          <Stack gap={0} flex={1}>
            <NavLink href="/profile" label="Profile" />
            <NavLink href="#" label="Borrowings" />
          </Stack>
          <Button color="red" onClick={() => setShowLogoutModal(true)} rightSection={<IconLogout />}>logout</Button>
        </MantineAppShell.Navbar>
        <MantineAppShell.Main>{children}</MantineAppShell.Main>
      </MantineAppShell>
    </>
  );
};

export default AppShell;
