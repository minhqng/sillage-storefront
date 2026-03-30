import { getProductBySlug, getProductHref, getProductNotes, resolveProductSize } from "./product-service.js";

export const CART_STORAGE_KEY = "sillage-cart";
export const CART_UPDATED_EVENT = "cart:updated";
export const CART_MAX_QUANTITY = 12;

function createEmptyState() {
  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    items: []
  };
}

function getStorage() {
  try {
    return typeof globalThis.localStorage !== "undefined" ? globalThis.localStorage : null;
  } catch {
    return null;
  }
}

function getWindowObject() {
  try {
    return typeof window !== "undefined" ? window : null;
  } catch {
    return null;
  }
}

function dispatchCartUpdated(state) {
  const target = getWindowObject();

  if (!target || typeof target.dispatchEvent !== "function") {
    return;
  }

  if (typeof CustomEvent === "function") {
    target.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT, { detail: state }));
    return;
  }

  target.dispatchEvent(new Event(CART_UPDATED_EVENT));
}

function clampQuantity(quantity) {
  const parsedQuantity = Number.parseInt(String(quantity), 10);

  if (!Number.isInteger(parsedQuantity)) {
    return 1;
  }

  return Math.min(CART_MAX_QUANTITY, Math.max(1, parsedQuantity));
}

function normalizePrice(value) {
  const parsedPrice = Number.parseFloat(String(value));

  if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
    return null;
  }

  return Number(parsedPrice.toFixed(2));
}

function createCartKey(productId, sizeId) {
  return `${productId}::${sizeId}`;
}

function normalizeItem(input) {
  if (!input || typeof input !== "object") {
    return null;
  }

  const productId = typeof input.productId === "string" ? input.productId.trim() : "";
  const sizeId = typeof input.sizeId === "string" ? input.sizeId.trim() : "";
  const unitPrice = normalizePrice(input.unitPrice);

  if (!productId || !sizeId || unitPrice === null) {
    return null;
  }

  return {
    productId,
    sizeId,
    quantity: clampQuantity(input.quantity),
    unitPrice,
    addedAt: typeof input.addedAt === "string" ? input.addedAt : new Date().toISOString()
  };
}

function mergeItems(items) {
  const mergedItems = new Map();

  items.forEach((item) => {
    const normalizedItem = normalizeItem(item);

    if (!normalizedItem) {
      return;
    }

    const itemKey = createCartKey(normalizedItem.productId, normalizedItem.sizeId);
    const existingItem = mergedItems.get(itemKey);

    if (existingItem) {
      existingItem.quantity = clampQuantity(existingItem.quantity + normalizedItem.quantity);
      existingItem.unitPrice = normalizedItem.unitPrice;
      return;
    }

    mergedItems.set(itemKey, { ...normalizedItem });
  });

  return Array.from(mergedItems.values());
}

function normalizeState(input) {
  if (!input || typeof input !== "object" || !Array.isArray(input.items)) {
    return createEmptyState();
  }

  return {
    version: 1,
    updatedAt: typeof input.updatedAt === "string" ? input.updatedAt : new Date().toISOString(),
    items: mergeItems(input.items)
  };
}

function cloneState(state) {
  return {
    ...state,
    items: state.items.map((item) => ({ ...item }))
  };
}

function saveState(state) {
  const nextState = {
    ...normalizeState(state),
    updatedAt: new Date().toISOString()
  };

  const storage = getStorage();

  if (storage) {
    try {
      storage.setItem(CART_STORAGE_KEY, JSON.stringify(nextState));
    } catch {
      // Ignore persistence failures so the UI can remain usable for the current session.
    }
  }

  dispatchCartUpdated(nextState);

  return nextState;
}

function updateCartState(updater) {
  const currentState = getCartState();
  const draftState = cloneState(currentState);
  const nextState = updater(draftState) ?? draftState;

  return saveState(nextState);
}

