"use client";
import { Container, Stack } from "@mantine/core";
import { useParams } from "next/navigation";
import useCheckAuthentication from "@/hooks/useCheckAuthentication"; // TODO: fix me

// TODO: fix me
const Page = () => {
  useCheckAuthentication();

  const { borrowId } = useParams();
  return (
    <Container>
      <Stack maw={768} mx="auto">
        Borrow: {borrowId}
      </Stack>
    </Container>
  );
};

export default Page;
