"use client";
import {
  IconButton,
  Spinner,
  TextField,
  TextFieldElement,
  TextFieldSlots,
} from "@tapsioss/react-components";
import { Cross } from "@tapsioss/react-icons";
import { memo } from "react";

type Props = {
  isLoading?: boolean;
  searchString: string;
  setSearchString: (s: string) => void;
  selectedFilters?: string[];
  label: string;
  placeholder?: string;
};

const ListToolbar = ({
  searchString,
  setSearchString,
  label,
  placeholder = "جستجو ...",
  isLoading = false,
}: Props) => {
  const handleOnChange = (e: Event) => {
    const target = e.target as TextFieldElement;
    setSearchString(target.value);
  };
  return (
    <TextField
      className="w-full"
      hideLabel
      label={label}
      placeholder={placeholder}
      style={{ flex: 1 }}
      value={searchString}
      onChange={handleOnChange}
    >
      {isLoading ? (
        <div className="-translate-x-1" slot={TextFieldSlots.TRAILING}>
          <Spinner size={28} />
        </div>
      ) : null}
      {!isLoading && searchString && searchString.length > 0 ? (
        <div className="-ml-2" slot={TextFieldSlots.TRAILING}>
          <IconButton
            variant="naked"
            size="sm"
            onClick={() => {
              setSearchString("");
            }}
          >
            <Cross />
          </IconButton>
        </div>
      ) : null}
    </TextField>
  );
};

export default memo(ListToolbar);
