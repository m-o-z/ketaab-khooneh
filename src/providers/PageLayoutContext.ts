import { createContext, useContext } from "react";

type LayoutContextValue = {
  setTitle: (title: React.ReactNode) => void;
  resetTitle: () => void;
  setActions: (actions: React.ReactNode) => void;
  resetActions: () => void;
};

export const PageLayoutContext = createContext<LayoutContextValue | null>(null);

export function usePageLayout() {
  const ctx = useContext(PageLayoutContext);
  if (!ctx) throw new Error("usePageLayout must be used within PageLayout");
  return ctx;
}
