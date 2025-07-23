import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";

const useBookListingFilters = () => {
  const [state, setState] = useQueryStates(
    {
      search: parseAsString.withDefault(""),
      page: parseAsInteger.withDefault(1),
      categories: parseAsArrayOf(parseAsString).withDefault([]),
      state: parseAsStringEnum(["AVAILABLE", "UNAVAILABLE"]).withDefault(
        "AVAILABLE",
      ),
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
