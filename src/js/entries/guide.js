import { getGuide, getProducts } from "../core/data-store.js";
import { mountPageShell } from "../core/page-shell.js";
import { renderGuideView } from "../render/guide-view.js";

function getRecommendedProducts(products, guide) {
  const ids = guide.families.flatMap((family) => family.recommendedProductIds ?? []);
  const seen = new Set();

  return ids
    .map((id) => products.find((product) => product.id === id))
    .filter((product) => {
      if (!product || seen.has(product.id)) {
        return false;
      }

      seen.add(product.id);
      return true;
    });
}

function renderGuideErrorState() {
  return `
    <section class="sl-section">
      <div class="container">
        <div class="sl-empty-state">
          <div class="sl-empty-state__content sl-stack">
            <p class="sl-label sl-muted">Hướng dẫn tạm thời không khả dụng</p>
            <h2>Không thể mở hướng dẫn chọn mùi lúc này.</h2>
            <p class="sl-section-summary">
              Hãy vào thẳng cửa hàng, hoặc bắt đầu với Bộ Khám Phá nếu bạn muốn so sánh toàn bộ thư viện trên da.
            </p>
            <div class="sl-link-row">
              <a class="btn btn-primary" href="cua-hang.html">Mở cửa hàng</a>
              <a class="btn btn-secondary" href="bo-kham-pha.html">Xem Bộ Khám Phá</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

async function initGuidePage() {
  try {
    const [guide, products] = await Promise.all([getGuide(), getProducts()]);

    mountPageShell({
      currentPage: "guide",
      eyebrow: "Hướng dẫn mùi hương",
      title: "Chọn mùi hương theo bầu không khí, không theo sự ồn ào.",
      summary:
        "Đi từ tâm trạng và chất liệu tới những chai phù hợp nhất, rồi xác nhận trên da qua Bộ Khám Phá hoặc trải nghiệm trực tiếp.",
      content: renderGuideView({
        guide,
        recommendedProducts: getRecommendedProducts(products, guide)
      })
    });
  } catch (error) {
    mountPageShell({
      currentPage: "guide",
      eyebrow: "Hướng dẫn mùi hương",
      title: "Chọn mùi hương theo bầu không khí, không theo sự ồn ào.",
      summary:
        "Đi từ tâm trạng và chất liệu tới những chai phù hợp nhất, rồi xác nhận trên da qua Bộ Khám Phá hoặc trải nghiệm trực tiếp.",
      content: renderGuideErrorState()
    });
    console.error(error);
  }

  document.title = "Hướng dẫn mùi hương | Sillage";
}

initGuidePage();
