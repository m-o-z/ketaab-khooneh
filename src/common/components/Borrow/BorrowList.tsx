import { BorrowBriefDTO } from "@/schema/borrows";

import BorrowItem from "./BorrowItem";

type Props = {
  items: BorrowBriefDTO[];
};
const BorrowList = ({ items }: Props) => {
  return (
    <div className="h-full space-y-4">
      {items.map((item) => (
        <BorrowItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export default BorrowList;
