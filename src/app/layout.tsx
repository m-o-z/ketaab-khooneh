import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@tapsioss/theme/css-variables";
import { Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const viewport: Viewport = {
  initialScale: 1,
  viewportFit: "cover",
  maximumScale: 1.5,
  minimumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <Script src="/startup.js"></Script>
        {children}
      </body>
    </html>
  );
}
