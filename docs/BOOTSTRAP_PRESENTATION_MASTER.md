# 1. Mở đầu

Tài liệu này phân tích đúng codebase `sillage-storefront` hiện tại, không viết theo kiểu tutorial Bootstrap chung chung. Mục tiêu là giải thích Bootstrap trong project như một kiến trúc có chủ đích: từ cách đưa framework vào Vite, cách theme lại bằng design tokens, đến từng điểm sử dụng cụ thể trên từng trang.

Project là một storefront ecommerce tĩnh, đa trang, viết bằng Vite + Bootstrap 5.3.8 + vanilla JavaScript ES modules + JSON data + `localStorage`. Về mặt kiến trúc frontend, Bootstrap không được dùng như một UI kit mặc định. Repo này dùng Bootstrap theo mô hình:

- Bootstrap làm lớp nền CSS và behavior engine cho một số component tương tác.
- Design system `Sillage` mới là lớp quyết định visual identity.
- Nội bộ project “design system hóa Bootstrap” mạnh hơn là “Bootstrap hóa design system”.

Nhận định tổng quát sau khi rà toàn repo:

- Bootstrap được dùng thật ở 4 tầng: dependency/build, CSS foundation, JS component behavior, utility/layout cơ bản.
- Các component Bootstrap thực sự có runtime behavior là `Collapse`, `Carousel`, `Offcanvas`, `Toast`.
- Các cấu trúc markup Bootstrap được dùng rõ nhất là `navbar`, `card`, `form-*`, `accordion`, `carousel`, `offcanvas`, `toast`, `btn`, `container`.
- Grid `row` / `col-*` của Bootstrap gần như không được dùng trong runtime markup; layout thực tế của site chủ yếu dùng custom CSS Grid/Flexbox.
- Nhiều dấu vết Bootstrap trong `bootstrap-overrides.css` là lớp chuẩn bị sẵn cho tương lai như `dropdown`, `modal`, `pagination`, `badge`, `input-group-text`, nhưng hiện chưa có runtime usage tương ứng.

Ghi chú phương pháp:

- Mọi nhận định trong tài liệu đều đối chiếu được từ source hiện tại.
- Mọi chỗ “không dùng” đều đã kiểm tra qua dependency, markup, `data-bs-*`, import JS từ `"bootstrap"`, selector CSS và runtime render files.
- Tài liệu luôn phân biệt rõ 4 thứ: class Bootstrap thật, class custom `sl-*`, Bootstrap JS API, và custom JS của project.

# 2. Bản đồ kiểm kê Bootstrap toàn repo

Quy ước đọc bảng:

- `Loại sử dụng`: `Trực tiếp` là file gọi thẳng Bootstrap CSS/JS/class/variable. `Gián tiếp` là file nằm trong flow runtime của Bootstrap nhưng không tự import API.
- `Mức độ custom hóa`: `Thấp`, `Trung bình`, `Cao`, `Rất cao`.
- `Có cần demo`: `Có` nghĩa là nên nói và thao tác trực tiếp khi thuyết trình. `Chỉ nhắc` nghĩa là nên nhắc ngắn để nối mạch kiến trúc.

| File path | Loại sử dụng | Bootstrap feature cụ thể | Vai trò trong website | Mức độ custom hóa | Có cần demo khi thuyết trình không |
| --- | --- | --- | --- | --- | --- |
| `package.json` | Trực tiếp | Dependency `bootstrap: 5.3.8` | Cài Bootstrap cho CSS và JS ESM qua Vite | Thấp | Có |
| `package-lock.json` | Trực tiếp | Lock đúng version `5.3.8` | Giữ ổn định version Bootstrap khi cài trên máy khác | Thấp | Không |
| `index.html` | Gián tiếp | Nạp `main.css` và entry `home.js` | Điểm vào trang chủ, nơi Carousel và card được mount | Trung bình | Có |
| `cua-hang.html` | Gián tiếp | Nạp `main.css` và entry `shop.js` | Điểm vào trang cửa hàng có Offcanvas, Toast, form controls | Trung bình | Có |
| `chi-tiet-san-pham.html` | Gián tiếp | Nạp `main.css` và entry `product.js` | Điểm vào product detail dùng shared button/container system | Trung bình | Có |
| `gio-hang.html` | Gián tiếp | Nạp `main.css` và entry `cart.js` | Điểm vào cart dùng shared button/container system | Trung bình | Có |
| `thanh-toan.html` | Gián tiếp | Nạp `main.css` và entry `checkout.js` | Điểm vào checkout dùng form classes và validation pattern | Trung bình | Có |
| `cau-hoi-thuong-gap.html` | Gián tiếp | Nạp `main.css` và entry `faq.js` | Điểm vào FAQ/Contact hub có Accordion/Collapse | Trung bình | Có |
| `bo-kham-pha.html` | Gián tiếp | Nạp `main.css` và entry `discovery.js` | Điểm vào Discovery page dùng shared button/link system | Trung bình | Có |
| `lien-he.html` | Gián tiếp | `container` + import `main.css` trong trang redirect | Route cũ vẫn giữ layer Bootstrap base để không vỡ style | Trung bình | Không |
| `huong-dan-mui-huong.html` | Gián tiếp | `container` + import `main.css` trong trang redirect | Route cũ vẫn giữ layer Bootstrap base để không vỡ style | Trung bình | Không |
| `src/styles/tokens.css` | Gián tiếp | Nguồn `--sl-*` để map sang `--bs-*` | Design token layer cấp màu, type, radius, spacing cho toàn bộ Bootstrap override | Rất cao | Có |
| `src/styles/main.css` | Trực tiếp | `@import "bootstrap/dist/css/bootstrap.min.css"`; override `.container` và `--bs-gutter-x` | Điểm hợp nhất CSS theo thứ tự `tokens -> Bootstrap -> overrides -> custom layers` | Rất cao | Có |
| `src/styles/bootstrap-overrides.css` | Trực tiếp | Remap `--bs-*`; restyle `.btn`, `.navbar`, `.form-*`, `.card`, `.accordion`, `.offcanvas`, `.page-link`, `.badge` | Triệt tiêu giao diện Bootstrap mặc định và đưa design system vào lõi framework | Rất cao | Có |
| `src/styles/utilities.css` | Gián tiếp | Layer custom sau Bootstrap, không thêm class Bootstrap mới | Cung cấp `sl-stack`, `sl-link-row`, `sl-panel` thay cho grid utility của Bootstrap | Rất cao | Có |
| `src/styles/components/header.css` | Trực tiếp | Tinh chỉnh `navbar`, `nav-link`, collapse panel mobile | Biến navbar Bootstrap thành header premium sticky, responsive | Rất cao | Có |
| `src/styles/components/footer.css` | Trực tiếp | Override `.form-control`, `.btn-primary` trong newsletter | Theme lại form/button Bootstrap trong footer tối màu | Cao | Có |
| `src/styles/components/zalo-widget.css` | Gián tiếp | Không target selector Bootstrap, nhưng widget chứa CTA `btn btn-primary` | Panel chat hỗ trợ nhanh dựa trên button system chung | Trung bình | Chỉ nhắc |
| `src/styles/components/forms.css` | Trực tiếp | Target `.form-control`, `.form-select`, `.form-check`, `.invalid-feedback` | Shared form spacing và presentation cho checkout | Cao | Có |
| `src/styles/components/home.css` | Trực tiếp | Theme `carousel-*`; tune `.card-body`; style control/indicator | Tạo visual riêng cho Home Carousel và featured cards | Rất cao | Có |
| `src/styles/components/product-card.css` | Trực tiếp | Theme `.card`, `.card-body`, `.card-footer`, `.btn` | Biến Bootstrap card thành product card premium và quick-add card | Rất cao | Có |
| `src/styles/components/product-detail.css` | Gián tiếp | Không target selector Bootstrap trực tiếp | Bọc page product detail dùng shared `.btn` variants từ Bootstrap layer | Trung bình | Chỉ nhắc |
| `src/styles/components/shop.css` | Trực tiếp | `--bs-offcanvas-width`; theme `.toast`, `.btn-close` | Giao diện riêng cho filter Offcanvas và quick-add Toast | Rất cao | Có |
| `src/styles/components/cart.css` | Gián tiếp | Không target selector Bootstrap trực tiếp | Bọc cart page dùng `btn-link`, `btn-primary`, `btn-quiet` từ layer Bootstrap đã theme | Trung bình | Chỉ nhắc |
| `src/styles/components/checkout.css` | Trực tiếp | Target `.form-check-input`, `.invalid-feedback`, `.was-validated` states | Visual riêng cho checkout form, radio shipping, validation states | Cao | Có |
| `src/styles/components/support-pages.css` | Trực tiếp | `--bs-accordion-*`; target `.accordion-*` | Theme lại FAQ Accordion và support panels | Rất cao | Có |
| `src/js/core/page-shell.js` | Gián tiếp | Adapter vào `mountAppShell` | Nối mọi page entry vào shared shell chứa header/footer Bootstrap layer | Thấp | Chỉ nhắc |
| `src/js/core/app-shell.js` | Trực tiếp | `Collapse` API; `visually-hidden`; footer form/button context | Điều khiển mobile nav Collapse, cart badge, newsletter form, Zalo CTA | Cao | Có |
| `src/js/core/checkout-service.js` | Trực tiếp | Validation flow gắn với `.was-validated`, `.invalid-feedback`, `aria-errormessage` | Làm logic cho Bootstrap validation pattern trên checkout | Cao | Có |
| `src/js/entries/home.js` | Trực tiếp | `Carousel.getOrCreateInstance(...)` | Khởi tạo Home Carousel với config không autoplay | Cao | Có |
| `src/js/entries/shop.js` | Trực tiếp | `Offcanvas.getOrCreateInstance(...)`, `Toast.getOrCreateInstance(...)` | Khởi tạo filter panel và thông báo thêm giỏ | Cao | Có |
| `src/js/entries/faq.js` | Trực tiếp | `Collapse.getOrCreateInstance(...)` | Khởi tạo và toggle FAQ accordion theo nhóm | Cao | Có |
| `src/js/entries/checkout.js` | Trực tiếp | `.needs-validation` / thêm `.was-validated` | Kích hoạt Bootstrap validation state khi submit checkout | Cao | Có |
| `src/js/entries/product.js` | Gián tiếp | Không import Bootstrap JS | Trang product dùng shared `btn` system, nhưng quantity/size selector là custom | Trung bình | Chỉ nhắc |
| `src/js/entries/cart.js` | Gián tiếp | Không import Bootstrap JS | Trang cart dùng shared button system qua renderer | Trung bình | Chỉ nhắc |
| `src/js/entries/discovery.js` | Gián tiếp | Không import Bootstrap JS | Trang Discovery dùng shared button system qua renderer | Trung bình | Chỉ nhắc |
| `src/js/entries/contact.js` | Gián tiếp | Redirect page, không có Bootstrap runtime riêng | Giữ route cũ | Thấp | Không |
| `src/js/entries/guide.js` | Gián tiếp | Redirect page, không có Bootstrap runtime riêng | Giữ route cũ | Thấp | Không |
| `src/js/render/header.js` | Trực tiếp | `navbar`, `navbar-expand-lg`, `navbar-toggler`, `navbar-toggler-icon`, `collapse navbar-collapse`, `navbar-nav`, `nav-item`, `nav-link`, `ms-auto`, `mb-0`, `ms-lg-4` | Markup gốc của shared navigation | Cao | Có |
| `src/js/render/footer.js` | Trực tiếp | `container`, `form-control`, `btn btn-primary`, `visually-hidden` | Markup footer newsletter và shared footer shell | Cao | Có |
| `src/js/render/page-intro.js` | Trực tiếp | `container` | Shared page intro wrapper cho các page không phải Home | Trung bình | Chỉ nhắc |
| `src/js/render/home-view.js` | Trực tiếp | `card`, `card-body`, `carousel`, `carousel-item`, `carousel-indicators`, `carousel-inner`, `carousel-control-prev/next`, `visually-hidden`, `btn` variants | Markup featured cards và Home Carousel | Rất cao | Có |
| `src/js/render/shop-view.js` | Trực tiếp | `form-label`, `form-select`, `offcanvas`, `offcanvas-end`, `offcanvas-header`, `offcanvas-title`, `offcanvas-body`, `btn-close`, `toast`, `toast-header`, `toast-body`, `border-0`, `me-auto` | Markup filters, Offcanvas và Toast ở Shop | Rất cao | Có |
| `src/js/render/faq-view.js` | Trực tiếp | `accordion`, `accordion-item`, `accordion-header`, `accordion-button`, `accordion-collapse collapse`, `accordion-body`, `data-bs-parent` | Markup FAQ Accordion | Rất cao | Có |
| `src/js/render/product-card.js` | Trực tiếp | `card`, `card-body`, `card-footer`, `btn btn-secondary` | Product card dùng lại ở Shop/Home/Related | Rất cao | Có |
| `src/js/render/product-grid.js` | Gián tiếp | Tái sử dụng product card Bootstrap-structured | Grid listing sản phẩm | Trung bình | Chỉ nhắc |
| `src/js/render/product-detail.js` | Trực tiếp | `container`, `btn btn-primary`, `btn btn-quiet` | CTA và action vùng mua của trang chi tiết | Cao | Có |
| `src/js/render/related-products.js` | Gián tiếp | `container` + reuse product card | Khối related products | Trung bình | Chỉ nhắc |
| `src/js/render/cart-view.js` | Trực tiếp | `container`, `btn btn-link`, `btn btn-primary`, `btn btn-quiet` | Actions và CTA của trang cart | Cao | Có |
| `src/js/render/checkout-view.js` | Trực tiếp | `form-label`, `form-control`, `form-check-input`, `form-check-label`, `invalid-feedback`, `needs-validation`, `btn btn-primary` | Markup checkout form, radio shipping, checkbox, submit summary | Cao | Có |
| `src/js/render/contact-view.js` | Trực tiếp | `container`, `btn btn-primary`, `btn btn-secondary` | Support CTA trong contact hub | Trung bình | Chỉ nhắc |
| `src/js/render/discovery-view.js` | Trực tiếp | `container`, `btn btn-link`, `btn btn-primary`, `btn btn-secondary` | CTA và guide links ở Discovery page | Trung bình | Có |
| `src/js/render/empty-state.js` | Trực tiếp | `btn btn-primary`, `btn btn-secondary` | Empty-state pattern dùng lại ở Shop | Trung bình | Chỉ nhắc |
| `src/js/render/guide-view.js` | Gián tiếp | `container`, `btn btn-link`, `btn btn-primary`, `btn btn-secondary`, reuse product card | Renderer cũ của guide; hiện không còn được mount bởi entry page hiện tại | Trung bình | Không |

