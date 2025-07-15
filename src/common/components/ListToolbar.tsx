"use client";
import { Flex } from "@mantine/core";
import { IconButton, Skeleton, TextField } from "@tapsioss/react-components";
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
    <Flex align="center" gap="sm">
      <TextField
        hideLabel
        label="جستجو..."
        placeholder="جستجو..."
        style={{ flex: 1 }}
        value={searchString}
        onChange={(e) => setSearchString(e.target.value)}
      />

      <BaseBottomSheet>
        <BaseBottomSheet.Wrapper>
          {({ show, isOpen }) => (
            <IconButton onClick={show} variant={isOpen ? "primary" : "ghost"}>
              <LineThreeHorizontalDecrease />
            </IconButton>
          )}
        </BaseBottomSheet.Wrapper>

        <BaseBottomSheet.Content>
          <div
            className="h-[calc(var(--height)*0.85)] flex items-center justify-center"
            dir="ltr"
          >
            Content of filters goes here.
          </div>
        </BaseBottomSheet.Content>
      </BaseBottomSheet>
    </Flex>
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
