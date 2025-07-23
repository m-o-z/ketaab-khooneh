import { ProfileCompleteRequestPayload } from "@/app/api/users/profile/complete/route.schema";
import { isApiError } from "@/client/apiError";
import ProfileEditForm, {
  ProfileEditHandler,
} from "@/common/components/ProfileEdit/ProfileEditForm";
import { useEditProfileMutation } from "@/hooks/profile";
import { UserDTO } from "@/schema/users";
import { tick } from "@/utils/eventQueue";
import { objectToFormData } from "@/utils/formData";
import { getDirtyValues } from "@/utils/formSubmit";
import { notifications } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { memo, useMemo } from "react";

type Props = {
  user: UserDTO;
  avatar?: File;
};

const ProfileEdit = ({ user, avatar }: Props) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutateAsync: editProfileMutateAsync, isPending } =
    useEditProfileMutation();

  const defaultValues = useMemo<ProfileCompleteRequestPayload>(() => {
    return {
      firstName: user.firstName!,
      lastName: user.lastName!,
      avatar,
    };
  }, [user]);

  const onSubmit: ProfileEditHandler = async ({
    payload,
    setError,
    dirtyFields,
  }) => {
    const dirtyPayload = getDirtyValues(payload, dirtyFields);
    const formData = objectToFormData(dirtyPayload);
    if (formData && formData instanceof FormData) {
      try {
        await editProfileMutateAsync(formData);
        notifications.show({
          message: "با موفقیت ثبت شد",
          color: "green",
        });
        await tick();
        router.replace("/profile");
        queryClient.invalidateQueries({
          queryKey: ["users-me"],
        });
      } catch (err) {
        if (isApiError(err) && "errors" in err.data) {
          Object.entries<string[]>(err.data.errors).forEach(
            ([field, message]) => {
              if (message && message.length) {
                setError(field as any, {
                  type: "server",
                  message: message[0],
                });
              }
            },
          );
        } else if (
          err &&
          typeof err == "object" &&
          "message" in err &&
          typeof err.message === "string"
        ) {
          notifications.show({
            message: err.message as string,
            color: "red",
          });
        }
      }
    }
  };

  return (
    <ProfileEditForm
      noAvatarField
      isLoading={isPending}
      onSubmit={onSubmit}
      submitButtonText="اعمال تغییرات"
      defaultValues={defaultValues}
    />
  );
};

export default memo(ProfileEdit);
