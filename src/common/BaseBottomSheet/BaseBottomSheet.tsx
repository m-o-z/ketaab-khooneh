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
export type ChildrenProvider = (_: {
  hide: () => void;
  isOpen: boolean;
}) => ReactNode;
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
          className="box-border bg-white flex flex-col fixed bottom-0 max-h-[82vh] rounded-t-[10px]  w-full max-w-[var(--max-width)] right-[50%] translate-x-[50%] outline-none z-50"
        >
          <div className=" relative max-w-md w-full mx-auto overflow-auto p-4 rounded-t-[10px]">
            <Drawer.Handle className="absolute top-4" />

            {childrenProvider()}
          </div>
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
