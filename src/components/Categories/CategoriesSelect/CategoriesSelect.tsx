import { useCategoriesQuery } from "@/hooks/categories";
import { Combobox, Input, InputBase, Loader, useCombobox } from "@mantine/core";
import {
  TextField,
  TextFieldElement,
} from "@tapsioss/react-components/TextField";
import { useEffect, useState } from "react";
type Props = {
  defaultSelected?: string[];
  onChange?: (_: string[]) => void;
};

export function CategoriesSelect({ defaultSelected = [], onChange }: Props) {
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
    return setValue((current) => {
      return current.filter((v) => v !== val);
    });
  };

  useEffect(() => {
    onChange?.(value);
  }, [value]);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: async () => {
      if (!data && !isFetched && !isLoading) {
        setShouldFetchCategories(true);
      }
    },
  });

  const options = data
    ?.filter((item) => {
      return item.slug.toLowerCase().includes(searchTerm.trim().toLowerCase());
    })
    .map((item) => {
      const isInList = checkIsInList(value, item.slug);
      return (
        <Combobox.Option value={item.slug} key={item.id} active={isInList}>
          <div className="space-x-2 flex items-center">
            <span>
              {isInList ? "✅" : <span className="w-4 block"></span>}{" "}
            </span>
            <span>{item.label}</span>
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
            {isLoading ? <Combobox.Empty>Loading....</Combobox.Empty> : options}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>

      <div>
        {value ? (
          value.map((item) => (
            <div onClick={() => handleRemoveItemSelect(item)}>{item}</div>
          ))
        ) : (
          <Input.Placeholder>Pick value</Input.Placeholder>
        )}
      </div>
    </>
  );
}
