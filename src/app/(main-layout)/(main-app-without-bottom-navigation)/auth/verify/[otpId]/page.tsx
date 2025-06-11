"use client";
import { useVerifyApi } from "@/hooks/auth";
import { Container, Stack } from "@mantine/core";
import { Button, IconButton, PinInput, PinInputElement, TextField, TextFieldSlots } from "@tapsioss/react-components";
import { ArrowRight, Envelope } from "@tapsioss/react-icons";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import s from './styles.module.css'

const Page = () => {
  const router = useRouter();
  const otpId = useParams()["otpId"] as string;
  const [password, setPassword] = useState("");

  const { mutateAsync: verify, isPending, isError, error } = useVerifyApi();

  const handleSubmit = async () => {
    await verify({ otpId, password, httpOnly: true });
  };

  const handleGoBack = () => {
    router.push('/auth/login')
  }

  const handlePasswordChange = (e: Event) => {
    const pinInput = e.currentTarget as PinInputElement
    setPassword(pinInput.value)
  }

  return (
    <Container h="100vh" pos="fixed" top="0" right="0" left="0" bottom="0">
      <Stack justify="center" h="100%" maw={400} mx="auto">
        <Stack component="header" pt={10}>
          <IconButton onClick={handleGoBack} label="بازگشت به صفحه وارد کردن ایمیل" variant="naked">
            <ArrowRight />
          </IconButton>
        </Stack>
        <Stack component="main" justify="center" h="100%" maw={400} flex={1}>
          <h1 style={{ margin: 0 }}>تایید ایمیل</h1>
          <p>کد ارسال شده به {otpId} را اینجا وارد کنید.</p>

          <PinInput
            className={s['pin-input']}
            label="کد OTP"
            error={!!error}
            errorText={error?.message}
            autoFocus
            hideLabel
            autocomplete="one-time-code"
            value={password}
            onChange={handlePasswordChange}
            onComplete={handleSubmit}

          ></PinInput>
        </Stack>
      </Stack>
    </Container>
  );
};

export default Page;
