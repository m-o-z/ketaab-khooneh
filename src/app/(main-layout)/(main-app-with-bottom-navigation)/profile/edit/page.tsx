"use client";
import ProfileEdit from "@/components/Profile/ProfileEdit";
import { useGetProfile } from "@/hooks/profile";
import { PageLayout } from "@/providers/PageLayout";
import { urlToFile } from "@/utils/urlToFile";
import React, { useCallback, useEffect, useState } from "react";

const Edit = () => {
  const { data: user, isLoading, isError, isSuccess } = useGetProfile();
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
      isLoading={isLoading}
      isError={isError || isAvatarError}
      noContent={!user && isSuccess}
    >
      {renderContent()}
    </PageLayout>
  );
};

export default Edit;
