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
import { PageLayout } from "@/providers/PageLayout";
import { isClient } from "@/utils/window";

import s from "./style.module.scss";

const VerifyPage = () => {
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
    if (isClient()) {
      const url = new URL("/auth/login", window.origin);
      if (email) {
        url.searchParams.set("email", email);
      }
      router.push(url.toString());
    }
  };

  const handlePasswordChange = (e: Event) => {
    const pinInput = e.currentTarget as PinInputElement;
    setPassword(pinInput.value);
  };

  const onBackClick = () => {
    router.back();
  };

  return (
    <PageLayout
      showBackButton
      initialTitle="کد تایید"
      onBackClick={onBackClick}
    >
      <Stack
        align="center"
        component="main"
        flex={1}
        h="100%"
        justify="center"
        maw={400}
      >
        <Title
          order={3}
          styles={{
            root: {
              // fontSize: "1.5rem",
              position: "relative",
            },
          }}
        >
          وارد کردن کد تایید
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
    </PageLayout>
  );
};

export default VerifyPage;
