"use client";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { createTheme, MantineProvider } from "@mantine/core";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import Container from "@/common/Container/Container";
import Notifications from "@/common/Notifications";
import { isLocal } from "@/env";
import { PWAProvider } from "@/providers/PWAProvider";
import { queryClient } from "@/queryClient";
import "@mantine/core/styles.css";
import "@tapsioss/theme/css-variables";
import "@/app/globals.scss";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = createTheme({
    fontFamily: `Vazirmatn,  'SF Pro Rounded', Tahoma, sans-serif`,
    headings: {
      sizes: {
        h1: {
          fontWeight: "700",
        },
        h2: {
          fontWeight: "700",
          lineHeight: "38px",
        },
        h3: {
          fontWeight: "700",
        },
        h4: {
          fontWeight: "500",
        },
        h5: {
          fontWeight: "500",
        },
        h6: {
          fontWeight: "500",
        },
      },
    },
    fontFamilyMonospace: "Monaco, Courier, monospace",
    /** Put your mantine theme override here */
  });

  return (
    <NuqsAdapter>
      <PWAProvider>
        <QueryClientProvider client={queryClient}>
          <MantineProvider defaultColorScheme="light" theme={theme}>
            <Container>{children}</Container>
            {isLocal && <ReactQueryDevtools />}
            <Notifications />
          </MantineProvider>
        </QueryClientProvider>
      </PWAProvider>
    </NuqsAdapter>
  );
}
