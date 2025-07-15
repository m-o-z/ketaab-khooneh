import React, {
  useEffect,
  useRef,
  useState,
  PropsWithChildren,
  CSSProperties,
} from "react";

type Props = PropsWithChildren<{
  lines?: number;
  className?: string;
  style?: CSSProperties;
}>;

const TextEllipses = ({ lines = 1, children, className, style }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [clampApplied, setClampApplied] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const applyClamp = () => {
      const totalHeight = el.scrollHeight;
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
      const maxHeight = lineHeight * lines;

      const shouldClamp = totalHeight > maxHeight;
      setClampApplied(shouldClamp);
    };

    const resizeObserver = new ResizeObserver(applyClamp);
    resizeObserver.observe(el);

    const mutationObserver = new MutationObserver(applyClamp);
    mutationObserver.observe(el, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    // Run initially
    applyClamp();

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [lines, children]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        ...style,
        display: "-webkit-box",
        WebkitLineClamp: clampApplied ? lines : undefined,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {children}
    </div>
  );
};

export default TextEllipses;
