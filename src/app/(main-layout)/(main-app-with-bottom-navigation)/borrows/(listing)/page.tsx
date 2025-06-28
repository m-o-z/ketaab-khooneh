"use client";
import Spinner from "@/common/Spinner/Spinner";
import { useGetAllBorrows } from "@/hooks/borrow";
import { Stack } from "@mantine/core";

export default function Home() {
  const { data, isLoading, isSuccess } = useGetAllBorrows();

  if (isLoading) {
    return <Spinner />;
  }
  if (isSuccess && !data) {
    return "no data";
  }
  if (data) {
    console.log({ data });
    return (
      <Stack>
        <h1>امانت‌ها</h1>
        {data.map((borrow) => (
          <div key={borrow.id}>
            <div>{borrow.status}</div>
          </div>
        ))}
      </Stack>
    );
  }
}
