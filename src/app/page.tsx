"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

type Props = {};

const Page = ({}: Props) => {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      if (router) {
        router.push("/book");
      }
    }, 2000);
  }, [router]);
  return <div></div>;
};

export default Page;
