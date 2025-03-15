"use client";
import { useLoginApi } from "@/hooks/auth";
import { ActionIcon, Button, Container, Stack, TextInput } from "@mantine/core";
import {
  IconAt,
  IconEye,
  IconEyeClosed,
  IconPassword,
} from "@tabler/icons-react";
import { useState } from "react";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync: login, isPending } = useLoginApi();

  const handleSubmit = async () => {
    await login({ email, password });
  };

  return (
    <Container h="100vh" pos="fixed" top="0" right="0" left="0" bottom="0">
      <Stack justify="center" h="100%" maw={400} mx="auto">
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
        <Button loading={isPending} onClick={handleSubmit}>
          Login
        </Button>
      </Stack>
    </Container>
  );
};

export default Page;
