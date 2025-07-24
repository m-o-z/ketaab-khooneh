import Typography from "@/common/Typography/Typography";
import { useCategoriesQuery } from "@/hooks/categories";
import { CategoryDTO } from "@/schema/categories";
import { Combobox, Input, ScrollArea, useCombobox } from "@mantine/core";
import { Avatar } from "@tapsioss/react-components/Avatar";
import { Chip, ChipSlots } from "@tapsioss/react-components/Chip";
import { ChipGroup } from "@tapsioss/react-components/ChipGroup";
import {
  TextField,
  TextFieldElement,
} from "@tapsioss/react-components/TextField";
import { CircleCheckFill } from "@tapsioss/react-icons";
import { useEffect, useMemo, useState } from "react";
type Props = {
  defaultSelected?: string[];
  onChange?: (_: string[]) => void;
};

export function CategoriesSelect({ defaultSelected = [], onChange }: Props) {
  console.log("cats", { defaultSelected });
  const [shouldFetchCategories, setShouldFetchCategories] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, isError, isFetched } = useCategoriesQuery({
    enabled: shouldFetchCategories,
  });
  const [value, setValue] = useState<string[]>(defaultSelected);

  const addItemToList = (list: string[], val: string) => {
    return list.includes(val) ? list.filter((v) => v !== val) : [...list, val];
  };
  const handleValueSelect = (val: string) =>
    setValue((current) => addItemToList(current, val));

  const checkIsInList = (list: string[], value: string) => {
    return list.findIndex((itemValue) => itemValue === value) > -1;
  };

  const handleRemoveItemSelect = (val: string) => {
    setValue((current) => {
      const newValue = current.filter((v) => v !== val);
      onChange?.(newValue);
      return newValue;
    });
  };

  useEffect(() => {
    if (defaultSelected.length > 0) {
      setShouldFetchCategories(true);
    }
  }, []);

  const combobox = useCombobox({
    onDropdownClose: () => {
      onChange?.(value);
      return combobox.resetSelectedOption();
    },
    onDropdownOpen: async () => {
      if (!data && !isFetched && !isLoading) {
        setShouldFetchCategories(true);
      }
    },
  });

  const categoriesObj = useMemo(() => {
    console.log({ data });
    const obj: Record<string, CategoryDTO> = {};
    data?.forEach((item) => {
      obj[item.slug] = item;
    });
    return obj;
  }, [data, isLoading, isFetched]);

  const getCategoryFromSlug = (slugValue: string) => {
    const result = categoriesObj?.[slugValue];
    console.log({ categoriesObj, result });

    return result ?? "";
  };

  const options = data
    ?.filter((item) => {
      return item.slug.toLowerCase().includes(searchTerm.trim().toLowerCase());
    })
    .map((item) => {
      const isInList = checkIsInList(value, item.slug);
      return (
        <Combobox.Option
          value={item.slug}
          key={item.id}
          active={isInList}
          mah={200}
        >
          <div className="space-x-4 flex items-center w-full">
            <Avatar
              alt={item.label}
              image={item.categoryIcon}
              size="sm"
              className="shrink-0"
            />
            <Typography.Body size="md" className="grow text-ellipsis">
              {item.label}
            </Typography.Body>
            <div className="shrink-0">
              {isInList ? (
                <span className="text-green-700/80">
                  <CircleCheckFill size={20} />
                </span>
              ) : null}
            </div>
          </div>
        </Combobox.Option>
      );
    });

  return (
    <>
      <Combobox
        store={combobox}
        withinPortal={false}
        onOptionSubmit={handleValueSelect}
      >
        <Combobox.DropdownTarget>
          <div>
            <Combobox.EventsTarget>
              <TextField
                label="دسته‌بندی کتاب‌ها"
                className="w-full"
                value={searchTerm}
                onClick={() => combobox.toggleDropdown()}
                onChange={(e) => {
                  const target = e.target as TextFieldElement;
                  setSearchTerm(target.value);
                }}
              />
            </Combobox.EventsTarget>
          </div>
        </Combobox.DropdownTarget>

        <Combobox.Dropdown>
          <Combobox.Options>
            <ScrollArea.Autosize mah={200} type="scroll">
              {isLoading ? (
                <Combobox.Empty>Loading....</Combobox.Empty>
              ) : (
                options
              )}
            </ScrollArea.Autosize>
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>

      <div>
        {value ? (
          <div className="-mx-4">
            <ScrollArea maw={"100%"} className="no-scrollbar">
              <div className="flex">
                <div className="w-4 shrink-0"></div>
                <ChipGroup>
                  {value.map((item) => {
                    const categoryItem = getCategoryFromSlug(item);
                    console.log({ item, categoryItem });
                    return (
                      <Chip
                        selected
                        onClick={() => handleRemoveItemSelect(item)}
                      >
                        <div slot={ChipSlots.LEADING_ICON}>
                          <Avatar
                            size="xs"
                            image={categoryItem.categoryIcon}
                            alt={categoryItem.label}
                          />
                        </div>
                        {categoryItem.label}
                      </Chip>
                    );
                  })}
                </ChipGroup>
                <div className="w-4 shrink-0"></div>
              </div>
            </ScrollArea>
          </div>
        ) : (
          <Input.Placeholder>Pick value</Input.Placeholder>
        )}
      </div>
    </>
  );
}
