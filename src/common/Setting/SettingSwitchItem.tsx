import {
  useControllableState,
  UseControllableStateParams,
} from "@/hooks/useControllableState";
import { Switch, SwitchElement } from "@tapsioss/react-components/Switch";
import { ReactNode, useId } from "react";
import Typography from "../Typography/Typography";
import TextEllipses from "../components/TextEllipses";
import clsx from "clsx";
import { Spinner } from "@tapsioss/react-components/Spinner";

type OnChange = UseControllableStateParams<boolean>["onChange"];
type Props = {
  isLoading?: boolean;
  label: string | ReactNode;
  isActive?: boolean;
  defaultState?: boolean;
  onChange?: OnChange;
};

const SettingSwitchItem = ({
  isLoading,
  isActive,
  defaultState = false,
  onChange,
  label,
}: Props) => {
  const id = useId();
  const [state, setState] = useControllableState({
    value: isActive,
    defaultValue: defaultState,
    onChange: onChange,
  });

  return (
    <div
      className={clsx("flex space-x-2 w-full items-center relative", {
        "": isLoading,
      })}
    >
      <TextEllipses lines={2} className="grow pr-4">
        <Typography.Label size="md" id={id} color="color.content.secondary">
          {label}
        </Typography.Label>
      </TextEllipses>
      <div className="shrink-0">
        <Switch
          disabled={isLoading}
          selected={state}
          defaultChecked={defaultState}
          labelledBy={id}
          onInput={(evt) => {
            const selected = (evt.target as SwitchElement).selected;
            setState(selected);
          }}
        />
      </div>
      {isLoading && (
        <div className="absolute right-0 left-0 top-0 bottom-0 flex items-center justify-end pl-16 pointer-nonez-10">
          <Spinner size={24} />
        </div>
      )}
    </div>
  );
};

export default SettingSwitchItem;
