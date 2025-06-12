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
    if (typeof window !== "undefined") {
      // Modern way: check display-mode media query
      const matchMediaStandalone = window.matchMedia(
        "(display-mode: standalone)",
      ).matches;

      // iOS specific way (non-standard, but common for older iOS PWAs)
      const navigatorStandalone = !!(
        "standalone" in navigator && navigator.standalone
      );

      setIsStandalone(matchMediaStandalone || navigatorStandalone);
    }
  }, []);

  // Function to read safe area insets from CSS environment variables
  const updateSafeAreaInsets = useCallback(() => {
    if (typeof window !== "undefined" && document.body) {
      // Create a temporary, hidden div to read computed styles from
      const dummyDiv = document.createElement("div");
      // Apply CSS environment variables via inline style or a class
      // It's crucial to set these as CSS properties that can be computed
      dummyDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 1px;
        height: 1px;
        visibility: hidden;
        padding-top: env(safe-area-inset-top, 0px);
        padding-right: env(safe-area-inset-right, 0px);
        padding-bottom: env(safe-area-inset-bottom, 0px);
        padding-left: env(safe-area-inset-left, 0px);
      `;
      document.body.appendChild(dummyDiv); // Must be in the DOM to compute styles

      const computedStyle = window.getComputedStyle(dummyDiv);

      setSafeAreaInsets({
        top: parseFloat(computedStyle.paddingTop) || 0,
        right: parseFloat(computedStyle.paddingRight) || 0,
        bottom: parseFloat(computedStyle.paddingBottom) || 0,
        left: parseFloat(computedStyle.paddingLeft) || 0,
      });

      console.log({
        top: parseFloat(computedStyle.paddingTop) || 0,
        right: parseFloat(computedStyle.paddingRight) || 0,
        bottom: parseFloat(computedStyle.paddingBottom) || 0,
        left: parseFloat(computedStyle.paddingLeft) || 0,
      });

      document.body.removeChild(dummyDiv); // Clean up the dummy div
    }
  }, []);

  // Effect to set up initial checks and listeners
  useEffect(() => {
    checkStandaloneMode();
    updateSafeAreaInsets();

    // Listen for 'resize' events to re-evaluate standalone mode and insets
    // This catches device orientation changes and keyboard appearance/disappearance
    const handleResize = () => {
      checkStandaloneMode();
      updateSafeAreaInsets();
    };

    // For more granular control over visual viewport changes (e.g., keyboard)
    // if window.visualViewport is available, use its resize event.
    // Otherwise, fallback to window.resize.
    const eventTarget = window.visualViewport || window;
    eventTarget.addEventListener("resize", handleResize);

    // Clean up event listeners on component unmount
    return () => {
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

/**
 * Custom hook to consume the PWA context.
 * Provides access to isStandalone status and safeAreaInsets.
 */
export const usePWA = () => {
  const context = useContext(PWAContext);
  if (context === undefined) {
    throw new Error("usePWA must be used within a PWAProvider");
  }
  return context;
};

// You'll also need a global CSS file or a <style> tag in your _app.js
// to define the 'env()' variables, especially for safe area insets.
// This is typically done in your global CSS.
