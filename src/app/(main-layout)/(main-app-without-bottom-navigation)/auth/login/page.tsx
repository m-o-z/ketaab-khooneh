"use client";
import { useLoginApi } from "@/hooks/auth";
import { Container, Stack } from "@mantine/core";
import { Button, TextField, TextFieldSlots } from "@tapsioss/react-components";
import { Envelope } from "@tapsioss/react-icons";
import { useState } from "react";

const Page = () => {
  const [email, setEmail] = useState("");

  const { mutateAsync: login, isPending } = useLoginApi();

  const handleSubmit = async () => {
    await login({ email });
  };

  return (
    <Container h="100vh" pos="fixed" top="0" right="0" left="0" bottom="0">
      <Stack justify="center" h="100%" maw={400} mx="auto">
        <TextField
          label="آدرس ایمیل"
          autoFocus
          type="email"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
        >
          <Envelope slot={TextFieldSlots.LEADING_ICON} />
        </TextField>
        <Stack mt={8} w={"100%"}>
          <Button loading={isPending} onClick={handleSubmit} size="lg">
            ارسال
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default Page;
