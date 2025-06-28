"use client";
import { useLoginApi } from "@/hooks/auth";
import { emailSchema } from "@/schema/email";
import validateEmail from "@/utils/validateEmail";
import { Stack } from "@mantine/core";
import {
  Button,
  TextField,
  TextFieldElement,
  TextFieldSlots,
} from "@tapsioss/react-components";
import { Envelope } from "@tapsioss/react-icons";
import { useSearchParams } from "next/navigation";
import { KeyboardEventHandler, useEffect, useMemo, useState } from "react";
import s from "./styles.module.scss";
import Container from "@/common/Container/Container";

const LoginPage = () => {
  const searchParams = useSearchParams();
  const initialEmail = (() => {
    const email = validateEmail(searchParams?.get("email"));
    const [username, _ /* domain part */] = (email ?? "").split("@");
    return username;
  })();
  const [username, setUsername] = useState(initialEmail ?? "");

  const email = useMemo(() => {
    return username ? [username, "tapsi.cab"].join("@") : "";
  }, [username]);

  const { mutateAsync: login, isPending, error } = useLoginApi();

  const handleSubmit = async () => {
    await login({ email });
  };

  const handleEmailChange = (e: Event) => {
    const textField = e.currentTarget as TextFieldElement;
    setUsername(textField.value);
  };

  const isEmailValid = useMemo(() => {
    const result = emailSchema.safeParse(email);
    return !result.success;
  }, [email]);

  useEffect(() => {
    console.log({ isPending });
  }, [isPending]);

  const handleKeyDown: KeyboardEventHandler = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <Container className="">
      <Stack component="main" justify="center" h="100%" px="2rem">
        <TextField
          error={!!error}
          errorText={error?.message}
          placeholder="your_tapsi_email_user"
          label="آدرس ایمیل"
          className={s.wrapper}
          autoFocus
          type="email"
          value={username}
          onChange={handleEmailChange}
          onKeyDown={handleKeyDown}
        >
          <Envelope slot={TextFieldSlots.LEADING_ICON} />
          <div className={s.postfix} slot={TextFieldSlots.TRAILING}>
            @tapsi.cab
          </div>
        </TextField>
        <Stack mt={8} w={"100%"}>
          <Button
            disabled={isEmailValid}
            loading={isPending}
            onClick={handleSubmit}
            size="lg"
          >
            ارسال
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default LoginPage;
