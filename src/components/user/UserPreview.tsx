"use client";
import PreviewBase from "@/common/components/PreviewBase";
import PocketBasePublicService from "@/services/PocketBasePublicService";
import { User } from "@/types";
import { capitalizeName } from "@/utils/string";

type Props = {
  user: User;
};
const UserPreview = ({ user }: Props) => {
  return (
    <PreviewBase
      imageUrl={
        user.avatar
          ? PocketBasePublicService.Client().files.getURL(user, user.avatar)
          : ""
      }
      title={capitalizeName(user.name)}
      url={`/user/${user.id}`}
    />
  );
};

UserPreview.Compact = function Compact({ user }: Props) {
  return (
    <PreviewBase.Compact
      imageUrl={
        user.avatar
          ? PocketBasePublicService.Client().files.getURL(user, user.avatar)
          : ""
      }
      title={capitalizeName(user.name)}
      url={`/user/${user.id}`}
    />
  );
};

UserPreview.Loading = PreviewBase.Loading;

export default UserPreview;
