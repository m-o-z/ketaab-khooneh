"use client";
import "@/app/fonts.scss";
import "@/app/globals.css";
import Container from "@/common/Container/Container";
import Notifications from "@/common/Notifications";
import { isLocal } from "@/env";
import { PWAProvider } from "@/providers/PWAProvider";
import { queryClient } from "@/queryClient";
import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "@tapsioss/theme/css-variables";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = createTheme({
    components: {
      Notifications: {
        styles: {
          root: {
            "--mantine-spacing-md": "var(--mantine-notification-bottom, 16px)",
            minWidth: "380px",
            maxWidth: "calc(100%-2rem)",
            transition: "all .3s ease-out",
          },
        },
      },
    },
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
    <PWAProvider>
      <QueryClientProvider client={queryClient}>
        <MantineProvider theme={theme} defaultColorScheme="light">
          <Container>{children}</Container>
          {isLocal && <ReactQueryDevtools />}
          <Notifications />
        </MantineProvider>
      </QueryClientProvider>
    </PWAProvider>
  );
}