Kết luận inventory:

- Runtime Bootstrap mạnh nhất tập trung ở `header`, `home`, `shop`, `checkout`, `faq`.
- Bootstrap JS chỉ được import ở 4 nơi: `app-shell.js`, `home.js`, `shop.js`, `faq.js`.
- Bootstrap CSS xuất hiện toàn cục qua `main.css`, sau đó bị theme lại rất mạnh bởi `bootstrap-overrides.css` và các file component CSS.
- Nhiều page còn lại dùng Bootstrap theo kiểu shared structure: `container`, `btn`, `form-control`.

# 3. Cách kể chuyện thuyết trình tối ưu

Đây là flow nên dùng khi thuyết trình với giảng viên để người nghe đi từ nền móng tới runtime thực tế mà không bị rời rạc:

1. Mở từ kiến trúc tổng thể.
Nói rõ đây là website tĩnh đa trang, dùng Vite + Bootstrap 5.3.8 + vanilla JS, và Bootstrap đóng vai trò nền tảng chứ không phải giao diện mặc định.

2. Chứng minh Bootstrap được đưa vào project như thế nào.
Mở `package.json`, rồi sang `src/styles/main.css`, chỉ ra `@import "bootstrap/dist/css/bootstrap.min.css"` và các entry JS import từ `"bootstrap"`.

3. Giải thích chiến lược theme.
Mở `tokens.css` trước, rồi `bootstrap-overrides.css`, nhấn mạnh repo remap `--bs-*` sang `--sl-*` để Bootstrap dùng màu, font, radius của brand Sillage.

4. Đi vào shared shell trước khi đi vào từng trang.
Cho xem `renderHeader`, `app-shell`, `renderFooter`, `page-intro`. Ở đây người nghe sẽ hiểu `container`, `navbar`, `collapse`, `btn`, `form-control`, `visually-hidden` được dùng lặp lại toàn site ra sao.

5. Sau shared shell, đi theo hành trình người dùng thật.
Trình tự tối ưu là:

- Trang chủ: card + Carousel.
- Cửa hàng: form controls + Offcanvas + Toast + product card quick add.
- Chi tiết sản phẩm và giỏ hàng: button system, card structure tái sử dụng và các thành phần custom không phải Bootstrap.
- Thanh toán: form classes + validation pattern.
- FAQ / Liên hệ tổng: Accordion / Collapse.
- Discovery / Footer / redirect pages: các điểm tái sử dụng còn lại.

6. Kết lại bằng phần “Bootstrap nào không dùng”.
Phần này rất quan trọng vì nó cho thấy nhóm hiểu framework thật, không gán ghép.

7. Chốt bằng triết lý kiến trúc.
Câu kết nên là: project dùng Bootstrap cho structure, responsive primitives, utility cơ bản và interaction behaviors; còn visual identity thuộc về custom design system của brand.

Một câu chốt ngắn dễ nói:

> Repo này không dùng Bootstrap để “trông giống Bootstrap”; repo dùng Bootstrap để tăng tốc phần nền tảng và behavior, rồi phủ lên bằng design system Sillage để giao diện hoàn toàn mang bản sắc riêng.

# 4. Nội dung slide-by-slide hoàn chỉnh

## Slide 01. Bootstrap Đang Ở Đâu Trong Kiến Trúc Sillage?

- Mục tiêu slide: Đặt luận điểm tổng quát để người nghe hiểu vai trò của Bootstrap trước khi xem code.
- Nội dung hiển thị trên slide:
  - Sillage là storefront ecommerce tĩnh đa trang.
  - Bootstrap là nền móng kỹ thuật, không phải giao diện mặc định.
  - Repo này “design system hóa Bootstrap”.
- Speaker notes / lời thuyết trình chi tiết:

Project dùng Bootstrap ở cả CSS lẫn JS, nhưng không để lộ default Bootstrap look. Nhóm dùng Bootstrap như một lớp hạ tầng: nó cung cấp container, button/form conventions, một số utility, và behavior sẵn cho Collapse, Carousel, Offcanvas, Toast. Sau đó toàn bộ nhận diện thương hiệu được đẩy xuống token và override layer của dự án.

- File path liên quan:
  - `package.json`
  - `src/styles/main.css`
  - `src/styles/bootstrap-overrides.css`
- Code snippet tiêu biểu:

```json
{
  "dependencies": {
    "bootstrap": "5.3.8"
  }
}
```

- Giải thích lý thuyết Bootstrap liên quan:

Bootstrap là một framework frontend gồm CSS foundation, hệ utility, component markup conventions và JS behaviors cho một số thành phần tương tác.

- Giải thích repo đang dùng như thế nào:

Repo không dùng CDN, không nhúng `bootstrap.bundle.min.js` trong HTML. Thay vào đó, Bootstrap được đi qua pipeline Vite như một dependency chuẩn của npm.

- Insight quan trọng để bảo vệ:

Nếu giảng viên hỏi “có thật sự dùng Bootstrap không?”, câu trả lời là có, nhưng dùng ở tầng nền tảng và behavior engine, chứ không lấy visual mặc định của Bootstrap làm giao diện cuối.

## Slide 02. Bootstrap Được Đưa Vào Project Bằng Cách Nào?

- Mục tiêu slide: Chứng minh đường đi kỹ thuật của Bootstrap vào repo.
- Nội dung hiển thị trên slide:
  - Cài bằng npm: `bootstrap@5.3.8`.
  - CSS import qua `main.css`.
  - JS import chọn lọc qua ESM.
