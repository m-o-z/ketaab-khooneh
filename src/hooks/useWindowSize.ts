"use client";
import { useCallback, useLayoutEffect, useState } from "react";

const defaultSizes = () => {
  return {
    maxWidth: 440,
    width: 0,
    height: 0,
    orientation: "portrait",
  };
};
export function useWindowSize() {
  const [size, setSize] = useState(defaultSizes());
  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    setSize({
      maxWidth: 440,
      width,
      height,
      orientation: width > height ? "landscape" : "portrait",
    });
  }, []);

  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      handleResize();
    });

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}
