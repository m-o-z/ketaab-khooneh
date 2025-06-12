"use client";
import Spinner from "@/common/Spinner/Spinner";
import LoginPage from "@/components/pages/LoginPage/LoginPage";
import { Suspense } from "react";

const Page = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <LoginPage />
    </Suspense>
  );
};

export default Page;
