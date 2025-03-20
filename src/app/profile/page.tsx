"use client";
import React from "react";
import { Avatar, Container, Stack, Text, Title } from "@mantine/core";
import { useGetProfile } from "@/hooks/profile";
import pbClient from "@/client/pbClient";
import UserPreview from "@/components/user/UserPreview";

const Page = () => {
  const { isFetched, profile } = useGetProfile();
  return (
    <Stack>
      <h1>پروفایل</h1>
      {isFetched && profile && (
        <>
          <UserPreview user={profile} />
        </>
      )}
    </Stack>
  );
};

export default Page;
