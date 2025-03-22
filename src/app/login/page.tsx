"use client";
import { useLoginApi } from "@/hooks/auth";
import { ActionIcon, Container, Stack, TextInput } from "@mantine/core";
import {
  TextField,
  Button,
  TextFieldSlots,
  IconButton,
} from "@tapsioss/react-components";
import {
  IconAt,
  IconEye,
  IconEyeClosed,
  IconPassword,
} from "@tabler/icons-react";
import { useState } from "react";
import {
  Envelope,
  EnvelopeFill,
  Eye,
  EyeFill,
  EyeSlash,
  EyeSlashFill,
  Lock,
} from "@tapsioss/react-icons";

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
        <Button loading={isPending} onClick={handleSubmit}>
          ورود
        </Button>
      </Stack>
    </Container>
  );
};

export default Page;
