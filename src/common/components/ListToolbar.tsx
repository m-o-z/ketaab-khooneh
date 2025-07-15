"use client";
import { Flex } from "@mantine/core";
import { IconButton, Skeleton, Switch, TextField } from "@tapsioss/react-components";
import BaseBottomSheet from "../BaseBottomSheet/BaseBottomSheet";
import { LineThreeHorizontalDecrease } from "@tapsioss/react-icons";

type Props = {
  searchString: string;
  setSearchString: (s: string) => void;
  filters?: string[];
  selectedFilters?: string[];
  setSelectedFilters?: (f: string[]) => void;
};

const ListToolbar = ({
  searchString,
  setSearchString,
  selectedFilters = [],
  setSelectedFilters,
  filters,
}: Props) => {
  // TODO: handle in URL
  const handleSelectFilter = (filter: string) => {
    if (selectedFilters?.includes(filter)) {
      setSelectedFilters?.(selectedFilters?.filter((f) => f !== filter));
    } else {
      setSelectedFilters?.([...selectedFilters, filter]);
    }
  };
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

ListToolbar.Loading = function Loading() {
  return (
    <Skeleton height="52px" variant="rectangular" width="100">
      <TextField hideLabel label="جستجو" style={{ flex: 1 }} />
    </Skeleton>
  );
};

export default ListToolbar;
