import { normalizeText } from "./normalizeText.js";

export const filterItems = (items, search, getText) => {
  const normalizedSearch = normalizeText(search);
  if (!normalizedSearch) return items;

  const searchTerms = normalizedSearch.split(" ").filter(Boolean);
  return items.filter((item) =>
    searchTerms.every((term) => normalizeText(getText(item)).includes(term))
  );
};
