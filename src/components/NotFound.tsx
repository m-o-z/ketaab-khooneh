import { FaceSad } from "@tapsioss/react-icons";

import ErrorSection from "./ErrorSection";

type Props = {
  refetch?: () => void;
  title?: string;
  description?: string;
  Icon?: typeof FaceSad;
};

const NotFound = ({
  refetch,
  Icon = FaceSad,
  title = "اوپسسس",
  description = "موردی یافت نشد!",
}: Props) => {
  const props = {
    refetch,
    Icon,
    title,
    description,
  };
  return <ErrorSection {...props} />;
};

export default NotFound;
