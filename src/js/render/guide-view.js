import { renderProductCard } from "./product-card.js";

function renderFamilyCard(family) {
  return `
    <article class="sl-guide-family-card">
      <div class="sl-stack sl-stack--tight">
        <p class="sl-label sl-muted">${family.label}</p>
        <h3>${family.title}</h3>
        <p class="sl-card-copy">${family.summary}</p>
      </div>
      <div class="sl-guide-family-meta">
        <div>
          <p class="sl-label sl-muted">Dấu hiệu nhận biết</p>
          <ul class="sl-guide-list">
            ${family.signals
              .map(
                (signal) => `
                  <li>${signal}</li>
                `
              )
              .join("")}
          </ul>
        </div>
        <div>
          <p class="sl-label sl-muted">Dịp dùng phù hợp</p>
          <ul class="sl-guide-list">
            ${family.wearMoments
              .map(
                (moment) => `
                  <li>${moment}</li>
                `
              )
              .join("")}
          </ul>
        </div>
      </div>
      <a class="btn btn-link sl-guide-family-link" href="cua-hang.html?nhom-huong=${encodeURIComponent(family.id)}">
        Xem nhóm hương này
      </a>
    </article>
  `;
}

function renderChoosingStep(step) {
  return `
    <article class="sl-guide-step">
      <p class="sl-label sl-muted">${step.label}</p>
      <h3>${step.title}</h3>
      <p class="sl-card-copy">${step.copy}</p>
    </article>
  `;
}

function renderGlossaryItem(item) {
  return `
    <article class="sl-guide-glossary-card">
      <p class="sl-label sl-muted">${item.term}</p>
      <p class="sl-card-copy">${item.description}</p>
    </article>
  `;
}

export function renderGuideView({ guide, recommendedProducts }) {
  return `
    <section class="sl-section sl-guide">
      <div class="container sl-stack sl-stack--loose">
        <section class="sl-guide-panel">
          <div class="sl-section-head">
            <p class="sl-label sl-muted">Chọn theo bầu không khí</p>
            <h2>Hãy bắt đầu từ cảm giác bạn muốn mang theo.</h2>
            <p class="sl-section-summary">
              Nước hoa Sillage dễ chọn hơn khi đi từ chất liệu, ánh sáng và dịp dùng thay vì phải ghi nhớ quá nhiều
              thuật ngữ. Hướng dẫn này giúp bạn thu hẹp lựa chọn trước, rồi xác nhận trên da sau.
            </p>
          </div>
          <div class="sl-guide-family-grid">
            ${guide.families.map((family) => renderFamilyCard(family)).join("")}
          </div>
        </section>

        <section class="sl-guide-panel">
          <div class="sl-section-head">
            <p class="sl-label sl-muted">Cách chọn</p>
            <h2>Giữ quyết định hẹp, rõ và dễ lặp lại.</h2>
            <p class="sl-section-summary">
              Mục tiêu không phải giải mã mọi nốt hương. Mục tiêu là tìm được chai khiến bạn muốn mặc lại một cách tự
              nhiên.
            </p>
          </div>
          <div class="sl-guide-step-grid">
            ${guide.howToChoose.map((step) => renderChoosingStep(step)).join("")}
          </div>
        </section>

        <section class="sl-guide-panel">
          <div class="sl-section-head">
            <p class="sl-label sl-muted">Giải thích cấu trúc hương</p>
            <h2>Đọc công thức theo cách đơn giản và hữu ích.</h2>
            <p class="sl-section-summary">
              Nốt hương chỉ có giá trị khi chúng giúp bạn hiểu mùi mở ra như thế nào, chứ không biến trang sản phẩm
              thành một bức tường kỹ thuật.
            </p>
          </div>
          <div class="sl-guide-glossary-grid">
            ${guide.noteGlossary.map((item) => renderGlossaryItem(item)).join("")}
          </div>
        </section>

        <section class="sl-guide-panel">
          <div class="sl-section-head">
            <p class="sl-label sl-muted">Gợi ý mở đầu</p>
            <h2>Bắt đầu với những chai giúp bạn hiểu nhanh bộ sưu tập.</h2>
            <p class="sl-section-summary">
              Các đề xuất này trải đều những hướng mùi chính để bạn chuyển từ trang hướng dẫn sang trang chi tiết sản
              phẩm mà không mất đà lựa chọn.
            </p>
          </div>
          <div class="sl-product-grid">
            ${recommendedProducts.map((product) => renderProductCard(product)).join("")}
          </div>
        </section>

        <section class="sl-guide-cta">
          <div class="sl-stack sl-stack--tight">
            <p class="sl-label sl-muted">Bước tiếp theo</p>
            <h2 class="sl-support-title">So sánh vài hướng mùi rồi xác nhận trên da.</h2>
            <p class="sl-card-copy">
              Dùng Bộ Khám Phá nếu bạn vẫn đang lưỡng lự, hoặc đi thẳng vào cửa hàng khi một nhóm hương đã thấy đúng.
            </p>
          </div>
          <div class="sl-link-row">
            <a class="btn btn-primary" href="cua-hang.html">Mở cửa hàng</a>
            <a class="btn btn-secondary" href="bo-kham-pha.html">Xem Bộ Khám Phá</a>
          </div>
        </section>
      </div>
    </section>
  `;
}
