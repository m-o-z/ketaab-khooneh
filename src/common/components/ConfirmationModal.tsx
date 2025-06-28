import {
  Button,
  ButtonGroup,
  Modal,
  ModalSlots,
} from "@tapsioss/react-components";
import React from "react";
import Portal from "../Portal/Portal";
import styles from "./ConfirmationModal.module.scss";

type ChildrenProps = {
  show: () => void;
  hide: () => void;
};

type TapsiButton = React.ComponentProps<typeof Button>;

type TapsiModal = React.ComponentProps<typeof Modal>;

type Props = {
  children: ({ show, hide }: ChildrenProps) => React.ReactNode;
  renderImage?: () => React.ReactNode;
  onConfirm: () => void | Promise<void>;
  alignment?: TapsiModal["alignment"];
  description?: TapsiModal["description"];
  heading?: TapsiModal["heading"];
  isPending?: boolean;
  acceptButtonTitle?: string;
  acceptButtonVariant?: TapsiButton["variant"];
  denyButtonTitle?: string;
  denyButtonVariant?: TapsiButton["variant"];
};

/**
 * ConfirmationModal Component
 *
 * A reusable modal dialog component designed for confirming user actions.
 * It provides configurable options for headings, descriptions, buttons,
 * alignment, and rendering custom images.
 *
 * @example
 * ```tsx
 * const Logout = () => {
 *   const { mutateAsync: logout, isPending } = useLogoutApi();
 *   return (
 *       <ConfirmationModal
 *           heading="خروج از حساب کاربری"
 *           description={"آیا می‌خواهید از حساب کاربری خود خارج شوید؟"}
 *           denyButtonTitle="انصراف"
 *           acceptButtonTitle="خروج"
 *           acceptButtonVariant="destructive"
 *           onConfirm={logout}
 *           isPending={isPending}
 *           renderImage={() => (
 *               <svg
 *                   style={{ marginTop: "2rem" }}
 *                   width="64"
 *                   height="64"
 *                   viewBox="0 0 64 64"
 *                   fill="none"
 *                   xmlns="http://www.w3.org/2000/svg"
 *               >
 *                 <path
 *                     d="M4 32C4 16.536 16.536 4 32 4C47.464 4 60 16.536 60 32C60 47.464 47.464 60 32 60C16.536 60 4 47.464 4 32Z"
 *                     fill="#FFEFED"
 *                 />
 *                 <path
 *                     d="M30.25 36.0834H33.75V39.5834H30.25V36.0834ZM30.25 24.4167H33.75V33.75H30.25V24.4167Z"
 *                     fill="#E11900"
 *                 />
 *               </svg>
 *           )}
 *       >
 *         {({ show }) => (
 *             <Button onClick={show}>خروج از حساب کاربری</Button>
 *         )}
 *       </ConfirmationModal>
 *   );
 * };
 * ```
 *
 * @component
 * @param {Object} Props - The component props.
 * @param {(children: { show: () => void; hide: () => void; }) => React.ReactNode} Props.children - A render function for the modal trigger and interaction logic.
 * @param {() => React.ReactNode} [Props.renderImage] - A function that returns a ReactNode for the optional image slot inside the modal.
 * @param {() => void | Promise<void>} Props.onConfirm - Callback triggered when the user confirms the action. Can return a promise for async operations.
 * @param {"center" | "start" | "end"} [Props.alignment="center"] - Alignment for modal content. Defaults to "center".
 * @param {string} [Props.description="آیا از انجام این کار اطمینان دارید؟"] - The description text displayed in the modal body. Defaults to a generic confirmation prompt in Persian.
 * @param {string} [Props.heading="هشدار!"] - The heading text displayed at the top of the modal. Defaults to "هشدار!".
 * @param {boolean} [Props.isPending=false] - Boolean indicating if the confirmation button is in a loading state.
 * @param {string} [Props.acceptButtonTitle="تایید"] - Title text for the confirmation button. Defaults to "تایید" in Persian.
 * @param {string} [Props.denyButtonTitle="انصراف"] - Title text for the cancellation button. Defaults to "انصراف" in Persian.
 * @param {"primary" | "secondary" | "destructive" | "ghost"} [Props.acceptButtonVariant="primary"] - Variant for the confirmation button. Defaults to "primary".
 * @param {"primary" | "secondary" | "destructive" | "ghost"} [Props.denyButtonVariant="ghost"] - Variant for the cancellation button. Defaults to "ghost".
 *
 * @returns {JSX.Element} A modal dialog component wrapped around custom children.
 */
const ConfirmationModal = ({
  children,
  description = "آیا از انجام این کار اطمینان دارید؟",
  onConfirm,
  heading = "هشدار!",
  alignment = "center",
  isPending,
  acceptButtonTitle = "تایید",
  denyButtonTitle = "انصراف",
  acceptButtonVariant = "primary",
  denyButtonVariant = "ghost",
  renderImage,
}: Props) => {
  const [showing, setShowing] = React.useState<boolean>(false);

  const show = () => setShowing(true);
  const hide = () => setShowing(false);

  const handleConfirm = async () => {
    await onConfirm?.();
    hide();
  };

  const renderImageSlot = () => {
    if (!renderImage) return null;

    return (
      <div className="flex justify-center" slot={ModalSlots.IMAGE}>
        {renderImage()}
      </div>
    );
  };

  return (
    <>
      {children({ show, hide })}
      <Portal id="#modal">
        <Modal
          className={styles.container}
          alignment={alignment}
          heading={heading}
          description={description}
          open={showing}
          onHide={hide}
        >
          {renderImageSlot()}
          <ButtonGroup slot={ModalSlots.ACTION_BAR} fluidItems>
            <Button variant={denyButtonVariant} onClick={hide} size="lg">
              {denyButtonTitle}
            </Button>
            <Button
              variant={acceptButtonVariant}
              loading={isPending}
              size="lg"
              onClick={handleConfirm}
            >
              {acceptButtonTitle}
            </Button>
          </ButtonGroup>
        </Modal>
      </Portal>
    </>
  );
};

export default ConfirmationModal;
