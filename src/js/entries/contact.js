import { getSite } from "../core/data-store.js";
import { mountPageShell } from "../core/page-shell.js";
import { renderContactView } from "../render/contact-view.js";

function renderContactErrorState() {
  return `
    <section class="sl-section">
      <div class="container">
        <div class="sl-empty-state">
          <div class="sl-empty-state__content sl-stack">
            <p class="sl-label sl-muted">Liên hệ tạm thời không khả dụng</p>
            <h2>Không thể mở trang chăm sóc khách hàng lúc này.</h2>
            <p class="sl-section-summary">
              Hãy xem mục Hỏi đáp để nhận hướng dẫn nhanh, hoặc tiếp tục khám phá bộ sưu tập trong lúc chờ.
            </p>
            <div class="sl-link-row">
              <a class="btn btn-primary" href="cau-hoi-thuong-gap.html">Xem Hỏi đáp</a>
              <a class="btn btn-secondary" href="cua-hang.html">Mở cửa hàng</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

async function initContactPage() {
  try {
    const site = await getSite();

    mountPageShell({
      currentPage: "contact",
      eyebrow: "Liên hệ",
      title: "Chăm sóc khách hàng cho đơn hàng, quà tặng và tư vấn chọn mùi.",
      summary:
        "Liên hệ Sillage về thời gian giao hàng, hỗ trợ quà tặng, gợi ý Bộ Khám Phá và các câu hỏi trực tiếp trước hoặc sau khi đặt hàng.",
      content: renderContactView({ site })
    });
  } catch (error) {
    mountPageShell({
      currentPage: "contact",
      eyebrow: "Liên hệ",
      title: "Chăm sóc khách hàng cho đơn hàng, quà tặng và tư vấn chọn mùi.",
      summary:
        "Liên hệ Sillage về thời gian giao hàng, hỗ trợ quà tặng, gợi ý Bộ Khám Phá và các câu hỏi trực tiếp trước hoặc sau khi đặt hàng.",
      content: renderContactErrorState()
    });
    console.error(error);
  }

  document.title = "Liên hệ | Sillage";
}

initContactPage();