- Speaker notes / lời thuyết trình chi tiết:

Bootstrap đi vào repo qua 2 đường. Đường thứ nhất là CSS: `main.css` import trực tiếp file minified của Bootstrap. Đường thứ hai là JS: từng entry module chỉ import đúng component cần dùng, ví dụ `Carousel`, `Offcanvas`, `Toast`, `Collapse`. Cách này phù hợp với Vite và giúp project không cần đưa toàn bộ bundle JS của Bootstrap lên mọi trang.

- File path liên quan:
  - `package.json`
  - `src/styles/main.css`
  - `src/js/entries/home.js`
  - `src/js/entries/shop.js`
  - `src/js/entries/faq.js`
  - `src/js/core/app-shell.js`
- Code snippet tiêu biểu:

```css
@import "./tokens.css";
@import "bootstrap/dist/css/bootstrap.min.css";
@import "./bootstrap-overrides.css";
```

```js
import { Carousel } from "bootstrap";
import { Offcanvas, Toast } from "bootstrap";
import { Collapse } from "bootstrap";
```

- Giải thích lý thuyết Bootstrap liên quan:

Bootstrap 5 hỗ trợ import dạng ESM. Với bundler như Vite, có thể import riêng từng JS module thay vì dùng bundle global.

- Giải thích repo đang dùng như thế nào:

Repo chọn import có chọn lọc để chỉ những trang cần behavior mới nạp module tương ứng.

- Insight quan trọng để bảo vệ:

Đây là cách dùng Bootstrap hiện đại và “sạch” hơn CDN + global script, đồng thời rất hợp với một codebase có nhiều entry page tách nhau.

## Slide 03. Thứ Tự CSS: Tokens Trước, Bootstrap Sau, Override Tiếp Theo

- Mục tiêu slide: Giải thích đúng thứ tự import CSS và vì sao nó quyết định toàn bộ chiến lược theme.
- Nội dung hiển thị trên slide:
  - `tokens.css` cấp `--sl-*`.
  - Bootstrap CSS đi vào ở lớp nền.
  - `bootstrap-overrides.css` remap `--bs-*`.
  - `utilities.css` và `components/*` hoàn thiện UI.
- Speaker notes / lời thuyết trình chi tiết:

Điểm mấu chốt không chỉ là “có import Bootstrap”, mà là import theo đúng thứ tự. `tokens.css` phải đứng trước để mọi token thương hiệu có sẵn. Bootstrap được đưa vào ngay sau đó để cung cấp cấu trúc mặc định. Kế tiếp, `bootstrap-overrides.css` không thay toàn bộ bằng CSS custom vô tổ chức, mà remap có hệ thống các biến `--bs-*`. Cuối cùng mới đến `utilities.css` và từng file component riêng của project.

- File path liên quan:
  - `src/styles/main.css`
  - `src/styles/tokens.css`
  - `src/styles/bootstrap-overrides.css`
- Code snippet tiêu biểu:

```css
@import "./tokens.css";
@import "bootstrap/dist/css/bootstrap.min.css";
@import "./bootstrap-overrides.css";
@import "./utilities.css";
@import "./components/header.css";
```

- Giải thích lý thuyết Bootstrap liên quan:

Bootstrap 5 dựa rất mạnh vào CSS custom properties `--bs-*`. Nếu override đúng biến hoặc selector sau lớp Bootstrap gốc, có thể thay đổi theme rất sâu mà vẫn giữ nguyên cấu trúc component.

- Giải thích repo đang dùng như thế nào:

Repo không biên dịch lại Bootstrap bằng Sass source. Thay vào đó, repo dùng chiến lược override bằng CSS variables và selector override.

- Insight quan trọng để bảo vệ:

Điều này cho thấy nhóm không chỉ “đắp CSS lên Bootstrap”, mà đang tổ chức Bootstrap thành một base layer có kiểm soát.

## Slide 04. Design System Đè Lên Bootstrap Ra Sao?

- Mục tiêu slide: Chỉ ra repo đang đổi da cho Bootstrap bằng token nào, selector nào.
- Nội dung hiển thị trên slide:
  - Remap typography, colors, radius, borders, focus ring.
  - Theme lại button, navbar, form, card, accordion, offcanvas.
  - Xóa hoàn toàn dấu vết visual mặc định của Bootstrap.
- Speaker notes / lời thuyết trình chi tiết:

Đây là slide chứng minh rõ nhất rằng project không để lộ “Bootstrap blue” hay card/navbar/form mặc định. Ở `bootstrap-overrides.css`, gần như toàn bộ những biến lõi như `--bs-body-bg`, `--bs-primary`, `--bs-btn-*`, `--bs-card-*`, `--bs-navbar-*`, `--bs-form-control-*`, `--bs-offcanvas-bg`, `--bs-accordion-*` đều được map sang token của Sillage. Sau đó project còn override trực tiếp các class nền như `.btn`, `.navbar`, `.form-control`, `.card`, `.accordion-button`.

- File path liên quan:
  - `src/styles/bootstrap-overrides.css`
  - `src/styles/tokens.css`
- Code snippet tiêu biểu:

```css
:root {
  --bs-body-bg: var(--sl-color-bg);
  --bs-primary: var(--sl-color-accent);
  --bs-btn-border-radius: var(--sl-radius-md);
  --bs-card-bg: var(--sl-card-surface);
  --bs-offcanvas-bg: var(--sl-color-bg);
  --bs-accordion-border-color: var(--sl-color-border);
}
```

- Giải thích lý thuyết Bootstrap liên quan:

Từ Bootstrap 5, nhiều component đọc theme qua CSS variables thay vì hard-coded values. Điều đó cho phép một design system riêng “tiêm” theme vào Bootstrap.

- Giải thích repo đang dùng như thế nào:

Repo dùng `--sl-*` làm source of truth, rồi map ngược vào `--bs-*`. Nói cách khác, Bootstrap đang phục vụ design system của Sillage.

- Insight quan trọng để bảo vệ:

Cách làm này thuyết phục hơn việc copy code Bootstrap rồi sửa rải rác, vì nó giữ được khả năng mở rộng và tính nhất quán.

## Slide 05. Shared Shell: Container, Page Shell Và Layout Chung

- Mục tiêu slide: Chuyển từ tầng nền tảng sang layout chung toàn site.
- Nội dung hiển thị trên slide:
  - Mọi page mount qua `mountAppShell`.
  - `container` là primitive Bootstrap layout dùng xuyên suốt.
  - Gutter Bootstrap bị override bằng token riêng.
- Speaker notes / lời thuyết trình chi tiết:

Sau khi CSS vào hệ thống, tất cả trang đều đi qua `mountAppShell`. Đây là nơi header, footer, skip link, Zalo widget và nội dung trang được lắp vào một vỏ chung. Về layout, project dùng `container` của Bootstrap rất nhiều, nhưng gần như không dùng `row` / `col-*`. Thay vào đó, Bootstrap chỉ cung cấp khung chiều rộng và gutter, còn layout bên trong dùng custom CSS Grid/Flexbox.

- File path liên quan:
  - `src/js/core/app-shell.js`
  - `src/js/render/page-intro.js`
  - `src/styles/main.css`
- Code snippet tiêu biểu:

```css
.container,
.container-sm,
.container-md,
.container-lg,
.container-xl,
.container-xxl {
  --bs-gutter-x: calc(var(--sl-page-gutter) * 2);
  max-width: var(--sl-content-max);
}
```

```js
root.innerHTML = `
  <div class="sl-page-shell sl-shell">
    ${renderHeader({ currentPage, initialCartCount: getCartCount() })}
    <main class="sl-page-main" id="sl-main-content">
      ${includePageIntro ? renderPageIntro({ eyebrow, title, summary, note: pageIntroNote }) : ""}
      ${content}
    </main>
    ${renderFooter({ currentPage })}
  </div>
`;
```

- Giải thích lý thuyết Bootstrap liên quan:

`container` là primitive layout quan trọng nhất của Bootstrap: nó giới hạn max-width và quản lý gutter ngang theo breakpoint.

- Giải thích repo đang dùng như thế nào:

Repo dùng `container`, nhưng không đi tiếp theo lối `row` / `col-*`. Đây là một quyết định có chủ đích: Bootstrap cho width/gutter, còn project kiểm soát layout chi tiết bằng custom grid để giao diện bớt “template”.

- Insight quan trọng để bảo vệ:

Điểm này rất đáng nói vì nó cho thấy nhóm không lệ thuộc hoàn toàn vào Bootstrap grid. Bootstrap chỉ là nền tảng, không phải toàn bộ cách dựng layout.

## Slide 06. Navbar + Collapse Markup Trong Shared Header

- Mục tiêu slide: Chỉ ra Bootstrap xuất hiện rõ ràng nhất ở header shared.
- Nội dung hiển thị trên slide:
  - `navbar navbar-expand-lg`.
  - `navbar-toggler` + `navbar-toggler-icon`.
  - `collapse navbar-collapse`.
  - Utility thật sự dùng: `ms-auto`, `mb-0`, `ms-lg-4`.
- Speaker notes / lời thuyết trình chi tiết:

Header là nơi Bootstrap xuất hiện rất điển hình. Markup tuân theo pattern chuẩn của navbar Bootstrap: brand, toggler, collapse panel, nav list. Tuy nhiên toàn bộ visual của nó đã bị theme lại bằng class `sl-*` và override CSS. Đây là ví dụ rất tốt để giải thích sự phối hợp giữa class Bootstrap thật và class custom của project.

- File path liên quan:
  - `src/js/render/header.js`
  - `src/styles/bootstrap-overrides.css`
  - `src/styles/components/header.css`
- Code snippet tiêu biểu:

```html
<nav class="navbar navbar-expand-lg sl-navbar">
  <div class="container">
    <a class="navbar-brand sl-wordmark" href="index.html">Sillage</a>
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#sl-primary-nav"
      aria-controls="sl-primary-nav"
      aria-expanded="false"
      aria-label="Mở menu điều hướng"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse sl-nav-panel" id="sl-primary-nav">
      <ul class="navbar-nav ms-auto mb-0 sl-nav-list">...</ul>
    </div>
  </div>
</nav>
```

