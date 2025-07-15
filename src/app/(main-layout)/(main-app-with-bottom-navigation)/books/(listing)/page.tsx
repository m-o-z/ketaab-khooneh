"use client";
import { Stack } from "@mantine/core";
import { Button, ButtonGroup, Checkbox, Divider, IconButton, Switch, TextField } from "@tapsioss/react-components";
import { LineThreeHorizontalDecrease, Scan } from "@tapsioss/react-icons";
import { useRouter } from "next/navigation";
import { Fragment, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";

import ListToolbar from "@/common/components/ListToolbar";
import BookPreview from "@/components/book/BookPreview";
import { useBooksGetAllApi } from "@/hooks/books";
import { useCategoriesQuery } from "@/hooks/categories";
import { PageLayout } from "@/providers/PageLayout";
import Link from "next/link";
import BaseBottomSheet from "@/common/BaseBottomSheet/BaseBottomSheet";
import Text from "@/common/Text/Text";
import { MultiSelect } from "@/common/MultiSelect";

export default function Books() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [searchString, setSearchString] = useState<string>("");
  const [filters, setFilters] = useState<string[]>([]);
  const [debouncedSearch] = useDebounce(searchString, 1000, {
    leading: false,
    trailing: true,
  });

  const payload = useMemo(
    () => ({
      search: debouncedSearch,
      page,
      perPage: 10,
    }),
    [page, debouncedSearch],
  );

  const {
    isLoading,
    data: books,
    isError,
    isSuccess,
    refetch,
  } = useBooksGetAllApi(payload);

  const { isLoading: isCategoryLoading, data: categories } =
    useCategoriesQuery();

  const handleClick = (bookId: string) => {
    router.push(`books/${bookId}`);
  };
  const renderBooksSection = () => {
    return (
      <Stack>
        {books?.map((book, index) => (
          <Fragment key={book.id}>
            {index !== 0 && <Divider />}
            <Link href={`books/${book.id}`} aria-label={`کتاب ${book.title}`}>
              <BookPreview.List book={book} />
            </Link>
          </Fragment>
        ))}
      </Stack>
    );
  };

  const renderToolbar = () => {
    return (
      <div className="flex align-middle gap-1 w-full">
        <ListToolbar
          filters={categories?.map((cat) => cat.label)}
          searchString={searchString}
          selectedFilters={filters}
          setSearchString={setSearchString}
          setSelectedFilters={setFilters}
        />
        <BaseBottomSheet>
          <BaseBottomSheet.Wrapper>
            {({ show, isOpen }) => (
              <IconButton label="اعمال فیلتر روی کتاب‌ها" onClick={show} variant={isOpen ? "primary" : "ghost"}>
                <LineThreeHorizontalDecrease />
              </IconButton>
            )}
          </BaseBottomSheet.Wrapper>

          <BaseBottomSheet.Content>
            <div
              className="h-[calc(var(--height)*0.85)] "
            >
              <Text type="headline" size="sm">فیلتر‌ها</Text>
              <Stack>
                <div className="flex items-center">
                <Checkbox id="show-only-available-books-input" labelledBy="show-only-available-books-label" />
                <span><label htmlFor="show-only-available-books-input" id="show-only-available-books-label">نمایش کتاب موجود</label></span>
              </div>
              <MultiSelect
                placeholder="انتخاب دسته‌بندی"
                data={categories?.map(c => c.label)}
                label="بر اساس دسته‌بندی کتاب"
              />

              <MultiSelect
                placeholder="انتخاب وضعیت کتاب"
                data={['React', 'Angular', 'Vue', 'Svelte']}
                label="بر اساس وضعیت"
              />

              <MultiSelect
                placeholder="انتخاب نویسنده..."
                data={['React', 'Angular', 'Vue', 'Svelte']}
                label="بر اساس نویسنده"
              />

              <ButtonGroup fluidItems>
                <Button>
                  اعمال فیلتر
                </Button>
              </ButtonGroup>
              </Stack>

            </div>
          </BaseBottomSheet.Content>
        </BaseBottomSheet>
      </div>
    );
  };

  return (
    <PageLayout
      goToTopEnabled
      initialActions={
        <IconButton label="اسکن کتاب با دوربین" variant="naked">
          <Scan />
        </IconButton>
      }
      initialTitle="کتاب‌ها"
      isError={isError}
      isLoading={isLoading || isCategoryLoading}
      noContent={isSuccess && books.length === 0}
      retry={() => {
        void refetch();
      }}
    >
      <div className="space-y-8">
        {renderToolbar()}
        {renderBooksSection()}
      </div>
    </PageLayout>
  );
}
