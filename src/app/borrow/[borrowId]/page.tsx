"use client";
import { Stack } from "@mantine/core";
import { useParams } from "next/navigation";

// TODO: fix me
const Page = () => {
  const { borrowId } = useParams();
  return (
    <Stack maw={768} mx="auto">
      Borrow: {borrowId}
    </Stack>
  );
};

export default Page;