- Giải thích lý thuyết Bootstrap liên quan:

`navbar-expand-lg` nghĩa là nav panel collapse ở viewport nhỏ hơn `lg` và bung ngang từ `lg` trở lên. `collapse` là phần tử được Bootstrap show/hide. `navbar-toggler-icon` dùng icon mặc định của Bootstrap nhưng có thể thay bằng CSS variable.

- Giải thích repo đang dùng như thế nào:

Repo giữ nguyên skeleton Bootstrap để hưởng responsive behavior và accessibility, nhưng visual wordmark, nav spacing, active state và mobile panel đều là custom.

- Insight quan trọng để bảo vệ:

Đây là chỗ dễ chứng minh nhất rằng nhóm hiểu Bootstrap ở mức cấu trúc markup, không chỉ dán class ngẫu nhiên.

## Slide 07. Collapse JS Của Navbar Hoạt Động Ra Sao?

- Mục tiêu slide: Tách rõ Bootstrap JS API và custom JS quanh mobile nav.
- Nội dung hiển thị trên slide:
  - Import `Collapse` từ `"bootstrap"`.
  - Dùng `Collapse.getOrCreateInstance(...)`.
  - Custom JS bổ sung đóng menu khi click ngoài, nhấn `Escape`, đổi viewport.
- Speaker notes / lời thuyết trình chi tiết:

Bootstrap giải quyết phần show/hide và trạng thái collapse. Nhưng project không dừng ở đó. `app-shell.js` còn bọc quanh bằng logic riêng để mobile nav cư xử giống một sản phẩm thật: click ra ngoài thì đóng, bấm link thì đóng, nhấn `Escape` thì đóng, và khi resize lên desktop thì reset trạng thái.

- File path liên quan:
  - `src/js/core/app-shell.js`
  - `src/js/render/header.js`
- Code snippet tiêu biểu:

```js
const navPanel = root.querySelector("#sl-primary-nav");
const toggler = root.querySelector("[data-bs-target='#sl-primary-nav']");
const collapse = Collapse.getOrCreateInstance(navPanel, { toggle: false });

const closeMobileNav = ({ restoreFocus = false } = {}) => {
  if (window.innerWidth < 992 && navPanel.classList.contains("show")) {
    collapse.hide();
    if (restoreFocus) toggler.focus();
  }
};
```

- Giải thích lý thuyết Bootstrap liên quan:

`Collapse` là JS component điều khiển việc thêm/bỏ class `.show`, quản lý `aria-expanded` và animation chiều cao cho nội dung co giãn.

- Giải thích repo đang dùng như thế nào:

Repo dùng Bootstrap để xử lý cơ chế collapse, nhưng behavior “đủ chuẩn mobile navigation” được hoàn thiện bằng custom JS của dự án.

- Insight quan trọng để bảo vệ:

Đây là ví dụ điển hình của việc “Bootstrap lo core behavior, project lo product behavior”.

## Slide 08. Button System Và Utility Classes Thực Sự Dùng

- Mục tiêu slide: Chỉ ra button system được tái sử dụng toàn site và utility usage thực tế khá tiết chế.
- Nội dung hiển thị trên slide:
  - Button base: `.btn`.
  - Variants dùng thật: `.btn-primary`, `.btn-secondary`, `.btn-link`, `.btn-close`.
  - Variant custom: `.btn-quiet`, `.btn-primary--hero`, `.btn-primary--checkout`.
  - Utility dùng thật: `container`, `ms-auto`, `mb-0`, `ms-lg-4`, `me-auto`, `visually-hidden`, `border-0`.
- Speaker notes / lời thuyết trình chi tiết:

Project dùng Bootstrap utilities rất ít, có chủ ý. Không có `d-flex`, `row`, `col-*`, spacing utility dày đặc. Họ chỉ giữ những utility cực nền tảng như `container`, canh lề nav, `visually-hidden`, `border-0`, `me-auto`. Điều này giúp markup gọn và giao diện không bị “mùi Bootstrap”. Button system thì ngược lại: được tái dùng khắp site nhưng luôn qua lớp theme mạnh.

- File path liên quan:
  - `src/styles/bootstrap-overrides.css`
  - `src/js/render/header.js`
  - `src/js/render/footer.js`
  - `src/js/render/home-view.js`
  - `src/js/render/shop-view.js`
- Code snippet tiêu biểu:

```css
.btn-primary {
  --bs-btn-bg: var(--sl-button-bg);
  --bs-btn-border-color: var(--sl-button-border);
  --bs-btn-hover-bg: var(--sl-button-bg-hover);
}

.btn-quiet {
  min-height: auto;
  padding-inline: 0;
  border-color: transparent;
  background: transparent;
}
```

- Giải thích lý thuyết Bootstrap liên quan:

Bootstrap button system tách `base class` `.btn` khỏi variant classes như `.btn-primary`, `.btn-secondary`, `.btn-link`. Utility classes là các class atomic giải quyết một việc rất nhỏ như margin, alignment, accessibility text.

- Giải thích repo đang dùng như thế nào:

Repo giữ base semantics và behavior của button Bootstrap, nhưng tạo thêm variant custom mang thương hiệu riêng.

- Insight quan trọng để bảo vệ:

Nếu bị hỏi “sao utility của Bootstrap dùng ít vậy?”, có thể trả lời: nhóm chủ ý dùng Bootstrap utility ở mức tối thiểu để tránh markup nặng utility và giữ layout do design system kiểm soát.

## Slide 09. Product Card: Dùng Bootstrap Card Nhưng Không Cho Lộ Bootstrap

- Mục tiêu slide: Chứng minh card là component Bootstrap được dùng lại nhiều nơi nhất.
- Nội dung hiển thị trên slide:
  - `card`, `card-body`, `card-footer`.
  - Dùng ở Home, Shop và Related Products.
  - Default card look bị loại bỏ gần như hoàn toàn.
- Speaker notes / lời thuyết trình chi tiết:

`product-card.js` là nơi dễ thấy nhất cách project dùng Bootstrap có kiểm soát. Họ lấy đúng skeleton `card/card-body/card-footer`, nhưng CSS ở `product-card.css` và `home.css` làm cho card gần như không còn trông giống Bootstrap card mặc định. Phần Shop còn dùng `card-footer` cho quick add action.

- File path liên quan:
  - `src/js/render/product-card.js`
  - `src/js/render/home-view.js`
  - `src/js/render/product-grid.js`
  - `src/js/render/related-products.js`
  - `src/styles/components/product-card.css`
- Code snippet tiêu biểu:

```html
<article class="card sl-product-card">
  <a class="sl-product-card__link" href="...">
    <div class="card-body sl-product-card__body sl-stack sl-stack--tight">...</div>
  </a>
  <div class="card-footer sl-product-card__actions">
    <button class="btn btn-secondary sl-product-card__quick-add">Thêm vào giỏ</button>
  </div>
</article>
```

- Giải thích lý thuyết Bootstrap liên quan:

`card` là component content container có vùng thân (`card-body`) và chân (`card-footer`) để chuẩn hóa spacing và hierarchy.

- Giải thích repo đang dùng như thế nào:

Repo dùng `card` làm skeleton semantic và spacing base, sau đó bỏ nền, bỏ border mặc định và thay bằng visual nghệ thuật hơn.

- Insight quan trọng để bảo vệ:

Đây là minh họa rõ cho luận điểm “giữ engine, bỏ diện mạo mặc định”.

## Slide 10. Trang Chủ: Markup Carousel Chuẩn Bootstrap

- Mục tiêu slide: Chỉ ra Home page dùng đúng cấu trúc Carousel của Bootstrap.
- Nội dung hiển thị trên slide:
  - `carousel slide`, `carousel-inner`, `carousel-item`.
  - Indicators dùng `data-bs-slide-to`.
  - Controls dùng `data-bs-slide="prev/next"`.
- Speaker notes / lời thuyết trình chi tiết:

Ở trang chủ, project dùng Bootstrap Carousel như một điểm showcase có chủ đích. Markup tuân chuẩn khá sát: khối ngoài là `carousel slide`, bên trong có `carousel-indicators`, `carousel-inner`, từng `carousel-item`, và hai control prev/next.

- File path liên quan:
  - `src/js/render/home-view.js`
- Code snippet tiêu biểu:

```html
<div id="sl-home-showcase" class="carousel slide sl-home-carousel" data-home-carousel>
  <div class="carousel-indicators sl-home-carousel__indicators">
    <button data-bs-target="#sl-home-showcase" data-bs-slide-to="0" class="active"></button>
  </div>
  <div class="carousel-inner">
    <div class="carousel-item active">...</div>
  </div>
  <button class="carousel-control-prev" data-bs-target="#sl-home-showcase" data-bs-slide="prev">...</button>
  <button class="carousel-control-next" data-bs-target="#sl-home-showcase" data-bs-slide="next">...</button>
</div>
```

- Giải thích lý thuyết Bootstrap liên quan:

Bootstrap Carousel cần một root `.carousel`, một `.carousel-inner`, các `.carousel-item`, indicator gắn `data-bs-slide-to`, và control gắn `data-bs-slide`.

- Giải thích repo đang dùng như thế nào:

Repo dùng data API của Bootstrap cho indicator và control, nhưng nội dung mỗi slide là layout custom hoàn toàn theo brand.

- Insight quan trọng để bảo vệ:

Phần carousel này rất phù hợp để demo vì vừa có lý thuyết component chuẩn, vừa cho thấy mức custom visual rất mạnh.

## Slide 11. Home Carousel JS: Có Dùng Bootstrap API, Nhưng UX Rất Có Chủ Đích

- Mục tiêu slide: Giải thích tại sao carousel không autoplay và repo cấu hình như vậy.
- Nội dung hiển thị trên slide:
  - `interval: false`.
  - `ride: false`.
  - `touch: true`.
  - `wrap: true`.
- Speaker notes / lời thuyết trình chi tiết:

