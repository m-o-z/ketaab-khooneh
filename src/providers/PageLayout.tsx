"use client";
import { IconButton } from "@tapsioss/react-components/IconButton";
import { ArrowRight, ArrowUp } from "@tapsioss/react-icons";
import clsx from "clsx";
import {
  CSSProperties,
  ReactNode,
  UIEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import styles from "./PageLayout.module.scss";
import { PageLayoutContext } from "./PageLayoutContext";
import { usePWA } from "./PWAProvider";

type PageLayoutProps = {
  showBackButton?: boolean;
  onBackClick?: () => void;
  initialTitle?: ReactNode;
  initialActions?: ReactNode;
  goToTopEnabled?: boolean;
  children: ReactNode;
};

export function PageLayout({
  showBackButton = false,
  onBackClick,
  initialTitle,
  initialActions,
  goToTopEnabled = false,
  children,
}: PageLayoutProps) {
  const { safeAreaInsets } = usePWA();
  const [title, setTitle] = useState(initialTitle);
  const [actions, setActions] = useState(initialActions);

  const resetTitle = () => setTitle(initialTitle);
  const resetActions = () => setActions(initialActions);

  const scrollRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    calculateScrollState(); // Check scroll position on initial render
  }, [calculateScrollState]);

  const handleScroll: UIEventHandler<HTMLDivElement> = () => {
    calculateScrollState();
  };

  const scrollToTop = useCallback(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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
            "--top": "42px",
            "--bottom": "-1rem",
            "--padding-bottom": safeAreaInsets.bottom > 0 ? "5.5rem" : "4.5rem",
          } as CSSProperties
        }
      >
        {/* Header */}
        <header
          className={clsx(
            "flex items-center justify-between pb-3 transition-shadow",
          )}
        >
          <div className="flex items-center space-x-1 shrink-0">
            {showBackButton && (
              <IconButton variant="naked" onClick={onBackClick}>
                <ArrowRight />
              </IconButton>
            )}
            {title && <h2 className="grow">{title}</h2>}
          </div>
          {!!actions && (
            <div className="flex items-center gap-2 shrink-0">{actions}</div>
          )}
        </header>

        <main
          ref={scrollRef}
          className={clsx(
            "flex-1 overflow-y-auto -mx-4 px-4 pb-4 overscroll-none",
          )}
          onScroll={handleScroll}
        >
          {children}
        </main>

        {/* Sticky Button */}
        {showStickyButton && goToTopEnabled && (
          <div className="absolute bottom-8 right-4 z-10">
            <IconButton
              className="shadow-lg"
              variant="ghost"
              onClick={scrollToTop}
            >
              <ArrowUp />
            </IconButton>
          </div>
        )}
      </div>
    </PageLayoutContext.Provider>
  );
}
