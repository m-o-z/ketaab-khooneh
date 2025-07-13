"use client";
import AppLayout from "@/layouts/AppLayout";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@tapsioss/theme/css-variables";
import "@/app/globals.scss";
import { useGetProfile } from "@/hooks/profile";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useGetProfile();
  return <AppLayout>{children}</AppLayout>;
}
