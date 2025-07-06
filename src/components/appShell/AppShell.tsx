"use client";

import { Box } from "@mantine/core";
import React, { useEffect } from "react";
// import styles from "./AppShell.module.scss";
import BottomNavigation from "@/common/BottomNavigation/BottomNavigation";
import { usePWA } from "@/providers/PWAProvider";
import { createPortal } from "react-dom";
import Portal from "@/common/Portal/Portal";

type Props = {
  children: React.ReactNode;
};

const AppShell = ({ children }: Props) => {
  const { setHasBottomNavigation } = usePWA();

  useEffect(() => {
    setHasBottomNavigation();
  }, []);

  return (
    <div className="h-full w-full pb-[6.25rem] px-4 pt-4 relative">
      {children}
      <Portal id="#bottom-navigation">
        <BottomNavigation />
      </Portal>
    </div>
  );
};

export default AppShell;
