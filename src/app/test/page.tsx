"use client";

import { Button } from "@mantine/core";
import { IconButton } from "@tapsioss/react-components/IconButton";
import { LockFill } from "@tapsioss/react-icons";
import React from "react";
import { Drawer } from "vaul";

export default function VaulDrawer() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="bg-red-50 h-full">
      <IconButton
        variant="ghost"
        onClick={() => {
          setOpen(!open);
        }}
      >
        <LockFill />
      </IconButton>
      <Drawer.Root open={open} onOpenChange={setOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="bg-gray-100 flex flex-col rounded-t-[10px] mt-24 h-fit fixed bottom-0 left-0 right-0 outline-none">
            <div className="p-4 bg-white rounded-t-[10px] flex-1">
              <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8" />
              <div className="max-w-md mx-auto">
                <Drawer.Title className="font-medium mb-4 text-gray-900">
                  A controlled drawer.
                </Drawer.Title>
                <p className="text-gray-600 mb-2">
                  This means that the drawer no longer manages its own state.
                  Instead, you can control it programmatically from the outside.
                </p>
                <p className="text-gray-600 mb-2">
                  But you can still let the drawer help you a bit by passing the
                  `onOpenChange` prop. This way, the drawer will change your
                  open state when the user clicks outside of it, or when they
                  press the escape key for example.
                </p>
              </div>
            </div>
            <div className="p-4 bg-gray-100 border-t border-gray-200 mt-auto">
              <div className="flex gap-6 justify-end max-w-md mx-auto">
                <a
                  className="text-xs text-gray-600 flex items-center gap-0.25"
                  href="https://github.com/emilkowalski/vaul"
                  target="_blank"
                >
                  GitHub
                  <svg
                    aria-hidden="true"
                    className="w-3 h-3 ml-1"
                    fill="none"
                    height="16"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="16"
                  >
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                    <path d="M15 3h6v6" />
                    <path d="M10 14L21 3" />
                  </svg>
                </a>
                <a
                  className="text-xs text-gray-600 flex items-center gap-0.25"
                  href="https://twitter.com/emilkowalski_"
                  target="_blank"
                >
                  Twitter
                  <svg
                    aria-hidden="true"
                    className="w-3 h-3 ml-1"
                    fill="none"
                    height="16"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="16"
                  >
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                    <path d="M15 3h6v6" />
                    <path d="M10 14L21 3" />
                  </svg>
                </a>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
}
