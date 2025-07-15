import { BorrowDBStatusKeys, BorrowDBStatusLabels } from "@/schema/borrows";
import { BorrowStatusEnum } from "@/types";
import { Badge } from "@tapsioss/react-components/Badge";
import React from "react";

type BadgeColors = Parameters<typeof Badge>[0]["color"];
type BadgeSizes = Parameters<typeof Badge>[0]["size"];
type BadgeVariants = Parameters<typeof Badge>[0]["variant"];
type BadgePriorities = Parameters<typeof Badge>[0]["priority"];

export const BorrowStatusMeta: Record<
  BorrowDBStatusKeys | "BEING_LATE" | never,
  {
    statusFa: string;
    priority?: BadgePriorities;
    color: BadgeColors;
  }
> = {
  BEING_LATE: {
    statusFa: "تاخیر در تحویل",
    priority: "high",
    color: "warning",
  },
  [BorrowStatusEnum.ACTIVE]: {
    statusFa: BorrowDBStatusLabels.ACTIVE,
    color: "success",
  },
  [BorrowStatusEnum.EXTENDED]: {
    statusFa: BorrowDBStatusLabels.EXTENDED,
    priority: "high",
    color: "info",
  },
  [BorrowStatusEnum.RETURNED]: {
    statusFa: BorrowDBStatusLabels.RETURNED,
    color: "success",
  },
  [BorrowStatusEnum.RETURNED_LATE]: {
    statusFa: BorrowDBStatusLabels.RETURNED_LATE,
    color: "warning",
  },
};

type BadgeProps = {
  status: keyof typeof BorrowStatusMeta;
  size?: BadgeSizes;
  priority?: BadgePriorities;
  variant?: BadgeVariants;
};

const BorrowStatusBadge: React.FC<BadgeProps> = ({
  status,
  size = "md",
  variant = "pill",
}) => {
  const { statusFa, color, priority = "low" } = BorrowStatusMeta[status];

  return (
    <Badge
      value={statusFa}
      color={color}
      size={size}
      priority={priority}
      variant={variant}
    />
  );
};

export default BorrowStatusBadge;
