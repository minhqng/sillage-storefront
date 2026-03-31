import { formatFamilyLabel, getDiscoveryProduct, getFeaturedProducts, getProductHref } from "../core/product-service.js";
import { escapeHtml } from "../utils/escape-html.js";
import { formatPrice } from "../utils/format.js";
import { renderEditorialArtwork, renderProductArtwork } from "./media-art.js";

function renderFeaturedCard(product) {
  return `
    <article class="sl-home-product-card">
      <a class="sl-home-product-link" href="${getProductHref(product)}">
        <div class="sl-home-product-media">
          ${renderProductArtwork(product, {
            className: "sl-home-product-art",
            alt: `Chai nước hoa ${product.name}`,
            sizes: "(min-width: 1200px) 22vw, (min-width: 768px) 30vw, 100vw"
          })}
        </div>
        <div class="sl-home-product-body sl-stack sl-stack--tight">
          <div class="sl-home-product-meta">
            <p class="sl-label sl-muted">${escapeHtml(formatFamilyLabel(product.family))}</p>
            <p class="sl-home-product-price">${formatPrice(product.price)}</p>
          </div>
          <h3 class="sl-card-title">${escapeHtml(product.name)}</h3>
          <p class="sl-home-product-tagline">${escapeHtml(product.tagline)}</p>
        </div>
      </a>
    </article>
  `;
}

function renderHeroDecisionItem({ index, title, copy }) {
  return `
    <li class="sl-home-decision-item">
      <span class="sl-home-decision-index" aria-hidden="true">${index}</span>
      <div class="sl-stack sl-stack--tight">
        <p class="sl-home-decision-title">${title}</p>
        <p class="sl-home-decision-copy">${copy}</p>
      </div>
    </li>
  `;
}

function renderStoryPoint(point) {
  return `
    <article class="sl-home-story-point">
      <p class="sl-label sl-muted">${point.label}</p>
      <h3>${point.title}</h3>
      <p class="sl-card-copy">${point.copy}</p>
    </article>
  `;
}

function renderHeroMedia(product) {
  if (!product) {
    return "";
  }

  return `
    <div class="sl-home-hero-media sl-stack sl-stack--tight">
      <div class="sl-home-hero-visual">
        ${renderProductArtwork(product, {
          className: "sl-home-hero-artwork",
          imageClassName: "sl-home-hero-image",
          alt: `Chai nước hoa ${product.name}`,
          loading: "eager",
          sizes: "(min-width: 1200px) 22vw, (min-width: 992px) 28vw, 82vw"
        })}
      </div>
      <div class="sl-home-hero-media-copy sl-stack sl-stack--tight">
        <p class="sl-label sl-muted">Best seller hiện tại</p>
        <div class="sl-home-hero-media-meta">
          <p class="sl-home-hero-media-name">${escapeHtml(product.name)}</p>
          <p class="sl-home-hero-media-price">${formatPrice(product.price)}</p>
        </div>
        <p class="sl-card-copy">
          ${escapeHtml(product.tagline)} Một lựa chọn an toàn nếu bạn muốn vào thẳng chai full-size mà không cần so sánh quá nhiều.
        </p>
      </div>
    </div>
  `;
}

