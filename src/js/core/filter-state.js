import { getQueryParams, setQueryParams } from "./query-state.js";

export const ALL_FAMILIES = "tat-ca";
export const ALL_OCCASIONS = "tat-ca";

export function getSelectedFamily(availableFamilies) {
  const params = getQueryParams();
  const family = params.get("nhom-huong") ?? ALL_FAMILIES;

  return availableFamilies.includes(family) ? family : ALL_FAMILIES;
}

export function applyFamilyFilter(products, selectedFamily) {
  if (!selectedFamily || selectedFamily === ALL_FAMILIES) {
    return products;
  }

  return products.filter((product) => product.family === selectedFamily);
}

export function updateFamilyInQuery(selectedFamily) {
  setQueryParams({ "nhom-huong": selectedFamily });
}

export function getSelectedOccasion(availableOccasions) {
  const params = getQueryParams();
  const occasion = params.get("dip-su-dung") ?? ALL_OCCASIONS;

  return availableOccasions.includes(occasion) ? occasion : ALL_OCCASIONS;
}

export function applyOccasionFilter(products, selectedOccasion) {
  if (!selectedOccasion || selectedOccasion === ALL_OCCASIONS) {
    return products;
  }

  return products.filter((product) => (product.occasionTags ?? []).includes(selectedOccasion));
}

export function updateOccasionInQuery(selectedOccasion) {
  setQueryParams({ "dip-su-dung": selectedOccasion });
}
