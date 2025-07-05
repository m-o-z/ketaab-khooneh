"use client";
import PreviewBase from "@/common/components/PreviewBase";
import { User } from "@/types";
import PocketBasePublicService from "@/services/PocketBasePublicService";
import { capitalizeName } from "@/utils/string";

type Props = {
  user: User;
};
const UserPreview = ({ user }: Props) => {
  return (
    <PreviewBase
      title={capitalizeName(user.name)}
      imageUrl={
        user.avatar
          ? PocketBasePublicService.Client().files.getURL(user, user.avatar)
          : ""
      }
      url={`/user/${user.id}`}
    />
  );
};

UserPreview.Compact = function Compact({ user }: Props) {
  return (
    <PreviewBase.Compact
      title={capitalizeName(user.name)}
      imageUrl={
        user.avatar
          ? PocketBasePublicService.Client().files.getURL(user, user.avatar)
          : ""
      }
      url={`/user/${user.id}`}
    />
  );
};

UserPreview.Loading = PreviewBase.Loading;

export default UserPreview;