Điểm đáng chú ý là nhóm không để carousel auto-rotate như demo mặc định của Bootstrap. Điều này khớp với `DESIGN_SYSTEM.md`, nơi motion guideline cấm auto-rotating carousel. Vì vậy Bootstrap chỉ cung cấp cơ chế slide, còn UX decision vẫn đi theo brand: người dùng chủ động chuyển slide, touch vẫn được bật cho mobile, và `wrap` giúp quay vòng hợp lý.

- File path liên quan:
  - `src/js/entries/home.js`
  - `docs/DESIGN_SYSTEM.md`
- Code snippet tiêu biểu:

```js
Carousel.getOrCreateInstance(carouselNode, {
  interval: false,
  ride: false,
  touch: true,
  wrap: true
});
```

- Giải thích lý thuyết Bootstrap liên quan:

`Carousel` JS API cho phép cấu hình autoplay, touch gesture, cycling behavior và khởi tạo instance thủ công thay vì dựa hoàn toàn vào data API.

- Giải thích repo đang dùng như thế nào:

Repo dùng Carousel API đúng chỗ cần thiết, nhưng khóa autoplay để tránh cảm giác “promo carousel” quá thương mại.

- Insight quan trọng để bảo vệ:

Nếu bị hỏi “tại sao dùng Carousel mà không autoplay?”, câu trả lời là vì UX tone của brand ưu tiên kiểm soát và tiết chế, không ưu tiên chuyển động quảng cáo.

## Slide 12. Trang Cửa Hàng: Form Controls Và Offcanvas Filter

- Mục tiêu slide: Chuyển sang trang Shop và giải thích component Bootstrap nổi bật nhất ở đây.
- Nội dung hiển thị trên slide:
  - `form-label`, `form-select` cho filter/sort.
  - `offcanvas offcanvas-end` cho filter panel.
  - `btn-close` và `offcanvas-title`.
- Speaker notes / lời thuyết trình chi tiết:

Trang cửa hàng dùng Bootstrap ở hai lớp. Lớp thứ nhất là form controls cho filter và sort, gồm label + select. Lớp thứ hai là Offcanvas cho panel lọc. Việc đặt filter vào Offcanvas rất hợp với mobile vì không cần chèn một sidebar cố định vào layout hẹp.

- File path liên quan:
  - `src/js/render/shop-view.js`
  - `src/styles/components/shop.css`
  - `src/styles/bootstrap-overrides.css`
- Code snippet tiêu biểu:

```html
<div class="offcanvas offcanvas-end sl-shop-offcanvas" id="sl-shop-filters" data-shop-offcanvas>
  <div class="offcanvas-header sl-shop-offcanvas__header">
    <h2 class="offcanvas-title" id="sl-shop-filters-title">Lọc và sắp xếp bộ sưu tập</h2>
    <button class="btn-close" type="button" aria-label="Đóng bộ lọc" data-shop-close-filters></button>
  </div>
  <div class="offcanvas-body sl-shop-offcanvas__body">
    <label class="form-label" for="shop-family">Nhóm hương</label>
    <select class="form-select" id="shop-family" data-shop-family>...</select>
  </div>
</div>
```

- Giải thích lý thuyết Bootstrap liên quan:

Offcanvas là panel trượt ngoài màn hình, phù hợp cho filter panel, mobile nav hoặc contextual controls. `offcanvas-end` nghĩa là panel trượt từ cạnh phải.

- Giải thích repo đang dùng như thế nào:

Repo không dùng `data-bs-toggle="offcanvas"` trên nút trigger, mà render markup Offcanvas chuẩn rồi show/hide qua custom JS.

- Insight quan trọng để bảo vệ:

Đây là quyết định hợp lý cho ecommerce mobile: filter chỉ hiện khi cần, không chiếm diện tích ngang cố định.

## Slide 13. Shop Interactivity: Offcanvas JS Và Toast Khi Quick Add

- Mục tiêu slide: Giải thích luồng JS của Shop và tách rõ Bootstrap API với custom business logic.
- Nội dung hiển thị trên slide:
  - `Offcanvas.getOrCreateInstance(...)`.
  - `Toast.getOrCreateInstance(...)`.
  - Quick add là custom logic, Toast là Bootstrap feedback layer.
- Speaker notes / lời thuyết trình chi tiết:

Ở Shop, business logic “thêm vào giỏ” là custom của project. Bootstrap không làm chuyện thêm sản phẩm. Nhưng Bootstrap được dùng làm UI feedback layer bằng Toast, và làm filter drawer bằng Offcanvas. Đây là một cách dùng rất đúng vai trò framework: business state do app quản lý, component behavior do Bootstrap đảm nhiệm.

- File path liên quan:
  - `src/js/entries/shop.js`
  - `src/js/render/shop-view.js`
- Code snippet tiêu biểu:

```js
const offcanvas = Offcanvas.getOrCreateInstance(offcanvasNode, {
  scroll: false,
  backdrop: true
});

Toast.getOrCreateInstance(toastNode, {
  autohide: true,
  delay: 2200
}).show();
```

- Giải thích lý thuyết Bootstrap liên quan:

`Offcanvas` quản lý overlay panel, backdrop và focus flow. `Toast` là component thông báo ngắn, thường auto-hide sau một khoảng delay.

- Giải thích repo đang dùng như thế nào:

Repo tự bind click cho nút mở/đóng Offcanvas và nút đóng Toast thay vì dựa vào `data-bs-dismiss`. Điều này làm ranh giới giữa custom JS và Bootstrap JS API rất rõ ràng.

- Insight quan trọng để bảo vệ:

Nếu giảng viên hỏi “Bootstrap làm gì, app làm gì?”, hãy trả lời: app xử lý state và cart; Bootstrap xử lý overlay/notification behavior.

## Slide 14. Product Detail, Cart, Discovery, Contact Và Footer: Bootstrap Được Tái Dùng Ở Mức Nào?

- Mục tiêu slide: Bao phủ các nơi Bootstrap không còn là component lớn, nhưng vẫn xuất hiện đều đặn.
- Nội dung hiển thị trên slide:
  - Product detail, cart, discovery, contact đều dùng shared button system.
  - Footer newsletter dùng `form-control`, `btn`, `visually-hidden`.
  - Quantity steppers của product/cart là custom, không phải Bootstrap `input-group`.
- Speaker notes / lời thuyết trình chi tiết:

Sau Home và Shop, phần còn lại của site dùng Bootstrap theo kiểu “structural reuse”. Product detail và cart dùng `btn btn-primary`, `btn btn-quiet`, `btn-link`; Discovery và Contact dùng CTA variants tương tự; Footer newsletter dùng `form-control` và `btn btn-primary`. Nhưng cần nhấn mạnh một điều rất quan trọng: quantity control ở product và cart là custom component của project, không phải Bootstrap `input-group`. Đây là chỗ dễ bị nhầm khi bảo vệ.

- File path liên quan:
  - `src/js/render/product-detail.js`
  - `src/js/render/cart-view.js`
  - `src/js/render/discovery-view.js`
  - `src/js/render/contact-view.js`
  - `src/js/render/footer.js`
  - `src/styles/components/product-detail.css`
  - `src/styles/components/cart.css`
- Code snippet tiêu biểu:

```html
<button class="btn btn-primary sl-product-detail__primary-action" type="button">Thêm vào giỏ</button>
<a class="btn btn-quiet sl-product-detail__secondary-action" href="bo-kham-pha.html">So sánh qua Bộ Khám Phá</a>

<label class="visually-hidden" for="footer-newsletter-email">Email nhận bản tin</label>
<input class="form-control" id="footer-newsletter-email" type="email" required />
<button class="btn btn-primary" type="submit">Đăng ký</button>
```

- Giải thích lý thuyết Bootstrap liên quan:

Bootstrap không chỉ có component lớn như Carousel hay Offcanvas. Nó còn cung cấp một vocabulary chung cho button, form input, helper text ẩn cho screen reader.

- Giải thích repo đang dùng như thế nào:

Repo tái sử dụng button system và form primitives rất đều trên các page phụ, giữ được nhất quán visual và hành vi focus/hover.

- Insight quan trọng để bảo vệ:

Điểm đáng nói không phải là “trang nào cũng có Bootstrap component lớn”, mà là toàn site cùng nói chung một ngôn ngữ component ở tầng nền.

## Slide 15. Checkout Form: Pattern Validation Chuẩn Bootstrap

- Mục tiêu slide: Chứng minh checkout là nơi dùng Bootstrap form system bài bản nhất.
- Nội dung hiển thị trên slide:
  - `form-label`, `form-control`, `form-check-input`, `form-check-label`.
  - `invalid-feedback`.
  - `needs-validation` + `novalidate`.
- Speaker notes / lời thuyết trình chi tiết:

Checkout là nơi project dùng Bootstrap form pattern bài bản nhất. Các field dùng đúng class form của Bootstrap, error message dùng `invalid-feedback`, form gắn `needs-validation` và `novalidate`. Tức là markup đang đi theo đúng pattern mà Bootstrap tài liệu hóa cho validation phía client.

- File path liên quan:
  - `src/js/render/checkout-view.js`
  - `src/styles/components/forms.css`
  - `src/styles/components/checkout.css`
- Code snippet tiêu biểu:

```html
<form class="sl-form-layout sl-checkout-form needs-validation" id="sl-checkout-form" novalidate data-checkout-form>
  <label class="form-label" for="checkout-email">Email</label>
  <input class="form-control" id="checkout-email" name="email" type="email" required />
  <div class="invalid-feedback" id="checkout-email-feedback">Vui lòng nhập địa chỉ email hợp lệ.</div>

  <div class="form-check sl-checkout-check">
    <input class="form-check-input" type="checkbox" id="checkout-terms" required />
    <label class="form-check-label" for="checkout-terms">Tôi xác nhận thông tin...</label>
  </div>
</form>
```

- Giải thích lý thuyết Bootstrap liên quan:

Bootstrap validation pattern dựa trên HTML constraint validation API, kết hợp class `.needs-validation`, `.was-validated`, `.is-invalid`, `.is-valid`, và block `.invalid-feedback`.

- Giải thích repo đang dùng như thế nào:

