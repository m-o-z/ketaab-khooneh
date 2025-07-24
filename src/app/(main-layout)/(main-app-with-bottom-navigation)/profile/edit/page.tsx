"use client";
import ProfileEdit from "@/components/Profile/ProfileEdit";
import { useGetProfile } from "@/hooks/profile";
import { PageLayout } from "@/providers/PageLayout";
import { urlToFile } from "@/utils/urlToFile";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

const Edit = () => {
  const router = useRouter();
  const {
    data: user,
    isFetched,
    isLoading,
    isError,
    isSuccess,
  } = useGetProfile();
  const [avatar, setAvatar] = useState<File | null>(null);
  const [isAvatarError, setIsAvatarError] = useState(false);

  const fetchAvatar = useCallback(() => {
    if (user) {
      return urlToFile(user.avatar, user.email);
    }
  }, [user]);

  useEffect(() => {
    (async () => {
      try {
        const result = await fetchAvatar();
        if (!result) {
          return;
        }
        setAvatar(result);
        setIsAvatarError(false);
      } catch (err) {
        setIsAvatarError(true);
      }
    })();
  }, [user]);

  const renderContent = () => {
    if (user && avatar) {
      return <ProfileEdit user={user} avatar={avatar} />;
    }
    return null;
  };
  return (
    <PageLayout
      showBackButton
      initialTitle="ویرایش پروفایل"
      onBackClick={() => {
        router.back();
      }}
      isInitialLoading={
        (isLoading && !isFetched) || (!isAvatarError && !avatar)
      }
      isError={isError || isAvatarError}
      noContent={!user && isSuccess}
    >
      <PageLayout.Content>{renderContent()}</PageLayout.Content>
    </PageLayout>
  );
};

export default Edit;
