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
  | "safari-ios"
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
  // Check Edge first (before Chrome, as Edge contains "chrome" in UA)
  if (/edg\//i.test(ua)) return "edge";

  // Check Chrome-based browsers
  if (/chrome/i.test(ua)) {
    if (/brave\//i.test(ua)) return "brave";
    if (/opr\//i.test(ua)) return "opera";
    return "chrome";
  }

  // Check Firefox
  if (/firefox/i.test(ua)) return "firefox";

  // Check Safari (make sure it's not Chrome-based)
  if (/safari/i.test(ua) && !/chrome/i.test(ua)) {
    // Distinguish iOS Safari from macOS Safari
    if (/iphone|ipad|ipod/i.test(ua)) {
      return "safari-ios";
    }
    return "safari"; // macOS Safari
  }

  // Check Internet Explorer
  if (/msie|trident/i.test(ua)) return "ie";

  return "unknown";
}

function getPWAMode(): PWAMode {
  // Check if running in browser environment
  if (typeof window === "undefined") return "unknown";

  // Check standalone mode (both standard and iOS)
  if (
    (window.matchMedia &&
      window.matchMedia("(display-mode: standalone)").matches) ||
    (navigator as any).standalone === true
  ) {
    return "standalone";
  }

  // Check minimal-ui mode
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
    // Server-side rendering or non-browser environment
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
      return values.some((value) => deviceInfo.platform === value);
    },
    [deviceInfo.platform], // More specific dependency
  );

  const hasBrowser = useCallback(
    (...values: Browser[]) => {
      return values.some((value) => deviceInfo.browser === value);
    },
    [deviceInfo.browser], // More specific dependency
  );

  const hasPwaMode = useCallback(
    (...values: PWAMode[]) => {
      return values.some((value) => deviceInfo.pwaMode === value);
    },
    [deviceInfo.pwaMode], // More specific dependency
  );

  const isMobile = useMemo(() => {
    return deviceInfo.platform === "android" || deviceInfo.platform === "ios";
  }, [deviceInfo.platform]); // Direct dependency instead of using hasPlatform

  // Additional helpful computed properties
  const isDesktop = useMemo(() => {
    return ["windows", "macos", "linux", "chromeos"].includes(
      deviceInfo.platform,
    );
  }, [deviceInfo.platform]);

  const isApple = useMemo(() => {
    return deviceInfo.platform === "macos" || deviceInfo.platform === "ios";
  }, [deviceInfo.platform]);

  const isChromeBased = useMemo(() => {
    return ["chrome", "edge", "opera", "brave"].includes(deviceInfo.browser);
  }, [deviceInfo.browser]);

  return {
    ...deviceInfo,
    hasPlatform,
    hasBrowser,
    hasPwaMode,
    isMobile,
    isDesktop,
    isApple,
    isChromeBased,
  };
}
