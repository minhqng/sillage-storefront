import { renderEmptyState } from "./empty-state.js";
import { renderProductCard } from "./product-card.js";

export function renderProductGrid(products) {
  if (products.length === 0) {
    return renderEmptyState({
      title: "Chưa có mùi hương nào khớp lựa chọn này.",
      copy: "Hãy đổi nhóm hương, dịp sử dụng hoặc quay lại toàn bộ bộ sưu tập để so sánh rộng hơn."
    });
  }

  return `
    <div class="sl-product-grid">
      ${products.map((product) => renderProductCard(product, { allowQuickAdd: true })).join("")}
    </div>
  `;
}
