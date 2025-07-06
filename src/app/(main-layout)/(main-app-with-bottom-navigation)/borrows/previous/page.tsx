"use client";
import { useRouter } from "next/navigation";
import React from "react";

import Spinner from "@/common/Spinner/Spinner";
import { useGetAllPreviousBorrowsQuery } from "@/hooks/borrow";
import { PageLayout } from "@/providers/PageLayout";

const Page = () => {
  const {
    data: borrows,
    isLoading,
    isSuccess,
  } = useGetAllPreviousBorrowsQuery();
  const router = useRouter();
  const onGoBack = () => {
    router.back();
  };
  if (isLoading) {
    return <Spinner />;
  }
  if (isSuccess && !borrows) {
    return "no data";
  }

  if (borrows) {
    return (
      <PageLayout
        showBackButton
        initialTitle={"امانت‌های پیشین"}
        onBackClick={onGoBack}
      >
        Previous
      </PageLayout>
    );
  }
};

export default Page;
