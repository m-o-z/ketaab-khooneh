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

export type PWAMode =
  | "standalone"
  | "browser"
  | "minimal-ui"
  | "fullscreen"
  | "unknown";

export interface DeviceInfo {
  platform: Platform;
  browser: Browser;
  pwaMode: PWAMode;
}

function getPlatform(ua: string): Platform {
  // Check mobile platforms first (iOS/Android contain desktop-like strings)
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  if (/android/i.test(ua)) return "android";

  // Check desktop platforms
  if (/windows nt/i.test(ua)) return "windows";
  if (/macintosh|mac os x/i.test(ua)) return "macos";
  if (/cros/i.test(ua)) return "chromeos";
  if (/linux/i.test(ua)) return "linux";

  return "unknown";
}

function getBrowser(ua: string): Browser {
  // Check Internet Explorer first (legacy)
  if (/msie|trident/i.test(ua)) return "ie";

  // Check Edge (before Chrome, as Edge contains "chrome" in UA)
  if (/edg\//i.test(ua)) return "edge";

  // Check Chrome-based browsers (order matters for accurate detection)
  if (/chrome/i.test(ua)) {
    if (/brave\//i.test(ua) || /brave/i.test(ua)) return "brave";
    if (/opr\//i.test(ua) || /opera/i.test(ua)) return "opera";
    return "chrome";
  }

  // Check Firefox
  if (/firefox/i.test(ua)) return "firefox";

  // Check Safari (ensure it's not Chrome-based)
  if (/safari/i.test(ua) && !/chrome/i.test(ua)) {
    // Distinguish iOS Safari from macOS Safari
    if (/iphone|ipad|ipod/i.test(ua)) {
      return "safari-ios";
    }
    return "safari";
  }

  return "unknown";
}

function getPWAMode(): PWAMode {
  // Check if running in browser environment
  if (typeof window === "undefined") return "unknown";

  // Check fullscreen mode
  if (
    window.matchMedia &&
    window.matchMedia("(display-mode: fullscreen)").matches
  ) {
    return "fullscreen";
  }

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

  // Platform checking utilities
  const hasPlatform = useCallback(
    (...platforms: Platform[]) => {
      return platforms.includes(deviceInfo.platform);
    },
    [deviceInfo.platform],
  );

  const hasBrowser = useCallback(
    (...browsers: Browser[]) => {
      return browsers.includes(deviceInfo.browser);
    },
    [deviceInfo.browser],
  );

  const hasPwaMode = useCallback(
    (...modes: PWAMode[]) => {
      return modes.includes(deviceInfo.pwaMode);
    },
    [deviceInfo.pwaMode],
  );

  // Device type computed properties
  const isMobile = useMemo(() => {
    return hasPlatform("android", "ios");
  }, [hasPlatform]);

  const isDesktop = useMemo(() => {
    return hasPlatform("windows", "macos", "linux", "chromeos");
  }, [hasPlatform]);

  const isTablet = useMemo(() => {
    // Basic tablet detection - iPad or large Android devices
    if (deviceInfo.platform === "ios") {
      return /ipad/i.test(navigator?.userAgent || "");
    }
    if (deviceInfo.platform === "android") {
      // Simple heuristic: Android without "Mobile" in UA is likely tablet
      return !/mobile/i.test(navigator?.userAgent || "");
    }
    return false;
  }, [deviceInfo.platform]);

  // Vendor/ecosystem computed properties
  const isApple = useMemo(() => {
    return hasPlatform("macos", "ios");
  }, [hasPlatform]);

  const isChromeBased = useMemo(() => {
    return hasBrowser("chrome", "edge", "opera", "brave");
  }, [hasBrowser]);

  const isWebkit = useMemo(() => {
    return hasBrowser("safari", "safari-ios") || isChromeBased;
  }, [hasBrowser, isChromeBased]);

  // PWA utilities
  const isPWA = useMemo(() => {
    return hasPwaMode("standalone", "minimal-ui", "fullscreen");
  }, [hasPwaMode]);

  const isStandalonePWA = useMemo(() => {
    return hasPwaMode("standalone", "fullscreen");
  }, [hasPwaMode]);

  // Touch capability detection
  const hasTouch = useMemo(() => {
    if (typeof window === "undefined") return false;
    return (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      (navigator as any).msMaxTouchPoints > 0
    );
  }, []);

  return {
    // Core device info
    ...deviceInfo,

    // Utility functions
    hasPlatform,
    hasBrowser,
    hasPwaMode,

    // Device type flags
    isMobile,
    isDesktop,
    isTablet,

    // Vendor/ecosystem flags
    isApple,
    isChromeBased,
    isWebkit,

    // PWA flags
    isPWA,
    isStandalonePWA,

    // Capability flags
    hasTouch,
  };
}
