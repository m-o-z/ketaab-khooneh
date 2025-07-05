import React from "react";
import styles from "./BorrowList.module.scss";
import { BorrowBriefDTO } from "@/schema/borrows";
import BorrowItem from "./BorrowItem";

type Props = {
  items: BorrowBriefDTO[];
};
const BorrowList = ({ items }: Props) => {
  if (!items) {
    return "invalid data";
  }
  if (items.length === 0) {
    return "empty data";
  }
  return (
    <div className="h-full space-y-4">
      {items.map((item) => (
        <BorrowItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export default BorrowList;
