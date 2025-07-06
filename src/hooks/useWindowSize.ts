"use client";
import { useEffect, useState } from "react";

import { isClient } from "@/utils/window";

export function useWindowSize() {
  const calcSizes = () => {
    if (!isClient()) {
      return {
        width: 0,
        height: 0,
        orientation: "landscape",
      };
    }
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      orientation:
        window.innerWidth > window.innerHeight ? "landscape" : "portrait",
    };
  };
  const [size, setSize] = useState(calcSizes());

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setSize({
        width,
        height,
        orientation: width > height ? "landscape" : "portrait",
      });
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}
