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
    isFetched,
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
        isInitialLoading={isLoading && !isFetched}
        noContent={borrows.length === 0 && isSuccess}
        retry={() => {
          void refetch();
        }}
        onBackClick={onGoBack}
      >
        <PageLayout.Content>
          <BorrowList items={borrows} />
        </PageLayout.Content>
      </PageLayout>
    );
  }
};

export default Page;
