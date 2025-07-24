"use client";
import { Stack } from "@mantine/core";
import { outline, Scanner } from "@yudiel/react-qr-scanner";

import {
  Button,
  ButtonGroup,
  Checkbox,
  Divider,
  IconButton,
} from "@tapsioss/react-components";
import { LineThreeHorizontalDecrease, Scan } from "@tapsioss/react-icons";
import { useRouter } from "next/navigation";
import { Fragment, PropsWithChildren, useCallback, useMemo } from "react";
import { useDebounce } from "use-debounce";

import BaseBottomSheet from "@/common/BaseBottomSheet/BaseBottomSheet";
import ListToolbar from "@/common/components/ListToolbar";
import Typography from "@/common/Typography/Typography";
import BookPreview from "@/components/book/BookPreview";
import { useBooksGetAllApi } from "@/hooks/books";
import useBookListingFilters from "@/hooks/useBookListingFilters";
import { PageLayout } from "@/providers/PageLayout";
import Link from "next/link";
import { CategoriesSelect } from "../Categories/CategoriesSelect/CategoriesSelect";

export default function BooksListing() {
  const { state, setState } = useBookListingFilters();
  const router = useRouter();

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

  const payload = useMemo(
    () => ({
      search: debouncedSearch,
      page: state.page,
      perPage: 10,
    }),
    [state.page, debouncedSearch],
  );

  const {
    isLoading,
    data: books,
    isError,
    isSuccess,
    refetch,
  } = useBooksGetAllApi(payload);

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
      <div className="flex items-center space-x-2 w-full" key={"toolbar"}>
        <ListToolbar searchString={state.search} setSearchString={setSearch} />
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
            <div className="h-[calc(var(--height)*0.85)] ">
              <Typography.Headline size="sm">فیلتر‌ها</Typography.Headline>
              <Stack>
                <div className="flex items-center">
                  <Checkbox
                    id="show-only-available-books-input"
                    labelledBy="show-only-available-books-label"
                  />
                  <span>
                    <label
                      htmlFor="show-only-available-books-input"
                      id="show-only-available-books-label"
                    >
                      نمایش کتاب موجود
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

                {/* <MultiSelect
                  placeholder="انتخاب وضعیت کتاب"
                  data={["React", "Angular", "Vue", "Svelte"]}
                  label="بر اساس وضعیت"
                />

                <MultiSelect
                  placeholder="انتخاب نویسنده..."
                  data={["React", "Angular", "Vue", "Svelte"]}
                  label="بر اساس نویسنده"
                /> */}

                <ButtonGroup fluidItems>
                  <Button>اعمال فیلتر</Button>
                </ButtonGroup>
              </Stack>
            </div>
          </BaseBottomSheet.Content>
        </BaseBottomSheet>
      </div>
    );
  };

  const ContentLayout = useCallback(({ children }: PropsWithChildren) => {
    return (
      <div className="space-y-8 flex flex-col h-full">
        <div className="shrink-0">{renderToolbar()}</div>
        <div className="grow">{children}</div>
      </div>
    );
  }, []);

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
      isLoading={isLoading}
      noContent={isSuccess && books.length === 0}
      retry={() => {
        void refetch();
      }}
      ContentLayout={ContentLayout}
    >
      {renderBooksSection()}
    </PageLayout>
  );
}
