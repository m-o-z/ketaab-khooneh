import {
  ProfileCompleteRequestPayload,
  profileCompleteSchema,
} from "@/app/api/users/profile/complete/route.schema";
import { MaybePromise } from "@/utils/type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, FileInput } from "@mantine/core";
import { Button } from "@tapsioss/react-components/Button";
import { TextField } from "@tapsioss/react-components/TextField";
import React, { memo, useRef, useState } from "react";
import {
  Controller,
  useForm,
  UseFormSetError,
  UseFormSetValue,
} from "react-hook-form";

type DirtyFields<T> = {
  [key in keyof T]?: boolean;
};

type OnSubmitPayload = {
  payload: ProfileCompleteRequestPayload;
  setError: UseFormSetError<ProfileCompleteRequestPayload>;
  setValue: UseFormSetValue<ProfileCompleteRequestPayload>;
  dirtyFields: Partial<Readonly<DirtyFields<ProfileCompleteRequestPayload>>>;
};

export type ProfileEditHandler = (
  _: OnSubmitPayload,
) => MaybePromise<any | void>;

type Props = {
  noAvatarField?: boolean;
  isLoading: boolean;
  submitButtonText?: string;
  defaultValues?: Partial<ProfileCompleteRequestPayload>;
  onSubmit?: ProfileEditHandler;
};

export default memo(function ProfileEditForm({
  isLoading = false,
  submitButtonText = "ثبت",
  defaultValues = {
    avatar: undefined,
    firstName: "",
    lastName: "",
  },
  noAvatarField,
  onSubmit,
}: Props) {
  const [avatarURL, setAvatarURL] = useState<string | null>(null);

  const defaultValuesRef = useRef(defaultValues);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isValid, isDirty, dirtyFields },
    watch,
  } = useForm<ProfileCompleteRequestPayload>({
    resolver: zodResolver(profileCompleteSchema),
    defaultValues: defaultValuesRef.current as any,
    mode: "onChange",
  });

  React.useEffect(() => {
    const avatarFile = watch("avatar");

    if (avatarFile) {
      const value = URL.createObjectURL(avatarFile);
      setAvatarURL(value);

      // Cleanup function to revoke the URL
      return () => {
        URL.revokeObjectURL(value);
      };
    } else {
      setAvatarURL(null);
    }
  }, [watch("avatar")]);

  const onSubmitHandler = async (data: ProfileCompleteRequestPayload) => {
    if (onSubmit && typeof onSubmit === "function") {
      onSubmit({
        payload: data,
        setError,
        setValue,
        dirtyFields,
      });
    }
  };

  return (
    <div className="w-full p-4">
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        dir="rtl"
        className="space-y-4"
      >
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

        {!noAvatarField ? (
          <Controller
            name="avatar"
            control={control}
            render={() => (
              <FileInput
                size="md"
                label="بارگذاری عکس پروفایل"
                placeholder="یک تصویر انتخاب کنید"
                accept="image/png,image/jpeg"
                mt="md"
                error={errors.avatar?.message}
                onChange={(file) => {
                  if (!file) {
                    setValue("avatar", undefined, {
                      shouldTouch: true,
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                    return;
                  }
                  setValue("avatar", file, {
                    shouldTouch: true,
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
                dir="rtl"
              />
            )}
          />
        ) : null}
        <div className="flex justify-end pt-2">
          <Button
            size="lg"
            type="submit"
            disabled={!isValid || isLoading || !isDirty}
            loading={isLoading}
          >
            {submitButtonText}
          </Button>
        </div>
      </form>
    </div>
  );
});
