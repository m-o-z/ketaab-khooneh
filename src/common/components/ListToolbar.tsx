"use client";
import { TextField } from "@tapsioss/react-components";
import { memo } from "react";

type Props = {
  searchString: string;
  setSearchString: (s: string) => void;
  selectedFilters?: string[];
};

const ListToolbar = ({ searchString, setSearchString }: Props) => {
  // TODO: handle in URL
  return (
    <TextField
      className="w-full"
      hideLabel
      label="جستجو..."
      placeholder="جستجو..."
      style={{ flex: 1 }}
      value={searchString}
      onChange={(e) => setSearchString(e.target.value)}
    />
  );
};

export default memo(ListToolbar);
