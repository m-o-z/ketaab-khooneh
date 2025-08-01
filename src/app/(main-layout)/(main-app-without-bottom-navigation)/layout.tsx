"use client";
import "@mantine/core/styles.css";
import "@tapsioss/theme/css-variables";
import "@/app/globals.scss";
import { useEffect } from "react";

import { usePWA } from "@/providers/PWAProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { setHasNotBottomNavigation } = usePWA();

  useEffect(() => {
    setHasNotBottomNavigation();
  }, [children]);
  return children;
}
