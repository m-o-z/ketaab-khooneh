export type TextLanguage = "persian" | "english" | "unknown";

export function detectTextLanguage(text: string): TextLanguage {
  const persianRegex = /[\u0600-\u06FF]/; // Persian and Arabic Unicode block
  const englishRegex = /^[a-zA-Z\s\d.,!?'"()\-:;]+$/; // Common English chars

  if (persianRegex.test(text)) {
    return "persian";
  }

  if (englishRegex.test(text)) {
    return "english";
  }

  return "unknown";
}
