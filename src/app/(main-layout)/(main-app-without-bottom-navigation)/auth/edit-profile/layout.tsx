import React from "react";
import { Box } from "@mantine/core";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <Box maw={500} m="auto">
      {children}
    </Box>
  );
};

export default Layout;
