"use client";
import {Stack} from "@mantine/core";
import Breadcrumb from "@/common/components/Breadcrumb";

export default function Home() {
  return (
      <Stack maw={768} mx="auto">
        <Breadcrumb
          items={[
            {
              title: "Borrows",
              href: "/borrow",
            },
          ]}
        />
      </Stack>
  );
}
