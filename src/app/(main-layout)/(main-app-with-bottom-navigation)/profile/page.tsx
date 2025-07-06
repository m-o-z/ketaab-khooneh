"use client";
import ProfileLogoutRowItem from "@/common/components/Profile/ProfileLogoutRowItem";
import { useLogoutApi } from "@/hooks/auth";
import { useGetProfile } from "@/hooks/profile";
import { PageLayout } from "@/providers/PageLayout";
import { Flex, Stack } from "@mantine/core";
import { Avatar, Divider } from "@tapsioss/react-components";
import { useRouter } from "next/navigation";

const Page = () => {
  const { isFetched, data: profile } = useGetProfile();
  const router = useRouter();

  const { mutateAsync: logout, isPending } = useLogoutApi();

  const renderProfileHeader = () => {
    if (isFetched && profile)
      return (
        <Flex
          style={{ cursor: "pointer" }}
          onClick={() => router.push("/profile/edit")}
          align="center"
          gap={10}
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
    <PageLayout initialTitle="پروفایل">
      <div className="space-y-4">
        {renderProfileHeader()}
        <Divider variant="thick" className="-mr-4 w-[calc(100%+2rem)]" />
        <Stack>
          <ProfileLogoutRowItem
            logoutMutationAsync={logout}
            isPending={isPending}
          />
        </Stack>
      </div>
    </PageLayout>
  );
};

export default Page;
