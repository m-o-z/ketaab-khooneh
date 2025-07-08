"use client";
import { Flex, Stack } from "@mantine/core";
import { Avatar, Divider } from "@tapsioss/react-components";
import { Gear } from "@tapsioss/react-icons";
import { useRouter } from "next/navigation";

import ProfileItem from "@/common/components/Profile/ProfileItem";
import ProfileLogoutRowItem from "@/common/components/Profile/ProfileLogoutRowItem";
import { useLogoutApi } from "@/hooks/auth";
import { useGetProfile } from "@/hooks/profile";
import { PageLayout } from "@/providers/PageLayout";

const Page = () => {
  const {
    isFetched,
    data: profile,
    refetch,
    isError,
    isLoading,
  } = useGetProfile();
  const router = useRouter();

  const { mutateAsync: logout, isPending } = useLogoutApi();

  const renderProfileHeader = () => {
    if (isFetched && profile)
      return (
        <Flex
          align="center"
          gap={10}
          style={{ cursor: "pointer" }}
          onClick={() => router.push("/profile/edit")}
        >
          <Avatar image={profile.avatar} />
          <Stack gap={0}>
            <h2 style={{ margin: 0 }}>{profile.name}</h2>
            <p>{profile.email}</p>
          </Stack>
        </Flex>
      );
  };

  return (
    <PageLayout
      initialTitle="پروفایل"
      isError={isError}
      isLoading={isLoading}
      retry={() => {
        void refetch();
      }}
    >
      <div className="space-y-4">
        {renderProfileHeader()}
        <Divider className="-mr-4 w-[calc(100%+2rem)]" variant="thick" />
        <Stack>
          <ProfileItem renderIcon={<Gear />}>تنظیمات</ProfileItem>
          <ProfileLogoutRowItem
            isPending={isPending}
            logoutMutationAsync={logout}
          />
        </Stack>
      </div>
    </PageLayout>
  );
};

export default Page;
