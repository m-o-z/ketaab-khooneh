export default function log(obj: any, indent = 0): void {
  const padding = " ".repeat(indent * 2);

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      console.log(`${padding}[${index}]`);
      log(item, indent + 1);
    });
  } else if (obj && typeof obj === "object") {
    for (const key in obj) {
      const value = obj[key];
      if (typeof value === "object" && value !== null) {
        console.log(`${padding}${key}:`);
        log(value, indent + 1);
      } else {
        console.log(`${padding}${key}: ${value}`);
      }
    }
  } else {
    console.log(`${padding}${obj}`);
  }
}
