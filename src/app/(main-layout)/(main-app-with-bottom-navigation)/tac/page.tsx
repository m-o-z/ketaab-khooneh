"use client";
import { useGetProfile } from "@/hooks/profile";
import { PageLayout } from "@/providers/PageLayout";
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const router = useRouter();
  return (
    <PageLayout
      initialTitle="قوانین و شرایط"
      showBackButton
      onBackClick={() => {
        router.back();
      }}
    >
      <div className="h-full w-full flex items-center justify-center">
        Terms and Conditions
      </div>
    </PageLayout>
  );
};

export default Page;
