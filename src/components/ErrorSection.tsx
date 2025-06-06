import React from "react";
import { Center } from "@mantine/core";
import {
  ArrowTwoCirclepathVertical,
  FaceSad,
  TriangleExclamation,
} from "@tapsioss/react-icons";
import {
  Button,
  ButtonSlots,
  EmptyState,
  EmptyStateSlots,
} from "@tapsioss/react-components";

type Props = {
  refetch?: () => void;
  title?: string;
  description?: string;
  Icon?: typeof FaceSad;
};

const ErrorSection = ({
  refetch,
  Icon = TriangleExclamation,
  title = "خطایی رخ داد",
  description = "لطفا پس از مدتی دوباره تلاش کنید",
}: Props) => {
  return (
    <Center flex={1} w="100%" mt={60}>
      <EmptyState
        contentAlignment="center"
        title={title}
        description={description}
      >
        <Icon slot={EmptyStateSlots.ICON} />
        {refetch && (
          <Button
            variant="ghost"
            slot={EmptyStateSlots.ACTION}
            onClick={() => refetch()}
          >
            <ArrowTwoCirclepathVertical slot={ButtonSlots.LEADING_ICON} />
            تلاش مجدد
          </Button>
        )}
      </EmptyState>
    </Center>
  );
};

export default ErrorSection;
