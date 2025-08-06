import { ProfileCompleteRequestPayload } from "@/app/api/users/profile/complete/route.schema";
import { isApiError } from "@/client/apiError";
import ProfileEditForm, {
  ProfileEditHandler,
} from "@/common/components/ProfileEdit/ProfileEditForm";
import { useCompleteProfileMutation } from "@/hooks/profile";
import { tick } from "@/utils/eventQueue";
import { objectToFormData } from "@/utils/formData";
import { notifications } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function ProfileCompletionForm() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutateAsync: completeProfileMutateAsync, isPending } =
    useCompleteProfileMutation();

  const onSubmit: ProfileEditHandler = async ({ payload, setError }) => {
    const formData = objectToFormData(payload);
    if (formData && formData instanceof FormData) {
      try {
        await completeProfileMutateAsync(formData);
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
      onSubmit={onSubmit}
      submitButtonText="ثبت"
      isLoading={isPending}
    />
  );
}
