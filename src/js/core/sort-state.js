import { getQueryParams, setQueryParams } from "./query-state.js";
import { compareByName } from "../utils/format.js";

export const DEFAULT_SORT = "de-xuat";

export const SORT_OPTIONS = [
  { value: DEFAULT_SORT, label: "Đề xuất từ nhà hương" },
  { value: "gia-tang-dan", label: "Giá tăng dần" },
  { value: "gia-giam-dan", label: "Giá giảm dần" },
  { value: "ten-a-z", label: "Tên từ A đến Z" }
];

export function getSelectedSort() {
  const params = getQueryParams();
  const sort = params.get("sap-xep") ?? DEFAULT_SORT;

  return SORT_OPTIONS.some((option) => option.value === sort) ? sort : DEFAULT_SORT;
}

export function sortProducts(products, selectedSort) {
  const nextProducts = [...products];

  switch (selectedSort) {
    case "gia-tang-dan":
      return nextProducts.sort((left, right) => left.price - right.price || compareByName(left, right));
    case "gia-giam-dan":
      return nextProducts.sort((left, right) => right.price - left.price || compareByName(left, right));
    case "ten-a-z":
      return nextProducts.sort(compareByName);
    case DEFAULT_SORT:
    default:
      return nextProducts;
  }
}

export function updateSortInQuery(selectedSort) {
  setQueryParams({ "sap-xep": selectedSort });
}
