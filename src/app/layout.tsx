import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@tapsioss/theme/css-variables";
import { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.scss";
import "./tailwind.css";

const APP_NAME = "Ghafaseh";
const APP_DEFAULT_TITLE = "Tapsi - Ghafaseh";
const APP_TITLE_TEMPLATE = "%s - GHAFASEH";
const APP_DESCRIPTION = "Tapsi's book library app";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html dir="rtl" lang="fa">
      <head>
        <meta content="yes" name="mobile-web-app-capable" />
        <meta content="yes" name="apple-touch-fullscreen" />
        <meta content="Ghafaseh" name="apple-mobile-web-app-title" />
        <meta content="default" name="apple-mobile-web-app-status-bar-style" />
        <meta content="notranslate" name="google" />
        <meta content="yes" name="full-screen" />
        <meta content="application" name="browsermode" />
        <meta content="portrait" name="screen-orientation" />
        <link href="/icons/apple-icon-180.png" rel="apple-touch-icon" />
        <link
          href="/splashs/apple-splash-2048-2732.jpg"
          media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-2048-2732.jpg"
          media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-2048-2732.jpg"
          media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-2048-2732.jpg"
          media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-2048-2732.jpg"
          media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-2048-2732.jpg"
          media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-2048-2732.jpg"
          media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-2048-2732.jpg"
          media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-2048-2732.jpg"
          media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-2048-2732.jpg"
          media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-2048-2732.jpg"
          media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-2048-2732.jpg"
          media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-1668-2388.jpg"
          media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-1536-2048.jpg"
          media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-1640-2360.jpg"
          media="(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-1668-2224.jpg"
          media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-1620-2160.jpg"
          media="(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-1488-2266.jpg"
          media="(device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-1320-2868.jpg"
          media="(device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-1206-2622.jpg"
          media="(device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-1290-2796.jpg"
          media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-1179-2556.jpg"
          media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-1170-2532.jpg"
          media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-1284-2778.jpg"
          media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-1125-2436.jpg"
          media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-1242-2688.jpg"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-828-1792.jpg"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-1242-2208.jpg"
          media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-750-1334.jpg"
          media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-640-1136.jpg"
          media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-dark-2048-2732.jpg"
          media="(prefers-color-scheme: dark) and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-dark-1668-2388.jpg"
          media="(prefers-color-scheme: dark) and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-dark-1536-2048.jpg"
          media="(prefers-color-scheme: dark) and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-dark-1640-2360.jpg"
          media="(prefers-color-scheme: dark) and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-dark-1668-2224.jpg"
          media="(prefers-color-scheme: dark) and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-dark-1620-2160.jpg"
          media="(prefers-color-scheme: dark) and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-dark-1488-2266.jpg"
          media="(prefers-color-scheme: dark) and (device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-dark-1320-2868.jpg"
          media="(prefers-color-scheme: dark) and (device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-dark-1206-2622.jpg"
          media="(prefers-color-scheme: dark) and (device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-dark-1290-2796.jpg"
          media="(prefers-color-scheme: dark) and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-dark-1179-2556.jpg"
          media="(prefers-color-scheme: dark) and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-dark-1170-2532.jpg"
          media="(prefers-color-scheme: dark) and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-dark-1284-2778.jpg"
          media="(prefers-color-scheme: dark) and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-dark-1125-2436.jpg"
          media="(prefers-color-scheme: dark) and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-dark-1242-2688.jpg"
          media="(prefers-color-scheme: dark) and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-dark-828-1792.jpg"
          media="(prefers-color-scheme: dark) and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-dark-1242-2208.jpg"
          media="(prefers-color-scheme: dark) and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-dark-750-1334.jpg"
          media="(prefers-color-scheme: dark) and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <link
          href="/splashs/apple-splash-dark-640-1136.jpg"
          media="(prefers-color-scheme: dark) and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
          rel="apple-touch-startup-image"
        />
        <meta content="yes" name="apple-mobile-web-app-capable" />

        <meta content="#ffffff" name="msapplication-TileColor" />
        <meta content="#ffffff" name="theme-color" />
      </head>
      <body>
        <Script src="/startup.js" />
        {children}
        <div id="bottom-navigation" />
        <div id="modal" />
      </body>
    </html>
  );
}
