"use client";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// Create the context with default values
const PWAContext = createContext({
  isStandalone: false,
  hasBottomNavigation: false,
  setHasBottomNavigation: () => {},
  setHasNotBottomNavigation: () => {},
  safeAreaInsets: { top: 0, right: 0, bottom: 0, left: 0 },
});

type Props = PropsWithChildren;

export const PWAProvider = ({ children }: Props) => {
  const [hasBottomNavigation, _setHasBottomNavigation] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [safeAreaInsets, setSafeAreaInsets] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  // Function to determine if the PWA is running in standalone mode
  const checkStandaloneMode = useCallback(() => {
    // Modern way: check display-mode media query
    const matchMediaStandalone = window.matchMedia(
      "(display-mode: standalone)",
    ).matches;

    // iOS specific way (non-standard, but common for older iOS PWAs)
    const navigatorStandalone = !!(
      "standalone" in navigator && navigator.standalone
    );

    setIsStandalone(matchMediaStandalone || navigatorStandalone);
  }, []);

  // Function to read safe area insets from CSS environment variables
  const updateSafeAreaInsets = useCallback(() => {
    if (typeof window !== "undefined" && document.body) {
      // Create a temporary, hidden div to read computed styles from
      const dummyDiv = document.createElement("div");
      dummyDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 1px;
        height: 1px;
        visibility: hidden;
        z-index: -1;
        padding-top: env(safe-area-inset-top, 0px);
        padding-right: env(safe-area-inset-right, 0px);
        padding-bottom: env(safe-area-inset-bottom, 0px);
        padding-left: env(safe-area-inset-left, 0px);
      `;
      document.body.appendChild(dummyDiv); // Must be in the DOM to compute styles

      const computedStyle = window.getComputedStyle(dummyDiv);

      const newInsets = {
        top: parseFloat(computedStyle.paddingTop) || 0,
        right: parseFloat(computedStyle.paddingRight) || 0,
        bottom: parseFloat(computedStyle.paddingBottom) || 0,
        left: parseFloat(computedStyle.paddingLeft) || 0,
      };

      // Optimization: Only update state if the values have actually changed
      setSafeAreaInsets((currentInsets) => {
        if (
          currentInsets.top === newInsets.top &&
          currentInsets.right === newInsets.right &&
          currentInsets.bottom === newInsets.bottom &&
          currentInsets.left === newInsets.left
        ) {
          return currentInsets;
        }
        return newInsets;
      });

      document.body.removeChild(dummyDiv); // Clean up the dummy div
    }
  }, []);

  // Effect to set up initial checks and listeners
  useEffect(() => {
    checkStandaloneMode();

    // ========================================================================
    // THE FIX: Use double requestAnimationFrame instead of setTimeout.
    // This robustly waits for the browser's rendering engine to calculate
    // layout and style, including the `env()` CSS variables.
    // ========================================================================
    let rAFId1: number;
    let rAFId2: number;

    const initialCheck = () => {
      // We request a second frame to be absolutely sure the layout is stable.
      rAFId2 = requestAnimationFrame(() => {
        updateSafeAreaInsets();
      });
    };

    // Start the process by requesting the first animation frame.
    rAFId1 = requestAnimationFrame(initialCheck);

    // Listen for 'resize' events to re-evaluate standalone mode and insets
    // This catches device orientation changes and keyboard appearance
    const handleResize = () => {
      checkStandaloneMode();
      updateSafeAreaInsets();
    };

    const eventTarget = window.visualViewport || window;
    eventTarget.addEventListener("resize", handleResize);

    // Clean up event listeners and animation frames on component unmount
    return () => {
      if (rAFId1) cancelAnimationFrame(rAFId1);
      if (rAFId2) cancelAnimationFrame(rAFId2);
      eventTarget.removeEventListener("resize", handleResize);
    };
  }, [checkStandaloneMode, updateSafeAreaInsets]); // Dependencies for useEffect

  const setHasBottomNavigation = () => {
    if (!hasBottomNavigation) {
      _setHasBottomNavigation(true);
    }
  };

  const setHasNotBottomNavigation = () => {
    _setHasBottomNavigation(false);
  };

  return (
    <PWAContext.Provider
      value={{
        isStandalone,
        safeAreaInsets,
        setHasBottomNavigation,
        setHasNotBottomNavigation,
        hasBottomNavigation,
      }}
    >
      {children}
    </PWAContext.Provider>
  );
};

export const usePWA = () => {
  const context = useContext(PWAContext);
  if (context === undefined) {
    throw new Error("usePWA must be used within a PWAProvider");
  }
  return context;
};
