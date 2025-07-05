"use client";
import BorrowList from "@/common/components/Borrow/BorrowList";
import Spinner from "@/common/Spinner/Spinner";
import { useGetAllBorrows } from "@/hooks/borrow";
import { Stack } from "@mantine/core";

export default function Home() {
  const { data: borrows, isLoading, isSuccess } = useGetAllBorrows();

  if (isLoading) {
    return <Spinner />;
  }
  if (isSuccess && !borrows) {
    return "no data";
  }

  if (borrows) {
    return (
      <Stack>
        <h1>امانت‌ها</h1>
        <div>
          <BorrowList items={borrows} />
        </div>
      </Stack>
    );
  }
}
