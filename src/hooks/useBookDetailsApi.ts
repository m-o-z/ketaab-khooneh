import { useQuery } from "react-query";
import { client } from "@/Client";
import { Book } from "@/types";

const useBookDetailsApi = (id: Book["id"]) =>
  useQuery([], () => client.book.details(id));

export default useBookDetailsApi;
