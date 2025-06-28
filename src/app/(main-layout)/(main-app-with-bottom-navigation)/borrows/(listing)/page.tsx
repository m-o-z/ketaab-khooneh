"use client";
import { useGetAllBorrows } from "@/hooks/borrow";
import { Stack } from "@mantine/core";

export default function Home() {
  const { data } = useGetAllBorrows();
  return (
    <Stack>
      <h1>امانت‌ها</h1>
      <pre dir="ltr">{JSON.stringify(data, null, 2)}</pre>
    </Stack>
  );
}
