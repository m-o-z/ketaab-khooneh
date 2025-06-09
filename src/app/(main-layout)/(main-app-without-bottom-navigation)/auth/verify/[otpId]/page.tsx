"use client";
import { useVerifyApi } from "@/hooks/auth";
import { Container, Stack } from "@mantine/core";
import { Button, TextField, TextFieldSlots } from "@tapsioss/react-components";
import { Envelope } from "@tapsioss/react-icons";
import { useParams } from "next/navigation";
import { useState } from "react";

const Page = () => {
  const otpId = useParams()["otpId"] as string;
  const [password, setPassword] = useState("");

  const { mutateAsync: verify, isPending } = useVerifyApi();

  const handleSubmit = async () => {
    await verify({ otpId, password, httpOnly: true });
  };

  return (
    <Container h="100vh" pos="fixed" top="0" right="0" left="0" bottom="0">
      <Stack justify="center" h="100%" maw={400} mx="auto">
        <TextField
          label="کد OTP"
          autoFocus
          type="number"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
        >
          <Envelope slot={TextFieldSlots.LEADING_ICON} />
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
