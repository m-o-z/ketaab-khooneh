import React from "react";
import ConfirmationModal from "../ConfirmationModal";
import tokens from "@tapsioss/theme/tokens";
import { Box, Flex } from "@mantine/core";
import { ArrowRightFromLine } from "@tapsioss/react-icons";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
type Props = {
  logoutMutationAsync: UseMutateAsyncFunction<null, Error, {}, unknown>;
  isPending: boolean;
};

const ProfileLogoutRowItem = ({ logoutMutationAsync, isPending }: Props) => {
  const onClick = async () => {
    logoutMutationAsync({});
  };

  return (
    <ConfirmationModal
      heading="خروج از حساب کاربری"
      description={"آیا می‌خواهید از حساب کاربری خود خارج شوید؟"}
      denyButtonTitle="انصراف"
      acceptButtonTitle="خروج"
      acceptButtonVariant="destructive"
      onConfirm={onClick}
      isPending={isPending}
      renderImage={() => (
        <svg
          style={{ marginTop: "2rem" }}
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 32C4 16.536 16.536 4 32 4C47.464 4 60 16.536 60 32C60 47.464 47.464 60 32 60C16.536 60 4 47.464 4 32Z"
            fill="#FFEFED"
          />
          <path
            d="M30.25 36.0834H33.75V39.5834H30.25V36.0834ZM30.25 24.4167H33.75V33.75H30.25V24.4167Z"
            fill="#E11900"
          />
        </svg>
      )}
    >
      {({ show }) => (
        <Flex
          style={{ cursor: "pointer" }}
          onClick={show}
          c={tokens.color.content.negative}
          columnGap="xs"
          align="center"
        >
          <Box h={24} w={24}>
            <ArrowRightFromLine />
          </Box>
          <p style={{ color: "inherit" }}>خروج از حساب کاربری</p>
        </Flex>
      )}
    </ConfirmationModal>
  );
};

export default ProfileLogoutRowItem;
