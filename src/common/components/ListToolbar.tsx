"use client";
import {
  IconButton,
  TextField,
  TextFieldElement,
  TextFieldSlots,
} from "@tapsioss/react-components";
import { Cross } from "@tapsioss/react-icons";
import { memo } from "react";

type Props = {
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
      {searchString && searchString.length > 0 ? (
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
