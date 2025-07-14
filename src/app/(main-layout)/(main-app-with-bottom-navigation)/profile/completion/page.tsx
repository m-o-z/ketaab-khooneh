"use client";
import { PageLayout } from "@/providers/PageLayout";
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const router = useRouter();
  return (
    <PageLayout
      showBackButton
      onBackClick={() => {
        router.back();
      }}
      initialTitle="تکمیل پروفایل"
    >
      <div className="h-full w-full flex items-center justify-center">
        Profile Completion
      </div>
    </PageLayout>
  );
};

export default Page;
