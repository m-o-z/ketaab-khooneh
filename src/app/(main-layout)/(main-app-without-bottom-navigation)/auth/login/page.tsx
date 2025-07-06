"use client";
import { Suspense } from "react";

import Spinner from "@/common/Spinner/Spinner";
import LoginPage from "@/components/pages/LoginPage/LoginPage";

const Page = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <LoginPage />
    </Suspense>
  );
};

export default Page;
