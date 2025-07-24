"use client";
import { IconButton } from "@tapsioss/react-components/IconButton";
import { ArrowRight, ArrowUp } from "@tapsioss/react-icons";
import clsx from "clsx";
import {
  CSSProperties,
  memo,
  PropsWithChildren,
  ReactNode,
  UIEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Spinner from "@/common/Spinner/Spinner";
import ErrorSection from "@/components/ErrorSection";
import NotFound from "@/components/NotFound";
import { useStableHeightObserver } from "@/hooks/useStableHeightObserver";

import styles from "./PageLayout.module.scss";
import { PageLayoutContext } from "./PageLayoutContext";
import { usePWA } from "./PWAProvider";
import { Overlay } from "@mantine/core";

function ContentLayoutDefault<T = {}>({ children }: PropsWithChildren<T>) {
  return children;
}

export type ContentLayout = typeof ContentLayoutDefault;

type PageLayoutProps = {
  ContentLayout?: ContentLayout;
  showBackButton?: boolean;
  onBackClick?: () => void;
  initialTitle?: ReactNode;
  initialActions?: ReactNode;
  goToTopEnabled?: boolean;
  children: ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  noContent?: boolean;
  retry?: () => void;
};

export const PageLayout = memo(
  ({
    showBackButton = false,
    onBackClick,
    initialTitle,
    initialActions,
    goToTopEnabled = false,
    isLoading = false,
    isError = false,
    noContent = false,
    ContentLayout = ContentLayoutDefault,
    retry,
    children,
  }: PageLayoutProps) => {
    const { safeAreaInsets, hasBottomNavigation } = usePWA();
    const [title, setTitle] = useState(initialTitle);
    const [actions, setActions] = useState(initialActions);

    const resetTitle = () => setTitle(initialTitle);
    const resetActions = () => setActions(initialActions);

    const scrollRef = useRef<HTMLDivElement>(null);
    const { register } = useStableHeightObserver(scrollRef);
    const [showStickyButton, setShowStickyButton] = useState(false);
    const [topShadow, setTopShadow] = useState(false);
    const [bottomShadow, setBottomShadow] = useState(false);
    const lastScrollTop = useRef(0);

    const calculateScrollState = useCallback(() => {
      const el = scrollRef.current;
      if (!el) return;

      const { scrollTop, scrollHeight, clientHeight } = el;

      // Scroll direction
      const isScrollingDown = scrollTop >= lastScrollTop.current;
      lastScrollTop.current = scrollTop;

      // % scrolled
      const scrollPercent = scrollTop / (scrollHeight - clientHeight || 1);

      // Sticky button: more than 20% and scrolling down
      setShowStickyButton(scrollPercent > 0.2 && isScrollingDown);

      // Shadows
      setTopShadow(scrollTop > 4);
      setBottomShadow(scrollTop + clientHeight < scrollHeight - 4);
    }, []);

    // Register observer callback
    useEffect(() => {
      const flush = () => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setTimeout(() => {
              calculateScrollState();
            }, 0);
          });
        });
      };

      const unregister = register(() => {
        flush();
      });

      return unregister;
    }, [register, calculateScrollState]);

    // Run once on mount, delayed to catch late layout changes
    useEffect(() => {
      const el = scrollRef.current;
      if (!el) return;

      const timeout = setTimeout(() => {
        calculateScrollState();
      }, 500);

      // Also listen for first scroll to recalc
      const onFirstScroll = () => {
        calculateScrollState();
        el.removeEventListener("scroll", onFirstScroll);
      };

      el.addEventListener("scroll", onFirstScroll);

      return () => {
        clearTimeout(timeout);
        el.removeEventListener("scroll", onFirstScroll);
      };
    }, [calculateScrollState]);

    // Listen for image load events inside scroll container and recalc after all images loaded
    useEffect(() => {
      const el = scrollRef.current;
      if (!el) return;

      const images = el.querySelectorAll("img");
      let loadedCount = 0;

      if (images.length === 0) {
        calculateScrollState();
        return;
      }

      function onLoad() {
        loadedCount++;
        if (loadedCount === images.length) {
          calculateScrollState();
        }
      }

      images.forEach((img) => {
        if (img.complete) {
          loadedCount++;
        } else {
          img.addEventListener("load", onLoad);
          img.addEventListener("error", onLoad); // avoid stuck on error
        }
      });

      if (loadedCount === images.length) {
        calculateScrollState();
      }

      return () => {
        images.forEach((img) => {
          img.removeEventListener("load", onLoad);
          img.removeEventListener("error", onLoad);
        });
      };
    }, [children, calculateScrollState]);

    const handleScroll: UIEventHandler<HTMLDivElement> = () => {
      calculateScrollState();
    };

    const scrollToTop = useCallback(() => {
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const renderContent = () => {
      if (isError) {
        return (
          <div className="h-full flex items-center">
            <ErrorSection refetch={retry} />
          </div>
        );
      }
      if (isLoading) {
        return <Spinner />;
      }
      if (noContent) {
        return (
          <div className="h-full flex items-center">
            <NotFound />
          </div>
        );
      }

      return children;
    };

    const paddingBottom = useMemo(() => {
      if (hasBottomNavigation) {
        return safeAreaInsets.bottom > 0 ? "5.5rem" : "4.5rem";
      }
      return "1rem";
    }, [safeAreaInsets, hasBottomNavigation]);

    return (
      <PageLayoutContext.Provider
        value={{ setTitle, resetTitle, setActions, resetActions }}
      >
        <div
          className={clsx(
            "fixed right-1/2 translate-x-1/2 top-0 bottom-[var(--padding-bottom)] flex flex-col w-[var(--max-width)] px-4 pt-4 overflow-hidden",
            {
              [styles.pageTopShadow]: topShadow,
              [styles.pageBottomShadow]: bottomShadow,
            },
          )}
          style={
            {
              "--header-height": "72px",
              "--bottom": "-1rem",
              "--padding-bottom": paddingBottom,
            } as CSSProperties
          }
        >
          {/* Header */}
          <header className="flex items-center justify-between pb-4 overflow-hidden transition-shadow w-[calc(100%+2rem)] h-14 -mx-4 px-4 space-x-2">
            {showBackButton && (
              <div className="flex items-center shrink-0 max-h-full">
                <IconButton variant="naked" onClick={onBackClick}>
                  <ArrowRight />
                </IconButton>
              </div>
            )}
            {title && (
              <h2 className="grow text-ellipsis whitespace-nowrap overflow-hidden max-h-full min-w-0 !leading-[40px]">
                {title}
              </h2>
            )}
            {!!actions && (
              <div className="flex items-center gap-2 shrink-0 max-h-full relative">
                {actions}
                {isLoading || isError ? (
                  <Overlay color="#fff" backgroundOpacity={0.85} blur={10} />
                ) : null}
              </div>
            )}
          </header>

          <main
            ref={scrollRef}
            className={clsx(
              "flex-1 overflow-y-auto -mx-4 px-4 pb-4 overscroll-none",
            )}
            onScroll={handleScroll}
          >
            <ContentLayout key="layout">{renderContent()}</ContentLayout>
          </main>

          {/* Sticky Button */}
          {showStickyButton && goToTopEnabled && (
            <div className="absolute bottom-6 left-4 z-10">
              <IconButton
                className="shadow-lg shadow-gray-400"
                variant="primary"
                onClick={scrollToTop}
              >
                <ArrowUp />
              </IconButton>
            </div>
          )}
        </div>
      </PageLayoutContext.Provider>
    );
  },
);
