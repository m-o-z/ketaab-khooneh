"use client";

import React from "react";
import { Box } from "@mantine/core";
import {
  BottomNavigation,
  BottomNavigationActiveChangeEvent,
  BottomNavigationItem,
  BottomNavigationItemSlots,
} from "@tapsioss/react-components";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowUpArrowDown,
  ListBullet,
  PencilLineFill,
  PersonFill,
} from "@tapsioss/react-icons";

type Props = {
  children: React.ReactNode;
};

const AppShell = ({ children }: Props) => {
  const router = useRouter();
  const sidebarItems = [
    {
      title: "Books",
      titleFa: "کتاب‌ها",
      url: "/book",
      Icon: ListBullet,
    },
    {
      title: "Authors",
      titleFa: "نویسندگان",
      url: "/author",
      Icon: PencilLineFill,
    },
    {
      title: "Borrows",
      titleFa: "امانت‌ها",
      url: "/borrow",
      Icon: ArrowUpArrowDown,
    },
    {
      title: "Profile",
      titleFa: "پروفایل",
      url: "/profile",
      Icon: PersonFill,
    },
  ];

  const currentPath = usePathname();

  const handleBottomNavigationClick = (
    e: BottomNavigationActiveChangeEvent,
  ) => {
    router.push(e.details.value);
  };

  return (
    <Box mx="auto" maw={500} pos="fixed" top={0} bottom={0} left={0} right={0}>
      <Box
        pb={100}
        component="main"
        pos="absolute"
        top={0}
        bottom={0}
        left={0}
        right={0}
        style={{
          overflow: "auto",
        }}
      >
        {children}
      </Box>
      <BottomNavigation
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
        }}
        onActivechange={handleBottomNavigationClick}
      >
        {sidebarItems.map((item) => (
          <BottomNavigationItem
            key={item.title}
            active={currentPath === item.url}
            value={item.url}
          >
            <div slot={BottomNavigationItemSlots.ICON}>
              <item.Icon />
            </div>
            {item.titleFa}
          </BottomNavigationItem>
        ))}
      </BottomNavigation>
    </Box>
  );
};

export default AppShell;
