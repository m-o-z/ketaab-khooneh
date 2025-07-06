"use client";
import { Title } from "@mantine/core";
import { Avatar } from "@tapsioss/react-components";
import { useParams, useRouter } from "next/navigation";

import AuthorPreview from "@/components/author/AuthorPreview";
import ErrorSection from "@/components/ErrorSection";
import { useAuthorGetApi } from "@/hooks/authors";
import { PageLayout } from "@/providers/PageLayout";
import { capitalizeName } from "@/utils/string";

const Page = () => {
  const router = useRouter();
  const { authorId } = useParams();
  const {
    data: author,
    isLoading,
    isError,
  } = useAuthorGetApi(authorId as string);

  const renderAuthorPreview = () => {
    if (isLoading) {
      return <AuthorPreview.Loading />;
    }
    if (isError) {
      return (
        <ErrorSection description="خطایی در نمایش اطلاعات نویسنده رخ داد!" />
      );
    }
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
      onBackClick={onBackClick}
    >
      <div className="space-y-4">{renderAuthorPreview()}</div>
    </PageLayout>
  );
};

export default Page;
