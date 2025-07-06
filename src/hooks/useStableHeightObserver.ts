import { useResizeObserver } from "@mantine/hooks";
import { useEffect, useRef } from "react";

type Callback = () => void;

export function useStableHeightObserver<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
): { register: (cb: Callback) => () => void } {
  const callbacksRef = useRef<Set<Callback>>(new Set());
  const mutationObserverRef = useRef<MutationObserver | null>(null);

  const [resizeRef, dimensions] = useResizeObserver();

  useEffect(() => {
    if (!ref.current) return;

    // Attach resize observer
    resizeRef.current = ref.current;

    // Attach mutation observer
    mutationObserverRef.current = new MutationObserver(() => {
      triggerCallbacks();
    });

    mutationObserverRef.current.observe(ref.current, {
      childList: true,
      subtree: true,
    });

    return () => {
      resizeRef.current = null;
      mutationObserverRef.current?.disconnect();
    };
  }, [ref.current]);

  const triggerCallbacks = () => {
    // Run callbacks on next animation frame
    requestAnimationFrame(() => {
      callbacksRef.current.forEach((cb) => cb());
    });
  };

  useEffect(() => {
    // Trigger on height change
    if (dimensions?.height != null) {
      triggerCallbacks();
    }
  }, [dimensions?.height]);

  const register = (cb: Callback) => {
    callbacksRef.current.add(cb);
    return () => callbacksRef.current.delete(cb);
  };

  return { register };
}
