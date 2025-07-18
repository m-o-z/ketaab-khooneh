import { useCallback, useMemo } from "react";

export type Platform =
  | "windows"
  | "macos"
  | "ios"
  | "android"
  | "linux"
  | "chromeos"
  | "unknown";

export type Browser =
  | "chrome"
  | "firefox"
  | "safari"
  | "edge"
  | "opera"
  | "brave"
  | "ie"
  | "unknown";

export type PWAMode = "standalone" | "browser" | "minimal-ui" | "unknown";

export interface DeviceInfo {
  platform: Platform;
  browser: Browser;
  pwaMode: PWAMode;
}

function getPlatform(ua: string): Platform {
  if (/windows nt/i.test(ua)) return "windows";
  if (/macintosh|mac os x/i.test(ua)) return "macos";
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  if (/android/i.test(ua)) return "android";
  if (/cros/i.test(ua)) return "chromeos";
  if (/linux/i.test(ua)) return "linux";
  return "unknown";
}

function getBrowser(ua: string): Browser {
  if (/edg\//i.test(ua)) return "edge";
  if (/chrome/i.test(ua)) {
    if (/brave\//i.test(ua)) return "brave";
    if (/opr\//i.test(ua)) return "opera";
    return "chrome";
  }
  if (/firefox/i.test(ua)) return "firefox";
  if (/safari/i.test(ua) && !/chrome/i.test(ua)) return "safari";
  if (/msie|trident/i.test(ua)) return "ie";
  return "unknown";
}

function getPWAMode(): PWAMode {
  if (
    (window.matchMedia &&
      window.matchMedia("(display-mode: standalone)").matches) ||
    (navigator as any).standalone
  ) {
    return "standalone";
  }

  if (
    window.matchMedia &&
    window.matchMedia("(display-mode: minimal-ui)").matches
  ) {
    return "minimal-ui";
  }
  return "browser";
}

export function useDeviceInfo() {
  const deviceInfo = useMemo<DeviceInfo>(() => {
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      return { platform: "unknown", browser: "unknown", pwaMode: "unknown" };
    }
    const ua = navigator.userAgent;
    return {
      platform: getPlatform(ua),
      browser: getBrowser(ua),
      pwaMode: getPWAMode(),
    };
  }, []);

  const hasPlatform = useCallback(
    (...values: Platform[]) => {
      return (
        values.findIndex((item) => deviceInfo.platform.includes(item)) >= 0
      );
    },
    [deviceInfo],
  );

  const hasBrowser = useCallback(
    (...values: Browser[]) => {
      return values.findIndex((item) => deviceInfo.browser.includes(item)) >= 0;
    },
    [deviceInfo],
  );

  const hasPwaMode = useCallback(
    (...values: PWAMode[]) => {
      return values.findIndex((item) => deviceInfo.pwaMode.includes(item)) >= 0;
    },
    [deviceInfo],
  );

  const isMobile = useMemo(() => {
    return hasPlatform("android", "ios");
  }, [deviceInfo]);

  return {
    ...deviceInfo,
    hasPlatform,
    hasBrowser,
    hasPwaMode,
    isMobile,
  };
}