Repo bám rất sát pattern này, nhưng thêm layout form riêng, shipping methods custom và visual validation riêng theo design tokens.

- Insight quan trọng để bảo vệ:

Nếu cần đưa ví dụ “Bootstrap giúp maintainability thế nào”, checkout form là ví dụ tốt nhất vì mọi field đều theo một convention nhất quán.

## Slide 16. Checkout Validation JS Và Accessibility

- Mục tiêu slide: Giải thích phần JS bổ sung quanh Bootstrap validation.
- Nội dung hiển thị trên slide:
  - JS tự format card, expiry, CVC.
  - Submit thêm `.was-validated`.
  - `aria-invalid` và `aria-errormessage` được sync thủ công.
- Speaker notes / lời thuyết trình chi tiết:

Bootstrap không tự validate nghiệp vụ như số thẻ hay số điện thoại. Repo dùng custom JS cho phần đó, sau đó đẩy kết quả vào Bootstrap validation state bằng `setCustomValidity` và class `.was-validated`. Đồng thời `checkout-service.js` còn gắn `aria-invalid` và `aria-errormessage` để screen reader hiểu đúng mối quan hệ giữa field và thông báo lỗi.

- File path liên quan:
  - `src/js/entries/checkout.js`
  - `src/js/core/checkout-service.js`
  - `src/styles/components/checkout.css`
- Code snippet tiêu biểu:

```js
syncCheckoutValidity(form, { announceErrors: true });
form.classList.add("was-validated");

if (!form.checkValidity()) {
  focusFirstInvalidField(form);
  return;
}
```

```js
field.setAttribute("aria-invalid", "true");
field.setAttribute("aria-errormessage", feedbackId);
```

- Giải thích lý thuyết Bootstrap liên quan:

Bootstrap validation styling không tự quyết định field nào đúng/sai; nó dựa vào validation state của form và field do browser hoặc app cung cấp.

- Giải thích repo đang dùng như thế nào:

Repo dùng Bootstrap để biểu diễn trạng thái validation, còn custom JS chịu trách nhiệm chuẩn hóa dữ liệu và accessibility metadata.

- Insight quan trọng để bảo vệ:

Đây là một ví dụ tốt để nói rằng nhóm không dùng Bootstrap “mù”, mà hiểu cách Bootstrap dựa trên native browser validation.

## Slide 17. FAQ / Liên Hệ Tổng: Accordion Và Collapse

- Mục tiêu slide: Giải thích trang FAQ dùng Bootstrap Collapse theo pattern accordion.
- Nội dung hiển thị trên slide:
  - `accordion`, `accordion-item`, `accordion-button`, `accordion-collapse collapse`, `accordion-body`.
  - `data-bs-parent` để mở một mục và đóng mục còn lại.
  - `Collapse.getOrCreateInstance(...)` để toggle bằng JS.
- Speaker notes / lời thuyết trình chi tiết:

FAQ dùng markup accordion chuẩn Bootstrap, nhưng JS toggle được bọc thủ công. Mỗi nhóm FAQ có một root `.accordion`, mỗi item có button và vùng collapse. `data-bs-parent` đảm bảo trong cùng một group chỉ có một item mở tại một thời điểm. CSS trong `support-pages.css` lại một lần nữa xóa hẳn diện mạo accordion mặc định.

- File path liên quan:
  - `src/js/render/faq-view.js`
  - `src/js/entries/faq.js`
  - `src/styles/components/support-pages.css`
- Code snippet tiêu biểu:

```html
<article class="accordion-item sl-faq-item">
  <h3 class="accordion-header" id="...">
    <button class="accordion-button collapsed" data-faq-toggle data-bs-target="#item-collapse">...</button>
  </h3>
  <div class="accordion-collapse collapse" data-bs-parent="#faq-group-shipping">
    <div class="accordion-body sl-faq-item__body">...</div>
  </div>
</article>
```

```js
Collapse.getOrCreateInstance(collapseNode, {
  parent: accordionRoot,
  toggle: false
}).toggle();
```

- Giải thích lý thuyết Bootstrap liên quan:

Accordion trong Bootstrap thực chất được xây trên Collapse. `data-bs-parent` tạo hành vi “mở một, đóng phần còn lại”.

- Giải thích repo đang dùng như thế nào:

Repo dùng Collapse API rõ ràng hơn là dựa hoàn toàn vào data API mặc định, vì muốn chủ động bind event và group behavior.

- Insight quan trọng để bảo vệ:

Đây là ví dụ rõ cho thấy nhóm hiểu quan hệ giữa component cấp cao `Accordion` và engine cấp thấp `Collapse`.

## Slide 18. Những Gì Không Dùng Và Kết Luận Kiến Trúc

- Mục tiêu slide: Kết lại bằng việc phân biệt cái dùng thật và cái chỉ chuẩn bị sẵn.
- Nội dung hiển thị trên slide:
  - Dùng thật: Collapse, Carousel, Offcanvas, Toast, Navbar, Card, Button, Forms, Accordion, Utilities cơ bản.
  - Không dùng runtime: Modal, Dropdown, Tooltip, Popover, Tabs, Scrollspy, Spinner, Alert, Pagination.
  - Có override sẵn nhưng chưa dùng: `dropdown`, `modal`, `page-link`, `badge`, `input-group-text`, `btn-outline-dark`.
- Speaker notes / lời thuyết trình chi tiết:

Phần này rất quan trọng vì nó thể hiện độ trung thực của bài thuyết trình. Trong code có theme sẵn cho dropdown, modal, pagination, badge, input-group-text và cả `btn-outline-dark`, nhưng search toàn repo không thấy markup hay JS runtime tương ứng. Tương tự, quantity controls của product/cart không phải Bootstrap input group, cart badge không phải Bootstrap `.badge`, và layout tổng thể không dùng `row` / `col-*`. Kết luận đúng nhất là: Bootstrap là tầng nền và behavior engine; design system Sillage mới là tầng quyết định diện mạo cuối.

- File path liên quan:
  - `src/styles/bootstrap-overrides.css`
  - `src/styles/main.css`
  - `src/styles/components/product-detail.css`
  - `src/styles/components/cart.css`
- Code snippet tiêu biểu:

```css
--bs-dropdown-bg: var(--sl-color-surface);
--bs-modal-bg: var(--sl-color-bg);
--bs-pagination-bg: transparent;

.dropdown-menu,
.modal-content,
.page-link,
.badge,
.input-group-text { ... }
```

- Giải thích lý thuyết Bootstrap liên quan:

Một framework có thể được theme vượt trước nhu cầu runtime. Nhưng chỉ khi có markup hoặc JS component tương ứng thì mới tính là “đang dùng component đó”.

- Giải thích repo đang dùng như thế nào:

Repo chuẩn bị sẵn extension points cho tương lai, nhưng runtime hiện tại vẫn rất chọn lọc.

- Insight quan trọng để bảo vệ:

Nói rõ “có override sẵn nhưng chưa dùng” sẽ thuyết phục hơn nhiều so với cố nhận hết mọi component của Bootstrap là của project.

# 5. Phân tích chuyên sâu theo từng cụm Bootstrap

## 5.1. Import + Build Integration

- Bootstrap được cài qua npm trong `package.json`, không dùng CDN.
- CSS Bootstrap đi qua `src/styles/main.css`, nên toàn site dùng cùng một entry CSS.
- JS Bootstrap được import theo từng component ESM trong `home.js`, `shop.js`, `faq.js`, `app-shell.js`.
- Vì là Vite multi-page tĩnh, từng HTML page chỉ cần link `main.css` và entry JS của riêng trang đó.
- Ý nghĩa kiến trúc: cùng một framework, nhưng chỉ nạp đúng behavior cần dùng cho từng luồng.

## 5.2. CSS Variable Strategy

- `src/styles/tokens.css` là source of truth của brand, với prefix `--sl-*`.
- `src/styles/bootstrap-overrides.css` map `--sl-*` sang `--bs-*`.
- Đây là chiến lược “Bootstrap nhận theme từ design system”.
- Các biến bị remap mạnh nhất:
  - typography: `--bs-body-font-family`, `--bs-font-sans-serif`, `--bs-heading-color`
  - color: `--bs-body-bg`, `--bs-body-color`, `--bs-primary`, `--bs-secondary`, `--bs-border-color`
  - button: `--bs-btn-*`
  - card: `--bs-card-*`
  - form: `--bs-form-control-*`, `--bs-form-select-bg`, `--bs-focus-ring-color`
  - nav/overlay: `--bs-navbar-*`, `--bs-offcanvas-bg`, `--bs-accordion-*`
- Kết luận: repo không “viết đè Bootstrap từng component rời rạc”, mà đặt Bootstrap vào một hệ token có trung tâm.

## 5.3. Navbar + Collapse

- Markup chuẩn nằm ở `src/js/render/header.js`.
- Behavior chuẩn nằm ở `src/js/core/app-shell.js`.
- Bootstrap class thật:
  - `navbar`
  - `navbar-expand-lg`
  - `navbar-brand`
  - `navbar-toggler`
  - `navbar-toggler-icon`
  - `collapse navbar-collapse`
  - `navbar-nav`
  - `nav-item`
  - `nav-link`
- Utility thật đi kèm:
  - `ms-auto`
  - `mb-0`
  - `ms-lg-4`
- Custom class đi kèm:
  - `sl-navbar`
  - `sl-nav-panel`
  - `sl-nav-list`
  - `sl-nav-link`
  - `sl-cart-link`
- Repo lợi dụng Bootstrap để có responsive breakpoint và collapse behavior sẵn, sau đó bổ sung close-on-outside-click, close-on-escape và desktop reset.

## 5.4. Carousel

- Markup ở `src/js/render/home-view.js`.
- JS init ở `src/js/entries/home.js`.
- CSS theme ở `src/styles/components/home.css`.
- Bootstrap markup thật:
  - `carousel slide`
  - `carousel-indicators`
  - `carousel-inner`
  - `carousel-item`
  - `carousel-control-prev`
  - `carousel-control-next`
  - `carousel-control-prev-icon`
  - `carousel-control-next-icon`
