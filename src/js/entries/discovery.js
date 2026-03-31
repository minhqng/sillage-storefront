import { addCartItem } from "../core/cart-store.js";
import { getGuide, getProducts, getSite } from "../core/data-store.js";
import { mountPageShell } from "../core/page-shell.js";
import { getCatalogProducts, getDiscoveryProduct } from "../core/product-service.js";
import { renderDiscoveryView } from "../render/discovery-view.js";

function getIncludedProducts(products, discoveryProduct) {
  const productIds = Array.isArray(discoveryProduct?.includedProductIds)
    ? discoveryProduct.includedProductIds
    : getCatalogProducts(products).map((product) => product.id);

  return productIds
    .map((productId) => products.find((product) => product.id === productId))
    .filter(Boolean);
}

function bindDiscoveryActions(product) {
  const quantityInput = document.querySelector("[data-discovery-quantity]");
  const statusNode = document.querySelector("[data-discovery-status]");
  const addButton = document.querySelector("[data-discovery-add-to-cart]");

  if (!(quantityInput instanceof HTMLInputElement) || !(addButton instanceof HTMLButtonElement) || !statusNode) {
    return;
  }

  document.querySelectorAll("[data-discovery-step]").forEach((button) => {
    button.addEventListener("click", () => {
      const step = Number.parseInt(button.getAttribute("data-discovery-step") ?? "0", 10);
      const currentValue = Number.parseInt(quantityInput.value, 10) || 1;
      const nextValue = Math.min(12, Math.max(1, currentValue + step));
      quantityInput.value = String(nextValue);
    });
  });

  addButton.addEventListener("click", () => {
    const quantity = Math.max(1, Number.parseInt(quantityInput.value, 10) || 1);
    const sizeId = addButton.getAttribute("data-size-id") ?? "";
    const unitPrice = Number.parseFloat(addButton.getAttribute("data-size-price") ?? String(product.price));

    addCartItem({
      productId: product.id,
      sizeId,
      quantity,
      unitPrice
    });

    statusNode.textContent = `Đã thêm ${quantity} Bộ Khám Phá vào giỏ hàng.`;
  });
}

function renderDiscoveryErrorState() {
  return `
    <section class="sl-section">
      <div class="container">
        <div class="sl-empty-state">
          <div class="sl-empty-state__content sl-stack">
            <p class="sl-label sl-muted">Bộ Khám Phá tạm thời không khả dụng</p>
            <h2>Không thể mở bộ thử ở thời điểm này.</h2>
            <p class="sl-section-summary">
              Hãy quay lại cửa hàng để xem các chai full-size, hoặc thử lại sau ít phút để mở lại bản tuyển chọn này.
            </p>
            <div class="sl-link-row">
              <a class="btn btn-primary" href="cua-hang.html">Về cửa hàng</a>
              <a class="btn btn-secondary" href="index.html">Về trang chủ</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

async function initDiscoveryPage() {
  try {
    const [products, site, guide] = await Promise.all([getProducts(), getSite(), getGuide()]);
    const discoveryProduct = getDiscoveryProduct(products);

    if (!discoveryProduct) {
      throw new Error("Discovery set product is missing from the catalog.");
    }

    mountPageShell({
      currentPage: "discovery",
      eyebrow: "Bộ Khám Phá & Tư vấn chọn mùi",
      title: "Thử trên da, rồi chốt chai lớn trên cùng một hành trình rõ ràng.",
      summary:
        "Bắt đầu với bộ thử 7 × 2 ml, đọc tư vấn chọn mùi ngay trên trang này, rồi chuyển sang chai lớn khi hướng mùi đã thật sự rõ.",
      content: renderDiscoveryView({
        product: discoveryProduct,
        includedProducts: getIncludedProducts(products, discoveryProduct),
        site,
        guide
      })
    });

    document.title = "Bộ Khám Phá & Tư vấn chọn mùi | Sillage";
    bindDiscoveryActions(discoveryProduct);
  } catch (error) {
    mountPageShell({
      currentPage: "discovery",
      eyebrow: "Bộ Khám Phá & Tư vấn chọn mùi",
      title: "Thử trên da, rồi chốt chai lớn trên cùng một hành trình rõ ràng.",
      summary:
        "Bắt đầu với bộ thử 7 × 2 ml, đọc tư vấn chọn mùi ngay trên trang này, rồi chuyển sang chai lớn khi hướng mùi đã thật sự rõ.",
      content: renderDiscoveryErrorState()
    });
    document.title = "Bộ Khám Phá & Tư vấn chọn mùi | Sillage";
    console.error(error);
  }
}

initDiscoveryPage();
