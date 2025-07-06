"use client";
import { Button, Stack } from "@mantine/core";
import { IconButton } from "@tapsioss/react-components/IconButton";
import { ClockDashed } from "@tapsioss/react-icons";
import { useRouter } from "next/navigation";

import BorrowList from "@/common/components/Borrow/BorrowList";
import Spinner from "@/common/Spinner/Spinner";
import { useGetAllBorrowsQuery } from "@/hooks/borrow";
import { PageLayout } from "@/providers/PageLayout";

export default function Home() {
  const router = useRouter();
  const { data: borrows, isLoading, isSuccess } = useGetAllBorrowsQuery();

  if (isLoading) {
    return <Spinner />;
  }
  if (isSuccess && !borrows) {
    return "no data";
  }

  const onClickPreviousBorrowButton = () => {
    router.push("/borrows/previous");
  };

  if (borrows) {
    return (
      <PageLayout
        goToTopEnabled
        initialActions={
          <IconButton variant="naked" onClick={onClickPreviousBorrowButton}>
            <ClockDashed />
          </IconButton>
        }
        initialTitle={"امانت‌ها"}
      >
        <div>
          <BorrowList items={borrows} />
        </div>
      </PageLayout>
    );
  }
}