- Data API thật:
  - `data-bs-target`
  - `data-bs-slide-to`
  - `data-bs-slide`
- Custom UX decisions:
  - không autoplay
  - giữ touch
  - cho phép wrap
  - indicator và control vẫn đúng chuẩn Bootstrap
- Giá trị UX:
  - vẫn chứng minh được component Bootstrap
  - nhưng không phá tone luxury minimalism vì không auto-rotate

## 5.5. Offcanvas

- Markup ở `src/js/render/shop-view.js`.
- JS control ở `src/js/entries/shop.js`.
- CSS theme ở `src/styles/components/shop.css`.
- Bootstrap class thật:
  - `offcanvas`
  - `offcanvas-end`
  - `offcanvas-header`
  - `offcanvas-title`
  - `offcanvas-body`
  - `btn-close`
- Bootstrap variable thật:
  - `--bs-offcanvas-bg`
  - `--bs-offcanvas-width`
- Repo không dùng data trigger mặc định của Bootstrap, mà dùng custom selector `data-shop-open-filters` / `data-shop-close-filters` rồi gọi `offcanvas.show()` / `offcanvas.hide()`.
- Vì sao hợp lý:
  - narrow viewport không phải gánh sidebar cố định
  - filter panel tách biệt, dễ đóng/mở
  - theme riêng giúp offcanvas trông như panel thương hiệu chứ không như demo Bootstrap

## 5.6. Toast

- Markup ở `src/js/render/shop-view.js`.
- JS ở `src/js/entries/shop.js`.
- CSS ở `src/styles/components/shop.css`.
- Bootstrap class thật:
  - `toast-container`
  - `toast`
  - `toast-header`
  - `toast-body`
  - `btn-close`
  - utility `me-auto`
  - utility `border-0`
- Bootstrap JS API:
  - `Toast.getOrCreateInstance(...)`
  - `.show()`
  - `.hide()`
- Custom logic:
  - app tự quyết định message
  - app tự quyết định lúc nào show toast sau quick add
- Giá trị UX:
  - phản hồi ngay tại chỗ
  - không đẩy người dùng rời khỏi luồng mua sắm

## 5.7. Accordion / Collapse

- Markup ở `src/js/render/faq-view.js`.
- JS ở `src/js/entries/faq.js`.
- CSS ở `src/styles/components/support-pages.css`.
- Bootstrap class thật:
  - `accordion`
  - `accordion-item`
  - `accordion-header`
  - `accordion-button`
  - `accordion-collapse collapse`
  - `accordion-body`
- Data attribute thật:
  - `data-bs-target`
  - `data-bs-parent`
- JS thật:
  - `Collapse.getOrCreateInstance(...)`
- Điểm đáng nói:
  - repo không dùng `data-bs-toggle="collapse"` trực tiếp trên button
  - repo dùng `data-faq-toggle` + custom listener để tự gọi `.toggle()`
- Giá trị maintainability:
  - nhóm giữ được control rõ ràng hơn giữa FAQ group và event binding

## 5.8. Cards

- Card được dùng thật ở Home featured cards, Shop product cards, Related products.
- Bootstrap structure thật:
  - `card`
  - `card-body`
  - `card-footer`
- Custom class đi kèm:
  - `sl-home-product-card`
  - `sl-product-card`
  - `sl-product-card__body`
  - `sl-product-card__actions`
- Không phải card nào nhìn giống panel cũng là Bootstrap card.
  - `sl-product-detail__trust-card`
  - `sl-cart-trust__card`
  - `sl-checkout-trust__card`
  là custom cards, không dùng class `.card`.
- Đây là chi tiết nên nhấn mạnh để tránh gán nhầm.

## 5.9. Buttons

- Bootstrap button classes dùng thật:
  - `btn`
  - `btn-primary`
  - `btn-secondary`
  - `btn-link`
  - `btn-close`
- Project custom button classes:
  - `btn-quiet`
  - `btn-primary--hero`
  - `btn-primary--checkout`
- Chỗ dùng nhiều nhất:
  - header/footer CTA
  - Home hero và carousel CTA
  - quick add trong Shop
  - CTA ở Product Detail, Cart, Checkout Success, Discovery, Contact, FAQ
- Nhận định kiến trúc:
  - Bootstrap cung cấp button semantics và state model.
  - Project quyết định visual tone, spacing, motion, emphasis hierarchy.

## 5.10. Forms + Validation Feedback

- Shop dùng `form-label` + `form-select` cho filter/sort.
- Footer newsletter dùng `form-control` + `btn`.
- Checkout dùng đầy đủ:
  - `form-label`
  - `form-control`
  - `form-check-input`
  - `form-check-label`
  - `invalid-feedback`
  - `needs-validation`
  - `was-validated`
- Điều quan trọng:
  - Newsletter không dùng Bootstrap validation block; nó dùng native validity + status text custom.
  - Checkout mới là nơi dùng đúng Bootstrap validation pattern.
- Accessibility:
  - field notes qua `aria-describedby`
  - lỗi qua `aria-errormessage`
  - focus chuyển vào field invalid đầu tiên

## 5.11. Utilities

Các utility class Bootstrap thực sự xuất hiện trong runtime markup là:

- `container`
- `ms-auto`
- `mb-0`
- `ms-lg-4`
- `me-auto`
- `visually-hidden`
- `border-0`

Các utility mà nhiều người dễ tưởng là có nhưng thực tế không thấy dùng trong markup:

- `row`
- `col-*`
- `d-flex`
- `d-grid`
- spacing utilities kiểu `mt-*`, `px-*`, `gap-*`
- text utilities kiểu `text-center`, `text-uppercase`
- variant `btn-outline-dark`

Điểm này rất đáng nói vì nó cho thấy repo ưu tiên custom layout classes `sl-*` thay vì utility-heavy markup.

## 5.12. Responsive Behavior

- `navbar-expand-lg` đặt breakpoint chính của navigation ở `992px`.
- `main.css` override `--bs-gutter-x` theo `--sl-page-gutter`, thay đổi từ mobile -> tablet -> desktop qua `tokens.css`.
- `shop.css` đặt `--bs-offcanvas-width: min(26rem, 100vw)` để Offcanvas không vượt viewport.
- `home.css` chuyển carousel slide thành 2 cột từ `768px`.
- `home.css` chuyển product grid thành 3 cột từ `992px`.
- `shop.css` chuyển product grid từ 1 -> 2 -> 3 -> 4 cột qua custom grid, không dùng Bootstrap `row/col`.
- `forms.css` chuyển `.sl-form-row` sang 2 cột từ `768px`.
- Kết luận:
  - Bootstrap chịu trách nhiệm breakpoint semantics ở một số component.
  - Layout chi tiết responsive do custom CSS grid của project đảm nhiệm.

## 5.13. Accessibility Implications

- Header:
  - `aria-controls`, `aria-expanded`, `aria-label` trên navbar toggler.
- Carousel:
  - `visually-hidden` cho text của prev/next controls.
- Footer và Zalo widget:
  - `visually-hidden` cho label và button text chỉ dành cho screen reader.
- Shop Toast:
  - `role="status"`, `aria-live="polite"`, `aria-atomic="true"`.
- FAQ Accordion:
  - `aria-controls`, `aria-labelledby`, `data-bs-parent`.
- Checkout:
  - `aria-describedby`
  - `aria-invalid`
  - `aria-errormessage`
  - focus chuyển tới field invalid đầu tiên
- Nhận định:
  - Bootstrap giúp repo có sẵn nhiều pattern semantic đúng chuẩn.
  - Custom JS của project tiếp tục nâng accessibility lên mức “đủ để demo như sản phẩm thật”.

# 6. Demo walkthrough thực chiến

Nên demo theo đúng hành trình người dùng thay vì theo danh sách component.

## Bước 1. Mở `index.html`

- Nói gì: “Em bắt đầu từ trang chủ để cho thấy Bootstrap được dùng ở shared shell trước, rồi mới tới component tương tác.”
- Chỉ vào:
  - header shared
  - navbar responsive
  - button system
- Nếu bị hỏi vì sao chưa nói Carousel ngay:
  - trả lời: “Em muốn chốt lớp nền trước: shared shell, container, navbar, button variants.”

## Bước 2. Thu nhỏ viewport hoặc bật device toolbar

- Thao tác:
  - bấm navbar toggler
  - bấm ra ngoài
  - bấm `Escape`
- Nói gì: “Phần này dùng Bootstrap Collapse cho engine co giãn, nhưng project bọc thêm logic đóng menu khi click ngoài và khi nhấn Escape.”
- Nếu bị hỏi vì sao cần Collapse:
  - trả lời: “Vì menu điều hướng cần co lại ở mobile, giữ layout gọn và vẫn có sẵn accessibility state như `aria-expanded`.”

## Bước 3. Kéo xuống cụm featured cards ở Home

- Thao tác:
  - hover từng card
  - mở link vào sản phẩm hoặc chỉ giải thích skeleton card
- Nói gì: “Card ở đây dùng Bootstrap `card/card-body`, nhưng toàn bộ visual đã bị custom mạnh.”
- Nếu bị hỏi vì sao không viết div thường:
  - trả lời: “Dùng `card` giúp giữ convention rõ ràng cho phần media/body/footer và dễ tái sử dụng sang Shop với quick add.”

## Bước 4. Kéo xuống Carousel

- Thao tác:
  - bấm indicator
  - bấm next/prev
- Nói gì: “Đây là Bootstrap Carousel thật. Em giữ đúng markup chuẩn nhưng tắt autoplay để hợp tone luxury minimalism.”
- Nếu bị hỏi vì sao dùng component này:
  - trả lời: “Vì trang chủ cần một điểm chuyển cảnh có điều hướng rõ bằng indicator và control, nhưng vẫn phải cho người dùng chủ động điều khiển.”

## Bước 5. Mở `cua-hang.html`

- Thao tác:
  - chỉ vào `form-select`
  - bấm nút mở bộ lọc
