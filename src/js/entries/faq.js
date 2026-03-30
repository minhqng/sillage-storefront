import { getFaq } from "../core/data-store.js";
import { mountPageShell } from "../core/page-shell.js";
import { renderFaqView } from "../render/faq-view.js";

function renderFaqErrorState() {
  return `
    <section class="sl-section">
      <div class="container">
        <div class="sl-empty-state">
          <div class="sl-empty-state__content sl-stack">
            <p class="sl-label sl-muted">Hỏi đáp tạm thời không khả dụng</p>
            <h2>Thông tin hỗ trợ đang được cập nhật.</h2>
            <p class="sl-section-summary">
              Hãy liên hệ trực tiếp đội ngũ chăm sóc khách hàng, hoặc quay lại cửa hàng để tiếp tục chọn mùi hương.
            </p>
            <div class="sl-link-row">
              <a class="btn btn-primary" href="lien-he.html">Liên hệ chăm sóc khách hàng</a>
              <a class="btn btn-secondary" href="cua-hang.html">Mở cửa hàng</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

async function initFaqPage() {
  try {
    const faq = await getFaq();

    mountPageShell({
      currentPage: "faq",
      eyebrow: "Câu hỏi thường gặp",
      title: "Giao hàng, Bộ Khám Phá, đổi trả và thanh toán, tất cả trong một nơi.",
      summary:
        "Tìm chi tiết thực tế về thời gian xử lý đơn, trải nghiệm bộ thử, đổi trả chai chưa mở và các bước từ giỏ hàng đến xác nhận đơn.",
      content: renderFaqView({
        faqGroups: faq.groups ?? []
      })
    });
  } catch (error) {
    mountPageShell({
      currentPage: "faq",
      eyebrow: "Câu hỏi thường gặp",
      title: "Giao hàng, Bộ Khám Phá, đổi trả và thanh toán, tất cả trong một nơi.",
      summary:
        "Tìm chi tiết thực tế về thời gian xử lý đơn, trải nghiệm bộ thử, đổi trả chai chưa mở và các bước từ giỏ hàng đến xác nhận đơn.",
      content: renderFaqErrorState()
    });
    console.error(error);
  }

  document.title = "Câu hỏi thường gặp | Sillage";
}

initFaqPage();
