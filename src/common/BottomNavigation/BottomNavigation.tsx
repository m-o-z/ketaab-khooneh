"use client";
import {
  BottomNavigation as TapsiBottomNavigation,
  BottomNavigationActiveChangeEvent,
  BottomNavigationItem,
  BottomNavigationItemSlots,
} from "@tapsioss/react-components";
import {
  ArrowUpArrowDown,
  ListBullet,
  PencilLineFill,
  PersonFill,
} from "@tapsioss/react-icons";
import { usePathname, useRouter } from "next/navigation";
import React, { CSSProperties } from "react";

import { usePWA } from "@/providers/PWAProvider";

import styles from "./BottomNavigation.module.scss";
import Container from "../Container/Container";

const BottomNavigation = () => {
  const { safeAreaInsets } = usePWA();
  const router = useRouter();

  const generateCSSVars = () => {
    if (safeAreaInsets.bottom > 0) {
      return {
        "--height": "5.5rem",
        "--padding-bottom": "1.25rem",
      };
    }
    return {
      "--height": "4.5rem",
      "--padding-bottom": "0px",
    };
  };
  const currentPath = usePathname();

  const handleBottomNavigationClick = (
    e: BottomNavigationActiveChangeEvent,
  ) => {
    console.log({ e });
    router.push(e.details.value);
  };
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
  return (
    <div className="fixed left-0 right-0 bottom-0 z-1">
      <Container height="h-auto">
        <TapsiBottomNavigation
          className={styles.bottomNavigation}
          style={
            {
              ...generateCSSVars(),
            } as CSSProperties
          }
          onActiveChange={handleBottomNavigationClick}
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
        </TapsiBottomNavigation>
      </Container>
    </div>
  );
};

export default BottomNavigation;