- Nói gì: “Ở trang Shop, Bootstrap nổi bật nhất là form controls và Offcanvas.”
- Nếu bị hỏi vì sao Offcanvas phù hợp:
  - trả lời: “Filter là contextual UI. Trên mobile, Offcanvas tiết kiệm ngang tốt hơn sidebar cố định và vẫn giữ focus/context trong cùng trang.”

## Bước 6. Trong Shop, mở và đóng Offcanvas

- Thao tác:
  - mở filter panel
  - đổi nhóm hương
  - bấm áp dụng
- Nói gì: “Markup là Offcanvas chuẩn Bootstrap, nhưng việc mở/đóng đang được gọi thủ công bằng JS API thay vì data trigger mặc định.”
- Nếu bị hỏi vì sao không dùng `data-bs-toggle="offcanvas"`:
  - trả lời: “Vì project đang tách rõ event app và Bootstrap API. Cách này giúp control thống nhất hơn với state filter của riêng ứng dụng.”

## Bước 7. Quick add một sản phẩm từ Shop

- Thao tác:
  - bấm `Thêm vào giỏ`
  - chờ Toast hiện
- Nói gì: “Quick add là logic custom của giỏ hàng. Bootstrap Toast chỉ chịu trách nhiệm feedback layer.”
- Nếu bị hỏi vì sao dùng Toast:
  - trả lời: “Vì người dùng cần phản hồi ngay mà không bị chuyển trang hay phá dòng duyệt sản phẩm.”

## Bước 8. Mở một trang chi tiết sản phẩm

- Thao tác:
  - vào `chi-tiet-san-pham.html?...`
  - đổi dung tích
  - thêm vào giỏ
- Nói gì: “Trang này chủ yếu tái dùng button system của Bootstrap. Quantity stepper và size selector là custom, không phải component Bootstrap.”
- Nếu bị hỏi “sao nhìn giống input group”:
  - trả lời: “Nhìn có thể giống, nhưng source không dùng `input-group`; đây là custom CSS Grid của project.”

## Bước 9. Mở `gio-hang.html`

- Thao tác:
  - tăng giảm số lượng
  - chỉ vào `btn-link` cho ‘Xem lại sản phẩm’ và ‘Xóa khỏi giỏ’
- Nói gì: “Cart không có component Bootstrap lớn, nhưng vẫn dùng shared button vocabulary để giữ nhất quán với toàn site.”

## Bước 10. Mở `thanh-toan.html`

- Thao tác:
  - bấm submit khi form còn thiếu
  - cho hiện validation
  - tick checkbox điều khoản
- Nói gì: “Checkout là nơi dùng Bootstrap form pattern chuẩn nhất: `needs-validation`, `was-validated`, `invalid-feedback`.”
- Nếu bị hỏi vì sao vẫn dùng class Bootstrap dù custom mạnh:
  - trả lời: “Vì Bootstrap cung cấp convention ổn định cho validation state, còn project chỉ thay phần visual và business validation.”

## Bước 11. Mở `cau-hoi-thuong-gap.html`

- Thao tác:
  - mở một FAQ item
  - mở item khác trong cùng nhóm
- Nói gì: “Đây là Accordion/Collapse. Một mục mở thì mục kia đóng nhờ `data-bs-parent`.”
- Nếu bị hỏi vì sao không dùng `details/summary`:
  - trả lời: “Accordion Bootstrap cho nhóm item thống nhất hơn, có behavior rõ và dễ theme đồng bộ với hệ component còn lại.”

## Bước 12. Kéo xuống footer trên bất kỳ trang nào

- Thao tác:
  - nhập email sai
  - nhập email đúng
- Nói gì: “Footer tái dùng `form-control`, `btn`, `visually-hidden`, nhưng validation ở đây là custom nhẹ, không phải full Bootstrap validation pattern như checkout.”

# 7. Câu hỏi phản biện + trả lời mẫu

## 7.1. Vì sao dùng Bootstrap nhưng giao diện không giống Bootstrap mặc định?

Vì project dùng Bootstrap như base system và behavior engine, còn diện mạo cuối được quyết định bởi design tokens `--sl-*` và lớp `bootstrap-overrides.css`. Nói ngắn gọn: Bootstrap giữ phần framework, design system giữ phần thương hiệu.

## 7.2. Vì sao không dùng Tailwind?

Codebase này phù hợp với Bootstrap vì cần một số component behavior sẵn như `Collapse`, `Carousel`, `Offcanvas`, `Toast`, đồng thời vẫn muốn giữ class semantics quen thuộc cho form, button và navbar trong một đồ án đa trang tĩnh. Tailwind mạnh về utility-first styling, nhưng ở repo này nhóm ưu tiên component conventions + JS behavior tích hợp sẵn.

## 7.3. Vì sao Offcanvas phù hợp hơn sidebar cố định ở Shop?

Vì filter là giao diện ngữ cảnh, không cần chiếm diện tích cố định ở mobile và tablet hẹp. Offcanvas giữ trải nghiệm gọn hơn, dễ đóng/mở, và không làm card sản phẩm bị bó chiều ngang.

## 7.4. Vì sao navbar cần Collapse?

Vì điều hướng chính phải co gọn khi viewport hẹp. `Collapse` giúp giữ cùng một markup navigation nhưng thay đổi cách hiển thị theo breakpoint, đồng thời bảo toàn state `aria-expanded` và animation show/hide có kiểm soát.

## 7.5. Vì sao form checkout vẫn dùng class Bootstrap dù đã custom mạnh?

Vì class Bootstrap cho form và validation mang lại convention ổn định, dễ bảo trì và dễ đối chiếu. Nhóm không custom lại cả ngôn ngữ form từ đầu; nhóm giữ nguyên protocol của Bootstrap rồi đè visual theo brand.

## 7.6. Bootstrap đang giúp project ở tầng nào: layout, behavior, accessibility, responsive hay tất cả?

Là tất cả, nhưng không đồng đều.

- Layout: chủ yếu ở `container` và một phần navbar shell.
- Behavior: mạnh nhất ở `Collapse`, `Carousel`, `Offcanvas`, `Toast`.
- Accessibility: mạnh ở navbar, carousel controls, accordion, validation.
- Responsive: mạnh ở `navbar-expand-lg`, gutter system và các component overlay.
- Visual: không phải tầng quyết định cuối, vì visual đã bị custom mạnh bởi design system.

## 7.7. Có dùng Bootstrap grid không?

Có dùng `container`, nhưng hầu như không dùng `row` / `col-*` trong runtime markup. Layout chi tiết của repo chủ yếu do custom CSS Grid/Flexbox đảm nhiệm.

## 7.8. Component Bootstrap nào dễ bị nhầm là có dùng nhưng thực ra không?

Các điểm dễ nhầm nhất là:

- quantity stepper ở product/cart: không phải `input-group`
- cart count: không phải `.badge`
- các trust card ở product/cart/checkout: không phải `.card`
- dropdown, modal, pagination: có theme sẵn trong CSS nhưng không có runtime usage

## 7.9. Vì sao chỉ import một số Bootstrap JS module thay vì bundle toàn bộ?

Vì đây là multi-page static site với Vite. Chỉ import module nào trang đó cần sẽ gọn hơn, rõ hơn, và thể hiện đúng mối quan hệ giữa page entry với component runtime.

# 8. Kết luận kiến trúc

Bootstrap trong repo này đóng vai trò là:

- lớp foundation CSS cho container, button, form, card, navbar, accordion, offcanvas, toast
- lớp behavior JS cho `Collapse`, `Carousel`, `Offcanvas`, `Toast`
- lớp semantic conventions giúp code có cấu trúc nhất quán giữa nhiều trang

Phần nào là “Bootstrap gốc” trong repo:

- dependency `bootstrap@5.3.8`
- CSS base import từ `bootstrap/dist/css/bootstrap.min.css`
- JS APIs `Collapse`, `Carousel`, `Offcanvas`, `Toast`
- class conventions như `navbar`, `card`, `form-control`, `accordion`, `btn`
- utilities thực dùng như `container`, `ms-auto`, `visually-hidden`, `border-0`

Phần nào là “custom design system”:

- toàn bộ token `--sl-*` trong `tokens.css`
- remap `--bs-*` trong `bootstrap-overrides.css`
- visual styling của header, carousel, offcanvas, toast, cards, forms, footer
- custom layout classes như `sl-stack`, `sl-link-row`, `sl-page-frame`, `sl-product-grid`
- custom business logic và UX wrappers quanh Bootstrap APIs

Điểm mạnh của chiến lược kết hợp này:

- nhanh hơn so với tự viết toàn bộ component từ đầu
- vẫn có responsive/accessibility semantics tốt từ Bootstrap
- giữ được visual identity riêng, không bị “mùi template”
- dễ mở rộng vì design tokens và Bootstrap conventions đều rõ ràng

Hạn chế hiện tại:

- grid system của Bootstrap không được tận dụng nhiều; repo tự quản nhiều layout custom
- có một số override chuẩn bị sẵn cho component chưa dùng, khiến người đọc source dễ hiểu nhầm nếu không giải thích rõ
- vì không dùng Sass source của Bootstrap, mọi tùy biến đi qua layer override CSS nên cần kỷ luật thứ tự import

Nếu mở rộng project trong tương lai, chiến lược nên giữ là:

1. tiếp tục dùng Bootstrap cho foundation và behavior, nhất là với component overlay hoặc interactive có semantics tốt
2. tiếp tục giữ `--sl-*` làm source of truth cho design system
3. chỉ thêm component Bootstrap mới khi thực sự có runtime usage, tránh để override đi trước quá xa
4. nếu sau này cần theme sâu hơn ở quy mô lớn, có thể cân nhắc chuyển từ import CSS dist sang pipeline Sass của Bootstrap, nhưng hiện tại chưa bắt buộc

Câu kết phù hợp để dùng khi bảo vệ:

> Trong project này, Bootstrap không phải lớp giao diện cuối cùng. Bootstrap là bộ khung kỹ thuật cho structure, responsive và interaction; còn Sillage mới là lớp thiết kế quyết định giao diện thương hiệu. Chính cách kết hợp đó làm cho website vừa thực dụng về engineering, vừa đủ premium về cảm nhận sản phẩm.
