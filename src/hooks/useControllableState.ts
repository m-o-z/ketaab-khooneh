import { useState, useCallback } from "react";

export type UseControllableStateParams<T> = {
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
};

export function useControllableState<T>({
  value: propValue,
  defaultValue,
  onChange,
}: UseControllableStateParams<T>) {
  const isControlled = propValue !== undefined;

  const [internalValue, setInternalValue] = useState(defaultValue);

  const value = isControlled ? propValue : internalValue;

  const setValue = useCallback(
    (newValue: T) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    },
    [isControlled, onChange],
  );

  return [value, setValue] as const;
}