function renderEditorialBand() {
  return `
    <section class="sl-home-editorial-band" aria-label="Khoảnh khắc biên tập của nhà hương">
      <div class="sl-home-editorial-band__media">
        ${renderEditorialArtwork(
          "/images/editorial/hero-banner.png",
          "Bộ ba chai nước hoa trong ánh sáng studio ấm",
          "sl-home-editorial-band__art",
          "sl-home-editorial-band__image"
        )}
      </div>
      <div class="sl-home-editorial-band__overlay">
        <div class="container">
          <div class="sl-home-editorial-band__copy sl-stack sl-stack--tight">
            <p class="sl-label">Nhịp điệu biên tập</p>
            <h2>Ánh sáng, thủy tinh và khoảng lặng được giữ cùng một nhịp.</h2>
            <p class="sl-card-copy">
              Những bề mặt đá, gỗ và vải thô được chen vào giữa, một thương hiệu đang kể chuyện bằng hình ảnh thật.
            </p>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function renderHomeView({ products }) {
  const featuredProducts = getFeaturedProducts(products);
  const discoveryProduct = getDiscoveryProduct(products) ?? null;
  const heroProduct = featuredProducts.find((product) => product.bestSeller) ?? featuredProducts[0] ?? null;
  const heroDecisionPath = [
    {
      index: "01",
      title: "Chưa rõ gu: bắt đầu bằng Bộ Khám Phá.",
      copy: "Thử Bộ Khám Phá trước để chốt mùi an toàn."
    },
    {
      index: "02",
      title: "Đã rõ gu: vào thẳng chai full-size.",
      copy: "Vào trang chi tiết và chọn dung tích phù hợp."
    }
  ];
  const storyPoints = [
    {
      label: "01",
      title: "Khởi từ bầu không khí, không từ khẩu hiệu.",
      copy: "Ánh sáng, chất liệu và nhịp sống thành thị được chuyển thành cấu trúc mùi hương rõ và gọn."
    },
    {
      label: "02",
      title: "Biên tập để mặc lặp lại.",
      copy: "Nhà hương kiểm soát độ tỏa, giữ sự cân bằng và ưu tiên những chai bạn muốn quay lại sau nhiều ngày."
    },
    {
      label: "03",
      title: "Khám phá trước khi cam kết.",
      copy: "Vì vậy Sillage xây luồng mua hàng theo hướng thử trên da bằng Bộ Khám Phá trước khi chuyển sang chai lớn."
    }
  ];

  return `
    <section class="sl-section sl-section--hero sl-home-hero">
      <div class="container">
        <div class="sl-home-hero-grid">
          <div class="sl-home-hero-copy sl-stack sl-stack--loose">
            <div class="sl-stack">
              <p class="sl-label sl-muted">Nhà hương Sillage</p>
              <h1 class="sl-home-hero-title">Mùi hương tinh gọn cho dư vị còn lại sau khi bạn rời đi.</h1>
              <p class="sl-home-hero-summary">
                Sillage tạo mùi hương từ chất liệu và ánh sáng với cấu trúc tiết chế. Mỗi chai bám gần da, hợp khí hậu nóng ẩm và đủ rõ dấu ấn để dùng mỗi ngày.
              </p>
              <p class="sl-home-hero-origin-note">
                Sillage trong tiếng Pháp là dải hương còn lại sau khi người mặc rời đi.
              </p>
            </div>
            <div class="sl-home-hero-cta sl-stack sl-stack--tight">
              <div class="sl-link-row sl-home-hero-cta__row">
                <a class="btn btn-primary btn-primary--hero" href="cua-hang.html">Mở cửa hàng</a>
                <a class="btn btn-quiet" href="bo-kham-pha.html">Xem Bộ Khám Phá</a>
              </div>
              <a class="btn btn-quiet sl-home-hero-guide-link" href="bo-kham-pha.html#tu-van-chon-mui">Tư vấn chọn mùi</a>
            </div>
          </div>

          ${renderHeroMedia(heroProduct)}

          <aside class="sl-home-hero-panel sl-stack">
            <div class="sl-stack sl-stack--tight">
              <p class="sl-label sl-muted">Lộ trình mua hàng</p>
              <h2 class="sl-home-panel-title">Bắt đầu gọn hơn.</h2>
            </div>
            <ol class="sl-home-decision-list">
              ${heroDecisionPath.map((item) => renderHeroDecisionItem(item)).join("")}
            </ol>
            <div class="sl-home-hero-note">
              <p class="sl-label sl-muted">Hỗ trợ nhanh</p>
              <p class="sl-home-hero-note__text">
                Cần chốt quà tặng hoặc giao hàng?
              </p>
              <a class="btn btn-quiet sl-home-hero-note__link" href="cau-hoi-thuong-gap.html#lien-he-tong">Liên hệ</a>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <section class="sl-section sl-home-featured">
      <div class="container sl-stack sl-stack--loose">
        <div class="sl-section-head">
          <p class="sl-label sl-muted">Chai full-size</p>
          <h2>Những chai full-size nổi bật của nhà hương.</h2>
          <p class="sl-section-summary">
            Ba lựa chọn đại diện cho ba mood chủ đạo. Nếu đã thấy hợp gu, bạn có thể đi thẳng vào trang chi tiết để chốt nhanh.
          </p>
        </div>
        <div class="sl-home-product-grid">
          ${featuredProducts.map((product) => renderFeaturedCard(product)).join("")}
        </div>
      </div>
    </section>

    ${renderEditorialBand()}

    <section class="sl-section sl-section--surface sl-divider-top sl-home-trust">
      <div class="container">
        <div class="sl-home-trust-grid">
          <div class="sl-stack sl-stack--loose">
            <div class="sl-section-head">
              <p class="sl-label sl-muted">Bộ Khám Phá</p>
              <h2>Thử trên da trước khi cam kết với chai lớn.</h2>
              <p class="sl-section-summary">
                ${
                  discoveryProduct?.longDescription ??
                  "Bộ Khám Phá giúp toàn bộ dòng hương mở ra qua nhiều lần dùng, để quyết định cuối cùng trở nên tự nhiên hơn."
                }
              </p>
            </div>
            <div class="sl-link-row">
              <a class="btn btn-primary" href="bo-kham-pha.html">Khám phá bộ thử</a>
              <a class="btn btn-quiet" href="cua-hang.html">Xem chai full-size</a>
            </div>
          </div>

          <div class="sl-home-trust-card">
            <p class="sl-label sl-muted">Bộ này giải quyết điều gì</p>
            <div class="sl-home-trust-points">
              <article class="sl-home-trust-point">
                <h3>Bảy hướng mùi trong một bản chọn</h3>
                <p class="sl-card-copy">So sánh hổ phách, sung, diên vĩ, cỏ hương bài, cam khoáng, gỗ khói và hoa cam trong cùng một bộ.</p>
              </article>
              <article class="sl-home-trust-point">
                <h3>An toàn hơn khi mua quà</h3>
                <p class="sl-card-copy">Phù hợp khi người nhận có gu rõ nhưng bạn chưa chắc nên bắt đầu bằng chai nào.</p>
              </article>
              <article class="sl-home-trust-point">
                <h3>Dễ mang theo ngay từ đầu</h3>
                <p class="sl-card-copy">Đủ gọn cho túi đi làm, cuối tuần ngắn ngày và những lần thử mùi có chủ đích.</p>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="sl-section sl-home-story">
      <div class="container">
        <div class="sl-home-story-grid">
          <div class="sl-stack sl-stack--loose">
            <div class="sl-section-head">
              <p class="sl-label sl-muted">Vì sao nhà hương mang cảm giác này</p>
              <h2>Sillage tồn tại để biến bầu không khí thành mùi hương có thể mặc đi hằng ngày.</h2>
              <p class="sl-section-summary">
                Nhà hương bắt đầu từ một câu hỏi đơn giản: liệu ánh sáng, chất liệu và nhịp sống thành thị có thể được chuyển thành mùi hương rõ ràng, tiết chế và không phải phô trương hay không.
              </p>
              <p class="sl-card-copy sl-home-story-extra">
                Vì thế mỗi công thức đều được biên tập để mở rõ trên da, giữ cân bằng trong khí hậu nóng ẩm và dễ quay lại. Điều đó cũng là lý do Sillage ưu tiên thử trước bằng Bộ Khám Phá, rồi mới chuyển sang chai full-size khi mùi hương đã thực sự hợp với người mặc.
              </p>
            </div>
            <a class="btn btn-primary" href="bo-kham-pha.html">Bắt đầu với Bộ Khám Phá</a>
          </div>

          <div class="sl-home-story-points">
            ${storyPoints.map((point) => renderStoryPoint(point)).join("")}
          </div>
        </div>
      </div>
    </section>
  `;
}
