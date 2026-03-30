import { compareByName, formatTag } from "../utils/format.js";

const visualThemes = {
  "ho-phach-go": {
    start: "#e4d0bb",
    end: "#8a6c53",
    glow: "rgba(244, 236, 224, 0.9)"
  },
  "amber-woods": {
    start: "#e4d0bb",
    end: "#8a6c53",
    glow: "rgba(244, 236, 224, 0.9)"
  },
  "sung-xanh": {
    start: "#d6dfcf",
    end: "#78806c",
    glow: "rgba(235, 242, 230, 0.92)"
  },
  "green-fig": {
    start: "#d6dfcf",
    end: "#78806c",
    glow: "rgba(235, 242, 230, 0.92)"
  },
  "dien-vi-phan": {
    start: "#e4ddd8",
    end: "#978c8a",
    glow: "rgba(244, 240, 239, 0.92)"
  },
  "powdered-iris": {
    start: "#e4ddd8",
    end: "#978c8a",
    glow: "rgba(244, 240, 239, 0.92)"
  },
  "co-huong-bai-go": {
    start: "#d2d4c6",
    end: "#737764",
    glow: "rgba(232, 236, 225, 0.9)"
  },
  "vetiver-woods": {
    start: "#d2d4c6",
    end: "#737764",
    glow: "rgba(232, 236, 225, 0.9)"
  },
  "cam-khoang": {
    start: "#ddd8ca",
    end: "#909890",
    glow: "rgba(242, 241, 236, 0.9)"
  },
  "mineral-citrus": {
    start: "#ddd8ca",
    end: "#909890",
    glow: "rgba(242, 241, 236, 0.9)"
  },
  "go-khoi": {
    start: "#d5c8bf",
    end: "#5f5148",
    glow: "rgba(233, 223, 215, 0.9)"
  },
  "smoked-woods": {
    start: "#d5c8bf",
    end: "#5f5148",
    glow: "rgba(233, 223, 215, 0.9)"
  },
  "hoa-trang-cam": {
    start: "#ece5d8",
    end: "#a89a86",
    glow: "rgba(250, 245, 238, 0.92)"
  },
  "white-floral-citrus": {
    start: "#ece5d8",
    end: "#a89a86",
    glow: "rgba(250, 245, 238, 0.92)"
  },
  "kham-pha": {
    start: "#dfd7cb",
    end: "#918474",
    glow: "rgba(245, 241, 234, 0.92)"
  },
  discovery: {
    start: "#dfd7cb",
    end: "#918474",
    glow: "rgba(245, 241, 234, 0.92)"
  },
  default: {
    start: "#ded4c7",
    end: "#8d7968",
    glow: "rgba(245, 239, 231, 0.9)"
  }
};

const PRODUCT_TYPE_FRAGRANCE = "fragrance";
const PRODUCT_TYPE_DISCOVERY_SET = "discovery-set";

