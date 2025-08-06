import BaseBottomSheet, {
  ChildrenProvider,
} from "@/common/BaseBottomSheet/BaseBottomSheet";
import ListToolbar from "@/common/components/ListToolbar";
import Typography from "@/common/Typography/Typography";
import { IconButton } from "@tapsioss/react-components/IconButton";
import { LineThreeHorizontalDecrease } from "@tapsioss/react-icons";
import React, { memo } from "react";
import { CategoriesSelect } from "../Categories/CategoriesSelect/CategoriesSelect";
import { Button } from "@tapsioss/react-components/Button";
import { ButtonGroup } from "@tapsioss/react-components/ButtonGroup";
import { Checkbox } from "@tapsioss/react-components/Checkbox";

type Props = {
  searchTerm: string;
  setSearchString: (_: string) => void;
};
const Toolbar = ({ searchTerm, setSearchString }: Props) => {
  const bottomSheetContent: ChildrenProvider = ({ hide }) => {
    return (
      <div className="h-[calc(var(--height)*0.85)] flex flex-col items-stretch justify-stretch">
        <Typography.Headline className="shrink-0" size="sm">
          فیلتر‌ها
        </Typography.Headline>
        {/* <div className="space-y-4 grow">
          <div className="flex items-center">
            <Checkbox
              checked={state.status === "AVAILABLE"}
              onChange={handleToggleBookStatus}
              id="show-only-available-books-input"
              labelledBy="show-only-available-books-label"
            />
            <span>
              <label
                htmlFor="show-only-available-books-input"
                id="show-only-available-books-label"
              >
                نمایش کتاب‌های موجود
              </label>
            </span>
          </div>
          <CategoriesSelect
            defaultSelected={state.categories}
            onChange={(values) => {
              setState({
                categories: values,
              });
            }}
          />
        </div> */}
        <div className="shrink-0 pb-[env(safe-area-inset-bottom)]">
          <ButtonGroup fluidItems className="pb-4 w-full">
            <Button onClick={hide} size="lg" variant="ghost">
              بستن
            </Button>
          </ButtonGroup>
        </div>
      </div>
    );
  };
  return (
    <div className="flex items-center space-x-2 w-full">
      <ListToolbar
        searchString={searchTerm}
        setSearchString={setSearchString}
      />

      <BaseBottomSheet>
        <BaseBottomSheet.Wrapper>
          {({ show, isOpen }) => (
            <IconButton
              label="اعمال فیلتر روی کتاب‌ها"
              onClick={show}
              variant={isOpen ? "primary" : "ghost"}
            >
              <LineThreeHorizontalDecrease />
            </IconButton>
          )}
        </BaseBottomSheet.Wrapper>

        <BaseBottomSheet.Content>{bottomSheetContent}</BaseBottomSheet.Content>
      </BaseBottomSheet>
    </div>
  );
};

export default memo(Toolbar);
