"use client";
import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./globals.css";
import "@tapsioss/theme/css-variables";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = createTheme({
    fontFamily: `VazirMatn, Tahoma, sans-serif`,
    components: {
      Text: {
        styles: {
          marginTop: "-1px",
        },
      },
    },
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

  const queryClient = new QueryClient();

  return (
    <html lang="fa" dir="rtl">
      <body>
        <QueryClientProvider client={queryClient}>
          <MantineProvider theme={theme} defaultColorScheme="light">
            <Notifications />
            {children}
          </MantineProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
