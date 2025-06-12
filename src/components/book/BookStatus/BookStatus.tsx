import React, { Component } from "react";
import { Badge } from "@tapsioss/react-components";
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
    NOT_AVAILABLE: {
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
  };
  const statusInfo: BookStatusInfo = statusInfos[status];

  return (
    <Badge
      radius={0}
      size="sm"
      color={statusInfo?.color}
      value={statusInfo?.titleFa}
    />
  );
};

export default BookStatus;
