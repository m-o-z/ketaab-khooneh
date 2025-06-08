"use client";
import Notifications from "@/common/Notifications";
import { PWAProvider } from "@/providers/PWAProvider";
import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@tapsioss/theme/css-variables";
import "@/app/globals.css";
import "@/app/fonts.scss";

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

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnMount: true,
        gcTime: 1000 * 60 * 15,
        staleTime: 1000 * 60 * 10,
        retry: 3,
      },
    },
  });
  return (
    <PWAProvider>
      <QueryClientProvider client={queryClient}>
        <MantineProvider theme={theme} defaultColorScheme="light">
          {children}
          <Notifications />
        </MantineProvider>
      </QueryClientProvider>
    </PWAProvider>
  );
}