function hydrateCartItem(item, products) {
  const product = getProductBySlug(products, item.productId);

  if (!product) {
    return {
      stale: true,
      reason: "missing-product",
      productId: item.productId,
      sizeId: item.sizeId,
      quantity: item.quantity
    };
  }

  const size = resolveProductSize(product, item.sizeId);

  if (!size) {
    return {
      stale: true,
      reason: "missing-size",
      productId: item.productId,
      productName: product.name,
      sizeId: item.sizeId,
      quantity: item.quantity
    };
  }

  const unitPrice = normalizePrice(size.price) ?? product.price;

  return {
    stale: false,
    key: createCartKey(item.productId, size.id),
    productId: item.productId,
    sizeId: size.id,
    quantity: item.quantity,
    unitPrice,
    storedUnitPrice: item.unitPrice,
    lineTotal: unitPrice * item.quantity,
    addedAt: item.addedAt,
    name: product.name,
    family: product.family,
    tagline: product.tagline,
    description: product.shortDescription,
    image: product.image,
    href: getProductHref(product),
    notes: getProductNotes(product),
    sizeLabel: size.label,
    isDiscovery: product.id === "discovery-set"
  };
}

function serializeHydratedItems(items) {
  return items.map((item) => ({
    productId: item.productId,
    sizeId: item.sizeId,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    addedAt: item.addedAt
  }));
}

export function getCartState() {
  const storage = getStorage();

  if (!storage) {
    return createEmptyState();
  }

  try {
    const rawValue = storage.getItem(CART_STORAGE_KEY);

    if (!rawValue) {
      return createEmptyState();
    }

    return normalizeState(JSON.parse(rawValue));
  } catch {
    return createEmptyState();
  }
}

export function subscribeToCartUpdates(listener, { emitInitial = false } = {}) {
  if (typeof listener !== "function") {
    return () => {};
  }

  const target = getWindowObject();

  if (!target || typeof target.addEventListener !== "function") {
    if (emitInitial) {
      listener(getCartState(), { source: "initial" });
    }

    return () => {};
  }

  let pendingState = null;
  let pendingSource = "event";
  let frameHandle = null;

  const flush = () => {
    frameHandle = null;
    const nextState = pendingState ?? getCartState();
    const source = pendingSource;
    pendingState = null;
    listener(nextState, { source });
  };

  const schedule = (state, source) => {
    pendingState = state ? normalizeState(state) : getCartState();
    pendingSource = source;

    if (frameHandle !== null) {
      return;
    }

    if (typeof target.requestAnimationFrame === "function") {
      frameHandle = target.requestAnimationFrame(flush);
      return;
    }

    frameHandle = target.setTimeout(flush, 0);
  };

  const handleCartUpdated = (event) => {
    const detail = event && typeof event === "object" && "detail" in event ? event.detail : null;
    schedule(detail, "event");
  };

  const handleStorage = (event) => {
    if (event && typeof event === "object" && "key" in event) {
      const key = event.key;

      if (key !== CART_STORAGE_KEY && key !== null) {
        return;
      }
    }

    schedule(null, "storage");
  };

  target.addEventListener(CART_UPDATED_EVENT, handleCartUpdated);
  target.addEventListener("storage", handleStorage);

  if (emitInitial) {
    listener(getCartState(), { source: "initial" });
  }

  return () => {
    target.removeEventListener(CART_UPDATED_EVENT, handleCartUpdated);
    target.removeEventListener("storage", handleStorage);

    if (frameHandle === null) {
      return;
    }

    if (typeof target.cancelAnimationFrame === "function") {
      target.cancelAnimationFrame(frameHandle);
      frameHandle = null;
      return;
    }

    target.clearTimeout(frameHandle);
    frameHandle = null;
  };
}

export function addCartItem({ productId, sizeId, quantity, unitPrice }) {
  const normalizedItem = normalizeItem({
    productId,
    sizeId,
    quantity,
    unitPrice,
    addedAt: new Date().toISOString()
  });

  if (!normalizedItem) {
    return getCartState();
  }

  return updateCartState((state) => {
    const existingItem = state.items.find(
      (item) => item.productId === normalizedItem.productId && item.sizeId === normalizedItem.sizeId
    );

    if (existingItem) {
      existingItem.quantity = clampQuantity(existingItem.quantity + normalizedItem.quantity);
      existingItem.unitPrice = normalizedItem.unitPrice;
      return state;
    }

    state.items.push(normalizedItem);
    return state;
  });
}

