"use client";
import React from "react";
import { Avatar, Container, Stack, Text, Title } from "@mantine/core";
import { useGetProfile } from "@/hooks/profile";

const Page = () => {
  const {isFetched, profile} = useGetProfile();

  return (
    <Container h="100vh" pos="fixed" top="0" right="0" left="0" bottom="0">
      <Stack justify="center" h="100%" maw={400} mx="auto" align={"center"}>
        {
          isFetched && profile &&(
            <>
              <Avatar src={profile.avatar} alt="avatar" size="xl" />
              <Title ta="center">{profile.name}</Title>
              <Text>{profile.email}</Text>
            </>
          )
        }
       </Stack> 
    </Container>
  );
};

export default Page;