function normalizeLookupToken(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

function createFallbackVolumeId(label, index) {
  const normalizedLabel = normalizeLookupToken(label);
  return normalizedLabel || `dung-tich-${index + 1}`;
}

function getProductTags(product) {
  return new Set([
    ...(product.seasonTags ?? []),
    ...(product.occasionTags ?? []),
    ...(product.topNotes ?? []),
    ...(product.middleNotes ?? []),
    ...(product.baseNotes ?? [])
  ]);
}

function getLookupCandidates(product) {
  return [
    product.id,
    product.slug,
    ...(Array.isArray(product.legacySlugs) ? product.legacySlugs : [])
  ].filter((entry) => typeof entry === "string" && entry.trim());
}

export function getProductType(product) {
  if (typeof product?.type === "string" && product.type.trim()) {
    return product.type.trim();
  }

  if (product?.id === "discovery-set" || product?.family === "kham-pha" || product?.slug === "bo-kham-pha") {
    return PRODUCT_TYPE_DISCOVERY_SET;
  }

  return PRODUCT_TYPE_FRAGRANCE;
}

export function isFragranceProduct(product) {
  return getProductType(product) === PRODUCT_TYPE_FRAGRANCE;
}

export function isDiscoveryProduct(product) {
  return getProductType(product) === PRODUCT_TYPE_DISCOVERY_SET;
}

export function getProductCategoryLabel(product) {
  return isDiscoveryProduct(product) ? "Bộ khám phá" : "Nước hoa";
}

export function getListingProducts(products) {
  return products.filter((product) => isFragranceProduct(product)).sort((left, right) => {
    if (left.featured !== right.featured) {
      return Number(right.featured) - Number(left.featured);
    }

    if (left.bestSeller !== right.bestSeller) {
      return Number(right.bestSeller) - Number(left.bestSeller);
    }

    return compareByName(left, right);
  });
}

export function getProductHref(product) {
  if (isDiscoveryProduct(product)) {
    return "bo-kham-pha.html";
  }

  const slug = typeof product.slug === "string" && product.slug.trim() ? product.slug.trim() : product.id;
  return `chi-tiet-san-pham.html?san-pham=${encodeURIComponent(slug)}`;
}

export function formatFamilyLabel(family) {
  return formatTag(family);
}

export function getFamilyOptions(products) {
  return Array.from(new Set(products.map((product) => product.family)))
    .sort((left, right) => formatFamilyLabel(left).localeCompare(formatFamilyLabel(right), "vi"))
    .map((value) => ({
      value,
      label: formatFamilyLabel(value)
    }));
}

export function getOccasionOptions(products) {
  return Array.from(new Set(products.flatMap((product) => product.occasionTags ?? [])))
    .sort((left, right) => formatTag(left).localeCompare(formatTag(right), "vi"))
    .map((value) => ({
      value,
      label: formatTag(value)
    }));
}

export function getProductTheme(product) {
  return visualThemes[product.family] ?? visualThemes.default;
}

export function getProductNotes(product) {
  return [product.topNotes?.[0], product.middleNotes?.[0], product.baseNotes?.[0]].filter(Boolean).slice(0, 3);
}

export function getProductBySlug(products, slug) {
  const targetToken = normalizeLookupToken(slug);

  return (
    products.find((product) =>
      getLookupCandidates(product).some((candidate) => normalizeLookupToken(candidate) === targetToken)
    ) ?? null
  );
}

export function getProductSizes(product) {
  if (Array.isArray(product.volumes) && product.volumes.length > 0) {
    const explicitDefaultIndex = product.volumes.findIndex((volume) => volume?.default === true);

    return product.volumes.map((volume, index) => ({
      id:
        typeof volume.id === "string" && volume.id.trim()
          ? volume.id.trim()
          : createFallbackVolumeId(volume.label ?? volume.size ?? "", index),
      label:
        typeof volume.label === "string" && volume.label.trim()
          ? volume.label.trim()
          : typeof volume.size === "string" && volume.size.trim()
            ? volume.size.trim()
            : "Dung tích tiêu chuẩn",
      price: typeof volume.price === "number" ? volume.price : product.price,
      legacyIds: Array.from(
        new Set(
          [volume.size, volume.label, volume.legacyId]
            .filter((entry) => typeof entry === "string" && entry.trim())
            .map((entry) => entry.trim())
        )
      ),
      isDefault: explicitDefaultIndex >= 0 ? index === explicitDefaultIndex : index === 0
    }));
  }

  return [
    {
      id: "default",
      label: "Dung tích tiêu chuẩn",
      price: product.price,
      isDefault: true,
      legacyIds: []
    }
  ];
}

export function getDefaultProductSize(product) {
  const sizes = getProductSizes(product);

  return sizes.find((size) => size.isDefault) ?? sizes[0] ?? null;
}

export function resolveProductSize(product, requestedSizeId) {
  const requestedToken = normalizeLookupToken(requestedSizeId);

  return (
    getProductSizes(product).find((size) => {
      if (size.id === requestedSizeId) {
        return true;
      }

      if (requestedToken && normalizeLookupToken(size.id) === requestedToken) {
        return true;
      }

      return size.legacyIds.some((legacyId) => normalizeLookupToken(legacyId) === requestedToken);
    }) ?? null
  );
}

export function getProductImage(product) {
  return typeof product.image === "string" ? product.image : "";
}

export function getProductGallery(product) {
  return Array.isArray(product.gallery) ? product.gallery.filter((entry) => typeof entry === "string" && entry) : [];
}

export function getDiscoveryProduct(products) {
  return products.find((product) => isDiscoveryProduct(product)) ?? null;
}

export function getCatalogProducts(products) {
  return products.filter((product) => isFragranceProduct(product));
}

export function getFeaturedProducts(products, limit = 3) {
  const catalogProducts = getCatalogProducts(products);
  const featuredProducts = catalogProducts.filter((product) => product.featured);
  const sourceProducts = featuredProducts.length > 0 ? featuredProducts : getListingProducts(catalogProducts);

  return sourceProducts.slice(0, limit);
}

export function getProductsByIds(products, productIds) {
  return productIds
    .map((productId) => products.find((product) => product.id === productId))
    .filter(Boolean);
}

export function getSignatureProducts(products, featuredProducts = getFeaturedProducts(products), limit = 3) {
  const orderedProducts = [...featuredProducts, ...getCatalogProducts(products)];
  const uniqueProducts = [];
  const seenProducts = new Set();

  for (const product of orderedProducts) {
    if (seenProducts.has(product.id)) {
      continue;
    }

    seenProducts.add(product.id);
    uniqueProducts.push(product);

    if (uniqueProducts.length === limit) {
      break;
    }
  }

  return uniqueProducts;
}

export function getRelatedProducts(products, currentProduct, limit = 3) {
  const currentTags = getProductTags(currentProduct);

  const candidates = products
    .filter((product) => product.id !== currentProduct.id && isFragranceProduct(product))
    .map((product) => {
      const candidateTags = getProductTags(product);
      let overlap = 0;

      currentTags.forEach((tag) => {
        if (candidateTags.has(tag)) {
          overlap += 1;
        }
      });

      return {
        product,
        isSameFamily: product.family === currentProduct.family,
        overlap
      };
    });

  return candidates
    .sort((left, right) => {
      if (left.isSameFamily !== right.isSameFamily) {
        return Number(right.isSameFamily) - Number(left.isSameFamily);
      }

      if (left.overlap !== right.overlap) {
        return right.overlap - left.overlap;
      }

      if (left.product.featured !== right.product.featured) {
        return Number(right.product.featured) - Number(left.product.featured);
      }

      return compareByName(left.product, right.product);
    })
    .slice(0, limit)
    .map((entry) => entry.product);
}
