import React, { useState } from "react";
import { IconLogout } from "@tabler/icons-react";
import { Button, Flex, Stack, Text } from "@mantine/core";
import PopUp from "@/common/components/PopUp";
import { useLogoutApi } from "@/hooks/auth";

const Logout = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { mutateAsync: logout } = useLogoutApi();
  const handleLogout = async () => {
    await logout();
    setShowLogoutModal(false);
  };
  return (
    <>
      <PopUp
        title="Logout"
        opened={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      >
        <Stack>
          <Text>Are you sure you want to logout?</Text>
          <Flex gap="xs">
            <Button color="red" onClick={handleLogout}>
              Logout!
            </Button>
            <Button
              c="red"
              color="transparent"
              onClick={() => setShowLogoutModal(false)}
            >
              Cancel
            </Button>
          </Flex>
        </Stack>
      </PopUp>
      <Button
        color="red"
        onClick={() => setShowLogoutModal(true)}
        rightSection={<IconLogout />}
      >
        logout
      </Button>
    </>
  );
};

export default Logout;
