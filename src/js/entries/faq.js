import { Collapse } from "bootstrap";
import { getFaq, getSite } from "../core/data-store.js";
import { mountPageShell } from "../core/page-shell.js";
import { renderContactView } from "../render/contact-view.js";
import { renderFaqView } from "../render/faq-view.js";

function renderFaqErrorState() {
  return `
    <section class="sl-section">
      <div class="container">
        <div class="sl-empty-state">
          <div class="sl-empty-state__content sl-stack">
            <p class="sl-label sl-muted">Liên hệ tổng tạm thời không khả dụng</p>
            <h2>Trang hỗ trợ đang được cập nhật dữ liệu.</h2>
            <p class="sl-section-summary">
              Hãy thử tải lại trang sau ít phút, hoặc quay lại cửa hàng để tiếp tục chọn mùi hương trong lúc chờ.
            </p>
            <div class="sl-link-row">
              <a class="btn btn-primary" href="mailto:minhnq@gdscptit.dev">Gửi email chăm sóc khách hàng</a>
              <a class="btn btn-secondary" href="cua-hang.html">Mở cửa hàng</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function bindFaqAccordions() {
  document.querySelectorAll(".sl-faq-accordion").forEach((accordionRoot) => {
    accordionRoot.querySelectorAll(".accordion-collapse").forEach((collapseNode) => {
      Collapse.getOrCreateInstance(collapseNode, {
        parent: accordionRoot,
        toggle: false
      });
    });

    accordionRoot.querySelectorAll("[data-faq-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        const targetSelector = button.getAttribute("data-bs-target");

        if (!targetSelector) {
          return;
        }

        const collapseNode = accordionRoot.querySelector(targetSelector);

        if (!(collapseNode instanceof HTMLElement)) {
          return;
        }

        Collapse.getOrCreateInstance(collapseNode, {
          parent: accordionRoot,
          toggle: false
        }).toggle();
      });
    });
  });
}

async function initFaqPage() {
  try {
    const [faq, site] = await Promise.all([getFaq(), getSite()]);

    mountPageShell({
      currentPage: "faq",
      eyebrow: "Liên hệ tổng",
      title: "Liên hệ, hỗ trợ đơn hàng và câu hỏi thường gặp trong một trang duy nhất.",
      summary:
        "Xem kênh chăm sóc khách hàng, phạm vi hỗ trợ và toàn bộ câu trả lời về giao hàng, Bộ Khám Phá, đổi trả và thanh toán tại cùng một nơi.",
      content: `
        ${renderContactView({ site, sectionId: "lien-he-tong" })}
        ${renderFaqView({ faqGroups: faq.groups ?? [], showContactCta: false })}
      `
    });
    bindFaqAccordions();
  } catch (error) {
    mountPageShell({
      currentPage: "faq",
      eyebrow: "Liên hệ tổng",
      title: "Liên hệ, hỗ trợ đơn hàng và câu hỏi thường gặp trong một trang duy nhất.",
      summary:
        "Xem kênh chăm sóc khách hàng, phạm vi hỗ trợ và toàn bộ câu trả lời về giao hàng, Bộ Khám Phá, đổi trả và thanh toán tại cùng một nơi.",
      content: renderFaqErrorState()
    });
    console.error(error);
  }

  document.title = "Liên hệ tổng | Sillage";
}

initFaqPage();
