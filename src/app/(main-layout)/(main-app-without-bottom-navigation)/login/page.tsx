"use client";
import { useLoginApi } from "@/hooks/auth";
import { Box, Container, Stack } from "@mantine/core";
import {
  Button,
  IconButton,
  TextField,
  TextFieldSlots,
} from "@tapsioss/react-components";
import { Envelope, Eye, EyeSlash, Lock } from "@tapsioss/react-icons";
import { useState } from "react";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync: login, isPending } = useLoginApi();

  const handleSubmit = async () => {
    await login({ username: email, password, httpOnly: true });
  };

  return (
    <Container h="100vh" pos="fixed" top="0" right="0" left="0" bottom="0">
      <Stack justify="center" h="100%" maw={400} mx="auto">
        <TextField
          label="آدرس ایمیل"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
        >
          <Envelope slot={TextFieldSlots.LEADING_ICON} />
        </TextField>
        <TextField
          label="رمز عبور"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
        >
          {showPassword ? (
            <IconButton
              slot={TextFieldSlots.TRAILING}
              variant="naked"
              onClick={() => setShowPassword(false)}
            >
              <Eye size={20} />
            </IconButton>
          ) : (
            <IconButton
              slot={TextFieldSlots.TRAILING}
              variant="naked"
              onClick={() => setShowPassword(true)}
            >
              <EyeSlash size={20} />
            </IconButton>
          )}
          <Lock slot={TextFieldSlots.LEADING_ICON} />
        </TextField>
        <Stack mt={8} w={"100%"}>
          <Button loading={isPending} onClick={handleSubmit} size="lg">
            ورود
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default Page;
