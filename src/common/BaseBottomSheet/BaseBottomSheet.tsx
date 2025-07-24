import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  PropsWithChildren,
  useCallback,
  CSSProperties,
  ReactElement,
  isValidElement,
} from "react";
import { Drawer } from "vaul";
import Container from "../Container/Container";
import { useWindowSize } from "@/hooks/useWindowSize";

// Context to share state between Wrapper and Content
type BottomSheetContextType = {
  show: () => void;
  hide: () => void;
  isOpen: boolean;
};
const BottomSheetContext = createContext<BottomSheetContextType | null>(null);

// Compound component pattern
const BaseBottomSheet = ({ children }: PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState(false);

  const show = useCallback(() => setIsOpen(true), []);
  const hide = useCallback(() => setIsOpen(false), []);

  return (
    <BottomSheetContext.Provider value={{ isOpen, show, hide }}>
      {children}
    </BottomSheetContext.Provider>
  );
};

// Wrapper: gives access to show()
const Wrapper = ({
  children,
}: {
  children: (opts: { show: () => void; isOpen: boolean }) => ReactNode;
}) => {
  const ctx = useContext(BottomSheetContext);
  if (!ctx)
    throw new Error(
      "BaseBottomSheet.Wrapper must be used inside BaseBottomSheet",
    );

  return <>{children({ show: ctx.show, isOpen: ctx.isOpen })}</>;
};

// Content: renders the Drawer UI
type ChildrenProvider = (_: { hide: () => void; isOpen: boolean }) => ReactNode;
type ContentProps =
  | PropsWithChildren
  | {
      children: ChildrenProvider;
    };
const Content = ({ children }: ContentProps) => {
  const { maxWidth } = useWindowSize();
  const ctx = useContext(BottomSheetContext);
  if (!ctx)
    throw new Error(
      "BaseBottomSheet.Content must be used inside BaseBottomSheet",
    );

  const childrenProvider = () => {
    if (typeof children === "function") {
      return children({
        isOpen: ctx.isOpen,
        hide: () => ctx.hide(),
      });
    } else if (isValidElement(children)) {
      return children;
    }
    return null;
  };

  return (
    <Drawer.Root
      open={ctx.isOpen}
      onOpenChange={(open) => (open ? ctx.show() : ctx.hide())}
      fixed
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content
          style={{ "--max-width": `${maxWidth}px` } as CSSProperties}
          className="bg-white flex flex-col rounded-t-[10px] mt-24 h-fit fixed bottom-0 w-full max-w-[var(--max-width)] right-[50%] translate-x-[50%] outline-none isolate z-50 p-4 pt-8"
          onPointerDownOutside={(event) => {
            // Check if the click target or its parent has the Mantine dropdown attribute.
            // Using a data-attribute is more stable than a class name.
            if (
              (event.target as HTMLElement).closest("[data-mantine-dropdown]")
            ) {
              event.preventDefault();
            }
          }}
        >
          <div
            aria-hidden
            className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 absolute top-3 right-[50%] translate-x-[50%]"
          />

          {childrenProvider()}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

// Attach compound parts
BaseBottomSheet.Wrapper = Wrapper;
BaseBottomSheet.Content = Content;

export default BaseBottomSheet as React.FC<PropsWithChildren> & {
  Wrapper: typeof Wrapper;
  Content: typeof Content;
};
