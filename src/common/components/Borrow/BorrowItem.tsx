import dayjs from "dayjs";
import { useMemo } from "react";

import { BorrowBriefDTO } from "@/schema/borrows";

import Typography from "@/common/Typography/Typography";
import { useReturnBookMutation } from "@/hooks/borrow";
import { BorrowStatusEnum } from "@/types";
import { toStandardJalaliDate } from "@/utils/prettifyDate";
import { Button } from "@tapsioss/react-components/Button";
import { ArrowLeft } from "@tapsioss/react-icons";
import BorrowStatusBadge from "./components/BorrowStatusBadge";
import BorrowReturnBottom from "./components/BorrowReturnBottom";
import TextEllipses from "../TextEllipses";

type Props = {
  item: BorrowBriefDTO;
};
const BorrowItem = ({ item }: Props) => {
  const remaining = useMemo(() => {
    const hours = dayjs(dayjs()).diff(item.dueDate, "hours");

    if (hours < 0 && Math.abs(hours) < 24) {
      return {
        display: [hours, "ساعت"].join(" "),
        value: hours,
        unit: "hour",
      };
    }
    const days = Math.ceil(Math.abs(hours) / 24);
    return {
      display: [days, "روز"].join(" "),
      value: days,
      unit: "days",
    };
  }, [item]);

  const isReturned = useMemo(() => {
    return (
      [BorrowStatusEnum.RETURNED, BorrowStatusEnum.RETURNED_LATE] as string[]
    ).includes(item.status);
  }, [item]);

  const isDueDatePassed = useMemo(() => {
    return dayjs(item.dueDate).isBefore(dayjs());
  }, [item]);

  const calcStatus = (item: BorrowBriefDTO) => {
    if (
      isDueDatePassed &&
      (item.status == "ACTIVE" || item.status === "EXTENDED")
    ) {
      return "BEING_LATE";
    }
    return item.status;
  };

  const renderCaption = () => {
    if (isReturned) {
      const content = [
        <Typography.Label size="sm" color="color.content.tertiary">
          {toStandardJalaliDate(item.borrowDate)}
        </Typography.Label>,
        <Typography.Label size="sm" color="color.content.tertiary">
          <ArrowLeft size={16} />
        </Typography.Label>,
        <Typography.Label size="sm" color="color.content.tertiary">
          {toStandardJalaliDate(item.returnDate!)}
        </Typography.Label>,
      ];
      return <div className="flex items-center space-x-1">{content}</div>;
    }

    let content = [
      <Typography.Body size="xs" color="color.content.tertiary">
        امانت گرفته‌شده از
      </Typography.Body>,
      <Typography.Label size="xs" color="color.content.secondary">
        {toStandardJalaliDate(item.borrowDate)}
      </Typography.Label>,
      <div className="px-1">
        <Typography.Body size="sm" color="color.content.tertiary">
          •
        </Typography.Body>
      </div>,
    ];

    if (!isDueDatePassed) {
      content.push(
        <div className="flex space-x-1 flex-wrap items-center">
          <Typography.Label size="xs" color="color.content.secondary">
            {remaining.display}
          </Typography.Label>
          <Typography.Body size="xs" color="color.content.tertiary">
            باقی مانده
          </Typography.Body>
        </div>,
      );
    } else {
      content.push(
        <Typography.Label size="xs" color="color.content.negative">
          {remaining.display} تاخیر در تحویل
        </Typography.Label>,
      );
    }

    return (
      <div className="space-x-1 flex flex-wrap whitespace-pre-wrap">
        {content}
      </div>
    );
  };

  return (
    <div className="rounded-2xl p-3 border border-gray-200 space-y-2  w-full">
      <div className="flex space-x-4">
        <div className="max-w-18 min-w-10 shrink-0 overflow-hidden rounded-lg self-start">
          {/* Cover */}
          <img src={item.book?.coverImage} />
        </div>
        <div className="grow overflow-hidden w-full space-y-2 flex flex-col">
          <Typography.Label color="color.content.secondary" size="md">
            <TextEllipses lines={2}>{item.book?.title}</TextEllipses>
          </Typography.Label>
          <div>{renderCaption()}</div>
        </div>
      </div>

      <div className="w-full flex justify-between items-end">
        <div>
          <BorrowStatusBadge status={calcStatus(item)} />
        </div>

        {!isReturned ? (
          <div className="space-x-2">
            <Button variant="ghost">تمدید</Button>
            <BorrowReturnBottom id={item.id} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default BorrowItem;
