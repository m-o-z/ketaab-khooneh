"use client";
import React, { useState } from "react";
import {
  ActionIcon,
  Alert,
  Button,
  Container,
  Stack,
  TextInput,
} from "@mantine/core";
import login from "@/utils";
import {
  IconAt,
  IconEye,
  IconEyeClosed,
  IconMoodSad,
  IconPassword,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("amirhosseinalibakhshi@gmail.com");
  const [password, setPassword] = useState("faYjvKiLRhc_eE_");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleSubmit = async () => {
    const { isOk, error } = await login(email, password);
    if (isOk) {
      router.push(
        new URLSearchParams(window.location.search).get("next") || "/",
      );
    } else {
      setErrorMessage(error?.message || "Error in Authentication");
    }
  };

  return (
    <Container h="100vh" pos="fixed" top="0" right="0" left="0" bottom="0">
      <Stack justify="center" h="100%" maw={400} mx="auto">
        {errorMessage && (
          <Alert icon={<IconMoodSad />} color="red">
            {errorMessage}
          </Alert>
        )}
        <TextInput
          leftSection={<IconAt size={20} />}
          label="email"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
        <TextInput
          leftSection={<IconPassword size={20} />}
          rightSection={
            showPassword ? (
              <ActionIcon
                color="transparent"
                onClick={() => setShowPassword(false)}
              >
                <IconEye size={20} />
              </ActionIcon>
            ) : (
              <ActionIcon
                color="transparent"
                onClick={() => setShowPassword(true)}
              >
                <IconEyeClosed size={20} />
              </ActionIcon>
            )
          }
          label="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
        />
        <Button onClick={handleSubmit}>Login</Button>
      </Stack>
    </Container>
  );
};

export default Page;
