import { BookDB } from "@/schema/books";
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs";

const useBookListingFilters = () => {
  const [state, setState] = useQueryStates(
    {
      search: parseAsString.withDefault(""),
      page: parseAsInteger.withDefault(1),
      categories: parseAsArrayOf(parseAsString).withDefault([]),
      status: parseAsStringLiteral([
        "AVAILABLE",
        "UNAVAILABLE",
      ] as BookDB["status"][]),
    },
    {
      history: "push",
    },
  );

  return {
    state,
    setState,
  };
};

export default useBookListingFilters;
