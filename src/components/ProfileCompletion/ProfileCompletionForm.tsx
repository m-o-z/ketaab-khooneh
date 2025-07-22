import { profileCompleteSchema } from "@/app/api/users/profile/complete/route.schema";
import { isApiError } from "@/client/apiError";
import { useCompleteProfileMutation } from "@/hooks/profile";
import { tick } from "@/utils/eventQueue";
import { objectToFormData } from "@/utils/formData";
import { isZodError } from "@/utils/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, FileInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@tapsioss/react-components/Button";
import { TextField } from "@tapsioss/react-components/TextField";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function ProfileCompletionForm() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutateAsync: completeProfileMutateAsync, isPending } =
    useCompleteProfileMutation();

  const [avatarURL, setAvatarURL] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isValid },
    watch,
  } = useForm({
    resolver: zodResolver(profileCompleteSchema),
    mode: "onChange",
  });

  // Watch the avatar file input for preview
  React.useEffect(() => {
    const avatarFile = watch("avatar");
    if (avatarFile) {
      const value = URL.createObjectURL(avatarFile);
      setAvatarURL(value);
    }
  }, [watch("avatar")]);

  const onSubmit = async (data: Record<string, any>) => {
    const formData = objectToFormData(data);
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
        }
      }
    }
  };

  return (
    <div className="w-full p-4">
      <form onSubmit={handleSubmit(onSubmit)} dir="rtl" className="space-y-4">
        <div className="flex justify-center ">
          <Avatar size={96} src={avatarURL} radius="xl" />
        </div>

        <TextField
          className="w-full"
          error={!!errors.firstName?.message}
          errorText={errors.firstName?.message}
          label="نام"
          placeholder="نام خود را وارد کنید"
          dir="rtl"
          {...register("firstName")}
          max="20"
        />
        <TextField
          className="w-full"
          error={!!errors.lastName?.message}
          errorText={errors.lastName?.message}
          placeholder="نام خانوادگی خود را وارد کنید"
          label="نام خانوادگی"
          dir="rtl"
          {...register("lastName")}
          max="20"
        />
        <Controller
          name="avatar"
          control={control}
          render={({ field }) => (
            <FileInput
              size="md"
              label="بارگذاری عکس پروفایل"
              placeholder="یک تصویر انتخاب کنید"
              accept="image/png,image/jpeg"
              mt="md"
              error={errors.avatar?.message}
              onChange={(file) => {
                if (!file) {
                  return;
                }
                setValue("avatar", file, { shouldValidate: true });
              }}
              dir="rtl"
            />
          )}
        />
        <div className="flex justify-end pt-2">
          <Button
            size="lg"
            type="submit"
            disabled={!isValid || isPending}
            loading={isPending}
          >
            ارسال
          </Button>
        </div>
      </form>
    </div>
  );
}
