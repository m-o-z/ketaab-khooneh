"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
  children: ReactNode;
  id: string;
}

const Portal = ({ children, id }: PortalProps) => {
  const ref = useRef<Element | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    ref.current = document.querySelector<HTMLElement>(id);
    setMounted(true);
  }, []);

  if (!id) {
    return null;
  }

  return mounted && ref.current ? createPortal(children, ref.current) : null;
};

export default Portal;
