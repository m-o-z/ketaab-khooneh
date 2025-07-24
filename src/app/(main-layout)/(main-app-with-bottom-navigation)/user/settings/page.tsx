"use client";
import SettingGroup from "@/common/Setting/SettingGroup";
import SettingSwitchItem from "@/common/Setting/SettingSwitchItem";
import { useGetProfile } from "@/hooks/profile";
import { useDeviceInfo } from "@/hooks/useDeviceInfo";
import { usePushNotification } from "@/hooks/usePushNotification";
import { PageLayout } from "@/providers/PageLayout";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

const Page = () => {
  const { browser, platform, pwaMode, isMobile, hasPlatform, hasBrowser } =
    useDeviceInfo();

  const {
    data: profile,
    isLoading,
    isFetched,
    isError,
    isSuccess,
  } = useGetProfile();

  const { state, unsubscribe, subscribe } = usePushNotification();

  const router = useRouter();

  const shouldShowNotification = useMemo(() => {
    if (isMobile) {
      return platform === "android" && pwaMode === "standalone";
    } else {
      const isChromeVariationOrFirefox =
        !hasBrowser("ie") &&
        hasPlatform("android", "macos", "chromeos", "linux", "windows");
      return isChromeVariationOrFirefox;
    }
  }, [pwaMode, browser, platform]);

  const isNotificationGroupVisible = shouldShowNotification;

  const renderNotificationSettingItem = () => {
    if (shouldShowNotification) {
      return (
        <SettingGroup label="اطلاع‌رسانی‌ها">
          <SettingSwitchItem
            isLoading={state.isSubscribing}
            label="اعلان‌ها"
            isActive={state.init && state.isSubscribed}
            onChange={(value) => {
              console.log({ value, state });
              if (value) {
                subscribe();
              } else {
                unsubscribe();
              }
            }}
          />
        </SettingGroup>
      );
    }

    return null;
  };

  return (
    <PageLayout
      initialTitle="تنظیمات"
      showBackButton
      onBackClick={() => {
        router.back();
      }}
      isLoading={(isLoading || !state.init) && !isFetched}
      isError={isError}
      noContent={!profile && isSuccess}
    >
      <PageLayout.Content>
        {isNotificationGroupVisible ? renderNotificationSettingItem() : null}
      </PageLayout.Content>
    </PageLayout>
  );
};

export default Page;
