import { IconButton } from "@tapsioss/react-components/IconButton";
import { ArrowRightFill, ArrowUp } from "@tapsioss/react-icons";
import clsx from "clsx";
import styles from "./PageLayout.module.scss";
import {
  CSSProperties,
  ReactNode,
  UIEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
    const isScrollingDown = scrollTop > lastScrollTop.current;
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
        style={
          {
            "--top": "48px",
            "--bottom-padding": safeAreaInsets.bottom > 0 ? "5.5rem" : "4.5rem",
          } as CSSProperties
        }
        className={clsx(
          "fixed right-0 left-0 bottom-[var(--bottom-padding)] top-0 flex flex-col p-4",
          {
            [styles.page]: topShadow,
          },
        )}
      >
        {/* Header */}
        <header
          className={clsx(
            "flex items-center justify-between pb-3 transition-shadow",
          )}
        >
          <div className="flex items-center gap-2 shrink-0">
            {showBackButton && (
              <IconButton onClick={onBackClick} variant="naked">
                <ArrowRightFill />
              </IconButton>
            )}
            {title && <h1 className="text-xl font-medium grow">{title}</h1>}
          </div>
          {!!actions && (
            <div className="flex items-center gap-2 shrink-0">{actions}</div>
          )}
        </header>

        <main
          ref={scrollRef}
          onScroll={handleScroll}
          className={clsx("flex-1 overflow-y-auto -mx-4 px-4 -mb-4 pb-4", {
            "shadow-[inset_0_-8px_12px_-6px_rgba(0,0,0,0.12)]": bottomShadow,
          })}
        >
          {children}
        </main>

        {/* Sticky Button */}
        {showStickyButton && goToTopEnabled && (
          <div className="absolute bottom-4 right-2 z-10">
            <IconButton
              variant="ghost"
              className="shadow-lg"
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
