import { Box } from "@mantine/core";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <Box m="auto" maw={500}>
      {children}
    </Box>
  );
};

export default Layout;
