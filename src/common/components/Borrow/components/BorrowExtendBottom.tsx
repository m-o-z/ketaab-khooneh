import { useExtendBookMutation, useReturnBookMutation } from "@/hooks/borrow";
import { notifications } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@tapsioss/react-components/Button";
import ConfirmationModal from "../../ConfirmationModal";

type Props = {
  id: string;
};

const BorrowExtendBottom = ({ id }: Props) => {
  const queryClient = useQueryClient();
  const { mutateAsync: extendBookMutateAsync, isPending } =
    useExtendBookMutation();
  const onHandleReturn = async () => {
    try {
      await extendBookMutateAsync(id);
      notifications.show({
        title: "عملیات موفقیت آمیز",
        message: "کتاب مورد نظر با موفقیت تمدید شد",
        color: "green",
      });
    } catch (err) {
      notifications.show({
        message: "خطا در تمدید کتاب",
        color: "red",
      });
    } finally {
      queryClient.invalidateQueries({
        queryKey: ["borrows"],
      });
      queryClient.invalidateQueries({
        queryKey: ["books"],
      });
      queryClient.invalidateQueries({
        queryKey: ["users-me"],
      });
    }
  };
  return (
    <ConfirmationModal
      acceptButtonTitle="تایید"
      acceptButtonVariant="destructive"
      denyButtonTitle="انصراف"
      description={"آیا مطمئن هستید که می‌خواهید کتاب‌ را تمدید کنید؟"}
      heading="تمدید کتاب"
      isPending={isPending}
      renderImage={() => (
        <svg
          fill="none"
          height="64"
          style={{ marginTop: "2rem" }}
          viewBox="0 0 64 64"
          width="64"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 32C4 16.536 16.536 4 32 4C47.464 4 60 16.536 60 32C60 47.464 47.464 60 32 60C16.536 60 4 47.464 4 32Z"
            fill="#FFEFED"
          />
          <path
            d="M30.25 36.0834H33.75V39.5834H30.25V36.0834ZM30.25 24.4167H33.75V33.75H30.25V24.4167Z"
            fill="#E11900"
          />
        </svg>
      )}
      onConfirm={onHandleReturn}
    >
      {({ show }) => (
        <Button variant="ghost" onClick={show}>
          تمدید
        </Button>
      )}
    </ConfirmationModal>
  );
};

export default BorrowExtendBottom;
