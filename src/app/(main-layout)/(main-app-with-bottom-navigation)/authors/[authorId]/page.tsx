"use client";
import AuthorPreview from "@/components/author/AuthorPreview";
import ErrorSection from "@/components/ErrorSection";
import { useAuthorGetApi } from "@/hooks/authors";
import { PageLayout } from "@/providers/PageLayout";
import { capitalizeName } from "@/utils/string";
import { Title } from "@mantine/core";
import { Avatar } from "@tapsioss/react-components";
import { useParams, useRouter } from "next/navigation";

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
              <Avatar image={author.authorImg} size="xxlg" alt={author.name} />
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
      initialTitle="اطلاعات نویسنده"
      showBackButton
      onBackClick={onBackClick}
    >
      <div className="space-y-4">{renderAuthorPreview()}</div>
    </PageLayout>
  );
};

export default Page;
