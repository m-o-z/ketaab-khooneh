import React from "react";
import {
  ActionIcon,
  Flex,
  Popover,
  Skeleton,
  Stack,
  Switch,
  TextInput,
} from "@mantine/core";
import { IconFilter, IconSearch } from "@tabler/icons-react";

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
    <Flex gap="sm" align="flex-end">
      <TextInput
        flex={1}
        leftSection={<IconSearch size={15} />}
        value={searchString}
        placeholder="Search..."
        size="xs"
        onChange={(e) => setSearchString(e.target.value)}
      />
      {filters && (
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

        <Popover width={300} trapFocus position="bottom" withArrow shadow="md">
          <Popover.Target>
            <ActionIcon color={selectedFilters ? "gray" : "transparent"}>
              <IconFilter size={15} />
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown>
            <Stack>
              {filters?.map((filter) => (
                <Switch
                  key={filter}
                  label={filter}
                  checked={!!selectedFilters?.includes(filter)}
                  onClick={() => handleSelectFilter(filter)}
                />
              ))}
            </Stack>
          </Popover.Dropdown>
        </Popover>
      )}
    </Flex>
  );
};

ListToolbar.Loading = function Loading() {
  return (
    <Flex>
      <Skeleton flex={1} height={36} />
    </Flex>
  );
};

export default ListToolbar;