export function removeCartItem({ productId, sizeId }) {
  if (typeof productId !== "string" || typeof sizeId !== "string") {
    return getCartState();
  }

  return updateCartState((state) => {
    state.items = state.items.filter((item) => !(item.productId === productId && item.sizeId === sizeId));
    return state;
  });
}

export function updateCartItemQuantity({ productId, sizeId, quantity }) {
  if (typeof productId !== "string" || typeof sizeId !== "string") {
    return getCartState();
  }

  const parsedQuantity = Number.parseInt(String(quantity), 10);

  if (!Number.isInteger(parsedQuantity)) {
    return getCartState();
  }

  if (parsedQuantity <= 0) {
    return removeCartItem({ productId, sizeId });
  }

  return updateCartState((state) => {
    const item = state.items.find((entry) => entry.productId === productId && entry.sizeId === sizeId);

    if (!item) {
      return state;
    }

    item.quantity = clampQuantity(parsedQuantity);
    return state;
  });
}

export function incrementCartItem({ productId, sizeId }) {
  const currentItem = getCartState().items.find((item) => item.productId === productId && item.sizeId === sizeId);

  if (!currentItem) {
    return getCartState();
  }

  return updateCartItemQuantity({
    productId,
    sizeId,
    quantity: currentItem.quantity + 1
  });
}

export function decrementCartItem({ productId, sizeId }) {
  const currentItem = getCartState().items.find((item) => item.productId === productId && item.sizeId === sizeId);

  if (!currentItem) {
    return getCartState();
  }

  return updateCartItemQuantity({
    productId,
    sizeId,
    quantity: currentItem.quantity - 1
  });
}

export function clearCart() {
  return saveState(createEmptyState());
}

export function getCartCount(state = getCartState()) {
  return state.items.reduce((total, item) => total + item.quantity, 0);
}

export function getCartSubtotal(state = getCartState()) {
  return Number(
    state.items
      .reduce((total, item) => total + item.quantity * item.unitPrice, 0)
      .toFixed(2)
  );
}

export function getCartSummary(products, state = getCartState()) {
  const sourceState = normalizeState(state);
  const hydratedItems = [];
  const staleItems = [];
  let requiresSync = false;

  sourceState.items.forEach((item) => {
    const hydratedItem = hydrateCartItem(item, products);

    if (hydratedItem.stale) {
      staleItems.push(hydratedItem);
      requiresSync = true;
      return;
    }

    if (hydratedItem.storedUnitPrice !== hydratedItem.unitPrice) {
      requiresSync = true;
    }

    if (item.sizeId !== hydratedItem.sizeId) {
      requiresSync = true;
    }

    hydratedItems.push(hydratedItem);
  });

  const subtotal = Number(hydratedItems.reduce((total, item) => total + item.lineTotal, 0).toFixed(2));

  return {
    state: sourceState,
    items: hydratedItems,
    staleItems,
    lineCount: hydratedItems.length,
    itemCount: hydratedItems.reduce((total, item) => total + item.quantity, 0),
    subtotal,
    requiresSync,
    isEmpty: hydratedItems.length === 0,
    checkoutItems: hydratedItems.map((item) => ({
      productId: item.productId,
      sizeId: item.sizeId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      lineTotal: item.lineTotal,
      name: item.name,
      sizeLabel: item.sizeLabel,
      href: item.href
    }))
  };
}

export function syncCartWithCatalog(products, state = getCartState()) {
  const summary = getCartSummary(products, state);

  if (!summary.requiresSync) {
    return {
      ...summary,
      removedStaleCount: 0,
      updatedPriceCount: 0
    };
  }

  const nextState = saveState({
    ...summary.state,
    items: serializeHydratedItems(summary.items)
  });

  const nextSummary = getCartSummary(products, nextState);

  return {
    ...nextSummary,
    removedStaleCount: summary.staleItems.length,
    updatedPriceCount: summary.items.filter((item) => item.storedUnitPrice !== item.unitPrice).length
  };
}
