const RESET_VALUES = new Set(["tat-ca", "de-xuat"]);

export function getQueryParams() {
  return new URLSearchParams(window.location.search);
}

export function setQueryParams(nextState) {
  const params = getQueryParams();

  Object.entries(nextState).forEach(([key, value]) => {
    if (!value || RESET_VALUES.has(value)) {
      params.delete(key);
      return;
    }

    params.set(key, value);
  });

  const queryString = params.toString();
  const nextUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;

  window.history.replaceState({}, "", nextUrl);
}
