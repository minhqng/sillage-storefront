import { renderProductCard } from "./product-card.js";

export function renderRelatedProducts(products) {
  if (products.length === 0) {
    return "";
  }

  return `
    <section class="sl-section sl-section--compact sl-divider-top">
      <div class="container sl-stack sl-stack--loose">
        <div class="sl-section-head">
          <p class="sl-label sl-muted">Gợi ý gần với lựa chọn này</p>
          <h2>Tiếp tục trong cùng một chất liệu hoặc tâm trạng mùi hương.</h2>
          <p class="sl-section-summary">
            Các gợi ý được lấy từ nhóm hương gần nhất trước, sau đó mở rộng theo mùa và dịp sử dụng để bước tiếp theo
            vẫn giữ được sự mạch lạc.
          </p>
        </div>
        <div class="sl-product-grid">
          ${products.map((product) => renderProductCard(product)).join("")}
        </div>
      </div>
    </section>
  `;
}
