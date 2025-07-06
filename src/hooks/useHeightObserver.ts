import { useResizeObserver } from "@mantine/hooks";
import { useEffect, useRef } from "react";

type HeightChangeCallback = (
  newHeight: number,
  prevHeight: number | null,
) => void;

export function useHeightObserver<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
): {
  register: (callback: HeightChangeCallback) => () => void;
} {
  const callbacksRef = useRef<Set<HeightChangeCallback>>(new Set());
  const previousHeightRef = useRef<number | null>(null);

  const [observerRef, dimensions] = useResizeObserver();

  // Bridge external ref to internal observer ref
  useEffect(() => {
    if (ref.current) {
      observerRef.current = ref.current;
    }

    return () => {
      observerRef.current = null;
    };
  }, [ref, observerRef]);

  useEffect(() => {
    const newHeight = dimensions?.height;

    if (typeof newHeight !== "number") return;

    const prevHeight = previousHeightRef.current;
    if (prevHeight !== newHeight) {
      callbacksRef.current.forEach((cb) => cb(newHeight, prevHeight));
      previousHeightRef.current = newHeight;
    }
  }, [dimensions?.height]);

  function register(callback: HeightChangeCallback): () => void {
    callbacksRef.current.add(callback);
    return () => {
      callbacksRef.current.delete(callback);
    };
  }

  return { register };
}
