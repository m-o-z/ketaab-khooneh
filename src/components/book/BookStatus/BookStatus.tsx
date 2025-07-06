import { Badge } from "@tapsioss/react-components";
import React, { Component } from "react";

import type { BookStatus } from "@/types";
type Props = {
  status: BookStatus;
};
type BookStatusInfo = { title: string; titleFa: string; color: string }; // TODO: FIX

const BookStatus = ({ status }: Props) => {
  const statusInfos: Record<BookStatus, BookStatusInfo> = {
    AVAILABLE: {
      title: "Available",
      titleFa: "موجود",
      color: "success",
    },
    UNAVAILABLE: {
      title: "Not Available",
      titleFa: "ناموجود",
      color: "error",
    },
    BORROWED: {
      title: "Borrowed",
      titleFa: "قرض گرفته شده",
      color: "neutral",
    },
    RESERVED_BY_ME: {
      title: "Reserved by me",
      titleFa: "رزرو شده توسط من",
      color: "info",
    },
    RESERVED_BY_OTHERS: {
      title: "Reserved by others",
      titleFa: "رزرو شده توسط دیگران",
      color: "warning",
    },
  } as const;
  const statusInfo: BookStatusInfo = statusInfos[status];

  return (
    <Badge
      color={statusInfo.color}
      radius={0}
      size="sm"
      value={statusInfo.titleFa}
    />
  );
};

export default BookStatus;
