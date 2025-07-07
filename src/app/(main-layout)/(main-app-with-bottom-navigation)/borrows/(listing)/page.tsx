"use client";
import { IconButton } from "@tapsioss/react-components/IconButton";
import { ClockDashed } from "@tapsioss/react-icons";
import { useRouter } from "next/navigation";

import BorrowList from "@/common/components/Borrow/BorrowList";
import { useGetAllBorrowsQuery } from "@/hooks/borrow";
import { PageLayout } from "@/providers/PageLayout";

export default function Home() {
  const router = useRouter();
  const {
    data: borrows,
    isError,
    isLoading,
    isSuccess,
  } = useGetAllBorrowsQuery();

  const onClickPreviousBorrowButton = () => {
    router.push("/borrows/previous");
  };

  return (
    <PageLayout
      goToTopEnabled
      initialActions={
        <IconButton variant="naked" onClick={onClickPreviousBorrowButton}>
          <ClockDashed />
        </IconButton>
      }
      initialTitle={"امانت‌ها"}
      isError={isError}
      isLoading={isLoading}
      noContent={isSuccess && borrows.length == 0}
    >
      <BorrowList items={borrows!} />
    </PageLayout>
  );
}
