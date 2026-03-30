import { addCartItem } from "../core/cart-store.js";
import { getProducts } from "../core/data-store.js";
import { mountPageShell } from "../core/page-shell.js";
import {
  getDefaultProductSize,
  getProductBySlug,
  getProductSizes,
  getProductType,
  getRelatedProducts
} from "../core/product-service.js";
import {
  formatProductPrice,
  renderInvalidProductState,
  renderProductDetail,
  renderProductLoadingState
} from "../render/product-detail.js";
import { renderRelatedProducts } from "../render/related-products.js";

function getSlug() {
  return new URLSearchParams(window.location.search).get("san-pham");
}

function getContentMount() {
  return document.querySelector("[data-product-content]");
}

function renderContent(markup) {
  const mount = getContentMount();

  if (!mount) {
    throw new Error("Missing product content mount.");
  }

  mount.innerHTML = markup;
}

function getActiveSizeInput(root) {
  return root.querySelector("[data-size-option]:checked");
}

function syncSelectedSize(root, sizesById, input) {
  const priceNode = root.querySelector("[data-product-price]");
  const addButton = root.querySelector("[data-add-to-cart]");
  const allInputs = root.querySelectorAll("[data-size-option]");
  const selectedSize = input instanceof HTMLInputElement ? sizesById.get(input.value) ?? null : null;

  allInputs.forEach((sizeInput) => {
    const isActive = sizeInput === input;
    sizeInput.checked = isActive;
    sizeInput.closest(".sl-product-detail__size")?.classList.toggle("is-active", isActive);
  });

  if (!selectedSize) {
    return;
  }

  if (priceNode) {
    priceNode.textContent = formatProductPrice(selectedSize.price);
  }

  if (addButton) {
    addButton.setAttribute("data-size-id", selectedSize.id);
    addButton.setAttribute("data-size-label", selectedSize.label);
    addButton.setAttribute("data-size-price", String(selectedSize.price));
  }
}

function bindSizeSelection(root, sizesById) {
  root.querySelectorAll("[data-size-option]").forEach((input) => {
    input.addEventListener("change", () => {
      syncSelectedSize(root, sizesById, input);
    });
  });
}

function bindQuantity(root) {
  const input = root.querySelector("[data-quantity-input]");

  if (!(input instanceof HTMLInputElement)) {
    return;
  }

  root.querySelectorAll("[data-quantity-step]").forEach((button) => {
    button.addEventListener("click", () => {
      const step = Number.parseInt(button.getAttribute("data-quantity-step") ?? "0", 10);
      const currentValue = Number.parseInt(input.value, 10) || 1;
      const nextValue = Math.min(12, Math.max(1, currentValue + step));

      input.value = String(nextValue);
    });
  });
}

function showAddToCartFeedback(button, statusNode, message) {
  if (!(button instanceof HTMLButtonElement) || !(statusNode instanceof HTMLElement)) {
    return;
  }

  const originalLabel = button.dataset.defaultLabel ?? button.textContent ?? "Thêm vào giỏ";

  button.dataset.defaultLabel = originalLabel;
  statusNode.textContent = message;
  button.classList.add("is-added");
  button.textContent = "Đã thêm ✓";

  if (button.dataset.feedbackTimeoutId) {
    window.clearTimeout(Number(button.dataset.feedbackTimeoutId));
  }

  const timeoutId = window.setTimeout(() => {
    button.classList.remove("is-added");
    button.textContent = button.dataset.defaultLabel ?? "Thêm vào giỏ";
    delete button.dataset.feedbackTimeoutId;
  }, 1600);

  button.dataset.feedbackTimeoutId = String(timeoutId);
}

function bindAddToCart(root, product, sizesById, fallbackSize) {
  const addButton = root.querySelector("[data-add-to-cart]");
  const quantityInput = root.querySelector("[data-quantity-input]");
  const statusNode = root.querySelector("[data-cart-status]");

  if (!(addButton instanceof HTMLButtonElement) || !(quantityInput instanceof HTMLInputElement) || !statusNode) {
    return;
  }

  addButton.addEventListener("click", () => {
    const activeSizeInput = getActiveSizeInput(root);
    const selectedSize =
      (activeSizeInput instanceof HTMLInputElement ? sizesById.get(activeSizeInput.value) : null) ?? fallbackSize;

    if (!selectedSize) {
      return;
    }

    const quantity = Math.max(1, Number.parseInt(quantityInput.value, 10) || 1);

    addCartItem({
      productId: product.id,
      sizeId: selectedSize.id,
      quantity,
      unitPrice: selectedSize.price
    });

    showAddToCartFeedback(
      addButton,
      statusNode,
      `Đã thêm ${quantity} × ${product.name}${selectedSize.id !== "default" && selectedSize.label ? ` (${selectedSize.label})` : ""} vào giỏ hàng.`
    );
  });
}

function bindProductPage(product) {
  const root = document.querySelector("[data-product-root]");

  if (!root) {
    return;
  }

  const sizes = getProductSizes(product);
  const defaultSize = getDefaultProductSize(product) ?? sizes[0] ?? null;
  const sizesById = new Map(sizes.map((size) => [size.id, size]));
  bindSizeSelection(root, sizesById);
  const activeSizeInput = getActiveSizeInput(root) ?? root.querySelector("[data-size-option]");

  if (activeSizeInput instanceof HTMLInputElement) {
    syncSelectedSize(root, sizesById, activeSizeInput);
  }

  bindQuantity(root);
  bindAddToCart(root, product, sizesById, defaultSize);
}

async function initProductPage() {
  mountPageShell({
    currentPage: "product",
    eyebrow: "Sản phẩm",
    title: "Đang tải chi tiết mùi hương",
    summary: "Chuẩn bị hồ sơ sản phẩm, nốt hương, dung tích và các gợi ý liên quan.",
    includePageIntro: false,
    content: `<div data-product-content>${renderProductLoadingState()}</div>`
  });

  const slug = getSlug();

  try {
    const products = await getProducts();

    if (!slug) {
      document.title = "Không tìm thấy sản phẩm | Sillage";
      renderContent(renderInvalidProductState());
      return;
    }

    const product = getProductBySlug(products, slug);

    if (!product) {
      document.title = "Không tìm thấy sản phẩm | Sillage";
      renderContent(renderInvalidProductState());
      return;
    }

    if (getProductType(product) === "discovery-set") {
      window.location.replace("bo-kham-pha.html");
      return;
    }

    const relatedProducts = getRelatedProducts(products, product, 3);

    document.title = `${product.name} | Sillage`;
    renderContent(`${renderProductDetail(product)}${renderRelatedProducts(relatedProducts)}`);
    bindProductPage(product);
  } catch (error) {
    document.title = "Sản phẩm không khả dụng | Sillage";
    renderContent(renderInvalidProductState());
    console.error(error);
  }
}

initProductPage();
