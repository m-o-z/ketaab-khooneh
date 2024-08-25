"use client";
import React from "react";
import { Avatar, Container, Stack, Text, Title } from "@mantine/core";
import { useGetProfile } from "@/hooks/profile";
import pbClient from "@/client/pbClient";
import UserPreview from "@/components/user/UserPreview";

const Page = () => {
  const { isFetched, profile } = useGetProfile();
  return (
    <Container h="100vh">
      <Stack justify="center" h="100%" maw={400} mx="auto" align={"center"}>
        {isFetched && profile && (
          <>
            <UserPreview user={profile} />
          </>
        )}
      </Stack>
    </Container>
  );
};

export default Page;
