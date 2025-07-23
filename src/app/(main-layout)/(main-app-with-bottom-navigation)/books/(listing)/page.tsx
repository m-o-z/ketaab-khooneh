"use client";
import Spinner from "@/common/Spinner/Spinner";
import BooksListing from "@/components/BooksListing/BooksListing";
import React, { Suspense } from "react";

const Page = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <BooksListing />
    </Suspense>
  );
};

export default Page;
