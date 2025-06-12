import { TestUser } from "@/@types/testUsers";
import Client from "pocketbase";

type Users = [email: string, otpCode: string];
export default async function getTestUser(client: Client): Promise<Users[]> {
  const result = await client.collection<TestUser>("test_users").getFullList();

  return result.map((item) => [item.email, item.otpCode]);
}

export async function isTestUser(client: Client, email: string) {
  const userList = await getTestUser(client);

  return !!userList.find((item) => item[0] === email);
}

type IsValidOtpForTestEmailPayload = {
  client: Client;
  email?: string;
  otp: string;
};
export async function isValidOtpForTestEmail({
  client,
  email,
  otp,
}: IsValidOtpForTestEmailPayload) {
  const userList = await getTestUser(client);

  return !!userList.find((item) => item[0] === email && item[1] == otp);
}
