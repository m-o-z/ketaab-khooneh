"use client";
import { outline, Scanner } from "@yudiel/react-qr-scanner";

import {
  Button,
  ButtonGroup,
  Checkbox,
  CheckboxElement,
  Divider,
  IconButton,
} from "@tapsioss/react-components";
import { LineThreeHorizontalDecrease, Scan } from "@tapsioss/react-icons";
import { Fragment, useMemo } from "react";
import { useDebounce } from "use-debounce";

import BaseBottomSheet, {
  ChildrenProvider,
} from "@/common/BaseBottomSheet/BaseBottomSheet";
import ListToolbar from "@/common/components/ListToolbar";
import Typography from "@/common/Typography/Typography";
import BookPreview from "@/components/book/BookPreview";
import { useBooksGetAllApi } from "@/hooks/books";
import useBookListingFilters from "@/hooks/useBookListingFilters";
import { PageLayout } from "@/providers/PageLayout";
import { BookListFetchingParams } from "@/types";
import Link from "next/link";
import { CategoriesSelect } from "../Categories/CategoriesSelect/CategoriesSelect";
import { Stack } from "@mantine/core";

export default function BooksListing() {
  const { state, setState } = useBookListingFilters();

  const setSearch = (str: string) => {
    if (str != null) {
      setState({
        search: str,
      });
    }
  };
  const [debouncedSearch] = useDebounce(state.search, 1000, {
    leading: false,
    trailing: true,
  });

  const payload = useMemo<BookListFetchingParams>(
    () => ({
      search: debouncedSearch,
      page: state.page,
      perPage: 10,
      categories: state.categories,
      status: state.status,
    }),
    [state.categories, state.page, state.status, debouncedSearch],
  );

  const {
    isLoading,
    data: books,
    isError,
    isSuccess,
    isFetched,
    refetch,
  } = useBooksGetAllApi(payload);

  const handleToggleBookStatus = (e: Event) => {
    const target = e.target as CheckboxElement;
    if (target.checked) {
      setState({
        status: "AVAILABLE",
      });
    } else {
      setState({
        status: null,
      });
    }
  };

  const bottomSheetContent: ChildrenProvider = useMemo(
    () =>
      ({ hide }) => {
        return (
          <div className="h-[calc(var(--height)*0.85)] flex flex-col items-stretch justify-stretch">
            <Typography.Headline className="shrink-0" size="sm">
              فیلتر‌ها
            </Typography.Headline>
            <div className="space-y-4 grow">
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
            </div>
            <div className="shrink-0 pb-[env(safe-area-inset-bottom)]">
              <ButtonGroup fluidItems className="pb-4 w-full">
                <Button onClick={hide} size="lg" variant="ghost">
                  بستن
                </Button>
              </ButtonGroup>
            </div>
          </div>
        );
      },
    [state],
  );

  const renderToolbar = useMemo(() => {
    return (
      <div className="flex items-center space-x-2 w-full">
        <ListToolbar
          label="جستجو"
          placeholder="جستجو در عنوان کتاب و نام نویسنده ..."
          searchString={state.search}
          setSearchString={setSearch}
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

          <BaseBottomSheet.Content>
            {bottomSheetContent}
          </BaseBottomSheet.Content>
        </BaseBottomSheet>
      </div>
    );
  }, [state]);

  return (
    <PageLayout
      goToTopEnabled
      initialActions={
        <BaseBottomSheet>
          <BaseBottomSheet.Wrapper>
            {({ show }) => (
              <IconButton
                label="اسکن کتاب با دوربین"
                variant="naked"
                onClick={show}
              >
                <Scan />
              </IconButton>
            )}
          </BaseBottomSheet.Wrapper>
          <BaseBottomSheet.Content>
            <div className="w-full justify-center h-[calc(var(--height)*0.7)] ">
              <div className="aspect-square">
                <Scanner
                  onScan={(result) => console.log(result)}
                  allowMultiple={false}
                  formats={["qr_code"]}
                  scanDelay={2000}
                  sound={false}
                  components={{
                    finder: true,
                    torch: true,
                    onOff: true,
                    tracker: outline,
                  }}
                />
                ;
              </div>
            </div>
          </BaseBottomSheet.Content>
        </BaseBottomSheet>
      }
      initialTitle="کتاب‌ها"
      isError={isError}
      isInitialLoading={isLoading && !isFetched}
      isLoading={isLoading}
      noContent={isSuccess && books.length === 0}
      retry={() => {
        void refetch();
      }}
    >
      <div className="space-y-8 flex flex-col h-full" key="layout">
        <div className="shrink-0">{renderToolbar}</div>
        <PageLayout.Content>
          <Stack>
            {books?.map((book, index) => (
              <Fragment key={book.id}>
                {index !== 0 && <Divider />}
                <Link
                  href={`books/${book.id}`}
                  aria-label={`کتاب ${book.title}`}
                >
                  <BookPreview.List book={book} />
                </Link>
              </Fragment>
            ))}
          </Stack>
        </PageLayout.Content>
      </div>
    </PageLayout>
  );
}
