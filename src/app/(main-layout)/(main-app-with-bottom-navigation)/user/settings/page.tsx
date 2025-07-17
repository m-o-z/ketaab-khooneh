"use client";
import SettingGroup from "@/common/Setting/SettingGroup";
import SettingSwitchItem from "@/common/Setting/SettingSwitchItem";
import { useGetProfile } from "@/hooks/profile";
import { usePushNotification } from "@/hooks/usePushNotification";
import { PageLayout } from "@/providers/PageLayout";
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const { data: profile, isLoading, isError, isSuccess } = useGetProfile();
  const { state, unsubscribe, subscribe } = usePushNotification();
  const router = useRouter();
  return (
    <PageLayout
      initialTitle="تنظیمات"
      showBackButton
      onBackClick={() => {
        router.back();
      }}
      isLoading={isLoading || !state.init}
      isError={isError}
      noContent={!profile && isSuccess}
    >
      <div className="h-full w-full flex">
        <SettingGroup label="اطلاع‌رسانی‌ها">
          <SettingSwitchItem
            isLoading={state.isSubscribing}
            label="اعلان‌ها"
            isActive={state.init && state.isSubscribed}
            onChange={(value) => {
              if (value) {
                subscribe();
              } else {
                unsubscribe();
              }
            }}
          />
        </SettingGroup>
      </div>
    </PageLayout>
  );
};

export default Page;
