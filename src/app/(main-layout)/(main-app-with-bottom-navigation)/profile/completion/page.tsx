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
      <ProfileCompletionForm />
    </PageLayout>
  );
};

export default Page;
