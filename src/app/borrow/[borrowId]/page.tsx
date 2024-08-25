"use client";
import {Stack,} from "@mantine/core";
import {useParams} from "next/navigation";
import Breadcrumb from "@/common/components/Breadcrumb";

// TODO: fix me
const Page = () => {
  const { borrowId } = useParams();
  return (
    <Stack maw={768} mx="auto">
      <Breadcrumb
          items={[
            {
              title: "Borrows",
              href: "/borrow",
            },
            {
              title: borrowId as string,
              href: `/borrow/${borrowId}`,
            },
          ]}
      />
      Borrow: {borrowId}
    </Stack>
  );
};

export default Page;
