"use client";
import { Box, Stack, Text, Title } from "@mantine/core";
import {
  IconButton,
  PinInput,
  PinInputCompleteEvent,
  PinInputElement,
} from "@tapsioss/react-components";
import { ArrowRight } from "@tapsioss/react-icons";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import Spinner from "@/common/Spinner/Spinner";
import { useVerifyApi } from "@/hooks/auth";

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
    <Stack h="100%" justify="center" maw={400}>
      <Stack component="header">
        <IconButton
          label="بازگشت به صفحه وارد کردن ایمیل"
          variant="naked"
          onClick={handleGoBack}
        >
          <ArrowRight />
        </IconButton>
      </Stack>
      <Stack
        align="center"
        component="main"
        flex={1}
        h="100%"
        justify="center"
        maw={400}
      >
        <Title
          order={1}
          styles={{
            root: {
              // fontSize: "1.5rem",
              position: "relative",
            },
          }}
        >
          تایید ایمیل
          <Box
            style={{
              display: "inline-block",
              transform: "translateY(6px) translateX(-2.25rem)",
              marginRight: "-1.75rem",
              width: "1.75rem",
            }}
          >
            {isPending && <Spinner />}
          </Box>
        </Title>
        <Text
          styles={{
            root: {
              textAlign: "center",
              color: "var(--tapsi-palette-gray-500)",
            },
          }}
        >
          کد ارسال شده به {email} را اینجا وارد کنید.
        </Text>

        <PinInput
          autoFocus
          hideLabel
          autocomplete="one-time-code"
          className={s["pin-input"]}
          error={!!error}
          errorText={error?.message}
          inputMode="numeric"
          label="کد OTP"
          type="numeric"
          value={password}
          onChange={handlePasswordChange}
          onComplete={handleSubmit}
        />
      </Stack>
    </Stack>
  );
};

export default Page;
