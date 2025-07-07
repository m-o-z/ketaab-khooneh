import dayjs from "dayjs";
import React, { useMemo } from "react";

import { BorrowBriefDTO } from "@/schema/borrows";

import styles from "./BorrowItem.module.scss";

type Props = {
  item: BorrowBriefDTO;
};
const BorrowItem = ({ item }: Props) => {
  const remainingDays = useMemo(() => {
    return dayjs(item.dueDate).diff(dayjs(), "days");
  }, [item]);

  return (
    <div className="rounded-xl p-2 border border-gray-200 flex space-x-4">
      <div className="w-[5rem] shrink-0">
        {/* Cover */}
        <img src={item.book?.coverImage} />
      </div>
      <div className="grow">
        <div className="">{item.book?.title}</div>
        {remainingDays > 0 ? (
          <div className="">
            <>روز‌های باقی مانده</> <>{remainingDays}</>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default BorrowItem;
