"use client";
import React from "react";
import { Box, Container, Flex, Stack } from "@mantine/core";
import { Avatar, Divider } from "@tapsioss/react-components";
import { useGetProfile } from "@/hooks/profile";
import pbClient from "@/client/pbClient";
import {
  ArrowRightFromLine,
  ClockArrowCirclepath,
} from "@tapsioss/react-icons";
import tokens from "@tapsioss/theme/tokens";
import ConfirmationModal from "@/common/components/ConfirmationModal";
import { useLogoutApi } from "@/hooks/auth";
import { useRouter } from "next/navigation";

const Page = () => {
  const { isFetched, profile } = useGetProfile();
  const router = useRouter();

  const { mutateAsync: logout, isPending } = useLogoutApi();

  const renderProfileHeader = () => {
    if (isFetched && profile)
      return (
        <Flex
          style={{ cursor: "pointer" }}
          onClick={() => router.push("/edit-profile")}
          align="center"
          gap={10}
        >
          <Avatar image={pbClient.files.getUrl(profile, profile.avatar)} />
          <Stack gap={0}>
            <h2 style={{ margin: 0 }}>{profile.name}</h2>
            <p>{profile.email}</p>
          </Stack>
        </Flex>
      );
  };

  return (
    <>
      <Container>
        <Stack>
          <h1>پروفایل</h1>
          {renderProfileHeader()}
        </Stack>
      </Container>
      <Divider variant="thick" />
      <Container>
        <Stack>
          <Flex columnGap="xs" align="center">
            <Box
              style={(theme) => ({
                color: theme.colors.gray[6],
              })}
              h={24}
              w={24}
            >
              <ClockArrowCirclepath />
            </Box>
            <p>امانت‌ها</p>
          </Flex>
          <ConfirmationModal
            heading="خروج از حساب کاربری"
            description={"آیا می‌خواهید از حساب کاربری خود خارج شوید؟"}
            denyButtonTitle="انصراف"
            acceptButtonTitle="خروج"
            acceptButtonVariant="destructive"
            onConfirm={logout}
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
        </Stack>
      </Container>
    </>
  );
};

export default Page;
