import React from "react";
import { Badge, Chip, Text } from "@mantine/core";
import type { BookStatus } from "@/types";

type Props = {
  status: BookStatus;
};

type BookStatusInfo = { title: string; color: string };

const BookStatus = ({ status }: Props) => {
  const statusInfos: Record<BookStatus, BookStatusInfo> = {
    AVAILABLE: {
      title: "Available",
      color: "green",
    },
    NOT_AVAILABLE: {
      title: "Not Available",
      color: "red",
    },
    BORROWED: {
      title: "Borrowed",
      color: "gray",
    },
    RESERVED_BY_ME: {
      title: "Reserved by me",
      color: "blue",
    },
    RESERVED_BY_OTHERS: {
      title: "Reserved by others",
      color: "yellow",
    },
  };
  const statusInfo: BookStatusInfo = statusInfos[status];

  return (
    <Badge radius={0} size="sm" color={statusInfo.color}>
      {statusInfo.title}
    </Badge>
  );
};

export default BookStatus;
