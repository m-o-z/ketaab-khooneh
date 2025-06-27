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
      <Portal id="#bottom-navigation">
        <BottomNavigation />
      </Portal>
    </Box>
  );
};

export default AppShell;
