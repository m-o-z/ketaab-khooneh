"use client";
import { Flex, Popover, Stack, Text } from "@mantine/core";
import {
  Checkbox,
  IconButton,
  Skeleton,
  TextField,
} from "@tapsioss/react-components";
import { ListBullet } from "@tapsioss/react-icons";
import React from "react";

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
      {/*<TextInput*/}
      {/*  flex={1}*/}
      {/*  leftSection={<IconSearch size={15} />}*/}
      {/*  value={searchString}*/}
      {/*  placeholder="Search..."*/}
      {/*  size="xs"*/}
      {/*  onChange={(e) => setSearchString(e.target.value)}*/}
      {/*/>*/}
      <TextField
        hideLabel
        label="جستجو..."
        placeholder="جستجو..."
        style={{ flex: 1 }}
        value={searchString}
        onChange={(e) => setSearchString(e.target.value)}
      />
      {/* {filters && (
        // <Select
        //     label="Filters"
        //     placeholder="Pick value"
        //     data={filters}
        //     w={200}
        // />

        // <Menu>
        //   <Menu.Target>
        //     <ActionIcon color={selectedFilters ? 'gray' : 'transparent'}><IconFilter size={20} /></ActionIcon>
        //   </Menu.Target>
        //   <Menu.Dropdown>
        //     {filters?.map((filter) => (
        //         <Menu.Item key={filter} onClick={() => alert(filter)}>
        //           {filter}
        //         </Menu.Item>
        //     ))}
        //   </Menu.Dropdown>
        // </Menu>

        <Popover trapFocus withArrow position="bottom" shadow="md" width={300}>
          <Popover.Target>
            <IconButton size="sm">
              <ListBullet />
            </IconButton>
          </Popover.Target>
          <Popover.Dropdown>
            <Stack>
              {filters?.map((filter) => (
                <Flex key={filter} align={"center"}>
                  <Text component="span" id={`${filter}-label`}>
                    {filter}
                  </Text>
                  <Checkbox
                    key={filter}
                    checked={!!selectedFilters?.includes(filter)}
                    label={filter}
                    onClick={() => handleSelectFilter(filter)}
                  />
                </Flex>
              ))}
            </Stack>
          </Popover.Dropdown>
        </Popover>
      )} */}
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
