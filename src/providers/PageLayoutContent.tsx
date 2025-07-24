import Spinner from "@/common/Spinner/Spinner";
import ErrorSection from "@/components/ErrorSection";
import NotFound from "@/components/NotFound";
import { PropsWithChildren, useMemo } from "react";
import { usePageLayout } from "./PageLayoutContext";

type Props = PropsWithChildren;
const PageLayoutContent = ({ children }: Props) => {
  const { isError, isInitialLoading, isLoading, noContent, retry } =
    usePageLayout();

  const content = useMemo(() => {
    if (isError) {
      return (
        <div className="h-full flex items-center">
          <ErrorSection refetch={retry} />
        </div>
      );
    }
    if (isInitialLoading) {
      return <Spinner />;
    }
    if (noContent) {
      return (
        <div className="h-full flex items-center">
          <NotFound />
        </div>
      );
    }

    return <div className="pb-4">{children}</div>;
  }, [isError, isInitialLoading, isLoading, noContent, children]);

  return <div className="h-full">{content}</div>;
};

export default PageLayoutContent;
