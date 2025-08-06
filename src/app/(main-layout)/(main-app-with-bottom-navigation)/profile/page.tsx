"use client";
import { Flex, Stack } from "@mantine/core";
import {
  Avatar,
  Badge,
  Button,
  Divider,
  IconButton,
  Notice,
  NoticeSlots,
} from "@tapsioss/react-components";
import { ChevronLeft, FactCheck, Gear } from "@tapsioss/react-icons";
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
    if (isFetched && profile) {
      if (!profile.isProfileCompleted) {
        return (
          <div className="flex flex-col items-center justify-center space-y-4">
            <Notice
              visible
              color="warning"
              priority="low"
              heading="پروفایل شما تکمیل نشده است!"
              description="برای فعال شدن قابلیت امانت‌گیری کتاب‌ها، لازم است ابتدا پروفایل خود را تکمیل کنید."
            >
              <Button
                onClick={() => {
                  router.push("/profile/completion");
                }}
                slot={NoticeSlots.ACTION}
              >
                تکمیل پروفایل
              </Button>
            </Notice>
          </div>
        );
      } else if (profile.isProfileCompleted)
        return (
          <div
            className="flex items-center space-x-3 cursor-pointer w-full"
            onClick={() => router.push("/profile/edit")}
          >
            <div className="shrink-0">
              <Avatar image={profile.avatar} size="lg" />
            </div>
            <div className="grow">
              <h2 className="space-x-2 m-0">
                <span>{profile.displayName}</span>
                {profile.isPunished ? (
                  <Badge
                    className="inline-block"
                    color="error"
                    priority="low"
                    value={"جریمه شده"}
                  ></Badge>
                ) : null}
              </h2>
              <p>{profile.email}</p>
            </div>
            <div className="shrink-0 flex items-center">
              <IconButton variant="naked">
                <ChevronLeft />
              </IconButton>
            </div>
          </div>
        );
    }
  };

  return (
    <PageLayout
      initialTitle="پروفایل"
      isError={isError}
      isLoading={isLoading && !isFetched}
      retry={() => {
        void refetch();
      }}
    >
      <PageLayout.Content>
        <div className="space-y-4">
          {renderProfileHeader()}
          <Divider className="-mr-4 w-[calc(100%+2rem)]" variant="thick" />
          <div className="space-y-6 py-4">
            <ProfileItem
              onClick={() => {
                router.push("/user/settings");
              }}
              renderIcon={<Gear />}
            >
              تنظیمات
            </ProfileItem>
            <ProfileItem
              onClick={() => {
                router.push("/tac");
              }}
              renderIcon={<FactCheck />}
            >
              قوانین و شرایط
            </ProfileItem>
            <ProfileLogoutRowItem
              isPending={isPending}
              logoutMutationAsync={logout}
            />
          </div>
        </div>
      </PageLayout.Content>
    </PageLayout>
  );
};

export default Page;
