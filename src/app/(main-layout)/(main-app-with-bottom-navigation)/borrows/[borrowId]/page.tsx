"use client";
import { Container, Stack } from "@mantine/core";
import { useParams } from "next/navigation";
import useCheckAuthentication from "@/hooks/useCheckAuthentication"; // TODO: fix me

// TODO: fix me
const Page = () => {
  useCheckAuthentication();

  const { borrowId } = useParams();
  return (
    <Stack maw={768} mx="auto">
      Borrow: {borrowId}
    </Stack>
  );
};

export default Page;
