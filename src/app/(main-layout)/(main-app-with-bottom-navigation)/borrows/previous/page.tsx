"use client";
import { PageLayout } from "@/providers/PageLayout";
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const router = useRouter();
  const onGoBack = () => {
    router.back();
  };
  return (
    <PageLayout
      initialTitle={"امانت‌های پیشین"}
      showBackButton
      onBackClick={onGoBack}
    >
      Previous
    </PageLayout>
  );
};

export default Page;
