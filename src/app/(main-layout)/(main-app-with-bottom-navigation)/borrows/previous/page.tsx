"use client";
import { useRouter } from "next/navigation";

import BorrowList from "@/common/components/Borrow/BorrowList";
import { useGetAllPreviousBorrowsQuery } from "@/hooks/borrow";
import { PageLayout } from "@/providers/PageLayout";

const Page = () => {
  const {
    data: borrows,
    refetch,
    isError,
    isLoading,
    isSuccess,
  } = useGetAllPreviousBorrowsQuery();
  const router = useRouter();
  const onGoBack = () => {
    router.back();
  };

  if (borrows) {
    return (
      <PageLayout
        showBackButton
        initialTitle={"امانت‌های پیشین"}
        isError={isError}
        isLoading={isLoading}
        noContent={borrows.length === 0 && isSuccess}
        retry={() => {
          void refetch();
        }}
        onBackClick={onGoBack}
      >
        <BorrowList items={borrows} />
      </PageLayout>
    );
  }
};

export default Page;
