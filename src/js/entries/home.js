import { getProducts } from "../core/data-store.js";
import { mountPageShell } from "../core/page-shell.js";
import { renderHomeView } from "../render/home-view.js";

function renderHomeErrorState() {
  return `
    <section class="sl-section">
      <div class="container">
        <div class="sl-empty-state">
          <div class="sl-empty-state__content sl-stack">
            <p class="sl-label sl-muted">Bộ sưu tập tạm thời không khả dụng</p>
            <h2>Bộ sưu tập đang được cập nhật.</h2>
            <p class="sl-section-summary">
              Hãy mở hướng dẫn mùi hương trong lúc chờ, hoặc quay lại sau ít phút để tiếp tục thu hẹp lựa chọn.
            </p>
            <div class="sl-link-row">
              <a class="btn btn-primary" href="cua-hang.html">Mở cửa hàng</a>
              <a class="btn btn-quiet" href="huong-dan-mui-huong.html">Đọc hướng dẫn mùi hương</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

async function initHomePage() {
  try {
    const products = await getProducts();

    mountPageShell({
      currentPage: "home",
      eyebrow: "Sillage",
      title: "Nhà hương hiện đại được biên tập bằng sự tiết chế.",
      summary:
        "Bắt đầu với những chai đặc trưng nhất, Bộ Khám Phá cho lần mua đầu tiên và ngôn ngữ sản phẩm được viết để giúp bạn chọn rõ hơn.",
      includePageIntro: false,
      content: renderHomeView({ products })
    });
  } catch (error) {
    mountPageShell({
      currentPage: "home",
      eyebrow: "Sillage",
      title: "Nhà hương hiện đại được biên tập bằng sự tiết chế.",
      summary:
        "Bắt đầu với những chai đặc trưng nhất, Bộ Khám Phá cho lần mua đầu tiên và ngôn ngữ sản phẩm được viết để giúp bạn chọn rõ hơn.",
      includePageIntro: false,
      content: renderHomeErrorState()
    });
    console.error(error);
  }
}

initHomePage();
