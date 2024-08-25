export const capitalizeName = (name: string) => {
  if (name && typeof name === "string") {
    return name
      .split(" ")
      .map((item) => `${item.slice(0, 1).toUpperCase()}${item.slice(1)}`)
      .join(" ");
  }

  return name;
};
