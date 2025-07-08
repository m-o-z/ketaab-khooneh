import { Box, Flex } from "@mantine/core";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { ArrowRightFromLine } from "@tapsioss/react-icons";
import tokens from "@tapsioss/theme/tokens";
import React, { CSSProperties } from "react";

import ConfirmationModal from "../ConfirmationModal";
import ProfileItem from "./ProfileItem";
type Props = {
  logoutMutationAsync: UseMutateAsyncFunction<null, Error, {}, unknown>;
  isPending: boolean;
};

const ProfileLogoutRowItem = ({ logoutMutationAsync, isPending }: Props) => {
  const onClick = () => {
    void logoutMutationAsync({});
  };

  return (
    <ConfirmationModal
      acceptButtonTitle="خروج"
      acceptButtonVariant="destructive"
      denyButtonTitle="انصراف"
      description={"آیا می‌خواهید از حساب کاربری خود خارج شوید؟"}
      heading="خروج از حساب کاربری"
      isPending={isPending}
      renderImage={() => (
        <svg
          fill="none"
          height="64"
          style={{ marginTop: "2rem" }}
          viewBox="0 0 64 64"
          width="64"
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
      onConfirm={onClick}
    >
      {({ show }) => (
        <ProfileItem
          className="text-[var(--color)]"
          renderIcon={<ArrowRightFromLine />}
          style={{ "--color": tokens.color.content.negative } as CSSProperties}
          onClick={show}
        >
          خروج از حساب کاربری
        </ProfileItem>
      )}
    </ConfirmationModal>
  );
};

export default ProfileLogoutRowItem;
