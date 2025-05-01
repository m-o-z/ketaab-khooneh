import PocketBase, { AsyncAuthStore } from "pocketbase";

const pbClient = new PocketBase("https://pb.echa.ir");

export default pbClient;

export const initPBClient = (
  setCookie: (_: string) => Promise<void>,
  getCookie: () => string,
) => {
  const store = new AsyncAuthStore({
    save: setCookie,
    initial: getCookie(),
  });

  const pb = new PocketBase("http://localhost:8080", store);

  console.log({
    pb,
    isValid: pb.authStore.isValid,
    model: pb.authStore.model,
  });

  return pb;
};
