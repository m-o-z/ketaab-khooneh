"use client";
import { useVerifyApi } from "@/hooks/auth";
import { Container, Stack } from "@mantine/core";
import {
  IconButton,
  PinInput,
  PinInputCompleteEvent,
  PinInputElement,
} from "@tapsioss/react-components";
import { ArrowRight } from "@tapsioss/react-icons";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import s from "./style.module.scss";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  if (!email) {
    // TODO: make handling not providing email better.
    throw new Error("No email provided.");
  }
  const otpId = useParams()["otpId"] as string;
  const [password, setPassword] = useState("");

  const { mutateAsync: verify, isPending, isError, error } = useVerifyApi();

  const handleSubmit = async (evt: PinInputCompleteEvent) => {
    const target = evt.target as PinInputElement;
    const value = target.value;
    if (value) {
      await verify({
        otpId,
        password: value,
        email: email,
        httpOnly: true,
      });
    }
  };

  const handleGoBack = () => {
    const url = new URL("/auth/login", window.origin);
    if (email) {
      url.searchParams.set("email", email);
    }
    router.push(url.toString());
  };

  const handlePasswordChange = (e: Event) => {
    const pinInput = e.currentTarget as PinInputElement;
    setPassword(pinInput.value);
  };

  return (
    <Container h="100vh" pos="fixed" top="0" right="0" left="0" bottom="0">
      <Stack justify="center" h="100%" maw={400} mx="auto">
        <Stack component="header" pt={10}>
          <IconButton
            onClick={handleGoBack}
            label="بازگشت به صفحه وارد کردن ایمیل"
            variant="naked"
          >
            <ArrowRight />
          </IconButton>
        </Stack>
        <Stack component="main" justify="center" h="100%" maw={400} flex={1}>
          <h1 style={{ margin: 0 }}>تایید ایمیل</h1>
          <p>کد ارسال شده به {email} را اینجا وارد کنید.</p>

          <PinInput
            className={s["pin-input"]}
            label="کد OTP"
            error={!!error}
            errorText={error?.message}
            type="numeric"
            inputMode="numeric"
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
