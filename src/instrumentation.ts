export async function register() {
  if (typeof window === "undefined") {
    import("@/lib/redis");
    import("@/setup/index");
  }
}
