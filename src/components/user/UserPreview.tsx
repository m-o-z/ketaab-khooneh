"use client";
import React from "react";
import { User } from "@/types";
import { capitalizeName } from "@/utils/string";
import pbClient from "@/client/pbClient";
import PreviewBase from "@/common/components/PreviewBase";

type Props = {
  user: User;
};
const UserPreview = ({ user }: Props) => {
  return (
    <PreviewBase
      title={capitalizeName(user.name)}
      imageUrl={user.avatar ? pbClient().files.getUrl(user, user.avatar) : ""}
      url={`/user/${user.id}`}
    />
  );
};

UserPreview.Compact = function Compact({ user }: Props) {
  return (
    <PreviewBase.Compact
      title={capitalizeName(user.name)}
      imageUrl={user.avatar ? pbClient().files.getUrl(user, user.avatar) : ""}
      url={`/user/${user.id}`}
    />
  );
};

UserPreview.Loading = PreviewBase.Loading;

export default UserPreview;
