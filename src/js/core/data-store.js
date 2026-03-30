const productsUrl = new URL("../../data/products.json", import.meta.url);
const siteUrl = new URL("../../data/site.json", import.meta.url);
const guideUrl = new URL("../../data/guide.json", import.meta.url);
const faqUrl = new URL("../../data/faq.json", import.meta.url);

const requestCache = new Map();

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to load data: ${response.status}`);
  }

  return response.json();
}

function loadJson(key, url) {
  if (!requestCache.has(key)) {
    const request = fetchJson(url).catch((error) => {
      requestCache.delete(key);
      throw error;
    });

    requestCache.set(key, request);
  }

  return requestCache.get(key);
}

export function getProducts() {
  return loadJson("products", productsUrl);
}

export function getSite() {
  return loadJson("site", siteUrl);
}

export function getGuide() {
  return loadJson("guide", guideUrl);
}

export function getFaq() {
  return loadJson("faq", faqUrl);
}
