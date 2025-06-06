"use client";

import React, { CSSProperties, useEffect } from "react";
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
import styles from "./AppShell.module.scss";
import { usePWA } from "@/providers/PWAProvider";

type Props = {
  children: React.ReactNode;
};

const AppShell = ({ children }: Props) => {
  const { safeAreaInsets, setHasBottomNavigation } = usePWA();
  const router = useRouter();
  const sidebarItems = [
    {
      title: "Books",
      titleFa: "کتاب‌ها",
      url: "/books",
      Icon: ListBullet,
    },
    {
      title: "Authors",
      titleFa: "نویسندگان",
      url: "/authors",
      Icon: PencilLineFill,
    },
    {
      title: "Borrows",
      titleFa: "امانت‌ها",
      url: "/borrows",
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

  const generateCSSVars = () => {
    if (safeAreaInsets.bottom > 0) {
      return {
        "--height": "5.5rem",
        "--padding-bottom": "1.25rem",
      };
    } else {
      return {
        "--height": "4.5rem",
        "--padding-bottom": "0px",
      };
    }
  };

  useEffect(() => {
    setHasBottomNavigation();
  }, []);

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
        className={styles.bottomNavigation}
        style={
          {
            ...generateCSSVars(),
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
          } as CSSProperties
        }
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
