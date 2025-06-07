import pbClient from "@/client/pbClient";
import { RecordAuthResponse } from "pocketbase";

// TODO: refactor
const login = async (
  inputEmail: string,
  inputPassword: string,
): Promise<{
  isOk: boolean;
  error?: Error;
}> => {
  try {
    const authData: RecordAuthResponse = await pbClient()
      .collection("users")
      .authWithPassword(inputEmail, inputPassword);
    const { avatar, created, email, id, name, username, verified } =
      authData.record;
    const userData = {
      avatar,
      created,
      email,
      id,
      name,
      username,
      verified,
    };
    localStorage.setItem("_user_info", JSON.stringify(userData));
    localStorage.setItem("_token", authData.token);

    return {
      isOk: true,
    };
  } catch (error) {
    console.log(error);
    return {
      isOk: false,
      error: error as Error,
    };
  }
};

const logout = () => {
  pbClient().authStore.clear();
  localStorage.removeItem("_user_info");
  localStorage.removeItem("_token");
};

export default login;
