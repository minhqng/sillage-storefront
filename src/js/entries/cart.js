import {
  incrementCartItem,
  decrementCartItem,
  removeCartItem,
  subscribeToCartUpdates,
  syncCartWithCatalog,
  updateCartItemQuantity
} from "../core/cart-store.js";
import { getProducts } from "../core/data-store.js";
import { mountPageShell } from "../core/page-shell.js";
import { renderCartErrorState, renderCartLoadingState, renderCartView } from "../render/cart-view.js";

let productsCatalog = [];
let unsubscribeCartUpdates = () => {};
let lastRenderedCartSignature = "";
const emptyCartNotices = {
  removedStaleCount: 0,
  updatedPriceCount: 0
};
let cartNoticeState = {
  key: "",
  ...emptyCartNotices
};

function getContentMount() {
  return document.querySelector("[data-cart-content]");
}

function renderContent(markup) {
  const mount = getContentMount();

  if (!mount) {
    throw new Error("Missing cart content mount.");
  }

  mount.innerHTML = markup;
}

function getCartNotices(summary) {
  const noticeKey = summary.state?.updatedAt ?? "";

  if (summary.removedStaleCount || summary.updatedPriceCount) {
    cartNoticeState = {
      key: noticeKey,
      removedStaleCount: summary.removedStaleCount || 0,
      updatedPriceCount: summary.updatedPriceCount || 0
    };

    return {
      removedStaleCount: cartNoticeState.removedStaleCount,
      updatedPriceCount: cartNoticeState.updatedPriceCount
    };
  }

  if (cartNoticeState.key !== noticeKey) {
    cartNoticeState = {
      key: noticeKey,
      ...emptyCartNotices
    };
  }

  return {
    removedStaleCount: cartNoticeState.removedStaleCount,
    updatedPriceCount: cartNoticeState.updatedPriceCount
  };
}

function createCartRenderSignature(summary, notices) {
  return JSON.stringify({
    isEmpty: summary.isEmpty,
    itemCount: summary.itemCount,
    lineCount: summary.lineCount,
    subtotal: summary.subtotal,
    removedStaleCount: notices.removedStaleCount,
    updatedPriceCount: notices.updatedPriceCount,
    items: summary.items.map((item) => ({
      productId: item.productId,
      sizeId: item.sizeId,
      quantity: item.quantity,
      unitPrice: item.unitPrice
    }))
  });
}

function renderCartPage(state) {
  if (!productsCatalog.length) {
    return;
  }

  const summary = syncCartWithCatalog(productsCatalog, state);
  const notices = getCartNotices(summary);
  const nextSignature = createCartRenderSignature(summary, notices);

  if (nextSignature === lastRenderedCartSignature) {
    return;
  }

  lastRenderedCartSignature = nextSignature;
  renderContent(renderCartView(summary, notices));
}

function getItemPayload(target) {
  const itemNode = target.closest("[data-cart-item]");

  if (!itemNode) {
    return null;
  }

  const productId = itemNode.getAttribute("data-product-id") ?? "";
  const sizeId = itemNode.getAttribute("data-size-id") ?? "";

  if (!productId || !sizeId) {
    return null;
  }

  return { productId, sizeId };
}

function bindCartPage() {
  const mount = getContentMount();

  if (!mount) {
    return;
  }

  mount.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target.closest("[data-cart-remove], [data-cart-step]") : null;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    const payload = getItemPayload(target);

    if (!payload) {
      return;
    }

    if (target.hasAttribute("data-cart-remove")) {
      removeCartItem(payload);
      return;
    }

    const step = Number.parseInt(target.getAttribute("data-cart-step") ?? "0", 10);

    if (step > 0) {
      incrementCartItem(payload);
      return;
    }

    if (step < 0) {
      decrementCartItem(payload);
    }
  });

  mount.addEventListener("change", (event) => {
    if (!(event.target instanceof HTMLInputElement) || !event.target.matches("[data-cart-quantity]")) {
      return;
    }

    const payload = getItemPayload(event.target);

    if (!payload) {
      return;
    }

    updateCartItemQuantity({
      ...payload,
      quantity: event.target.value
    });
  });
}

async function initCartPage() {
  mountPageShell({
    currentPage: "cart",
    eyebrow: "Giỏ hàng",
    title: "Xem lại đơn hàng trước khi thanh toán.",
    summary:
      "Điều chỉnh số lượng, bỏ những lựa chọn không còn phù hợp và hoàn thiện giỏ hàng trước khi sang bước giao hàng.",
    content: `<div data-cart-content>${renderCartLoadingState()}</div>`
  });

  bindCartPage();

  try {
    productsCatalog = await getProducts();
    document.title = "Giỏ hàng | Sillage";
    renderCartPage();
    unsubscribeCartUpdates = subscribeToCartUpdates((state) => {
      renderCartPage(state);
    });
  } catch (error) {
    document.title = "Giỏ hàng không khả dụng | Sillage";
    unsubscribeCartUpdates();
    renderContent(renderCartErrorState());
    console.error(error);
  }
}

initCartPage();
