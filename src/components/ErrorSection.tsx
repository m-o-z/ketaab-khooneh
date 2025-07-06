import { Center } from "@mantine/core";
import {
  Button,
  ButtonSlots,
  EmptyState,
  EmptyStateSlots,
} from "@tapsioss/react-components";
import {
  ArrowTwoCirclepathVertical,
  FaceSad,
  TriangleExclamation,
} from "@tapsioss/react-icons";
import React from "react";

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
    <Center flex={1} mt={60} w="100%">
      <EmptyState
        contentAlignment="center"
        description={description}
        title={title}
      >
        <Icon slot={EmptyStateSlots.ICON} />
        {refetch && (
          <Button
            slot={EmptyStateSlots.ACTION}
            variant="ghost"
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
