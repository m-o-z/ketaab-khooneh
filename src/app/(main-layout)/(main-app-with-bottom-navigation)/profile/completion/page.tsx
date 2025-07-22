"use client";
import ProfileCompletionForm from "@/components/ProfileCompletion/ProfileCompletionForm";
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
        <ProfileCompletionForm />
      </div>
    </PageLayout>
  );
};

export default Page;
