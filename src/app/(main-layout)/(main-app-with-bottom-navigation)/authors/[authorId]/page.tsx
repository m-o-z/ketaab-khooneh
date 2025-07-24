"use client";
import { Title } from "@mantine/core";
import { Avatar } from "@tapsioss/react-components";
import { useParams, useRouter } from "next/navigation";

import { useAuthorGetApi } from "@/hooks/authors";
import { PageLayout } from "@/providers/PageLayout";
import { capitalizeName } from "@/utils/string";

const Page = () => {
  const router = useRouter();
  const { authorId } = useParams();
  const {
    data: author,
    isLoading,
    isFetched,
    isError,
    isSuccess,
    refetch,
  } = useAuthorGetApi(authorId as string);

  const renderAuthorPreview = () => {
    if (author) {
      return (
        <>
          <div className="flex items-center space-x-4" dir="ltr">
            {author.authorImg && (
              <Avatar alt={author.name} image={author.authorImg} size="xxlg" />
            )}
            <Title order={3}>{capitalizeName(author.name)}</Title>
          </div>
          {author.bio && <p>{author.bio}</p>}
        </>
      );
    }
  };
  const onBackClick = () => {
    router.back();
  };

  return (
    <PageLayout
      showBackButton
      initialTitle="اطلاعات نویسنده"
      isError={isError}
      isInitialLoading={isLoading && !isFetched}
      isLoading={isLoading}
      noContent={!author && isSuccess}
      retry={() => {
        void refetch();
      }}
      onBackClick={onBackClick}
    >
      <PageLayout.Content>
        <div className="space-y-4">{renderAuthorPreview()}</div>
      </PageLayout.Content>
    </PageLayout>
  );
};

export default Page;
