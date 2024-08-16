import { useQuery } from "react-query";
import { client, PaginationQuery } from "@/Client";

const useBookListApi = (query: PaginationQuery) =>
  useQuery([], () => client.book.list(query));

export default useBookListApi;
