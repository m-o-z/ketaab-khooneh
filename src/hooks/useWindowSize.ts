import { useEffect, useState } from "react";

export function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    orientation:
      window.innerWidth > window.innerHeight ? "landscape" : "portrait",
  });

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
