"use client";
import { Container, Stack } from "@mantine/core";
import {
  Button,
  FileInput,
  IconButton,
  TextField,
} from "@tapsioss/react-components";
import { ArrowRight } from "@tapsioss/react-icons";
import { useRouter } from "next/navigation";
import { useGetProfile } from "@/hooks/profile";

const Page = () => {
  const router = useRouter();

  const { profile } = useGetProfile();
  const goToProfile = () => router.push("/profile");

  const handleSubmit = () => {
    alert("not implemented");
    goToProfile();
  };

  return (
    <Stack>
      <IconButton onClick={goToProfile} variant="naked">
        <ArrowRight />
      </IconButton>
      <h1>اطلاعات حساب کاربری</h1>
      <FileInput label="عکس پروفایل" value={"https://picsum.photos/200"} />
      <TextField label="نام" value={profile?.name} />
      <TextField label="شناسه" value={profile?.username} />
      <Button onClick={handleSubmit}>ثبت تغییرات</Button>
    </Stack>
  );
};

export default Page;
