import { Drawer, Modal } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import React from "react";

type Props = {
  title?: string;
  opened: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const PopUp = ({ opened, onClose, children, title }: Props) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  if (isMobile) {
    return (
      <Drawer opened={opened} position="bottom" title={title} onClose={onClose}>
        {children}
      </Drawer>
    );
  }
  return (
    <Modal opened={opened} title={title} onClose={onClose}>
      {children}
    </Modal>
  );
};

export default PopUp;
